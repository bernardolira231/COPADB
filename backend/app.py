from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from dotenv import load_dotenv
import os

app = Flask(__name__)

# Configuración de CORS para permitir solicitudes desde el frontend en el puerto correcto
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "http://localhost:3001"}})

bcrypt = Bcrypt(app)

# Clave secreta para JWT (debería estar en variables de entorno en producción)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
jwt = JWTManager(app)

load_dotenv()

DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

@app.route("/api/login", methods=["POST", "OPTIONS"])
def login():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204

    data = request.get_json()

    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    email = data["email"]
    password = data["password"]

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT id, name, email, password FROM usuarios WHERE email = %s", (email,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user and bcrypt.check_password_hash(user["password"], password):
            access_token = create_access_token(identity={"id": user["id"], "email": user["email"]})
            return jsonify({
                "message": "Login exitoso",
                "token": access_token,
                "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
            }), 200
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401

    except Exception as e:
        return jsonify({"message": "Error en el servidor", "error": str(e)}), 500
    
    



@app.route("/api/inscripciones", methods=["POST"])
def registrar_estudiante():
    try:
        data = request.get_json()

        conn = get_db_connection()
        cur = conn.cursor()

        # Insertar tutor primero en la tabla 'family'
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

        # Insertar estudiante y vincular con el tutor
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
        traceback.print_exc()  # Esto imprimirá el error completo en consola
        return jsonify({"message": "Error al registrar estudiante", "error": str(e)}), 500


    
    
    
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5328)