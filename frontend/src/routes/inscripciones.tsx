import { createFileRoute } from '@tanstack/react-router'
import  Inscripciones from '../pages/Inscripciones/Inscripciones'

export const Route = createFileRoute('/inscripciones')({
  component: Inscripciones,
})
