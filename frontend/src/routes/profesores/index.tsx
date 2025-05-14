import { createFileRoute } from '@tanstack/react-router'
import ListProfesores from '../../pages/Profesores/_list'
import RoleProtectedRoute from '../../components/RouteProtection/RoleProtectedRoute'

export const Route = createFileRoute('/profesores/')({
  component: ProfesoresWithRoleProtection,
})

// Componente envoltorio que aplica la protección de roles
function ProfesoresWithRoleProtection() {
  // Roles permitidos: 1 (Administrador) y 2 (Administración)
  return (
    <RoleProtectedRoute allowedRoles={[1, 2]}>
      <ListProfesores />
    </RoleProtectedRoute>
  )
}
