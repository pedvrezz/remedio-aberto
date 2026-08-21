import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Remédio Aberto",
  description: "Base local-first para consulta futura de dados públicos oficiais sobre medicamentos.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
