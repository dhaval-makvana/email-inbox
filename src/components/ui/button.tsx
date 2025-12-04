import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonStyles = cva(
  // base
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // brand-colored, uses partner theme via --color-primary
        primary:
          "px-3 py-1.5 border shadow-sm " +
          "bg-[var(--color-primary)] text-[var(--color-primary-contrast)] border-[var(--color-primary)] " +
          "hover:opacity-90",

        // neutral surface button
        secondary:
          "px-3 py-1.5 border shadow-sm " +
          "bg-[var(--color-surface)] text-[var(--color-fg)] border-[var(--color-border)] " +
          "hover:bg-[var(--surface-elev-2)]",

        // destructive, uses spam tokens
        danger:
          "px-3 py-1.5 border shadow-sm " +
          "bg-[var(--spam-bg)] text-[var(--spam-fg)] border-[var(--spam-bg)] " +
          "hover:opacity-90",

        // low-emphasis, usually for subtle actions
        ghost:
          "px-2.5 py-1 border border-transparent " +
          "bg-transparent text-[var(--color-fg)] " +
          "hover:bg-[var(--surface-elev-1)]",
      },
      size: {
        sm: "text-xs px-2 py-1",
        md: "text-sm px-3 py-1.5",
        lg: "text-base px-4 py-2",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonStyles({ variant, size, fullWidth }), className)}
      {...props}
    />
  )
);

Button.displayName = "Button";
