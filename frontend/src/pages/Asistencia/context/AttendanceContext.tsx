import React, { createContext, useContext } from "react";
import useGetAttendance, { Attendance } from "../../../hooks/useGetAttendance";

interface AttendanceContextProps {
  attendance: Attendance[];
  loading: boolean;
  error: string | null;
  fetchAttendance: (date?: string, groupId?: number) => Promise<void>;
  toggleAttendance: (id: number) => void;
  setAllPresent: () => void;
  setAllAbsent: () => void;
}

const AttendanceContext = createContext<AttendanceContextProps | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const attendanceHook = useGetAttendance();
  return (
    <AttendanceContext.Provider value={attendanceHook}>
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) {
    throw new Error("useAttendance debe usarse dentro de un AttendanceProvider");
  }
  return context;
};
