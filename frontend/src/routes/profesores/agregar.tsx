import { createFileRoute } from '@tanstack/react-router'
import AgregarProfesor from '../../pages/Profesores/_add'
import RoleProtectedRoute from '../../components/RouteProtection/RoleProtectedRoute'

export const Route = createFileRoute('/profesores/agregar')({
  component: AddProfesorWithRoleProtection,
})

// Componente envoltorio que aplica la protección de roles
function AddProfesorWithRoleProtection() {
  // Roles permitidos: 1 (Administrador) y 2 (Administración)
  return (
    <RoleProtectedRoute allowedRoles={[1, 2]}>
      <AgregarProfesor />
    </RoleProtectedRoute>
  )
}
