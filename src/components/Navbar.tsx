import { useEffect, useState, useCallback } from 'react';
import { useRegisterCreditsRefresh } from './CreditsContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [profile, setProfile] = useState<{ email: string; credits: number } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const fetchProfile = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setLoggedIn(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('email, credits')
        .eq('id', user.id)
        .single();
      if (!error && data) {
        setProfile(data);
      }
    } else {
      setLoggedIn(false);
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    // Poll for credits every second for near-realtime updates
    const interval = setInterval(fetchProfile, 1000);
    return () => clearInterval(interval);
  }, [fetchProfile]);

  // Register refresh function for CreditsContext
  useRegisterCreditsRefresh(fetchProfile);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setProfile(null);
    navigate('/');
  }

  return (
    <nav className="w-full bg-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow">
      <div className="font-bold text-xl flex items-center gap-6">
        Plinko v2
        <Link
          to="/games"
          className="bg-white/20 border border-white/30 text-white px-4 py-1 rounded-full font-semibold shadow hover:bg-white/40 hover:text-indigo-900 transition-colors text-base"
        >
          Games
        </Link>
      </div>
      {profile ? (
        <div className="flex gap-6 items-center">
          <Link
            to="/profile"
            className="bg-white/20 border border-white/30 text-white px-4 py-1 rounded-full font-semibold shadow hover:bg-white/40 hover:text-indigo-900 transition-colors text-base"
          >
            {profile.email}
          </Link>
          <span className="bg-white text-indigo-600 px-4 py-1 rounded-full font-bold">Credits: {profile.credits}</span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded font-semibold ml-4"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      ) : !loggedIn ? (
        <button
          className="bg-white text-indigo-600 px-4 py-1 rounded font-semibold"
          onClick={() => navigate('/login')}
        >
          Login
        </button>
      ) : null}
    </nav>
  );
}
