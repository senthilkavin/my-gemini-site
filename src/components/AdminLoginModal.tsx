import React, { useState } from 'react';
import {
  X,
  Lock,
  UserCheck,
  ShieldCheck,
  Building2,
  KeyRound,
  ArrowRight,
  Phone,
  AlertCircle,
  Mail,
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, adminLogin } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = adminLogin(username, password);
    if (!success) {
      setErrorMsg('Incorrect username or password. Check default password "gokul123"');
    }
  };

  const handleQuickLogin = (user: string) => {
    setUsername(user);
    setPassword('gokul123');
    adminLogin(user, 'gokul123');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 relative border-b border-stone-800">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/50 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                Owner & Merchant Portal
              </span>
              <h2 className="text-xl font-black text-white font-serif">
                GokulaKrishnan Agencies
              </h2>
              <p className="text-stone-400 text-xs mt-0.5">
                Proprietors: Sahadevan & Arun Kavinaya
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-start gap-2.5 text-emerald-900">
            <KeyRound className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="block font-bold">Owner Access Clearance:</strong>
              Log in to manage stock entries, receive customer payments, and generate official sales bills.
            </div>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-center gap-2 text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-bold text-stone-700 block mb-1">
                Owner Username *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="admin / sahadevan / arun"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-stone-700 block">
                  Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(!showForgotPassword)}
                  className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Mail className="w-3 h-3 text-emerald-600" />
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Enter owner password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1">
                <span>
                  Default: <strong className="text-stone-700 font-mono">gokul123</strong>
                </span>
                <a
                  href={`mailto:sskavinsenthil2311@gmail.com?subject=Owner%20Password%20Reset%20Request%20-%20GokulaKrishnan%20Agencies&body=Hello%20Administrator,%0A%0APlease%20reset%20the%20Owner%20login%20password%20for%20GokulaKrishnan%20Agencies.%0AUsername:%20${encodeURIComponent(username || 'admin')}%0A%0AThank%20you.`}
                  className="text-stone-500 hover:text-emerald-700 hover:underline inline-flex items-center gap-0.5"
                  title="Direct email link to sskavinsenthil2311@gmail.com"
                >
                  Help: <span className="font-medium text-emerald-700">sskavinsenthil2311@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Forgot Password Drawer/Box */}
            {showForgotPassword && (
              <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-300 text-stone-800 space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-amber-950">Password Reset Request</h4>
                      <p className="text-[10px] text-amber-800">Directly contact primary admin</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(false)}
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-stone-700 leading-relaxed">
                  For password resets or owner credential issues, please email the designated administrator at{' '}
                  <strong className="text-stone-900 font-semibold">sskavinsenthil2311@gmail.com</strong>.
                </p>

                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-amber-200">
                  <span className="font-mono text-[11px] text-emerald-800 font-bold select-all flex-1 truncate">
                    sskavinsenthil2311@gmail.com
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText('sskavinsenthil2311@gmail.com');
                      setCopiedEmail(true);
                      setTimeout(() => setCopiedEmail(false), 2000);
                    }}
                    className="px-2.5 py-1 text-[10px] font-bold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center gap-1 transition-colors"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" /> Copy
                      </>
                    )}
                  </button>
                </div>

                <a
                  href={`mailto:sskavinsenthil2311@gmail.com?subject=Owner%20Password%20Reset%20Request%20-%20GokulaKrishnan%20Agencies&body=Hello%20Administrator,%0A%0APlease%20reset%20the%20Owner%20login%20password%20for%20GokulaKrishnan%20Agencies.%0AUsername:%20${encodeURIComponent(username || 'admin')}%0A%0AThank%20you.`}
                  className="w-full py-2 px-3 rounded-xl bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all text-center"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Send Email to sskavinsenthil2311@gmail.com
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all"
            >
              <Lock className="w-4 h-4" /> Enter Owner Dashboard
            </button>
          </form>

          {/* Quick One-Click Owner Login Buttons for Convenience */}
          <div className="pt-2 border-t border-stone-200">
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2 text-center">
              Quick Owner Selection
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('sahadevan')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-left transition-colors"
              >
                <div className="font-extrabold text-stone-900 text-xs">Sahadevan</div>
                <div className="text-[10px] text-emerald-700 font-mono">+91 94864 26294</div>
                <div className="text-[9px] text-stone-500 mt-0.5">Click to auto-login</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('arun')}
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-left transition-colors"
              >
                <div className="font-extrabold text-stone-900 text-xs">Arun Kavinaya</div>
                <div className="text-[10px] text-emerald-700 font-mono">+91 97909 74822</div>
                <div className="text-[9px] text-stone-500 mt-0.5">Click to auto-login</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
