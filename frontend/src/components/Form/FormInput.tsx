import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  className?: string;
  inputMode?: 'text' | 'numeric' | 'tel' | 'email' | 'url' | 'search' | 'none';
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  className = '',
  inputMode,
}) => {
  return (
    <div>
      <label className="block text-secondary">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full p-2 border border-border-color rounded-lg ${className}`}
        required={required}
        inputMode={inputMode}
      />
    </div>
  );
};

export default FormInput;
