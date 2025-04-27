import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { Container, Paper, Typography, Card, Box, CircularProgress, Alert } from "@mui/material";
import Layout from "../../../components/Layout";
import useEditEstudiante from "../../../hooks/useEditEstudiante";
import PersonalInfoSection from "../_add/components/PersonalInfoSection";
import AcademicInfoSection from "../_add/components/AcademicInfoSection";
import FamilyInfoSection from "../_add/components/FamilyInfoSection";
import PermissionSection from "../_add/components/PermissionSection";
import RegistrationDateSection from "../_add/components/RegistrationDateSection";
import FormButtons from "../_add/components/FormButtons";

const EditEstudiante = () => {
  // Corregir el uso de useParams según la documentación de TanStack Router
  const params = useParams({ from: '/alumnos/editar/$id' });
  const id = params.id;
  const navigate = useNavigate();
  const [initialLoading, setInitialLoading] = useState(true);
  const [initialError, setInitialError] = useState<string | null>(null);

  const estudianteId = id ? parseInt(id) : undefined;

  const {
    personalInfo,
    academicInfo,
    familyInfo,
    additionalInfo,
    loading,
    error,
    isEditMode,
    updatePersonalInfo,
    updateAcademicInfo,
    updateFamilyInfo,
    updateAdditionalInfo,
    handleSubmit,
    isFormValid,
  } = useEditEstudiante({ estudianteId });

  useEffect(() => {
    // Simular tiempo de carga inicial para asegurarnos de que los datos se carguen
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleCancel = () => {
    navigate({ to: "/alumnos" });
  };

  if (initialLoading || loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 2 }}>
              Cargando datos del estudiante...
            </Typography>
          </Box>
        </Container>
      </Layout>
    );
  }

  if (initialError || error) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert 
            severity="error" 
            sx={{ mb: 3 }}
          >
            {initialError || error || "Error al cargar los datos del estudiante"}
          </Alert>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              No se pudieron cargar los datos del estudiante. Por favor, inténtalo de nuevo.
            </Typography>
            <FormButtons 
              isFormValid={false} 
              cancelButtonText="Volver a la lista" 
              onCancel={handleCancel}
            />
          </Box>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: '#1976d2' }}>
          <Typography
            variant="h5"
            component="h1"
            sx={{ color: 'white', fontWeight: 500 }}
          >
            {isEditMode ? "Editar Estudiante" : "Registrar Nuevo Estudiante"}
          </Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Card elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 500 }}>
              Información Personal
            </Typography>
            <PersonalInfoSection
              personalInfo={personalInfo}
              updatePersonalInfo={updatePersonalInfo}
            />
          </Card>

          <Card elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 500 }}>
              Información Académica
            </Typography>
            <AcademicInfoSection
              academicInfo={academicInfo}
              updateAcademicInfo={updateAcademicInfo}
            />
          </Card>

          <Card elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 500 }}>
              Información Familiar
            </Typography>
            <FamilyInfoSection
              familyInfo={familyInfo}
              updateFamilyInfo={updateFamilyInfo}
            />
          </Card>

          <Card elevation={0} sx={{ p: 4, mb: 4, border: '1px solid #e0e0e0' }}>
            <Typography variant="h6" color="primary" sx={{ mb: 3, fontWeight: 500 }}>
              Información Adicional
            </Typography>
            <Box sx={{ mb: 3 }}>
              <PermissionSection
                permiso={additionalInfo.permiso}
                setPermiso={(value) => updateAdditionalInfo("permiso", value)}
              />
            </Box>

            <RegistrationDateSection
              fechaRegistro={additionalInfo.fechaRegistro}
              setFechaRegistro={(value) =>
                updateAdditionalInfo("fechaRegistro", value)
              }
            />
          </Card>

          <FormButtons 
            isFormValid={isFormValid()} 
            submitButtonText={isEditMode ? "Guardar Cambios" : "Registrar Estudiante"}
            cancelButtonText="Cancelar"
            onCancel={handleCancel}
          />
        </form>
      </Container>
    </Layout>
  );
};

export default EditEstudiante;
