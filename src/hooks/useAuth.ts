import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: displayName
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

  const signInAnonymously = async () => {
    const { error } = await supabase.auth.signInAnonymously();
    return { error };
  };

  const signOut = async () => {
    // Clear guest session data before signing out
    localStorage.removeItem('guest_session_id');
    localStorage.removeItem('guest_prompts');
    
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  // Helper to check if user is anonymous/guest
  const isGuest = session?.user?.is_anonymous || false;
  
  // Helper to get or create guest session ID
  const getGuestSessionId = () => {
    if (!isGuest && !session) {
      let guestId = localStorage.getItem('guest_session_id');
      if (!guestId) {
        guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem('guest_session_id', guestId);
      }
      return guestId;
    }
    return null;
  };

  return {
    user,
    session,
    loading,
    isGuest,
    getGuestSessionId,
    signUp,
    signIn,
    signInAnonymously,
    signOut
  };
};