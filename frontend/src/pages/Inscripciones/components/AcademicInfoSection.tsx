import React from "react";
import FormInput from "../../../components/Form/FormInput";
import FormSelect from "../../../components/Form/FormSelect";
import { EstudianteAcademicInfo } from "../../../types/estudiante";

interface AcademicInfoSectionProps {
  academicInfo: EstudianteAcademicInfo;
  updateAcademicInfo: (field: keyof EstudianteAcademicInfo, value: any) => void;
}

const AcademicInfoSection: React.FC<AcademicInfoSectionProps> = ({
  academicInfo,
  updateAcademicInfo,
}) => {
  const becaOptions = [
    { value: "true", label: "Sí" },
    { value: "false", label: "No" },
  ];

  return (
    <section className="mb-6">
      <h2 className="text-primary text-xl font-semibold mb-2">
        Información Académica
      </h2>
      <div className="space-y-4">
        <FormSelect
          label="Beca"
          value={academicInfo.beca ? "true" : "false"}
          onChange={(e) =>
            updateAcademicInfo("beca", e.target.value === "true")
          }
          options={becaOptions}
          required
        />
        <FormInput
          label="Capilla"
          value={academicInfo.capilla}
          onChange={(e) => updateAcademicInfo("capilla", e.target.value)}
          required
        />
        <FormInput
          label="Campus Escolar"
          value={academicInfo.campusEscolar}
          onChange={(e) => updateAcademicInfo("campusEscolar", e.target.value)}
          required
        />
      </div>
    </section>
  );
};

export default AcademicInfoSection;
