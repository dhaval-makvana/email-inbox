"use client";
import React from "react";
import { usePartner } from "./PartnerContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
    <div
      className="px-3 py-2 border-b flex items-center gap-3 bg-surface"
      style={{ borderColor: "var(--color-border)" }}
    >
      {/* Left: selection + count */}
      <div className="flex items-center gap-2">
        <Checkbox
          aria-label="select-all"
          checked={allVisibleSelected}
          onChange={onToggleSelectAll}
        />
        <span className="text-xs" style={{ color: "var(--color-muted)" }}>
          {selectedIds.length} selected
        </span>
      </div>

      {/* Middle: actions */}
      <div className="flex gap-2 ml-4">
        <Button
          size="sm"
          variant="primary"
          onClick={() => onMarkRead(selectedIds, true)}
          disabled={!hasSelection}
        >
          Mark Read
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={() => onMarkRead(selectedIds, false)}
          disabled={!hasSelection}
        >
          Mark Unread
        </Button>

        {partner.features.markAsSpam && (
          <Button
            size="sm"
            variant="secondary"
            onClick={() => onMarkSpam(selectedIds)}
            disabled={!hasSelection}
          >
            Mark Spam
          </Button>
        )}

        <Button
          size="sm"
          variant="danger"
          onClick={() => onDelete(selectedIds)}
          disabled={!hasSelection}
        >
          Delete
        </Button>
      </div>

      {/* Right: total count */}
      <div className="ml-auto text-xs" style={{ color: "var(--color-muted)" }}>
        {totalCount} messages
      </div>
    </div>
  );
};

BulkToolbar.displayName = "BulkToolbar";
