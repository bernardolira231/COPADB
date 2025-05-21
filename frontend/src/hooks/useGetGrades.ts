import { useState, useRef } from "react";

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
  finall: number;              // Calificación final calculada
}

interface UseGradesReturn {
  grades: Grade[];
  loading: boolean;
  error: string | null;
  fetchGrades: (groupId?: number) => Promise<void>;
  updateGrade: (studentId: number, field: keyof Omit<Grade, 'id' | 'student_id' | 'student_name' | 'group_id' | 'finall'>, value: number) => void;
  saveGrades: (grades: Grade[]) => Promise<{ success: boolean; message: string }>;
  downloadGradesReport: (groupId: number) => Promise<void>;
}

const useGetGrades = (): UseGradesReturn => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Implementar un mecanismo de debounce para evitar múltiples solicitudes
  const fetchTimeoutRef = useRef<number | null>(null);
  const lastFetchParamsRef = useRef<{groupId?: number} | null>(null);
  
  const fetchGrades = async (groupId?: number) => {
    if (!groupId) {
      setError("Se requiere un ID de grupo para obtener las calificaciones.");
      setGrades([]);
      setLoading(false);
      return;
    }
    
    // Guardar los parámetros actuales para comparar
    const currentParams = { groupId };
    
    // Si los parámetros son los mismos que la última solicitud y ya estamos cargando, no hacer nada
    if (loading && lastFetchParamsRef.current?.groupId === currentParams.groupId) {
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
        console.log(`Solicitando calificaciones para grupo ${groupId}`);
        const response = await fetch(
          `http://localhost:5328/api/calificaciones/grupo/${groupId}`,
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
          setGrades(data.grades);
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
  };

  const updateGrade = (studentId: number, field: keyof Omit<Grade, 'id' | 'student_id' | 'student_name' | 'group_id' | 'finall'>, value: number) => {
    setGrades((prev) => {
      return prev.map((grade) => {
        if (grade.student_id === studentId) {
          // Crear una copia del objeto grade con el campo actualizado
          const updatedGrade = { ...grade, [field]: value };
          
          // Calcular la calificación final según las ponderaciones
          const finall = (
            updatedGrade.class_participation * 0.15 +  // 15%
            updatedGrade.exercises * 0.15 +            // 15%
            updatedGrade.homework * 0.25 +             // 25%
            updatedGrade.exams * 0.35 +                // 35%
            updatedGrade.church_class * 0.10           // 10%
          );
          
          // Redondear a dos decimales
          updatedGrade.finall = Math.round(finall * 100) / 100;
          
          return updatedGrade;
        }
        return grade;
      });
    });
  };

  const saveGrades = async (gradesToSave: Grade[]) => {
    try {
      // Obtener el ID de grupo del primer registro
      const groupId = gradesToSave[0]?.group_id;
      
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
        church_class: grade.church_class
      }));
      
      // Llamar al endpoint para guardar las calificaciones
      console.log('Guardando calificaciones:', cleanedGrades);
      console.log('Datos a enviar:', {
        grades: cleanedGrades,
        group_id: groupId
      });
      
      const response = await fetch('http://localhost:5328/api/calificaciones/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grades: cleanedGrades,
          group_id: groupId
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
        fetchGrades(groupId);
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
  const downloadGradesReport = async (groupId: number) => {
    try {
      console.log(`Descargando reporte de calificaciones para el grupo ${groupId}`);
      
      // Mostrar un indicador de carga
      setLoading(true);
      
      // Hacer la solicitud al endpoint para descargar el reporte CSV
      const response = await fetch(`http://localhost:5328/api/calificaciones/reporte/${groupId}`, {
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

  return {
    grades,
    loading,
    error,
    fetchGrades,
    updateGrade,
    saveGrades,
    downloadGradesReport
  };
};

export default useGetGrades;
