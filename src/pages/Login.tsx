
import Navbar from '../components/Navbar';
import AuthForm from '../components/AuthForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <AuthForm />
      </div>
    </div>
  );
}
