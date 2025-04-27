import React, { ReactNode } from 'react';
import { Navigate } from '@tanstack/react-router';
import { useAuth } from '../../context/AuthContext';

interface RoleProtectedRouteProps {
  children: ReactNode;
  allowedRoles: number[];
  redirectTo?: string;
}

/**
 * Componente para proteger rutas basado en roles de usuario
 * @param children - Componentes hijos a renderizar si el usuario tiene acceso
 * @param allowedRoles - Array de roles permitidos para acceder a la ruta
 * @param redirectTo - Ruta a la que redirigir si el usuario no tiene acceso (por defecto: /Home)
 */
const RoleProtectedRoute: React.FC<RoleProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/Home'
}) => {
  const { user, initializing } = useAuth();

  // Si aún está cargando, mostrar un indicador de carga
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Verificar si el usuario está autenticado y tiene el rol adecuado
  const hasRequiredRole = user && allowedRoles.includes(user.rol);

  // Si no tiene el rol requerido, redirigir a la página especificada
  if (!hasRequiredRole) {
    console.log(`Acceso denegado: El usuario no tiene los roles requeridos ${allowedRoles.join(', ')}`);
    return <Navigate to={redirectTo} />;
  }

  // Si tiene el rol requerido, renderizar los componentes hijos
  return <>{children}</>;
};

export default RoleProtectedRoute;
