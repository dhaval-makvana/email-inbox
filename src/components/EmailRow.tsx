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
  return (
    <div
      className={`p-3 flex gap-3 items-start border-b ${
        mail.isRead ? "bg-white" : "bg-slate-50"
      }`}
    >
      <input
        aria-label={`select-${mail.id}`}
        type="checkbox"
        checked={checked}
        onChange={() => onToggle?.(mail.id)}
      />

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div className="truncate">
            <div className="font-semibold text-sm truncate">{mail.sender}</div>

            {/* ✔ Next.js 16 valid Link structure */}
            <Link href={`/email/${mail.id}`} className="block">
              <div className="truncate">{mail.subject}</div>
              {showSnippet && mail.snippet && (
                <div className="text-sm text-slate-500 truncate">
                  {mail.snippet}
                </div>
              )}
            </Link>
          </div>

          <div className="text-xs text-slate-400 ml-3">
            {dayjs(mail.date).format("MMM D")}
          </div>
        </div>
      </div>
    </div>
  );
};
