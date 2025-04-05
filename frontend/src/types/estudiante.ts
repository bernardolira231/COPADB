export interface EstudiantePersonalInfo {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  email: string;
  tipoSangre: string;
  alergias: string;
}

export interface EstudianteAcademicInfo {
  beca: boolean;
  capilla: string;
  campusEscolar: string;
}

export interface EstudianteFamilyInfo {
  tutorNombre: string;
  tutorApellidoPaterno: string;
  tutorApellidoMaterno: string;
  telefono: string;
  emailTutor: string;
  telefonoEmergencia: string;
}

export interface EstudianteAdditionalInfo {
  permiso: string;
  fechaRegistro: string;
}
