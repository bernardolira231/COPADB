import { SxProps, Theme } from "@mui/material";

const useSx = () => {
  const tableHead: SxProps<Theme> = {
    backgroundColor: "#f5f5f5",
    "& th": {
      fontWeight: 600,
    },
  };

  const tableCell: SxProps<Theme> = {
    py: 1.5,
  };

  const gradeInput: SxProps<Theme> = {
    width: "60px",
    textAlign: "center",
    "& input": {
      textAlign: "center",
      padding: "8px 0",
    },
  };

  const finalGradeCell: SxProps<Theme> = {
    fontWeight: 600,
    fontSize: "1rem",
  };

  const highGrade: SxProps<Theme> = {
    color: "#2e7d32",
  };

  const mediumGrade: SxProps<Theme> = {
    color: "#1976d2",
  };

  const lowGrade: SxProps<Theme> = {
    color: "#d32f2f",
  };

  const exportButton: SxProps<Theme> = {
    mt: 2,
    textTransform: "none",
    backgroundColor: "#f5f5f5",
    color: "#333",
    "&:hover": {
      backgroundColor: "#e0e0e0",
    },
  };

  const saveButton: SxProps<Theme> = {
    mt: 2,
    ml: 1,
    textTransform: "none",
  };

  return {
    tableHead,
    tableCell,
    gradeInput,
    finalGradeCell,
    highGrade,
    mediumGrade,
    lowGrade,
    exportButton,
    saveButton,
  };
};

export default useSx;
