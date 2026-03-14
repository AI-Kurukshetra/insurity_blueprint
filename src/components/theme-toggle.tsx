"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const storageKey = "smartclaim-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  window.localStorage.setItem(storageKey, theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "light";
    }

    const activeTheme = document.documentElement.dataset.theme;
    return activeTheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function handleToggle() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      className="inline-flex min-h-10 items-center justify-center rounded-full border border-white/25 bg-white/12 px-4 py-2 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(15,23,42,0.18)] transition hover:border-[#f3d27a] hover:bg-[#f3d27a] hover:text-stone-950"
    >
      {theme === "light" ? "Dark mode" : "Light mode"}
    </button>
  );
}
