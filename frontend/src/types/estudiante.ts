export interface EstudiantePersonalInfo {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  genero: string;
  email: string;
  curp: string;
  tipoSangre: string;
  alergias: string;
  fechaNacimiento: string;
}

export interface EstudianteAcademicInfo {
  beca: boolean;
  capilla: string;
  campusEscolar: string;
  cpdb_register: string;
  sep_register: string;
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

export interface Tutor {
  id: number;
  tutor_name: string;
  tutor_lastname_f: string;
  tutor_lastname_m: string;
  phone_number: string;
  email_address: string;
  emergency_phone_number: string;
}

export interface GrupoEstudiante {
  group_id: number;
  grade: string;
  class_name: string;
  display_name: string;
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
  birth_date?: string;
  gender?: string;
  cpdb_register?: string;
  sep_register?: string;
  curp?: string;
  group_id?: string | number;
  group_grade?: string;
  class_name?: string;
  all_groups?: GrupoEstudiante[];
}
