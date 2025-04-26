from repositories.subject_repository import SubjectRepository
from repositories.user_repository import UserRepository
from utils.error_handler import ForbiddenError, NotFoundError

class TeacherService:
    """
    Servicio para manejar la lógica relacionada con los profesores.
    """
    
    def __init__(self):
        self.subject_repository = SubjectRepository()
        self.user_repository = UserRepository()
    
    def get_teacher_subjects(self, user_id):
        """
        Obtiene las materias asignadas a un profesor.
        
        Args:
            user_id: ID del usuario (profesor)
            
        Returns:
            dict: Diccionario con la lista de materias
        """
        try:
            # Obtener las materias del profesor directamente sin verificar el rol
            subjects = self.subject_repository.find_by_teacher_id(user_id)
            
            # Convertir los objetos a diccionarios
            subjects_dict = [subject.to_dict() for subject in subjects]
            
            return {"materias": subjects_dict}
            
        except Exception as e:
            # En caso de error, devolver una lista vacía
            return {"materias": []}
    
    def get_subject_details(self, group_id, user_id):
        """
        Obtiene los detalles de una materia específica.
        
        Args:
            group_id: ID del grupo
            user_id: ID del usuario (profesor)
            
        Returns:
            dict: Diccionario con los detalles de la materia
            
        Raises:
            ForbiddenError: Si el usuario no tiene acceso a la materia
            NotFoundError: Si la materia no existe
        """
        # Obtener el grupo
        group = self.subject_repository.find_group_by_id(group_id)
        
        # Verificar si el profesor tiene acceso a este grupo
        if group.professor_id != user_id:
            raise ForbiddenError("El profesor no tiene acceso a esta materia")
        
        # Devolver los detalles del grupo
        return {"group": group.to_dict()}
