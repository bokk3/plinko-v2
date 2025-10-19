import Navbar from '../components/Navbar';
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Profile() {
  const [profile, setProfile] = useState<{ email: string; credits: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('email, credits')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          setProfile(data);
        }
      }
      setLoading(false);
    }
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-xl shadow flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-indigo-700">Profile</h1>
        {loading ? (
          <div>Loading...</div>
        ) : profile ? (
          <div className="flex flex-col gap-6 w-full items-center">
            <div className="text-lg font-semibold">Email: <span className="text-indigo-600">{profile.email}</span></div>
            <div className="text-lg font-semibold">Credits: <span className="text-green-600">{profile.credits}</span></div>
            {/* Add more profile settings here */}
          </div>
        ) : (
          <div>Profile not found.</div>
        )}
      </div>
    </div>
  );
}
