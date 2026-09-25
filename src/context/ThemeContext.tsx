"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore<Theme>(
    (listener) => {
      const sync = (event: StorageEvent) => {
        if (event.key !== "theme" && event.key !== null) return;
        const next = event.newValue === "light" ? "light" : "dark";
        document.documentElement.classList.toggle("dark", next === "dark");
        document.documentElement.style.colorScheme = next;
        listener();
      };
      window.addEventListener("themechange", listener); window.addEventListener("storage", sync);
      return () => { window.removeEventListener("themechange", listener); window.removeEventListener("storage", sync); };
    },
    () => document.documentElement.classList.contains("dark") ? "dark" : "light",
    () => "dark"
  );

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    root.classList.toggle("dark", t === "dark");
    root.style.colorScheme = t;
    try {
      localStorage.setItem("theme", t);
    } catch {
      /* ignore private-mode storage errors */
    }
  };

  const setTheme = (t: Theme) => {
    applyTheme(t);
    window.dispatchEvent(new Event("themechange"));
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
