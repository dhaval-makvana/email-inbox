"use client";
import React, { useMemo, useState } from "react";
import { EmailRow, Email } from "./EmailRow";

type Props = { initialEmails: Email[] };

export const InboxList: React.FC<Props> = ({ initialEmails }) => {
  const [emails] = useState<Email[]>(initialEmails);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return emails;
    return emails.filter(
      (e) =>
        e.sender.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q)
    );
  }, [emails, query]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="bg-white rounded shadow-sm">
      <div className="p-3 border-b">
        <input
          className="w-full border rounded px-3 py-2"
          placeholder="Search by sender or subject..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="search"
        />
      </div>

      <div>
        {filtered.map((mail) => (
          <EmailRow
            key={mail.id}
            mail={mail}
            checked={!!selected[mail.id]}
            onToggle={toggleSelect}
            showSnippet={true}
          />
        ))}
      </div>
    </div>
  );
};
