import React, { useState } from 'react';
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
  alpha,
  useTheme
} from "@mui/material";
import { LuPencil, LuTrash, LuEye } from "react-icons/lu";
import { Estudiante } from '../../../../../types/estudiante';
import { studentsTablePaperSx, studentsTableHeadCellSx, studentsTableLoadingSx, studentsTableCellSx, studentsTableRowSx, studentsTablePaginationSx } from '../sx';
import StudentDetailsModal from '../StudentDetailsModal/StudentDetailsModal';

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
  const theme = useTheme();
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleOpenDetails = (student: Estudiante) => {
    setSelectedStudent(student);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
  };

  // Renderizar mensaje de error
  if (error) {
    return (
      <Alert 
        severity="error" 
        sx={{ borderRadius: 2, boxShadow: theme.shadows[2], animation: 'fadeIn 0.5s ease-in-out' }}
      >
        {error}
      </Alert>
    );
  }

  // Renderizar indicador de carga
  if (loading) {
    return (
      <Box sx={studentsTableLoadingSx(theme)}>
        <CircularProgress color="primary" />
        <Typography variant="body1" sx={{ ml: 2, color: 'text.secondary' }}>
          Cargando estudiantes...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper 
        elevation={0}
        sx={studentsTablePaperSx(theme)}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  ID
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Nombre
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Email
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Tipo de Sangre
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Campus
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Beca
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)}>
                  Fecha de Registro
                </TableCell>
                <TableCell 
                  align="center"
                  sx={studentsTableHeadCellSx(theme)}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay estudiantes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                estudiantes.map((estudiante) => (
                  <TableRow 
                    key={estudiante.id}
                    sx={studentsTableRowSx(theme)}
                  >
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {estudiante.id}
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {`${estudiante.name} ${estudiante.lastname_f} ${estudiante.lastname_m}`}
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {estudiante.email}
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      <Chip 
                        label={estudiante.blood_type || 'No especificado'} 
                        size="small" 
                        variant="outlined"
                        sx={{ 
                          borderRadius: '6px',
                          backgroundColor: alpha(theme.palette.primary.main, 0.08),
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          color: 'text.primary',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {estudiante.school_campus}
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {estudiante.scholar_ship ? (
                        <Chip 
                          label="Sí" 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ 
                            borderRadius: '6px',
                            fontWeight: 500
                          }}
                        />
                      ) : (
                        <Chip 
                          label="No" 
                          size="small" 
                          color="default" 
                          variant="outlined"
                          sx={{ 
                            borderRadius: '6px',
                            fontWeight: 500
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell sx={studentsTableCellSx(theme)}>
                      {new Date(estudiante.reg_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Tooltip title="Ver detalles">
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleOpenDetails(estudiante)}
                            sx={{ 
                              mx: 0.5,
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
                          >
                            <LuEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton 
                            size="small" 
                            color="info"
                            sx={{ 
                              mx: 0.5,
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
                          >
                            <LuPencil />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Eliminar">
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(estudiante.id)}
                            sx={{ 
                              mx: 0.5,
                              transition: 'transform 0.2s',
                              '&:hover': { transform: 'scale(1.1)' }
                            }}
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
          sx={studentsTablePaginationSx(theme)}
        />
      </Paper>
      
      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        student={selectedStudent}
      />
    </>
  );
};

export default StudentsTable;
