import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'light',
  isDark: false,
  setTheme: () => {},
  toggleDark: () => {},
});

const normalizeTheme = (themeName) => (themeName === 'dark' ? 'dark' : 'light');

const applyTheme = (themeName) => {
  const html = document.documentElement;
  const normalizedTheme = normalizeTheme(themeName);

  html.setAttribute('data-theme', normalizedTheme);
  html.classList.toggle('dark', normalizedTheme === 'dark');
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('light');
  const [mounted, setMounted] = useState(false);
  const isDark = theme === 'dark';

  useEffect(() => {
    setMounted(true);
    const savedTheme = normalizeTheme(localStorage.getItem('theme'));

    setThemeState(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const setTheme = (newTheme) => {
    const normalizedTheme = normalizeTheme(newTheme);
    setThemeState(normalizedTheme);
    localStorage.setItem('theme', normalizedTheme);
    applyTheme(normalizedTheme);
  };

  const toggleDark = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
