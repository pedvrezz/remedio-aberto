"use client";

import type { FormEvent, KeyboardEvent, ChangeEvent } from "react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export interface MainSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  hasData?: boolean;
}

export function MainSearch({
  onSearch,
  placeholder = "Buscar medicamento, princípio ativo, laboratório, registro ou apresentação...",
  disabled = false,
  hasData = false,
}: MainSearchProps) {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = query.trim();
      if (trimmed) {
        onSearch(trimmed);
        setSubmitted(true);
      }
    },
    [query, onSearch]
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSubmitted(false);
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        const trimmed = query.trim();
        if (trimmed) {
          onSearch(trimmed);
          setSubmitted(true);
        }
      }
    },
    [query, onSearch]
  );

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="main-search" role="search" aria-label="Busca principal">
      <form className="main-search-form" onSubmit={handleSubmit}>
        <div className="main-search-input-wrapper">
          <input
            ref={inputRef}
            type="search"
            className="main-search-input"
            placeholder={placeholder}
            value={query}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            spellCheck={false}
            aria-label="Termo de busca"
          />
        </div>
        <button
          type="submit"
          className="main-search-submit"
          disabled={disabled || !query.trim()}
          aria-label="Executar busca"
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
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </form>
      <p className="main-search-hint">
        Pressione <kbd>Ctrl</kbd>+<kbd>K</kbd> para busca global
      </p>
      {submitted && !hasData && (
        <EmptyState
          variant="no-dataset"
          title="Nenhum dataset importado"
          description="A aplicação ainda não possui dados importados. A busca ficará disponível após a importação da primeira fonte oficial na área técnica."
        />
      )}
      {submitted && hasData && query.trim() && (
        <EmptyState
          variant="no-results"
          title="Nenhum resultado encontrado"
          description={`Nenhum resultado para "${query}". Tente termos diferentes.`}
        />
      )}
    </div>
  );
}

export default MainSearch;