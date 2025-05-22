import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Box,
  FormHelperText,
  Stack,
} from "@mui/material";
import { Profesor } from "../../../../types/profesor";

interface EditProfesorModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (profesorData: Partial<Profesor>) => Promise<boolean>;
  profesor: Profesor | null;
}

const EditProfesorModal: React.FC<EditProfesorModalProps> = ({
  open,
  onClose,
  onSave,
  profesor,
}) => {
  const [formData, setFormData] = useState<Partial<Profesor>>({
    name: "",
    lastname_f: "",
    lastname_m: "",
    email: "",
    rol: 3,
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  // Cargar datos del profesor cuando se abre el modal
  useEffect(() => {
    if (profesor) {
      setFormData({
        name: profesor.name,
        lastname_f: profesor.lastname_f,
        lastname_m: profesor.lastname_m,
        email: profesor.email,
        rol: profesor.rol,
        password: "", // La contraseña siempre comienza vacía
      });
    }
  }, [profesor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name?: string; value: unknown } }) => {
    const { name, value } = e.target;
    if (name) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
      // Limpiar error cuando el usuario modifica el campo
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name?.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    if (!formData.lastname_f?.trim()) {
      newErrors.lastname_f = "El apellido paterno es requerido";
    }
    
    if (!formData.lastname_m?.trim()) {
      newErrors.lastname_m = "El apellido materno es requerido";
    }
    
    if (!formData.email?.trim()) {
      newErrors.email = "El correo electrónico es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo electrónico inválido";
    }
    
    // Validar contraseña solo si se ha ingresado alguna
    if (formData.password && formData.password.length > 0 && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Crear una copia del formData para enviar
    const dataToSave = { ...formData };
    
    // Si la contraseña está vacía, eliminarla del objeto para no enviarla
    if (!dataToSave.password || dataToSave.password.trim() === "") {
      delete dataToSave.password;
    }
    
    setLoading(true);
    try {
      const result = await onSave(dataToSave);
      if (result) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error("Error al guardar profesor:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: "",
        lastname_f: "",
        lastname_m: "",
        email: "",
        rol: 3,
        password: "",
      });
      setErrors({});
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Editar Profesor
      </DialogTitle>
      <DialogContent>
        {success ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
            <Typography variant="h6" color="success.main">
              ¡Profesor actualizado correctamente!
            </Typography>
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Nombre"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Apellido Paterno"
                name="lastname_f"
                value={formData.lastname_f || ""}
                onChange={handleChange}
                error={!!errors.lastname_f}
                helperText={errors.lastname_f}
                disabled={loading}
              />
              <TextField
                fullWidth
                label="Apellido Materno"
                name="lastname_m"
                value={formData.lastname_m || ""}
                onChange={handleChange}
                error={!!errors.lastname_m}
                helperText={errors.lastname_m}
                disabled={loading}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                label="Correo Electrónico"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={loading}
              />
              <FormControl fullWidth error={!!errors.rol} disabled={loading}>
                <InputLabel id="rol-label">Rol</InputLabel>
                <Select
                  labelId="rol-label"
                  name="rol"
                  value={formData.rol || 3}
                  onChange={(e) => {
                    handleChange({
                      target: {
                        name: "rol",
                        value: e.target.value
                      }
                    });
                  }}
                  label="Rol"
                >
                  <MenuItem value={1}>Administrador</MenuItem>
                  <MenuItem value={2}>Administración</MenuItem>
                  <MenuItem value={3}>Profesor</MenuItem>
                </Select>
                {errors.rol && <FormHelperText>{errors.rol}</FormHelperText>}
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <TextField
                fullWidth
                label="Nueva Contraseña (opcional)"
                name="password"
                type="password"
                value={formData.password || ""}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password || "Dejar en blanco para mantener la contraseña actual"}
                disabled={loading}
              />
            </Stack>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading} color="inherit">
          Cancelar
        </Button>
        {!success && (
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary" 
            disabled={loading || success}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default EditProfesorModal;
