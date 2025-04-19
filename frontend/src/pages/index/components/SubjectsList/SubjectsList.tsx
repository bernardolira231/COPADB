import { useMateria } from "../../../../context/MateriaContext";
import { useNavigate } from "@tanstack/react-router";
import { Card, CardContent, Typography, Button, Box, Grid } from "@mui/material";
import { LuBook, LuCalculator, LuFlaskConical, LuUsers, LuFileText } from "react-icons/lu";
import useSx from "./sx";

const getSubjectIcon = (subjectName: string) => {
  if (subjectName.includes("Español")) return <LuBook className="mr-1" />;
  if (subjectName.includes("Matemáticas")) return <LuCalculator className="mr-1" />;
  if (subjectName.includes("Ciencias")) return <LuFlaskConical className="mr-1" />;
  return <LuBook className="mr-1" />;
};

const SubjectsList: React.FC = () => {
  const { materias, materiaSeleccionada, setMateriaSeleccionada } = useMateria();
  const sx = useSx();
  const navigate = useNavigate();

  // Mostrar solo la materia seleccionada o todas si no hay ninguna seleccionada
  const materiasAMostrar = materiaSeleccionada ? [materiaSeleccionada] : materias;

  return (
    <Grid container spacing={3} sx={sx.gridMain} justifyContent="center">
      {materiasAMostrar.map((subject) => (
        <Grid item xs={12} sm={6} md={4} key={subject.id}>
          <Card sx={sx.cardMain}>
            <Box sx={sx.boxMain}>
              <Typography variant="h6" sx={sx.typographySubjectMain}>
                {getSubjectIcon(subject.name)}
                {subject.name}
              </Typography>
            </Box>
            <CardContent>
              <Box sx={sx.box2Main}>
                <Button
                  variant="outlined"
                  startIcon={<LuUsers />}
                  sx={sx.asistenciaButtonMain}
                  onClick={() => {
                    setMateriaSeleccionada(subject);
                    navigate({ to: `/asistencia/${subject.id}` });
                  }}
                >
                  Asistencia
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<LuFileText />}
                  sx={sx.calificacionesButtonMain}
                  onClick={() => {
                    setMateriaSeleccionada(subject);
                    navigate({ to: `/calificaciones/${subject.id}` });
                  }}
                >
                  Calificaciones
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default SubjectsList;
