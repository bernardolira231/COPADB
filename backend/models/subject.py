class Subject:
    """
    Modelo que representa una materia o clase en el sistema.
    """
    def __init__(self, id=None, name=None):
        self.id = id
        self.name = name
    
    @classmethod
    def from_dict(cls, data):
        """
        Crea una instancia de Subject a partir de un diccionario.
        """
        return cls(
            id=data.get('id'),
            name=data.get('name')
        )
    
    def to_dict(self):
        """
        Convierte el objeto Subject a un diccionario.
        """
        return {
            'id': self.id,
            'name': self.name
        }
    
    def __repr__(self):
        return f"<Subject {self.name}>"


class Group:
    """
    Modelo que representa un grupo de clase en el sistema.
    """
    def __init__(self, id=None, grade=None, class_id=None, professor_id=None, class_name=None):
        self.id = id
        self.grade = grade
        self.class_id = class_id
        self.professor_id = professor_id
        self.class_name = class_name  # Campo calculado, no está en la tabla
    
    @classmethod
    def from_dict(cls, data):
        """
        Crea una instancia de Group a partir de un diccionario.
        """
        return cls(
            id=data.get('group_id'),
            grade=data.get('grado'),
            class_id=data.get('class_id'),
            professor_id=data.get('professor_id'),
            class_name=data.get('class_name')
        )
    
    def to_dict(self):
        """
        Convierte el objeto Group a un diccionario.
        """
        result = {
            'group_id': self.id,
            'grado': self.grade,
            'class_id': self.class_id
        }
        
        if self.class_name:
            result['class_name'] = self.class_name
            
        return result
    
    def __repr__(self):
        return f"<Group {self.grade}-{self.class_name}>"
