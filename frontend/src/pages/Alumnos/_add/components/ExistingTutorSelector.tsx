import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Autocomplete, 
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper
} from '@mui/material';
import { LuSearch, LuUser, LuMail, LuPhone } from 'react-icons/lu';

interface Tutor {
  id: number;
  tutor_name: string;
  tutor_lastname_f: string;
  tutor_lastname_m: string;
  phone_number: string;
  email_address: string;
  emergency_phone_number: string;
}

interface ExistingTutorSelectorProps {
  usarTutorExistente: boolean;
  setUsarTutorExistente: (value: boolean) => void;
  tutorSeleccionado: Tutor | null;
  setTutorSeleccionado: (tutor: Tutor | null) => void;
}

const ExistingTutorSelector: React.FC<ExistingTutorSelectorProps> = ({
  usarTutorExistente,
  setUsarTutorExistente,
  tutorSeleccionado,
  setTutorSeleccionado
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tutores, setTutores] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cargar tutores recientes cuando se activa la opción de usar tutor existente
  useEffect(() => {
    if (usarTutorExistente) {
      fetchTutores(""); // Cargar tutores recientes sin término de búsqueda
    } else {
      setTutores([]);
    }
  }, [usarTutorExistente]);
  
  // Función para buscar tutores
  const fetchTutores = async (term: string) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5328/api/tutores${term ? `?search=${encodeURIComponent(term)}` : ''}`);
      if (response.ok) {
        const data = await response.json();
        setTutores(data.tutores || []);
      } else {
        console.error('Error al buscar tutores');
        setTutores([]);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setTutores([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Buscar tutores cuando cambia el término de búsqueda con debounce
  useEffect(() => {
    if (!usarTutorExistente) return;
    
    // Limpiar el timeout anterior si existe
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    // Crear un nuevo timeout para hacer la búsqueda después de 500ms
    timeoutRef.current = setTimeout(() => {
      if (!searchTerm) {
        fetchTutores(""); // Mostrar tutores recientes si el campo está vacío
        return;
      }
      
      if (searchTerm.length < 2) {
        return;
      }

      fetchTutores(searchTerm);
    }, 500);
    
    // Limpiar el timeout al desmontar el componente
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, usarTutorExistente]);

  // Cuando cambia el estado de usar tutor existente
  useEffect(() => {
    if (!usarTutorExistente) {
      setTutorSeleccionado(null);
      setSearchTerm('');
    }
  }, [usarTutorExistente, setTutorSeleccionado]);

  return (
    <Box sx={{ mt: 2, mb: 3 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={usarTutorExistente}
            onChange={(e) => setUsarTutorExistente(e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body1" fontWeight="medium">
            Asignar a un tutor ya registrado
          </Typography>
        }
      />

      {usarTutorExistente && (
        <Box sx={{ mt: 2 }}>
          <Autocomplete
            id="tutor-selector"
            options={tutores}
            loading={loading}
            value={tutorSeleccionado}
            onChange={(_, newValue) => {
              setTutorSeleccionado(newValue);
            }}
            getOptionLabel={(option) => 
              `${option.tutor_lastname_f} ${option.tutor_lastname_m} ${option.tutor_name}`
            }
            filterOptions={(options, state) => options} // No filtrar opciones, ya lo hace el backend
            renderInput={(params) => (
              <TextField
                {...params}
                label="Buscar tutor por nombre o correo"
                variant="outlined"
                fullWidth
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <LuSearch className="mr-2" />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, option) => (
              <li {...props} key={option.id}>
                <Box component={Paper} elevation={0} sx={{ p: 1, width: '100%', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                    <LuUser size={16} style={{ marginRight: 8 }} />
                    <Typography variant="body1" fontWeight="medium">                      
                      {option.tutor_name} {option.tutor_lastname_f} {option.tutor_lastname_m}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, ml: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LuMail size={14} style={{ marginRight: 4 }} /> {option.email_address}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center' }}>
                      <LuPhone size={14} style={{ marginRight: 4 }} /> {option.phone_number}
                    </Typography>
                  </Box>
                </Box>
              </li>
            )}
            noOptionsText="No se encontraron tutores"
            loadingText="Buscando tutores..."
            ListboxProps={{
              style: { maxHeight: '300px' }
            }}
            popupIcon={null}
            clearOnBlur={false}
            blurOnSelect={true}
          />
          
          {tutorSeleccionado && (
            <Paper elevation={1} sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                Tutor seleccionado:
              </Typography>
              <Typography variant="body1">
                {tutorSeleccionado.tutor_name} {tutorSeleccionado.tutor_lastname_f} {tutorSeleccionado.tutor_lastname_m}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Correo: {tutorSeleccionado.email_address}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teléfono: {tutorSeleccionado.phone_number}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Teléfono de emergencia: {tutorSeleccionado.emergency_phone_number}
              </Typography>
            </Paper>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ExistingTutorSelector;
