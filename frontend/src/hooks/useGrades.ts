import { useState, useEffect } from "react";

// Definir tipos para calificaciones
export interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  exam1: number;
  exam2: number;
  project: number;
  participation: number;
  final_grade?: number;
}

interface UseGradesReturn {
  grades: Grade[];
  loading: boolean;
  error: string | null;
  fetchGrades: (groupId?: number) => Promise<void>;
  updateGrade: (
    id: number,
    field: keyof Omit<
      Grade,
      "id" | "student_id" | "student_name" | "final_grade"
    >,
    value: number
  ) => void;
  calculateFinalGrades: () => void;
  saveGrades: (
    gradesToSave: Grade[]
  ) => Promise<{ success: boolean; message: string }>;
}

// Datos de ejemplo para desarrollo
const MOCK_GRADES: Grade[] = [
  {
    id: 1,
    student_id: 101,
    student_name: "Ana García Martínez",
    exam1: 8.5,
    exam2: 7.8,
    project: 9.2,
    participation: 8,
    final_grade: 8.5,
  },
  {
    id: 2,
    student_id: 102,
    student_name: "Carlos López Rodríguez",
    exam1: 7.2,
    exam2: 8.1,
    project: 8.5,
    participation: 7.5,
    final_grade: 7.9,
  },
  {
    id: 3,
    student_id: 103,
    student_name: "María Fernández Sánchez",
    exam1: 9.5,
    exam2: 9.3,
    project: 9.8,
    participation: 9,
    final_grade: 9.5,
  },
  {
    id: 4,
    student_id: 104,
    student_name: "Juan Pérez González",
    exam1: 6.8,
    exam2: 7.2,
    project: 8,
    participation: 7,
    final_grade: 7.3,
  },
  {
    id: 5,
    student_id: 105,
    student_name: "Laura Díaz Ramírez",
    exam1: 8.7,
    exam2: 8.5,
    project: 9,
    participation: 8.5,
    final_grade: 8.7,
  },
  {
    id: 6,
    student_id: 106,
    student_name: "Miguel Torres Vázquez",
    exam1: 7.5,
    exam2: 7,
    project: 8.2,
    participation: 7.8,
    final_grade: 7.7,
  },
  {
    id: 7,
    student_id: 107,
    student_name: "Sofía Ruiz Jiménez",
    exam1: 9,
    exam2: 8.8,
    project: 9.5,
    participation: 9.2,
    final_grade: 9.2,
  },
  {
    id: 8,
    student_id: 108,
    student_name: "Pablo Hernández Moreno",
    exam1: 6.5,
    exam2: 7.5,
    project: 7.8,
    participation: 6.8,
    final_grade: 7.3,
  },
  {
    id: 9,
    student_id: 109,
    student_name: "Elena Castro Ortega",
    exam1: 8.2,
    exam2: 8,
    project: 8.7,
    participation: 8.3,
    final_grade: 8.3,
  },
  {
    id: 10,
    student_id: 110,
    student_name: "David Álvarez Gutiérrez",
    exam1: 7.8,
    exam2: 8.2,
    project: 8,
    participation: 7.5,
    final_grade: 7.9,
  },
];

const useGrades = (): UseGradesReturn => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = async (groupId?: number) => {
    setLoading(true);
    setError(null);
    try {
      // Aquí iría la llamada real al API. Por ahora usamos mock data.
      await new Promise((resolve) => setTimeout(resolve, 600)); // Simular delay
      setGrades(MOCK_GRADES);
    } catch (err) {
      setError(
        "Error al cargar las calificaciones. Por favor, intenta de nuevo más tarde."
      );
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const updateGrade = (
    id: number,
    field: keyof Omit<
      Grade,
      "id" | "student_id" | "student_name" | "final_grade"
    >,
    value: number
  ) => {
    setGrades((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const calculateFinalGrades = () => {
    setGrades((prev) =>
      prev.map((item) => {
        // Cálculo ponderado: Examen 1 (25%) + Examen 2 (25%) + Proyecto (35%) + Participación (15%)
        const finalGrade = (
          item.exam1 * 0.25 +
          item.exam2 * 0.25 +
          item.project * 0.35 +
          item.participation * 0.15
        ).toFixed(1);

        return { ...item, final_grade: parseFloat(finalGrade) };
      })
    );
  };

  const saveGrades = async (gradesToSave: Grade[]) => {
    // Aquí iría la petición real a tu backend
    try {
      await new Promise((res) => setTimeout(res, 1000));
      return {
        success: true,
        message: "¡Calificaciones guardadas correctamente!",
      };
    } catch (e) {
      return { success: false, message: "Error al guardar las calificaciones" };
    }
  };

  // Cargar calificaciones al montar el componente
  useEffect(() => {
    fetchGrades();
  }, []);

  return {
    grades,
    loading,
    error,
    fetchGrades,
    updateGrade,
    calculateFinalGrades,
    saveGrades,
  };
};

export default useGrades;
