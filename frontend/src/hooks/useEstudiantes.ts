import { useState, useEffect } from "react";
import { Estudiante } from "../types/estudiante";

// Datos de ejemplo para simular la respuesta del API
const mockEstudiantes: Estudiante[] = [
  {
    id: 1,
    name: "Juan",
    lastname_f: "Pérez",
    lastname_m: "García",
    email: "juan.perez@ejemplo.com",
    blood_type: "O+",
    allergies: "Ninguna",
    scholar_ship: true,
    chapel: "San Juan",
    school_campus: "Campus Norte",
    family_id: 101,
    permission: "Permiso para actividades deportivas",
    reg_date: "2025-01-15",
    created_at: "2025-01-15T10:30:00Z",
    updated_at: "2025-01-15T10:30:00Z"
  },
  {
    id: 2,
    name: "Ana",
    lastname_f: "Martínez",
    lastname_m: "Rodríguez",
    email: "ana.martinez@ejemplo.com",
    blood_type: "A+",
    allergies: "Polen",
    scholar_ship: false,
    chapel: "Santa María",
    school_campus: "Campus Sur",
    family_id: 102,
    permission: "Permiso para excursiones escolares",
    reg_date: "2025-02-20",
    created_at: "2025-02-20T14:45:00Z",
    updated_at: "2025-02-20T14:45:00Z"
  },
  {
    id: 3,
    name: "Luis",
    lastname_f: "González",
    lastname_m: "Hernández",
    email: "luis.gonzalez@ejemplo.com",
    blood_type: "B-",
    allergies: "Lactosa",
    scholar_ship: true,
    chapel: "San Francisco",
    school_campus: "Campus Central",
    family_id: 103,
    permission: "Permiso para actividades extracurriculares",
    reg_date: "2025-03-10",
    created_at: "2025-03-10T09:15:00Z",
    updated_at: "2025-03-10T09:15:00Z"
  }
];

interface UseEstudiantesReturn {
  estudiantes: Estudiante[];
  loading: boolean;
  error: string | null;
  fetchEstudiantes: () => Promise<void>;
  deleteEstudiante: (id: number) => Promise<void>;
}

const useEstudiantes = (): UseEstudiantesReturn => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Simula la llamada a la API para obtener estudiantes
  const fetchEstudiantes = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular un retraso de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // En el futuro, aquí iría la llamada real al API
      // const response = await fetch('/api/estudiantes');
      // const data = await response.json();
      
      setEstudiantes(mockEstudiantes);
    } catch (err) {
      setError("Error al cargar los estudiantes. Por favor, intenta de nuevo.");
      console.error("Error fetching estudiantes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Simula la eliminación de un estudiante
  const deleteEstudiante = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simular un retraso de red
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // En el futuro, aquí iría la llamada real al API
      // await fetch(`/api/estudiantes/${id}`, { method: 'DELETE' });
      
      // Actualizar el estado local eliminando el estudiante
      setEstudiantes(prevEstudiantes => 
        prevEstudiantes.filter(estudiante => estudiante.id !== id)
      );
    } catch (err) {
      setError("Error al eliminar el estudiante. Por favor, intenta de nuevo.");
      console.error("Error deleting estudiante:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar estudiantes al montar el componente
  useEffect(() => {
    fetchEstudiantes();
  }, []);

  return {
    estudiantes,
    loading,
    error,
    fetchEstudiantes,
    deleteEstudiante
  };
};

export default useEstudiantes;
