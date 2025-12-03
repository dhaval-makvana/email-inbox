"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { EmailRow, Email } from "./EmailRow";
import { BulkToolbar } from "./BulkToolbar";
import { usePartner } from "./PartnerContext";

type Props = { initialEmails: Email[] };

const loadStored = (key: string): Email[] => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(key);
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

  // Start with server-friendly initialEmails to avoid hydration mismatch.
  const [emails, setEmails] = useState<Email[]>(initialEmails);

  // Track whether we've done the initial load/persist cycle to avoid clobbering storage.
  const didInitialLoadRef = useRef(false);

  useEffect(() => {
    // On mount / partner change: load partner-scoped storage if present; otherwise seed it.
    const stored = loadStored(STORAGE_KEY);

    if (stored.length > 0) {
      setEmails(stored);
    } else {
      // seed partner store with bundled initialEmails (if nothing stored)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialEmails));
      } catch {
        /* ignore */
      }
      setEmails(initialEmails);
    }

    // handler reacts to custom event 'inbox:updated' from detail page (or other sources)
    const handler = (e: Event) => {
      try {
        // Prefer event.detail.key check when available
        const detail = (e as CustomEvent)?.detail as any;
        if (detail && detail.key && detail.key !== STORAGE_KEY) {
          // event is for a different partner - ignore
          return;
        }
      } catch {
        // ignore parsing errors and attempt reload
      }

      const reloaded = loadStored(STORAGE_KEY);
      setEmails(reloaded.length ? reloaded : initialEmails);
      // also clear selection because the underlying data changed
      setSelected({});
    };

    window.addEventListener("inbox:updated", handler as EventListener);

    // mark initial load done after a tick so we don't persist immediately
    // (prevent overwriting more recent updates)
    // We set this after a short delay to let any near-simultaneous detail-change events fire.
    const markInit = window.setTimeout(() => {
      didInitialLoadRef.current = true;
    }, 10);

    return () => {
      window.removeEventListener("inbox:updated", handler as EventListener);
      window.clearTimeout(markInit);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partner.id]);

  // Persist to localStorage whenever emails change — but skip persisting
  // during the initial load to avoid clobbering a concurrent update.
  useEffect(() => {
    if (!didInitialLoadRef.current) {
      // skip first automatic persist
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(emails));
    } catch (e) {
      console.warn("Failed to persist emails", e);
    }
  }, [emails, STORAGE_KEY]);

  // selection state
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  // clear selection on partner change
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
    <div className="bg-white rounded shadow-sm">
      <div className="p-3 border-b">
        <input
          className="border rounded px-3 py-2 w-full"
          placeholder="Search sender or subject…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="search"
        />
      </div>

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
          <div className="p-6 text-center text-slate-500">
            No messages match your search.
          </div>
        )}
      </div>
    </div>
  );
};

InboxList.displayName = "InboxList";
