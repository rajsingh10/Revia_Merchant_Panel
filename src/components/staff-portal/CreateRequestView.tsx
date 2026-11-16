import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Coffee, 
  Receipt, 
  HelpCircle, 
  Utensils, 
  Layers,
  User,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ServiceRequestItem, DiningTable, StaffMember } from './types';

interface CreateRequestViewProps {
  tables: DiningTable[];
  staffList: StaffMember[];
  initialTableNumber?: string;
  onBack: () => void;
  onSubmit: (newRequest: Partial<ServiceRequestItem>) => void;
}

export const CreateRequestView: React.FC<CreateRequestViewProps> = ({
  tables,
  staffList,
  initialTableNumber,
  onBack,
  onSubmit,
}) => {
  const [selectedTableNum, setSelectedTableNum] = useState<string>(initialTableNumber || '05');
  const [requestType, setRequestType] = useState<string>('Tissues');
  const [quantity, setQuantity] = useState<number>(2);
  const [specialInstruction, setSpecialInstruction] = useState<string>('');
  const [assignmentMode, setAssignmentMode] = useState<'myself' | 'colleague' | 'open'>('myself');
  const [selectedColleagueId, setSelectedColleagueId] = useState<string>(staffList[0]?.id || '');

  const currentTable = tables.find(t => t.tableNumber === selectedTableNum);

  const requestTypes = [
    { id: 'Tissues', label: 'Tissues', icon: <Layers className="w-5 h-5" /> },
    { id: 'Drinking Water', label: 'Drinking Water', icon: <Coffee className="w-5 h-5" /> },
    { id: 'Cutlery', label: 'Cutlery', icon: <Utensils className="w-5 h-5" /> },
    { id: 'Bill', label: 'Bill / Payment', icon: <Receipt className="w-5 h-5" /> },
    { id: 'Assistance', label: 'Staff Assistance', icon: <HelpCircle className="w-5 h-5" /> },
    { id: 'Other', label: 'Other Special', icon: <Sparkles className="w-5 h-5" /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let assignedStaffName: string | undefined = undefined;
    let status: 'unassigned' | 'in_progress' | 'completed' = 'unassigned';

    if (assignmentMode === 'myself') {
      assignedStaffName = 'Rohan Singh (You)';
      status = 'in_progress';
    } else if (assignmentMode === 'colleague') {
      const colleague = staffList.find(s => s.id === selectedColleagueId);
      assignedStaffName = colleague?.name || 'Assigned Staff';
      status = 'in_progress';
    } else {
      status = 'unassigned';
    }

    const title = quantity > 1 ? `${requestType} ×${quantity}` : requestType;

    onSubmit({
      tableNumber: selectedTableNum,
      type: requestType,
      title,
      quantity,
      specialInstruction: specialInstruction.trim() || undefined,
      assignedToStaffName: assignedStaffName,
      status,
      waitingMinutes: 0,
      pings: 1,
      createdAt: 'Just now',
    });
  };

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create Service Request</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Log a new service or item request for any active table.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Select Table & Customer */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Table & Customer
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Target Table *
              </label>
              <select
                value={selectedTableNum}
                onChange={(e) => setSelectedTableNum(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20 focus:border-[#4A154B]"
              >
                {tables.map(t => (
                  <option key={t.id} value={t.tableNumber}>
                    Table {t.tableNumber} ({t.customerName} • {t.guestsCount} guests)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                readOnly
                value={currentTable?.customerName || 'Walk-in Guest'}
                className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-600 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Request Type Grid */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            What does the guest need? *
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {requestTypes.map((type) => {
              const isSelected = requestType === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => setRequestType(type.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border text-center transition-all ${
                    isSelected
                      ? 'border-[#4A154B] bg-[#4A154B]/5 text-[#4A154B] ring-2 ring-[#4A154B]/20 font-semibold'
                      : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mb-2 ${isSelected ? 'bg-[#4A154B] text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {type.icon}
                  </div>
                  <span className="text-sm">{type.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quantity Stepper */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <span className="text-sm font-semibold text-gray-700">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-gray-900 text-sm">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Special Instructions */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Special Instructions / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={specialInstruction}
              onChange={(e) => setSpecialInstruction(e.target.value)}
              placeholder="e.g. Warm water requested, extra lemons on the side..."
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20 focus:border-[#4A154B]"
            />
          </div>
        </div>

        {/* Step 3: Assignment Routing */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
            Who will handle this request?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <label className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
              assignmentMode === 'myself'
                ? 'border-[#4A154B] bg-[#4A154B]/5 ring-1 ring-[#4A154B]'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="assignment"
                value="myself"
                checked={assignmentMode === 'myself'}
                onChange={() => setAssignmentMode('myself')}
                className="mt-0.5 text-[#4A154B] focus:ring-[#4A154B]"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Myself (Rohan)</p>
                <p className="text-xs text-gray-500 mt-0.5">I will fulfill this immediately</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
              assignmentMode === 'colleague'
                ? 'border-[#4A154B] bg-[#4A154B]/5 ring-1 ring-[#4A154B]'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="assignment"
                value="colleague"
                checked={assignmentMode === 'colleague'}
                onChange={() => setAssignmentMode('colleague')}
                className="mt-0.5 text-[#4A154B] focus:ring-[#4A154B]"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Another Staff</p>
                <p className="text-xs text-gray-500 mt-0.5">Delegate to a team member</p>
              </div>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex items-start gap-3 transition-all ${
              assignmentMode === 'open'
                ? 'border-[#4A154B] bg-[#4A154B]/5 ring-1 ring-[#4A154B]'
                : 'border-gray-200 hover:border-gray-300'
            }`}>
              <input
                type="radio"
                name="assignment"
                value="open"
                checked={assignmentMode === 'open'}
                onChange={() => setAssignmentMode('open')}
                className="mt-0.5 text-[#4A154B] focus:ring-[#4A154B]"
              />
              <div>
                <p className="font-semibold text-sm text-gray-900">Leave Open</p>
                <p className="text-xs text-gray-500 mt-0.5">Any available staff can claim</p>
              </div>
            </label>
          </div>

          {assignmentMode === 'colleague' && (
            <div className="pt-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Select Available Staff
              </label>
              <select
                value={selectedColleagueId}
                onChange={(e) => setSelectedColleagueId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
              >
                {staffList.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.role} • {s.status} • {s.activeTablesCount} tables)
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Bottom CTAs */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
          >
            Submit Request
          </button>
        </div>
      </form>
    </div>
  );
};

