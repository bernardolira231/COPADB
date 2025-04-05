import { useState } from "react";
import {
  EstudiantePersonalInfo,
  EstudianteAcademicInfo,
  EstudianteFamilyInfo,
  EstudianteAdditionalInfo
} from "../types/estudiante";

const useInscripcionesForm = () => {
  // Valores iniciales para cada grupo de estados
  const initialPersonalInfo: EstudiantePersonalInfo = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    tipoSangre: "",
    alergias: "",
  };

  const initialAcademicInfo: EstudianteAcademicInfo = {
    beca: false,
    capilla: "",
    campusEscolar: "",
  };

  const initialFamilyInfo: EstudianteFamilyInfo = {
    tutorNombre: "",
    tutorApellidoPaterno: "",
    tutorApellidoMaterno: "",
    telefono: "",
    emailTutor: "",
    telefonoEmergencia: "",
  };

  const initialAdditionalInfo: EstudianteAdditionalInfo = {
    permiso: "",
    fechaRegistro: "",
  };

  const [personalInfo, setPersonalInfo] = useState<EstudiantePersonalInfo>(initialPersonalInfo);
  const [academicInfo, setAcademicInfo] = useState<EstudianteAcademicInfo>(initialAcademicInfo);
  const [familyInfo, setFamilyInfo] = useState<EstudianteFamilyInfo>(initialFamilyInfo);
  const [additionalInfo, setAdditionalInfo] = useState<EstudianteAdditionalInfo>(initialAdditionalInfo);

  const updatePersonalInfo = (
    field: keyof EstudiantePersonalInfo,
    value: string
  ) => {
    setPersonalInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateAcademicInfo = (
    field: keyof EstudianteAcademicInfo,
    value: any
  ) => {
    setAcademicInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateFamilyInfo = (
    field: keyof EstudianteFamilyInfo,
    value: string
  ) => {
    setFamilyInfo((prev) => ({ ...prev, [field]: value }));
  };

  const updateAdditionalInfo = (
    field: keyof EstudianteAdditionalInfo,
    value: string
  ) => {
    setAdditionalInfo((prev) => ({ ...prev, [field]: value }));
  };

  // Función para reiniciar todos los campos del formulario
  const resetForm = () => {
    setPersonalInfo(initialPersonalInfo);
    setAcademicInfo(initialAcademicInfo);
    setFamilyInfo(initialFamilyInfo);
    setAdditionalInfo(initialAdditionalInfo);
  };

  const isFormValid = () => {
    return (
      personalInfo.nombre.trim() !== "" &&
      personalInfo.apellidoPaterno.trim() !== "" &&
      personalInfo.apellidoMaterno.trim() !== "" &&
      personalInfo.tipoSangre.trim() !== "" &&
      familyInfo.tutorNombre.trim() !== "" &&
      familyInfo.tutorApellidoPaterno.trim() !== "" &&
      familyInfo.tutorApellidoMaterno.trim() !== "" &&
      familyInfo.telefono.trim() !== "" &&
      familyInfo.emailTutor.trim() !== "" &&
      familyInfo.telefonoEmergencia.trim() !== "" &&
      additionalInfo.fechaRegistro.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const estudianteData = {
      ...personalInfo,
      ...academicInfo,
      ...familyInfo,
      ...additionalInfo,
    };

    try {
      const response = await fetch("http://localhost:5328/api/inscripciones", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estudianteData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("✅ Registro exitoso");
        resetForm();
      } else {
        alert("❌ Error al registrar: " + result.message);
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("Error de red al enviar el formulario.");
    }
  };

  return {
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
  };
};

export default useInscripcionesForm;
