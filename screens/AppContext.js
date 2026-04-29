import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext(null);

const PROFILE_KEY = '@floodwatch_profile';

const DEFAULT_PROFILE = {
  name: 'Angel Vargas',
  address: 'Quezon City Metro Manila',
  avatarUri: null,
};

export function AppProvider({ children }) {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);

  useEffect(() => {
    AsyncStorage.getItem(PROFILE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            setProfile((prev) => ({ ...prev, ...JSON.parse(raw) }));
          } catch {}
        }
      })
      .catch(() => {});
  }, []);

  const updateProfile = (updates) => {
    setProfile((prev) => {
      const next = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  };

  return (
    <AppContext.Provider value={{ profile, updateProfile }}>
      {children}
    </AppContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useProfile must be used inside <AppProvider>');
  return ctx;
}