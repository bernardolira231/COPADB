import React from 'react';
import FormInput from '../../../components/Form/FormInput';
import { EstudianteAdditionalInfo } from '../../../types/estudiante';

interface RegistrationDateSectionProps {
  fechaRegistro: string;
  setFechaRegistro: (value: string) => void;
}

const RegistrationDateSection: React.FC<RegistrationDateSectionProps> = ({
  fechaRegistro,
  setFechaRegistro,
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">
        Fecha de Registro
      </h2>
      <div className="space-y-4">
        <FormInput
          label="Fecha de Registro"
          type="date"
          value={fechaRegistro}
          onChange={(e) => setFechaRegistro(e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default RegistrationDateSection;
