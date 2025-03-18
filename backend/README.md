## 📂 Estructura del Backend

```
backend/
│── app.py        # Archivo principal donde se configuran rutas y lógica del backend
│── run.py        # Archivo para ejecutar instrucciones en la base de datos
│── requirements.txt  # Dependencias necesarias para ejecutar el backend
│── .env          # Variables de entorno (configuración de la base de datos y JWT)
```

---

## ⚙️ Instalación y Configuración

### 📦 1. Crear y activar un entorno virtual
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

### 📜 2. Instalar las dependencias
Ejecuta el siguiente comando para instalar las librerías necesarias desde `requirements.txt`:

```bash
pip install -r requirements.txt
```

Si se instalan nuevas dependencias, debes actualizar `requirements.txt` con:

```bash
pip freeze > requirements.txt
```

### 🔑 3. Configurar las variables de entorno (`.env`)
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

## 🚀 Ejecución del Backend

### 📌 Ejecutar el backend (`app.py`)
Para iniciar el backend y permitir que el frontend se comunique con la API, ejecuta:

```bash
python app.py
```

El servidor Flask correrá en `http://localhost:5000`.

### 🛠 Ejecutar comandos en la base de datos (`run.py`)
El archivo `run.py` permite ejecutar instrucciones en la base de datos, como crear un usuario administrador. Para ejecutarlo:

```bash
python run.py
```

---

## 🔑 Autenticación y Seguridad
- Implementa **JSON Web Tokens (JWT)** para la autenticación de usuarios.
- Las credenciales de usuario se almacenan en PostgreSQL y las contraseñas se **hashean con `bcrypt`**.

---

## 📡 Endpoints Disponibles

### 🔹 `POST /api/login`
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

🚀 **¡Listo para usarse!** 💻