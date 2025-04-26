from flask import request, jsonify
from functools import wraps
from utils.error_handler import APIError

def validate_schema(schema):
    """
    Decorador para validar el esquema de los datos de entrada en las peticiones JSON.
    
    Args:
        schema: Un diccionario que define los campos requeridos y sus tipos.
               Ejemplo: {'nombre': str, 'edad': int, 'email': str}
    
    Uso:
        @app.route('/ruta', methods=['POST'])
        @validate_schema({'nombre': str, 'edad': int})
        def mi_funcion():
            # Si llegamos aquí, los datos son válidos
            data = request.get_json()
            return jsonify({"mensaje": f"Hola {data['nombre']}!"})
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            if not data:
                raise APIError("No se proporcionaron datos JSON", 400)
            
            errors = []
            for field, field_type in schema.items():
                if field not in data:
                    errors.append(f"El campo '{field}' es requerido")
                elif not isinstance(data[field], field_type):
                    errors.append(f"El campo '{field}' debe ser de tipo {field_type.__name__}")
            
            if errors:
                raise APIError("Error de validación", 400, {"errors": errors})
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

def validate_required_fields(fields):
    """
    Decorador para validar que los campos requeridos estén presentes en las peticiones JSON.
    
    Args:
        fields: Una lista de campos requeridos.
               Ejemplo: ['nombre', 'email', 'password']
    
    Uso:
        @app.route('/ruta', methods=['POST'])
        @validate_required_fields(['nombre', 'email'])
        def mi_funcion():
            # Si llegamos aquí, los campos requeridos están presentes
            data = request.get_json()
            return jsonify({"mensaje": f"Hola {data['nombre']}!"})
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            if not data:
                raise APIError("No se proporcionaron datos JSON", 400)
            
            missing_fields = [field for field in fields if field not in data]
            if missing_fields:
                raise APIError(
                    "Campos requeridos faltantes", 
                    400, 
                    {"missing_fields": missing_fields}
                )
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
