import React from 'react';
import { 
  ArrowLeft, 
  Bell, 
  Clock, 
  Star, 
  User, 
  Users, 
  ShieldCheck, 
  HelpCircle, 
  LogOut, 
  ChevronRight 
} from 'lucide-react';

interface StaffMenuHubViewProps {
  onBack: () => void;
  onNavigateTo: (destination: 'notifications' | 'activity' | 'feedback' | 'profile' | 'team_handoffs' | 'access' | 'support' | 'logout') => void;
}

export const StaffMenuHubView: React.FC<StaffMenuHubViewProps> = ({
  onBack,
  onNavigateTo,
}) => {
  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
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
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">Menu</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Quick access to your work, account and support.
          </p>
        </div>
      </div>

      {/* Staff Profile Card */}
      <div className="bg-[#4A154B] text-white rounded-3xl p-6 sm:p-7 shadow-lg relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/10 border-2 border-white/20 text-white font-black text-xl flex items-center justify-center shrink-0">
            RS
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl font-black tracking-tight">Rohan Singh</h2>
            <p className="text-xs text-purple-200 font-medium">
              Waiter • Noida, Sector 18
            </p>
            <p className="text-[11px] text-purple-300">
              Employee ID • STF-0215
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto">
          <span className="px-3 py-1.5 rounded-full bg-white text-[#1E1548] text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Available</span>
          </span>
        </div>
      </div>

      {/* Section: My Work */}
      <div className="space-y-3">
        <h3 className="font-black text-sm text-[#1E1548]">My Work</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Notifications */}
          <button
            type="button"
            onClick={() => onNavigateTo('notifications')}
            className="p-5 bg-white border border-purple-100/70 hover:border-purple-300 rounded-3xl text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#1E1548] group-hover:text-[#5844A8] transition">
                  Notifications
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Requests & kitchen updates
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
          </button>

          {/* Today's Activity */}
          <button
            type="button"
            onClick={() => onNavigateTo('activity')}
            className="p-5 bg-white border border-purple-100/70 hover:border-purple-300 rounded-3xl text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#1E1548] group-hover:text-[#5844A8] transition">
                  Today's Activity
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Your work history
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
          </button>

          {/* My Feedback */}
          <button
            type="button"
            onClick={() => onNavigateTo('feedback')}
            className="p-5 bg-white border border-purple-100/70 hover:border-purple-300 rounded-3xl text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#1E1548] group-hover:text-[#5844A8] transition">
                  My Feedback
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Customer ratings
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
          </button>

          {/* My Profile */}
          <button
            type="button"
            onClick={() => onNavigateTo('profile')}
            className="p-5 bg-white border border-purple-100/70 hover:border-purple-300 rounded-3xl text-left transition cursor-pointer flex items-center justify-between shadow-xs group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-[#5844A8] flex items-center justify-center shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-sm text-[#1E1548] group-hover:text-[#5844A8] transition">
                  My Profile
                </h4>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Employee details & permissions
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition" />
          </button>
        </div>
      </div>

      {/* Section: Support & Settings */}
      <div className="space-y-3 pt-2">
        <h3 className="font-black text-sm text-[#1E1548]">Support & Settings</h3>
        <div className="bg-white rounded-3xl border border-purple-100/70 divide-y divide-gray-100 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={() => onNavigateTo('team_handoffs')}
            className="w-full p-4.5 px-6 flex items-center justify-between hover:bg-gray-50/70 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#1E1548]">Team & Handoffs</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('access')}
            className="w-full p-4.5 px-6 flex items-center justify-between hover:bg-gray-50/70 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#1E1548]">My Access</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('support')}
            className="w-full p-4.5 px-6 flex items-center justify-between hover:bg-gray-50/70 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-[#1E1548]">Help & Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo('logout')}
            className="w-full p-4.5 px-6 flex items-center justify-between hover:bg-rose-50/40 transition text-left cursor-pointer text-rose-600"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="font-bold text-xs text-rose-600">Log Out</span>
            </div>
            <ChevronRight className="w-4 h-4 text-rose-300" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <p className="text-[11px] text-gray-400 font-medium text-center pt-2">
        This menu only shows features enabled for the logged-in waiter. Branch and staff permissions are managed through the existing Merchant/Manager Portal.
      </p>
    </div>
  );
};

