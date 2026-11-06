import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Clock,
  BarChart2,
  Calendar,
  Download,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Plus,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Check,
  X,
  FileText,
  SlidersHorizontal,
  Briefcase,
  Sparkles,
  MapPin,
  TrendingUp,
  Award,
  AlertCircle,
  Eye,
  Key,
  ShieldCheck,
  Edit2,
  Share2,
  PieChart,
  UserCheck,
  Store,
  Printer,
  ChevronUp,
  Radio,
  CheckSquare,
  Square,
  Lock,
  Unlock,
  RefreshCw,
  Bell,
  Coffee,
  MoreVertical,
  Sliders,
  DollarSign,
  Gift,
  QrCode,
  Tag
} from 'lucide-react';
import { NavRoute } from '../../types';

export interface TabletStaffViewProps {
  onNavigate?: (route: NavRoute) => void;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  roleType: 'System' | 'Custom';
  branch: string;
  status: 'Active' | 'Pending' | 'Disabled';
  email: string;
  phone: string;
  shifts: number;
  hours: number;
  tasks: number;
  lastActive: string;
  avatarBg: string;
  initials: string;
  employeeId: string;
  joinDate: string;
  location: string;
  accountStatus: string;
  state: string;
  city: string;
}

const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-1',
    name: 'Aarav Sharma',
    role: 'Branch Manager',
    roleType: 'System',
    branch: 'Main Branch',
    status: 'Active',
    email: 'aarav.sharma@thecoffeeclub.com',
    phone: '+91 98765 43210',
    shifts: 32,
    hours: 184,
    tasks: 156,
    lastActive: '2 hours ago',
    avatarBg: 'bg-purple-100 text-purple-700',
    initials: 'AS',
    employeeId: 'EMP001',
    joinDate: '12 Jan 2024',
    location: 'Noida - Sector 18',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-2',
    name: 'Priya Mehta',
    role: 'Branch Manager',
    roleType: 'System',
    branch: 'Sector 62',
    status: 'Active',
    email: 'priya.mehta@thecoffeeclub.com',
    phone: '+91 98765 43211',
    shifts: 24,
    hours: 160,
    tasks: 128,
    lastActive: '1 day ago',
    avatarBg: 'bg-blue-100 text-blue-700',
    initials: 'PM',
    employeeId: 'EMP002',
    joinDate: '20 Feb 2024',
    location: 'Noida - Sector 62',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-3',
    name: 'Rahul Verma',
    role: 'Cashier',
    roleType: 'System',
    branch: 'Riverside',
    status: 'Active',
    email: 'rahul.verma@thecoffeeclub.com',
    phone: '+91 98765 43212',
    shifts: 28,
    hours: 172,
    tasks: 210,
    lastActive: 'Today',
    avatarBg: 'bg-emerald-100 text-emerald-700',
    initials: 'RV',
    employeeId: 'EMP003',
    joinDate: '15 Mar 2024',
    location: 'Riverside',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Lucknow'
  },
  {
    id: 'st-4',
    name: 'Sneha Iyer',
    role: 'Store Staff',
    roleType: 'System',
    branch: 'Airport T2',
    status: 'Active',
    email: 'sneha.iyer@thecoffeeclub.com',
    phone: '+91 98765 43213',
    shifts: 18,
    hours: 120,
    tasks: 94,
    lastActive: '3 days ago',
    avatarBg: 'bg-teal-100 text-teal-700',
    initials: 'SI',
    employeeId: 'EMP004',
    joinDate: '01 Apr 2024',
    location: 'Airport T2',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Lucknow'
  },
  {
    id: 'st-5',
    name: 'Rohan Singh',
    role: 'Senior Waiter',
    roleType: 'System',
    branch: 'Sector 18',
    status: 'Active',
    email: 'rohan.s@thecoffeeclub.com',
    phone: '+91 98765 43215',
    shifts: 46,
    hours: 210,
    tasks: 340,
    lastActive: '10:42 AM',
    avatarBg: 'bg-purple-100 text-purple-700',
    initials: 'RS',
    employeeId: 'EMP005',
    joinDate: '10 Jan 2024',
    location: 'Noida - Sector 18',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-6',
    name: 'Neha Kapoor',
    role: 'Service Staff',
    roleType: 'System',
    branch: 'Sector 18',
    status: 'Pending',
    email: 'neha.k@thecoffeeclub.com',
    phone: '+91 98765 43216',
    shifts: 0,
    hours: 0,
    tasks: 0,
    lastActive: '10:18 AM',
    avatarBg: 'bg-pink-100 text-pink-700',
    initials: 'NK',
    employeeId: 'EMP006',
    joinDate: '05 May 2024',
    location: 'Noida - Sector 18',
    accountStatus: 'Pending',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-7',
    name: 'Arjun Patel',
    role: 'Kitchen Staff',
    roleType: 'System',
    branch: 'Expressway',
    status: 'Active',
    email: 'arjun.p@thecoffeeclub.com',
    phone: '+91 98765 43217',
    shifts: 30,
    hours: 168,
    tasks: 145,
    lastActive: '9:56 AM',
    avatarBg: 'bg-amber-100 text-amber-700',
    initials: 'AP',
    employeeId: 'EMP007',
    joinDate: '18 Jun 2024',
    location: 'Noida - Expressway',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-8',
    name: 'Vikram Kumar',
    role: 'Floor Manager',
    roleType: 'System',
    branch: 'Sector 18',
    status: 'Disabled',
    email: 'vikram.k@thecoffeeclub.com',
    phone: '+91 98765 43218',
    shifts: 22,
    hours: 140,
    tasks: 102,
    lastActive: '3 days ago',
    avatarBg: 'bg-gray-100 text-gray-700',
    initials: 'VK',
    employeeId: 'EMP008',
    joinDate: '25 Jul 2024',
    location: 'Noida - Sector 18',
    accountStatus: 'Disabled',
    state: 'Uttar Pradesh',
    city: 'Noida'
  }
];

