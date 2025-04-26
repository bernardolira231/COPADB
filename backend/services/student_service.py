from repositories.student_repository import StudentRepository, FamilyRepository
from models.student import Student, Family
from utils.error_handler import APIError, NotFoundError

class StudentService:
    """
    Servicio para manejar la lógica relacionada con los estudiantes.
    """
    
    def __init__(self):
        self.student_repository = StudentRepository()
        self.family_repository = FamilyRepository()
    
    def register_student(self, student_data, family_data):
        """
        Registra un nuevo estudiante y su familia.
        
        Args:
            student_data: Diccionario con los datos del estudiante
            family_data: Diccionario con los datos de la familia
            
        Returns:
            dict: Diccionario con la información del estudiante registrado
        """
        # Verificar si ya existe una familia con el mismo email
        existing_family = self.family_repository.find_by_email(family_data.get('email_address'))
        
        if existing_family:
            # Si la familia ya existe, usar ese ID de familia
            family_id = existing_family.id
        else:
            # Crear una nueva familia
            new_family = Family(
                tutor_name=family_data.get('tutor_name'),
                tutor_lastname_f=family_data.get('tutor_lastname_f'),
                tutor_lastname_m=family_data.get('tutor_lastname_m'),
                phone_number=family_data.get('phone_number'),
                email_address=family_data.get('email_address'),
                emergency_phone_number=family_data.get('emergency_phone_number')
            )
            
            created_family = self.family_repository.create(new_family)
            family_id = created_family.id
        
        # Crear el estudiante
        new_student = Student(
            name=student_data.get('name'),
            lastname_f=student_data.get('lastname_f'),
            lastname_m=student_data.get('lastname_m'),
            birth_date=student_data.get('birth_date'),
            grade=student_data.get('grade'),
            family_id=family_id
        )
        
        created_student = self.student_repository.create(new_student)
        
        return {
            "message": "Estudiante registrado exitosamente",
            "student": created_student.to_dict(),
            "family_id": family_id
        }
    
    def get_student_by_id(self, student_id):
        """
        Obtiene la información de un estudiante por su ID.
        
        Args:
            student_id: ID del estudiante
            
        Returns:
            dict: Diccionario con la información del estudiante
        """
        student = self.student_repository.find_by_id(student_id)
        family = self.family_repository.find_by_id(student.family_id)
        
        return {
            "student": student.to_dict(),
            "family": family.to_dict()
        }
    
    def get_students_by_family(self, family_id):
        """
        Obtiene todos los estudiantes de una familia.
        
        Args:
            family_id: ID de la familia
            
        Returns:
            dict: Diccionario con la lista de estudiantes y la información de la familia
        """
        students = self.student_repository.find_by_family_id(family_id)
        family = self.family_repository.find_by_id(family_id)
        
        return {
            "students": [student.to_dict() for student in students],
            "family": family.to_dict()
        }
    
    def update_student(self, student_id, student_data):
        """
        Actualiza la información de un estudiante.
        
        Args:
            student_id: ID del estudiante
            student_data: Diccionario con los datos actualizados
            
        Returns:
            dict: Diccionario con la información actualizada del estudiante
        """
        # Obtener el estudiante actual
        current_student = self.student_repository.find_by_id(student_id)
        
        # Actualizar los campos
        updated_student = Student(
            id=student_id,
            name=student_data.get('name', current_student.name),
            lastname_f=student_data.get('lastname_f', current_student.lastname_f),
            lastname_m=student_data.get('lastname_m', current_student.lastname_m),
            birth_date=student_data.get('birth_date', current_student.birth_date),
            grade=student_data.get('grade', current_student.grade),
            family_id=current_student.family_id
        )
        
        # Guardar los cambios
        updated_student = self.student_repository.update(updated_student)
        
        return {
            "message": "Estudiante actualizado exitosamente",
            "student": updated_student.to_dict()
        }
