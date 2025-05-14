import React, { createContext, useContext, useState } from "react";
import useGrades, { Grade } from "../../../hooks/useGrades";
import { Snackbar } from "@mui/material";

interface GradesContextProps {
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
  saveGrades: () => Promise<void>;
  saving: boolean;
}

const GradesContext = createContext<GradesContextProps | undefined>(undefined);

export const GradesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const gradesHook = useGrades();
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const saveGrades = async () => {
    setSaving(true);
    // Calcular calificaciones finales antes de guardar
    gradesHook.calculateFinalGrades();
    const { success, message } = await gradesHook.saveGrades(gradesHook.grades);
    setSnackbar({
      open: true,
      message,
      severity: success ? "success" : "error",
    });
    setSaving(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <GradesContext.Provider
      value={{
        ...gradesHook,
        saveGrades,
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
          style: {
            background: snackbar.severity === "success" ? "#43a047" : "#d32f2f",
            color: "#fff",
          },
        }}
      />
    </GradesContext.Provider>
  );
};

export const useGradesContext = () => {
  const ctx = useContext(GradesContext);
  if (!ctx)
    throw new Error("useGradesContext debe usarse dentro de GradesProvider");
  return ctx;
};
