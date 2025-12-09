import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  profile: { name: string; age: number } | null;
  updateProfile: (profile: { name: string; age: number }) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; age: number } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Fetch profile from Firestore
        const { getDoc, doc, setDoc } = await import('firebase/firestore');
        const { db } = await import('@/firebase');
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setProfile({ name: data.name || '', age: data.age || 0 });
        } else {
          // Create default profile if not exists
          const defaultProfile = { name: user.email?.split('@')[0] || 'User', age: 18 };
          await setDoc(ref, defaultProfile);
          setProfile(defaultProfile);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Create default profile
    const { setDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@/firebase');
    await setDoc(doc(db, 'users', cred.user.uid), { name: email.split('@')[0], age: 18 });
  };
  const updateProfile = async (profileData: { name: string; age: number }) => {
    if (!user) return;
    const { updateDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@/firebase');
    const ref = doc(db, 'users', user.uid);
    await updateDoc(ref, profileData);
    setProfile(profileData);
  };

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, loading, profile, updateProfile, signUp, signIn, signOutUser }}>
      {children}
    </AuthContext.Provider>
  );
};
