import { useState, useRef, useEffect, useCallback } from "react";

// Definir tipos para calificaciones
export interface Grade {
  id: number;
  student_id: number;
  student_name: string;
  group_id: number;
  class_participation: number; // Participación en clase (15%)
  exercises: number;           // Ejercicios y prácticas (15%)
  homework: number;            // Tareas o trabajos (25%)
  exams: number;               // Exámenes (35%)
  church_class: number;        // Asistencia a misa (10%)
  final_grade?: number;        // Calificación final calculada
  period: number;              // Periodo o parcial (1-4)
}

// Interfaz para almacenar las calificaciones de todos los parciales
interface AllPeriodsGrades {
  [period: number]: Grade[];
}

interface UseGradesReturn {
  grades: Grade[];
  loading: boolean;
  error: string | null;
  fetchGrades: (groupId?: number, period?: number) => Promise<void>;
  updateGrade: (
    studentId: number,
    field: keyof Omit<
      Grade,
      "id" | "student_id" | "student_name" | "group_id" | "final_grade" | "period"
    >,
    value: number
  ) => void;
  calculateFinalGrades: () => void;
  saveGrades: (
    gradesToSave: Grade[]
  ) => Promise<{ success: boolean; message: string }>;
  downloadGradesReport: (groupId: number, period?: number) => Promise<void>;
  currentPeriod: number;
  setPeriod: (period: number) => void;
  fetchAllPeriods: (groupId: number) => Promise<AllPeriodsGrades | null>;
  calculateFinalAverage: (allPeriods: AllPeriodsGrades) => Grade[];
}

// Ya no necesitamos datos de ejemplo, usaremos datos reales de la API
/* const MOCK_GRADES: Grade[] = [
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
*/

