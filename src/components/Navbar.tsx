import React, { useState } from 'react';
import {
  Shield,
  Sparkles,
  Menu,
  X,
  Globe,
  ShoppingBag,
  Search,
  Users,
  Tv,
  Gamepad2,
  Gift,
  Coins,
  LogIn,
  UserCheck,
} from 'lucide-react';
import { AuthUser, Language, UserWallet } from '../types';
import { translations } from '../data/translations';
import { GoogleLogo } from './BrandLogos';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenOrderModal: () => void;
  onOpenTrack: () => void;
  wallet?: UserWallet;
  onOpenAddMoney: () => void;
  currentUser?: AuthUser | null;
  onOpenAuthModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  onOpenOrderModal,
  onOpenTrack,
  wallet = { phone: '01700000000', balance: 0 },
  onOpenAddMoney,
  currentUser = null,
  onOpenAuthModal,
  onOpenProfileModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070314]/95 backdrop-blur-md border-b border-blue-900/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-3">
          {/* Zone 1: Website Logo & Brand Lockup */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-blue-950/60 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0a051d] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg md:text-xl font-black tracking-wider bg-gradient-to-r from-blue-300 via-white to-cyan-300 bg-clip-text text-transparent uppercase whitespace-nowrap">
                ARAFAT GAMING
              </div>
              <div className="text-[10px] text-cyan-300/80 font-bold tracking-tight whitespace-nowrap hidden sm:block">
                {lang === 'bn' ? 'টপ-আপ ও ডিজিটাল শপ' : 'Topup & Digital Shop'}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single Line, Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 cursor-pointer ${
                activeTab === 'home' ? 'text-cyan-400 font-bold' : 'text-slate-300'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('topup')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 cursor-pointer ${
                activeTab === 'topup' ? 'text-cyan-400 font-bold' : 'text-slate-300'
              }`}
            >
              {lang === 'bn' ? '🎮 টপ-আপ' : 'Topup'}
            </button>
            <button
              onClick={() => handleNavClick('mystery')}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'মিস্ট্রি বক্স' : 'Mystery Box'}</span>
            </button>
            <button
              onClick={() => handleNavClick('subscriptions')}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'সাবস্ক্রিপশন' : 'Subscriptions'}</span>
            </button>
            <button
              onClick={() => handleNavClick('social-boost')}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'সোশ্যাল বুস্ট' : 'Social Boost'}</span>
            </button>
            <button
              onClick={onOpenTrack}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.navTrackOrder}</span>
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-cyan-300 cursor-pointer ${
                activeTab === 'contact' ? 'text-cyan-400 font-bold' : 'text-slate-300'
              }`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Zone 3: Actions (Google Login / Account Profile, Account Balance, Language, Admin) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Prominent Login / Account Balance Button */}
            <button
              onClick={onOpenAddMoney}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border-2 border-cyan-500/50 hover:border-cyan-400 text-white shadow-lg shadow-cyan-950/40 hover:shadow-cyan-500/20 transition-all transform hover:scale-[1.02] group cursor-pointer"
              title={lang === 'bn' ? 'ব্যক্তিগত অ্যাকাউন্ট ব্যালেন্স ও অ্যাড মানি' : 'Account Balance & Add Money'}
            >
              <div className="w-6 h-6 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-black flex items-center justify-center font-black text-xs shadow-sm group-hover:rotate-12 transition-transform">
                <Coins className="w-3.5 h-3.5" />
              </div>
              <div className="flex flex-col text-left leading-none">
                <span className="text-[9px] text-cyan-200/80 font-bold uppercase tracking-wider hidden xs:inline">
                  {lang === 'bn' ? 'ব্যালেন্স' : 'Balance'}
                </span>
                <span className="text-xs sm:text-sm font-black font-mono text-emerald-400">
                  ৳{wallet.balance.toLocaleString()} <span className="text-[10px] font-sans text-slate-300">AG</span>
                </span>
              </div>
              <span className="hidden md:inline-block text-[10px] font-black px-1.5 py-0.5 rounded-lg bg-cyan-500 text-black group-hover:bg-cyan-400 transition-colors ml-0.5">
                + {lang === 'bn' ? 'অ্যাড' : 'Add'}
              </span>
            </button>

            {/* Google Login or User Account Chip */}
            {currentUser ? (
              <button
                type="button"
                onClick={onOpenProfileModal}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1 rounded-2xl bg-[#140b2e] hover:bg-[#1f1047] border border-cyan-500/50 hover:border-cyan-300 transition-all cursor-pointer group shadow-md"
                title={lang === 'bn' ? 'প্রোফাইল দেখুন' : 'View Profile'}
              >
                <div className="relative">
                  <img
                    src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email)}`}
                    alt={currentUser.name}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-cyan-400"
                  />
                  {currentUser.loginMethod === 'google' && (
                    <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <GoogleLogo className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-tight pr-1">
                  <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate max-w-[90px]">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <span className="text-[9px] text-cyan-300/80 font-mono">
                    {lang === 'bn' ? 'প্রোফাইল' : 'Profile'}
                  </span>
                </div>
              </button>
            ) : (
              <button
                type="button"
                onClick={onOpenAuthModal}
                className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs shadow-md shadow-cyan-950/40 border border-slate-200 transition-all transform hover:scale-[1.02] cursor-pointer group"
                title={lang === 'bn' ? 'Google দিয়ে সাইন ইন করুন' : 'Sign In with Google'}
              >
                <GoogleLogo className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="hidden sm:inline font-bold">
                  {lang === 'bn' ? 'লগইন' : 'Sign In'}
                </span>
              </button>
            )}

            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 text-xs font-bold rounded-xl bg-[#140b2e] border border-purple-800/50 text-purple-200 hover:text-white hover:bg-purple-900/50 transition-colors whitespace-nowrap cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{lang === 'bn' ? 'EN' : 'বাং'}</span>
            </button>

            {/* Admin shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className="flex items-center gap-1 p-2 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-[#140b2e] border border-transparent hover:border-purple-800/40 transition-colors cursor-pointer"
              title="Admin Panel"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-xl bg-[#140b2e] border border-purple-900/50 focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-purple-900/40 animate-fade-in space-y-2">
            {/* Mobile User Profile / Google Sign-in Card */}
            {currentUser ? (
              <div
                onClick={() => {
                  if (onOpenProfileModal) onOpenProfileModal();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between p-3 rounded-2xl bg-[#140b2e] border border-cyan-500/40 mb-2 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={currentUser.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(currentUser.email)}`}
                      alt={currentUser.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-cyan-400"
                    />
                    {currentUser.loginMethod === 'google' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white flex items-center justify-center shadow-sm">
                        <GoogleLogo className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{currentUser.name}</div>
                    <div className="text-[11px] text-cyan-300 font-mono">{currentUser.email}</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-cyan-400">
                  {lang === 'bn' ? 'প্রোফাইল ›' : 'Profile ›'}
                </span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-[#140b2e] border border-cyan-500/40 mb-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onOpenAuthModal) onOpenAuthModal();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md cursor-pointer"
                >
                  <GoogleLogo className="w-4 h-4" />
                  <span>{lang === 'bn' ? 'Google দিয়ে সাইন ইন / লগইন' : 'Sign in with Google'}</span>
                </button>
              </div>
            )}

            <button
              onClick={() => handleNavClick('home')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-cyan-400 rounded-xl hover:bg-purple-950/40"
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('topup')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-cyan-400 rounded-xl hover:bg-purple-950/40 flex items-center justify-between"
            >
              <span>{lang === 'bn' ? '🎮 টপ-আপ (UID ডায়মন্ড)' : 'Topup (UID Diamonds)'}</span>
              <span className="text-[10px] text-cyan-400 font-mono">100 - 12K</span>
            </button>
            <button
              onClick={() => handleNavClick('mystery')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-amber-400 rounded-xl hover:bg-purple-950/40 flex items-center justify-between"
            >
              <span>{lang === 'bn' ? '🎁 মিস্ট্রি বক্স ও বোনাস' : 'Mystery Box & Bonus'}</span>
              <span className="text-[10px] text-amber-400 font-bold">Jackpot</span>
            </button>
            <button
              onClick={() => handleNavClick('subscriptions')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-pink-400 rounded-xl hover:bg-purple-950/40"
            >
              {lang === 'bn' ? '🎬 ওটিটি সাবস্ক্রিপশন (Netflix, Crunchyroll)' : 'OTT Subscriptions'}
            </button>
            <button
              onClick={() => handleNavClick('social-boost')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-blue-400 rounded-xl hover:bg-purple-950/40"
            >
              {lang === 'bn' ? '🚀 সোশ্যাল মিডিয়া ফলোয়ার্স ও লাইক' : 'Social Media Boost'}
            </button>
            <button
              onClick={() => {
                onOpenTrack();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-cyan-400 rounded-xl hover:bg-purple-950/40"
            >
              {t.navTrackOrder}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2 text-sm font-bold text-slate-200 hover:text-cyan-400 rounded-xl hover:bg-purple-950/40"
            >
              {t.navContact}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
