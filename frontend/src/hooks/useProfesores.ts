import { useState, useEffect } from "react";
import { Profesor, ProfesorCreate } from "../types/profesor";

interface PaginationInfo {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// Interfaz para las materias
interface Materia {
  group_id: number;
  grado: string;
  class_id: number;
  class_name: string;
}

interface UseProfesoresReturn {
  profesores: Profesor[];
  loading: boolean;
  error: string | null;
  paginationInfo: PaginationInfo;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  fetchProfesores: (page?: number, perPage?: number, search?: string) => Promise<void>;
  deleteProfesor: (id: number) => Promise<void>;
  saveProfesor: (profesor: ProfesorCreate) => Promise<boolean>;
  updateProfesor: (id: number, profesor: Partial<Profesor>) => Promise<boolean>;
  getMateriasProfesor: (id: number) => Promise<{ usuario: any; materias: any[] }>;
  getMateriasDisponibles: () => Promise<Materia[]>;
  asignarMateriaProfesor: (profesorId: number, materiaId: number, esClassId?: boolean) => Promise<boolean>;
  desasignarMateriaProfesor: (profesorId: number, groupId: number) => Promise<boolean>;
  getProfesorById: (id: number) => Promise<Profesor | null>;
}

// Datos de ejemplo para desarrollo
const MOCK_PROFESORES: Profesor[] = [
  {
    id: 1,
    name: "Juan",
    lastname_f: "Pérez",
    lastname_m: "Gómez",
    email: "juan.perez@example.com",
    rol: 3
  },
  {
    id: 2,
    name: "María",
    lastname_f: "López",
    lastname_m: "Rodríguez",
    email: "maria.lopez@example.com",
    rol: 3
  },
  {
    id: 3,
    name: "Carlos",
    lastname_f: "Sánchez",
    lastname_m: "Martínez",
    email: "carlos.sanchez@example.com",
    rol: 3
  },
  {
    id: 4,
    name: "Laura",
    lastname_f: "García",
    lastname_m: "Hernández",
    email: "laura.garcia@example.com",
    rol: 3
  },
  {
    id: 5,
    name: "Roberto",
    lastname_f: "Fernández",
    lastname_m: "Díaz",
    email: "roberto.fernandez@example.com",
    rol: 3
  }
];

const useProfesores = (): UseProfesoresReturn => {
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [paginationInfo, setPaginationInfo] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 0
  });

  // Función para obtener profesores del API
  const fetchProfesores = async (
    page: number = paginationInfo.page,
    perPage: number = paginationInfo.per_page,
    search: string = searchTerm
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Construir la URL con los parámetros de paginación y búsqueda
      const url = `http://localhost:5328/api/usuarios?page=${page}&per_page=${perPage}${search ? `&search=${encodeURIComponent(search)}` : ''}`;
      
      // Hacer la llamada al API
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      
      const data = await response.json();
      
      setProfesores(data.usuarios);
      setPaginationInfo(data.pagination);
    } catch (err) {
      console.error('Error al cargar profesores:', err);
      setError("Error al cargar los profesores. Por favor, intenta de nuevo más tarde.");
      setProfesores([]);
      setPaginationInfo({
        total: 0,
        page: 1,
        per_page: perPage,
        total_pages: 0
      });

      // Usar datos de ejemplo como fallback en caso de error
      setProfesores(MOCK_PROFESORES.slice(0, perPage));
      setPaginationInfo({
        total: MOCK_PROFESORES.length,
        page: 1,
        per_page: perPage,
        total_pages: Math.ceil(MOCK_PROFESORES.length / perPage)
      });
    } finally {
      setLoading(false);
    }
  };

  // Función para eliminar un profesor
  const deleteProfesor = async (id: number): Promise<void> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Hacer la llamada al API para eliminar
      const response = await fetch(`http://localhost:5328/api/usuarios/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      
      // Actualizar estado local
      setProfesores(prev => prev.filter(profesor => profesor.id !== id));
      setPaginationInfo(prev => ({
        ...prev,
        total: prev.total - 1,
        total_pages: Math.ceil((prev.total - 1) / prev.per_page)
      }));
      
      // Si después de eliminar no quedan elementos en la página actual y no es la primera página,
      // ir a la página anterior
      if (profesores.length === 1 && paginationInfo.page > 1) {
        fetchProfesores(paginationInfo.page - 1, paginationInfo.per_page, searchTerm);
      } else if (profesores.length === 1) {
        // Si es la primera página y no quedan elementos, simplemente actualizar
        fetchProfesores(1, paginationInfo.per_page, searchTerm);
      }
    } catch (err) {
      console.error('Error al eliminar profesor:', err);
      setError("Error al eliminar el profesor. Por favor, intenta de nuevo más tarde.");
    }
  };

  // Función para guardar un nuevo profesor
  const saveProfesor = async (profesor: ProfesorCreate): Promise<boolean> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Hacer la llamada al API para guardar
      const response = await fetch('http://localhost:5328/api/usuarios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profesor)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
      }
      
      const newProfesor = await response.json();
      
      // Si la página actual no está llena, añadir el nuevo profesor al estado local
      if (profesores.length < paginationInfo.per_page) {
        setProfesores(prev => [...prev, newProfesor]);
      }
      
      // Actualizar la paginación
      setPaginationInfo(prev => ({
        ...prev,
        total: prev.total + 1,
        total_pages: Math.ceil((prev.total + 1) / prev.per_page)
      }));
      
      return true;
    } catch (err) {
      console.error('Error al guardar profesor:', err);
      setError("Error al guardar el profesor. Por favor, intenta de nuevo más tarde.");
      return false;
    }
  };

  // Cargar profesores al montar el componente o cuando cambian los parámetros de búsqueda
  useEffect(() => {
    fetchProfesores();
  }, []);

  // Función para obtener las materias de un profesor
  const getMateriasProfesor = async (id: number) => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Hacer la llamada al API
      const response = await fetch(`http://localhost:5328/api/usuarios/${id}/materias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      
      return await response.json();
    } catch (err) {
      console.error('Error al obtener materias del profesor:', err);
      return { usuario: null, materias: [] };
    }
  };

  // Función para obtener materias disponibles (sin profesor asignado)
  const getMateriasDisponibles = async (): Promise<Materia[]> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Hacer la llamada al API
      const response = await fetch('http://localhost:5328/api/usuarios/materias-disponibles', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      
      const data = await response.json();
      return data.materias || [];
    } catch (err) {
      console.error('Error al obtener materias disponibles:', err);
      return [];
    }
  };

  // Función para asignar una materia a un profesor
  const asignarMateriaProfesor = async (profesorId: number, materiaId: number, esClassId: boolean = true): Promise<boolean> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Preparar el cuerpo de la solicitud según si es class_id o group_id
      const requestBody = esClassId 
        ? { class_id: materiaId } 
        : { group_id: materiaId };

      console.log('Asignando materia al profesor:', profesorId, 'con datos:', requestBody);

      // Hacer la llamada al API
      const response = await fetch(`http://localhost:5328/api/usuarios/${profesorId}/asignar-materia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
      }
      
      return true;
    } catch (err) {
      console.error('Error al asignar materia al profesor:', err);
      return false;
    }
  };

  // Función para desasignar una materia de un profesor
  const desasignarMateriaProfesor = async (profesorId: number, groupId: number): Promise<boolean> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('Desasignando materia del profesor:', profesorId, 'con group_id:', groupId);

      // Hacer la llamada al API
      const response = await fetch(`http://localhost:5328/api/usuarios/${profesorId}/desasignar-materia`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ group_id: groupId })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
      }
      
      return true;
    } catch (err) {
      console.error('Error al desasignar materia del profesor:', err);
      return false;
    }
  };

  // Función para obtener un profesor por su ID
  const getProfesorById = async (id: number): Promise<Profesor | null> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      // Hacer la llamada al API
      const response = await fetch(`http://localhost:5328/api/usuarios/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.status}`);
      }
      
      const data = await response.json();
      // El backend devuelve directamente el objeto usuario, no dentro de un campo 'usuario'
      return data || null;
    } catch (err) {
      console.error('Error al obtener profesor:', err);
      return null;
    }
  };

  // Función para actualizar un profesor existente
  const updateProfesor = async (id: number, profesor: Partial<Profesor>): Promise<boolean> => {
    try {
      // Obtener el token de autenticación del localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      console.log('Actualizando profesor:', id, profesor);

      // Hacer la llamada al API para actualizar
      const response = await fetch(`http://localhost:5328/api/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profesor)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error en la solicitud: ${response.status}`);
      }
      
      const updatedProfesor = await response.json();
      console.log('Respuesta del servidor:', updatedProfesor);
      
      // Actualizar el profesor en el estado local
      // El backend devuelve directamente el objeto usuario actualizado
      setProfesores(prev => prev.map(p => 
        p.id === id ? { ...p, ...updatedProfesor } : p
      ));
      
      return true;
    } catch (err) {
      console.error('Error al actualizar profesor:', err);
      setError("Error al actualizar el profesor. Por favor, intenta de nuevo más tarde.");
      return false;
    }
  };

  return {
    profesores,
    loading,
    error,
    paginationInfo,
    searchTerm,
    setSearchTerm,
    fetchProfesores,
    deleteProfesor,
    saveProfesor,
    updateProfesor,
    getMateriasProfesor,
    getMateriasDisponibles,
    asignarMateriaProfesor,
    desasignarMateriaProfesor,
    getProfesorById
  };
};

export default useProfesores;
