import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import useSx from "./sx";
import useClasses from "../../../../hooks/useClasses";

const SelectComponent: React.FC = () => {
  const { data: clases, isLoading, error } = useClasses();
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
        disabled={isLoading || !!error}
      >
        <MenuItem value="" disabled>
          <em>{isLoading ? "Cargando..." : "Selecciona una clase"}</em>
        </MenuItem>
        <MenuItem value="*">Todas</MenuItem>
        {!isLoading &&
          clases?.map((clase, index) => (
            <MenuItem key={index} value={clase}>
              {clase}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectComponent;
