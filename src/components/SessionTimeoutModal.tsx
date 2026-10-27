import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Clock, ShieldAlert, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

// 10 minutes of inactivity before asking the user
const INACTIVITY_LIMIT_MS = 10 * 60 * 1000; // 10 minutes = 600,000 ms
// 60 seconds countdown to respond before auto-logout
const COUNTDOWN_SECONDS = 60;
const STORAGE_KEY_LAST_ACTIVITY = 'gka_last_admin_activity_timestamp';

export const SessionTimeoutModal: React.FC = () => {
  const { isAdminLoggedIn, currentAdmin, adminLogout, showToast } = useStore();

  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(COUNTDOWN_SECONDS);

  // Store last activity timestamp in ref and localStorage for multi-tab synchronization
  const lastActivityRef = useRef<number>(Date.now());
  const warningStartRef = useRef<number | null>(null);

  // Update last activity timestamp
  const recordActivity = useCallback(() => {
    // Only record activity if the warning modal is NOT open
    // (If the modal is open, user must explicitly click "Stay Logged In")
    if (!isWarningOpen) {
      const now = Date.now();
      lastActivityRef.current = now;
      try {
        localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
      } catch {
        // ignore localStorage errors
      }
    }
  }, [isWarningOpen]);

  // Handle user choosing to stay logged in
  const handleStayLoggedIn = () => {
    const now = Date.now();
    lastActivityRef.current = now;
    warningStartRef.current = null;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
    } catch {
      // ignore
    }
    setIsWarningOpen(false);
    setSecondsRemaining(COUNTDOWN_SECONDS);
    showToast(`✓ Session renewed for 10 minutes. Welcome back, ${currentAdmin?.name || 'Partner'}!`);
  };

  // Handle user choosing to log out immediately
  const handleLogoutNow = () => {
    setIsWarningOpen(false);
    warningStartRef.current = null;
    adminLogout();
  };

  // Set up activity event listeners
  useEffect(() => {
    if (!isAdminLoggedIn) {
      setIsWarningOpen(false);
      warningStartRef.current = null;
      return;
    }

    // Initialize last activity
    const now = Date.now();
    lastActivityRef.current = now;
    try {
      localStorage.setItem(STORAGE_KEY_LAST_ACTIVITY, String(now));
    } catch {
      // ignore
    }

    // Throttled event listener to avoid frequent state/storage updates
    let lastEventTime = 0;
    const handleUserActivity = () => {
      const currentTime = Date.now();
      if (currentTime - lastEventTime > 1500) {
        lastEventTime = currentTime;
        recordActivity();
      }
    };

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach((ev) => window.addEventListener(ev, handleUserActivity, { passive: true }));

    // Listen to tab visibility change (e.g. user returns to tab after a while)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const stored = localStorage.getItem(STORAGE_KEY_LAST_ACTIVITY);
        if (stored) {
          const storedTime = parseInt(stored, 10);
          if (!isNaN(storedTime)) {
            lastActivityRef.current = Math.max(lastActivityRef.current, storedTime);
          }
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      events.forEach((ev) => window.removeEventListener(ev, handleUserActivity));
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAdminLoggedIn, recordActivity]);

  // Periodic interval checking for 10 minutes inactivity & running the countdown
  useEffect(() => {
    if (!isAdminLoggedIn) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const inactiveDuration = now - lastActivityRef.current;

      if (!isWarningOpen) {
        // If inactive for 10 minutes or more, trigger warning modal
        if (inactiveDuration >= INACTIVITY_LIMIT_MS) {
          setIsWarningOpen(true);
          warningStartRef.current = now;
          setSecondsRemaining(COUNTDOWN_SECONDS);
        }
      } else {
        // Modal is open, count down remaining time
        if (warningStartRef.current) {
          const elapsedInWarning = Math.floor((now - warningStartRef.current) / 1000);
          const remaining = COUNTDOWN_SECONDS - elapsedInWarning;

          if (remaining <= 0) {
            // Inactivity countdown expired: log out user
            setIsWarningOpen(false);
            warningStartRef.current = null;
            adminLogout();
            showToast('Session expired after 10 minutes of inactivity. Please log in again.');
          } else {
            setSecondsRemaining(remaining);
          }
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAdminLoggedIn, isWarningOpen, adminLogout, showToast]);

  if (!isAdminLoggedIn || !isWarningOpen) {
    return null;
  }

  // Calculate percentage for progress bar
  const percentLeft = Math.max(0, Math.min(100, (secondsRemaining / COUNTDOWN_SECONDS) * 100));

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="session-warning-title"
      className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 print:hidden"
    >
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 animate-in zoom-in-95 duration-200">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-amber-600 via-stone-900 to-emerald-950 p-6 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400/50 text-amber-300 flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Clock className="w-8 h-8 animate-pulse text-amber-300" />
          </div>
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-300 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-500/30">
            Security Inactivity Alert
          </span>
          <h3 id="session-warning-title" className="text-xl font-black mt-2 text-white">
            Session Expiring Soon
          </h3>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            GokulaKrishnan Agencies Stockist Portal
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 text-stone-800">
          <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-600">
              <span>Merchant:</span>
              <strong className="text-stone-900 font-extrabold">{currentAdmin?.name || 'Owner'}</strong>
              <span className="text-stone-400">({currentAdmin?.phone})</span>
            </div>
            <p className="text-sm font-semibold text-stone-700 leading-relaxed">
              You have been inactive for <strong className="text-amber-800 font-extrabold">10 minutes</strong>.
              Would you like to stay logged in?
            </p>
          </div>

          {/* Countdown Display */}
          <div className="space-y-2 text-center">
            <div className="flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span className="text-xs text-stone-600 font-medium">Auto-logging out in:</span>
              <span className="font-mono text-base font-extrabold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                {secondsRemaining}s
              </span>
            </div>

            {/* Countdown Progress Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden border border-stone-200">
              <div
                className={`h-full transition-all duration-1000 ${
                  secondsRemaining > 20 ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'
                }`}
                style={{ width: `${percentLeft}%` }}
              />
            </div>
            <p className="text-[11px] text-stone-500">
              Your godown data, stock count, and invoices remain secure.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={handleStayLoggedIn}
              autoFocus
              className="flex-1 py-3 px-4 rounded-2xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Stay Logged In</span>
            </button>

            <button
              type="button"
              onClick={handleLogoutNow}
              className="py-3 px-4 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-stone-500" />
              <span>Log Out Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
