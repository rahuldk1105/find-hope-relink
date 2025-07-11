
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone?: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone?: string) => {
    console.log('SignUp attempt for:', email);
    
    try {
      // Sign up with email redirect
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name,
            phone,
            role: 'relative'
          }
        }
      });

      console.log('SignUp response:', { data: data?.user?.email, error });

      if (!error && data.user) {
        // Create user profile
        console.log('Creating user profile for:', data.user.id);
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            name,
            email,
            phone: phone || null,
            role: 'relative'
          }]);
        
        if (profileError) {
          console.error('Profile creation error:', profileError);
        } else {
          console.log('User profile created successfully');
        }
      }

      return { error };
    } catch (err: any) {
      console.error('SignUp unexpected error:', err);
      return { error: err };
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('SignIn attempt for:', email);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      console.log('SignIn response error:', error);
      return { error };
    } catch (err: any) {
      console.error('SignIn unexpected error:', err);
      return { error: err };
    }
  };

  const signOut = async () => {
    console.log('SignOut attempt');
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
};
