import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { getUserProfile, logoutUser } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUid = useRef(null);
  const profileRequest = useRef(0);

  async function loadProfile(firebaseUser) {
    const requestId = ++profileRequest.current;
    if (!firebaseUser) {
      setProfile(null);
      return null;
    }
    const data = await getUserProfile(firebaseUser.uid);
    if (currentUid.current === firebaseUser.uid && profileRequest.current === requestId) setProfile(data);
    return data;
  }

  async function refreshProfile() {
    if (!auth.currentUser) return null;
    const data = await loadProfile(auth.currentUser);
    setError("");
    return data;
  }

  async function logout() {
    await logoutUser();
    currentUid.current = null;
    profileRequest.current += 1;
    setUser(null);
    setProfile(null);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      const uid = firebaseUser?.uid || null;
      try {
        setLoading(true);
        setError("");
        currentUid.current = firebaseUser?.uid || null;
        setProfile(null);
        setUser(firebaseUser || null);
        if (firebaseUser) {
          await loadProfile(firebaseUser);
        } else {
          setProfile(null);
        }
      } catch (error) {
        if (currentUid.current === uid) {
          setError("Unable to load your account. Please reload to try again.");
          setProfile(null);
        }
      } finally {
        if (currentUid.current === uid) setLoading(false);
      }
    });
    return () => { currentUid.current = null; unsubscribe(); };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        logout,
        refreshProfile,
        isAuthenticated: Boolean(user && profile?.status === "active"),
        isAdmin: profile?.role === "admin" && profile?.status === "active",
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
