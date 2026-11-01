import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Coins,
  ShieldCheck,
  LogOut,
  Calendar,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { AuthUser, Language, UserWallet } from '../types';
import { GoogleLogo } from './BrandLogos';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  user: AuthUser;
  wallet: UserWallet;
  onOpenAddMoney: () => void;
  onOpenTracking: () => void;
  onLogout: () => void;
  onUpdatePhone?: (newPhone: string) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  lang,
  user,
  wallet,
  onOpenAddMoney,
  onOpenTracking,
  onLogout,
  onUpdatePhone,
}) => {
  const [copiedId, setCopiedId] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phoneInput, setPhoneInput] = useState(user.phone || wallet.phone || '');

  if (!isOpen) return null;

  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleSavePhone = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdatePhone && phoneInput.trim()) {
      onUpdatePhone(phoneInput.trim());
      setEditingPhone(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0d0722] border-2 border-cyan-500/40 rounded-3xl shadow-2xl shadow-cyan-950/70 overflow-hidden text-slate-100">
        {/* Glow Header Accent */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-cyan-400 to-indigo-500" />

        {/* Modal Header */}
        <div className="p-5 flex items-center justify-between border-b border-purple-900/40 bg-gradient-to-b from-[#140b2e] to-transparent">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base sm:text-lg font-black text-white">
              {lang === 'bn' ? 'আমার অ্যাকাউন্ট প্রোফাইল' : 'My Account Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Card Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Top User Lockup */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#140b2e] border border-cyan-500/30">
            <div className="relative">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-full object-cover border-2 border-cyan-400 shadow-md"
              />
              {user.loginMethod === 'google' && (
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white p-0.5 shadow-md flex items-center justify-center"
                  title="Google Verified Account"
                >
                  <GoogleLogo className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-base font-extrabold text-white truncate">{user.name}</h4>
              </div>
              <p className="text-xs text-slate-300 truncate font-mono">{user.email}</p>
              
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded-md border border-cyan-500/30">
                  {user.id}
                </span>
                <button
                  onClick={handleCopyId}
                  className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-0.5 cursor-pointer"
                >
                  {copiedId ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedId ? (lang === 'bn' ? 'কপি!' : 'Copied') : (lang === 'bn' ? 'কপি' : 'Copy')}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Site Currency / AG Coins Balance Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/70 via-indigo-950/70 to-purple-950/70 border-2 border-cyan-500/40 shadow-lg shadow-cyan-950/40">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center font-black">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-cyan-200 uppercase tracking-wider block">
                    {lang === 'bn' ? 'ওয়ালেট ব্যালেন্স (AG Coins)' : 'Wallet Balance (AG Coins)'}
                  </span>
                  <span className="text-xl font-black font-mono text-emerald-400">
                    ৳{wallet.balance.toLocaleString()}{' '}
                    <span className="text-xs font-sans text-slate-300">AG Coins</span>
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAddMoney();
                }}
                className="px-3 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1 group"
              >
                <span>+ {lang === 'bn' ? 'অ্যাড মানি' : 'Add Money'}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400">
              {lang === 'bn'
                ? '১ AG Coin = ১ BDT। ইনস্ট্যান্ট অর্ডার করতে বিকাশ বা নগদ থেকে টাকা যোগ করুন।'
                : '1 AG Coin = ৳1 BDT. Use for instant checkout across all services.'}
            </p>
          </div>

          {/* Account Details & Contact Phone */}
          <div className="space-y-2 text-xs bg-[#140b2e]/60 p-3.5 rounded-xl border border-purple-900/40">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'bn' ? 'বিকাশ / নগদ ফোন:' : 'Linked Phone:'}
              </span>
              {editingPhone ? (
                <form onSubmit={handleSavePhone} className="flex items-center gap-1">
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-28 px-2 py-0.5 rounded bg-black/60 border border-cyan-400 text-xs text-white font-mono"
                  />
                  <button type="submit" className="text-cyan-400 text-[10px] font-bold">
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="font-mono text-white">{user.phone || wallet.phone || '01712345678'}</span>
                  <button
                    onClick={() => setEditingPhone(true)}
                    className="text-[10px] text-cyan-400 hover:underline ml-1 cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-purple-900/30">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                {lang === 'bn' ? 'লগইন মাধ্যম:' : 'Login Method:'}
              </span>
              <span className="font-bold text-white capitalize flex items-center gap-1">
                {user.loginMethod === 'google' ? (
                  <>
                    <GoogleLogo className="w-3.5 h-3.5" />
                    <span>Google Account</span>
                  </>
                ) : (
                  user.loginMethod
                )}
              </span>
            </div>

            <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-purple-900/30">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                {lang === 'bn' ? 'যোগদানের তারিখ:' : 'Member Since:'}
              </span>
              <span className="text-slate-300 font-mono text-[11px]">
                {new Date(user.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Action Links */}
          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onClose();
                onOpenTracking();
              }}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-[#140b2e] hover:bg-[#1f1047] border border-purple-800/60 text-slate-200 hover:text-cyan-300 transition-colors text-xs font-bold cursor-pointer"
            >
              <span className="flex items-center gap-2">
                <span>📦</span>
                <span>{lang === 'bn' ? 'আমার অর্ডার হিস্ট্রি ও ট্র্যাকিং' : 'My Orders & Real-time Tracking'}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                onClose();
                onLogout();
              }}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 text-red-300 hover:text-red-100 transition-colors text-xs font-bold cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>{lang === 'bn' ? 'অ্যাকাউন্ট থেকে লগআউট করুন' : 'Sign Out of Account'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
