import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface SettingsContextType {
  darkMode: boolean;
  fontSize: 'small' | 'medium' | 'large';
  autoPlay: boolean;
  showTranslation: boolean;
  toggleDarkMode: () => void;
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  setAutoPlay: (enabled: boolean) => void;
  setShowTranslation: (show: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const defaultSettings = {
  darkMode: false,
  fontSize: 'medium' as const,
  autoPlay: false,
  showTranslation: true,
};

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useLocalStorage('arbaeenSettings', defaultSettings);

  const toggleDarkMode = () => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }));
  };

  const setFontSize = (fontSize: 'small' | 'medium' | 'large') => {
    setSettings(prev => ({ ...prev, fontSize }));
  };

  const setAutoPlay = (autoPlay: boolean) => {
    setSettings(prev => ({ ...prev, autoPlay }));
  };

  const setShowTranslation = (showTranslation: boolean) => {
    setSettings(prev => ({ ...prev, showTranslation }));
  };

  return (
    <SettingsContext.Provider value={{
      ...settings,
      toggleDarkMode,
      setFontSize,
      setAutoPlay,
      setShowTranslation,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};