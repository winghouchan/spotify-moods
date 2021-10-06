import React from "react";
import { useTheme } from ".";

export default React.createContext<
  Omit<ReturnType<typeof useTheme>, "setTheme">
>({
  theme: "light",
  toggleTheme() {},
});
