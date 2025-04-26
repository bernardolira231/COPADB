import { createFileRoute } from '@tanstack/react-router'
import  ListStudent from '../pages/Alumnos/_list'

export const Route = createFileRoute('/alumnos')({
  component: ListStudent,
})
