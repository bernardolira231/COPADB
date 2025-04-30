import { Box, Button } from "@mui/material";
import useSx from "./sx";

const Actions = () => {
  const sx = useSx();
  return (
    <Box sx={sx.container}>
      <Button variant="contained">Marcar todos presentes</Button>
      <Button variant="contained">Reiniciar</Button>
    </Box>
  );
};

export default Actions;
