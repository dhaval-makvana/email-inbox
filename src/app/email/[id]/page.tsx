import React from "react";
import { notFound } from "next/navigation";
import emails from "@/data/emails.json";

type Props = {
  params: { id: string };
};

export default async function EmailDetailPage({ params }: Props) {
  const { id } = await params;
  const mail = (emails as any).find((m: any) => m.id === id);

  if (!mail) return notFound();

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold">{mail.subject}</h2>
      <div className="text-sm text-slate-500">
        {mail.sender} • {new Date(mail.date).toLocaleString()}
      </div>
      <div
        className="mt-4 prose"
        dangerouslySetInnerHTML={{ __html: mail.body || "<p>(no body)</p>" }}
      />
      <div className="mt-4 flex gap-2">
        <button className="btn">Reply</button>
        <button className="btn">Mark Unread</button>
      </div>
    </div>
  );
}
