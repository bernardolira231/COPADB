from flask import Blueprint, jsonify, request
import psycopg2
from psycopg2.extras import RealDictCursor
from flask_jwt_extended import jwt_required, get_jwt_identity
from config.config import Config
import bcrypt

user_bp = Blueprint('user', __name__, url_prefix='/api/usuarios')

def get_db_connection():
    return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)

@user_bp.route('', methods=['GET'])
@jwt_required()
def get_usuarios():
    """Endpoint para obtener todos los usuarios (profesores)"""
    try:
        # Obtener parámetros de paginación y búsqueda
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        
        # Calcular offset para la paginación
        offset = (page - 1) * per_page
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Consulta para contar el total de registros con filtro de búsqueda
        count_query = """
            SELECT COUNT(*) as total
            FROM usuarios
            WHERE (
                LOWER(name) LIKE LOWER(%s) OR
                LOWER(lastname_f) LIKE LOWER(%s) OR
                LOWER(lastname_m) LIKE LOWER(%s) OR
                LOWER(email) LIKE LOWER(%s)
            )
        """
        
        search_pattern = f'%{search}%'
        cur.execute(count_query, (search_pattern, search_pattern, search_pattern, search_pattern))
        total_count = cur.fetchone()['total']
        
        # Consulta para obtener los usuarios paginados
        query = """
            SELECT id, name, lastname_f, lastname_m, email, rol, profesor_type
            FROM usuarios
            WHERE (
                LOWER(name) LIKE LOWER(%s) OR
                LOWER(lastname_f) LIKE LOWER(%s) OR
                LOWER(lastname_m) LIKE LOWER(%s) OR
                LOWER(email) LIKE LOWER(%s)
            )
            ORDER BY id
            LIMIT %s OFFSET %s
        """
        
        cur.execute(query, (search_pattern, search_pattern, search_pattern, search_pattern, per_page, offset))
        usuarios = cur.fetchall()
        
        # Calcular el total de páginas
        total_pages = (total_count + per_page - 1) // per_page
        
        # Preparar la respuesta
        response = {
            "usuarios": list(usuarios),
            "pagination": {
                "total": total_count,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages
            }
        }
        
        cur.close()
        conn.close()
        
        return jsonify(response), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener usuarios", "error": str(e)}), 500

@user_bp.route('/<int:id>', methods=['GET'])
@jwt_required()
def get_usuario(id):
    """Endpoint para obtener un usuario específico por ID"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        query = """
            SELECT id, name, lastname_f, lastname_m, email, rol, profesor_type
            FROM usuarios
            WHERE id = %s
        """
        
        cur.execute(query, (id,))
        usuario = cur.fetchone()
        
        cur.close()
        conn.close()
        
        if not usuario:
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        return jsonify(usuario), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener usuario", "error": str(e)}), 500

@user_bp.route('', methods=['POST'])
@jwt_required()
def create_usuario():
    """Endpoint para crear un nuevo usuario (profesor)"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        # Validar datos requeridos
        required_fields = ['name', 'lastname_f', 'email', 'password', 'rol']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({"message": f"El campo {field} es requerido"}), 400
        
        # Hashear la contraseña
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el email ya existe
        cur.execute("SELECT id FROM usuarios WHERE email = %s", (data['email'],))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "El email ya está registrado"}), 400
        
        # Insertar nuevo usuario
        query = """
            INSERT INTO usuarios (name, lastname_f, lastname_m, email, password, rol, profesor_type)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING id, name, lastname_f, lastname_m, email, rol, profesor_type
        """
        
        cur.execute(query, (
            data['name'],
            data['lastname_f'],
            data.get('lastname_m', ''),  # Campo opcional
            data['email'],
            hashed_password.decode('utf-8'),
            data['rol'],
            data.get('profesor_type', 'titular')  # Valor por defecto si no se proporciona
        ))
        
        new_usuario = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify(new_usuario), 201
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al crear usuario", "error": str(e)}), 500

