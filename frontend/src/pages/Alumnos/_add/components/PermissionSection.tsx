import React, { useState } from "react";
import { Typography, TextField, Grid } from "@mui/material";
import { LuFileText } from "react-icons/lu";
import { EstudianteAdditionalInfo } from "../../../../types/estudiante";

interface PermissionSectionProps {
  permiso: string;
  setPermiso: (value: string) => void;
}

const PermissionSection: React.FC<PermissionSectionProps> = ({
  permiso,
  setPermiso,
}) => {
  // Estado para rastrear si el campo ha sido tocado
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
  };

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuFileText size={24} />
        Permisos
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            label="Permiso"
            value={permiso}
            onChange={(e) => setPermiso(e.target.value)}
            onBlur={handleBlur}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            placeholder="Describe los permisos otorgados al estudiante"
            error={touched && permiso === ''}
            helperText={touched && permiso === '' ? 'El permiso es requerido' : ''}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default PermissionSection;
