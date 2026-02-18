"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile, type UserData } from "@/lib/storage";
import { checkAndSetAdminRole } from "@/lib/admin";

interface AuthContextType {
  user: User | null;
  userProfile: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAdmin: false,
  refreshProfile: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  async function fetchProfile(firebaseUser: User) {
    const profile = await getUserProfile(firebaseUser.uid);
    setUserProfile(profile);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchProfile(firebaseUser);
        if (firebaseUser.email) {
          const admin = await checkAndSetAdminRole(
            firebaseUser.uid,
            firebaseUser.email
          );
          setIsAdmin(admin);
        } else {
          setIsAdmin(false);
        }
      } else {
        setUserProfile(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  async function refreshProfile() {
    if (user) {
      await fetchProfile(user);
    }
  }

  return (
    <AuthContext.Provider value={{ user, userProfile, loading, isAdmin, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
