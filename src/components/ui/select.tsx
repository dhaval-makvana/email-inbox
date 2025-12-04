import { cn } from "@/lib/utils";

export function Select({
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "border rounded px-2 py-1 text-sm bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
}
