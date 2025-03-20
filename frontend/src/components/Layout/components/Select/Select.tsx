import {
  FormControl,
  Select,
  OutlinedInput,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useState } from "react";
import useGroups from "../../../../hooks/useGroups";

const professorId = "123";

const SelectGroup: React.FC<{
  onGroupChange: (groupId: string | null) => void;
}> = ({ onGroupChange }) => {
  const { data: groups, isLoading } = useGroups(professorId);
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  const handleChange = (event: SelectChangeEvent<string>) => {
    const groupId = event.target.value === "all" ? null : event.target.value;
    setSelectedGroup(groupId);
    onGroupChange(groupId);
  };

  return (
    <FormControl sx={{ minWidth: 250 }} size="small">
      <Select
        value={selectedGroup || "all"}
        onChange={handleChange}
        displayEmpty
        input={<OutlinedInput />}
      >
        <MenuItem value="all">
          <em>Todos los grupos</em>
        </MenuItem>
        {!isLoading &&
          groups?.map((group) => (
            <MenuItem key={group.id} value={group.id}>
              {group.name}
            </MenuItem>
          ))}
      </Select>
    </FormControl>
  );
};

export default SelectGroup;
