class User:
    """
    Modelo que representa un usuario en el sistema.
    """
    def __init__(self, id=None, name=None, email=None, password=None, rol=None, lastname=None):
        self.id = id
        self.name = name
        self.email = email
        self.password = password  # Almacena solo el hash, nunca la contraseña en texto plano
        self.rol = rol
        self.lastname = lastname  # Campo opcional, podría no existir en la tabla actual
    
    @classmethod
    def from_dict(cls, data):
        """
        Crea una instancia de User a partir de un diccionario.
        """
        return cls(
            id=data.get('id'),
            name=data.get('name'),
            email=data.get('email'),
            password=data.get('password'),
            rol=data.get('rol'),
            lastname=data.get('lastname')
        )
    
    def to_dict(self, include_password=False):
        """
        Convierte el objeto User a un diccionario.
        
        Args:
            include_password: Si es True, incluye el hash de la contraseña en el resultado.
        """
        result = {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'rol': self.rol
        }
        
        # Incluir lastname solo si existe
        if hasattr(self, 'lastname') and self.lastname:
            result['lastname'] = self.lastname
            
        if include_password:
            result['password'] = self.password
            
        return result
    
    def __repr__(self):
        return f"<User {self.email}>"
