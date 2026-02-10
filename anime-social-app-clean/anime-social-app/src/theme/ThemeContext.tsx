import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Theme, ThemeMode } from '../types';
import { lightTheme, darkTheme, paperTheme } from './colors';

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');

  const getTheme = (mode: ThemeMode): Theme => {
    switch (mode) {
      case 'dark':
        return darkTheme;
      case 'paper':
        return paperTheme;
      default:
        return lightTheme;
    }
  };

  const theme = getTheme(themeMode);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
