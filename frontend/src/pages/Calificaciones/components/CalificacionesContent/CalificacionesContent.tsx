import React from "react";
import { Container, Card, Button } from "@mui/material";
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
  const { saveGrades, saving, calculateFinalGrades, grades } =
    useGradesContext();

  // Función para exportar calificaciones a CSV
  const exportToCSV = () => {
    // Calcular calificaciones finales antes de exportar
    calculateFinalGrades();

    // Crear contenido CSV
    const headers = [
      "#,Nombre del Estudiante,Examen 1 (25%),Examen 2 (25%),Proyecto (35%),Participación (15%),Promedio Final",
    ];
    const rows = grades.map(
      (grade, idx) =>
        `${idx + 1},${grade.student_name},${grade.exam1},${grade.exam2},${grade.project},${grade.participation},${grade.final_grade}`
    );
    const csvContent = [headers, ...rows].join("\n");

    // Crear y descargar el archivo
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Calificaciones_${materiaSeleccionada.class_name.replace(/\s+/g, "_")}.csv`
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container sx={{ mt: 3 }}>
      <Card sx={{ p: 3, borderRadius: "8px" }}>
        <PageInfo materiaSeleccionada={materiaSeleccionada} />
        <GradesTable />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="outlined"
            onClick={exportToCSV}
            sx={{ mt: 2, textTransform: "none" }}
          >
            <LuFileDown
              className="mr-2 h-4 w-4"
              style={{ marginRight: "8px" }}
            />
            Exportar Reporte
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              calculateFinalGrades();
              saveGrades();
            }}
            disabled={saving}
            sx={{ mt: 2, ml: 2 }}
          >
            <LuSave className="mr-2 h-4 w-4" style={{ marginRight: "8px" }} />
            {saving ? "Guardando..." : "Guardar Calificaciones"}
          </Button>
        </div>
      </Card>
    </Container>
  );
};

export default CalificacionesContent;
