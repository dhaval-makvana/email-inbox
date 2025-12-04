"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { usePartner } from "@/components/PartnerContext";
import type { Email } from "@/components/EmailRow";
import bundledEmails from "@/data/emails.json";
import { Button } from "@/components/ui/button";
import { H2, Muted } from "@/components/ui/typography";
import dayjs from "dayjs";

// ---- Storage Helpers ----
const loadStored = (key: string): Email[] => {
  try {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((e): e is Email => e !== null)
      : [];
  } catch {
    return [];
  }
};

const persistList = (key: string, list: Email[]) => {
  try {
    const filtered = list.filter((e): e is Email => !!e);
    localStorage.setItem(key, JSON.stringify(filtered));

    // sync inbox
    window.dispatchEvent(new CustomEvent("inbox:updated", { detail: { key } }));
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

  // Reply UI state
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // ---- Load email ----
  useEffect(() => {
    if (!id) {
      setMail(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const stored = loadStored(STORAGE_KEY);
    let found = stored.find((m) => m.id === id) ?? null;

    // If not in stored, fallback to bundled
    if (!found) {
      const bundledFound =
        (bundledEmails as Email[]).find((m) => m.id === id) ?? null;

      if (bundledFound) {
        found = { ...bundledFound, isRead: true }; // auto mark read on open
        const merged = [...stored, found].filter((m): m is Email => !!m);
        persistList(STORAGE_KEY, merged);
      }
    }

    // Auto-mark unread emails as read
    if (found && !found.isRead) {
      const updated = { ...found, isRead: true };
      const updatedList = loadStored(STORAGE_KEY).map((m) =>
        m.id === updated.id ? updated : m
      );
      persistList(STORAGE_KEY, updatedList);
      found = updated;
    }

    setMail(found);
    setLoading(false);
  }, [id, partner.id]); // partner change resets mailbox

  // ---- Persist a single updated message to storage ----
  const updateMail = (updated: Email) => {
    const list = loadStored(STORAGE_KEY);
    const normalized: Email[] = list.some((m) => m.id === updated.id)
      ? list.map((m) => (m.id === updated.id ? updated : m))
      : [...list, updated];

    persistList(STORAGE_KEY, normalized);
    setMail(updated);
  };

  // ---- Actions ----
  const toggleRead = () => {
    if (!mail) return;
    updateMail({ ...mail, isRead: !mail.isRead });
  };

  const toggleSpam = () => {
    if (!mail) return;
    updateMail({ ...mail, isSpam: !mail.isSpam });
  };

  const handleDelete = () => {
    if (!mail) return;
    const list = loadStored(STORAGE_KEY).filter((m) => m.id !== mail.id);
    persistList(STORAGE_KEY, list);
    router.push("/");
  };

  const sendReply = () => {
    setReplyOpen(false);
    setReplyText("");
    // No-op but UI closes
  };

  // ---- Rendering ----
  if (loading) {
    return <div className="min-h-[40vh] p-6 text-slate-500">Loading…</div>;
  }

  if (!mail) {
    return (
      <div className="min-h-[40vh] p-6 text-slate-500">
        Email not found in this partner inbox.
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] p-6 max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <H2>{mail.subject}</H2>
          <Muted>
            {mail.sender} • {dayjs(mail.date).format("MMM D, YYYY h:mm A")}
          </Muted>
        </div>

        <div className="flex gap-2 items-center">
          {mail.isSpam && (
            <span
              aria-label="spam"
              className="badge-spam"
              title="Marked as spam"
            >
              Spam
            </span>
          )}

          <Button size="sm" onClick={toggleRead}>
            {mail.isRead ? "Mark Unread" : "Mark Read"}
          </Button>

          <Button size="sm" variant="secondary" onClick={toggleSpam}>
            {mail.isSpam ? "Unmark Spam" : "Mark Spam"}
          </Button>

          <Button size="sm" variant="danger" onClick={handleDelete}>
            Delete
          </Button>

          <Button
            size="sm"
            variant="secondary"
            onClick={() => setReplyOpen(true)}
          >
            Reply
          </Button>
        </div>
      </div>

      <div
        className="mt-6 prose"
        dangerouslySetInnerHTML={{ __html: mail.body ?? "<p>(no body)</p>" }}
      />

      {replyOpen && (
        <div className="mt-6 border rounded p-4 bg-gray-50 dark:bg-gray-800">
          <div className="mb-2 text-sm text-slate-600 dark:text-slate-300">
            Replying to {mail.sender}
          </div>

          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={6}
            className="w-full border rounded p-2 dark:bg-gray-900"
            placeholder="Write your reply..."
            aria-label="reply-body"
          />

          <div className="mt-3 flex gap-2">
            <Button size="sm" onClick={sendReply} aria-label="send-reply">
              Send
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => setReplyOpen(false)}
              aria-label="cancel-reply"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
