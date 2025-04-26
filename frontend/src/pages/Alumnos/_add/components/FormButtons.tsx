import React from "react";
import { Button, Box } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { LuSave, LuX } from "react-icons/lu";

interface FormButtonsProps {
  isFormValid: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid }) => {
  const navigate = useNavigate();
  const handleSave = () => {
    navigate({ to: "/alumnos" });
  };
  const handleCancel = () => {
    navigate({ to: "/alumnos" });
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        gap: 2,
        mt: 4,
      }}
    >
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        fullWidth
        size="large"
        startIcon={<LuSave />}
        sx={{ py: 1.5 }}
        onClick={handleSave}
      >
        Registrar Estudiante
      </Button>
      <Button
        type="button"
        variant="contained"
        color="error"
        fullWidth
        size="large"
        startIcon={<LuX />}
        sx={{ py: 1.5 }}
        onClick={handleCancel}
      >
        Cancelar
      </Button>
    </Box>
  );
};

export default FormButtons;
