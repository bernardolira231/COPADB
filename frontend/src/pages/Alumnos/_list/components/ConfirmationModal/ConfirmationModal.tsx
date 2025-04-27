import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  useTheme
} from '@mui/material';
import { LuX } from 'react-icons/lu';
import { 
  confirmationModalPaperSx, 
  confirmationModalHeaderSx, 
  confirmationModalCloseButtonSx, 
  confirmationModalConfirmButtonSx,
  confirmationModalCancelButtonSx,
  confirmationModalContentSx,
  confirmationModalActionsSx
} from '../sx';

interface ConfirmationModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmButtonText: string;
  cancelButtonText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  title,
  message,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirmation-dialog-title"
      aria-describedby="confirmation-dialog-description"
      PaperProps={{
        sx: confirmationModalPaperSx(theme)
      }}
      TransitionProps={{
        style: {
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
          transitionDuration: '300ms'
        }
      }}
    >
      <Box sx={confirmationModalHeaderSx(theme, isDestructive)}>
        <Typography 
          variant="h6" 
          component="span" 
          color="white"
          sx={{ 
            fontWeight: 600,
            display: 'block'
          }}
        >
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onCancel}
          sx={confirmationModalCloseButtonSx(theme)}
        >
          <LuX size={18} />
        </IconButton>
      </Box>

      <DialogContent sx={confirmationModalContentSx()}>
        <DialogContentText id="confirmation-dialog-description">
          {message}
        </DialogContentText>
      </DialogContent>

      <DialogActions sx={confirmationModalActionsSx(theme)}>
        <Button 
          onClick={onCancel} 
          color="inherit"
          variant="outlined"
          sx={confirmationModalCancelButtonSx()}
        >
          {cancelButtonText}
        </Button>
        <Button 
          onClick={onConfirm} 
          color={isDestructive ? "error" : "primary"}
          variant="contained"
          autoFocus
          sx={confirmationModalConfirmButtonSx(theme, isDestructive)}
        >
          {confirmButtonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
