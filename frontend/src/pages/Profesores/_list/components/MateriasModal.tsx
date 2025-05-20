import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  Snackbar,
} from "@mui/material";
import { LuX, LuPlus, LuTrash2 } from "react-icons/lu";
import useProfesores from "../../../../hooks/useProfesores";
import AsignarMateriasModal from "./AsignarMateriasModal";

interface MateriasModalProps {
  open: boolean;
  onClose: () => void;
  profesorId: number | null;
}

interface Materia {
  group_id: number;
  grado: string;
  class_id: number;
  class_name: string;
}

const MateriasModal: React.FC<MateriasModalProps> = ({
  open,
  onClose,
  profesorId,
}) => {
  const { getMateriasProfesor, desasignarMateriaProfesor } = useProfesores();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [profesor, setProfesor] = useState<{
    id: number;
    name: string;
    lastname_f: string;
    lastname_m: string;
  } | null>(null);
  const [asignarModalOpen, setAsignarModalOpen] = useState<boolean>(false);
  const [desasignando, setDesasignando] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Referencia para controlar si el componente está montado
  const isMounted = React.useRef(true);

  // Referencia para controlar si ya se ha hecho una petición para este profesor
  const fetchedForProfessor = React.useRef<number | null>(null);

  useEffect(() => {
    // Establecer isMounted a true cuando el componente se monta
    isMounted.current = true;

    // Limpiar cuando el componente se desmonta
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    // Solo ejecutar la función si el modal está abierto y hay un ID de profesor
    if (!open || !profesorId) return;

    // Evitar múltiples peticiones para el mismo profesor
    if (fetchedForProfessor.current === profesorId) {
      console.log(
        "Ya se han obtenido datos para este profesor, evitando petición duplicada"
      );
      return;
    }

    const fetchMaterias = async () => {
      console.log("Obteniendo materias para el profesor ID:", profesorId);
      setLoading(true);
      setError(null);

      try {
        // Marcar que estamos haciendo una petición para este profesor
        fetchedForProfessor.current = profesorId;

        const data = await getMateriasProfesor(profesorId);
        console.log("Datos recibidos:", data);

        // Verificar si el componente sigue montado antes de actualizar el estado
        if (!isMounted.current) return;

        if (data && data.usuario) {
          console.log("Usuario encontrado:", data.usuario);
          setProfesor(data.usuario);
          setMaterias(data.materias || []);
        } else {
          console.error(
            "No se recibieron datos del usuario o están en formato incorrecto",
            data
          );
          setError("No se pudo obtener información del profesor");
        }
      } catch (err) {
        console.error("Error al obtener materias:", err);
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (isMounted.current) {
          setError("Error al cargar las materias asignadas");
        }
      } finally {
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };

    // Ejecutar la función de forma inmediata
    fetchMaterias();

    // Dependencias: solo open y profesorId, quitamos getMateriasProfesor para evitar re-renders innecesarios
  }, [open, profesorId]);

  const handleClose = () => {
    onClose();
    // Limpiar los datos al cerrar
    setMaterias([]);
    setProfesor(null);
    setError(null);
    // Resetear la referencia de profesor al cerrar
    fetchedForProfessor.current = null;
  };

  const getNombreCompleto = () => {
    if (!profesor) return "";
    return `${profesor.name} ${profesor.lastname_f} ${profesor.lastname_m || ""}`.trim();
  };

  // Función para recargar las materias del profesor
  const recargarMaterias = async () => {
    if (!profesorId) return;
    
    // Resetear la referencia para forzar una nueva carga
    fetchedForProfessor.current = null;
    
    // Cargar las materias nuevamente
    setLoading(true);
    try {
      const data = await getMateriasProfesor(profesorId);
      if (data && data.usuario) {
        setProfesor(data.usuario);
        setMaterias(data.materias || []);
      }
    } catch (err) {
      console.error("Error al recargar materias:", err);
    } finally {
      setLoading(false);
    }
  };

  // Función para desasignar una materia
  const handleDesasignarMateria = async (groupId: number) => {
    if (!profesor || !profesorId) return;

    setDesasignando(true);
    try {
      const result = await desasignarMateriaProfesor(profesor.id, groupId);
      if (result) {
        setSnackbar({
          open: true,
          message: "Materia desasignada correctamente",
          severity: "success",
        });
        // Recargar las materias
        await recargarMaterias();
      } else {
        setSnackbar({
          open: true,
          message: "Error al desasignar la materia",
          severity: "error",
        });
      }
    } catch (err) {
      console.error("Error al desasignar materia:", err);
      setSnackbar({
        open: true,
        message: "Error al desasignar la materia",
        severity: "error",
      });
    } finally {
      setDesasignando(false);
    }
  };

  // Función para cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5" component="div" fontWeight="bold">
              Materias Asignadas
            </Typography>
            <Button
              onClick={handleClose}
              color="inherit"
              sx={{ minWidth: "auto", p: 1 }}
            >
              <LuX size={20} />
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          ) : profesor ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Profesor: {getNombreCompleto()}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                  onClick={() => setAsignarModalOpen(true)}
                  startIcon={<LuPlus />}
                >
                  Asignar Materias
                </Button>
              </Box>
              {materias.length > 0 ? (
                <TableContainer
                  component={Paper}
                  sx={{ mt: 2, borderRadius: "8px" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>Materia</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Grado</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="center">Acciones</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {materias.map((materia) => (
                        <TableRow key={materia.group_id}>
                          <TableCell>{materia.class_name}</TableCell>
                          <TableCell>{materia.grado}</TableCell>
                          <TableCell align="center">
                            <Tooltip title="Desasignar materia">
                              <IconButton
                                color="error"
                                size="small"
                                onClick={() => handleDesasignarMateria(materia.group_id)}
                                disabled={desasignando}
                              >
                                <LuTrash2 size={18} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Este profesor no tiene materias asignadas.
                </Alert>
              )}
            </>
          ) : null}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "8px" }}
          >
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal para asignar materias */}
      {profesor && (
        <AsignarMateriasModal
          open={asignarModalOpen}
          onClose={() => setAsignarModalOpen(false)}
          profesorId={profesor.id}
          onMateriaAsignada={recargarMaterias}
        />
      )}

      {/* Snackbar para notificaciones */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default MateriasModal;
