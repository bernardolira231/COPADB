# Proyecto: Backend y Frontend

Este repositorio contiene dos carpetas principales:

- **backend/**: Contiene un entorno virtual de Python con Flask instalado.
- **frontend/**: Contiene un proyecto creado con Vite para usar React con JavaScript.

A continuación, se detallan los pasos para configurar y ejecutar ambas partes del proyecto.

---

## 📌 Backend (Flask)

### 🔹 Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- Python 3
- pip (gestor de paquetes de Python)
- virtualenv (para entornos virtuales, si no lo tienes, instálalo con `pip install virtualenv`)

### 🔹 Configuración del entorno
1. Abre una terminal y navega hasta la carpeta `backend`:
   ```sh
   cd backend
   ```
2. Crea un entorno virtual de Python:
   ```sh
   python -m venv env
   ```
3. Activa el entorno virtual:
   - En Windows:
     ```sh
     env\Scripts\activate
     ```
   - En macOS/Linux:
     ```sh
     source env/bin/activate
     ```
4. Instala las dependencias desde `requirements.txt`:
   ```sh
   pip install -r requirements.txt
   ```
5. Para ejecutar el servidor Flask:
   ```sh
   python app.py
   ```

---

## 📌 Frontend (React con Vite)

### 🔹 Requisitos previos
Antes de comenzar, asegúrate de tener instalado:
- Node.js (descárgalo desde [aquí](https://nodejs.org/))
- npm (viene con Node.js)

### 🔹 Instalación y ejecución
1. Abre una terminal y navega hasta la carpeta `frontend`:
   ```sh
   cd frontend
   ```
2. Instala las dependencias del proyecto:
   ```sh
   npm install
   ```
3. Para ejecutar el servidor de desarrollo:
   ```sh
   npm run dev
   ```
4. Accede a la aplicación en el navegador mediante la URL que se muestra en la terminal.

---

## 🚀 Contribución
Si deseas contribuir a este proyecto, por favor sigue las siguientes pautas:
- Crea una nueva rama para tu funcionalidad o corrección de errores.
- Asegúrate de probar los cambios antes de hacer un pull request.

¡Disfruta trabajando en este proyecto! 🎉

