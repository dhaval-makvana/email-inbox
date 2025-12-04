import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex px-2 py-0.5 rounded-full text-xs font-medium",
  {
    variants: {
      intent: {
        default: "bg-[var(--surface)] text-[var(--color-fg)]",
        spam: "bg-red-100 text-red-700 dark:bg-red-700 dark:text-white",
        partner:
          "bg-[var(--color-primary)] text-[var(--color-primary-contrast)]",
      },
    },
    defaultVariants: {
      intent: "default",
    },
  }
);

export function Badge({
  className,
  intent,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  intent?: "default" | "spam" | "partner";
}) {
  return (
    <span className={cn(badgeVariants({ intent }), className)} {...props} />
  );
}
