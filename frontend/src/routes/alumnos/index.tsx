import { createFileRoute } from '@tanstack/react-router'
import ListStudent from '../../pages/Alumnos/_list'
import RoleProtectedRoute from '../../components/RouteProtection/RoleProtectedRoute'

export const Route = createFileRoute('/alumnos/')({
  component: StudentsWithRoleProtection,
})

// Componente envoltorio que aplica la protección de roles
function StudentsWithRoleProtection() {
  // Roles permitidos: 1 (Administrador) y 2 (Administración)
  return (
    <RoleProtectedRoute allowedRoles={[1, 2]}>
      <ListStudent />
    </RoleProtectedRoute>
  )
}
