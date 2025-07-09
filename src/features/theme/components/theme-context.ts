// Minimal theme-context stub
import React from "react";
export type Theme = "light" | "dark" | "system";

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);
