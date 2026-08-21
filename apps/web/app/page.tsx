const capabilities = [
  ["Local-first", "Web e API executam em loopback. Nenhuma telemetria externa."],
  ["Fonte rastreável", "A futura ingestão exigirá URL oficial, órgão, checksum e versão do parser."],
  ["Informativo", "O projeto não diagnostica, prescreve nem recomenda tratamento."],
];

export default function Home() {
  return (
    <main>
      <header className="hero">
        <nav aria-label="Principal"><strong>Remédio Aberto</strong><a href="#status">Status</a></nav>
        <div className="hero-copy">
          <span className="eyebrow">Fase 0 · fundação verificável</span>
          <h1>Dados oficiais sobre medicamentos, com origem clara.</h1>
          <p>Uma plataforma brasileira open source e local-first. Nesta fase, nenhuma fonte regulatória foi integrada; estamos construindo a base segura para fazê-lo corretamente.</p>
          <a className="button" href="http://127.0.0.1:8000/docs">Explorar API local</a>
        </div>
      </header>
      <section className="section" aria-labelledby="principios">
        <h2 id="principios">Princípios desde o primeiro commit</h2>
        <div className="grid">{capabilities.map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
      </section>
      <section className="section status" id="status" aria-labelledby="dataset-status">
        <div><span className="eyebrow">Datasets</span><h2 id="dataset-status">Ainda não há dados importados.</h2></div>
        <p>A próxima fase validará uma única fonte oficial antes de implementar aquisição, checksum, normalização, persistência e busca.</p>
      </section>
      <footer><p>Informação regulatória não substitui orientação de profissionais de saúde.</p></footer>
    </main>
  );
}
