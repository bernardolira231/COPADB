const Login = () => {
  return (
    <main className="bg-login-bg h-screen flex justify-center items-center">
      <div className="w-[448px] bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-secondary py-6 flex justify-center">
          <img
            src="/src/assets/images/icon.png"
            alt="Logo de la escuela"
            className="w-[196px] h-[192px]"
          />
        </div>
        <div className="p-6 space-y-4">
          <h2 className="text-center text-3xl font-bold">
            Bienvenido al Portal Educativo
          </h2>
          <div>
            <label className="block font-medium mb-1">
              Correo Institucional
            </label>
            <input
              type="email"
              placeholder="name@cedb.com"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="contraseña"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition">
            Iniciar Sesión
          </button>

          <div className="text-center">
            <a href="#" className="text-blue-600 hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
