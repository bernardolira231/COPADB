import { useState, useEffect } from "react";

// Definir tipos para asistencia (puedes ajustarlos según tu modelo real)
export interface Attendance {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  present: boolean;
}

interface UseAttendanceReturn {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (date?: string, groupId?: number) => Promise<void>;
  toggleAttendance: (id: number) => void;
  setAllPresent: () => void;
  setAllAbsent: () => void;
  saveAttendance: (attendance: Attendance[]) => Promise<{ success: boolean; message: string }>;
}

const MOCK_ATTENDANCE: Attendance[] = [
  {
    id: 1,
    student_id: 101,
    student_name: "Juan Pérez",
    date: "2025-04-29",
    present: true,
  },
  {
    id: 2,
    student_id: 102,
    student_name: "María López",
    date: "2025-04-29",
    present: false,
  },
  {
    id: 3,
    student_id: 103,
    student_name: "Carlos Sánchez",
    date: "2025-04-29",
    present: true,
  },
];

const useGetAttendance = (): UseAttendanceReturn => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async (date?: string, groupId?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Aquí iría la llamada real al API. Por ahora usamos mock data.
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simular delay
      setAttendance(MOCK_ATTENDANCE);
    } catch (err) {
      setError("Error al cargar la asistencia. Por favor, intenta de nuevo más tarde.");
      setAttendance([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAttendance = (id: number) => {
    setAttendance((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, present: !item.present } : item
      )
    );
  };

  const setAllPresent = () => {
    setAttendance((prev) => prev.map((item) => ({ ...item, present: true })));
  };

  const setAllAbsent = () => {
    setAttendance((prev) => prev.map((item) => ({ ...item, present: false })));
  };

  const saveAttendance = async (attendanceToSave: Attendance[]) => {
    // Aquí iría la petición real a tu backend
    try {
      await new Promise((res) => setTimeout(res, 1000));
      return { success: true, message: "¡Asistencia guardada correctamente!" };
    } catch (e) {
      return { success: false, message: "Error al guardar la asistencia" };
    }
  };

  // Cargar asistencia al montar el componente
  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendance,
    loading,
    error,
    fetchAttendance,
    toggleAttendance,
    setAllPresent,
    setAllAbsent,
    saveAttendance,
  };
};

export default useGetAttendance;