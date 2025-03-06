import { useNavigate } from "@tanstack/react-router";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate({ to: "/" });
  };
  return (
    <aside className="w-64 bg-white border-r border-border-color flex flex-col justify-between">
      <div>
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
        <nav className="mt-6 space-y-2">
          <a href="#" className="block py-2 px-3 rounded hover:bg-gray-100">
            Dashboard
          </a>
        </nav>
      </div>

      <div className="p-4 border-t border-border-color">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 text-left text-red-600 hover:bg-red-100 p-2 rounded"
        >
          {/* <FaSignOutAlt /> */}
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
