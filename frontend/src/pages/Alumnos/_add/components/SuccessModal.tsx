import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography, 
  Box,
  useTheme
} from '@mui/material';
import { LuCheck } from 'react-icons/lu';

interface SuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ open, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 0,
          overflow: "hidden",
        },
      }}
    >
      <Box
        sx={{
          bgcolor: theme.palette.success.main,
          color: "white",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
        }}
      >
        <LuCheck size={24} style={{ marginRight: "12px" }} />
        <Typography variant="h6">Inscripción Exitosa</Typography>
      </Box>
      <DialogContent sx={{ py: 4 }}>
        <Typography variant="body1" align="center" sx={{ mb: 2 }}>
          El estudiante ha sido registrado correctamente en el sistema.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3, justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={onClose}
          sx={{
            minWidth: 120,
            borderRadius: 0,
          }}
        >
          Aceptar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SuccessModal;
