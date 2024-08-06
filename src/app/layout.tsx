'use client';

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./styles/globals.css";
import { AuthProvider } from "@/context/AuthContext";
import ToggleBar from "@/components/menu/ToggleBar";
import { getMenus } from "@/components/serverless/getMenus";
import { Menu } from "@prisma/client";
import { useState, useEffect } from "react";

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
  const [menus, setMenus] = useState<Menu[]>([]);

  async function loadMenus() {
    let menus : any = await getMenus();

    setMenus(menus);
  }

  useEffect(() => {
    loadMenus();
  }, []);

  return (
    <html lang="en">
      <AuthProvider>
        <body className={`min-h-screen bg-zinc-800 text-text ${inter.className}`}>
          <ToggleBar menus={menus} refresh={loadMenus} />
          <div className='ml-60'>
            {children}
          </div>
        </body>
      </AuthProvider>
    </html>
  );
}
