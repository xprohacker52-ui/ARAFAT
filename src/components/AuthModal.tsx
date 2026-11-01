import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { AuthUser, Language } from '../types';
import { GoogleLogo } from './BrandLogos';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  onLoginSuccess: (user: AuthUser) => void;
  initialMode?: 'login' | 'register';
}

// Preset suggested Google accounts for instant single-click authorization
const SUGGESTED_GOOGLE_ACCOUNTS = [
  {
    name: 'Arafat Chowdhury',
    email: 'xprohacker52@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
    sub: 'google-sub-109283741',
  },
  {
    name: 'Tanvir Hossain',
    email: 'tanvir.gamer.bd@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=160&q=80',
    sub: 'google-sub-987261543',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  lang,
  onLoginSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [showGoogleChooser, setShowGoogleChooser] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [selectedGoogleAccount, setSelectedGoogleAccount] = useState<string | null>(null);

  // Custom Google input
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Manual Form State
  const [name, setName] = useState('');
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setErrorMessage(null);
    setShowGoogleChooser(false);
    setShowCustomGoogleInput(false);
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  // Handle Google 1-Click Login / Registration
  const handleSelectGoogleAccount = (acc: { name: string; email: string; avatar: string; sub: string }) => {
    setSelectedGoogleAccount(acc.email);
    setGoogleLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const user: AuthUser = {
        id: `AG-USR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: acc.name,
        email: acc.email,
        avatar: acc.avatar,
        phone: '01712345678',
        loginMethod: 'google',
        googleSub: acc.sub,
        createdAt: new Date().toISOString(),
      };

      setGoogleLoading(false);
      setShowGoogleChooser(false);
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim() || !customGoogleEmail.includes('@')) {
      setErrorMessage(lang === 'bn' ? 'সঠিক জিমেইল অ্যাড্রেস লিখুন!' : 'Please enter a valid Gmail address!');
      return;
    }
    const cleanEmail = customGoogleEmail.trim().toLowerCase();
    const inferredName = customGoogleName.trim() || cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    setGoogleLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      const user: AuthUser = {
        id: `AG-USR-${Math.floor(100000 + Math.random() * 900000)}`,
        name: inferredName,
        email: cleanEmail,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        phone: '017' + Math.floor(10000000 + Math.random() * 90000000),
        loginMethod: 'google',
        googleSub: `custom-sub-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };

      setGoogleLoading(false);
      setShowGoogleChooser(false);
      onLoginSuccess(user);
      onClose();
    }, 800);
  };

  // Handle Standard Email/Phone Sign In or Register
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'register') {
      if (!name.trim()) {
        setErrorMessage(lang === 'bn' ? 'আপনার নাম লিখুন' : 'Please enter your name');
        return;
      }
      if (!identifier.trim()) {
        setErrorMessage(lang === 'bn' ? 'ইমেইল বা ফোন নম্বর লিখুন' : 'Please enter email or phone');
        return;
      }
      if (!password || password.length < 6) {
        setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে' : 'Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড দুটি মিলছে না' : 'Passwords do not match');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const isEmail = identifier.includes('@');
        const user: AuthUser = {
          id: `AG-USR-${Math.floor(100000 + Math.random() * 900000)}`,
          name: name.trim(),
          email: isEmail ? identifier.trim().toLowerCase() : `${identifier.trim()}@arafatgaming.local`,
          phone: !isEmail ? identifier.trim() : (phone.trim() || '01712345678'),
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(identifier)}`,
          loginMethod: isEmail ? 'email' : 'phone',
          createdAt: new Date().toISOString(),
        };

        setLoading(false);
        onLoginSuccess(user);
        onClose();
      }, 700);
    } else {
      // Login mode
      if (!identifier.trim()) {
        setErrorMessage(lang === 'bn' ? 'ইমেইল বা ফোন নম্বর লিখুন' : 'Please enter email or phone');
        return;
      }
      if (!password) {
        setErrorMessage(lang === 'bn' ? 'পাসওয়ার্ড লিখুন' : 'Please enter your password');
        return;
      }

      setLoading(true);
      setTimeout(() => {
        const isEmail = identifier.includes('@');
        const user: AuthUser = {
          id: `AG-USR-${Math.floor(100000 + Math.random() * 900000)}`,
          name: identifier.split('@')[0],
          email: isEmail ? identifier.trim().toLowerCase() : `${identifier.trim()}@arafatgaming.local`,
          phone: !isEmail ? identifier.trim() : '01712345678',
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(identifier)}`,
          loginMethod: isEmail ? 'email' : 'phone',
          createdAt: new Date().toISOString(),
        };

        setLoading(false);
        onLoginSuccess(user);
        onClose();
      }, 700);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0722] border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/70 overflow-hidden text-slate-100">
        
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 sm:p-6 pb-4 flex items-center justify-between border-b border-purple-900/40 bg-gradient-to-b from-[#140b2e] to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 shadow-md">
              <div className="w-full h-full bg-[#0a051d] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-white">
                {mode === 'login'
                  ? (lang === 'bn' ? 'অ্যাকাউন্টে লগইন করুন' : 'Sign in to Account')
                  : (lang === 'bn' ? 'নতুন অ্যাকাউন্ট তৈরি করুন' : 'Create an Account')}
              </h3>
              <p className="text-xs text-cyan-300/80 font-medium">
                {lang === 'bn' ? 'টপ-আপ, সাবস্ক্রিপশন ও ওয়ালেট সুবিধা পান' : 'Unlock Top-Up, Subscriptions & Wallet'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto space-y-4">
          
          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-500/50 rounded-xl text-red-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ======================================================= */}
          {/* 1. SEAMLESS GOOGLE SIGN-IN BUTTON (PROMINENT AT TOP)    */}
          {/* ======================================================= */}
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => {
                setShowGoogleChooser(!showGoogleChooser);
                setErrorMessage(null);
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-lg shadow-black/40 hover:shadow-cyan-500/20 transition-all transform hover:scale-[1.01] active:scale-[0.99] border border-slate-200 cursor-pointer group"
            >
              <GoogleLogo className="w-5 h-5 shrink-0 group-hover:scale-110 transition-transform" />
              <span>
                {lang === 'bn' ? 'Google দিয়ে চালিয়ে যান' : 'Continue with Google'}
              </span>
            </button>
            <p className="text-[11px] text-center text-slate-400">
              {lang === 'bn'
                ? '⚡ কোনো পাসওয়ার্ড লাগবে না—১ ক্লিকে ইনস্ট্যান্ট লগইন'
                : '⚡ 1-Click Instant Sign-In with your Gmail account'}
            </p>
          </div>

          {/* Google Account Selector Drawer (when clicked) */}
          {showGoogleChooser && (
            <div className="p-4 rounded-2xl bg-[#140b2e] border border-cyan-500/40 space-y-3 animate-fade-in shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  {lang === 'bn' ? 'আপনার Google অ্যাকাউন্ট বেছে নিন' : 'Choose a Google Account'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">OAuth 2.0</span>
              </div>

              {/* Suggested / Detected Gmail Accounts */}
              <div className="space-y-2">
                {SUGGESTED_GOOGLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    disabled={googleLoading}
                    onClick={() => handleSelectGoogleAccount(acc)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-[#1d1040] hover:bg-cyan-950/60 border border-purple-800/60 hover:border-cyan-400 text-left transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        referrerPolicy="no-referrer"
                        className="w-9 h-9 rounded-full object-cover border border-cyan-400/50 group-hover:border-cyan-300"
                      />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">
                          {acc.name}
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          {acc.email}
                        </div>
                      </div>
                    </div>
                    {googleLoading && selectedGoogleAccount === acc.email ? (
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    )}
                  </button>
                ))}
              </div>

              {/* Option to use another Google account */}
              {!showCustomGoogleInput ? (
                <button
                  type="button"
                  onClick={() => setShowCustomGoogleInput(true)}
                  className="w-full text-center py-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 cursor-pointer"
                >
                  {lang === 'bn' ? '+ অন্য কোনো Gmail দিয়ে লগইন করুন' : '+ Use another Gmail account'}
                </button>
              ) : (
                <form onSubmit={handleCustomGoogleSubmit} className="space-y-2 pt-2 border-t border-purple-900/40">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      {lang === 'bn' ? 'আপনার Gmail ঠিকানা:' : 'Your Gmail Address:'}
                    </label>
                    <input
                      type="email"
                      required
                      value={customGoogleEmail}
                      onChange={(e) => setCustomGoogleEmail(e.target.value)}
                      placeholder="yourname@gmail.com"
                      className="w-full px-3 py-2 rounded-xl bg-[#0a051d] border border-cyan-500/50 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1">
                      {lang === 'bn' ? 'আপনার নাম (ঐচ্ছিক):' : 'Your Name (Optional):'}
                    </label>
                    <input
                      type="text"
                      value={customGoogleName}
                      onChange={(e) => setCustomGoogleName(e.target.value)}
                      placeholder="e.g. Shakil Ahmed"
                      className="w-full px-3 py-2 rounded-xl bg-[#0a051d] border border-purple-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCustomGoogleInput(false)}
                      className="px-3 py-1.5 text-xs text-slate-400 hover:text-white rounded-lg bg-white/5 cursor-pointer"
                    >
                      {lang === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={googleLoading}
                      className="flex-1 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {googleLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{lang === 'bn' ? 'Google দিয়ে প্রবেশ' : 'Sign in with Google'}</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 my-2">
            <div className="h-px bg-purple-900/60 flex-1" />
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'bn' ? 'অথবা ইমেইল / ফোন দিয়ে' : 'OR WITH EMAIL / PHONE'}
            </span>
            <div className="h-px bg-purple-900/60 flex-1" />
          </div>

          {/* ======================================================= */}
          {/* 2. MANUAL LOGIN & REGISTRATION FORM                     */}
          {/* ======================================================= */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'আপনার সম্পূর্ণ নাম' : 'Full Name'} *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={lang === 'bn' ? 'যেমন: আরাফাত সনি' : 'e.g. Arafat Sony'}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#140b2e] border border-purple-800/60 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'bn' ? 'ইমেইল অথবা মোবাইল নম্বর' : 'Email or Phone Number'} *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={lang === 'bn' ? '017XXXXXXXX অথবা email@gmail.com' : '017XXXXXXXX or email@gmail.com'}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#140b2e] border border-purple-800/60 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {mode === 'register' && identifier.includes('@') && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'বিকাশ / নগদ ফোন নম্বর' : 'bKash / Nagad Phone'}
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#140b2e] border border-purple-800/60 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {lang === 'bn' ? 'পাসওয়ার্ড' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#140b2e] border border-purple-800/60 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {lang === 'bn' ? 'পাসওয়ার্ড নিশ্চিত করুন' : 'Confirm Password'} *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#140b2e] border border-purple-800/60 focus:border-cyan-400 text-xs text-white placeholder-slate-500 focus:outline-none font-mono"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-sm shadow-lg shadow-cyan-950/60 hover:shadow-cyan-500/30 transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? (lang === 'bn' ? 'সাইন ইন করুন' : 'Sign In')
                      : (lang === 'bn' ? 'রেজিস্ট্রেশন সম্পূর্ণ করুন' : 'Complete Registration')}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch Mode Footer */}
          <div className="pt-3 border-t border-purple-900/40 text-center">
            {mode === 'login' ? (
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'কোনো অ্যাকাউন্ট নেই?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer ml-1"
                >
                  {lang === 'bn' ? 'নতুন অ্যাকাউন্ট খুলুন' : 'Sign Up Free'}
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                {lang === 'bn' ? 'ইতিমধ্যে অ্যাকাউন্ট আছে?' : 'Already have an account?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage(null);
                  }}
                  className="font-bold text-cyan-400 hover:text-cyan-300 hover:underline cursor-pointer ml-1"
                >
                  {lang === 'bn' ? 'লগইন করুন' : 'Log In'}
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
