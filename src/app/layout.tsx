import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "@/providers";

export const metadata: Metadata = {
  title: "Pricedrop | Find Your Perfect Car Deal",
  description:
    "Discover exceptional car deals with AI-powered price predictions. Find vehicles priced below market value.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full antialiased">
        <AppProviders>
          <main className="min-h-full">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
