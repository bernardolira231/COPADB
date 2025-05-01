import { Route as AsistenciaRoute } from "../../routes/asistencia";
import Layout from "../../components/Layout";
import { AttendanceProvider } from "./context/AttendanceContext";
import { useMateria } from "../../context/MateriaContext";
import { useSearch, useNavigate } from "@tanstack/react-router";
import AsistenciaContent from "./components/AsistenciaContent";

const Asistencia = () => {
  const { materiaSeleccionada } = useMateria();
  const { fecha: fechaQuery } = useSearch({ from: AsistenciaRoute.id });
  const navigate = useNavigate();

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
