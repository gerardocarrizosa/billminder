import React from "react";
import { useField } from "formik";

interface FormInputProps {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = "text",
  placeholder = "",
  disabled = false,
  className,
}) => {
  const [field, meta] = useField(name);

  if (type === "date" && typeof field.value === "object") {
    field.value = field.value.toISOString().split("T")[0];
  }

  const hasError = meta.touched && meta.error;

  return (
    <div className={`form-control w-full ${className || ""}`}>
      <label htmlFor={name} className="label pb-1">
        <span className="label-text font-medium">{label}</span>
      </label>
      <input
        {...field}
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`input input-bordered border w-full rounded-lg ${
          hasError ? "input-error" : ""
        }`}
      />
      {hasError && (
        <div className="label pt-1">
          <span className="label-text-alt text-error">{meta.error}</span>
        </div>
      )}
    </div>
  );
};

export default FormInput;
