import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageSquare, Phone, Lock, Sparkles, ArrowRight, CheckCircle2, Store, Award, BarChart2 } from 'lucide-react';
import { PrimaryButton, LiveBadge } from '../components/common/Badges';

interface LoginPageProps {
  onLoginSuccess: (role: 'merchant' | 'customer' | string) => void;
  onGoToOnboarding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onGoToOnboarding }) => {
  const [authMethod, setAuthMethod] = useState<'sms' | 'whatsapp'>('sms');
  const [countryCode, setCountryCode] = useState('+91');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState(['4', '8', '2', '', '', '']);
  const [step, setStep] = useState<'input' | 'verify'>('input');
  const [timeLeft, setTimeLeft] = useState(105); // 01:45
  const [verifyMode, setVerifyMode] = useState<'otp' | 'password'>('otp');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (step === 'verify' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePinChange = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newPin = [...pin];
    newPin[index] = val;
    setPin(newPin);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="h-screen w-screen flex select-none overflow-hidden">
      {/* Left Side: Brand & Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A1615] to-[#2D2624] flex-col justify-between p-8 relative overflow-hidden h-full">
        {/* Abstract Background Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-[#D4A753] opacity-10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-[#9E782F] opacity-10 rounded-full blur-[100px]" />

        {/* Brand Header */}
        <button
          onClick={() => onLoginSuccess('/')}
          className="flex items-center gap-4 relative z-10 text-left hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-[#D4A753] to-[#9E782F] text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white m-0">REVIA</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#9E9A93] font-semibold mt-0.5 mb-0">
              Unified Commerce Ecosystem
            </p>
          </div>
        </button>

        {/* Value Proposition & Visuals */}
        <div className="relative z-10 w-full max-w-2xl mt-6 lg:pr-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            Unified commerce for modern businesses.
          </h2>
          <p className="text-[#9E9A93] text-sm leading-relaxed mb-6">
            Seamlessly manage your operations, deploy dynamic loyalty programs, and gain real-time insights with an industry-leading unified ecosystem.
          </p>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-4 mt-6 w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#D4A753]/20 flex items-center justify-center mb-3">
                <Store className="w-4 h-4 text-[#D4A753]" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">Multi-Outlet</h3>
              <p className="text-[#9E9A93] text-[11px] leading-relaxed">Centralized control for all your branch locations.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-[#0D7A53]/20 flex items-center justify-center mb-3">
                <Award className="w-4 h-4 text-[#4ADE80]" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">Loyalty Engine</h3>
              <p className="text-[#9E9A93] text-[11px] leading-relaxed">Built-in rewards & campaigns to drive retention.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center mb-3">
                <BarChart2 className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">Live Analytics</h3>
              <p className="text-[#9E9A93] text-[11px] leading-relaxed">Real-time insights and comprehensive reporting.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                <ShieldCheck className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-white text-sm font-bold mb-1">Enterprise Security</h3>
              <p className="text-[#9E9A93] text-[11px] leading-relaxed">Bank-grade encryption, SOC-2, and RBAC.</p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 text-xs text-[#6E6A66] space-y-1">
          <p>© {new Date().getFullYear()} Revia Unified Commerce. All rights reserved.</p>
          <p className="text-[10px]">Need help? Contact support or visit our help center.</p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full lg:w-1/2 bg-[#FAF8F5] flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative h-full overflow-y-auto">
        {/* Mobile Brand Header (Hidden on Desktop) */}
        <button
          onClick={() => onLoginSuccess('/')}
          className="flex lg:hidden items-center justify-center gap-4 mb-6 text-left hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-none p-0"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-b from-[#D4A753] to-[#9E782F] text-white shadow-md shrink-0">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1615] m-0">REVIA</h1>
            <p className="text-[10px] uppercase tracking-widest text-[#9E9A93] font-semibold mt-0.5 mb-0">
              Unified Commerce Ecosystem
            </p>
          </div>
        </button>

        {/* Floating Center Auth Card */}
        <div className="w-full max-w-md bg-white border border-[#E5E0D8] rounded-2xl shadow-xl p-6 relative">
          <div className="flex items-center justify-between mb-5">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">SECURE AUTH GATEWAY</span>
              <h2 className="text-lg font-bold text-[#1A1615] tracking-tight">Sign in to Revia</h2>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#0D7A53] bg-[#E6F4ED] px-2 py-0.5 rounded-full border border-[#BCE3D1]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]" /> SECURE
            </span>
          </div>

          {/* Tab switchers: SMS OTP vs WhatsApp OTP */}
          <div className="grid grid-cols-2 p-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl mb-6">
            <button
              type="button"
              onClick={() => setAuthMethod('sms')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${authMethod === 'sms'
                ? 'bg-white text-[#1A1615] shadow-xs'
                : 'text-[#6E6A66] hover:text-[#1A1615]'
                }`}
            >
              <Phone className="w-3.5 h-3.5 text-[#9E782F]" />
              <span>SMS OTP</span>
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod('whatsapp')}
              className={`py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${authMethod === 'whatsapp'
                ? 'bg-white text-[#1A1615] shadow-xs'
                : 'text-[#6E6A66] hover:text-[#1A1615]'
                }`}
            >
              <MessageSquare className="w-3.5 h-3.5 text-[#0D7A53]" />
              <span>WhatsApp</span>
              <span className="bg-[#E6F4ED] text-[#0D7A53] border border-[#BCE3D1] text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                INSTANT
              </span>
            </button>
          </div>

          {step === 'input' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-1.5">
                  Phone Number or Email
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    aria-label="Country Dialing Code"
                    className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-2.5 py-2.5 text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#D4A753] cursor-pointer"
                  >
                    <option value="+91">IN +91</option>
                    <option value="+1">US +1</option>
                    <option value="+44">UK +44</option>
                    <option value="+61">AU +61</option>
                    <option value="+81">JP +81</option>
                    <option value="+49">DE +49</option>
                  </select>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter registered mobile number or email"
                    className="flex-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]"
                  />
                </div>
                <p className="text-[10px] text-[#9E9A93] mt-1.5">
                  Operator credentials provisioned by Central IT / General Management.
                </p>
              </div>

              <PrimaryButton
                type="button"
                onClick={() => setStep('verify')}
                className="w-full py-2.5 text-sm mt-2"
              >
                Send Verification Code →
              </PrimaryButton>
            </div>
          ) : (
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66]">
                    {verifyMode === 'otp' ? 'Enter 6-Digit Verification PIN' : 'Enter Password'}
                  </label>
                  {verifyMode === 'otp' && (
                    <span className="text-[11px] font-mono font-semibold text-[#9E782F]">
                      Expires in {formatTimer(timeLeft)}
                    </span>
                  )}
                </div>
                
                {verifyMode === 'otp' && (
                  <p className="text-[11px] text-[#6E6A66] mb-3">
                    <span>{phone.includes('@') ? phone : `Sent to ${countryCode} ${phone}`}</span>
                  </p>
                )}

                {verifyMode === 'otp' ? (
                  <div className="grid grid-cols-6 gap-2">
                    {pin.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`pin-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handlePinChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className="h-12 text-center text-lg font-bold text-[#1A1615] bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg focus:outline-hidden focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753]"
                      />
                    ))}
                  </div>
                ) : (
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full h-12 px-4 text-lg placeholder:text-sm font-bold text-[#1A1615] bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg focus:outline-hidden focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753]"
                  />
                )}
                
                <div className="mt-2 flex items-center justify-between">
                  <button
                    onClick={() => setVerifyMode(verifyMode === 'otp' ? 'password' : 'otp')}
                    className="text-[#9E782F] hover:underline font-semibold text-[10px] cursor-pointer"
                  >
                    {verifyMode === 'otp' ? 'Login with Password' : 'Login with OTP'}
                  </button>
                  <button
                    onClick={() => { setStep('input'); setVerifyMode('otp'); }}
                    className="text-[#9E782F] hover:underline font-semibold text-[10px] cursor-pointer"
                  >
                    Change {phone.includes('@') ? 'Email' : 'Number'}
                  </button>
                </div>
              </div>

              <PrimaryButton
                type="button"
                onClick={() => onLoginSuccess('merchant')}
                className="w-full py-2.5 text-sm"
              >
                {verifyMode === 'otp' ? 'Verify PIN & Authenticate →' : 'Login →'}
              </PrimaryButton>

              {verifyMode === 'otp' && (
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setTimeLeft(105)}
                    className="text-xs text-[#9E782F] font-semibold hover:underline cursor-pointer"
                  >
                    Didn&apos;t receive code? Resend OTP
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-[#E5E0D8] flex items-center justify-between text-[11px] text-[#6E6A66]">
            <span className="flex items-center gap-1 text-[10px]">
              <Lock className="w-3 h-3 text-[#9E9A93]" /> Hardware Security Enclave
            </span>
            <button
              onClick={onGoToOnboarding}
              className="text-[11px] font-semibold text-[#9E782F] hover:underline cursor-pointer"
            >
              New Outlet? Start Onboarding
            </button>
          </div>
          {/* Static Registration Bypass for Demo */}
          <div className="mt-6 pt-5 border-t border-[#E5E0D8]">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] mb-3 text-center">Create New Account</p>
            <div className="flex gap-3">
              <button
                onClick={() => onLoginSuccess('/onboarding')}
                className="flex-1 bg-white hover:bg-gray-50 text-[#1A1615] cursor-pointer border border-[#E5E0D8] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Register as Merchant
              </button>
              <button
                onClick={() => onLoginSuccess('/customer/identify')}
                className="flex-1 bg-white hover:bg-gray-50 text-[#1A1615] cursor-pointer border border-[#E5E0D8] px-4 py-2.5 rounded-lg text-xs font-bold transition-colors shadow-sm"
              >
                Register as Customer
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
