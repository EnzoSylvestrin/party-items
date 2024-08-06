import { Inter } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToggleBar from "@/components/menu/ToggleBar";
import { Metadata } from "next";

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
    <html lang="pt-br">
      <AuthProvider>
        <body className={`min-h-screen bg-zinc-800 text-text ${inter.className}`}>
          <ToggleBar />
          <div className='ml-60'>
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
