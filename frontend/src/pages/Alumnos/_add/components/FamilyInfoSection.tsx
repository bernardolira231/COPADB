import React, { useState, useEffect } from 'react';
import { EstudianteFamilyInfo, Tutor } from '../../../../types/estudiante';
import { 
  Typography, 
  Grid, 
  TextField,
  Divider,
  Box
} from '@mui/material';
import { LuUsers, LuPhone, LuMail } from 'react-icons/lu';
import ExistingTutorSelector from './ExistingTutorSelector';

interface FamilyInfoSectionProps {
  familyInfo: EstudianteFamilyInfo;
  updateFamilyInfo: (field: keyof EstudianteFamilyInfo, value: string) => void;
  usarTutorExistente: boolean;
  setUsarTutorExistente: (value: boolean) => void;
  tutorSeleccionado: Tutor | null;
  setTutorSeleccionado: (tutor: Tutor | null) => void;
}

const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({
  familyInfo,
  updateFamilyInfo,
  usarTutorExistente,
  setUsarTutorExistente,
  tutorSeleccionado,
  setTutorSeleccionado
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
  
  // Actualizar los campos del formulario cuando se selecciona un tutor existente
  useEffect(() => {
    if (usarTutorExistente && tutorSeleccionado) {
      updateFamilyInfo('tutorNombre', tutorSeleccionado.tutor_name);
      updateFamilyInfo('tutorApellidoPaterno', tutorSeleccionado.tutor_lastname_f);
      updateFamilyInfo('tutorApellidoMaterno', tutorSeleccionado.tutor_lastname_m);
      updateFamilyInfo('telefono', tutorSeleccionado.phone_number);
      updateFamilyInfo('emailTutor', tutorSeleccionado.email_address);
      updateFamilyInfo('telefonoEmergencia', tutorSeleccionado.emergency_phone_number);
    }
  }, [tutorSeleccionado, usarTutorExistente]);

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuUsers size={24} />
        Información Familiar
      </Typography>
      
      <ExistingTutorSelector
        usarTutorExistente={usarTutorExistente}
        setUsarTutorExistente={setUsarTutorExistente}
        tutorSeleccionado={tutorSeleccionado}
        setTutorSeleccionado={setTutorSeleccionado}
      />
      
      {usarTutorExistente && tutorSeleccionado ? (
        <Box sx={{ mt: 3, mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Los datos del tutor se han completado automáticamente.
          </Typography>
        </Box>
      ) : (
        <Divider sx={{ my: 2 }} />
      )}
      
      <Grid container spacing={3} sx={{ opacity: usarTutorExistente && tutorSeleccionado ? 0.7 : 1 }}>
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
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
            disabled={usarTutorExistente && tutorSeleccionado !== null}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default FamilyInfoSection;
