import Layout from "../../../components/Layout";
import useInscripcionesForm from "../../../hooks/useInscripciones";
import PersonalInfoSection from "./components/PersonalInfoSection";
import AcademicInfoSection from "./components/AcademicInfoSection";
import FamilyInfoSection from "./components/FamilyInfoSection";
import PermissionSection from "./components/PermissionSection";
import RegistrationDateSection from "./components/RegistrationDateSection";
import FormButtons from "./components/FormButtons";
import { Paper, Typography, Container, Box, Card } from "@mui/material";

const Inscripciones = () => {
  const {
    personalInfo,
    academicInfo,
    familyInfo,
    additionalInfo,
    updatePersonalInfo,
    updateAcademicInfo,
    updateFamilyInfo,
    updateAdditionalInfo,
    resetForm,
    handleSubmit,
    isFormValid,
  } = useInscripcionesForm();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            color="primary"
            fontWeight="bold"
          >
            Inscripciones
          </Typography>
        </Paper>

        <form onSubmit={handleSubmit}>
          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
            <PersonalInfoSection
              personalInfo={personalInfo}
              updatePersonalInfo={updatePersonalInfo}
            />
          </Card>

          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
            <AcademicInfoSection
              academicInfo={academicInfo}
              updateAcademicInfo={updateAcademicInfo}
            />
          </Card>

          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
            <FamilyInfoSection
              familyInfo={familyInfo}
              updateFamilyInfo={updateFamilyInfo}
            />
          </Card>

          <Card elevation={3} sx={{ p: 4, mb: 4 }}>
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

          <FormButtons isFormValid={isFormValid()} onReset={resetForm} />
        </form>
      </Container>
    </Layout>
  );
};

export default Inscripciones;
