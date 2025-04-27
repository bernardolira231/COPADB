import Layout from "../../components/Layout";
import SubjectsList from "./components/SubjectsList";
import { useState, useEffect } from "react";
import { Typography, Container } from "@mui/material";
import { useMateria } from "../../context/MateriaContext";

const Index = () => {
  const { materiaSeleccionada } = useMateria();
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Actualizar selectedGroup cuando cambia materiaSeleccionada
  useEffect(() => {
    if (materiaSeleccionada) {
      setSelectedGroup(materiaSeleccionada.group_id.toString());
    }
  }, [materiaSeleccionada]);

  return (
    <Layout onGroupChange={setSelectedGroup}>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h4" color="primary" fontWeight="bold">
          Materias
        </Typography>
        <SubjectsList groupId={selectedGroup} />
      </Container>
    </Layout>
  );
};

export default Index;
