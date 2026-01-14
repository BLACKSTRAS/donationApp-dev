import type { Metadata } from "next";
import "./globals.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primeicons/primeicons.css";
import Navbarpage from "@/components/Navbar";
import Footerpage from "@/components/Footer";
import { Inconsolata } from "next/font/google";
import { AuthProvider } from "@/components/AuthProvider";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "donate.app",
  description: "โดเนท ได้ด้วยเสียงคุณ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/logo.png" />
      </head>

      {/* ล็อกการ scroll ที่ body */}
      <body className={`${inconsolata.className} min-h-screen overflow-hidden`}>
        <AuthProvider>
          {/* ทำเป็น flex column เต็มจอ */}
          <div className="h-full flex flex-col">
            {/* ตัวนี้เป็นตัวเลื่อนแทน body */}
            <main className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden no-scrollbar">
              <Navbarpage />
              {children}
              <Footerpage />
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
