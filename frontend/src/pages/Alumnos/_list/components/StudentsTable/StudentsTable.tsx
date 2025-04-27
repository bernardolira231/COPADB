import React from 'react';
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  TablePagination,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
  Alert
} from "@mui/material";
import { LuPencil, LuTrash, LuEye } from "react-icons/lu";
import { Estudiante } from '../../../../../types/estudiante';

interface StudentsTableProps {
  estudiantes: Estudiante[];
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  handleChangePage: (_event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (id: number) => void;
}

const StudentsTable: React.FC<StudentsTableProps> = ({
  estudiantes,
  loading,
  error,
  page,
  rowsPerPage,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDelete
}) => {
  // Función para obtener el nombre completo del estudiante
  const getNombreCompleto = (estudiante: Estudiante) => {
    return `${estudiante.name} ${estudiante.lastname_f} ${estudiante.lastname_m}`;
  };

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={3}>
        <TableContainer>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Tipo de Sangre</strong></TableCell>
                  <TableCell><strong>Campus</strong></TableCell>
                  <TableCell><strong>Beca</strong></TableCell>
                  <TableCell><strong>Fecha de Registro</strong></TableCell>
                  <TableCell align="center"><strong>Acciones</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.id} hover>
                    <TableCell>{estudiante.id}</TableCell>
                    <TableCell>{getNombreCompleto(estudiante)}</TableCell>
                    <TableCell>{estudiante.email}</TableCell>
                    <TableCell>{estudiante.blood_type}</TableCell>
                    <TableCell>{estudiante.school_campus}</TableCell>
                    <TableCell>
                      <Chip 
                        label={estudiante.scholar_ship ? "Sí" : "No"} 
                        color={estudiante.scholar_ship ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(estudiante.reg_date).toLocaleDateString('es-MX')}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver detalles">
                        <IconButton size="small" color="primary">
                          <LuEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton size="small" color="primary">
                          <LuPencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(estudiante.id)}
                        >
                          <LuTrash />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
                {estudiantes.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                      No hay estudiantes registrados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={totalCount}
          rowsPerPage={rowsPerPage}
          page={page - 1} // TablePagination usa base-0 para las páginas
          onPageChange={(e, newPage) => handleChangePage(e, newPage + 1)} // Convertir de base-0 a base-1
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        />
      </Paper>
    </>
  );
};

export default StudentsTable;
