import React, { useState, useEffect } from 'react';
import { LoginPage } from './LoginPage';
import {
  Check,
  Building2,
  Clock,
  Store,
  MapPin,
  ShieldCheck,
  Coffee,
  CheckCircle2,
  Sparkles,
  Zap,
  Lock,
  Wallet,
  Rocket
} from 'lucide-react';
import { PrimaryButton } from '../components/common/Badges';
import { useDispatch, useSelector } from 'react-redux';
import { requestRegisterOtp, registerMerchant, setMobileNumber, resetAuthState } from '../store/slices/authSlice';
import { onboardMerchant, resetOnboardingState } from '../store/slices/onboardingSlice';
import { AppDispatch, RootState } from '../store/store';

interface OnboardingPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onCancel }) => {
  const [isRegistered, setIsRegistered] = useState(true);
  const [activeStep, setActiveStep] = useState<number>(1);

  // Mobile Verification State
  const dispatch = useDispatch<AppDispatch>();
  const { mobileNumber, isOtpSent, isMobileVerified, isLoading, error } = useSelector((state: RootState) => state.auth);
  const [otp, setOtp] = useState('');
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'whatsapp'>('sms');

  const handleSendOtp = () => {
    if (mobileNumber.trim().length >= 10) {
      dispatch(requestRegisterOtp(mobileNumber));
    }
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length === 6) {
      dispatch(registerMerchant({ identifier: mobileNumber, otp }));
    }
  };

  // Optional: clear auth state on unmount
  useEffect(() => {
    return () => {
      dispatch(resetAuthState());
    };
  }, [dispatch]);

  // Scroll to top when advancing onboarding steps
  useEffect(() => {
    window.scrollTo(0, 0);
    const scrollContainer = document.querySelector('.overflow-y-scroll');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [activeStep]);

  // M-01 Business Info
  const [businessName, setBusinessName] = useState('Blue Bottle Specialty Roasters');
  const [businessCategory, setBusinessCategory] = useState('Coffee Shop & Artisanal Bakery');
  const [ownerName, setOwnerName] = useState('Elena Vance');

  // Step 3 First Branch
  const [branchName, setBranchName] = useState('Blue Bottle Cafe - Downtown Flagship');
  const [address, setAddress] = useState('315 Montgomery St, Financial District, San Francisco, CA');
  const [timezone, setTimezone] = useState('America/Los_Angeles (PST - UTC-8)');
  const [hours, setHours] = useState('06:30 AM - 07:00 PM PST');
  const [registerType, setRegisterType] = useState<'counter' | 'salon' | 'express'>('counter');

  // 4 Steps
  const steps = [
    { id: 1, name: 'Business Info', icon: Building2 },
    { id: 2, name: 'Category & Time', icon: Clock },
    { id: 3, name: 'First Branch', icon: Store },
    { id: 4, name: 'Review & Launch', icon: Rocket },
  ];

  const { isLoading: isOnboarding, error: onboardingError, isOnboardingComplete } = useSelector((state: RootState) => state.onboarding);

  useEffect(() => {
    if (isOnboardingComplete) {
      dispatch(resetOnboardingState());
      onComplete();
    }
  }, [isOnboardingComplete, onComplete, dispatch]);

  const handleLaunch = () => {
    console.log("handleLaunch triggered with data:", {
      businessName,
      ownerName,
      businessCategory,
      branchName,
      address,
      timezone,
      hours,
      registerType
    });
    dispatch(onboardMerchant({
      businessName,
      ownerName,
      businessCategory,
      branchName,
      address,
      timezone,
      hours,
      registerType
    }));
  };

  if (!isRegistered) {
    return <LoginPage onLoginSuccess={() => setIsRegistered(true)} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16 font-sans relative">
      {!isMobileVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#E5E0D8]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93] mb-1">SECURE AUTH GATEWAY</div>
              <h3 className="text-xl font-bold tracking-tight text-[#1A1615]">Mobile Verification</h3>
              <p className="text-xs text-[#6E6A66] mt-1">Verify your mobile number to begin onboarding.</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex bg-[#FAF8F5] p-1 rounded-lg border border-[#E5E0D8]">
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('sms')}
                    className={`flex-1 py-2 text-xs font-bold rounded-md transition-all cursor-pointer ${verificationMethod === 'sms' ? 'bg-white text-[#1A1615] shadow-xs border border-[#E5E0D8]' : 'text-[#6E6A66] hover:bg-[#E5E0D8]/50'}`}
                  >
                    📞 SMS OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => setVerificationMethod('whatsapp')}
                    className={`flex-1 py-2 text-xs font-semibold flex items-center justify-center gap-1.5 rounded-md transition-all cursor-pointer ${verificationMethod === 'whatsapp' ? 'bg-white text-[#1A1615] shadow-xs border border-[#E5E0D8]' : 'text-[#6E6A66] hover:bg-[#E5E0D8]/50'}`}
                  >
                    💬 WhatsApp <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-bold">INSTANT</span>
                  </button>
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">PHONE NUMBER OR EMAIL</label>
                  <div className="flex gap-2">
                    {(mobileNumber.length > 0 && /^[0-9+]/.test(mobileNumber)) && (
                      <select className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]">
                        <option>IN +91</option>
                        <option>US +1</option>
                      </select>
                    )}
                    <input
                      type="text"
                      value={mobileNumber}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^[0-9+]/.test(val)) {
                          val = val.replace(/[^\d+]/g, '');
                        }
                        dispatch(setMobileNumber(val));
                      }}
                      disabled={isOtpSent || isLoading}
                      placeholder="Enter mobile number or email"
                      className="flex-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753] disabled:opacity-50"
                    />
                  </div>
                  <p className="text-[10px] text-[#9E9A93] mt-2">Operator credentials provisioned by Central IT / General Management.</p>
                </div>
                {!isOtpSent ? (
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={!mobileNumber || isLoading}
                      className="w-full py-3 bg-[#B8860B] text-white text-xs font-bold rounded-lg hover:bg-[#9E782F] disabled:opacity-50 transition-colors cursor-pointer"
                    >
                      {isLoading ? 'Sending...' : 'Send Verification Code →'}
                    </button>
                    {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6E6A66]">ENTER 6-DIGIT VERIFICATION PIN</label>
                      <span className="text-[10px] text-[#B8860B] font-medium">Expires in 01:39</span>
                    </div>
                    <div className="flex justify-between gap-2 mb-3">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <input
                          key={idx}
                          id={`otp-${idx}`}
                          type="text"
                          maxLength={1}
                          value={otp[idx] || ''}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (!val && e.target.value !== '') return;
                            const newOtp = otp.split('');
                            if (e.target.value.length > 1) {
                              const pasted = e.target.value.replace(/\D/g, '').slice(0, 6);
                              setOtp(pasted);
                              if (pasted.length === 6) {
                                document.getElementById('otp-5')?.focus();
                              }
                              return;
                            }
                            newOtp[idx] = val;
                            setOtp(newOtp.join(''));
                            if (val && idx < 5) {
                              document.getElementById(`otp-${idx + 1}`)?.focus();
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
                              document.getElementById(`otp-${idx - 1}`)?.focus();
                            }
                          }}
                          className="w-12 h-12 text-center text-lg font-bold bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl focus:outline-hidden focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] shadow-xs"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] text-[#9E9A93]">{mobileNumber.includes('@') ? mobileNumber : `Sent to +91 ${mobileNumber}`}</span>
                      <button type="button" onClick={() => dispatch(resetAuthState())} className="text-[10px] text-[#B8860B] font-semibold hover:underline cursor-pointer">Change {mobileNumber.includes('@') ? 'Email' : 'Number'}</button>
                    </div>
                    <div className="space-y-2 mb-4">
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={otp.length !== 6 || isLoading}
                        className="w-full py-3 bg-[#B8860B] text-white text-xs font-bold rounded-lg hover:bg-[#9E782F] disabled:opacity-50 transition-colors cursor-pointer shadow-sm"
                      >
                        {isLoading ? 'Verifying...' : 'Verify PIN & Authenticate →'}
                      </button>
                      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
                    </div>
                    <div className="text-center">
                      <button type="button" className="text-[11px] text-[#B8860B] font-semibold hover:underline cursor-pointer">Didn't receive code? Resend OTP</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Top Banner & Navigation Header */}
      <div className="bg-white border-b border-[#E5E0D8] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-b from-[#D4A753] to-[#9E782F] flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#1A1615] tracking-tight">REVIA ONBOARDING ORCHESTRATOR</div>
              <div className="text-[10px] uppercase font-semibold text-[#9E9A93] tracking-wider">Enterprise Venue Provisioning Engine</div>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-[#6E6A66] hover:text-[#1A1615] px-3 py-1.5 rounded-lg border border-[#E5E0D8] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
          >
            Save Draft &amp; Exit
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Top 4-Step Horizontal Wizard */}
        <div className="bg-white border border-[#E5E0D8] rounded-xl p-4 sm:p-5 mb-6 shadow-xs">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E5E0D8] -translate-y-1/2 z-0 hidden md:block" />

            {steps.map((step) => {
              const isPast = step.id < activeStep;
              const isCurrent = step.id === activeStep;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className="relative z-10 flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all text-xs font-bold ${isPast
                        ? 'bg-[#0D7A53] text-white ring-4 ring-[#E6F4ED]'
                        : isCurrent
                          ? 'bg-gradient-to-b from-[#D4A753] to-[#9E782F] text-white shadow-md ring-4 ring-[#FDF8EB]'
                          : 'bg-white border-2 border-[#E5E0D8] text-[#9E9A93] group-hover:border-[#9E9A93]'
                      }`}
                  >
                    {isPast ? <Check className="w-4 h-4 text-white" /> : <span>{step.id}</span>}
                  </div>
                  <div className="mt-2 text-center">
                    <span
                      className={`text-xs block ${isCurrent
                          ? 'text-[#1A1615] font-bold'
                          : isPast
                            ? 'text-[#0D7A53] font-semibold'
                            : 'text-[#9E9A93] font-medium'
                        }`}
                    >
                      {step.name}
                    </span>
                    {isCurrent && (
                      <span className="text-[9px] uppercase font-bold text-[#9E782F] tracking-wider block">
                        • ACTIVE STEP
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Main 2-Column Area: Form + Right Progress Checklist */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Main Form Area (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-6 shadow-xs">

              {activeStep === 1 && (
                <>
                  <div className="border-b border-[#E5E0D8] pb-4 mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">
                      STEP 02 // BUSINESS PROFILE
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-[#1A1615] mt-1">
                      Business Information
                    </h2>
                    <p className="text-xs text-[#6E6A66] mt-1">
                      Set up your tenant profile and merchant details.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">Business Name</label>
                      <input type="text" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">Owner Name</label>
                      <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]" />
                    </div>
                  </div>
                </>
              )}

              {activeStep === 2 && (
                <>
                  <div className="border-b border-[#E5E0D8] pb-4 mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">
                      STEP 03 // OPERATIONS
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-[#1A1615] mt-1">
                      Category &amp; Settings
                    </h2>
                    <p className="text-xs text-[#6E6A66] mt-1">
                      Define your primary business category and regional preferences.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">Business Category</label>
                      <input type="text" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]" placeholder="e.g. Coffee Shop, Retail" />
                    </div>
                  </div>
                </>
              )}

              {activeStep === 3 && (
                <>
                  <div className="border-b border-[#E5E0D8] pb-4 mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">
                      STEP 04 // PHYSICAL RETAIL PROFILE
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-[#1A1615] mt-1">
                      Configure Flagship Outlet &amp; Register Setup
                    </h2>
                    <p className="text-xs text-[#6E6A66] mt-1">
                      Define the operating parameters and hardware profile for your initial physical location.
                    </p>
                  </div>

                  {/* Branch Details */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">
                        Official Branch Name
                      </label>
                      <input
                        type="text"
                        value={branchName}
                        onChange={(e) => setBranchName(e.target.value)}
                        className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">
                        Physical Address &amp; GPS Pin
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-[#9E782F] absolute left-3 top-3" />
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-9 pr-3.5 py-2.5 text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]"
                        />
                      </div>
                    </div>

                    {/* Mock Map Preview Box */}
                    <div className="h-32 rounded-lg border border-[#E5E0D8] bg-[#F5F4F0] relative overflow-hidden flex items-center justify-center">
                      <div
                        className="absolute inset-0 opacity-40 bg-cover bg-center"
                        style={{
                          backgroundImage:
                            'radial-gradient(#D4A753 1px, transparent 1px), radial-gradient(#9E782F 1px, #FAF8F5 1px)',
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 10px 10px',
                        }}
                      />
                      <div className="relative z-10 bg-white/95 border border-[#E5E0D8] px-3.5 py-2 rounded-lg shadow-sm flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#0D7A53] animate-ping" />
                        <span className="text-xs font-bold text-[#1A1615]">Montgomery Flagship Beacon Verified</span>
                        <span className="text-[10px] text-[#0D7A53] font-semibold bg-[#E6F4ED] px-1.5 py-0.5 rounded">
                          ±1.2m Accuracy
                        </span>
                      </div>
                    </div>

                    {/* Timezone & Operating Hours */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">
                          Store Timezone
                        </label>
                        <input
                          type="text"
                          value={timezone}
                          onChange={(e) => setTimezone(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#1A1615]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">
                          Daily Operating Hours
                        </label>
                        <input
                          type="text"
                          value={hours}
                          onChange={(e) => setHours(e.target.value)}
                          className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-medium text-[#1A1615]"
                        />
                      </div>
                    </div>

                    {/* Selection Cards: Primary Register Architecture */}
                    <div className="pt-4 border-t border-[#E5E0D8]">
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1">
                        Primary Register Architecture
                      </label>
                      <p className="text-[11px] text-[#9E9A93] mb-3">
                        Select your counter interaction flow to optimize POS scanning speed and receipt printing.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div
                          onClick={() => setRegisterType('counter')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${registerType === 'counter'
                              ? 'border-[#D4A753] bg-[#FDF8EB]/50 ring-2 ring-[#D4A753]/20'
                              : 'border-[#E5E0D8] bg-white hover:bg-[#FAF8F5]'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#9E782F]">
                              <Coffee className="w-4 h-4" />
                            </div>
                            {registerType === 'counter' && (
                              <div className="w-4 h-4 rounded-full bg-[#9E782F] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-bold text-[#1A1615]">Counter Barista</div>
                          <div className="text-[10px] text-[#6E6A66] mt-0.5">High-volume pour-over bar, dual customer display scanner.</div>
                        </div>

                        <div
                          onClick={() => setRegisterType('salon')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${registerType === 'salon'
                              ? 'border-[#D4A753] bg-[#FDF8EB]/50 ring-2 ring-[#D4A753]/20'
                              : 'border-[#E5E0D8] bg-white hover:bg-[#FAF8F5]'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#9E782F]">
                              <Store className="w-4 h-4" />
                            </div>
                            {registerType === 'salon' && (
                              <div className="w-4 h-4 rounded-full bg-[#9E782F] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-bold text-[#1A1615]">Tasting Salon</div>
                          <div className="text-[10px] text-[#6E6A66] mt-0.5">Table-side sensory service, mobile wallet NFC checkout.</div>
                        </div>

                        <div
                          onClick={() => setRegisterType('express')}
                          className={`p-3.5 rounded-xl border transition-all cursor-pointer ${registerType === 'express'
                              ? 'border-[#D4A753] bg-[#FDF8EB]/50 ring-2 ring-[#D4A753]/20'
                              : 'border-[#E5E0D8] bg-white hover:bg-[#FAF8F5]'
                            }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#FAF8F5] border border-[#E5E0D8] flex items-center justify-center text-[#9E782F]">
                              <Zap className="w-4 h-4" />
                            </div>
                            {registerType === 'express' && (
                              <div className="w-4 h-4 rounded-full bg-[#9E782F] text-white flex items-center justify-center text-[10px]">
                                ✓
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-bold text-[#1A1615]">Express Window</div>
                          <div className="text-[10px] text-[#6E6A66] mt-0.5">Sub-20s tap &amp; go scan, automated loyalty stamp batching.</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* NEW STEP 4: REVIEW & LAUNCH */}
              {activeStep === 4 && (
                <>
                  <div className="border-b border-[#E5E0D8] pb-4 mb-6">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">
                      STEP 05 // FINAL PROVISIONING
                    </span>
                    <h2 className="text-xl font-bold tracking-tight text-[#1A1615] mt-1 flex items-center gap-2">
                      <span>Review Setup &amp; Launch Merchant Panel</span>
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    </h2>
                    <p className="text-xs text-[#6E6A66] mt-1">
                      Verify your business information, flagship outlet configuration, and initial credit wallet setup.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Business & Owner Summary */}
                    <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-[#1A1615] uppercase tracking-wider">Business &amp; Owner Profile</div>
                        <button onClick={() => setActiveStep(1)} className="text-[11px] font-bold text-[#9E782F] hover:underline cursor-pointer">Edit</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-[#6E6A66] block">Business Name</span>
                          <strong className="text-[#1A1615]">{businessName || 'Blue Bottle Specialty Roasters'}</strong>
                        </div>
                        <div>
                          <span className="text-[#6E6A66] block">Owner / Manager</span>
                          <strong className="text-[#1A1615]">{ownerName || 'Elena Vance'}</strong>
                        </div>
                        <div>
                          <span className="text-[#6E6A66] block">Category</span>
                          <strong className="text-[#1A1615]">{businessCategory || 'Coffee Shop & Artisanal Bakery'}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Flagship Outlet Summary */}
                    <div className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF8F5]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold text-[#1A1615] uppercase tracking-wider">Flagship Outlet &amp; Register</div>
                        <button onClick={() => setActiveStep(4)} className="text-[11px] font-bold text-[#9E782F] hover:underline cursor-pointer">Edit</button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-[#6E6A66] block">Branch Name</span>
                          <strong className="text-[#1A1615]">{branchName}</strong>
                        </div>
                        <div>
                          <span className="text-[#6E6A66] block">Architecture</span>
                          <strong className="text-[#1A1615] capitalize">{registerType} Register</strong>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="text-[#6E6A66] block">Address</span>
                          <strong className="text-[#1A1615]">{address}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Pay-As-You-Go Wallet Initialization */}
                    <div className="p-4 rounded-xl border border-[#D4A753]/40 bg-[#FAF6EE] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Wallet className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-extrabold text-[#1A1615]">Pay-As-You-Go Credit System Initialized</div>
                          <div className="text-[11px] text-[#6E6A66]">No recurring monthly subscription contracts. Initial <strong>250 credits</strong> loaded.</div>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-extrabold rounded-full uppercase border border-emerald-200 shrink-0">
                        Ready
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-4 text-[#0D7A53] text-[11px] font-bold bg-[#E6F4ED] p-3 rounded-lg border border-[#BCE3D1]">
                      <Lock className="w-4 h-4" /> Environment provisioned with end-to-end SOC-2 Type II data encryption.
                    </div>
                  </div>
                </>
              )}

              {/* Bottom Actions */}
              <div className="mt-8 pt-5 border-t border-[#E5E0D8] flex items-center justify-between">
                {activeStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setActiveStep(activeStep - 1)}
                    className="px-4 py-2.5 rounded-lg border border-[#E5E0D8] text-xs font-semibold text-[#6E6A66] hover:bg-[#FAF8F5] cursor-pointer transition-colors"
                  >
                    ← Back
                  </button>
                ) : (
                  <div></div>
                )}
                <div className="flex items-center gap-4">
                  {onboardingError && <span className="text-xs text-red-500 font-medium">{onboardingError}</span>}
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      if (activeStep < 4) {
                        setActiveStep(activeStep + 1);
                      } else {
                        handleLaunch();
                      }
                    }}
                    disabled={isOnboarding}
                    className={`py-2.5 px-5 text-xs font-bold cursor-pointer ${isOnboarding ? 'opacity-50' : ''}`}
                  >
                    {isOnboarding ? 'Launching...' : activeStep === 4 ? 'Launch Merchant Panel →' : 'Continue →'}
                  </PrimaryButton>
                </div>
              </div>
            </div>

            {/* Note: System Credit Requirement */}
            <div className="bg-white border border-[#D4A753]/40 rounded-xl p-4 shadow-xs flex items-start gap-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bottom-0 w-1 bg-gradient-to-b from-[#D4A753] to-[#9E782F]" />
              <div className="w-8 h-8 rounded-lg bg-[#FDF8EB] flex items-center justify-center shrink-0">
                <Wallet className="w-4 h-4 text-[#9E782F]" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#1A1615]">System Credit Requirement</h4>
                <p className="text-[11px] text-[#6E6A66] mt-0.5">
                  Please note that to start, you need a minimum of <strong>250 credits</strong> in your wallet to run this system.
                </p>
              </div>
            </div>

          </div>

          {/* Right Sidebar: Progress Checklist & Trust Benchmarks (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Progress Checklist Widget */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">
                  PROGRESS CHECKLIST
                </span>
                <span className="text-xs font-bold text-[#9E782F]">{Math.round(((activeStep - 1) / 3) * 100)}% Complete</span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-[#FAF8F5] rounded-full overflow-hidden border border-[#E5E0D8] mb-4">
                <div className={`h-full bg-gradient-to-r from-[#D4A753] to-[#9E782F] rounded-full transition-all duration-300`} style={{ width: `${Math.min(100, Math.round(((activeStep - 1) / 3) * 100))}%` }} />
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between text-[#0D7A53]">
                  <span className="flex items-center gap-2 font-medium">
                    <CheckCircle2 className="w-4 h-4" /> Legal Merchant Registration
                  </span>
                  <span className="text-[10px] font-bold">DONE</span>
                </div>
                {steps.map((step) => {
                  const isDone = activeStep > step.id;
                  const isCurrent = activeStep === step.id;

                  return (
                    <div key={step.id} className={`flex items-center justify-between ${isDone ? 'text-[#0D7A53]' : isCurrent ? 'text-[#1A1615] font-semibold' : 'text-[#9E9A93]'}`}>
                      <span className="flex items-center gap-2 font-medium">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full bg-[#9E782F] text-white flex items-center justify-center text-[10px]">
                            {step.id}
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-[#E5E0D8] text-[10px] flex items-center justify-center">
                            {step.id}
                          </div>
                        )}
                        {step.name}
                      </span>
                      <span className={`text-[10px] font-bold ${isDone ? '' : isCurrent ? 'text-[#9E9A93]' : 'font-normal'}`}>
                        {isDone ? 'DONE' : isCurrent ? 'IN PROGRESS' : 'PENDING'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SOC-2 Type II PCI Trust Badges */}
            <div className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl p-4">
              <div className="flex items-center gap-2 text-[#0D7A53] text-xs font-bold mb-2">
                <ShieldCheck className="w-4 h-4 text-[#0D7A53]" />
                <span>Enterprise Trust Guarantee</span>
              </div>
              <p className="text-[11px] text-[#6E6A66] leading-relaxed">
                Revia runs on SOC-2 Type II certified infrastructure. Customer digital wallet keys are never stored on cleartext cloud storage.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-[#E5E0D8] text-[#1A1615]">
                  SOC-2 TYPE II
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-[#E5E0D8] text-[#1A1615]">
                  PCI-DSS LEVEL 1
                </span>
              </div>
            </div>

            {/* Branch Speed Benchmarks */}
            <div className="bg-white border border-[#E5E0D8] rounded-xl p-4 shadow-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93] block mb-2">
                BRANCH SPEED BENCHMARK
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-[#1A1615]">38s</span>
                <span className="text-xs font-semibold text-[#0D7A53]">Avg. Order-to-Pour</span>
              </div>
              <p className="text-[11px] text-[#6E6A66] mt-1">
                Baristas equipped with Revia instant NFC scanner redeem rewards 2.8x faster than standard punch cards.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
