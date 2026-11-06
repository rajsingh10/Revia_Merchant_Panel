import React, { useState } from 'react';
import {
  QrCode,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Search,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Ticket,
  Gift,
  Tag,
  BookOpen,
  User,
  Shield,
  Utensils,
  Truck,
  Layers,
  Download,
  Info,
  Plus
} from 'lucide-react';

interface Props {
  onNavigate?: (route: string) => void;
  onClose?: () => void;
}

export const MobileQrCodesView: React.FC<Props> = ({ onNavigate, onClose }) => {
  // Navigation inside wizard:
  // 'intro' | 'single_step1' to 'single_step6' | 'single_success' |
  // 'multi_step1' to 'multi_step7' | 'multi_step4b' | 'multi_success'
  const [screen, setScreen] = useState<string>('intro');
  const [qrType, setQrType] = useState<'single' | 'multiple'>('single');

  // Single QR state
  const [singleCustomerName, setSingleCustomerName] = useState('Rahul Sharma');
  const [singleCustomerPhone, setSingleCustomerPhone] = useState('9876543210');
  const [singleCampaigns, setSingleCampaigns] = useState<Record<string, boolean>>({
    welcome: true,
    birthday: true,
    loyalty: false,
    combo: false
  });
  const [singlePlacement, setSinglePlacement] = useState<'table' | 'delivery'>('table');
  const [singleRedemption, setSingleRedemption] = useState<'auto' | 'approval'>('auto');

  // Multiple QR state
  const [multiCampaigns, setMultiCampaigns] = useState<Record<string, boolean>>({
    welcome: true,
    birthday: true,
    loyalty: false,
    combo: false
  });
  const [multiUseCase, setMultiUseCase] = useState<'dine_in' | 'delivery' | 'both'>('dine_in');
  const [multiLocationType, setMultiLocationType] = useState<'tables' | 'counters' | 'both'>('both');
  const [selectedTables, setSelectedTables] = useState<Record<string, boolean>>({
    T1: true,
    T2: true,
    T4: true,
    T5: false,
    T6: false
  });
  const [selectedCounters, setSelectedCounters] = useState<Record<string, boolean>>({
    C1: true,
    C2: true,
    C3: false,
    C4: false
  });
  const [commonQrOptions, setCommonQrOptions] = useState({
    sameForTables: false,
    sameForCounters: false,
    oneCommonForBoth: true
  });
  const [validityType, setValidityType] = useState<'date_range' | 'fixed_duration' | 'no_expiry'>('date_range');
  const [validityScope, setValidityScope] = useState<'all' | 'separate'>('all');
  const [startDate, setStartDate] = useState('15 Sep 2025');
  const [startTime, setStartTime] = useState('10:00 AM');
  const [endDate, setEndDate] = useState('30 Sep 2025');
  const [endTime, setEndTime] = useState('10:00 PM');
  const [multiRedemption, setMultiRedemption] = useState<'auto' | 'approval'>('auto');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Helper for Stepper Header
  const renderStepper = (currentStep: number, totalSteps: 6 | 7) => {
    const singleLabels = ['QR Type', 'Audience', 'Offers', 'Placement', 'Rules', 'Review'];
    const multiLabels = ['QR Type', 'Campaigns', 'Use Case', 'Location', 'Validity', 'Redeem', 'Review'];
    const labels = totalSteps === 6 ? singleLabels : multiLabels;

    return (
      <div className="px-4 py-2 bg-transparent select-none shrink-0">
        <div className="relative flex items-center justify-between">
          {/* Connector Line behind circles */}
          <div className="absolute left-4 right-4 top-3 h-0.5 bg-purple-100 -z-0" />

          {labels.map((lbl, idx) => {
            const stepNum = idx + 1;
            const isPassed = stepNum < currentStep;
            const isCurrent = stepNum === currentStep;

            return (
              <div key={lbl} className="flex flex-col items-center gap-1 relative z-10">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isPassed
                      ? 'bg-[#1E1548] text-white shadow-2xs'
                      : isCurrent
                      ? 'bg-[#1E1548] text-white ring-2 ring-purple-300 shadow-xs'
                      : 'bg-white border border-purple-200 text-purple-300'
                  }`}
                >
                  {isPassed ? <Check className="w-3.5 h-3.5" /> : stepNum}
                </div>
                <span
                  className={`text-[8px] font-bold tracking-tight ${
                    isCurrent ? 'text-[#1E1548]' : isPassed ? 'text-gray-500' : 'text-gray-300'
                  }`}
                >
                  {lbl}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FAF8FF] text-[#1E1548] font-sans flex flex-col justify-between overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-[120] bg-[#1E1548] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-purple-500/30 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Status Bar & Dismiss Button */}
      <div className="pt-2 px-5 pb-1 flex items-center justify-between text-xs font-semibold text-gray-700 bg-transparent shrink-0">
        <span className="font-bold text-sm tracking-tight">9:41</span>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-gray-700">
            <span className="text-[11px]">📶</span>
            <span className="text-[11px]">⚡</span>
            <div className="w-5 h-2.5 rounded-xs border border-gray-700 flex items-center p-0.5">
              <div className="h-full w-3 bg-gray-700 rounded-2xs" />
            </div>
          </div>
          {screen === 'intro' && (
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else onNavigate?.('/dashboard');
              }}
              className="ml-2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-gray-500 flex items-center justify-center cursor-pointer shadow-2xs"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          SCREEN 1: INTRO / OVERVIEW (media_1793962161252_050e04e0.png)
         ========================================================================= */}
      {screen === 'intro' && (
        <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 flex flex-col justify-between">
          <div className="space-y-6 flex flex-col items-center text-center pt-2">
            {/* Center Illustrated QR Card with Sparkles */}
            <div className="relative mt-2">
              <div className="w-40 h-40 rounded-3xl bg-white shadow-xl shadow-purple-900/5 border border-purple-100 flex items-center justify-center p-4 relative">
                <div className="w-28 h-28 bg-[#1E1548] rounded-2xl flex items-center justify-center p-2.5">
                  <QrCode className="w-full h-full text-white" />
                </div>
                {/* Checked Badge on bottom-right of QR */}
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-pink-400 absolute -top-2 -right-3 animate-pulse" />
              <Sparkles className="w-4 h-4 text-purple-400 absolute top-12 -left-3 animate-pulse" />
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Generate QR Codes</h1>
              <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
                Create QR codes for your offers, campaigns and let your customers avail them easily.
              </p>
            </div>

            {/* 4 Feature Points with soft pink rounded pills */}
            <div className="w-full space-y-2.5 text-left pt-2">
              {[
                { label: 'For Counters & Tables', icon: Utensils },
                { label: 'Custom number of QR codes', icon: BookOpen },
                { label: 'Set validity period', icon: Calendar },
                { label: 'Apply to all offers / campaigns', icon: Ticket }
              ].map((pt, i) => {
                const IconC = pt.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-purple-50 shadow-2xs"
                  >
                    <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center shrink-0 border border-pink-100">
                      <IconC className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-gray-700">{pt.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-4">
            <button
              type="button"
              onClick={() => setScreen(qrType === 'single' ? 'single_step1' : 'multi_step1')}
              className="w-full py-3.5 bg-[#2D1A47] hover:bg-[#3D255E] text-white rounded-2xl font-black text-sm shadow-xl shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Get Started
            </button>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => {
                  if (onClose) onClose();
                  else onNavigate?.('/dashboard');
                }}
                className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>

              <button
                type="button"
                onClick={() => setScreen(qrType === 'single' ? 'single_step1' : 'multi_step1')}
                className="px-6 py-2 rounded-xl bg-[#2D1A47] text-white text-xs font-bold cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STEP 1: SELECT QR TYPE (Single vs Multiple)
         ========================================================================= */}
      {(screen === 'single_step1' || screen === 'multi_step1') && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(1, qrType === 'single' ? 6 : 7)}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Select QR Type</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Choose how you want to generate the QR code.
                </p>
              </div>

              {/* Radio Option 1: Single QR */}
              <div
                onClick={() => {
                  setQrType('single');
                  setScreen('single_step1');
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                  qrType === 'single'
                    ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                    : 'bg-white border-purple-100 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                    <QrCode className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">Single QR</h3>
                    <p className="text-xs text-gray-400 font-medium">For one customer (dine-in or delivery)</p>
                  </div>
                </div>
                {qrType === 'single' && (
                  <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Radio Option 2: Multiple QR */}
              <div
                onClick={() => {
                  setQrType('multiple');
                  setScreen('multi_step1');
                }}
                className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                  qrType === 'multiple'
                    ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                    : 'bg-white border-purple-100 hover:border-purple-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-[#1E1548]">Multiple QR</h3>
                    <p className="text-xs text-gray-400 font-medium">
                      For multiple customers, tables, counters or campaigns
                    </p>
                  </div>
                </div>
                {qrType === 'multiple' && (
                  <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('intro')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen(qrType === 'single' ? 'single_step2' : 'multi_step2')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BRANCH A: SINGLE QR FLOW (Steps 2 to 6 + Success)
         ========================================================================= */}

      {/* SINGLE STEP 2: AUDIENCE (Customer Details) */}
      {screen === 'single_step2' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(2, 6)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Customer Details</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Add the details of the customer for whom this QR will be created.
                </p>
              </div>

              <div className="space-y-4 pt-1">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={singleCustomerName}
                    onChange={(e) => setSingleCustomerName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-gray-200 text-xs font-semibold focus:outline-none focus:border-[#5844A8] shadow-2xs"
                  />
                </div>

                {/* Mobile Number with +91 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Mobile Number *</label>
                  <div className="flex items-center rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-2xs">
                    <div className="px-3 py-3 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-600 flex items-center gap-1">
                      <span>+91</span>
                      <span className="text-[10px] text-gray-400">▼</span>
                    </div>
                    <input
                      type="tel"
                      value={singleCustomerPhone}
                      onChange={(e) => setSingleCustomerPhone(e.target.value)}
                      placeholder="10 digit mobile number"
                      className="flex-1 px-4 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('single_step1')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('single_step3')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* SINGLE STEP 3: OFFERS (Select Campaigns) */}
      {screen === 'single_step3' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(3, 6)}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Select Campaigns</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Choose the offers/campaigns to show to this customer.
                </p>
              </div>

              {/* Search campaigns */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search campaigns or offers"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#5844A8] shadow-2xs"
                />
              </div>

              {/* Campaign Checkboxes */}
              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'welcome', title: 'Welcome Offer', desc: '10% off on your first visit', icon: Ticket },
                  { id: 'birthday', title: 'Birthday Special', desc: 'Free dessert on your birthday', icon: Gift },
                  { id: 'loyalty', title: 'Loyalty Points', desc: 'Earn 2 points on your next order', icon: Tag },
                  { id: 'combo', title: 'Combo Offer', desc: 'Save more with combos', icon: BookOpen }
                ].map((camp) => {
                  const IconC = camp.icon;
                  const isChecked = singleCampaigns[camp.id];
                  return (
                    <div
                      key={camp.id}
                      onClick={() =>
                        setSingleCampaigns((prev) => ({ ...prev, [camp.id]: !prev[camp.id] }))
                      }
                      className="p-3.5 rounded-2xl bg-white border border-purple-50 shadow-2xs flex items-center justify-between cursor-pointer hover:border-purple-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isChecked
                              ? 'bg-[#1E1548] border-[#1E1548] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <IconC className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#1E1548]">{camp.title}</h4>
                          <p className="text-[11px] text-gray-400 font-medium">{camp.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('single_step2')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('single_step4')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* SINGLE STEP 4: PLACEMENT */}
      {screen === 'single_step4' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(4, 6)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Where will this QR be used?</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Choose where the customer will scan this QR code.
                </p>
              </div>

              <div className="space-y-3">
                {/* Table */}
                <div
                  onClick={() => setSinglePlacement('table')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    singlePlacement === 'table'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <Utensils className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Table</h3>
                      <p className="text-xs text-gray-400 font-medium">For dine-in customers</p>
                    </div>
                  </div>
                  {singlePlacement === 'table' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Delivery */}
                <div
                  onClick={() => setSinglePlacement('delivery')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    singlePlacement === 'delivery'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Delivery</h3>
                      <p className="text-xs text-gray-400 font-medium">For food delivery orders</p>
                    </div>
                  </div>
                  {singlePlacement === 'delivery' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('single_step3')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('single_step5')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* SINGLE STEP 5: RULES (Redemption Setting) */}
      {screen === 'single_step5' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(5, 6)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Redemption Setting</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Choose how the offers will be redeemed.
                </p>
              </div>

              <div className="space-y-3">
                {/* Automatic Redemption */}
                <div
                  onClick={() => setSingleRedemption('auto')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    singleRedemption === 'auto'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Automatic Redemption</h3>
                      <p className="text-xs text-gray-400 font-medium">Offers will be applied instantly when scanned.</p>
                    </div>
                  </div>
                  {singleRedemption === 'auto' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Merchant Approval */}
                <div
                  onClick={() => setSingleRedemption('approval')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    singleRedemption === 'approval'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Merchant Approval</h3>
                      <p className="text-xs text-gray-400 font-medium">Customer will need approval before redeeming.</p>
                    </div>
                  </div>
                  {singleRedemption === 'approval' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('single_step4')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('single_step6')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* SINGLE STEP 6: REVIEW & GENERATE */}
      {screen === 'single_step6' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(6, 6)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Review &amp; Generate</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Check the details before generating the QR code.
                </p>
              </div>

              {/* Review Card */}
              <div className="bg-white rounded-3xl p-5 border border-purple-100/70 shadow-sm space-y-4">
                {/* Customer */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
                    <h4 className="text-sm font-black text-[#1E1548]">{singleCustomerName}</h4>
                    <p className="text-xs text-gray-500 font-semibold">+91 {singleCustomerPhone}</p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Offers */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Offers</span>
                    <h4 className="text-xs font-black text-[#1E1548]">Welcome Offer, Birthday Special</h4>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Usage */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Usage</span>
                    <h4 className="text-xs font-black text-[#1E1548] capitalize">
                      {singlePlacement === 'table' ? 'Dine-in' : 'Delivery'}
                    </h4>
                  </div>
                </div>

                <hr className="border-gray-100" />

                {/* Redemption */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Redemption</span>
                    <h4 className="text-xs font-black text-[#1E1548]">
                      {singleRedemption === 'auto' ? 'Automatic' : 'Merchant Approval'}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('single_step5')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('single_success')}
              className="px-6 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Generate QR Codes
            </button>
          </div>
        </div>
      )}

      {/* SINGLE SUCCESS SCREEN (media_1793962974506_4281cbe2.png) */}
      {screen === 'single_success' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-5 text-center flex flex-col items-center">
            {/* Confetti Animation & Dashed QR Icon Badge */}
            <div className="relative mt-2">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center p-2 relative bg-white shadow-lg shadow-purple-900/5">
                <QrCode className="w-12 h-12 text-[#1E1548]" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              {/* Confetti particles */}
              <span className="w-2 h-2 rounded-full bg-pink-400 absolute -top-1 left-2 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-4 -right-4 animate-bounce" />
              <span className="w-1.5 h-3 bg-amber-400 rounded-sm absolute -bottom-1 -left-3 rotate-45" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute bottom-8 -right-3" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#1E1548]">QR Code Generated!</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Your QR code has been successfully created and is ready to use.
              </p>
            </div>

            {/* Generated Summary Card */}
            <div className="w-full bg-white rounded-3xl p-4 border border-purple-100 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
                  <h4 className="text-xs font-black text-[#1E1548]">{singleCustomerName}</h4>
                  <p className="text-[11px] text-gray-500 font-medium">+91 {singleCustomerPhone}</p>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Offers</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Welcome Offer, Birthday Special</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Usage</span>
                  <h4 className="text-xs font-black text-[#1E1548]">
                    {singlePlacement === 'table' ? 'Dine-in' : 'Delivery'}
                  </h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Redemption</span>
                  <h4 className="text-xs font-black text-[#1E1548]">
                    {singleRedemption === 'auto' ? 'Automatic' : 'Merchant Approval'}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 px-6 py-4 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center gap-3 z-10 shadow-md">
            <button
              type="button"
              onClick={() => showToast('QR Code image downloaded to device!')}
              className="flex-1 py-3 bg-white border border-[#5844A8] text-[#5844A8] rounded-2xl font-black text-xs shadow-2xs hover:bg-purple-50 transition cursor-pointer"
            >
              Download QR
            </button>
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else onNavigate?.('/approvals');
              }}
              className="flex-1 py-3 bg-[#2D1A47] hover:bg-[#3D255E] text-white rounded-2xl font-black text-xs shadow-xl shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          BRANCH B: MULTIPLE QR FLOW (Steps 2 to 7 + Success)
         ========================================================================= */}

      {/* MULTI STEP 2: CAMPAIGNS */}
      {screen === 'multi_step2' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(2, 7)}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Select Campaigns</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Choose the campaigns to include in this QR.
                </p>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search campaigns"
                  className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#5844A8] shadow-2xs"
                />
              </div>

              <div className="space-y-2.5 pt-1">
                {[
                  { id: 'welcome', title: 'Welcome Offer', desc: 'First-time visitors discount', icon: Ticket },
                  { id: 'birthday', title: 'Birthday Special', desc: 'Complimentary birthday treats', icon: Gift },
                  { id: 'loyalty', title: 'Loyalty Points', desc: 'Earn 2 points on orders', icon: Tag },
                  { id: 'combo', title: 'Combo Offer', desc: 'Save more with combos', icon: BookOpen }
                ].map((camp) => {
                  const IconC = camp.icon;
                  const isChecked = multiCampaigns[camp.id];
                  return (
                    <div
                      key={camp.id}
                      onClick={() =>
                        setMultiCampaigns((prev) => ({ ...prev, [camp.id]: !prev[camp.id] }))
                      }
                      className="p-3.5 rounded-2xl bg-white border border-purple-50 shadow-2xs flex items-center justify-between cursor-pointer hover:border-purple-200 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <IconC className="w-4.5 h-4.5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-[#1E1548]">{camp.title}</h4>
                          <p className="text-[11px] text-gray-400 font-medium">{camp.desc}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                          isChecked
                            ? 'bg-[#1E1548] border-[#1E1548] text-white'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isChecked && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step1')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step3')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 3: USE CASE */}
      {screen === 'multi_step3' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(3, 7)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Select Use Case</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">What do you want to use this QR for?</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'dine_in', title: 'Dine-in', desc: 'For dine-in customers', icon: User },
                  { id: 'delivery', title: 'Delivery', desc: 'For delivery orders', icon: Truck },
                  { id: 'both', title: 'Both', desc: 'Dine in + Delivery', icon: Layers }
                ].map((uc) => {
                  const IconC = uc.icon;
                  const isSelected = multiUseCase === uc.id;
                  return (
                    <div
                      key={uc.id}
                      onClick={() => setMultiUseCase(uc.id as any)}
                      className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                          : 'bg-white border-purple-100 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <IconC className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#1E1548]">{uc.title}</h3>
                          <p className="text-xs text-gray-400 font-medium">{uc.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step2')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step4a')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 4A: LOCATION TYPE */}
      {screen === 'multi_step4a' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(4, 7)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Select Location Type</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Where will this QR be used?</p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'tables', title: 'Tables', desc: 'For dine-in tables', icon: Utensils },
                  { id: 'counters', title: 'Counters', desc: 'For ordering/billing counters', icon: Tag },
                  { id: 'both', title: 'Both', desc: 'Tables + Counters', icon: Layers }
                ].map((loc) => {
                  const IconC = loc.icon;
                  const isSelected = multiLocationType === loc.id;
                  return (
                    <div
                      key={loc.id}
                      onClick={() => setMultiLocationType(loc.id as any)}
                      className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                          : 'bg-white border-purple-100 hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                          <IconC className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#1E1548]">{loc.title}</h3>
                          <p className="text-xs text-gray-400 font-medium">{loc.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step3')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step4b')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 4B: SELECT TABLES / COUNTERS */}
      {screen === 'multi_step4b' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(4, 7)}
            <div>
              <h2 className="text-xl font-black text-[#1E1548]">Select Tables / Counters</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Choose the tables and/or counters for which you want to create QR codes.
              </p>
            </div>

            {/* Tables Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-[#5844A8] flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1E1548]">Tables</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Select the tables you want to include.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Add table dialog')}
                  className="px-3 py-1 rounded-full border border-purple-200 text-[#5844A8] text-[10px] font-bold"
                >
                  + Add more
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {['T1', 'T2', 'T4', 'T5', 'T6'].map((tKey) => {
                  const isChecked = selectedTables[tKey];
                  const labelMap: Record<string, string> = {
                    T1: 'Table 1',
                    T2: 'Table 2',
                    T4: 'Table 4',
                    T5: 'Table 5',
                    T6: 'Table 6'
                  };
                  return (
                    <div
                      key={tKey}
                      onClick={() =>
                        setSelectedTables((prev) => ({ ...prev, [tKey]: !prev[tKey] }))
                      }
                      className="p-2.5 rounded-xl bg-[#FAF8FF] border border-purple-50/80 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#1E1548] border-[#1E1548] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{labelMap[tKey]}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        {tKey}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Counters Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-[#1E1548]">Counters</h4>
                    <p className="text-[10px] text-gray-400 font-medium">Select the counters you want to include.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Add counter dialog')}
                  className="px-3 py-1 rounded-full border border-pink-200 text-pink-600 text-[10px] font-bold"
                >
                  + Add more
                </button>
              </div>

              <div className="space-y-1.5 pt-1">
                {['C1', 'C2', 'C3', 'C4'].map((cKey) => {
                  const isChecked = selectedCounters[cKey];
                  const labelMap: Record<string, string> = {
                    C1: 'Counter 1',
                    C2: 'Counter 2',
                    C3: 'Counter 3',
                    C4: 'Counter 4'
                  };
                  return (
                    <div
                      key={cKey}
                      onClick={() =>
                        setSelectedCounters((prev) => ({ ...prev, [cKey]: !prev[cKey] }))
                      }
                      className="p-2.5 rounded-xl bg-[#FAF8FF] border border-purple-50/80 flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                            isChecked
                              ? 'bg-[#1E1548] border-[#1E1548] text-white'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3" />}
                        </div>
                        <span className="text-xs font-bold text-gray-700">{labelMap[cKey]}</span>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                        {cKey}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Common QR Rules Card */}
            <div className="bg-white rounded-3xl p-4 border border-purple-50 shadow-2xs space-y-3">
              {[
                {
                  key: 'sameForTables',
                  title: 'Use same QR for all selected tables',
                  desc: 'All selected tables will share the same QR code.'
                },
                {
                  key: 'sameForCounters',
                  title: 'Use same QR for all selected counters',
                  desc: 'All selected counters will share the same QR code.'
                },
                {
                  key: 'oneCommonForBoth',
                  title: 'Use one common QR for both tables and counters',
                  desc: 'The same QR code will work for all selected tables and counters.'
                }
              ].map((opt) => {
                const isChecked = (commonQrOptions as any)[opt.key];
                return (
                  <div
                    key={opt.key}
                    onClick={() =>
                      setCommonQrOptions((prev) => ({
                        ...prev,
                        [opt.key]: !(prev as any)[opt.key]
                      }))
                    }
                    className="flex items-start gap-2.5 cursor-pointer pb-2 last:pb-0"
                  >
                    <div
                      className={`w-4 h-4 rounded-md mt-0.5 flex items-center justify-center border shrink-0 ${
                        isChecked
                          ? 'bg-[#1E1548] border-[#1E1548] text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3" />}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-gray-800 leading-tight">{opt.title}</h5>
                      <p className="text-[10px] text-gray-400 font-medium">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step4a')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step5')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 5: VALIDITY */}
      {screen === 'multi_step5' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(5, 7)}
            <div>
              <h2 className="text-xl font-black text-[#1E1548]">Set QR Validity</h2>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Choose how long this QR code will be active.
              </p>
            </div>

            {/* Validity Radio Options */}
            <div className="space-y-2.5">
              {[
                {
                  id: 'date_range',
                  title: 'Specific Date Range',
                  desc: 'Set a start and end date for this QR code.',
                  icon: Calendar
                },
                {
                  id: 'fixed_duration',
                  title: 'Fixed Duration',
                  desc: 'Choose how many days from today.',
                  icon: Clock
                },
                {
                  id: 'no_expiry',
                  title: 'No Expiry',
                  desc: 'The QR code will remain active indefinitely.',
                  icon: Layers
                }
              ].map((val) => {
                const IconC = val.icon;
                const isSelected = validityType === val.id;
                return (
                  <div
                    key={val.id}
                    onClick={() => setValidityType(val.id as any)}
                    className={`p-3.5 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                        : 'bg-white border-purple-100 hover:border-purple-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                        <IconC className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-[#1E1548]">{val.title}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{val.desc}</p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* APPLY TO Subgroup */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block">Apply To</span>

              <div
                onClick={() => setValidityScope('all')}
                className={`p-3.5 rounded-3xl border transition cursor-pointer flex items-center gap-3 ${
                  validityScope === 'all'
                    ? 'bg-white border-[#5844A8] shadow-2xs'
                    : 'bg-white border-purple-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                    validityScope === 'all'
                      ? 'bg-[#1E1548] border-[#1E1548] text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {validityScope === 'all' && <Check className="w-3 h-3" />}
                </div>
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#1E1548]">All selected locations</h5>
                  <p className="text-[10px] text-gray-400 font-medium">The same validity period will apply to all selected tables/counters.</p>
                </div>
              </div>

              <div
                onClick={() => setValidityScope('separate')}
                className={`p-3.5 rounded-3xl border transition cursor-pointer flex items-center gap-3 ${
                  validityScope === 'separate'
                    ? 'bg-white border-[#5844A8] shadow-2xs'
                    : 'bg-white border-purple-100'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 ${
                    validityScope === 'separate'
                      ? 'bg-[#1E1548] border-[#1E1548] text-white'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {validityScope === 'separate' && <Check className="w-3 h-3" />}
                </div>
                <div className="w-8 h-8 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-[#1E1548]">Each location separately</h5>
                  <p className="text-[10px] text-gray-400 font-medium">You can set different validity periods for each table/counter.</p>
                </div>
              </div>
            </div>

            {/* Date Pickers */}
            <div className="space-y-3 pt-2">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">Start Date &amp; Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{startDate}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{startTime}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-700">End Date &amp; Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span>{endDate}</span>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span>{endTime}</span>
                  </div>
                </div>
              </div>

              {/* Info Note Banner */}
              <div className="p-3 bg-purple-50/70 border border-purple-100 rounded-2xl flex items-start gap-2.5 text-purple-900 text-[11px] font-medium leading-relaxed">
                <Info className="w-4 h-4 text-[#5844A8] shrink-0 mt-0.5" />
                <span>
                  The QR code will be active from {startDate}, {startTime} to {endDate}, {endTime} for all selected locations.
                </span>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step4b')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step6')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 6: REDEEM */}
      {screen === 'multi_step6' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(6, 7)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Redemption Setting</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Check the details before generating the QR code.
                </p>
              </div>

              <div className="space-y-3">
                {/* Automatic */}
                <div
                  onClick={() => setMultiRedemption('auto')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    multiRedemption === 'auto'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Automatic Redemption</h3>
                      <p className="text-xs text-gray-400 font-medium">Offers will be applied instantly when scanned.</p>
                    </div>
                  </div>
                  {multiRedemption === 'auto' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Merchant Approval */}
                <div
                  onClick={() => setMultiRedemption('approval')}
                  className={`p-4 rounded-3xl border transition cursor-pointer flex items-center justify-between ${
                    multiRedemption === 'approval'
                      ? 'bg-white border-[#5844A8] shadow-md shadow-purple-900/5'
                      : 'bg-white border-purple-100 hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0 border border-pink-100">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-[#1E1548]">Merchant Approval</h3>
                      <p className="text-xs text-gray-400 font-medium">Customer will need approval before redeeming.</p>
                    </div>
                  </div>
                  {multiRedemption === 'approval' && (
                    <div className="w-6 h-6 rounded-full bg-[#1E1548] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step5')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_step7')}
              className="px-7 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MULTI STEP 7: REVIEW & GENERATE */}
      {screen === 'multi_step7' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-5 pt-2 pb-6 space-y-4">
            {renderStepper(7, 7)}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Review &amp; Generate</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Check the details before generating the QR code.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-white rounded-3xl p-5 border border-purple-100/70 shadow-sm space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Customer</span>
                    <h4 className="text-sm font-black text-[#1E1548]">Rahul Sharma</h4>
                    <p className="text-xs text-gray-500 font-semibold">+91 98765 43210</p>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Tag className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Offers</span>
                    <h4 className="text-xs font-black text-[#1E1548]">Welcome Offer, Birthday Special</h4>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Usage</span>
                    <h4 className="text-xs font-black text-[#1E1548]">Dine-in</h4>
                  </div>
                </div>

                <hr className="border-gray-100" />

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Redemption</span>
                    <h4 className="text-xs font-black text-[#1E1548]">Automatic</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 px-5 py-3.5 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between z-10 shadow-md">
            <button
              type="button"
              onClick={() => setScreen('multi_step6')}
              className="text-xs font-bold text-gray-500 hover:text-black flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <button
              type="button"
              onClick={() => setScreen('multi_success')}
              className="px-6 py-2.5 rounded-xl bg-[#2D1A47] text-white text-xs font-black shadow-md shadow-purple-950/20 active:scale-98 transition cursor-pointer"
            >
              Generate QR Codes
            </button>
          </div>
        </div>
      )}

      {/* MULTI SUCCESS SCREEN (media_1793963065964_b762869d.png) */}
      {screen === 'multi_success' && (
        <div className="flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-5 text-center flex flex-col items-center">
            {/* Confetti Animation & Dashed QR Icon Badge */}
            <div className="relative mt-2">
              <div className="w-24 h-24 rounded-full border-2 border-dashed border-pink-300 flex items-center justify-center p-2 relative bg-white shadow-lg shadow-purple-900/5">
                <QrCode className="w-12 h-12 text-[#1E1548]" />
                <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              {/* Confetti particles */}
              <span className="w-2 h-2 rounded-full bg-pink-400 absolute -top-1 left-2 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-4 -right-4 animate-bounce" />
              <span className="w-1.5 h-3 bg-amber-400 rounded-sm absolute -bottom-1 -left-3 rotate-45" />
              <span className="w-2 h-2 rounded-full bg-cyan-400 absolute bottom-8 -right-3" />
            </div>

            <div>
              <h2 className="text-xl font-black text-[#1E1548]">QR Code Generated!</h2>
              <p className="text-xs text-gray-500 font-medium mt-1">
                Your QR code has been successfully created and is ready to use.
              </p>
            </div>

            {/* Generated Summary Card */}
            <div className="w-full bg-white rounded-3xl p-4 border border-purple-100 shadow-sm text-left space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">USE CASE</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Multi - Customers</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">LOCATION</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Both (Tables + Counters)</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">CAMPAIGNS</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Welcome Offer, Birthday Special</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">PLACEMENT</span>
                  <h4 className="text-xs font-black text-[#1E1548]">One common QR for all</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">DELIVERY</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Included</h4>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">REDEMPTION</span>
                  <h4 className="text-xs font-black text-[#1E1548]">Automatic</h4>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="shrink-0 px-6 py-4 border-t border-purple-100/80 bg-white/95 backdrop-blur-md flex items-center justify-between gap-3 z-10 shadow-md">
            <button
              type="button"
              onClick={() => showToast('Batch QR Code ZIP downloaded!')}
              className="text-xs font-bold text-[#5844A8] hover:text-[#1E1548] flex items-center gap-1.5 cursor-pointer py-2 px-1"
            >
              <Download className="w-3.5 h-3.5" /> Download QR
            </button>
            <button
              type="button"
              onClick={() => {
                if (onClose) onClose();
                else onNavigate?.('/approvals');
              }}
              className="px-6 py-3 bg-[#2D1A47] hover:bg-[#3D255E] text-white rounded-2xl font-black text-xs shadow-xl shadow-purple-950/20 active:scale-98 transition cursor-pointer flex items-center gap-1"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

