import { alpha, Theme } from '@mui/material/styles';

export const searchBarPaperSx = (theme: Theme) => ({
  p: '2px 4px',
  display: 'flex',
  alignItems: 'center',
  borderRadius: '4px',
  border: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: theme.palette.background.paper,
  transition: 'all 0.2s ease',
  '&:hover, &:focus-within': {
    borderColor: theme.palette.primary.main,
  }
});

export const studentsTablePaperSx = (theme: Theme) => ({
  borderRadius: 0,
  overflow: 'hidden',
  border: 'none',
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none'
});

export const studentsTableHeadCellSx = (theme: Theme) => ({
  fontWeight: 'bold',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: '12px 16px',
  fontSize: '0.875rem'
});

export const studentsTableCellSx = (theme: Theme) => ({
  padding: '8px 16px',
  borderBottom: `1px solid ${theme.palette.divider}`,
  fontSize: '0.875rem'
});

export const studentsTableRowSx = (theme: Theme) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: alpha(theme.palette.primary.main, 0.03),
  },
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
  },
  transition: 'background-color 0.2s ease'
});

export const studentsTableLoadingSx = (theme: Theme) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 300,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 'none'
});

export const confirmationModalPaperSx = (theme: Theme) => ({
  borderRadius: 0,
  overflow: 'hidden',
  boxShadow: theme.shadows[5],
  backgroundColor: theme.palette.background.paper,
  maxWidth: { xs: '90%', sm: 400 },
  minWidth: { xs: '90%', sm: 400 }
});

export const confirmationModalHeaderSx = (theme: Theme, isDestructive: boolean) => ({
  position: 'relative',
  borderBottom: '1px solid',
  borderColor: theme.palette.divider,
  backgroundColor: isDestructive 
    ? theme.palette.error.main
    : theme.palette.primary.main,
  py: 1.5,
  px: 2
});

export const confirmationModalContentSx = () => ({
  py: 2,
  px: 2
});

export const confirmationModalActionsSx = (theme: Theme) => ({
  padding: theme.spacing(1.5, 2),
  borderTop: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default
});

export const confirmationModalCloseButtonSx = (theme: Theme) => ({
  position: 'absolute',
  right: 8,
  top: '50%',
  transform: 'translateY(-50%)',
  color: theme.palette.primary.contrastText,
  padding: '4px',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  }
});

export const confirmationModalConfirmButtonSx = (theme: Theme, isDestructive: boolean) => ({
  borderRadius: 0,
  textTransform: 'none',
  px: 2,
  py: 0.75,
  fontWeight: 500,
  backgroundColor: isDestructive 
    ? theme.palette.error.main
    : theme.palette.primary.main,
  '&:hover': {
    backgroundColor: isDestructive 
      ? theme.palette.error.dark
      : theme.palette.primary.dark,
  }
});

export const confirmationModalCancelButtonSx = () => ({
  borderRadius: 0,
  textTransform: 'none',
  px: 2,
  py: 0.75,
  fontWeight: 500
});

export const studentsTablePaginationSx = (theme: Theme) => ({
  '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
    fontWeight: 500,
    color: 'text.secondary'
  },
  '.MuiTablePagination-select': {
    borderRadius: 0,
    border: 'none',
    backgroundColor: theme.palette.primary.main,
    color: 'white',
    ml: 1,
    mr: 2,
    '& .MuiSvgIcon-root': {
      color: 'white'
    }
  },
  '.MuiTablePagination-actions': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '& .MuiIconButton-root': {
      color: theme.palette.primary.main
    }
  },
  borderTop: 'none'
});
