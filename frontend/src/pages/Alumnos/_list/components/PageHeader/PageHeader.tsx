import React from 'react';
import { Box, Typography } from "@mui/material";
import Actions from '../Actions';

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
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Actions />
      </Box>
    </>
  );
};

export default PageHeader;
