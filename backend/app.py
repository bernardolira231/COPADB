from flask import Flask
from config.config import Config
from utils.error_handler import register_error_handlers
from routes import register_blueprints
from extensions import bcrypt, jwt, cors

def create_app(config_class=Config):
    """
    Crea y configura la aplicación Flask.
    
    Args:
        config_class: Clase de configuración a utilizar
        
    Returns:
        Flask: Instancia configurada de la aplicación Flask
    """
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    # Inicializar extensiones
    cors.init_app(app, supports_credentials=True, resources=app.config['CORS_RESOURCES'])
    jwt.init_app(app)
    bcrypt.init_app(app)
    
    # Registrar blueprints
    register_blueprints(app)
    
    # Registrar manejadores de errores
    register_error_handlers(app)
    
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=app.config['DEBUG'], host=app.config['HOST'], port=app.config['PORT'])
