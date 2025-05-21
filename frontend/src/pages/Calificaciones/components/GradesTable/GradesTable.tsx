import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Tooltip,
} from "@mui/material";
import { useGradesContext } from "../../context/GradesContext";
import { Grade } from "../../../../hooks/useGrades";
import useSx from "./sx";

const GradesTable: React.FC = () => {
  const { grades, updateGrade, loading, error, currentPeriod } = useGradesContext();
  const sx = useSx();

  // Función para determinar el color de la calificación final
  const getGradeColor = (grade: number | undefined) => {
    if (!grade) return {};
    if (grade >= 9) return sx.highGrade;
    if (grade >= 7) return sx.mediumGrade;
    return sx.lowGrade;
  };

  // Función para validar y actualizar calificaciones
  const handleGradeChange = (
    studentId: number,
    field: keyof Omit<
      Grade,
      "id" | "student_id" | "student_name" | "group_id" | "final_grade" | "period"
    >,
    value: string
  ) => {
    // Convertir el valor a número
    const numericValue = value === "" ? 0 : parseFloat(value);
    
    // Validar que sea un número y esté en el rango correcto (0-10)
    if (!isNaN(numericValue) && numericValue >= 0 && numericValue <= 10) {
      updateGrade(studentId, field, numericValue);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (grades.length === 0) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography>No hay estudiantes en esta materia.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead sx={sx.tableHead}>
          <TableRow>
            <TableCell sx={sx.tableCell}>#</TableCell>
            <TableCell sx={sx.tableCell}>Nombre del Estudiante</TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Participación en clase (15%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Ejercicios y prácticas (15%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Tareas o trabajos (25%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Exámenes (35%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Asistencia a misa (10%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Promedio Final
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {grades.map((row, idx) => (
            <TableRow key={row.id}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{row.student_name}</TableCell>
              <TableCell align="center">
                {currentPeriod === 0 ? (
                  <Tooltip title="Promedio de los 4 parciales">
                    <Typography variant="body2">{row.class_participation}</Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={row.class_participation}
                    onChange={(e) =>
                      handleGradeChange(row.student_id, "class_participation", e.target.value)
                    }
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={sx.gradeInput}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {currentPeriod === 0 ? (
                  <Tooltip title="Promedio de los 4 parciales">
                    <Typography variant="body2">{row.exercises}</Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={row.exercises}
                    onChange={(e) =>
                      handleGradeChange(row.student_id, "exercises", e.target.value)
                    }
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={sx.gradeInput}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {currentPeriod === 0 ? (
                  <Tooltip title="Promedio de los 4 parciales">
                    <Typography variant="body2">{row.homework}</Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={row.homework}
                    onChange={(e) =>
                      handleGradeChange(row.student_id, "homework", e.target.value)
                    }
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={sx.gradeInput}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {currentPeriod === 0 ? (
                  <Tooltip title="Promedio de los 4 parciales">
                    <Typography variant="body2">{row.exams}</Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={row.exams}
                    onChange={(e) =>
                      handleGradeChange(row.student_id, "exams", e.target.value)
                    }
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={sx.gradeInput}
                  />
                )}
              </TableCell>
              <TableCell align="center">
                {currentPeriod === 0 ? (
                  <Tooltip title="Promedio de los 4 parciales">
                    <Typography variant="body2">{row.church_class}</Typography>
                  </Tooltip>
                ) : (
                  <TextField
                    variant="outlined"
                    size="small"
                    value={row.church_class}
                    onChange={(e) =>
                      handleGradeChange(row.student_id, "church_class", e.target.value)
                    }
                    inputProps={{ min: 0, max: 10, step: 0.1 }}
                    sx={sx.gradeInput}
                  />
                )}
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...sx.finalGradeCell, ...getGradeColor(row.final_grade) }}
              >
                <Tooltip title={currentPeriod === 0 ? "Promedio final de los 4 parciales" : "Calificación final del parcial"}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    {row.final_grade}
                  </Typography>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GradesTable;
