import { FormControl, Select, OutlinedInput, MenuItem, SelectChangeEvent, Typography } from "@mui/material";
import { Materia } from "../../../../context/MateriaContext";
import useSx from "./sx"

interface Props {
  materias: Materia[];
  materiaSeleccionada: Materia | null;
  onMateriaChange: (materia: Materia | null) => void;
  loading?: boolean;
}

const SelectComponent: React.FC<Props> = ({ materias, materiaSeleccionada, onMateriaChange, loading = false }) => {
  const sx = useSx();
  const handleChange = (event: SelectChangeEvent<string>) => {
    const materiaId = event.target.value;
    if (materiaId === "all") {
      onMateriaChange(null);
    } else {
      const materia = materias.find((m) => m.group_id.toString() === materiaId) || null;
      onMateriaChange(materia);
    }
  };

  if (materias.length === 0 && !loading) {
    return (
      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ 
          fontStyle: 'italic',
          fontSize: '0.85rem',
          display: 'inline-block',
          padding: '6px 10px',
          border: '1px solid #e0e0e0',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}
      >
        Sin materias asignadas
      </Typography>
    );
  }

  return (
    <FormControl sx={sx.root} size="small">
      <Select
        value={materiaSeleccionada ? materiaSeleccionada.group_id.toString() : "all"}
        onChange={handleChange}
        displayEmpty
        input={<OutlinedInput />}
        disabled={loading || materias.length === 0}
      >
        <MenuItem value="all" sx={sx.select}>
          <em>{materias.length > 0 ? "Todas las materias" : "No hay materias"}</em>
        </MenuItem>
        {materias.map((materia) => (
          <MenuItem key={materia.group_id} value={materia.group_id.toString()} sx={sx.select}>
            {materia.class_name} - {materia.grado}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
