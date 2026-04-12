import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'verdant-forest',
  isDark: false,
  setTheme: () => {},
  toggleDark: () => {},
});

export const THEMES = ['verdant-forest', 'light'];

export const THEME_COLORS = {
  'verdant-forest': {
    light: {
      background: '#f8faf9',
      foreground: '#1a2421',
      card: '#ffffff',
      'card-foreground': '#1a2421',
      primary: '#2d5a27',
      'primary-foreground': '#ffffff',
      secondary: '#e8f0e7',
      'secondary-foreground': '#2d4a22',
      muted: '#f1f5f2',
      'muted-foreground': '#4a5752',
      accent: '#4a7c44',
      'accent-foreground': '#ffffff',
      destructive: '#ae2d2d',
      'destructive-foreground': '#ffffff',
      border: '#dce4e0',
      input: '#dce4e0',
      ring: '#2d5a27',
      chart1: '#2d5a27',
      chart2: '#6b8e23',
      chart3: '#8fbc8f',
      chart4: '#20b2aa',
      chart5: '#556b2f',
    },
    dark: {
      background: '#0d1210',
      foreground: '#e8f0ed',
      card: '#161d1b',
      'card-foreground': '#e8f0ed',
      primary: '#5cb353',
      'primary-foreground': '#0a1a08',
      secondary: '#1d2b26',
      'secondary-foreground': '#a8d5ba',
      muted: '#1a2622',
      'muted-foreground': '#a3b8b0',
      accent: '#4a9e43',
      'accent-foreground': '#ffffff',
      destructive: '#e5484d',
      'destructive-foreground': '#ffffff',
      border: '#2a3d37',
      input: '#2a3d37',
      ring: '#5cb353',
      chart1: '#5cb353',
      chart2: '#9acd32',
      chart3: '#66cdaa',
      chart4: '#2e8b57',
      chart5: '#adff2f',
    },
  },
};

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('verdant-forest');
  const [isDark, setIsDarkState] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'verdant-forest';
    const savedDark = localStorage.getItem('isDark') === 'true' || false;

    setThemeState(savedTheme);
    setIsDarkState(savedDark);

    applyTheme(savedTheme, savedDark);
  }, []);

  const applyTheme = (themeName, dark) => {
    const html = document.documentElement;
    html.setAttribute('data-theme', themeName);

    if (dark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  };

  const setTheme = (newTheme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme, isDark);
  };

  const toggleDark = () => {
    const newDark = !isDark;
    setIsDarkState(newDark);
    localStorage.setItem('isDark', newDark);
    applyTheme(theme, newDark);
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
