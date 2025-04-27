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

// Clave para almacenar la materia seleccionada en localStorage
const MATERIA_STORAGE_KEY = 'selectedMateria';

export const MateriaProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [materiaSeleccionada, _setMateriaSeleccionada] = useState<Materia | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Función mejorada para establecer la materia seleccionada
  const setMateriaSeleccionada = (materia: Materia | null) => {
    _setMateriaSeleccionada(materia);
    
    // Guardar en localStorage para persistencia
    if (materia) {
      localStorage.setItem(MATERIA_STORAGE_KEY, JSON.stringify(materia));
    } else {
      localStorage.removeItem(MATERIA_STORAGE_KEY);
    }
    
    // Depuración para verificar que se está estableciendo correctamente
    console.log("Materia seleccionada:", materia);
  };

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
      
      // Intentar restaurar la materia seleccionada desde localStorage
      const savedMateriaJSON = localStorage.getItem(MATERIA_STORAGE_KEY);
      if (savedMateriaJSON) {
        try {
          const savedMateria = JSON.parse(savedMateriaJSON);
          // Verificar que la materia guardada todavía existe en la lista actualizada
          const materiaExistente = data.materias.find(
            (m: Materia) => m.group_id === savedMateria.group_id
          );
          
          if (materiaExistente) {
            _setMateriaSeleccionada(materiaExistente);
            console.log("Materia restaurada:", materiaExistente);
          } else {
            // Si la materia ya no existe, limpiar localStorage
            localStorage.removeItem(MATERIA_STORAGE_KEY);
          }
        } catch (e) {
          console.error("Error al restaurar materia seleccionada:", e);
          localStorage.removeItem(MATERIA_STORAGE_KEY);
        }
      }
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

  // Cargar materias cuando el usuario cambia o cuando se monta el componente
  useEffect(() => {
    if (user) {
      fetchMaterias();
    } else {
      // Limpiar estado cuando no hay usuario
      setMaterias([]);
      _setMateriaSeleccionada(null);
      localStorage.removeItem(MATERIA_STORAGE_KEY);
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
