// ThemeContext.js
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const fetchThemeStatus = async () => {
      try {
        // Fetch theme status from the backend
        const response = await axios.get("/api/getThemeStatus");
        const [{ theme }] = response.data; // Assuming response.data is an array with one object containing theme
        setIsDarkTheme(theme === "dark"); // Set theme based on fetched status
      } catch (error) {
        console.error("Failed to fetch theme status:", error);
      }
    };

    fetchThemeStatus(); // Fetch theme status when component mounts
  }, []);

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};