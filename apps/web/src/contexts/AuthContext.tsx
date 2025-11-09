import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'super_admin' | 'admin' | 'school_admin' | 'user';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: UserRole | null;
  schoolId: string | null;
  loading: boolean;
  isAdmin: boolean;
  isSchoolAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any; data: any }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: any; data: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [schoolId, setSchoolId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch school_id for school admins
  const fetchSchoolId = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('school_admins')
        .select('school_id')
        .eq('user_id', userId)
        .maybeSingle(); // Use maybeSingle() instead of single() to handle no rows gracefully
      
      if (error) {
        console.error('Error fetching school_id:', error);
        setSchoolId(null);
        return;
      }
      
      if (data) {
        setSchoolId(data.school_id);
      } else {
        setSchoolId(null);
      }
    } catch (err) {
      console.error('Exception fetching school_id:', err);
      setSchoolId(null);
    }
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractRole(session?.user));
      if (session?.user) {
        fetchSchoolId(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setUserRole(extractRole(session?.user));
      if (session?.user) {
        fetchSchoolId(session.user.id);
      } else {
        setSchoolId(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const extractRole = (user: User | null | undefined): UserRole | null => {
    if (!user) return null;
    const role = user.user_metadata?.role;
    return role || 'user';
  };

  const isAdmin = userRole === 'super_admin' || userRole === 'admin';
  const isSchoolAdmin = isAdmin || userRole === 'school_admin';

  const signIn = async (email: string, password: string) => {
    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error, data };
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    const { error, data } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...metadata,
          role: metadata?.role || 'school_admin', // Default role for new signups
        },
      },
    });
    return { error, data };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = {
    user,
    session,
    userRole,
    schoolId,
    loading,
    isAdmin,
    isSchoolAdmin,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
