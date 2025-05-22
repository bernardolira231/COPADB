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

// Utilidad para obtener el valor de una cookie por nombre
function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

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
  const logout = async () => {
    if (refreshIntervalId) {
      clearInterval(refreshIntervalId);
      setRefreshIntervalId(null);
    }
    try {
      await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      // No importa si falla, continuar logout
    }
    localStorage.removeItem("token");
    setUser(null);
    setInitializing(false);
    window.location.replace("/");
  };

  // Función para obtener datos del usuario
  const fetchUserData = async (isInitialFetch = false) => {
    setLoading(true);

    let token = localStorage.getItem("token");
    if (!token) {
      // Intenta refrescar el token antes de cerrar sesión
      const newToken = await refreshAccessToken();
      if (!newToken) {
        setLoading(false);
        setUser(null);
        if (isInitialFetch) {
          setInitializing(false);
        }
        return;
      }
      token = newToken;
      localStorage.setItem("token", token);
    }

    // Verificar si el token ha expirado
    if (isTokenExpired(token)) {
      console.log("Token expirado, intentando refrescar access token...");
      const newToken = await refreshAccessToken();
      if (!newToken) {
        logout();
        return;
      }
      token = newToken;
      localStorage.setItem("token", token);
    }

    try {
      const response = await fetch("/api/user/profile", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("No autorizado");
      }
      const data = await response.json();
      setUser(data.user);
      setError(null);
      if (isInitialFetch) {
        setInitializing(false);
        setRetryCount(0);
      }
    } catch (err) {
      setUser(null);
      setError(err instanceof Error ? err.message : "Error desconocido");
      if (isInitialFetch) {
        setInitializing(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      // Obtener el valor del CSRF token desde la cookie
      const csrfToken = getCookie('csrf_refresh_token');
      const response = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include', // Importante: para enviar cookies
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
        },
      });
      if (!response.ok) {
        throw new Error('No se pudo refrescar el token');
      }
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        return data.token;
      }
      return null;
    } catch (err) {
      console.error("Error al refrescar el token:", err);
      return null;
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
    // Solo intenta cargar datos si hay token
    if (localStorage.getItem("token")) {
      fetchUserData(true);
      setupRefreshInterval();
    } else {
      setInitializing(false);
      setUser(null);
    }

    return () => {
      if (refreshIntervalId) {
        clearInterval(refreshIntervalId);
      }
    };
  }, []);

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
  }, []);

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
