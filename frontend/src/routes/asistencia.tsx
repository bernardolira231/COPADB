import { createFileRoute } from '@tanstack/react-router'
import Asistencia from '../pages/Asistencia'

export const Route = createFileRoute('/asistencia')({
  component: Asistencia,
  validateSearch: (search) => {
    // Validar que fecha sea una fecha válida si está presente
    const { fecha } = search
    return {
      fecha: fecha ? String(fecha) : undefined
    }
  }
})
