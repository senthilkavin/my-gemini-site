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
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, adminLogin } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

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
                <span className="text-[10px] text-stone-500 font-mono">
                  Default: <strong className="text-stone-700">gokul123</strong>
                </span>
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
            </div>

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
