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
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle2,
  Key,
  Send,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AdminLoginModal: React.FC = () => {
  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    adminLogin,
    ownerPassword,
    updateOwnerPassword,
    showToast,
  } = useStore();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Password Recovery States
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [recoveryTab, setRecoveryTab] = useState<'instant' | 'link' | 'reveal'>('instant');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetFeedback, setResetFeedback] = useState<string | null>(null);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);
  const [showPassText, setShowPassText] = useState(false);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = adminLogin(username, password);
    if (!success) {
      setErrorMsg(`Incorrect password. Default is "gokul123" or click "Forgot Password?" to reset.`);
    }
  };

  const handleQuickLogin = (user: string) => {
    setUsername(user);
    setPassword(ownerPassword || 'gokul123');
    adminLogin(user, ownerPassword || 'gokul123');
  };

  // Instant Reset Handler
  const handleInstantPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    setResetFeedback(null);

    const cleanPass = newPassword.trim();
    if (!cleanPass) {
      setResetFeedback('Please enter a new password.');
      return;
    }
    if (cleanPass.length < 4) {
      setResetFeedback('Password should be at least 4 characters.');
      return;
    }
    if (cleanPass !== confirmPassword.trim()) {
      setResetFeedback('Passwords do not match. Please verify.');
      return;
    }

    // Save password
    updateOwnerPassword(cleanPass);
    setPassword(cleanPass);
    setResetFeedback(null);

    // Auto log in with the new password
    setTimeout(() => {
      adminLogin(username || 'admin', cleanPass);
      setShowForgotPassword(false);
      showToast('Password reset successfully! You are now logged in as Owner.');
    }, 400);
  };

  // Generate Reset Link
  const handleGenerateLink = () => {
    const timestamp = Date.now();
    const origin = window.location.origin || 'https://gokulakrishnan-agencies.web.app';
    const link = `${origin}/#reset-password?email=sskavinsenthil2311@gmail.com&token=gka-${timestamp}`;
    setGeneratedLink(link);
    showToast('Secure password reset link generated for sskavinsenthil2311@gmail.com!');
  };

  const gmailWebComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=sskavinsenthil2311@gmail.com&su=${encodeURIComponent(
    'Password Reset Request - GokulaKrishnan Agencies'
  )}&body=${encodeURIComponent(
    `Hello Administrator,\n\nPlease reset the Owner portal login password for GokulaKrishnan Agencies.\nDesignated Admin: sskavinsenthil2311@gmail.com\nRequested Username: ${
      username || 'admin'
    }\n\nThank you.`
  )}`;

  const mailtoUrl = `mailto:sskavinsenthil2311@gmail.com?subject=${encodeURIComponent(
    'Password Reset Request - GokulaKrishnan Agencies'
  )}&body=${encodeURIComponent(
    `Hello Administrator,\n\nPlease reset the Owner portal login password for GokulaKrishnan Agencies.\nUsername: ${
      username || 'admin'
    }`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-stone-200 flex flex-col animate-in zoom-in-95">
        {/* Header */}
        <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white p-6 relative border-b border-stone-800">
          <button
            onClick={() => {
              setIsLoginModalOpen(false);
              setShowForgotPassword(false);
            }}
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
                {showForgotPassword ? 'Password Recovery Center' : 'Owner & Merchant Portal'}
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

        {/* FORGOT PASSWORD WORKFLOW */}
        {showForgotPassword ? (
          <div className="p-6 space-y-5 text-xs">
            <div className="bg-amber-50 border border-amber-300 p-3.5 rounded-2xl flex items-start gap-2.5 text-amber-900">
              <Key className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Password Reset Assistance:</strong>
                Account verified for primary owner at{' '}
                <span className="font-mono font-bold text-amber-950">sskavinsenthil2311@gmail.com</span>
              </div>
            </div>

            {/* Recovery Mode Selector Tabs */}
            <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-2xl border border-stone-200">
              <button
                type="button"
                onClick={() => setRecoveryTab('instant')}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl transition-all ${
                  recoveryTab === 'instant'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                1. Set New Pass
              </button>
              <button
                type="button"
                onClick={() => {
                  setRecoveryTab('link');
                  if (!generatedLink) handleGenerateLink();
                }}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl transition-all ${
                  recoveryTab === 'link'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                2. Reset Link
              </button>
              <button
                type="button"
                onClick={() => setRecoveryTab('reveal')}
                className={`py-2 px-1 text-center font-bold text-[11px] rounded-xl transition-all ${
                  recoveryTab === 'reveal'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                3. Show Pass
              </button>
            </div>

            {/* TAB 1: Instant In-App Reset Form */}
            {recoveryTab === 'instant' && (
              <form onSubmit={handleInstantPasswordReset} className="space-y-4 animate-in fade-in">
                <div className="text-[11px] text-stone-600">
                  Type your new owner password below to update it instantly in Firebase & local storage:
                </div>

                {resetFeedback && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{resetFeedback}</span>
                  </div>
                )}

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Enter New Password *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter new password (e.g. gokul2026)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    Confirm New Password *
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border-2 border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-900 font-semibold text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Save New Password & Enter Dashboard
                </button>
              </form>
            )}

            {/* TAB 2: Get Direct Reset Link & Email Options */}
            {recoveryTab === 'link' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="bg-stone-50 border border-stone-200 p-3.5 rounded-2xl space-y-2">
                  <span className="font-bold text-stone-800 block text-xs">
                    Official Password Reset Link:
                  </span>
                  <div className="p-2.5 bg-white border border-stone-300 rounded-xl font-mono text-[11px] text-emerald-800 break-all select-all">
                    {generatedLink || `${window.location.origin}/#reset-password?email=sskavinsenthil2311@gmail.com`}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        const link = generatedLink || `${window.location.origin}/#reset-password?email=sskavinsenthil2311@gmail.com`;
                        navigator.clipboard.writeText(link);
                        setCopiedLink(true);
                        setTimeout(() => setCopiedLink(false), 2000);
                        showToast('Reset link copied to clipboard!');
                      }}
                      className="flex-1 py-2 px-3 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      {copiedLink ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-700" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Link
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRecoveryTab('instant')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Key className="w-3.5 h-3.5" /> Open Reset Form
                    </button>
                  </div>
                </div>

                {/* Email Direct Actions */}
                <div className="border border-stone-200 rounded-2xl p-3.5 space-y-2.5">
                  <span className="font-bold text-stone-700 block text-[11px] uppercase tracking-wider">
                    Send Link via Email:
                  </span>

                  <div className="flex items-center justify-between p-2 rounded-xl bg-stone-100 border border-stone-200">
                    <span className="font-mono font-bold text-xs text-stone-800">
                      sskavinsenthil2311@gmail.com
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText('sskavinsenthil2311@gmail.com');
                        setCopiedEmail(true);
                        setTimeout(() => setCopiedEmail(false), 2000);
                      }}
                      className="px-2 py-1 rounded bg-white text-stone-700 hover:bg-stone-200 text-[10px] font-bold border border-stone-300"
                    >
                      {copiedEmail ? 'Copied' : 'Copy Email'}
                    </button>
                  </div>

                  {/* Gmail Web direct compose - works in EVERY browser without mail client */}
                  <a
                    href={gmailWebComposeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors text-center"
                  >
                    <Mail className="w-4 h-4" />
                    Open & Compose in Gmail Web (Direct Link)
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>

                  {/* Standard Mailto fallback */}
                  <a
                    href={mailtoUrl}
                    className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors text-center border border-stone-300"
                  >
                    <Send className="w-3 h-3" />
                    Open Default Email App (Mailto)
                  </a>
                </div>
              </div>
            )}

            {/* TAB 3: Reveal Current Password */}
            {recoveryTab === 'reveal' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-2xl space-y-2">
                  <span className="text-[11px] font-bold text-emerald-900 block">
                    Current Active Password for Owner Access:
                  </span>

                  <div className="flex items-center gap-2 bg-white border border-emerald-300 rounded-xl p-3">
                    <span className="font-mono font-extrabold text-base text-stone-900 flex-1">
                      {showPassText ? (ownerPassword || 'gokul123') : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowPassText(!showPassText)}
                      className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                      title={showPassText ? 'Hide Password' : 'Show Password'}
                    >
                      {showPassText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(ownerPassword || 'gokul123');
                        setCopiedPassword(true);
                        setTimeout(() => setCopiedPassword(false), 2000);
                        showToast('Password copied to clipboard!');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-[10px] hover:bg-emerald-800 transition-colors"
                    >
                      {copiedPassword ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <p className="text-[10px] text-emerald-800 pt-1">
                    You can copy this current password or click the button below to auto-fill it and log in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setPassword(ownerPassword || 'gokul123');
                    setShowForgotPassword(false);
                    adminLogin(username || 'admin', ownerPassword || 'gokul123');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  Auto-Fill Current Password & Log In
                </button>
              </div>
            )}

            {/* Back Button */}
            <div className="pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs transition-colors"
              >
                ← Back to Normal Owner Login
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD OWNER LOGIN FORM */
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
                    onClick={() => {
                      setShowForgotPassword(true);
                      setRecoveryTab('instant');
                    }}
                    className="text-[11px] text-emerald-700 hover:text-emerald-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Key className="w-3.5 h-3.5 text-emerald-600" />
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
                <div className="flex justify-between items-center text-[10px] text-stone-500 mt-1.5">
                  <span>
                    Current default: <strong className="text-stone-700 font-mono">{ownerPassword || 'gokul123'}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(true);
                      setRecoveryTab('link');
                    }}
                    className="text-emerald-700 hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    Reset link: <span className="font-mono">sskavinsenthil2311@gmail.com</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
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
                  className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-left transition-colors cursor-pointer"
                >
                  <div className="font-extrabold text-stone-900 text-xs">Sahadevan</div>
                  <div className="text-[10px] text-emerald-700 font-mono">+91 94864 26294</div>
                  <div className="text-[9px] text-stone-500 mt-0.5">Click to auto-login</div>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('arun')}
                  className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 border border-stone-300 text-left transition-colors cursor-pointer"
                >
                  <div className="font-extrabold text-stone-900 text-xs">Arun Kavinaya</div>
                  <div className="text-[10px] text-emerald-700 font-mono">+91 97909 74822</div>
                  <div className="text-[9px] text-stone-500 mt-0.5">Click to auto-login</div>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
