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

  if (!partner.features.bulkToolbar) return null;

  return (
    <div className="p-2 border-b flex items-center gap-3 bg-slate-50">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          aria-label="select-all"
          onChange={onToggleSelectAll}
          checked={allVisibleSelected}
          ref={(el) => {
            if (!el) return;
            // set indeterminate for partial selection
            (el as HTMLInputElement).indeterminate =
              !allVisibleSelected && someVisibleSelected;
          }}
        />
        <span className="text-sm">{selectedIds.length} selected</span>
      </div>

      <div className="flex gap-2 ml-4">
        <button
          className="btn px-3 py-1"
          onClick={() => onMarkRead(selectedIds, true)}
          disabled={selectedIds.length === 0}
        >
          Mark Read
        </button>

        <button
          className="btn px-3 py-1"
          onClick={() => onMarkRead(selectedIds, false)}
          disabled={selectedIds.length === 0}
        >
          Mark Unread
        </button>

        {partner.features.markAsSpam && (
          <button
            className="btn px-3 py-1"
            onClick={() => onMarkSpam(selectedIds)}
            disabled={selectedIds.length === 0}
          >
            Mark Spam
          </button>
        )}

        <button
          className="btn px-3 py-1"
          onClick={() => onDelete(selectedIds)}
          disabled={selectedIds.length === 0}
        >
          Delete
        </button>
      </div>

      <div className="ml-auto text-sm text-slate-500">
        {totalCount} messages
      </div>
    </div>
  );
};
