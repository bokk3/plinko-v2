import { useState } from 'react';
import { supabase } from '../supabaseClient';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function signUp(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    setUser(data.user);
    return { user: data.user, error };
  }

  async function signIn(email: string, password: string) {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) setError(error.message);
    setUser(data.user);
    return { user: data.user, error };
  }

  async function signOut() {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  }

  return { user, error, loading, signUp, signIn, signOut };
}
