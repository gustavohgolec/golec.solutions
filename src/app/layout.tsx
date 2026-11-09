import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Golec Hub | Centro de Comando & CRM",
  description: "Hub operacional, comercial e de implantação da Golec.Solutions",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#090D16] text-slate-100 min-h-screen flex antialiased">
        {children}
      </body>
    </html>
  );
}
