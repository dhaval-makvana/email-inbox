"use client";

import React from "react";
import Link from "next/link";
import dayjs from "dayjs";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export type Email = {
  id: string;
  sender: string;
  subject: string;
  snippet?: string;
  body?: string;
  date: string;
  isRead?: boolean;
  isSpam?: boolean;
};

type Props = {
  mail: Email;
  checked: boolean;
  onToggle: (id: string) => void;
  showSnippet: boolean;
};

export const EmailRow: React.FC<Props> = ({
  mail,
  checked,
  onToggle,
  showSnippet,
}) => {
  const handleToggle = () => onToggle(mail.id);

  return (
    <div
      className={cn("email-row p-3 flex gap-3 items-start cursor-pointer", {
        unread: !mail.isRead,
      })}
      role="listitem"
      data-email-id={mail.id}
    >
      {/* Selection checkbox */}
      <Checkbox
        aria-label={`select-${mail.id}`}
        className="mt-1"
        checked={checked}
        onChange={handleToggle}
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate">
            <div className="flex items-center gap-2">
              {!mail.isRead && (
                <span
                  aria-hidden="true"
                  className="unread-dot"
                  title="Unread"
                />
              )}
              <div className="font-semibold text-sm truncate">
                {mail.sender}
              </div>

              {mail.isSpam && (
                <span
                  aria-label="spam"
                  className="ml-2 badge-spam"
                  title="Marked as spam"
                >
                  Spam
                </span>
              )}
            </div>

            <Link href={`/email/${mail.id}`} className="block mt-0.5">
              <div
                className={cn("email-subject truncate", mail.isRead && "read")}
              >
                {mail.subject}
              </div>

              {showSnippet && mail.snippet && (
                <div className="email-snippet text-sm truncate">
                  {mail.snippet}
                </div>
              )}
            </Link>
          </div>

          {/* Date - use dayjs for deterministic SSR/CSR match */}
          <div className="text-xs ml-3" style={{ color: "var(--color-muted)" }}>
            {dayjs(mail.date).format("MMM D")}
          </div>
        </div>
      </div>
    </div>
  );
};

EmailRow.displayName = "EmailRow";
