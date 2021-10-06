import { useCallback, useEffect, useState } from "react";

export default function useTheme() {
  const userPreferenceStorageKey = "theme";
  const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
  const userPreference = window.localStorage.getItem(
    userPreferenceStorageKey
  ) as "light" | "dark" | null;
  const [theme, setTheme] = useState<"light" | "dark">(
    userPreference === "light" || userPreference === "dark"
      ? userPreference
      : systemPreference
  );

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme]);

  const handleColorSchemePreferenceChange = useCallback(
    ({ matches }: MediaQueryListEvent) => {
      setTheme(matches ? "dark" : "light");
    },
    []
  );

  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handleColorSchemePreferenceChange);

    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handleColorSchemePreferenceChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem(userPreferenceStorageKey, theme);
  }, [theme]);

  return {
    theme,
    setTheme,
    toggleTheme,
  };
}
