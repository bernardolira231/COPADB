import { Route as AsistenciaRoute } from "../../routes/asistencia";
import Layout from "../../components/Layout";
import { useMateria } from "../../context/MateriaContext";
import { useSearch, useNavigate } from "@tanstack/react-router";
import { AttendanceProvider } from "./context/AttendanceContext";
import AsistenciaContent from "./components/AsistenciaContent";

const Asistencia = () => {
  const { materiaSeleccionada } = useMateria();
  const { fecha: fechaQuery } = useSearch({ from: AsistenciaRoute.id });
  const navigate = useNavigate();

  if (!materiaSeleccionada) {
    navigate({ to: "/Home" });
    return null;
  }

  return (
    <Layout>
      <AttendanceProvider>
        <AsistenciaContent
          materiaSeleccionada={materiaSeleccionada}
          fechaQuery={fechaQuery}
          navigate={navigate}
        />
      </AttendanceProvider>
    </Layout>
  );
};

export default Asistencia;
