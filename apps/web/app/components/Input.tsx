"use client";

import type { InputHTMLAttributes, ForwardRefExoticComponent, Ref } from "react";
import { useId } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
}

export const Input = (
  {
    label,
    hint,
    error,
    className = "",
    id,
    ...props
  }: InputProps,
  ref: Ref<HTMLInputElement>
) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`input-wrapper ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={`input ${error ? "input-error" : ""}`}
        aria-describedby={describedBy}
        aria-invalid={error ? "true" : "false"}
        {...props}
      />
      {error && (
        <p id={errorId} className="input-error-message" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={hintId} className="input-hint">
          {hint}
        </p>
      )}
    </div>
  );
};

Input.displayName = "Input";

export default Input as ForwardRefExoticComponent<InputProps>;