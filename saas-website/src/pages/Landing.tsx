import { ShieldAlert, Timer, Zap, ChevronRight, HelpCircle, CheckCircle2, Shield, EyeOff, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Landing() {
  const { user } = useAuth();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: "How does the anti-cheat proctoring work?",
      a: "Our smart content script monitors tab visibility and window focus. If a responder switches tabs, minimizes their browser, or opens another application, the session is flagged. You can configure it to instantly auto-submit their form upon violation."
    },
    {
      q: "Do students need to install the Chrome extension?",
      a: "No! Only you (the teacher or form creator) need the extension to generate secure timer links. Your students can take the exam on any browser (desktop or mobile) simply by visiting the secure link."
    },
    {
      q: "What happens when the timer runs out?",
      a: "The form is instantly hidden from the student. Our system triggers an auto-submit payload to ensure all progress they've made so far is securely logged in your Google Form, even bypassing required fields if necessary."
    },
    {
      q: "Is my database secure with Supabase?",
      a: "Yes. All form configurations and user accounts are secured using Supabase Row Level Security (RLS). Only authenticated users can access, create, or modify their own forms."
    }
  ];

  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen selection:bg-purple-500/30 font-['Space_Grotesk'] overflow-hidden">
      
      {/* Dynamic Background Grid and Glows */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.15]"></div>
      
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-[20rem] right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 lg:pb-36 z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/5 backdrop-blur-md text-xs sm:text-sm font-bold text-purple-300 mb-8 animate-pulse">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Proctoring for Google Forms</span>
            </div>

            <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl leading-[1.1]">
              Secure & timed <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-500">
                Google Forms.
              </span>
            </h1>
            
            <p className="mt-8 text-base sm:text-lg leading-relaxed text-gray-400 font-medium max-w-2xl mx-auto">
              Enforce strict time limits, detect tab-switching, and automate form submissions. The absolute most secure and frictionless way to host online assessments.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#" className="w-full sm:w-auto group relative rounded-full bg-white px-8 py-4 text-sm font-black text-gray-900 shadow-2xl hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center gap-2 border border-transparent hover:border-white/20">
                Add to Chrome Free
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              {user ? (
                <Link to="/dashboard" className="w-full sm:w-auto text-sm font-bold leading-6 text-white px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-center">
                  Open Dashboard
                </Link>
              ) : (
                <Link to="/auth" className="w-full sm:w-auto text-sm font-bold leading-6 text-white px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-all text-center">
                  Get Started (Auth)
                </Link>
              )}
            </div>
          </div>

          {/* Interactive Web UI Mockup */}
          <div className="mt-16 sm:mt-24 relative rounded-3xl border border-white/10 bg-[#0E0E10]/80 p-4 sm:p-6 shadow-2xl backdrop-blur-2xl max-w-5xl mx-auto group">
            <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-xl opacity-70 group-hover:opacity-100 transition duration-500 pointer-events-none"></div>
            
            <div className="relative bg-[#060608] rounded-2xl overflow-hidden border border-white/5">
              {/* Window Controls */}
              <div className="flex items-center justify-between px-6 py-4 bg-[#0A0A0C] border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-yellow-500/80"></span>
                  <span className="w-3 h-3 rounded-full bg-green-500/80"></span>
                </div>
                <div className="text-xs font-semibold text-gray-500">tapopen.forms/dashboard</div>
                <div className="w-12"></div>
              </div>
              
              {/* Fake Dashboard Content */}
              <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <div className="h-10 w-48 bg-white/5 rounded-lg"></div>
                  <div className="p-5 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                        <Timer className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="h-4 w-32 bg-white/10 rounded"></div>
                        <div className="h-3 w-20 bg-white/5 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-white/10 rounded-full"></div>
                  </div>
                  <div className="p-5 border border-white/5 bg-white/[0.01] rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="h-4 w-40 bg-white/10 rounded"></div>
                        <div className="h-3 w-16 bg-white/5 rounded mt-2"></div>
                      </div>
                    </div>
                    <div className="h-8 w-24 bg-white/10 rounded-full"></div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 p-6 rounded-2xl border border-purple-500/20 flex flex-col justify-between h-48 md:h-auto">
                  <div>
                    <div className="h-4 w-24 bg-white/10 rounded"></div>
                    <div className="h-8 w-36 bg-white/20 rounded mt-3"></div>
                  </div>
                  <div className="h-10 w-full bg-white rounded-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Stats Section */}
      <div className="border-y border-white/5 bg-white/[0.01] py-10 sm:py-16 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">100k+</p>
              <p className="mt-1.5 text-sm font-bold text-purple-400 uppercase tracking-widest">Exams Proctored</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">99.99%</p>
              <p className="mt-1.5 text-sm font-bold text-purple-400 uppercase tracking-widest">Submission Uptime</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">&lt; 1 min</p>
              <p className="mt-1.5 text-sm font-bold text-purple-400 uppercase tracking-widest">Setup Time</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-black text-white">Zero</p>
              <p className="mt-1.5 text-sm font-bold text-purple-400 uppercase tracking-widest">Student Installs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Features Grid */}
      <div className="py-24 sm:py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-bold leading-7 text-purple-400 tracking-widest uppercase">The Proctoring Suite</h2>
            <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-5xl">Host cheat-free assessments.</p>
            <p className="mt-4 text-base text-gray-400 font-medium">Equip your Google Forms with advanced time constraints and monitoring tools seamlessly.</p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              
              {/* Feature 1 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all hover:translate-y-[-4px] duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/20 ring-1 ring-purple-500/30 mb-6 text-purple-400">
                    <Timer className="h-6 w-6" />
                  </div>
                  <dt className="text-xl font-bold text-white leading-7">Precision Hard Timers</dt>
                  <dd className="mt-4 text-sm leading-relaxed text-gray-400">Set dynamic time limits down to the second. Floating overlay UI keeps students aware of their remaining window.</dd>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-purple-400 hover:text-purple-300 cursor-pointer">
                  <span>Learn more</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-red-500/30 transition-all hover:translate-y-[-4px] duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 ring-1 ring-red-500/30 mb-6 text-red-400">
                    <ShieldAlert className="h-6 w-6" />
                  </div>
                  <dt className="text-xl font-bold text-white leading-7">Integrity Proctoring</dt>
                  <dd className="mt-4 text-sm leading-relaxed text-gray-400">Detect tab-switching, minimized windows, or screen blurs. Automatically force-submits responses immediately upon violations.</dd>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-red-400 hover:text-red-300 cursor-pointer">
                  <span>Learn more</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Feature 3 */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-blue-500/30 transition-all hover:translate-y-[-4px] duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 ring-1 ring-blue-500/30 mb-6 text-blue-400">
                    <Zap className="h-6 w-6" />
                  </div>
                  <dt className="text-xl font-bold text-white leading-7">Auto-Submit Fallback</dt>
                  <dd className="mt-4 text-sm leading-relaxed text-gray-400">On timer expiry, our engines automatically fill empty required fields to ensure Google Forms accepts and logs the submissions.</dd>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300 cursor-pointer">
                  <span>Learn more</span> <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>

            </dl>
          </div>
        </div>
      </div>

      {/* Secure Storage Section */}
      <div className="py-20 bg-gradient-to-b from-[#0A0A0B] to-[#0E0E12] relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-base font-bold text-purple-400 uppercase tracking-widest">Supabase Integration</h3>
            <h2 className="text-3xl sm:text-4xl font-black mt-2 leading-tight">Database-Secured Timer Links</h2>
            <p className="text-gray-400 mt-6 leading-relaxed font-medium">
              We've upgraded our system security. Form durations and settings are no longer passed as URL query parameters. Instead, they are stored securely in a Supabase PostgreSQL database under strict RLS guidelines and fetched dynamically by the exam screen using randomized UUIDs.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Protected database storage preventing URL spoofing",
                "Full security with Row Level Security (RLS) policies",
                "Secure public endpoints for student client fetching",
                "Automated profiles matching your authenticated accounts"
              ].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#121216] border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <EyeOff className="w-32 h-32 text-purple-500" />
            </div>
            <h4 className="text-lg font-black mb-4 flex items-center gap-2 text-white">
              <Shield className="w-5 h-5 text-purple-400" /> Security Check
            </h4>
            <div className="space-y-4">
              <div className="p-4 bg-red-500/10 border border-red-500/25 rounded-2xl">
                <span className="text-xs font-bold text-red-300 uppercase tracking-widest">Insecure Query link (Old)</span>
                <p className="text-xs sm:text-sm font-mono mt-1 text-red-200/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  tapopen.forms/take/form-123?timer=120&expires=1781...
                </p>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/25 rounded-2xl">
                <span className="text-xs font-bold text-green-300 uppercase tracking-widest">Secure Database Link (New)</span>
                <p className="text-xs sm:text-sm font-mono mt-1 text-green-200/70 overflow-hidden text-ellipsis whitespace-nowrap">
                  tapopen.forms/take/f98b25da-23f1-4db8-b5b6-7b49cf525381
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="py-24 sm:py-32 relative z-10 max-w-4xl mx-auto px-6">
        <h2 className="text-3xl font-black text-center mb-12 sm:mb-16">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden transition-all duration-300">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-6 text-left font-bold text-base sm:text-lg focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-purple-400 shrink-0" />
                  {faq.q}
                </span>
                <span className="text-xl text-gray-500 font-light">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              <div className={`transition-all duration-300 ease-in-out ${
                activeFaq === idx ? 'max-h-48 border-t border-white/5 p-6' : 'max-h-0 overflow-hidden'
              }`}>
                <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-medium">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 relative z-10 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start justify-center leading-none">
            <span className="text-lg font-black tracking-tight text-white uppercase">Forms</span>
            <span className="text-[9px] font-bold text-purple-400 tracking-widest uppercase mt-[2px]">by tapOpen</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} tapOpen. All rights reserved. Google Forms is a trademark of Google LLC.
          </p>
        </div>
      </footer>
    </div>
  );
}
