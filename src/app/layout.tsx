import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Itens da festa",
  description: "Feito para todo mundo poder adicionar sua preferencia de item para a festa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`min-h-screen bg-zinc-800 text-text ${inter.className}`}>{children}</body>
      </AuthProvider>
    </html>
  );
}
