import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  EstudiantePersonalInfo,
  EstudianteAcademicInfo,
  EstudianteFamilyInfo,
  EstudianteAdditionalInfo
} from "../types/estudiante";

const useInscripcionesForm = () => {
  const navigate = useNavigate();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Valores iniciales para cada grupo de estados
  const initialPersonalInfo: EstudiantePersonalInfo = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    tipoSangre: "",
    alergias: "",
    fechaNacimiento: "",
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

    // Crear un objeto con los datos del estudiante, mapeando los nombres de campos al formato esperado por la API
    const estudianteData = {
      // Mapear datos personales
      nombre: personalInfo.nombre,
      apellidoPaterno: personalInfo.apellidoPaterno,
      apellidoMaterno: personalInfo.apellidoMaterno,
      email: personalInfo.email,
      tipoSangre: personalInfo.tipoSangre,
      alergias: personalInfo.alergias,
      birth_date: personalInfo.fechaNacimiento, // Nuevo campo de fecha de nacimiento
      
      // Mapear datos académicos
      beca: academicInfo.beca,
      capilla: academicInfo.capilla,
      campusEscolar: academicInfo.campusEscolar,
      
      // Mapear datos familiares
      tutorNombre: familyInfo.tutorNombre,
      tutorApellidoPaterno: familyInfo.tutorApellidoPaterno,
      tutorApellidoMaterno: familyInfo.tutorApellidoMaterno,
      telefono: familyInfo.telefono,
      emailTutor: familyInfo.emailTutor,
      telefonoEmergencia: familyInfo.telefonoEmergencia,
      
      // Mapear datos adicionales
      permiso: additionalInfo.permiso,
      fechaRegistro: additionalInfo.fechaRegistro,
    };

    setLoading(true);

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
        // Mostrar modal de éxito en lugar de alert
        setIsSuccessModalOpen(true);
        resetForm();
      } else {
        alert("❌ Error al registrar: " + result.message);
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("Error de red al enviar el formulario.");
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar el modal y redirigir
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // Redirigir a la lista de estudiantes
    navigate({ to: "/alumnos" });
  };

  // Función para cancelar y volver a la lista
  const handleCancel = () => {
    navigate({ to: "/alumnos" });
  };

  return {
    personalInfo,
    academicInfo,
    familyInfo,
    additionalInfo,
    loading,
    isSuccessModalOpen,

    updatePersonalInfo,
    updateAcademicInfo,
    updateFamilyInfo,
    updateAdditionalInfo,
    resetForm,

    handleSubmit,
    isFormValid,
    handleCancel,
    handleCloseSuccessModal
  };
};

export default useInscripcionesForm;
