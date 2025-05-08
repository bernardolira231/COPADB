import { useMateria } from "../../../../context/MateriaContext";
import { useNavigate } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Grid,
  Skeleton,
} from "@mui/material";
import {
  LuBook,
  LuCalculator,
  LuFlaskConical,
  LuUsers,
  LuFileText,
  LuGlobe,
  LuPencil,
  LuMusic,
  LuDumbbell,
  LuPalette,
} from "react-icons/lu";
import useSx from "./sx";
import { useEffect } from "react";
import dayjs from "dayjs";

// Mapeo de materias a iconos basado en el ID de la clase
const SUBJECT_ICONS: Record<number, React.ReactNode> = {
  1: <LuCalculator className="mr-1" />, // Matemáticas
  2: <LuBook className="mr-1" />, // Español
  3: <LuFlaskConical className="mr-1" />, // Ciencias Naturales
  4: <LuGlobe className="mr-1" />, // Ciencias Sociales
  5: <LuPencil className="mr-1" />, // Historia
  6: <LuMusic className="mr-1" />, // Música
  7: <LuDumbbell className="mr-1" />, // Educación Física
  8: <LuPalette className="mr-1" />, // Arte
};

// Icono por defecto
const DEFAULT_ICON = <LuBook className="mr-1" />;

const getSubjectIcon = (classId: number) => {
  return SUBJECT_ICONS[classId] || DEFAULT_ICON;
};

// Componente para el skeleton loader
const SubjectSkeletonLoader = () => {
  const sx = useSx();

  // Crear un array de 3 elementos para mostrar 3 skeletons
  const skeletons = Array.from({ length: 3 }, (_, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={sx.cardMain}>
        <Box sx={sx.boxMain}>
          <Skeleton variant="text" width="80%" height={32} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <CardContent>
          <Box sx={sx.box2Main}>
            <Skeleton variant="rectangular" width="45%" height={36} />
            <Skeleton variant="rectangular" width="45%" height={36} />
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ));

  return (
    <Grid container spacing={3} sx={sx.gridMain} justifyContent="center">
      {skeletons}
    </Grid>
  );
};

interface SubjectsListProps {
  groupId?: string | null;
}

const SubjectsList: React.FC<SubjectsListProps> = ({ groupId }) => {
  const {
    materias,
    materiaSeleccionada,
    setMateriaSeleccionada,
    loading,
    error,
  } = useMateria();
  const sx = useSx();
  const navigate = useNavigate();

  // Efecto para depurar
  useEffect(() => {
    console.log("SubjectsList - materiaSeleccionada:", materiaSeleccionada);
    console.log("SubjectsList - groupId:", groupId);
    console.log("SubjectsList - materias disponibles:", materias);
  }, [materiaSeleccionada, groupId, materias]);

  // Siempre mostrar todas las materias disponibles
  const materiasAMostrar = materias;

  // Mostrar skeleton loader durante la carga
  if (loading) {
    return <SubjectSkeletonLoader />;
  }

  // Mostrar mensaje de error si hay algún problema
  if (error) {
    return (
      <Box sx={{ textAlign: "center", color: "error.main", p: 3 }}>
        <Typography variant="h6">Error al cargar las materias</Typography>
        <Typography variant="body2">{error}</Typography>
      </Box>
    );
  }

  // Mostrar mensaje si no hay materias disponibles
  if (materiasAMostrar.length === 0) {
    return (
      <Box sx={{ textAlign: "center", p: 3 }}>
        <Typography variant="h6">No hay materias disponibles</Typography>
        <Typography variant="body2">
          {materias.length > 0
            ? "Selecciona una materia desde el menú superior"
            : "No se encontraron materias asignadas a este profesor"}
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3} sx={sx.gridMain} justifyContent="center">
      {materiasAMostrar.map((subject) => (
        <Grid item xs={12} sm={6} md={4} key={subject.group_id}>
          <Card sx={sx.cardMain}>
            <Box sx={sx.boxMain}>
              <Typography variant="h6" sx={sx.typographySubjectMain}>
                {getSubjectIcon(subject.class_id)}
                {subject.class_name}
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                {subject.grado}
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
                    navigate({
                      to: "/asistencia",
                      search: { fecha: dayjs().format("YYYY-MM-DD") },
                    });
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
                    navigate({ to: "/calificaciones" });
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
