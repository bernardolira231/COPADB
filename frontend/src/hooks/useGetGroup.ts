import { useQuery } from "@tanstack/react-query";

const fetchGroup = async (groupId: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Simulación de datos obtenidos del backend
  const groups = [
    { id: "1", name: "Primero A" },
    { id: "2", name: "Segundo A" },
    { id: "3", name: "Tercero A" },
  ];

  return groups.find(group => group.id === groupId) || null;
};

const useGetGroup = (groupId: string) => {
  return useQuery({
    queryKey: ["group", groupId],
    queryFn: () => fetchGroup(groupId),
    staleTime: Infinity,
  });
};

export default useGetGroup;
