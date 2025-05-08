import { useQuery } from "@tanstack/react-query";

interface Group {
  id: string;
  name: string;
}

// Función para obtener todos los grupos del backend
const fetchAllGroups = async (): Promise<Group[]> => {
  try {
    // Simulación de retardo de red
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    // Cuando el endpoint esté disponible, descomentar este código y comentar el return de abajo
    /*
    const response = await fetch('http://localhost:5328/api/groups', {
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
    
    return await response.json();
    */
    
    // Datos simulados (eliminar cuando el endpoint esté disponible)
    return [
      { id: "1", name: "Primero A" },
      { id: "2", name: "Segundo A" },
      { id: "3", name: "Tercero A" },
      { id: "4", name: "Cuarto A" },
      { id: "5", name: "Quinto A" },
      { id: "6", name: "Sexto A" }
    ];
  } catch (error) {
    console.error("Error al obtener grupos:", error);
    throw error;
  }
};

// Hook para obtener todos los grupos
const useGetAllGroups = () => {
  return useQuery({
    queryKey: ["all-groups"],
    queryFn: fetchAllGroups,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 1
  });
};

export type { Group };
export default useGetAllGroups;
