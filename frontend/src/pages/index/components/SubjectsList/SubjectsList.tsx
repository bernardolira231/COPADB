import { Card, CardContent, Typography, Button, Box } from "@mui/material";
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
      {groupedSubjects &&
        Object.entries(groupedSubjects).map(([groupId, groupSubjects]) => (
          <Grid item xs={12} key={groupId}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {groupNames?.[groupId] || "Grupo desconocido"}
            </Typography>
            <Grid container spacing={2}>
              {groupSubjects.map((subject) => (
                <Grid item xs={12} sm={4} key={subject.id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 2,
                      textAlign: "center",
                    }}
                  >
                    <Box sx={{ bgcolor: "primary.main", color: "white", p: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: "bold",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getSubjectIcon(subject.name)}
                        {subject.name}
                      </Typography>
                    </Box>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<LuUsers />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.85rem",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            color: "#00B26A",
                            borderColor: "#00B26A",
                          }}
                          onClick={() =>
                            navigate({ to: `/asistencia/${subject.id}` })
                          }
                        >
                          Asistencia
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<LuFileText />}
                          sx={{
                            textTransform: "none",
                            fontSize: "0.85rem",
                            px: 2,
                            py: 1,
                            borderRadius: 2,
                            // bgcolor: "black",
                            color: "#FF5200",
                            borderColor: "#FF5200",
                          }}
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
