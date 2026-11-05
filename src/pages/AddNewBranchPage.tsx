import React, { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import {
  ArrowLeft,
  X,
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
  Check,
  MapPin,
  Sparkles
} from 'lucide-react';
import { NavRoute, OutletsData } from '../types';
import { BRANCH_HIERARCHY_DATA } from '../data/branchHierarchyData';

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

  // Form State
  const [branchName, setBranchName] = useState('');
  const [outletCode, setOutletCode] = useState('REV-IN-01');
  const [venueProfile, setVenueProfile] = useState<VenueProfile>('roastery');

  // Physical Address (Defaulting to Indian Hierarchy)
  const [streetAddress, setStreetAddress] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [city, setCity] = useState('Noida');
  const [zipCode, setZipCode] = useState('201301');
  const [country, setCountry] = useState('India');

  // Operating Hours
  const [selectedDays, setSelectedDays] = useState<string[]>([
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
  ]);
  const [openTime, setOpenTime] = useState('11:00');
  const [closeTime, setCloseTime] = useState('23:00');

  // Contact
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('manager@revia.com');
  const [manager, setManager] = useState('Rohit Mehta — Regional Store Lead');

  // Validation State
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Hardware
  const [posCount, setPosCount] = useState<number>(2);
  const [nfcEnabled, setNfcEnabled] = useState<boolean>(true);

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
    const prefixes = ['NOIDA', 'DEL', 'MUM', 'BLR', 'LKO'];
    const randomPrefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const randomNum = String(Math.floor(Math.random() * 90) + 10);
    setOutletCode(`REV-${randomPrefix}-${randomNum}`);
  };

  // Handle State Change and update city suggestions
  const handleStateChange = (selectedState: string) => {
    setState(selectedState);
    const found = BRANCH_HIERARCHY_DATA.find((s) => s.name === selectedState);
    if (found && found.cities.length > 0) {
      setCity(found.cities[0].name);
    }
  };

  // Provision and launch branch handler (CREDIT GATED)
  const handleProvisionBranch = () => {
    const newErrors: Record<string, string> = {};
    if (!branchName.trim()) newErrors.branchName = 'Branch name is required';
    if (!outletCode.trim()) newErrors.outletCode = 'Outlet code is required';
    if (!streetAddress.trim()) newErrors.streetAddress = 'Address is required';
    if (!city.trim()) newErrors.city = 'City is required';
    if (!state.trim()) newErrors.state = 'State is required';
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

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
      name: branchName || `${city} — New Branch`,
      shortName: branchName.split('—')[1]?.trim() || branchName.split(' ')[0] || city,
      type: venueProfile === 'roastery' ? 'Primary Hub' : 'Active',
      address: `${streetAddress}, ${city}, ${state} ${zipCode}`,
      manager: manager.split('—')[0].trim(),
      managerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      terminalsActive: posCount,
      membersLinked: '1,420 Linked',
      volume30d: '₹1,62,400',
      hours: `${selectedDays[0]}–${selectedDays[selectedDays.length - 1]} ${openTime} – ${closeTime}`,
      timezone: 'IST (India Standard Time, UTC+5:30)',
      currency: 'INR (₹)',
      taxProfile: 'GST (18%)',
      hardware: [
        {
          name: 'Terminal 1 (Counter POS)',
          badge: 'Square',
          detail: 'Terminal Node v2.4 • Online, just now',
          icon: 'register',
        },
        ...(posCount > 1
          ? [
            {
              name: 'Terminal 2 (Mobile Order Pickup)',
              badge: 'Clover' as const,
              detail: 'Terminal Mini POS • Online, just now',
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
        specialRuleName: 'Welcome Special Promotion',
        specialRuleTime: 'All Day First 30 Days',
        specialRuleBadge: 'Active Now',
        specialMultiplier: '2.0× Active',
        exclusivePerk: 'Complimentary Beverage for VIPs',
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
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D124D] text-white px-4 py-3 rounded-xl shadow-2xl border border-purple-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <div className="text-xs font-bold">Display Print Kit Generated</div>
            <div className="text-[11px] text-purple-200">
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
            className="flex items-center gap-1.5 text-xs font-semibold text-[#8C877D] hover:text-[#1A1615] transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Branches</span>
          </button>

          {/* Page Title with Staging Tier Badge */}
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
              Add New Branch / Outlet
            </h1>
            <span className="bg-[#FAF5FF] border border-[#F3E8FF] text-[#6D28D9] text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              STAGING TIER
            </span>
          </div>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('/branches')}
            className="px-4 py-2 rounded-xl border border-[#EAE6E1] bg-white hover:bg-[#FAF8F5] text-[13px] font-semibold text-[#1A1615] flex items-center gap-2 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-[#6E6A66]" />
            <span>Discard Draft</span>
          </button>

          <button
            onClick={handleProvisionBranch}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl bg-[#2D124D] hover:bg-[#3E1A68] text-white text-[13px] font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Rocket className="w-4 h-4 text-white" />
            <span>{isSubmitting ? 'Provisioning...' : 'Provision & Launch Branch'}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form Phases (Left) & Live Counter Stand Preview (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Phase 01 */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-2xs overflow-hidden border-l-4 border-l-[#2D124D]">
            <div className="p-6 space-y-6">
              {/* Card Header with Phase Pill and Code Pill */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                <div>
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
                    placeholder="e.g. Noida — Sector 18"
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.branchName ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D] transition-colors`}
                  />
                  {errors.branchName && <p className="text-[10px] text-[#D32F2F] font-medium">{errors.branchName}</p>}
                </div>

                <div className="md:col-span-5 space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Outlet Identifier <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={outletCode}
                    onChange={(e) => setOutletCode(e.target.value)}
                    placeholder="REV-IN-01"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs font-mono font-semibold text-[#1A1615] focus:outline-none focus:border-[#2D124D]"
                  />
                </div>
              </div>

              {/* Venue Profile Segmented Radio Grid */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#3D3732] block">
                  Venue Profile Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVenueProfile('roastery')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'roastery'
                      ? 'bg-[#2D124D] text-white border-[#2D124D] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Coffee className={`w-4 h-4 mb-2 ${venueProfile === 'roastery' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Flagship Hub
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'roastery' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Full service outlet
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenueProfile('boutique')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'boutique'
                      ? 'bg-[#2D124D] text-white border-[#2D124D] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Store className={`w-4 h-4 mb-2 ${venueProfile === 'boutique' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Express Counter
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'boutique' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Compact retail kiosk
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenueProfile('tasting')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'tasting'
                      ? 'bg-[#2D124D] text-white border-[#2D124D] shadow-xs'
                      : 'bg-white border-[#EAE6E1] text-[#1A1615] hover:bg-[#FAF8F5]'
                      }`}
                  >
                    <Wine className={`w-4 h-4 mb-2 ${venueProfile === 'tasting' ? 'text-white' : 'text-[#8C827A]'}`} />
                    <div className="text-xs font-bold leading-tight">
                      Dining &amp; Lounge
                    </div>
                    <div className={`text-[10px] mt-0.5 ${venueProfile === 'tasting' ? 'text-white/80' : 'text-[#7C746C]'}`}>
                      Seated experiences
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVenueProfile('popup')}
                    className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${venueProfile === 'popup'
                      ? 'bg-[#2D124D] text-white border-[#2D124D] shadow-xs'
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
                    placeholder="e.g. Shop 12, Logix Mall, Sector 18"
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.streetAddress ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D] transition-colors`}
                  />
                  {errors.streetAddress && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.streetAddress}</p>}
                </div>

                {/* Line 2: State, City, Zip, Country */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div>
                    <label className="text-[10px] font-bold text-[#8C877D] uppercase mb-1 block">State</label>
                    <select
                      value={state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      className="w-full px-2.5 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs font-semibold text-[#1A1615] focus:outline-none focus:border-[#2D124D]"
                    >
                      {BRANCH_HIERARCHY_DATA.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8C877D] uppercase mb-1 block">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => { setCity(e.target.value); if (errors.city) setErrors({ ...errors, city: '' }); }}
                      placeholder="e.g. Noida"
                      className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.city ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D] transition-colors`}
                    />
                    {errors.city && <p className="text-[10px] text-[#D32F2F] font-medium mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8C877D] uppercase mb-1 block">PIN / Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      placeholder="e.g. 201301"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D]"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8C877D] uppercase mb-1 block">Country</label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="India"
                      className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D]"
                    />
                  </div>
                </div>
              </div>

              {/* Standard Operating Hours */}
              <div className="bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#7C3AED]" />
                    <span className="text-xs font-bold text-[#1A1615]">
                      Standard Operating Hours &amp; Sync Window
                    </span>
                  </div>
                  <span className="text-xs text-[#7C746C]">
                    Timezone: IST (UTC+5:30)
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
                          ? 'bg-[#2D124D] text-white shadow-xs'
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
                      className="text-xs font-bold text-[#1A1615] bg-transparent outline-none cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center gap-2 bg-white border border-[#EAE6E1] rounded-lg px-3 py-1.5">
                    <span className="text-xs text-[#7C746C]">Close:</span>
                    <input
                      type="time"
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="text-xs font-bold text-[#1A1615] bg-transparent outline-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Store Manager Name
                  </label>
                  <input
                    type="text"
                    value={manager}
                    onChange={(e) => setManager(e.target.value)}
                    placeholder="e.g. Rohit Mehta"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#3D3732] flex items-center gap-1">
                    Direct Contact Phone <span className="text-[#D32F2F]">*</span>
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => { setPhone(e.target.value); if (errors.phone) setErrors({ ...errors, phone: '' }); }}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${errors.phone ? 'border-[#D32F2F]' : 'border-[#EAE6E1]'} rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#2D124D]`}
                  />
                  {errors.phone && <p className="text-[10px] text-[#D32F2F] font-medium">{errors.phone}</p>}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Counter Stand Preview & Deployment Kit */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Store className="w-4 h-4 text-[#2D124D]" />
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

          {/* PHYSICAL COUNTER STAND MOCKUP */}
          <div className="bg-[#1A1615] border border-neutral-800 rounded-2xl p-5 text-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-mono font-bold tracking-widest text-purple-300 uppercase">
                LOYALTICS MERCHANT SUITE
              </span>
              <span className="bg-[#2D124D] text-[#E9D5FF] border border-[#6D28D9] text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                ● STAGING
              </span>
            </div>

            <h3 className="text-base font-bold text-white mt-2 leading-tight">
              {branchName || `${city} — Outlet Hub`}
            </h3>

            <div className="text-xs text-[#A8A29E] mt-1 flex items-center gap-1">
              <span className="text-[#C084FC]">📍</span>
              <span className="truncate">
                {streetAddress || 'Sector 18, Logix Mall'}, {city || 'Noida'}, {state}
              </span>
            </div>

            {/* Acrylic Stand Card insert with QR Code */}
            <div className="bg-white rounded-xl p-4 my-4 shadow-md text-center text-[#1A1615] max-w-[240px] mx-auto">
              <div className="relative mx-auto w-36 h-36 bg-white p-2 rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 140 140" className="w-full h-full">
                  <rect x="10" y="10" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="16" y="16" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="22" y="22" width="10" height="10" rx="1" fill="#1A1615" />

                  <rect x="96" y="10" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="102" y="16" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="108" y="22" width="10" height="10" rx="1" fill="#1A1615" />

                  <rect x="10" y="96" width="34" height="34" rx="4" fill="#1A1615" />
                  <rect x="16" y="102" width="22" height="22" rx="2" fill="#FFFFFF" />
                  <rect x="22" y="108" width="10" height="10" rx="1" fill="#1A1615" />

                  <rect x="48" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="14" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="14" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="26" width="6" height="6" fill="#1A1615" />
                  <rect x="84" y="26" width="6" height="6" fill="#1A1615" />

                  <rect x="48" y="38" width="6" height="6" fill="#1A1615" />
                  <rect x="60" y="38" width="6" height="6" fill="#1A1615" />
                  <rect x="72" y="38" width="6" height="6" fill="#1A1615" />

                  <rect x="14" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="26" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="14" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="32" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="14" y="76" width="6" height="6" fill="#1A1615" />
                  <rect x="26" y="76" width="6" height="6" fill="#1A1615" />

                  <rect x="96" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="108" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="120" y="52" width="6" height="6" fill="#1A1615" />
                  <rect x="96" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="114" y="64" width="6" height="6" fill="#1A1615" />
                  <rect x="96" y="76" width="6" height="6" fill="#1A1615" />
                  <rect x="120" y="76" width="6" height="6" fill="#1A1615" />

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

                  {/* Center Emblem with stylized brand icon */}
                  <rect x="54" y="54" width="32" height="32" rx="6" fill="#FFFFFF" />
                  <rect x="58" y="58" width="24" height="24" rx="4" fill="#2D124D" />
                  <text x="70" y="75" fill="#FFFFFF" fontSize="15" fontWeight="900" fontFamily="sans-serif" textAnchor="middle">
                    L
                  </text>
                </svg>
              </div>

              <div className="text-[9px] font-bold tracking-widest text-[#8C827A] uppercase mt-2">
                TAP NFC OR SCAN
              </div>
              <div className="text-xs font-semibold text-[#1A1615] mt-0.5">
                Instant Guest Stamp
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[11px] text-[#A8A29E]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>
                  {posCount === 1 ? 'Terminal #1 Paired' : `Terminal #1 & #${posCount} Paired`}
                </span>
              </div>
              <span className="bg-[#2D124D] border border-purple-500 text-purple-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
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
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  {posCount === 2 ? 'Dual' : `${posCount}x`} POS Mesh Nodes Ready
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  NFC Private Crypto-Keys Auto-Generated
                </span>
              </div>

              <div className="flex items-center gap-2 text-[#3D3732]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Merchant Loyalty Ledger Linked
                </span>
              </div>
            </div>
          </div>

          {/* Download Display Print Kit (.PDF) Button */}
          <button
            type="button"
            onClick={handleDownloadKit}
            className="w-full px-4 py-2 bg-white hover:bg-[#FAF8F5] border border-[#EAE6E1] rounded-xl text-[13px] font-bold text-[#1A1615] flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#6E6A66]" />
            <span>Download Display Print Kit (.PDF)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
