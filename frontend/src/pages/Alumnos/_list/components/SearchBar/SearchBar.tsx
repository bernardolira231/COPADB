import React, { useState, useEffect, useCallback } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Divider
} from '@mui/material';
import { LuSearch, LuX } from 'react-icons/lu';

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
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{ 
        p: '2px 4px', 
        display: 'flex', 
        alignItems: 'center', 
        width: { xs: '100%', sm: 400 },
        boxShadow: 2
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Buscar estudiantes..."
        value={inputValue}
        onChange={handleInputChange}
        inputProps={{ 'aria-label': 'buscar estudiantes' }}
      />
      {inputValue && (
        <>
          <IconButton 
            type="button" 
            sx={{ p: '10px' }} 
            aria-label="limpiar" 
            onClick={handleClear}
          >
            <LuX />
          </IconButton>
          <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        </>
      )}
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="buscar">
        <LuSearch />
      </IconButton>
    </Paper>
  );
};

export default SearchBar;
