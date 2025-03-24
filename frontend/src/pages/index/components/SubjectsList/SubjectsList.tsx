import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "@tanstack/react-router";
import {
  LuBook,
  LuCalculator,
  LuFlaskConical,
  LuUsers,
  LuFileText,
} from "react-icons/lu";
import useSubjects from "../../../../hooks/useSubject";
import useGroups from "../../../../hooks/useGroups";
import useSx from "./sx";

const professorId = "123";

const getSubjectIcon = (subjectName: string) => {
  if (subjectName.includes("Español")) return <LuBook className="mr-1" />;
  if (subjectName.includes("Matemáticas"))
    return <LuCalculator className="mr-1" />;
  if (subjectName.includes("Ciencias"))
    return <LuFlaskConical className="mr-1" />;
  return <LuBook className="mr-1" />;
};

const SubjectsList: React.FC<{ groupId: string | null }> = ({ groupId }) => {
  const { data: subjects, isLoading } = useSubjects(groupId);
  const { data: groups } = useGroups(professorId);
  const sx = useSx();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Grid container spacing={3} sx={sx.gridMain}>
        {[...Array(3)].map((_, i) => (
          <Grid item xs={12} sm={4} key={i}>
            <Card sx={sx.skeletonCard}>
              <Box sx={sx.skeletonBox} />
              <CardContent>
                <Box sx={sx.skeletonBox2}>
                  <Skeleton variant="rectangular" width={100} height={36} />
                  <Skeleton variant="rectangular" width={100} height={36} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  const groupNames = groups?.reduce(
    (acc, group) => {
      acc[group.id] = group.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const groupedSubjects = subjects?.reduce(
    (acc, subject) => {
      if (!acc[subject.group_id]) {
        acc[subject.group_id] = [];
      }
      acc[subject.group_id].push(subject);
      return acc;
    },
    {} as Record<string, typeof subjects>
  );

  return (
    <Grid container spacing={3} sx={sx.gridMain}>
      {groupedSubjects &&
        Object.entries(groupedSubjects).map(([groupId, groupSubjects]) => (
          <Grid item xs={12} key={groupId}>
            <Typography variant="h6" sx={sx.typographyMain}>
              {groupNames?.[groupId] || "Grupo desconocido"}
            </Typography>
            <Grid container spacing={2}>
              {groupSubjects.map((subject) => (
                <Grid item xs={12} sm={4} key={subject.id}>
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
                          onClick={() =>
                            navigate({ to: `/asistencia/${subject.id}` })
                          }
                        >
                          Asistencia
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<LuFileText />}
                          sx={sx.calificacionesButtonMain}
                          onClick={() =>
                            navigate({ to: `/calificaciones/${subject.id}` })
                          }
                        >
                          Calificaciones
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Grid>
        ))}
    </Grid>
  );
};

export default SubjectsList;
