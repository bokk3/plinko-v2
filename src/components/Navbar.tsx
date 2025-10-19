import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [profile, setProfile] = useState<{ email: string; credits: number } | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProfile() {
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
    }
    fetchProfile();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setLoggedIn(false);
    setProfile(null);
    navigate('/');
  }

  return (
    <nav className="w-full bg-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow">
      <div className="font-bold text-xl">Plinko v2</div>
      {profile ? (
        <div className="flex gap-6 items-center">
          <span className="font-semibold">{profile.email}</span>
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
