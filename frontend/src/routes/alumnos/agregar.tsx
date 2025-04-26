import { createFileRoute } from '@tanstack/react-router'
import Inscripciones from '../../pages/Alumnos/_add'

export const Route = createFileRoute('/alumnos/agregar')({
  component: Inscripciones,
})