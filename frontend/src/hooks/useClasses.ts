import { useQuery } from "@tanstack/react-query";

const fetchClasses = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return ["Primero A", "Primero B" ,"Segundo B", "Tercero A"];
};

const useClasses = () => {
  return useQuery({
    queryKey: ["classes"],
    queryFn: fetchClasses,
    staleTime: Infinity,
  });
};

export default useClasses;
