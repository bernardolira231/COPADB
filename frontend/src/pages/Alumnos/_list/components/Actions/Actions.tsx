import { Button } from "@mui/material";
import { LuUserPlus } from "react-icons/lu";
import { Link } from "@tanstack/react-router";

const Actions = () => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<LuUserPlus />}
      component={Link}
      to="/alumnos/agregar"
      size="medium"
    >
      Agregar Estudiante
    </Button>
  );
};

export default Actions;
