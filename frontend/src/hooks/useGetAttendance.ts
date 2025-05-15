import { useState, useEffect, useRef } from "react";

// Definir tipos para asistencia (puedes ajustarlos según tu modelo real)
export interface Attendance {
  id: number;
  student_id: number;
  student_name: string;
  date: string;
  present: boolean;
  group_id: number;
}

interface UseAttendanceReturn {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (date?: string, groupId?: number) => Promise<void>;
  toggleAttendance: (id: number, studentId?: number) => void;
  setAllPresent: () => void;
  setAllAbsent: () => void;
  saveAttendance: (attendance: Attendance[]) => Promise<{ success: boolean; message: string }>;
}

// Ya no necesitamos datos mock, usaremos datos reales de la API

const useGetAttendance = (): UseAttendanceReturn => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Implementar un mecanismo de debounce para evitar múltiples solicitudes
  const fetchTimeoutRef = useRef<number | null>(null);
  const lastFetchParamsRef = useRef<{date?: string, groupId?: number} | null>(null);
  
  const fetchAttendance = async (date?: string, groupId?: number, preserveState: boolean = false) => {
    if (!groupId) {
      setError("Se requiere un ID de grupo para obtener la asistencia.");
      setAttendance([]);
      setLoading(false);
      return;
    }
    
    // Guardar los parámetros actuales para comparar
    const currentParams = { date, groupId };
    
    // Si los parámetros son los mismos que la última solicitud y ya estamos cargando, no hacer nada
    if (loading && 
        lastFetchParamsRef.current?.date === currentParams.date && 
        lastFetchParamsRef.current?.groupId === currentParams.groupId) {
      return;
    }
    
    // Guardar el estado actual de asistencia si es necesario preservarlo
    const currentAttendanceState = preserveState ? 
      attendance.reduce((acc, item) => {
        acc[item.student_id] = item.present;
        return acc;
      }, {} as Record<number, boolean>) : {};
    
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
        // Formatear la fecha si se proporciona
        const formattedDate = date || new Date().toISOString().split('T')[0];
        
        // Llamar al endpoint para obtener la asistencia
        console.log(`Solicitando asistencia para grupo ${groupId} en fecha ${formattedDate}`);
        const response = await fetch(
          `http://localhost:5328/api/asistencia/grupo/${groupId}?date=${formattedDate}`,
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
        
        if (Array.isArray(data.attendance)) {
          // Si estamos preservando el estado, aplicamos el estado guardado
          if (preserveState && Object.keys(currentAttendanceState).length > 0) {
            const updatedAttendance = data.attendance.map((item: Attendance) => ({
              ...item,
              present: currentAttendanceState[item.student_id] !== undefined 
                ? currentAttendanceState[item.student_id] 
                : item.present
            }));
            console.log('Preservando estado de asistencia:', updatedAttendance);
            setAttendance(updatedAttendance);
          } else {
            setAttendance(data.attendance);
          }
        } else {
          console.error('El formato de datos recibido no es el esperado:', data);
          setAttendance([]);
        }
      } catch (err) {
        console.error("Error al cargar la asistencia:", err);
        setError("Error al cargar la asistencia. Por favor, intenta de nuevo más tarde.");
        setAttendance([]);
      } finally {
        setLoading(false);
        fetchTimeoutRef.current = null;
      }
    }, 300); // Debounce de 300ms
  };

  const toggleAttendance = (id: number, studentId?: number) => {
    setAttendance((prev) => {
      // Si el id es 0 (registro no existe en BD), usamos studentId para identificar al estudiante
      if (id === 0 && studentId) {
        return prev.map((item) =>
          item.student_id === studentId ? { ...item, present: !item.present } : item
        );
      } else {
        // Si el id es válido (>0), usamos id normalmente
        return prev.map((item) =>
          item.id === id ? { ...item, present: !item.present } : item
        );
      }
    });
  };

  const setAllPresent = () => {
    setAttendance((prev) => prev.map((item) => ({ ...item, present: true })));
  };

  const setAllAbsent = () => {
    setAttendance((prev) => prev.map((item) => ({ ...item, present: false })));
  };

  const saveAttendance = async (attendanceToSave: Attendance[]) => {
    try {
      // Obtener el ID de grupo y la fecha del primer registro (deberían ser iguales para todos)
      const groupId = attendanceToSave[0]?.group_id;
      const date = attendanceToSave[0]?.date;
      
      if (!groupId) {
        console.error("No se pudo determinar el ID del grupo");
        return { success: false, message: "No se pudo determinar el ID del grupo" };
      }
      
      // Guardar el estado actual de asistencia para mantenerlo después de refrescar
      const currentAttendanceState = attendanceToSave.reduce((acc, record) => {
        acc[record.student_id] = record.present;
        return acc;
      }, {} as Record<number, boolean>);
      
      console.log('Estado actual de asistencia:', currentAttendanceState);
      
      // Preparar los datos para enviar al backend
      // Asegurarse de que todos los registros tengan los datos necesarios
      const cleanedAttendance = attendanceToSave.map(record => ({
        student_id: record.student_id,
        present: record.present,
        group_id: groupId,
        date: date
      }));
      
      // Llamar al endpoint para guardar la asistencia
      console.log('Guardando asistencia:', cleanedAttendance);
      console.log('Datos a enviar:', {
        attendance: cleanedAttendance,
        date: date,
        group_id: groupId
      });
      
      const response = await fetch('http://localhost:5328/api/asistencia/guardar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          attendance: cleanedAttendance,
          date: date,
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
      
      // Después de guardar exitosamente, actualizar la lista de asistencia
      if (data.success) {
        // Refrescar los datos después de guardar, pero preservando el estado actual
        fetchAttendance(date, groupId, true);
        
        // Como alternativa, podemos aplicar directamente el estado sin hacer una nueva solicitud
        // setAttendance(prev => prev.map(item => ({
        //   ...item,
        //   present: currentAttendanceState[item.student_id] ?? item.present
        // })));
      }
      
      return { 
        success: data.success, 
        message: data.message || "¡Asistencia guardada correctamente!" 
      };
    } catch (e) {
      console.error("Error al guardar la asistencia:", e);
      return { success: false, message: "Error al guardar la asistencia" };
    }
  };

  // Cargar asistencia al montar el componente
  useEffect(() => {
    // No llamar automáticamente a fetchAttendance al montar
    // ya que AttendanceProvider lo hará con los parámetros correctos
    return () => {
      // Limpiar timeout al desmontar
      if (fetchTimeoutRef.current !== null) {
        window.clearTimeout(fetchTimeoutRef.current);
      }
    };
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