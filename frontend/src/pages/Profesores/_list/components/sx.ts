import { SxProps, Theme } from "@mui/material";

// Estilos para la tabla de profesores
export const profesoresTablePaperSx: SxProps<Theme> = {
  width: "100%",
  overflow: "hidden",
  borderRadius: "8px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  border: "1px solid #e0e0e0",
};

export const profesoresTableHeadCellSx: SxProps<Theme> = {
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  color: "#333",
};

export const profesoresTableCellSx: SxProps<Theme> = {
  borderBottom: "1px solid #e0e0e0",
  padding: "12px 16px",
};

export const profesoresTableRowSx: SxProps<Theme> = {
  "&:hover": {
    backgroundColor: "#f9f9f9",
  },
  transition: "background-color 0.2s ease-in-out",
};

export const profesoresTableLoadingSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "40px 0",
};

export const profesoresTablePaginationSx: SxProps<Theme> = {
  borderTop: "1px solid #e0e0e0",
};
