import { useAuth } from "../../../../context/AuthContext";
import { Link } from "@tanstack/react-router";

const Header = () => {
  const { user } = useAuth();

  // Obtener las iniciales del usuario
  const getUserInitials = () => {
    if (!user) return "U";
    
    const firstInitial = user.name ? user.name.charAt(0).toUpperCase() : "";
    const lastInitial = user.lastname ? user.lastname.charAt(0).toUpperCase() : "";
    
    if (!firstInitial && !lastInitial) return "U";
    if (!lastInitial) return firstInitial;
    
    return firstInitial + lastInitial;
  };

  return (
    <header className="h-[82px] bg-white border-b border-border-color flex items-center px-6">
      <div className="flex-1"></div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar"
            className="border rounded-lg pl-3 pr-10 py-1"
          />
          {/* <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
        </div>

        {/* <FaBell className="text-gray-600 cursor-pointer" /> */}

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
