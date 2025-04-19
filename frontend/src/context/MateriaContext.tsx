import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Materia {
  id: string;
  name: string;
  [key: string]: any; // Para permitir campos extra
}

interface MateriaContextProps {
  materias: Materia[];
  setMaterias: (materias: Materia[]) => void;
  materiaSeleccionada: Materia | null;
  setMateriaSeleccionada: (materia: Materia | null) => void;
}

const MateriaContext = createContext<MateriaContextProps | undefined>(undefined);

export const useMateria = () => {
  const context = useContext(MateriaContext);
  if (!context) {
    throw new Error("useMateria debe usarse dentro de un MateriaProvider");
  }
  return context;
};

const mockMaterias: Materia[] = [
  { id: "1", name: "Español I" },
  { id: "2", name: "Matemáticas I" },
  { id: "3", name: "Ciencias Naturales I" },
];

export const MateriaProvider = ({ children }: { children: ReactNode }) => {
  const [materias, setMaterias] = useState<Materia[]>(mockMaterias);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState<Materia | null>(null);

  return (
    <MateriaContext.Provider value={{ materias, setMaterias, materiaSeleccionada, setMateriaSeleccionada }}>
      {children}
    </MateriaContext.Provider>
  );
};
