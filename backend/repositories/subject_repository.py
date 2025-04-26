from utils.db import get_db_connection
from models.subject import Subject, Group
from utils.error_handler import NotFoundError

class SubjectRepository:
    """
    Repositorio para acceder a los datos de materias en la base de datos.
    """
    
    def find_all(self):
        """
        Obtiene todas las materias.
        
        Returns:
            list: Lista de objetos Subject
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name FROM class")
                subjects = [Subject.from_dict(row) for row in cur.fetchall()]
                return subjects
    
    def find_by_id(self, subject_id):
        """
        Busca una materia por su ID.
        
        Args:
            subject_id: ID de la materia a buscar
            
        Returns:
            Subject: Objeto de materia si se encuentra
            
        Raises:
            NotFoundError: Si la materia no existe
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("SELECT id, name FROM class WHERE id = %s", (subject_id,))
                subject_data = cur.fetchone()
                
                if not subject_data:
                    raise NotFoundError(f"Materia con ID {subject_id} no encontrada")
                
                return Subject.from_dict(subject_data)
    
    def find_by_teacher_id(self, teacher_id):
        """
        Obtiene todas las materias asignadas a un profesor.
        
        Args:
            teacher_id: ID del profesor
            
        Returns:
            list: Lista de objetos Group con información de las materias
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        g.id        AS group_id,
                        g.grade     AS grado,
                        c.id        AS class_id,
                        c.name      AS class_name
                    FROM "group" g
                    JOIN class c
                        ON c.id = g.class_id
                    WHERE g.professor_id = %s
                """, (teacher_id,))
                
                groups = [Group.from_dict(row) for row in cur.fetchall()]
                return groups
    
    def find_group_by_id(self, group_id):
        """
        Busca un grupo por su ID.
        
        Args:
            group_id: ID del grupo a buscar
            
        Returns:
            Group: Objeto de grupo si se encuentra
            
        Raises:
            NotFoundError: Si el grupo no existe
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT 
                        g.id        AS group_id,
                        g.grade     AS grado,
                        g.class_id  AS class_id,
                        g.professor_id,
                        c.name      AS class_name
                    FROM "group" g
                    JOIN class c
                        ON c.id = g.class_id
                    WHERE g.id = %s
                """, (group_id,))
                
                group_data = cur.fetchone()
                
                if not group_data:
                    raise NotFoundError(f"Grupo con ID {group_id} no encontrado")
                
                return Group.from_dict(group_data)
    
    def create_subject(self, subject):
        """
        Crea una nueva materia en la base de datos.
        
        Args:
            subject: Objeto Subject con los datos de la materia a crear
            
        Returns:
            Subject: Objeto Subject con el ID asignado
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO class (name) VALUES (%s) RETURNING id",
                    (subject.name,)
                )
                
                subject_id = cur.fetchone()['id']
                subject.id = subject_id
                
                return subject
    
    def create_group(self, group):
        """
        Crea un nuevo grupo en la base de datos.
        
        Args:
            group: Objeto Group con los datos del grupo a crear
            
        Returns:
            Group: Objeto Group con el ID asignado
        """
        with get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO "group" (grade, class_id, professor_id)
                    VALUES (%s, %s, %s)
                    RETURNING id
                    """,
                    (group.grade, group.class_id, group.professor_id)
                )
                
                group_id = cur.fetchone()['id']
                group.id = group_id
                
                return group
