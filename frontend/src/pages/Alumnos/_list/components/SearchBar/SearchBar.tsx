import React from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box,
  useTheme
} from '@mui/material';
import { LuSearch, LuX } from 'react-icons/lu';
import { searchBarPaperSx } from '../sx';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const theme = useTheme();

  // Manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  // Manejar la limpieza del campo de búsqueda
  const handleClear = () => {
    onSearch('');
  };

  // Manejar el envío del formulario (por si el usuario presiona Enter)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          value={searchTerm}
          onChange={handleInputChange}
          inputProps={{ 'aria-label': 'buscar estudiantes' }}
        />
        {searchTerm && (
          <IconButton 
            type="button" 
            sx={{ 
              p: '10px',
              color: 'text.secondary',
              '&:hover': {
                color: 'error.main'
              },
              zIndex: 10
            }} 
            aria-label="limpiar" 
            onClick={handleClear}
            size="small"
          >
            <LuX size={18} />
          </IconButton>
        )}
      </Paper>
    </Box>
  );
};

export default SearchBar;
