import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import useGetAllGroups, { Group } from "../../../../../hooks/useGetAllGroups";
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
  useTheme,
  Snackbar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListSubheader,
} from "@mui/material";
import { LuPencil, LuTrash, LuEye } from "react-icons/lu";
import { Estudiante } from "../../../../../types/estudiante";
import {
  studentsTablePaperSx,
  studentsTableHeadCellSx,
  studentsTableLoadingSx,
  studentsTableCellSx,
  studentsTableRowSx,
  studentsTablePaginationSx,
} from "../sx";
import StudentDetailsModal from "../StudentDetailsModal/StudentDetailsModal";

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
  handleDelete,
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [selectedStudent, setSelectedStudent] = useState<Estudiante | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [estudiantesGrupos, setEstudiantesGrupos] = useState<{
    [key: number]: string;
  }>({});
  const {
    data: groups = [],
    isLoading: groupsLoading,
    error: groupsError,
  } = useGetAllGroups();

  // Cargar los grupos asignados a los estudiantes cuando se carga el componente
  useEffect(() => {
    // Inicializar el estado con los grupos asignados a cada estudiante
    const gruposIniciales: {[key: number]: string} = {};
    estudiantes.forEach(estudiante => {
      if (estudiante.group_id) {
        gruposIniciales[estudiante.id] = estudiante.group_id.toString();
        console.log(`Estudiante ${estudiante.id} tiene asignado el grupo ${estudiante.group_id}`);
      } else {
        console.log(`Estudiante ${estudiante.id} no tiene grupo asignado`);
      }
    });
    setEstudiantesGrupos(gruposIniciales);
  }, [estudiantes]);

  // Manejar el cambio de grupo para un estudiante
  const handleGrupoChange = async (estudianteId: number, grupoId: string) => {
    try {
      // Actualizar el estado local
      setEstudiantesGrupos((prev) => ({
        ...prev,
        [estudianteId]: grupoId,
      }));

      // Si se seleccionó 'Sin asignar', eliminamos la asignación
      if (!grupoId) {
        // Implementar lógica para eliminar la asignación
        setSnackbarMessage(`Estudiante desasignado del grupo`);
        setSnackbarOpen(true);
        return;
      }

      // Guardar la asignación en el backend
      const response = await fetch(`http://localhost:5328/api/estudiantes/${estudianteId}/asignar-grupo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ group_id: grupoId })
      });

      if (!response.ok) {
        throw new Error(`Error al asignar grupo: ${response.status}`);
      }

      const data = await response.json();
      
      // Mostrar mensaje de éxito
      setSnackbarMessage(
        `Estudiante asignado al grupo ${groups.find((g) => g.id === grupoId)?.name}`
      );
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Error al asignar grupo:', error);
      setSnackbarMessage(`Error: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      setSnackbarOpen(true);
    }
  };

  const handleOpenDetails = (student: Estudiante, startInEditMode = false) => {
    setSelectedStudent(student);
    setEditMode(startInEditMode);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setEditMode(false);
  };

  const handleSaveStudent = async (updatedStudent: Estudiante) => {
    try {
      // Asegurarse de que todos los campos necesarios estén presentes
      const studentData = {
        ...updatedStudent,
        // Asegurarse de que estos campos estén presentes y con el formato correcto
        scholar_ship: !!updatedStudent.scholar_ship,
        reg_date: updatedStudent.reg_date || new Date().toISOString(),
      };

      const response = await fetch(
        `http://localhost:5328/api/estudiantes/${updatedStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            // Agregar headers CORS si son necesarios
            Accept: "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Error al actualizar el estudiante (${response.status}): ${errorData.message || ""}`
        );
      }

      // Mostrar mensaje de éxito
      setSnackbarMessage("Estudiante actualizado correctamente");
      setSnackbarOpen(true);

      // Recargar la página para ver los cambios
      // En una implementación real, sería mejor actualizar solo los datos necesarios
      window.location.reload();

      return Promise.resolve();
    } catch (error) {
      console.error("Error al guardar estudiante:", error);
      setSnackbarMessage(
        `Error al actualizar el estudiante: ${error instanceof Error ? error.message : "Error de conexión"}`
      );
      setSnackbarOpen(true);
      return Promise.reject(error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  // Renderizar mensaje de error
  if (error) {
    return (
      <Alert
        severity="error"
        sx={{
          borderRadius: 2,
          boxShadow: theme.shadows[2],
          animation: "fadeIn 0.5s ease-in-out",
        }}
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
        <Typography variant="body1" sx={{ ml: 2, color: "text.secondary" }}>
          Cargando estudiantes...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Paper elevation={0} sx={studentsTablePaperSx(theme)}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Nombre
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Email
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Tipo de Sangre
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Campus
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Beca
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Grupo
                </TableCell>
                <TableCell sx={studentsTableHeadCellSx(theme)} align="center">
                  Fecha de Registro
                </TableCell>
                <TableCell align="center" sx={studentsTableHeadCellSx(theme)}>
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {estudiantes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No hay estudiantes registrados
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                estudiantes.map((estudiante) => (
                  <TableRow key={estudiante.id} sx={studentsTableRowSx(theme)}>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {`${estudiante.name} ${estudiante.lastname_f} ${estudiante.lastname_m}`}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {estudiante.email}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      <Chip
                        label={estudiante.blood_type || "No especificado"}
                        size="small"
                        variant="outlined"
                        sx={{
                          borderRadius: "6px",
                          backgroundColor: alpha(
                            theme.palette.primary.main,
                            0.08
                          ),
                          borderColor: alpha(theme.palette.primary.main, 0.2),
                          color: "text.primary",
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {estudiante.school_campus}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {estudiante.scholar_ship ? (
                        <Chip
                          label="Sí"
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        />
                      ) : (
                        <Chip
                          label="No"
                          size="small"
                          color="default"
                          variant="outlined"
                          sx={{
                            borderRadius: "6px",
                            fontWeight: 500,
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      <FormControl
                        size="small"
                        fullWidth
                        sx={{ minWidth: 120 }}
                      >
                        {groupsLoading ? (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              py: 1,
                            }}
                          >
                            <CircularProgress size={20} />
                          </Box>
                        ) : groupsError ? (
                          <Typography variant="caption" color="error">
                            Error al cargar grupos
                          </Typography>
                        ) : (
                          <Select
                            value={estudiantesGrupos[estudiante.id] || ""}
                            onChange={(e) =>
                              handleGrupoChange(estudiante.id, e.target.value)
                            }
                            defaultValue={estudiante.group_id ? estudiante.group_id.toString() : ""}
                            displayEmpty
                            variant="outlined"
                            sx={{
                              borderRadius: "6px",
                              fontSize: "0.875rem",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor: alpha(
                                  theme.palette.primary.main,
                                  0.2
                                ),
                              },
                              "&:hover .MuiOutlinedInput-notchedOutline": {
                                borderColor: theme.palette.primary.main,
                              },
                              "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                {
                                  borderColor: theme.palette.primary.main,
                                },
                            }}
                          >
                            <MenuItem value="">
                              <em>Sin asignar</em>
                            </MenuItem>
                            {/* Mostrar todos los grupos según la estructura real de la base de datos */}
                            {groups && groups.length > 0 ? (
                              groups.map(group => (
                                <MenuItem 
                                  key={group.id} 
                                  value={group.id}
                                  sx={{
                                    '&.Mui-selected': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                                    },
                                    '&.Mui-selected:hover': {
                                      backgroundColor: alpha(theme.palette.primary.main, 0.15),
                                    },
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <Box>
                                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {group.name}
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                      {/* No necesitamos mostrar información adicional */}
                                    </Box>
                                  </Box>
                                </MenuItem>
                              ))
                            ) : (
                              <MenuItem disabled>
                                <Typography variant="body2" color="text.secondary">
                                  No hay grupos disponibles
                                </Typography>
                              </MenuItem>
                            )
                            }
                          </Select>
                        )}
                      </FormControl>
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {new Date(estudiante.reg_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Tooltip title="Ver detalles">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() => handleOpenDetails(estudiante, false)}
                            sx={{
                              mx: 0.5,
                              transition: "transform 0.2s",
                              "&:hover": { transform: "scale(1.1)" },
                            }}
                          >
                            <LuEye />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="info"
                            onClick={() => handleOpenDetails(estudiante, true)}
                            sx={{
                              mx: 0.5,
                              transition: "transform 0.2s",
                              "&:hover": { transform: "scale(1.1)" },
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
                              transition: "transform 0.2s",
                              "&:hover": { transform: "scale(1.1)" },
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
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} de ${count}`
          }
          sx={studentsTablePaginationSx(theme)}
        />
      </Paper>

      <StudentDetailsModal
        open={detailsModalOpen}
        onClose={handleCloseDetails}
        student={selectedStudent}
        onSave={handleSaveStudent}
        initialEditMode={editMode}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default StudentsTable;