@user_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_usuario(id):
    """Endpoint para actualizar un usuario existente"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el usuario existe
        cur.execute("SELECT id FROM usuarios WHERE id = %s", (id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Construir la consulta de actualización dinámicamente
        update_fields = []
        params = []
        
        # Campos que se pueden actualizar
        if 'name' in data and data['name']:
            update_fields.append("name = %s")
            params.append(data['name'])
        
        if 'lastname_f' in data and data['lastname_f']:
            update_fields.append("lastname_f = %s")
            params.append(data['lastname_f'])
        
        if 'lastname_m' in data:  # Puede ser vacío
            update_fields.append("lastname_m = %s")
            params.append(data['lastname_m'])
        
        if 'email' in data and data['email']:
            # Verificar si el nuevo email ya existe para otro usuario
            cur.execute("SELECT id FROM usuarios WHERE email = %s AND id != %s", (data['email'], id))
            if cur.fetchone():
                cur.close()
                conn.close()
                return jsonify({"message": "El email ya está registrado para otro usuario"}), 400
            
            update_fields.append("email = %s")
            params.append(data['email'])
        
        if 'password' in data and data['password']:
            hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
            update_fields.append("password = %s")
            params.append(hashed_password.decode('utf-8'))
        
        if 'rol' in data and data['rol']:
            update_fields.append("rol = %s")
            params.append(data['rol'])
        
        if 'profesor_type' in data:
            update_fields.append("profesor_type = %s")
            params.append(data['profesor_type'])
        
        # Si no hay campos para actualizar
        if not update_fields:
            cur.close()
            conn.close()
            return jsonify({"message": "No se proporcionaron campos para actualizar"}), 400
        
        # Construir y ejecutar la consulta
        query = f"""
            UPDATE usuarios
            SET {', '.join(update_fields)}
            WHERE id = %s
            RETURNING id, name, lastname_f, lastname_m, email, rol, profesor_type
        """
        
        params.append(id)
        cur.execute(query, params)
        
        updated_usuario = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        return jsonify(updated_usuario), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al actualizar usuario", "error": str(e)}), 500

@user_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_usuario(id):
    """Endpoint para eliminar un usuario"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el usuario existe
        cur.execute("SELECT id FROM usuarios WHERE id = %s", (id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Eliminar el usuario
        cur.execute("DELETE FROM usuarios WHERE id = %s RETURNING id", (id,))
        deleted = cur.fetchone()
        conn.commit()
        
        cur.close()
        conn.close()
        
        if deleted:
            return jsonify({"message": "Usuario eliminado correctamente", "id": deleted['id']}), 200
        else:
            return jsonify({"message": "No se pudo eliminar el usuario"}), 500
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al eliminar usuario", "error": str(e)}), 500

@user_bp.route('/<int:id>/materias', methods=['GET'])
@jwt_required()
def get_materias_profesor(id):
    """Endpoint para obtener las materias asignadas a un profesor"""
    try:
        print(f"Obteniendo materias para el profesor ID: {id}")
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el usuario existe
        cur.execute("SELECT id, name, lastname_f, lastname_m FROM usuarios WHERE id = %s", (id,))
        usuario = cur.fetchone()
        print(f"Usuario encontrado: {usuario}")
        
        if not usuario:
            cur.close()
            conn.close()
            return jsonify({"message": "Usuario no encontrado"}), 404
        
        # Comprobar si la tabla group existe
        cur.execute("""SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'group'
        )""")
        group_table_exists = cur.fetchone()['exists']
        print(f"¿Existe la tabla 'group'?: {group_table_exists}")
        
        # Comprobar si la tabla class existe
        cur.execute("""SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'class'
        )""")
        class_table_exists = cur.fetchone()['exists']
        print(f"¿Existe la tabla 'class'?: {class_table_exists}")
        
        # Si alguna de las tablas no existe, devolver una lista vacía
        if not group_table_exists or not class_table_exists:
            response = {
                "usuario": usuario,
                "materias": [],
                "debug_info": {
                    "group_table_exists": group_table_exists,
                    "class_table_exists": class_table_exists
                }
            }
            cur.close()
            conn.close()
            return jsonify(response), 200
        
        # Verificar la estructura de la tabla group
        cur.execute("""SELECT column_name 
                      FROM information_schema.columns 
                      WHERE table_name = 'group'""")
        group_columns = [col['column_name'] for col in cur.fetchall()]
        print(f"Columnas de la tabla 'group': {group_columns}")
        
        # Verificar la estructura de la tabla class
        cur.execute("""SELECT column_name 
                      FROM information_schema.columns 
                      WHERE table_name = 'class'""")
        class_columns = [col['column_name'] for col in cur.fetchall()]
        print(f"Columnas de la tabla 'class': {class_columns}")
        
        # Verificar si las columnas necesarias existen
        has_required_columns = (
            'professor_id' in group_columns and
            'class_id' in group_columns and
            'id' in group_columns and
            'grade' in group_columns and
            'id' in class_columns and
            'name' in class_columns
        )
        
        if not has_required_columns:
            response = {
                "usuario": usuario,
                "materias": [],
                "debug_info": {
                    "group_columns": group_columns,
                    "class_columns": class_columns,
                    "has_required_columns": has_required_columns
                }
            }
            cur.close()
            conn.close()
            return jsonify(response), 200
        
        # Intentar obtener las materias asignadas al profesor
        try:
            cur.execute("""
                SELECT 
                    g.id AS group_id,
                    g.grade AS grado,
                    c.id AS class_id,
                    c.name AS class_name
                FROM "group" g
                JOIN class c ON c.id = g.class_id
                WHERE g.professor_id = %s
                ORDER BY c.name
            """, (id,))
            
            materias = cur.fetchall()
            print(f"Materias encontradas: {materias}")
            
            # Preparar la respuesta
            response = {
                "usuario": usuario,
                "materias": list(materias)
            }
        except Exception as e:
            print(f"Error al ejecutar la consulta SQL: {str(e)}")
            # Si hay un error en la consulta, devolver información de depuración
            response = {
                "usuario": usuario,
                "materias": [],
                "debug_info": {
                    "error": str(e),
                    "group_columns": group_columns,
                    "class_columns": class_columns
                }
            }
        
        cur.close()
        conn.close()
        
        return jsonify(response), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener materias del profesor", "error": str(e)}), 500

@user_bp.route('/materias-disponibles', methods=['GET'])
@jwt_required()
def get_materias_disponibles():
    """Endpoint para obtener las materias que no tienen profesor asignado"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si las tablas necesarias existen
        cur.execute("""SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'class'
        )""")
        class_table_exists = cur.fetchone()['exists']
        
        if not class_table_exists:
            cur.close()
            conn.close()
            return jsonify({
                "materias": [],
                "message": "Las tablas necesarias no existen"
            }), 200
        
        # Consulta modificada para obtener materias que no están asignadas a ningún grupo o historial
        # O que tienen grupos con professor_id = NULL (materias desasignadas)
        cur.execute("""
            SELECT 
                c.id AS class_id,
                c.name AS class_name,
                g.id AS group_id,
                g.grade AS grade
            FROM class c
            LEFT JOIN "group" g ON c.id = g.class_id
            WHERE (g.id IS NULL) OR (g.professor_id IS NULL)
            ORDER BY c.name
        """)
        
        materias_raw = cur.fetchall()
        
        # Formatear las materias para mantener compatibilidad con el frontend
        materias = []
        for materia in materias_raw:
            # Si hay un group_id, lo usamos; si no, es una materia sin grupo
            if materia["group_id"] is not None:
                materias.append({
                    "class_id": materia["class_id"],
                    "class_name": materia["class_name"],
                    "group_id": materia["group_id"],
                    "grado": materia["grade"] or "N/A"
                })
            else:
                materias.append({
                    "class_id": materia["class_id"],
                    "class_name": materia["class_name"],
                    "group_id": None,  # No hay grupo asociado
                    "grado": "N/A"     # No hay grado asociado
                })
        
        cur.close()
        conn.close()
        
        return jsonify({
            "materias": materias
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener materias disponibles", "error": str(e)}), 500

@user_bp.route('/<int:profesor_id>/asignar-materia', methods=['POST'])
@jwt_required()
def asignar_materia(profesor_id):
    """Endpoint para asignar una materia a un profesor"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        # Ahora aceptamos class_id en lugar de group_id
        if 'class_id' not in data and 'group_id' not in data:
            return jsonify({"message": "Se requiere el ID de la clase o del grupo"}), 400
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el profesor existe
        cur.execute("SELECT id FROM usuarios WHERE id = %s", (profesor_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Profesor no encontrado"}), 404
        
        # Variables para almacenar información del grupo y la clase
        grupo_info = None
        clase_info = None

        # Si se proporciona group_id, usamos el flujo anterior
        if 'group_id' in data and data['group_id'] is not None:
            group_id = data['group_id']
            
            # Verificar si el grupo existe
            cur.execute("SELECT id, grade, class_id FROM \"group\" WHERE id = %s", (group_id,))
            grupo = cur.fetchone()
            if not grupo:
                cur.close()
                conn.close()
                return jsonify({"message": "Grupo no encontrado"}), 404
            
            # Asignar el profesor al grupo existente
            cur.execute("""
                UPDATE "group"
                SET professor_id = %s
                WHERE id = %s
                RETURNING id, grade, class_id
            """, (profesor_id, group_id))
            
            grupo_info = cur.fetchone()
            
            # Obtener información de la clase
            cur.execute("SELECT id, name FROM class WHERE id = %s", (grupo_info['class_id'],))
            clase_info = cur.fetchone()
        
        # Si se proporciona class_id, creamos un nuevo grupo
        elif 'class_id' in data:
            class_id = data['class_id']
            
            # Verificar si la clase existe
            cur.execute("SELECT id, name FROM class WHERE id = %s", (class_id,))
            clase_info = cur.fetchone()
            if not clase_info:
                cur.close()
                conn.close()
                return jsonify({"message": "Clase no encontrada"}), 404
            
            # Crear un nuevo grupo para esta clase y asignar al profesor
            # Por defecto, asignamos grado 1
            cur.execute("""
                INSERT INTO "group" (class_id, professor_id, grade)
                VALUES (%s, %s, '1')
                RETURNING id, grade, class_id
            """, (class_id, profesor_id))
            
            grupo_info = cur.fetchone()
            if not grupo_info:
                conn.rollback()
                cur.close()
                conn.close()
                return jsonify({"message": "Error al crear el grupo"}), 500
        
        conn.commit()
        cur.close()
        conn.close()
        
        # Preparar la respuesta con la información disponible
        response = {
            "message": "Materia asignada correctamente"
        }
        
        # Añadir información del grupo si está disponible
        if grupo_info:
            response["grupo"] = {
                "id": grupo_info['id'],
                "grado": grupo_info['grade'],
                "class_id": grupo_info['class_id'],
                "class_name": clase_info['name'] if clase_info else None
            }
        
        return jsonify(response), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al asignar materia", "error": str(e)}), 500

@user_bp.route('/<int:profesor_id>/desasignar-materia', methods=['POST'])
@jwt_required()
def desasignar_materia(profesor_id):
    """Endpoint para desasignar una materia de un profesor"""
    try:
        # Obtener datos del cuerpo de la solicitud
        data = request.get_json()
        
        if 'group_id' not in data:
            return jsonify({"message": "Se requiere el ID del grupo"}), 400
        
        group_id = data['group_id']
        
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si el profesor existe
        cur.execute("SELECT id FROM usuarios WHERE id = %s", (profesor_id,))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Profesor no encontrado"}), 404
        
        # Verificar si el grupo existe y pertenece al profesor
        cur.execute("SELECT id FROM \"group\" WHERE id = %s AND professor_id = %s", (group_id, profesor_id))
        if not cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"message": "Grupo no encontrado o no asignado a este profesor"}), 404
        
        # Desasignar el profesor del grupo (establecer professor_id a NULL)
        cur.execute("""
            UPDATE "group"
            SET professor_id = NULL
            WHERE id = %s
        """, (group_id,))
        
        conn.commit()
        cur.close()
        conn.close()
        
        return jsonify({"message": "Materia desasignada correctamente"}), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al desasignar materia", "error": str(e)}), 500

@user_bp.route('/groups', methods=['GET'])
def get_all_groups():
    """Endpoint para obtener todos los grupos disponibles"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Verificar si las tablas necesarias existen
        cur.execute("""SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'group'
        )""")
        group_table_exists = cur.fetchone()['exists']
        
        cur.execute("""SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'class'
        )""")
        class_table_exists = cur.fetchone()['exists']
        
        if not group_table_exists or not class_table_exists:
            cur.close()
            conn.close()
            return jsonify({
                "groups": [],
                "message": "Las tablas necesarias no existen"
            }), 200
        
        # Obtener solo los grados únicos sin repetir
        cur.execute("""
            SELECT DISTINCT
                g.grade
            FROM "group" g
            ORDER BY g.grade
        """)
        
        groups = cur.fetchall()
        
        cur.close()
        conn.close()
        
        return jsonify({
            "groups": list(groups)
        }), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"message": "Error al obtener grupos", "error": str(e)}), 500
