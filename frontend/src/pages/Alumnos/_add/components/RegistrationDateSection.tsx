import React, { useState } from 'react';
import { Typography, TextField, Grid } from '@mui/material';
import { LuCalendar } from 'react-icons/lu';
import { EstudianteAdditionalInfo } from '../../../../types/estudiante';

interface RegistrationDateSectionProps {
  fechaRegistro: string;
  setFechaRegistro: (value: string) => void;
}

const RegistrationDateSection: React.FC<RegistrationDateSectionProps> = ({
  fechaRegistro,
  setFechaRegistro,
}) => {
  // Estado para rastrear si el campo ha sido tocado
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  // Obtener la fecha actual en formato YYYY-MM-DD para el placeholder
  const today = new Date().toISOString().split('T')[0];

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuCalendar size={24} />
        Fecha de Registro
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Fecha de Registro"
            type="date"
            value={fechaRegistro}
            onChange={(e) => setFechaRegistro(e.target.value)}
            onBlur={handleBlur}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder={today}
            error={touched && fechaRegistro === ''}
            helperText={touched && fechaRegistro === '' ? 'La fecha de registro es requerida' : ''}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default RegistrationDateSection;
