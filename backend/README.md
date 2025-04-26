# Backend COPADB - Estructura Modular

## Estructura del Backend

```
backend/
│── app_new.py        # Aplicación principal con estructura modular
│── run.py            # Archivo para ejecutar instrucciones en la base de datos
│── requirements.txt  # Dependencias necesarias para ejecutar el backend
│── .env              # Variables de entorno (configuración de la base de datos y JWT)
│── extensions.py     # Inicialización de extensiones de Flask (CORS, JWT, Bcrypt)
│
├── config/           # Configuración centralizada
│   │── __init__.py
│   └── config.py     # Configuración de la aplicación y base de datos
│
├── models/           # Modelos de datos (estructura)
│   │── __init__.py
│   │── user.py       # Modelo de usuario
│   │── subject.py    # Modelo de materias
│   └── student.py    # Modelo de estudiante y familia
│
├── routes/           # Rutas de la API organizadas por funcionalidad
│   │── __init__.py   # Registro de blueprints
│   │── auth_routes.py    # Rutas de autenticación (/api/login, /api/user/profile)
│   │── teacher_routes.py # Rutas de profesores (/api/profesor/materias)
│   └── student_routes.py # Rutas de estudiantes (/api/inscripciones)
│
└── utils/            # Utilidades y herramientas
    │── db.py         # Utilidad para conexiones a base de datos
    │── error_handler.py # Manejo centralizado de errores
    └── validators.py # Validadores de datos
```

---

## Instalación y Configuración

### 1. Crear y activar un entorno virtual
Para evitar conflictos de dependencias, se recomienda usar un entorno virtual:

#### En macOS/Linux
```bash
python3 -m venv venv
source venv/bin/activate
```

#### En Windows
```bash
python -m venv venv
venv\Scripts\activate
```

### 2. Instalar las dependencias
Ejecuta el siguiente comando para instalar las librerías necesarias desde `requirements.txt`:

```bash
pip install -r requirements.txt
```

Si se instalan nuevas dependencias, debes actualizar `requirements.txt` con:

```bash
pip freeze > requirements.txt
```

### 3. Configurar las variables de entorno (`.env`)
Crea un archivo `.env` en la carpeta `backend/` con el siguiente contenido:

```ini
DB_HOST=localhost
DB_PORT=5432
DB_NAME=copadb
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
JWT_SECRET_KEY=supersecretkey
```

---

## Ejecución del Backend

### Ejecutar el backend
Para iniciar el backend y permitir que el frontend se comunique con la API, ejecuta:

```bash
python app_new.py
```

El servidor Flask correrá en `http://localhost:5328`.

### Ejecutar comandos en la base de datos (`run.py`)
El archivo `run.py` permite ejecutar instrucciones en la base de datos, como crear un usuario administrador. Para ejecutarlo:

```bash
python run.py
```

---

## Trabajando con la Estructura Modular

### Creación de Nuevos Endpoints

Para crear un nuevo endpoint en la estructura modular, sigue estos pasos:

1. **Decide dónde ubicar tu endpoint**: Según su funcionalidad, puede ir en un archivo de rutas existente o puedes crear uno nuevo.

2. **Si necesitas crear un nuevo archivo de rutas**:
   - Crea un nuevo archivo en la carpeta `routes/`, por ejemplo `new_routes.py`
   - Define un blueprint con un prefijo de URL adecuado:
   ```python
   from flask import Blueprint, request, jsonify
   import psycopg2
   from psycopg2.extras import RealDictCursor
   from config.config import Config

   new_bp = Blueprint('new', __name__, url_prefix='/api/new')

   def get_db_connection():
       return psycopg2.connect(**Config.DB_CONFIG, cursor_factory=RealDictCursor)
   ```

3. **Añade tu endpoint al blueprint**:
   ```python
   @new_bp.route('/endpoint', methods=['GET', 'POST', 'OPTIONS'])
   def my_endpoint():
       # Manejo de solicitudes OPTIONS para CORS
       if request.method == "OPTIONS":
           response = jsonify({"message": "CORS preflight OK"})
           response.headers.add("Access-Control-Allow-Origin", "http://localhost:3001")
           response.headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
           response.headers.add("Access-Control-Allow-Headers", "Content-Type, Authorization")
           response.headers.add("Access-Control-Allow-Credentials", "true")
           return response, 204
           
       # Lógica para GET o POST
       try:
           # Tu código aquí
           return jsonify({"message": "Success"}), 200
       except Exception as e:
           import traceback
           traceback.print_exc()
           return jsonify({"message": "Error", "error": str(e)}), 500
   ```

4. **Registra el blueprint en `routes/__init__.py`**:
   ```python
   from routes.new_routes import new_bp
   
   def register_blueprints(app):
       # Otros blueprints existentes
       app.register_blueprint(new_bp)
   ```

### Autenticación JWT

Para proteger un endpoint con autenticación JWT:

```python
@new_bp.route('/protected', methods=['GET', 'OPTIONS'])
def protected_endpoint():
    if request.method == "OPTIONS":
        # Manejo de CORS como se mostró anteriormente
        return response, 204
        
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({"message": "Token no proporcionado o formato incorrecto"}), 401
        
    token = auth_header.split(' ')[1]
    
    try:
        from flask_jwt_extended import decode_token
        decoded_token = decode_token(token)
        user_id_str = decoded_token["sub"]
        user_id = int(user_id_str)
        
        # Continuar con la lógica del endpoint
        return jsonify({"message": "Endpoint protegido exitoso", "user_id": user_id}), 200
    except Exception as e:
        return jsonify({"message": "Error de autenticación", "error": str(e)}), 401
```

---

## Autenticación y Seguridad
- Implementa **JSON Web Tokens (JWT)** para la autenticación de usuarios.
- Las credenciales de usuario se almacenan en PostgreSQL y las contraseñas se **hashean con `bcrypt`**.
- Todas las rutas protegidas verifican el token JWT en el encabezado `Authorization`.

---

## Endpoints Disponibles

### `POST /api/login`
**Descripción:**  
Permite a los usuarios iniciar sesión enviando correo y contraseña.

**Request:**
```json
{
  "email": "admin@cedb.com",
  "password": "123456"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@cedb.com"
  }
}
```

### `GET /api/user/profile`
**Descripción:**  
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@cedb.com",
    "rol": 1
  }
}
```

### `GET /api/profesor/materias`
**Descripción:**  
Obtiene las materias asignadas a un profesor.

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response:**
```json
{
  "materias": [
    {
      "group_id": 1,
      "grado": "1A",
      "class_id": 1,
      "class_name": "Matemáticas"
    }
  ]
}
```

### `POST /api/inscripciones`
**Descripción:**  
Registra un nuevo estudiante y su familia.

**Request:**
```json
{
  "tutorNombre": "Nombre del Tutor",
  "tutorApellidoPaterno": "Apellido Paterno",
  "tutorApellidoMaterno": "Apellido Materno",
  "telefono": "1234567890",
  "emailTutor": "tutor@example.com",
  "telefonoEmergencia": "0987654321",
  "nombre": "Nombre del Estudiante",
  "apellidoPaterno": "Apellido Paterno",
  "apellidoMaterno": "Apellido Materno",
  "email": "estudiante@example.com",
  "tipoSangre": "O+",
  "alergias": "Ninguna",
  "beca": false,
  "capilla": "Capilla A",
  "campusEscolar": "Campus Principal",
  "permiso": true,
  "fechaRegistro": "2025-04-25"
}
```

**Response:**
```json
{
  "message": "Estudiante registrado exitosamente"
}
```

**¡Listo para usarse!** 