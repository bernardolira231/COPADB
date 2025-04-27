import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Divider,
  Box,
  alpha,
  useTheme
} from '@mui/material';
import { LuSearch, LuX } from 'react-icons/lu';
import { searchBarPaperSx } from '../sx';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

// Función de debounce para retrasar la ejecución de una función
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Establecer un temporizador para actualizar el valor después del retraso
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar el temporizador si el valor cambia antes del retraso
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const [inputValue, setInputValue] = useState(searchTerm);
  const debouncedSearchTerm = useDebounce(inputValue, 500); // 500ms de retraso
  const theme = useTheme();

  // Sincronizar el valor del input con el searchTerm cuando cambia externamente
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Efecto para ejecutar la búsqueda cuando cambia el valor debounced
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      onSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, onSearch, searchTerm]);

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Manejar la limpieza del campo de búsqueda
  const handleClear = () => {
    setInputValue('');
    onSearch('');
  };

  // Manejar el envío del formulario (por si el usuario presiona Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  return (
    <Box sx={{ position: 'relative', width: { xs: '100%', sm: 400 } }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={searchBarPaperSx(theme)}
      >
        <IconButton 
          type="submit" 
          sx={{ 
            p: '10px',
            color: 'primary.main'
          }} 
          aria-label="buscar"
        >
          <LuSearch />
        </IconButton>
        <InputBase
          sx={{ 
            ml: 1, 
            flex: 1,
            fontSize: '0.95rem',
            '& .MuiInputBase-input': {
              padding: '10px 0'
            }
          }}
          placeholder="Buscar estudiantes..."
          value={inputValue}
          onChange={handleInputChange}
          inputProps={{ 'aria-label': 'buscar estudiantes' }}
        />
        {inputValue && (
          <IconButton 
            type="button" 
            sx={{ 
              p: '10px',
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main'
              }
            }} 
            aria-label="limpiar" 
            onClick={handleClear}
          >
            <LuX />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar;
