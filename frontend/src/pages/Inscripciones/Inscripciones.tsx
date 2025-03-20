import React from 'react';
import useInscripcionesForm from '../../hooks/useInscripciones'; // Ajusta la ruta según tu estructura

const Inscripciones = () => {
  const {
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
  } = useInscripcionesForm();

  return (
    <div className="bg-layout-bg min-h-screen p-6">
      <header className="bg-white shadow-md p-4 rounded-lg mb-6">
        <h1 className="text-primary text-2xl font-bold">Inscripciones</h1>
      </header>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <section className="mb-6">
          <h2 className="text-primary text-xl font-semibold mb-2">Información Personal</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-secondary">Nombre <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-secondary">Apellido Paterno <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={apellidoPaterno}
                onChange={(e) => setApellidoPaterno(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-secondary">Apellido Materno <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={apellidoMaterno}
                onChange={(e) => setApellidoMaterno(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-secondary">Correo Electrónico</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
              />
            </div>
            <div>
            <label className="block text-secondary">
                Tipo de Sangre <span className="text-red-500">*</span>
            </label>
            <select
                value={tipoSangre}
                onChange={(e) => setTipoSangre(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
            >
                <option value="">Selecciona un tipo de sangre</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
            </select>
            </div>
            <div>
              <label className="block text-secondary">Alergias <span className="text-red-500">*</span></label>
              <textarea
                value={alergias}
                onChange={(e) => setAlergias(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-primary text-xl font-semibold mb-2">Información Académica</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-secondary">Beca <span className="text-red-500">*</span></label>
              <select
                value={beca ? 'true' : 'false'}
                onChange={(e) => setBeca(e.target.value === 'true')}
                className="w-full p-2 border border-border-color rounded-lg"
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div>
              <label className="block text-secondary">Capilla <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={capilla}
                onChange={(e) => setCapilla(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
              />
            </div>
            <div>
              <label className="block text-secondary">Campus Escolar <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={campusEscolar}
                onChange={(e) => setCampusEscolar(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-primary text-xl font-semibold mb-2">Información Familiar</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-secondary">Nombre del Tutor <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={tutorNombre}
                onChange={(e) => setTutorNombre(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-secondary">Apellido Paterno del Tutor <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={tutorApellidoPaterno}
                onChange={(e) => setTutorApellidoPaterno(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-secondary">Apellido Materno del Tutor <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={tutorApellidoMaterno}
                onChange={(e) => setTutorApellidoMaterno(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
            <label className="block text-secondary">
                Número de Teléfono <span className="text-red-500">*</span>
            </label>
            <input
                type="tel"
                inputMode="numeric"
                value={telefono}
                onChange={(e) => {
                const numericValue = e.target.value.replace(/\D/g, '');
                setTelefono(numericValue);
                }}
                className="w-full p-2 border border-border-color rounded-lg"
                required
            />
            </div>
            <div>
              <label className="block text-secondary">Correo Electrónico del Tutor <span className="text-red-500">*</span></label>
              <input
                type="email"
                value={emailTutor}
                onChange={(e) => setEmailTutor(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
            <div>
            <label className="block text-secondary">
                Número de Teléfono de Emergencia <span className="text-red-500">*</span>
            </label>
            <input
                type="tel"
                inputMode="numeric"
                value={telefonoEmergencia}
                onChange={(e) => {
                // Elimina cualquier carácter que no sea un número
                const numericValue = e.target.value.replace(/\D/g, '');
                setTelefonoEmergencia(numericValue);
                }}
                className="w-full p-2 border border-border-color rounded-lg"
                required
            />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-primary text-xl font-semibold mb-2">Permisos</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-secondary">Permiso <span className="text-red-500">*</span></label>
              <textarea
                value={permiso}
                onChange={(e) => setPermiso(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
              />
            </div>
          </div>
        </section>

        <section className="mb-6">
          <h2 className="text-primary text-xl font-semibold mb-2">Fecha de Registro</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-secondary">Fecha de Registro <span className="text-red-500">*</span></label>
              <input
                type="date"
                value={fechaRegistro}
                onChange={(e) => setFechaRegistro(e.target.value)}
                className="w-full p-2 border border-border-color rounded-lg"
                required
              />
            </div>
          </div>
        </section>

        <footer className="mt-6">
          <button
            type="submit"
            disabled={!isFormValid()}
            className={`w-full p-2 text-white rounded-lg transition-colors ${
              isFormValid()
                ? 'bg-secondary hover:bg-primary'
                : 'bg-gray-400 cursor-not-allowed'
            }`}
          >
            Registrar Alumno
          </button>
        </footer>
      </form>

      <footer className="mt-6">
        <button
          className="w-full p-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          onClick={() => {
            window.location.href = '/home';
          }}
        >
          Volver a la página principal
        </button>
      </footer>
    </div>
  );
};

export default Inscripciones;