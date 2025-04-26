from utils.db import get_db_connection
from models.user import User
from utils.error_handler import NotFoundError
import traceback

class UserRepository:
    """
    Repositorio para acceder a los datos de usuarios en la base de datos.
    """
    
    def find_by_id(self, user_id):
        """
        Busca un usuario por su ID.
        
        Args:
            user_id: ID del usuario a buscar
            
        Returns:
            User: Objeto de usuario si se encuentra
            
        Raises:
            NotFoundError: Si el usuario no existe
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Consulta adaptada a la estructura actual de la tabla
                    cur.execute(
                        "SELECT id, name, email, password, rol FROM usuarios WHERE id = %s",
                        (user_id,)
                    )
                    user_data = cur.fetchone()
                    
                    if not user_data:
                        raise NotFoundError(f"Usuario con ID {user_id} no encontrado")
                    
                    # Crear objeto User con los campos disponibles
                    return User(
                        id=user_data['id'],
                        name=user_data['name'],
                        email=user_data['email'],
                        password=user_data['password'],
                        rol=user_data.get('rol')
                    )
        except Exception as e:
            traceback.print_exc()
            raise e
    
    def find_by_email(self, email):
        """
        Busca un usuario por su email.
        
        Args:
            email: Email del usuario a buscar
            
        Returns:
            User: Objeto de usuario si se encuentra
            None: Si no se encuentra ningún usuario con ese email
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Consulta adaptada a la estructura actual de la tabla
                    cur.execute(
                        "SELECT id, name, email, password, rol FROM usuarios WHERE email = %s",
                        (email,)
                    )
                    user_data = cur.fetchone()
                    
                    if not user_data:
                        return None
                    
                    # Crear objeto User con los campos disponibles
                    return User(
                        id=user_data['id'],
                        name=user_data['name'],
                        email=user_data['email'],
                        password=user_data['password'],
                        rol=user_data.get('rol')
                    )
        except Exception as e:
            traceback.print_exc()
            raise e
    
    def create(self, user):
        """
        Crea un nuevo usuario en la base de datos.
        
        Args:
            user: Objeto User con los datos del usuario a crear
            
        Returns:
            User: Objeto User con el ID asignado
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Consulta adaptada a la estructura actual de la tabla
                    cur.execute(
                        """
                        INSERT INTO usuarios (name, email, password, rol)
                        VALUES (%s, %s, %s, %s)
                        RETURNING id
                        """,
                        (user.name, user.email, user.password, user.rol)
                    )
                    
                    user_id = cur.fetchone()['id']
                    user.id = user_id
                    
                    return user
        except Exception as e:
            traceback.print_exc()
            raise e
    
    def update(self, user):
        """
        Actualiza un usuario existente en la base de datos.
        
        Args:
            user: Objeto User con los datos actualizados
            
        Returns:
            User: Objeto User actualizado
            
        Raises:
            NotFoundError: Si el usuario no existe
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    # Consulta adaptada a la estructura actual de la tabla
                    cur.execute(
                        """
                        UPDATE usuarios
                        SET name = %s, email = %s, rol = %s
                        WHERE id = %s
                        RETURNING id
                        """,
                        (user.name, user.email, user.rol, user.id)
                    )
                    
                    if cur.rowcount == 0:
                        raise NotFoundError(f"Usuario con ID {user.id} no encontrado")
                    
                    return user
        except Exception as e:
            traceback.print_exc()
            raise e
    
    def update_password(self, user_id, hashed_password):
        """
        Actualiza la contraseña de un usuario.
        
        Args:
            user_id: ID del usuario
            hashed_password: Hash de la nueva contraseña
            
        Raises:
            NotFoundError: Si el usuario no existe
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "UPDATE usuarios SET password = %s WHERE id = %s RETURNING id",
                        (hashed_password, user_id)
                    )
                    
                    if cur.rowcount == 0:
                        raise NotFoundError(f"Usuario con ID {user_id} no encontrado")
        except Exception as e:
            traceback.print_exc()
            raise e
    
    def delete(self, user_id):
        """
        Elimina un usuario de la base de datos.
        
        Args:
            user_id: ID del usuario a eliminar
            
        Raises:
            NotFoundError: Si el usuario no existe
        """
        try:
            with get_db_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "DELETE FROM usuarios WHERE id = %s RETURNING id",
                        (user_id,)
                    )
                    
                    if cur.rowcount == 0:
                        raise NotFoundError(f"Usuario con ID {user_id} no encontrado")
        except Exception as e:
            traceback.print_exc()
            raise e
