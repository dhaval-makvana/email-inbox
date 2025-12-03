"use client";

import React, { useEffect, useState } from "react";

/**
 * Theme value type.
 * 'light' | 'dark' are explicit choices. 'system' means follow OS.
 */
type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "color-scheme";

/** helper: read persisted or system preference */
function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const raw = localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  // default to system if available
  return "system";
}

function isSystemDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  // apply theme on change
  useEffect(() => {
    if (typeof window === "undefined") return;

    const apply = (t: Theme) => {
      if (t === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-color-scheme", "dark");
      } else if (t === "light") {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-color-scheme", "light");
      } else {
        // system
        if (isSystemDark()) {
          document.documentElement.classList.add("dark");
          document.documentElement.setAttribute("data-color-scheme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.setAttribute("data-color-scheme", "light");
        }
      }
    };

    apply(theme);

    // if using "system", listen to changes
    let mql: MediaQueryList | null = null;
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        apply("system");
      }
    };
    try {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener?.("change", handleChange);
      mql.addListener?.(handleChange); // fallback
    } catch (e) {
      // ignore
    }

    return () => {
      try {
        mql?.removeEventListener?.("change", handleChange);
        mql?.removeListener?.(handleChange);
      } catch {}
    };
  }, [theme]);

  const setAndPersist = (t: Theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, t);
    } catch {}
    setTheme(t);
  };

  // simple toggle UI: dark <-> light. Long press or expand for 'system' if you want.
  const toggle = () => {
    setAndPersist(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center gap-2">
      <button
        aria-pressed={theme === "dark"}
        title={
          theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        }
        onClick={toggle}
        className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm bg-[var(--surface-elev-1)]"
      >
        {/* simple icons (sun/moon) using Unicode for minimal deps. Replace with svg if you want. */}
        <span aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
        <span className="sr-only">Toggle dark mode</span>
      </button>

      {/* optional: quick dropdown to choose system setting */}
      <select
        value={theme}
        onChange={(e) => setAndPersist(e.target.value as Theme)}
        className="border rounded px-2 py-1 text-sm bg-[var(--surface-elev-1)]"
        aria-label="Theme preference"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
