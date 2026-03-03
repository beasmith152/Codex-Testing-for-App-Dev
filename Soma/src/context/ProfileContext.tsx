import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ProfileContextType = {
  profileUri: string | null;
  setProfileUri: (uri: string | null) => Promise<void>;
  isProfileLoaded: boolean;
};

const PROFILE_STORAGE_KEY = "profilePicUri";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileUri, setProfileUriState] = useState<string | null>(null);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const saved = await AsyncStorage.getItem(PROFILE_STORAGE_KEY);
        if (saved) {
          setProfileUriState(saved);
        }
      } catch (error) {
        console.warn("Could not load profile URI:", error);
      } finally {
        setIsProfileLoaded(true);
      }
    };

    loadProfile();
  }, []);

  const setProfileUri = async (uri: string | null) => {
    setProfileUriState(uri);
    try {
      if (uri) {
        await AsyncStorage.setItem(PROFILE_STORAGE_KEY, uri);
      } else {
        await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn("Unable to persist profile URI:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ profileUri, setProfileUri, isProfileLoaded }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
