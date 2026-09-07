import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { Permission, Role, UserProfile } from '../types';
import { hasPermission } from '../permissions';

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  role: Role | undefined;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<UserProfile | null>;
  getIdToken: () => Promise<string | null>;
  setSession: (userProfile: UserProfile, token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async (uid: string, userEmail?: string): Promise<UserProfile | null> => {
    try {
      const userDocRef = doc(db, 'users', uid);
      let docSnap = await getDoc(userDocRef);

      // Fallback: If doc doesn't exist under UID yet, check by email and migrate/link it
      if (!docSnap.exists() && userEmail) {
        try {
          const q = query(collection(db, 'users'), where('email', '==', userEmail.trim().toLowerCase()));
          const emailSnap = await getDocs(q);
          if (!emailSnap.empty) {
            const existingData = emailSnap.docs[0].data() as UserProfile;
            const migratedProfile = { ...existingData, id: uid };
            await setDoc(userDocRef, migratedProfile, { merge: true });
            docSnap = await getDoc(userDocRef);
          }
        } catch (e) {
          console.warn('Could not query users by email fallback:', e);
        }
      }

      if (docSnap.exists()) {
        const data = docSnap.data() as UserProfile;
        const userProfile = { ...data, id: docSnap.id };

        // Update last login timestamp if active
        if (data.status === 'ACTIVE') {
          try {
            await updateDoc(userDocRef, {
              lastLoginAt: new Date().toISOString(),
            });
          } catch (e) {
            console.warn('Could not update last login timestamp:', e);
          }
        }

        setProfile(userProfile);
        return userProfile;
      } else {
        console.warn('No Firestore user profile found for UID:', uid);
        setProfile(null);
        return null;
      }
    } catch (err: any) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile permissions.');
      setProfile(null);
      return null;
    }
  };

  const setSession = (userProfile: UserProfile, token: string) => {
    localStorage.setItem('stargaze_auth_token', token);
    localStorage.setItem('stargaze_auth_user', JSON.stringify(userProfile));
  };

  useEffect(() => {
    // Canonical Firebase Auth session listener - source of truth
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchUserProfile(currentUser.uid, currentUser.email || undefined);
      } else {
        // Unauthenticated in Firebase Auth -> Clear all session states
        setUser(null);
        setProfile(null);
        localStorage.removeItem('stargaze_auth_token');
        localStorage.removeItem('stargaze_auth_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const refreshProfile = async () => {
    const currentUid = auth.currentUser?.uid || user?.uid;
    if (currentUid) {
      const updated = await fetchUserProfile(currentUid, auth.currentUser?.email || user?.email);
      if (updated) {
        localStorage.setItem('stargaze_auth_user', JSON.stringify(updated));
      }
      return updated;
    }
    return null;
  };

  const getIdToken = async () => {
    if (user && typeof user.getIdToken === 'function') {
      return await user.getIdToken(/* forceRefresh */ true);
    }
    return localStorage.getItem('stargaze_auth_token');
  };

  const handleSignOut = async () => {
    try {
      localStorage.removeItem('stargaze_auth_token');
      localStorage.removeItem('stargaze_auth_user');
      await firebaseSignOut(auth);
      setUser(null);
      setProfile(null);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setUser(null);
      setProfile(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        role: profile?.role,
        loading,
        error,
        signOut: handleSignOut,
        refreshProfile,
        getIdToken,
        setSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useUser = () => {
  const { user, profile } = useAuth();
  return { user, profile };
};

export const useRole = (): Role | undefined => {
  const { profile } = useAuth();
  return profile?.role;
};

export const usePermission = (permission: Permission): boolean => {
  const { profile } = useAuth();
  if (!profile || profile.status !== 'ACTIVE') return false;
  return hasPermission(profile.role, permission);
};

export const usePermissions = (): ((permission: Permission) => boolean) => {
  const { profile } = useAuth();
  return (permission: Permission) => {
    if (!profile || profile.status !== 'ACTIVE') return false;
    return hasPermission(profile.role, permission);
  };
};
