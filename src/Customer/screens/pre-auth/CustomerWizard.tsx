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
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store/store';
import { fetchCountries, fetchStates, fetchCities, clearStates, clearCities } from '../../../store/slices/locationSlice';
import { requestCustomerOtp, verifyCustomerOtp, clearCustomerAuthError, saveCustomerProfile } from '../../../store/slices/customerAuthSlice';

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
  const [countryText, setCountryText] = useState('India');
  const [stateText, setStateText] = useState('');
  const [pincode, setPincode] = useState('');
  const [maritalStatus, setMaritalStatus] = useState('Married');
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [partnerMobile, setPartnerMobile] = useState('');

  const dispatch = useDispatch<AppDispatch>();
  const { countries, states, cities, isCountriesLoading, isStatesLoading, isCitiesLoading } = useSelector((state: RootState) => state.location);
  const { isOtpLoading, isVerifyLoading, isProfileSaving, error } = useSelector((state: RootState) => state.customerAuth);

  useEffect(() => {
    if (step === 2) {
      dispatch(fetchCountries());
    }
  }, [step, dispatch]);

  useEffect(() => {
    if (step === 2 && countries.length > 0 && countryText === 'India' && states.length === 0) {
      const india = countries.find(c => c.name === 'India');
      if (india) {
        dispatch(fetchStates(india.id));
      }
    }
  }, [step, countries.length, dispatch]);

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value;
    setCountryText(countryName);
    setStateText('');
    setCity('');
    if (!countryName) {
      dispatch(clearStates());
      dispatch(clearCities());
      return;
    }
    const selectedCountryObj = countries.find(c => c.name === countryName);
    if (selectedCountryObj) {
      dispatch(fetchStates(selectedCountryObj.id));
    }
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setStateText(stateName);
    setCity('');
    if (!stateName) {
      dispatch(clearCities());
      return;
    }
    const selectedStateObj = states.find(s => s.name === stateName);
    if (selectedStateObj) {
      dispatch(fetchCities(selectedStateObj.id));
    }
  };

  const goNext = async () => { 
    if (step < totalSteps) {
      setStep(step + 1); 
    } else {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        mobile_number: mobileNumber,
        dob: dob,
        age: age ? parseInt(age) : undefined,
        gender: gender,
        address: address,
        country: countryText,
        state: stateText,
        city: city,
        pincode: pincode || zipCode,
        profile_photo: photoUrl || undefined
      };
      
      const res = await dispatch(saveCustomerProfile(payload));
      if (saveCustomerProfile.fulfilled.match(res)) {
        onComplete();
      }
    }
  };

  // Mobile Verification State
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isMobileVerified, setIsMobileVerified] = useState(false);
  const [verificationMethod, setVerificationMethod] = useState<'sms' | 'whatsapp'>('sms');

  const handleSendOtp = async () => {
    if (mobileNumber.trim().length >= 10 || mobileNumber.includes('@')) {
      dispatch(clearCustomerAuthError());
      const res = await dispatch(requestCustomerOtp({ identifier: mobileNumber }));
      if (requestCustomerOtp.fulfilled.match(res)) {
        setIsOtpSent(true);
      }
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.trim().length === 6) {
      dispatch(clearCustomerAuthError());
      const res = await dispatch(verifyCustomerOtp({ identifier: mobileNumber, otp }));
      if (verifyCustomerOtp.fulfilled.match(res)) {
        setIsMobileVerified(true);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-[#FAF8FF] font-sans relative text-[#1E1548]">
      {!isMobileVerified && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0D15]/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100/80 w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-purple-50 bg-gradient-to-b from-[#FAF8FF] to-white">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#5844A8] mb-1">SECURE AUTH GATEWAY</div>
              <h3 className="text-xl font-black tracking-tight text-[#1E1548]">Identity Verification</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Verify your phone or email to begin customer registration.</p>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {(!mobileNumber || /^[0-9+]/.test(mobileNumber)) && (
                  <div className="flex bg-[#FAF8FF] p-1 rounded-xl border border-purple-100">
                    <button 
                      type="button"
                      onClick={() => setVerificationMethod('sms')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        verificationMethod === 'sms' 
                          ? 'bg-[#5844A8] text-white shadow-2xs' 
                          : 'text-gray-500 hover:text-[#1E1548]'
                      }`}
                    >
                      📞 SMS OTP
                    </button>
                    <button 
                      type="button"
                      onClick={() => setVerificationMethod('whatsapp')}
                      className={`flex-1 py-2 text-xs font-bold flex items-center justify-center gap-1.5 rounded-lg transition-all cursor-pointer ${
                        verificationMethod === 'whatsapp' 
                          ? 'bg-[#5844A8] text-white shadow-2xs' 
                          : 'text-gray-500 hover:text-[#1E1548]'
                      }`}
                    >
                      💬 WhatsApp <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/60 px-1.5 py-0.5 rounded text-[8px] font-bold">INSTANT</span>
                    </button>
                  </div>
                )}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1E1548] mb-1.5">PHONE NUMBER OR EMAIL</label>
                  <div className="flex gap-2">
                    {(mobileNumber.length > 0 && /^[0-9+]/.test(mobileNumber)) && (
                      <select className="bg-[#FAF8FF] border border-purple-100 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8]">
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
                        setMobileNumber(val);
                      }} 
                      disabled={isOtpSent}
                      placeholder="Enter mobile number or email"
                      className="flex-1 bg-[#FAF8FF] border border-purple-100 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:bg-white focus:outline-hidden focus:border-[#5844A8] focus:ring-1 focus:ring-[#5844A8] disabled:opacity-50 transition-colors" 
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">
                    {(!mobileNumber || /^[0-9+]/.test(mobileNumber)) 
                      ? "A secure OTP will be sent via your selected method."
                      : "A secure verification code will be sent to your email address."}
                  </p>
                </div>
                {!isOtpSent ? (
                  <>
                  <button 
                    type="button"
                    onClick={handleSendOtp}
                    disabled={!mobileNumber || isOtpLoading}
                    className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 disabled:opacity-50 transition-all cursor-pointer"
                  >{isOtpLoading ? "Sending..." : "Send Verification Code →"}</button>
                  {error && <p className="text-xs text-red-500 mt-2 text-center font-semibold">{error}</p>}
                  </>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-[#1E1548]">ENTER 6-DIGIT VERIFICATION PIN</label>
                      <span className="text-[10px] text-[#E11D48] font-bold">Expires in 01:39</span>
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
                          className="w-12 h-12 text-center text-lg font-black bg-[#FAF8FF] border border-purple-200 rounded-xl text-[#1E1548] focus:bg-white focus:outline-hidden focus:border-[#5844A8] focus:ring-1 focus:ring-[#5844A8] shadow-2xs"
                        />
                      ))}
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className="text-[10px] text-gray-400 font-medium">{mobileNumber.includes('@') ? mobileNumber : `Sent to +91 ${mobileNumber}`}</span>
                      <button type="button" onClick={() => setIsOtpSent(false)} className="text-[10px] text-[#5844A8] font-bold hover:underline cursor-pointer">Change {mobileNumber.includes('@') ? 'Email' : 'Number'}</button>
                    </div>
                    <>
                    <button 
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={otp.length !== 6 || isVerifyLoading}
                      className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl shadow-md shadow-[#5844A8]/20 disabled:opacity-50 transition-all cursor-pointer mb-4"
                    >{isVerifyLoading ? "Verifying..." : "Verify PIN & Authenticate →"}</button>
                    {error && <p className="text-xs text-red-500 mb-4 text-center font-semibold">{error}</p>}
                    </>
                    <div className="text-center">
                      <button type="button" className="text-[11px] text-[#5844A8] font-bold hover:underline cursor-pointer">Didn't receive code? Resend OTP</button>
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
                      <p className="text-[10px] font-black text-[#5844A8] uppercase tracking-widest">Step 1 of 2</p>
                      <span className="text-[#ddd]">·</span>
                      <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">Personal Information</p>
                    </div>
                    <h2 className="text-4xl font-black text-[#1E1548] mb-4 tracking-tight">Tell Us About <span className="text-[#5844A8]">Yourself</span></h2>
                    <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-lg">
                      We use these details to personalize your experience, tailor recommendations, and provide seamless service across all our locations.
                    </p>

                    <div className="flex items-center gap-5 mb-8">
                      <label htmlFor="profile-upload" className="relative cursor-pointer group block w-20 h-20">
                        <div className="w-full h-full bg-[#FAF8FF] border border-purple-100 rounded-full flex items-center justify-center overflow-hidden group-hover:border-[#5844A8] transition-colors shadow-sm">
                          {photoUrl ? (
                            <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-8 h-8 text-[#9E9A93] group-hover:text-[#5844A8] transition-colors" />
                          )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#5844A8] text-white p-1.5 rounded-full shadow-sm z-10">
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
                        <h3 className="text-sm font-bold text-[#1E1548]">Profile Photo</h3>
                        <p className="text-[11px] text-[#6E6A66] mt-1">Upload a recognizable photo for seamless concierge service</p>
                      </div>
                    </div>

                    <div className="space-y-5 mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="firstName" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">First Name *</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="firstName" name="firstName" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Sarah" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="lastName" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Last Name</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <User className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="lastName" name="lastName" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Jenkins" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="email" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Email Address</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Mail className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="email" id="email" name="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="sarah@example.com" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                          </div>
                          <p className="text-[11px] text-[#999] mt-2">We'll send order confirmations and exclusive offers here.</p>
                        </div>
                        <div>
                          <label htmlFor="mobileNumber" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Mobile Number</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <Phone className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="tel" id="mobileNumber" name="mobileNumber" value={mobileNumber} onChange={e => setMobileNumber(e.target.value)} placeholder="+1 (555) 000-0000" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                          </div>
                          <p className="text-[11px] text-[#999] mt-2">Used for SMS updates and instant concierge access.</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="zipCode" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">ZIP Code (Optional)</label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                              <MapPin className="h-4 w-4 text-[#666]" />
                            </div>
                            <input type="text" id="zipCode" name="zipCode" value={zipCode} onChange={e => setZipCode(e.target.value)} placeholder="10001" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <button onClick={goNext} disabled={!firstName} className="w-full md:w-auto md:px-12 h-12 bg-[#5844A8] text-white rounded-xl font-black text-[14px] flex items-center justify-center gap-3 disabled:opacity-50 hover:bg-[#47368E] shadow-md shadow-[#5844A8]/20 transition-all group">{isProfileSaving ? "Saving..." : "Continue"} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
                  </div>

                  <div className="hidden lg:block lg:w-[400px] shrink-0 space-y-6 pt-10">
                    <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=90&w=800" alt="Experience" className="w-full h-[240px] rounded-2xl md:rounded-3xl object-cover shadow-sm" />
                    <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-sm border border-purple-50">
                      <h4 className="text-sm font-black text-[#1E1548] mb-3">Why We Ask</h4>
                      {['Personalized service and greetings', 'Tailored product recommendations', 'Exclusive member rewards', 'Seamless checkout and history tracking'].map(item => (
                        <div key={item} className="flex items-center gap-3 py-2"><Check className="w-4 h-4 text-emerald-600 shrink-0" /><span className="text-[13px] text-[#444]">{item}</span></div>
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
                      <p className="text-[10px] font-black text-[#5844A8] uppercase tracking-widest">Step 2 of 2</p>
                      <span className="text-[#ddd]">·</span>
                      <p className="text-[10px] font-bold text-[#999] uppercase tracking-widest">Optional</p>
                    </div>
                    <h2 className="text-4xl font-black text-[#1E1548] mb-4 tracking-tight">Demographics & <span className="text-[#5844A8]">Address</span></h2>
                    <p className="text-[15px] text-[#666] leading-relaxed mb-8 max-w-lg">
                      Share these details to receive personalized offers, physical birthday gifts, and specialized rewards.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="dob" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Date of Birth</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="date" id="dob" name="dob" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="age" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Age</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="number" id="age" name="age" value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 28" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="gender" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Gender</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-[#666]" />
                          </div>
                          <select id="gender" name="gender" value={gender} onChange={e => setGender(e.target.value)} className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors cursor-pointer appearance-none">
                            <option value="prefer-not">Prefer not to say</option>
                            <option value="female">Female</option>
                            <option value="male">Male</option>
                            <option value="non-binary">Non-binary</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Personalisation: Marital Status & Partner Details */}
                    <div className="bg-[#FAF8FF] border border-purple-100 rounded-2xl p-5 mb-6 space-y-4">
                      <div>
                        <label className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Marital Status</label>
                        <select
                          value={maritalStatus}
                          onChange={(e) => setMaritalStatus(e.target.value)}
                          className="w-full bg-white border border-purple-100 rounded-xl px-4 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] cursor-pointer"
                        >
                          <option value="Married">Married</option>
                          <option value="Single">Single</option>
                          <option value="In a relationship">In a relationship</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>

                      {maritalStatus === 'Married' && (
                        <div className="space-y-4 pt-2 border-t border-purple-100/60">
                          <h4 className="text-xs font-black text-[#1E1548]">If married</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Anniversary Date</label>
                              <input
                                type="date"
                                value={anniversaryDate}
                                onChange={(e) => setAnniversaryDate(e.target.value)}
                                className="w-full bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Partner&apos;s Name</label>
                              <input
                                type="text"
                                value={partnerName}
                                onChange={(e) => setPartnerName(e.target.value)}
                                placeholder="Enter partner's name"
                                className="w-full bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-bold text-gray-500 mb-1">Partner&apos;s Mobile Number</label>
                              <div className="flex gap-2">
                                <span className="bg-white border border-purple-100 rounded-xl px-2.5 py-2 text-xs font-bold text-[#1E1548] flex items-center">+91</span>
                                <input
                                  type="tel"
                                  value={partnerMobile}
                                  onChange={(e) => setPartnerMobile(e.target.value)}
                                  placeholder="Enter number"
                                  className="flex-1 bg-white border border-purple-100 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mb-5">
                      <label htmlFor="address" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#666]" />
                        </div>
                        <input type="text" id="address" name="address" value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, Apt 4B" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label htmlFor="country" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Country</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-[#666]" />
                          </div>
                          <select id="country" name="country" value={countryText} onChange={handleCountryChange} disabled={isCountriesLoading} className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="">Select Country</option>
                            {countries.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">State</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-[#666]" />
                          </div>
                          <select id="state" name="state" value={stateText} onChange={handleStateChange} disabled={!countryText || isStatesLoading} className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="">Select State</option>
                            {states.map(s => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
                      <div>
                        <label htmlFor="city" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">City</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Building className="h-4 w-4 text-[#666]" />
                          </div>
                          <select id="city" name="city" value={city} onChange={e => setCity(e.target.value)} disabled={!stateText || isCitiesLoading} className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors cursor-pointer appearance-none disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="">Select City</option>
                            {cities.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-[12px] font-black uppercase tracking-wider text-[#1E1548] mb-1.5">Pincode</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#666]" />
                          </div>
                          <input type="text" id="pincode" name="pincode" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="10001" className="w-full bg-[#FAF8FF] border border-purple-100 rounded-xl pl-10 pr-3 py-2.5 text-sm font-bold text-[#1E1548] focus:outline-hidden focus:border-[#5844A8] transition-colors placeholder:text-[#888]" />
                        </div>
                      </div>
                    </div>

                    {error && <p className="text-red-500 text-sm font-bold mb-4">{error}</p>}
                      <div className="flex gap-4">
                      <button onClick={() => setStep(step - 1)} className="px-6 h-12 bg-white border border-purple-100 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm cursor-pointer">← Back</button>
                      <button onClick={goNext} disabled={isProfileSaving} className="flex-1 md:flex-none md:px-12 h-12 bg-[#5844A8] text-white rounded-xl font-black text-[14px] flex items-center justify-center gap-3 hover:bg-[#47368E] shadow-md shadow-[#5844A8]/20 transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                        Continue <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>

                  <div className="hidden lg:block lg:w-[400px] shrink-0 space-y-6 pt-10">
                    <div className="bg-gradient-to-br from-[#7C3AED] to-[#5844A8] rounded-2xl md:rounded-3xl p-4 md:p-7 text-white shadow-xl">
                      <Gift className="w-8 h-8 mb-4 opacity-90" />
                      <h3 className="text-xl font-black mb-2">Birthday Rewards</h3>
                      <p className="text-[13px] opacity-90 leading-relaxed mb-4">Members receive on their birthday:</p>
                      {['Exclusive annual birthday gift', 'Double reward points on all purchases', 'Personalized digital greetings', 'Special access to VIP member perks'].map(item => (
                        <div key={item} className="flex items-center gap-2 py-1.5"><Check className="w-3.5 h-3.5 text-purple-200" /><span className="text-[12px] opacity-95">{item}</span></div>
                      ))}
                    </div>
                    <img src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=90&w=800" alt="Gifts" className="w-full h-[200px] rounded-2xl md:rounded-3xl object-cover shadow-sm" />
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
              <div className="w-5 h-5 bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white rounded flex items-center justify-center text-[9px] font-black">R</div>
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
