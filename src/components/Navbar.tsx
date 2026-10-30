import React, { useState } from 'react';
import { Shield, Sparkles, Menu, X, Globe, ShoppingBag, Search, Users, Tv } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../data/translations';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenOrderModal: () => void;
  onOpenTrack: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onSelectTab,
  onOpenOrderModal,
  onOpenTrack,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang];

  const handleNavClick = (tabId: string) => {
    onSelectTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#090514]/90 backdrop-blur-md border-b border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 md:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d071f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="text-base sm:text-lg md:text-xl font-extrabold tracking-wider bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent uppercase whitespace-nowrap">
                ARAFAT GAMING
              </div>
              <div className="text-[10px] sm:text-[11px] text-purple-300/70 font-medium tracking-tight whitespace-nowrap hidden sm:block">
                {lang === 'bn' ? 'টপ-আপ ও ডিজিটাল সার্ভিস' : 'Top-Up & Digital Services'}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single Line, Desktop) */}
          <nav className="hidden lg:flex items-center gap-5 text-xs xl:text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 cursor-pointer ${
                activeTab === 'home' ? 'text-purple-400 font-bold' : 'text-slate-300'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 cursor-pointer ${
                activeTab === 'packages' ? 'text-purple-400 font-bold' : 'text-slate-300'
              }`}
            >
              {lang === 'bn' ? 'ফ্রি ফায়ার ডায়মন্ড' : 'Free Fire'}
            </button>
            <button
              onClick={() => handleNavClick('social-followers')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-blue-300 flex items-center gap-1 cursor-pointer ${
                activeTab === 'social-followers' || activeTab === 'facebook-followers' ? 'text-blue-400 font-bold' : 'text-slate-300'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>{lang === 'bn' ? 'সোশ্যাল ফলোয়ার্স (FB & IG)' : 'FB & IG Followers'}</span>
            </button>
            <button
              onClick={() => handleNavClick('streaming-subscriptions')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-red-300 flex items-center gap-1 cursor-pointer ${
                activeTab === 'streaming-subscriptions' ? 'text-red-400 font-bold' : 'text-slate-300'
              }`}
            >
              <Tv className="w-3.5 h-3.5 text-red-400" />
              <span>{lang === 'bn' ? 'Netflix ও Crunchyroll' : 'Netflix & Crunchyroll'}</span>
            </button>
            <button
              onClick={() => handleNavClick('payment')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 cursor-pointer ${
                activeTab === 'payment' ? 'text-purple-400 font-bold' : 'text-slate-300'
              }`}
            >
              {t.navPayment}
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
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 cursor-pointer ${
                activeTab === 'contact' ? 'text-purple-400 font-bold' : 'text-slate-300'
              }`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Zone 3: Actions (Language Switcher, Admin Button & Primary CTA) */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200 hover:bg-purple-900/50 transition-colors whitespace-nowrap cursor-pointer"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
            </button>

            {/* Admin shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden sm:flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors whitespace-nowrap cursor-pointer"
              title="Admin Panel"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden xl:inline">{t.navAdmin}</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={onOpenOrderModal}
              className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 rounded-lg hover:from-purple-500 hover:to-pink-500 active:scale-95 transition-all shadow-md shadow-purple-900/40 whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.btnOrderNow}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none cursor-pointer"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0d071f] border-b border-purple-900/40 px-4 pt-2 pb-5 space-y-1.5 shadow-2xl">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200 cursor-pointer"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200 cursor-pointer"
          >
            💎 {lang === 'bn' ? 'ফ্রি ফায়ার ডায়মন্ড' : 'Free Fire Diamonds'}
          </button>
          <button
            onClick={() => handleNavClick('social-followers')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-blue-950/40 text-blue-300 cursor-pointer"
          >
            👥 {lang === 'bn' ? 'সোশ্যাল ফলোয়ার্স (ফেসবুক ও ইনস্টাগ্রাম)' : 'Social Followers (Facebook & IG)'}
          </button>
          <button
            onClick={() => handleNavClick('streaming-subscriptions')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-red-950/40 text-red-300 cursor-pointer"
          >
            🎬 {lang === 'bn' ? 'নেটফ্লিক্স ও ক্রাঞ্চিরোল সাবস্ক্রিপশন' : 'Netflix & Crunchyroll Subscriptions'}
          </button>
          <button
            onClick={() => handleNavClick('how-to-order')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200 cursor-pointer"
          >
            {t.navHowToOrder}
          </button>
          <button
            onClick={() => handleNavClick('payment')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200 cursor-pointer"
          >
            {t.navPayment}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrack();
            }}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md bg-purple-950/30 text-cyan-300 cursor-pointer"
          >
            🔍 {t.navTrackOrder}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200 cursor-pointer"
          >
            {t.navContact}
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md text-purple-300 hover:bg-purple-950/40 cursor-pointer"
          >
            🛡️ {t.navAdmin}
          </button>
        </div>
      )}
    </header>
  );
};
