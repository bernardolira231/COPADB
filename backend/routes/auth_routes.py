from flask import Blueprint, request, jsonify, make_response
from flask_jwt_extended import (
    create_access_token, create_refresh_token, decode_token, jwt_required, get_jwt_identity, set_refresh_cookies, unset_jwt_cookies
)
import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import Config
from extensions import bcrypt
from datetime import timedelta

auth_bp = Blueprint('auth', __name__, url_prefix='/api')

def get_db_connection():
    return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)

@auth_bp.route('/login', methods=['POST', 'OPTIONS'])
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
            user_id_str = str(user["id"])
            access_token = create_access_token(identity=user_id_str)
            refresh_token = create_refresh_token(identity=user_id_str)

            resp = jsonify({
                "message": "Login exitoso",
                "token": access_token,
                "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
            })
            set_refresh_cookies(resp, refresh_token)
            return resp, 200
        else:
            return jsonify({"message": "Credenciales incorrectas"}), 401

    except Exception as e:
        return jsonify({"message": "Error en el servidor", "error": str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify({"token": new_access_token}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    resp = jsonify({"message": "Logout exitoso"})
    unset_jwt_cookies(resp)
    return resp, 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        user_id = get_jwt_identity()
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, name, lastname_m, lastname_f, email, rol
            FROM usuarios
            WHERE id = %s
        """, (int(user_id),))
        
        user_data = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not user_data:
            return jsonify({"message": "Usuario no encontrado"}), 404
            
        return jsonify({
            "user": user_data
        }), 200
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener perfil", "error": str(e)}), 500

@auth_bp.route('/user/profile', methods=['GET', 'OPTIONS'])
def get_user_profile():
    if request.method == "OPTIONS":
        response = jsonify({"message": "CORS preflight OK"})
        response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
        response.headers.add("Access-Control-Allow-Credentials", "true")
        return response, 204
        
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Token no proporcionado o formato incorrecto"}), 401
        
    token = auth_header.split(' ')[1]
    
    try:
        decoded_token = decode_token(token)
        user_id_str = decoded_token["sub"]
        user_id = int(user_id_str)
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        cur.execute("""
            SELECT id, name, lastname_m, lastname_f, email, rol
            FROM usuarios
            WHERE id = %s
        """, (user_id,))
        
        user_data = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not user_data:
            return jsonify({"message": "Usuario no encontrado"}), 404
            
        return jsonify({
            "user": user_data
        }), 200
            
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener perfil", "error": str(e)}), 500

@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data or "currentPassword" not in data or "newPassword" not in data:
            return jsonify({"message": "Contraseña actual y nueva requeridas"}), 400
        
        current_password = data["currentPassword"]
        new_password = data["newPassword"]
        
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT password FROM usuarios WHERE id = %s", (int(user_id),))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if user and bcrypt.check_password_hash(user["password"], current_password):
            conn = get_db_connection()
            cur = conn.cursor()

            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
            cur.execute("UPDATE usuarios SET password = %s WHERE id = %s", (hashed_password, int(user_id)))
            conn.commit()

            cur.close()
            conn.close()

            return jsonify({"message": "Contraseña cambiada exitosamente"}), 200
        else:
            return jsonify({"message": "Contraseña actual incorrecta"}), 401
    
    except Exception as e:
        return jsonify({"message": "Error al cambiar contraseña", "error": str(e)}), 500
