import React from 'react';
import FormInput from '../../../components/Form/FormInput';
import { EstudianteFamilyInfo } from '../../../types/estudiante';

interface FamilyInfoSectionProps {
  familyInfo: EstudianteFamilyInfo;
  updateFamilyInfo: (field: keyof EstudianteFamilyInfo, value: string) => void;
}

const FamilyInfoSection: React.FC<FamilyInfoSectionProps> = ({
  familyInfo,
  updateFamilyInfo,
}) => {
  const handlePhoneChange = (field: keyof EstudianteFamilyInfo, value: string) => {
    const numericValue = value.replace(/\D/g, "");
    updateFamilyInfo(field, numericValue);
  };

  return (
    <section className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">
        Información Familiar
      </h2>
      <div className="space-y-4">
        <FormInput
          label="Nombre del Tutor"
          value={familyInfo.tutorNombre}
          onChange={(e) => updateFamilyInfo('tutorNombre', e.target.value)}
          required
        />
        <FormInput
          label="Apellido Paterno del Tutor"
          value={familyInfo.tutorApellidoPaterno}
          onChange={(e) => updateFamilyInfo('tutorApellidoPaterno', e.target.value)}
          required
        />
        <FormInput
          label="Apellido Materno del Tutor"
          value={familyInfo.tutorApellidoMaterno}
          onChange={(e) => updateFamilyInfo('tutorApellidoMaterno', e.target.value)}
          required
        />
        <FormInput
          label="Número de Teléfono"
          type="tel"
          inputMode="numeric"
          value={familyInfo.telefono}
          onChange={(e) => handlePhoneChange('telefono', e.target.value)}
          required
        />
        <FormInput
          label="Correo Electrónico del Tutor"
          type="email"
          value={familyInfo.emailTutor}
          onChange={(e) => updateFamilyInfo('emailTutor', e.target.value)}
          required
        />
        <FormInput
          label="Número de Teléfono de Emergencia"
          type="tel"
          inputMode="numeric"
          value={familyInfo.telefonoEmergencia}
          onChange={(e) => handlePhoneChange('telefonoEmergencia', e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default FamilyInfoSection;
