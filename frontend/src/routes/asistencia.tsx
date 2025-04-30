import { createFileRoute } from '@tanstack/react-router'
import Asistencia from '../pages/Asistencia'
import { format } from 'date-fns'

export const Route = createFileRoute('/asistencia')({
  component: Asistencia,
  validateSearch: (search) => {
    const hoy = format(new Date(), 'yyyy-MM-dd')
    // Validar que fecha sea una fecha válida si está presente
    const { fecha } = search
    return {
      // Si no hay fecha, usar la fecha actual
      fecha: fecha ? String(fecha) : hoy
    }
  }
})
