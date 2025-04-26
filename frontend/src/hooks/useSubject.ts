import { useQuery } from "@tanstack/react-query";

const fetchSubjects = async (groupId: string | null) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const subjectsByGroup: {
    [key: string]: { id: string; name: string; group_id: string }[];
  } = {
    "1": [
      { id: "101", name: "Español I", group_id: "1" },
      { id: "102", name: "Matemáticas I", group_id: "1" },
      { id: "103", name: "Ciencias Naturales I", group_id: "1" },
    ],
    "2": [
      { id: "201", name: "Español II", group_id: "2" },
      { id: "202", name: "Matemáticas II", group_id: "2" },
      { id: "203", name: "Ciencias Naturales II", group_id: "2" },
    ],
    "3": [
      { id: "301", name: "Español III", group_id: "3" },
      { id: "302", name: "Matemáticas III", group_id: "3" },
      { id: "303", name: "Ciencias Naturales III", group_id: "3" },
    ],
  };

  return groupId
    ? subjectsByGroup[groupId as keyof typeof subjectsByGroup] || []
    : Object.values(subjectsByGroup).flat();
};

const useSubjects = (groupId: string | null) => {
  return useQuery({
    queryKey: ["subjects", groupId],
    queryFn: () => fetchSubjects(groupId),
    staleTime: Infinity,
  });
};

export default useSubjects;