const useGrades = (): UseGradesReturn => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<number>(1); // Estado para el periodo actual

  // Implementar un mecanismo de debounce para evitar múltiples solicitudes
  const fetchTimeoutRef = useRef<number | null>(null);
  const lastFetchParamsRef = useRef<{groupId?: number, period?: number} | null>(null);
  
  // Función para cambiar el periodo actual
  const setPeriod = useCallback((period: number) => {
    // Permitimos el valor 0 para la pestaña de calificación final
    if ((period >= 0 && period <= 4) || period === 5) {
      // Si es 5, lo convertimos a 0 internamente (pestaña de calificación final)
      setCurrentPeriod(period === 5 ? 0 : period);
    }
  }, []);
  
  const fetchGrades = useCallback(async (groupId?: number, period: number = currentPeriod) => {
    // Si el periodo es 0, necesitamos calcular el promedio de los 4 parciales
    if (period === 0) {
      if (!groupId) {
        setError("Se requiere un ID de grupo para obtener las calificaciones.");
        setGrades([]);
        setLoading(false);
        return;
      }
      
      // Guardar los parámetros actuales para comparar
      const currentParams = { groupId, period };
      
      // Si los parámetros son los mismos que la última solicitud y ya estamos cargando, no hacer nada
      if (loading && 
          lastFetchParamsRef.current?.groupId === currentParams.groupId &&
          lastFetchParamsRef.current?.period === currentParams.period) {
        return;
      }
      
      // Limpiar cualquier timeout anterior
      if (fetchTimeoutRef.current !== null) {
        clearTimeout(fetchTimeoutRef.current);
        fetchTimeoutRef.current = null;
      }
      
      // Actualizar los parámetros de la última solicitud
      lastFetchParamsRef.current = currentParams;
      
      // Establecer el estado de carga
      setLoading(true);
      
      // Obtener las calificaciones de todos los parciales y calcular el promedio
      const allPeriodGrades = await fetchAllPeriods(groupId);
      
      if (allPeriodGrades) {
        const finalGrades = calculateFinalAverage(allPeriodGrades);
        setGrades(finalGrades);
      } else {
        setGrades([]);
      }
      
      setLoading(false);
      return;
    }
    
    // Código original para obtener calificaciones de un parcial específico
    if (!groupId) {
      setError("Se requiere un ID de grupo para obtener las calificaciones.");
      setGrades([]);
      setLoading(false);
      return;
    }
    
    // Guardar los parámetros actuales para comparar
    const currentParams = { groupId, period };
    
    // Si los parámetros son los mismos que la última solicitud y ya estamos cargando, no hacer nada
    if (loading && 
        lastFetchParamsRef.current?.groupId === currentParams.groupId &&
        lastFetchParamsRef.current?.period === currentParams.period) {
      return;
    }
    
    // Actualizar los últimos parámetros utilizados
    lastFetchParamsRef.current = currentParams;
    
    // Limpiar cualquier timeout pendiente
    if (fetchTimeoutRef.current !== null) {
      window.clearTimeout(fetchTimeoutRef.current);
    }
    
    // Establecer un nuevo timeout para debounce (300ms)
    fetchTimeoutRef.current = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        // Llamar al endpoint para obtener las calificaciones
        console.log(`Solicitando calificaciones para grupo ${groupId} y periodo ${period}`);
        const response = await fetch(
          `/api/calificaciones/grupo/${groupId}?period=${period}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          console.error(`Error HTTP: ${response.status}`);
          throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        
        if (Array.isArray(data.grades)) {
          // Transformar los datos para que coincidan con nuestra interfaz Grade
          const transformedGrades = data.grades.map((grade: any) => ({
            id: grade.id || 0,
            student_id: grade.student_id,
            student_name: grade.student_name,
            group_id: grade.group_id,
            class_participation: grade.class_participation || 0,
            exercises: grade.exercises || 0,
            homework: grade.homework || 0,
            exams: grade.exams || 0,
            church_class: grade.church_class || 0,
            final_grade: grade.finall || 0,
            period: grade.period || period
          }));
          
          setGrades(transformedGrades);
        } else {
          console.error('El formato de datos recibido no es el esperado:', data);
          setGrades([]);
        }
      } catch (err) {
        console.error("Error al cargar las calificaciones:", err);
        setError("Error al cargar las calificaciones. Por favor, intenta de nuevo más tarde.");
        setGrades([]);
      } finally {
        setLoading(false);
        fetchTimeoutRef.current = null;
      }
    }, 300); // Debounce de 300ms
  }, [setGrades, setLoading, setError, currentPeriod]); // Dependencias del useCallback

  const updateGrade = (
    studentId: number,
    field: keyof Omit<
      Grade,
      "id" | "student_id" | "student_name" | "group_id" | "final_grade" | "period"
    >,
    value: number
  ) => {
    setGrades((prev) =>
      prev.map((item) => {
        if (item.student_id === studentId) {
          // Crear una copia del objeto con el campo actualizado
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };
  
  // Función para calcular las calificaciones finales
  const calculateFinalGrades = () => {
    setGrades((prevGrades) =>
      prevGrades.map((grade) => {
        // Calcular la calificación final según las ponderaciones
        const finalGrade =
          grade.class_participation * 0.15 + // 15%
          grade.exercises * 0.15 + // 15%
          grade.homework * 0.25 + // 25%
          grade.exams * 0.35 + // 35%
          grade.church_class * 0.10; // 10%

        return {
          ...grade,
          final_grade: parseFloat(finalGrade.toFixed(2)),
        };
      })
    );
  };
  
  // Función para obtener las calificaciones de todos los parciales
  const fetchAllPeriods = async (groupId: number): Promise<AllPeriodsGrades | null> => {
    try {
      const allPeriods: AllPeriodsGrades = {};
      
      // Obtener las calificaciones de cada parcial (1-4)
      for (let period = 1; period <= 4; period++) {
        console.log(`Obteniendo calificaciones del parcial ${period} para el grupo ${groupId}`);
        
        const response = await fetch(
          `/api/calificaciones/grupo/${groupId}?period=${period}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          }
        );
        
        if (!response.ok) {
          console.error(`Error al obtener calificaciones del parcial ${period}`);
          continue; // Continuar con el siguiente parcial si hay error
        }
        
        const data = await response.json();
        
        if (data.grades && Array.isArray(data.grades)) {
          // Transformar los datos y guardarlos en el objeto allPeriods
          allPeriods[period] = data.grades.map((grade: any) => ({
            id: grade.id || 0,
            student_id: grade.student_id,
            student_name: grade.student_name,
            group_id: grade.group_id,
            class_participation: grade.class_participation || 0,
            exercises: grade.exercises || 0,
            homework: grade.homework || 0,
            exams: grade.exams || 0,
            church_class: grade.church_class || 0,
            final_grade: grade.finall || 0,
            period: grade.period || period
          }));
        }
      }
      
      return allPeriods;
    } catch (error) {
      console.error("Error al obtener calificaciones de todos los parciales:", error);
      return null;
    }
  };
  
  // Función para calcular el promedio final de todos los parciales
  const calculateFinalAverage = (allPeriods: AllPeriodsGrades): Grade[] => {
    // Crear un mapa de estudiantes para facilitar el acceso
    const studentsMap: { [studentId: number]: Grade } = {};
    
    // Inicializar el mapa con los estudiantes del primer parcial que encontremos
    for (let period = 1; period <= 4; period++) {
      if (allPeriods[period] && allPeriods[period].length > 0) {
        allPeriods[period].forEach(grade => {
          if (!studentsMap[grade.student_id]) {
            // Inicializar con valores en cero
            studentsMap[grade.student_id] = {
              id: 0,
              student_id: grade.student_id,
              student_name: grade.student_name,
              group_id: grade.group_id,
              class_participation: 0,
              exercises: 0,
              homework: 0,
              exams: 0,
              church_class: 0,
              final_grade: 0,
              period: 0 // Usamos 0 para indicar que es la calificación final
            };
          }
        });
        break;
      }
    }
    
    // Para cada estudiante, calcular el promedio de cada campo a través de todos los parciales
    Object.keys(studentsMap).forEach(studentIdStr => {
      const studentId = parseInt(studentIdStr);
      let periodCount = 0;
      
      // Sumar los valores de cada parcial
      for (let period = 1; period <= 4; period++) {
        if (allPeriods[period]) {
          const studentGrade = allPeriods[period].find(g => g.student_id === studentId);
          
          if (studentGrade) {
            periodCount++;
            studentsMap[studentId].class_participation += studentGrade.class_participation;
            studentsMap[studentId].exercises += studentGrade.exercises;
            studentsMap[studentId].homework += studentGrade.homework;
            studentsMap[studentId].exams += studentGrade.exams;
            studentsMap[studentId].church_class += studentGrade.church_class;
          }
        }
      }
      
      // Calcular el promedio si hay al menos un parcial
      if (periodCount > 0) {
        studentsMap[studentId].class_participation /= periodCount;
        studentsMap[studentId].exercises /= periodCount;
        studentsMap[studentId].homework /= periodCount;
        studentsMap[studentId].exams /= periodCount;
        studentsMap[studentId].church_class /= periodCount;
        
        // Calcular la calificación final con las ponderaciones
        const finalGrade =
          studentsMap[studentId].class_participation * 0.15 +
          studentsMap[studentId].exercises * 0.15 +
          studentsMap[studentId].homework * 0.25 +
          studentsMap[studentId].exams * 0.35 +
          studentsMap[studentId].church_class * 0.10;
        
        studentsMap[studentId].final_grade = parseFloat(finalGrade.toFixed(2));
        
        // Redondear los valores para mejor visualización
        studentsMap[studentId].class_participation = parseFloat(studentsMap[studentId].class_participation.toFixed(2));
        studentsMap[studentId].exercises = parseFloat(studentsMap[studentId].exercises.toFixed(2));
        studentsMap[studentId].homework = parseFloat(studentsMap[studentId].homework.toFixed(2));
        studentsMap[studentId].exams = parseFloat(studentsMap[studentId].exams.toFixed(2));
        studentsMap[studentId].church_class = parseFloat(studentsMap[studentId].church_class.toFixed(2));
      }
    });
    
    // Convertir el mapa a un array de calificaciones
    return Object.values(studentsMap);
  };

  const saveGrades = async (gradesToSave: Grade[]) => {
    try {
      // Obtener el ID de grupo y periodo del primer registro
      const groupId = gradesToSave[0]?.group_id;
      const period = gradesToSave[0]?.period || currentPeriod;
      
      if (!groupId) {
        console.error("No se pudo determinar el ID del grupo");
        return { success: false, message: "No se pudo determinar el ID del grupo" };
      }
      
      // Preparar los datos para enviar al backend
      const cleanedGrades = gradesToSave.map(grade => ({
        student_id: grade.student_id,
        group_id: groupId,
        class_participation: grade.class_participation,
        exercises: grade.exercises,
        homework: grade.homework,
        exams: grade.exams,
        church_class: grade.church_class,
        period: grade.period || period
      }));
      
      // Llamar al endpoint para guardar las calificaciones
      console.log('Guardando calificaciones:', cleanedGrades);
      console.log('Datos a enviar:', {
        grades: cleanedGrades,
        group_id: groupId,
        period: period
      });
      
      const response = await fetch('/api/calificaciones/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grades: cleanedGrades,
          group_id: groupId,
          period: period
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Error HTTP ${response.status}:`, errorText);
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
      
      // Después de guardar exitosamente, actualizar la lista de calificaciones
      if (data.success) {
        // Refrescar los datos después de guardar
        fetchGrades(groupId, period);
      }
      
      return { 
        success: data.success, 
        message: data.message || "¡Calificaciones guardadas correctamente!" 
      };
    } catch (e) {
      console.error("Error al guardar las calificaciones:", e);
      return { success: false, message: "Error al guardar las calificaciones" };
    }
  };

  // Función para descargar el reporte CSV de calificaciones
  const downloadGradesReport = async (groupId: number, period: number = currentPeriod) => {
    try {
      console.log(`Descargando reporte de calificaciones para el grupo ${groupId}`);
      
      // Mostrar un indicador de carga
      setLoading(true);
      
      // Hacer la solicitud al endpoint para descargar el reporte CSV
      const response = await fetch(`/api/calificaciones/reporte/${groupId}?period=${period}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      // Obtener el blob del CSV
      const blob = await response.blob();
      
      // Crear una URL para el blob
      const url = window.URL.createObjectURL(blob);
      
      // Crear un elemento <a> para descargar el archivo
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      
      // Obtener el nombre del archivo del header Content-Disposition
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'Reporte_Calificaciones.csv';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim();
        }
      }
      
      a.download = filename;
      
      // Agregar el elemento al DOM y hacer clic en él para iniciar la descarga
      document.body.appendChild(a);
      a.click();
      
      // Limpiar
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Reporte descargado correctamente');
    } catch (err) {
      console.error('Error al descargar el reporte de calificaciones:', err);
      setError('Error al descargar el reporte de calificaciones. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
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
    downloadGradesReport,
    currentPeriod,
    setPeriod,
    fetchAllPeriods,
    calculateFinalAverage
  };
};

export default useGrades;
