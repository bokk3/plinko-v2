import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Login from './pages/Login';
import Plinko from './pages/Plinko';
import Blackjack from './pages/Blackjack';
import GamesOverview from './pages/GamesOverview';
import Profile from './pages/Profile';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
  <Route path="/plinko" element={<Plinko />} />
  <Route path="/blackjack" element={<Blackjack />} />
        <Route path="/games" element={<GamesOverview />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
