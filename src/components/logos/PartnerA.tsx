"use client";
import * as React from "react";

export const PartnerALogo = React.memo(({ size = 32 }: { size?: number }) => {
  const width = Math.max(32, size * 3.5); // keep text visible
  const height = size;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 32"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Partner A logo"
    >
      <rect width="32" height="32" rx="6" fill="var(--color-primary)" />
      {/* Chevron / icon in contrast color */}
      <path d="M12 20 L16 12 L20 20 Z" fill="var(--color-primary-contrast)" />
      <text
        x="40"
        y="21"
        fontFamily="Inter, Arial, sans-serif"
        fontSize="14"
        fill="var(--color-fg)"
      >
        Partner A
      </text>
    </svg>
  );
});
PartnerALogo.displayName = "PartnerALogo";
