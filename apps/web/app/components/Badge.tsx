"use client";

import type { HTMLAttributes, ForwardRefExoticComponent, Ref } from "react";
import { forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "neutral" | "brand";
}

const variantClasses: Record<NonNullable<BadgeProps["variant"]>, string> = {
  success: "badge-success",
  warning: "badge-warning",
  error: "badge-error",
  neutral: "badge-neutral",
  brand: "badge-brand",
};

const BadgeComponent = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      children,
      variant = "neutral",
      className = "",
      ...props
  }: BadgeProps,
  ref: Ref<HTMLSpanElement>
) => {
  return (
    <span
      ref={ref}
      className={`badge ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
});

BadgeComponent.displayName = "Badge";

export const Badge = BadgeComponent as ForwardRefExoticComponent<BadgeProps>;

export default Badge;