import Layout from "../../../components/Layout";
import useInscripcionesForm from "../../../hooks/useInscripciones";
import PersonalInfoSection from "./components/PersonalInfoSection";
import AcademicInfoSection from "./components/AcademicInfoSection";
import FamilyInfoSection from "./components/FamilyInfoSection";
import PermissionSection from "./components/PermissionSection";
import RegistrationDateSection from "./components/RegistrationDateSection";
import FormButtons from "./components/FormButtons";
import SuccessModal from "./components/SuccessModal";
import { Paper, Typography, Container, Box, Card, Button } from "@mui/material";
import { LuArrowLeft } from "react-icons/lu";
import { Link } from "@tanstack/react-router";

const Inscripciones = () => {
  const {
    personalInfo,
    academicInfo,
    familyInfo,
    additionalInfo,
    loading,
    isSuccessModalOpen,
    usarTutorExistente,
    tutorSeleccionado,
    updatePersonalInfo,
    updateAcademicInfo,
    updateFamilyInfo,
    updateAdditionalInfo,
    handleSubmit,
    isFormValid,
    handleCancel,
    handleCloseSuccessModal,
    setUsarTutorExistente,
    setTutorSeleccionado,
  } = useInscripcionesForm();

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Paper elevation={3} sx={{ p: 3, mb: 0, flexGrow: 1 }}>
            <Typography
              variant="h4"
              component="h1"
              color="primary"
              fontWeight="bold"
            >
              Inscripciones
            </Typography>
          </Paper>
        </Box>
        <Button
          component={Link}
          to="/alumnos"
          variant="outlined"
          color="primary"
          startIcon={<LuArrowLeft />}
          sx={{
            ml: 2,
            mb: 3,
            height: "fit-content",
            borderRadius: 0,
            borderWidth: 2,
            "&:hover": {
              borderWidth: 2,
            },
          }}
        >
          Volver a la lista
        </Button>

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
              usarTutorExistente={usarTutorExistente}
              setUsarTutorExistente={setUsarTutorExistente}
              tutorSeleccionado={tutorSeleccionado}
              setTutorSeleccionado={setTutorSeleccionado}
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

          <FormButtons
            isFormValid={isFormValid()}
            onCancel={handleCancel}
            submitButtonText={
              loading ? "Registrando..." : "Registrar Estudiante"
            }
            disabled={loading}
          />
        </form>

        <SuccessModal
          open={isSuccessModalOpen}
          onClose={handleCloseSuccessModal}
        />
      </Container>
    </Layout>
  );
};

export default Inscripciones;
