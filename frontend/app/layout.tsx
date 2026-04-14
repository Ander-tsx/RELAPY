import type { Metadata } from "next";
import { JetBrains_Mono, Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jetbrains",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RELAPY — Laplace Solver",
  description:
    "Solve ordinary differential equations symbolically using the Laplace Transform. Get step-by-step solutions, domain transformations, and interactive graphs.",
  keywords: ["Laplace Transform", "ODE solver", "differential equations", "math", "SymPy"],
  authors: [{ name: "RELAPY" }],
  openGraph: {
    title: "RELAPY — Laplace Solver",
    description: "Solve ODEs via Laplace Transform — symbolic, step-by-step.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${inter.variable}`}>
      <body style={{ backgroundColor: "#0d0d0d" }}>{children}</body>
    </html>
  );
}
