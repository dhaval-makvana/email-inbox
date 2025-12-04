"use client";

import React, { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";
const STORAGE_KEY = "color-scheme";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";
  const raw = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return "system";
}

function isSystemDark() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  // hydrate initial theme from storage / system
  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  // apply theme whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const apply = (t: Theme) => {
      const root = document.documentElement;

      const setDark = () => {
        root.classList.add("dark");
        root.setAttribute("data-color-scheme", "dark");
      };

      const setLight = () => {
        root.classList.remove("dark");
        root.setAttribute("data-color-scheme", "light");
      };

      if (t === "dark") {
        setDark();
      } else if (t === "light") {
        setLight();
      } else {
        // system
        if (isSystemDark()) setDark();
        else setLight();
      }
    };

    apply(theme);

    // if theme is "system", react to OS changes
    let mql: MediaQueryList | null = null;
    const handleChange = () => {
      if (theme === "system") {
        apply("system");
      }
    };

    try {
      mql = window.matchMedia("(prefers-color-scheme: dark)");
      mql.addEventListener?.("change", handleChange);
      mql.addListener?.(handleChange); // older Safari/Chrome
    } catch {
      // ignore
    }

    return () => {
      try {
        mql?.removeEventListener?.("change", handleChange);
        mql?.removeListener?.(handleChange);
      } catch {
        // ignore
      }
    };
  }, [theme]);

  const setAndPersist = (t: Theme) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, t);
    } catch {
      // ignore
    }
    setTheme(t);
  };

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
        className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm bg-(--surface-elev-1) cursor-pointer"
      >
        <span aria-hidden>{theme === "dark" ? "🌙" : "☀️"}</span>
        <span className="sr-only">Toggle dark mode</span>
      </button>

      <select
        value={theme}
        onChange={(e) => setAndPersist(e.target.value as Theme)}
        className="border rounded px-2 py-1 text-sm bg-(--surface-elev-1) cursor-pointer"
        aria-label="Theme preference"
      >
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </div>
  );
}
