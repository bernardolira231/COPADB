from flask import Blueprint, jsonify, request
from flask_jwt_extended import decode_token
import psycopg2
from psycopg2.extras import RealDictCursor
from config.config import Config

teacher_bp = Blueprint('teacher', __name__, url_prefix='/api/profesor')

def get_db_connection():
    return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)

@teacher_bp.route('/materias', methods=['GET', 'OPTIONS'])
def get_materias():
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
        
        # Obtener las materias del profesor
        cur.execute("""
            SELECT 
                g.id        AS group_id,
                g.grade     AS grado,
                c.id        AS class_id,
                c.name      AS class_name
            FROM "group" g
            JOIN class c
                ON c.id = g.class_id
            WHERE g.professor_id = %s
        """, (user_id,))
        
        materias = []
        for row in cur.fetchall():
            materias.append({
                "group_id": row['group_id'],
                "grado": row['grado'],
                "class_id": row['class_id'],
                "class_name": row['class_name']
            })
        
        cur.close()
        conn.close()
        
        return jsonify({
            "materias": materias
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener materias", "error": str(e)}), 500

@teacher_bp.route('/materias/<int:group_id>', methods=['GET', 'OPTIONS'])
def get_materia_details(group_id):
    """Endpoint para obtener los detalles de una materia específica"""
    # Manejar solicitudes OPTIONS para CORS
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
        
        # Temporalmente, no hay implementación para obtener detalles de la materia
        # Se puede agregar una implementación similar a la del endpoint /materias
        return jsonify({"message": "No se ha implementado la obtención de detalles de la materia"}), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener detalles de la materia", "error": str(e)}), 500
