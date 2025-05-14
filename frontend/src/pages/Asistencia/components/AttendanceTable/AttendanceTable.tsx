import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ToggleButtonGroup,
  ToggleButton,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { green, red, grey } from "@mui/material/colors";
import { useAttendance } from "../../context/AttendanceContext";
import useSx from "./sx";

const AttendanceTable: React.FC = () => {
  const { attendance, loading, toggleAttendance } = useAttendance();
  const sx = useSx();

  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Table size="small">
        <TableHead sx={sx.tableHead}>
          <TableRow>
            <TableCell sx={sx.tableCell}>#</TableCell>
            <TableCell sx={sx.tableCell}>Nombre del Estudiante</TableCell>
            <TableCell align="center" sx={sx.tableCell}>
              Asistencia
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} align="center">
                <CircularProgress size={32} />
              </TableCell>
            </TableRow>
          ) : (
            attendance.map((row, idx) => (
              <TableRow key={row.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{row.student_name}</TableCell>
                <TableCell align="center">
                  <ToggleButtonGroup
                    exclusive
                    value={row.present ? "present" : "absent"}
                    onChange={(_, value) => {
                      if (value === "present" && !row.present)
                        toggleAttendance(row.id);
                      if (value === "absent" && row.present)
                        toggleAttendance(row.id);
                    }}
                    sx={sx.toggleButtonGroup}
                  >
                    <Tooltip title="Presente">
                      <ToggleButton
                        value="present"
                        selected={row.present}
                        sx={{
                          border: "none",
                          bgcolor: "#fff",
                          color: row.present ? green[500] : grey[500],
                          minWidth: 36,
                          fontWeight: 700,
                          fontSize: 18,
                          p: 0,
                          "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: green[500],
                            color: "#fff",
                          },
                          "&:hover": {
                            bgcolor: row.present ? green[700] : grey[100],
                          },
                        }}
                      >
                        <CheckIcon />
                      </ToggleButton>
                    </Tooltip>
                    <Tooltip title="Falta">
                      <ToggleButton
                        value="absent"
                        selected={!row.present}
                        sx={{
                          border: "none",
                          bgcolor: "#fff",
                          color: !row.present ? red[500] : grey[500],
                          minWidth: 36,
                          ml: 1,
                          fontWeight: 700,
                          fontSize: 18,
                          p: 0,
                          "&.Mui-selected, &.Mui-selected:hover": {
                            bgcolor: red[500],
                            color: "#fff",
                          },
                          "&:hover": {
                            bgcolor: !row.present ? red[700] : grey[100],
                          },
                        }}
                      >
                        <CloseIcon />
                      </ToggleButton>
                    </Tooltip>
                  </ToggleButtonGroup>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AttendanceTable;
