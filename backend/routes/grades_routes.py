from flask import Blueprint, jsonify, request, make_response, Response
from functools import wraps
from utils.db import get_db_connection
import traceback
from datetime import datetime
import time
import psycopg2.extras
import csv
import io

# Sistema de caché simple para reducir consultas repetidas
grades_cache = {}
CACHE_EXPIRY = 60  # Tiempo de expiración del caché en segundos

# Definir el decorador CORS localmente
def cors_decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', '*')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response
        
        resp = f(*args, **kwargs)
        
        # Si la respuesta es una tupla (jsonify(...), status_code), convertirla a una respuesta Flask
        if isinstance(resp, tuple):
            response = make_response(resp[0], resp[1])
        else:
            response = make_response(resp)
            
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response
    return decorated_function

grades_bp = Blueprint('grades', __name__, url_prefix='/api')

@grades_bp.route('/calificaciones/grupo/<int:group_id>', methods=['GET', 'OPTIONS'])
@cors_decorator
def get_grades_by_group(group_id):
    """Endpoint para obtener las calificaciones de los estudiantes de un grupo"""
    if request.method == 'OPTIONS':
        return make_response()
    
    try:
        print(f"Recibida solicitud para obtener calificaciones del grupo {group_id}")
        
        # Temporalmente desactivamos el caché para depurar
        cache_key = f"grades_{group_id}"
        if cache_key in grades_cache:
            print(f"Invalidando caché existente para grupo {group_id}")
            del grades_cache[cache_key]
        
        # Si no hay datos en caché o han expirado, consultar la base de datos
        print(f"Ejecutando consulta SQL para el grupo {group_id}")
        
        with get_db_connection() as conn:
            # Usar un cursor que devuelva diccionarios desde el principio
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                # Primero, verificar si hay registros en la tabla history para este grupo
                cur.execute("""
                    SELECT student_id, status FROM history WHERE group_id = %s AND status = 'activo'
                """, (group_id,))
                
                history_records = cur.fetchall()
                print(f"Registros en history para el grupo {group_id}: {history_records}")
                
                if not history_records:
                    print(f"No se encontraron estudiantes activos en el grupo {group_id}")
                    return jsonify({
                        'message': 'No se encontraron estudiantes en este grupo',
                        'grades': [],
                        'group_id': group_id
                    }), 200
                
                # Obtener todos los estudiantes del grupo usando la tabla history
                cur.execute("""
                    SELECT s.id, s.name || ' ' || s.lastname_f || ' ' || s.lastname_m as full_name, 
                           h.group_id, g.grade as group_grade, c.name as class_name
                    FROM student s
                    JOIN history h ON s.id = h.student_id
                    JOIN "group" g ON h.group_id = g.id
                    JOIN class c ON g.class_id = c.id
                    WHERE h.group_id = %s AND h.status = 'activo'
                """, (group_id,))
                
                students = cur.fetchall()
                print(f"Consulta SQL ejecutada correctamente")
                print(f"Se encontraron {len(students)} estudiantes")
                
                # Buscar registros de calificaciones para todos los estudiantes del grupo
                student_ids = [student['id'] for student in students]
                grades_records = {}
                
                if student_ids:
                    placeholders = ', '.join(['%s'] * len(student_ids))
                    # Obtener el periodo del query string (por defecto 1)
                    period = request.args.get('period', '1')
                    try:
                        period = int(period)
                    except ValueError:
                        period = 1
                    
                    print(f"Obteniendo calificaciones para el periodo {period}")
                    
                    query = f"""
                        SELECT id, student_id, grade_id, class_participation, exercises, 
                               homework, exams, church_class, finall, period
                        FROM notes 
                        WHERE student_id IN ({placeholders}) AND grade_id = %s AND period = %s
                    """
                    
                    params = student_ids + [group_id, period]
                    print(f"Ejecutando consulta de calificaciones: {query} con parámetros {params}")
                    
                    try:
                        cur.execute(query, params)
                        for record in cur.fetchall():
                            student_id = record['student_id']
                            grades_records[student_id] = {
                                'id': record['id'],
                                'class_participation': record['class_participation'],
                                'exercises': record['exercises'],
                                'homework': record['homework'],
                                'exams': record['exams'],
                                'church_class': record['church_class'],
                                'finall': record['finall'],
                                'period': record['period']
                            }
                        
                        print(f"Registros de calificaciones encontrados: {len(grades_records)}")
                    except Exception as e:
                        print(f"Error al obtener registros de calificaciones: {e}")
                
                # Preparar la respuesta
                grades_list = []
                
                for student in students:
                    student_id = student['id']
                    student_name = student['full_name']
                    student_group_id = student['group_id']
                    group_grade = student['group_grade']
                    class_name = student['class_name']
                    
                    # Verificar si hay un registro de calificaciones para este estudiante
                    grade_record = grades_records.get(student_id, {})
                    grade_id = grade_record.get('id', 0)
                    
                    # Agregar a la lista de calificaciones
                    grades_list.append({
                        'id': grade_id,
                        'student_id': student_id,
                        'student_name': student_name,
                        'group_id': student_group_id,
                        'class_participation': grade_record.get('class_participation', 0),
                        'exercises': grade_record.get('exercises', 0),
                        'homework': grade_record.get('homework', 0),
                        'exams': grade_record.get('exams', 0),
                        'church_class': grade_record.get('church_class', 0),
                        'finall': grade_record.get('finall', 0),
                        'period': grade_record.get('period', period)
                    })
                
                response_data = {
                    'message': 'Calificaciones obtenidas correctamente',
                    'grades': grades_list,
                    'group_id': group_id,
                    'period': period
                }
                
                # Guardar en caché
                grades_cache[cache_key] = {
                    'data': response_data,
                    'timestamp': time.time()
                }
                
                print(f"Enviando respuesta con {len(grades_list)} estudiantes")
                
                return jsonify(response_data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": "Error al obtener calificaciones", "error": str(e)}), 500

@grades_bp.route('/calificaciones/guardar', methods=['POST', 'OPTIONS'])
@cors_decorator
def save_grades():
    """Endpoint para guardar las calificaciones de los estudiantes"""
    if request.method == 'OPTIONS':
        return make_response()
        
    try:
        data = request.get_json()
        grades_records = data.get('grades', [])
        
        print(f"Recibidos {len(grades_records)} registros de calificaciones para guardar")
        
        # Obtener el group_id y period del request
        group_id = data.get('group_id')
        period = data.get('period', 1)
        
        if not group_id and grades_records and len(grades_records) > 0:
            group_id = grades_records[0].get('group_id')
            
        try:
            period = int(period)
        except (ValueError, TypeError):
            period = 1
            
        print(f"Periodo: {period}")
        
        print(f"Grupo ID: {group_id}")
        
        if not group_id:
            return jsonify({
                "message": "Error: No se proporcionó un ID de grupo válido",
                "success": False
            }), 400
        
        # Usar un cursor que devuelva diccionarios
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                try:
                    # Primero, obtener los IDs de estudiantes del grupo usando la tabla history
                    cur.execute("""
                        SELECT student_id FROM history WHERE group_id = %s AND status = 'activo'
                    """, (group_id,))
                    
                    student_ids = [row['student_id'] for row in cur.fetchall()]
                    print(f"Estudiantes en el grupo {group_id}: {student_ids}")
                    
                    if student_ids:
                        # Procesar cada registro de calificaciones
                        for record in grades_records:
                            student_id = record.get('student_id')
                            
                            if not student_id or student_id not in student_ids:
                                print(f"Saltando estudiante inválido: {student_id}")
                                continue
                            
                            try:
                                # Convertir tipos de datos
                                student_id_int = int(student_id)
                                group_id_int = int(group_id)
                                
                                # Verificar si ya existe un registro para este estudiante, grupo y periodo
                                cur.execute("""
                                    SELECT id FROM notes 
                                    WHERE student_id = %s AND grade_id = %s AND period = %s
                                """, (student_id_int, group_id_int, period))
                                
                                existing_record = cur.fetchone()
                                
                                # Preparar los datos para la inserción o actualización
                                class_participation = record.get('class_participation', 0)
                                exercises = record.get('exercises', 0)
                                homework = record.get('homework', 0)
                                exams = record.get('exams', 0)
                                church_class = record.get('church_class', 0)
                                
                                # Calcular la calificación final según las ponderaciones
                                finall = (
                                    class_participation * 0.15 +  # 15%
                                    exercises * 0.15 +            # 15%
                                    homework * 0.25 +             # 25%
                                    exams * 0.35 +                # 35%
                                    church_class * 0.10           # 10%
                                )
                                
                                if existing_record:
                                    # Actualizar registro existente
                                    update_query = """
                                        UPDATE notes 
                                        SET class_participation = %s, exercises = %s, 
                                            homework = %s, exams = %s, church_class = %s,
                                            finall = %s, period = %s
                                        WHERE id = %s
                                        RETURNING id
                                    """
                                    
                                    cur.execute(update_query, (
                                        class_participation, exercises, homework, exams, 
                                        church_class, finall, period, existing_record['id']
                                    ))
                                    updated_id = cur.fetchone()[0]
                                    print(f"Actualizado registro con ID {updated_id}")
                                else:
                                    # Insertar nuevo registro
                                    insert_query = """
                                        INSERT INTO notes 
                                        (student_id, grade_id, class_participation, exercises, 
                                         homework, exams, church_class, finall, period)
                                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                                        RETURNING id
                                    """
                                    
                                    cur.execute(insert_query, (
                                        student_id_int, group_id_int, class_participation, 
                                        exercises, homework, exams, church_class, finall, period
                                    ))
                                    new_id = cur.fetchone()[0]
                                    print(f"Creado registro con ID {new_id}")
                                
                                # Commit después de cada operación
                                conn.commit()
                            except Exception as e:
                                print(f"Error al procesar registro para estudiante {student_id}: {e}")
                                # Continuar con el siguiente estudiante
                    else:
                        print("No se encontraron estudiantes en el grupo")
                        
                except Exception as e:
                    print(f"Error al procesar registros de calificaciones: {e}")
                    return jsonify({
                        "message": f"Error al procesar registros de calificaciones: {e}",
                        "success": False
                    }), 500
                
                # Invalidar el caché para este grupo y periodo
                cache_key = f"grades_{group_id}_{period}"
                if cache_key in grades_cache:
                    print(f"Invalidando caché para grupo {group_id} y periodo {period}")
                    del grades_cache[cache_key]
                
                return jsonify({
                    "message": "Calificaciones guardadas correctamente",
                    "success": True
                }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "message": "Error al guardar calificaciones", 
            "error": str(e),
            "success": False
        }), 500