export const TabletStaffView: React.FC<TabletStaffViewProps> = ({ onNavigate }) => {
  // Navigation tabs: 'staff' (management & directory) | 'permissions' (roles) | 'activity' (audit & detail) | 'reports' (reports & preview)
  const [currentTab, setCurrentTab] = useState<'staff' | 'permissions' | 'activity' | 'reports'>('staff');

  // Sub-views for 'staff' tab:
  // 'insights' (iPad Pro 12.9_ - 14 / 80)
  // 'directory' (iPad Pro 12.9_ - 15 / 90)
  // 'states' (iPad Pro 12.9_ - 87)
  // 'cities' (iPad Pro 12.9_ - 86)
  // 'branches' (iPad Pro 12.9_ - 88)
  // 'branch_staff' (iPad Pro 12.9_ - 89)
  const [staffSubView, setStaffSubView] = useState<'insights' | 'directory' | 'states' | 'cities' | 'branches' | 'branch_staff'>('insights');
  const [directoryMode, setDirectoryMode] = useState<'all' | 'location'>('all');

  // Selected hierarchy
  const [selectedState, setSelectedState] = useState<string>('Uttar Pradesh');
  const [selectedCity, setSelectedCity] = useState<string>('Noida');
  const [selectedBranch, setSelectedBranch] = useState<string>('Sector 18');

  // Profile modal / detail view (iPad Pro 12.9_ - 16, 17, 18, 19)
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'permissions' | 'branches' | 'activity'>('overview');

  // Activity sub-view: 'list' (iPad Pro 12.9_ - 38) vs 'detail' (iPad Pro 12.9_ - 39)
  const [activitySubView, setActivitySubView] = useState<'list' | 'detail'>('list');

  // Reports sub-view: 'categories' (iPad Pro 12.9_ - 40) vs 'performance' (iPad Pro 12.9_ - 41) vs 'audit' (iPad Pro 12.9_ - 42)
  const [reportsSubView, setReportsSubView] = useState<'categories' | 'performance' | 'audit'>('audit');

  // Add Staff Member Wizard (iPad Pro 12.9_ - 20, 91, 36, 24)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [addStaffStep, setAddStaffStep] = useState<1 | 2 | 3 | 4>(1);

  // Add Role Wizard (iPad Pro 12.9_ - 31, 36)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [addRoleStep, setAddRoleStep] = useState<1 | 2 | 3 | 4>(2);

  // Directory filter state
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'active' | 'pending' | 'disabled' | 'managers'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Add staff form inputs
  const [newStaffName, setNewStaffName] = useState('Aarav Sharma');
  const [newStaffEmpId, setNewStaffEmpId] = useState('EMP001');
  const [newStaffPhone, setNewStaffPhone] = useState('+91 98765 43210');
  const [newStaffEmail, setNewStaffEmail] = useState('aarav.sharma@thecoffeeclub.com');
  const [newStaffJobTitle, setNewStaffJobTitle] = useState('Branch Manager');
  const [selectedRoleForNewStaff, setSelectedRoleForNewStaff] = useState('Branch Manager');
  const [selectedBranchesForNewStaff, setSelectedBranchesForNewStaff] = useState<string[]>(['Main Branch', 'City Mall', 'Riverside']);

  // Selected staff object
  const activeStaff = INITIAL_STAFF.find(s => s.id === selectedStaffId) || INITIAL_STAFF[0];

  return (
    <div className="min-h-screen bg-[#FAF8FF] text-[#1A1615] flex flex-col font-sans pb-28">
      {/* Top Tablet Navigation Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#F1EFEA] px-4 sm:px-6 md:px-8 py-3.5 sm:py-4 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-base font-black text-[#1A1615] flex items-center gap-2">
              <span>Loyaltics</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                Tablet
              </span>
            </div>
            <div className="text-[11px] text-[#8C877D] font-bold">Merchant App • Staff Management</div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <button className="px-3 sm:px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#1A1615] flex items-center gap-1.5 bg-white shadow-2xs hover:border-gray-300">
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            onClick={() => {
              setIsAddStaffOpen(true);
              setAddStaffStep(1);
            }}
            className="px-3.5 sm:px-5 py-2 sm:py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 sm:gap-2 shadow-md shadow-purple-900/10 cursor-pointer transition-all shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Invite Staff</span>
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
        {/* ======================================================== */}
        {/* TAB 1: STAFF (Management, Overview, Directory & Location) */}
        {/* ======================================================== */}
        {currentTab === 'staff' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* SUB-VIEW 1: STAFF INSIGHTS / OVERVIEW (iPad Pro 12.9_ - 14 & 80) */}
            {staffSubView === 'insights' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff Management</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">
                      Manage staff, roles, access and activity across all branches.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStaffSubView('directory')}
                      className="px-4 py-2 bg-white border border-gray-200 text-xs font-black rounded-xl hover:border-purple-300 shadow-2xs flex items-center gap-1.5"
                    >
                      <Users className="w-4 h-4 text-purple-700" />
                      <span>Staff Directory</span>
                    </button>
                    <button
                      onClick={() => setStaffSubView('states')}
                      className="px-4 py-2 bg-purple-50 text-purple-800 text-xs font-black rounded-xl hover:bg-purple-100 transition-all flex items-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4 text-purple-700" />
                      <span>Staff by Location</span>
                    </button>
                  </div>
                </div>

                {/* 8 Stats Metrics Cards (Matching iPad Pro 12.9_ - 80) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Total Staff</span>
                      <Users className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">142</div>
                    <div className="text-[11px] font-bold text-gray-400 mt-0.5">All team members</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Active Accounts</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">128</div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">90% operational</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Pending Invitations</span>
                      <Mail className="w-4 h-4 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">10</div>
                    <div className="text-[11px] font-bold text-amber-600 mt-0.5">Awaiting activation</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Roles Created</span>
                      <FileText className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">18</div>
                    <div className="text-[11px] font-bold text-purple-600 mt-0.5">System & custom</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Branches Covered</span>
                      <Building2 className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">21</div>
                    <div className="text-[11px] font-bold text-sky-600 mt-0.5">Across 4 states</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Avg Branches / Staff</span>
                      <Share2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">6.8</div>
                    <div className="text-[11px] font-bold text-indigo-600 mt-0.5">Multi-branch access</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Full Access Users</span>
                      <Award className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">36</div>
                    <div className="text-[11px] font-bold text-amber-600 mt-0.5">Managers & Sups</div>
                  </div>

                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <div className="flex items-center justify-between text-[#8C877D]">
                      <span className="text-xs font-bold">Suspended Accounts</span>
                      <XCircle className="w-4 h-4 text-rose-500" />
                    </div>
                    <div className="text-2xl font-black text-[#1A1615] mt-2">4</div>
                    <div className="text-[11px] font-bold text-rose-600 mt-0.5">Restricted access</div>
                  </div>
                </div>

                {/* Explore Staff by Location Banner (Matching iPad Pro 12.9_ - 80) */}
                <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-[#5844A8] text-white flex items-center justify-center shadow-xs">
                        <MapPin className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-[#1A1615]">Explore Staff by Location</h3>
                        <p className="text-xs text-gray-400">
                          View assigned staff, roles, permissions and account status by state, city and branch
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setStaffSubView('states')}
                      className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer"
                    >
                      <span>Explore Locations →</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-1">
                    <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100 flex items-center gap-3">
                      <span className="text-2xl font-black text-[#1A1615]">4</span>
                      <span className="text-xs font-bold text-gray-500">States with Active Staff</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100 flex items-center gap-3">
                      <span className="text-2xl font-black text-[#1A1615]">12</span>
                      <span className="text-xs font-bold text-gray-500">Cities Covered</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-gray-100 flex items-center gap-3">
                      <span className="text-2xl font-black text-[#1A1615]">21</span>
                      <span className="text-xs font-bold text-gray-500">Branches with Staff</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      <strong>Location spotlight • Noida:</strong> 18 assigned staff across 3 branches • 16 active accounts
                    </span>
                    <button
                      onClick={() => {
                        setSelectedState('Uttar Pradesh');
                        setSelectedCity('Noida');
                        setStaffSubView('branches');
                      }}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      View Noida →
                    </button>
                  </div>
                </div>

                {/* Role Distribution Donut & Quick Management Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Role Distribution Card */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1A1615]">Role Distribution</span>
                      <button
                        onClick={() => setCurrentTab('permissions')}
                        className="text-xs font-bold text-purple-700 hover:underline"
                      >
                        Manage Roles →
                      </button>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
                        <div className="w-36 h-36 rounded-full border-8 border-purple-900 border-t-amber-500 border-r-pink-500 border-b-sky-500 animate-spin-slow" />
                        <div className="absolute flex flex-col items-center">
                          <span className="text-xl font-black text-[#1A1615]">142</span>
                          <span className="text-[10px] text-gray-400 font-bold">Staff</span>
                        </div>
                      </div>

                      <div className="flex-1 space-y-2 text-xs">
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-purple-900" /> Managers</span>
                          <span className="font-black text-[#1A1615]">18</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600" /> Supervisors</span>
                          <span className="font-black text-[#1A1615]">26</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Service Staff</span>
                          <span className="font-black text-[#1A1615]">64</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> Kitchen Staff</span>
                          <span className="font-black text-[#1A1615]">28</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="flex items-center gap-1.5 font-bold text-gray-600"><span className="w-2.5 h-2.5 rounded-full bg-sky-500" /> Other</span>
                          <span className="font-black text-[#1A1615]">6</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Management 4 Tiles */}
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1A1615]">Quick Management</span>
                      <button onClick={() => setStaffSubView('directory')} className="text-xs font-bold text-purple-700 hover:underline">
                        View Staff Directory →
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <div
                        onClick={() => setStaffSubView('directory')}
                        className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-all space-y-1"
                      >
                        <Users className="w-5 h-5 text-purple-700" />
                        <div className="text-xs font-black text-[#1A1615]">Staff Directory</div>
                        <div className="text-[10px] text-gray-400">Find and manage employees</div>
                      </div>

                      <div
                        onClick={() => setCurrentTab('permissions')}
                        className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-all space-y-1"
                      >
                        <Shield className="w-5 h-5 text-purple-700" />
                        <div className="text-xs font-black text-[#1A1615]">Roles & Permissions</div>
                        <div className="text-[10px] text-gray-400">Control access levels</div>
                      </div>

                      <div
                        onClick={() => setStaffSubView('states')}
                        className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-all space-y-1"
                      >
                        <MapPin className="w-5 h-5 text-purple-700" />
                        <div className="text-xs font-black text-[#1A1615]">Branch Assignments</div>
                        <div className="text-[10px] text-gray-400">Assign work locations</div>
                      </div>

                      <div
                        onClick={() => setCurrentTab('activity')}
                        className="p-3.5 rounded-2xl border border-gray-100 hover:border-purple-300 hover:bg-purple-50/20 cursor-pointer transition-all space-y-1"
                      >
                        <FileText className="w-5 h-5 text-purple-700" />
                        <div className="text-xs font-black text-[#1A1615]">Audit Log</div>
                        <div className="text-[10px] text-gray-400">Review Loyaltics actions</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 2: STAFF DIRECTORY (iPad Pro 12.9_ - 15 / 90) */}
            {staffSubView === 'directory' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff Directory</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">
                      Search, invite and manage staff across all your locations
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setStaffSubView('insights')}
                      className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                    >
                      ← Back to Insights
                    </button>
                    <button
                      onClick={() => {
                        setIsAddStaffOpen(true);
                        setAddStaffStep(1);
                      }}
                      className="px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Invite Staff</span>
                    </button>
                  </div>
                </div>

                {/* Segmented All Staff vs By Location Pill Switcher */}
                <div className="grid grid-cols-2 p-1 bg-[#F1EFEA] rounded-2xl max-w-md">
                  <button
                    onClick={() => setDirectoryMode('all')}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      directoryMode === 'all' ? 'bg-[#5844A8] text-white shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    All Staff
                  </button>
                  <button
                    onClick={() => {
                      setDirectoryMode('location');
                      setStaffSubView('states');
                    }}
                    className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                      directoryMode === 'location' ? 'bg-[#5844A8] text-white shadow-xs' : 'text-gray-500'
                    }`}
                  >
                    ★ By Location
                  </button>
                </div>

                {/* Search Bar */}
                <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 flex items-center gap-2 shadow-2xs">
                  <Search className="w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by staff name, phone, role or employee ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent outline-none w-full text-xs text-[#1A1615] placeholder-gray-400"
                  />
                </div>

                {/* Filter Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {[
                    { id: 'all', label: 'All (142)' },
                    { id: 'active', label: 'Active (128)' },
                    { id: 'pending', label: 'Pending (10)' },
                    { id: 'disabled', label: 'Disabled (4)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setDirectoryFilter(f.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        directoryFilter === f.id
                          ? 'bg-[#5844A8] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* 2-Column Grid of Staff Member Cards (iPad Pro 12.9_ - 90) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                  {INITIAL_STAFF.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3 hover:border-purple-300 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm shadow-xs ${st.avatarBg}`}>
                            {st.initials}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A1615]">{st.name}</div>
                            <div className="text-xs text-gray-400 font-bold">{st.role}</div>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            st.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700'
                              : st.status === 'Pending'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {st.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 text-xs">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Assigned Location</span>
                          <div className="font-black text-[#1A1615] mt-0.5">{st.location}</div>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase">Account / Invite</span>
                          <div className="font-black text-[#1A1615] mt-0.5">{st.accountStatus}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
                        <span className="text-purple-700 font-bold">{st.role}</span>
                        <span className="text-purple-700 font-bold hover:underline">View Profile →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: STATES (iPad Pro 12.9_ - 87) */}
            {staffSubView === 'states' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff by Location</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">
                      Explore employee counts, assignments by state, city and branch.
                    </p>
                  </div>
                  <button
                    onClick={() => setStaffSubView('insights')}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                  >
                    ← Back to Management
                  </button>
                </div>

                {/* 4 Summary Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold">Assigned Staff</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">142</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold">Active Accounts</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">128</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold">Pending Invites</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">10</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold">Disabled</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">4</div>
                  </div>
                </div>

                {/* State Cards Grid (iPad Pro 12.9_ - 87) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 font-bold">
                    <span>Staff Distribution by State</span>
                    <span>Click on a state to view cities & branches</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { state: 'Uttar Pradesh', total: 48, active: 42, pending: 4, disabled: 2, mgr: 6, srv: 20, kit: 14, oth: 8 },
                      { state: 'Delhi', total: 28, active: 26, pending: 1, disabled: 1, mgr: 4, srv: 11, kit: 8, oth: 5 },
                      { state: 'Maharashtra', total: 34, active: 32, pending: 3, disabled: 1, mgr: 5, srv: 16, kit: 9, oth: 4 },
                      { state: 'Karnataka', total: 30, active: 28, pending: 2, disabled: 0, mgr: 4, srv: 14, kit: 8, oth: 4 },
                      { state: 'Tamil Nadu', total: 26, active: 24, pending: 1, disabled: 1, mgr: 3, srv: 12, kit: 8, oth: 3 },
                      { state: 'Gujarat', total: 22, active: 20, pending: 2, disabled: 0, mgr: 3, srv: 10, kit: 6, oth: 3 }
                    ].map((st) => (
                      <div
                        key={st.state}
                        onClick={() => {
                          setSelectedState(st.state);
                          setStaffSubView('cities');
                        }}
                        className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs hover:border-purple-300 transition-all cursor-pointer space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-base font-black text-[#1A1615]">{st.state}</div>
                            <div className="text-xs text-gray-400 font-bold">{st.total} Assigned Staff</div>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 border-y border-gray-100">
                          <div>
                            <div className="text-sm font-black text-[#1A1615]">{st.total}</div>
                            <div className="text-[10px] text-gray-400">Assigned</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-emerald-600">{st.active}</div>
                            <div className="text-[10px] text-gray-400">Active</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-amber-600">{st.pending}</div>
                            <div className="text-[10px] text-gray-400">Pending</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-rose-600">{st.disabled}</div>
                            <div className="text-[10px] text-gray-400">Disabled</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs">
                          <div className="relative w-16 h-16 rounded-full border-4 border-purple-900 border-t-amber-500 flex items-center justify-center font-black">
                            {st.total}
                          </div>
                          <div className="flex-1 space-y-1 text-[11px] text-gray-500">
                            <div className="flex justify-between"><span>Manager</span><span className="font-bold text-[#1A1615]">{st.mgr}</span></div>
                            <div className="flex justify-between"><span>Service Staff</span><span className="font-bold text-[#1A1615]">{st.srv}</span></div>
                            <div className="flex justify-between"><span>Kitchen Staff</span><span className="font-bold text-[#1A1615]">{st.kit}</span></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: CITIES (iPad Pro 12.9_ - 86) */}
            {staffSubView === 'cities' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff in {selectedState}</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">View staff details for the state and explore staff by branch.</p>
                  </div>
                  <button
                    onClick={() => setStaffSubView('states')}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                  >
                    ← All States
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { city: 'Noida', assigned: 18, active: 16, pending: 1, disabled: 1 },
                    { city: 'Lucknow', assigned: 14, active: 12, pending: 2, disabled: 0 },
                    { city: 'Kanpur', assigned: 10, active: 9, pending: 1, disabled: 0 },
                    { city: 'Varanasi', assigned: 6, active: 5, pending: 0, disabled: 1 }
                  ].map((ct) => (
                    <div
                      key={ct.city}
                      onClick={() => {
                        setSelectedCity(ct.city);
                        setStaffSubView('branches');
                      }}
                      className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs hover:border-purple-300 transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-black text-[#1A1615]">{ct.city}</div>
                          <div className="text-xs text-gray-400 font-bold">{ct.assigned} Assigned Staff</div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                      <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 border-t border-gray-100">
                        <div><div className="font-black">{ct.assigned}</div><div className="text-[10px] text-gray-400">Assigned</div></div>
                        <div><div className="font-black text-emerald-600">{ct.active}</div><div className="text-[10px] text-gray-400">Active</div></div>
                        <div><div className="font-black text-amber-600">{ct.pending}</div><div className="text-[10px] text-gray-400">Pending</div></div>
                        <div><div className="font-black text-rose-600">{ct.disabled}</div><div className="text-[10px] text-gray-400">Disabled</div></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 5: BRANCHES IN CITY (iPad Pro 12.9_ - 88) */}
            {staffSubView === 'branches' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff in {selectedCity}</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">{selectedState} &gt; {selectedCity} • Branches with assignments</p>
                  </div>
                  <button
                    onClick={() => setStaffSubView('cities')}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                  >
                    ← All Cities
                  </button>
                </div>

                <div className="space-y-4">
                  {[
                    { branch: 'Noida — Sector 18', tag: 'Home Appliances • Modern electronics', assigned: 8, active: 7, pending: 1, disabled: 0, status: 'Active' },
                    { branch: 'Noida — Sector 62', tag: 'Lifestyle & Fashion • Fashion & accessories', assigned: 6, active: 6, pending: 0, disabled: 0, status: 'Active' },
                    { branch: 'Noida — Expressway', tag: 'Home & Living • Furnishings, decor & gadgets', assigned: 4, active: 3, pending: 0, disabled: 1, status: 'Disabled' },
                    { branch: 'Noida — Mall of India', tag: 'Fashion & Lifestyle • Flagship megastore', assigned: 7, active: 7, pending: 0, disabled: 0, status: 'Active' }
                  ].map((br) => (
                    <div
                      key={br.branch}
                      className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-base font-black text-[#1A1615]">{br.branch}</div>
                          <div className="text-xs text-gray-400">{br.tag}</div>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${br.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {br.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center gap-6 text-xs">
                          <div><span className="font-black text-sm">{br.assigned}</span> <span className="text-gray-400">Assigned</span></div>
                          <div><span className="font-black text-sm text-emerald-600">{br.active}</span> <span className="text-gray-400">Active</span></div>
                          <div><span className="font-black text-sm text-amber-600">{br.pending}</span> <span className="text-gray-400">Pending</span></div>
                          <div><span className="font-black text-sm text-rose-600">{br.disabled}</span> <span className="text-gray-400">Disabled</span></div>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedBranch(br.branch);
                            setStaffSubView('branch_staff');
                          }}
                          className="px-4 py-2 bg-[#5844A8] text-white rounded-xl text-xs font-black hover:bg-[#47368E] cursor-pointer"
                        >
                          View Staff ↗
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 6: STAFF IN BRANCH (iPad Pro 12.9_ - 89) */}
            {staffSubView === 'branch_staff' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">{selectedBranch} — Staff</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">Showing assigned staff members for this location</p>
                  </div>
                  <button
                    onClick={() => setStaffSubView('branches')}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                  >
                    ← All Branches
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {INITIAL_STAFF.map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3 cursor-pointer hover:border-purple-300"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold ${st.avatarBg}`}>
                            {st.initials}
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#1A1615]">{st.name}</div>
                            <div className="text-xs text-gray-400">{st.role}</div>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">{st.status}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-100 flex justify-between text-xs text-gray-400">
                        <span>{st.phone}</span>
                        <span className="text-purple-700 font-bold">View Profile →</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ROLES & PERMISSIONS (iPad Pro 12.9_ - 34 & 31)     */}
        {/* ======================================================== */}
        {currentTab === 'permissions' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-[#1A1615]">Roles & Permissions</h1>
                <p className="text-xs text-[#8C877D] mt-0.5">Manage staff access to Loyaltics and control what they can do in the system.</p>
              </div>
              <button
                onClick={() => {
                  setIsAddRoleOpen(true);
                  setAddRoleStep(2);
                }}
                className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add New Role</span>
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Total Roles</span>
                <div className="text-2xl font-black text-[#1A1615] mt-1">6</div>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Active Staff with Access</span>
                <div className="text-2xl font-black text-[#1A1615] mt-1">28</div>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Custom Roles</span>
                <div className="text-2xl font-black text-[#1A1615] mt-1">4</div>
              </div>
              <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                <span className="text-xs text-gray-400 font-bold uppercase">Branch-Limited Roles</span>
                <div className="text-2xl font-black text-[#1A1615] mt-1">2</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'Branch Manager', type: 'SYSTEM ROLE', desc: 'Full branch operations access including staff, menu and reports.', staff: '8 staff', perms: '24 permissions' },
                { name: 'Cashier', type: 'SYSTEM ROLE', desc: 'Handle orders, payments and basic customer actions.', staff: '12 staff', perms: '8 permissions' },
                { name: 'Marketing Executive', type: 'CUSTOM ROLE', desc: 'Manage campaigns, promotions and customer engagement.', staff: '4 staff', perms: '14 permissions' },
                { name: 'Customer Support', type: 'SYSTEM ROLE', desc: 'Handle customer enquiries and manage customer data.', staff: '3 staff', perms: '10 permissions' },
                { name: 'Waiter / Floor Staff', type: 'SYSTEM ROLE', desc: 'Take orders and manage table service.', staff: '6 staff', perms: '6 permissions' },
                { name: 'Loyalty Specialist', type: 'CUSTOM ROLE', desc: 'Manage rewards, loyalty program and member data.', staff: '2 staff', perms: '12 permissions' }
              ].map((r) => (
                <div key={r.name} className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#1A1615]">{r.name}</span>
                    <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">{r.type}</span>
                  </div>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs text-gray-400">
                    <span>{r.staff} • {r.perms}</span>
                    <button
                      onClick={() => {
                        setIsAddRoleOpen(true);
                        setAddRoleStep(2);
                      }}
                      className="text-purple-700 font-bold hover:underline"
                    >
                      View / Edit →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: ACTIVITY LOG & AUDIT TRAIL (iPad Pro 12.9_ - 38 & 39) */}
        {/* ======================================================== */}
        {currentTab === 'activity' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {activitySubView === 'list' ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Staff Activity Log</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">Track software actions performed by your team across all branches.</p>
                  </div>
                  <button className="px-5 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md cursor-pointer">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Total Actions</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">2,482</div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ 12% vs previous period</div>
                  </div>
                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">High-Impact Actions</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">186</div>
                    <div className="text-[11px] font-bold text-pink-600 mt-0.5">↑ 8% vs previous period</div>
                  </div>
                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Approvals Handled</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">640</div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ 24% vs previous period</div>
                  </div>
                  <div className="bg-white p-4.5 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Permission Changes</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">98</div>
                    <div className="text-[11px] font-bold text-emerald-600 mt-0.5">↑ 16% vs previous period</div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-[#1A1615]">Recent Staff Activity</span>
                    <span className="text-xs font-bold text-gray-400">Showing 1-10 of 2482</span>
                  </div>

                  <div className="divide-y divide-gray-100 text-xs">
                    {[
                      { name: 'Aarav Sharma', role: 'Branch Manager', loc: 'Main Branch', mod: 'Campaigns', action: 'Activated Summer Rewards campaign', sub: "Started 'Summer Rewards' campaign across Main Branch.", time: 'Today, 10:24 AM', status: 'High' },
                      { name: 'Priya Mehta', role: 'Marketing Executive', loc: 'City Mall', mod: 'Rewards', action: 'Approved reward claim #CUST2847', sub: 'Approved 200 points redemption for customer.', time: 'Today, 09:15 AM', status: 'Success' },
                      { name: 'Rahul Verma', role: 'Cashier', loc: 'Riverside', mod: 'QR Codes', action: 'Generated QR codes for Main Branch', sub: 'Created 50 new QR codes for Main Branch.', time: 'Today, 08:42 AM', status: 'Normal' },
                      { name: 'Sneha Iyer', role: 'Store Staff', loc: 'Main Branch', mod: 'Customers', action: 'Updated customer tier to Gold', sub: 'Changed customer tier from Silver to Gold.', time: 'Today, 04:30 PM', status: 'Normal' }
                    ].map((act, i) => (
                      <div
                        key={i}
                        onClick={() => setActivitySubView('detail')}
                        className="py-3.5 flex items-center justify-between cursor-pointer hover:bg-gray-50/50 px-2 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black">
                            {act.name[0]}
                          </div>
                          <div>
                            <div className="font-black text-[#1A1615] flex items-center gap-2">
                              <span>{act.name}</span>
                              <span className="text-gray-400 font-normal">({act.role} • {act.loc})</span>
                            </div>
                            <div className="text-gray-700 font-bold mt-0.5">{act.action}</div>
                            <div className="text-gray-400 text-[11px]">{act.sub}</div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${act.status === 'High' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                            {act.status}
                          </span>
                          <div className="text-gray-400 text-[10px] mt-1">{act.time}</div>
                          <span className="text-purple-700 font-bold text-[11px] hover:underline">View Details &gt;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Activity Detail & Audit Trail (iPad Pro 12.9_ - 39) */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-black text-[#1A1615]">Activity Detail and Audit Trail</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">View Complete Details and Audit Trails for this Staff Activity</p>
                  </div>
                  <button
                    onClick={() => setActivitySubView('list')}
                    className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl"
                  >
                    ← Back to Activity Log
                  </button>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <div>
                      <div className="text-base font-black text-[#1A1615]">Campaign Activated</div>
                      <div className="text-xs text-gray-400">A staff member activated a campaign in the system.</div>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full">Success • High Impact</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-xs py-2">
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Staff Member</span>
                      <div className="font-black text-[#1A1615] mt-1">Aarav Sharma</div>
                      <div className="text-gray-400 text-[11px]">Branch Manager • EMP001</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Module Affected</span>
                      <div className="font-black text-purple-700 mt-1">Campaigns</div>
                      <div className="text-gray-400 text-[11px]">Summer Rewards (CAMP1032)</div>
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold uppercase text-[10px]">Date & Time</span>
                      <div className="font-black text-[#1A1615] mt-1">23 Apr 2024, 10:24 AM</div>
                      <div className="text-gray-400 text-[11px]">Web Application • Chrome macOS</div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <span className="text-xs font-black text-[#1A1615]">Change Summary</span>
                    <div className="flex items-center gap-6 text-xs">
                      <div>
                        <span className="text-gray-400 text-[10px]">Before</span>
                        <div className="font-bold text-gray-600">Draft</div>
                      </div>
                      <span className="text-gray-400">→</span>
                      <div>
                        <span className="text-gray-400 text-[10px]">After</span>
                        <div className="font-black text-emerald-600">Active (Live)</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: REPORTS & AUDIT (iPad Pro 12.9_ - 40, 41 & 42)     */}
        {/* ======================================================== */}
        {currentTab === 'reports' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-[#1A1615]">Staff Reports & Audits</h1>
                <p className="text-xs text-[#8C877D] mt-0.5">Generate and export insights about team software activity and access.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportsSubView('categories')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${reportsSubView === 'categories' ? 'bg-[#5844A8] text-white' : 'bg-white border text-gray-700'}`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setReportsSubView('performance')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${reportsSubView === 'performance' ? 'bg-[#5844A8] text-white' : 'bg-white border text-gray-700'}`}
                >
                  Performance
                </button>
                <button
                  onClick={() => setReportsSubView('audit')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold ${reportsSubView === 'audit' ? 'bg-[#5844A8] text-white' : 'bg-white border text-gray-700'}`}
                >
                  Audit Trail
                </button>
              </div>
            </div>

            {/* Sub-view 1: Report Categories (iPad Pro 12.9_ - 40) */}
            {reportsSubView === 'categories' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { title: 'Team Activity Report', desc: 'View overall staff activity across all modules and branches.', icon: BarChart2 },
                    { title: 'Staff Performance Report', desc: 'Analyse individual and team performance metrics.', icon: TrendingUp },
                    { title: 'Permission Change Audit', desc: 'Track role changes, permissions and access modifications.', icon: ShieldCheck },
                    { title: 'Branch Access Report', desc: 'View staff access and activity across different branches.', icon: Building2 },
                    { title: 'Invitation Status Report', desc: 'Track pending, accepted and expired staff invitations.', icon: Mail }
                  ].map((rep) => (
                    <div key={rep.title} className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                          <rep.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-sm font-black text-[#1A1615]">{rep.title}</div>
                          <div className="text-xs text-gray-400">{rep.desc}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => setReportsSubView(rep.title.includes('Performance') ? 'performance' : 'audit')}
                        className="w-full py-2.5 bg-[#FAF9F5] hover:bg-purple-50 text-[#5844A8] rounded-xl text-xs font-black transition-all cursor-pointer"
                      >
                        Generate Report →
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-view 2: Staff Performance Report (iPad Pro 12.9_ - 41) */}
            {reportsSubView === 'performance' && (
              <div className="space-y-6">
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Campaign Actions</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">248</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Approvals Processed</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">186</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">QR Codes Generated</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">640</div>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-xs text-gray-400 font-bold uppercase">Customer Updates</span>
                    <div className="text-2xl font-black text-[#1A1615] mt-1">320</div>
                  </div>
                </div>

                {/* Top Performing Staff Leaderboard */}
                <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                  <span className="text-sm font-black text-[#1A1615]">Top Performing Staff</span>
                  <div className="divide-y divide-gray-100 text-xs">
                    {[
                      { rank: 1, name: 'Aarav Sharma', role: 'Branch Manager', campaigns: 52, approvals: 36, qr: 48, updates: 64, score: 98 },
                      { rank: 2, name: 'Priya Mehta', role: 'Marketing Executive', campaigns: 48, approvals: 32, qr: 42, updates: 58, score: 92 },
                      { rank: 3, name: 'Rahul Verma', role: 'Cashier', campaigns: 40, approvals: 28, qr: 38, updates: 46, score: 84 },
                      { rank: 4, name: 'Sneha Iyer', role: 'Store Staff', campaigns: 32, approvals: 24, qr: 36, updates: 40, score: 76 }
                    ].map((row) => (
                      <div key={row.rank} className="py-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-black text-xs">
                            {row.rank}
                          </span>
                          <div>
                            <div className="font-black text-[#1A1615]">{row.name}</div>
                            <div className="text-gray-400 text-[11px]">{row.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-8 text-right">
                          <div><div className="font-bold">{row.campaigns}</div><div className="text-[10px] text-gray-400">Campaigns</div></div>
                          <div><div className="font-bold">{row.approvals}</div><div className="text-[10px] text-gray-400">Approvals</div></div>
                          <div><div className="font-bold">{row.qr}</div><div className="text-[10px] text-gray-400">QR Codes</div></div>
                          <div><span className="bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-full">{row.score}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sub-view 3: Access & Audit Reports (iPad Pro 12.9_ - 42) */}
            {reportsSubView === 'audit' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <span className="text-sm font-black text-[#1A1615]">Report Preview — Access Modifications</span>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black cursor-pointer">Export PDF</button>
                    <button className="px-4 py-2 bg-white border border-gray-200 text-[#1A1615] rounded-xl text-xs font-black">Export CSV</button>
                  </div>
                </div>

                <div className="divide-y divide-gray-100 text-xs">
                  {[
                    { name: 'Aarav Sharma', role: 'Branch Manager', change: 'Role Changed', prev: 'Cashier', now: 'Branch Manager', by: 'Riya Merchant', time: '23 Apr 2024, 10:24 AM', status: 'Success' },
                    { name: 'Priya Mehta', role: 'Marketing Executive', change: 'Permission Granted', prev: 'No Access', now: 'Campaigns Access', by: 'Karan Malhotra', time: '23 Apr 2024, 09:15 AM', status: 'Success' },
                    { name: 'Rahul Verma', role: 'Cashier', change: 'Branch Assigned', prev: '-', now: 'City Mall', by: 'Riya Merchant', time: '22 Apr 2024, 04:22 PM', status: 'Success' },
                    { name: 'Sneha Iyer', role: 'Store Staff', change: 'Invitation Accepted', prev: 'Pending', now: 'Active', by: 'System', time: '22 Apr 2024, 11:08 AM', status: 'Success' },
                    { name: 'Karan Malhotra', role: 'Administrator', change: 'Account Suspended', prev: 'Active', now: 'Suspended', by: 'Riya Merchant', time: '21 Apr 2024, 03:45 PM', status: 'Warning' }
                  ].map((aud, i) => (
                    <div key={i} className="py-3.5 flex items-center justify-between">
                      <div>
                        <div className="font-black text-[#1A1615]">{aud.name} <span className="text-gray-400 font-normal">({aud.role})</span></div>
                        <div className="text-purple-700 font-bold mt-0.5">{aud.change}</div>
                        <div className="text-gray-400 text-[11px]">{aud.prev} → <span className="font-bold text-gray-700">{aud.now}</span> by {aud.by}</div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${aud.status === 'Success' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {aud.status}
                        </span>
                        <div className="text-gray-400 text-[10px] mt-1">{aud.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ADD STAFF MEMBER WIZARD (iPad Pro 12.9_ - 20, 91, 36, 24) */}
        {/* ======================================================== */}
        {isAddStaffOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-xs font-bold text-[#1A1615] hover:text-purple-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel & Back</span>
              </button>
              <h2 className="text-lg font-black text-[#1A1615]">Add Staff Member</h2>
              <div />
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-center gap-8 max-w-lg mx-auto py-2">
              {[
                { step: 1, label: 'Personal' },
                { step: 2, label: 'Role' },
                { step: 3, label: 'Branches' },
                { step: 4, label: 'Review' }
              ].map((st) => (
                <div key={st.step} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${
                      addStaffStep === st.step
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : addStaffStep > st.step
                        ? 'bg-emerald-600 text-white'
                        : 'border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {addStaffStep > st.step ? '✓' : st.step}
                  </div>
                  <span className={`text-[10px] font-bold ${addStaffStep >= st.step ? 'text-[#5844A8]' : 'text-gray-400'}`}>
                    {st.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Step 1: Personal (iPad Pro 12.9_ - 20) */}
            {addStaffStep === 1 && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4 max-w-xl mx-auto">
                <span className="text-sm font-black text-[#1A1615] block">Personal Details</span>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">Full Name *</label>
                  <input
                    type="text"
                    value={newStaffName}
                    onChange={(e) => setNewStaffName(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1615] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">Employee ID *</label>
                  <input
                    type="text"
                    value={newStaffEmpId}
                    onChange={(e) => setNewStaffEmpId(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1615] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">Mobile Number *</label>
                  <input
                    type="text"
                    value={newStaffPhone}
                    onChange={(e) => setNewStaffPhone(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1615] outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-bold block mb-1">Email Address *</label>
                  <input
                    type="text"
                    value={newStaffEmail}
                    onChange={(e) => setNewStaffEmail(e.target.value)}
                    className="w-full bg-[#FAF8FF] border border-gray-200 rounded-xl p-3 text-xs font-bold text-[#1A1615] outline-none"
                  />
                </div>
                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => setAddStaffStep(2)}
                    className="px-6 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Next: Role →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Role Selection (iPad Pro 12.9_ - 91) */}
            {addStaffStep === 2 && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4 max-w-2xl mx-auto">
                <span className="text-sm font-black text-[#1A1615] block">Assign a Role</span>
                <p className="text-xs text-gray-400">Choose a software role that matches the staff member's responsibilities.</p>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  {[
                    { role: 'Branch Manager', desc: 'Full access to manage branch operations, staff, customers, reports and settings.' },
                    { role: 'Cashier', desc: 'Manage customer transactions, process payments, and handle daily sales.' },
                    { role: 'Waiter / Floor Staff', desc: 'Take orders, manage tables, and view customer information.' },
                    { role: 'Marketing', desc: 'Manage campaigns, offers, loyalty programs and customer communications.' },
                    { role: 'Customer Support', desc: 'Handle customer inquiries, manage feedback and support tickets.' },
                    { role: 'Custom Role', desc: 'Create a custom role with specific permissions tailored to your needs.' }
                  ].map((r) => (
                    <div
                      key={r.role}
                      onClick={() => setSelectedRoleForNewStaff(r.role)}
                      className={`p-4 rounded-2xl border-2 flex flex-col justify-between cursor-pointer transition-all ${
                        selectedRoleForNewStaff === r.role ? 'border-[#5844A8] bg-purple-50/40 shadow-xs' : 'border-gray-200'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-black text-[#1A1615]">{r.role}</div>
                        <p className="text-[10px] text-gray-500 mt-1 leading-snug">{r.desc}</p>
                      </div>
                      <div className="pt-3 flex justify-end">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${selectedRoleForNewStaff === r.role ? 'border-4 border-[#5844A8]' : 'border-2 border-gray-300'}`} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between">
                  <button onClick={() => setAddStaffStep(1)} className="text-xs font-bold text-gray-600">← Back</button>
                  <button
                    onClick={() => setAddStaffStep(3)}
                    className="px-6 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Next: Branches →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Branch Access (iPad Pro 12.9_ - 36) */}
            {addStaffStep === 3 && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4 max-w-xl mx-auto">
                <span className="text-sm font-black text-[#1A1615] block">Default Branch Access Policy</span>
                <div className="space-y-2">
                  {['Main Branch', 'City Mall', 'Riverside', 'Airport T2', 'Central Plaza'].map((br) => {
                    const isChecked = selectedBranchesForNewStaff.includes(br);
                    return (
                      <div
                        key={br}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedBranchesForNewStaff(selectedBranchesForNewStaff.filter(b => b !== br));
                          } else {
                            setSelectedBranchesForNewStaff([...selectedBranchesForNewStaff, br]);
                          }
                        }}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer ${
                          isChecked ? 'border-[#5844A8] bg-purple-50/40' : 'border-gray-200'
                        }`}
                      >
                        <span className="text-xs font-bold text-[#1A1615]">{br}</span>
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isChecked ? 'bg-[#5844A8] text-white' : 'border border-gray-300'}`}>
                          {isChecked && '✓'}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="pt-2 flex justify-between">
                  <button onClick={() => setAddStaffStep(2)} className="text-xs font-bold text-gray-600">← Back</button>
                  <button
                    onClick={() => setAddStaffStep(4)}
                    className="px-6 py-2.5 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                  >
                    Next: Review →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review & Send (iPad Pro 12.9_ - 24) */}
            {addStaffStep === 4 && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4 max-w-xl mx-auto">
                <span className="text-sm font-black text-[#1A1615] block">Review Staff Details</span>
                <div className="p-4 rounded-2xl bg-gray-50 space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">Name:</span><span className="font-black text-[#1A1615]">{newStaffName}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">Role:</span><span className="font-black text-purple-700">{selectedRoleForNewStaff}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">Email:</span><span className="font-bold text-[#1A1615]">{newStaffEmail}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400 font-bold">Branch Access:</span><span className="font-bold text-[#1A1615]">{selectedBranchesForNewStaff.join(', ')}</span></div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button onClick={() => setAddStaffStep(3)} className="text-xs font-bold text-gray-600">← Back</button>
                  <button
                    onClick={() => {
                      alert('Staff invitation sent successfully!');
                      setIsAddStaffOpen(false);
                    }}
                    className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                  >
                    Send Invitation
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* ADD ROLE WIZARD (iPad Pro 12.9_ - 31)                    */}
        {/* ======================================================== */}
        {isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setIsAddRoleOpen(false)}
                className="text-xs font-bold text-[#1A1615] hover:text-purple-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel & Back</span>
              </button>
              <h2 className="text-lg font-black text-[#1A1615]">Add New Role</h2>
              <div />
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <span className="text-sm font-black text-[#1A1615]">Module Permissions</span>
                <span className="bg-purple-50 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">6 of 8 Enabled</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Campaigns', desc: 'Create and manage marketing campaigns, promotions and announcements.', active: true, level: 'View & Manage' },
                  { name: 'Approvals', desc: 'Handle approval workflows and requests.', active: true, level: 'View & Manage' },
                  { name: 'QR Codes', desc: 'Generate and manage QR codes.', active: false, level: 'Disabled' },
                  { name: 'Customer Data', desc: 'Access and manage customer information and member data.', active: true, level: 'Full Access' },
                  { name: 'Menu', desc: 'Manage menu items, categories and pricing.', active: false, level: 'Disabled' },
                  { name: 'Branches', desc: 'Manage branch settings and configurations.', active: false, level: 'Disabled' },
                  { name: 'Rewards', desc: 'Manage loyalty points, rewards and redemption rules.', active: true, level: 'View & Manage' },
                  { name: 'Reports', desc: 'Access and generate reports and analytics.', active: true, level: 'Full Access' }
                ].map((mod) => (
                  <div key={mod.name} className="p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#1A1615]">{mod.name}</span>
                        <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full ${mod.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                          {mod.active ? 'Active' : 'Disabled'}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">{mod.desc}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-xl">
                        {mod.level}
                      </span>
                      <div className={`w-10 h-6 rounded-full relative cursor-pointer ${mod.active ? 'bg-[#5844A8]' : 'bg-gray-200'}`}>
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${mod.active ? 'right-0.5' : 'left-0.5'}`} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => {
                    alert('New role saved successfully!');
                    setIsAddRoleOpen(false);
                  }}
                  className="px-8 py-3 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-black shadow-md cursor-pointer"
                >
                  Save & Publish Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STAFF DETAIL PROFILE VIEW (iPad Pro 12.9_ - 16, 17, 18, 19) */}
        {/* ======================================================== */}
        {selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSelectedStaffId(null)}
                className="text-xs font-bold text-[#1A1615] hover:text-purple-700 flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Directory</span>
              </button>
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold shadow-2xs">
                More Actions ▾
              </button>
            </div>

            {/* Profile Hero Card */}
            <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-700 font-black text-xl shadow-xs">
                  {activeStaff.initials}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-[#1A1615]">{activeStaff.name}</h2>
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {activeStaff.status}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 font-bold">
                    {activeStaff.role} • {activeStaff.employeeId}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-400 font-medium pt-1">
                    <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {activeStaff.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {activeStaff.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {activeStaff.joinDate}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {activeStaff.branch}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Tabs */}
            <div className="flex items-center gap-2 border-b border-[#F1EFEA] pb-1">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'permissions', label: 'Permissions' },
                { id: 'branches', label: 'Branches' },
                { id: 'activity', label: 'Activity' }
              ].map((tb) => (
                <button
                  key={tb.id}
                  onClick={() => setProfileTab(tb.id as any)}
                  className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer ${
                    profileTab === tb.id
                      ? 'bg-[#5844A8] text-white shadow-xs'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Profile Overview (iPad Pro 12.9_ - 16) */}
            {profileTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-5 gap-3">
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Total Shifts</span>
                    <div className="text-xl font-black text-[#1A1615] mt-1">{activeStaff.shifts}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↑ 12% vs last month</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Hours Logged</span>
                    <div className="text-xl font-black text-[#1A1615] mt-1">{activeStaff.hours * 8} hrs</div>
                    <span className="text-[10px] text-gray-400 font-bold">On schedule</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Tasks Completed</span>
                    <div className="text-xl font-black text-[#1A1615] mt-1">{activeStaff.tasks * 4}</div>
                    <span className="text-[10px] text-emerald-600 font-bold">99.2% accuracy</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Last Active</span>
                    <div className="text-xl font-black text-[#1A1615] mt-1">2 hours ago</div>
                    <span className="text-[10px] text-gray-400 font-bold">23 Apr 2024</span>
                  </div>
                  <div className="bg-white p-4 rounded-3xl border border-[#F1EFEA] shadow-2xs">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">Assigned Branch</span>
                    <div className="text-base font-black text-[#1A1615] mt-1 truncate">{activeStaff.branch}</div>
                    <span className="text-[10px] text-gray-400 font-bold">Sector 18</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1A1615]">Personal Information</span>
                      <button className="text-xs font-bold text-purple-700 flex items-center gap-1"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">Full Name</span>
                        <span className="font-black text-[#1A1615]">{activeStaff.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">Employee ID</span>
                        <span className="font-black text-[#1A1615]">{activeStaff.employeeId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">Phone</span>
                        <span className="font-black text-[#1A1615]">{activeStaff.phone}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-gray-100">
                        <span className="text-gray-400 font-bold">Email</span>
                        <span className="font-black text-[#1A1615]">{activeStaff.email}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-gray-400 font-bold">Date Joined</span>
                        <span className="font-black text-[#1A1615]">{activeStaff.joinDate}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1A1615]">Access & Role</span>
                      <button className="text-xs font-bold text-purple-700 flex items-center gap-1"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-400 font-bold">Current Role</span>
                        <div className="font-black text-sm text-[#1A1615] mt-0.5">{activeStaff.role}</div>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                          Oversees branch operations, manages staff and has access to most features for their assigned branch.
                        </p>
                      </div>
                      <div className="pt-2 border-t border-gray-100 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 font-bold">Branch Access</span>
                          <span className="text-purple-700 font-bold">Manage</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="flex items-center gap-1.5 font-bold text-[#1A1615]"><Check className="w-3.5 h-3.5 text-emerald-600" /> Main Branch</span>
                          <span className="bg-purple-50 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-md">Primary Branch</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                          <span className="flex items-center gap-1.5 font-bold text-[#1A1615]"><Check className="w-3.5 h-3.5 text-emerald-600" /> City Mall</span>
                          <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-md">View & Manage</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Profile Permissions (iPad Pro 12.9_ - 18) */}
            {profileTab === 'permissions' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#1A1615]">Active Module Permissions</h3>
                  <button className="px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold cursor-pointer">Edit Permissions</button>
                </div>
                <div className="grid grid-cols-4 gap-3 text-xs">
                  {['Campaigns', 'Approvals', 'QR Codes', 'Customer Data', 'Menu', 'Reports', 'Rewards', 'Branch Settings'].map((mod) => (
                    <div key={mod} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                      <span className="font-bold text-[#1A1615]">{mod}</span>
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-black">✓</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Branches (iPad Pro 12.9_ - 19) */}
            {profileTab === 'branches' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-black text-[#1A1615]">Assigned Branch Coverage</h3>
                  <button className="px-4 py-2 bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl text-xs font-bold cursor-pointer">Manage Branches</button>
                </div>
                <div className="space-y-3">
                  {['Main Branch (Primary)', 'City Mall (View & Manage)', 'Riverside (View Only)'].map((br) => (
                    <div key={br} className="p-3.5 rounded-2xl border border-gray-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1A1615]">{br}</span>
                      <span className="text-xs text-emerald-600 font-bold">Active</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Activity (iPad Pro 12.9_ - 17) */}
            {profileTab === 'activity' && (
              <div className="bg-white rounded-3xl p-6 border border-[#F1EFEA] shadow-2xs space-y-4">
                <h3 className="text-base font-black text-[#1A1615]">Staff Audit History</h3>
                <div className="divide-y divide-gray-100 text-xs">
                  <div className="py-3 flex justify-between">
                    <div>
                      <div className="font-bold text-[#1A1615]">Activated Summer Rewards campaign</div>
                      <div className="text-gray-400 text-[10px]">Main Branch • Web Application</div>
                    </div>
                    <span className="text-gray-400">Today, 10:24 AM</span>
                  </div>
                  <div className="py-3 flex justify-between">
                    <div>
                      <div className="font-bold text-[#1A1615]">Approved reward claim #CUST2847</div>
                      <div className="text-gray-400 text-[10px]">Verified via QR scanner</div>
                    </div>
                    <span className="text-gray-400">Today, 09:15 AM</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TABLET BOTTOM NAVIGATION BAR (Matching iPad Pro Mockup)   */}
      {/* ======================================================== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#F1EFEA] px-4 sm:px-8 md:px-12 py-3 z-40 flex items-center justify-around shadow-lg">
        {/* 1. Staff Tab */}
        <button
          onClick={() => {
            setCurrentTab('staff');
            setStaffSubView('insights');
            setSelectedStaffId(null);
            setIsAddStaffOpen(false);
            setIsAddRoleOpen(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-black cursor-pointer transition-colors ${
            currentTab === 'staff' ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Staff</span>
        </button>

        {/* 2. Permissions Tab */}
        <button
          onClick={() => {
            setCurrentTab('permissions');
            setSelectedStaffId(null);
            setIsAddStaffOpen(false);
            setIsAddRoleOpen(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-black cursor-pointer transition-colors ${
            currentTab === 'permissions' ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
          }`}
        >
          <Shield className="w-5 h-5" />
          <span>Permissions</span>
        </button>

        {/* Center Floating Plus Action */}
        <button
          onClick={() => {
            setIsAddStaffOpen(true);
            setAddStaffStep(1);
          }}
          className="w-13 h-13 -mt-6 rounded-full bg-[#5844A8] text-white flex items-center justify-center shadow-lg hover:bg-[#47368E] transition-all cursor-pointer"
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>

        {/* 3. Activity Tab */}
        <button
          onClick={() => {
            setCurrentTab('activity');
            setActivitySubView('list');
            setSelectedStaffId(null);
            setIsAddStaffOpen(false);
            setIsAddRoleOpen(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-black cursor-pointer transition-colors ${
            currentTab === 'activity' ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
          }`}
        >
          <Clock className="w-5 h-5" />
          <span>Activity</span>
        </button>

        {/* 4. Reports Tab */}
        <button
          onClick={() => {
            setCurrentTab('reports');
            setReportsSubView('audit');
            setSelectedStaffId(null);
            setIsAddStaffOpen(false);
            setIsAddRoleOpen(false);
          }}
          className={`flex flex-col items-center gap-1 text-[11px] font-black cursor-pointer transition-colors ${
            currentTab === 'reports' ? 'text-[#5844A8]' : 'text-[#8C877D] hover:text-[#1A1615]'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Reports</span>
        </button>
      </div>
    </div>
  );
};

export default TabletStaffView;
