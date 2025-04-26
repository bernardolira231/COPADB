import { useQuery } from "@tanstack/react-query";

const fetchGroups = async (professorId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulación de datos obtenidos del backend
  return [
    { id: "1", name: "Primero A" },
    { id: "2", name: "Segundo A" },
    { id: "3", name: "Tercero A" },
  ];
};

const useGroups = (professorId: string) => {
  return useQuery({
    queryKey: ["groups", professorId],
    queryFn: () => fetchGroups(professorId),
    staleTime: Infinity,
  });
};

export default useGroups;
