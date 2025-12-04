"use client";

import React, { useEffect, useMemo, useState } from "react";
import { EmailRow, type Email } from "./EmailRow";
import { BulkToolbar } from "./BulkToolbar";
import { usePartner } from "./PartnerContext";
import { Input } from "@/components/ui/input";
import { Muted } from "@/components/ui/typography";

type Props = { initialEmails: Email[] };

const loadStored = (key: string): Email[] => {
  try {
    const raw =
      typeof window !== "undefined" ? localStorage.getItem(key) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const InboxList: React.FC<Props> = ({ initialEmails }) => {
  const { partner } = usePartner();
  const STORAGE_KEY = `inbox_emails_${partner.id}`;

  const [emails, setEmails] = useState<Email[]>(initialEmails);

  useEffect(() => {
    const stored = loadStored(STORAGE_KEY);
    if (stored.length > 0) {
      setEmails(stored);
    } else {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmails));
      } catch {}
      setEmails(initialEmails);
    }

    const handler = () => {
      const reloaded = loadStored(STORAGE_KEY);
      setEmails(reloaded.length ? reloaded : initialEmails);
    };
    window.addEventListener("inbox:updated", handler as EventListener);
    return () => {
      window.removeEventListener("inbox:updated", handler as EventListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner.id]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    } catch (e) {
      console.warn("Failed to persist emails", e);
    }
  }, [emails, STORAGE_KEY]);

  const [selected, setSelected] = useState<Record<string, boolean>>({});
  useEffect(() => setSelected({}), [partner.id]);

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return emails;
    return emails.filter(
      (e) =>
        e.sender.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        (e.snippet ?? "").toLowerCase().includes(q)
    );
  }, [emails, query]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedIds = Object.keys(selected).filter((id) => selected[id]);

  const cleanSelection = (ids: string[]) =>
    setSelected((prev) => {
      const next = { ...prev };
      ids.forEach((id) => delete next[id]);
      return next;
    });

  const markRead = (ids: string[], read: boolean) => {
    if (!ids.length) return;
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, isRead: read } : e))
    );
    cleanSelection(ids);
  };

  const deleteEmails = (ids: string[]) => {
    if (!ids.length) return;
    setEmails((prev) => prev.filter((e) => !ids.includes(e.id)));
    cleanSelection(ids);
  };

  const markSpam = (ids: string[]) => {
    if (!ids.length) return;
    setEmails((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, isSpam: true } : e))
    );
    cleanSelection(ids);
  };

  const visibleIds = filtered.map((e) => e.id);
  const allVisibleSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selected[id]);
  const someVisibleSelected =
    visibleIds.some((id) => selected[id]) && !allVisibleSelected;

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelected((prev) => {
        const next = { ...prev };
        visibleIds.forEach((id) => delete next[id]);
        return next;
      });
    } else {
      setSelected((prev) => {
        const next = { ...prev };
        visibleIds.forEach((id) => (next[id] = true));
        return next;
      });
    }
  };

  return (
    <div className="bg-transparent rounded shadow-sm">
      {/* Search bar */}
      <div className="px-3 pt-3 pb-2 bg-surface">
        <Input
          aria-label="search"
          placeholder="Search sender or subject…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* Bulk toolbar */}
      <BulkToolbar
        selectedIds={selectedIds}
        onMarkRead={markRead}
        onDelete={deleteEmails}
        onMarkSpam={markSpam}
        onToggleSelectAll={toggleSelectAll}
        totalCount={emails.length}
        allVisibleSelected={allVisibleSelected}
        someVisibleSelected={someVisibleSelected}
      />

      {/* List */}
      <div>
        {filtered.map((mail) => (
          <EmailRow
            key={mail.id}
            mail={mail}
            checked={!!selected[mail.id]}
            onToggle={toggleSelect}
            showSnippet={partner.features.previewSnippet}
          />
        ))}

        {filtered.length === 0 && (
          <div className="p-6 text-center">
            <Muted>No messages match your search.</Muted>
          </div>
        )}
      </div>
    </div>
  );
};

InboxList.displayName = "InboxList";
