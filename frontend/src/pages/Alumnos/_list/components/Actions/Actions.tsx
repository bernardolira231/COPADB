import { Button, useTheme, alpha } from "@mui/material";
import { LuUserPlus } from "react-icons/lu";
import { Link } from "@tanstack/react-router";

const Actions = () => {
  const theme = useTheme();
  
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<LuUserPlus size={18} />}
      component={Link}
      to="/alumnos/agregar"
      size="medium"
      sx={{
        borderRadius: 0,
        padding: '10px 16px',
        textTransform: 'none',
        fontWeight: 500,
        boxShadow: 'none',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: alpha(theme.palette.primary.main, 0.9),
          transform: 'translateY(-2px)'
        },
        '&:active': {
          transform: 'translateY(0px)'
        }
      }}
    >
      Agregar Estudiante
    </Button>
  );
};

export default Actions;
