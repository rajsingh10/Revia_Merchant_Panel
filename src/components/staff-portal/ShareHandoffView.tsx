import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  Info, 
  Search, 
  ShieldAlert,
  Flame,
  FileText
} from 'lucide-react';
import { DiningTable, StaffMember, ServiceRequestItem } from './types';

interface ShareHandoffViewProps {
  mode: 'handoff_table' | 'escalate_manager' | 'assign_request';
  table?: DiningTable;
  request?: ServiceRequestItem;
  staffList: StaffMember[];
  onBack: () => void;
  onConfirmHandoff: (tableNumber: string, targetStaffName: string, note?: string) => void;
  onConfirmEscalate: (details: { reason: string; note: string; priority: string; manager: string }) => void;
  onConfirmAssignRequest: (requestId: string, staffName: string) => void;
}

export const ShareHandoffView: React.FC<ShareHandoffViewProps> = ({
  mode,
  table,
  request,
  staffList,
  onBack,
  onConfirmHandoff,
  onConfirmEscalate,
  onConfirmAssignRequest,
}) => {
  // Handoff Table State
  const [selectedStaffId, setSelectedStaffId] = useState<string>(staffList[0]?.id || '');
  const [handoffNote, setHandoffNote] = useState<string>(
    'Please take over Table 12. Food is preparing and two customer requests still need attention.'
  );
  const [staffSearchQuery, setStaffSearchQuery] = useState<string>('');

  // Escalate Manager State
  const [escalationReason, setEscalationReason] = useState<string>('Service Delay');
  const [issueDescription, setIssueDescription] = useState<string>(
    'Customer requested the bill 15 minutes ago and has pinged four times. I need manager assistance to resolve the delay.'
  );
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('High');
  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const escalationReasons = [
    {
      id: 'Service Delay',
      title: 'Service Delay',
      desc: 'Customer waiting too long',
    },
    {
      id: 'Staff Unavailable',
      title: 'Staff Unavailable',
      desc: 'Unable to handle right now',
    },
    {
      id: 'Kitchen Delay',
      title: 'Kitchen Delay',
      desc: 'Follow-up needed on order',
    },
    {
      id: 'Customer Concern',
      title: 'Customer Concern',
      desc: 'Requires a manager response',
    },
  ];

  /* ---------------- ESCALATE TO MANAGER MODE ---------------- */
  if (mode === 'escalate_manager') {
    return (
      <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Escalate to Manager</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Request help with a delayed service request or customer issue.
            </p>
          </div>
        </div>

        {/* Urgent Request Banner */}
        <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
              !
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-sm">
                  Table {request?.tableNumber || '12'} • {request?.title || 'Bring the bill'}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-200 text-rose-800 rounded">
                  Needs Attention
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Karan Malhotra • 6 guests • Assigned to you
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-2.5 py-0.5 bg-rose-100 text-rose-700 text-xs font-bold rounded-md block">
              {request?.pings || 4} customer pings
            </span>
            <span className="text-[11px] text-gray-400 mt-0.5 block">
              Waiting {request?.waitingMinutes || 15} minutes
            </span>
          </div>
        </div>

        {/* 2-Column Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
            <div>
              <h3 className="text-sm font-bold text-gray-900">Tell the Manager What Happened</h3>
              <p className="text-xs text-gray-400 mt-0.5">Escalate this request without closing it.</p>
            </div>

            {/* Reason for Escalation */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Reason for Escalation *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {escalationReasons.map((r) => {
                  const isSel = escalationReason === r.id;
                  return (
                    <button
                      type="button"
                      key={r.id}
                      onClick={() => setEscalationReason(r.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all flex items-start justify-between ${
                        isSel
                          ? 'border-[#4A154B] bg-purple-50/40 text-purple-900 ring-2 ring-[#4A154B]/20 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{r.title}</p>
                        <p className="text-[11px] text-gray-500 font-normal mt-0.5">{r.desc}</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                        isSel ? 'border-[#4A154B] bg-[#4A154B]' : 'border-gray-300'
                      }`}>
                        {isSel && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Describe Issue */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                Describe the issue *
              </label>
              <textarea
                rows={3}
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
              />
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Priority</label>
              <div className="flex items-center gap-2">
                {(['Normal', 'High', 'Urgent'] as const).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      priority === p
                        ? p === 'Urgent'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : p === 'High'
                          ? 'bg-rose-50 text-rose-700 border border-rose-300 ring-1 ring-rose-200'
                          : 'bg-gray-800 text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <span>●</span>
                    <span>{p}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: Send To & Context Info */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-gray-900">Send To</h3>
              <p className="text-xs text-gray-400 -mt-2">Branch manager / authorised supervisor</p>

              {/* Manager Card */}
              <div className="p-3.5 rounded-xl border border-[#4A154B] bg-purple-50/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-200 text-[#4A154B] font-bold flex items-center justify-center text-xs">
                    PK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-900">Priyanka Kapoor</span>
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">
                        Available
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">Branch Manager • Sector 18</p>
                  </div>
                </div>
                <div className="w-4 h-4 rounded-full border border-[#4A154B] bg-[#4A154B] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
              </div>

              <p className="text-[11px] text-gray-400">
                The manager receives the table number, request history, ping count and your explanation.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-sm font-bold text-gray-900">Request Still Active</h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Request</span>
                  <span className="font-bold text-gray-800">{request?.title || 'Bring the bill'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Current assignee</span>
                  <span className="font-bold text-gray-800">Rohan Singh</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-400">Current status</span>
                  <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded text-[10px]">
                    Assigned
                  </span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900">
                Escalating alerts the manager but does not automatically complete, cancel or reassign this request.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Action Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirmEscalate({
                reason: escalationReason,
                note: issueDescription,
                priority,
                manager: 'Priyanka Kapoor',
              });
            }}
            className="px-6 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Send Escalation</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  /* ---------------- HANDOFF TABLE MODE ---------------- */
  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Handoff Table</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Transfer responsibility for a table to another authorised employee.
          </p>
        </div>
      </div>

      {/* Target Table Banner */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-bold">
            T{table?.tableNumber || '12'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">Table {table?.tableNumber || '12'}</span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-100 text-rose-700 rounded">
                ⚠ Needs Attention
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {table?.customerName || 'Karan Malhotra'} • {table?.guestsCount || 6} guests • Indoor Dining • Birthday celebration
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs font-bold text-gray-700 block">Occupied • 54 min</span>
          <span className="text-[11px] text-gray-400 mt-0.5 block">Assigned waiter: Rohan Singh</span>
        </div>
      </div>

      {/* 2-Column Handoff Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Transfer Table Responsibility */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-gray-900">Transfer Table Responsibility</h3>
            <p className="text-xs text-gray-400 mt-0.5">Select someone to take over service for Table {table?.tableNumber || '12'}</p>
          </div>

          <div className="p-3.5 bg-gray-50 rounded-xl text-xs text-gray-600 border border-gray-200/60">
            <span className="font-semibold text-gray-800">Currently assigned:</span> Rohan Singh (You). The transfer applies to the table, not automatically to separately assigned service requests.
          </div>

          {/* Search Eligible Staff */}
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search eligible staff..."
              value={staffSearchQuery}
              onChange={(e) => setStaffSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl"
            />
          </div>

          {/* Staff List */}
          <div className="space-y-3">
            {staffList.filter((s) => {
              if (staffSearchQuery.trim()) {
                return s.name.toLowerCase().includes(staffSearchQuery.toLowerCase());
              }
              return true;
            }).map((s) => {
              const isSelected = selectedStaffId === s.id;
              const isAvailable = s.status === 'Available';

              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedStaffId(s.id)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'border-[#4A154B] bg-purple-50/40 ring-2 ring-[#4A154B]/20'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#4A154B] font-bold flex items-center justify-center text-xs">
                      {s.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-gray-900">{s.name}</span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {s.role} • Floor A • {s.activeTablesCount} current {s.activeTablesCount === 1 ? 'table' : 'tables'}
                      </p>
                    </div>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                    isSelected ? 'border-[#4A154B] bg-[#4A154B]' : 'border-gray-300'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Handoff Note */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Handoff Note (Optional)
            </label>
            <textarea
              rows={2}
              value={handoffNote}
              onChange={(e) => setHandoffNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            />
          </div>
        </div>

        {/* Right Col: What Will Be Handed Over? */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-gray-900">What Will Be Handed Over?</h3>
            <p className="text-xs text-gray-400 -mt-2">Information available to the new table owner</p>

            {/* 3 Metric Pills */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Guests</span>
                <span className="font-bold text-base text-gray-900">{table?.guestsCount || 6}</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Orders</span>
                <span className="font-bold text-base text-gray-900">2</span>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 font-bold block uppercase">Requests</span>
                <span className="font-bold text-base text-gray-900">2</span>
              </div>
            </div>

            {/* Breakdown specs */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Food</span>
                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 font-bold rounded text-[10px]">
                  Preparing
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Outstanding service wait</span>
                <span className="font-bold text-rose-600">15 min</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Current table owner</span>
                <span className="font-bold text-gray-800">Rohan Singh</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-400">Proposed new owner</span>
                <span className="font-bold text-purple-900">{selectedStaff.name}</span>
              </div>
            </div>

            {/* Pink Notice Box */}
            <div className="p-3.5 bg-rose-50/70 border border-rose-200 rounded-xl text-[11px] text-rose-800 leading-relaxed">
              The receiving waiter will be notified of the handoff. The table's ownership changes only once the handoff is accepted or approved according to branch rules.
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirmHandoff(table?.tableNumber || '12', selectedStaff.name, handoffNote);
          }}
          className="px-6 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
        >
          <span>Send Handoff Request</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

