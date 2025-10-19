import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const { user, error, loading, signUp, signIn, signOut } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === 'login') {
      await signIn(email, password);
    } else {
      await signUp(email, password);
    }
  }

  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-xl shadow">
      {user ? (
        <div className="text-center">
          <p className="mb-4">Logged in as <b>{user.email}</b></p>
          <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={signOut}>Sign Out</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold mb-4 text-center">{mode === 'login' ? 'Login' : 'Sign Up'}</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold"
            disabled={loading}
          >
            {loading ? 'Loading...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </button>
          <p className="text-center text-sm mt-2">
            {mode === 'login' ? (
              <span>Don't have an account? <button type="button" className="text-indigo-600 underline" onClick={() => setMode('signup')}>Sign Up</button></span>
            ) : (
              <span>Already have an account? <button type="button" className="text-indigo-600 underline" onClick={() => setMode('login')}>Login</button></span>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
