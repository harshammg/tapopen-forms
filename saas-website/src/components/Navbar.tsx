import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="sticky top-6 z-50 w-full px-4 flex justify-center pointer-events-none font-['Space_Grotesk']">
      <nav className="pointer-events-auto w-full max-w-4xl backdrop-blur-xl bg-[#0A0A0B]/40 border border-white/10 text-white rounded-full shadow-2xl py-3 px-6 transition-all duration-300">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex flex-col items-start justify-center leading-none">
              <span className="text-xl font-black tracking-tight text-white uppercase">Forms</span>
              <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase mt-[2px]">by tapOpen</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4 sm:space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="flex items-center gap-2 text-sm font-bold transition-colors text-gray-300 hover:text-white">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-sm font-bold transition-colors text-gray-300 hover:text-white bg-transparent border-0 cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/auth" className="flex items-center gap-2 text-sm font-bold transition-colors text-gray-300 hover:text-white">
                <LogIn className="h-4 w-4" />
                <span>Log In</span>
              </Link>
            )}
            <button className="bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-transparent hover:border-white/20 whitespace-nowrap">
              Install Extension
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
