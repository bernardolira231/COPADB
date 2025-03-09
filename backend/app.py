from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
from dotenv import load_dotenv
import os

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# Clave secreta para JWT (debería estar en variables de entorno en producción)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "supersecretkey")
jwt = JWTManager(app)

# Cargar variables de entorno desde .env
load_dotenv()

# Conexión a PostgreSQL con variables de entorno
DB_CONFIG = {
    "host": os.getenv("DB_HOST"),
    "port": os.getenv("DB_PORT"),
    "dbname": os.getenv("DB_NAME"),
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

def get_db_connection():
    return psycopg2.connect(**DB_CONFIG, cursor_factory=RealDictCursor)

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()

    # Validar que el frontend envió email y password
    if not data or "email" not in data or "password" not in data:
        return jsonify({"message": "Email y contraseña requeridos"}), 400

    email = data["email"]
    password = data["password"]

    try:
        conn = get_db_connection()
        cur = conn.cursor()

        # Buscar usuario en la base de datos
        cur.execute("SELECT id, name, email, password FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user and bcrypt.check_password_hash(user["password"], password):
            access_token = create_access_token(identity={"id": user["id"], "email": user["email"]})
            return jsonify({"message": "Login exitoso", "token": access_token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}), 200
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401

    except Exception as e:
        return jsonify({"message": "Error en el servidor", "error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)