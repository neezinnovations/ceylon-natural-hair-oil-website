import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserProfile, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function loadProfile(firebaseUser) {
    if (!firebaseUser) {
      setProfile(null);
      return null;
    }
    const data = await getUserProfile(firebaseUser.uid);
    setProfile(data);
    return data;
  }

  async function refreshProfile() {
    if (!user) return null;
    return loadProfile(user);
  }

  async function logout() {
    await logoutUser();
    setUser(null);
    setProfile(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        setLoading(true);
        setUser(firebaseUser || null);
        if (firebaseUser) {
          await loadProfile(firebaseUser);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth profile load failed:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        logout,
        refreshProfile,
        isAuthenticated: Boolean(user),
        isAdmin: profile?.role === "admin",
        isCustomer: profile?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider.");
  return value;
}
