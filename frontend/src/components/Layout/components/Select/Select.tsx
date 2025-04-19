import { FormControl, Select, OutlinedInput, MenuItem, SelectChangeEvent } from "@mui/material";
import { Materia } from "../../../../context/MateriaContext";
import useSx from "./sx"

interface Props {
  materias: Materia[];
  materiaSeleccionada: Materia | null;
  onMateriaChange: (materia: Materia | null) => void;
}

const SelectComponent: React.FC<Props> = ({ materias, materiaSeleccionada, onMateriaChange }) => {
  const sx = useSx();
  const handleChange = (event: SelectChangeEvent<string>) => {
    const materiaId = event.target.value;
    if (materiaId === "all") {
      onMateriaChange(null);
    } else {
      const materia = materias.find((m) => m.id === materiaId) || null;
      onMateriaChange(materia);
    }
  };

  return (
    <FormControl sx={sx.root} size="small">
      <Select
        value={materiaSeleccionada ? materiaSeleccionada.id : "all"}
        onChange={handleChange}
        displayEmpty
        input={<OutlinedInput />}
      >
        <MenuItem value="all" sx={sx.select}>
          <em>Todas las materias</em>
        </MenuItem>
        {materias.map((materia) => (
          <MenuItem key={materia.id} value={materia.id} sx={sx.select}>
            {materia.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
