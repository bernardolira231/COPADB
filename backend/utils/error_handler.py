from flask import jsonify
import traceback

class APIError(Exception):
    """Clase base para errores de API personalizados"""
    def __init__(self, message, status_code=400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        error_dict = dict(self.payload or ())
        error_dict['message'] = self.message
        return error_dict

class NotFoundError(APIError):
    """Error para recursos no encontrados"""
    def __init__(self, message="Recurso no encontrado", payload=None):
        super().__init__(message, 404, payload)

class UnauthorizedError(APIError):
    """Error para accesos no autorizados"""
    def __init__(self, message="No autorizado", payload=None):
        super().__init__(message, 401, payload)

class ForbiddenError(APIError):
    """Error para accesos prohibidos"""
    def __init__(self, message="Acceso prohibido", payload=None):
        super().__init__(message, 403, payload)

def register_error_handlers(app):
    """Registra los manejadores de errores en la aplicación Flask"""
    
    @app.errorhandler(APIError)
    def handle_api_error(error):
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    @app.errorhandler(404)
    def handle_not_found(error):
        return jsonify({"message": "Recurso no encontrado"}), 404
    
    @app.errorhandler(400)
    def handle_bad_request(error):
        return jsonify({"message": "Solicitud incorrecta"}), 400
    
    @app.errorhandler(500)
    def handle_server_error(error):
        # En producción, no mostrar el error completo
        traceback.print_exc()
        return jsonify({"message": "Error interno del servidor"}), 500
