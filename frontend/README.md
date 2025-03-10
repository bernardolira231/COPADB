

 # 🚀 Frontend del Proyecto COPADB
 
 Este repositorio contiene el código del **frontend** del sistema COPADB, desarrollado con **React** y **@tanstack/react-router** para la navegación.
 
 ---
 
 ## 📂 **Estructura del Proyecto**
 
 ``` 
 frontend/
 │── src/
 │   ├── pages/         # Páginas principales de la aplicación
 │   ├── routes/        # Definición de rutas con @tanstack/react-router
 │   ├── components/    # Componentes reutilizables
 │   ├── styles/        # Estilos globales
 │   ├── main.tsx       # Archivo principal de React
 │   ├── App.tsx        # Componente principal de la app
 │── public/            # Archivos estáticos
 │── package.json       # Dependencias del proyecto
 │── vite.config.ts     # Configuración de Vite
 ```
 
 ---
 
 ## 📦 **Instalación y Configuración**
 
 ### 📥 1. Instalar las dependencias
 Antes de ejecutar el frontend, asegúrate de instalar todas las dependencias:
 
 ```bash
 npm install
 ```
 
 ### 🚀 2. Ejecutar el servidor de desarrollo
 Para iniciar el frontend en modo desarrollo:
 
 ```bash
 npm run dev
 ```
 El frontend estará disponible en `http://localhost:3001`.
 
 ---
 
## 🌍 **Creación de Nuevas Rutas**
El proyecto usa **@tanstack/react-router** para manejar la navegación. Las rutas están definidas en `src/routes/`.
 
### 📌 **Ejemplo de cómo crear una nueva ruta**
 1. **Crear una nueva carpeta en `src/pages/` con el mismo nombre del componente** (Ejemplo: `Profile/`).
 2. **Dentro de esa carpeta, crear el archivo del componente (`Profile.tsx`) y un `index.ts`**.
 3. **Definir la ruta con `createFileRoute` en `src/routes/`**:
 
 ```tsx
 import { createFileRoute } from '@tanstack/react-router'
 import ProfilePage from '../pages/Profile'
 
 export const Route = createFileRoute('/profile')({
   component: ProfilePage,
 })
 ```
 
 4. **Estructura correcta del componente en `src/pages/Profile/`**:
 
 ```
 src/pages/Profile/
 │── Profile.tsx  # Componente principal de la página
 │── index.ts     # Simplifica la importación del componente
 ```
 
 5. **El contenido de `index.ts` debe ser:**
 
 ```tsx
 import Profile from './Profile'

export default Profile
 ```
 
 6. **Esto permite importar el componente sin especificar el archivo en `routes/`:**
 
 ```tsx
 import ProfilePage from '../pages/Profile'
 ```
 
 7. **¡Listo!** Ahora puedes acceder a `/profile` en el navegador.
 
 ---
 
 ## 🔑 **Autenticación y Protección de Rutas**
 El sistema verifica el token almacenado en `localStorage` para proteger rutas privadas.
 
 ### 📌 **Verificación de sesión en `__root.tsx`**
 El archivo `src/routes/__root.tsx` contiene la lógica para redirigir a los usuarios no autenticados:
 
 ```tsx
 function RootComponent() {
   const token = localStorage.getItem('token')
   if (!token && window.location.pathname !== "/") {
     window.location.href = "/"
     return null
   }
   return (
     <>
       <Outlet />
     </>
   )
 }
 ```
 
 Si el usuario no tiene un token válido, será redirigido al login (`/`).
 
 ---
 
 ## 📜 **Otras Consideraciones Importantes**
 - **El token de autenticación se guarda en `localStorage`** después de iniciar sesión.
 - **Las rutas están separadas en archivos individuales dentro de `src/routes/`** para mantener el código organizado.
 - **El proyecto usa `Vite` como empaquetador** para un desarrollo más rápido.
 - **Se recomienda utilizar `TanStack Query`** para manejar peticiones a la API de manera eficiente.
 
 ---
 