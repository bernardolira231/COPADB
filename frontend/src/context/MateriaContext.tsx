import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Materia {
  group_id: number;
  grado: string;
  class_id: number;
  class_name: string;
}

interface MateriaContextProps {
  materias: Materia[];
  loading: boolean;
  error: string | null;
  materiaSeleccionada: Materia | null;
  setMateriaSeleccionada: (materia: Materia | null) => void;
  refreshMaterias: () => Promise<void>;
}

const MateriaContext = createContext<MateriaContextProps | undefined>(undefined);

export const useMateria = () => {
  const context = useContext(MateriaContext);
  if (!context) {
    throw new Error("useMateria debe usarse dentro de un MateriaProvider");
  }
  return context;
};

export const MateriaProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materia | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMaterias = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5328/api/profesor/materias`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al obtener las materias del profesor");
      }

      const data = await response.json();
      setMaterias(data.materias);
    } catch (err) {
      console.error("Error al cargar materias:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  const refreshMaterias = async () => {
    await fetchMaterias();
  };

  useEffect(() => {
    if (user) {
      fetchMaterias();
    }
  }, [user]);

  return (
    <MateriaContext.Provider 
      value={{ 
        materias, 
        loading,
        error,
        materiaSeleccionada, 
        setMateriaSeleccionada,
        refreshMaterias
      }}
    >
      {children}
    </MateriaContext.Provider>
  );
};
