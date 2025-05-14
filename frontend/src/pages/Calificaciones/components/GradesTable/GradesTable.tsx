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
} from "@mui/material";
import { useGradesContext } from "../../context/GradesContext";
import useSx from "./sx";

const GradesTable: React.FC = () => {
  const { grades, loading, error, updateGrade } = useGradesContext();
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
    id: number,
    field: keyof Omit<
      (typeof grades)[0],
      "id" | "student_id" | "student_name" | "final_grade"
    >,
    value: string
  ) => {
    const numValue = parseFloat(value);
    // Validar que sea un número entre 0 y 10
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 10) {
      updateGrade(id, field, numValue);
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
              Examen 1 (25%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Examen 2 (25%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Proyecto (35%)
            </TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Participación (15%)
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
                <TextField
                  variant="outlined"
                  size="small"
                  value={row.exam1}
                  onChange={(e) =>
                    handleGradeChange(row.id, "exam1", e.target.value)
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={sx.gradeInput}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  variant="outlined"
                  size="small"
                  value={row.exam2}
                  onChange={(e) =>
                    handleGradeChange(row.id, "exam2", e.target.value)
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={sx.gradeInput}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  variant="outlined"
                  size="small"
                  value={row.project}
                  onChange={(e) =>
                    handleGradeChange(row.id, "project", e.target.value)
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={sx.gradeInput}
                />
              </TableCell>
              <TableCell align="center">
                <TextField
                  variant="outlined"
                  size="small"
                  value={row.participation}
                  onChange={(e) =>
                    handleGradeChange(row.id, "participation", e.target.value)
                  }
                  inputProps={{ min: 0, max: 10, step: 0.1 }}
                  sx={sx.gradeInput}
                />
              </TableCell>
              <TableCell
                align="center"
                sx={{ ...sx.finalGradeCell, ...getGradeColor(row.final_grade) }}
              >
                {row.final_grade}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GradesTable;
