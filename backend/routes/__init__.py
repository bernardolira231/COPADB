from routes.auth_routes import auth_bp
from routes.teacher_routes import teacher_bp
from routes.student_routes import student_bp
from routes.user_routes import user_bp
from routes.attendance_routes import attendance_bp
from routes.grades_routes import grades_bp

def register_blueprints(app):
    """
    Registra todos los blueprints en la aplicación Flask.
    
    Args:
        app: Instancia de la aplicación Flask
    """
    app.register_blueprint(auth_bp)
    app.register_blueprint(teacher_bp)
    app.register_blueprint(student_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(grades_bp)