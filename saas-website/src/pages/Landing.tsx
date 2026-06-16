import { ShieldAlert, Timer, Users, Zap, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="bg-[#0A0A0B] text-white min-h-screen selection:bg-purple-500/30 font-['Space_Grotesk']">
      
      {/* Navbar Overlay - Since App.tsx has a Navbar, we might want to make it transparent or replace it. For now, the App Navbar is light. We should probably update the Navbar to match this aesthetic, but let's build the landing section first. */}
      
      {/* Hero Section */}
      <div className="relative isolate pt-24 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#7C3AED] to-[#4F46E5] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="absolute inset-x-0 top-[40rem] -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#3B82F6] to-[#9333EA] opacity-20 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"></div>
        </div>

        <div className="py-20 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                <div className="relative rounded-full px-4 py-1.5 text-sm leading-6 text-gray-300 ring-1 ring-white/10 hover:ring-white/20 transition-all cursor-pointer backdrop-blur-md bg-white/5">
                  Announcing Pro features for Teams. <a href="#" className="font-semibold text-purple-400"><span className="absolute inset-0" aria-hidden="true"></span>Read more <span aria-hidden="true">&rarr;</span></a>
                </div>
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-7xl">
                Secure & timed <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">Google Forms.</span>
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-400 font-medium max-w-2xl mx-auto">
                Enforce strict time limits, prevent tab-switching, and completely automate submissions. The absolute easiest way to host timed assessments securely.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a href="#" className="group relative rounded-full bg-white px-8 py-3.5 text-sm font-bold text-gray-900 shadow-xl hover:bg-gray-100 transition-all active:scale-95 flex items-center gap-2">
                  Add to Chrome Free
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <Link to="/dashboard" className="text-sm font-semibold leading-6 text-white flex items-center gap-1 hover:text-purple-400 transition-colors">
                  Open Dashboard <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32 relative z-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-purple-500 tracking-wider uppercase">Zero Setup Required</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-5xl">Everything you need to host exams</p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-5xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-12 gap-y-16 lg:max-w-none lg:grid-cols-2">
              
              <div className="relative group">
                <div className="absolute -inset-y-6 -inset-x-6 rounded-2xl bg-white/5 opacity-0 transition group-hover:opacity-100 backdrop-blur-xl"></div>
                <div className="relative">
                  <dt className="text-xl font-bold leading-7 text-white flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 ring-1 ring-blue-500/30">
                      <Timer className="h-6 w-6 text-blue-400" aria-hidden="true" />
                    </div>
                    Hard Deadlines
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-gray-400">Set precise minute-by-minute timers. The beautiful floating UI keeps your responders aware of the exact time remaining.</dd>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-y-6 -inset-x-6 rounded-2xl bg-white/5 opacity-0 transition group-hover:opacity-100 backdrop-blur-xl"></div>
                <div className="relative">
                  <dt className="text-xl font-bold leading-7 text-white flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/20 ring-1 ring-red-500/30">
                      <ShieldAlert className="h-6 w-6 text-red-400" aria-hidden="true" />
                    </div>
                    Anti-Cheat Proctoring
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-gray-400">Strict tab-switching detection. If a responder leaves the page or minimizes the window, their test is instantly auto-submitted.</dd>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-y-6 -inset-x-6 rounded-2xl bg-white/5 opacity-0 transition group-hover:opacity-100 backdrop-blur-xl"></div>
                <div className="relative">
                  <dt className="text-xl font-bold leading-7 text-white flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 ring-1 ring-purple-500/30">
                      <Zap className="h-6 w-6 text-purple-400" aria-hidden="true" />
                    </div>
                    Bypass Required Fields
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-gray-400">When time runs out, our smart engine instantly auto-fills any empty required fields to guarantee Google Forms allows the submission.</dd>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-y-6 -inset-x-6 rounded-2xl bg-white/5 opacity-0 transition group-hover:opacity-100 backdrop-blur-xl"></div>
                <div className="relative">
                  <dt className="text-xl font-bold leading-7 text-white flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 ring-1 ring-green-500/30">
                      <Users className="h-6 w-6 text-green-400" aria-hidden="true" />
                    </div>
                    Centralized Dashboard
                  </dt>
                  <dd className="mt-4 text-base leading-7 text-gray-400">Track all your active forms, expiration dates, and manage your subscription right from this secure web portal.</dd>
                </div>
              </div>

            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
