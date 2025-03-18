import psycopg2
import os
from dotenv import load_dotenv
from flask_bcrypt import Bcrypt

# Cargar variables de entorno
load_dotenv()
bcrypt = Bcrypt()

def get_db_connection():
    """Establece conexión con la base de datos PostgreSQL."""
    return psycopg2.connect(
        host=os.getenv("DB_HOST"),
        port=os.getenv("DB_PORT"),
        dbname=os.getenv("DB_NAME"),
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
    )

def asegurar_rol_admin():
    """Asegura que el rol de administrador (id=1) existe en la tabla roles."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("INSERT INTO roles (id, name) VALUES (%s, %s) ON CONFLICT (id) DO NOTHING;", (1, "Administrador"))

        conn.commit()
        cur.close()
        conn.close()

        print("✅ Rol administrador asegurado en la base de datos.")
    except Exception as e:
        print(f"❌ Error al asegurar rol admin: {e}")

def crear_admin():
    """Inserta el usuario administrador con contraseña encriptada."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        email = "admin@cedb.com"
        password = "123456"
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        cur.execute(
            "INSERT INTO usuarios (name, lastname, email, password, rol) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
            ("admin", "admin", email, hashed_password, 1)
        )

        user_id = cur.fetchone()[0]
        conn.commit()

        print(f"✅ Usuario admin creado con éxito. ID: {user_id}")

        cur.close()
        conn.close()
    except Exception as e:
        print(f"❌ Error al crear usuario admin: {e}")

def ver_usuarios():
    """Muestra todos los usuarios de la base de datos."""
    try:
        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM usuarios WHERE email = 'admin@cedb.com';")
        usuarios = cur.fetchall()

        cur.close()
        conn.close()

        print("\n📋 Lista de Usuarios:")
        for usuario in usuarios:
            print(f"ID: {usuario[0]}, Nombre: {usuario[1]} {usuario[2]}, Email: {usuario[3]}, Rol: {usuario[4]}")

    except Exception as e:
        print(f"❌ Error al obtener usuarios: {e}")

# Asegurar que el rol existe antes de crear el usuario
# asegurar_rol_admin()
# crear_admin()
ver_usuarios()