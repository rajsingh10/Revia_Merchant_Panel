import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Phone,
  Sparkles,
  User,
  Check
} from 'lucide-react';

export interface CustomerOnboardingProfile {
  firstName: string;
  lastName: string;
  gender: 'Female' | 'Male' | 'Other';
  dob: string;
  age: string;
  mobile: string;
  whatsappSame: boolean;
  maritalStatus: string;
  anniversaryDate: string;
  partnerName: string;
  partnerMobile: string;
}

interface SharedBrandHeaderProps {
  onBack: () => void;
}

const OnboardingHeader: React.FC<SharedBrandHeaderProps> = ({ onBack }) => (
  <div className="relative flex items-center justify-center py-2 mb-6">
    <button
      type="button"
      onClick={onBack}
      aria-label="Go back"
      className="absolute left-0 w-10 h-10 rounded-full bg-white border border-[#EFEAF7] shadow-xs flex items-center justify-center text-[#1E1548] hover:border-[#5844A8]/50 transition-colors cursor-pointer"
    >
      <ArrowLeft className="w-4 h-4" />
    </button>
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#5844A8] via-[#B83280] to-[#EC4899] flex items-center justify-center text-white shadow-sm">
        <Sparkles className="w-4 h-4 fill-white" />
      </div>
      <div className="text-left">
        <span className="text-lg font-black text-[#1E1548] leading-none tracking-tight block">
          Loyaltics
        </span>
        <span className="text-[10px] font-semibold text-[#8C84A0] block mt-0.5">
          by Analytix Data
        </span>
      </div>
    </div>
  </div>
);

