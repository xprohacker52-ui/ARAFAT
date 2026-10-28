import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { Language } from '../types';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  lang: Language;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  type,
  lang,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] rounded-2xl bg-[#0f0722] border border-purple-800 p-6 sm:p-8 overflow-y-auto text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-purple-900/50 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" />
            <h3 className="text-lg font-bold text-white">
              {type === 'privacy'
                ? (lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy Policy)' : 'Privacy Policy')
                : (lang === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms & Conditions)' : 'Terms & Conditions')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/30"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="font-semibold text-white">১. গ্রাহকের তথ্যের সুরক্ষা:</p>
            <p>
              ARAFAT GAMING গ্রাহকের গোপনীয়তা সম্পূর্ণ গুরুত্ব সহকারে রক্ষা করে। ডায়মন্ড টপ-আপের জন্য আমরা শুধুমাত্র আপনার গেমের <strong>Player UID</strong> এবং পেমেন্ট ভেরিফিকেশনের জন্য <strong>Transaction ID</strong> সংগ্রহ করি।
            </p>

            <p className="font-semibold text-white">২. কোনো পাসওয়ার্ড নয়:</p>
            <p>
              আমরা কখনোই কোনো গ্রাহকের ফ্রি ফায়ার একাউন্টের পাসওয়ার্ড, ইমেইল, ফেসবুক লগইন বা OTP চাই না। এমন কোনো অনুরোধ আমাদের অফিসিয়াল চ্যানেল থেকে কখনই করা হয় না।
            </p>

            <p className="font-semibold text-white">৩. যোগাযোগ নম্বর:</p>
            <p>
              অর্ডারের সময় আপনি যদি আপনার হোয়াটসঅ্যাপ বা মোবাইল নম্বর দেন, তবে তা কেবলমাত্র আপনার নির্দিষ্ট অর্ডারের আপডেট বা সমস্যা সমাধানের জন্য ব্যবহৃত হবে। তৃতীয় কোনো পক্ষের সাথে তা ভাগ করা হয় না।
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p className="font-semibold text-white">১. স্বাধীন সেবা ঘোষণা:</p>
            <p>
              ARAFAT GAMING একটি ব্যক্তিগত ও স্বাধীন ফ্রি ফায়ার ডায়মন্ড টপ-আপ সেবা। আমরা গ্যারিনা (Garena) ফ্রি ফায়ারের প্রত্যক্ষ প্রতিনিধি নই। আমরা আন্তর্জাতিক অনুমোদিত ডিস্ট্রিবিউশন প্ল্যাটফর্মের মাধ্যমে সরাসরি Player UID-তে টপ-আপ ডেলিভারি করি।
            </p>

            <p className="font-semibold text-white">২. পেমেন্ট ও ডেলিভারি শর্ত:</p>
            <p>
              গ্রাহককে অবশ্যই আমাদের নির্দিষ্ট বিকাশ বা নগদ পার্সোনাল নম্বরে সঠিক পরিমাণ টাকা Send Money করতে হবে এবং প্রাপ্ত TrxID প্রদান করতে হবে। সাধারণত ৫ থেকে ১৫ মিনিটের মধ্যে ডায়মন্ড পাঠানো হয়।
            </p>

            <p className="font-semibold text-white">৩. ভুল তথ্য ও রিফান্ড নীতি:</p>
            <p>
              গ্রাহক ভুল Player UID প্রদান করলে এবং ডায়মন্ড সফলভাবে চলে গেলে তা পরিবর্তন বা রিফান্ড সম্ভব নয়। তবে সিস্টেমে কোনো সমস্যার কারণে ডেলিভারি না হলে ২৪ ঘণ্টার মধ্যে সম্পূর্ণ টাকা রিফান্ড বা বিকল্প ডেলিভারি প্রদান করা হবে। ভুয়া TrxID দিলে অর্ডার বাতিল করা হবে।
            </p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-purple-900/40 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-colors"
          >
            {lang === 'bn' ? 'বুঝেছি' : 'Understood'}
          </button>
        </div>
      </div>
    </div>
  );
};
