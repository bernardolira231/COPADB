from flask import Blueprint, request, jsonify, make_response, Response
import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import Config
from functools import wraps
import datetime

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

        family_id = cur.fetchone()

        if family_id is None:
            raise ValueError("No se pudo obtener el family_id después de insertar en family.")
        
        family_id = family_id["id"]
        cur.execute("""
            INSERT INTO student (
                name, lastname_F, lastname_M, email, blood_type,
                allergies, scholar_ship, chapel, school_campus,
                family_id, permission, reg_date
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
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
            data["fechaRegistro"]
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
                s.reg_date
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
                SELECT h.student_id, h.group_id, g.grade, c.name as class_name
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
            for group in groups_data:
                student_id = group['student_id']
                if student_id not in student_groups:
                    student_groups[student_id] = group
            
            # Asignar la información de grupos a cada estudiante
            for estudiante in estudiantes:
                student_id = estudiante['id']
                if student_id in student_groups:
                    estudiante['group_id'] = student_groups[student_id]['group_id']
                    estudiante['group_grade'] = student_groups[student_id]['grade']
                    estudiante['class_name'] = student_groups[student_id]['class_name']
                    print(f"Estudiante {student_id} tiene asignado el grupo {estudiante['group_grade']}")
                else:
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
                reg_date = %s
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

@student_bp.route('/estudiantes/<int:estudiante_id>/asignar-grupo', methods=['POST'])
@cors_decorator
def asignar_grupo(estudiante_id):
    """Endpoint para asignar un estudiante a un grupo"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        if 'group_id' not in data:
            return jsonify({"message": "Se requiere el ID del grupo"}), 400
        
        group_id = data['group_id']
        
        # Convertir a entero si es una cadena
        if isinstance(group_id, str):
            group_id = int(group_id)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el estudiante existe
        cur.execute("SELECT id FROM student WHERE id = %s", (estudiante_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Estudiante no encontrado"}), 404
        
        # Verificar si el grupo existe
        cur.execute("SELECT id FROM \"group\" WHERE id = %s", (group_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Grupo no encontrado"}), 404
        
        # Verificar si ya existe una asignación activa para este estudiante
        cur.execute(
            "SELECT id FROM history WHERE student_id = %s AND status = 'activo'", 
            (estudiante_id,)
        )
        existing_assignment = cur.fetchone()
        
        if existing_assignment:
            # Actualizar la asignación existente a inactiva
            cur.execute(
                "UPDATE history SET status = 'inactivo' WHERE id = %s", 
                (existing_assignment['id'],)
            )
        
        # Crear una nueva asignación en la tabla history
        cur.execute(
            """INSERT INTO history (student_id, group_id, status) 
            VALUES (%s, %s, 'activo')""", 
            (estudiante_id, group_id)
        )
        
        # Actualizar el campo group_id en la tabla student
        # Primero verificamos si la columna group_id existe en la tabla student
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
            
            # Ahora actualizamos el campo group_id
            cur.execute(
                "UPDATE student SET group_id = %s WHERE id = %s", 
                (group_id, estudiante_id)
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
