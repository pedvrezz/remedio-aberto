"use client";

import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MainSearch } from "./components/MainSearch";
import { CommandPalette } from "./components/CommandPalette";
import { EmptyState } from "./components/EmptyState";
import { Button } from "./components/Button";
import { Badge } from "./components/Badge";

const NAV_LINKS = [
  { href: "#metodologia", label: "Metodologia" },
  { href: "#fontes", label: "Fontes" },
  { href: "https://github.com/pedvrezz/remedio-aberto", label: "GitHub", external: true },
  { href: "/technical", label: "Área Técnica", internal: true },
];

export default function Home() {
  const router = useRouter();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = useCallback((query: string) => {
    setSearchPerformed(true);
    // In the future, this will navigate to /search?q=...
    console.log("Search:", query);
  }, []);

  const handleGlobalKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === "k") {
        event.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Static sections for command palette (no real data yet)
  const commandPaletteSections = [
    {
      title: "Navegação",
      items: [
        {
          id: "nav-home",
          title: "Início",
          description: "Voltar para a página inicial",
          onSelect: () => window.scrollTo({ top: 0, behavior: "smooth" }),
          badge: { label: "Home", variant: "brand" as const },
        },
        {
          id: "nav-api",
          title: "Documentação da API",
          description: "Swagger/OpenAPI da API local",
          onSelect: () => window.open("http://127.0.0.1:8000/docs", "_blank"),
          badge: { label: "API", variant: "neutral" as const },
        },
        {
          id: "nav-technical",
          title: "Área Técnica",
          description: "Gerenciar fontes, datasets e ingestão",
          onSelect: () => router.push("/technical"),
          badge: { label: "Técnica", variant: "brand" as const },
        },
      ],
    },
    {
      title: "Informação",
      items: [
        {
          id: "info-methodology",
          title: "Metodologia",
          description: "Como os dados são coletados, validados e publicados",
          onSelect: () => {
            window.location.hash = "metodologia";
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        },
        {
          id: "info-sources",
          title: "Fontes Oficiais",
          description: "ANVISA, CMED, Bulário Eletrônico e outras fontes validadas",
          onSelect: () => {
            window.location.hash = "fontes";
            window.scrollTo({ top: 0, behavior: "smooth" });
          },
        },
        {
          id: "info-github",
          title: "Repositório no GitHub",
          description: "Código fonte, issues e contribuições",
          onSelect: () => window.open("https://github.com/pedvrezz/remedio-aberto", "_blank"),
          badge: { label: "Externo", variant: "neutral" as const },
        },
      ],
    },
  ];

  return (
    <>
      <header className="site-header" role="banner">
        <div className="site-header-inner container">
          <Link href="/" className="site-header-brand" aria-label="Remédio Aberto - Início">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>Remédio Aberto</span>
          </Link>

          <nav className="site-header-nav" aria-label="Navegação principal">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="site-header-link"
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="site-header-actions">
            <kbd className="command-palette-shortcut" style={{ marginRight: "var(--space-2)" }}>
              {typeof window !== "undefined" && navigator.platform.includes("Mac") ? "⌘K" : "Ctrl+K"}
            </kbd>
          </div>
        </div>
      </header>

      <main id="main-content" role="main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-main">
            <span className="hero-tagline">Fase 0 — Fundação Verificável</span>
            <h1 id="hero-title" className="hero-title">
              Dados oficiais sobre medicamentos, com origem clara.
            </h1>
            <p className="hero-description">
              Uma plataforma brasileira open source e local-first para consulta pública de medicamentos,
              princípios ativos, fabricantes, apresentações, situação regulatória e preços oficiais —
              utilizando exclusivamente fontes públicas, oficiais e legalmente utilizáveis.
            </p>

            <div className="hero-search">
              <MainSearch
                onSearch={handleSearch}
                hasData={false}
                disabled={false}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "center", gap: "var(--space-3)", flexWrap: "wrap", marginTop: "var(--space-4)" }}>
              <Badge variant="brand">Local-first</Badge>
              <Badge variant="neutral">Sem telemetria</Badge>
              <Badge variant="success">API aberta</Badge>
              <Badge variant="warning">Fase 0</Badge>
            </div>
          </div>
        </section>

        <section id="metodologia" className="container" style={{ padding: "var(--space-16) var(--space-4)" }} aria-labelledby="methodology-title">
          <h2 id="methodology-title" style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
            Metodologia desde o primeiro commit
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "var(--space-6)", maxWidth: "900px", margin: "0 auto" }}>
            <article style={{ padding: "var(--space-6)", background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                <span>Local-first</span>
              </h3>
              <p>Web e API executam em loopback (127.0.0.1). Nenhuma telemetria externa, analytics remoto ou envio de dados de utilização.</p>
            </article>
            <article style={{ padding: "var(--space-6)", background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                <span>Fonte rastreável</span>
              </h3>
              <p>A futura ingestão exigirá URL oficial, órgão responsável, checksum SHA-256, versão do parser e instante da coleta.</p>
            </article>
            <article style={{ padding: "var(--space-6)", background: "var(--color-bg-subtle)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-xl)" }}>
              <h3 style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", marginBottom: "var(--space-3)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                <span>Informativo</span>
              </h3>
              <p>O projeto não diagnostica, prescreve, recomenda tratamento, sugere dose nem afirma equivalência terapêutica.</p>
            </article>
          </div>
        </section>

        <section id="fontes" className="container" style={{ padding: "var(--space-16) var(--space-4)", background: "var(--color-bg-subtle)" }} aria-labelledby="sources-title">
          <h2 id="sources-title" style={{ textAlign: "center", marginBottom: "var(--space-4)" }}>
            Fontes Candidatas (pendentes de validação)
          </h2>
          <p style={{ textAlign: "center", color: "var(--color-fg-muted)", maxWidth: "700px", margin: "0 auto var(--space-8)" }}>
            Nenhuma fonte regulatória foi integrada ainda. A Fase 1 validará uma única fonte oficial pequena
            antes de implementar aquisição, checksum, normalização, persistência e busca.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "var(--space-4)", maxWidth: "900px", margin: "0 auto" }}>
            {[
              { name: "ANVISA", desc: "Dados regulatórios de medicamentos", status: "Pendente", variant: "warning" },
              { name: "CMED", desc: "Listas de preços oficiais", status: "Pendente", variant: "warning" },
              { name: "Bulário Eletrônico", desc: "Bulários em formato estruturado", status: "Pendente", variant: "warning" },
            ].map((source) => (
              <article key={source.name} style={{ padding: "var(--space-5)", background: "var(--color-bg)", border: "1px solid var(--color-border)", borderRadius: "var(--radius-lg)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-2)" }}>
                  <h3 style={{ margin: 0, fontSize: "var(--font-size-lg)" }}>{source.name}</h3>
                  <Badge variant={source.variant as any}>{source.status}</Badge>
                </div>
                <p style={{ margin: 0, color: "var(--color-fg-muted)", fontSize: "var(--font-size-sm)" }}>{source.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="status" className="container" style={{ padding: "var(--space-16) var(--space-4)", textAlign: "center" }} aria-labelledby="dataset-status">
          <EmptyState
            variant="no-dataset"
            title="Ainda não há dados importados"
            description="A próxima fase validará uma única fonte oficial antes de implementar aquisição, checksum, normalização, persistência e busca."
            action={
              <Button variant="primary" size="lg" onClick={() => router.push("/technical")}>
                Ir para Área Técnica
              </Button>
            }
          />
        </section>
      </main>

      <footer className="site-footer" role="contentinfo">
        <div className="site-footer-inner">
          <nav className="site-footer-links" aria-label="Links do rodapé">
            <a href="#metodologia" className="site-footer-link">Metodologia</a>
            <a href="#fontes" className="site-footer-link">Fontes</a>
            <a href="https://github.com/pedvrezz/remedio-aberto" className="site-footer-link" target="_blank" rel="noopener noreferrer">GitHub</a>
            <Link href="/technical" className="site-footer-link">Área Técnica</Link>
            <a href="http://127.0.0.1:8000/docs" className="site-footer-link">API Docs</a>
          </nav>
          <p className="site-footer-disclaimer">
            Informação regulatória não substitui orientação de profissionais de saúde.
            <br />
            <a href="https://github.com/pedvrezz/remedio-aberto/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">Licença Apache-2.0</a> —
            <a href="https://github.com/pedvrezz/remedio-aberto" target="_blank" rel="noopener noreferrer">pedvrezz/remedio-aberto</a>
          </p>
        </div>
      </footer>

      <CommandPalette
        open={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        sections={commandPaletteSections}
        hasData={false}
      />
    </>
  );
}