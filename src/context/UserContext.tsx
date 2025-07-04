import React, { createContext, useContext, ReactNode } from 'react';
import { UserData, UserProgress } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface UserContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  toggleFavorite: (hadithId: number) => void;
  updateProgress: (progress: UserProgress) => void;
  getUserProgress: (hadithId: number) => UserProgress | undefined;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const defaultUserData: UserData = {
  favorites: [],
  progress: [],
  totalScore: 0,
  streak: 0,
  lastStudyDate: '',
};

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useLocalStorage<UserData>('arbaeenUserData', defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const toggleFavorite = (hadithId: number) => {
    const isFavorite = userData.favorites.includes(hadithId);
    const newFavorites = isFavorite
      ? userData.favorites.filter(id => id !== hadithId)
      : [...userData.favorites, hadithId];
    
    updateUserData({ favorites: newFavorites });
  };

  const updateProgress = (newProgress: UserProgress) => {
    const existingIndex = userData.progress.findIndex(p => p.hadithId === newProgress.hadithId);
    let updatedProgress;
    
    if (existingIndex >= 0) {
      updatedProgress = [...userData.progress];
      updatedProgress[existingIndex] = newProgress;
    } else {
      updatedProgress = [...userData.progress, newProgress];
    }
    
    updateUserData({ progress: updatedProgress });
  };

  const getUserProgress = (hadithId: number): UserProgress | undefined => {
    return userData.progress.find(p => p.hadithId === hadithId);
  };

  return (
    <UserContext.Provider value={{
      userData,
      updateUserData,
      toggleFavorite,
      updateProgress,
      getUserProgress,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};