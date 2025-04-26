from flask import current_app
from flask_jwt_extended import create_access_token
from repositories.user_repository import UserRepository
from utils.error_handler import UnauthorizedError, APIError
import traceback
from extensions import bcrypt  # Importar la instancia centralizada de Bcrypt

class AuthService:
    """
    Servicio para manejar la autenticación de usuarios.
    """
    
    def __init__(self):
        self.user_repository = UserRepository()
    
    def login(self, email, password):
        """
        Autentica a un usuario y genera un token JWT.
        
        Args:
            email: Email del usuario
            password: Contraseña del usuario
            
        Returns:
            dict: Diccionario con el token JWT y la información del usuario
            
        Raises:
            UnauthorizedError: Si las credenciales son incorrectas
        """
        try:
            user = self.user_repository.find_by_email(email)
            
            if not user:
                raise UnauthorizedError("Credenciales incorrectas")
            
            # Usar la instancia centralizada de bcrypt
            if not bcrypt.check_password_hash(user.password, password):
                raise UnauthorizedError("Credenciales incorrectas")
            
            # Crear token JWT
            access_token = create_access_token(identity=str(user.id))
            
            # Preparar respuesta considerando que algunos campos podrían no existir
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
            }
            
            # Añadir campos opcionales si existen
            if hasattr(user, 'lastname') and user.lastname:
                user_data["lastname"] = user.lastname
            if hasattr(user, 'rol') and user.rol is not None:
                user_data["rol"] = user.rol
            
            return {
                "message": "Login exitoso",
                "token": access_token,
                "user": user_data
            }
        except UnauthorizedError:
            # Re-lanzar errores de autorización
            raise
        except Exception as e:
            # Loguear el error para depuración
            traceback.print_exc()
            raise APIError(f"Error en la autenticación: {str(e)}", 500)
    
    def register(self, user_data):
        """
        Registra un nuevo usuario en el sistema.
        
        Args:
            user_data: Diccionario con los datos del usuario
            
        Returns:
            dict: Diccionario con la información del usuario registrado
            
        Raises:
            APIError: Si el email ya está registrado
        """
        # Verificar si el email ya está registrado
        existing_user = self.user_repository.find_by_email(user_data.get('email'))
        if existing_user:
            raise APIError("El email ya está registrado", 400)
        
        # Hashear la contraseña
        hashed_password = bcrypt.generate_password_hash(user_data.get('password')).decode('utf-8')
        
        # Crear el usuario
        from models.user import User
        new_user = User(
            name=user_data.get('name'),
            lastname=user_data.get('lastname'),
            email=user_data.get('email'),
            password=hashed_password,
            rol=user_data.get('rol', 1)  # Rol por defecto: 1 (usuario normal)
        )
        
        created_user = self.user_repository.create(new_user)
        
        return {
            "message": "Usuario registrado exitosamente",
            "user": {
                "id": created_user.id,
                "name": created_user.name,
                "lastname": created_user.lastname,
                "email": created_user.email,
                "rol": created_user.rol
            }
        }
    
    def get_user_profile(self, user_id):
        """
        Obtiene el perfil de un usuario.
        
        Args:
            user_id: ID del usuario
            
        Returns:
            dict: Diccionario con la información del usuario
        """
        user = self.user_repository.find_by_id(user_id)
        
        return {
            "user": {
                "id": user.id,
                "name": user.name,
                "lastname": user.lastname,
                "email": user.email,
                "rol": user.rol
            }
        }
    
    def change_password(self, user_id, current_password, new_password):
        """
        Cambia la contraseña de un usuario.
        
        Args:
            user_id: ID del usuario
            current_password: Contraseña actual
            new_password: Nueva contraseña
            
        Raises:
            UnauthorizedError: Si la contraseña actual es incorrecta
        """
        user = self.user_repository.find_by_id(user_id)
        
        # Verificar la contraseña actual
        if not bcrypt.check_password_hash(user.password, current_password):
            raise UnauthorizedError("Contraseña actual incorrecta")
        
        # Hashear la nueva contraseña
        hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')
        
        # Actualizar la contraseña
        self.user_repository.update_password(user_id, hashed_password)
        
        return {"message": "Contraseña actualizada exitosamente"}
