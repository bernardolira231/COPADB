import React from "react";
import { useSearch } from "@tanstack/react-router";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { Route as AsistenciaRoute } from "../../routes/asistencia";
import Layout from "../../components/Layout";
import { Card, Container, Typography } from "@mui/material";
import { useMateria } from "../../context/MateriaContext";

const Asistencia: React.FC = () => {
  const { fecha } = useSearch({ from: AsistenciaRoute.id });
  const { materiaSeleccionada } = useMateria();

  // Formatear la fecha para mostrarla de manera amigable
  const fechaFormateada = React.useMemo(() => {
    try {
      // Usar parseISO para evitar problemas de zona horaria
      const date = parseISO(fecha);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return fecha;
    }
  }, [fecha]);

  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          fontWeight="bold"
        >
          Listado de Asistencia - {fechaFormateada}
          <Card sx={{ mt: 2, p: 2 }}>
            <Typography variant="h6" sx={{
              fontWeight: "bold",
              mb: 1,
              color: "#09090B",
              fontSize: "1.5rem"
            }}>
              {materiaSeleccionada ? materiaSeleccionada.class_name : "Mate 1"}
            </Typography>
            <Typography variant="subtitle1" sx={{
              color: "#09090B",
              fontSize: "0.87rem"
            }}>
              Registra la asistencia de los estudiantes para la clase de hoy.
            </Typography>
          </Card>
        </Typography>
      </Container>
    </Layout>
  );
};

export default Asistencia;
