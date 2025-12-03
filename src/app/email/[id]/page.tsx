"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePartner } from "../../../components/PartnerContext";
import type { Email } from "../../../components/EmailRow";
import bundledEmails from "../../../data/emails.json"; // initial seed

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

const persistList = (key: string, list: Email[]) => {
  try {
    localStorage.setItem(key, JSON.stringify(list));
    try {
      window.dispatchEvent(
        new CustomEvent("inbox:updated", { detail: { key } })
      );
    } catch {}
  } catch (e) {
    console.warn("failed to persist", e);
  }
};

export default function EmailDetailClient() {
  const params = useParams();
  const id = params?.id as string | undefined;
  const { partner } = usePartner();
  const router = useRouter();
  const STORAGE_KEY = `inbox_emails_${partner.id}`;

  const [mail, setMail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(true);

  // reply UI state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Load mail on mount / partner change
  useEffect(() => {
    if (!id) {
      setMail(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    const stored = loadStored(STORAGE_KEY);
    const foundInStored = stored.find((m) => m.id === id) ?? null;

    if (foundInStored) {
      setMail(foundInStored);
      setLoading(false);
      // if not read, mark read automatically
      if (!foundInStored.isRead) {
        const updated = { ...foundInStored, isRead: true };
        const next = stored.some((m) => m.id === id)
          ? stored.map((m) => (m.id === id ? updated : m))
          : [...stored, updated];
        persistList(STORAGE_KEY, next);
        setMail(updated);
      }
      return;
    }

    // fallback to bundled seed
    const foundInBundled =
      (bundledEmails as Email[]).find((m) => m.id === id) ?? null;
    if (foundInBundled) {
      // mark as read on open
      const withRead = foundInBundled.isRead
        ? foundInBundled
        : { ...foundInBundled, isRead: true };

      setMail(withRead);

      // seed partner store if empty or doesn't contain this id
      const nextList = stored.length ? stored : (bundledEmails as Email[]);
      const exists = nextList.some((m) => m.id === id);
      const merged = exists
        ? nextList.map((m) => (m.id === id ? withRead : m))
        : [...nextList, withRead];
      persistList(STORAGE_KEY, merged);

      setLoading(false);
      return;
    }

    setMail(null);
    setLoading(false);
  }, [id, partner.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = (updated: Email) => {
    const list = loadStored(STORAGE_KEY);
    const exists = list.some((m) => m.id === updated.id);
    const next = exists
      ? list.map((m) => (m.id === updated.id ? updated : m))
      : [...list, updated];
    persistList(STORAGE_KEY, next);
    setMail(updated);
  };

  // actions
  const toggleRead = () => {
    if (!mail) return;
    const upd = { ...mail, isRead: !mail.isRead };
    persist(upd);
  };

  const toggleSpam = () => {
    if (!mail) return;
    const upd = { ...mail, isSpam: !mail.isSpam };
    persist(upd);
  };

  const handleDelete = () => {
    if (!mail) return;
    const list = loadStored(STORAGE_KEY);
    const next = list.filter((m) => m.id !== mail.id);
    persistList(STORAGE_KEY, next);
    router.push("/");
  };

  // reply handlers (no-op send)
  const openReply = () => {
    setReplyOpen(true);
    setReplyText("");
  };
  const cancelReply = () => {
    setReplyOpen(false);
    setReplyText("");
  };
  const sendReply = () => {
    // no-op: we could optionally persist a "sent" preview to localStorage
    // For now: close composer and clear text
    setReplyOpen(false);
    setReplyText("");
    // Optionally show a tiny client-side confirmation (toast) — omitted for simplicity
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] p-6">
        <div className="text-slate-500">Loading…</div>
      </div>
    );
  }

  if (!id || !mail) {
    return (
      <div className="min-h-[40vh] p-6">
        <div className="text-slate-500">
          Email not found in this partner inbox.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] p-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">{mail.subject}</h2>
          <div className="text-sm text-slate-500">
            {mail.sender} • {new Date(mail.date).toLocaleString()}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {mail.isSpam && (
            <span className="inline-flex px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
              Spam
            </span>
          )}

          <button className="btn" onClick={toggleRead}>
            {mail.isRead ? "Mark Unread" : "Mark Read"}
          </button>

          <button className="btn" onClick={toggleSpam}>
            {mail.isSpam ? "Unmark Spam" : "Mark Spam"}
          </button>

          <button className="btn" onClick={handleDelete}>
            Delete
          </button>

          <button className="btn" onClick={openReply}>
            Reply
          </button>
        </div>
      </div>

      <div
        className="mt-6 prose"
        dangerouslySetInnerHTML={{ __html: mail.body ?? "<p>(no body)</p>" }}
      />

      {/* Reply composer */}
      {replyOpen && (
        <div className="mt-6 border rounded p-4 bg-gray-50">
          <div className="mb-2 text-sm text-slate-600">
            Replying to {mail.sender}
          </div>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            className="w-full border rounded p-2"
            placeholder="Write your reply..."
            aria-label="reply-body"
          />
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={sendReply} aria-label="send-reply">
              Send
            </button>
            <button
              className="btn"
              onClick={cancelReply}
              aria-label="cancel-reply"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
