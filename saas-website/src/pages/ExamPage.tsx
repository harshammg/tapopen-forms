import { useParams, useSearchParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ShieldAlert, Clock, AlertTriangle, Eye, Ban, TimerOff, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Phase = 'splash' | 'exam' | 'finished';
type FinishReason = 'timeout' | 'violation';

export default function ExamPage() {
  const { formId } = useParams<{ formId: string }>();
  const [searchParams] = useSearchParams();

  // Check if formId is a Supabase UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(formId || '');

  // Dynamic settings state
  const [googleFormLink, setGoogleFormLink] = useState<string>('');
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [expiresTs, setExpiresTs] = useState<string | null>(null);
  
  const [dbLoading, setDbLoading] = useState(isUuid);
  const [dbError, setDbError] = useState<string | null>(null);

  const [phase, setPhase] = useState<Phase>('splash');
  const [remaining, setRemaining] = useState(0);
  const [finishReason, setFinishReason] = useState<FinishReason>('timeout');
  const [warning, setWarning] = useState<string | null>(null);
  
  const intervalRef = useRef<number | null>(null);
  const warningTimeoutRef = useRef<number | null>(null);
  const iframeLoadCount = useRef(0);

  // Fetch form details from Supabase if using UUID link
  useEffect(() => {
    if (!isUuid) {
      // Fallback to query params
      const qTimer = parseInt(searchParams.get('timer') || '0', 10);
      const qExpires = searchParams.get('expires');
      setGoogleFormLink(formId || '');
      setTimerSeconds(qTimer);
      setExpiresTs(qExpires);
      setRemaining(qTimer);
      setDbLoading(false);
      return;
    }

    const fetchFormSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('forms')
          .select('*')
          .eq('id', formId)
          .single();

        if (error) throw error;
        if (data) {
          setGoogleFormLink(data.google_form_link);
          setTimerSeconds(data.duration_seconds);
          setRemaining(data.duration_seconds);
          setExpiresTs(data.expires_at ? new Date(data.expires_at).getTime().toString() : null);
        } else {
          setDbError('Secure timed link is invalid.');
        }
      } catch (err) {
        console.error('Failed to load secure form settings:', err);
        setDbError('This timed form is inactive, deleted, or incorrect.');
      } finally {
        setDbLoading(false);
      }
    };

    fetchFormSettings();
  }, [formId, isUuid, searchParams]);

  const isExpired = expiresTs ? Date.now() > parseInt(expiresTs, 10) : false;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const showWarning = useCallback((msg: string) => {
    setWarning(msg);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    warningTimeoutRef.current = window.setTimeout(() => setWarning(null), 4000);
  }, []);

  const endExam = useCallback((reason: FinishReason) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setFinishReason(reason);
    setPhase('finished');
  }, []);

  const startExam = () => {
    setPhase('exam');
    setRemaining(timerSeconds);
    iframeLoadCount.current = 0; // reset the iframe counter

    intervalRef.current = window.setInterval(() => {
      setRemaining(prev => {
        const next = prev - 1;
        if (next <= 0) {
          endExam('timeout');
          return 0;
        }
        if (next === 300) showWarning('5 minutes remaining - submit your form soon.');
        if (next === 120) showWarning('2 minutes remaining - submit now.');
        if (next === 60) showWarning('1 minute left - submit immediately.');
        if (next === 30) showWarning('30 seconds remaining - submit right now.');
        return next;
      });
    }, 1000);
  };

  useEffect(() => {
    if (phase !== 'exam') return;
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') {
        endExam('violation');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [phase, endExam]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
    };
  }, []);

  // Handle nested formId strings
  let correctFormId = googleFormLink;
  if (googleFormLink.startsWith('e-')) {
    correctFormId = googleFormLink.replace(/^e-/, 'e/');
  } else if (googleFormLink.startsWith('1FAIp')) {
    correctFormId = `e/${googleFormLink}`;
  }

  const formUrl = `https://docs.google.com/forms/d/${correctFormId}/viewform?embedded=true`;

  const handleIframeLoad = () => {
    iframeLoadCount.current += 1;
    if (iframeLoadCount.current === 2) {
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else if (iframeLoadCount.current >= 3) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPhase('splash');
      iframeLoadCount.current = 0;
    }
  };

  // ─── LOADING SCREEN ───
  if (dbLoading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex flex-col items-center justify-center text-white font-['Space_Grotesk']">
        <Loader2 className="h-10 w-10 text-purple-400 animate-spin mb-4" />
        <p className="text-gray-400 font-bold text-sm tracking-wider uppercase">Verifying Secure Session...</p>
      </div>
    );
  }

  // ─── ERROR SCREEN ───
  if (dbError || !formId || timerSeconds <= 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white font-['Space_Grotesk']">
        <div className="text-center max-w-md px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/20 ring-1 ring-red-500/30 mb-6">
            <Ban className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-black mb-3">Invalid Link</h1>
          <p className="text-gray-400 text-base">{dbError || "This timed link is missing required settings. Please contact the form host."}</p>
        </div>
      </div>
    );
  }

  // ─── EXPIRED SCREEN ───
  if (isExpired) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white font-['Space_Grotesk']">
        <div className="text-center max-w-md px-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-orange-500/20 ring-1 ring-orange-500/30 mb-6">
            <TimerOff className="h-10 w-10 text-orange-400" />
          </div>
          <h1 className="text-3xl font-black mb-3">Link Expired</h1>
          <p className="text-gray-400 text-base">This timed assessment has expired and is no longer accepting new attempts.</p>
        </div>
      </div>
    );
  }

  // ─── SPLASH SCREEN ───
  if (phase === 'splash') {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white font-['Space_Grotesk'] p-4">
        <div className="max-w-lg w-full">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-purple-500/20 ring-1 ring-purple-500/30 mb-4 sm:mb-5">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-purple-400" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Timed Assessment</h1>
              <p className="text-sm sm:text-base text-gray-400 mt-2 font-medium">Read the instructions carefully before starting.</p>
            </div>

            <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 sm:gap-4 bg-blue-500/10 border border-blue-500/20 p-3 sm:p-4 rounded-2xl">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-blue-200">Time Limit</h3>
                  <p className="text-xs sm:text-sm text-blue-300/80 mt-1">
                    You have exactly <strong className="text-white">{Math.floor(timerSeconds / 60)} minute{Math.floor(timerSeconds / 60) !== 1 ? 's' : ''}</strong> to complete this form. The timer starts when you click the button below.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 bg-red-500/10 border border-red-500/20 p-3 sm:p-4 rounded-2xl">
                <ShieldAlert className="h-5 w-5 sm:h-6 sm:w-6 text-red-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-red-200">Strict Proctoring</h3>
                  <p className="text-xs sm:text-sm text-red-300/80 mt-1">
                    <strong className="text-white">Do not switch tabs or minimize the window.</strong> If you leave this page, your test session will be instantly terminated.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:gap-4 bg-yellow-500/10 border border-yellow-500/20 p-3 sm:p-4 rounded-2xl">
                <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-yellow-200">Submit Before Expiry</h3>
                  <p className="text-xs sm:text-sm text-yellow-300/80 mt-1">
                    When the timer runs out, the form will be <strong className="text-white">permanently hidden</strong>. Unsubmitted answers will be lost.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={startExam}
              className="w-full bg-white hover:bg-gray-200 text-gray-900 font-black py-3.5 sm:py-4 px-6 rounded-2xl shadow-xl shadow-white/10 transform transition-all active:scale-95 text-base sm:text-lg tracking-tight"
            >
              I Understand - Start Exam
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── FINISHED SCREEN ───
  if (phase === 'finished') {
    const isViolation = finishReason === 'violation';
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white font-['Space_Grotesk'] p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] ${isViolation ? 'bg-red-500/15' : 'bg-orange-500/10'} rounded-full blur-3xl`}></div>
        </div>
        <div className="relative text-center max-w-md">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl ${isViolation ? 'bg-red-500/20 ring-1 ring-red-500/30' : 'bg-orange-500/20 ring-1 ring-orange-500/30'} mb-6`}>
            {isViolation
              ? <Eye className="h-12 w-12 text-red-400" />
              : <TimerOff className="h-12 w-12 text-orange-400" />
            }
          </div>
          <h1 className={`text-4xl font-black tracking-tight mb-3 ${isViolation ? 'text-red-400' : 'text-orange-400'}`}>
            {isViolation ? 'Violation Detected' : "Time's Up"}
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            {isViolation
              ? 'You switched tabs or left the active window. Your session has been terminated and the form is hidden.'
              : 'The time limit has expired. If you did not click submit on Google Forms before the countdown finished, your progress is lost.'
            }
          </p>
        </div>
      </div>
    );
  }

  // ─── EXAM IN PROGRESS ───
  const isUrgent = remaining <= 60;
  const progressPercent = ((timerSeconds - remaining) / timerSeconds) * 100;

  return (
    <div className="h-screen flex flex-col bg-[#0A0A0B] font-['Space_Grotesk'] overflow-hidden">
      {/* Warning Toast */}
      {warning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce w-[90%] max-w-sm sm:max-w-none sm:w-auto">
          <div className="bg-red-500/90 backdrop-blur-xl text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-2xl shadow-red-500/30 font-bold text-xs sm:text-sm border border-red-400/50 text-center">
            {warning}
          </div>
        </div>
      )}

      {/* Timer Bar */}
      <div className="relative z-40 shrink-0">
        <div className="h-1 bg-white/5">
          <div
            className={`h-full transition-all duration-1000 ease-linear ${isUrgent ? 'bg-red-500' : 'bg-purple-500'}`}
            style={{ width: `${100 - progressPercent}%` }}
          ></div>
        </div>

        <div className={`flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3 backdrop-blur-xl border-b transition-colors duration-500 ${
          isUrgent
            ? 'bg-red-500/10 border-red-500/30'
            : 'bg-[#0A0A0B]/80 border-white/10'
        }`}>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`p-1.5 sm:p-2 rounded-xl ${isUrgent ? 'bg-red-500/20' : 'bg-purple-500/20'}`}>
              <Clock className={`h-4 w-4 sm:h-5 sm:w-5 ${isUrgent ? 'text-red-400 animate-pulse' : 'text-purple-400'}`} />
            </div>
            <span className="text-xs sm:text-sm font-bold text-gray-300">Time Remaining</span>
          </div>
          <div className={`text-2xl sm:text-3xl font-black tracking-widest font-mono ${isUrgent ? 'text-red-400' : 'text-white'}`}>
            {formatTime(remaining)}
          </div>
        </div>
      </div>

      {/* Google Form IFrame */}
      <div className="flex-1 relative">
        {formUrl && (
          <iframe
            src={formUrl}
            title="Google Form"
            onLoad={handleIframeLoad}
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
            allow="autoplay"
          />
        )}
      </div>
    </div>
  );
}
