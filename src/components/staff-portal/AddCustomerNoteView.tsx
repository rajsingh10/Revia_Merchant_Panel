import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Utensils, 
  Gift, 
  Armchair, 
  Bell, 
  ChefHat, 
  FileText, 
  Check, 
  Users, 
  Layers, 
  Info 
} from 'lucide-react';
import { DiningTable } from './types';

interface AddCustomerNoteViewProps {
  table?: DiningTable;
  onBack: () => void;
  onSaveNote: (noteData: {
    target: string;
    category: string;
    note: string;
    visibility: string;
    attachTo: string;
  }) => void;
}

export const AddCustomerNoteView: React.FC<AddCustomerNoteViewProps> = ({
  table,
  onBack,
  onSaveNote,
}) => {
  const [noteTarget, setNoteTarget] = useState<'table' | 'profile' | 'order'>('table');
  const [category, setCategory] = useState<string>('Seating Preference');
  const [noteText, setNoteText] = useState<string>(
    'Guest prefers less spicy food and may order shortly. Mention the Welcome Special if eligible. Window-side preference if available.'
  );
  const [visibility, setVisibility] = useState<string>('Visible to Floor Staff');
  const [attachTo, setAttachTo] = useState<string>('Current Visit');

  const categories = [
    { id: 'Allergy / Dietary', label: 'Allergy / Dietary', icon: <Utensils className="w-4 h-4 text-rose-500" /> },
    { id: 'Birthday / Occasion', label: 'Birthday / Occasion', icon: <Gift className="w-4 h-4 text-pink-500" /> },
    { id: 'Seating Preference', label: 'Seating Preference', icon: <Armchair className="w-4 h-4 text-[#5844A8]" /> },
    { id: 'Service Preference', label: 'Service Preference', icon: <Bell className="w-4 h-4 text-amber-500" /> },
    { id: 'Kitchen Instruction', label: 'Kitchen Instruction', icon: <ChefHat className="w-4 h-4 text-amber-600" /> },
    { id: 'General Note', label: 'General Note', icon: <FileText className="w-4 h-4 text-purple-600" /> },
  ];

  const templates = [
    'Birthday celebration',
    'Window-side preferred',
    'No onion / no garlic',
    'High chair needed',
    'Customer will pay later',
    'Repeat visitor',
  ];

  const handleApplyTemplate = (tpl: string) => {
    if (!noteText.includes(tpl)) {
      setNoteText((prev) => (prev ? `${prev} ${tpl}.` : `${tpl}.`));
    }
  };

  const handleSave = () => {
    onSaveNote({
      target: noteTarget,
      category,
      note: noteText,
      visibility,
      attachTo,
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-600 cursor-pointer shadow-2xs transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Add Customer Note</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Capture table-specific details for smoother service.
          </p>
        </div>
      </div>

      {/* Target Table Header Banner */}
      <div className="p-4 bg-white border border-purple-100 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <span className="font-black text-sm text-[#1E1548]">
            TABLE #{table?.number || table?.tableNumber || '07'}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            ● Occupied
          </span>
          <div className="flex items-center gap-2 pl-2 border-l border-gray-200 text-xs">
            <span className="font-bold text-gray-800">{table?.customerName || 'Aarav Gupta'}</span>
            <span className="text-gray-400 font-medium">• {table?.guestsCount || 2} guests • Walk-in visit</span>
          </div>
        </div>

        <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
          <Bell className="w-3.5 h-3.5 text-amber-600" />
          <span>No food order yet</span>
        </span>
      </div>

      {/* 2-Column Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Note Editor Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-6">
          {/* 1. Who is this note for? */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#5844A8]" />
              <span>Who is this note for?</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'table', label: 'This table visit' },
                { id: 'profile', label: 'Customer profile' },
                { id: 'order', label: 'Order only' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setNoteTarget(opt.id as any)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    noteTarget === opt.id
                      ? 'bg-[#1E1548] text-white shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-200'
                  }`}
                >
                  {noteTarget === opt.id && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Note Category */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-1">
              Note Category
            </label>
            <p className="text-[11px] text-gray-400 font-medium mb-3">Choose a category to help the team understand the note quickly.</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`p-3 rounded-2xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                      isSelected
                        ? 'border-[#5844A8] bg-purple-50/40 text-[#5844A8] ring-2 ring-purple-200 font-black'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-purple-200 font-bold'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-gray-50 flex items-center justify-center">
                        {cat.icon}
                      </div>
                      <span className="text-xs">{cat.label}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#5844A8] stroke-[3] shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Quick note templates */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-1">
              Quick note templates
            </label>
            <p className="text-[11px] text-gray-400 font-medium mb-2.5">Tap a template to add it to your note (you can still edit it).</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((tpl) => (
                <button
                  key={tpl}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="py-1.5 px-3 rounded-xl border border-gray-200 hover:border-purple-300 text-gray-700 text-[11px] font-bold text-center bg-white shadow-2xs hover:bg-purple-50/20 transition cursor-pointer"
                >
                  {tpl}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Customer Note Textarea */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-1">
              Customer Note
            </label>
            <p className="text-[11px] text-gray-400 font-medium mb-2">Add the note details for the team.</p>
            <div className="relative">
              <textarea
                rows={3}
                value={noteText}
                maxLength={300}
                onChange={(e) => setNoteText(e.target.value)}
                className="w-full p-4 rounded-2xl bg-purple-50/20 border border-purple-200 text-xs font-medium text-gray-900 focus:outline-none focus:border-[#5844A8] focus:bg-white"
              />
              <span className="text-[10px] text-gray-400 font-bold block text-right mt-1">
                {noteText.length} / 300
              </span>
            </div>
          </div>

          {/* 5. Visibility / Scope */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-1">
              Visibility / Scope
            </label>
            <p className="text-[11px] text-gray-400 font-medium mb-2">Choose who can see this note.</p>

            <div className="grid grid-cols-3 gap-2">
              {[
                'Visible to Floor Staff',
                'Visible to Kitchen',
                'Visible to Manager',
              ].map((vis) => (
                <button
                  key={vis}
                  type="button"
                  onClick={() => setVisibility(vis)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    visibility === vis
                      ? 'bg-purple-50 text-[#5844A8] border-2 border-[#5844A8] shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-200'
                  }`}
                >
                  {visibility === vis && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span className="truncate">{vis}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 6. Attach to */}
          <div>
            <label className="block text-xs font-black text-[#1E1548] mb-1">
              Attach to
            </label>
            <p className="text-[11px] text-gray-400 font-medium mb-2">Link this note to the right record.</p>

            <div className="grid grid-cols-3 gap-2">
              {[
                'Reservation',
                'Current Visit',
                'Current Order',
              ].map((att) => (
                <button
                  key={att}
                  type="button"
                  onClick={() => setAttachTo(att)}
                  className={`py-2 px-2 text-center rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    attachTo === att
                      ? 'bg-purple-50 text-[#5844A8] border-2 border-[#5844A8] shadow-2xs'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-purple-200'
                  }`}
                >
                  {attachTo === att && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  <span>{att}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onBack}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave();
                setNoteText('');
              }}
              className="px-5 py-2.5 rounded-xl border border-[#1E1548] text-[#1E1548] text-xs font-bold hover:bg-purple-50/50 shadow-2xs"
            >
              Save & Add Another
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer"
            >
              Save Note
            </button>
          </div>
        </div>

        {/* Right Column: How this helps cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-purple-100/70 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-[#1E1548] border-b border-gray-100 pb-3 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-[#5844A8]" />
              <span>How this helps</span>
            </h3>

            <div className="space-y-3.5">
              <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1E1548]">Staff can see context quickly.</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Floor waiters and runners read notes before approaching the table.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                  <ChefHat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1E1548]">Kitchen receives special instructions if shared.</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Allergies and prep preferences appear on station tickets.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-[#1E1548]">Notes remain attached to this table visit.</h4>
                  <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                    Records persist throughout service until the table is closed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

