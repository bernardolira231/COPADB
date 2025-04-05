import React from "react";

interface FormButtonsProps {
  isFormValid: boolean;
  onReset?: () => void;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isFormValid, onReset }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mt-8">
      <button
        type="submit"
        className={`flex-1 p-3 rounded-lg text-white font-medium transition-colors ${
          isFormValid
            ? "bg-primary hover:bg-primary-dark"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        disabled={!isFormValid}
      >
        Registrar Estudiante
      </button>
      <button
        type="button"
        className="flex-1 p-3 bg-gray-500 text-white rounded-lg font-medium hover:bg-gray-600 transition-colors"
        onClick={() => {
          window.location.href = "/home";
        }}
      >
        Cancelar
      </button>
    </div>
  );
};

export default FormButtons;
