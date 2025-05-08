import useInscripcionesForm from "../../../hooks/useInscripciones";
import FormButtons from "../../Inscripciones/components/FormButtons";
import UsersSection from "../../Profesores/components/UsersSection";

const FormularioProfesor = () => {
  const {
    personalInfo,
    updatePersonalInfo,
    resetForm,
    handleSubmit,
    isFormValid,
  } = useInscripcionesForm();

  return (
      <div className="min-h-screen p-6">
        <header className="bg-white shadow-md p-4 rounded-lg mb-6">
          <h1 className="text-primary text-2xl font-bold">Profesores</h1>
        </header>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          <UsersSection
            personalInfo={personalInfo}
            updatePersonalInfo={updatePersonalInfo}
          />
          <FormButtons isFormValid={isFormValid()} onReset={resetForm} />
        </form>
      </div>
  );
};

export default FormularioProfesor;
