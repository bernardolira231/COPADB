from flask import Blueprint, request, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import Config

student_bp = Blueprint('student', __name__, url_prefix='/api')

def get_db_connection():
    return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)

@student_bp.route('/inscripciones', methods=['POST', 'OPTIONS'])
def registrar_estudiante():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204
        
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
def get_estudiantes():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204
        
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
                id, name, lastname_f, lastname_m, email, 
                blood_type, allergies, scholar_ship, chapel, 
                school_campus, family_id, permission, 
                reg_date
            FROM public.student
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
def delete_estudiante(id):
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "DELETE, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204
        
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
def update_estudiante(id):
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "PUT, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204
        
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
