from flask import Blueprint, jsonify, request, make_response, Response
from functools import wraps
from utils.db import get_db_connection
import traceback
from datetime import datetime, timedelta
import time
import psycopg2.extras
import csv
import io

# Sistema de caché simple para reducir consultas repetidas
attendance_cache = {}
CACHE_EXPIRY = 60  # Tiempo de expiración del caché en segundos

# Definir el decorador CORS localmente (igual que en student_routes.py)
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

attendance_bp = Blueprint('attendance', __name__, url_prefix='/api')

@attendance_bp.route('/asistencia/grupo/<int:group_id>', methods=['GET', 'OPTIONS'])
@cors_decorator
def get_attendance_by_group(group_id):
    """Endpoint para obtener la asistencia de los estudiantes de un grupo en una fecha específica"""
    if request.method == 'OPTIONS':
        return make_response()
    
    try:
        # Obtener la fecha de la consulta (si no se proporciona, usar la fecha actual)
        date = request.args.get('date', datetime.now().strftime('%Y-%m-%d'))
        print(f"Recibida solicitud para obtener asistencia del grupo {group_id}")
        print(f"Fecha de asistencia: {date}")
        
        # Temporalmente desactivamos el caché para depurar
        cache_key = f"{group_id}_{date}"
        if cache_key in attendance_cache:
            print(f"Invalidando caché existente para grupo {group_id} y fecha {date}")
            del attendance_cache[cache_key]
        
        # Si no hay datos en caché o han expirado, consultar la base de datos
        print(f"Ejecutando consulta SQL para el grupo {group_id} y fecha {date}")
        
        with get_db_connection() as conn:
            # Usar un cursor que devuelva diccionarios desde el principio
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                # Formatear la fecha para la consulta SQL
                try:
                    fecha_obj = datetime.strptime(date, '%Y-%m-%d')
                    fecha_formateada = fecha_obj.strftime('%Y-%m-%d')
                except Exception as e:
                    print(f"Error al formatear la fecha: {e}")
                    fecha_formateada = date
                
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
                        'attendance': [],
                        'date': date,
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
                
                # Buscar registros de asistencia para todos los estudiantes del grupo en la fecha especificada
                student_ids = [student['id'] for student in students]
                attendance_records = {}
                
                if student_ids:
                    placeholders = ', '.join(['%s'] * len(student_ids))
                    query = f"""
                        SELECT id, student_id, status 
                        FROM attendance 
                        WHERE student_id IN ({placeholders}) AND DATE(fecha) = %s::date AND grade_id = %s
                    """
                    
                    params = student_ids + [fecha_formateada, group_id]
                    print(f"Ejecutando consulta de asistencia: {query} con parámetros {params}")
                    
                    try:
                        cur.execute(query, params)
                        for record in cur.fetchall():
                            attendance_id = record['id']
                            student_id = record['student_id']
                            status = record['status']
                            attendance_records[student_id] = {'id': attendance_id, 'present': status}
                        
                        print(f"Registros de asistencia encontrados: {len(attendance_records)}")
                        print(f"Detalles de registros encontrados: {attendance_records}")
                    except Exception as e:
                        print(f"Error al obtener registros de asistencia: {e}")
                
                # Preparar la respuesta
                attendance_list = []
                
                for student in students:
                    student_id = student['id']
                    student_name = student['full_name']
                    student_group_id = student['group_id']
                    group_grade = student['group_grade']
                    class_name = student['class_name']
                    
                    # Verificar si hay un registro de asistencia para este estudiante
                    attendance_record = attendance_records.get(student_id, {})
                    attendance_id = attendance_record.get('id')
                    present = attendance_record.get('present')
                    
                    student_data = {
                        'student_id': student_id,
                        'student_name': student_name,
                        'group_id': student_group_id,
                        'group_grade': group_grade,
                        'class_name': class_name,
                        'attendance_id': attendance_id,
                        'present': present
                    }
                    
                    print(f"Procesando estudiante: {student_data}")
                    
                    # Agregar a la lista de asistencia
                    attendance_list.append({
                        'id': attendance_id or 0,  # Si no hay registro, usar 0
                        'student_id': student_id,
                        'student_name': student_name,
                        'date': date,
                        'present': present if present is not None else False,  # Si no hay registro, asumir ausente
                        'group_id': student_group_id
                    })
                
                response_data = {
                    'message': 'Asistencia obtenida correctamente',
                    'attendance': attendance_list,
                    'date': date,
                    'group_id': group_id
                }
                
                # Guardar en caché
                attendance_cache[cache_key] = {
                    'data': response_data,
                    'timestamp': time.time()
                }
                
                print(f"Enviando respuesta con {len(attendance_list)} estudiantes")
                print(f"Estructura de respuesta: {response_data}")
                
                return jsonify(response_data), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({"message": "Error al obtener asistencia", "error": str(e)}), 500

