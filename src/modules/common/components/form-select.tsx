import React from "react";
import { useField } from "formik";

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
  value?: string | number;
  onChange?: (value: string | number) => void;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  name,
  options,
  placeholder = "Select an option",
  disabled = false,
  className,
  // optionBadge,
  value,
  onChange,
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;

    // Find the original option to get the correct type (number vs string) if needed
    // although html select always returns string, we try to match the original value type if possible
    // or just stick to string as per FormSelect logic which normalized to string somewhat but stored original value.
    const selectedOption = options.find(
      (opt) => opt.value.toString() === newValue
    );

    const valueToSet = selectedOption ? selectedOption.value : newValue;

    helpers.setValue(valueToSet);

    if (onChange) {
      onChange(valueToSet);
    }
  };

  const hasError = meta.touched && meta.error;

  return (
    <div className={`form-control w-full ${className || ""}`}>
      <label htmlFor={name} className="label">
        <span className="label-text font-medium">{label}</span>
      </label>
      <select
        id={name}
        className={`select select-bordered w-full rounded-lg ${
          hasError ? "select-error" : ""
        }`}
        value={field.value ?? value}
        onChange={handleChange}
        disabled={disabled}
        onBlur={field.onBlur} // Important for Formik touched state
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value.toString()}>
            {/* Note: optionBadge cannot be rendered effectively inside a native option tag */}
            {opt.label}
          </option>
        ))}
      </select>
      {hasError && (
        <div className="label">
          <span className="label-text-alt text-error">{meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