@grades_bp.route('/calificaciones/reporte/<int:group_id>', methods=['GET', 'OPTIONS'])
@cors_decorator
def generate_grades_report(group_id):
    """Endpoint para generar un reporte CSV de calificaciones"""
    if request.method == 'OPTIONS':
        return make_response()
    
    try:
        # Obtener el periodo del query string (por defecto 1)
        period = request.args.get('period', '1')
        try:
            period = int(period)
        except ValueError:
            period = 1
            
        print(f"Generando reporte de calificaciones para el grupo {group_id} y periodo {period}")
        
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                # Obtener todos los estudiantes del grupo usando la tabla history
                cur.execute("""
                    SELECT s.id, s.name || ' ' || s.lastname_f || ' ' || s.lastname_m as full_name
                    FROM student s
                    JOIN history h ON s.id = h.student_id
                    WHERE h.group_id = %s AND h.status = 'activo'
                    ORDER BY full_name
                """, (group_id,))
                
                students = cur.fetchall()
                student_ids = [student['id'] for student in students]
                
                if not student_ids:
                    return jsonify({
                        "message": "No se encontraron estudiantes en este grupo",
                        "success": False
                    }), 404
                
                # Obtener información del grupo
                cur.execute("""
                    SELECT g.grade, c.name as class_name
                    FROM "group" g
                    JOIN class c ON g.class_id = c.id
                    WHERE g.id = %s
                """, (group_id,))
                
                group_info = cur.fetchone()
                if not group_info:
                    return jsonify({
                        "message": "No se encontró información del grupo",
                        "success": False
                    }), 404
                
                group_name = f"{group_info['grade']} - {group_info['class_name']}"
                
                # Obtener calificaciones para todos los estudiantes
                placeholders = ', '.join(['%s'] * len(student_ids))
                query = f"""
                    SELECT n.student_id, s.name || ' ' || s.lastname_f || ' ' || s.lastname_m as full_name,
                           n.class_participation, n.exercises, n.homework, n.exams, n.church_class, n.finall,
                           n.period
                    FROM notes n
                    JOIN student s ON n.student_id = s.id
                    WHERE n.student_id IN ({placeholders}) AND n.grade_id = %s AND n.period = %s
                    ORDER BY full_name
                """
                
                params = student_ids + [group_id, period]
                cur.execute(query, params)
                grades = cur.fetchall()
                
                # Crear un archivo CSV en memoria
                output = io.StringIO()
                writer = csv.writer(output)
                
                # Escribir encabezados
                periodo_texto = "Primer" if period == 1 else "Segundo" if period == 2 else "Tercer" if period == 3 else "Cuarto"
                writer.writerow([
                    'Grupo', 'Nombre del Estudiante', f'Participación en clase ({periodo_texto} Parcial) (15%)', 
                    f'Ejercicios y prácticas ({periodo_texto} Parcial) (15%)', f'Tareas o trabajos ({periodo_texto} Parcial) (25%)', 
                    f'Exámenes ({periodo_texto} Parcial) (35%)', f'Asistencia a misa ({periodo_texto} Parcial) (10%)', 
                    f'Calificación Final ({periodo_texto} Parcial)'
                ])
                
                # Crear un diccionario para acceder fácilmente a las calificaciones por student_id
                grades_dict = {grade['student_id']: grade for grade in grades}
                
                # Escribir datos para cada estudiante
                for student in students:
                    student_id = student['id']
                    student_name = student['full_name']
                    
                    # Obtener calificaciones del estudiante o usar valores por defecto
                    grade = grades_dict.get(student_id, {})
                    
                    writer.writerow([
                        group_name,
                        student_name,
                        grade.get('class_participation', 0),
                        grade.get('exercises', 0),
                        grade.get('homework', 0),
                        grade.get('exams', 0),
                        grade.get('church_class', 0),
                        grade.get('finall', 0)
                    ])
                
                # Preparar la respuesta
                output.seek(0)
                
                # Crear una respuesta con el archivo CSV
                periodo_texto = "Primer" if period == 1 else "Segundo" if period == 2 else "Tercer" if period == 3 else "Cuarto"
                response = Response(
                    output.getvalue(),
                    mimetype='text/csv',
                    headers={
                        'Content-Disposition': f'attachment; filename=Calificaciones_{periodo_texto}_Parcial_{group_name.replace(" ", "_")}.csv'
                    }
                )
                
                return response
                
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "message": "Error al generar reporte de calificaciones", 
            "error": str(e),
            "success": False
        }), 500
