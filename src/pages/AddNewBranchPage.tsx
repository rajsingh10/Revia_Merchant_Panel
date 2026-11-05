import React, { useState } from 'react';
import {
  ArrowLeft,
  X,
  Store,
  MapPin,
  Clock,
  Sparkles,
  UploadCloud,
  FileText,
  File,
  CheckCircle2,
  ChevronDown,
  Edit2,
  Calendar,
  Cloud,
  Layers,
  ShoppingBag,
  Rocket,
  Check,
  Plus,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';
import { useWallet } from '../context/WalletContext';

interface AddNewBranchPageProps {
  onNavigate: (route: NavRoute) => void;
  onAddBranch: (branch: OutletsData) => void;
}

export const AddNewBranchPage: React.FC<AddNewBranchPageProps> = ({
  onNavigate,
  onAddBranch
}) => {
  const { checkAndDeductCredit } = useWallet();

  // Current Step: 1 (Basic Info) | 2 (Location) | 3 (POS & Menu) | 4 (Review)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // STEP 1 Form State
  const [branchName, setBranchName] = useState('Downtown Flagship');
  const [branchType, setBranchType] = useState('Café');
  const [branchCode, setBranchCode] = useState('BR001');
  const [description, setDescription] = useState(
    'A cozy café with premium coffee, bakery and dine-in experience.'
  );

  // STEP 2 Form State
  const [addressLine1, setAddressLine1] = useState('428 S Spring St');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Los Angeles');
  const [state, setState] = useState('California');
  const [zipCode, setZipCode] = useState('90013');
  const [country, setCountry] = useState('United States');
  const [latLng, setLatLng] = useState('34.0488° N, 118.2518° W');

  // STEP 3 Form State
  const [posProvider, setPosProvider] = useState('Square / Toast / Others');
  const [posTerminalId, setPosTerminalId] = useState('POS-001');
  const [syncMenuWithPos, setSyncMenuWithPos] = useState(true);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(
    'Spring_Dinner_Menu_v2.pdf'
  );
  const [uploadedFileSize, setUploadedFileSize] = useState<string>('2.4 MB');

  // Submission & Validation
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // Step 1 Validation
  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!branchName.trim()) errs.branchName = 'Branch name is required';
    if (!branchType.trim()) errs.branchType = 'Branch type is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Step 2 Validation
  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!addressLine1.trim()) errs.addressLine1 = 'Address Line 1 is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!state.trim()) errs.state = 'State is required';
    if (!zipCode.trim()) errs.zipCode = 'Postal / Zip code is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigate('/branches');
    }
  };

  // Auto-detect location simulator
  const handleAutoDetect = () => {
    setLatLng('34.0488° N, 118.2518° W');
  };

  // File upload simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      setUploadedFileSize(`${(file.size / (1024 * 1024)).toFixed(1)} MB`);
    }
  };

  // Submit and launch branch
  const handleSubmit = () => {
    const branchId = `branch-${Date.now()}`;
    const allowed = checkAndDeductCredit('branch_setup', 100, branchId, 'New Branch Setup');
    if (!allowed) {
      return;
    }

    setIsSubmitting(true);

    const createdOutlet: OutletsData = {
      id: branchId,
      name: branchName,
      shortName: branchName.split(' ')[0] || 'Outlet',
      type: 'Active',
      address: `${addressLine1}, ${city}, ${state} ${zipCode}`,
      manager: 'Store Manager',
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      terminalsActive: 2,
      membersLinked: '1,200 Linked',
      volume30d: '₹1.64L',
      hours: 'Mon - Sun • 7:00 AM - 11:00 PM',
      timezone: 'PST (America/Los_Angeles)',
      currency: 'INR (₹)',
      taxProfile: 'Sales Tax (9.5%)',
      hardware: [
        {
          name: `${posProvider} Terminal 1`,
          badge: 'Square',
          detail: 'Terminal Node v2.4 • Online, just now',
          icon: 'register',
        }
      ],
      loyaltyRules: {
        baseMultiplier: '1.0× (Standard)',
        specialRuleName: 'Welcome Special',
        specialRuleTime: 'All Day First 30 Days',
        specialRuleBadge: 'Active Now',
        specialMultiplier: '2.0× Active',
        exclusivePerk: 'Complimentary Beverage for VIPs',
      },
    };

    setTimeout(() => {
      onAddBranch(createdOutlet);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 600);
  };

  const STEPS = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Location' },
    { num: 3, label: 'POS & Menu' },
    { num: 4, label: 'Review' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] pb-16 font-sans text-[#1A1615]">
      <div className="max-w-4xl mx-auto px-6 pt-6 space-y-6">
        {/* Header Bar */}
        <div>
          <button
            onClick={() => onNavigate('/branches')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C877D] hover:text-[#1A1615] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Branches</span>
          </button>
          <h1 className="text-2xl font-bold tracking-tight text-[#1A1615]">Add New Branch</h1>
          <p className="text-xs text-[#6E6A66] font-medium mt-0.5">
            Set up your new branch by providing the basic details.
          </p>
        </div>

        {/* Stepper Indicator */}
        <div className="py-4">
          <div className="flex items-center justify-between relative max-w-xl mx-auto">
            {/* Connecting line */}
            <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-[#E5E0D8] -z-0" />
            <div
              className="absolute left-6 top-4 -translate-y-1/2 h-0.5 bg-[#2D124D] transition-all duration-300 -z-0"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 90}%` }}
            />

            {STEPS.map((s) => {
              const isPassed = currentStep > s.num;
              const isCurrent = currentStep === s.num;
              return (
                <div key={s.num} className="flex flex-col items-center gap-1.5 z-10">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#2D124D] text-white ring-4 ring-[#FAF5FF] shadow-xs'
                        : isPassed
                        ? 'bg-[#2D124D] text-white'
                        : 'bg-white border-2 border-[#E5E0D8] text-[#8C877D]'
                    }`}
                  >
                    {isPassed ? <Check className="w-4 h-4 stroke-[2.5]" /> : s.num}
                  </div>
                  <span
                    className={`text-[11px] font-bold ${
                      isCurrent ? 'text-[#2D124D]' : isPassed ? 'text-[#1A1615]' : 'text-[#8C877D]'
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ======================================================== */}
        {/* STEP 1: BASIC INFO */}
        {/* ======================================================== */}
        {currentStep === 1 && (
          <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-6 space-y-6">
            <div className="flex items-start gap-3 pb-4 border-b border-[#F1EFEA]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6] shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1615]">Branch Identity</h2>
                <p className="text-xs text-[#6E6A66] mt-0.5">
                  Start by adding the basic details and brand positioning of your new branch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              {/* Left Column */}
              <div className="space-y-4">
                <div>
                  <label className="block font-bold text-[#1A1615] mb-1.5">
                    Branch Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => {
                      setBranchName(e.target.value);
                      if (errors.branchName) setErrors({ ...errors, branchName: '' });
                    }}
                    placeholder="e.g. Downtown Flagship"
                    className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border ${
                      errors.branchName ? 'border-red-500' : 'border-[#E5E0D8]'
                    } rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]`}
                  />
                  {errors.branchName && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.branchName}</p>
                  )}
                </div>

                <div>
                  <label className="block font-bold text-[#1A1615] mb-1.5">
                    Branch Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={branchType}
                    onChange={(e) => setBranchType(e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  >
                    <option value="Café">Café</option>
                    <option value="Dine-in & Takeaway">Dine-in & Takeaway</option>
                    <option value="Quick Service / QSR">Quick Service / QSR</option>
                    <option value="Bistro & Lounge">Bistro & Lounge</option>
                    <option value="Cloud Kitchen">Cloud Kitchen</option>
                    <option value="Bakery & Confectionery">Bakery & Confectionery</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#1A1615]">Branch Code</label>
                    <span className="text-[10px] text-[#8C877D]">Optional</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D] font-mono">#</span>
                    <input
                      type="text"
                      value={branchCode}
                      onChange={(e) => setBranchCode(e.target.value)}
                      placeholder="e.g. BR001"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-mono font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#1A1615]">Description</label>
                    <span className="text-[10px] text-[#8C877D]">{description.length}/500</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us a bit about this branch..."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>

                {/* Pro Tip Card */}
                <div className="p-3.5 bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-[#EDE9FE] flex items-center justify-center text-[#8B5CF6] shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-[#2D124D]">Pro Tip</div>
                    <div className="text-[11px] text-[#6E6A66] mt-0.5 leading-relaxed">
                      Unique branch codes help link regional inventory trackers and staff roster automatically.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: LOCATION */}
        {/* ======================================================== */}
        {currentStep === 2 && (
          <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-6 space-y-6">
            <div className="flex items-start gap-3 pb-4 border-b border-[#F1EFEA]">
              <div className="w-10 h-10 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6] shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#1A1615]">Location Details</h2>
                <p className="text-xs text-[#6E6A66] mt-0.5">
                  Enter the address and contact information for your branch.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-3.5">
                <div>
                  <label className="block font-bold text-[#1A1615] mb-1">
                    Address Line 1 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => {
                      setAddressLine1(e.target.value);
                      if (errors.addressLine1) setErrors({ ...errors, addressLine1: '' });
                    }}
                    placeholder="428 S Spring St"
                    className={`w-full px-3.5 py-2.5 bg-[#FAF8F5] border ${
                      errors.addressLine1 ? 'border-red-500' : 'border-[#E5E0D8]'
                    } rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]`}
                  />
                  {errors.addressLine1 && (
                    <p className="text-red-500 text-[10px] mt-1 font-semibold">{errors.addressLine1}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#1A1615]">Address Line 2</label>
                    <span className="text-[10px] text-[#8C877D]">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Apartment, Building, suite, etc."
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1A1615] mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="e.g. Los Angeles"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1A1615] mb-1">
                      State <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="e.g. California"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1A1615] mb-1">
                      Postal / Zip Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="90013"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1A1615] mb-1">Country</label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    >
                      <option value="United States">United States</option>
                      <option value="India">India</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="United Kingdom">United Kingdom</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-[#1A1615]">Latitude &amp; Longitude</label>
                    <button
                      type="button"
                      onClick={handleAutoDetect}
                      className="text-[11px] font-bold text-[#8B5CF6] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <MapPin className="w-3 h-3" /> Auto-detect location
                    </button>
                  </div>
                  <input
                    type="text"
                    value={latLng}
                    onChange={(e) => setLatLng(e.target.value)}
                    placeholder="34.0488° N, 118.2518° W"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-mono font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>
              </div>

              {/* Right Column: Visual Map Card */}
              <div className="lg:col-span-5 space-y-3">
                <div>
                  <div className="font-bold text-[#1A1615]">Select Location on Map</div>
                  <p className="text-[11px] text-[#8C877D]">Drag the pin to set the exact location of your branch.</p>
                </div>

                <div className="border border-[#E5E0D8] rounded-2xl overflow-hidden bg-[#FAF8F5] relative shadow-2xs">
                  {/* Stylized Simulated Map Container */}
                  <div className="h-48 relative flex items-center justify-center overflow-hidden bg-gradient-to-tr from-[#F1EFEA] via-[#E8E4DC] to-[#FBF9F5]">
                    {/* SVG Street Grid Lines Simulation */}
                    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="40" x2="100%" y2="80" stroke="#CBD5E1" strokeWidth="4" />
                      <line x1="0" y1="120" x2="100%" y2="100" stroke="#CBD5E1" strokeWidth="6" />
                      <line x1="80" y1="0" x2="140" y2="100%" stroke="#E2E8F0" strokeWidth="5" />
                      <line x1="220" y1="0" x2="180" y2="100%" stroke="#E2E8F0" strokeWidth="5" />
                      <circle cx="50%" cy="50%" r="40" fill="#8B5CF6" fillOpacity="0.1" />
                    </svg>

                    {/* Neighborhood tags */}
                    <span className="absolute top-3 right-6 text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                      CHINATOWN
                    </span>
                    <span className="absolute bottom-4 left-6 text-[9px] font-bold text-[#64748B] uppercase tracking-wider">
                      FASHION DISTRICT
                    </span>

                    {/* Central Pin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#2D124D] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                        <MapPin className="w-4 h-4 fill-white" />
                      </div>
                      <span className="mt-1 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md text-[10px] font-bold text-[#1A1615] shadow-xs">
                        {city || 'Location Pin'}
                      </span>
                    </div>

                    {/* Zoom controls on map */}
                    <div className="absolute right-3 top-3 flex flex-col bg-white border border-[#E5E0D8] rounded-lg shadow-xs overflow-hidden">
                      <button type="button" className="p-1 hover:bg-[#FAF8F5] text-[#6E6A66]">
                        +
                      </button>
                      <button type="button" className="p-1 border-t border-[#E5E0D8] hover:bg-[#FAF8F5] text-[#6E6A66]">
                        −
                      </button>
                    </div>
                  </div>

                  {/* Selected Location Pill */}
                  <div className="p-3 bg-white border-t border-[#E5E0D8] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                      <span className="font-semibold text-[#1A1615] truncate">
                        {addressLine1}, {city}, {state} {zipCode}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-[11px] font-bold text-[#2D124D] hover:underline shrink-0"
                    >
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: POS & MENU */}
        {/* ======================================================== */}
        {currentStep === 3 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Card: POS Integration */}
            <div className="lg:col-span-6 bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-6 space-y-5">
              <div className="flex items-start gap-3 pb-3 border-b border-[#F1EFEA]">
                <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6] shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-[#1A1615]">POS Integration</h2>
                  <p className="text-[11px] text-[#6E6A66]">
                    Configure your POS system to sync orders and menu items.
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-[#1A1615] mb-1.5">
                    Select POS Provider <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={posProvider}
                      onChange={(e) => setPosProvider(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-semibold text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                    >
                      <option value="Square / Toast / Others">Square / Toast / Others</option>
                      <option value="Clover POS">Clover POS</option>
                      <option value="Petpooja">Petpooja</option>
                      <option value="UrbanPiper">UrbanPiper</option>
                      <option value="Custom API Endpoint">Custom API Endpoint</option>
                    </select>
                    <span className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#FAF5FF] text-[#6D28D9] border border-[#E9D5FF] px-2 py-0.5 rounded text-[9px] font-bold">
                      ☁ Cloud Sync
                    </span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-[#1A1615]">POS Terminal ID</label>
                    <span className="text-[10px] text-[#8C877D]">Optional</span>
                  </div>
                  <input
                    type="text"
                    value={posTerminalId}
                    onChange={(e) => setPosTerminalId(e.target.value)}
                    placeholder="e.g. POS-001"
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl text-xs font-mono font-medium text-[#1A1615] focus:outline-hidden focus:border-[#2D124D]"
                  />
                </div>

                {/* Sync Menu with POS Toggle Card */}
                <div className="p-3.5 bg-[#FAF8F5] border border-[#E5E0D8] rounded-xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#E5E0D8] flex items-center justify-center text-[#8B5CF6]">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1615]">Sync Menu with POS</div>
                      <div className="text-[10px] text-[#6E6A66] leading-tight">
                        Automatically sync menu items, prices and categories from your POS system.
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSyncMenuWithPos(!syncMenuWithPos)}
                    className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                      syncMenuWithPos ? 'bg-[#2D124D]' : 'bg-[#E5E0D8]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                        syncMenuWithPos ? 'right-0.5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Card: Menu Upload */}
            <div className="lg:col-span-6 bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-6 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-[#F1EFEA]">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF5FF] border border-[#F3E8FF] flex items-center justify-center text-[#8B5CF6] shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-[#1A1615]">Menu Upload</h2>
                    <p className="text-[11px] text-[#6E6A66]">
                      Upload your menu from your POS system or manually.
                    </p>
                  </div>
                </div>
                <span className="bg-[#FAF8F5] text-[#8C877D] border border-[#E5E0D8] px-2 py-0.5 rounded text-[9px] font-bold">
                  Optional Backup
                </span>
              </div>

              {/* Upload Drag & Drop Area */}
              <div className="border-2 border-dashed border-[#D4CFC6] hover:border-[#2D124D] rounded-2xl p-5 text-center bg-[#FAF8F5] transition-colors relative">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-10 h-10 rounded-full bg-[#EDE9FE] text-[#8B5CF6] flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#1A1615]">Upload Menu</div>
                <div className="text-[10px] text-[#8C877D] mt-0.5">Image or PDF (Max 10MB)</div>
                <button
                  type="button"
                  className="mt-3 px-3.5 py-1.5 bg-white border border-[#E5E0D8] hover:bg-[#FAF8F5] rounded-lg text-[11px] font-bold text-[#1A1615] shadow-2xs cursor-pointer"
                >
                  Browse Files
                </button>
              </div>

              {/* Uploaded File Preview */}
              {uploadedFileName && (
                <div className="p-3 bg-white border border-[#E5E0D8] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF5FF] text-[#8B5CF6] flex items-center justify-center font-bold">
                      <File className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-[#1A1615]">{uploadedFileName}</div>
                      <div className="text-[10px] text-[#8C877D]">{uploadedFileSize} • Ready to sync</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFileName(null)}
                    className="text-[#8C877D] hover:text-[#1A1615] p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Instant AI Menu Digitalization Info Card */}
              <div className="p-3 bg-[#FAF5FF] border border-[#F3E8FF] rounded-xl flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#2D124D] text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-[#2D124D]">Instant AI Menu Digitalization</div>
                  <div className="text-[11px] text-[#6E6A66] mt-0.5 leading-snug">
                    Uploaded menus are parsed automatically into modifiers, categories, and allergens for fast onboarding.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 4: REVIEW */}
        {/* ======================================================== */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Basic Info & POS Review Cards */}
              <div className="lg:col-span-6 space-y-6">
                {/* 1. Basic Information Review */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-5 space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F1EFEA]">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4 text-[#8B5CF6]" />
                      <h3 className="text-sm font-bold text-[#1A1615]">Basic Information</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-xs text-[#2D124D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Branch Name</span>
                      <span className="font-bold text-[#1A1615]">{branchName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Branch Type</span>
                      <span className="font-bold text-[#1A1615]">{branchType}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Branch Code</span>
                      <span className="font-mono font-bold text-[#1A1615]">{branchCode || 'BR001'}</span>
                    </div>
                    <div className="py-1">
                      <span className="text-[#8C877D] block mb-0.5">Description</span>
                      <span className="text-[#6E6A66] leading-relaxed">{description}</span>
                    </div>
                  </div>
                </div>

                {/* 2. POS & Menu Setup Review */}
                <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-5 space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F1EFEA]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#8B5CF6]" />
                      <h3 className="text-sm font-bold text-[#1A1615]">POS &amp; Menu Setup</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(3)}
                      className="text-xs text-[#2D124D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">POS Provider</span>
                      <span className="font-bold text-[#1A1615]">{posProvider}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">POS Terminal ID</span>
                      <span className="font-mono font-bold text-[#1A1615]">{posTerminalId}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Sync Menu with POS</span>
                      <span className="font-bold text-[#15803D]">
                        {syncMenuWithPos ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Menu File</span>
                      <span className="font-semibold text-[#1A1615]">
                        {uploadedFileName || 'Digital Menu'}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C877D]">Total Menu Items</span>
                      <span className="font-bold text-[#1A1615]">42 items</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Location Details Review with Mini Map */}
              <div className="lg:col-span-6 space-y-6">
                <div className="bg-white border border-[#EBE7DF] rounded-2xl shadow-2xs p-5 space-y-3.5">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#F1EFEA]">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8B5CF6]" />
                      <h3 className="text-sm font-bold text-[#1A1615]">Location Details</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-xs text-[#2D124D] font-bold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" /> Edit
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Address Line 1</span>
                      <span className="font-bold text-[#1A1615]">{addressLine1}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">City &amp; State</span>
                      <span className="font-bold text-[#1A1615]">
                        {city}, {state}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Postal / Zip Code</span>
                      <span className="font-mono font-bold text-[#1A1615]">{zipCode}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-[#F1EFEA]">
                      <span className="text-[#8C877D]">Country</span>
                      <span className="font-bold text-[#1A1615]">{country}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#8C877D]">Latitude &amp; Longitude</span>
                      <span className="font-mono text-[11px] text-[#6E6A66]">{latLng}</span>
                    </div>
                  </div>

                  {/* Visual Mini Map Preview */}
                  <div className="h-32 rounded-xl overflow-hidden border border-[#E5E0D8] relative flex items-center justify-center bg-gradient-to-tr from-[#F1EFEA] via-[#E8E4DC] to-[#FBF9F5]">
                    <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="30" x2="100%" y2="70" stroke="#CBD5E1" strokeWidth="4" />
                      <line x1="0" y1="90" x2="100%" y2="80" stroke="#CBD5E1" strokeWidth="6" />
                      <line x1="70" y1="0" x2="120" y2="100%" stroke="#E2E8F0" strokeWidth="5" />
                    </svg>
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-7 h-7 rounded-full bg-[#2D124D] text-white flex items-center justify-center shadow-md border-2 border-white">
                        <MapPin className="w-3.5 h-3.5 fill-white" />
                      </div>
                      <span className="mt-1 bg-white/95 px-2 py-0.5 rounded text-[9px] font-bold text-[#1A1615] shadow-xs">
                        {addressLine1}, {city}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instant Provisioning Notice */}
                <div className="p-4 bg-[#FAF5FF] border border-[#F3E8FF] rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#2D124D] text-white flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#2D124D]">Instant Provisioning</div>
                    <div className="text-[11px] text-[#6E6A66] mt-0.5">
                      Your branch, menu and POS settings will be synced automatically after submission.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Actions Row */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DD]">
          <button
            type="button"
            onClick={handleBack}
            className="px-5 py-2.5 rounded-xl border border-[#E5E0D8] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#6E6A66] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{currentStep === 1 ? 'Cancel' : 'Back'}</span>
          </button>

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-[#2D124D] hover:bg-[#3E1A68] text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#2D124D] hover:bg-[#3E1A68] text-white text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              <Rocket className="w-4 h-4" />
              <span>{isSubmitting ? 'Provisioning...' : 'Submit & Create Branch'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {isSuccessModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 text-center space-y-4 border border-[#E5E0D8] animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1A1615]">Branch Created Successfully!</h3>
              <p className="text-xs text-[#6E6A66] mt-1">
                <strong>{branchName}</strong> has been provisioned and added to your active branches.
              </p>
            </div>
            <button
              onClick={() => {
                setIsSuccessModalOpen(false);
                onNavigate('/branches');
              }}
              className="w-full py-2.5 bg-[#2D124D] hover:bg-[#3E1A68] text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
            >
              Go to Branches Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddNewBranchPage;
