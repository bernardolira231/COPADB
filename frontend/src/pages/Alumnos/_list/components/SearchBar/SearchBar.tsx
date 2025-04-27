import React, { useState, useEffect } from 'react';
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

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const [inputValue, setInputValue] = useState(searchTerm);

  // Sincronizar el valor del input con el searchTerm cuando cambia externamente
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  // Manejar el envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(inputValue);
  };

  // Manejar la limpieza del campo de búsqueda
  const handleClear = () => {
    setInputValue('');
    onSearch('');
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
        onChange={(e) => setInputValue(e.target.value)}
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
