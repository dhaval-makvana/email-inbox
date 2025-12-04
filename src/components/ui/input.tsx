import { cn } from "@/lib/utils";

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "border text-sm rounded-md px-3 py-2 bg-white dark:bg-gray-900 outline-none w-full transition",
        "focus:ring-2 focus:ring-primary",
        className
      )}
      {...props}
    />
  );
}
