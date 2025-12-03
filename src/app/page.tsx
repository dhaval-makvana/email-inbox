import React from "react";
import { InboxList } from "../components/InboxList";
import emails from "../data/emails.json";

export default function Page() {
  return (
    <div className="min-h-screen bg-(--color-bg) text-(--color-fg)">
      <header className="p-4 border-b flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold">Inbox</h1>
      </header>

      <main className="max-w-4xl mx-auto p-4">
        <InboxList initialEmails={emails as any} />
      </main>
    </div>
  );
}
