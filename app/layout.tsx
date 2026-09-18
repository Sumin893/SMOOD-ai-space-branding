import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SMOOD | AI Space Branding",
  description: "F&B 예비 창업자용 AI Space Branding MVP",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
