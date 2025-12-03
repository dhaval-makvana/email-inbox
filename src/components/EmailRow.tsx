"use client";
import React from "react";
import Link from "next/link";
import dayjs from "dayjs";

export type Email = {
  id: string;
  sender: string;
  subject: string;
  snippet?: string;
  date: string;
  isRead: boolean;
  isSpam?: boolean;
  body?: string;
};

type Props = {
  mail: Email;
  checked?: boolean;
  onToggle?: (id: string) => void;
  showSnippet?: boolean;
};

export const EmailRow: React.FC<Props> = ({
  mail,
  checked = false,
  onToggle,
  showSnippet = true,
}) => {
  const rowClasses = `email-row ${
    mail.isRead ? "" : "unread"
  } p-3 flex gap-3 items-start`;
  const subjectClass = `email-subject ${mail.isRead ? "read" : ""}`;

  return (
    <div className={rowClasses} role="listitem" data-email-id={mail.id}>
      <input
        aria-label={`select-${mail.id}`}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle?.(mail.id)}
        className="mt-1"
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate">
            <div className="flex items-center gap-2">
              {/* unread indicator */}
              {!mail.isRead && (
                <span className="unread-dot" title="Unread" aria-hidden />
              )}

              <div className="font-semibold text-sm truncate">
                {mail.sender}
              </div>

              {mail.isSpam && (
                <span
                  className="ml-2 badge-spam"
                  aria-label="spam"
                  title="Marked as spam"
                >
                  Spam
                </span>
              )}
            </div>

            <Link href={`/email/${mail.id}`} className="block mt-1">
              <div className={`${subjectClass} truncate`}>{mail.subject}</div>
              {showSnippet && mail.snippet && (
                <div className="email-snippet text-sm truncate">
                  {mail.snippet}
                </div>
              )}
            </Link>
          </div>

          <div className="text-xs ml-3" style={{ color: "var(--color-muted)" }}>
            {dayjs(mail.date).format("MMM D")}
          </div>
        </div>
      </div>
    </div>
  );
};

EmailRow.displayName = "EmailRow";
