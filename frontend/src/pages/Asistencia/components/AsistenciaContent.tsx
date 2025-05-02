import React, { useState } from "react";
import { Container, Card, Button } from "@mui/material";
import dayjs, { Dayjs } from "dayjs";
import PageHeader from "../../../components/PageHeader";
import AttendanceInfo from "./AttendanceInfo";
import Actions from "./Actions";
import AttendanceTable from "./AttendanceTable";
import { useAttendance } from "../context/AttendanceContext";
import { LuSave } from "react-icons/lu";

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
  const { guardarAsistencia, saving } = useAttendance();
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
        <Button
          variant="contained"
          color="primary"
          onClick={guardarAsistencia}
          disabled={saving}
          sx={{ mt: 2 }}
        >
          <LuSave className="mr-2 h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Asistencia"}
        </Button>
      </Card>
    </Container>
  );
};

export default AsistenciaContent;
