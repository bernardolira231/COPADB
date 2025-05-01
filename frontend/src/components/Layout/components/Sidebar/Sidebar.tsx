import { Link } from "@tanstack/react-router";
import {
  LuUsers,
  LuLogOut,
  LuGraduationCap,
  LuFileText,
  LuSettings,
  LuLayoutDashboard,
} from "react-icons/lu";
import SideBarLink from "../SideBarLink";
import { useAuth } from "../../../../context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar = () => {
  const { user, logout } = useAuth();

  // Verificar si el usuario tiene permisos para ver la lista de alumnos
  const canAccessStudentList = user?.rol === 1 || user?.rol === 2;

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className="w-64 bg-white border-r border-border-color flex flex-col justify-between">
      <div>
        <Link to="/Home">
          <div className="flex items-center gap-2 border-b border-border-color py-2 h-[82px] justify-center">
            <img
              src="/src/assets/images/icon.png"
              alt="Logo de la escuela"
              className="h-[50px] w-[51px]"
            />
            <h2 className="text-lg font-bold">
              <span className="text-blue-600">COPADB</span> SISTEMA
            </h2>
          </div>
        </Link>
        <nav className="mt-6 space-y-2">
          <SideBarLink
            icon={<LuLayoutDashboard />}
            title="Dashboard"
            to="/Home"
            color="text-blue-500"
          />
          {canAccessStudentList && (
            <SideBarLink
              icon={<LuGraduationCap />}
              title="Listado de Alumnos"
              to="/alumnos"
              color="text-pink-500"
            />
          )}
          <SideBarLink
            icon={<LuFileText />}
            title="Calificaciones"
            to="/calificaciones"
            color="text-orange-500"
          />
          <SideBarLink
            icon={<LuSettings />}
            title="Configuración"
            to="/configuracion"
          />
        </nav>
      </div>

      <div className="p-4 border-t border-border-color">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-left text-red-600 hover:bg-red-100 p-2 rounded cursor-pointer"
        >
          <LuLogOut />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
