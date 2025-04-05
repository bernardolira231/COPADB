import React from 'react';

interface FormButtonsProps {
  isFormValid: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({
  isFormValid,
}) => {
  return (
    <>
      <footer className="mt-6">
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full p-2 text-white rounded-lg transition-colors ${
            isFormValid
              ? "bg-secondary hover:bg-primary"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Registrar Alumno
        </button>
      </footer>

      <footer className="mt-6">
        <button
          className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={() => {
            window.location.href = "/home";
          }}
        >
          Volver a la página principal
        </button>
      </footer>
    </>
  );
};

export default FormButtons;
