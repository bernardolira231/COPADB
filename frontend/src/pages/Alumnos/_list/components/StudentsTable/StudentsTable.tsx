import React, { useState, useEffect, useMemo } from "react";
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

// Función para calcular la edad a partir de la fecha de nacimiento
const calculateAge = (birthDateString: string): string => {
  try {
    const birthDate = new Date(birthDateString);
    const today = new Date();

    // Verificar que la fecha sea válida
    if (isNaN(birthDate.getTime())) {
      return "Fecha inválida";
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    // Si aún no ha cumplido años en este año, restar 1
    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return `${age} años`;
  } catch (error) {
    console.error("Error al calcular la edad:", error);
    return "Error";
  }
};

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
  // Estado para manejar el grupo seleccionado para cada estudiante
  // Ahora solo permitimos un grupo a la vez
  const [estudiantesGrupos, setEstudiantesGrupos] = useState<
    Record<number, string>
  >({});
  const {
    data: groups = [],
    isLoading: groupsLoading,
    error: groupsError,
  } = useGetAllGroups();

  // Cargar los grupos asignados a los estudiantes cuando se carga el componente
  useEffect(() => {
    // Inicializar el estado con los grupos asignados a cada estudiante
    const gruposIniciales: { [key: number]: string } = {};
    estudiantes.forEach((estudiante) => {
      if (estudiante.all_groups && estudiante.all_groups.length > 0) {
        // Usamos el ID del primer grupo asignado (ahora solo permitimos uno)
        const firstGroup = estudiante.all_groups[0];
        gruposIniciales[estudiante.id] = firstGroup.group_id.toString();
        console.log(
          `Estudiante ${estudiante.id} tiene asignado el grupo ${firstGroup.group_id}`
        );
      } else if (estudiante.group_id) {
        // Compatibilidad con la versión anterior
        gruposIniciales[estudiante.id] = estudiante.group_id.toString();
        console.log(
          `Estudiante ${estudiante.id} tiene asignado el grupo ${estudiante.group_id}`
        );
      } else {
        console.log(`Estudiante ${estudiante.id} no tiene grupo asignado`);
      }
    });
    setEstudiantesGrupos(gruposIniciales);
  }, [estudiantes]);

  // Obtener los grados únicos de los grupos y agrupar los grupos por grado
  const { uniqueGrades, groupsByGrade } = useMemo(() => {
    if (!groups || groups.length === 0)
      return { uniqueGrades: [], groupsByGrade: {} };

    // Extraer todos los grados únicos
    const grades = [...new Set(groups.map((group) => group.grade))];

    // Agrupar los grupos por grado
    const groupedByGrade: Record<string, Group[]> = {};
    grades.forEach((grade) => {
      groupedByGrade[grade] = groups.filter((group) => group.grade === grade);
    });

    return { uniqueGrades: grades, groupsByGrade: groupedByGrade };
  }, [groups]);

  // Función para manejar el cambio de grupo de un estudiante
  const handleGrupoChange = (estudianteId: number, groupId: string) => {
    // Actualizar el estado local
    setEstudiantesGrupos((prev) => ({
      ...prev,
      [estudianteId]: groupId,
    }));

    // Si se selecciona "Sin asignar", enviamos un array vacío
    const groupIdToSend = groupId !== "" ? groupId : null;

    // Verificar si se seleccionó un grado
    const selectedGroup = groups?.find((g) => g.id === groupId);

    // Función para realizar la llamada a la API
    const apiCall = (body: any) => {
      fetch(
        `http://localhost:5328/api/estudiantes/${estudianteId}/asignar-grupo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("Error al asignar grupo");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Grupo asignado correctamente:", data);
          // Mostrar mensaje de éxito
          setSnackbarMessage("Grupo asignado correctamente");
          setSnackbarOpen(true);
        })
        .catch((error) => {
          console.error("Error:", error);
          // Mostrar mensaje de error
          setSnackbarMessage("Error al asignar grupo");
          setSnackbarOpen(true);
        });
    };

    if (selectedGroup && uniqueGrades.includes(selectedGroup.grade)) {
      // Si se seleccionó un grado, enviamos el grado para asignar todas sus materias
      apiCall({ grade: selectedGroup.grade });
    } else if (!groupIdToSend) {
      // Si no se seleccionó ningún grupo, desasignar al estudiante de todos los grupos
      apiCall({ group_ids: [] });
    } else {
      // Si se seleccionó un grupo específico, enviamos el ID del grupo
      apiCall({ group_ids: [groupIdToSend] });
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
                  Edad
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
                            value={
                              estudiantesGrupos[estudiante.id] ||
                              (estudiante.all_groups &&
                              estudiante.all_groups.length > 0
                                ? estudiante.all_groups[0].group_id.toString()
                                : estudiante.group_id
                                  ? estudiante.group_id.toString()
                                  : "")
                            }
                            onChange={(e) =>
                              handleGrupoChange(
                                estudiante.id,
                                e.target.value as string
                              )
                            }
                            displayEmpty
                            variant="outlined"
                            renderValue={(selected) => {
                              if (!selected || selected === "") {
                                return <em>Sin asignar</em>;
                              }

                              // Obtener el grado del grupo seleccionado
                              let gradeName = "";

                              // Primero buscamos en all_groups del estudiante
                              if (estudiante.all_groups) {
                                const assignedGroup =
                                  estudiante.all_groups.find(
                                    (g) => g.group_id.toString() === selected
                                  );
                                if (assignedGroup) {
                                  gradeName = assignedGroup.grade;
                                }
                              }

                              // Si no lo encontramos, buscamos en la lista general de grupos
                              if (!gradeName) {
                                const group = groups?.find(
                                  (g) => g.id.toString() === selected
                                );
                                if (group) {
                                  gradeName = group.grade;
                                }
                              }

                              return gradeName || "Grupo seleccionado";
                            }}
                            sx={{
                              borderRadius: "6px",
                              fontSize: "0.875rem",
                              minWidth: 120,
                              maxWidth: 300,
                              width: "100%",
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

                            {/* Mostrar grados como opciones principales */}
                            {uniqueGrades.map((grade) => {
                              // Usar el ID del primer grupo de este grado como valor
                              const gradeGroups = groupsByGrade[grade] || [];
                              const gradeId =
                                gradeGroups.length > 0 ? gradeGroups[0].id : "";

                              return (
                                <MenuItem
                                  key={`grade-${grade}`}
                                  value={gradeId}
                                >
                                  {grade}
                                </MenuItem>
                              );
                            })}

                            {/* Opcionalmente, también podríamos mostrar los grupos individuales */}
                            {/* Pero según el requerimiento, solo queremos mostrar los grados */}

                            {(!groups || groups.length === 0) && (
                              <MenuItem disabled>
                                <Typography variant="caption">
                                  No hay grupos disponibles
                                </Typography>
                              </MenuItem>
                            )}
                          </Select>
                        )}
                      </FormControl>
                    </TableCell>
                    <TableCell align="center" sx={studentsTableCellSx(theme)}>
                      {estudiante.birth_date
                        ? calculateAge(estudiante.birth_date)
                        : "N/A"}
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
