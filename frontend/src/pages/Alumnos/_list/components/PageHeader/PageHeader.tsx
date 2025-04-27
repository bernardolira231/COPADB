import React from 'react';
import { Box, Typography } from "@mui/material";

const PageHeader: React.FC = () => {
  return (
    <>
      <Typography
        variant="h4"
        component="h1"
        color="primary"
        fontWeight="bold"
      >
        Listado de Estudiantes
      </Typography>
    </>
  );
};

export default PageHeader;
