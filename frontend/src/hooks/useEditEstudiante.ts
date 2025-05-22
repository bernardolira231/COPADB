import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  EstudiantePersonalInfo,
  EstudianteAcademicInfo,
  EstudianteFamilyInfo,
  EstudianteAdditionalInfo,
  Estudiante,
} from "../types/estudiante";

interface UseEditEstudianteProps {
  estudianteId?: number;
  initialData?: Estudiante;
}

const useEditEstudiante = ({
  estudianteId,
  initialData,
}: UseEditEstudianteProps = {}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(!!estudianteId || !!initialData);

  // Valores iniciales para cada grupo de estados
  const initialPersonalInfo: EstudiantePersonalInfo = {
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    email: "",
    genero: "",
    tipoSangre: "",
    fechaNacimiento: "",
    alergias: "",
    curp: "",
  };

  const initialAcademicInfo: EstudianteAcademicInfo = {
    beca: false,
    sep_register: "",
    cpdb_register: "",
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

  const [personalInfo, setPersonalInfo] =
    useState<EstudiantePersonalInfo>(initialPersonalInfo);
  const [academicInfo, setAcademicInfo] =
    useState<EstudianteAcademicInfo>(initialAcademicInfo);
  const [familyInfo, setFamilyInfo] =
    useState<EstudianteFamilyInfo>(initialFamilyInfo);
  const [additionalInfo, setAdditionalInfo] =
    useState<EstudianteAdditionalInfo>(initialAdditionalInfo);

  // Cargar datos del estudiante si estamos en modo edición
  useEffect(() => {
    const loadEstudianteData = async () => {
      if (initialData) {
        // Si tenemos datos iniciales, los usamos directamente
        mapEstudianteToForm(initialData);
        return;
      }

      if (!estudianteId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5328/estudiantes/${estudianteId}`
        );

        if (!response.ok) {
          throw new Error(
            `Error al cargar los datos del estudiante (${response.status})`
          );
        }

        const data = await response.json();
        mapEstudianteToForm(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar los datos"
        );
        console.error("Error al cargar datos del estudiante:", err);
      } finally {
        setLoading(false);
      }
    };

    if (isEditMode) {
      loadEstudianteData();
    }
  }, [estudianteId, initialData, isEditMode]);

  // Mapear datos del estudiante al formato del formulario
  const mapEstudianteToForm = (estudiante: Estudiante) => {
    // Mapear datos personales
    setPersonalInfo({
      nombre: estudiante.name || "",
      apellidoPaterno: estudiante.lastname_f || "",
      apellidoMaterno: estudiante.lastname_m || "",
      email: estudiante.email || "",
      curp: estudiante.curp || "",
      genero: estudiante.gender || "",
      tipoSangre: estudiante.blood_type || "",
      fechaNacimiento: estudiante.birth_date || "",
      alergias: estudiante.allergies || "",
    });

    // Mapear datos académicos
    setAcademicInfo({
      beca: estudiante.scholar_ship || false,
      capilla: estudiante.chapel || "",
      campusEscolar: estudiante.school_campus || "",
      sep_register: estudiante.sep_register || "",
      cpdb_register: estudiante.cpdb_register || "",
    });

    // Datos adicionales
    setAdditionalInfo({
      permiso: estudiante.permission || "",
      fechaRegistro: estudiante.reg_date || "",
    });

    // Nota: Los datos familiares no están disponibles directamente en el modelo Estudiante
    // Idealmente, deberíamos cargarlos por separado si es necesario
  };

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
      personalInfo.email.trim() !== "" &&
      personalInfo.tipoSangre.trim() !== ""
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const estudianteData = {
      name: personalInfo.nombre,
      lastname_f: personalInfo.apellidoPaterno,
      lastname_m: personalInfo.apellidoMaterno,
      email: personalInfo.email,
      blood_type: personalInfo.tipoSangre,
      allergies: personalInfo.alergias,
      scholar_ship: academicInfo.beca,
      chapel: academicInfo.capilla,
      school_campus: academicInfo.campusEscolar,
      permission: additionalInfo.permiso,
      reg_date: additionalInfo.fechaRegistro,
    };

    setLoading(true);
    setError(null);

    try {
      const url = isEditMode
        ? `http://localhost:5328/estudiantes/${estudianteId}`
        : "http://localhost:5328/estudiantes";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(estudianteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error ${response.status}`);
      }

      // Éxito
      alert(
        isEditMode
          ? "✅ Estudiante actualizado correctamente"
          : "✅ Estudiante registrado correctamente"
      );
      navigate({ to: "/alumnos" });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Error desconocido al guardar los datos"
      );
      console.error("Error al guardar estudiante:", err);
      alert(
        `❌ Error: ${err instanceof Error ? err.message : "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return {
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
    resetForm,

    handleSubmit,
    isFormValid,
  };
};

export default useEditEstudiante;