@attendance_bp.route('/asistencia/guardar', methods=['POST'])
@cors_decorator
def save_attendance():
    """Endpoint para guardar la asistencia de los estudiantes"""
    try:
        data = request.get_json()
        attendance_records = data.get('attendance', [])
        date = data.get('date', datetime.now().strftime('%Y-%m-%d'))
        
        print(f"Recibidos {len(attendance_records)} registros de asistencia para guardar en fecha {date}")
        print(f"Datos recibidos: {data}")
        
        # Obtener el group_id del primer registro para invalidar el caché
        group_id = data.get('group_id')
        if not group_id and attendance_records and len(attendance_records) > 0:
            group_id = attendance_records[0].get('group_id')
        
        print(f"Grupo ID: {group_id}, Fecha: {date}")
        
        if not group_id:
            return jsonify({
                "message": "Error: No se proporcionó un ID de grupo válido",
                "success": False
            }), 400
            
        # Formatear la fecha para la consulta SQL
        try:
            fecha_obj = datetime.strptime(date, '%Y-%m-%d')
            fecha_formateada = fecha_obj.strftime('%Y-%m-%d')
        except Exception as e:
            print(f"Error al formatear la fecha: {e}")
            return jsonify({
                "message": f"Error al formatear la fecha: {e}",
                "success": False
            }), 400
        
        # Usar un cursor que devuelva diccionarios
        with get_db_connection() as conn:
            with conn.cursor(cursor_factory=psycopg2.extras.DictCursor) as cur:
                # ENFOQUE RADICAL: Eliminar todos los registros existentes para este grupo y fecha
                # y luego insertar los nuevos registros
                try:
                    # Primero, obtener los IDs de estudiantes del grupo usando la tabla history
                    cur.execute("""
                        SELECT student_id FROM history WHERE group_id = %s AND status = 'activo'
                    """, (group_id,))
                    
                    student_ids = [row['student_id'] for row in cur.fetchall()]
                    print(f"Estudiantes en el grupo {group_id}: {student_ids}")
                    
                    if student_ids:
                        # Eliminar registros existentes para estos estudiantes en esta fecha y grupo
                        delete_query = """
                            DELETE FROM attendance 
                            WHERE student_id IN ({}) AND DATE(fecha) = %s::date AND grade_id = %s
                        """.format(','.join(['%s'] * len(student_ids)))
                        
                        delete_params = student_ids + [fecha_formateada, group_id]
                        print(f"Eliminando registros existentes: {delete_query} con parámetros {delete_params}")
                        
                        cur.execute(delete_query, delete_params)
                        deleted_count = cur.rowcount
                        print(f"Registros eliminados: {deleted_count}")
                        
                        # Commit para aplicar la eliminación
                        conn.commit()
                        
                        # Ahora insertar los nuevos registros
                        print(f"Insertando {len(attendance_records)} nuevos registros de asistencia")
                        
                        for record in attendance_records:
                            student_id = record.get('student_id')
                            present = record.get('present', False)
                            
                            if not student_id or student_id not in student_ids:
                                print(f"Saltando estudiante inválido: {student_id}")
                                continue
                            
                            try:
                                # Convertir tipos de datos
                                student_id_int = int(student_id)
                                group_id_int = int(group_id)
                                present_bool = bool(present)
                                
                                # Insertar nuevo registro
                                insert_query = """
                                    INSERT INTO attendance (student_id, grade_id, fecha, status)
                                    VALUES (%s, %s, %s, %s)
                                    RETURNING id
                                """
                                
                                print(f"Insertando registro para estudiante {student_id_int}, presente={present_bool}")
                                cur.execute(insert_query, (student_id_int, group_id_int, fecha_obj, present_bool))
                                new_id = cur.fetchone()[0]
                                print(f"Creado registro con ID {new_id}")
                                
                                # Commit después de cada inserción
                                conn.commit()
                            except Exception as e:
                                print(f"Error al insertar registro para estudiante {student_id}: {e}")
                                # Continuar con el siguiente estudiante
                    else:
                        print("No se encontraron estudiantes en el grupo")
                        
                except Exception as e:
                    print(f"Error al procesar registros de asistencia: {e}")
                    return jsonify({
                        "message": f"Error al procesar registros de asistencia: {e}",
                        "success": False
                    }), 500
                
                # Invalidar el caché para este grupo y fecha
                cache_key = f"{group_id}_{date}"
                if cache_key in attendance_cache:
                    print(f"Invalidando caché para grupo {group_id} y fecha {date}")
                    del attendance_cache[cache_key]
                
                return jsonify({
                    "message": "Asistencia guardada correctamente",
                    "success": True
                }), 200
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "message": "Error al guardar asistencia", 
            "error": str(e),
            "success": False
        }), 500

