import React, { useState } from 'react';
import { Shield, Sparkles, Menu, X, Globe, ShoppingBag, Search } from 'lucide-react';
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
        <div className="flex items-center justify-between h-16 gap-4 md:gap-8">
          {/* Zone 1: Brand Wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-700 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d071f] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 group-hover:text-purple-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="text-lg md:text-xl font-extrabold tracking-wider bg-gradient-to-r from-purple-300 via-white to-cyan-300 bg-clip-text text-transparent uppercase whitespace-nowrap">
                ARAFAT GAMING
              </div>
              <div className="text-[11px] text-purple-300/70 font-medium tracking-tight whitespace-nowrap hidden sm:block">
                {t.siteTagline}
              </div>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Single Line, Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button
              onClick={() => handleNavClick('home')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 ${
                activeTab === 'home' ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {t.navHome}
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 ${
                activeTab === 'packages' ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {t.navPackages}
            </button>
            <button
              onClick={() => handleNavClick('how-to-order')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 ${
                activeTab === 'how-to-order' ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {t.navHowToOrder}
            </button>
            <button
              onClick={() => handleNavClick('payment')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 ${
                activeTab === 'payment' ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {t.navPayment}
            </button>
            <button
              onClick={onOpenTrack}
              className="transition-colors whitespace-nowrap shrink-0 text-slate-300 hover:text-cyan-300 flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              {t.navTrackOrder}
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className={`transition-colors whitespace-nowrap shrink-0 hover:text-purple-300 ${
                activeTab === 'contact' ? 'text-purple-400 font-semibold' : 'text-slate-300'
              }`}
            >
              {t.navContact}
            </button>
          </nav>

          {/* Zone 3: Actions (Language Switcher, Admin Button & Primary CTA) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-purple-950/40 border border-purple-800/40 text-purple-200 hover:bg-purple-900/50 transition-colors whitespace-nowrap"
              title="Change Language"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>

            {/* Admin shortcut */}
            <button
              onClick={() => handleNavClick('admin')}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-colors whitespace-nowrap"
            >
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              <span>{t.navAdmin}</span>
            </button>

            {/* Primary CTA */}
            <button
              onClick={onOpenOrderModal}
              className="flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-500 hover:to-indigo-500 active:scale-95 transition-all shadow-md shadow-purple-900/40 whitespace-nowrap"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{t.btnOrderNow}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d071f] border-b border-purple-900/40 px-4 pt-2 pb-5 space-y-2">
          <button
            onClick={() => handleNavClick('home')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200"
          >
            {t.navHome}
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200"
          >
            {t.navPackages}
          </button>
          <button
            onClick={() => handleNavClick('how-to-order')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200"
          >
            {t.navHowToOrder}
          </button>
          <button
            onClick={() => handleNavClick('payment')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200"
          >
            {t.navPayment}
          </button>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenTrack();
            }}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md bg-purple-950/30 text-cyan-300"
          >
            🔍 {t.navTrackOrder}
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md hover:bg-purple-950/40 text-slate-200"
          >
            {t.navContact}
          </button>
          <button
            onClick={() => handleNavClick('admin')}
            className="block w-full text-left py-2 px-3 text-sm font-medium rounded-md text-purple-300 hover:bg-purple-950/40"
          >
            🛡️ {t.navAdmin}
          </button>
        </div>
      )}
    </header>
  );
};
