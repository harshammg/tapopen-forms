import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { KeyRound, ArrowRight, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user has a recovery session token
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // If there is no session (e.g. they opened this link directly without a token),
        // we could redirect them to login. However, the token is processed automatically by supabase-js
        // in the URL hash, which establishes a session. So if session is null, they shouldn't be here.
        setError("Invalid or expired password reset link. Please request a new one.");
      }
    });
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      console.error("Password update error:", error);
      setError(error.message);
    } else {
      setMessage("Password updated successfully! Redirecting...");
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Space_Grotesk'] relative overflow-hidden">
      
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black tracking-tight text-white uppercase">Forms</span>
          <span className="text-xs font-bold text-purple-400 tracking-widest uppercase mt-1">by tapOpen</span>
        </Link>
        <h2 className="mt-8 text-center text-3xl font-black tracking-tight text-white">
          Create New Password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400 font-medium">
          Please enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 py-8 px-6 shadow-2xl rounded-3xl sm:px-10">
          <form className="space-y-6" onSubmit={handleReset}>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <span className="text-sm font-bold text-red-200">{error}</span>
              </div>
            )}

            {message && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-4 flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm font-bold text-green-200">{message}</span>
              </div>
            )}

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-300">
                New Password
              </label>
              <div className="mt-2 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <KeyRound className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-[#0A0A0B] border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-500 text-sm font-semibold transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading || !!message}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-2xl bg-white hover:bg-gray-200 text-gray-900 font-black text-base transition-all shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <span>Update Password</span>
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-white/10 pt-6 text-center">
            <Link
              to="/auth"
              className="text-sm font-bold text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
            >
              <ArrowRight className="h-4 w-4 rotate-180" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
