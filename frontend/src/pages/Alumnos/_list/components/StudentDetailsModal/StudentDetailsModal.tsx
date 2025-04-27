import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  IconButton,
  Typography,
  Grid,
  Chip,
  Divider,
  useTheme
} from '@mui/material';
import { LuX } from 'react-icons/lu';
import { Estudiante } from '../../../../../types/estudiante';

interface StudentDetailsModalProps {
  open: boolean;
  onClose: () => void;
  student: Estudiante | null;
}

const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  open,
  onClose,
  student
}) => {
  const theme = useTheme();

  if (!student) return null;

  const infoItem = (label: string, value: React.ReactNode) => (
    <>
      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.85rem' }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.5, mb: 2 }}>
        {value}
      </Box>
    </>
  );

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
          Detalles del Estudiante
        </Typography>
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
              <Typography variant="body1">{student.email}</Typography>
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
              />
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Alergias", 
              <Typography variant="body1">{student.allergies || 'No especificado'}</Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Campus", 
              <Typography variant="body1">{student.school_campus}</Typography>
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Capilla", 
              <Typography variant="body1">{student.chapel || 'No especificado'}</Typography>
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
              />
            )}
          </Grid>
          
          <Grid item xs={12} sm={6}>
            {infoItem("Fecha de Registro", 
              <Typography variant="body1">{new Date(student.reg_date).toLocaleDateString()}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {infoItem("ID Familiar", 
              <Typography variant="body1">{student.family_id || 'No especificado'}</Typography>
            )}
          </Grid>

          <Grid item xs={12} sm={6}>
            {infoItem("Permiso", 
              <Typography variant="body1">{student.permission || 'No especificado'}</Typography>
            )}
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default StudentDetailsModal;
