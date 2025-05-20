import { useState, useEffect } from "react";
import { Estudiante } from "../types/estudiante";

interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

interface UseEstudiantesReturn {
  estudiantes: Estudiante[];
  loading: boolean;
  error: string | null;
  paginationInfo: PaginationInfo;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchEstudiantes: (page?: number, perPage?: number, search?: string) => Promise<void>;
  deleteEstudiante: (id: number) => Promise<void>;
}

const useEstudiantes = (): UseEstudiantesReturn => {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  });

  // Función para obtener estudiantes del API
  const fetchEstudiantes = async (
    page: number = paginationInfo.page,
    perPage: number = paginationInfo.per_page,
    search: string = searchTerm
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Construir la URL con los parámetros de paginación y búsqueda
      const url = `/api/estudiantes?page=${page}&per_page=${perPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      
      // Hacer la llamada al API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Actualizar el estado con los estudiantes y la información de paginación
      setEstudiantes(data.estudiantes);
      setPaginationInfo(data.pagination);
    } catch (err) {
      console.error("Error fetching estudiantes:", err);
      setError("Error al cargar los estudiantes. Por favor, intenta de nuevo más tarde.");
      
      // Establecer estados vacíos en caso de error
      setEstudiantes([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        per_page: perPage,
        total_pages: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un estudiante
  const deleteEstudiante = async (id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Hacer la llamada al API para eliminar el estudiante
      const response = await fetch(`/api/estudiantes/${id}`, { 
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Refrescar la lista después de eliminar
      await fetchEstudiantes();
    } catch (err) {
      console.error("Error deleting estudiante:", err);
      setError("Error al eliminar el estudiante. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Cargar estudiantes al montar el componente o cuando cambia el término de búsqueda
  useEffect(() => {
    fetchEstudiantes();
  }, [searchTerm]);

  return {
    estudiantes,
    loading,
    error,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    fetchEstudiantes,
    deleteEstudiante
  };
};

export default useEstudiantes;
