import React from 'react';
import { Sparkles, Shield, MessageCircle } from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface FooterProps {
  lang: Language;
  config: SiteConfig;
  onSelectTab: (tab: string) => void;
  onOpenLegal: (type: 'privacy' | 'terms') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  config,
  onSelectTab,
  onOpenLegal,
}) => {
  const t = translations[lang];

  return (
    <footer className="bg-[#070312] border-t border-purple-900/30 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-cyan-500 p-0.5">
                <div className="w-full h-full bg-[#0d071f] rounded-[6px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-lg font-extrabold text-white tracking-wider">
                ARAFAT GAMING
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-sm">
              {t.footerDesc}
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-300">
              <span className="font-semibold text-white">Payment Supported:</span>
              <span className="px-2 py-0.5 rounded bg-pink-950 text-pink-300 font-bold font-mono">bKash</span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold font-mono">Nagad</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.quickLinks}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {t.navHome}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('packages')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {t.navPackages}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('how-to-order')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {t.navHowToOrder}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('payment')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {t.navPayment}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('track')}
                  className="hover:text-purple-300 transition-colors"
                >
                  {t.navTrackOrder}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal and Support */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              হেল্পলাইন ও পলিসি
            </h4>
            <p className="text-slate-400">
              হোয়াটসঅ্যাপ: <span className="font-mono-numbers text-white font-bold">{config.whatsappNumber}</span>
            </p>
            <p className="text-slate-400">
              সার্ভিস টাইম: <span className="text-purple-300">{lang === 'bn' ? config.supportHoursBn : config.supportHours}</span>
            </p>
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={() => onOpenLegal('privacy')}
                className="text-slate-400 hover:text-white underline underline-offset-2"
              >
                {t.privacyPolicy}
              </button>
              <button
                onClick={() => onOpenLegal('terms')}
                className="text-slate-400 hover:text-white underline underline-offset-2"
              >
                {t.termsConditions}
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="p-4 rounded-xl bg-[#0b0517] border border-purple-950/60 text-[11px] text-slate-500 leading-relaxed">
          {t.legalDisclaimer}
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-purple-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ARAFAT GAMING. {t.allRightsReserved}
          </div>
          <div>
            Built for Bangladesh Free Fire Gamers · Fast & Trusted Top-Up
          </div>
        </div>
      </div>
    </footer>
  );
};
