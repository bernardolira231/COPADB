import React, { createContext, useContext, useState } from "react";
import useGetAttendance, { Attendance } from "../../../hooks/useGetAttendance";
import { Snackbar } from "@mui/material";

interface AttendanceContextProps {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (date?: string, groupId?: number) => Promise<void>;
  toggleAttendance: (id: number) => void;
  setAllPresent: () => void;
  setAllAbsent: () => void;
  guardarAsistencia: () => Promise<void>;
  saving: boolean;
}

const AttendanceContext = createContext<AttendanceContextProps | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const attendanceHook = useGetAttendance();
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" });

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
