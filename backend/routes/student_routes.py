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
