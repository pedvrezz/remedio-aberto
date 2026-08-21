"use client";

import type { KeyboardEvent, ChangeEvent, ReactNode } from "react";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { EmptyState } from "./EmptyState";
import { Badge } from "./Badge";

export interface CommandPaletteItem {
  id: string;
  title: string;
  description?: string;
  badge?: { label: string; variant: "success" | "warning" | "error" | "neutral" | "brand" };
  onSelect: () => void;
  section?: string;
}

export interface CommandPaletteSection {
  title: string;
  items: CommandPaletteItem[];
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  sections: CommandPaletteSection[];
  placeholder?: string;
  hasData?: boolean;
}

const KEYBOARD_SHORTCUT = typeof window !== "undefined" && navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K";

export function CommandPalette({
  open,
  onClose,
  sections,
  placeholder = "Buscar medicamentos, princípios ativos, fabricantes...",
  hasData = false,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [userSelectedIndex, setUserSelectedIndex] = useState(0);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Flatten all items for keyboard navigation - memoized to avoid recalculation
  const allItems = useMemo(() =>
    sections.flatMap((section, sectionIndex) =>
      section.items.map((item, itemIndex) => ({
        ...item,
        sectionIndex,
        itemIndex,
        globalIndex: sections.slice(0, sectionIndex).reduce((acc, s) => acc + s.items.length, 0) + itemIndex,
      }))
    ),
    [sections]
  );

  const filteredItems = useMemo(() =>
    query
      ? allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description?.toLowerCase().includes(query.toLowerCase())
        )
      : allItems,
    [query, allItems]
  );

  // Derived selected index - automatically clamps to valid range
  const selectedIndex = useMemo(() => {
    if (filteredItems.length === 0) return 0;
    return Math.min(userSelectedIndex, filteredItems.length - 1);
  }, [userSelectedIndex, filteredItems.length]);

  // Global key handler for Ctrl+K / Cmd+K - defined before useEffect
  const handleGlobalKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        if (open) {
          onClose();
        }
      }
    },
    [open, onClose]
  );

  // Focus management and global listener
  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleGlobalKeyDown);
      document.body.style.overflow = "hidden";
      // Focus input after render
      setTimeout(() => containerRef.current?.querySelector<HTMLInputElement>("input")?.focus(), 0);
    }
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleGlobalKeyDown]);

  // Handle keyboard navigation within the palette
  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!open) return;

      switch (event.key) {
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        case "ArrowDown":
          event.preventDefault();
          if (filteredItems.length > 0) {
            setUserSelectedIndex((prev) => (prev + 1) % filteredItems.length);
          }
          break;
        case "ArrowUp":
          event.preventDefault();
          if (filteredItems.length > 0) {
            setUserSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
          }
          break;
        case "Enter":
          event.preventDefault();
          if (filteredItems[selectedIndex]) {
            filteredItems[selectedIndex].onSelect();
            onClose();
          }
          break;
        case "Tab":
          // Allow tab to move through items
          break;
        default:
          break;
      }
    },
    [open, onClose, filteredItems, selectedIndex]
  );

  // Scroll selected item into view
  useEffect(() => {
    if (itemsRef.current[selectedIndex]) {
      itemsRef.current[selectedIndex]?.scrollIntoView({ block: "nearest" });
    }
  }, [selectedIndex, filteredItems]);

  if (!open) return null;

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  return (
    <div
      className="command-palette-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Busca global"
    >
      <div
        className="command-palette"
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <header className="command-palette-header">
          <span className="command-palette-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="search"
            className="command-palette-input"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            autoComplete="off"
            spellCheck={false}
            aria-label="Busca global"
            aria-controls="command-palette-results"
          />
          <kbd className="command-palette-shortcut">{KEYBOARD_SHORTCUT}</kbd>
        </header>
        <div id="command-palette-results" className="command-palette-content" role="listbox">
          {filteredItems.length === 0 ? (
            !hasData ? (
              <EmptyState
                variant="no-dataset"
                title="Busca indisponível"
                description="A busca global ficará disponível após a importação do primeiro dataset na área técnica."
              />
            ) : query ? (
              <EmptyState
                variant="no-results"
                title="Nenhum resultado"
                description={`Nenhum resultado para "${query}".`}
              />
            ) : (
              <div className="command-palette-empty" role="status">
                <p>Digite para buscar entre medicamentos, princípios ativos e fabricantes.</p>
                <p style={{ fontSize: "var(--font-size-xs)", color: "var(--color-fg-subtle)" }}>
                  Pressione <kbd style={{ fontFamily: "var(--font-mono)" }}>{KEYBOARD_SHORTCUT}</kbd> para fechar
                </p>
              </div>
            )
          ) : (
            sections.map((section, sectionIndex) => {
              const sectionItems = filteredItems.filter((item) => item.sectionIndex === sectionIndex);
              if (sectionItems.length === 0) return null;

              return (
                <div key={sectionIndex} className="command-palette-section" role="group" aria-label={section.title}>
                  <h3 className="command-palette-section-title">{section.title}</h3>
                  <div role="list">
                    {sectionItems.map((item) => (
                      <button
                        key={item.id}
                        ref={(el) => {
                          itemsRef.current[item.globalIndex] = el;
                        }}
                        className="command-palette-item"
                        role="option"
                        aria-selected={item.globalIndex === selectedIndex}
                        onClick={() => {
                          item.onSelect();
                          onClose();
                        }}
                        onMouseEnter={() => setUserSelectedIndex(item.globalIndex)}
                      >
                        <div className="command-palette-item-main">
                          <div className="command-palette-item-title">{item.title}</div>
                          {item.description && (
                            <div className="command-palette-item-description">{item.description}</div>
                          )}
                        </div>
                        {item.badge && (
                          <Badge variant={item.badge.variant} className="command-palette-item-badge">
                            {item.badge.label}
                          </Badge>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;