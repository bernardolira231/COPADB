import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
} from "@mui/material";
import { LuTriangle } from "react-icons/lu";

interface ConfirmationModalProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title: string;
  message: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onConfirm,
  onCancel,
  title,
  message,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          borderRadius: "12px",
          padding: "8px",
          maxWidth: "450px",
        },
      }}
    >
      <DialogTitle
        id="alert-dialog-title"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: "#d32f2f",
          fontWeight: "bold",
        }}
      >
        <LuTriangle size={24} />
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          sx={{ color: "text.primary" }}
        >
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ padding: "16px 24px" }}>
        <Button
          onClick={onCancel}
          variant="outlined"
          sx={{
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          autoFocus
          sx={{
            textTransform: "none",
            borderRadius: "8px",
          }}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
