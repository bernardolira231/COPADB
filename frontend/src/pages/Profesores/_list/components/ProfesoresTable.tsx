import React, { useState } from "react";
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
  Alert,
  Typography,
} from "@mui/material";
import { LuPencil, LuTrash, LuEye } from "react-icons/lu";
import { Profesor } from "../../../../types/profesor";
import MateriasModal from "./MateriasModal";
import { 
  profesoresTablePaperSx, 
  profesoresTableHeadCellSx, 
  profesoresTableLoadingSx, 
  profesoresTableCellSx, 
  profesoresTableRowSx, 
  profesoresTablePaginationSx 
} from "./sx";

interface ProfesoresTableProps {
  profesores: Profesor[];
  loading: boolean;
  error: string | null;
  page: number;
  rowsPerPage: number;
  totalCount: number;
  handleChangePage: (_event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleDelete: (id: number) => void;
}

const ProfesoresTable: React.FC<ProfesoresTableProps> = ({
  profesores,
  loading,
  error,
  page,
  rowsPerPage,
  totalCount,
  handleChangePage,
  handleChangeRowsPerPage,
  handleDelete
}) => {
  // Estado para el modal de materias
  const [materiasModalOpen, setMateriasModalOpen] = useState(false);
  const [selectedProfesorId, setSelectedProfesorId] = useState<number | null>(null);

  // Función para abrir el modal de materias
  const handleVerMaterias = (id: number) => {
    setSelectedProfesorId(id);
    setMateriasModalOpen(true);
  };

  // Función para cerrar el modal de materias
  const handleCloseMateriasModal = () => {
    setMateriasModalOpen(false);
    setSelectedProfesorId(null);
  };
  // Función para renderizar el rol del profesor
  const renderRol = (rol: number) => {
    switch (rol) {
      case 1:
        return <Chip label="Administrador" color="primary" size="small" />;
      case 2:
        return <Chip label="Administración" color="secondary" size="small" />;
      case 3:
        return <Chip label="Profesor" color="success" size="small" />;
      default:
        return <Chip label="Desconocido" color="default" size="small" />;
    }
  };

  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper sx={profesoresTablePaperSx}>
      <TableContainer>
        <Table aria-label="tabla de profesores">
          <TableHead>
            <TableRow>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Nombre</TableCell>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Apellido Paterno</TableCell>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Apellido Materno</TableCell>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Email</TableCell>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Rol</TableCell>
              <TableCell sx={profesoresTableHeadCellSx} align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} sx={profesoresTableLoadingSx}>
                  <CircularProgress size={40} />
                </TableCell>
              </TableRow>
            ) : profesores.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={profesoresTableCellSx}>
                  <Box sx={{ py: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      No se encontraron profesores
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              profesores.map((profesor) => (
                <TableRow key={profesor.id} sx={profesoresTableRowSx}>
                  <TableCell sx={profesoresTableCellSx} align="center">{profesor.name}</TableCell>
                  <TableCell sx={profesoresTableCellSx} align="center">{profesor.lastname_f}</TableCell>
                  <TableCell sx={profesoresTableCellSx} align="center">{profesor.lastname_m}</TableCell>
                  <TableCell sx={profesoresTableCellSx} align="center">{profesor.email}</TableCell>
                  <TableCell sx={profesoresTableCellSx} align="center">
                    {renderRol(profesor.rol)}
                  </TableCell>
                  <TableCell sx={profesoresTableCellSx} align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Ver materias asignadas">
                        <IconButton
                          size="small"
                          color="primary"
                          sx={{ mr: 1 }}
                          onClick={() => handleVerMaterias(profesor.id)}
                        >
                          <LuEye />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Editar">
                        <IconButton
                          size="small"
                          color="info"
                          sx={{ mr: 1 }}
                        >
                          <LuPencil />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Eliminar">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleDelete(profesor.id)}
                        >
                          <LuTrash />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Filas por página:"
        labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
        sx={profesoresTablePaginationSx}
      />

      {/* Modal para mostrar las materias asignadas */}
      <MateriasModal
        open={materiasModalOpen}
        onClose={handleCloseMateriasModal}
        profesorId={selectedProfesorId}
      />
    </Paper>
  );
};

export default ProfesoresTable;
