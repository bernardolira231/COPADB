const Header = () => {
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

        <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center cursor-pointer">
          A {/* Aquí puedes poner inicial o imagen de perfil */}
        </div>
      </div>
    </header>
  );
};

export default Header;
