import Calificaciones from "../pages/Calificaciones";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/calificaciones")({
  component: Calificaciones,
});
