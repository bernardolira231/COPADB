import { Route as AsistenciaRoute } from "../../routes/asistencia";
import Layout from "../../components/Layout";
import { Card, Container } from "@mui/material";
import { useMateria } from "../../context/MateriaContext";
import { useSearch, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/es";
import PageHeader from "./components/PageHeader";
import AttendanceInfo from "./components/AttendanceInfo";
import Actions from "./components/Actions";
import AttendanceTable from "./components/AttendanceTable";

const Asistencia = () => {
  const { materiaSeleccionada } = useMateria();
  const { fecha: fechaQuery } = useSearch({ from: AsistenciaRoute.id });
  const navigate = useNavigate();

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
    <Layout>
      <Container sx={{ mt: 3 }}>
        <PageHeader />
        <Card sx={{ p: 3, borderRadius: "8px" }}>
          <AttendanceInfo
            materiaSeleccionada={materiaSeleccionada}
            fecha={fecha}
            onFechaChange={handleFechaChange}
          />
          <Actions />
          <AttendanceTable />
        </Card>
      </Container>
    </Layout>
  );
};

export default Asistencia;
