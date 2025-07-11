
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
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch or create gym profile when user logs in
          setTimeout(async () => {
            await fetchOrCreateGymProfile(session.user.id);
          }, 0);
        } else {
          setGymProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchOrCreateGymProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchOrCreateGymProfile = async (userId: string) => {
    try {
      console.log('Fetching gym profile for user:', userId);
      
      // First try to fetch existing gym profile
      const { data, error } = await supabase
        .from('gym_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching gym profile:', error);
        return;
      }

      if (data) {
        console.log('Found existing gym profile:', data);
        setGymProfile(data as GymProfile);
      } else {
        console.log('No gym profile found, creating one...');
        // Create gym profile if it doesn't exist
        const { data: newProfile, error: createError } = await supabase
          .from('gym_profiles')
          .insert([{
            user_id: userId,
            gym_name: 'My Gym'
          }])
          .select()
          .single();

        if (createError) {
          console.error('Error creating gym profile:', createError);
          return;
        }

        console.log('Created new gym profile:', newProfile);
        setGymProfile(newProfile as GymProfile);
      }
    } catch (error) {
      console.error('Error in fetchOrCreateGymProfile:', error);
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

    console.log('Updating gym profile with:', updates);

    const { data, error } = await supabase
      .from('gym_profiles')
      .update(updates)
      .eq('id', gymProfile.id)
      .select()
      .single();

    if (!error && data) {
      console.log('Updated gym profile:', data);
      setGymProfile(data as GymProfile);
    } else if (error) {
      console.error('Error updating gym profile:', error);
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
