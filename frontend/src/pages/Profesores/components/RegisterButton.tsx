import { useState } from "react";
import ProfesorForms from "./ProfesorForms";
import Layout from "../../../components/Layout";

const RegisterButton = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const handleClick = () => {
    setMostrarFormulario(true);
  };

  return (
    <Layout>
    <div className="p-4">
      {!mostrarFormulario ? (
        <button
          onClick={handleClick}
          className="bg-primary text-white px-4 py-2 rounded-lg shadow-md hover:bg-primary-dark transition"
        >
          Registrar Profesor
        </button>
      ) : (
        <ProfesorForms />
      )}
    </div>
    </Layout>
  );
};

export default RegisterButton;
