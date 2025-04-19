import { useAuth } from "../../../../context/AuthContext";
import { Link } from "@tanstack/react-router";
import { useMateria } from "../../../../context/MateriaContext";
import SelectComponent from "../Select";

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  const { user, initializing } = useAuth();
  const { materias, materiaSeleccionada, setMateriaSeleccionada } = useMateria();

  // Si todavía está inicializando, no mostramos el header completo
  if (initializing) {
    return (
      <header className="h-[82px] bg-white border-b border-border-color flex items-center px-6">
        <div className="flex-1"></div>
        <div className="animate-pulse w-8 h-8 bg-gray-200 rounded-full"></div>
      </header>
    );
  }

  // Obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "";
    const lastInitial = user.lastname_f ? user.lastname_f.charAt(0).toUpperCase() : "";
    if (!firstInitial && !lastInitial) return "U";
    if (!lastInitial) return firstInitial;
    return firstInitial + lastInitial;
  };

  return (
    <header className="h-[82px] bg-white border-b border-border-color flex items-center px-6">
      <div className="flex-1"></div>
      <div className="flex items-center gap-4">
        <SelectComponent
          materias={materias}
          materiaSeleccionada={materiaSeleccionada}
          onMateriaChange={setMateriaSeleccionada}
        />
        <Link to="/perfil">
          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center cursor-pointer">
            {getUserInitials()}
          </div>
        </Link>
      </div>
    </header>
  );
};

export default Header;
