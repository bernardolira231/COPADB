import { Box, Button } from "@mui/material";
import { Link } from "@tanstack/react-router";

const Actions = () => {
  return (
    <Box>
      <Button variant="contained" color="primary">
        <Link to="/alumnos/agregar">Agregar Estudiante</Link>
      </Button>
    </Box>
  );
};

export default Actions;
