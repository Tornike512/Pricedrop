import type { Metadata } from "next";
import "../styles/globals.css";
import { AppProviders } from "@/providers";
import { cn } from "@/utils/cn";

export const metadata: Metadata = {
  title: "Nextjs starter",
  description: "A Next.js starter template",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full")}>
      <body
        className={cn(
          "h-full bg-background-100 font-roboto text-foreground-100",
        )}
      >
        <AppProviders>
          <main className="grid h-full">{children}</main>
        </AppProviders>
      </body>
    </html>
  );
}
