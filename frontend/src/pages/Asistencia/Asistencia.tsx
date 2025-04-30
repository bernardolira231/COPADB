import React from 'react';
import { useSearch } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Route as AsistenciaRoute } from '../../routes/asistencia';
import Layout from '../../components/Layout';
import { Container } from '@mui/material';

const Asistencia: React.FC = () => {
  const { fecha } = useSearch({ from: AsistenciaRoute.id });
  
  // Obtener la fecha actual si no se proporciona una
  const fechaActual = React.useMemo(() => {
    if (fecha) return fecha;
    // Usar la fecha actual con la zona horaria local correcta
    const now = new Date();
    return format(now, 'yyyy-MM-dd');
  }, [fecha]);
  
  // Formatear la fecha para mostrarla de manera amigable
  const fechaFormateada = React.useMemo(() => {
    try {
      // Usar parseISO para evitar problemas de zona horaria
      const date = parseISO(fechaActual);
      return format(date, "d 'de' MMMM 'de' yyyy", { locale: es });
    } catch (error) {
      return fechaActual;
    }
  }, [fechaActual]);

  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <h1>Asistencia - {fechaFormateada}</h1>
      </Container>
    </Layout>
  );
};

export default Asistencia;
