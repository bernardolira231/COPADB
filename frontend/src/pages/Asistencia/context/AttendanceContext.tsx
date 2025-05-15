import React, { createContext, useContext, useState } from "react";
import useGetAttendance, { Attendance } from "../../../hooks/useGetAttendance";
import { Snackbar } from "@mui/material";

interface AttendanceContextProps {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (date?: string, groupId?: number) => Promise<void>;
  toggleAttendance: (id: number, studentId?: number) => void;
  setAllPresent: () => void;
  setAllAbsent: () => void;
  guardarAsistencia: () => Promise<void>;
  downloadAttendanceReport: (groupId: number) => Promise<void>;
  saving: boolean;
}

const AttendanceContext = createContext<AttendanceContextProps | undefined>(undefined);

interface AttendanceProviderProps {
  children: React.ReactNode;
  groupId?: number;
  date?: string;
}

export const AttendanceProvider: React.FC<AttendanceProviderProps> = ({ 
  children,
  groupId,
  date 
}) => {
  const attendanceHook = useGetAttendance();
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

  // Cargar la asistencia cuando cambie el groupId o la fecha
  // Usamos una referencia para evitar múltiples solicitudes durante re-renders
  const prevParamsRef = React.useRef<{groupId?: number, date?: string}>({});
  
  React.useEffect(() => {
    // Solo hacer la solicitud si el groupId o la fecha han cambiado
    if (groupId && 
        (prevParamsRef.current.groupId !== groupId || 
         prevParamsRef.current.date !== date)) {
      
      console.log(`Parámetros cambiados: groupId=${groupId}, date=${date}`);
      prevParamsRef.current = { groupId, date };
      attendanceHook.fetchAttendance(date, groupId);
    }
  }, [groupId, date, attendanceHook]);

  const guardarAsistencia = async () => {
    setSaving(true);
    const { success, message } = await attendanceHook.saveAttendance(attendanceHook.attendance);
    setSnackbar({ open: true, message, severity: success ? "success" : "error" });
    setSaving(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <AttendanceContext.Provider
      value={{
        ...attendanceHook,
        guardarAsistencia,
        saving,
      }}
    >
      {children}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        ContentProps={{
          style: { background: snackbar.severity === "success" ? "#43a047" : "#d32f2f", color: "#fff" },
        }}
      />
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error("useAttendance debe usarse dentro de AttendanceProvider");
  return ctx;
};
