from dotenv import load_dotenv
import os

load_dotenv()

class Config:
    # Configuración general
    DEBUG = os.getenv("FLASK_DEBUG", "True") == "True"
    HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    PORT = int(os.getenv("FLASK_PORT", "5328"))
    
    # Configuración de JWT
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "supersecretkey")
    JWT_TOKEN_LOCATION = ["headers"]
    JWT_HEADER_NAME = "Authorization"
    JWT_HEADER_TYPE = "Bearer"
    
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
 