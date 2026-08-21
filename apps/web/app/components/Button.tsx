"use client";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, Ref } from "react";
import { forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const baseClasses = "btn";

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  ghost: "btn-ghost",
  destructive: "btn-destructive",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "btn-sm",
  md: "",
  lg: "btn-lg",
};

const ButtonComponent = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      className = "",
      ...props
  }: ButtonProps,
  ref: Ref<HTMLButtonElement>
) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span
          className="btn-spinner"
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "1em",
            height: "1em",
            border: "2px solid currentColor",
            borderRightColor: "transparent",
            borderRadius: "50%",
            animation: "spin 0.6s linear infinite",
          }}
        >
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
            @media (prefers-reduced-motion: reduce) {
              .btn-spinner { animation: none; border-color: currentColor; }
            }
          `}</style>
        </span>
      )}
      <span style={{ opacity: loading ? 0.7 : 1 }}>{children}</span>
    </button>
  );
});

ButtonComponent.displayName = "Button";

export const Button = ButtonComponent as ForwardRefExoticComponent<ButtonProps>;

export default Button;