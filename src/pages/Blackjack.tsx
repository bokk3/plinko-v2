
import { useState } from 'react';
import Navbar from '../components/Navbar';

// Card and deck helpers
const SUITS = ['♠', '♥', '♦', '♣'];
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ suit, rank });
    }
  }
  return deck;
}
function shuffle(deck: any[]) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}
function cardValue(card: any) {
  if (card.rank === 'A') return 11;
  if (['K', 'Q', 'J'].includes(card.rank)) return 10;
  return parseInt(card.rank, 10);
}
function handValue(hand: any[]) {
  let total = 0, aces = 0;
  for (const card of hand) {
    total += cardValue(card);
    if (card.rank === 'A') aces++;
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces--;
  }
  return total;
}

const MAX_HANDS = 4;

export default function Blackjack() {
  const [deck, setDeck] = useState<any[]>([]);
  const [playerHands, setPlayerHands] = useState<any[][]>([]);
  const [dealerHand, setDealerHand] = useState<any[]>([]);
  const [activeHand, setActiveHand] = useState(0);
  const [status, setStatus] = useState<'betting' | 'playing' | 'dealer' | 'done'>('betting');
  const [results, setResults] = useState<string[]>([]);
  const [betCount, setBetCount] = useState(1);

  function startGame() {
    let d = shuffle(createDeck());
    const hands = [];
    for (let i = 0; i < betCount; i++) {
      hands.push([d.pop(), d.pop()]);
    }
    setPlayerHands(hands);
    setDealerHand([d.pop(), d.pop()]);
    setDeck(d);
    setActiveHand(0);
    setStatus('playing');
    setResults([]);
  }

  function hit() {
    setPlayerHands(hands => {
      const newHands = hands.map((hand, idx) =>
        idx === activeHand ? [...hand, deck[0]] : hand
      );
      setDeck(d => d.slice(1));
      // If bust, auto-stand
      if (handValue([...hands[activeHand], deck[0]]) > 21) {
        stand();
      }
      return newHands;
    });
  }

  function stand() {
    if (activeHand < playerHands.length - 1) {
      setActiveHand(h => h + 1);
    } else {
      setStatus('dealer');
      setTimeout(playDealer, 500);
    }
  }

  function playDealer() {
    let d = [...dealerHand];
    let deckCopy = [...deck];
    while (handValue(d) < 17) {
      d.push(deckCopy.shift());
    }
    setDealerHand(d);
    setDeck(deckCopy);
    setStatus('done');
    // Evaluate results
    const dealerVal = handValue(d);
    const res = playerHands.map(hand => {
      const val = handValue(hand);
      if (val > 21) return 'Bust';
      if (dealerVal > 21) return 'Win';
      if (val > dealerVal) return 'Win';
      if (val < dealerVal) return 'Lose';
      return 'Push';
    });
    setResults(res);
  }

  function resetGame() {
    setDeck([]);
    setPlayerHands([]);
    setDealerHand([]);
    setActiveHand(0);
    setStatus('betting');
    setResults([]);
    setBetCount(1);
  }

  return (
    <div className="min-h-screen bg-green-900">
      <Navbar />
      <div className="relative max-w-4xl mx-auto mt-8 flex flex-col items-center">
        {/* Oval table background */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center -z-10">
          <div className="w-full h-[500px] bg-green-800/90 border-4 border-green-700 shadow-2xl mx-auto" style={{ borderRadius: '50% / 40%' }}></div>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-white drop-shadow">Blackjack</h1>
  <div className="w-full z-10">
  {status === 'betting' && (
          <div className="flex flex-col items-center gap-4">
            <label className="font-semibold text-white">How many hands? (1-4)</label>
            <input type="number" min={1} max={MAX_HANDS} value={betCount} onChange={e => setBetCount(Math.max(1, Math.min(MAX_HANDS, Number(e.target.value))))} className="w-24 text-center border rounded p-1" />
            <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full font-bold mt-2" onClick={startGame}>
              Deal
            </button>
          </div>
        )}
        {status !== 'betting' && (
          <>
            {/* Dealer at the top, centered in oval */}
            <div className="w-full flex flex-col items-center mb-12 mt-8">
              <h2 className="text-xl font-bold mb-2 text-white">Dealer</h2>
              <div className="flex gap-2 mb-2">
                {dealerHand.map((card, idx) => (
                  <span key={idx} className="inline-block bg-white rounded-lg px-4 py-6 text-2xl font-mono shadow-lg border-2 border-gray-300">
                    {status === 'playing' && idx === 1 ? '🂠' : `${card.rank}${card.suit}`}
                  </span>
                ))}
              </div>
              {status === 'done' && <div className="text-gray-200">Value: {handValue(dealerHand)}</div>}
            </div>
            {/* Player hands at the bottom, horizontally, centered in oval */}
            <div className="w-full flex flex-row justify-center gap-8 mt-24 mb-8">
              {playerHands.map((hand, idx) => (
                <div key={idx} className={`flex flex-col items-center ${activeHand === idx && status === 'playing' ? 'bg-green-700/80 border-2 border-yellow-400' : 'bg-green-700/60'} rounded-2xl px-6 py-4 shadow-lg min-w-[180px]`}>
                  <div className="mb-2 text-white font-bold">Hand {idx + 1}</div>
                  <div className="flex gap-2 mb-2">
                    {hand.map((card, cidx) => (
                      <span key={cidx} className="inline-block bg-white rounded-lg px-4 py-6 text-2xl font-mono shadow border-2 border-gray-300">{card.rank}{card.suit}</span>
                    ))}
                  </div>
                  <div className="mb-2 text-white">Value: {handValue(hand)}</div>
                  {status === 'playing' && activeHand === idx && handValue(hand) < 21 && (
                    <div className="flex gap-4 mt-2">
                      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full font-bold" onClick={hit}>Hit</button>
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-green-900 px-6 py-2 rounded-full font-bold" onClick={stand}>Stand</button>
                    </div>
                  )}
                  {status === 'done' && <div className="mt-2 font-bold text-lg text-white">{results[idx]}</div>}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <button className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-full font-bold" onClick={resetGame}>New Game</button>
            </div>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
