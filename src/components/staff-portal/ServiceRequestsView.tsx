import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  Bell, 
  Search, 
  Filter, 
  CheckCircle2, 
  User, 
  Plus, 
  ArrowRight, 
  UserCheck, 
  ChevronRight,
  Flame,
  Coffee,
  Receipt,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { ServiceRequestItem } from './types';

interface ServiceRequestsViewProps {
  requests: ServiceRequestItem[];
  onSelectRequest: (request: ServiceRequestItem) => void;
  onOpenCreateRequest: () => void;
  onClaimRequest: (requestId: string) => void;
  onEscalateRequest: (request: ServiceRequestItem) => void;
}

export const ServiceRequestsView: React.FC<ServiceRequestsViewProps> = ({
  requests,
  onSelectRequest,
  onOpenCreateRequest,
  onClaimRequest,
  onEscalateRequest,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'assigned_to_me' | 'available' | 'in_progress' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filterTabs = [
    { id: 'all', label: 'All Open', count: requests.filter(r => r.status !== 'completed').length },
    { id: 'assigned_to_me', label: 'Assigned to Me', count: requests.filter(r => r.assignedToStaffName?.toLowerCase().includes('rohan') && r.status !== 'completed').length },
    { id: 'available', label: 'Available to Claim', count: requests.filter(r => r.status === 'unassigned').length },
    { id: 'in_progress', label: 'In Progress', count: requests.filter(r => r.status === 'in_progress').length },
    { id: 'completed', label: 'Completed', count: requests.filter(r => r.status === 'completed').length },
  ];

  const filteredRequests = requests.filter(req => {
    // Filter by tab
    if (activeFilter === 'assigned_to_me') {
      if (!req.assignedToStaffName?.toLowerCase().includes('rohan') || req.status === 'completed') return false;
    } else if (activeFilter === 'available') {
      if (req.status !== 'unassigned') return false;
    } else if (activeFilter === 'in_progress') {
      if (req.status !== 'in_progress') return false;
    } else if (activeFilter === 'completed') {
      if (req.status !== 'completed') return false;
    } else {
      if (req.status === 'completed') return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTable = req.tableNumber.toLowerCase().includes(q);
      const matchType = req.type.toLowerCase().includes(q);
      const matchStaff = req.assignedToStaffName?.toLowerCase().includes(q);
      const matchInstruction = req.specialInstruction?.toLowerCase().includes(q);
      return matchTable || matchType || matchStaff || matchInstruction;
    }

    return true;
  });

  const urgentRequest = requests.find(r => r.pings >= 4 && r.status !== 'completed');

  const getRequestIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bill':
      case 'bring the bill':
        return <Receipt className="w-5 h-5 text-purple-600" />;
      case 'drinking water':
      case 'drinking water x1':
        return <Coffee className="w-5 h-5 text-blue-600" />;
      default:
        return <Sparkles className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Service Requests</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            View, claim, and fulfill live guest requests across all tables.
          </p>
        </div>
        <button
          onClick={onOpenCreateRequest}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Request</span>
        </button>
      </div>

      {/* Urgent Overdue Banner */}
      {urgentRequest && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-xl mt-0.5">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-rose-900">Table {urgentRequest.tableNumber} needs immediate attention!</span>
                <span className="px-2 py-0.5 text-xs font-semibold bg-rose-600 text-white rounded-full">Urgent</span>
              </div>
              <p className="text-sm text-rose-700 mt-1">
                {urgentRequest.title} • Waiting {urgentRequest.waitingMinutes} min • {urgentRequest.pings} customer pings • Assigned to {urgentRequest.assignedToStaffName || 'Unassigned'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 self-end md:self-center">
            <button
              onClick={() => onEscalateRequest(urgentRequest)}
              className="px-4 py-2 bg-white text-rose-700 hover:bg-rose-100 border border-rose-300 text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Escalate to Manager
            </button>
            <button
              onClick={() => onSelectRequest(urgentRequest)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Take Action Now
            </button>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by table, item, staff name, or instruction..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20 focus:border-[#4A154B]"
            />
          </div>
          <button className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>
        </div>

        {/* Tab Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-[#4A154B] text-white shadow-xs'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                activeFilter === tab.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-900">All caught up!</h3>
            <p className="text-sm text-gray-500 mt-1">No requests matching the selected filter.</p>
          </div>
        ) : (
          filteredRequests.map((req) => {
            const isUrgent = req.pings >= 3;
            const isMine = req.assignedToStaffName?.toLowerCase().includes('rohan');

            return (
              <div
                key={req.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs hover:shadow-sm ${
                  isUrgent ? 'border-rose-300 ring-1 ring-rose-200' : 'border-gray-100'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Icon + Details */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl shrink-0 ${
                      req.status === 'in_progress'
                        ? 'bg-amber-50 text-amber-600'
                        : req.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-purple-50 text-purple-600'
                    }`}>
                      {getRequestIcon(req.type)}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-gray-900 text-base">
                          Table {req.tableNumber}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="font-semibold text-gray-800 text-sm">
                          {req.title}
                        </span>
                        {isUrgent && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-rose-100 text-rose-700 rounded-md flex items-center gap-1">
                            <Flame className="w-3 h-3 text-rose-600" />
                            {req.pings} pings
                          </span>
                        )}
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${
                          req.status === 'in_progress'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : req.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {req.status === 'in_progress' ? 'In Progress' : req.status === 'completed' ? 'Completed' : 'Awaiting Claim'}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          Waiting {req.waitingMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          {req.assignedToStaffName ? (
                            <span className={isMine ? 'font-semibold text-purple-800' : ''}>
                              Assigned to {req.assignedToStaffName}
                            </span>
                          ) : (
                            <span className="text-amber-600 font-medium">Unassigned</span>
                          )}
                        </span>
                        {req.specialInstruction && (
                          <span className="italic text-gray-600 max-w-md truncate">
                            "{req.specialInstruction}"
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="flex items-center gap-2 self-end lg:self-center">
                    {req.status === 'unassigned' && (
                      <button
                        onClick={() => onClaimRequest(req.id)}
                        className="px-3.5 py-2 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Claim & Start</span>
                      </button>
                    )}

                    {req.status === 'in_progress' && isMine && (
                      <button
                        onClick={() => onSelectRequest(req)}
                        className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Task</span>
                      </button>
                    )}

                    {isUrgent && (
                      <button
                        onClick={() => onEscalateRequest(req)}
                        className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Escalate
                      </button>
                    )}

                    <button
                      onClick={() => onSelectRequest(req)}
                      className="px-3 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1"
                    >
                      <span>Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

