import { createContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (checked) => {
    setIsDarkMode(checked);
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkMode, setIsDarkMode, handleThemeChange }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