/* ============================================================================
   STEP 1: TELL US ABOUT YOURSELF (Matches Yourself.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerYourselfStepProps {
  initialMobile?: string;
  profile: CustomerOnboardingProfile;
  onChange: (next: CustomerOnboardingProfile) => void;
  onBack: () => void;
  onNext: () => void;
}

export const CustomerYourselfStep: React.FC<CustomerYourselfStepProps> = ({
  profile,
  onChange,
  onBack,
  onNext
}) => {
  const update = <K extends keyof CustomerOnboardingProfile>(
    key: K,
    val: CustomerOnboardingProfile[K]
  ) => onChange({ ...profile, [key]: val });

  return (
    <div className="flex-1 flex flex-col justify-between w-full">
      <div>
        <OnboardingHeader onBack={onBack} />

        <div className="mb-6">
          <h1 className="text-[26px] sm:text-3xl font-black text-[#240B4C] tracking-tight leading-tight">
            Tell us about yourself
          </h1>
          <p className="text-[13px] sm:text-sm text-[#7B748C] font-medium mt-1.5 leading-relaxed">
            This helps us give you a better experience at Sly Granny Cafe.
          </p>
        </div>

        <div className="space-y-4">
          {/* First Name & Last Name */}
          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                First Name <span className="text-[#E11D48]">*</span>
              </label>
              <div className="flex items-center h-12 bg-white border border-[#E5DEF5] rounded-2xl px-3.5 focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
                <User className="w-4 h-4 text-[#9890A8] mr-2 shrink-0" />
                <input
                  type="text"
                  value={profile.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="Salena"
                  className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                Last Name <span className="text-[#E11D48]">*</span>
              </label>
              <div className="flex items-center h-12 bg-white border border-[#E5DEF5] rounded-2xl px-3.5 focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
                <User className="w-4 h-4 text-[#9890A8] mr-2 shrink-0" />
                <input
                  type="text"
                  value={profile.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Mishra"
                  className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
              Gender <span className="text-[#E11D48]">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { id: 'Female', symbol: '♀' },
                  { id: 'Male', symbol: '♂' },
                  { id: 'Other', symbol: '•••' }
                ] as const
              ).map((g) => {
                const active = profile.gender === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => update('gender', g.id)}
                    className={`h-11 rounded-2xl text-xs sm:text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      active
                        ? 'bg-[#2F0E45] text-white border-[#2F0E45] shadow-md shadow-purple-950/15'
                        : 'bg-white text-[#1E1548] border-[#E5DEF5] hover:border-[#C4B5FD]'
                    }`}
                  >
                    <span className={active ? 'text-white' : 'text-[#6B657E]'}>{g.symbol}</span>
                    <span>{g.id}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
              Date of Birth <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-center h-12 bg-white border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
              <Calendar className="w-4 h-4 text-[#9890A8] mr-3 shrink-0" />
              <input
                type="text"
                value={profile.dob}
                onChange={(e) => update('dob', e.target.value)}
                placeholder="DD / MM / YYYY"
                className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
              />
            </div>
          </div>

          {/* Age */}
          <div>
            <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
              Age <span className="text-[#E11D48]">*</span>
            </label>
            <div className="relative flex items-center h-12 bg-white border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
              <User className="w-4 h-4 text-[#9890A8] mr-3 shrink-0" />
              <select
                value={profile.age}
                onChange={(e) => update('age', e.target.value)}
                className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="">Select age</option>
                <option value="18-24">18 – 24</option>
                <option value="25-34">25 – 34</option>
                <option value="35-44">35 – 44</option>
                <option value="45-54">45 – 54</option>
                <option value="55+">55+</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
              Mobile Number <span className="text-[#E11D48]">*</span>
            </label>
            <div className="flex items-center h-12 bg-white border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all shadow-2xs">
              <span className="text-xs sm:text-[13px] font-black text-[#1E1548] pr-3 border-r border-[#EAE2FB] flex items-center gap-1.5 shrink-0 select-none">
                <Phone className="w-3.5 h-3.5 text-[#8C84A0]" />
                +91
              </span>
              <input
                type="tel"
                value={profile.mobile}
                onChange={(e) => update('mobile', e.target.value)}
                placeholder="Enter mobile number"
                className="w-full pl-3 text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
              />
            </div>
          </div>

          {/* WhatsApp Checkbox */}
          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <button
              type="button"
              onClick={() => update('whatsappSame', !profile.whatsappSame)}
              className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 cursor-pointer ${
                profile.whatsappSame
                  ? 'bg-[#2F0E45] text-white'
                  : 'bg-white border-2 border-[#D4CCE6]'
              }`}
            >
              {profile.whatsappSame && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
            <span className="text-xs sm:text-[13px] font-medium text-[#1E1548]">
              My WhatsApp number is same
            </span>
          </label>
        </div>
      </div>

      {/* Primary Next CTA */}
      <div className="pt-7">
        <button
          type="button"
          onClick={onNext}
          className="w-full h-[54px] rounded-2xl bg-[#2F0E45] hover:bg-[#3F165D] text-white font-black text-sm shadow-lg shadow-purple-950/20 transition-all cursor-pointer active:scale-[0.99]"
        >
          Next
        </button>
      </div>
    </div>
  );
};

/* ============================================================================
   STEP 2: A FEW MORE DETAILS (OPTIONAL) (Matches Details.png)
   Responsive across Mobile, Tablet, and Desktop
   ============================================================================ */
export interface CustomerMoreDetailsStepProps {
  profile: CustomerOnboardingProfile;
  onChange: (next: CustomerOnboardingProfile) => void;
  onBack: () => void;
  onSkip: () => void;
  onComplete: () => void;
}

export const CustomerMoreDetailsStep: React.FC<CustomerMoreDetailsStepProps> = ({
  profile,
  onChange,
  onBack,
  onSkip,
  onComplete
}) => {
  const [showPartnerCard] = useState(true);
  const update = <K extends keyof CustomerOnboardingProfile>(
    key: K,
    val: CustomerOnboardingProfile[K]
  ) => onChange({ ...profile, [key]: val });

  return (
    <div className="flex-1 flex flex-col justify-between w-full">
      <div>
        <OnboardingHeader onBack={onBack} />

        <div className="mb-6">
          <h1 className="text-[24px] sm:text-3xl font-black text-[#240B4C] tracking-tight leading-tight">
            A few more details{' '}
            <span className="text-sm sm:text-base font-medium text-[#7B748C]">(optional)</span>
          </h1>
          <p className="text-[13px] sm:text-sm text-[#7B748C] font-medium mt-1.5 leading-relaxed">
            Help us personalise your experience and offers.
          </p>
        </div>

        <div className="space-y-4">
          {/* Marital Status Card */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-2.5">
            <label className="block text-xs sm:text-[13px] font-black text-[#1E1548]">
              Marital Status
            </label>
            <div className="relative flex items-center h-12 bg-[#FAF8FF] border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:bg-white transition-all">
              <select
                value={profile.maritalStatus}
                onChange={(e) => update('maritalStatus', e.target.value)}
                className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none appearance-none cursor-pointer pr-6"
              >
                <option value="">Select</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-4 pointer-events-none" />
            </div>
          </div>

          {/* If Married Card */}
          {showPartnerCard && (
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
              <div className="text-xs sm:text-[13px] font-black text-[#1E1548]">If married</div>

              <div>
                <label className="block text-xs font-semibold text-[#6B657E] mb-1.5">
                  Anniversary Date
                </label>
                <div className="flex items-center h-12 bg-[#FAF8FF] border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:bg-white transition-all">
                  <Calendar className="w-4 h-4 text-[#9890A8] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={profile.anniversaryDate}
                    onChange={(e) => update('anniversaryDate', e.target.value)}
                    placeholder="DD / MM / YYYY"
                    className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B657E] mb-1.5">
                  Partner&apos;s Name
                </label>
                <div className="flex items-center h-12 bg-[#FAF8FF] border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:bg-white transition-all">
                  <User className="w-4 h-4 text-[#9890A8] mr-3 shrink-0" />
                  <input
                    type="text"
                    value={profile.partnerName}
                    onChange={(e) => update('partnerName', e.target.value)}
                    placeholder="Enter partner's name"
                    className="w-full text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B657E] mb-1.5">
                  Partner&apos;s Mobile Number
                </label>
                <div className="flex items-center h-12 bg-[#FAF8FF] border border-[#E5DEF5] rounded-2xl px-4 focus-within:border-[#240B4C] focus-within:bg-white transition-all">
                  <span className="text-xs sm:text-[13px] font-black text-[#1E1548] pr-3 border-r border-[#EAE2FB] flex items-center gap-1.5 shrink-0 select-none">
                    <Phone className="w-3.5 h-3.5 text-[#8C84A0]" />
                    +91
                  </span>
                  <input
                    type="tel"
                    value={profile.partnerMobile}
                    onChange={(e) => update('partnerMobile', e.target.value)}
                    placeholder="Enter number"
                    className="w-full pl-3 text-sm font-semibold text-[#1E1548] bg-transparent outline-none placeholder:text-[#A59EB6]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Dual Action Row */}
      <div className="grid grid-cols-2 gap-3.5 pt-8">
        <button
          type="button"
          onClick={onSkip}
          className="h-[52px] rounded-full bg-white hover:bg-[#FAF8FF] border border-[#2F0E45]/40 text-[#240B4C] font-black text-sm transition-all cursor-pointer active:scale-[0.99]"
        >
          Skip for now
        </button>
        <button
          type="button"
          onClick={onComplete}
          className="h-[52px] rounded-full bg-[#2F0E45] hover:bg-[#3F165D] text-white font-black text-sm shadow-lg shadow-purple-950/20 transition-all cursor-pointer active:scale-[0.99]"
        >
          Next
        </button>
      </div>
    </div>
  );
};
