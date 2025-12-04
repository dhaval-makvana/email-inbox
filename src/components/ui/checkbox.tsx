import { cn } from "@/lib/utils";

export function Checkbox(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "w-4 h-4 rounded border-gray-400 text-primary",
        "focus:ring-primary focus:ring-2"
      )}
      {...props}
    />
  );
}
