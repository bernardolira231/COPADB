"""
Extensiones de Flask utilizadas en la aplicación.
Este archivo centraliza la creación de instancias de extensiones para evitar importaciones circulares.
"""
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Crear instancias de las extensiones
bcrypt = Bcrypt()
jwt = JWTManager()

# Configuración de CORS exactamente igual que en la app original
cors = CORS(supports_credentials=True, resources={r"/*": {
    "origins": "http://localhost:3001",
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization", "Accept"]
}})
