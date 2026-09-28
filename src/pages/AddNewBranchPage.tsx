import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  ArrowLeft,
  X,
  Settings,
  RotateCw,
  Coffee,
  Store,
  Wine,
  Tent,
  Clock,
  Phone,
  Mail,
  Minus,
  Plus,
  Rocket,
  Radio,
  Wifi,
  ChevronDown,
  Download,
  Info,
  CheckCircle2,
  ShieldCheck,
  Check
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';

interface AddNewBranchPageProps {
  onNavigate: (route: NavRoute) => void;
  onAddBranch: (branch: OutletsData) => void;
}

type VenueProfile = 'roastery' | 'boutique' | 'tasting' | 'popup';

export const AddNewBranchPage: React.FC<AddNewBranchPageProps> = ({
  onNavigate,
  onAddBranch,
}) => {
  const { checkAndDeductCredit } = useWallet();

  // Form State initialized as empty
  const [branchName, setBranchName] = useState('');
  const [outletCode, setOutletCode] = useState('');
  const [venueProfile, setVenueProfile] = useState<VenueProfile>('roastery');

  // Physical Address
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');

  // Operating Hours
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ]);
  const [openTime, setOpenTime] = useState('07:30');
  const [closeTime, setCloseTime] = useState('20:00');

  // Contact
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  
  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Phase 2: POS & Hardware
  const [posCount, setPosCount] = useState<number>(2);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(true);
  const [manager, setManager] = useState(
    'Elena Rostova — Master Q-Grader & NYC Regional Lead'
  );

  // Status & Live preview toggle
  const [liveRenderActive, setLiveRenderActive] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showDownloadToast, setShowDownloadToast] = useState<boolean>(false);

  // Available days
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== day));
      }
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  // Generate randomized outlet code
  const handleRegenerateCode = () => {
    const prefixes = ['NYC', 'SOHO', 'MANH', 'BKLYN', 'WST'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = String(Math.floor(Math.random() * 90) + 10);
    setOutletCode(`REV-${randomPrefix}-${randomNum}`);
  };

  // Provision and launch branch handler (CREDIT GATED)
  const handleProvisionBranch = () => {
    const newErrors: Record<string, string> = {};
    if (!branchName.trim()) newErrors.branchName = 'Branch name is required';
    if (!outletCode.trim()) newErrors.outletCode = 'Outlet code is required';
    if (!streetAddress.trim()) newErrors.streetAddress = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    if (!country.trim()) newErrors.country = 'Country is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';
    if (!email.trim()) newErrors.email = 'Email address is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const branchId = `branch-rev-${Date.now()}`;
    const allowed = checkAndDeductCredit('branch_setup', 100, branchId, 'New Branch Setup');
    if (!allowed) {
      return; // Blocked due to insufficient wallet credits
    }

    setIsSubmitting(true);

    const createdOutlet: OutletsData = {
      id: branchId,
      name: branchName || 'New Outlet',
      shortName: branchName.split(' ')[0] || 'Outlet',
      type: venueProfile === 'roastery' ? 'Primary Hub' : 'Active',
      address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
      manager: manager.split('—')[0].trim(),
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      terminalsActive: posCount,
      membersLinked: '1,420 Linked',
      volume30d: '₹34,800',
      hours: `${selectedDays[0]}–${selectedDays[selectedDays.length - 1]} ${openTime} – ${closeTime}`,
      timezone: 'EDT (America/New_York)',
      currency: 'INR ($)',
      taxProfile: 'NY State + NYC Sales Tax (8.875%)',
      hardware: [
        {
          name: 'Terminal 1 (Counter POS)',
          badge: 'Square',
          detail: `Square Register v2.4 • Online, just now`,
          icon: 'register',
        },
        ...(posCount > 1
          ? [
            {
              name: `Terminal 2 (Mobile Order Pickup)`,
              badge: 'Clover' as const,
              detail: `Clover Mini POS • Online, just now`,
              icon: 'pos' as const,
            },
          ]
          : []),
        {
          name: `Beacon #${outletCode.replace('REV-', '')} (Front NFC Stand)`,
          badge: 'Revia Stand',
          detail: `Smart Beacon #${outletCode} • Online & Paired`,
          icon: 'beacon',
        },
      ],
      loyaltyRules: {
        baseMultiplier: '1.0× (Standard)',
        specialRuleName: 'Grand Opening Welcome Tier',
        specialRuleTime: 'All Day First 30 Days',
        specialRuleBadge: 'Active Now',
        specialMultiplier: '2.0× Active',
        exclusivePerk: 'Complimentary Single Origin Pour-Over for Obsidian VIPs',
      },
    };

    setTimeout(() => {
      onAddBranch(createdOutlet);
      setIsSubmitting(false);
      onNavigate('/branches');
    }, 600);
  };

  const handleDownloadKit = () => {
    setShowDownloadToast(true);
    setTimeout(() => setShowDownloadToast(false), 3500);
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-6">
      {/* Toast feedback for PDF kit download */}
      {showDownloadToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
          <div>
            <div className="text-xs font-bold">Display Print Kit Generated</div>
            <div className="text-[11px] text-[#A8A29E]">
              Downloaded acrylic stand assets (.PDF) for {outletCode}
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Back link */}
          <button
            onClick={() => onNavigate('/branches')}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#7C746C] hover:text-[#1A1615] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Branches</span>
          </button>

          {/* Page Title with Staging Tier Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
              Add New Branch / Outlet
            </h1>
            <span className="bg-[#FAF6EE] border border-[#E5D7BE] text-[#9E782F] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              STAGING TIER
            </span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/branches')}
            className="px-4 py-2 rounded-lg border border-[#EAE6E1] bg-white hover:bg-[#FAF8F5] text-[13px] font-semibold text-[#1A1615] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6E6A66]" />
            <span>Discard Draft</span>
          </button>

          <button
            onClick={handleProvisionBranch}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white text-[13px] font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            <Rocket className="w-4 h-4 text-white" />
            <span>Provision &amp; Launch Branch</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Phases (Left) & Live Counter Stand Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Phase 01 & Phase 02 */}
        <div className="lg:col-span-8 space-y-6">
          {/* ================= PHASE 01 CARD ================= */}
          <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-2xs overflow-hidden border-l-4 border-l-[#B38637]">
            <div className="p-6 space-y-6">
              {/* Card Header with Phase Pill and Code Pill */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div>
                  {/* <span className="inline-block bg-[#FAF6EE] text-[#9E782F] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase mb-1">
                    PHASE 01
                  </span> */}
                  <h2 className="text-base font-bold text-[#1A1615]">
                    Basic Identity &amp; Location
                  </h2>
                  <p className="text-xs text-[#7C746C] mt-0.5">
                    Establish venue registry, physical geography, and guest contact points.
                  </p>
                </div>

                {/* Outlet Identifier Pill with Refresh Icon */}
                <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#EAE6E1] px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold text-[#5C554E] shrink-0">
                  <span>CODE: {outletCode}</span>
                  <button
                    onClick={handleRegenerateCode}
                    title="Generate new outlet code"
                    className="p-0.5 hover:text-[#1A1615] transition-colors cursor-pointer"
                  >
                    <RotateCw className="w-3 h-3 text-[#8C827A]" />
                  </button>
                </div>
              </div>

              {/* Branch Display Name & Outlet Identifier Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Branch Display Name <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={branchName}
                    onChange={(e) => { setBranchName(e.target.value); if (errors.branchName) setErrors({ ...errors, branchName: '' }); }}
                    placeholder="e.g. SoHo Roastery & Tasting Salon"
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.branchName ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                  />
                  {errors.branchName && <p className="text-[10px] text-[#D32F2F] font-medium">{errors.branchName}</p>}
                </div>

                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Outlet Identifier <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className={`flex items-center px-3 py-2 bg-[#FAF8F5] border ${errors.outletCode ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#5C554E] font-mono font-medium`}>
                    <span className="text-[#8C827A] mr-1">#</span>
                    <input
                      type="text"
                      value={outletCode}
                      onChange={(e) => { setOutletCode(e.target.value); if (errors.outletCode) setErrors({ ...errors, outletCode: '' }); }}
                      placeholder="REV-NYC-04"
                      className="w-full bg-transparent focus:outline-none text-[#1A1615]"
                    />
                  </div>
                  {errors.outletCode && <p className="text-[10px] text-[#D32F2F] font-medium">{errors.outletCode}</p>}
                </div>
              </div>

              {/* Venue Classification Profile */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#3D3732] block">
                  Venue Classification Profile
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* Option 1: Flagship Roastery */}
                  <button
                    type="button"
                    onClick={() => setVenueProfile('roastery')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'roastery'
                      ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Coffee className={`w-4 h-4 mb-2 ${venueProfile === 'roastery' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Flagship Roastery
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'roastery' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Full production
                    </div>
                  </button>

                  {/* Option 2: Boutique Cafe */}
                  <button
                    type="button"
                    onClick={() => setVenueProfile('boutique')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'boutique'
                      ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Store className={`w-4 h-4 mb-2 ${venueProfile === 'boutique' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Boutique Cafe
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'boutique' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Express format
                    </div>
                  </button>

                  {/* Option 3: Tasting Room */}
                  <button
                    type="button"
                    onClick={() => setVenueProfile('tasting')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'tasting'
                      ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Wine className={`w-4 h-4 mb-2 ${venueProfile === 'tasting' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Tasting Room
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'tasting' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Invitation only
                    </div>
                  </button>

                  {/* Option 4: Pop-Up Atelier */}
                  <button
                    type="button"
                    onClick={() => setVenueProfile('popup')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'popup'
                      ? 'bg-[#B38637] text-white border-[#B38637] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Tent className={`w-4 h-4 mb-2 ${venueProfile === 'popup' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Pop-Up Kiosk
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'popup' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Seasonal space
                    </div>
                  </button>
                </div>
              </div>

              {/* Physical Address */}
              <div className="space-y-2.5">
                <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                  Physical Address <span className="text-[#D32F2F]">*</span>
                </label>
                {/* Line 1: Street */}
                <div>
                  <input
                    type="text"
                    value={streetAddress}
                    onChange={(e) => { setStreetAddress(e.target.value); if (errors.streetAddress) setErrors({ ...errors, streetAddress: '' }); }}
                    placeholder="Street Address, Suite / Floor"
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.streetAddress ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                  />
                  {errors.streetAddress && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.streetAddress}</p>}
                </div>

                {/* Line 2: City, State, Zip, Country */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors({ ...errors, city: '' }); }}
                      placeholder="City"
                      className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.city ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                    {errors.city && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => { setState(e.target.value); if (errors.state) setErrors({ ...errors, state: '' }); }}
                      placeholder="State"
                      className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.state ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                    {errors.state && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.state}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => { setZipCode(e.target.value); if (errors.zipCode) setErrors({ ...errors, zipCode: '' }); }}
                      placeholder="Zip Code"
                      className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.zipCode ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                    {errors.zipCode && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.zipCode}</p>}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => { setCountry(e.target.value); if (errors.country) setErrors({ ...errors, country: '' }); }}
                      placeholder="Country"
                      className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.country ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                    {errors.country && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.country}</p>}
                  </div>
                </div>
              </div>

              {/* Standard Operating Hours & Sync Window Box */}
              <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 space-y-3">
                {/* Header: Clock + Timezone */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#B38637]" />
                    <span className="text-xs font-bold text-[#1A1615]">
                      Standard Operating Hours &amp; Sync Window
                    </span>
                  </div>
                  <span className="text-xs text-[#7C746C]">
                    Timezone: Eastern Daylight (UTC-4)
                  </span>
                </div>

                {/* Day selector chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {DAYS.map((day) => {
                    const isSelected = selectedDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(day)}
                        className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer ${isSelected
                          ? 'bg-[#B38637] text-white'
                          : 'bg-white text-[#7C746C] border border-[#EAE6E1] hover:bg-[#F5F2EC]'
                          }`}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {/* Open & Close hours pills */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg px-3 py-1.5">
                    <span className="text-xs text-[#7C746C]">Open:</span>
                    <input
                      type="time"
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="text-xs font-bold text-[#1A1615] w-24 focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg px-3 py-1.5">
                    <span className="text-xs text-[#7C746C]">Close:</span>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="text-xs font-bold text-[#1A1615] w-24 focus:outline-none bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Concierge Phone & Outlet Mailbox */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Concierge &amp; Order Phone <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                      placeholder="+1 (000) 000-0000"
                      className={`w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border ${errors.phone ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.phone}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Dedicated Outlet Mailbox <span className="text-[#D32F2F]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: '' }); }}
                      placeholder="branch@revia.coffee"
                      className={`w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border ${errors.email ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.email}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ================= PHASE 02 CARD ================= */}
          {/* <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-2xs overflow-hidden border-l-4 border-l-[#15803D]">
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div>
                  <span className="inline-block bg-[#FAF6EE] text-[#9E782F] text-[10px] font-bold tracking-wider px-2 py-0.5 rounded uppercase mb-1">
                    PHASE 02
                  </span>
                  <h2 className="text-base font-bold text-[#1A1615]">
                    POS &amp; Hardware Station Config
                  </h2>
                  <p className="text-xs text-[#7C746C] mt-0.5">
                    Provision counter hardware instances, NFC taps, and assign responsible keyholder.
                  </p>
                </div>

                <div className="flex items-center gap-1.5 bg-[#EBF7F0] border border-[#CEEBD9] px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#15803D] shrink-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                  <span>Mesh Ready</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1A1615]">
                        Counter POS Terminals
                      </div>
                      <div className="text-[11px] text-[#7C746C]">
                        Live sync mesh nodes
                      </div>
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg p-1 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setPosCount(Math.max(1, posCount - 1))}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#5C554E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Decrease terminals"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-mono font-bold text-xs text-[#1A1615] w-5 text-center">
                        {posCount}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPosCount(Math.min(8, posCount + 1))}
                        className="w-6 h-6 rounded flex items-center justify-center text-[#5C554E] hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                        title="Increase terminals"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#EAE6E1] text-[11px] text-[#7C746C] flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                    <span>Includes {posCount} dedicated receipt printers &amp; customer displays.</span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 flex flex-col justify-between space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-md bg-[#FAF6EE] flex items-center justify-center text-[#B38637]">
                        <Wifi className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs font-bold text-[#1A1615]">
                        NFC Tap-to-Stamp Station
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setNfcEnabled(!nfcEnabled)}
                      className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${
                        nfcEnabled ? 'bg-[#15803D]' : 'bg-[#D1C9BE]'
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                          nfcEnabled ? 'right-0.5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  <p className="text-[11px] text-[#7C746C] leading-snug">
                    Supports Apple &amp; Google Wallet passes instantly without app installation.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#3D3732] block">
                  Designated General Manager
                </label>
                <div className="relative">
                  <select
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    className="w-full appearance-none px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors cursor-pointer pr-8"
                  >
                    <option value="Elena Rostova — Master Q-Grader & NYC Regional Lead">
                      Elena Rostova — Master Q-Grader &amp; NYC Regional Lead
                    </option>
                    <option value="Liam Thorn — Head of Operations & Roasting Specialist">
                      Liam Thorn — Head of Operations &amp; Roasting Specialist
                    </option>
                    <option value="Chloe Zhao — Retail & Customer Experience Director">
                      Chloe Zhao — Retail &amp; Customer Experience Director
                    </option>
                    <option value="Mateo Silva — Lead Barista & Equipment Tech">
                      Mateo Silva — Lead Barista &amp; Equipment Tech
                    </option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#8C827A] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* Right Column: Counter Stand Preview & Deployment Kit */}
        <div className="lg:col-span-4 space-y-4">
          {/* Header with Counter Stand Preview title & Live Render pill */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-[#1A1615]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 17h10M9 7h6M9 12h6" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#1A1615]">
                Counter Stand Preview
              </span>
            </div>

            <button
              onClick={() => setLiveRenderActive(!liveRenderActive)}
              className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#EAE6E1] px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-[#5C554E] hover:bg-[#F5F2EC] cursor-pointer"
            >
              <span className={`w-1.5 h-1.5 rounded-full ${liveRenderActive ? 'bg-[#15803D] animate-pulse' : 'bg-[#9E9A93]'}`} />
              <span>Live Render</span>
            </button>
          </div>

          {/* PHYSICAL COUNTER STAND MOCKUP (Black Acrylic Finish) */}
          <div className="bg-[#1A1615] border border-neutral-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            {/* Top header row */}
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold tracking-widest text-[#D4A753] uppercase">
                REVIA ROASTERS &amp; CO.
              </span>
              <span className="bg-[#2E281F] text-[#D4A753] border border-[#59482C] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ● STAGING
              </span>
            </div>

            {/* Dynamic Branch Title */}
            <h3 className="text-base font-bold text-white mt-2 leading-tight">
              {branchName || 'SoHo Roastery & Tasting Salon'}
            </h3>

            {/* Dynamic Street Address */}
            <div className="text-xs text-[#A8A29E] mt-1 flex items-center gap-1">
              <span className="text-[#D4A753]">📍</span>
              <span className="truncate">
                {streetAddress || '482 Broome Street'}, {city || 'New York'}
              </span>
            </div>

            {/* White Acrylic Stand Card insert with QR Code */}
            <div className="bg-white rounded-xl p-4 my-4 shadow-md text-center text-[#1A1615] max-w-[240px] mx-auto">
              {/* High-definition QR Code Representation with Revia Logo in Center */}
              <div className="relative mx-auto w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 140 140" className="w-full h-full">
                  {/* Top-Left Position Marker */}
                  <rect x="10" y="10" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="16" y="16" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="22" y="22" width="10" height="10" rx="1" fill="#1A1615" />

                  {/* Top-Right Position Marker */}
                  <rect x="96" y="10" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="102" y="16" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="108" y="22" width="10" height="10" rx="1" fill="#1A1615" />

                  {/* Bottom-Left Position Marker */}
                  <rect x="10" y="96" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="16" y="102" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="22" y="108" width="10" height="10" rx="1" fill="#1A1615" />

                  {/* Timing & Data Pattern Matrix */}
                  <rect x="48" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="14" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="26" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="26" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="38" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="38" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="38" width="6" height="6" fill="#1A1615" />

                  {/* Middle Left Blocks */}
                  <rect x="14" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="26" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="14" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="32" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="14" y="76" width="6" height="6" fill="#1A1615" />
                  <rect x="26" y="76" width="6" height="6" fill="#1A1615" />

                  {/* Middle Right Blocks */}
                  <rect x="96" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="108" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="120" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="96" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="114" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="96" y="76" width="6" height="6" fill="#1A1615" />
                  <rect x="120" y="76" width="6" height="6" fill="#1A1615" />

                  {/* Bottom Center Blocks */}
                  <rect x="48" y="96" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="96" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="96" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="96" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="108" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="108" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="120" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="120" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="120" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="120" width="6" height="6" fill="#1A1615" />

                  {/* Center Emblem with stylized R */}
                  <rect x="54" y="54" width="32" height="32" rx="6" fill="#FFFFFF" />
                  <rect x="58" y="58" width="24" height="24" rx="4" fill="#B38637" />
                  <text x="70" y="75" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="serif" textAnchor="middle">
                    R
                  </text>
                </svg>
              </div>

              {/* Subtitle below QR */}
              <div className="text-[9px] font-bold tracking-widest text-[#8C827A] uppercase mt-2">
                TAP NFC OR SCAN
              </div>
              <div className="text-xs font-semibold text-[#1A1615] mt-0.5">
                Instant Tasting Stamp
              </div>
            </div>

            {/* Stand footer info */}
            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8A29E]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                <span>
                  {posCount === 1 ? 'Terminal #1 Paired' : `Terminal #1 & #${posCount} Paired`}
                </span>
              </div>
              <span className="bg-[#B38637] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                2.0× Active
              </span>
            </div>
          </div>

          {/* AUTOMATIC DEPLOYMENT KIT */}
          <div className="space-y-2 pt-2">
            <span className="text-[10px] font-bold tracking-wider text-[#8C827A] uppercase block">
              AUTOMATIC DEPLOYMENT KIT
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="font-medium">
                  {posCount === 2 ? 'Dual' : `${posCount}x`} POS Mesh Nodes Ready
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="font-medium">
                  NFC Private Crypto-Keys Auto-Generated
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="font-medium">
                  Global Roastery Stamp Ledger Linked
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0" />
                <span className="font-medium">
                  Digital Wallet Counter Beacon Configured
                </span>
              </div>
            </div>
          </div>

          {/* Info notification box */}
          <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-3.5 text-xs text-[#7C746C] flex items-start gap-2.5">
            <Info className="w-4 h-4 text-[#B38637] shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[11px]">
              Once launched, unique high-resolution QR counter acrylic display stand assets and hardware NFC pairing credentials will be instantly downloadable.
            </p>
          </div>

          {/* Download Display Print Kit (.PDF) Button */}
          <button
            type="button"
            onClick={handleDownloadKit}
            className="w-full px-4 py-2 bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[13px] font-bold text-[#1A1615] flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#6E6A66]" />
            <span>Download Display Print Kit (.PDF)</span>
          </button>

          {/* STANDARD BLUEPRINT Card */}
          {/* <div className="bg-white border border-[#EAE6E1] rounded-xl p-3 flex items-center gap-3 shadow-2xs">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-[#EAE6E1]">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=150&auto=format&fit=crop&q=80"
                alt="Standard Blueprint"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] uppercase font-bold text-[#8C827A] tracking-wider">
                STANDARD BLUEPRINT
              </div>
              <div className="text-xs font-bold text-[#1A1615]">
                Atelier Standard v4.2
              </div>
              <div className="text-[11px] text-[#7C746C] truncate">
                Pre-approved acoustics &amp; bar flow layout applied.
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
