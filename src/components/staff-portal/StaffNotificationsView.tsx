import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Bell, 
  AlertTriangle, 
  Utensils, 
  MessageSquare, 
  Check, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Flame
} from 'lucide-react';
import { StaffNotificationItem } from './types';

interface StaffNotificationsViewProps {
  onBack: () => void;
  onStartTask: (tableNumber: string, requestId?: string) => void;
  onEscalate: (tableNumber: string, requestId?: string) => void;
  onClaimRequest: (requestId: string) => void;
  onAssignRequest: (requestId: string) => void;
  onServeOrder: (orderId: string) => void;
  onViewRequest: (requestId: string) => void;
  onReplyManager: () => void;
}

export const StaffNotificationsView: React.FC<StaffNotificationsViewProps> = ({
  onBack,
  onStartTask,
  onEscalate,
  onClaimRequest,
  onAssignRequest,
  onServeOrder,
  onViewRequest,
  onReplyManager,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'requests' | 'orders' | 'manager'>('all');
  const [readIds, setReadIds] = useState<string[]>([]);

  const notifications: StaffNotificationItem[] = [
    {
      id: 'notif-1',
      type: 'urgent_ping',
      title: 'Repeated customer ping',
      badge: '4 Pings',
      badgeType: 'danger',
      tableNumber: '12',
      actionSubject: 'Bring the bill',
      description: 'Customer pinged again (4 pings total). Waiting 15 min.',
      timeAgo: 'Just now',
      isRead: false,
      category: 'Requests',
      relatedId: 'SR-1001',
    },
    {
      id: 'notif-2',
      type: 'awaiting_assignment',
      title: 'Request awaiting assignment',
      badge: '3 Pings',
      badgeType: 'danger',
      tableNumber: '05',
      actionSubject: 'Extra tissues ×2',
      description: 'Unassigned • Waiting 8 min • Customer pinged 3 times.',
      timeAgo: '2 min ago',
      isRead: false,
      category: 'Requests',
      relatedId: 'SR-1042',
    },
    {
      id: 'notif-3',
      type: 'food_ready',
      title: 'Food ready for service',
      badge: 'Ready',
      badgeType: 'success',
      tableNumber: '09',
      actionSubject: 'Order #ORD-1036',
      description: 'Kitchen marked all items ready. Confirm pickup and delivery.',
      timeAgo: '5 min ago',
      isRead: false,
      category: 'Orders',
      relatedId: 'ORD-1036',
    },
    {
      id: 'notif-4',
      type: 'assigned_to_you',
      title: 'Request assigned to you',
      tableNumber: '12',
      actionSubject: 'Bring the bill',
      description: 'Assigned by Branch Manager. Customer is awaiting service.',
      timeAgo: '12 min ago',
      isRead: false,
      category: 'Requests',
      relatedId: 'SR-1001',
    },
    {
      id: 'notif-5',
      type: 'manager_followup',
      title: 'Manager follow-up',
      tableNumber: '12',
      actionSubject: 'Urgent service delay',
      description: 'Manager has requested a status update for the customer.',
      timeAgo: '18 min ago',
      isRead: false,
      category: 'Manager',
    },
  ];

  const handleMarkAllRead = () => {
    setReadIds(notifications.map(n => n.id));
  };

  const filteredNotifications = notifications.filter(n => {
    if (activeFilter === 'requests') return n.category === 'Requests';
    if (activeFilter === 'orders') return n.category === 'Orders';
    if (activeFilter === 'manager') return n.category === 'Manager';
    return true;
  });

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
      {/* 1. Header with back button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-600 cursor-pointer shadow-2xs transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Notifications</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Customer pings, order updates and messages that need your attention.
          </p>
        </div>
      </div>

      {/* 2. Filters & Mark Read */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: 'all', label: 'All (5)' },
            { id: 'requests', label: 'Requests (3)' },
            { id: 'orders', label: 'Orders (1)' },
            { id: 'manager', label: 'Manager (1)' },
          ].map((pill) => (
            <button
              key={pill.id}
              type="button"
              onClick={() => setActiveFilter(pill.id as any)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer shadow-2xs ${
                activeFilter === pill.id
                  ? 'bg-[#1E1548] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Mark Read button */}
        <button
          type="button"
          onClick={handleMarkAllRead}
          className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-xs font-bold text-gray-700 shadow-2xs flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Mark Read</span>
        </button>
      </div>

      {/* 3. Latest Updates Header */}
      <div className="flex items-center justify-between text-xs font-bold">
        <span className="text-[#1E1548] uppercase tracking-wider text-sm font-black">Latest Updates</span>
        <span className="text-gray-400 font-medium">Tap an alert or use a quick action</span>
      </div>

      {/* 4. Notifications List */}
      <div className="space-y-3.5">
        {filteredNotifications.map((n) => {
          const isRead = readIds.includes(n.id);

          return (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border bg-white shadow-xs hover:border-purple-200 transition relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                n.type === 'urgent_ping'
                  ? 'border-rose-100 bg-rose-50/20'
                  : n.type === 'food_ready'
                  ? 'border-emerald-100 bg-emerald-50/20'
                  : 'border-purple-100/70'
              }`}
            >
              {/* Unread indicator dot */}
              {!isRead && (
                <span className="absolute top-5 right-5 w-2 h-2 rounded-full bg-rose-500" />
              )}

              {/* Left Column: Icon + Content */}
              <div className="flex items-start gap-4">
                {/* Type Icon */}
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
                  n.type === 'urgent_ping'
                    ? 'bg-rose-100 text-rose-600'
                    : n.type === 'awaiting_assignment'
                    ? 'bg-rose-50 text-rose-500'
                    : n.type === 'food_ready'
                    ? 'bg-emerald-100 text-emerald-700'
                    : n.type === 'manager_followup'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-purple-100 text-[#5844A8]'
                }`}>
                  {n.type === 'urgent_ping' && <AlertTriangle className="w-5 h-5" />}
                  {n.type === 'awaiting_assignment' && <Bell className="w-5 h-5" />}
                  {n.type === 'food_ready' && <Utensils className="w-5 h-5" />}
                  {n.type === 'assigned_to_you' && <Bell className="w-5 h-5" />}
                  {n.type === 'manager_followup' && <MessageSquare className="w-5 h-5" />}
                </div>

                {/* Text Content */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-[#1E1548]">{n.title}</h3>
                    {n.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        n.badgeType === 'danger'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {n.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-bold text-gray-800">
                    Table {n.tableNumber} • {n.actionSubject}
                  </p>

                  <p className="text-[11px] text-gray-500 font-medium">
                    {n.description}
                  </p>

                  <p className="text-[10px] text-gray-400 font-semibold pt-0.5">
                    {n.timeAgo}
                  </p>
                </div>
              </div>

              {/* Right Column: Actions */}
              <div className="flex items-center gap-2 self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                {n.type === 'urgent_ping' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onStartTask(n.tableNumber, n.relatedId)}
                      className="px-4 py-2 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Start Task</span>
                      <span>&rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onEscalate(n.tableNumber, n.relatedId)}
                      className="px-3.5 py-2 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold cursor-pointer"
                    >
                      Escalate
                    </button>
                  </>
                )}

                {n.type === 'awaiting_assignment' && (
                  <>
                    <button
                      type="button"
                      onClick={() => onClaimRequest(n.relatedId || 'SR-1042')}
                      className="px-4 py-2 rounded-xl bg-[#1E1548] hover:bg-[#2D1F63] text-white text-xs font-black shadow-md cursor-pointer flex items-center gap-1.5"
                    >
                      <span>Claim Request</span>
                      <span>&rarr;</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => onAssignRequest(n.relatedId || 'SR-1042')}
                      className="px-3.5 py-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:border-purple-200 text-xs font-bold cursor-pointer"
                    >
                      Assign
                    </button>
                  </>
                )}

                {n.type === 'food_ready' && (
                  <button
                    type="button"
                    onClick={() => onServeOrder(n.relatedId || 'ORD-1036')}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md shadow-emerald-900/10 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Serve Order</span>
                    <span>&rarr;</span>
                  </button>
                )}

                {n.type === 'assigned_to_you' && (
                  <button
                    type="button"
                    onClick={() => onViewRequest(n.relatedId || 'SR-1001')}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    View Request
                  </button>
                )}

                {n.type === 'manager_followup' && (
                  <button
                    type="button"
                    onClick={onReplyManager}
                    className="px-4 py-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-700 text-xs font-bold cursor-pointer"
                  >
                    Reply
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

