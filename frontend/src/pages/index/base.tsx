import Layout from "../../components/Layout";
import SubjectsList from "./components/SubjectsList";
import { useState } from "react";
import { Typography, Container } from "@mui/material";

const Index = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  return (
    <Layout onGroupChange={setSelectedGroup}>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h5">Materias</Typography>
        <SubjectsList groupId={selectedGroup} />
      </Container>
    </Layout>
  );
};

export default Index;
