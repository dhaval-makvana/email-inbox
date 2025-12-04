import { cn } from "@/lib/utils";
import React from "react";

export const H1 = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h1 className={cn("text-2xl font-bold tracking-tight", className)} {...props}>
    {children}
  </h1>
);

export const H2 = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2 className={cn("text-xl font-semibold", className)} {...props}>
    {children}
  </h2>
);

export const H3 = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn("text-lg font-medium", className)} {...props}>
    {children}
  </h3>
);

export const Text = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-slate-700 dark:text-slate-300", className)}
    {...props}
  >
    {children}
  </p>
);

export const Muted = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    className={cn("text-xs text-slate-500 dark:text-slate-400", className)}
    {...props}
  >
    {children}
  </span>
);
