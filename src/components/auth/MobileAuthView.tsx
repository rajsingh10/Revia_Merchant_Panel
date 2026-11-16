import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  ChevronRight,
  ArrowLeft,
  Mail,
  Phone,
  Scissors,
  ShoppingBag,
  MoreHorizontal,
  Utensils,
  Tag,
  FileText,
  Trash2,
  Plus,
  Sparkles,
  Signal,
  Wifi,
  BatteryMedium,
  Check,
  ChevronDown
} from 'lucide-react';

export interface MobileAuthViewProps {
  onLoginSuccess: (role: 'merchant' | 'customer' | string) => void;
  initialRole?: 'role_select' | 'merchant' | 'customer';
}

export const MobileAuthView: React.FC<MobileAuthViewProps> = ({
  onLoginSuccess,
  initialRole = 'role_select',
}) => {
  // Mobile Flow States:
  // 'role_select' -> 'merchant_login' -> 'merchant_otp' -> 'business_details' -> 'company_details' -> 'branch_question' -> 'branch_details'
  // Or customer: 'customer_welcome' -> 'customer_otp'
  const [screen, setScreen] = useState<
    | 'role_select'
    | 'merchant_login'
    | 'merchant_otp'
    | 'business_details'
    | 'company_details'
    | 'branch_question'
    | 'branch_details'
    | 'customer_welcome'
    | 'customer_otp'
  >(initialRole === 'merchant' ? 'merchant_login' : 'role_select');

  // Login inputs
  const [loginTab, setLoginTab] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('98765 43210');
  const [emailAddress, setEmailAddress] = useState('merchant@revia.co');

  // OTP inputs
  const [otpValues, setOtpValues] = useState<string[]>(['4', '8', '2', '7', '6', '1']);
  const [otpTimer, setOtpTimer] = useState<number>(45);

  // Business Details (Step 1)
  const [businessType, setBusinessType] = useState<'restaurant' | 'salon' | 'retail' | 'other'>('restaurant');
  const [businessCategory, setBusinessCategory] = useState('Cafe, Bakery, Fast Food');
  const [businessDesc, setBusinessDesc] = useState('');

  // Company Details (Step 2)
  const [companyName, setCompanyName] = useState('The Coffee House');
  const [gstNumber, setGstNumber] = useState('07AAAAA0000A1Z5');
  const [businessAddress, setBusinessAddress] = useState('Shop 12, Inner Circle, Connaught Place, New Delhi - 110001');

  // Branch Details (Step 3 & 4)
  const [hasBranches, setHasBranches] = useState<'yes' | 'no'>('yes');
  const [sameAsCompany, setSameAsCompany] = useState(true);
  const [branches, setBranches] = useState<Array<{ id: string; name: string; country: string; state: string; contact: string }>>([
    { id: '1', name: 'Connaught Place', country: 'India', state: 'Delhi', contact: '98765 43210' },
  ]);

  // OTP timer countdown
  useEffect(() => {
    if ((screen === 'merchant_otp' || screen === 'customer_otp') && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [screen, otpTimer]);

  const handleOtpChange = (index: number, value: string) => {
    const val = value.slice(-1);
    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    if (val && index < 5) {
      const nextInput = document.getElementById(`mobile-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`mobile-otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleCompleteMerchantAuth = () => {
    localStorage.setItem('token', 'mock_merchant_token_' + Date.now());
    localStorage.removeItem('merchant_token');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'merchant_admin_1',
        name: 'Elena Rostova',
        email: emailAddress || 'elena@revia.co',
        role: 'merchant',
        businessName: companyName || 'Revia Café & Roastery',
      })
    );
    localStorage.removeItem('customer');
    localStorage.removeItem('customer_token');
    onLoginSuccess('merchant');
  };

  // ── Common Mobile Top Bar ──
  

  // ── Brand Logo Header ──
  const renderBrandHeader = () => (
    <div className="flex flex-col items-center justify-center pt-2 pb-2">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#5844A8] to-[#E11D48] flex items-center justify-center text-white shadow-xs">
          <Sparkles className="w-4 h-4 fill-white" />
        </div>
        <div className="text-left">
          <span className="text-lg font-black text-[#1E1548] leading-none tracking-tight block">Loyalitycs</span>
          <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase block mt-0.5">
            EARN • REDEEM • GROW
          </span>
        </div>
      </div>
    </div>
  );

  // ── Stepper Header (Steps 1, 2, 3) ──
  const renderStepper = (activeStep: 1 | 2 | 3) => (
    <div className="pt-2 pb-6 px-6">
      <div className="flex items-center justify-between relative max-w-xs mx-auto">
        <div className="absolute top-4 left-6 right-6 h-0.5 bg-gray-200 -z-0" />
        <div
          className="absolute top-4 left-6 h-0.5 bg-[#2D124D] -z-0 transition-all duration-300"
          style={{ width: activeStep === 1 ? '0%' : activeStep === 2 ? '50%' : '100%' }}
        />

        {/* Step 1 */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStep > 1
                ? 'bg-[#2D124D] text-white'
                : activeStep === 1
                ? 'bg-[#2D124D] text-white ring-4 ring-purple-100'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {activeStep > 1 ? <Check className="w-4 h-4 stroke-[3]" /> : '1'}
          </div>
          <span className="text-[9px] font-semibold text-gray-600 mt-1 whitespace-nowrap">Business Details</span>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStep > 2
                ? 'bg-[#2D124D] text-white'
                : activeStep === 2
                ? 'bg-[#2D124D] text-white ring-4 ring-purple-100'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            {activeStep > 2 ? <Check className="w-4 h-4 stroke-[3]" /> : '2'}
          </div>
          <span className="text-[9px] font-semibold text-gray-600 mt-1 whitespace-nowrap">Company Details</span>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col items-center z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
              activeStep === 3
                ? 'bg-[#2D124D] text-white ring-4 ring-purple-100'
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            3
          </div>
          <span className="text-[9px] font-semibold text-gray-600 mt-1 whitespace-nowrap">Branch Details</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans antialiased flex flex-col justify-between max-w-md mx-auto w-full relative select-none">
      {/* =====================================================================
          SCREEN 1: ROLE SELECTION (Merchant Access.png)
         ===================================================================== */}
      {screen === 'role_select' && (
        <div className="flex-1 flex flex-col justify-between">
          {/* Top Hero Barista Image */}
          <div className="relative w-full h-[40vh] sm:h-[44vh] min-h-[320px] max-h-[420px] overflow-hidden bg-purple-100">
            <img
              src="/assets/login/barista-hero.png"
              alt="Barista at cafe"
              className="w-full h-full object-cover object-top"
            />
            {/* Status bar overlaid at top */}
            <div className="absolute top-0 inset-x-0 z-10">
              
            </div>
            {/* Status bar overlaid at top */}
            <div className="absolute top-0 inset-x-0 z-10">
              
            </div>
          </div>

          {/* Bottom Sheet Card */}
          <div className="-mt-8 rounded-t-[36px] bg-[#FAF8FF] px-5 pt-4 pb-5 flex-1 flex flex-col justify-between shadow-2xl relative z-20 border-t border-purple-100/60">
            <div>
              {renderBrandHeader()}

              <div className="text-center mt-2 mb-4">
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Choose your role</h1>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Pick what describes you the best.</p>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {/* Option 1: Customer */}
                <button
                  type="button"
                  onClick={() => setScreen('customer_welcome')}
                  className="w-full p-3.5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-pink-200 flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs sm:text-sm font-bold text-[#1E1548]">I&apos;m a Customer</h3>
                      <p className="text-[11px] sm:text-xs text-gray-400 font-medium">Create, Earn &amp; Grow faster</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>

                {/* Option 2: Business / Merchant */}
                <button
                  type="button"
                  onClick={() => setScreen('merchant_login')}
                  className="w-full p-3.5 rounded-2xl bg-white border border-gray-100 shadow-2xs hover:border-purple-200 flex items-center justify-between transition-all cursor-pointer group active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0">
                      <Store className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs sm:text-sm font-bold text-[#1E1548]">I&apos;m a Business</h3>
                      <p className="text-[11px] sm:text-xs text-gray-400 font-medium">Run campaigns &amp; manage customers</p>
                    </div>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-[#5844A8] group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
              </div>
            </div>

            <div className="text-center text-[10px] sm:text-[11px] text-gray-400 pt-4">
              Powered by <span className="font-bold text-gray-700">Analytix Data</span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 2: MERCHANT LOGIN (Login screen.png & Login screen-1.png)
         ===================================================================== */}
      {screen === 'merchant_login' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
           
            <div className="text-center mt-3 mb-6">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Welcome Back!</h1>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-snug">
                Enter your mobile number or email to get OTP and continue
              </p>
            </div>

            {/* Segmented Tab: Mobile Number vs Email */}
            <div className="bg-purple-100/50 p-1 rounded-2xl flex items-center mb-4">
              <button
                type="button"
                onClick={() => setLoginTab('mobile')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  loginTab === 'mobile'
                    ? 'bg-purple-200/60 text-[#1E1548] shadow-xs'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => setLoginTab('email')}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition cursor-pointer ${
                  loginTab === 'email'
                    ? 'bg-purple-200/60 text-[#1E1548] shadow-xs'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Email
              </button>
            </div>

            {/* Input field */}
            {loginTab === 'mobile' ? (
              <div className="mb-4">
                <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-4 py-3 shadow-2xs focus-within:border-[#5844A8]">
                  <span className="text-xs font-bold text-gray-700 pr-2 border-r border-gray-200 flex items-center gap-1">
                    +91 <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </span>
                  <input
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full pl-3 text-xs font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            ) : (
              <div className="mb-4">
                <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-4 py-3 shadow-2xs focus-within:border-[#5844A8]">
                  <Mail className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full text-xs font-medium text-gray-900 bg-transparent outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* Get OTP Button */}
            <button
              type="button"
              onClick={() => {
                setOtpTimer(45);
                setScreen('merchant_otp');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            >
              Get OTP
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-xs text-gray-500 font-medium mt-4">
              New here?{' '}
              <button
                type="button"
                onClick={() => setScreen('business_details')}
                className="font-bold text-[#2D124D] hover:underline cursor-pointer"
              >
                Sign Up
              </button>
            </div>
          </div>

          {/* Switch to Business / Customer Card at Bottom */}
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setScreen('role_select')}
              className="w-full p-4 rounded-3xl bg-white border border-gray-100 shadow-2xs flex items-center justify-between transition-all cursor-pointer hover:border-purple-200 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                  <Store className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#1E1548]">Switch to Customer</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Login to your personal loyalty account</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 3: OTP VERIFICATION (Login OTP.png)
         ===================================================================== */}
      {screen === 'merchant_otp' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
            

            <div className="text-center mt-3 mb-6">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Verify Your Account</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                We&apos;ve sent a 6 digit OTP to <span className="font-bold text-gray-800">+ 91 {mobileNumber}</span>
              </p>
            </div>

            {/* 6 OTP Boxes */}
            <div className="flex items-center justify-center gap-2.5 mb-4">
              {otpValues.map((digit, idx) => (
                <input
                  key={idx}
                  id={`mobile-otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 rounded-2xl bg-white border border-gray-200/90 text-center font-black text-lg text-gray-900 focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 shadow-2xs"
                />
              ))}
            </div>

            {/* Resend text */}
            <p className="text-center text-[11px] text-gray-500 font-medium mb-4">
              Didn&apos;t receive the code?{' '}
              <span className="text-rose-500 font-bold">
                Resend OTP in 00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
              </span>
            </p>

            {/* OR Divider */}
            <div className="relative flex py-2 items-center mb-4">
              <div className="flex-grow border-t border-gray-100" />
              <span className="shrink-0 px-3 text-[10px] uppercase font-bold text-gray-400">OR</span>
              <div className="flex-grow border-t border-gray-100" />
            </div>

            {/* Verify via Email / Phone Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => setLoginTab('email')}
                className="py-2.5 px-3 rounded-2xl bg-white border border-gray-200/90 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-gray-50 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                <span>Verify via Email</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginTab('mobile')}
                className="py-2.5 px-3 rounded-2xl bg-white border border-gray-200/90 text-xs font-semibold text-gray-700 flex items-center justify-center gap-1.5 shadow-2xs hover:bg-gray-50 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                <span>Verify via Phone</span>
              </button>
            </div>

            {/* Next Button */}
            <button
              type="button"
              onClick={handleCompleteMerchantAuth}
              className="w-full py-3.5 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer"
            >
              Next
            </button>
          </div>

          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setScreen('merchant_login')}
              className="text-xs font-bold text-gray-500 hover:text-gray-800 flex items-center justify-center gap-1 mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 4: ONBOARDING STEP 1 - BUSINESS DETAILS (Business Detials.png)
         ===================================================================== */}
      {screen === 'business_details' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
           
            {renderStepper(1)}

            <div className="mb-5">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Business Details</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Tell us about your business so we can set up your account.
              </p>
            </div>

            {/* Select Business Type */}
            <label className="block text-xs font-bold text-[#1E1548] mb-2.5">
              Select Business Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Restaurant */}
              <div
                onClick={() => setBusinessType('restaurant')}
                className={`relative p-4 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  businessType === 'restaurant'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                {businessType === 'restaurant' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2D124D] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <Utensils className="w-6 h-6 text-[#1E1548]" />
                <span className="text-xs font-bold text-[#1E1548]">Restaurant</span>
              </div>

              {/* Salon */}
              <div
                onClick={() => setBusinessType('salon')}
                className={`relative p-4 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  businessType === 'salon'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                {businessType === 'salon' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2D124D] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <Scissors className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">Salon</span>
              </div>

              {/* Retail / Shopping */}
              <div
                onClick={() => setBusinessType('retail')}
                className={`relative p-4 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  businessType === 'retail'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                {businessType === 'retail' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2D124D] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <ShoppingBag className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">Retail / Shopping</span>
              </div>

              {/* Other */}
              <div
                onClick={() => setBusinessType('other')}
                className={`relative p-4 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  businessType === 'other'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                {businessType === 'other' && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#2D124D] text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                )}
                <MoreHorizontal className="w-6 h-6 text-gray-600" />
                <span className="text-xs font-bold text-gray-700">Other</span>
              </div>
            </div>

            {/* Select Business Category */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">Select Business Category</label>
              <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-3.5 py-3 shadow-2xs">
                <Tag className="w-4 h-4 text-gray-400 mr-2.5 shrink-0" />
                <select
                  value={businessCategory}
                  onChange={(e) => setBusinessCategory(e.target.value)}
                  className="w-full text-xs font-medium text-gray-800 bg-transparent outline-none cursor-pointer"
                >
                  <option value="Cafe, Bakery, Bar, Fast Food">Cafe, Bakery, Bar, Fast Food</option>
                  <option value="Casual Dining">Casual Dining</option>
                  <option value="Fine Dining">Fine Dining</option>
                  <option value="Desserts & Ice Cream">Desserts &amp; Ice Cream</option>
                  <option value="Boutique & Fashion">Boutique &amp; Fashion</option>
                </select>
              </div>
            </div>

            {/* Brief Description */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                Brief Description <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <div className="relative bg-white border border-gray-200/90 rounded-2xl p-3 shadow-2xs focus-within:border-[#5844A8]">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                  <textarea
                    rows={3}
                    maxLength={200}
                    value={businessDesc}
                    onChange={(e) => setBusinessDesc(e.target.value)}
                    placeholder="Add a short description about your business"
                    className="w-full text-xs font-medium text-gray-900 bg-transparent outline-none resize-none placeholder:text-gray-400"
                  />
                </div>
                <div className="text-right text-[10px] text-gray-400 mt-1">{businessDesc.length}/200</div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setScreen('merchant_login')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('company_details')}
              className="px-8 py-3 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 5: ONBOARDING STEP 2 - COMPANY DETAILS (Company Detailss.png)
         ===================================================================== */}
      {screen === 'company_details' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
        
            {renderStepper(2)}

            <div className="mb-5">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Company Details</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Tell us about your business so we can personalize your experience.
              </p>
            </div>

            {/* Company Name */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. The Coffee House"
                className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-2xl text-xs font-medium text-gray-900 shadow-2xs focus:outline-none focus:border-[#5844A8]"
              />
            </div>

            {/* GST Number */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                GST Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="ENTER 15 DIGIT GST NUMBER"
                className="w-full px-4 py-3 bg-white border border-gray-200/90 rounded-2xl text-xs font-medium text-gray-900 shadow-2xs focus:outline-none focus:border-[#5844A8] uppercase tracking-wider"
              />
            </div>

            {/* Business Address */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                Business Address <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                placeholder="House/Flat No., Building, Street, Area, City, State, Pincode"
                className="w-full p-4 bg-white border border-gray-200/90 rounded-2xl text-xs font-medium text-gray-900 shadow-2xs focus:outline-none focus:border-[#5844A8] resize-none"
              />
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setScreen('business_details')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('branch_question')}
              className="px-8 py-3 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 6: ONBOARDING STEP 3 - BRANCH QUESTION (Branch Detailss.png)
         ===================================================================== */}
      {screen === 'branch_question' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
            
            {renderStepper(3)}

            {/* Storefront Illustration */}
            <div className="flex justify-center my-4">
              <img
                src="/assets/login/cafe-branch.png"
                alt="Cafe storefront"
                className="w-64 max-w-full object-contain"
              />
            </div>

            <div className="text-center mb-6">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Do you have branches?</h1>
              <p className="text-xs text-gray-500 font-medium mt-1 leading-snug">
                Let us know if you operate multiple branches for your business.
              </p>
            </div>

            {/* Yes / No Choice Cards */}
            <div className="grid grid-cols-2 gap-3.5 mb-6">
              {/* Yes */}
              <div
                onClick={() => setHasBranches('yes')}
                className={`p-5 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  hasBranches === 'yes'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-purple-100/60 text-[#5844A8] flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E1548]">Yes</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">I have multiple branches</p>
                </div>
              </div>

              {/* No */}
              <div
                onClick={() => setHasBranches('no')}
                className={`p-5 rounded-3xl border-2 bg-white flex flex-col items-center justify-center text-center gap-2 cursor-pointer transition-all ${
                  hasBranches === 'no'
                    ? 'border-[#2D124D] bg-purple-50/30 shadow-xs'
                    : 'border-gray-100 hover:border-gray-200 shadow-2xs'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center">
                  <Store className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1E1548]">No</h4>
                  <p className="text-[10px] text-gray-400 font-medium mt-0.5">I only have one branch</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setScreen('company_details')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('branch_details')}
              className="px-8 py-3 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          SCREEN 7: ONBOARDING STEP 4 - ADD BRANCHES (Branch Details(No/Yes).png)
         ===================================================================== */}
      {screen === 'branch_details' && (
        <div className="flex-1 flex flex-col justify-between px-6 pb-6">
          <div>
            
            {renderStepper(3)}

            <div className="mb-4">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Add Branches</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Add details of your branches to manage them easily.
              </p>
            </div>

            {/* Branch Cards */}
            <div className="space-y-3.5 mb-4">
              {branches.map((b, idx) => (
                <div key={b.id} className="bg-white rounded-3xl p-4 border border-gray-100 shadow-2xs">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#5844A8]" />
                      <span className="text-xs font-bold text-[#1E1548]">Branch {idx + 1}</span>
                    </div>
                    {branches.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setBranches(branches.filter((item) => item.id !== b.id))}
                        className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mb-3">
                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">
                        Country <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={b.country}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBranches(branches.map((item) => (item.id === b.id ? { ...item, country: val } : item)));
                        }}
                        className="w-full px-3 py-2 bg-[#FAF8FF] border border-gray-200/90 rounded-xl text-xs font-semibold text-gray-800"
                      >
                        <option value="India">India</option>
                        <option value="UAE">UAE</option>
                        <option value="USA">USA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-gray-700 mb-1">
                        State <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={b.state}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBranches(branches.map((item) => (item.id === b.id ? { ...item, state: val } : item)));
                        }}
                        className="w-full px-3 py-2 bg-[#FAF8FF] border border-gray-200/90 rounded-xl text-xs font-semibold text-gray-800"
                      >
                        <option value="Delhi">Delhi</option>
                        <option value="Uttar Pradesh">Uttar Pradesh</option>
                        <option value="Maharashtra">Maharashtra</option>
                        <option value="Karnataka">Karnataka</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">
                      Branch Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={b.name}
                      onChange={(e) => {
                        const val = e.target.value;
                        setBranches(branches.map((item) => (item.id === b.id ? { ...item, name: val } : item)));
                      }}
                      placeholder="e.g. Connaught Place"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8FF] border border-gray-200/90 rounded-xl text-xs font-medium text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-gray-700 mb-1">
                      Contact Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center bg-[#FAF8FF] border border-gray-200/90 rounded-xl px-3 py-2">
                      <span className="text-xs font-bold text-gray-600 pr-2 border-r border-gray-200 flex items-center gap-1">
                        +91 <ChevronDown className="w-3 h-3 text-gray-400" />
                      </span>
                      <input
                        type="tel"
                        value={b.contact}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBranches(branches.map((item) => (item.id === b.id ? { ...item, contact: val } : item)));
                        }}
                        placeholder="Enter mobile number"
                        className="w-full pl-2.5 text-xs font-medium text-gray-900 bg-transparent outline-none"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Same as company address checkbox */}
            <label className="flex items-center gap-2 cursor-pointer mb-4 px-1">
              <input
                type="checkbox"
                checked={sameAsCompany}
                onChange={(e) => setSameAsCompany(e.target.checked)}
                className="w-4 h-4 rounded text-[#2D124D] focus:ring-purple-200 accent-[#2D124D]"
              />
              <span className="text-xs font-bold text-gray-800">Same as Company address</span>
            </label>

            {/* Add Another Branch button if multiple */}
            {hasBranches === 'yes' && (
              <button
                type="button"
                onClick={() =>
                  setBranches([
                    ...branches,
                    {
                      id: String(branches.length + 1),
                      name: `Branch ${branches.length + 1}`,
                      country: 'India',
                      state: 'Delhi',
                      contact: '98765 43210',
                    },
                  ])
                }
                className="w-full py-3 rounded-2xl border-2 border-dashed border-purple-200 bg-purple-50/40 text-[#5844A8] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-purple-50 transition-colors cursor-pointer mb-4"
              >
                <Plus className="w-4 h-4" /> Add Another Branch
              </button>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setScreen('branch_question')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={handleCompleteMerchantAuth}
              className="px-6 py-3 rounded-2xl bg-[#2D124D] hover:bg-[#5844A8] text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      )}

      {/* =====================================================================
          CUSTOMER FLOW FALLBACK
         ===================================================================== */}
      {screen === 'customer_welcome' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div>
          
            {renderBrandHeader()}

            <div className="text-center mt-4 mb-6">
              <h1 className="text-2xl font-black text-[#1E1548]">Customer Login</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Enter your phone number to continue</p>
            </div>

            <div className="mb-4">
              <div className="flex items-center bg-white border border-gray-200/90 rounded-2xl px-4 py-3 shadow-2xs">
                <span className="text-xs font-bold text-gray-700 pr-2 border-r border-gray-200 flex items-center gap-1">
                  +91 <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </span>
                <input
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  placeholder="Enter your mobile number"
                  className="w-full pl-3 text-xs font-medium text-gray-900 bg-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setScreen('customer_otp')}
              className="w-full py-3.5 rounded-2xl bg-[#5844A8] hover:bg-[#47368E] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Get OTP
            </button>
          </div>

          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setScreen('role_select')}
              className="text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              ← Back to Role Select
            </button>
          </div>
        </div>
      )}

      {screen === 'customer_otp' && (
        <div className="flex-1 flex flex-col justify-between p-6">
          <div>
          
            {renderBrandHeader()}

            <div className="text-center mt-4 mb-6">
              <h1 className="text-2xl font-black text-[#1E1548]">Verify OTP</h1>
              <p className="text-xs text-gray-500 font-medium mt-1">Sent to +91 {mobileNumber}</p>
            </div>

            <div className="flex items-center justify-center gap-2.5 mb-6">
              {['5', '2', '8', '4'].map((d, i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-lg font-black"
                >
                  {d}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem('customer_token', 'mock_cust_' + Date.now());
                onLoginSuccess('customer');
              }}
              className="w-full py-3.5 rounded-2xl bg-[#5844A8] text-white font-bold text-xs shadow-md"
            >
              Verify &amp; Continue
            </button>
          </div>

          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setScreen('customer_welcome')}
              className="text-xs font-bold text-gray-500 hover:text-gray-800"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileAuthView;
