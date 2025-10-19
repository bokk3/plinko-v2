import Navbar from '../components/Navbar';
import PlinkoBoard from '../components/PlinkoBoard';

export default function Game() {
  function handleDrop(slot: number, multiplier: number) {
    // TODO: Deduct credit, save game, update UI
    console.log('Ball landed in slot', slot, 'with multiplier', multiplier);
  }
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <PlinkoBoard onDrop={handleDrop} />
      </div>
    </div>
  );
}
