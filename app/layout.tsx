import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mimi — companion preview",
  description: "Calm, patient co-pilot character for Mimi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
