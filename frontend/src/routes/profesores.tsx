import { createFileRoute } from '@tanstack/react-router'
import Profesores from '../pages/Profesores/Profesores'

export const Route = createFileRoute('/profesores')({
  component: Profesores,
})
