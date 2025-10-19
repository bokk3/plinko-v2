import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

export default function GamesOverview() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-xl shadow flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-8 text-indigo-700">Games Overview</h1>
        <div className="flex flex-col gap-6 w-full">
          <Link to="/game" className="block bg-indigo-500 hover:bg-indigo-600 text-white text-xl font-semibold rounded-lg px-8 py-6 text-center shadow transition-all duration-200">
            🎰 Plinko
          </Link>
          {/* Add more games here as you build them! */}
        </div>
      </div>
    </div>
  );
}
