import React from 'react';
import { useField } from 'formik';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

interface Option {
  label: string;
  value: string | number;
  color?: string;
}

interface FormSelectProps {
  label: string;
  name: string;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  optionBadge?: boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  placeholder = 'Select an option',
  disabled = false,
  className,
  optionBadge,
}) => {
  const [field, meta, helpers] = useField(name);

  const stringValue =
    field.value !== null && field.value !== undefined
      ? field.value.toString()
      : '';

  const handleValueChange = (newValue: string) => {
    const selectedOption = options.find(
      (opt) => opt.value.toString() === newValue
    );

    if (selectedOption) {
      helpers.setValue(selectedOption.value);
    } else {
      helpers.setValue(newValue);
    }
  };

  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={name} className="block text-sm font-medium mb-1">
        {label}
      </Label>
      <Select
        value={stringValue}
        onValueChange={handleValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={name}
          className={`w-full ${
            meta.touched && meta.error ? 'border-red-500' : ''
          }`}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value.toString()}>
              {optionBadge && (
                <Badge style={{ backgroundColor: opt.color }}></Badge>
              )}
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {meta.touched && meta.error && (
        <p className="text-sm text-red-500 mt-1">{meta.error}</p>
      )}
    </div>
  );
};

export default FormSelect;
