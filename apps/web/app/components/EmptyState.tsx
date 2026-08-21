"use client";

import type { ReactNode, HTMLAttributes, ForwardRefExoticComponent, Ref } from "react";
import { forwardRef } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "no-dataset" | "no-results" | "error";
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

type EmptyStateVariant = NonNullable<EmptyStateProps["variant"]>;

const variantIcons: Record<EmptyStateVariant, string> = {
  "no-dataset": "database",
  "no-results": "search",
  error: "alert-triangle",
};

const variantTitles: Record<EmptyStateVariant, string> = {
  "no-dataset": "Nenhum dataset importado",
  "no-results": "Nenhum resultado encontrado",
  error: "Erro ao carregar dados",
};

const variantDescriptions: Record<EmptyStateVariant, string> = {
  "no-dataset": "A aplicação ainda não possui dados importados. Use a área técnica para importar a primeira fonte oficial.",
  "no-results": "Sua busca não retornou resultados. Tente termos diferentes ou verifique a ortografia.",
  error: "Ocorreu um problema ao carregar os dados. Tente novamente ou verifique a conexão com a API.",
}

function EmptyStateIcon({ variant }: { variant: EmptyStateVariant }) {
  // Simple SVG icons inline to avoid external dependencies
  const icons: Record<EmptyStateVariant, React.ReactElement> = {
    "no-dataset": (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    ),
    "no-results": (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    error: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  };

  return icons[variant] || icons["no-dataset"];
}

const EmptyStateComponent = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      variant = "no-dataset",
      title,
      description,
      action,
      icon,
      className = "",
      ...props
  }: EmptyStateProps,
  ref: Ref<HTMLDivElement>
) => {
  const resolvedVariant: EmptyStateVariant = variant;
  const displayTitle = title || variantTitles[resolvedVariant];
  const displayDescription = description || variantDescriptions[resolvedVariant];
  const displayIcon = icon || <EmptyStateIcon variant={resolvedVariant} />;

  return (
    <div
      ref={ref}
      className={`empty-state ${className}`}
      role="status"
      aria-live="polite"
      {...props}
    >
      <div className="empty-state-icon" aria-hidden="true">
        {displayIcon}
      </div>
      <div>
        <h2 className="empty-state-title">{displayTitle}</h2>
        {displayDescription && (
          <p className="empty-state-description">{displayDescription}</p>
        )}
        {action && (
          <div className="empty-state-action">
            {action}
          </div>
        )}
      </div>
    </div>
  );
});

EmptyStateComponent.displayName = "EmptyState";

export const EmptyState = EmptyStateComponent as ForwardRefExoticComponent<EmptyStateProps>;

export default EmptyState;