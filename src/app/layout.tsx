import "./globals.css";
import React from "react";
import { PartnerProvider } from "@/components/PartnerContext";
import { PartnerSwitcher } from "@/components/PartnerSwitcher";
import ThemeToggle from "@/components/ThemeToggle";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PartnerProvider>
          <header className="p-4 border-b bg-(--color-bg)">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">Inbox</h1>

              <div className="flex items-center gap-4">
                <ThemeToggle />
                <PartnerSwitcher />
              </div>
            </div>
          </header>

          <main className="max-w-6xl mx-auto p-4">{children}</main>
        </PartnerProvider>
      </body>
    </html>
  );
}
