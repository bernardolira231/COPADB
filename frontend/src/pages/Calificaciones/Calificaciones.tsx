import { Container } from "@mui/material";
import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import { useMateria } from "../../context/MateriaContext";
import { useNavigate } from "@tanstack/react-router";
import PageInfo from "./components/PageInfo";

const Calificaciones = () => {
  const { materiaSeleccionada } = useMateria();
  const navigate = useNavigate();

  if (!materiaSeleccionada) {
    navigate({ to: "/Home" });
    return null;
  }

  return (
    <Layout>
      <Container sx={{ mt: 3 }}>
        <PageHeader>Calificaciones</PageHeader>
        <PageInfo materiaSeleccionada={materiaSeleccionada} />
      </Container>
    </Layout>
  );
};

export default Calificaciones;
