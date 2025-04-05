import React from 'react';

interface FormTextAreaProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  className?: string;
}

const FormTextArea: React.FC<FormTextAreaProps> = ({
  label,
  value,
  onChange,
  required = false,
  className = '',
}) => {
  return (
    <div>
      <label className="block text-secondary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        className={`w-full p-2 border border-border-color rounded-lg ${className}`}
        required={required}
      />
    </div>
  );
};

export default FormTextArea;
