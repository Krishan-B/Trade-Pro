import React, { useEffect, useState } from "react";
import { ThemeContext, type Theme } from "./theme-context";
import { getInitialTheme } from "./themeUtils";
import { ErrorHandler } from "@/services/errorHandling";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  // Apply theme class to document
  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (error) {
      ErrorHandler.handleError({
        code: "data_refresh_error",
        message: "Failed to save theme preference",
        details: error,
        retryable: false,
      });
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
