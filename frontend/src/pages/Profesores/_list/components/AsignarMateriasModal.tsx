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
  Checkbox,
  Snackbar,
} from "@mui/material";
import { LuX, LuRefreshCw } from "react-icons/lu";
import useProfesores from "../../../../hooks/useProfesores";

interface AsignarMateriasModalProps {
  open: boolean;
  onClose: () => void;
  profesorId: number | null;
  onMateriaAsignada: () => void;
}

interface Materia {
  group_id: number;
  grado: string;
  class_id: number;
  class_name: string;
}

const AsignarMateriasModal: React.FC<AsignarMateriasModalProps> = ({
  open,
  onClose,
  profesorId,
  onMateriaAsignada,
}) => {
  // Obtenemos las funciones del hook con la nueva firma de asignarMateriaProfesor
  const { getMateriasDisponibles, asignarMateriaProfesor } = useProfesores();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [selectedMaterias, setSelectedMaterias] = useState<(string | number)[]>([]);
  const [asignando, setAsignando] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Referencia para controlar si el componente está montado
  const isMounted = React.useRef(true);

  useEffect(() => {
    // Establecer isMounted a true cuando el componente se monta
    isMounted.current = true;
    
    // Limpiar cuando el componente se desmonta
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Referencia para controlar si ya se ha hecho una petición en esta sesión
  const hasFetchedInSession = React.useRef(false);

  useEffect(() => {
    // Resetear el flag cuando el modal se cierra
    if (!open) {
      hasFetchedInSession.current = false;
      return;
    }
    
    // Evitar múltiples llamadas en la misma sesión de modal abierto
    if (hasFetchedInSession.current) {
      console.log("Ya se obtuvieron las materias disponibles en esta sesión, evitando petición duplicada");
      return;
    }

    const fetchMaterias = async () => {
      console.log("Obteniendo materias disponibles");
      setLoading(true);
      setError(null);
      
      try {
        // Marcar que estamos haciendo una petición
        hasFetchedInSession.current = true;

        const data = await getMateriasDisponibles();
        console.log("Materias disponibles:", data);
        
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (!isMounted.current) return;
        
        setMaterias(data);
      } catch (err) {
        console.error("Error al obtener materias disponibles:", err);
        // Verificar si el componente sigue montado antes de actualizar el estado
        if (isMounted.current) {
          setError("Error al cargar las materias disponibles");
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
  // Quitamos getMateriasDisponibles de las dependencias para evitar llamadas innecesarias
  }, [open]);

  const handleClose = () => {
    onClose();
    // Limpiar los datos al cerrar
    setSelectedMaterias([]);
    setError(null);
  };

  // Función para recargar manualmente las materias disponibles
  const handleRecargarMaterias = async () => {
    console.log("Recargando materias disponibles manualmente");
    setLoading(true);
    setError(null);
    
    try {
      const data = await getMateriasDisponibles();
      console.log("Materias disponibles actualizadas:", data);
      
      if (isMounted.current) {
        setMaterias(data);
        // Mostrar mensaje de éxito
        setSnackbar({
          open: true,
          message: "Lista de materias actualizada",
          severity: "success",
        });
      }
    } catch (err) {
      console.error("Error al recargar materias disponibles:", err);
      if (isMounted.current) {
        setError("Error al actualizar la lista de materias");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  // Función para generar un ID único para cada materia
  const getMateriaUniqueId = (materia: Materia) => {
    // Si tiene group_id, usamos ese, sino usamos class_id prefijado para distinguirlo
    return materia.group_id || `class_${materia.class_id}`;
  };

  // Función para verificar si una materia está seleccionada
  const isMateriaSelected = (materia: Materia) => {
    const uniqueId = getMateriaUniqueId(materia);
    return selectedMaterias.includes(uniqueId);
  };

  // Función para alternar la selección de una materia
  const handleToggleMateria = (materia: Materia) => {
    const uniqueId = getMateriaUniqueId(materia);
    
    setSelectedMaterias((prev) => {
      if (prev.includes(uniqueId)) {
        return prev.filter((id) => id !== uniqueId);
      } else {
        return [...prev, uniqueId];
      }
    });
  };

  const handleAsignarMaterias = async () => {
    if (!profesorId || selectedMaterias.length === 0) return;

    setAsignando(true);
    setError(null);

    try {
      // Asignar cada materia seleccionada al profesor
      const promises = selectedMaterias.map((uniqueId) => {
        // Encontrar la materia correspondiente al ID único
        let materia: Materia | undefined;
        
        // Si el ID es un string que comienza con 'class_', es un class_id
        if (typeof uniqueId === 'string' && uniqueId.startsWith('class_')) {
          const classId = parseInt(uniqueId.replace('class_', ''), 10);
          materia = materias.find(m => m.class_id === classId);
          
          if (materia) {
            console.log('Asignando materia por class_id:', materia.class_id);
            return asignarMateriaProfesor(profesorId, materia.class_id, true);
          }
        } 
        // Si es un número, es un group_id
        else if (typeof uniqueId === 'number') {
          materia = materias.find(m => m.group_id === uniqueId);
          
          if (materia) {
            console.log('Asignando materia por group_id:', materia.group_id);
            return asignarMateriaProfesor(profesorId, materia.group_id, false);
          }
        }
        
        console.error('No se encontró la materia con ID:', uniqueId);
        return Promise.resolve(false);
      });

      const results = await Promise.all(promises);
      const allSuccess = results.every((result) => result === true);

      if (allSuccess) {
        setSnackbar({
          open: true,
          message: "Materias asignadas correctamente",
          severity: "success",
        });
        
        // Notificar al componente padre que se han asignado materias
        onMateriaAsignada();
        
        // Cerrar el modal después de un breve delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        setError("No se pudieron asignar todas las materias");
      }
    } catch (err) {
      console.error("Error al asignar materias:", err);
      setError("Error al asignar materias al profesor");
    } finally {
      setAsignando(false);
    }
  };

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
              Asignar Materias
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
          ) : materias.length > 0 ? (
            <>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="body1">
                  Selecciona las materias que deseas asignar al profesor:
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<LuRefreshCw />}
                  onClick={handleRecargarMaterias}
                  disabled={loading}
                >
                  Actualizar lista
                </Button>
              </Box>
              <TableContainer
                component={Paper}
                sx={{ mt: 2, borderRadius: "8px" }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"></TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Materia</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Grado</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {materias.map((materia) => (
                      <TableRow
                        key={materia.group_id || `class_${materia.class_id}`}
                        hover
                        onClick={() => handleToggleMateria(materia)}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={isMateriaSelected(materia)}
                            onChange={() => handleToggleMateria(materia)}
                            color="primary"
                          />
                        </TableCell>
                        <TableCell>{materia.class_name}</TableCell>
                        <TableCell>{materia.grado}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Alert severity="info" sx={{ mt: 2 }}>
              No hay materias disponibles para asignar.
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{ textTransform: "none", borderRadius: "8px", mr: 1 }}
            disabled={asignando}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleAsignarMaterias}
            variant="contained"
            color="primary"
            sx={{ textTransform: "none", borderRadius: "8px" }}
            disabled={selectedMaterias.length === 0 || asignando}
          >
            {asignando ? "Asignando..." : "Asignar Materias"}
          </Button>
        </DialogActions>
      </Dialog>

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

export default AsignarMateriasModal;
