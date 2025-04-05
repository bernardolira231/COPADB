import React from 'react';
import FormInput from '../../../components/Form/FormInput';
import FormTextArea from '../../../components/Form/FormTextArea';
import FormSelect from '../../../components/Form/FormSelect';
import { EstudiantePersonalInfo } from '../../../types/estudiante';

interface PersonalInfoSectionProps {
  personalInfo: EstudiantePersonalInfo;
  updatePersonalInfo: (field: keyof EstudiantePersonalInfo, value: string) => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  personalInfo,
  updatePersonalInfo,
}) => {
  const tiposSangre = [
    { value: '', label: 'Selecciona un tipo de sangre' },
    { value: 'A+', label: 'A+' },
    { value: 'A-', label: 'A-' },
    { value: 'B+', label: 'B+' },
    { value: 'B-', label: 'B-' },
    { value: 'AB+', label: 'AB+' },
    { value: 'AB-', label: 'AB-' },
    { value: 'O+', label: 'O+' },
    { value: 'O-', label: 'O-' },
  ];

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
          label="Correo Electrónico"
          type="email"
          value={personalInfo.email}
          onChange={(e) => updatePersonalInfo('email', e.target.value)}
        />
        <FormSelect
          label="Tipo de Sangre"
          value={personalInfo.tipoSangre}
          onChange={(e) => updatePersonalInfo('tipoSangre', e.target.value)}
          options={tiposSangre}
          required
        />
        <FormTextArea
          label="Alergias"
          value={personalInfo.alergias}
          onChange={(e) => updatePersonalInfo('alergias', e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default PersonalInfoSection;
