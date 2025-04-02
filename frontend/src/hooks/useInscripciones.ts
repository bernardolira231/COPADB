import { useState } from 'react';

const useInscripcionesForm = () => {
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [tipoSangre, setTipoSangre] = useState('');
  const [alergias, setAlergias] = useState('');
  const [beca, setBeca] = useState(false);
  const [capilla, setCapilla] = useState('');
  const [campusEscolar, setCampusEscolar] = useState('');
  const [tutorNombre, setTutorNombre] = useState('');
  const [tutorApellidoPaterno, setTutorApellidoPaterno] = useState('');
  const [tutorApellidoMaterno, setTutorApellidoMaterno] = useState('');
  const [telefono, setTelefono] = useState('');
  const [emailTutor, setEmailTutor] = useState('');
  const [telefonoEmergencia, setTelefonoEmergencia] = useState('');
  const [permiso, setPermiso] = useState('');
  const [fechaRegistro, setFechaRegistro] = useState('');

  const isFormValid = () => {
    return (
      nombre.trim() !== '' &&
      apellidoPaterno.trim() !== '' &&
      apellidoMaterno.trim() !== '' &&
      tipoSangre.trim() !== '' &&
      tutorNombre.trim() !== '' &&
      tutorApellidoPaterno.trim() !== '' &&
      tutorApellidoMaterno.trim() !== '' &&
      telefono.trim() !== '' &&
      emailTutor.trim() !== '' &&
      telefonoEmergencia.trim() !== '' &&
      fechaRegistro.trim() !== ''
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    const estudianteData = {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      email,
      tipoSangre,
      alergias,
      beca,
      capilla,
      campusEscolar,
      tutorNombre,
      tutorApellidoPaterno,
      tutorApellidoMaterno,
      telefono,
      emailTutor,
      telefonoEmergencia,
      permiso,
      fechaRegistro,
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
      } else {
        alert("❌ Error al registrar: " + result.message);
        console.error(result.error);
      }
    } catch (error) {
      console.error("Error al enviar solicitud:", error);
      alert("Error de red al enviar el formulario.");
    }
  };

  // ⬇️⬇️⬇️ Esto es lo que te faltaba ⬇️⬇️⬇️
  return {
    nombre,
    setNombre,
    apellidoPaterno,
    setApellidoPaterno,
    apellidoMaterno,
    setApellidoMaterno,
    email,
    setEmail,
    tipoSangre,
    setTipoSangre,
    alergias,
    setAlergias,
    beca,
    setBeca,
    capilla,
    setCapilla,
    campusEscolar,
    setCampusEscolar,
    tutorNombre,
    setTutorNombre,
    tutorApellidoPaterno,
    setTutorApellidoPaterno,
    tutorApellidoMaterno,
    setTutorApellidoMaterno,
    telefono,
    setTelefono,
    emailTutor,
    setEmailTutor,
    telefonoEmergencia,
    setTelefonoEmergencia,
    permiso,
    setPermiso,
    fechaRegistro,
    setFechaRegistro,
    handleSubmit,
    isFormValid,
  };
};

export default useInscripcionesForm;
