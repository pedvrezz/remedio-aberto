# Design System — Remédio Aberto

> **Versão:** 0.1.0
> **Status:** Fundação visual da Fase 0
> **Última atualização:** 2025

---

## Princípios

| Princípio | Descrição |
|-----------|-----------|
| **Clareza acima de tudo** | A interface serve à consulta de dados regulatórios. Nada deve competir com a informação. |
| **Local-first real** | Nenhuma dependência de CDN, fontes externas, telemetria ou serviços de terceiros em runtime. |
| **Acessibilidade nativa** | WCAG 2.1 AA como baseline. Foco visível, navegação por teclado, ARIA quando necessário, contraste garantido. |
| **Respeito ao usuário** | `prefers-reduced-motion`, `prefers-color-scheme`, sem animações decorativas, sem rastreamento. |
| **Sóbrio e institucional** | Azul profundo como cor da marca. Verde apenas para sucesso. Âmbar para atenção. Vermelho apenas para erro. |
| **Performance** | Bundle mínimo. CSS nativo. Sem `framer-motion`, sem bibliotecas pesadas sem justificativa. |

---

## Tokens (CSS Custom Properties)

### Cores

```css
/* Base / Neutros */
--color-bg: #ffffff;
--color-bg-subtle: #f8f9fa;
--color-bg-muted: #f1f3f4;
--color-fg: #1a1f24;
--color-fg-muted: #5a646d;
--color-fg-subtle: #8a949d;
--color-border: #dee2e6;
--color-border-strong: #ced4da;
--color-border-focus: #1e4d8b;

/* Brand — Azul profundo institucional */
--color-brand: #1e3a5f;
--color-brand-hover: #16304f;
--color-brand-light: #e8eef5;
--color-brand-lighter: #d1e0ed;

/* Semantic — Success (verde apenas para sucesso) */
--color-success: #0d6e2e;
--color-success-bg: #e8f5e9;
--color-success-border: #a5d6a7;

/* Semantic — Warning (âmbar para atenção) */
--color-warning: #b87300;
--color-warning-bg: #fff8e1;
--color-warning-border: #ffe082;

/* Semantic — Error/Danger (vermelho apenas para erro/alerta) */
--color-error: #b3261e;
--color-error-bg: #fdeaea;
--color-error-border: #f5c6cb;
```

### Tipografia

```css
--font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--font-mono: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;

--font-size-xs: 0.75rem;    /* 12px */
--font-size-sm: 0.875rem;   /* 14px */
--font-size-base: 1rem;     /* 16px */
--font-size-lg: 1.125rem;   /* 18px */
--font-size-xl: 1.25rem;    /* 20px */
--font-size-2xl: 1.5rem;    /* 24px */
--font-size-3xl: 2rem;      /* 32px */
--font-size-4xl: 2.5rem;    /* 40px */
--font-size-5xl: 3.5rem;    /* 56px */

--font-weight-normal: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;

--line-height-tight: 1.1;
--line-height-normal: 1.5;
--line-height-relaxed: 1.625;
```

### Espaçamento (base 4px)

