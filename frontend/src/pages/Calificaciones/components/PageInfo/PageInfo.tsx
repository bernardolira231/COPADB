import { Box, Typography } from "@mui/material";
import useSx from "./sx";

interface PageInfoProps {
  materiaSeleccionada: { class_name: string };
}

const PageInfo = ({ materiaSeleccionada }: PageInfoProps) => {
  const sx = useSx();

  return (
    <Box sx={sx.container}>
      <Typography variant="h5" sx={sx.title}>
        {materiaSeleccionada.class_name}
      </Typography>
    </Box>
  );
};

export default PageInfo;
