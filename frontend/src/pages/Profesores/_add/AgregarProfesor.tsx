import React, { useState } from "react";
import { 
  Container, 
  Paper, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  Tooltip
} from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { LuArrowLeft, LuSave, LuEye, LuEyeOff, LuRefreshCw } from "react-icons/lu";
import Layout from "../../../components/Layout";
import useProfesores from "../../../hooks/useProfesores";
import { ProfesorCreate } from "../../../types/profesor";

const AgregarProfesor = () => {
  const navigate = useNavigate();
  const { saveProfesor } = useProfesores();
  
  // Estado para el formulario
  const [formData, setFormData] = useState<ProfesorCreate>({
    name: "",
    lastname_f: "",
    lastname_m: "",
    email: "",
    password: "",
    rol: 3, // Por defecto, rol de profesor
    profesor_type: "titular" // Por defecto, tipo titular
  });
  
  // Estado para errores de validación
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false);
  
  // Estado para el snackbar
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error"
  });
  
  // Función para manejar cambios en los campos de texto
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      
      // Limpiar error al cambiar el valor
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ""
        }));
      }
    }
  };
  
  // Función para manejar cambios en el select
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    if (name) {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Función para validar el formulario
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }
    
    // Validar apellido paterno
    if (!formData.lastname_f.trim()) {
      newErrors.lastname_f = "El apellido paterno es requerido";
    }
    
    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }
    
    // Validar contraseña
    if (!formData.password.trim()) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const success = await saveProfesor(formData);
      
      if (success) {
        setSnackbar({
          open: true,
          message: "Profesor agregado correctamente",
          severity: "success"
        });
        
        // Redireccionar después de un breve delay
        setTimeout(() => {
          navigate({ to: "/profesores" });
        }, 1500);
      } else {
        setSnackbar({
          open: true,
          message: "Error al agregar el profesor",
          severity: "error"
        });
      }
    }
  };
  
  // Función para generar una contraseña de primer uso
  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    
    // Generar una contraseña de 8 caracteres
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      password += chars.charAt(randomIndex);
    }
    
    // Actualizar el estado del formulario con la nueva contraseña
    setFormData(prev => ({
      ...prev,
      password
    }));
    
    // Limpiar errores de contraseña si existen
    if (errors.password) {
      setErrors(prev => ({
        ...prev,
        password: ""
      }));
    }
  };
  
  // Función para cerrar el snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };
  
  return (
    <Layout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: "flex", alignItems: "center" }}>
          <Link to="/profesores">
            <Button
              startIcon={<LuArrowLeft />}
              sx={{ textTransform: "none", mr: 2 }}
            >
              Volver
            </Button>
          </Link>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            Agregar Nuevo Profesor
          </Typography>
        </Box>
        
        <Paper elevation={3} sx={{ p: 4, borderRadius: "12px" }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nombre"
                  name="name"
                  value={formData.name}
                  onChange={handleTextChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido Paterno"
                  name="lastname_f"
                  value={formData.lastname_f}
                  onChange={handleTextChange}
                  error={!!errors.lastname_f}
                  helperText={errors.lastname_f}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Apellido Materno"
                  name="lastname_m"
                  value={formData.lastname_m}
                  onChange={handleTextChange}
                  error={!!errors.lastname_m}
                  helperText={errors.lastname_m}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleTextChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contraseña"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleTextChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip title="Generar contraseña de primer uso">
                          <IconButton
                            onClick={generatePassword}
                            edge="end"
                            sx={{ mr: 0.5 }}
                            color="primary"
                          >
                            <LuRefreshCw />
                          </IconButton>
                        </Tooltip>
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <LuEyeOff /> : <LuEye />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="rol-label">Rol</InputLabel>
                  <Select
                    labelId="rol-label"
                    name="rol"
                    value={formData.rol}
                    onChange={handleSelectChange}
                    label="Rol"
                  >
                    <MenuItem value={1}>Administrador</MenuItem>
                    <MenuItem value={2}>Administración</MenuItem>
                    <MenuItem value={3}>Profesor</MenuItem>
                  </Select>
                  <FormHelperText>Seleccione el rol del usuario</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="profesor-type-label">Tipo de Profesor</InputLabel>
                  <Select
                    labelId="profesor-type-label"
                    name="profesor_type"
                    value={formData.profesor_type}
                    onChange={handleSelectChange}
                    label="Tipo de Profesor"
                  >
                    <MenuItem value="titular">Titular</MenuItem>
                    <MenuItem value="adjunto">Adjunto</MenuItem>
                    <MenuItem value="suplente">Suplente</MenuItem>
                    <MenuItem value="invitado">Invitado</MenuItem>
                  </Select>
                  <FormHelperText>Seleccione el tipo del usuario</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    type="button"
                    variant="outlined"
                    sx={{ mr: 2, textTransform: "none", borderRadius: "8px" }}
                    onClick={() => navigate({ to: "/profesores" })}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<LuSave />}
                    sx={{ textTransform: "none", borderRadius: "8px" }}
                  >
                    Guardar Profesor
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
        
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
      </Container>
    </Layout>
  );
};

export default AgregarProfesor;
