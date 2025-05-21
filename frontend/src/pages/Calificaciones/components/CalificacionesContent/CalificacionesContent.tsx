import React from "react";
import { Container, Card, Button, Box, Typography, Tabs, Tab } from "@mui/material";
import { LuSave, LuFileDown } from "react-icons/lu";
import PageInfo from "../PageInfo";
import GradesTable from "../GradesTable";
import { useGradesContext } from "../../context/GradesContext";

interface CalificacionesContentProps {
  materiaSeleccionada: any;
}

const CalificacionesContent: React.FC<CalificacionesContentProps> = ({
  materiaSeleccionada,
}) => {
  const { saveGrades, saving, calculateFinalGrades, grades, downloadGradesReport, fetchGrades, currentPeriod, setPeriod } =
    useGradesContext();
    
  // Cargar las calificaciones cuando cambie la materia seleccionada
  React.useEffect(() => {
    // Usar una referencia para evitar múltiples solicitudes
    const groupId = materiaSeleccionada?.group_id;
    if (groupId) {
      console.log(`Cargando calificaciones para el grupo ${groupId} (una sola vez)`);
      // Usar un timeout para evitar múltiples llamadas
      const timer = setTimeout(() => {
        fetchGrades(groupId);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [materiaSeleccionada?.group_id]); // Solo depender del ID del grupo, no de fetchGrades

  // Función para guardar calificaciones
  const handleSaveGrades = () => {
    // Calcular calificaciones finales antes de guardar
    calculateFinalGrades();
    // Guardar calificaciones
    saveGrades();
  };
  
  // Función para descargar el reporte de calificaciones
  const handleDownloadReport = () => {
    // Calcular calificaciones finales antes de exportar
    calculateFinalGrades();
    
    if (materiaSeleccionada && materiaSeleccionada.group_id) {
      downloadGradesReport(materiaSeleccionada.group_id, currentPeriod);
    }
  };

  // Manejar el cambio de pestaña (periodo)
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    // Si es la pestaña 5 (índice 4), es la pestaña de calificación final
    if (newValue === 5) {
      setPeriod(0); // Usamos 0 para indicar que es la pestaña de calificación final
    } else {
      setPeriod(newValue);
      if (materiaSeleccionada && materiaSeleccionada.group_id) {
        fetchGrades(materiaSeleccionada.group_id, newValue);
      }
    }
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card sx={{ p: 3, borderRadius: "8px" }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <PageInfo materiaSeleccionada={materiaSeleccionada} />
        </Box>
        <Box sx={{ width: '100%', mb: 2 }}>
          <Tabs
            value={currentPeriod === 0 ? 5 : currentPeriod}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="pestañas de parciales"
          >
            <Tab label="Primer Parcial" value={1} />
            <Tab label="Segundo Parcial" value={2} />
            <Tab label="Tercer Parcial" value={3} />
            <Tab label="Cuarto Parcial" value={4} />
            <Tab label="Calificación Final" value={5} />
          </Tabs>
        </Box>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>
          {currentPeriod === 0 
            ? 'Calificación Final (Promedio de los 4 parciales)' 
            : `Calificaciones del ${currentPeriod === 1 ? 'Primer' : currentPeriod === 2 ? 'Segundo' : currentPeriod === 3 ? 'Tercer' : 'Cuarto'} Parcial`}
        </Typography>
        <GradesTable />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<LuSave />}
            onClick={handleSaveGrades}
            disabled={saving || !materiaSeleccionada || currentPeriod === 0}
            sx={{ mr: 2 }}
            title={currentPeriod === 0 ? "No se pueden guardar calificaciones en la vista de calificación final" : ""}
          >
            Guardar Calificaciones
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<LuFileDown />}
            onClick={handleDownloadReport}
            disabled={!materiaSeleccionada || currentPeriod === 0}
            title={currentPeriod === 0 ? "No se pueden descargar reportes en la vista de calificación final" : ""}
          >
            Descargar Reporte
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default CalificacionesContent;
