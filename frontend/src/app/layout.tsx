import type { Metadata } from "next";
import { Epilogue, Sora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
  display: "swap",
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "QTEC",
  description: "QTEC job platform frontend",
  icons: {
    icon: "/icons/Logo-dark.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${epilogue.variable} ${sora.variable} antialiased`}>
        {children}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
