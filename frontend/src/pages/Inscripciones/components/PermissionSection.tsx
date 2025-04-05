import React from "react";
import FormTextArea from "../../../components/Form/FormTextArea";
import { EstudianteAdditionalInfo } from "../../../types/estudiante";

interface PermissionSectionProps {
  permiso: string;
  setPermiso: (value: string) => void;
}

const PermissionSection: React.FC<PermissionSectionProps> = ({
  permiso,
  setPermiso,
}) => {
  return (
    <section className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">Permisos</h2>
      <div className="space-y-4">
        <FormTextArea
          label="Permiso"
          value={permiso}
          onChange={(e) => setPermiso(e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default PermissionSection;
