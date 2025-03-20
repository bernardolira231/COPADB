import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import useSx from "./sx";

const SelectComponent: React.FC = () => {
  const clases: string[] = ["Primero A", "Segundo B", "Tercero A"];
  const [selectedClass, setSelectedClass] = useState<string>("");
  const sx = useSx();

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedClass(event.target.value as string);
  };

  return (
    <FormControl sx={sx.root} size="small">
      <Select
        value={selectedClass}
        onChange={handleChange}
        displayEmpty
        input={<OutlinedInput />}
        sx={sx.select}
      >
        <MenuItem value="" disabled>
          <em>Selecciona una clase</em>
        </MenuItem>
        {clases.map((clase, index) => (
          <MenuItem key={index} value={clase}>
            {clase}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
