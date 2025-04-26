from utils.db import get_db_connection
from models.student import Student, Family
from utils.error_handler import NotFoundError

class StudentRepository:
    """
    Repositorio para acceder a los datos de estudiantes en la base de datos.
    """
    
    def find_by_id(self, student_id):
        """
        Busca un estudiante por su ID.
        
        Args:
            student_id: ID del estudiante a buscar
            
        Returns:
            Student: Objeto de estudiante si se encuentra
            
        Raises:
            NotFoundError: Si el estudiante no existe
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, name, lastname_f, lastname_m, birth_date, grade, family_id
                    FROM student
                    WHERE id = %s
                """, (student_id,))
                
                student_data = cur.fetchone()
                
                if not student_data:
                    raise NotFoundError(f"Estudiante con ID {student_id} no encontrado")
                
                return Student.from_dict(student_data)
    
    def find_by_family_id(self, family_id):
        """
        Busca estudiantes por el ID de su familia.
        
        Args:
            family_id: ID de la familia
            
        Returns:
            list: Lista de objetos Student
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, name, lastname_f, lastname_m, birth_date, grade, family_id
                    FROM student
                    WHERE family_id = %s
                """, (family_id,))
                
                students = [Student.from_dict(row) for row in cur.fetchall()]
                return students
    
    def create(self, student):
        """
        Crea un nuevo estudiante en la base de datos.
        
        Args:
            student: Objeto Student con los datos del estudiante a crear
            
        Returns:
            Student: Objeto Student con el ID asignado
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO student (name, lastname_f, lastname_m, birth_date, grade, family_id)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    student.name,
                    student.lastname_f,
                    student.lastname_m,
                    student.birth_date,
                    student.grade,
                    student.family_id
                ))
                
                student_id = cur.fetchone()['id']
                student.id = student_id
                
                return student
    
    def update(self, student):
        """
        Actualiza un estudiante existente en la base de datos.
        
        Args:
            student: Objeto Student con los datos actualizados
            
        Returns:
            Student: Objeto Student actualizado
            
        Raises:
            NotFoundError: Si el estudiante no existe
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    UPDATE student
                    SET name = %s, lastname_f = %s, lastname_m = %s, 
                        birth_date = %s, grade = %s, family_id = %s
                    WHERE id = %s
                    RETURNING id
                """, (
                    student.name,
                    student.lastname_f,
                    student.lastname_m,
                    student.birth_date,
                    student.grade,
                    student.family_id,
                    student.id
                ))
                
                if cur.rowcount == 0:
                    raise NotFoundError(f"Estudiante con ID {student.id} no encontrado")
                
                return student


class FamilyRepository:
    """
    Repositorio para acceder a los datos de familias en la base de datos.
    """
    
    def find_by_id(self, family_id):
        """
        Busca una familia por su ID.
        
        Args:
            family_id: ID de la familia a buscar
            
        Returns:
            Family: Objeto de familia si se encuentra
            
        Raises:
            NotFoundError: Si la familia no existe
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, tutor_name, tutor_lastname_f, tutor_lastname_m,
                           phone_number, email_address, emergency_phone_number
                    FROM family
                    WHERE id = %s
                """, (family_id,))
                
                family_data = cur.fetchone()
                
                if not family_data:
                    raise NotFoundError(f"Familia con ID {family_id} no encontrada")
                
                return Family.from_dict(family_data)
    
    def find_by_email(self, email):
        """
        Busca una familia por su dirección de email.
        
        Args:
            email: Email de la familia a buscar
            
        Returns:
            Family: Objeto de familia si se encuentra
            None: Si no se encuentra ninguna familia con ese email
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT id, tutor_name, tutor_lastname_f, tutor_lastname_m,
                           phone_number, email_address, emergency_phone_number
                    FROM family
                    WHERE email_address = %s
                """, (email,))
                
                family_data = cur.fetchone()
                
                if not family_data:
                    return None
                
                return Family.from_dict(family_data)
    
    def create(self, family):
        """
        Crea una nueva familia en la base de datos.
        
        Args:
            family: Objeto Family con los datos de la familia a crear
            
        Returns:
            Family: Objeto Family con el ID asignado
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    INSERT INTO family (
                        tutor_name, tutor_lastname_f, tutor_lastname_m,
                        phone_number, email_address, emergency_phone_number
                    )
                    VALUES (%s, %s, %s, %s, %s, %s)
                    RETURNING id
                """, (
                    family.tutor_name,
                    family.tutor_lastname_f,
                    family.tutor_lastname_m,
                    family.phone_number,
                    family.email_address,
                    family.emergency_phone_number
                ))
                
                family_id = cur.fetchone()['id']
                family.id = family_id
                
                return family
