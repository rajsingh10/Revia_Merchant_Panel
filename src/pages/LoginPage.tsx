import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
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
  Star,
  ChevronDown,
  ChevronRight,
  Coffee,
  Calendar,
  Heart
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (role: 'merchant' | 'customer' | string) => void;
  onGoToOnboarding?: () => void;
}

interface BranchItem {
  id: string;
  name: string;
  country: string;
  state: string;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToOnboarding }) => {
  // Navigation & View States:
  // 'role_select' | 'customer_welcome' | 'customer_otp' | 'customer_signup_step1' | 'customer_signup_step2' | 'merchant_access' | 'onboarding_step1' | 'onboarding_step2' | 'onboarding_step3' | 'onboarding_step4'
  const [viewState, setViewState] = useState<
    | 'role_select'
    | 'customer_welcome'
    | 'customer_otp'
    | 'customer_signup_step1'
    | 'customer_signup_step2'
    | 'merchant_access'
    | 'onboarding_step1'
    | 'onboarding_step2'
    | 'onboarding_step3'
    | 'onboarding_step4'
  >('role_select');

  // Customer Welcome & OTP States
  const [customerAuthTab, setCustomerAuthTab] = useState<'phone' | 'email'>('phone');
  const [customerPhone, setCustomerPhone] = useState('98765 43210');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerOtp, setCustomerOtp] = useState(['4', '8', '7', '2', '6', '1']);
  const [customerTimer, setCustomerTimer] = useState(45);

  // Customer Registration / Sign Up States (Desktop Adaptation)
  // Step 1: Tell us about yourself
  const [custFirstName, setCustFirstName] = useState('Salena');
  const [custLastName, setCustLastName] = useState('Mishra');
  const [custGender, setCustGender] = useState<'female' | 'male' | 'other'>('female');
  const [custDob, setCustDob] = useState('2000-08-14');
  const [custAge, setCustAge] = useState('24');
  const [custMobile, setCustMobile] = useState('98765 43210');
  const [custSameWhatsapp, setCustSameWhatsapp] = useState(true);

  // Step 2: A few more details (optional)
  const [custMaritalStatus, setCustMaritalStatus] = useState('Married');
  const [custAnniversary, setCustAnniversary] = useState('2023-11-20');
  const [custPartnerName, setCustPartnerName] = useState('Rohan Mishra');
  const [custPartnerMobile, setCustPartnerMobile] = useState('98765 12345');

  // Customer Access Mode (Login vs Sign Up)
  const [customerTab, setCustomerTab] = useState<'login' | 'signup'>('login');
  const [customerSignupPhone, setCustomerSignupPhone] = useState('9876543210');
  const [customerSignupPassword, setCustomerSignupPassword] = useState('SecurePass@123');
  const [customerSignupConfirmPassword, setCustomerSignupConfirmPassword] = useState('SecurePass@123');
  const [showCustomerSignupPassword, setShowCustomerSignupPassword] = useState(false);
  const [showCustomerSignupConfirmPassword, setShowCustomerSignupConfirmPassword] = useState(false);

  // Merchant Access States
  const [merchantTab, setMerchantTab] = useState<'login' | 'signup'>('login');
  const [merchantLoginMode, setMerchantLoginMode] = useState<'password' | 'gmail'>('password');
  const [merchantEmail, setMerchantEmail] = useState('simranmishrasim@gmail.com');
  const [merchantPassword, setMerchantPassword] = useState('password123');
  const [showMerchantPassword, setShowMerchantPassword] = useState(false);
  const [merchantOtp, setMerchantOtp] = useState(['4', '8', '3', '1', '6', '0']);
  const [merchantOtpTimer, setMerchantOtpTimer] = useState(45);

  // Merchant Sign Up States
  const [signupPhone, setSignupPhone] = useState('9876543210');
  const [signupPassword, setSignupPassword] = useState('SecurePass@123');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('SecurePass@123');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);

  // Merchant Onboarding Wizard States
  // Step 1: Your Details
  const [wizardFullName, setWizardFullName] = useState('Anabyu');
  const [wizardAge, setWizardAge] = useState('28');
  const [wizardMobile, setWizardMobile] = useState('9876543210');
  const [wizardMail, setWizardMail] = useState('anabyu@revia.co');

  // Step 2: Business Details
  const [wizardBusinessType, setWizardBusinessType] = useState<'restaurant' | 'salon' | 'retail' | 'other'>('restaurant');
  const [wizardBusinessCategory, setWizardBusinessCategory] = useState('Cafe & Roastery');
  const [wizardBusinessDesc, setWizardBusinessDesc] = useState('Artisanal specialty coffee roasters and bistro with loyalty rewards.');

  // Step 3: Company Details
  const [wizardCompanyName, setWizardCompanyName] = useState('The Coffee House');
  const [wizardGstNumber, setWizardGstNumber] = useState('07AAAAA0000A1Z5');
  const [wizardAddress, setWizardAddress] = useState('Shop 12, Ground Floor, Inner Circle, Connaught Place, New Delhi, Delhi - 110001');

  // Step 4: Branch Details
  const [wizardHasMultipleBranches, setWizardHasMultipleBranches] = useState<'yes' | 'no'>('yes');
  const [wizardBranches, setWizardBranches] = useState<BranchItem[]>([
    { id: '1', name: 'Connaught Place', country: 'India', state: 'Delhi' }
  ]);

  // Timers countdown
  useEffect(() => {
    if (viewState === 'customer_otp' && customerTimer > 0) {
      const timer = setInterval(() => setCustomerTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [viewState, customerTimer]);

  useEffect(() => {
    if (merchantLoginMode === 'gmail' && merchantOtpTimer > 0) {
      const timer = setInterval(() => setMerchantOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [merchantLoginMode, merchantOtpTimer]);

  // Helper for OTP input change
  const handleOtpBoxChange = (
    index: number,
    value: string,
    currentOtp: string[],
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    prefixId: string
  ) => {
    const val = value.slice(-1);
    const newArr = [...currentOtp];
    newArr[index] = val;
    setter(newArr);

    if (val && index < 5) {
      const nextInput = document.getElementById(`${prefixId}-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
    currentOtp: string[],
    prefixId: string
  ) => {
    if (e.key === 'Backspace' && !currentOtp[index] && index > 0) {
      const prevInput = document.getElementById(`${prefixId}-${index - 1}`);
      prevInput?.focus();
    }
  };

  // Merchant Password validation checks
  const hasMinLength = signupPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(signupPassword);
  const hasNumber = /[0-9]/.test(signupPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(signupPassword);

  // Customer Password validation checks (matching uploaded mockup)
  const custPassMinLength = customerSignupPassword.length >= 8;
  const custPassUppercase = /[A-Z]/.test(customerSignupPassword);
  const custPassNumber = /[0-9]/.test(customerSignupPassword);
  const custPassSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(customerSignupPassword);

  // Complete Merchant Login
  const completeMerchantLogin = () => {
    localStorage.setItem('token', 'mock_merchant_token_' + Date.now());
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'merchant_admin_1',
        name: wizardFullName || 'Elena Rostova',
        email: merchantEmail || 'elena@revia.co',
        role: 'merchant',
        businessName: wizardCompanyName || 'Revia Café & Roastery'
      })
    );
    onLoginSuccess('merchant');
  };

  // Complete Customer Login
  const completeCustomerLogin = () => {
    localStorage.setItem('token', 'mock_customer_token_' + Date.now());
    localStorage.setItem(
      'customer',
      JSON.stringify({
        id: 'cust_1',
        firstName: custFirstName || 'Salena',
        lastName: custLastName || 'Mishra',
        name: `${custFirstName || 'Salena'} ${custLastName || 'Mishra'}`,
        phone: custMobile || customerPhone,
        email: customerEmail || 'salena@revia.co',
        gender: custGender,
        dob: custDob,
        age: custAge,
        maritalStatus: custMaritalStatus,
        anniversary: custAnniversary,
        partnerName: custPartnerName,
        partnerMobile: custPartnerMobile
      })
    );
    onLoginSuccess('customer');
  };

  // Dynamic branch helpers
  const handleAddBranch = () => {
    const nextIdx = wizardBranches.length + 1;
    setWizardBranches([
      ...wizardBranches,
      { id: String(Date.now()), name: `Branch ${nextIdx}`, country: 'India', state: 'Delhi' }
    ]);
  };

  const handleRemoveBranch = (id: string) => {
    if (wizardBranches.length <= 1) return;
    setWizardBranches(wizardBranches.filter((b) => b.id !== id));
  };

  const handleUpdateBranch = (id: string, field: keyof BranchItem, value: string) => {
    setWizardBranches(
      wizardBranches.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  // Stepper Header Component for Onboarding
  const renderOnboardingStepper = (activeStep: number) => {
    const steps = [
      { id: 1, label: 'Your Details' },
      { id: 2, label: 'Business Details' },
      { id: 3, label: 'Company Details' },
      { id: 4, label: 'Branch Details' }
    ];

    return (
      <div className="w-full flex items-center justify-between mb-8 relative">
        {/* Connecting track line */}
        <div className="absolute top-4 left-6 right-6 h-[2px] bg-gray-200 z-0" />

        {steps.map((st) => {
          const isDone = activeStep > st.id;
          const isCurrent = activeStep === st.id;

          return (
            <div key={st.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-2xs ${
                  isCurrent
                    ? 'bg-[#5844A8] text-white ring-4 ring-purple-100'
                    : isDone
                    ? 'bg-[#5844A8] text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {st.id}
              </div>
              <span
                className={`text-[11px] font-bold mt-2 whitespace-nowrap ${
                  isCurrent ? 'text-[#1E1548]' : 'text-gray-400'
                }`}
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#FAF5FF] via-[#FAF8FF] to-[#FFF5F7] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans antialiased text-[#1E1548] select-none">
      {/* Main Glass Shell Container */}
      <div className="w-full max-w-[1100px] bg-white/90 backdrop-blur-md rounded-[36px] shadow-2xl border border-purple-100/70 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
        {/* =========================================================================
            LEFT COLUMN: BRANDING HERO & 3D ARTWORK (Exact match to all Figma images)
           ========================================================================= */}
        <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-purple-50/80 bg-gradient-to-b from-[#FAF8FF] to-[#F5EFFF] relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-[#E83E8C]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-[#7C3AED]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Brand Header */}
          <div className="relative z-10">
            <button
              type="button"
              onClick={() => onLoginSuccess('/')}
              className="flex items-center gap-2.5 text-left cursor-pointer group bg-transparent border-none p-0"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center font-black text-lg shadow-md shadow-purple-900/20 group-hover:scale-105 transition-transform">
                R
              </div>
              <div>
                <div className="font-extrabold text-base tracking-tight text-[#1E1548] flex items-center gap-1">
                  Revia
                  <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-pink-50 px-1.5 py-0.2 rounded-md">
                    Loyalty
                  </span>
                </div>
                <div className="text-[9px] uppercase tracking-widest text-purple-400 font-bold">
                  EARN • REDEEM • GROW
                </div>
              </div>
            </button>
          </div>

          {/* Center Hero Copy & Artwork */}
          <div className="my-8 relative z-10 space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black text-[#1E1548] tracking-tight leading-[1.15]">
                Stronger <br />
                Customer <br />
                Relationships <br />
                <span className="text-[#E11D48]">Start Here</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed max-w-sm">
                Build loyalty, boost sales and create lasting connections with your customers through rewards and offers.
              </p>
            </div>

            {/* Illustration Section (Switches smoothly based on flow) */}
            <div className="pt-4 flex justify-center items-center">
              {viewState === 'merchant_access' && merchantTab === 'login' ? (
                /* Café Table 3D Mockup */
                <div className="relative w-56 h-56 flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full bg-purple-200/40 absolute -bottom-2 blur-md" />
                  <div className="relative w-44 h-44 rounded-3xl bg-white p-3 shadow-xl border border-purple-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-purple-100/80 text-[#5844A8] flex items-center justify-center shadow-inner mb-2">
                      <Coffee className="w-9 h-9" />
                    </div>
                    <div className="text-xs font-extrabold text-[#1E1548]">Revia Café & Roastery</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">Welcome back, Merchant</div>
                    <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-[9px] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> System Online
                    </div>
                  </div>
                </div>
              ) : (
                /* 3D Wallet / Loyalty Cards Stacks (Exact match to images 1, 2, 4, 5, etc.) */
                <div className="relative w-52 h-44 flex items-center justify-center">
                  {/* Pink Card */}
                  <div className="absolute left-4 top-2 w-28 h-36 bg-gradient-to-br from-[#FF4E8D] to-[#E11D48] rounded-2xl shadow-lg -rotate-6 transform hover:rotate-0 transition-transform">
                    <div className="w-3 h-1 bg-white/40 rounded-full mt-2 ml-2" />
                  </div>
                  {/* Dark Violet Card */}
                  <div className="absolute right-4 top-4 w-28 h-36 bg-gradient-to-br from-[#2D1954] to-[#1A0E33] rounded-2xl shadow-lg rotate-12 transform hover:rotate-6 transition-transform">
                    <div className="w-3 h-1 bg-white/20 rounded-full mt-2 ml-2" />
                  </div>
                  {/* Main Purple Star Card */}
                  <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-[#6D48D7] to-[#4A2CA0] rounded-3xl shadow-xl flex items-center justify-center text-white border-2 border-white/20">
                    <Star className="w-12 h-12 fill-white text-white drop-shadow-md" />
                  </div>
                  {/* White Mini Star Pill */}
                  <div className="absolute -bottom-2 right-6 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-lg border border-purple-50 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#FF4E8D] text-[#FF4E8D]" />
                    <span className="w-2.5 h-1 bg-gray-200 rounded-full" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Left Footer Info */}
          <div className="relative z-10 text-[10px] text-gray-400 font-semibold flex items-center justify-between pt-4 border-t border-purple-100/50">
            <span>© {new Date().getFullYear()} Revia Unified Commerce</span>
            <span className="text-purple-600 font-bold">Analytix Suite</span>
          </div>
        </div>

        {/* =========================================================================
            RIGHT COLUMN: DYNAMIC FLOW CONTENT (The 12 Attached Screens)
           ========================================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center bg-white relative">
          {/* =======================================================================
              VIEW 1: ROLE SELECTION GATEWAY (Image 1)
             ======================================================================= */}
          {viewState === 'role_select' && (
            <div className="max-w-md mx-auto w-full space-y-6">
              <div>
                <h2 className="text-2xl font-black text-[#1E1548]">
                  Are you a customer <br />
                  or a merchant?
                </h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Choose how you&apos;d like to continue
                </p>
              </div>

              {/* Role Cards */}
              <div className="space-y-4 pt-2">
                {/* Option 1: Customer */}
                <button
                  type="button"
                  onClick={() => {
                    setCustomerTab('login');
                    setViewState('customer_welcome');
                  }}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-gray-100 hover:border-[#5844A8]/40 hover:bg-[#FAF8FF] transition-all cursor-pointer flex items-center justify-between group shadow-2xs hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-50 text-[#E11D48] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                        I&apos;m a Customer
                      </h3>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 leading-snug">
                        Discover offers, earn rewards and enjoy exclusive benefits.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#5844A8] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>

                {/* Option 2: Merchant */}
                <button
                  type="button"
                  onClick={() => setViewState('merchant_access')}
                  className="w-full text-left p-4 sm:p-5 rounded-2xl border-2 border-[#5844A8] bg-[#FAF8FF] hover:bg-[#F5F0FF] transition-all cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                      <Store className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#1E1548]">
                        I&apos;m a Merchant
                      </h3>
                      <p className="text-xs text-gray-500 font-medium mt-0.5 leading-snug">
                        Manage your loyalty programs, create campaigns and grow your business.
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#5844A8] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                </button>
              </div>

              {/* Sub-footer */}
              <div className="pt-8 text-center">
                <span className="text-[11px] font-semibold text-gray-400">
                  Powered by <span className="font-bold text-gray-700">Analytix Data</span>
                </span>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 2: CUSTOMER AUTH - WELCOME BACK (OTP Login)
             ======================================================================= */}
          {viewState === 'customer_welcome' && (
            <div className="max-w-md mx-auto w-full space-y-6">
              <button
                type="button"
                onClick={() => setViewState('role_select')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <h2 className="text-2xl font-black text-[#1E1548]">Welcome Back!</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  Enter your mobile number or email to get OTP and continue.
                </p>
              </div>

              {/* Segmented Tab: Mobile No vs Email */}
              <div className="flex items-center p-1 bg-[#FAF8FF] border border-purple-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab('phone')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    customerAuthTab === 'phone'
                      ? 'bg-[#5844A8] text-white shadow-2xs'
                      : 'text-gray-500 hover:text-[#1E1548]'
                  }`}
                >
                  Mobile Number
                </button>
                <button
                  type="button"
                  onClick={() => setCustomerAuthTab('email')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    customerAuthTab === 'email'
                      ? 'bg-[#5844A8] text-white shadow-2xs'
                      : 'text-gray-500 hover:text-[#1E1548]'
                  }`}
                >
                  Email
                </button>
              </div>

              {/* Input Form */}
              <div className="space-y-4">
                {customerAuthTab === 'phone' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Enter mobile number
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1E1548]">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Enter email address
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. customer@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setCustomerTimer(45);
                    setViewState('customer_otp');
                  }}
                  className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  Get OTP &rarr;
                </button>
              </div>

              <div className="pt-4 text-center space-y-2">
                <div className="text-xs font-medium text-gray-500">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setViewState('customer_signup_step1');
                    }}
                    className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
                <div className="text-[11px] font-semibold text-gray-400">
                  Powered by <span className="font-bold text-gray-700">Analytix Data</span>
                </div>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 3: CUSTOMER OTP VERIFICATION (Image 2)
             ======================================================================= */}
          {viewState === 'customer_otp' && (
            <div className="max-w-md mx-auto w-full space-y-6">
              <button
                type="button"
                onClick={() => setViewState('customer_welcome')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <h2 className="text-2xl font-black text-[#1E1548]">Verify Your Account</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  We&apos;ve sent a 6 digit OTP to{' '}
                  <span className="font-bold text-[#1E1548]">
                    {customerAuthTab === 'phone' ? `+91 ${customerPhone}` : customerEmail || 'your email'}
                  </span>
                </p>
              </div>

              {/* 6 OTP Boxes */}
              <div className="grid grid-cols-6 gap-2 sm:gap-3 py-2">
                {customerOtp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`customer-otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) =>
                      handleOtpBoxChange(idx, e.target.value, customerOtp, setCustomerOtp, 'customer-otp')
                    }
                    onKeyDown={(e) => handleOtpKeyDown(idx, e, customerOtp, 'customer-otp')}
                    className="h-12 text-center text-lg font-black text-[#1E1548] bg-[#FAF8FF] border border-purple-200 rounded-xl focus:outline-none focus:border-[#5844A8] focus:bg-white shadow-2xs"
                  />
                ))}
              </div>

              {/* Resend Timer */}
              <div className="text-xs text-gray-500 text-center font-medium">
                Didn&apos;t receive the code?{' '}
                {customerTimer > 0 ? (
                  <span className="text-rose-600 font-bold">
                    Resend OTP in 00:{customerTimer < 10 ? `0${customerTimer}` : customerTimer}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setCustomerTimer(45)}
                    className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              {/* Alternative Channels */}
              <div className="space-y-3 pt-2">
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-gray-200 w-full" />
                  <span className="bg-white px-3 text-[10px] font-bold uppercase text-gray-400 absolute">
                    OR
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerAuthTab('email');
                      setCustomerTimer(45);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 bg-white cursor-pointer shadow-2xs hover:bg-gray-50"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    Verify via Email
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCustomerAuthTab('phone');
                      setCustomerTimer(45);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-bold text-gray-700 bg-white cursor-pointer shadow-2xs hover:bg-gray-50"
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    Verify via Phone
                  </button>
                </div>
              </div>

              {/* Primary Next Action: Directly Authenticate and Enter Customer Portal */}
              <button
                type="button"
                onClick={completeCustomerLogin}
                className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
              >
                Verify &amp; Log In &rarr;
              </button>
            </div>
          )}

          {/* =======================================================================
              VIEW 3A: CUSTOMER SIGN UP STEP 1 - TELL US ABOUT YOURSELF
             ======================================================================= */}
          {viewState === 'customer_signup_step1' && (
            <div className="max-w-md mx-auto w-full space-y-4 animate-in fade-in duration-300">
              <button
                type="button"
                onClick={() => setViewState('customer_welcome')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-2xl font-black text-[#1E1548]">Tell us about yourself</h2>
                  <span className="text-[10px] font-black text-[#5844A8] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
                    Step 1 of 2
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  This helps us give you a better experience at Sly Granny Cafe.
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E1548] mb-1">First Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={custFirstName}
                        onChange={(e) => setCustFirstName(e.target.value)}
                        placeholder="Salena"
                        className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Last Name *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={custLastName}
                        onChange={(e) => setCustLastName(e.target.value)}
                        placeholder="Mishra"
                        className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Gender Pills */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Gender *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustGender('female')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        custGender === 'female'
                          ? 'bg-[#2D1A47] text-white shadow-xs'
                          : 'bg-[#FAF8FF] border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>♀ Female</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustGender('male')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        custGender === 'male'
                          ? 'bg-[#2D1A47] text-white shadow-xs'
                          : 'bg-[#FAF8FF] border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>♂ Male</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustGender('other')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                        custGender === 'other'
                          ? 'bg-[#2D1A47] text-white shadow-xs'
                          : 'bg-[#FAF8FF] border border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>••• Other</span>
                    </button>
                  </div>
                </div>

                {/* Date of Birth & Age (2 columns) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Date of Birth *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={custDob}
                        onChange={(e) => setCustDob(e.target.value)}
                        className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Age *</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <select
                        value={custAge}
                        onChange={(e) => setCustAge(e.target.value)}
                        className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer"
                      >
                        <option value="">Select age</option>
                        <option value="18">18 - 24 years</option>
                        <option value="24">24 years</option>
                        <option value="25">25 - 34 years</option>
                        <option value="35">35 - 44 years</option>
                        <option value="45">45 - 54 years</option>
                        <option value="55">55+ years</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Mobile Number *</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] shrink-0">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={custMobile}
                      onChange={(e) => setCustMobile(e.target.value)}
                      placeholder="Enter mobile number"
                      className="flex-1 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>

                {/* WhatsApp Checkbox */}
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={custSameWhatsapp}
                    onChange={(e) => setCustSameWhatsapp(e.target.checked)}
                    className="w-4 h-4 rounded text-[#2D1A47] focus:ring-[#5844A8] border-gray-300 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#1E1548]">My WhatsApp number is same</span>
                </label>

                {/* Create Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">
                    Create Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCustomerSignupPassword ? 'text' : 'password'}
                      value={customerSignupPassword}
                      onChange={(e) => setCustomerSignupPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-3.5 pr-10 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerSignupPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showCustomerSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Password Rules Checklist Card */}
                <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-3 space-y-1">
                  {[
                    { ok: custPassMinLength, text: 'At least 8 characters' },
                    { ok: custPassUppercase, text: '1 uppercase letter (A–Z)' },
                    { ok: custPassNumber, text: '1 number (0–9)' },
                    { ok: custPassSpecial, text: '1 special character (e.g. ! @ # $ %)' }
                  ].map((rule, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[10px] font-semibold">
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          rule.ok ? 'bg-[#5844A8] text-white' : 'bg-gray-200 text-gray-400'
                        }`}
                      >
                        <Check className="w-2 h-2 stroke-[3]" />
                      </div>
                      <span className={rule.ok ? 'text-[#1E1548]' : 'text-gray-400'}>
                        {rule.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showCustomerSignupConfirmPassword ? 'text' : 'password'}
                      value={customerSignupConfirmPassword}
                      onChange={(e) => setCustomerSignupConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-3.5 pr-10 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCustomerSignupConfirmPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showCustomerSignupConfirmPassword ? (
                        <EyeOff className="w-3.5 h-3.5" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => setViewState('customer_signup_step2')}
                className="w-full py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-bold rounded-2xl shadow-md transition cursor-pointer mt-2"
              >
                Next &rarr;
              </button>

              <div className="pt-2 text-center">
                <span className="text-xs text-gray-500">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setViewState('customer_welcome')}
                    className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                  >
                    Login
                  </button>
                </span>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 3B: CUSTOMER SIGN UP STEP 2 - A FEW MORE DETAILS (OPTIONAL)
             ======================================================================= */}
          {viewState === 'customer_signup_step2' && (
            <div className="max-w-md mx-auto w-full space-y-5 animate-in fade-in duration-300">
              <button
                type="button"
                onClick={() => setViewState('customer_signup_step1')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-black text-[#1E1548]">A few more details</h2>
                    <span className="text-xs font-bold text-gray-400">(optional)</span>
                  </div>
                  <span className="text-[10px] font-black text-[#5844A8] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-100 uppercase tracking-wider">
                    Step 2 of 2
                  </span>
                </div>
                <p className="text-xs text-gray-500 font-medium">
                  Help us personalise your experience and offers.
                </p>
              </div>

              {/* Card 1: Marital Status */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-2">
                <label className="block text-xs font-bold text-[#1E1548]">Marital Status</label>
                <div className="relative">
                  <select
                    value={custMaritalStatus}
                    onChange={(e) => setCustMaritalStatus(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl px-3.5 py-2.5 pr-8 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer"
                  >
                    <option value="">Select</option>
                    <option value="Married">Married</option>
                    <option value="Single">Single</option>
                    <option value="In a relationship">In a relationship</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Card 2: If married */}
              <div className="bg-white border border-gray-200/90 rounded-2xl p-4 shadow-2xs space-y-3.5">
                <h3 className="text-xs font-black text-[#1E1548]">If married</h3>

                {/* Anniversary Date */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Anniversary Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={custAnniversary}
                      onChange={(e) => setCustAnniversary(e.target.value)}
                      className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>

                {/* Partner's Name */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Partner&apos;s Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={custPartnerName}
                      onChange={(e) => setCustPartnerName(e.target.value)}
                      placeholder="Enter partner's name"
                      className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>

                {/* Partner's Mobile Number */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1">Partner&apos;s Mobile Number</label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] shrink-0">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>+91</span>
                    </div>
                    <input
                      type="tel"
                      value={custPartnerMobile}
                      onChange={(e) => setCustPartnerMobile(e.target.value)}
                      placeholder="Enter number"
                      className="flex-1 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons: Skip for now & Next */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={completeCustomerLogin}
                  className="flex-1 py-3 bg-white hover:bg-gray-50 text-[#2D1A47] border-2 border-[#2D1A47] text-xs font-black rounded-2xl transition cursor-pointer"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={completeCustomerLogin}
                  className="flex-1 py-3 bg-[#2D1A47] hover:bg-[#1E1130] text-white text-xs font-black rounded-2xl shadow-md transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 4: MERCHANT ACCESS (Image 3 & 2nd Batch Image 1 & 2)
             ======================================================================= */}
          {viewState === 'merchant_access' && (
            <div className="max-w-md mx-auto w-full space-y-6">
              <button
                type="button"
                onClick={() => setViewState('role_select')}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <div>
                <h2 className="text-2xl font-black text-[#1E1548]">Merchant Access</h2>
                <p className="text-xs text-gray-500 font-medium mt-1">
                  {merchantTab === 'login'
                    ? 'Log in to your account or create a new one to get started.'
                    : 'Complete your account details to get started.'}
                </p>
              </div>

              {/* Tab Switcher: Login vs Sign Up */}
              <div className="flex items-center p-1 bg-[#FAF8FF] border border-purple-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setMerchantTab('login')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    merchantTab === 'login'
                      ? 'bg-[#5844A8] text-white shadow-2xs'
                      : 'text-gray-500 hover:text-[#1E1548]'
                  }`}
                >
                  Login
                </button>
                <button
                  type="button"
                  onClick={() => setMerchantTab('signup')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    merchantTab === 'signup'
                      ? 'bg-[#5844A8] text-white shadow-2xs'
                      : 'text-gray-500 hover:text-[#1E1548]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* ----------------- MERCHANT LOGIN TAB ----------------- */}
              {merchantTab === 'login' ? (
                <div className="space-y-4">
                  {/* Mode Selector (Password vs Gmail OTP) */}
                  <div className="flex items-center gap-2 pb-1">
                    <button
                      type="button"
                      onClick={() => setMerchantLoginMode('password')}
                      className={`text-[11px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        merchantLoginMode === 'password'
                          ? 'bg-purple-100 text-[#5844A8]'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Email &amp; Password
                    </button>
                    <button
                      type="button"
                      onClick={() => setMerchantLoginMode('gmail')}
                      className={`text-[11px] font-bold px-3 py-1 rounded-md transition-colors cursor-pointer ${
                        merchantLoginMode === 'gmail'
                          ? 'bg-purple-100 text-[#5844A8]'
                          : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      Gmail OTP Mode
                    </button>
                  </div>

                  {merchantLoginMode === 'password' ? (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                          Email Address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={merchantEmail}
                            onChange={(e) => setMerchantEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-bold text-[#1E1548]">
                            Password <span className="text-rose-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => alert('Password reset link sent to registered email.')}
                            className="text-[11px] font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            Forgot password?
                          </button>
                        </div>
                        <div className="relative">
                          <input
                            type={showMerchantPassword ? 'text' : 'password'}
                            value={merchantPassword}
                            onChange={(e) => setMerchantPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          />
                          <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <button
                            type="button"
                            onClick={() => setShowMerchantPassword((v) => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                          >
                            {showMerchantPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={completeMerchantLogin}
                        className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        Login &rarr;
                      </button>
                    </>
                  ) : (
                    /* Gmail OTP Inline Flow (2nd Batch Image 1) */
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                          Email address <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            value={merchantEmail}
                            onChange={(e) => setMerchantEmail(e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-9 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          />
                          <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      {/* Verify with OTP Card */}
                      <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-[#5844A8]" />
                          <div>
                            <div className="text-xs font-bold text-[#1E1548]">Verify with OTP</div>
                            <div className="text-[10px] text-gray-400">
                              We&apos;ve sent a 6-digit code to {merchantEmail}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-6 gap-2">
                          {merchantOtp.map((dig, idx) => (
                            <input
                              key={idx}
                              id={`merchant-otp-${idx}`}
                              type="text"
                              maxLength={1}
                              value={dig}
                              onChange={(e) =>
                                handleOtpBoxChange(idx, e.target.value, merchantOtp, setMerchantOtp, 'merchant-otp')
                              }
                              onKeyDown={(e) => handleOtpKeyDown(idx, e, merchantOtp, 'merchant-otp')}
                              className="h-10 text-center font-bold text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#5844A8]"
                            />
                          ))}
                        </div>

                        <div className="text-[11px] text-gray-400 font-medium">
                          Didn&apos;t receive the code?{' '}
                          <span className="font-bold text-[#5844A8]">
                            Resend OTP (00:{merchantOtpTimer < 10 ? `0${merchantOtpTimer}` : merchantOtpTimer})
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={completeMerchantLogin}
                        className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
                      >
                        Continue &rarr;
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* ----------------- MERCHANT SIGN UP TAB (2nd Batch Image 2) ----------------- */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-1.5 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1E1548]">
                        <span>🇮🇳 +91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Rules Checklist Card */}
                  <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-3.5 space-y-1.5">
                    {[
                      { ok: hasMinLength, text: 'At least 8 characters' },
                      { ok: hasUppercase, text: '1 uppercase letter (A–Z)' },
                      { ok: hasNumber, text: '1 number (0–9)' },
                      { ok: hasSpecial, text: '1 special character (e.g. ! @ # $ %)' }
                    ].map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] font-semibold">
                        <div
                          className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                            rule.ok ? 'bg-[#5844A8] text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className={rule.ok ? 'text-[#1E1548]' : 'text-gray-400'}>
                          {rule.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showSignupConfirmPassword ? 'text' : 'password'}
                        value={signupConfirmPassword}
                        onChange={(e) => setSignupConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupConfirmPassword((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showSignupConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewState('onboarding_step1')}
                    className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    Create Account &rarr;
                  </button>
                </div>
              )}
            </div>
          )}

          {/* =======================================================================
              VIEW 5: ONBOARDING STEP 1 - YOUR DETAILS (2nd Batch Image 3)
             ======================================================================= */}
          {viewState === 'onboarding_step1' && (
            <div className="max-w-md mx-auto w-full space-y-5">
              {renderOnboardingStepper(1)}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={wizardFullName}
                    onChange={(e) => setWizardFullName(e.target.value)}
                    placeholder="e.g. Anabyu"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Age
                  </label>
                  <input
                    type="number"
                    value={wizardAge}
                    onChange={(e) => setWizardAge(e.target.value)}
                    placeholder="Enter your age"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 bg-[#FAF8FF] border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1E1548]">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>+91</span>
                      <ChevronDown className="w-3 h-3 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      value={wizardMobile}
                      onChange={(e) => setWizardMobile(e.target.value)}
                      placeholder="Enter your mobile number"
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Enter your Mail
                  </label>
                  <input
                    type="email"
                    value={wizardMail}
                    onChange={(e) => setWizardMail(e.target.value)}
                    placeholder="Enter your Mail"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setViewState('merchant_access')}
                  className="text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step2')}
                  className="px-7 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 6: ONBOARDING STEP 2 - BUSINESS DETAILS (2nd Batch Image 4)
             ======================================================================= */}
          {viewState === 'onboarding_step2' && (
            <div className="max-w-md mx-auto w-full space-y-5">
              {renderOnboardingStepper(2)}

              <div>
                <h3 className="text-lg font-black text-[#1E1548]">Business Details</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Tell us about your business so we can personalize your experience.
                </p>
              </div>

              <div className="space-y-4">
                {/* Select Business Type (4 Cards) */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-2">
                    Select Business Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'restaurant', label: 'Restaurant', icon: Utensils },
                      { id: 'salon', label: 'Salon', icon: Scissors },
                      { id: 'retail', label: 'Retail / Shopping', icon: ShoppingBag },
                      { id: 'other', label: 'Other', icon: MoreHorizontal }
                    ].map((bt) => {
                      const isSel = wizardBusinessType === bt.id;
                      const IconComp = bt.icon;
                      return (
                        <button
                          key={bt.id}
                          type="button"
                          onClick={() => setWizardBusinessType(bt.id as any)}
                          className={`relative p-3 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
                            isSel
                              ? 'border-2 border-[#5844A8] bg-[#FAF8FF] shadow-2xs'
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          {isSel && (
                            <div className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </div>
                          )}
                          <IconComp className={`w-5 h-5 mb-1.5 ${isSel ? 'text-[#5844A8]' : 'text-gray-500'}`} />
                          <span className={`text-[10px] font-bold leading-tight ${isSel ? 'text-[#5844A8]' : 'text-gray-700'}`}>
                            {bt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Business Category */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Business Category
                  </label>
                  <div className="relative">
                    <select
                      value={wizardBusinessCategory}
                      onChange={(e) => setWizardBusinessCategory(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-8 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer"
                    >
                      <option value="Cafe & Roastery">Cafe, Bakery, Bar, Fast Food</option>
                      <option value="Fine Dining">Fine Dining & Bistro</option>
                      <option value="Quick Service">QSR & Takeaway</option>
                      <option value="Spa & Salon">Wellness, Spa & Salon</option>
                      <option value="Fashion Retail">Apparel & Fashion Retail</option>
                    </select>
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Brief Description */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-[#1E1548]">
                      Brief Description <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {wizardBusinessDesc.length}/200
                    </span>
                  </div>
                  <div className="relative">
                    <textarea
                      maxLength={200}
                      rows={3}
                      value={wizardBusinessDesc}
                      onChange={(e) => setWizardBusinessDesc(e.target.value)}
                      placeholder="Add a short description about your business"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs font-medium text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                    <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
                  </div>
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step1')}
                  className="text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step3')}
                  className="px-7 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 7: ONBOARDING STEP 3 - COMPANY DETAILS (2nd Batch Image 5)
             ======================================================================= */}
          {viewState === 'onboarding_step3' && (
            <div className="max-w-md mx-auto w-full space-y-5">
              {renderOnboardingStepper(3)}

              <div>
                <h3 className="text-lg font-black text-[#1E1548]">Company Details</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Tell us about your company so we can set up your account.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Company Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={wizardCompanyName}
                    onChange={(e) => setWizardCompanyName(e.target.value)}
                    placeholder="e.g. The Coffee House"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    GST Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={15}
                    value={wizardGstNumber}
                    onChange={(e) => setWizardGstNumber(e.target.value.toUpperCase())}
                    placeholder="ENTER 15 DIGIT GST NUMBER"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] uppercase tracking-wider focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Business Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={wizardAddress}
                    onChange={(e) => setWizardAddress(e.target.value)}
                    placeholder="House/Flat No., Building, Street, Area, City, State, Pincode"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step2')}
                  className="text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step4')}
                  className="px-7 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* =======================================================================
              VIEW 8: ONBOARDING STEP 4 - BRANCH DETAILS (3rd Batch Image 1 & 2)
             ======================================================================= */}
          {viewState === 'onboarding_step4' && (
            <div className="max-w-md mx-auto w-full space-y-5">
              {renderOnboardingStepper(4)}

              <div>
                <h3 className="text-lg font-black text-[#1E1548]">Branch Details</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Do you have multiple branches?
                </p>
              </div>

              {/* Multiple Branches Radio Cards (3rd Batch Image 1) */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setWizardHasMultipleBranches('yes')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    wizardHasMultipleBranches === 'yes'
                      ? 'border-2 border-[#5844A8] bg-[#FAF8FF] shadow-2xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        wizardHasMultipleBranches === 'yes' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}
                    >
                      {wizardHasMultipleBranches === 'yes' && (
                        <div className="w-2 h-2 rounded-full bg-[#5844A8]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E1548]">Yes</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">I have multiple branches</div>
                    </div>
                  </div>
                  <div className="text-purple-600 opacity-80 pl-1">
                    <Store className="w-6 h-6" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setWizardHasMultipleBranches('no')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    wizardHasMultipleBranches === 'no'
                      ? 'border-2 border-[#5844A8] bg-[#FAF8FF] shadow-2xs'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                        wizardHasMultipleBranches === 'no' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}
                    >
                      {wizardHasMultipleBranches === 'no' && (
                        <div className="w-2 h-2 rounded-full bg-[#5844A8]" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1E1548]">No</div>
                      <div className="text-[10px] text-gray-400 mt-0.5">I only have one branch</div>
                    </div>
                  </div>
                  <div className="text-gray-300 opacity-80 pl-1">
                    <Store className="w-6 h-6" />
                  </div>
                </button>
              </div>

              {/* Dynamic Branch Configuration List (3rd Batch Image 2) */}
              <div className="space-y-3 pt-2">
                <div>
                  <h4 className="text-xs font-bold text-[#1E1548]">Add Branches</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Add details of your branches to manage them easily.
                  </p>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {wizardBranches.map((br, index) => (
                    <div
                      key={br.id}
                      className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-3.5 space-y-2.5 relative"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E1548]">
                          <Store className="w-3.5 h-3.5 text-[#5844A8]" />
                          <span>Branch {index + 1}</span>
                        </div>
                        {wizardBranches.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveBranch(br.id)}
                            className="text-rose-500 hover:text-rose-700 cursor-pointer p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">
                            Branch Name *
                          </label>
                          <input
                            type="text"
                            value={br.name}
                            onChange={(e) => handleUpdateBranch(br.id, 'name', e.target.value)}
                            placeholder="e.g. Connaught Place"
                            className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">
                            Country *
                          </label>
                          <select
                            value={br.country}
                            onChange={(e) => handleUpdateBranch(br.id, 'country', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          >
                            <option value="India">India</option>
                            <option value="United States">United States</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="UAE">UAE</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">
                            State *
                          </label>
                          <select
                            value={br.state}
                            onChange={(e) => handleUpdateBranch(br.id, 'state', e.target.value)}
                            className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                          >
                            <option value="Delhi">Delhi</option>
                            <option value="Maharashtra">Maharashtra</option>
                            <option value="Karnataka">Karnataka</option>
                            <option value="Tamil Nadu">Tamil Nadu</option>
                            <option value="Gujarat">Gujarat</option>
                            <option value="Punjab">Punjab</option>
                            <option value="Rajasthan">Rajasthan</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Another Branch button */}
                <button
                  type="button"
                  onClick={handleAddBranch}
                  className="w-full py-2.5 border-2 border-dashed border-purple-200 hover:border-[#5844A8] rounded-xl text-xs font-bold text-[#5844A8] flex items-center justify-center gap-1.5 hover:bg-[#FAF8FF] transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Another Branch
                </button>
              </div>

              {/* Bottom Nav */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-50">
                <button
                  type="button"
                  onClick={() => setViewState('onboarding_step3')}
                  className="text-xs font-bold text-gray-500 hover:text-[#1E1548] cursor-pointer"
                >
                  &larr; Back
                </button>
                <button
                  type="button"
                  onClick={completeMerchantLogin}
                  className="px-7 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
