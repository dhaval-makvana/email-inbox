// components/BulkToolbar.tsx
"use client";
import React from "react";
import { usePartner } from "./PartnerContext";

type Props = {
  selectedIds: string[];
  onMarkRead: (ids: string[], read: boolean) => void;
  onDelete: (ids: string[]) => void;
  onMarkSpam: (ids: string[]) => void;
  onToggleSelectAll: () => void;
  totalCount?: number;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
};

export const BulkToolbar: React.FC<Props> = ({
  selectedIds,
  onMarkRead,
  onDelete,
  onMarkSpam,
  onToggleSelectAll,
  totalCount = 0,
  allVisibleSelected,
  someVisibleSelected,
}) => {
  const { partner } = usePartner();
  const hasSelection = selectedIds.length > 0;

  if (!partner.features.bulkToolbar) return null;

  return (
    <div className="px-3 py-2 border-b border-(--color-border) flex items-center gap-3 bg-surface">
      {/* Left: selection + count */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          aria-label="select-all"
          onChange={onToggleSelectAll}
          checked={allVisibleSelected}
          ref={(el) => {
            if (!el) return;
            (el as HTMLInputElement).indeterminate =
              !allVisibleSelected && someVisibleSelected;
          }}
        />
        <span className="text-xs text-(--color-muted)">
          {selectedIds.length} selected
        </span>
      </div>

      {/* Middle: actions */}
      <div className="flex gap-2 ml-4">
        <button
          className="btn"
          onClick={() => onMarkRead(selectedIds, true)}
          disabled={!hasSelection}
        >
          Mark Read
        </button>

        <button
          className="btn"
          onClick={() => onMarkRead(selectedIds, false)}
          disabled={!hasSelection}
        >
          Mark Unread
        </button>

        {partner.features.markAsSpam && (
          <button
            className="btn"
            onClick={() => onMarkSpam(selectedIds)}
            disabled={!hasSelection}
          >
            Mark Spam
          </button>
        )}

        <button
          className="btn-danger"
          onClick={() => onDelete(selectedIds)}
          disabled={!hasSelection}
        >
          Delete
        </button>
      </div>

      {/* Right: total count */}
      <div className="ml-auto text-xs text-(--color-muted)">
        {totalCount} messages
      </div>
    </div>
  );
};

BulkToolbar.displayName = "BulkToolbar";
