import type { Metadata } from "next";
import "./globals.css";
import "@reactcomponents/index.css";
import "@reactcomponents/App.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Aurelane",
  description:
    "Aurelane gemstone marketplace rebuilt with the Next.js App Router.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
