import React from "react";
import { InboxList } from "../components/InboxList";
import emails from "@/data/emails.json";

export default function Page() {
  return (
    <div className="min-h-[60vh]">
      <InboxList initialEmails={emails as any} />
    </div>
  );
}
