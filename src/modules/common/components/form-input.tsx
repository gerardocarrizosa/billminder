import React from 'react';
import { useField } from 'formik';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder = '',
  disabled = false,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`${
          meta.touched && meta.error
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
            : ''
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default FormInput;
