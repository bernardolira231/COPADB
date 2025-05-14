import React, { useState, useEffect } from "react";
import { Paper, InputBase, IconButton, Box } from "@mui/material";
import { LuSearch, LuX } from "react-icons/lu";

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, onSearch }) => {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

  // Sincronizar el estado local con el prop cuando cambia
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  // Función para manejar el cambio en el input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTerm = e.target.value;
    setLocalSearchTerm(newTerm);
    
    // Implementar debounce para la búsqueda automática
    const timeoutId = setTimeout(() => {
      onSearch(newTerm);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  // Función para limpiar la búsqueda
  const handleClear = () => {
    setLocalSearchTerm("");
    onSearch("");
  };

  // Función para manejar la búsqueda al presionar Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch(localSearchTerm);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "500px" }}>
      <Paper
        elevation={0}
        sx={{
          p: "2px 4px",
          display: "flex",
          alignItems: "center",
          border: "1px solid #e0e0e0",
          borderRadius: "8px",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          },
        }}
      >
        <IconButton sx={{ p: "10px" }} aria-label="search">
          <LuSearch />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder="Buscar profesores por nombre o email..."
          value={localSearchTerm}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {localSearchTerm && (
          <IconButton
            sx={{ p: "10px" }}
            aria-label="clear"
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
