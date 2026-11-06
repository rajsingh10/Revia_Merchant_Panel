import React, { useState } from 'react';
import {
  ArrowLeft,
  Image as ImageIcon,
  Calendar,
  Clock,
  MapPin,
  Shield,
  Zap,
  Tag,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CreateRewardPage: React.FC<{ onNavigate?: (route: string) => void }> = ({ onNavigate }) => {
  const [rewardTitle, setRewardTitle] = useState('');
  const [rewardCost, setRewardCost] = useState('10');
  const [rewardTier, setRewardTier] = useState('Gold Tier');
  const [availability, setAvailability] = useState('30 Days');

  return (
    <div className="min-h-screen bg-[#FAF8FF] pb-24 relative">
      {/* Top Header */}
      <div className="bg-white border-b border-[#EFECE6] px-6 py-4 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate?.('/rewards')}
              className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-full border border-[#EFECE6] hover:bg-[#FAF5FF] transition-colors cursor-pointer text-[#1A1615]"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div>
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1 flex-wrap">
                <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Rewards Catalog</span>
                <span className="text-[#D1CDC7] hidden sm:inline">•</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-[#5844A8]">New Builder</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-[#1A1615] leading-tight">Create New Reward</h1>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-bold text-[#6E6A66] shrink-0 text-right">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#0D7A53] animate-pulse"></span>
            <span className="hidden sm:inline">Draft Mode</span>
            <span className="sm:hidden">Draft</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto p-6 mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column - Reward Details */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EFECE6] shadow-sm">
            <h2 className="text-lg font-bold text-[#1A1615] mb-6 flex items-center gap-2">
              <Tag className="w-5 h-5 text-[#5844A8]" /> Reward Details
            </h2>

            <div className="space-y-6">
              {/* Title & Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Reward Title <span className="text-[#DC2626]">*</span></label>
                  <input
                    type="text"
                    value={rewardTitle}
                    onChange={(e) => setRewardTitle(e.target.value)}
                    placeholder="e.g. Complimentary Pour-Over"
                    className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Reward Type <span className="text-[#DC2626]">*</span></label>
                  <select className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] transition-colors appearance-none cursor-pointer">
                    <option>Free Item</option>
                    <option>Discount</option>
                    <option>Voucher</option>
                    <option>Experience</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the reward and what the guest receives..."
                  className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-medium text-[#1A1615] focus:outline-none focus:border-[#5844A8] transition-colors resize-none"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Reward Image</label>
                <div className="border-2 border-dashed border-[#EFECE6] rounded-xl p-8 flex flex-col items-center justify-center bg-[#FAF8FF] hover:bg-purple-100/30 transition-colors cursor-pointer group">
                  <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5 text-[#5844A8]" />
                  </div>
                  <p className="text-sm font-bold text-[#1A1615] mb-1">Click to upload image</p>
                  <p className="text-xs text-[#9E9A93] font-medium">SVG, PNG, JPG or GIF (max. 2MB)</p>
                </div>
              </div>

              {/* Value & Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-[#FAF8FF] rounded-xl border border-[#EFECE6]">
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Retail Value ($)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9E9A93] font-bold">$</span>
                    <input
                      type="text"
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 bg-white border border-[#EFECE6] rounded-lg text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Unlock Cost</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rewardCost}
                      onChange={(e) => setRewardCost(e.target.value)}
                      placeholder="Amount"
                      className="w-1/2 px-4 py-3 bg-white border border-[#EFECE6] rounded-lg text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]"
                    />
                    <select className="w-1/2 px-4 py-3 bg-white border border-[#EFECE6] rounded-lg text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer">
                      <option>Stamps</option>
                      <option>Points</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-[#EFECE6] shadow-sm">
            <h2 className="text-lg font-bold text-[#1A1615] mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#5844A8]" /> Eligibility & Settings
            </h2>

            <div className="space-y-6">
              {/* Eligibility & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Eligible Tier</label>
                  <select
                    value={rewardTier}
                    onChange={(e) => setRewardTier(e.target.value)}
                    className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer"
                  >
                    <option>All Tiers</option>
                    <option>Silver Tier</option>
                    <option>Gold Tier</option>
                    <option>Black Tier</option>
                    <option>Obsidian VIP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Category</label>
                  <select className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer">
                    <option>Beverages</option>
                    <option>Pastries</option>
                    <option>Merchandise</option>
                    <option>Experience</option>
                  </select>
                </div>
              </div>

              {/* Venues */}
              <div>
                <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Applicable Venues</label>
                <div className="flex flex-wrap gap-2">
                  {['Downtown Flagship', 'Roastery District', 'Uptown Reserve'].map(venue => (
                    <label key={venue} className="flex items-center gap-2 p-3 border border-[#5844A8] bg-[#FAF5FF] rounded-xl cursor-pointer">
                      <input type="checkbox" defaultChecked className="accent-[#5844A8] w-4 h-4 cursor-pointer" />
                      <span className="text-xs font-bold text-[#1A1615]">{venue}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dates & Windows */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EFECE6]">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Availability Window</label>
                  <div className="flex bg-[#FAF8FF] border border-[#EFECE6] rounded-xl p-1.5">
                    {['30 Days', '60 Days', 'Permanent', 'Custom'].map(win => (
                      <button
                        key={win}
                        onClick={() => setAvailability(win)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${availability === win ? 'bg-white shadow-sm border border-[#EFECE6] text-[#1A1615]' : 'text-[#6E6A66] hover:bg-[#EFECE6]'}`}
                      >
                        {win}
                      </button>
                    ))}
                  </div>
                </div>

                {availability === 'Custom' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Start Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                        <input type="datetime-local" className="w-full pl-10 pr-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">End Date & Time</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                        <input type="datetime-local" className="w-full pl-10 pr-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Usage & Redemption */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#EFECE6]">
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Usage Limit</label>
                  <input type="number" placeholder="Unlimited" className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8]" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2">Redemption Method</label>
                  <select className="w-full px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-xl text-sm font-bold text-[#1A1615] focus:outline-none focus:border-[#5844A8] appearance-none cursor-pointer">
                    <option>QR Code Scan</option>
                    <option>Voucher Code</option>
                    <option>Staff PIN</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="flex items-center gap-3 p-4 border border-[#EFECE6] bg-[#FAF8FF] rounded-xl cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-[#5844A8] w-5 h-5 cursor-pointer" />
                    <div>
                      <span className="block text-sm font-bold text-[#1A1615]">One-Time Redemption</span>
                      <span className="block text-[11px] text-[#6E6A66] mt-0.5">Voucher will be burnt and removed from wallet after use.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Live Preview */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 space-y-4">
            <h3 className="text-sm font-bold text-[#9E9A93] uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#5844A8]" /> Live Preview
            </h3>

            <div className="bg-white border border-[#EFECE6] rounded-xl p-4 shadow-sm hover:border-[#D1CDC7] transition-colors relative overflow-hidden">
              {/* Preview Card matching Rewards Catalog style */}
              <div className="w-full h-[140px] rounded-lg relative overflow-hidden shrink-0 bg-[#FAF8FF] flex items-center justify-center border border-[#EFECE6] mb-4">
                <div className="absolute top-2 left-2 bg-[#1A1615]/80 backdrop-blur-md text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20 z-10">PREVIEW</div>
                <div className="w-12 h-12 rounded bg-[#FAF5FF] flex items-center justify-center border border-[#E9D5FF]">
                  <ImageIcon className="w-6 h-6 text-[#5844A8]" />
                </div>
              </div>

              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#FAF8FF] border border-[#EFECE6] text-[#6E6A66] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {rewardTier}
                  </span>
                  <span className="bg-[#E6F4ED] text-[#0D7A53] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-[#BCE3D1]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> Active
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-[14px] font-bold text-[#5844A8]">{rewardCost || '0'} Stamps</div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-[#1A1615] mb-1">
                {rewardTitle || 'New Reward Title'}
              </h3>
              <p className="text-xs text-[#6E6A66] mb-4 leading-relaxed line-clamp-2">
                A short description of what the guest will receive when redeeming this reward.
              </p>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#EFECE6]">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6E6A66]">
                  <Clock className="w-3.5 h-3.5" /> {availability === 'Custom' ? 'Custom Window' : availability}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] text-[11px] font-bold rounded-lg cursor-not-allowed opacity-80">
                  <CreditCard className="w-3 h-3" /> QR Scan
                </div>
              </div>
            </div>

            <div className="bg-[#FAF5FF] border border-[#E9D5FF] rounded-xl p-4 flex items-start gap-3 mt-4">
              <AlertCircle className="w-5 h-5 text-[#5844A8] shrink-0 mt-0.5" />
              <p className="text-xs text-[#5844A8] font-medium leading-relaxed">
                Changes are previewed in real-time. Once activated, this reward will instantly synchronize to eligible guest wallets via Apple & Google Wallet integrations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 lg:left-[240px] right-0 bg-white border-t border-[#EFECE6] p-4 z-50">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate?.('/rewards')}
            className="hidden sm:block px-4 py-2 text-[13px] font-bold text-[#6E6A66] hover:text-[#1A1615] transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] rounded-lg text-[13px] font-bold hover:bg-[#EFECE6] transition-colors shadow-sm cursor-pointer">
              Save as Draft
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white rounded-lg text-[13px] font-bold shadow-md hover:opacity-95 transition-opacity cursor-pointer">
              <CheckCircle2 className="w-4 h-4" /> Create & Activate Reward
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
