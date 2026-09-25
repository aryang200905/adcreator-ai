"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // onAuthStateChanged does not fire when only the profile (name/photo)
  // changes, so we expose a manual refresh that re-reads currentUser.
  const refreshUser = async () => {
    if (!auth.currentUser) return;
    await auth.currentUser.reload();
    const current = auth.currentUser;
    // Clone with the same prototype so a new reference triggers re-render
    // while preserving User methods.
    setUser(
      current
        ? Object.assign(
            Object.create(Object.getPrototypeOf(current)),
            current
          )
        : null
    );
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
