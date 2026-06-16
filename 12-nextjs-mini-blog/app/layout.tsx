import type { Metadata } from "next";
import Header from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mini Blog",
  description: "A small blog built with Next.js, React, and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main className="container">{children}</main>
        <footer className="footer">
          <p>© 2026 Mini Blog — a Scrimba learning project.</p>
        </footer>
      </body>
    </html>
  );
}
