import React, { useState } from 'react';
import { EstudianteFamilyInfo } from '../../../types/estudiante';
import { 
  Typography, 
  Grid, 
  TextField
} from '@mui/material';
import { LuUsers, LuPhone, LuMail } from 'react-icons/lu';

interface FamilyInfoSectionProps {
  familyInfo: EstudianteFamilyInfo;
  updateFamilyInfo: (field: keyof EstudianteFamilyInfo, value: string) => void;
}

const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({
  familyInfo,
  updateFamilyInfo,
}) => {
  // Estado para rastrear qué campos han sido tocados
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof EstudianteFamilyInfo) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const handlePhoneChange = (field: keyof EstudianteFamilyInfo, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    updateFamilyInfo(field, numericValue);
  };

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuUsers size={24} />
        Información Familiar
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Nombre del Tutor"
            value={familyInfo.tutorNombre}
            onChange={(e) => updateFamilyInfo('tutorNombre', e.target.value)}
            onBlur={() => handleBlur('tutorNombre')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa el nombre del tutor"
            error={touchedFields['tutorNombre'] && familyInfo.tutorNombre === ''}
            helperText={touchedFields['tutorNombre'] && familyInfo.tutorNombre === '' ? 'El nombre del tutor es requerido' : ''}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Apellido Paterno del Tutor"
            value={familyInfo.tutorApellidoPaterno}
            onChange={(e) => updateFamilyInfo('tutorApellidoPaterno', e.target.value)}
            onBlur={() => handleBlur('tutorApellidoPaterno')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa el apellido paterno del tutor"
            error={touchedFields['tutorApellidoPaterno'] && familyInfo.tutorApellidoPaterno === ''}
            helperText={touchedFields['tutorApellidoPaterno'] && familyInfo.tutorApellidoPaterno === '' ? 'El apellido paterno del tutor es requerido' : ''}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Apellido Materno del Tutor"
            value={familyInfo.tutorApellidoMaterno}
            onChange={(e) => updateFamilyInfo('tutorApellidoMaterno', e.target.value)}
            onBlur={() => handleBlur('tutorApellidoMaterno')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa el apellido materno del tutor"
            error={touchedFields['tutorApellidoMaterno'] && familyInfo.tutorApellidoMaterno === ''}
            helperText={touchedFields['tutorApellidoMaterno'] && familyInfo.tutorApellidoMaterno === '' ? 'El apellido materno del tutor es requerido' : ''}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Número de Teléfono"
            type="tel"
            inputMode="numeric"
            value={familyInfo.telefono}
            onChange={(e) => handlePhoneChange('telefono', e.target.value)}
            onBlur={() => handleBlur('telefono')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ej. 5512345678"
            error={touchedFields['telefono'] && familyInfo.telefono === ''}
            helperText={touchedFields['telefono'] && familyInfo.telefono === '' ? 'El número de teléfono es requerido' : ''}
            InputProps={{
              startAdornment: (
                <LuPhone className="mr-2" />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <TextField
            label="Correo Electrónico del Tutor"
            type="email"
            value={familyInfo.emailTutor}
            onChange={(e) => updateFamilyInfo('emailTutor', e.target.value)}
            onBlur={() => handleBlur('emailTutor')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="tutor@ejemplo.com"
            error={touchedFields['emailTutor'] && familyInfo.emailTutor === ''}
            helperText={touchedFields['emailTutor'] && familyInfo.emailTutor === '' ? 'El correo electrónico del tutor es requerido' : ''}
            InputProps={{
              startAdornment: (
                <LuMail className="mr-2" />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12}>
          <TextField
            label="Número de Teléfono de Emergencia"
            type="tel"
            inputMode="numeric"
            value={familyInfo.telefonoEmergencia}
            onChange={(e) => handlePhoneChange('telefonoEmergencia', e.target.value)}
            onBlur={() => handleBlur('telefonoEmergencia')}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ej. 5587654321"
            error={touchedFields['telefonoEmergencia'] && familyInfo.telefonoEmergencia === ''}
            helperText={touchedFields['telefonoEmergencia'] && familyInfo.telefonoEmergencia === '' ? 'El número de teléfono de emergencia es requerido' : ''}
            InputProps={{
              startAdornment: (
                <LuPhone className="mr-2" color="red" />
              ),
            }}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default FamilyInfoSection;
