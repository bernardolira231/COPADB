import { createFileRoute } from '@tanstack/react-router'
import Inscripciones from '../../pages/Alumnos/_add'
import RoleProtectedRoute from '../../components/RouteProtection/RoleProtectedRoute'

export const Route = createFileRoute('/alumnos/agregar')({
  component: AddStudentWithRoleProtection,
})

// Componente envoltorio que aplica la protección de roles
function AddStudentWithRoleProtection() {
  // Roles permitidos: 1 (Administrador) y 2 (Administración)
  return (
    <RoleProtectedRoute allowedRoles={[1, 2]}>
      <Inscripciones />
    </RoleProtectedRoute>
  )
}