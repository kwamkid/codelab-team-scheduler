import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codelab Team Scheduler",
  description: "ระบบจัดการตารางเวลาการมาซ้อมของทีม",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body className="antialiased bg-gray-50 min-h-screen text-black">
        {children}
      </body>
    </html>
  );
}
