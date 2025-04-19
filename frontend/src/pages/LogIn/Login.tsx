import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import useLogin from "../../hooks/useLogin";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login, isPending, isError, error } = useLogin();
  const { setUserAfterLogin } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    if (!email.trim()) {
      newErrors.email = "El correo es obligatorio.";
    }

    if (!password.trim()) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setErrors(newErrors);

    if (newErrors.email || newErrors.password) return;

    login({ email, password }, {
      onSuccess: (data) => {
        localStorage.setItem("token", data.token);
        setUserAfterLogin(data.user);
        navigate({ to: "/Home" });
      },
      onError: (err) => {
        setErrors((prev) => ({ ...prev, password: "Credenciales incorrectas." }));
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@cedb.com"
              className={`w-full border ${errors.email ? "border-red-500" : "border-gray-300"} rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="contraseña"
              className={`w-full border ${errors.password ? "border-red-500" : "border-gray-300"} rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-800 text-white py-2 rounded-md hover:bg-blue-900 transition"
            disabled={isPending}
          >
            {isPending ? "Cargando..." : "Iniciar Sesión"}
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
