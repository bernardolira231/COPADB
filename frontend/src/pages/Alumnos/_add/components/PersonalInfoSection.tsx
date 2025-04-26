import React, { useState } from 'react';
import { EstudiantePersonalInfo } from '../../../types/estudiante';
import { 
  Typography, 
  TextField, 
  Grid, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  FormHelperText 
} from '@mui/material';
import { LuUser, LuMail, LuDroplet } from 'react-icons/lu';

interface PersonalInfoSectionProps {
  personalInfo: EstudiantePersonalInfo;
  updatePersonalInfo: (field: keyof EstudiantePersonalInfo, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  updatePersonalInfo,
}) => {
  // Estado para rastrear qué campos han sido tocados
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof EstudiantePersonalInfo) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const tiposSangre = [
    { value: '', label: 'Selecciona un tipo de sangre' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuUser size={24} />
        Información Personal
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nombre"
            value={personalInfo.nombre}
            onChange={(e) => updatePersonalInfo('nombre', e.target.value)}
            onBlur={() => handleBlur('nombre')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa tu nombre"
            error={touchedFields['nombre'] && personalInfo.nombre === ''}
            helperText={touchedFields['nombre'] && personalInfo.nombre === '' ? 'El nombre es requerido' : ''}
            InputProps={{
              startAdornment: (
                <LuUser className="mr-2" />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Apellido Paterno"
            value={personalInfo.apellidoPaterno}
            onChange={(e) => updatePersonalInfo('apellidoPaterno', e.target.value)}
            onBlur={() => handleBlur('apellidoPaterno')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa tu apellido paterno"
            error={touchedFields['apellidoPaterno'] && personalInfo.apellidoPaterno === ''}
            helperText={touchedFields['apellidoPaterno'] && personalInfo.apellidoPaterno === '' ? 'El apellido paterno es requerido' : ''}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Apellido Materno"
            value={personalInfo.apellidoMaterno}
            onChange={(e) => updatePersonalInfo('apellidoMaterno', e.target.value)}
            onBlur={() => handleBlur('apellidoMaterno')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa tu apellido materno"
            error={touchedFields['apellidoMaterno'] && personalInfo.apellidoMaterno === ''}
            helperText={touchedFields['apellidoMaterno'] && personalInfo.apellidoMaterno === '' ? 'El apellido materno es requerido' : ''}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Correo Electrónico"
            type="email"
            value={personalInfo.email}
            onChange={(e) => updatePersonalInfo('email', e.target.value)}
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="ejemplo@correo.com"
            InputProps={{
              startAdornment: (
                <LuMail className="mr-2" />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <FormControl fullWidth variant="outlined" margin="normal" required error={touchedFields['tipoSangre'] && personalInfo.tipoSangre === ''}>
            <InputLabel id="tipo-sangre-label">Tipo de Sangre</InputLabel>
            <Select
              labelId="tipo-sangre-label"
              value={personalInfo.tipoSangre}
              onChange={(e) => updatePersonalInfo('tipoSangre', e.target.value)}
              onBlur={() => handleBlur('tipoSangre')}
              label="Tipo de Sangre"
              displayEmpty
              startAdornment={<LuDroplet className="mr-2" />}
            >
              {tiposSangre.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {touchedFields['tipoSangre'] && personalInfo.tipoSangre === '' && (
              <FormHelperText>El tipo de sangre es requerido</FormHelperText>
            )}
          </FormControl>
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Alergias"
            value={personalInfo.alergias}
            onChange={(e) => updatePersonalInfo('alergias', e.target.value)}
            onBlur={() => handleBlur('alergias')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            placeholder="Describe tus alergias o escribe 'Ninguna' si no tienes"
            error={touchedFields['alergias'] && personalInfo.alergias === ''}
            helperText={touchedFields['alergias'] && personalInfo.alergias === '' ? 'La información de alergias es requerida' : 'Si no tiene alergias, escriba "Ninguna"'}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default PersonalInfoSection;
