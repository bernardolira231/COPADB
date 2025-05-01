from dotenv import load_dotenv
import os
from datetime import timedelta

load_dotenv()

class Config:
    # Configuración general
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", "5328"))
    
    # Configuración de JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    JWT_TOKEN_LOCATION = ["headers", "cookies"]  # <- Permitir búsqueda en headers y cookies
    JWT_REFRESH_TOKEN_LOCATION = ["cookies"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=30)  # Access token corto
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)     # Refresh token largo
    JWT_COOKIE_SECURE = False  # Cambia a True en producción con HTTPS
    JWT_COOKIE_SAMESITE = "Lax"
    JWT_COOKIE_CSRF_PROTECT = True
    
    # Configuración de CORS
    CORS_ORIGIN = os.getenv("CORS_ORIGIN", "http://localhost:3001")
    
    # Configuración de la base de datos
    DB_CONFIG = {
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT"),
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
    }