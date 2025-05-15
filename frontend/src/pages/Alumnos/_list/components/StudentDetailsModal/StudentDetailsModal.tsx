import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Grid,
  Chip,
  Divider,
  useTheme,
  TextField,
  FormControlLabel,
  Switch,
  Button
} from '@mui/material';
import { LuX, LuSave, LuPencil, LuArrowLeft } from 'react-icons/lu';
import { Estudiante } from '../../../../../types/estudiante';

interface StudentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  student: Estudiante | null;
  onSave?: (updatedStudent: Estudiante) => Promise<void>;
  initialEditMode?: boolean;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  open,
  onClose,
  student,
  onSave,
  initialEditMode = false
}) => {
  const theme = useTheme();
  const [editMode, setEditMode] = useState(initialEditMode);
  const [editedStudent, setEditedStudent] = useState<Estudiante | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student) {
      setEditedStudent({...student});
    }
  }, [student]);

  useEffect(() => {
    setEditMode(initialEditMode);
  }, [initialEditMode]);

  if (!student || !editedStudent) return null;

  const handleInputChange = (field: keyof Estudiante, value: any) => {
    setEditedStudent(prev => prev ? {...prev, [field]: value} : null);
  };

  const handleSave = async () => {
    if (!editedStudent || !onSave) return;
    
    try {
      setSaving(true);
      await onSave(editedStudent);
      setEditMode(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Si estamos saliendo del modo edición, restauramos los datos originales
      setEditedStudent({...student});
    }
    setEditMode(!editMode);
  };

  const infoItem = (label: string, value: React.ReactNode, field?: keyof Estudiante) => {
    // No mostrar el campo family_id
    if (field === 'family_id') {
      return null;
    }
    
    if (editMode && field) {
      // Renderizar campo editable
      if (field === 'scholar_ship') {
        return (
          <>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {label}
            </Typography>
            <Box sx={{ mt: 0.5, mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={!!editedStudent[field]}
                    onChange={(e) => handleInputChange(field, e.target.checked)}
                    color="primary"
                  />
                }
                label={editedStudent[field] ? "Sí" : "No"}
              />
            </Box>
          </>
        );
      }
      
      // Manejar campos de fecha
      if (field === 'birth_date' || field === 'reg_date') {
        // Convertir la fecha a formato YYYY-MM-DD para el input type="date"
        const dateValue = editedStudent[field] 
          ? new Date(editedStudent[field] as string).toISOString().split('T')[0] 
          : '';
        
        // Obtener la fecha actual en formato YYYY-MM-DD para limitar el máximo
        const today = new Date().toISOString().split('T')[0];
          
        return (
          <>
            <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
              {label}
            </Typography>
            <Box sx={{ mt: 0.5, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                type="date"
                value={dateValue}
                onChange={(e) => handleInputChange(field, e.target.value)}
                variant="outlined"
                // Establecer la fecha máxima como hoy para birth_date
                inputProps={{
                  max: field === 'birth_date' ? today : undefined
                }}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
          </>
        );
      }
      
      return (
        <>
          <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
            {label}
          </Typography>
          <Box sx={{ mt: 0.5, mb: 2 }}>
            <TextField
              fullWidth
              size="small"
              value={editedStudent[field] || ''}
              onChange={(e) => handleInputChange(field, e.target.value)}
              variant="outlined"
            />
          </Box>
        </>
      );
    }
    
    // Renderizar valor de solo lectura
    return (
      <>
        <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
          {label}
        </Typography>
        <Box sx={{ mt: 0.5, mb: 2 }}>
          {value}
        </Box>
      </>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: 0,
          overflow: 'hidden',
          boxShadow: 'none',
          backgroundColor: theme.palette.background.paper,
          width: '100%',
          maxWidth: 600
        }
      }}
    >
      <Box 
        sx={{ 
          backgroundColor: theme.palette.primary.main,
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 500, fontSize: '1rem' }}>
          {editMode ? "Editar Estudiante" : "Detalles del Estudiante"}
        </Typography>
        <Box>
          {onSave && (
            <IconButton
              aria-label={editMode ? "cancelar" : "editar"}
              onClick={toggleEditMode}
              sx={{
                color: 'white',
                padding: '4px',
                mr: 1,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                }
              }}
            >
              {editMode ? <LuArrowLeft size={18} /> : <LuPencil size={18} />}
            </IconButton>
          )}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: 'white',
              padding: '4px',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              }
            }}
          >
            <LuX size={18} />
          </IconButton>
        </Box>
      </Box>
      
      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h5" color="primary" sx={{ fontWeight: 600, mb: 2 }}>
          {`${student.name} ${student.lastname_f} ${student.lastname_m}`}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            {infoItem("ID", 
              <Typography variant="body1">{student.id}</Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Email", 
              <Typography variant="body1">{student.email}</Typography>,
              "email"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Nombre", 
              <Typography variant="body1">{student.name}</Typography>,
              "name"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Apellido Paterno", 
              <Typography variant="body1">{student.lastname_f}</Typography>,
              "lastname_f"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Apellido Materno", 
              <Typography variant="body1">{student.lastname_m}</Typography>,
              "lastname_m"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Tipo de Sangre", 
              <Chip 
                label={student.blood_type || 'No especificado'} 
                size="small" 
                color="primary" 
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />,
              "blood_type"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Alergias", 
              <Typography variant="body1">{student.allergies || 'No especificado'}</Typography>,
              "allergies"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Campus", 
              <Typography variant="body1">{student.school_campus}</Typography>,
              "school_campus"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Capilla", 
              <Typography variant="body1">{student.chapel || 'No especificado'}</Typography>,
              "chapel"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Beca", 
              <Chip 
                label={student.scholar_ship ? "Sí" : "No"} 
                size="small" 
                color={student.scholar_ship ? "success" : "default"} 
                variant="outlined"
                sx={{ borderRadius: 1 }}
              />,
              "scholar_ship"
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Fecha de Nacimiento", 
              <Typography variant="body1">{student.birth_date ? new Date(student.birth_date).toLocaleDateString() : 'No especificado'}</Typography>,
              "birth_date"
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {infoItem("Fecha de Registro", 
              <Typography variant="body1">{new Date(student.reg_date).toLocaleDateString()}</Typography>,
              "reg_date"
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {infoItem("Permiso", 
              <Typography variant="body1">{student.permission || 'No especificado'}</Typography>,
              "permission"
            )}
          </Grid>
        </Grid>
        
        {editMode && onSave && (
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<LuSave />}
              onClick={handleSave}
              disabled={saving}
              sx={{ borderRadius: 0 }}
            >
              {saving ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
