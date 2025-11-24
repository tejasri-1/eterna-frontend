// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { ReactNode } from "react";
import Providers from "../src/providers/Providers";
import ErrorBoundary from "../src/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "Axiom Trade — Token Table",
  description: "Axiom Trade token discovery table mock",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <Providers>{children}</Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}