@attendance_bp.route('/asistencia/reporte/<int:group_id>', methods=['GET', 'OPTIONS'])
@cors_decorator
def generate_attendance_report(group_id):
    """Endpoint para generar un reporte CSV de asistencias de los últimos 30 días"""
    if request.method == 'OPTIONS':
        return make_response()
    
    try:
        # Obtener la fecha actual y calcular la fecha de hace 30 días
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        print(f"Generando reporte de asistencia para el grupo {group_id} desde {start_date.strftime('%Y-%m-%d')} hasta {end_date.strftime('%Y-%m-%d')}")
        
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
                
                # Obtener todas las fechas con registros de asistencia en el rango de 30 días
                placeholders = ', '.join(['%s'] * len(student_ids))
                cur.execute(f"""
                    SELECT DISTINCT DATE(fecha) as fecha
                    FROM attendance
                    WHERE student_id IN ({placeholders}) AND grade_id = %s
                    AND fecha BETWEEN %s AND %s
                    ORDER BY fecha DESC
                """, student_ids + [group_id, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')])
                
                dates = [row['fecha'] for row in cur.fetchall()]
                
                # Obtener el nombre del grupo
                cur.execute("""
                    SELECT g.grade, c.name as class_name
                    FROM "group" g
                    JOIN class c ON g.class_id = c.id
                    WHERE g.id = %s
                """, (group_id,))
                
                group_info = cur.fetchone()
                group_name = f"{group_info['grade']} - {group_info['class_name']}" if group_info else f"Grupo {group_id}"
                
                # Crear un buffer para el CSV
                output = io.StringIO()
                writer = csv.writer(output)
                
                # Escribir encabezados
                headers = ['Estudiante']
                for date in dates:
                    headers.append(date.strftime('%d/%m/%Y'))
                writer.writerow(headers)
                
                # Para cada estudiante, obtener su asistencia en cada fecha
                for student in students:
                    row = [student['full_name']]
                    
                    # Obtener todos los registros de asistencia para este estudiante en el rango de fechas
                    cur.execute(f"""
                        SELECT DATE(fecha) as fecha, status
                        FROM attendance
                        WHERE student_id = %s AND grade_id = %s
                        AND fecha BETWEEN %s AND %s
                    """, (student['id'], group_id, start_date.strftime('%Y-%m-%d'), end_date.strftime('%Y-%m-%d')))
                    
                    attendance_records = {row['fecha'].strftime('%Y-%m-%d'): row['status'] for row in cur.fetchall()}
                    
                    # Agregar el estado de asistencia para cada fecha
                    for date in dates:
                        date_str = date.strftime('%Y-%m-%d')
                        if date_str in attendance_records:
                            row.append('Presente' if attendance_records[date_str] else 'Ausente')
                        else:
                            row.append('N/A')
                    
                    writer.writerow(row)
                
                # Preparar la respuesta
                output.seek(0)
                
                # Crear un nombre de archivo descriptivo
                filename = f"Asistencia_{group_name}_{start_date.strftime('%Y%m%d')}_a_{end_date.strftime('%Y%m%d')}.csv"
                filename = filename.replace(' ', '_')
                
                response = Response(
                    output.getvalue(),
                    mimetype="text/csv",
                    headers={
                        "Content-Disposition": f"attachment; filename={filename}"
                    }
                )
                
                return response
    except Exception as e:
        traceback.print_exc()
        return jsonify({
            "message": "Error al generar reporte de asistencia", 
            "error": str(e),
            "success": False
        }), 500
