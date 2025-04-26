import React from "react";
import { Button, Box } from "@mui/material";
import { LuSave, LuX } from "react-icons/lu";

interface FormButtonsProps {
  isFormValid: boolean;
  onReset?: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, onReset }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: { xs: 'column', md: 'row' }, 
      gap: 2, 
      mt: 4 
    }}>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={!isFormValid}
        fullWidth
        size="large"
        startIcon={<LuSave />}
        sx={{ py: 1.5 }}
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
        onClick={() => {
          window.location.href = "/home";
        }}
      >
        Cancelar
      </Button>
    </Box>
  );
};

export default FormButtons;
