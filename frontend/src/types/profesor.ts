export interface Profesor {
  id: number;
  name: string;
  lastname_f: string;
  lastname_m: string;
  email: string;
  password?: string; // Opcional en la interfaz para no mostrarlo en la UI
  rol: number;
  profesor_type?: string; // Nuevo campo según la estructura de la BD
}

export interface ProfesorCreate extends Omit<Profesor, 'id'> {
  password: string; // Requerido al crear
}
