import Navbar from '../components/Navbar';

export default function Game() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="bg-white p-8 rounded-xl shadow text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Plinko!</h1>
          <p className="mb-2">Game logic goes here.</p>
        </div>
      </div>
    </div>
  );
}
