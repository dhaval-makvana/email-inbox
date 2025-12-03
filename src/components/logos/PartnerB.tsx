"use client";
import * as React from "react";

export const PartnerBLogo = React.memo(({ size = 32 }: { size?: number }) => {
  const width = Math.max(32, size * 3.5);
  const height = size;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Partner B logo"
    >
      <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
      {/* white-ish circle in contrast color */}
      <circle cx="16" cy="16" r="6" fill="var(--color-primary-contrast)" />
      <text
        x="40"
        y="21"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="14"
        fill="var(--color-fg)"
      >
        Partner B
      </text>
    </svg>
  );
});
PartnerBLogo.displayName = "PartnerBLogo";
