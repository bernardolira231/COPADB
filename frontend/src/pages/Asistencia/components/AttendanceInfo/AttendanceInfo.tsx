import React from "react";
import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import useSx from "./sx";

interface AttendanceInfoProps {
  materiaSeleccionada: { class_name?: string } | null;
  fecha: Dayjs;
  onFechaChange: (value: any, context?: any) => void;
}

const AttendanceInfo: React.FC<AttendanceInfoProps> = ({
  materiaSeleccionada,
  fecha,
  onFechaChange,
}) => {
  const sx = useSx();

  return (
    <>
      <Box sx={sx.container}>
        <Typography variant="h5" sx={sx.title}>
          {materiaSeleccionada ? materiaSeleccionada.class_name : "Mate 1"}
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
          <DatePicker
            value={fecha}
            onChange={onFechaChange}
            format="DD [de] MMMM [de] YYYY"
            slotProps={{ textField: { size: "small" } }}
            maxDate={dayjs().endOf("day")}
          />
        </LocalizationProvider>
      </Box>
      <Typography variant="subtitle1" sx={sx.subtitle}>
        Registra la asistencia de los estudiantes para la clase de hoy.
      </Typography>
    </>
  );
};

export default AttendanceInfo;
