import React, { useState } from "react";
import { EstudianteAcademicInfo } from "../../../types/estudiante";
import { 
  Typography, 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  FormHelperText
} from "@mui/material";
import { LuGraduationCap, LuBuilding, LuSchool } from "react-icons/lu";

interface AcademicInfoSectionProps {
  academicInfo: EstudianteAcademicInfo;
  updateAcademicInfo: (field: keyof EstudianteAcademicInfo, value: any) => void;
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({
  academicInfo,
  updateAcademicInfo,
}) => {
  // Estado para rastrear qué campos han sido tocados
  const [touchedFields, setTouchedFields] = useState<Record<string, boolean>>({});

  const handleBlur = (field: keyof EstudianteAcademicInfo) => {
    setTouchedFields(prev => ({ ...prev, [field]: true }));
  };

  const becaOptions = [
    { value: "true", label: "Sí" },
    { value: "false", label: "No" },
  ];

  return (
    <section>
      <Typography variant="h5" color="primary" gutterBottom fontWeight="medium" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <LuGraduationCap size={24} />
        Información Académica
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth variant="outlined" margin="normal" required>
            <InputLabel id="beca-label">Beca</InputLabel>
            <Select
              labelId="beca-label"
              value={academicInfo.beca ? "true" : "false"}
              onChange={(e) => updateAcademicInfo("beca", e.target.value === "true")}
              onBlur={() => handleBlur("beca")}
              label="Beca"
              startAdornment={<LuGraduationCap className="mr-2" />}
            >
              {becaOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Capilla"
            value={academicInfo.capilla}
            onChange={(e) => updateAcademicInfo("capilla", e.target.value)}
            onBlur={() => handleBlur("capilla")}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa el nombre de la capilla"
            error={touchedFields["capilla"] && academicInfo.capilla === ''}
            helperText={touchedFields["capilla"] && academicInfo.capilla === '' ? 'La capilla es requerida' : ''}
            InputProps={{
              startAdornment: (
                <LuBuilding className="mr-2" />
              ),
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <TextField
            label="Campus Escolar"
            value={academicInfo.campusEscolar}
            onChange={(e) => updateAcademicInfo("campusEscolar", e.target.value)}
            onBlur={() => handleBlur("campusEscolar")}
            required
            fullWidth
            variant="outlined"
            margin="normal"
            placeholder="Ingresa el nombre del campus"
            error={touchedFields["campusEscolar"] && academicInfo.campusEscolar === ''}
            helperText={touchedFields["campusEscolar"] && academicInfo.campusEscolar === '' ? 'El campus escolar es requerido' : ''}
            InputProps={{
              startAdornment: (
                <LuSchool className="mr-2" />
              ),
            }}
          />
        </Grid>
      </Grid>
    </section>
  );
};

export default AcademicInfoSection;
