import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Grid, 
  InputAdornment, 
  IconButton, 
  Box,
  useTheme,
  TextField
} from '@mui/material';
import { LuCalendar, LuClock } from 'react-icons/lu';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';

interface RegistrationDateSectionProps {
  fechaRegistro: string;
  setFechaRegistro: (value: string) => void;
}

const RegistrationDateSection: React.FC<RegistrationDateSectionProps> = ({
  fechaRegistro,
  setFechaRegistro,
}) => {
  const theme = useTheme();
  const [date, setDate] = useState<Date | null>(
    fechaRegistro ? new Date(fechaRegistro) : null
  );
  const [touched, setTouched] = useState(false);
  const [open, setOpen] = useState(false);

  // Actualizar el estado local cuando cambia la prop
  useEffect(() => {
    if (fechaRegistro) {
      setDate(new Date(fechaRegistro));
    }
  }, [fechaRegistro]);

  // Actualizar la fecha en el componente padre cuando cambia la fecha local
  const handleDateChange = (newDate: Date | null) => {
    setDate(newDate);
    if (newDate) {
      // Formatear la fecha como YYYY-MM-DD
      const formattedDate = newDate.toISOString().split('T')[0];
      setFechaRegistro(formattedDate);
    } else {
      setFechaRegistro('');
    }
    setTouched(true);
  };

  // Establecer la fecha actual
  const handleSetToday = () => {
    const today = new Date();
    setDate(today);
    setFechaRegistro(today.toISOString().split('T')[0]);
    setTouched(true);
  };

  // Formatear la fecha para mostrarla en español
  const formatDisplayDate = (date: Date | null) => {
    if (!date) return '';
    return format(date, 'dd/MM/yyyy');
  };

  return (
    <section>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5" color="primary" fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LuCalendar size={24} />
          Fecha de Registro
        </Typography>
        <IconButton 
          onClick={handleSetToday} 
          color="primary" 
          size="small"
          sx={{ 
            border: `1px solid ${theme.palette.primary.main}`,
            borderRadius: 0,
            p: 1,
            '&:hover': {
              backgroundColor: theme.palette.primary.light,
              color: 'white'
            }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LuClock size={16} />
            <Typography variant="caption" sx={{ fontWeight: 500 }}>Hoy</Typography>
          </Box>
        </IconButton>
      </Box>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            <DatePicker
              label="Fecha de Registro"
              value={date}
              onChange={handleDateChange}
              open={open}
              onOpen={() => setOpen(true)}
              onClose={() => setOpen(false)}
              enableAccessibleFieldDOMStructure={false}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  required: true,
                  onClick: () => setOpen(true),
                  error: touched && !date,
                  helperText: touched && !date ? 'La fecha de registro es requerida' : '',
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setOpen(true)}>
                          <LuCalendar size={20} color={theme.palette.primary.main} />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      borderRadius: 0,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: touched && !date ? theme.palette.error.main : theme.palette.divider
                      }
                    }
                  }
                },
                day: {
                  sx: {
                    '&.Mui-selected': {
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark
                      }
                    }
                  }
                },
                popper: {
                  sx: {
                    '& .MuiPaper-root': {
                      borderRadius: 0,
                      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                    }
                  }
                }
              }}
            />
          </LocalizationProvider>
        </Grid>
      </Grid>
    </section>
  );
};

export default RegistrationDateSection;
