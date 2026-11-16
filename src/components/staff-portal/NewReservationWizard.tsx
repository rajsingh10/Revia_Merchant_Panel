import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  CheckCircle2, 
  ChevronDown, 
  Clock, 
  Info, 
  Minus, 
  Plus, 
  Search, 
  User, 
  Users, 
  Utensils, 
  Sparkles 
} from 'lucide-react';
import { ReservationBooking } from './types';

interface NewReservationWizardProps {
  onBack: () => void;
  onComplete: (booking: ReservationBooking) => void;
}

export const NewReservationWizard: React.FC<NewReservationWizardProps> = ({
  onBack,
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [isExistingCustomer, setIsExistingCustomer] = useState(true);
  const [customerSearch, setCustomerSearch] = useState('Ananya Gupta');
  const [occasion, setOccasion] = useState<'Birthday' | 'Anniversary' | 'Business' | 'None'>('Birthday');
  const [specialRequests, setSpecialRequests] = useState('Window-side seating preferred. Please arrange a high chair.');
  const [partySize, setPartySize] = useState(4);
  const [diningArea, setDiningArea] = useState<'Indoor' | 'Patio' | 'Any'>('Indoor');
  const [reservationDate, setReservationDate] = useState('Saturday, 7 Nov 2026');

  // Step 2 State
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('7:30 PM');
  const [selectedTable, setSelectedTable] = useState('Table 08');
  const [selectedTableType, setSelectedTableType] = useState('Indoor / window-side');

  // Step 3 Checkboxes
  const [sendConfirmation, setSendConfirmation] = useState(true);
  const [showInSchedule, setShowInSchedule] = useState(true);

  // Success ID
  const [bookingId, setBookingId] = useState('#RES-2091');

  const timeSlots = [
    { time: '5:30 PM', status: 'available' },
    { time: '6:00 PM', status: 'available' },
    { time: '6:30 PM', status: 'available' },
    { time: '7:00 PM', status: 'few_left' },
    { time: '7:30 PM', status: 'available' },
    { time: '8:00 PM', status: 'available' },
    { time: '8:30 PM', status: 'full' },
    { time: '9:00 PM', status: 'available' },
  ];

  const tables = [
    { id: 'Table 02', name: 'Table 02', seats: '4 seats', area: 'Indoor', status: 'available' },
    { id: 'Table 08', name: 'Table 08', seats: '4 seats', area: 'Window-side', status: 'available' },
    { id: 'Table 05', name: 'Table 05', seats: '4 seats', area: 'Indoor', status: 'reserved' },
    { id: 'Table 11', name: 'Table 11', seats: '4 seats', area: 'Quiet zone', status: 'available' },
    { id: 'Table 12', name: 'Table 12', seats: '6 seats', area: 'Indoor', status: 'available' },
    { id: 'Assign Later', name: 'Assign Later', seats: '', area: 'Keep booking without a fixed table', status: 'available' },
  ];

  const handleConfirmReservation = () => {
    const newId = `#RES-${Math.floor(2000 + Math.random() * 900)}`;
    setBookingId(newId);
    setStep(4);
  };

  const handleFinish = () => {
    onComplete({
      id: bookingId,
      customerName: 'Ananya Gupta',
      phone: '+91 98XXX XX210',
      isExistingCustomer,
      loyaltyTier: 'Gold',
      branch: 'Noida - Sector 18',
      date: reservationDate,
      timeSlot: selectedTimeSlot,
      partySize,
      diningArea,
      tableNumber: selectedTable,
      tableFeatures: selectedTableType,
      occasion,
      specialRequests,
      status: 'Confirmed',
      createdAt: 'Just now',
    });
  };

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
      {/* 1. Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (step === 4) onBack();
            else if (step > 1) setStep((step - 1) as any);
            else onBack();
          }}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-600 cursor-pointer shadow-2xs transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">
            {step === 4 ? 'Reservation Created' : step === 3 ? 'Review & Confirm' : step === 2 ? 'Time Slot & Table' : 'New Reservation'}
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            {step === 4
              ? 'Your booking was successfully added to the branch schedule.'
              : step === 3
              ? 'Step 3 of 3 • Check details before creating the reservation.'
              : step === 2
              ? 'Step 2 of 3 • Select an arrival time and a suitable table.'
              : 'Step 1 of 3 • Choose the guest and booking preferences.'}
          </p>
        </div>
      </div>

      {/* 2. Stepper Progress Bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center justify-between max-w-3xl mx-auto">
        {[
          { stepNum: 1, label: 'Customer & Visit' },
          { stepNum: 2, label: 'Time & Table' },
          { stepNum: 3, label: 'Review & Confirm' },
        ].map((item, idx) => {
          const isDone = step > item.stepNum || step === 4;
          const isActive = step === item.stepNum;

          return (
            <React.Fragment key={item.stepNum}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isActive
                      ? 'bg-[#1E1548] text-white ring-4 ring-purple-950/20'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isDone ? <Check className="w-4 h-4" /> : item.stepNum}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:inline ${
                    isActive ? 'text-[#1E1548] font-bold' : isDone ? 'text-gray-800' : 'text-gray-400'
                  }`}
                >
                  {item.label}
                </span>
              </div>
              {idx < 2 && (
                <div
                  className={`flex-1 h-0.5 mx-3 transition-colors ${
                    step > idx + 1 || step === 4 ? 'bg-emerald-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* STEP 1: CUSTOMER & VISIT */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Top Notice */}
          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs text-rose-950 font-medium">
            <span className="font-bold">Create a future reservation</span> • No table QR scan is needed until a customer actually arrives for service.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Customer Information */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#1E1548]">Customer Information</h3>
                <span className="text-[11px] font-bold text-gray-400 uppercase">Step 1 of 3</span>
              </div>

              {/* Customer Type Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setIsExistingCustomer(true)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    isExistingCustomer
                      ? 'border-[#5844A8] bg-purple-50/50 text-[#5844A8] shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    isExistingCustomer ? 'border-[#5844A8]' : 'border-gray-400'
                  }`}>
                    {isExistingCustomer && <span className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />}
                  </span>
                  <span>Existing Customer</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsExistingCustomer(false)}
                  className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
                    !isExistingCustomer
                      ? 'border-[#5844A8] bg-purple-50/50 text-[#5844A8] shadow-2xs'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                    !isExistingCustomer ? 'border-[#5844A8]' : 'border-gray-400'
                  }`}>
                    {!isExistingCustomer && <span className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />}
                  </span>
                  <span>New Customer / Guest</span>
                </button>
              </div>

              {/* Search Customer Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Search customer
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={customerSearch}
                    onChange={(e) => setCustomerSearch(e.target.value)}
                    placeholder="Search by name or phone..."
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-xs font-semibold focus:outline-none focus:bg-white focus:border-[#5844A8]"
                  />
                </div>
              </div>

              {/* Selected Customer Card */}
              <div className="p-3.5 bg-purple-50/40 border border-purple-200/80 rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5844A8] font-black text-xs flex items-center justify-center border border-purple-200">
                    AG
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E1548]">Ananya Gupta</h4>
                    <p className="text-[10px] text-gray-500 font-medium">
                      +91 98XXX XX210 • Loyaltics Member • <span className="text-amber-700 font-bold">Gold</span>
                    </p>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-[#5844A8] text-white flex items-center justify-center">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              </div>

              {/* Guest Preferences */}
              <div className="pt-2 space-y-3">
                <h4 className="font-black text-xs text-[#1E1548]">Guest Preferences</h4>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                    Occasion (optional)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['Birthday', 'Anniversary', 'Business', 'None'] as const).map((occ) => (
                      <button
                        key={occ}
                        type="button"
                        onClick={() => setOccasion(occ)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                          occasion === occ
                            ? 'bg-[#1E1548] text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-200'
                        }`}
                      >
                        {occ}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1.5">
                    Special requests (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-gray-50/70 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:bg-white focus:border-[#5844A8]"
                  />
                </div>

                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                  The customer can be linked to their existing loyalty profile. Creating a reservation does not automatically redeem any campaign.
                </div>
              </div>
            </div>

            {/* Right Column: Reservation Details */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-black text-sm text-[#1E1548] border-b border-gray-100 pb-3">
                  Reservation Details
                </h3>

                {/* Branch */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Branch
                  </label>
                  <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-2xl">
                    <p className="font-bold text-xs text-[#1E1548]">Noida - Sector 18</p>
                    <p className="text-[10px] text-gray-400 font-medium">The Urban Kitchen • Current branch</p>
                  </div>
                </div>

                {/* Reservation date */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Reservation date
                  </label>
                  <div className="p-3 bg-gray-50/70 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <Calendar className="w-4 h-4 text-[#5844A8]" />
                      <span className="font-bold text-xs text-[#1E1548]">{reservationDate}</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 bg-white px-2 py-0.5 rounded-md border border-gray-200">
                      Tomorrow
                    </span>
                  </div>
                </div>

                {/* Party size */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Party size
                  </label>
                  <div className="p-2 bg-gray-50/70 border border-gray-200 rounded-2xl flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setPartySize(Math.max(1, partySize - 1))}
                      className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-black text-base text-[#1E1548]">{partySize}</span>
                    <button
                      type="button"
                      onClick={() => setPartySize(partySize + 1)}
                      className="w-8 h-8 rounded-xl bg-white border border-gray-200 text-gray-700 flex items-center justify-center font-bold hover:bg-gray-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Dining area */}
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">
                    Dining area (optional)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Indoor', 'Patio', 'Any'] as const).map((area) => (
                      <button
                        key={area}
                        type="button"
                        onClick={() => setDiningArea(area)}
                        className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                          diningArea === area
                            ? 'bg-[#1E1548] text-white'
                            : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-200'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl text-[11px] text-rose-900 leading-relaxed">
                  The next step shows available arrival time slots and matching tables for this party.
                </div>
              </div>

              {/* Step 1 Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <span>Check Time & Table Availability</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: TIME SLOT & TABLE */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Customer Summary Banner */}
          <div className="p-4 bg-white border border-purple-100 rounded-2xl flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-[#1E1548]">Ananya Gupta</h4>
                <p className="text-[11px] text-gray-500 font-medium">
                  {partySize} guests • {reservationDate} • {diningArea} preferred
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-3 py-1.5 rounded-xl border border-gray-200 text-[11px] font-bold text-gray-700 hover:border-purple-200"
            >
              Edit Details
            </button>
          </div>

          {/* 1. Select Arrival Time */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#1E1548]">1. Select Arrival Time</h3>
                <p className="text-xs text-gray-400">Available dining slots for {partySize} guests</p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <span className="flex items-center gap-1 text-emerald-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Available
                </span>
                <span className="flex items-center gap-1 text-amber-600">
                  <span className="w-2 h-2 rounded-full bg-amber-500" /> Few left
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <span className="w-2 h-2 rounded-full bg-gray-300" /> Unavailable
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {timeSlots.map((slot) => {
                const isSelected = selectedTimeSlot === slot.time;
                const isFull = slot.status === 'full';

                return (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={isFull}
                    onClick={() => setSelectedTimeSlot(slot.time)}
                    className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-[#5844A8] bg-purple-50/40 text-[#5844A8] ring-2 ring-purple-200 font-black'
                        : isFull
                        ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200 font-bold'
                    }`}
                  >
                    <p className="text-sm">{slot.time}</p>
                    <p className="text-[10px] mt-0.5 capitalize">
                      {isSelected ? 'Selected ✓' : isFull ? 'Full' : slot.status === 'few_left' ? 'Few left' : 'Available'}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Choose a Table */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-black text-sm text-[#1E1548]">2. Choose a Table</h3>
                <p className="text-xs text-gray-400">Based on selected arrival slot</p>
              </div>
              <span className="text-xs font-bold text-gray-500">4 suitable tables shown</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tables.map((tbl) => {
                const isSelected = selectedTable === tbl.id;
                const isReserved = tbl.status === 'reserved';

                return (
                  <button
                    key={tbl.id}
                    type="button"
                    disabled={isReserved}
                    onClick={() => {
                      setSelectedTable(tbl.id);
                      setSelectedTableType(tbl.area);
                    }}
                    className={`p-4 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between min-h-[90px] ${
                      isSelected
                        ? 'border-[#5844A8] bg-purple-50/40 text-[#5844A8] ring-2 ring-purple-200'
                        : isReserved
                        ? 'bg-gray-50/70 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border-gray-200 hover:border-purple-200 text-gray-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-black text-sm">{tbl.name} {isSelected && '✓'}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSelected ? 'bg-[#5844A8] text-white' : isReserved ? 'text-rose-600' : 'text-emerald-600'
                        }`}>
                          {isSelected ? 'Selected' : isReserved ? 'Reserved' : '✓ Available'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {tbl.seats} {tbl.seats && '•'} {tbl.area}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected confirmation banner */}
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium">
              <span className="font-bold">Selected:</span> {selectedTimeSlot} arrival • {selectedTable} • {selectedTableType} • Suitable for {partySize} guests. Availability will be rechecked when the reservation is confirmed.
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              &larr; Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-2.5 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Continue to Review</span>
              <span>&rarr;</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW & CONFIRM */}
      {step === 3 && (
        <div className="space-y-6">
          {/* Top Notice */}
          <div className="p-3.5 bg-rose-50/50 border border-rose-100 rounded-2xl text-xs text-rose-950 font-medium">
            <span className="font-bold text-rose-800">Review before confirming:</span> Please verify the selected customer, arrival slot and table. Changes may affect availability.
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Reservation Summary */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="font-black text-sm text-[#1E1548]">Reservation Summary</h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-[#5844A8] hover:underline"
                >
                  Edit Customer ↗
                </button>
              </div>

              {/* Customer Pill */}
              <div className="p-3 bg-purple-50/50 rounded-2xl border border-purple-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#5844A8] font-black text-xs flex items-center justify-center border border-purple-200">
                  AG
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1E1548]">Ananya Gupta</h4>
                  <p className="text-[10px] text-gray-500 font-medium">
                    +91 98XXX XX210 • Existing customer • <span className="font-bold text-amber-700">Gold</span>
                  </p>
                </div>
              </div>

              {/* Spec Rows */}
              <div className="divide-y divide-gray-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Branch</span>
                  <span className="font-bold text-[#1E1548]">Noida - Sector 18</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Date</span>
                  <span className="font-bold text-[#1E1548]">{reservationDate}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Arrival time</span>
                  <span className="font-bold text-[#1E1548]">{selectedTimeSlot}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Party size</span>
                  <span className="font-bold text-[#1E1548]">{partySize} guests</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Assigned table</span>
                  <span className="font-bold text-[#1E1548]">{selectedTable} • {selectedTableType}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Occasion</span>
                  <span className="font-bold text-[#1E1548]">{occasion}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-gray-400 font-medium">Special requests</span>
                  <span className="font-bold text-[#1E1548] text-right max-w-[60%]">{specialRequests}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Booking Checks */}
            <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="font-black text-sm text-[#1E1548] border-b border-gray-100 pb-3">
                  Booking Checks
                </h3>

                {/* Match Box */}
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" /> Time & table match
                  </p>
                  <p className="text-[11px] text-emerald-700">
                    {selectedTable} was available for the selected arrival time in the example schedule.
                  </p>
                </div>

                {/* Permission Box */}
                <div className="p-3.5 bg-purple-50/70 border border-purple-200 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-[#5844A8]">Confirmation permission</p>
                  <p className="text-[11px] text-purple-900">
                    This example assumes Rohan has permission to confirm reservations. Otherwise the booking would be sent for manager approval.
                  </p>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3 pt-1">
                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendConfirmation}
                      onChange={(e) => setSendConfirmation(e.target.checked)}
                      className="mt-0.5 rounded text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    <span className="text-xs text-gray-700 font-medium">
                      Send reservation confirmation to the customer through an enabled and permitted contact channel.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showInSchedule}
                      onChange={(e) => setShowInSchedule(e.target.checked)}
                      className="mt-0.5 rounded text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    <span className="text-xs text-gray-700 font-medium">
                      Show the reservation in the branch schedule and upcoming arrivals list.
                    </span>
                  </label>
                </div>
              </div>

              {/* Notice Box */}
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl text-[11px] text-gray-500 leading-relaxed flex items-start gap-2">
                <Info className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-gray-700">What happens after confirmation?</strong> The reservation is created, assigned to {selectedTable} and visible in the Merchant/Manager Reservations module. The table is not marked Occupied until the guests arrive and are seated.
                </span>
              </div>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              &larr; Edit Time / Table
            </button>
            <button
              type="button"
              onClick={handleConfirmReservation}
              className="px-6 py-2.5 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Reservation</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: SUCCESS / CONFIRMED */}
      {step === 4 && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Big Green Success Card */}
          <div className="bg-emerald-50/50 border border-emerald-100 rounded-3xl p-8 text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-[#1E1548]">Reservation Confirmed!</h2>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Ananya Gupta's reservation has been added to the branch schedule. The customer confirmation is ready to send through the selected channel.
              </p>
            </div>

            <div className="inline-block px-4 py-1.5 bg-white border border-dashed border-purple-300 rounded-full text-xs font-bold text-[#5844A8]">
              Booking ID {bookingId}
            </div>
          </div>

          {/* Reservation Details Card */}
          <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-black text-sm text-[#1E1548]">Reservation Details</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ● Confirmed
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-400 font-medium">Customer</span>
                <span className="font-bold text-[#1E1548]">Ananya Gupta • {partySize} guests</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-400 font-medium">Arrival</span>
                <span className="font-bold text-[#1E1548]">{reservationDate} • {selectedTimeSlot}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-400 font-medium">Assigned Table</span>
                <span className="font-bold text-[#1E1548]">{selectedTable} • {selectedTableType}</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-400 font-medium">Occasion / Notes</span>
                <span className="font-bold text-[#1E1548]">{occasion} • High chair requested</span>
              </div>
              <div className="py-2.5 flex justify-between">
                <span className="text-gray-400 font-medium">Created by</span>
                <span className="font-bold text-[#5844A8]">Rohan Singh • Staff Portal</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                setStep(1);
              }}
              className="px-5 py-2.5 rounded-2xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-2xs"
            >
              + Create Another
            </button>
            <button
              type="button"
              onClick={handleFinish}
              className="px-6 py-2.5 rounded-2xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <span>Back to Table Service</span>
              <span>&rarr;</span>
            </button>
          </div>

          {/* Bottom Green Notice */}
          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-[11px] text-emerald-800 text-center font-medium">
            The table remains reserved for the future slot. No food order, payment, or loyalty redemption has been created.
          </div>
        </div>
      )}
    </div>
  );
};

