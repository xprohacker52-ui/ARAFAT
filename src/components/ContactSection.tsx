import React from 'react';
import { MessageCircle, Phone, Clock, ShieldCheck, Mail } from 'lucide-react';
import { Language, SiteConfig } from '../types';
import { translations } from '../data/translations';

interface ContactSectionProps {
  lang: Language;
  config: SiteConfig;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ lang, config }) => {
  const t = translations[lang];

  return (
    <section id="contact" className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-purple-400 mb-1">
            24/7 Helpline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.navContact} — ARAFAT GAMING
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            যেকোনো টপ-আপ সমস্যা, অর্ডার বিলম্ব বা প্রশ্নের জন্য সরাসরি আমাদের সাথে কথা বলুন
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {/* WhatsApp Direct */}
          <div className="rounded-2xl bg-[#110822] border border-emerald-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/50 transition-all text-center">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400 mb-4">
                <MessageCircle className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">হোয়াটসঅ্যাপ সাপোর্ট</h3>
              <p className="text-xs text-slate-400 mt-1">
                দ্রুততম উত্তরের জন্য হোয়াটসঅ্যাপে মেসেজ পাঠান
              </p>
              <div className="mt-3 font-mono-numbers text-emerald-300 font-bold text-lg">
                {config.whatsappNumber}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-950">
              <a
                href={`https://wa.me/88${config.whatsappNumber}?text=${encodeURIComponent(
                  'আসসালামু আলাইকুম, আরাফাত গেমিং এ ফ্রি ফায়ার ডায়মন্ড টপ-আপ সম্পর্কে জানতে চাই।'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-emerald-950"
              >
                <MessageCircle className="w-4 h-4" />
                <span>মেসেজ দিন (Chat Now)</span>
              </a>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="rounded-2xl bg-[#110822] border border-purple-900/40 p-6 flex flex-col justify-between hover:border-purple-500/50 transition-all text-center">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400 mb-4">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">সার্ভিস সময়সূচী</h3>
              <p className="text-xs text-slate-400 mt-1">
                সপ্তাহের ৭ দিনই আমাদের ডায়মন্ড ডেলিভারি চালু থাকে
              </p>
              <div className="mt-3 text-purple-300 font-semibold text-sm">
                {lang === 'bn' ? config.supportHoursBn : config.supportHours}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-950 text-xs text-slate-400">
              <span>ডেলিভারি সময়: ৫ থেকে ১৫ মিনিট</span>
            </div>
          </div>

          {/* Direct Call / Contact */}
          <div className="rounded-2xl bg-[#110822] border border-cyan-900/40 p-6 flex flex-col justify-between hover:border-cyan-500/50 transition-all text-center">
            <div>
              <div className="w-14 h-14 mx-auto rounded-2xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-cyan-400 mb-4">
                <Phone className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white">সরাসরি কল</h3>
              <p className="text-xs text-slate-400 mt-1">
                জরুরি প্রয়োজনে সরাসরি আমাদের কল করতে পারেন
              </p>
              <div className="mt-3 font-mono-numbers text-cyan-300 font-bold text-lg">
                {config.whatsappNumber}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-purple-950">
              <a
                href={`tel:${config.whatsappNumber}`}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-700 hover:bg-cyan-600 text-white font-bold text-xs inline-flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-cyan-950"
              >
                <Phone className="w-4 h-4" />
                <span>কল করুন</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
