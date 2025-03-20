import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "@tanstack/react-router";
import useSubjects from "../../../../hooks/useSubject";
import useGroups from "../../../../hooks/useGroups";

const professorId = "123";

const SubjectsList: React.FC<{ groupId: string | null }> = ({ groupId }) => {
  const { data: subjects, isLoading } = useSubjects(groupId);
  const { data: groups } = useGroups(professorId);
  const navigate = useNavigate();

  if (isLoading) return <Typography>Cargando materias...</Typography>;

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
    <Grid container spacing={3} sx={{ mt: 3 }}>
      {groupedSubjects && Object.entries(groupedSubjects).map(([groupId, groupSubjects]) => (
        <Grid item xs={12} key={groupId}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            {groupNames?.[groupId] || "Grupo desconocido"}
          </Typography>
          <Grid container spacing={2}>
            {groupSubjects.map((subject) => (
              <Grid item xs={12} sm={4} key={subject.id}>
                <Card sx={{ p: 3, textAlign: "center", borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>{subject.name}</Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ textTransform: "none", fontSize: "0.85rem", px: 2, py: 1 }} 
                        onClick={() => navigate({to: `/asistencia/${subject.id}`})}
                      >
                        Asistencia
                      </Button>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        sx={{ textTransform: "none", fontSize: "0.85rem", px: 2, py: 1 }} 
                        onClick={() => navigate({to: `/calificaciones/${subject.id}`})}
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
