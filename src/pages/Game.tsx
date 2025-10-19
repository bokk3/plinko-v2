import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import PlinkoCanvas from '../components/PlinkoCanvas';
import { supabase } from '../supabaseClient';

export default function Game() {
  const [bet, setBet] = useState(10);
  const [ballsInPlay, setBallsInPlay] = useState(0);
  const [dropCount, setDropCount] = useState(0);
  const [sessionWin, setSessionWin] = useState(0);
  const [sessionLoss, setSessionLoss] = useState(0);
  const [lastResults, setLastResults] = useState<Array<{ slot: number; multiplier: number; win: number }>>([]);
  const [credits, setCredits] = useState<number>(100);

  // Fetch credits from Supabase on mount
  React.useEffect(() => {
    async function fetchCredits() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', user.id)
          .single();
        if (!error && data) {
          setCredits(data.credits);
        }
      }
    }
    fetchCredits();
  }, []);

  function handleBallLanded(slot: number, multiplier: number) {
    const win = Math.round(bet * multiplier);
    setSessionWin((w: number) => w + win);
    setSessionLoss((l: number) => l + bet - win);
    setLastResults((results: Array<{ slot: number; multiplier: number; win: number }>) => [...results, { slot, multiplier, win }]);
    setBallsInPlay((n: number) => Math.max(0, n - 1));
    // TODO: Save game to Supabase
  }

  function handleDropBall() {
    if (ballsInPlay >= 10 || credits < bet) return;
    setCredits((c: number) => c - bet);
    setBallsInPlay((n: number) => n + 1);
    setDropCount((c) => c + 1);
  }

  async function handleCashOut() {
    // Get current user
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();
    if (!user || userError) {
      setSessionWin(0);
      setSessionLoss(0);
      setLastResults([]);
      return;
    }

    // Update credits in profiles table
    await supabase
      .from('profiles')
      .update({ credits: credits + sessionWin })
      .eq('id', user.id);

    // Insert game results
    if (lastResults.length > 0) {
      const gameRows = lastResults.map((r) => ({
        user_id: user.id,
        result: `slot_${r.slot + 1}`,
        multiplier: r.multiplier,
      }));
      await supabase.from('games').insert(gameRows);
    }

    // Fetch updated credits from Supabase
    const { data, error } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', user.id)
      .single();
    if (!error && data) {
      setCredits(data.credits);
    }

    setSessionWin(0);
    setSessionLoss(0);
    setLastResults([]);
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      {/* Main game layout: board left, sidebar right (desktop), stacked (mobile) */}
      <div className="w-full flex flex-col md:flex-row md:items-start md:justify-center gap-8 pt-8">
        <div className="flex flex-col items-center justify-center w-full md:w-auto">
          <PlinkoCanvas onBallLanded={handleBallLanded} dropCount={dropCount} />
        </div>
        <div className="flex flex-col items-center gap-6 w-full md:w-80">
          <div className="flex flex-wrap gap-4 justify-center w-full">
            <div className="bg-white rounded-xl shadow p-4 text-center w-32">
              <div className="text-gray-500 text-sm">Credits</div>
              <div className="text-2xl font-bold text-indigo-600">{credits}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center w-32">
              <div className="text-gray-500 text-sm">Session Win</div>
              <div className="text-2xl font-bold text-green-500">{sessionWin}</div>
            </div>
            <div className="bg-white rounded-xl shadow p-4 text-center w-32">
              <div className="text-gray-500 text-sm">Session Loss</div>
              <div className="text-2xl font-bold text-red-500">{sessionLoss}</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-4 flex flex-col items-center w-full">
            <label className="font-semibold mb-2">Bet Amount: {bet}</label>
            <input
              type="range"
              min={1}
              max={Math.max(credits, 1)}
              value={bet}
              onChange={(e) => setBet(Number(e.target.value))}
              className="w-64"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-4 w-full md:justify-center">
            <button
              className="px-8 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full shadow-lg text-xl transition-all duration-300 disabled:opacity-50"
              onClick={handleDropBall}
              disabled={ballsInPlay >= 10 || credits < bet}
            >
              {`Drop Ball (Bet ${bet})`}
            </button>
            <button
              className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-full shadow text-lg transition-all duration-300 disabled:opacity-50"
              onClick={handleCashOut}
              disabled={sessionWin === 0}
            >
              Cash Out Session Wins
            </button>
          </div>
          {lastResults.length > 0 && (
            <div className="mt-4 text-center w-full">
              {lastResults.slice(-5).map((result: { slot: number; multiplier: number; win: number }, idx: number) => (
                <div key={idx} className="mb-2">
                  <div className="text-lg font-bold">Ball landed in slot {result.slot + 1} (x{result.multiplier})</div>
                  <div className={result.win > 0 ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                    {result.win > 0 ? `You won ${result.win} credits!` : `No win.`}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Remove duplicate lastResults rendering and fix closing tags */}
    </div>
  );
}
