import React from 'react';
import { useField } from 'formik';
import { Label } from './ui/label';

interface FormDatePickerProps {
  label: string;
  name: string;
  disabled?: boolean;
}

const FormDatePicker: React.FC<FormDatePickerProps> = ({
  label,
  name,
  disabled = false,
}) => {
  const [field, meta] = useField(name);

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <input
        {...field}
        id={name}
        disabled={disabled}
        type="date"
        className={`input input-ghost w-full
          ${
            meta.touched && meta.error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
          }
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
        `}
      />
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default FormDatePicker;
