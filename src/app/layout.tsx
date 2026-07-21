import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import Navbar from "@/components/navbar";
import "./globals.css";

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Beacon Healthcare | Accredited First Aid Training",
  description:
    "Accredited first aid training for individuals and organisations. Practical, instructor-led courses trusted by workplaces and corporate teams across Singapore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-paper font-sans text-ink">
        <Navbar />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
