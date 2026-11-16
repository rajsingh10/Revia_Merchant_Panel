import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Send, 
  Share2, 
  CheckCircle2, 
  AlertTriangle, 
  Bell, 
  User, 
  Flame,
  ChefHat
} from 'lucide-react';
import { FoodOrder, DiningTable, StaffMember } from './types';

/* ---------------- PING KITCHEN MODAL ---------------- */
interface PingKitchenModalProps {
  order: FoodOrder;
  onClose: () => void;
  onSendPing: (orderId: string, reason: string, note?: string) => void;
}

export const PingKitchenModal: React.FC<PingKitchenModalProps> = ({
  order,
  onClose,
  onSendPing,
}) => {
  const [reason, setReason] = useState('Customer asking for status update / delayed item');
  const [note, setNote] = useState('');

  const reasons = [
    'Customer asking for status update / delayed item',
    'Order has exceeded estimated preparation time',
    'Guest requested priority rush',
    'Other special follow-up',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-[#4A154B] rounded-xl">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Ping Kitchen</h3>
              <p className="text-xs text-gray-500">#{order.id} • Table {order.tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Send a priority ping notification directly to the Kitchen Display System (KDS) station handling this ticket.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Reason for Follow-up *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            >
              {reasons.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Optional Message for Chef
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Guests have a flight to catch in 30 minutes..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSendPing(order.id, reason, note)}
            className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Send Follow-up</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------------- SHARE SUMMARY MODAL ---------------- */
interface ShareSummaryModalProps {
  table: DiningTable;
  staffList: StaffMember[];
  onClose: () => void;
  onSendSummary: (recipient: string, note: string) => void;
}

export const ShareSummaryModal: React.FC<ShareSummaryModalProps> = ({
  table,
  staffList,
  onClose,
  onSendSummary,
}) => {
  const [recipient, setRecipient] = useState(staffList[0]?.name || 'Meera Joshi');
  const [note, setNote] = useState('');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-50 text-[#4A154B] rounded-xl">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base">Share Table Summary</h3>
              <p className="text-xs text-gray-500">Table {table.tableNumber} • {table.customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-500">
          Send a quick status digest containing orders, pending service requests, and running value to a colleague or manager.
        </p>

        <div className="p-3 bg-gray-50 rounded-xl space-y-1.5 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-400">Current Status:</span>
            <span className="font-semibold text-gray-800">{table.orderStatus}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Running Total:</span>
            <span className="font-semibold text-[#4A154B]">₹{table.runningValue}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Active Requests:</span>
            <span className="font-semibold text-rose-600">{table.activeRequests.length} pending</span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Select Recipient *
            </label>
            <select
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            >
              {staffList.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.role} • {s.status})
                </option>
              ))}
              <option value="Priyanka Kapoor">Priyanka Kapoor (Branch Manager)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">
              Optional Note
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Please watch table while I am in the pantry..."
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A154B]/20"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSendSummary(recipient, note)}
            className="px-5 py-2.5 bg-[#4A154B] hover:bg-[#3d113d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Share Summary</span>
          </button>
        </div>
      </div>
    </div>
  );
};

