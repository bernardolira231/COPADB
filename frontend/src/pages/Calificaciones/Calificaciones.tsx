import Layout from "../../components/Layout";
import PageHeader from "../../components/PageHeader";
import { useMateria } from "../../context/MateriaContext";
import { useNavigate } from "@tanstack/react-router";
import { GradesProvider } from "./context/GradesContext";
import CalificacionesContent from "./components/CalificacionesContent";

const Calificaciones = () => {
  const { materiaSeleccionada } = useMateria();
  const navigate = useNavigate();

  if (!materiaSeleccionada) {
    navigate({ to: "/Home" });
    return null;
  }

  return (
    <Layout>
      <GradesProvider>
        <CalificacionesContent materiaSeleccionada={materiaSeleccionada} />
      </GradesProvider>
    </Layout>
  );
};

export default Calificaciones;
