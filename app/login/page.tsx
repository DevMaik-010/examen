"use client";

import Login from "@/components/login";
import ThemeToggle from "@/components/ThemeToggle";

export default function LoginPage() {

  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-500"
      style={{
        background: "var(--bg-primary)",
      }}
    >
      {/* Login Card */}
      <Login />

      {/* Theme Toggle Button */}
      <ThemeToggle className="fixed bottom-6 right-6 theme-toggle" />
    </div>
  );
}
