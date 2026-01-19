"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({
  className = "",
  showLabel = false,
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full transition-all duration-300 hover:scale-110 ${className}`}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-card)",
        color: "var(--text-accent)",
        boxShadow: "var(--shadow-button)",
      }}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="flex items-center gap-2">
        {isDark ? <Moon size={20} /> : <Sun size={20} />}
        {showLabel && (
          <span className="text-sm font-medium">
            {isDark ? "Dark" : "Light"}
          </span>
        )}
      </div>
    </button>
  );
}
