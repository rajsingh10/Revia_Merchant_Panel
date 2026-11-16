import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Flame, 
  User, 
  CheckCircle2, 
  AlertTriangle, 
  MessageSquare, 
  Share2, 
  CheckSquare, 
  Square,
  Sparkles,
  HelpCircle,
  Send
} from 'lucide-react';
import { ServiceRequestItem, StaffMember } from './types';

interface RequestDetailsViewProps {
  request: ServiceRequestItem;
  staffList: StaffMember[];
  onBack: () => void;
  onClaim: (requestId: string) => void;
  onComplete: (requestId: string, notes?: string) => void;
  onEscalate: (request: ServiceRequestItem) => void;
  onAssignToColleague: (requestId: string, staffName: string) => void;
}

export const RequestDetailsView: React.FC<RequestDetailsViewProps> = ({
  request,
  staffList,
  onBack,
  onClaim,
  onComplete,
  onEscalate,
  onAssignToColleague,
}) => {
  const [taskStep1, setTaskStep1] = useState(false);
  const [taskStep2, setTaskStep2] = useState(false);
  const [completionNote, setCompletionNote] = useState('');
  const [showAssignDropdown, setShowAssignDropdown] = useState(false);

  const isAssignedToMe = request.assignedToStaffName?.toLowerCase().includes('rohan');
  const isCompleted = request.status === 'completed';
  const isInProgress = request.status === 'in_progress';

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Request #{request.id}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800'
                  : isInProgress
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {isCompleted ? 'Completed' : isInProgress ? 'In Progress' : 'Awaiting Claim'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              Table {request.tableNumber} • {request.title}
            </p>
          </div>
        </div>

        {!isCompleted && (
          <button
            onClick={() => onEscalate(request)}
            className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Escalate</span>
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
        {/* Banner with Pings & Timers */}
        <div className="bg-gray-50/70 p-5 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Waiting: {request.waitingMinutes} minutes</span>
            </div>
            {request.pings > 1 && (
              <div className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                <Flame className="w-3.5 h-3.5" />
                <span>{request.pings} Customer Pings</span>
              </div>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Assigned: <span className="font-semibold text-gray-800">{request.assignedToStaffName || 'Unassigned'}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Request Details */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Request Item</h3>
            <p className="text-xl font-bold text-gray-900">{request.title}</p>
            {request.specialInstruction && (
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-900">
                <span className="font-semibold">Guest Note:</span> {request.specialInstruction}
              </div>
            )}
          </div>

          {/* If In Progress: Delivery Checklist */}
          {isInProgress && (
            <div className="p-5 bg-purple-50/40 rounded-2xl border border-purple-100 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-purple-900">Fulfillment Checklist</h4>
                <span className="text-xs text-purple-600 font-medium">Verify before completing</span>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  onClick={() => setTaskStep1(!taskStep1)}
                  className="flex items-center gap-3 text-left w-full p-2.5 rounded-xl hover:bg-white/80 transition-colors"
                >
                  {taskStep1 ? (
                    <CheckSquare className="w-5 h-5 text-[#4A154B]" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm ${taskStep1 ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                    1. Collect {request.title} from pantry/bar counter
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setTaskStep2(!taskStep2)}
                  className="flex items-center gap-3 text-left w-full p-2.5 rounded-xl hover:bg-white/80 transition-colors"
                >
                  {taskStep2 ? (
                    <CheckSquare className="w-5 h-5 text-[#4A154B]" />
                  ) : (
                    <Square className="w-5 h-5 text-gray-400" />
                  )}
                  <span className={`text-sm ${taskStep2 ? 'line-through text-gray-400' : 'text-gray-800 font-medium'}`}>
                    2. Deliver to guest at Table {request.tableNumber}
                  </span>
                </button>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-purple-900 mb-1">
                  Optional Note for Log
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handed to customer with warm smile"
                  value={completionNote}
                  onChange={(e) => setCompletionNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A154B]/30"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  onClick={() => onEscalate(request)}
                  className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200"
                >
                  ⚠ Request Help
                </button>
                <button
                  onClick={() => onComplete(request.id, completionNote)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Completed</span>
                </button>
              </div>
            </div>
          )}

          {/* If Unassigned: Claim / Assign Actions */}
          {!isInProgress && !isCompleted && (
            <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200/70 space-y-4">
              <h4 className="text-sm font-bold text-gray-900">Claim or Assign this Request</h4>
              <p className="text-xs text-gray-500">
                This request is currently waiting for a waiter to accept and fulfill it.
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onClaim(request.id)}
                  className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Claim & Start Task</span>
                </button>

                <div className="relative">
                  <button
                    onClick={() => setShowAssignDropdown(!showAssignDropdown)}
                    className="px-4 py-2.5 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Assign to Staff...</span>
                  </button>

                  {showAssignDropdown && (
                    <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-20">
                      <div className="px-3 py-1.5 text-[11px] font-bold text-gray-400 uppercase">
                        Available Waiters
                      </div>
                      {staffList.map(s => (
                        <button
                          key={s.id}
                          onClick={() => {
                            onAssignToColleague(request.id, s.name);
                            setShowAssignDropdown(false);
                          }}
                          className="w-full px-3 py-2 text-left hover:bg-purple-50 text-xs flex items-center justify-between text-gray-800"
                        >
                          <span className="font-medium">{s.name}</span>
                          <span className="text-[10px] text-gray-400">{s.activeTablesCount} tables</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Activity Log */}
          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Activity Log</h3>
            <div className="space-y-3 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
              <div className="relative">
                <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-purple-600 ring-4 ring-white" />
                <p className="text-xs font-semibold text-gray-800">Request submitted by customer</p>
                <p className="text-[11px] text-gray-400">Via Table {request.tableNumber} QR Code • {request.createdAt}</p>
              </div>

              {request.pings > 1 && (
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-4 ring-white" />
                  <p className="text-xs font-semibold text-rose-700">Customer reminder pings sent ({request.pings - 1} times)</p>
                  <p className="text-[11px] text-gray-400">Guest tapped bell icon for urgent assistance</p>
                </div>
              )}

              {request.assignedToStaffName && (
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-white" />
                  <p className="text-xs font-semibold text-gray-800">Assigned to {request.assignedToStaffName}</p>
                  <p className="text-[11px] text-gray-400">Staff acknowledged task</p>
                </div>
              )}

              {isCompleted && (
                <div className="relative">
                  <span className="absolute -left-6 top-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <p className="text-xs font-semibold text-emerald-800">Completed & verified</p>
                  <p className="text-[11px] text-gray-400">Items delivered to Table {request.tableNumber}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

