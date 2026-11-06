import React, { useState } from 'react';
import { CalendarHeart, Gift, PartyPopper, CheckCircle2, Plus, Trash2, ChevronDown } from 'lucide-react';

const CustomSelect = ({ 
  value, 
  onChange, 
  options 
}: { 
  value: string; 
  onChange: (val: string) => void; 
  options: { label: string; value: string }[] 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedLabel = options.find(o => o.value === value)?.label || value;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full bg-[#FAF8FF] border border-[#E5E0D8] rounded-lg px-3 py-2 text-[13px] font-semibold text-[#1A1615] focus:outline-none focus:border-[#5844A8] transition-colors cursor-pointer"
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className={`w-full cursor-pointer px-3 py-2 text-left text-[13px] hover:bg-[#FAF5FF] ${value === opt.value ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const AutomatedEventsSettings: React.FC = () => {
  const [birthdayEnabled, setBirthdayEnabled] = useState(true);
  const [birthdayTiming, setBirthdayTiming] = useState('30_days_before');
  const [birthdayCampaign, setBirthdayCampaign] = useState('Free Birthday Coffee');

  const [birthdayDeleted, setBirthdayDeleted] = useState(false);

  const [anniversaryEnabled, setAnniversaryEnabled] = useState(true);
  const [anniversaryTiming, setAnniversaryTiming] = useState('30_days_before');
  const [anniversaryCampaign, setAnniversaryCampaign] = useState('Anniversary 20% Off');
  const [anniversaryDeleted, setAnniversaryDeleted] = useState(false);

  const [customEvents, setCustomEvents] = useState<{id: number, name: string, enabled: boolean, timing: string, campaign: string}[]>([]);

  const addCustomEvent = () => {
    setCustomEvents([...customEvents, { 
      id: Date.now(), 
      name: 'New Custom Event', 
      enabled: true, 
      timing: 'on_day', 
      campaign: 'Double Stamps Day' 
    }]);
  };

  const updateCustomEvent = (id: number, field: string, value: any) => {
    setCustomEvents(customEvents.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const deleteCustomEvent = (id: number) => {
    setCustomEvents(customEvents.filter(e => e.id !== id));
  };

  const [saving, setSaving] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Automated events saved successfully.');
    }, 700);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] bg-[#FAF8FF] px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <CalendarHeart className="h-4 w-4 text-[#B7842C]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A1615]">Life Events & Automations</span>
          </div>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#1A1615]">Automated Milestone Campaigns</h2>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-lg bg-[#5844A8] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#47368E] transition-colors disabled:opacity-70 cursor-pointer"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="p-4 space-y-6">
        <p className="text-sm text-[#6E6A66]">
          Configure campaigns to automatically send to your customers based on their milestones. These will be sent automatically based on the timing you select.
        </p>

        {/* Birthday Settings */}
        {!birthdayDeleted && (
          <div className={`relative rounded-xl border ${birthdayEnabled ? 'border-[#B7842C] shadow-sm' : 'border-[#E5E0D8]'} p-4 sm:p-5 bg-white transition-all`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${birthdayEnabled ? 'bg-purple-100 text-[#5844A8]' : 'bg-[#FAF5FF] text-[#9E9A93]'}`}>
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1A1615]">Customer Birthday Automation</h3>
                  <p className="text-xs text-[#6E6A66] mt-0.5">Send a reward leading up to the customer's special day.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setBirthdayDeleted(true)} 
                  className="p-1.5 text-[#9E9A93] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-md transition-colors cursor-pointer"
                  title="Remove Automation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={birthdayEnabled}
                    onChange={() => setBirthdayEnabled(!birthdayEnabled)}
                  />
                  <div className="w-9 h-5 bg-[#E5E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D7A53]"></div>
                </label>
              </div>
            </div>

            <div className={`grid sm:grid-cols-2 gap-4 ${birthdayEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Send Timing</label>
                <CustomSelect 
                  value={birthdayTiming}
                  onChange={setBirthdayTiming}
                  options={[
                    { value: 'on_day', label: 'On their birthday' },
                    { value: '7_days_before', label: '7 days before' },
                    { value: '14_days_before', label: '14 days before' },
                    { value: '30_days_before', label: '30 days before' }
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Campaign to Send</label>
                <CustomSelect 
                  value={birthdayCampaign}
                  onChange={setBirthdayCampaign}
                  options={[
                    { value: 'Free Birthday Coffee', label: 'Free Birthday Coffee' },
                    { value: 'Birthday 50% Off', label: 'Birthday 50% Off' },
                    { value: 'Double Stamps Day', label: 'Double Stamps Day' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Anniversary Settings */}
        {!anniversaryDeleted && (
          <div className={`relative rounded-xl border ${anniversaryEnabled ? 'border-[#B7842C] shadow-sm' : 'border-[#E5E0D8]'} p-4 sm:p-5 bg-white transition-all`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className={`p-2.5 rounded-lg shrink-0 ${anniversaryEnabled ? 'bg-purple-100 text-[#5844A8]' : 'bg-[#FAF5FF] text-[#9E9A93]'}`}>
                  <PartyPopper className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-[#1A1615]">Membership Anniversary Automation</h3>
                  <p className="text-xs text-[#6E6A66] mt-0.5">Celebrate the anniversary of when the customer joined your loyalty program.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => setAnniversaryDeleted(true)} 
                  className="p-1.5 text-[#9E9A93] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-md transition-colors cursor-pointer"
                  title="Remove Automation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={anniversaryEnabled}
                    onChange={() => setAnniversaryEnabled(!anniversaryEnabled)}
                  />
                  <div className="w-9 h-5 bg-[#E5E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D7A53]"></div>
                </label>
              </div>
            </div>

            <div className={`grid sm:grid-cols-2 gap-4 ${anniversaryEnabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Send Timing</label>
                <CustomSelect 
                  value={anniversaryTiming}
                  onChange={setAnniversaryTiming}
                  options={[
                    { value: 'on_day', label: 'On the anniversary date' },
                    { value: '7_days_before', label: '7 days before' },
                    { value: '14_days_before', label: '14 days before' },
                    { value: '30_days_before', label: '30 days before' }
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Campaign to Send</label>
                <CustomSelect 
                  value={anniversaryCampaign}
                  onChange={setAnniversaryCampaign}
                  options={[
                    { value: 'Anniversary 20% Off', label: 'Anniversary 20% Off' },
                    { value: 'Anniversary Free Upgrade', label: 'Anniversary Free Upgrade' },
                    { value: 'Double Stamps Day', label: 'Double Stamps Day' }
                  ]}
                />
              </div>
            </div>
          </div>
        )}

        {/* Custom Settings */}
        {customEvents.map((evt) => (
          <div key={evt.id} className={`rounded-xl border ${evt.enabled ? 'border-[#B7842C] shadow-sm' : 'border-[#E5E0D8]'} p-4 sm:p-5 bg-white transition-all relative`}>
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-start gap-3 w-full max-w-sm">
                <div className={`p-2.5 rounded-lg shrink-0 ${evt.enabled ? 'bg-purple-100 text-[#5844A8]' : 'bg-[#FAF5FF] text-[#9E9A93]'}`}>
                  <CalendarHeart className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <input 
                    type="text" 
                    value={evt.name}
                    onChange={(e) => updateCustomEvent(evt.id, 'name', e.target.value)}
                    className="text-[15px] font-bold text-[#1A1615] bg-transparent border-b border-transparent hover:border-[#E5E0D8] focus:border-[#5844A8] focus:outline-none w-full pb-0.5 placeholder:text-[#9E9A93] transition-colors"
                    placeholder="Event Name (e.g. VIP Status)"
                  />
                  <p className="text-xs text-[#6E6A66] mt-0.5">Custom milestone trigger</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button 
                  onClick={() => deleteCustomEvent(evt.id)} 
                  className="p-1.5 text-[#9E9A93] hover:text-[#DC2626] hover:bg-[#FEE2E2] rounded-md transition-colors cursor-pointer"
                  title="Remove Automation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={evt.enabled}
                    onChange={() => updateCustomEvent(evt.id, 'enabled', !evt.enabled)}
                  />
                  <div className="w-9 h-5 bg-[#E5E0D8] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D7A53]"></div>
                </label>
              </div>
            </div>

            <div className={`grid sm:grid-cols-2 gap-4 ${evt.enabled ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Send Timing</label>
                <CustomSelect 
                  value={evt.timing}
                  onChange={(val) => updateCustomEvent(evt.id, 'timing', val)}
                  options={[
                    { value: 'on_day', label: 'On the date' },
                    { value: '7_days_before', label: '7 days before' },
                    { value: '14_days_before', label: '14 days before' },
                    { value: '30_days_before', label: '30 days before' }
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#6E6A66] uppercase tracking-wider">Campaign to Send</label>
                <CustomSelect 
                  value={evt.campaign}
                  onChange={(val) => updateCustomEvent(evt.id, 'campaign', val)}
                  options={[
                    { value: 'Free Birthday Coffee', label: 'Free Birthday Coffee' },
                    { value: 'Birthday 50% Off', label: 'Birthday 50% Off' },
                    { value: 'Anniversary 20% Off', label: 'Anniversary 20% Off' },
                    { value: 'Anniversary Free Upgrade', label: 'Anniversary Free Upgrade' },
                    { value: 'Double Stamps Day', label: 'Double Stamps Day' },
                    { value: 'Custom Event Promo', label: 'Custom Event Promo' }
                  ]}
                />
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={addCustomEvent}
          className="w-full rounded-xl border border-dashed border-[#B7842C] bg-[#FCF1DF] py-4 text-[13px] font-bold text-[#B7842C] hover:bg-[#F5E6CD] transition-colors flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> Add Custom Event Automation
        </button>
      </div>
      
      {feedbackToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl z-50 animate-in fade-in slide-in-from-bottom-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#0D7A53]" />
          {feedbackToast}
        </div>
      )}
    </div>
  );
};
