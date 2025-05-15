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

  // Formatear la fecha si se proporciona en la URL
  const formattedDate = fechaQuery || new Date().toISOString().split('T')[0];
  
  return (
    <Layout>
      <AttendanceProvider 
        groupId={materiaSeleccionada?.group_id}
        date={formattedDate}
      >
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
