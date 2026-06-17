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
            <a 
              href="https://github.com/harshammg/tapopen-forms" 
              target="_blank" 
              rel="noreferrer" 
              className="text-gray-300 hover:text-white transition-colors pointer-events-auto flex items-center"
              title="View on GitHub"
            >
              <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="/extension.zip" 
              download="google-forms-timer-extension.zip"
              className="hidden sm:block bg-white hover:bg-gray-200 text-gray-900 px-4 py-2 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-transparent hover:border-white/20 whitespace-nowrap text-center no-underline pointer-events-auto"
            >
              Download Extension
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}
