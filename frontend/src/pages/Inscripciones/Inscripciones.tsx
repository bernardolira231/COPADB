import Layout from "../../components/Layout";
import useInscripcionesForm from "../../hooks/useInscripciones";
import PersonalInfoSection from "./components/PersonalInfoSection";
import AcademicInfoSection from "./components/AcademicInfoSection";
import FamilyInfoSection from "./components/FamilyInfoSection";
import PermissionSection from "./components/PermissionSection";
import RegistrationDateSection from "./components/RegistrationDateSection";
import FormButtons from "./components/FormButtons";

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
      <div className="min-h-screen p-6">
        <header className="bg-white shadow-md p-4 rounded-lg mb-6">
          <h1 className="text-primary text-2xl font-bold">Inscripciones</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <PersonalInfoSection
            personalInfo={personalInfo}
            updatePersonalInfo={updatePersonalInfo}
          />

          <AcademicInfoSection
            academicInfo={academicInfo}
            updateAcademicInfo={updateAcademicInfo}
          />

          <FamilyInfoSection
            familyInfo={familyInfo}
            updateFamilyInfo={updateFamilyInfo}
          />

          <PermissionSection
            permiso={additionalInfo.permiso}
            setPermiso={(value) => updateAdditionalInfo('permiso', value)}
          />

          <RegistrationDateSection
            fechaRegistro={additionalInfo.fechaRegistro}
            setFechaRegistro={(value) => updateAdditionalInfo('fechaRegistro', value)}
          />

          <FormButtons isFormValid={isFormValid()} onReset={resetForm} />
        </form>
      </div>
    </Layout>
  );
};

export default Inscripciones;
