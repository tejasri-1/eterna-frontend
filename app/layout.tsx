
import "./globals.css";
import { ReactNode } from "react";
import Providers from "../src/providers/Providers";

export const metadata = {
  title: "Token Discovery — Mock",
  description: "Axiom Trade token discovery table mock"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
