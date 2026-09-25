"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-foreground/5 hover:text-foreground transition-all text-sm font-medium whitespace-nowrap ${
        collapsed && "lg:justify-center lg:px-0"
      }`}
    >
      {isDark ? (
        <Sun size={18} className="shrink-0" />
      ) : (
        <Moon size={18} className="shrink-0" />
      )}
      <span
        className={`transition-opacity duration-200 ${
          collapsed ? "lg:hidden opacity-100" : "opacity-100"
        }`}
      >
        {isDark ? "Light mode" : "Dark mode"}
      </span>
    </button>
  );
}
