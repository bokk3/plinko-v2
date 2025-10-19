import './index.css';
import { useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import { CreditsProvider } from './components/CreditsContext';

function App() {
  const navigate = useNavigate();
  return (
    <CreditsProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <header className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 px-8 text-center flex-1 flex items-center justify-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
              Welcome to Plinko v2
            </h1>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Experience the thrill of the classic Plinko game with modern twists and exciting features!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg shadow-red-500/40"
                onClick={() => navigate('/login')}
              >
                Play Now
              </button>
              <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 hover:-translate-y-1">
                Learn More
              </button>
            </div>
          </div>
        </header>
        <section className="py-16 px-8 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-center text-4xl font-bold mb-12 text-gray-800">
              Why Choose Plinko v2?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">🎯 Precision Physics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Realistic ball physics for an authentic Plinko experience
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">🎨 Beautiful Graphics</h3>
                <p className="text-gray-600 leading-relaxed">
                  Stunning visuals and smooth animations
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg text-center hover:-translate-y-2 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">🏆 Exciting Rewards</h3>
                <p className="text-gray-600 leading-relaxed">
                  Multiple prize zones and bonus opportunities
                </p>
              </div>
            </div>
          </div>
        </section>
        <footer className="bg-gray-800 text-white text-center py-8 mt-auto">
          <p className="opacity-80">
            &copy; 2025 Plinko v2. Ready to drop some balls and win big?
          </p>
        </footer>
      </div>
    </CreditsProvider>
  );
}

export default App;
