import React, { useState, useEffect, useRef } from 'react';
import { Coins, MessageCircle, Smartphone, Save, ChevronDown, CheckCircle2, AlertCircle } from 'lucide-react';

export const MerchantPlatformSettings: React.FC = () => {
  const [currency, setCurrency] = useState('INR');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [whatsappEnabled, setWhatsappEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  const getSymbol = () => {
    switch (currency) {
      case 'USD': return '$';
      case 'GBP': return '£';
      case 'EUR': return '€';
      case 'INR': default: return '₹';
    }
  };
  const sym = getSymbol();

  const handleSave = () => {
    // Save logic here
    console.log({ currency, whatsappEnabled, smsEnabled });
  };

  return (
    <div className="w-full font-sans bg-white p-3 sm:p-6">
      <div className="w-full">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight">Platform Settings</h1>
          <p className="text-sm text-[#7C746C] mt-1">Manage global preferences for your Revia merchant instance.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* CARD 1: Currency Configuration */}
          <div className="flex-1 bg-white rounded-[16px] border border-[#EFECE6] p-6 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-[#EFECE6] flex items-center justify-center text-[#5844A8]">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#1A1615]">Currency Configuration</h2>
                <p className="text-[13px] text-[#6E6A66]">Set your primary business currency.</p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] block mb-2">Business Currency</label>
                <div ref={currencyDropdownRef} className="relative max-w-md">
                  <button
                    type="button"
                    onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#FAF8FF] border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
                  >
                    <span>
                      {currency === 'INR' ? 'INR — Indian Rupee (₹)' :
                       currency === 'USD' ? 'USD — US Dollar ($)' :
                       currency === 'GBP' ? 'GBP — British Pound (£)' :
                       'EUR — Euro (€)'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {currencyDropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full overflow-hidden rounded-md border border-[#EFECE6] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                      {[
                        { val: 'INR', label: 'INR — Indian Rupee (₹)' },
                        { val: 'USD', label: 'USD — US Dollar ($)' },
                        { val: 'GBP', label: 'GBP — British Pound (£)' },
                        { val: 'EUR', label: 'EUR — Euro (€)' }
                      ].map((curr) => (
                        <button
                          key={curr.val}
                          type="button"
                          onClick={() => { setCurrency(curr.val); setCurrencyDropdownOpen(false); }}
                          className={`w-full cursor-pointer px-3 py-2 text-left text-[14px] hover:bg-[#FAF5FF] ${currency === curr.val ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                        >
                          {curr.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="mt-2 text-[12px] text-[#9E9A93] font-medium leading-relaxed max-w-xl">
                  All billing thresholds, campaign targets, and reward values will display and calculate using this currency.
                </p>
              </div>

              <div className="bg-[#FAF8FF] border border-[#EFECE6] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E9A93] shrink-0">Sample Preview</div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-[#1A1615]">
                  <span>Minimum Billing: {sym}1,000</span>
                  <span className="hidden sm:inline text-[#D1CDC7]">·</span>
                  <span>Campaign Target: {sym}10,000</span>
                  <span className="hidden sm:inline text-[#D1CDC7]">·</span>
                  <span>Quarterly Target: {sym}10,00,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 2: Communication Channels */}
          <div className="flex-1 bg-white rounded-[16px] border border-[#EFECE6] p-4 lg:p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8FF] border border-[#EFECE6] flex items-center justify-center text-[#5844A8]">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-[#1A1615]">Communication Channels</h2>
                <p className="text-[13px] text-[#6E6A66]">Manage outbound notification gateways.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* WhatsApp Row */}
              <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl border border-[#EFECE6] bg-[#FAF8FF] hover:border-[#D1CDC7] transition-colors">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#0D7A53] shrink-0 shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-[#1A1615]">WhatsApp</h3>
                      {whatsappEnabled ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E6F4ED] text-[#0D7A53] border border-[#BCE3D1]">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#9E9A93] border border-[#EFECE6]">
                          <AlertCircle className="w-3 h-3" /> Not Configured
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6E6A66] mb-1.5 leading-relaxed">
                      Send campaign alerts and reward notifications via WhatsApp.
                    </p>
                    <button className="text-[11px] font-bold text-[#5844A8] hover:text-[#47368E] transition-colors">
                      Configure API Key &rarr;
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                  className={`relative w-12 h-6 rounded-full border-2 transition-all cursor-pointer shrink-0 mt-1 sm:mt-0 ${whatsappEnabled ? 'bg-[#5844A8] border-[#47368E]' : 'bg-[#EFECE6] border-[#D1CDC7]'
                    }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${whatsappEnabled ? 'left-[26px]' : 'left-0.5'
                    }`} />
                </button>
              </div>

              {/* SMS Row */}
              <div className="flex items-start sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-5 rounded-xl border border-[#EFECE6] bg-[#FAF8FF] hover:border-[#D1CDC7] transition-colors">
                <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-white border border-[#EFECE6] flex items-center justify-center text-[#1A1615] shrink-0 shadow-sm">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center flex-wrap gap-2 mb-1">
                      <h3 className="text-[14px] font-bold text-[#1A1615]">SMS</h3>
                      {smsEnabled ? (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#E6F4ED] text-[#0D7A53] border border-[#BCE3D1]">
                          <CheckCircle2 className="w-3 h-3" /> Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#9E9A93] border border-[#EFECE6]">
                          <AlertCircle className="w-3 h-3" /> Not Configured
                        </span>
                      )}
                    </div>
                    <p className="text-[12px] text-[#6E6A66] mb-1.5 leading-relaxed">
                      Send OTP and campaign notifications via SMS.
                    </p>
                    <button className="text-[11px] font-bold text-[#5844A8] hover:text-[#47368E] transition-colors">
                      Configure Gateway &rarr;
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSmsEnabled(!smsEnabled)}
                  className={`relative w-12 h-6 rounded-full border-2 transition-all cursor-pointer shrink-0 mt-1 sm:mt-0 ${smsEnabled ? 'bg-[#5844A8] border-[#47368E]' : 'bg-[#EFECE6] border-[#D1CDC7]'
                    }`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${smsEnabled ? 'left-[26px]' : 'left-0.5'
                    }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white text-[13px] font-bold rounded-lg cursor-pointer hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