```css
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Border Radius

```css
--radius-none: 0;
--radius-sm: 0.25rem;   /* 4px */
--radius-md: 0.375rem;  /* 6px */
--radius-lg: 0.5rem;    /* 8px */
--radius-xl: 0.75rem;   /* 12px */
--radius-2xl: 1rem;     /* 16px */
--radius-full: 9999px;
```

### Sombras

```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
--shadow-focus: 0 0 0 3px var(--color-brand-light);
```

### Transições (respeita `prefers-reduced-motion`)

```css
--transition-fast: 120ms ease;
--transition-normal: 200ms ease;
--transition-slow: 300ms ease;
```

### Breakpoints (para media queries)

```css
--bp-sm: 640px;
--bp-md: 768px;
--bp-lg: 1024px;
--bp-xl: 1280px;
--bp-2xl: 1536px;
```

### Z-index

```css
--z-dropdown: 100;
--z-sticky: 200;
--z-modal-backdrop: 300;
--z-modal: 310;
--z-popover: 400;
--z-tooltip: 500;
--z-toast: 600;
```

---

## Componentes Implementados (Fase 0)

| Componente | Arquivo | Descrição |
|------------|---------|-----------|
| `Button` | `Button.tsx` | Primário, secundário, ghost, destrutivo; tamanhos sm/md/lg; loading state |
| `Input` | `Input.tsx` | Label, hint, error, acessível (aria-describedby, aria-invalid) |
| `Badge` | `Badge.tsx` | success, warning, error, neutral, brand |
| `Dialog` | `Dialog.tsx` | Modal acessível, focus trap, Escape para fechar, scroll lock |
| `EmptyState` | `EmptyState.tsx` | Variantes: no-dataset, no-results, error; ícones inline SVG |
| `MainSearch` | `MainSearch.tsx` | Busca principal full-width, Enter para submeter, hint Ctrl+K |
| `CommandPalette` | `CommandPalette.tsx` | Busca global Ctrl+K/Cmd+K, navegação por setas, seções, badges |

---

## Componentes NÃO Implementados (Aguardando Fase 1)

| Componente | Motivo |
|------------|--------|
| `DataGridTable` / TanStack Table | Requer schema real de dados (apresentações, preços) |
| `Timeline` (alterações regulatórias) | Requer pipeline de diff e dados de histórico reais |
| `Charts` (Recharts / Evil Charts) | Requer dados de histórico de preços reais |
| `Sidebar` técnica | Requer fontes integradas e status de ingestão real |
| `Toast` / Sonner | Não necessário ainda (feedback via inline states) |
| `Tooltip` | Não necessário ainda |
| `Select`, `DropdownMenu`, `Tabs` | Não necessário ainda |

---

## Referências do 21st.dev (Inspiração / Adaptação)

| Componente 21st.dev | Autor | Uso no Remédio Aberto | Decisão |
|---------------------|-------|----------------------|---------|
| Expandable Search Bar | Arunachalam | MainSearch — padrão visual full-width, sem Motion | **ADAPTADO** (CSS transitions nativas, sem Framer Motion) |
| Header with Search | Efferd | SiteHeader — marca + navegação discreta + Ctrl+K hint | **ADAPTADO** (header minimalista, sem modal de busca) |
| Command Palette | Jatin Yadav / Rafa Porto | CommandPalette — Ctrl+K, navegação setas, seções | **ADAPTADO** (implementação própria, sem `cmdk`, sem Motion) |
| EmptyState | Sonu Kumar | EmptyState — variantes no-dataset, no-results, error | **ADAPTADO** (ícones inline, tokens próprios, textos reais) |

> **Nota:** Nenhum código foi copiado diretamente. Todos os componentes foram reimplementados usando os tokens do design system do Remédio Aberto, sem branding, dados demo ou dependências desnecessárias dos originais.

---

## Dependências Atuais (apps/web)

```json
{
  "dependencies": {
    "next": "16.3.2",
    "react": "19.2.8",
    "react-dom": "19.2.8"
  },
  "devDependencies": {
    "@eslint/eslintrc": "3.3.1",
    "@types/node": "26.2.0",
    "@types/react": "19.2.18",
    "@types/react-dom": "19.2.4",
    "eslint": "9.39.3",
    "eslint-config-next": "16.3.2",
    "typescript": "5.9.2"
  }
}
```

> **Zero dependências de UI externas.** Todos os primitives são código próprio auditável.

---

## Acessibilidade Checklist

- [x] Contraste WCAG 2.1 AA (verificado manualmente nos tokens)
- [x] Foco visível (`:focus-visible` em todos os interativos)
- [x] Navegação por teclado (Tab, Setas, Enter, Escape)
- [x] ARIA labels/describedby onde necessário
- [x] `prefers-reduced-motion` respeitado (transições desabilitadas)
- [x] `prefers-color-scheme` preparado (tokens prontos, modo claro apenas por enquanto)
- [x] Labels associados a inputs
- [x] `aria-invalid`, `aria-describedby` em inputs com erro
- [x] `role="dialog"`, `aria-modal`, focus trap em Dialog/CommandPalette
- [x] `role="search"` na busca principal
- [x] `role="listbox"`, `role="option"`, `aria-selected` na CommandPalette
- [x] `aria-live="polite"` em EmptyState
- [x] Sem overflow horizontal em mobile
- [x] Textos em português (pt-BR)

---

## Responsividade

| Breakpoint | Comportamento |
|------------|---------------|
| `< 640px` (mobile) | Stack vertical; header esconde nav; busca full-width; CommandPalette margens reduzidas |
| `641–1024px` (tablet) | Nav visível com gaps menores; grid 2 colunas em metodologia/fontes |
| `> 1024px` (desktop) | Layout completo; max-width 1120px; hero centralizado |

---

## Como Estender

1. **Novos tokens**: Adicione em `styles.css` sob `:root` seguindo nomenclatura `--category-property`.
2. **Novos componentes**: Crie em `app/components/` com interface TypeScript, `forwardRef`, `"use client"`, classes CSS baseadas em tokens.
3. **Novas cores semânticas**: Siga o padrão `--color-{success|warning|error}-{bg|border}`.
4. **Dark mode**: Quando necessário, adicione `@media (prefers-color-scheme: dark)` sobrescrevendo tokens.

---

## Validação Contínua

```bash
# Quality gates
make check           # lint + typecheck + test + build + audit
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # node --test
npm run build        # next build --webpack
npm audit --audit-level=high
```

---

## Próximos Passos (Pós-Fase 1)

Quando a primeira fonte oficial atravessar o pipeline:

1. Instalar `@tanstack/react-table` (versão fixa, auditada) → DataGridTable
2. Avaliar Recharts vs SVG nativo para histórico de preços
3. Implementar Timeline com dados reais de diff
4. Construir Sidebar técnica com status de fontes reais
5. Adicionar Toast/Sonner se feedback assíncrono for necessário
6. Adicionar Tooltip, Select, Tabs conforme necessidade real