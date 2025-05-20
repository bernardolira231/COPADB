import React, { useState } from "react";
import { Container, Card, Button, Box } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import PageHeader from "../../../components/PageHeader";
import AttendanceInfo from "./AttendanceInfo";
import Actions from "./Actions";
import AttendanceTable from "./AttendanceTable";
import { useAttendance } from "../context/AttendanceContext";
import { LuSave, LuDownload } from "react-icons/lu";

interface AsistenciaContentProps {
  materiaSeleccionada: any;
  fechaQuery: string | undefined;
  navigate: any;
}

const AsistenciaContent: React.FC<AsistenciaContentProps> = ({
  materiaSeleccionada,
  fechaQuery,
  navigate,
}) => {
  const { guardarAsistencia, saving, downloadAttendanceReport, loading } =
    useAttendance();
  const [fecha, setFecha] = useState<Dayjs>(
    fechaQuery ? dayjs(fechaQuery) : dayjs()
  );

  const handleFechaChange = (newValue: any, _context?: any) => {
    if (newValue) {
      setFecha(dayjs(newValue));
      navigate({
        search: {
          fecha: dayjs(newValue).format("YYYY-MM-DD"),
        } as any,
        replace: true,
      });
    }
  };

  // Depuración para entender por qué el botón está desactivado
  console.log("Estado del botón:", {
    loading,
    materiaSeleccionadaId: materiaSeleccionada?.id,
    materiaSeleccionada,
    disabled: loading || !materiaSeleccionada?.id,
  });

  return (
    <Container sx={{ mt: 3 }}>
      <PageHeader>Listado de Asistencia</PageHeader>
      <Card sx={{ p: 3, borderRadius: "8px" }}>
        <AttendanceInfo
          materiaSeleccionada={materiaSeleccionada}
          fecha={fecha}
          onFechaChange={handleFechaChange}
        />
        <Actions />
        <AttendanceTable />
        <Box sx={{ display: "flex", gap: 2, mt: 2, justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              console.log("Descargando reporte para:", materiaSeleccionada);
              // Usamos el ID del grupo directamente si está disponible
              const groupId =
                materiaSeleccionada?.id ||
                materiaSeleccionada?.group_id ||
                materiaSeleccionada?.grade_id;
              if (groupId) {
                downloadAttendanceReport(groupId);
              } else {
                console.error("No se pudo determinar el ID del grupo");
              }
            }}
            disabled={loading}
          >
            <LuDownload className="mr-2 h-4 w-4" />
            {loading ? "Descargando..." : "Exportar Reporte"}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={guardarAsistencia}
            disabled={saving}
          >
            <LuSave className="mr-2 h-4 w-4" />
            {saving ? "Guardando..." : "Guardar Asistencia"}
          </Button>
        </Box>
      </Card>
    </Container>
  );
};

export default AsistenciaContent;
