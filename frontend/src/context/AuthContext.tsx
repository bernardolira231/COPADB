import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: number;
  name: string;
  lastname_m: string;
  lastname_f: string;
  email: string;
  rol: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  initializing: boolean;
  error: string | null;
  logout: () => void;
  refreshUserData: () => Promise<void>;
  setUserAfterLogin: (userData: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Función para verificar si un token JWT ha expirado
const isTokenExpired = (token: string): boolean => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    const { exp } = JSON.parse(jsonPayload);
    const currentTime = Math.floor(Date.now() / 1000);

    return exp < currentTime;
  } catch (e) {
    console.error("Error al verificar expiración del token:", e);
    return true; // Si hay error, asumimos que el token no es válido
  }
};

// Función para verificar si los datos del usuario están completos
const isUserDataComplete = (userData: User | null): boolean => {
  if (!userData) return false;

  // Verificar que todos los campos esenciales existan y no sean undefined o null
  const requiredFields: (keyof User)[] = [
    "id",
    "name",
    "lastname_f",
    "email",
    "rol",
  ];

  for (const field of requiredFields) {
    if (userData[field] === undefined || userData[field] === null) {
      console.log(`Campo incompleto en datos de usuario: ${field}`);
      return false;
    }
  }

  return true;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshIntervalId, setRefreshIntervalId] = useState<number | null>(
    null
  );
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  // Función para cerrar sesión
  const logout = () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      setRefreshIntervalId(null);
    }

    localStorage.removeItem("token");
    setUser(null);
    setInitializing(false);
    window.location.replace("/");
  };

  // Función para obtener datos del usuario
  const fetchUserData = async (isInitialFetch = false) => {
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      setUser(null);
      if (isInitialFetch) {
        setInitializing(false);
      }
      return;
    }

    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      console.log("Token expirado, cerrando sesión");
      logout();
      return;
    }

    try {
      const response = await fetch("http://localhost:5328/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        console.log("Sesión expirada o no válida");
        logout();
        return;
      }

      if (!response.ok) {
        throw new Error(
          `Error al obtener datos del usuario: ${response.status}`
        );
      }

      const data = await response.json();
      setUser(data.user);
      setError(null);

      // Verificar si los datos están completos
      const dataComplete = isUserDataComplete(data.user);

      // Si es la carga inicial y los datos no están completos, intentamos nuevamente
      if (isInitialFetch && !dataComplete && retryCount < MAX_RETRIES) {
        console.log(
          `Datos de usuario incompletos, reintentando (${retryCount + 1}/${MAX_RETRIES})...`
        );
        setRetryCount((prev) => prev + 1);

        // Esperar 1 segundo antes de reintentar
        setTimeout(() => {
          fetchUserData(true);
        }, 1000);

        return;
      }

      // Si hemos llegado al máximo de reintentos o los datos están completos
      if (isInitialFetch) {
        setInitializing(false);
        setRetryCount(0);
      }
    } catch (err) {
      console.error("Error al cargar datos del usuario:", err);
      setError(
        "Error de conexión con el servidor. Verifica que el backend esté en ejecución."
      );

      // Si es la carga inicial y aún no hemos alcanzado el máximo de reintentos
      if (isInitialFetch && retryCount < MAX_RETRIES) {
        console.log(
          `Error al cargar datos, reintentando (${retryCount + 1}/${MAX_RETRIES})...`
        );
        setRetryCount((prev) => prev + 1);

        // Esperar 1 segundo antes de reintentar
        setTimeout(() => {
          fetchUserData(true);
        }, 1000);

        return;
      }

      // Si hemos llegado al máximo de reintentos
      if (isInitialFetch) {
        setInitializing(false);
        setRetryCount(0);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshUserData = async () => {
    await fetchUserData(false);
  };

  const setUserAfterLogin = async (userData: User) => {
    // Bloquear navegación mientras se cargan datos completos
    setInitializing(true);
    setUser(userData);
    setError(null);
    // Obtener datos completos del usuario y esperar a que termine
    await fetchUserData(true);
    // Una vez completos los datos, permitir navegación
    setInitializing(false);

    // Configurar el intervalo de refresco después del login
    // Configurar refresco periódico
    setupRefreshInterval();
  };

  // Configurar un intervalo para refrescar los datos del usuario periódicamente
  const setupRefreshInterval = () => {
    // Limpiar cualquier intervalo existente
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
    }

    // Refrescar cada 15 minutos (900000 ms)
    const intervalId = window.setInterval(() => {
      // console.log("Refrescando datos de usuario automáticamente");
      fetchUserData(false);
    }, 900000);

    setRefreshIntervalId(intervalId);
  };

  // Efecto para cargar los datos del usuario al iniciar
  useEffect(() => {
    // Cargar datos del usuario con la bandera de inicialización
    fetchUserData(true);

    // Configurar intervalo de refresco si hay un token
    if (localStorage.getItem("token")) {
      setupRefreshInterval();
    }

    // Limpiar el intervalo cuando el componente se desmonte
    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta una vez al montar el componente

  // Escuchar eventos de almacenamiento para sincronizar múltiples pestañas
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token") {
        if (!e.newValue) {
          // Token eliminado en otra pestaña
          setUser(null);
          setInitializing(false);
          if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
            setRefreshIntervalId(null);
          }
        } else if (e.newValue !== e.oldValue) {
          // Token actualizado en otra pestaña
          fetchUserData(false);
          setupRefreshInterval();
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Solo se ejecuta una vez al montar el componente

  const value = {
    user,
    loading,
    initializing,
    error,
    logout,
    refreshUserData,
    setUserAfterLogin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
