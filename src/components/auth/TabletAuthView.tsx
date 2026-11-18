import React, { useState, useEffect } from 'react';
import {
  User,
  Store,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
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
  Check,
  ChevronDown,
  Eye,
  EyeOff
} from 'lucide-react';
import {
  CustomerYourselfStep,
  CustomerMoreDetailsStep,
  CustomerOnboardingProfile
} from './CustomerOnboardingSteps';

export interface TabletAuthViewProps {
  onLoginSuccess: (role: 'merchant' | 'customer' | string) => void;
  initialRole?: 'role_select' | 'merchant' | 'customer';
}

export const TabletAuthView: React.FC<TabletAuthViewProps> = ({
  onLoginSuccess,
  initialRole = 'role_select',
}) => {
  const [screen, setScreen] = useState<
    | 'role_select'
    | 'merchant_login'
    | 'merchant_otp'
    | 'merchant_password_create'
    | 'onboarding_step1'
    | 'onboarding_step2'
    | 'onboarding_step3'
    | 'onboarding_step4'
    | 'customer_login'
    | 'customer_otp'
    | 'customer_yourself'
    | 'customer_details'
  >(initialRole === 'merchant' ? 'merchant_login' : 'role_select');

  // Login inputs
  const [loginTab, setLoginTab] = useState<'mobile' | 'email'>('mobile');
  const [mobileNumber, setMobileNumber] = useState('98765 43210');
  const [emailAddress, setEmailAddress] = useState('merchant@revia.co');

  // OTP inputs
  const [otpValues, setOtpValues] = useState<string[]>(['4', '8', '2', '7', '6', '1']);
  const [otpTimer, setOtpTimer] = useState<number>(45);

  // Password creation inputs
  const [signupPhone, setSignupPhone] = useState('98765 43210');
  const [password, setPassword] = useState('SecurePass@123');
  const [confirmPassword, setConfirmPassword] = useState('SecurePass@123');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Onboarding Step 1: Your Details
  const [fullName, setFullName] = useState('Anabyu');
  const [age, setAge] = useState('28');
  const [personalPhone, setPersonalPhone] = useState('98765 43210');
  const [personalEmail, setPersonalEmail] = useState('anabyu@revia.co');

  // Onboarding Step 2: Business Details
  const [businessType, setBusinessType] = useState<'restaurant' | 'salon' | 'retail' | 'other'>('restaurant');
  const [businessCategory, setBusinessCategory] = useState('Cafe & Roastery');
  const [businessDesc, setBusinessDesc] = useState('Artisanal specialty coffee roasters and bistro with loyalty rewards.');

  // Onboarding Step 3: Company Details
  const [companyName, setCompanyName] = useState('The Coffee House');
  const [gstNumber, setGstNumber] = useState('07AAAAA0000A1Z5');
  const [businessAddress, setBusinessAddress] = useState('Shop 12, Ground Floor, Inner Circle, Connaught Place, New Delhi, Delhi - 110001');

  // Onboarding Step 4: Branch Details
  const [hasMultipleBranches, setHasMultipleBranches] = useState<'yes' | 'no'>('yes');
  const [sameAsCompany, setSameAsCompany] = useState(true);
  const [branches, setBranches] = useState<Array<{ id: string; name: string; country: string; state: string }>>([
    { id: '1', name: 'Connaught Place', country: 'India', state: 'Delhi' },
  ]);

  // Customer states
  const [customerAuthMode, setCustomerAuthMode] = useState<'login' | 'signup'>('login');
  const [customerLoginTab, setCustomerLoginTab] = useState<'mobile' | 'email'>('mobile');
  const [customerPhone, setCustomerPhone] = useState('98765 43210');
  const [customerEmail, setCustomerEmail] = useState('salena@loyaltics.app');
  const [customerOtpValues, setCustomerOtpValues] = useState<string[]>(['5', '2', '8', '4']);
  const [customerProfile, setCustomerProfile] = useState<CustomerOnboardingProfile>({
    firstName: 'Salena',
    lastName: 'Mishra',
    gender: 'Female',
    dob: '',
    age: '25-34',
    mobile: '98765 43210',
    whatsappSame: true,
    maritalStatus: '',
    anniversaryDate: '',
    partnerName: '',
    partnerMobile: ''
  });

  // Timer countdown
  useEffect(() => {
    if ((screen === 'merchant_otp' || screen === 'customer_otp') && otpTimer > 0) {
      const interval = setInterval(() => setOtpTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [screen, otpTimer]);

  const handleOtpChange = (index: number, val: string) => {
    const char = val.slice(-1);
    const newArr = [...otpValues];
    newArr[index] = char;
    setOtpValues(newArr);

    if (char && index < 5) {
      const next = document.getElementById(`tablet-otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      const prev = document.getElementById(`tablet-otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handleAddBranch = () => {
    setBranches([
      ...branches,
      {
        id: String(Date.now()),
        name: `Branch ${branches.length + 1}`,
        country: 'India',
        state: 'Delhi',
      },
    ]);
  };

  const handleRemoveBranch = (id: string) => {
    if (branches.length > 1) {
      setBranches(branches.filter((b) => b.id !== id));
    }
  };

  const handleCompleteMerchantAuth = () => {
    localStorage.setItem('token', 'mock_merchant_token_' + Date.now());
    localStorage.removeItem('merchant_token');
    localStorage.setItem(
      'user',
      JSON.stringify({
        id: 'merchant_admin_1',
        name: fullName || 'Elena Rostova',
        email: emailAddress || personalEmail || 'merchant@revia.co',
        role: 'merchant',
        businessName: companyName || 'Revia Café & Roastery',
      })
    );
    localStorage.removeItem('customer');
    localStorage.removeItem('customer_token');
    onLoginSuccess('merchant');
  };

  const handleCompleteCustomerAuth = () => {
    localStorage.setItem('customer_token', 'mock_customer_token_' + Date.now());
    localStorage.setItem(
      'customer',
      JSON.stringify({
        id: 'cust_001',
        name: 'Aarav Sharma',
        phone: customerPhone,
        tier: 'Gold',
        points: 450,
      })
    );
    onLoginSuccess('customer');
  };

  // Password requirement checks
  const passLength = password.length >= 8;
  const passUpper = /[A-Z]/.test(password);
  const passNum = /[0-9]/.test(password);
  const passSpec = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // Stepper indicator for onboarding steps 1 to 4
  const renderStepper = (activeStep: 1 | 2 | 3 | 4) => {
    const steps = [
      { id: 1, label: 'Your Details' },
      { id: 2, label: 'Business Details' },
      { id: 3, label: 'Company Details' },
      { id: 4, label: 'Branch Details' },
    ];

    return (
      <div className="w-full pb-3 pt-0">
        <div className="flex items-center justify-between relative max-w-md mx-auto">
          {/* Background track line */}
          <div className="absolute top-3.5 left-5 right-5 h-[2px] bg-gray-200 -z-0" />
          {/* Active progress track */}
          <div
            className="absolute top-3.5 left-5 h-[2px] bg-[#5844A8] -z-0 transition-all duration-300"
            style={{
              width:
                activeStep === 1
                  ? '0%'
                  : activeStep === 2
                  ? '33%'
                  : activeStep === 3
                  ? '66%'
                  : '96%',
            }}
          />

          {steps.map((st) => {
            const isCompleted = activeStep > st.id;
            const isCurrent = activeStep === st.id;

            return (
              <div key={st.id} className="flex flex-col items-center z-10">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${
                    isCompleted
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : isCurrent
                      ? 'bg-[#5844A8] text-white ring-4 ring-purple-100 shadow-xs'
                      : 'bg-white text-gray-400 border border-gray-200'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.id}
                </div>
                <span
                  className={`text-[10px] font-medium mt-1 transition-colors whitespace-nowrap ${
                    isCurrent ? 'text-gray-900 font-semibold' : 'text-gray-400'
                  }`}
                >
                  {st.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const isWomanIllustration = screen === 'merchant_login' || screen === 'merchant_otp';

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#FDF8FD] to-[#F5EEFB] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-10 font-sans antialiased text-[#1E1548]">
      {/* Centered Tablet & Desktop Card */}
      <div className="w-full max-w-5xl lg:max-w-6xl bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_15px_40px_rgba(88,68,168,0.08)] border border-[#EDE8FD] flex flex-col md:flex-row md:min-h-[580px] md:max-h-[820px] md:h-[86vh] lg:h-[88vh] lg:max-h-[720px] lg:min-h-[600px] overflow-hidden transition-all">
        
        {/* =====================================================================
            LEFT COLUMN: BRAND, HEADLINE & DYNAMIC ILLUSTRATION
           ===================================================================== */}
        <div className="w-full md:w-5/12 lg:w-5/12 bg-white p-6 sm:p-7 md:p-8 lg:p-9 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EDE8FD] relative select-none h-auto md:h-full shrink-0 overflow-hidden">
          {/* Top Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5844A8] to-[#E11D48] flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-3.5 h-3.5 fill-white" />
            </div>
            <div>
              <span className="text-base font-black text-[#1E1548] leading-none tracking-tight block">Loyaltics</span>
              <span className="text-[7.5px] font-bold text-gray-400 tracking-widest uppercase block mt-0.5">
                EARN • REDEEM • GROW
              </span>
            </div>
          </div>

          {/* Typography Hero */}
          <div className="my-auto py-3 lg:py-4">
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold text-[#1E1548] leading-[1.14] tracking-tight">
              Stronger <br />
              Customer <br />
              Relationships <br />
              <span className="text-[#EE4370]">Start Here</span>
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-500 font-normal leading-relaxed mt-3 max-w-xs">
              Build loyalty, boost sales and create lasting connections with your customers through rewards and offers.
            </p>
          </div>

          {/* Bottom Illustration */}
          <div className="flex justify-center items-end shrink-0 pt-2">
            {isWomanIllustration ? (
              <img
                src="/assets/login/woman-laptop.png"
                alt="Merchant working happily"
                className="max-h-36 sm:max-h-40 md:max-h-44 lg:max-h-48 object-contain select-none"
              />
            ) : (
              <img
                src="/assets/login/card-stack-hero.png"
                alt="Loyalty cards stack"
                className="max-h-32 sm:max-h-36 md:max-h-40 lg:max-h-44 object-contain select-none"
              />
            )}
          </div>
        </div>

        {/* =====================================================================
            RIGHT COLUMN: ACTIVE FORM VIEW (Scrollable internally if fields overflow)
           ===================================================================== */}
        <div className="w-full md:w-7/12 lg:w-7/12 p-6 sm:p-7 md:p-8 lg:p-10 flex flex-col justify-between bg-white relative overflow-y-auto h-full max-h-[85vh] lg:max-h-full">
          
          {/* ─────────────────────────────────────────────────────────────
              VIEW 1: ROLE SELECTION (Are you a customer or a merchant?)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'role_select' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-2 my-auto">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E1548] tracking-tight leading-tight">
                  Are you a customer <br />
                  or a merchant?
                </h2>
                <p className="text-xs sm:text-[13px] text-gray-500 mt-1 font-medium">Choose how you&apos;d like to continue</p>

                <div className="mt-5 sm:mt-6 space-y-3.5 sm:space-y-4">
                  {/* Option 1: Customer */}
                  <button
                    type="button"
                    onClick={() => setScreen('customer_login')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-white border border-gray-200 hover:border-pink-300 hover:shadow-xs transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-rose-600 transition-colors">
                          I&apos;m a Customer
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 font-normal">
                          Discover offers, earn rewards and enjoy exclusive benefits.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>

                  {/* Option 2: Merchant */}
                  <button
                    type="button"
                    onClick={() => setScreen('merchant_login')}
                    className="w-full p-4 sm:p-5 rounded-2xl bg-white border-2 border-[#5844A8] shadow-xs hover:shadow-md transition-all flex items-center justify-between group cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0">
                        <Store className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                          I&apos;m a Merchant
                        </h3>
                        <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5 font-normal">
                          Manage your loyalty programs, create campaigns and grow your business.
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#5844A8] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                </div>
              </div>

              <div className="text-center text-[11px] text-gray-400 pt-5 sm:pt-6">
                Powered by <span className="font-bold text-gray-700">Analytix Data</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 2: MERCHANT LOGIN (sign up.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'merchant_login' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-1 my-auto">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('role_select')}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-medium mb-3 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </button>

                <div className="text-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1548]">
                    Welcome <span className="text-[#5844A8]">Back!</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    Enter your mobile number or email to get OTP and continue.
                  </p>
                </div>

                {/* Segmented Tab Pill */}
                <div className="p-1 rounded-xl bg-gray-100/80 flex items-center mb-4 max-w-xs mx-auto">
                  <button
                    type="button"
                    onClick={() => setLoginTab('mobile')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      loginTab === 'mobile'
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Mobile No
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginTab('email')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      loginTab === 'email'
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Email
                  </button>
                </div>

                {/* Input Field */}
                <div className="space-y-3">
                  {loginTab === 'mobile' ? (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Enter mobile number
                      </label>
                      <div className="flex items-center h-11 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 pr-2 border-r border-gray-200 select-none">
                          <Phone className="w-3.5 h-3.5 text-gray-400 mr-1" />
                          <span>+91</span>
                          <ChevronDown className="w-3 h-3 text-gray-400" />
                        </div>
                        <input
                          type="tel"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="Enter mobile number"
                          className="flex-1 pl-3 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Enter email address
                      </label>
                      <div className="flex items-center h-11 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                        <Mail className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                        <input
                          type="email"
                          value={emailAddress}
                          onChange={(e) => setEmailAddress(e.target.value)}
                          placeholder="merchant@example.com"
                          className="flex-1 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setOtpTimer(45);
                      setScreen('merchant_otp');
                    }}
                    className="w-full h-11 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer"
                  >
                    Get OTP
                  </button>

                  {/* Sign Up Link */}
                  <div className="text-center text-xs text-gray-500 pt-1">
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => setScreen('merchant_password_create')}
                      className="font-bold text-[#5844A8] hover:underline cursor-pointer"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-gray-400 pt-4">
                Powered by <span className="font-bold text-gray-700">Analytix Data</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 3: MERCHANT OTP VERIFICATION (sign up-1.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'merchant_otp' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-1 my-auto">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('merchant_login')}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-medium mb-3 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to login</span>
                </button>

                <div className="text-center mb-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1548]">
                    Verify Your <span className="text-[#5844A8]">Account</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    We&apos;ve sent a 6 digit OTP to{' '}
                    <span className="font-bold text-gray-800">
                      {loginTab === 'mobile' ? `+91 ${mobileNumber}` : emailAddress}
                    </span>
                  </p>
                </div>

                {/* 6 OTP Boxes */}
                <div className="flex items-center justify-center gap-2 sm:gap-2.5 mb-3">
                  {otpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`tablet-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-10 h-11 sm:w-11 sm:h-12 rounded-xl border border-gray-200 text-center font-bold text-base sm:text-lg text-gray-800 bg-white focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  ))}
                </div>

                {/* Resend Timer */}
                <div className="text-center text-xs text-gray-500 mb-4">
                  Didn&apos;t receive the code?{' '}
                  <span className="font-semibold text-[#EE4370]">
                    Resend OTP in 00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
                  </span>
                </div>

                {/* OR Divider */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="border-t border-gray-200 w-full" />
                  <span className="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider absolute">
                    OR
                  </span>
                </div>

                {/* Alternative Verification Options */}
                <div className="grid grid-cols-2 gap-2.5 mb-4">
                  <button
                    type="button"
                    onClick={() => setLoginTab('email')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 bg-white cursor-pointer transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-gray-500" />
                    <span>Verify via Email</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginTab('mobile')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl border border-gray-200 hover:border-gray-300 text-xs font-semibold text-gray-700 bg-white cursor-pointer transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-gray-500" />
                    <span>Verify via Phone</span>
                  </button>
                </div>

                {/* Next Button */}
                <button
                  type="button"
                  onClick={handleCompleteMerchantAuth}
                  className="w-full h-11 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-center text-[11px] text-gray-400 pt-4">
                Powered by <span className="font-bold text-gray-700">Analytix Data</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 4: CREATE PASSWORD / SIGN UP (Password create.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'merchant_password_create' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-1 my-auto">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('merchant_login')}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 font-medium mb-3 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="mb-3">
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1E1548]">Merchant Access</h2>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    Complete your account details to get started.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center h-10 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 pr-2 border-r border-gray-200 select-none">
                        <span className="text-sm">🇮🇳</span>
                        <span>+91</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value)}
                        placeholder="Enter mobile number"
                        className="flex-1 pl-3 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Create Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Create Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center h-10 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="flex-1 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Password Checklist Card */}
                  <div className="p-2.5 rounded-xl bg-[#F7F4FD] border border-[#EDE8FD] space-y-1 text-[11px] text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          passLength ? 'bg-emerald-500 text-white' : 'bg-purple-200 text-purple-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={passLength ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                        At least 8 characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          passUpper ? 'bg-emerald-500 text-white' : 'bg-purple-200 text-purple-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={passUpper ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                        1 uppercase letter (A–Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          passNum ? 'bg-emerald-500 text-white' : 'bg-purple-200 text-purple-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={passNum ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                        1 number (0–9)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          passSpec ? 'bg-emerald-500 text-white' : 'bg-purple-200 text-purple-700'
                        }`}
                      >
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span className={passSpec ? 'text-gray-800 font-medium' : 'text-gray-500'}>
                        1 special character (e.g. ! @ # $ %)
                      </span>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Confirm Password <span className="text-rose-500">*</span>
                    </label>
                    <div className="flex items-center h-10 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
                        className="flex-1 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-600 p-1 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="button"
                    onClick={() => setScreen('onboarding_step1')}
                    className="w-full h-11 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs sm:text-sm transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                  >
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 5: ONBOARDING STEP 1 - YOUR DETAILS (basic detsil.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'onboarding_step1' && (
            <div className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full py-1">
              <div>
                {renderStepper(1)}

                <div className="space-y-2.5 pt-1">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Anabyu"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="Enter your age"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Mobile Number
                    </label>
                    <div className="flex items-center h-10 px-3 rounded-xl border border-gray-200 bg-white focus-within:border-[#5844A8] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700 pr-2 border-r border-gray-200 select-none">
                        <Phone className="w-3.5 h-3.5 text-purple-600 mr-1" />
                        <span>+91</span>
                        <ChevronDown className="w-3 h-3 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        value={personalPhone}
                        onChange={(e) => setPersonalPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="flex-1 pl-3 text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 bg-transparent outline-none"
                      />
                    </div>
                  </div>

                  {/* Enter your Mail */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Enter your Mail
                    </label>
                    <input
                      type="email"
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="Enter your Mail"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs sm:text-sm text-gray-900 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <button
                  type="button"
                  onClick={() => setScreen('merchant_password_create')}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step2')}
                  className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 6: ONBOARDING STEP 2 - BUSINESS DETAILS (Business Details.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'onboarding_step2' && (
            <div className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full py-1">
              <div>
                {renderStepper(2)}

                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E1548]">Business Details</h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Tell us about your business so we can personalize your experience.
                  </p>
                </div>

                {/* Select Business Type (4 Cards) */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Select Business Type <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {/* Restaurant */}
                    <button
                      type="button"
                      onClick={() => setBusinessType('restaurant')}
                      className={`relative p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[68px] ${
                        businessType === 'restaurant'
                          ? 'border-2 border-[#5844A8] bg-[#F8F5FE] text-[#5844A8] shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {businessType === 'restaurant' && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                      <Utensils className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-semibold leading-tight">Restaurant</span>
                    </button>

                    {/* Salon */}
                    <button
                      type="button"
                      onClick={() => setBusinessType('salon')}
                      className={`relative p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[68px] ${
                        businessType === 'salon'
                          ? 'border-2 border-[#5844A8] bg-[#F8F5FE] text-[#5844A8] shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {businessType === 'salon' && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                      <Scissors className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-semibold leading-tight">Salon</span>
                    </button>

                    {/* Retail / Shopping */}
                    <button
                      type="button"
                      onClick={() => setBusinessType('retail')}
                      className={`relative p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[68px] ${
                        businessType === 'retail'
                          ? 'border-2 border-[#5844A8] bg-[#F8F5FE] text-[#5844A8] shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {businessType === 'retail' && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                      <ShoppingBag className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-semibold leading-tight">Retail / Shopping</span>
                    </button>

                    {/* Other */}
                    <button
                      type="button"
                      onClick={() => setBusinessType('other')}
                      className={`relative p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[68px] ${
                        businessType === 'other'
                          ? 'border-2 border-[#5844A8] bg-[#F8F5FE] text-[#5844A8] shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {businessType === 'other' && (
                        <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                          <Check className="w-2 h-2 stroke-[3]" />
                        </div>
                      )}
                      <MoreHorizontal className="w-4 h-4 mb-0.5" />
                      <span className="text-[10px] font-semibold leading-tight">Other</span>
                    </button>
                  </div>
                </div>

                {/* Business Category */}
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Business Category
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Tag className="w-3.5 h-3.5" />
                    </div>
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className="w-full h-10 pl-8 pr-7 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 font-medium focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none appearance-none transition-all cursor-pointer"
                    >
                      <option value="Cafe, Bakery, Bar, Fast Food">Cafe, Bakery, Bar, Fast Food</option>
                      <option value="Cafe & Roastery">Cafe &amp; Roastery</option>
                      <option value="Fine Dining Bistro">Fine Dining Bistro</option>
                      <option value="Casual Eatery & Pizzeria">Casual Eatery &amp; Pizzeria</option>
                      <option value="Hair & Beauty Lounge">Hair &amp; Beauty Lounge</option>
                      <option value="Fashion & Apparel Boutique">Fashion &amp; Apparel Boutique</option>
                      <option value="General Retail">General Retail</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Brief Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">
                      Brief Description <span className="text-gray-400 font-normal">(Optional)</span>
                    </label>
                  </div>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5 pointer-events-none" />
                    <textarea
                      rows={2}
                      maxLength={200}
                      value={businessDesc}
                      onChange={(e) => setBusinessDesc(e.target.value)}
                      placeholder="Add a short description about your business"
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                    />
                    <div className="text-right text-[10px] text-gray-400 pr-1 font-mono">
                      {businessDesc.length}/200
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step1')}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step3')}
                  className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 7: ONBOARDING STEP 3 - COMPANY DETAILS (company details.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'onboarding_step3' && (
            <div className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full py-1">
              <div>
                {renderStepper(3)}

                <div className="mb-3">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E1548]">Company Details</h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Tell us about your company so we can set up your account.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {/* Company Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Company Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. The Coffee House"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs text-gray-900 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>

                  {/* GST Number */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      GST Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={15}
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                      placeholder="ENTER 15 DIGIT GST NUMBER"
                      className="w-full h-10 px-3 rounded-xl border border-gray-200 bg-white text-xs font-mono font-semibold uppercase text-gray-900 placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>

                  {/* Business Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Business Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      rows={2.5}
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      placeholder="House/Flat No., Building, Street, Area, City, State, Pincode"
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-xs text-gray-800 font-medium placeholder-gray-400 focus:border-[#5844A8] focus:ring-2 focus:ring-purple-100 outline-none transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step2')}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step4')}
                  className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 8: ONBOARDING STEP 4 - BRANCH DETAILS (Branch Details.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'onboarding_step4' && (
            <div className="flex-1 flex flex-col justify-between max-w-lg mx-auto w-full py-1">
              <div>
                {renderStepper(4)}

                <div className="mb-2">
                  <h2 className="text-lg sm:text-xl font-bold text-[#1E1548]">Branch Details</h2>
                  <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">Do you have multiple branches?</p>
                </div>

                {/* Yes / No Cards */}
                <div className="grid grid-cols-2 gap-2 mb-2.5">
                  {/* Yes Option */}
                  <button
                    type="button"
                    onClick={() => setHasMultipleBranches('yes')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                      hasMultipleBranches === 'yes'
                        ? 'border-2 border-[#5844A8] bg-[#FAF8FF] shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          hasMultipleBranches === 'yes'
                            ? 'border-[#5844A8] bg-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {hasMultipleBranches === 'yes' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">Yes</div>
                        <div className="text-[9.5px] text-gray-400">I have multiple branches</div>
                      </div>
                    </div>
                    <img
                      src="/assets/login/cafe-branch.png"
                      alt="Branches"
                      className="w-10 h-7 object-contain shrink-0"
                    />
                  </button>

                  {/* No Option */}
                  <button
                    type="button"
                    onClick={() => setHasMultipleBranches('no')}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-left ${
                      hasMultipleBranches === 'no'
                        ? 'border-2 border-[#5844A8] bg-[#FAF8FF] shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          hasMultipleBranches === 'no'
                            ? 'border-[#5844A8] bg-white'
                            : 'border-gray-300'
                        }`}
                      >
                        {hasMultipleBranches === 'no' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-gray-900">No</div>
                        <div className="text-[9.5px] text-gray-400">I only have one branch</div>
                      </div>
                    </div>
                    <img
                      src="/assets/login/cafe-branch.png"
                      alt="Single Store"
                      className="w-10 h-7 object-contain opacity-60 shrink-0"
                    />
                  </button>
                </div>

                {/* When Yes: Add Branches */}
                {hasMultipleBranches === 'yes' && (
                  <div>
                    <div className="mb-2">
                      <h3 className="text-xs font-bold text-[#1E1548]">Add Branches</h3>
                      <p className="text-[10px] text-gray-400">
                        Add details of your branches to manage them easily.
                      </p>
                    </div>

                    <div className="max-h-[160px] sm:max-h-[180px] overflow-y-auto space-y-2 mb-2 pr-1">
                      {branches.map((br, index) => (
                        <div
                          key={br.id}
                          className="p-2.5 rounded-xl border border-gray-200 bg-white shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800">
                              <Store className="w-3.5 h-3.5 text-[#5844A8]" />
                              <span>Branch {index + 1}</span>
                            </div>
                            {branches.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveBranch(br.id)}
                                className="text-gray-400 hover:text-rose-500 cursor-pointer p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-left">
                            <div>
                              <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                Branch Name <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="text"
                                value={br.name}
                                onChange={(e) => {
                                  const updated = [...branches];
                                  updated[index].name = e.target.value;
                                  setBranches(updated);
                                }}
                                placeholder="e.g. Connaught Place"
                                className="w-full h-8 px-2 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 font-medium placeholder-gray-400 focus:border-[#5844A8] outline-none"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                Country <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <select
                                  value={br.country}
                                  onChange={(e) => {
                                    const updated = [...branches];
                                    updated[index].country = e.target.value;
                                    setBranches(updated);
                                  }}
                                  className="w-full h-8 pl-2 pr-5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 font-medium focus:border-[#5844A8] outline-none appearance-none cursor-pointer"
                                >
                                  <option value="India">India</option>
                                  <option value="UAE">UAE</option>
                                  <option value="USA">USA</option>
                                  <option value="UK">UK</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-2.5 pointer-events-none" />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-semibold text-gray-600 mb-0.5">
                                State <span className="text-rose-500">*</span>
                              </label>
                              <div className="relative">
                                <select
                                  value={br.state}
                                  onChange={(e) => {
                                    const updated = [...branches];
                                    updated[index].state = e.target.value;
                                    setBranches(updated);
                                  }}
                                  className="w-full h-8 pl-2 pr-5 rounded-lg border border-gray-200 bg-white text-xs text-gray-800 font-medium focus:border-[#5844A8] outline-none appearance-none cursor-pointer"
                                >
                                  <option value="Delhi">Delhi</option>
                                  <option value="Maharashtra">Maharashtra</option>
                                  <option value="Karnataka">Karnataka</option>
                                  <option value="Tamil Nadu">Tamil Nadu</option>
                                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                                </select>
                                <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1.5 top-2.5 pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Same as Company address checkbox */}
                    <label className="flex items-center gap-1.5 cursor-pointer mb-2 select-none">
                      <input
                        type="checkbox"
                        checked={sameAsCompany}
                        onChange={(e) => setSameAsCompany(e.target.checked)}
                        className="rounded border-gray-300 text-[#5844A8] focus:ring-[#5844A8] w-3.5 h-3.5 cursor-pointer"
                      />
                      <span className="text-xs font-semibold text-gray-700">
                        Same as Company address
                      </span>
                    </label>

                    {/* Add Another Branch button */}
                    <button
                      type="button"
                      onClick={handleAddBranch}
                      className="w-full py-2 rounded-xl border-2 border-dashed border-[#5844A8]/40 hover:border-[#5844A8] bg-[#FAF8FF] hover:bg-[#F4EFFE] text-xs font-bold text-[#5844A8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Another Branch</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom Nav Bar */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-3">
                <button
                  type="button"
                  onClick={() => setScreen('onboarding_step3')}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 cursor-pointer flex items-center gap-1.5 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleCompleteMerchantAuth}
                  className="px-5 py-2 rounded-xl bg-[#5844A8] hover:bg-[#483690] text-white font-semibold text-xs transition-all shadow-md shadow-purple-500/20 active:scale-[0.99] cursor-pointer flex items-center gap-1.5"
                >
                  <span>Create Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 9: CUSTOMER LOGIN & SIGN UP (Login screen.png & -1.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'customer_login' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-1 my-auto">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('role_select')}
                  className="flex items-center gap-1.5 text-xs text-[#7B748C] hover:text-[#1E1548] font-bold mb-4 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Role</span>
                </button>

                <div className="mb-5">
                  <h2 className="text-2xl sm:text-[26px] font-black text-[#240B4C] tracking-tight">
                    {customerAuthMode === 'login' ? 'Welcome Back!' : 'Welcome to Loyaltics!'}
                  </h2>
                  <p className="text-xs text-[#6B657E] mt-1 font-medium leading-relaxed">
                    {customerAuthMode === 'login'
                      ? 'Enter your mobile number or email to get OTP and continue'
                      : 'Enter your mobile number or email to get OTP and start earning rewards!'}
                  </p>
                </div>

                {/* Mobile Number | Email Segmented Pill */}
                <div className="bg-[#F2ECF9] p-1 rounded-2xl flex items-center mb-4 border border-[#E8DFF6]">
                  <button
                    type="button"
                    onClick={() => setCustomerLoginTab('mobile')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      customerLoginTab === 'mobile'
                        ? 'bg-[#E5D7FA] text-[#240B4C] shadow-2xs'
                        : 'text-[#7B748C] hover:text-[#1E1548]'
                    }`}
                  >
                    Mobile Number
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerLoginTab('email')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      customerLoginTab === 'email'
                        ? 'bg-[#E5D7FA] text-[#240B4C] shadow-2xs'
                        : 'text-[#7B748C] hover:text-[#1E1548]'
                    }`}
                  >
                    Email
                  </button>
                </div>

                <div className="space-y-4">
                  {customerLoginTab === 'mobile' ? (
                    <div className="flex items-center h-12 px-3.5 rounded-2xl border border-[#E5DEF5] bg-white focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <div className="flex items-center gap-1 text-xs font-black text-[#1E1548] pr-2.5 border-r border-[#EAE2FB] select-none">
                        <span>+91</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                      </div>
                      <input
                        type="tel"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="Enter your mobile number"
                        className="flex-1 pl-3 text-xs sm:text-sm text-[#1E1548] font-semibold placeholder-[#9890A8] bg-transparent outline-none"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center h-12 px-3.5 rounded-2xl border border-[#E5DEF5] bg-white focus-within:border-[#240B4C] focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                      <Mail className="w-4 h-4 text-[#8C84A0] mr-2.5 shrink-0" />
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="flex-1 text-xs sm:text-sm text-[#1E1548] font-semibold placeholder-[#9890A8] bg-transparent outline-none"
                      />
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setOtpTimer(45);
                      setScreen('customer_otp');
                    }}
                    className="w-full h-12 rounded-2xl bg-[#240B4C] hover:bg-[#321266] text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-purple-950/20 active:scale-[0.99] cursor-pointer"
                  >
                    Get OTP
                  </button>

                  <div className="text-center text-xs text-[#7B748C] pt-1">
                    {customerAuthMode === 'login' ? (
                      <>
                        New here?{' '}
                        <button
                          type="button"
                          onClick={() => setCustomerAuthMode('signup')}
                          className="font-black text-[#240B4C] hover:underline cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          type="button"
                          onClick={() => setCustomerAuthMode('login')}
                          className="font-black text-[#240B4C] hover:underline cursor-pointer"
                        >
                          Login
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center text-[11px] text-[#8C84A0] pt-4">
                Powered by <span className="font-bold text-[#1E1548]">Analytix Data</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 10: CUSTOMER OTP (For customer role)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'customer_otp' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-1 my-auto">
              <div>
                <button
                  type="button"
                  onClick={() => setScreen('customer_login')}
                  className="flex items-center gap-1.5 text-xs text-[#7B748C] hover:text-[#1E1548] font-bold mb-4 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>

                <div className="mb-5">
                  <h2 className="text-2xl font-black text-[#240B4C]">Verify OTP</h2>
                  <p className="text-xs text-[#6B657E] mt-1 font-medium">
                    We&apos;ve sent a 4-digit code to{' '}
                    <span className="font-bold text-[#1E1548]">
                      {customerLoginTab === 'mobile' ? `+91 ${customerPhone}` : customerEmail}
                    </span>
                  </p>
                </div>

                <div className="flex items-center justify-center gap-3 mb-4">
                  {customerOtpValues.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`tablet-cust-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newArr = [...customerOtpValues];
                        newArr[idx] = e.target.value.replace(/\D/g, '').slice(-1);
                        setCustomerOtpValues(newArr);
                        if (newArr[idx] && idx < 3) {
                          document.getElementById(`tablet-cust-otp-${idx + 1}`)?.focus();
                        }
                      }}
                      className="w-12 h-12 rounded-2xl border border-[#E5DEF5] text-center font-black text-lg text-[#1E1548] bg-white focus:border-[#240B4C] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (customerAuthMode === 'signup') {
                      setCustomerProfile((prev) => ({ ...prev, mobile: customerPhone }));
                      setScreen('customer_yourself');
                      return;
                    }
                    handleCompleteCustomerAuth();
                  }}
                  className="w-full h-12 rounded-2xl bg-[#240B4C] hover:bg-[#321266] text-white font-black text-xs sm:text-sm transition-all shadow-lg shadow-purple-950/20 active:scale-[0.99] cursor-pointer mt-2"
                >
                  Verify &amp; Continue
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCustomerProfile((prev) => ({ ...prev, mobile: customerPhone }));
                    setScreen('customer_yourself');
                  }}
                  className="w-full mt-2.5 py-2 text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                >
                  Personalise my profile first &rarr;
                </button>

                <div className="text-center mt-4 text-xs text-[#7B748C]">
                  {otpTimer > 0 ? (
                    <span>
                      Resend OTP in <strong className="text-[#240B4C]">00:{String(otpTimer).padStart(2, '0')}</strong>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setOtpTimer(45)}
                      className="font-black text-[#240B4C] hover:underline cursor-pointer"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <div className="text-center text-[11px] text-[#8C84A0] pt-4">
                Powered by <span className="font-bold text-[#1E1548]">Analytix Data</span>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 11: CUSTOMER ONBOARDING STEP 1 (Yourself.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'customer_yourself' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-2">
              <CustomerYourselfStep
                profile={customerProfile}
                onChange={setCustomerProfile}
                onBack={() => setScreen('customer_otp')}
                onNext={() => setScreen('customer_details')}
              />
            </div>
          )}

          {/* ─────────────────────────────────────────────────────────────
              VIEW 12: CUSTOMER ONBOARDING STEP 2 (Details.png)
             ───────────────────────────────────────────────────────────── */}
          {screen === 'customer_details' && (
            <div className="flex-1 flex flex-col justify-between max-w-md mx-auto w-full py-2">
              <CustomerMoreDetailsStep
                profile={customerProfile}
                onChange={setCustomerProfile}
                onBack={() => setScreen('customer_yourself')}
                onSkip={handleCompleteCustomerAuth}
                onComplete={handleCompleteCustomerAuth}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
