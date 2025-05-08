import React from 'react';
import FormInput from '../../../components/Form/FormInput';
import FormTextArea from '../../../components/Form/FormTextArea';
import { ProfesorPersonalInfo } from '../../../types/profesor';

interface UsersSectionProps {
  personalInfo: ProfesorPersonalInfo;
  updatePersonalInfo: (field: keyof ProfesorPersonalInfo, value: string) => void;
}

const UsersSection: React.FC<UsersSectionProps> = ({
  personalInfo,
  updatePersonalInfo,
}) => {

  return (
    <section className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">
        Información Personal
      </h2>
      <div className="space-y-4">
        <FormInput
          label="Nombre"
          value={personalInfo.nombre}
          onChange={(e) => updatePersonalInfo('nombre', e.target.value)}
          required
        />
        <FormInput
          label="Apellido Paterno"
          value={personalInfo.apellidoPaterno}
          onChange={(e) => updatePersonalInfo('apellidoPaterno', e.target.value)}
          required
        />
        <FormInput
          label="Apellido Materno"
          value={personalInfo.apellidoMaterno}
          onChange={(e) => updatePersonalInfo('apellidoMaterno', e.target.value)}
          required
        />
        <FormInput
          label="Email"
          type='email'
          value={personalInfo.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
          required
        />
        <FormInput
          label="Contraseña"
          type="password"
          value={personalInfo.contrasena}
          onChange={(e) => updatePersonalInfo('contrasena', e.target.value)}
          required
          />
        <FormTextArea
          label="Rol"
          value={personalInfo.rol}
          onChange={(e) => updatePersonalInfo('rol', e.target.value)}
          required
        />
        <FormTextArea
          label="Tipo de Profesor"
          value={personalInfo.tipo_profesor}
          onChange={(e) => updatePersonalInfo('tipo_profesor', e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default UsersSection;
