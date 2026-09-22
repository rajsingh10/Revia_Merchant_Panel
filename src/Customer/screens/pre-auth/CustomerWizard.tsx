import React, { useState, useEffect, useRef } from 'react';
import {
  Scan, Camera, ArrowRight, ShieldCheck, Smartphone,
  User, Calendar, Coffee, HeartPulse, Check, Star, Award,
  Sparkles, Crown, Gift, Clock, MapPin, Phone, Lock, Zap, Heart,
  Plus, Minus, ChevronRight, ShoppingBag, Mail, Building, Hash
} from 'lucide-react';
import { CustomerHeader } from '../../components/shared/CustomerHeader';
import { MOCK_BUSINESS } from '../../data/mockData';
import { MOCK_CATALOG_ITEMS } from '../../../data/mockData';
import { useCustomer } from '../../CustomerContext';

export const CustomerWizard = ({ onComplete, onNavigate }: { onComplete: () => void, onNavigate?: (route: string) => void }) => {
  const { cartItems, addItem } = useCustomer();
  const [step, setStep] = useState(1);
  const totalSteps = 2;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('prefer-not');

  // Other potential fields from the new inputs
  const [zipCode, setZipCode] = useState('');
  const [company, setCompany] = useState('');
  const [age, setAge] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateText, setStateText] = useState('');
  const [pincode, setPincode] = useState('');

  const goNext = () => { if (step < totalSteps) setStep(step + 1); else onComplete(); };

  // Mobile Verification State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'whatsapp'>('sms');

  const handleSendOtp = () => {
    if (mobileNumber.trim().length >= 10) {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length === 6) {
      setIsMobileVerified(true);
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#F8F6F0] font-sans relative">
      {!isMobileVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-[#E5E0D8]">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93] mb-1">SECURE AUTH GATEWAY</div>
              <h3 className="text-xl font-bold tracking-tight text-[#1A1615]">Mobile Verification</h3>
              <p className="text-xs text-[#6E6A66] mt-1">Verify your mobile number to begin customer registration.</p>
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
                    <select className="bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753]">
                      <option>IN +91</option>
                      <option>US +1</option>
                    </select>
                    <input 
                      type="text" 
                      value={mobileNumber} 
                      onChange={(e) => setMobileNumber(e.target.value)} 
                      disabled={isOtpSent}
                      placeholder="Enter mobile number or email"
                      className="flex-1 bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg px-3.5 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#D4A753] disabled:opacity-50" 
                    />
                  </div>
                  <p className="text-[10px] text-[#9E9A93] mt-2">Operator credentials provisioned by Central IT / General Management.</p>
                </div>
                {!isOtpSent ? (
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!mobileNumber}
                    className="w-full py-3 bg-[#B8860B] text-white text-xs font-bold rounded-lg hover:bg-[#9E782F] disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    Send Verification Code →
                  </button>
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
                      <button type="button" onClick={() => setIsOtpSent(false)} className="text-[10px] text-[#B8860B] font-semibold hover:underline cursor-pointer">Change {mobileNumber.includes('@') ? 'Email' : 'Number'}</button>
                    </div>
                    <button 
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6}
                      className="w-full py-3 bg-[#B8860B] text-white text-xs font-bold rounded-lg hover:bg-[#9E782F] disabled:opacity-50 transition-colors cursor-pointer mb-4 shadow-sm"
                    >
                      Verify PIN &amp; Authenticate →
                    </button>
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
      <div className="relative z-10 flex flex-col min-h-[100dvh]">


        <main className="flex-1 w-full">
          <div className="w-full animate-in fade-in duration-500">

            {/* ═══════════════ STEP 1: PERSONAL — Card Grid Style ═══════════════ */}
            {step === 1 && (
              <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-4 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] font-black text-[#9A7436] uppercase tracking-widest">Step 1 of 2</p>
                      <span className="text-[#ddd]">·</span>
                      <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">Personal Information</p>
                    </div>
                    <h2 className="text-4xl font-black text-[#111] mb-4 tracking-tight">Tell Us About <span className="text-[#9A7436]">Yourself</span></h2>
                    <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-lg">
                      We use these details to personalize your experience, tailor recommendations, and provide seamless service across all our locations.
                    </p>

                    <div className="flex items-center gap-5 mb-8">
                      <label htmlFor="profile-upload" className="relative cursor-pointer group block w-20 h-20">
                        <div className="w-full h-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-full flex items-center justify-center overflow-hidden group-hover:border-[#D4A753] transition-colors shadow-sm">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-[#9E9A93] group-hover:text-[#D4A753] transition-colors" />
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#9A7436] text-white p-1.5 rounded-full shadow-sm z-10">
                          <Camera className="w-3.5 h-3.5" />
                        </div>
                        <input 
                          type="file" 
                          id="profile-upload" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              const url = URL.createObjectURL(e.target.files[0]);
                              setPhotoUrl(url);
                            }
                          }} 
                        />
                      </label>
                      <div>
                        <h3 className="text-sm font-bold text-[#111]">Profile Photo</h3>
                        <p className="text-[11px] text-[#6E6A66] mt-1">Upload a recognizable photo for seamless concierge service</p>
                      </div>
                    </div>

                    <div className="space-y-5 mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">First Name *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="firstName" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sarah" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Last Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="lastName" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Jenkins" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="email" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@example.com" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                          <p className="text-[11px] text-[#999] mt-2">We'll send order confirmations and exclusive offers here.</p>
                        </div>
                        <div>
                          <label htmlFor="mobileNumber" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Mobile Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="tel" id="mobileNumber" name="mobileNumber" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                          <p className="text-[11px] text-[#999] mt-2">Used for SMS updates and instant concierge access.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="zipCode" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">ZIP Code (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="zipCode" name="zipCode" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="10001" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="company" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Company (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Building className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="company" name="company" value={company} onChange={e => setCompany(e.target.value)} placeholder="Acme Corp" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={goNext} disabled={!firstName} className="w-full md:w-auto md:px-12 h-12 bg-[#9A7436] text-white rounded-md font-black text-[14px] flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-[#886630] shadow-md shadow-[#9A7436]/20 transition-all group">
                      Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>

                  <div className="hidden lg:block lg:w-[400px] shrink-0 space-y-6 pt-10">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=90&w=800" alt="Experience" className="w-full h-[240px] rounded-md md:rounded-3xl object-cover shadow-sm" />
                    <div className="bg-white rounded-md md:rounded-3xl p-4 md:p-6 shadow-sm">
                      <h4 className="text-sm font-black text-[#111] mb-3">Why We Ask</h4>
                      {['Personalized service and greetings', 'Tailored product recommendations', 'Exclusive member rewards', 'Seamless checkout and history tracking'].map(item => (
                        <div key={item} className="flex items-center gap-3 py-2"><Check className="w-4 h-4 text-[#1C8A54] shrink-0" /><span className="text-[13px] text-[#444]">{item}</span></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ═══════════════ STEP 2: DEMOGRAPHICS — With Birthday Visual ═══════════════ */}
            {step === 2 && (
              <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-4 md:py-10">
                <div className="flex flex-col lg:flex-row gap-6 lg:gap-16">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-[10px] font-black text-[#9A7436] uppercase tracking-widest">Step 2 of 2</p>
                      <span className="text-[#ddd]">·</span>
                      <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">Optional</p>
                    </div>
                    <h2 className="text-4xl font-black text-[#111] mb-4 tracking-tight">Demographics & <span className="text-[#9A7436]">Address</span></h2>
                    <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-lg">
                      Share these details to receive personalized offers, physical birthday gifts, and specialized rewards.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="dob" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Date of Birth</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="date" id="dob" name="dob" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="age" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Age</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="number" id="age" name="age" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Gender</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-[#666]" />
                          </div>
                          <select id="gender" name="gender" value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors cursor-pointer appearance-none">
                            <option value="prefer-not">Prefer not to say</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="non-binary">Non-binary</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="mb-5">
                      <label htmlFor="address" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#666]" />
                        </div>
                        <input type="text" id="address" name="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Apt 4B" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
                      <div>
                        <label htmlFor="city" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">City</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Building className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="text" id="city" name="city" value={city} onChange={e => setCity(e.target.value)} placeholder="New York" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">State</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="text" id="state" name="state" value={stateText} onChange={e => setStateText(e.target.value)} placeholder="NY" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-[12px] font-black uppercase tracking-wider text-[#111] mb-1.5">Pincode</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="text" id="pincode" name="pincode" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="10001" className="w-full bg-[#FAF8F5] border border-[#E5E0D8] rounded-lg pl-10 pr-3 py-2.5 text-sm font-bold text-[#111] focus:outline-hidden focus:border-[#D4A753] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(step - 1)} className="px-6 h-12 bg-white border border-[#EAE3D9] text-[#666] font-bold rounded-md hover:bg-[#EAE3D9]/50 transition-colors shadow-sm">← Back</button>
                      <button onClick={goNext} className="flex-1 md:flex-none md:px-12 h-12 bg-[#9A7436] text-white rounded-md font-black text-[14px] flex items-center justify-center gap-3 hover:bg-[#886630] shadow-md shadow-[#9A7436]/20 transition-all group">
                        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-[400px] shrink-0 space-y-6 pt-10">
                    <div className="bg-[#9A7436] rounded-md md:rounded-3xl p-4 md:p-7 text-white">
                      <Gift className="w-8 h-8 mb-4 opacity-80" />
                      <h3 className="text-xl font-black mb-2">Birthday Rewards</h3>
                      <p className="text-[13px] opacity-80 leading-relaxed mb-4">Members receive on their birthday:</p>
                      {['Exclusive annual birthday gift', 'Double reward points on all purchases', 'Personalized digital greetings', 'Special access to VIP member perks'].map(item => (
                        <div key={item} className="flex items-center gap-2 py-1.5"><Check className="w-3.5 h-3.5 opacity-80" /><span className="text-[12px] opacity-90">{item}</span></div>
                      ))}
                    </div>
                    <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=90&w=800" alt="Gifts" className="w-full h-[200px] rounded-md md:rounded-3xl object-cover shadow-sm" />
                  </div>
                </div>
              </div>
            )}

          </div>
        </main>

        {/* Footer */}
        <footer className="w-full bg-white/80 backdrop-blur-md mt-auto">
          <div className="max-w-[1400px] mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-[#888] tracking-wide">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-[#9A7436] text-white rounded flex items-center justify-center text-[9px] font-black">R</div>
              <p>Revia</p>
            </div>
            <div className="flex items-center gap-6">
              <button onClick={() => onNavigate?.('/privacy')} className="hover:text-[#111] transition-colors cursor-pointer">Privacy</button>
              <button onClick={() => onNavigate?.('/terms')} className="hover:text-[#111] transition-colors cursor-pointer">Terms</button>
              <button onClick={() => onNavigate?.('/contact')} className="hover:text-[#111] transition-colors cursor-pointer">Support</button>
            </div>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes scan { 0%, 100% { top: 10%; opacity: 0; } 10%, 90% { opacity: 1; } 50% { top: 90%; opacity: 1; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .line-clamp-1 { overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 1; }
      `}} />
    </div>
  );
};
