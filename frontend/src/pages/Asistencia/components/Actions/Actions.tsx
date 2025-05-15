import { Box, Button } from "@mui/material";
import useSx from "./sx";
import { useAttendance } from "../../context/AttendanceContext";

const Actions = () => {
  const sx = useSx();
  const { setAllPresent, setAllAbsent } = useAttendance();

  return (
    <Box sx={sx.container}>
      <Button variant="contained" onClick={setAllPresent}>
        Marcar todos presentes
      </Button>
      <Button variant="contained" onClick={setAllAbsent}>
        Marcar todos ausentes
      </Button>
    </Box>
  );
};

export default Actions;
