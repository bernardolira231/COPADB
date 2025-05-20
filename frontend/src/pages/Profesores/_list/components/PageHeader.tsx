import React from "react";
import { Typography, Box } from "@mui/material";

const PageHeader = () => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
        Listado de Usuarios
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Gestiona la información de los usuarios del sistema
      </Typography>
    </Box>
  );
};

export default PageHeader;
