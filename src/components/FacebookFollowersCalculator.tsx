import React, { useState } from 'react';
import { Users, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Zap, Calculator } from 'lucide-react';
import { Language, SiteConfig } from '../types';

interface FacebookFollowersCalculatorProps {
  lang: Language;
  config: SiteConfig;
  onOrderFollowers: (followersCount: number, priceBdt: number, profileLink: string) => void;
}

export const FacebookFollowersCalculator: React.FC<FacebookFollowersCalculatorProps> = ({
  lang,
  config,
  onOrderFollowers,
}) => {
  const [followerCount, setFollowerCount] = useState<number>(5000);
  const [customInput, setCustomInput] = useState<string>('5000');
  const [profileLink, setProfileLink] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const ratePer1k = config.followerRatePer1k || 120;
  const totalPriceBdt = Math.round((followerCount / 1000) * ratePer1k);

  // Quick preset pills
  const presets = [1000, 2000, 5000, 10000, 20000, 50000, 100000];

  const handlePresetSelect = (val: number) => {
    setFollowerCount(val);
    setCustomInput(val.toString());
    setErrorMsg(null);
  };

  const handleInputChange = (val: string) => {
    setCustomInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      if (num < 1000) {
        setErrorMsg(lang === 'bn' ? 'নূন্যতম ১,০০০ ফলোয়ার্স অর্ডার করতে হবে।' : 'Minimum order is 1,000 followers.');
      } else if (num > 100000) {
        setErrorMsg(lang === 'bn' ? 'একবারে সর্বোচ্চ ১,০০,০০০ ফলোয়ার্স অর্ডার করা যাবে।' : 'Maximum order is 100,000 followers.');
      } else {
        setErrorMsg(null);
      }
      setFollowerCount(Math.min(Math.max(num, 1000), 100000));
    }
  };

  const handleOrder = () => {
    if (followerCount < 1000 || followerCount > 100000) {
      setErrorMsg(lang === 'bn' ? 'দয়া করে ১,০০০ থেকে ১,০০,০০০ এর মধ্যে ফলোয়ার্স সংখ্যা নির্বাচন করুন।' : 'Please choose between 1,000 and 100,000 followers.');
      return;
    }
    onOrderFollowers(followerCount, totalPriceBdt, profileLink.trim());
  };

  return (
    <section id="facebook-followers" className="py-12 md:py-16 bg-[#0c071d]/60 border-t border-purple-900/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs uppercase tracking-wider font-semibold text-blue-400 mb-1 flex items-center justify-center gap-1.5">
            <Users className="w-3.5 h-3.5" />
            <span>Social Growth Service</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {lang === 'bn' ? 'ফেসবুক ফলোয়ার্স ক্যালকুলেটর ও প্যাকেজ' : 'Facebook Followers & Price Calculator'}
          </h2>
          <p className="text-sm text-slate-300 mt-2">
            {lang === 'bn'
              ? 'আপনার ফেসবুক পেজ বা প্রোফাইলের জন্য ১,০০০ থেকে ১,০০,০০০ পর্যন্ত রিয়েল ও নিরাপদ ফলোয়ার্স নিন লাইভ মূল্য হিসাব করে।'
              : 'Boost your Facebook Page or Personal Profile with 1,000 up to 100,000 high-retention followers with instant pricing.'}
          </p>
        </div>

        {/* 2-Column Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
          {/* Left Column: Interactive Calculator & Slider */}
          <div className="lg:col-span-7 bg-[#120826] border border-blue-900/40 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-purple-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Calculator className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">
                    {lang === 'bn' ? 'ফলোয়ার্স পরিমাণ নির্ধারণ' : 'Choose Follower Quantity'}
                  </h3>
                  <div className="text-xs text-slate-400">
                    {lang === 'bn' ? `মূল্য হার: প্রতি ১,০০০ ফলোয়ার্স মাত্র ৳${ratePer1k} BDT` : `Base Rate: $${(ratePer1k / 115).toFixed(2)} / ৳${ratePer1k} BDT per 1k`}
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-950/60 text-emerald-400 border border-emerald-800/40">
                  {lang === 'bn' ? '১০০% নিরাপদ · নো পাসওয়ার্ড' : 'No Password Required'}
                </span>
              </div>
            </div>

            {/* Presets Grid */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                {lang === 'bn' ? 'জনপ্রিয় পরিমাণ সিলেক্ট করুন:' : 'Select Popular Quantity:'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {presets.map((p) => {
                  const isSelected = followerCount === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePresetSelect(p)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40 scale-[1.02]'
                          : 'bg-[#0b0517] border border-purple-900/40 text-slate-300 hover:text-white hover:border-blue-700/60'
                      }`}
                    >
                      {p.toLocaleString()} {lang === 'bn' ? 'ফলোয়ার' : ''}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Range Slider & Manual Input */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  {lang === 'bn' ? 'অথবা কাস্টম পরিমাণ লিখুন (১,০০০ - ১,০০,০০০):' : 'Or Enter Custom Follower Amount:'}
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    min={1000}
                    max={100000}
                    step={500}
                    value={customInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="w-28 px-3 py-1.5 rounded-lg bg-[#080312] border border-blue-900/60 text-center font-mono-numbers font-bold text-blue-300 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <span className="text-xs text-slate-400 font-medium">Followers</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={1000}
                max={100000}
                step={1000}
                value={followerCount}
                onChange={(e) => handlePresetSelect(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-[#080312] rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono-numbers">
                <span>1,000</span>
                <span>25,000</span>
                <span>50,000</span>
                <span>75,000</span>
                <span>100,000</span>
              </div>
            </div>

            {/* Target Profile Link Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {lang === 'bn' ? 'ফেসবুক পেজ / প্রোফাইল লিঙ্ক (URL):' : 'Facebook Page / Profile URL Link:'}
              </label>
              <input
                type="url"
                value={profileLink}
                onChange={(e) => setProfileLink(e.target.value)}
                placeholder="https://facebook.com/your.page.name"
                className="w-full px-4 py-2.5 rounded-xl bg-[#080312] border border-blue-900/60 text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {lang === 'bn'
                  ? 'প্রোফাইলটি অবশ্যই পাবলিক থাকতে হবে। কোনো পাসওয়ার্ড বা এডমিন এক্সেস প্রয়োজন নেই।'
                  : 'Your profile or page must be Public. We never ask for admin access or password.'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-200 text-xs">
                {errorMsg}
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Price Summary Box & Order Trigger */}
          <div className="lg:col-span-5 bg-[#120826] border border-blue-900/40 rounded-2xl p-6 sm:p-7 shadow-xl space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-purple-900/40">
                <span className="text-xs uppercase font-bold tracking-wider text-blue-400">
                  {lang === 'bn' ? 'লাইভ অর্ডার সামারি' : 'Instant Order Summary'}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  <span>{lang === 'bn' ? 'ইনস্ট্যান্ট ক্যালকুলেশন' : 'Real-time Price'}</span>
                </span>
              </div>

              {/* Price Calculation Box */}
              <div className="mt-4 p-4 rounded-xl bg-[#090314] border border-blue-950/80 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'bn' ? 'সার্ভিস নাম:' : 'Service:'}</span>
                  <span className="font-bold text-white">Facebook High Quality Followers</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'bn' ? 'ফলোয়ার সংখ্যা:' : 'Followers Count:'}</span>
                  <span className="font-bold font-mono-numbers text-blue-300 text-sm">
                    {followerCount.toLocaleString()} Followers
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'bn' ? 'মূল্য হার (প্রতি ১ হাজার):' : 'Rate (per 1,000):'}</span>
                  <span className="font-mono-numbers text-slate-400">৳{ratePer1k} BDT</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>{lang === 'bn' ? 'ডেলিভারি স্পিড:' : 'Delivery Speed:'}</span>
                  <span className="text-cyan-400 font-semibold">{lang === 'bn' ? '১–২৪ ঘণ্টার মধ্যে শুরু' : 'Starts within 1-24h'}</span>
                </div>

                <div className="pt-3 border-t border-purple-900/50 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-slate-300">{lang === 'bn' ? 'সর্বমোট মূল্য:' : 'Total Price:'}</span>
                  <div className="text-right">
                    <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono-numbers">
                      ৳{totalPriceBdt}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold ml-1">BDT</span>
                  </div>
                </div>
              </div>

              {/* Guarantees List */}
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'bn' ? '১০০% নন-ড্রপ ও হাই কোয়ালিটি প্রোফাইল' : 'Non-drop high retention quality profiles'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'bn' ? 'কোনো পাসওয়ার্ড প্রয়োজন নেই' : '100% safe, no account password required'}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{lang === 'bn' ? 'বিকাশ, নগদ ও রকেট দিয়ে সহজ পেমেন্ট' : 'Easy payment via bKash, Nagad & Rocket'}</span>
                </li>
              </ul>
            </div>

            {/* Order Now Button */}
            <div className="mt-6 pt-4 border-t border-purple-900/40">
              <button
                type="button"
                onClick={handleOrder}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 transition-all shadow-lg shadow-blue-950 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>
                  {lang === 'bn'
                    ? `${followerCount.toLocaleString()} ফলোয়ার্স অর্ডার করুন (৳${totalPriceBdt})`
                    : `Order ${followerCount.toLocaleString()} Followers (৳${totalPriceBdt})`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
