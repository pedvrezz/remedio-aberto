"use client";

import type { ReactNode, HTMLAttributes, ForwardRefExoticComponent, Ref } from "react";
import { useEffect, useCallback } from "react";

export interface DialogProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const sizeClasses: Record<NonNullable<DialogProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
};

export const Dialog = ({
  open,
  onClose,
  title,
  description,
  children,
  size = "md",
  className = "",
  ...props
}: DialogProps) => {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="dialog-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "dialog-title" : undefined}
      aria-describedby={description ? "dialog-description" : undefined}
      {...props}
    >
      <div
        className={`dialog ${sizeClasses[size]} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <header className="dialog-header">
            {title && (
              <h2 id="dialog-title" className="dialog-title">
                {title}
              </h2>
            )}
            {description && (
              <p id="dialog-description" className="visually-hidden">
                {description}
              </p>
            )}
            <button
              type="button"
              className="dialog-close"
              onClick={onClose}
              aria-label="Fechar diálogo"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </header>
        )}
        <div className="dialog-content" role="document">
          {children}
        </div>
      </div>
    </div>
  );
};

Dialog.displayName = "Dialog";

export default Dialog as ForwardRefExoticComponent<DialogProps>;