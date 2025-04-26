class Student:
    """
    Modelo que representa un estudiante en el sistema.
    """
    def __init__(self, id=None, name=None, lastname_f=None, lastname_m=None, 
                 birth_date=None, grade=None, family_id=None):
        self.id = id
        self.name = name
        self.lastname_f = lastname_f
        self.lastname_m = lastname_m
        self.birth_date = birth_date
        self.grade = grade
        self.family_id = family_id
    
    @classmethod
    def from_dict(cls, data):
        """
        Crea una instancia de Student a partir de un diccionario.
        """
        return cls(
            id=data.get('id'),
            name=data.get('name'),
            lastname_f=data.get('lastname_f'),
            lastname_m=data.get('lastname_m'),
            birth_date=data.get('birth_date'),
            grade=data.get('grade'),
            family_id=data.get('family_id')
        )
    
    def to_dict(self):
        """
        Convierte el objeto Student a un diccionario.
        """
        return {
            'id': self.id,
            'name': self.name,
            'lastname_f': self.lastname_f,
            'lastname_m': self.lastname_m,
            'birth_date': self.birth_date,
            'grade': self.grade,
            'family_id': self.family_id
        }
    
    def __repr__(self):
        return f"<Student {self.name} {self.lastname_f}>"


class Family:
    """
    Modelo que representa una familia en el sistema.
    """
    def __init__(self, id=None, tutor_name=None, tutor_lastname_f=None, 
                 tutor_lastname_m=None, phone_number=None, email_address=None, 
                 emergency_phone_number=None):
        self.id = id
        self.tutor_name = tutor_name
        self.tutor_lastname_f = tutor_lastname_f
        self.tutor_lastname_m = tutor_lastname_m
        self.phone_number = phone_number
        self.email_address = email_address
        self.emergency_phone_number = emergency_phone_number
    
    @classmethod
    def from_dict(cls, data):
        """
        Crea una instancia de Family a partir de un diccionario.
        """
        return cls(
            id=data.get('id'),
            tutor_name=data.get('tutor_name'),
            tutor_lastname_f=data.get('tutor_lastname_f'),
            tutor_lastname_m=data.get('tutor_lastname_m'),
            phone_number=data.get('phone_number'),
            email_address=data.get('email_address'),
            emergency_phone_number=data.get('emergency_phone_number')
        )
    
    def to_dict(self):
        """
        Convierte el objeto Family a un diccionario.
        """
        return {
            'id': self.id,
            'tutor_name': self.tutor_name,
            'tutor_lastname_f': self.tutor_lastname_f,
            'tutor_lastname_m': self.tutor_lastname_m,
            'phone_number': self.phone_number,
            'email_address': self.email_address,
            'emergency_phone_number': self.emergency_phone_number
        }
    
    def __repr__(self):
        return f"<Family {self.tutor_name} {self.tutor_lastname_f}>"
