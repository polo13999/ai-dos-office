import type { Metadata } from "next";
import "./globals.css";
import "./viewport-rwd.css";

export const metadata: Metadata = {
  title: "AI-DOS Pixel Office",
  description: "一間會自己運作的 AI 像素辦公室",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
