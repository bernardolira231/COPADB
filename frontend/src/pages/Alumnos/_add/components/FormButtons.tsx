import React from "react";
import { Button, Box } from "@mui/material";
import { LuSave, LuX } from "react-icons/lu";

interface FormButtonsProps {
  isFormValid: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
  disabled?: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ 
  isFormValid, 
  submitButtonText = "Registrar Estudiante",
  cancelButtonText = "Cancelar",
  onSubmit,
  onCancel,
  disabled = false
}) => {
  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
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
        disabled={!isFormValid || disabled}
        fullWidth
        size="large"
        startIcon={<LuSave />}
        sx={{ py: 1.5 }}
        onClick={handleSubmit}
      >
        {submitButtonText}
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
        {cancelButtonText}
      </Button>
    </Box>
  );
};

export default FormButtons;
