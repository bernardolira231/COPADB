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

export interface Estudiante {
  id: number;
  name: string;
  lastname_f: string;
  lastname_m: string;
  email: string;
  blood_type: string;
  allergies: string;
  scholar_ship: boolean;
  chapel: string;
  school_campus: string;
  family_id: number;
  permission: string;
  reg_date: string;
  created_at?: string;
  updated_at?: string;
}
