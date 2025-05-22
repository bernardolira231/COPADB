from flask import Blueprint, request, jsonify, make_response, Response
import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import Config
from functools import wraps
import datetime
import json

student_bp = Blueprint('student', __name__, url_prefix='/api')

def get_db_connection():
    return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)

def cors_decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            return response, 204
        
        # Ejecutar la función original para métodos no-OPTIONS
        result = f(*args, **kwargs)
        
        # Si el resultado es una tupla (response, status_code)
        if isinstance(result, tuple):
            response, status_code = result
            if isinstance(response, dict):
                response = jsonify(response)
        else:
            # Si solo es una respuesta
            response = result if not isinstance(result, dict) else jsonify(result)
            status_code = 200
            
        # Agregar headers CORS a la respuesta
        if hasattr(response, 'headers'):
            response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3001')
            response.headers.add('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            response.headers.add('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept')
            response.headers.add('Access-Control-Allow-Credentials', 'true')
            
        return response, status_code if isinstance(result, tuple) else status_code
    
    return decorated_function

@student_bp.route('/inscripciones', methods=['POST', 'OPTIONS'])
@cors_decorator
def registrar_estudiante():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 204
        
    try:
        data = request.get_json()

        conn = get_db_connection()
        cur = conn.cursor()

        # Verificar si se está utilizando un tutor existente
        family_id = None
        if data.get("usarTutorExistente") and data.get("tutorExistenteId"):
            family_id = data["tutorExistenteId"]
        else:
            # Crear un nuevo registro de familia
            cur.execute("""
                INSERT INTO family (
                    tutor_name, tutor_lastname_F, tutor_lastname_M,
                    phone_number, email_address, emergency_phone_number
                ) VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id;
            """, (
                data["tutorNombre"],
                data["tutorApellidoPaterno"],
                data["tutorApellidoMaterno"],
                data["telefono"],
                data["emailTutor"],
                data["telefonoEmergencia"]
            ))

            family_result = cur.fetchone()

            if family_result is None:
                raise ValueError("No se pudo obtener el family_id después de insertar en family.")
            
            family_id = family_result["id"]
        cur.execute("""
            INSERT INTO student (
                name, lastname_F, lastname_M, email, blood_type,
                allergies, scholar_ship, chapel, school_campus,
                family_id, permission, reg_date, birth_date, curp, sep_register, cpdb_register, gender
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            data["nombre"],
            data["apellidoPaterno"],
            data["apellidoMaterno"],
            data["email"],
            data["tipoSangre"],
            data["alergias"],
            True if data["beca"] else False,
            data["capilla"],
            data["campusEscolar"],
            family_id,
            data["permiso"],
            data["fechaRegistro"],
            data.get("birth_date",),  # Obtener la fecha de nacimiento
            data.get("curp",),
            data.get("sep_register",),
            data.get("cpdb_register",),
            data.get("genero",)
        ))

        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "Estudiante registrado exitosamente"}), 201

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al registrar estudiante", "error": str(e)}), 500

@student_bp.route('/estudiantes', methods=['GET', 'OPTIONS'])
@cors_decorator
def get_estudiantes():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 204
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Obtener parámetros de consulta para filtrado y paginación
        page = request.args.get('page', default=1, type=int)
        per_page = request.args.get('per_page', default=10, type=int)
        search = request.args.get('search', default='', type=str)
        
        # Calcular offset para paginación
        offset = (page - 1) * per_page
        
        # Construir la consulta base
        query = """
            SELECT 
                s.id, s.name, s.lastname_f, s.lastname_m, s.email, 
                s.blood_type, s.allergies, s.scholar_ship, s.chapel, 
                s.school_campus, s.family_id, s.permission, 
                s.reg_date, s.birth_date, s.curp, s.sep_register, s.cpdb_register, s.gender
            FROM public.student s
        """
        
        params = []
        
        # Añadir filtro de búsqueda si se proporciona
        if search:
            query += """
                WHERE 
                    name ILIKE %s OR 
                    lastname_f ILIKE %s OR 
                    lastname_m ILIKE %s OR 
                    email ILIKE %s
            """
            search_param = f'%{search}%'
            params.extend([search_param, search_param, search_param, search_param])
        
        # Añadir ordenamiento y paginación
        query += """
            ORDER BY id
            LIMIT %s OFFSET %s
        """
        params.extend([per_page, offset])
        
        # Ejecutar la consulta principal
        cur.execute(query, params)
        estudiantes = cur.fetchall()
        
        # Obtener la información de grupos para cada estudiante
        student_ids = [e['id'] for e in estudiantes]
        
        if student_ids:
            # Consulta para obtener la información de grupos
            groups_query = """
                SELECT 
                    h.student_id, 
                    h.group_id, 
                    g.grade, 
                    c.name as class_name,
                    g.id as original_group_id
                FROM history h
                JOIN "group" g ON h.group_id = g.id
                LEFT JOIN class c ON g.class_id = c.id
                WHERE h.student_id = ANY(%s) AND h.status = 'activo'
                ORDER BY h.student_id, 
                    CASE WHEN g.grade LIKE '%%primaria%%' THEN 0 ELSE 1 END,
                    g.grade DESC
            """
            
            cur.execute(groups_query, (student_ids,))
            groups_data = cur.fetchall()
            
            # Crear un diccionario para almacenar la información de grupos por estudiante
            student_groups = {}
            student_all_groups = {}
            
            # Primero, recopilamos todos los grupos para cada estudiante
            for group in groups_data:
                student_id = group['student_id']
                if student_id not in student_all_groups:
                    student_all_groups[student_id] = []
                student_all_groups[student_id].append(group)
                
                # También guardamos el grupo principal (el primero según el orden)
                if student_id not in student_groups:
                    student_groups[student_id] = group
            
            # Asignar la información de grupos a cada estudiante
            for estudiante in estudiantes:
                student_id = estudiante['id']
                if student_id in student_groups:
                    # Asignamos el grupo principal
                    estudiante['group_id'] = student_groups[student_id]['group_id']
                    estudiante['group_grade'] = student_groups[student_id]['grade']
                    estudiante['class_name'] = student_groups[student_id]['class_name']
                    
                    # Asignamos todos los grupos
                    estudiante['all_groups'] = [
                        {
                            'group_id': g['group_id'],
                            'grade': g['grade'],
                            'class_name': g['class_name'],
                            'display_name': f"{g['grade']} - {g['class_name']}" if g['class_name'] else g['grade']
                        } for g in student_all_groups[student_id]
                    ]
                    
                    print(f"Estudiante {student_id} tiene asignado el grupo principal {estudiante['group_grade']}")
                    print(f"Estudiante {student_id} tiene {len(estudiante['all_groups'])} grupos asignados en total")
                else:
                    estudiante['all_groups'] = []
                    print(f"Estudiante {student_id} no tiene grupo asignado")
        
        # Obtener el conteo total para la paginación
        count_query = "SELECT COUNT(*) FROM public.student"
        if search:
            count_query += """
                WHERE 
                    name ILIKE %s OR 
                    lastname_f ILIKE %s OR 
                    lastname_m ILIKE %s OR 
                    email ILIKE %s
            """
            cur.execute(count_query, [search_param, search_param, search_param, search_param])
        else:
            cur.execute(count_query)
            
        total_count = cur.fetchone()['count']
        
        cur.close()
        conn.close()
        
        # Preparar la respuesta con metadatos de paginación
        response = {
            "estudiantes": estudiantes,
            "pagination": {
                "total": total_count,
                "page": page,
                "per_page": per_page,
                "total_pages": (total_count + per_page - 1) // per_page
            }
        }
        
        return jsonify(response), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener estudiantes", "error": str(e)}), 500

@student_bp.route('/estudiantes/<int:id>', methods=['DELETE', 'OPTIONS'])
@cors_decorator
def delete_estudiante(id):
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 204
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el estudiante existe
        cur.execute("SELECT id FROM student WHERE id = %s", (id,))
        estudiante = cur.fetchone()
        
        if not estudiante:
            cur.close()
            conn.close()
            return jsonify({"message": f"Estudiante con ID {id} no encontrado"}), 404
        
        # Eliminar el estudiante
        cur.execute("DELETE FROM student WHERE id = %s", (id,))
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify({"message": f"Estudiante con ID {id} eliminado correctamente"}), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al eliminar estudiante", "error": str(e)}), 500

@student_bp.route('/estudiantes/<int:id>', methods=['PUT', 'OPTIONS'])
@cors_decorator
def update_estudiante(id):
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 204
        
    try:
        data = request.get_json()
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el estudiante existe
        cur.execute("SELECT id FROM student WHERE id = %s", (id,))
        estudiante = cur.fetchone()
        
        if not estudiante:
            cur.close()
            conn.close()
            return jsonify({"message": f"Estudiante con ID {id} no encontrado"}), 404
        
        # Actualizar el estudiante
        cur.execute("""
            UPDATE student SET
                name = %s,
                lastname_f = %s,
                lastname_m = %s,
                email = %s,
                blood_type = %s,
                allergies = %s,
                scholar_ship = %s,
                chapel = %s,
                school_campus = %s,
                permission = %s,
                reg_date = %s,
                birth_date = %s
                curp = %s,
                sep_register = %s,
                cpdb_register = %s
                gender = %s
            WHERE id = %s
        """, (
            data.get("name"),
            data.get("lastname_f"),
            data.get("lastname_m"),
            data.get("email"),
            data.get("blood_type"),
            data.get("allergies"),
            data.get("scholar_ship"),
            data.get("chapel"),
            data.get("school_campus"),
            data.get("permission"),
            data.get("reg_date"),
            data.get("birth_date"),
            data.get("curp"),
            data.get("sep_register"),
            data.get("cpdb_register"),
            data.get("gender"),
            id
        ))
        
        conn.commit()
        
        # Obtener el estudiante actualizado
        cur.execute("""
            SELECT * FROM student WHERE id = %s
        """, (id,))
        
        updated_student = cur.fetchone()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": f"Estudiante con ID {id} actualizado correctamente",
            "estudiante": dict(updated_student)
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al actualizar estudiante", "error": str(e)}), 500

@student_bp.route('/estudiantes/por-grupo/<int:group_id>', methods=['GET'])
@cors_decorator
def get_estudiantes_por_grupo(group_id):
    """Endpoint para obtener todos los estudiantes asignados a un grupo específico"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el grupo existe
        cur.execute("SELECT id FROM \"group\" WHERE id = %s", (group_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": f"Grupo con ID {group_id} no encontrado"}), 404
        
        # Obtener todos los estudiantes activos en este grupo
        cur.execute("""
            SELECT 
                s.id, s.name, s.lastname_f, s.lastname_m, s.email, 
                s.blood_type, s.allergies, s.scholar_ship, s.chapel, 
                s.school_campus, s.family_id, s.permission, 
                s.reg_date,
                h.group_id,
                g.grade as group_grade,
                c.name as class_name
            FROM public.student s
            JOIN history h ON s.id = h.student_id
            JOIN \"group\" g ON h.group_id = g.id
            LEFT JOIN class c ON g.class_id = c.id
            WHERE h.group_id = %s AND h.status = 'activo'
            ORDER BY s.lastname_f, s.lastname_m, s.name
        """, (group_id,))
        
        estudiantes = [dict(row) for row in cur.fetchall()]
        
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Estudiantes obtenidos correctamente",
            "estudiantes": estudiantes,
            "total": len(estudiantes)
        }), 200
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener estudiantes", "error": str(e)}), 500

@student_bp.route('/tutores', methods=['GET', 'OPTIONS'])
@cors_decorator
def get_tutores():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight OK"}), 204
        
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Obtener parámetros de consulta para filtrado
        search = request.args.get('search', default='', type=str)
        
        # Construir la consulta base
        query = """
            SELECT 
                f.id, f.tutor_name, f.tutor_lastname_f, f.tutor_lastname_m,
                f.phone_number, f.email_address, f.emergency_phone_number
            FROM public.family f
        """
        
        params = []
        
        # Añadir filtro de búsqueda si se proporciona
        if search:
            query += """
                WHERE 
                    tutor_name ILIKE %s OR 
                    tutor_lastname_f ILIKE %s OR 
                    tutor_lastname_m ILIKE %s OR 
                    email_address ILIKE %s
            """
            search_param = f'%{search}%'
            params.extend([search_param, search_param, search_param, search_param])
            # Ordenar por relevancia cuando hay búsqueda
            query += """
                ORDER BY 
                    CASE WHEN tutor_lastname_f ILIKE %s THEN 0 ELSE 1 END,
                    tutor_lastname_f, tutor_lastname_m, tutor_name
                LIMIT 20
            """
            params.append(search_param)
        else:
            # Si no hay búsqueda, mostrar los tutores más recientes
            # Asumimos que los IDs más altos son los más recientes
            query += """
                ORDER BY id DESC
                LIMIT 20
            """
        
        # Ejecutar la consulta
        cur.execute(query, params)
        tutores = cur.fetchall()
        
        # Cerrar conexión
        cur.close()
        conn.close()
        
        return jsonify({
            "tutores": tutores
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener tutores", "error": str(e)}), 500

@student_bp.route('/estudiantes/<int:estudiante_id>/asignar-grupo', methods=['POST'])
@cors_decorator
def asignar_grupo(estudiante_id):
    """Endpoint para asignar un estudiante a uno o múltiples grupos"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        # Si todos los parámetros están vacíos o ausentes, asumimos que se quiere desasignar al estudiante
        is_unassign = False
        
        if 'group_ids' not in data and 'group_id' not in data and 'grade' not in data:
            # Desasignar al estudiante de todos los grupos
            is_unassign = True
        elif 'group_ids' in data and (not data['group_ids'] or data['group_ids'] == []):
            # Array vacío de group_ids significa desasignar
            is_unassign = True
        elif 'group_id' in data and (not data['group_id'] or data['group_id'] == ""):
            # group_id vacío significa desasignar
            is_unassign = True
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el estudiante existe
        cur.execute("SELECT id FROM student WHERE id = %s", (estudiante_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Estudiante no encontrado"}), 404
        
        # Si se proporciona un grado, obtener todos los grupos de ese grado
        if 'grade' in data:
            grade = data['grade']
            cur.execute(
                "SELECT id FROM \"group\" WHERE grade = %s",
                (grade,)
            )
            grade_groups = cur.fetchall()
            
            if not grade_groups:
                cur.close()
                conn.close()
                return jsonify({"message": f"No se encontraron grupos para el grado {grade}"}), 404
            
            # Usar todos los grupos del grado
            group_ids = [group['id'] for group in grade_groups]
            print(f"Asignando estudiante {estudiante_id} a todos los grupos del grado {grade}: {group_ids}")
        else:
            # Compatibilidad con la versión anterior que usaba group_id
            if 'group_id' in data and 'group_ids' not in data:
                group_ids = [data['group_id']]
            else:
                group_ids = data['group_ids']
            
            # Convertir a lista de enteros
            if not isinstance(group_ids, list):
                group_ids = [group_ids]
                
            group_ids = [int(gid) if isinstance(gid, str) else gid for gid in group_ids]
            
            # Verificar si todos los grupos existen
            for group_id in group_ids:
                cur.execute("SELECT id FROM \"group\" WHERE id = %s", (group_id,))
                if not cur.fetchone():
                    cur.close()
                    conn.close()
                    return jsonify({"message": f"Grupo con ID {group_id} no encontrado"}), 404
        
        # Si es una desasignación, desactivamos todas las asignaciones activas
        if is_unassign:
            print(f"Desasignando al estudiante {estudiante_id} de todos los grupos")
            cur.execute(
                """UPDATE history 
                SET status = 'inactivo' 
                WHERE student_id = %s AND status = 'activo'""", 
                (estudiante_id,)
            )
            
            # También actualizamos el campo group_id en la tabla student
            cur.execute(
                "UPDATE student SET group_id = NULL WHERE id = %s", 
                (estudiante_id,)
            )
            
            conn.commit()
            cur.close()
            conn.close()
            
            return jsonify({
                "message": f"Estudiante con ID {estudiante_id} desasignado de todos los grupos",
                "estudiante_id": estudiante_id
            }), 200
        
        # Si no es una desasignación, continuamos con la lógica normal
        # Obtener las asignaciones activas actuales
        cur.execute(
            "SELECT id, group_id FROM history WHERE student_id = %s AND status = 'activo'", 
            (estudiante_id,)
        )
        existing_assignments = cur.fetchall()
        
        # Crear un conjunto con los IDs de grupos ya asignados
        existing_group_ids = {assignment['group_id'] for assignment in existing_assignments}
        
        # Determinar qué grupos hay que añadir y cuáles mantener
        groups_to_add = [gid for gid in group_ids if gid not in existing_group_ids]
        groups_to_keep = [gid for gid in group_ids if gid in existing_group_ids]
        groups_to_remove = [assignment['id'] for assignment in existing_assignments 
                           if assignment['group_id'] not in group_ids]
        
        # Desactivar asignaciones que ya no se necesitan
        if groups_to_remove:
            cur.execute(
                "UPDATE history SET status = 'inactivo' WHERE id = ANY(%s)", 
                (groups_to_remove,)
            )
        
        # Para cada grupo a añadir, verificar si ya existe un registro inactivo
        for group_id in groups_to_add:
            # Verificar si existe un registro inactivo para este estudiante y grupo
            cur.execute(
                """SELECT id FROM history 
                WHERE student_id = %s AND group_id = %s AND status = 'inactivo'""", 
                (estudiante_id, group_id)
            )
            inactive_record = cur.fetchone()
            
            if inactive_record:
                # Si existe un registro inactivo, reactivarlo
                print(f"Reactivando registro para estudiante {estudiante_id} y grupo {group_id}")
                cur.execute(
                    """UPDATE history SET status = 'activo' WHERE id = %s""", 
                    (inactive_record['id'],)
                )
            else:
                # Si no existe, crear un nuevo registro
                print(f"Creando nuevo registro para estudiante {estudiante_id} y grupo {group_id}")
                cur.execute(
                    """INSERT INTO history (student_id, group_id, status) 
                    VALUES (%s, %s, 'activo')""", 
                    (estudiante_id, group_id)
                )
        
        # Actualizar el campo group_id en la tabla student con el primer grupo de la lista
        # (esto es para mantener compatibilidad con el campo group_id existente)
        if group_ids:
            try:
                cur.execute(
                    """SELECT column_name 
                    FROM information_schema.columns 
                    WHERE table_name = 'student' AND column_name = 'group_id'"""
                )
                column_exists = cur.fetchone()
                
                if not column_exists:
                    # La columna no existe, la creamos
                    print("Creando columna group_id en la tabla student")
                    cur.execute(
                        "ALTER TABLE student ADD COLUMN group_id INTEGER"
                    )
                
                # Actualizamos el campo group_id con el primer grupo de la lista
                cur.execute(
                    "UPDATE student SET group_id = %s WHERE id = %s", 
                    (group_ids[0], estudiante_id)
                )
            except Exception as e:
                print(f"Error al actualizar el campo group_id: {e}")
                # Continuamos con la ejecución aunque falle esta parte
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({
            "message": "Estudiante asignado al grupo correctamente",
            "estudiante_id": estudiante_id,
            "group_id": group_id
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al asignar grupo", "error": str(e)}), 500
