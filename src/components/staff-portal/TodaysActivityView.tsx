import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Check, 
  CheckCircle2, 
  Clock, 
  Utensils, 
  Bell, 
  MessageSquare, 
  Users, 
  ChevronDown 
} from 'lucide-react';

interface TodaysActivityViewProps {
  onBack: () => void;
  onViewRecord: (type: string, ref: string) => void;
}

export const TodaysActivityView: React.FC<TodaysActivityViewProps> = ({
  onBack,
  onViewRecord,
}) => {
  const [filter, setFilter] = useState<'All' | 'Requests' | 'Orders' | 'Other'>('All');

  const timelineItems = [
    {
      time: '11:22 AM',
      type: 'Orders',
      title: 'Order served',
      desc: 'Table 03 • #ORD-1019 • Food delivered',
      icon: <Utensils className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'ORD-1019',
    },
    {
      time: '11:08 AM',
      type: 'Requests',
      title: 'Service request completed',
      desc: 'Table 03 • Drinking water ×1',
      icon: <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />,
      iconBg: 'bg-emerald-100',
      refId: 'SR-1065',
    },
    {
      time: '10:56 AM',
      type: 'Orders',
      title: 'Food order created',
      desc: 'Table 07 • #ORD-1072 • Sent to kitchen',
      icon: <Utensils className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'ORD-1072',
    },
    {
      time: '10:43 AM',
      type: 'Requests',
      title: 'Request claimed',
      desc: 'Table 05 • Extra tissues ×2',
      icon: <Bell className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'SR-1042',
    },
    {
      time: '10:30 AM',
      type: 'Other',
      title: 'Manager updated',
      desc: 'Table 12 • Service-delay follow-up',
      icon: <MessageSquare className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'MGR-12',
    },
    {
      time: '10:17 AM',
      type: 'Other',
      title: 'Reservation created',
      desc: 'Table 08 • Ananya Gupta • Tomorrow 7:30 PM',
      icon: <Calendar className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'RES-2091',
    },
    {
      time: '10:02 AM',
      type: 'Other',
      title: 'Table handoff received',
      desc: 'Table 05 • Assigned to you by Manager',
      icon: <Users className="w-4 h-4 text-[#5844A8]" />,
      iconBg: 'bg-purple-100',
      refId: 'HO-05',
    },
  ];

  const filteredItems = timelineItems.filter((it) => {
    if (filter === 'All') return true;
    return it.type === filter;
  });

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
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
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Today's Activity</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            A clear record of the work you have performed today.
          </p>
        </div>
      </div>

      {/* Date Banner */}
      <div className="p-4 bg-rose-50/40 border border-rose-100 rounded-2xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white border border-rose-200 text-rose-500 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-xs text-[#1E1548]">Friday, 6 November 2026</h3>
            <p className="text-[11px] text-gray-400 font-medium">Your activity for the selected branch • Rohan Singh</p>
          </div>
        </div>

        <button
          type="button"
          className="px-3 py-1.5 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-gray-400" />
          <span>Today</span>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
        </button>
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-emerald-100 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[3]" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1E1548]">7</span>
            <p className="text-xs text-gray-400 font-medium">Requests completed</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-rose-100 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1E1548]">3</span>
            <p className="text-xs text-gray-400 font-medium">Orders created</p>
          </div>
        </div>

        <div className="p-4 bg-white border border-purple-100 rounded-3xl shadow-xs flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-2xl font-black text-[#1E1548]">4</span>
            <p className="text-xs text-gray-400 font-medium">Orders served</p>
          </div>
        </div>
      </div>

      {/* Work Timeline */}
      <div className="bg-white rounded-3xl border border-purple-100/70 p-6 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
          <div>
            <h3 className="font-black text-sm text-[#1E1548]">Work Timeline</h3>
            <p className="text-xs text-gray-400 font-medium">Actions appear in time order and link to their original records.</p>
          </div>

          <div className="flex items-center gap-1.5">
            {(['All', 'Requests', 'Orders', 'Other'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                  filter === tab
                    ? 'bg-[#1E1548] text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline rows */}
        <div className="space-y-6 relative before:content-[''] before:absolute before:left-[82px] sm:before:left-[96px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
          {filteredItems.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between gap-3 relative">
              <div className="flex items-center gap-3 sm:gap-4 flex-1">
                <span className="text-xs font-bold text-gray-400 w-16 sm:w-20 text-right shrink-0">
                  {item.time}
                </span>

                <div className="w-4 h-4 rounded-full bg-white border-2 border-purple-500 z-10 shrink-0" />

                <div className={`w-8 h-8 rounded-xl ${item.iconBg} flex items-center justify-center shrink-0`}>
                  {item.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xs text-[#1E1548]">{item.title}</h4>
                  <p className="text-[11px] text-gray-400 truncate">{item.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onViewRecord(item.type, item.refId)}
                className="px-3 py-1 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-gray-700 shadow-2xs shrink-0 cursor-pointer"
              >
                View &gt;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <p className="text-[11px] text-gray-400 font-medium text-center pt-2">
        This is an activity log, not attendance or payroll. Updates are recorded automatically when a staff member completes an action.
      </p>
    </div>
  );
};

