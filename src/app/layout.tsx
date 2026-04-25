import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RTS Australia | Premium Visa & Migration Services",
  description:
    "Australia's most trusted visa and migration agency. 20+ years of experience, 99% success rate, MARA-certified consultants. Apply for your visa today.",
  keywords:
    "visa australia, migration agent, australian visa, student visa, work visa, business visa",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${montserrat.variable} ${inter.variable}`}>
      <body
        className="bg-white min-h-screen flex flex-col"
        style={{ fontFamily: "'Inter', sans-serif" }}
      >
        <Navbar />
        <main className="grow flex flex-col">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
