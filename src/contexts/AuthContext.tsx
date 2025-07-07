
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface GymProfile {
  id: string;
  user_id: string;
  gym_name: string;
  gym_address?: string;
  gym_phone?: string;
  gym_email?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  gymProfile: GymProfile | null;
  loading: boolean;
  signUp: (email: string, password: string, gymName: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateGymProfile: (updates: Partial<GymProfile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [gymProfile, setGymProfile] = useState<GymProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch gym profile when user logs in
          setTimeout(async () => {
            await fetchGymProfile(session.user.id);
          }, 0);
        } else {
          setGymProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchGymProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchGymProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('gym_profiles' as any)
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching gym profile:', error);
        return;
      }

      setGymProfile(data as GymProfile);
    } catch (error) {
      console.error('Error fetching gym profile:', error);
    }
  };

  const signUp = async (email: string, password: string, gymName: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          gym_name: gymName
        }
      }
    });

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const updateGymProfile = async (updates: Partial<GymProfile>) => {
    if (!gymProfile) return { error: new Error('No gym profile found') };

    const { data, error } = await supabase
      .from('gym_profiles' as any)
      .update(updates as any)
      .eq('id', gymProfile.id)
      .select()
      .single();

    if (!error && data) {
      setGymProfile(data as GymProfile);
    }

    return { error };
  };

  const value = {
    user,
    session,
    gymProfile,
    loading,
    signUp,
    signIn,
    signOut,
    updateGymProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
