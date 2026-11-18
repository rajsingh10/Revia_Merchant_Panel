import React, { useState, useEffect } from 'react';
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
  Tag,
  Menu,
  Heart,
  Zap,
  Upload,
  Megaphone,
  Ban,
  Info,
  ChevronLeft,
  MessageSquare,
  User,
  CreditCard,
  Settings,
  Globe,
  BookOpen,
  Monitor,
  Wifi,
  Link2,
  AlertTriangle
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
    location: 'Main Branch',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-2',
    name: 'Priya Mehta',
    role: 'Marketing',
    roleType: 'Custom',
    branch: 'City Mall',
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
    location: 'City Mall',
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
    avatarBg: 'bg-lime-100 text-lime-800',
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
    name: 'Karan Malhotra',
    role: 'Administrator',
    roleType: 'System',
    branch: 'Central Plaza',
    status: 'Active',
    email: 'karan.m@thecoffeeclub.com',
    phone: '+91 98765 43214',
    shifts: 46,
    hours: 210,
    tasks: 340,
    lastActive: '6 days ago',
    avatarBg: 'bg-amber-100 text-amber-800',
    initials: 'KM',
    employeeId: 'EMP005',
    joinDate: '10 Jan 2024',
    location: 'Central Plaza',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-6',
    name: 'Neha Taneja',
    role: 'Supervisor',
    roleType: 'System',
    branch: 'Connaught Place',
    status: 'Active',
    email: 'neha.t@thecoffeeclub.com',
    phone: '+91 65422 10917',
    shifts: 26,
    hours: 154,
    tasks: 118,
    lastActive: 'Yesterday',
    avatarBg: 'bg-purple-100 text-purple-700',
    initials: 'NT',
    employeeId: 'EMP006',
    joinDate: '05 May 2024',
    location: 'Connaught Place',
    accountStatus: 'Active',
    state: 'Delhi',
    city: 'New Delhi'
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
    avatarBg: 'bg-orange-100 text-orange-700',
    initials: 'AP',
    employeeId: 'EMP007',
    joinDate: '18 Jun 2024',
    location: 'Expressway',
    accountStatus: 'Active',
    state: 'Uttar Pradesh',
    city: 'Noida'
  },
  {
    id: 'st-8',
    name: 'Meera Kapoor',
    role: 'Cashier',
    roleType: 'System',
    branch: 'Sector 18',
    status: 'Active',
    email: 'meera.k@thecoffeeclub.com',
    phone: '+91 97180 54321',
    shifts: 22,
    hours: 140,
    tasks: 102,
    lastActive: '3 days ago',
    avatarBg: 'bg-amber-100 text-amber-700',
    initials: 'MK',
    employeeId: 'EMP008',
    joinDate: '25 Jul 2024',
    location: 'Sector 18',
    accountStatus: 'Active',
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
  const [activitySearch, setActivitySearch] = useState('');
  const [activityDateFilter, setActivityDateFilter] = useState('Last 30 Days');
  const [activityBranchFilter, setActivityBranchFilter] = useState('All Branches');
  const [activityModuleFilter, setActivityModuleFilter] = useState('All Modules');
  const [activityRoleFilter, setActivityRoleFilter] = useState('All Roles');
  const [activityTypeFilter, setActivityTypeFilter] = useState('All Activity Types');
  const [activitySortOrder, setActivitySortOrder] = useState<'latest' | 'oldest'>('latest');
  const [selectedActivityId, setSelectedActivityId] = useState<string>('act-1');

  // Reports sub-view: 'categories' (iPad Pro 12.9_ - 40) vs 'performance' (iPad Pro 12.9_ - 41) vs 'audit' (iPad Pro 12.9_ - 42)
  const [reportsSubView, setReportsSubView] = useState<'categories' | 'performance' | 'audit'>('categories');
  const [reportsDateFilter, setReportsDateFilter] = useState('Last 30 Days');
  const [reportsBranchFilter, setReportsBranchFilter] = useState('All Branches');
  const [reportsRoleFilter, setReportsRoleFilter] = useState('All Roles');
  const [performanceGranularity, setPerformanceGranularity] = useState<'Daily' | 'Weekly'>('Daily');
  const [auditCategoryTab, setAuditCategoryTab] = useState<
    'Permission Changes' | 'Branch Access' | 'Invitation Status' | 'Suspended Accounts' | 'Role Assignment History'
  >('Permission Changes');

  // Add Staff Member Wizard (iPad Pro 12.9_ - 20, 91, 36, 24)
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [addStaffStep, setAddStaffStep] = useState<1 | 2 | 3 | 4>(1);

  // Add Role Wizard (iPad Pro 12.9_ - 31, 36)
  const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
  const [addRoleStep, setAddRoleStep] = useState<1 | 2 | 3 | 4>(2);

  // Insights Mode: 'analytics' (iPad Pro 14) vs 'operations' (iPad Pro 80)
  const [insightsTabMode, setInsightsTabMode] = useState<'analytics' | 'operations'>('analytics');

  // Listen for bottom bar add action
  useEffect(() => {
    const handleBottomBarAdd = (e: any) => {
      if (!e.detail || e.detail.type === 'staff' || !e.detail.type) {
        setIsAddStaffOpen(true);
        setAddStaffStep(1);
      }
    };
    window.addEventListener('revia:add-action', handleBottomBarAdd);
    return () => {
      window.removeEventListener('revia:add-action', handleBottomBarAdd);
    };
  }, []);

  // Directory & Location filter state
  const [directoryFilter, setDirectoryFilter] = useState<'all' | 'active' | 'pending' | 'disabled' | 'managers'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationSearchQuery, setLocationSearchQuery] = useState('');
  const [branchStaffFilter, setBranchStaffFilter] = useState<'all' | 'active' | 'invited'>('all');

  // Reusable multi-segment SVG Donut Chart matching Figma (iPad Pro 12.9_ - 80, 86, 87, 88)
  const renderRoleDonut = (
    total: number,
    segments: { value: number; color: string }[],
    size: 'sm' | 'md' | 'lg' = 'md'
  ) => {
    const dim = size === 'lg' ? 132 : size === 'sm' ? 76 : 92;
    const stroke = size === 'lg' ? 16 : size === 'sm' ? 9 : 11;
    const radius = (dim - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const sum = segments.reduce((acc, s) => acc + s.value, 0) || 1;
    let offset = 0;

    return (
      <div className="relative flex items-center justify-center shrink-0" style={{ width: dim, height: dim }}>
        <svg width={dim} height={dim} viewBox={`0 0 ${dim} ${dim}`} className="-rotate-90">
          <circle
            cx={dim / 2}
            cy={dim / 2}
            r={radius}
            fill="none"
            stroke="#F3EEFA"
            strokeWidth={stroke}
          />
          {segments.map((seg, idx) => {
            const len = (seg.value / sum) * circumference;
            const dashOffset = -offset;
            offset += len;
            if (seg.value <= 0) return null;
            return (
              <circle
                key={idx}
                cx={dim / 2}
                cy={dim / 2}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={stroke}
                strokeDasharray={`${len} ${circumference}`}
                strokeDashoffset={dashOffset}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className={`${size === 'lg' ? 'text-xl' : size === 'sm' ? 'text-xs' : 'text-sm'} font-black text-[#1E1548] leading-none`}>
            {total}
          </span>
          <span className={`${size === 'sm' ? 'text-[8px]' : 'text-[10px]'} font-semibold text-[#8C84A0] mt-0.5`}>
            Staff
          </span>
        </div>
      </div>
    );
  };

  // Staff list state (allows adding new members via Add Staff wizard & updating profile details)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(INITIAL_STAFF);

  // Non-blocking toast notification
  const [staffToast, setStaffToast] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setStaffToast(msg);
    setTimeout(() => {
      setStaffToast((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Staff Insights interactive state
  const [attendanceRange, setAttendanceRange] = useState<'6m' | '3m' | '12m'>('6m');
  const [completedPendingIds, setCompletedPendingIds] = useState<number[]>([]);

  // Add staff form inputs (iPad Pro 12.9_ - 20, 91, 23, 24)
  const [newStaffName, setNewStaffName] = useState('Aarav Sharma');
  const [newStaffEmpId, setNewStaffEmpId] = useState('EMP001');
  const [newStaffPhone, setNewStaffPhone] = useState('98765 43210');
  const [newStaffEmail, setNewStaffEmail] = useState('aarav.sharma@thecoffeeclub.com');
  const [newStaffJobTitle, setNewStaffJobTitle] = useState('Branch Manager');
  const [inviteMethod, setInviteMethod] = useState<'email' | 'sms'>('email');
  const [selectedRoleForNewStaff, setSelectedRoleForNewStaff] = useState('Branch Manager');
  const [branchAccessScope, setBranchAccessScope] = useState<'all' | 'selected' | 'none'>('selected');
  const [branchAccessLevels, setBranchAccessLevels] = useState<
    Record<string, 'Full Access' | 'View & Manage' | 'View Only' | 'No Access'>
  >({
    'Main Branch': 'Full Access',
    'City Mall': 'View & Manage',
    'Riverside': 'View Only',
    'Airport T2': 'No Access',
  });
  const [selectedBranchesForNewStaff, setSelectedBranchesForNewStaff] = useState<string[]>(['Main Branch', 'City Mall', 'Riverside']);

  // Staff Profile interactive state (iPad Pro 12.9_ - 16, 17, 18, 19)
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [profilePermissionLevel, setProfilePermissionLevel] = useState<'view_only' | 'view_manage' | 'full'>('view_manage');
  const [profileModules, setProfileModules] = useState<
    { id: string; name: string; status: 'view_manage' | 'view_only' | 'no_access' }[]
  >([
    { id: 'campaigns', name: 'Campaigns', status: 'view_manage' },
    { id: 'approvals', name: 'Approvals', status: 'view_manage' },
    { id: 'qr_codes', name: 'QR Codes', status: 'view_manage' },
    { id: 'customers', name: 'Customer Data', status: 'view_manage' },
    { id: 'menu', name: 'Menu', status: 'view_manage' },
    { id: 'reports', name: 'Reports', status: 'view_only' },
    { id: 'rewards', name: 'Rewards', status: 'view_manage' },
    { id: 'branch_settings', name: 'Branch Settings', status: 'no_access' },
  ]);
  const [profileApprovalRights, setProfileApprovalRights] = useState({
    approveRewards: true,
    reviewRedemptions: true,
    editCampaignStatus: false,
  });
  const [profileActivityFilter, setProfileActivityFilter] = useState<string>('all');
  const [profileActivityRange, setProfileActivityRange] = useState<string>('Last 30 days');
  const [profileNotes, setProfileNotes] = useState(
    'Reliable and proactive. Handles branch operations very well. Recommended for regional management training.'
  );
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);

  // Roles & Permissions state (iPad Pro 12.9_ - 34, 35, 31, 36, 37)
  type RoleAccessLevel = 'View Only' | 'View & Manage' | 'Full Access';
  interface RoleModuleConfig {
    id: string;
    name: string;
    desc: string;
    active: boolean;
    level: RoleAccessLevel;
  }
  interface RoleRecord {
    id: string;
    initials: string;
    badgeBg: string;
    name: string;
    category: 'System' | 'Custom';
    branchLimited: boolean;
    desc: string;
    staffCount: number;
    permCount: number;
    accessLevel: string;
    visibility: 'All Branches' | 'Specific Branches';
    status: 'Active' | 'Draft';
    branchPolicy: 'all' | 'assigned' | 'none';
    includedBranches: string[];
  }

  const DEFAULT_ROLE_MODULES: RoleModuleConfig[] = [
    { id: 'campaigns', name: 'Campaigns', desc: 'Create and manage marketing campaigns, promotions and announcements.', active: true, level: 'View & Manage' },
    { id: 'approvals', name: 'Approvals', desc: 'Handle approval workflows and requests.', active: true, level: 'View & Manage' },
    { id: 'qr_codes', name: 'QR Codes', desc: 'Generate and manage QR codes.', active: false, level: 'View Only' },
    { id: 'customers', name: 'Customer Data', desc: 'Access and manage customer information and member data.', active: true, level: 'Full Access' },
    { id: 'menu', name: 'Menu', desc: 'Manage menu items, categories and pricing.', active: false, level: 'View & Manage' },
    { id: 'branches', name: 'Branches', desc: 'Manage branch settings and configurations.', active: false, level: 'View Only' },
    { id: 'rewards', name: 'Rewards', desc: 'Manage loyalty points, rewards and redemption rules.', active: true, level: 'View & Manage' },
    { id: 'reports', name: 'Reports', desc: 'Access and generate reports and analytics.', active: true, level: 'Full Access' },
  ];

  const [rolesList, setRolesList] = useState<RoleRecord[]>([
    {
      id: 'role-1',
      initials: 'BM',
      badgeBg: 'bg-[#F3EEFA] text-[#5844A8]',
      name: 'Branch Manager',
      category: 'System',
      branchLimited: false,
      desc: 'Full branch operations access including staff, menu and reports.',
      staffCount: 8,
      permCount: 24,
      accessLevel: 'Full Admin Access',
      visibility: 'All Branches',
      status: 'Active',
      branchPolicy: 'all',
      includedBranches: ['Main Branch', 'City Mall', 'Riverside', 'Airport T2'],
    },
    {
      id: 'role-2',
      initials: 'CS',
      badgeBg: 'bg-amber-50 text-amber-700',
      name: 'Cashier',
      category: 'System',
      branchLimited: true,
      desc: 'Handle orders, payments and basic customer actions.',
      staffCount: 12,
      permCount: 8,
      accessLevel: 'Basic Access',
      visibility: 'Specific Branches',
      status: 'Active',
      branchPolicy: 'assigned',
      includedBranches: ['Main Branch', 'City Mall'],
    },
    {
      id: 'role-3',
      initials: 'ME',
      badgeBg: 'bg-purple-50 text-purple-700',
      name: 'Marketing Executive',
      category: 'Custom',
      branchLimited: false,
      desc: 'Manage campaigns, promotions and customer engagement.',
      staffCount: 4,
      permCount: 14,
      accessLevel: 'Standard Access',
      visibility: 'All Branches',
      status: 'Active',
      branchPolicy: 'all',
      includedBranches: ['Main Branch', 'City Mall', 'Riverside', 'Airport T2'],
    },
    {
      id: 'role-4',
      initials: 'CS',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      name: 'Customer Support',
      category: 'System',
      branchLimited: false,
      desc: 'Handle customer enquiries and manage customer data.',
      staffCount: 3,
      permCount: 10,
      accessLevel: 'Standard Access',
      visibility: 'All Branches',
      status: 'Active',
      branchPolicy: 'all',
      includedBranches: ['Main Branch', 'City Mall', 'Riverside', 'Airport T2'],
    },
    {
      id: 'role-5',
      initials: 'WF',
      badgeBg: 'bg-orange-50 text-orange-700',
      name: 'Waiter / Floor Staff',
      category: 'System',
      branchLimited: true,
      desc: 'Take orders and manage table service.',
      staffCount: 6,
      permCount: 6,
      accessLevel: 'Basic Access',
      visibility: 'Specific Branches',
      status: 'Active',
      branchPolicy: 'assigned',
      includedBranches: ['Main Branch', 'Riverside'],
    },
    {
      id: 'role-6',
      initials: 'LS',
      badgeBg: 'bg-pink-50 text-pink-700',
      name: 'Loyalty Specialist',
      category: 'Custom',
      branchLimited: false,
      desc: 'Manage rewards, loyalty program and member data.',
      staffCount: 2,
      permCount: 12,
      accessLevel: 'Standard Access',
      visibility: 'All Branches',
      status: 'Active',
      branchPolicy: 'all',
      includedBranches: ['Main Branch', 'City Mall', 'Riverside', 'Airport T2'],
    },
  ]);

  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'system' | 'custom' | 'branch'>('all');
  const [recentRoleUpdates, setRecentRoleUpdates] = useState([
    { title: 'Marketing Executive role updated', meta: 'Jamie Tan • 2 hours ago', iconBg: 'bg-emerald-50 text-emerald-600', type: 'update' as const },
    { title: "New role 'Loyalty Specialist' created", meta: 'Priya Shah • 1 day ago', iconBg: 'bg-[#F3EEFA] text-[#5844A8]', type: 'create' as const },
    { title: 'Cashier permissions updated', meta: 'Marcus Lim • 3 days ago', iconBg: 'bg-amber-50 text-amber-600', type: 'perm' as const },
  ]);

  // Add / Edit Role 4-Step Wizard state (iPad Pro 12.9_ - 35, 31, 36, 37)
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [newRoleName, setNewRoleName] = useState('Marketing Executive');
  const [newRoleCategory, setNewRoleCategory] = useState<'System' | 'Custom'>('Custom');
  const [newRoleDesc, setNewRoleDesc] = useState('Manage campaigns, promotions and customer engagement across all channels.');
  const [newRoleAccessLevel, setNewRoleAccessLevel] = useState('Standard Access');
  const [newRoleVisibility, setNewRoleVisibility] = useState<'All Branches' | 'Specific Branches'>('All Branches');
  const [newRoleActive, setNewRoleActive] = useState(true);
  const [newRoleModules, setNewRoleModules] = useState<RoleModuleConfig[]>(DEFAULT_ROLE_MODULES);
  const [newRoleBranchPolicy, setNewRoleBranchPolicy] = useState<'all' | 'assigned' | 'none'>('all');
  const [newRoleIncludedBranches, setNewRoleIncludedBranches] = useState<string[]>([
    'Main Branch',
    'City Mall',
    'Riverside',
    'Airport T2',
  ]);

  const openAddRoleWizard = (existingRole?: RoleRecord) => {
    if (existingRole) {
      setEditingRoleId(existingRole.id);
      setNewRoleName(existingRole.name);
      setNewRoleCategory(existingRole.category);
      setNewRoleDesc(existingRole.desc);
      setNewRoleAccessLevel(existingRole.accessLevel);
      setNewRoleVisibility(existingRole.visibility);
      setNewRoleActive(existingRole.status === 'Active');
      setNewRoleBranchPolicy(existingRole.branchPolicy);
      setNewRoleIncludedBranches(existingRole.includedBranches);
    } else {
      setEditingRoleId(null);
      setNewRoleName('Marketing Executive');
      setNewRoleCategory('Custom');
      setNewRoleDesc('Manage campaigns, promotions and customer engagement across all channels.');
      setNewRoleAccessLevel('Standard Access');
      setNewRoleVisibility('All Branches');
      setNewRoleActive(true);
      setNewRoleModules(DEFAULT_ROLE_MODULES);
      setNewRoleBranchPolicy('all');
      setNewRoleIncludedBranches(['Main Branch', 'City Mall', 'Riverside', 'Airport T2']);
    }
    setSelectedStaffId(null);
    setIsAddStaffOpen(false);
    setAddRoleStep(1);
    setIsAddRoleOpen(true);
  };

  // Selected staff object
  const activeStaff = staffMembers.find((s) => s.id === selectedStaffId) || staffMembers[0];

  return (
    <div className="bg-[#FAF8FF] text-[#1A1615] flex flex-col font-sans pb-4 lg:pb-8 relative">
      {/* Floating Toast Notification */}
      {staffToast && (
        <div className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-50 bg-[#240B4C] text-white px-4 py-2.5 rounded-2xl shadow-lg border border-purple-400/20 flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{staffToast}</span>
        </div>
      )}
      {/* Top Tablet Navigation Header */}
      <div className="bg-white/95 backdrop-blur-md border-b border-[#F1EFEA] px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4 md:sticky md:top-0 z-20 shadow-2xs">
        <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-[#5844A8] to-[#7C3AED] flex items-center justify-center text-white shadow-xs shrink-0">
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="text-sm sm:text-base font-black text-[#1A1615] flex items-center gap-1.5 sm:gap-2">
              <span>Loyaltics</span>
              <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                Merchant App
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] text-[#8C877D] font-bold">
              {currentTab === 'staff' && staffSubView === 'insights' && (insightsTabMode === 'analytics' ? 'Staff Insights & Store Analytics' : 'Staff Management Overview')}
              {currentTab === 'staff' && staffSubView === 'directory' && 'Staff Directory & Access Control'}
              {currentTab === 'staff' && staffSubView === 'states' && 'Staff by Location & State Coverage'}
              {currentTab === 'permissions' && 'Roles & System Permissions'}
              {currentTab === 'activity' && 'Staff Software Activity & Audit Log'}
              {currentTab === 'reports' && 'Exportable Performance & Activity Reports'}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-2 sm:gap-2.5 flex-wrap sm:flex-nowrap">
          <button className="px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-gray-200 text-xs font-bold text-[#1A1615] flex items-center gap-1.5 bg-white shadow-2xs hover:border-gray-300">
            <span>Last 30 Days</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('/staff-portal' as any)}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-[#EAE6E1] bg-white hover:bg-[#FAF8F5] text-xs font-bold text-[#5844A8] flex items-center gap-1.5 shadow-2xs hover:border-[#5844A8]/40 transition cursor-pointer"
            title="Launch Waiter & Floor Table Service Portal"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#5844A8]" />
            <span>Floor Portal</span>
          </button>
          {currentTab === 'staff' && staffSubView === 'insights' ? (
            <button
              onClick={() => {
                setIsAddStaffOpen(true);
                setAddStaffStep(1);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1F1641] hover:bg-[#2D215E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Invite Staff</span>
            </button>
          ) : currentTab === 'staff' && staffSubView === 'directory' ? (
            <button
              onClick={() => {
                setIsAddStaffOpen(true);
                setAddStaffStep(1);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1F1641] hover:bg-[#2D215E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add Staff</span>
            </button>
          ) : currentTab === 'permissions' ? (
            <button
              onClick={() => openAddRoleWizard()}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#240B4C] hover:bg-[#321266] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add New Role</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setIsAddStaffOpen(true);
                setAddStaffStep(1);
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#1F1641] hover:bg-[#2D215E] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/10 cursor-pointer transition-all shrink-0"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Invite Staff</span>
            </button>
          )}
        </div>
      </div>

      {/* Staff View Sub-Tabs for Mobile and Tablet */}
      <div className="bg-white border-b border-[#F1EFEA] px-3.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
        {[
          { id: 'staff', label: 'Staff', icon: Users },
          { id: 'permissions', label: 'Permissions', icon: Shield },
          { id: 'activity', label: 'Activity', icon: Clock },
          { id: 'reports', label: 'Reports', icon: FileText },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setCurrentTab(tab.id as any);
              if (tab.id === 'staff') setStaffSubView('insights');
              if (tab.id === 'activity') setActivitySubView('list');
              if (tab.id === 'reports') setReportsSubView('categories');
              setSelectedStaffId(null);
              setIsAddStaffOpen(false);
              setIsAddRoleOpen(false);
            }}
            className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              currentTab === tab.id
                ? 'bg-[#5844A8] text-white shadow-xs'
                : 'bg-gray-50 text-[#8C877D] hover:text-[#1A1615] hover:bg-gray-100'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Main Container */}
      <div className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-[1600px] mx-auto w-full">
        {/* ======================================================== */}
        {/* TAB 1: STAFF (Management, Overview, Directory & Location) */}
        {/* ======================================================== */}
        {currentTab === 'staff' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (
          <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
            {/* SUB-VIEW 1: STAFF INSIGHTS / OVERVIEW (iPad Pro 12.9_ - 14 & 80) */}
            {staffSubView === 'insights' && (
              <div className="space-y-4 sm:space-y-6">
                {/* Header Row & Subview Switcher */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">
                      {insightsTabMode === 'analytics' ? 'Staff Insights' : 'Staff Management'}
                    </h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      {insightsTabMode === 'analytics'
                        ? 'Track staff engagement, attendance and store performance across all branches.'
                        : 'Manage staff, roles, access and activity across all branches.'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {insightsTabMode === 'analytics' && (
                      <button
                        type="button"
                        onClick={() => triggerToast('Staff Insights report downloaded (PDF)')}
                        className="px-3.5 py-2 bg-[#240B4C] hover:bg-[#321266] text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Report</span>
                      </button>
                    )}

                    {/* Insights Sub-View Switcher: Analytics (iPad 14) vs Location Operations (iPad 80) */}
                    <div className="flex items-center gap-1 p-1 bg-white border border-[#EFEAF7] rounded-2xl shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setInsightsTabMode('analytics')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          insightsTabMode === 'analytics'
                            ? 'bg-[#240B4C] text-white shadow-xs'
                            : 'text-[#7B748C] hover:text-[#1E1548]'
                        }`}
                      >
                        Insights
                      </button>
                      <button
                        type="button"
                        onClick={() => setInsightsTabMode('operations')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          insightsTabMode === 'operations'
                            ? 'bg-[#240B4C] text-white shadow-xs'
                            : 'text-[#7B748C] hover:text-[#1E1548]'
                        }`}
                      >
                        Operations
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setStaffSubView('directory')}
                      className="px-3 py-2 bg-white border border-[#EFEAF7] text-xs font-bold rounded-xl hover:border-[#5844A8]/40 shadow-2xs flex items-center gap-1.5 cursor-pointer text-[#1E1548]"
                    >
                      <Users className="w-3.5 h-3.5 text-[#5844A8]" />
                      <span>Staff Directory</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStaffSubView('states')}
                      className="px-3 py-2 bg-[#F3EEFA] text-[#5844A8] text-xs font-bold rounded-xl hover:bg-[#EAE1F8] transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-[#5844A8]" />
                      <span>Staff by Location</span>
                    </button>
                  </div>
                </div>

                {/* MODE 1: STAFF INSIGHTS (Matching iPad Pro 12.9_ - 14) */}
                {insightsTabMode === 'analytics' && (
                  <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                    {/* 8 KPI Metrics Cards — 4 columns on Tablet & Desktop (iPad Pro 12.9_ - 14) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                      {[
                        { label: 'Total Staff', value: '2,482', delta: '↑ 12% vs. previous period', icon: Users, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                        { label: 'Active Staff', value: '1,320', delta: '↑ 8% vs. previous period', icon: Zap, iconBg: 'bg-pink-50 text-pink-600' },
                        { label: 'Shift Attendance', value: '640', delta: '↑ 10% vs. previous period', icon: RefreshCw, iconBg: 'bg-sky-50 text-sky-600' },
                        { label: 'Avg Spend / Staff', value: '₹1,240', delta: '↑ 9% vs. previous period', icon: Award, iconBg: 'bg-pink-50 text-pink-600' },
                        { label: 'Managers & Sups', value: '430', delta: '↑ 15% vs. previous period', icon: Sparkles, iconBg: 'bg-amber-50 text-amber-600' },
                        { label: 'New Hires Month', value: '186', delta: '↑ 22% vs. last month', icon: UserPlus, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                        { label: 'Retention Rate', value: '68%', delta: '↑ 6% vs. previous period', icon: Heart, iconBg: 'bg-rose-50 text-rose-600' },
                        { label: 'Avg Shifts / Week', value: '3.8', delta: '↑ 12% vs. previous period', icon: BarChart2, iconBg: 'bg-indigo-50 text-indigo-600' }
                      ].map((kpi) => (
                        <div
                          key={kpi.label}
                          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col justify-between hover:border-[#D9CEF2] transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2 text-[#7B748C]">
                            <span className="text-[11px] font-bold truncate">{kpi.label}</span>
                            <span className={`p-1.5 rounded-xl shrink-0 ${kpi.iconBg}`}>
                              <kpi.icon className="w-3.5 h-3.5" />
                            </span>
                          </div>
                          <div>
                            <div className="text-xl sm:text-2xl font-black text-[#1E1548] mt-2 leading-tight">
                              {kpi.value}
                            </div>
                            <div className="text-[10px] font-bold text-emerald-600 mt-1 truncate">
                              {kpi.delta}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Row 2: Role Distribution Donut & Attendance Trend Bar Chart — 2 cols on Tablet (iPad Pro 12.9_ - 14) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Staff Role Distribution */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Staff Role Distribution</h3>
                          <button
                            type="button"
                            onClick={() => setCurrentTab('permissions')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View Details →
                          </button>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-5 pt-1">
                          {renderRoleDonut(
                            2482,
                            [
                              { value: 120, color: '#240B4C' },
                              { value: 370, color: '#EC4899' },
                              { value: 620, color: '#F59E0B' },
                              { value: 830, color: '#38BDF8' },
                              { value: 542, color: '#94A3B8' }
                            ],
                            'lg'
                          )}

                          {/* Legend Breakdown */}
                          <div className="flex-1 w-full space-y-2 text-xs">
                            {[
                              { label: 'Manager', count: '120', pct: '5%', dot: 'bg-[#240B4C]' },
                              { label: 'Cashier', count: '370', pct: '15%', dot: 'bg-[#EC4899]' },
                              { label: 'Sales Rep', count: '620', pct: '25%', dot: 'bg-[#F59E0B]' },
                              { label: 'Support', count: '830', pct: '33%', dot: 'bg-[#38BDF8]' },
                              { label: 'Trainee', count: '542', pct: '22%', dot: 'bg-[#94A3B8]' }
                            ].map((item) => (
                              <div key={item.label} className="flex justify-between items-center py-0.5">
                                <span className="flex items-center gap-2 font-bold text-[#5E5870]">
                                  <span className={`w-2.5 h-2.5 rounded-full ${item.dot}`} />
                                  {item.label}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="font-extrabold text-[#1E1548]">{item.count}</span>
                                  <span className="text-[#8C84A0] text-[11px] font-bold w-8 text-right">{item.pct}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Staff Attendance Trend (Bar Chart with Y-Axis) */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Staff Attendance Trend</h3>
                          <button
                            type="button"
                            onClick={() =>
                              setAttendanceRange((prev) => (prev === '6m' ? '3m' : prev === '3m' ? '12m' : '6m'))
                            }
                            className="px-2.5 py-1 rounded-xl border border-[#EFEAF7] text-[11px] font-bold text-[#5E5870] hover:border-[#5844A8]/40 flex items-center gap-1 bg-white cursor-pointer"
                          >
                            <span>
                              {attendanceRange === '6m' ? 'Last 6 Months' : attendanceRange === '3m' ? 'Last 3 Months' : 'Last 12 Months'}
                            </span>
                            <ChevronDown className="w-3 h-3 text-[#8C84A0]" />
                          </button>
                        </div>

                        <div className="flex items-stretch gap-2.5 h-44 pt-2">
                          {/* Y-Axis */}
                          <div className="flex flex-col justify-between text-[10px] font-bold text-[#9890A8] pb-5 pr-1 text-right shrink-0">
                            <span>800</span>
                            <span>600</span>
                            <span>400</span>
                            <span>200</span>
                            <span>0</span>
                          </div>

                          {/* Bars + Gridlines */}
                          <div className="flex-1 relative flex items-end justify-between gap-2.5 px-1">
                            {/* Subtle horizontal gridlines */}
                            <div className="absolute inset-x-0 top-0 bottom-5 flex flex-col justify-between pointer-events-none">
                              <div className="border-t border-dashed border-[#EFEAF7]" />
                              <div className="border-t border-dashed border-[#EFEAF7]" />
                              <div className="border-t border-dashed border-[#EFEAF7]" />
                              <div className="border-t border-dashed border-[#EFEAF7]" />
                              <div className="border-t border-[#EFEAF7]" />
                            </div>

                            {(attendanceRange === '3m'
                              ? [
                                  { month: 'Aug', count: 580, height: '72%' },
                                  { month: 'Sep', count: 620, height: '78%' },
                                  { month: 'Oct', count: 640, height: '82%' }
                                ]
                              : attendanceRange === '12m'
                              ? [
                                  { month: 'Q1', count: 410, height: '52%' },
                                  { month: 'Q2', count: 510, height: '64%' },
                                  { month: 'Q3', count: 600, height: '75%' },
                                  { month: 'Oct', count: 640, height: '82%' },
                                  { month: 'Nov', count: 690, height: '88%' },
                                  { month: 'Dec', count: 740, height: '94%' }
                                ]
                              : [
                                  { month: 'May', count: 420, height: '52%' },
                                  { month: 'Jun', count: 480, height: '60%' },
                                  { month: 'Jul', count: 520, height: '65%' },
                                  { month: 'Aug', count: 580, height: '73%' },
                                  { month: 'Sep', count: 620, height: '78%' },
                                  { month: 'Oct', count: 640, height: '82%' }
                                ]
                            ).map((bar) => (
                              <div key={bar.month} className="relative z-10 flex-1 flex flex-col items-center gap-1 h-full justify-end">
                                <span className="text-[10px] font-extrabold text-[#5E5870]">{bar.count}</span>
                                <div
                                  style={{ height: bar.height }}
                                  className="w-full max-w-[34px] rounded-t-xl bg-gradient-to-t from-[#EC4899]/80 via-[#F472B6] to-[#FB7185] hover:opacity-90 transition-all cursor-pointer shadow-xs"
                                  title={`${bar.month}: ${bar.count} shifts attended`}
                                />
                                <span className="text-[10px] font-bold text-[#7B748C] mt-0.5">{bar.month}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 3: Recent Staff Activity & Performance & Payroll Insights — 2 cols on Tablet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Recent Staff Activity */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Recent Staff Activity</h3>
                          <button
                            type="button"
                            onClick={() => setCurrentTab('activity')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="divide-y divide-[#F5F2FA] text-xs">
                          {[
                            { initials: 'NG', name: 'Neha Gupta', action: 'Clocked in morning shift', sub: 'Verified via biometric • The Courtyard', time: '2h ago', bg: 'bg-[#240B4C] text-white', staffId: 'st-6' },
                            { initials: 'PS', name: 'Priya Singh', action: 'Earned High Sales Incentive', sub: 'Completed quarterly audit • ₹1,280 bonus', time: '4h ago', bg: 'bg-[#F3EEFA] text-[#5844A8]', staffId: 'st-2' },
                            { initials: 'RK', name: 'Rahul Kumar', action: 'Transferred to Sector 18 Store', sub: 'Manager signoff approved', time: '6h ago', bg: 'bg-sky-100 text-sky-700', staffId: 'st-3' },
                            { initials: 'AS', name: 'Aarav Sharma', action: 'Completed Onboarding Program', sub: 'Assigned to floor inventory team', time: '12h ago', bg: 'bg-amber-100 text-amber-700', staffId: 'st-1' },
                            { initials: 'SK', name: 'Sneha Kapoor', action: 'Requested Shift Exchange', sub: 'Shift #ORD7283 • Plaza Mall', time: '1d ago', bg: 'bg-pink-100 text-pink-700', staffId: 'st-4' }
                          ].map((item, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedStaffId(item.staffId);
                                setProfileTab('activity');
                              }}
                              className="py-2.5 flex items-center justify-between gap-2.5 hover:bg-[#FAF8FF] -mx-2 px-2 rounded-xl cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${item.bg}`}>
                                  {item.initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-extrabold text-[#1E1548] truncate">
                                    {item.name} <span className="font-semibold text-[#7B748C]">• {item.action}</span>
                                  </div>
                                  <div className="text-[10px] text-[#8C84A0] font-medium truncate">{item.sub}</div>
                                </div>
                              </div>
                              <span className="text-[10px] text-[#8C84A0] font-semibold whitespace-nowrap shrink-0">{item.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Performance & Payroll Insights */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-4">
                        <div>
                          <div className="flex items-center justify-between pb-3">
                            <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Performance &amp; Payroll Insights</h3>
                            <button
                              type="button"
                              onClick={() => setCurrentTab('reports')}
                              className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                            >
                              View Details →
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                            {[
                              { label: 'Overtime Hours', value: '12,560', delta: '↑ 18% vs. previous' },
                              { label: 'Incentives Paid', value: '₹3,200', delta: '↑ 12% vs. previous' },
                              { label: 'Allowances Claimed', value: '₹2,680', delta: '↑ 16% vs. previous' },
                              { label: 'Active On-Duty Staff', value: '1,250', delta: '↑ 14% vs. previous' }
                            ].map((m) => (
                              <div key={m.label} className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7]">
                                <span className="text-[10px] text-[#7B748C] font-bold uppercase tracking-wider block truncate">
                                  {m.label}
                                </span>
                                <div className="text-lg font-black text-[#1E1548] mt-1">{m.value}</div>
                                <span className="text-[10px] text-emerald-600 font-bold">{m.delta}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Training progress */}
                        <div className="p-3.5 rounded-2xl bg-[#F8F5FF] border border-[#EAE2FB] space-y-2">
                          <div className="flex items-center justify-between gap-2 text-xs font-bold text-[#1E1548]">
                            <span>50% of your staff completed training</span>
                            <span className="text-[#5844A8] font-bold text-[11px] whitespace-nowrap">1,250 / 2,482</span>
                          </div>
                          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#E6DCF8]">
                            <div className="bg-gradient-to-r from-[#5844A8] to-[#7C3AED] h-2 rounded-full w-1/2" />
                          </div>
                          <div className="text-[10px] text-[#7B748C] font-semibold">Active staff members</div>
                        </div>
                      </div>
                    </div>

                    {/* Row 4: Branch Distribution & Pending Actions — 2 cols on Tablet */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Left: Branch Distribution */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Branch Distribution</h3>
                          <button
                            type="button"
                            onClick={() => setStaffSubView('states')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          {[
                            { name: 'Main Branch', count: '8 staff', width: '100%' },
                            { name: 'City Mall', count: '6 staff', width: '75%' },
                            { name: 'Riverside', count: '4 staff', width: '50%' },
                            { name: 'Airport T2', count: '4 staff', width: '50%' },
                            { name: 'Central Plaza', count: '2 staff', width: '25%' },
                            { name: 'North Plaza', count: '2 staff', width: '25%' }
                          ].map((b, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setSelectedBranch(b.name);
                                setStaffSubView('branch_staff');
                              }}
                              className="space-y-1 cursor-pointer group"
                            >
                              <div className="flex justify-between font-bold text-[#5E5870] group-hover:text-[#5844A8] transition-colors">
                                <span className="flex items-center gap-1.5">
                                  <Building2 className="w-3.5 h-3.5 text-[#5844A8]" />
                                  {b.name}
                                </span>
                                <span className="text-[#7B748C]">{b.count}</span>
                              </div>
                              <div className="w-full bg-[#F3EEFA] h-2 rounded-full overflow-hidden">
                                <div style={{ width: b.width }} className="bg-[#5844A8] h-2 rounded-full transition-all" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Pending Actions */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Pending Actions</h3>
                          <button
                            type="button"
                            onClick={() => {
                              setDirectoryFilter('pending');
                              setStaffSubView('directory');
                            }}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          {[
                            { id: 1, title: '4 Pending invitations', desc: 'Send reminder emails to invited staff', icon: Mail, iconColor: 'text-amber-600', iconBg: 'bg-amber-50', action: 'Remind', doneLabel: 'Reminded', toast: 'Reminder sent to 4 pending staff invitations', isPrimary: false },
                            { id: 2, title: '2 Role change requests', desc: 'Review pending tier elevations', icon: UserCheck, iconColor: 'text-pink-600', iconBg: 'bg-pink-50', action: 'Review', doneLabel: 'Reviewed', toast: 'Opened pending role change requests', isPrimary: false },
                            { id: 3, title: '1 Access request', desc: 'Needs administrator approval', icon: Key, iconColor: 'text-rose-600', iconBg: 'bg-rose-50', action: 'Approve', doneLabel: 'Approved', toast: 'Staff access request approved', isPrimary: true },
                            { id: 4, title: '3 Expiring certifications', desc: 'Notify staff to renew food safety pass', icon: ShieldCheck, iconColor: 'text-[#5844A8]', iconBg: 'bg-[#F3EEFA]', action: 'Remind', doneLabel: 'Notified', toast: 'Renewal reminders dispatched to 3 staff', isPrimary: false }
                          ].map((act) => {
                            const isDone = completedPendingIds.includes(act.id);
                            return (
                              <div key={act.id} className="p-3 rounded-2xl border border-[#EFEAF7] flex items-center justify-between gap-2.5 bg-[#FAF8FF]/70 hover:bg-[#FAF8FF] transition-all">
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className={`w-9 h-9 rounded-xl ${act.iconBg} ${act.iconColor} flex items-center justify-center shrink-0`}>
                                    <act.icon className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-[#1E1548] truncate">{act.title}</div>
                                    <div className="text-[10px] text-[#8C84A0] font-medium truncate">{act.desc}</div>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  disabled={isDone}
                                  onClick={() => {
                                    setCompletedPendingIds((prev) => [...prev, act.id]);
                                    triggerToast(act.toast);
                                    if (act.id === 2) setCurrentTab('permissions');
                                  }}
                                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                                    isDone
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default'
                                      : act.isPrimary
                                      ? 'bg-[#240B4C] hover:bg-[#321266] text-white shadow-xs cursor-pointer'
                                      : 'bg-white border border-[#EFEAF7] text-[#1E1548] hover:border-[#5844A8]/50 cursor-pointer'
                                  }`}
                                >
                                  {isDone ? `✓ ${act.doneLabel}` : act.action}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: LOCATION & OPERATIONS (Matching iPad Pro 12.9_ - 80) */}
                {insightsTabMode === 'operations' && (
                  <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                    {/* 8 Tinted Stats Metrics Cards — 4 columns on Tablet & Desktop (iPad Pro 12.9_ - 80) */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div className="bg-[#F8F5FF] p-4 rounded-2xl border border-[#EAE2FB] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#1E1548] leading-none">142</div>
                          <Users className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                        <div className="text-xs font-semibold text-[#6B657E] mt-2">Total Staff</div>
                      </div>

                      <div className="bg-[#ECFDF5] p-4 rounded-2xl border border-[#D1FAE5] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#065F46] leading-none">128</div>
                          <Check className="w-4 h-4 text-[#059669]" />
                        </div>
                        <div className="text-xs font-semibold text-[#047857] mt-2">Active Accounts</div>
                      </div>

                      <div className="bg-[#FEFCE8] p-4 rounded-2xl border border-[#FEF08A]/70 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#713F12] leading-none">10</div>
                          <Mail className="w-4 h-4 text-[#B45309]" />
                        </div>
                        <div className="text-xs font-semibold text-[#92400E] mt-2">Pending Invitations</div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#1E1548] leading-none">18</div>
                          <FileText className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                        <div className="text-xs font-semibold text-[#6B657E] mt-2">Roles Created</div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#1E1548] leading-none">21</div>
                          <Store className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                        <div className="text-xs font-semibold text-[#6B657E] mt-2">Branches Covered</div>
                      </div>

                      <div className="bg-[#FAF8FF] p-4 rounded-2xl border border-[#EAE2FB] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#1E1548] leading-none">6.8</div>
                          <Share2 className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                        <div className="text-xs font-semibold text-[#6B657E] mt-2">Avg Branches per Staff</div>
                      </div>

                      <div className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#1E1548] leading-none">36</div>
                          <Award className="w-4 h-4 text-[#8C84A0]" />
                        </div>
                        <div className="text-xs font-semibold text-[#6B657E] mt-2">Full Access Users</div>
                      </div>

                      <div className="bg-[#FFF5F5] p-4 rounded-2xl border border-[#FECDD3]/70 shadow-2xs flex flex-col justify-between">
                        <div className="flex items-start justify-between">
                          <div className="text-2xl font-black text-[#881337] leading-none">4</div>
                          <XCircle className="w-4 h-4 text-[#E11D48]" />
                        </div>
                        <div className="text-xs font-semibold text-[#9F1239] mt-2">Suspended Accounts</div>
                      </div>
                    </div>

                    {/* Explore Staff by Location Banner (Matching iPad Pro 12.9_ - 80) */}
                    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EAE2FB] shadow-2xs space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-11 h-11 rounded-2xl bg-[#240B4C] text-white flex items-center justify-center shadow-xs shrink-0">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Explore Staff by Location</h3>
                            <p className="text-xs text-[#7B748C] mt-0.5">
                              View assigned staff, roles, permissions and account status by state, city and branch
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setLocationSearchQuery('');
                            setStaffSubView('states');
                          }}
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#240B4C] hover:bg-[#36126E] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer shrink-0 transition"
                        >
                          <span>Explore Locations →</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setLocationSearchQuery('');
                            setStaffSubView('states');
                          }}
                          className="p-3 sm:p-4 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#5844A8]/40 flex items-baseline gap-2 cursor-pointer transition text-left"
                        >
                          <span className="text-lg sm:text-xl font-black text-[#1E1548]">4</span>
                          <span className="text-xs font-semibold text-[#6B657E]">States</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedState('Uttar Pradesh');
                            setLocationSearchQuery('');
                            setStaffSubView('cities');
                          }}
                          className="p-3 sm:p-4 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#5844A8]/40 flex items-baseline gap-2 cursor-pointer transition text-left"
                        >
                          <span className="text-lg sm:text-xl font-black text-[#1E1548]">12</span>
                          <span className="text-xs font-semibold text-[#6B657E]">Cities</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedState('Uttar Pradesh');
                            setSelectedCity('Noida');
                            setLocationSearchQuery('');
                            setStaffSubView('branches');
                          }}
                          className="p-3 sm:p-4 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#5844A8]/40 flex items-baseline gap-2 cursor-pointer transition text-left"
                        >
                          <span className="text-lg sm:text-xl font-black text-[#1E1548]">21</span>
                          <span className="text-xs font-semibold text-[#6B657E]">Branches</span>
                        </button>
                      </div>

                      <div className="pt-3 border-t border-[#EFEAF7] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                        <span className="text-[#6B657E]">
                          <strong className="text-[#1E1548]">Location spotlight • Noida</strong> &nbsp;|&nbsp; 18 assigned staff across 3 branches • 16 active accounts
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedState('Uttar Pradesh');
                            setSelectedCity('Noida');
                            setLocationSearchQuery('');
                            setStaffSubView('branches');
                          }}
                          className="text-[#5844A8] font-bold hover:underline shrink-0 cursor-pointer text-left sm:text-right"
                        >
                          View Noida →
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Role Distribution + Access & Invitations (iPad Pro 12.9_ - 80) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {/* Role Distribution Card */}
                      <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base font-black text-[#1E1548]">Role Distribution</span>
                          <button
                            type="button"
                            onClick={() => setCurrentTab('permissions')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            Manage Roles →
                          </button>
                        </div>

                        <div className="flex items-center gap-5 pt-1">
                          {renderRoleDonut(
                            142,
                            [
                              { value: 18, color: '#240B4C' },
                              { value: 26, color: '#5844A8' },
                              { value: 64, color: '#C0267A' },
                              { value: 28, color: '#F59E0B' },
                              { value: 6, color: '#38BDF8' },
                            ],
                            'lg'
                          )}

                          <div className="flex-1 w-full space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 font-semibold text-[#5E5870]"><span className="w-2.5 h-2.5 rounded-full bg-[#240B4C]" /> Managers</span>
                              <span className="font-black text-[#1E1548]">18</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 font-semibold text-[#5E5870]"><span className="w-2.5 h-2.5 rounded-full bg-[#5844A8]" /> Supervisors</span>
                              <span className="font-black text-[#1E1548]">26</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 font-semibold text-[#5E5870]"><span className="w-2.5 h-2.5 rounded-full bg-[#C0267A]" /> Service Staff</span>
                              <span className="font-black text-[#1E1548]">64</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 font-semibold text-[#5E5870]"><span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" /> Kitchen Staff</span>
                              <span className="font-black text-[#1E1548]">28</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 font-semibold text-[#5E5870]"><span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]" /> Other</span>
                              <span className="font-black text-[#1E1548]">6</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Access & Invitations Card (iPad Pro 12.9_ - 80) */}
                      <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between space-y-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm sm:text-base font-black text-[#1E1548]">Access &amp; Invitations</span>
                            <button
                              type="button"
                              onClick={() => {
                                setDirectoryFilter('pending');
                                setStaffSubView('directory');
                              }}
                              className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                            >
                              View All →
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="bg-[#FAF8FF] border border-[#EFEAF7] rounded-2xl py-3 px-2 text-center">
                              <div className="text-lg font-black text-[#1E1548]">128</div>
                              <div className="text-[11px] font-semibold text-[#7B748C] mt-0.5">Active</div>
                            </div>
                            <div className="bg-[#FAF8FF] border border-[#EFEAF7] rounded-2xl py-3 px-2 text-center">
                              <div className="text-lg font-black text-[#1E1548]">10</div>
                              <div className="text-[11px] font-semibold text-[#7B748C] mt-0.5">Invited</div>
                            </div>
                            <div className="bg-[#FAF8FF] border border-[#EFEAF7] rounded-2xl py-3 px-2 text-center">
                              <div className="text-lg font-black text-[#1E1548]">4</div>
                              <div className="text-[11px] font-semibold text-[#7B748C] mt-0.5">Disabled</div>
                            </div>
                          </div>

                          <p className="text-xs text-[#6B657E] leading-relaxed">
                            Review pending invitations and confirm that every employee has the correct role and branch access.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setDirectoryFilter('pending');
                            setStaffSubView('directory');
                          }}
                          className="w-full py-2.5 rounded-xl bg-white border border-[#E6DFF4] hover:border-[#5844A8] hover:bg-[#FAF8FF] text-xs font-bold text-[#1E1548] transition cursor-pointer"
                        >
                          Review Invitations →
                        </button>
                      </div>
                    </div>

                    {/* Row 3: Recent Staff Activity + Quick Management 4 Tiles (iPad Pro 12.9_ - 80) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                      {/* Recent Staff Activity */}
                      <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base font-black text-[#1E1548]">Recent Staff Activity</span>
                          <button
                            type="button"
                            onClick={() => setCurrentTab('activity')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View All →
                          </button>
                        </div>

                        <div className="divide-y divide-[#F3EFFB]">
                          {[
                            { initials: 'RS', name: 'Rohan Singh', desc: 'Approved a service request • Sector 18', time: '10:42 AM' },
                            { initials: 'NK', name: 'Neha Kapoor', desc: 'Accepted staff invitation • Sector 62', time: '10:18 AM' },
                            { initials: 'AP', name: 'Arjun Patel', desc: 'Updated branch access • Expressway', time: '9:56 AM' },
                            { initials: 'PM', name: 'Priya Mehta', desc: 'Reviewed customer reward approval', time: '9:24 AM' },
                          ].map((act, i) => (
                            <div key={i} className="py-2.5 flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-[#F2ECFF] text-[#5844A8] font-bold text-[11px] flex items-center justify-center shrink-0">
                                  {act.initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-bold text-[#1E1548] truncate">{act.name}</div>
                                  <div className="text-[11px] text-[#8C84A0] truncate">{act.desc}</div>
                                </div>
                              </div>
                              <span className="text-[10px] font-semibold text-[#8C84A0] shrink-0">{act.time}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick Management 4 Tiles */}
                      <div className="bg-white rounded-3xl p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm sm:text-base font-black text-[#1E1548]">Quick Management</span>
                          <button
                            type="button"
                            onClick={() => setStaffSubView('directory')}
                            className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                          >
                            View Staff Directory →
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setStaffSubView('directory')}
                            className="p-3.5 rounded-2xl bg-[#FAF8FF]/60 border border-[#EFEAF7] hover:border-[#5844A8]/50 hover:bg-[#FAF8FF] cursor-pointer transition-all text-left space-y-1.5"
                          >
                            <Users className="w-4 h-4 text-[#5844A8]" />
                            <div className="text-xs font-bold text-[#1E1548]">Staff Directory</div>
                            <div className="text-[10px] text-[#8C84A0]">Find and manage employees</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentTab('permissions')}
                            className="p-3.5 rounded-2xl bg-[#FAF8FF]/60 border border-[#EFEAF7] hover:border-[#5844A8]/50 hover:bg-[#FAF8FF] cursor-pointer transition-all text-left space-y-1.5"
                          >
                            <Shield className="w-4 h-4 text-[#5844A8]" />
                            <div className="text-xs font-bold text-[#1E1548]">Roles &amp; Permissions</div>
                            <div className="text-[10px] text-[#8C84A0]">Control access levels</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setLocationSearchQuery('');
                              setStaffSubView('states');
                            }}
                            className="p-3.5 rounded-2xl bg-[#FAF8FF]/60 border border-[#EFEAF7] hover:border-[#5844A8]/50 hover:bg-[#FAF8FF] cursor-pointer transition-all text-left space-y-1.5"
                          >
                            <MapPin className="w-4 h-4 text-[#5844A8]" />
                            <div className="text-xs font-bold text-[#1E1548]">Branch Assignments</div>
                            <div className="text-[10px] text-[#8C84A0]">Assign work locations</div>
                          </button>

                          <button
                            type="button"
                            onClick={() => setCurrentTab('activity')}
                            className="p-3.5 rounded-2xl bg-[#FAF8FF]/60 border border-[#EFEAF7] hover:border-[#5844A8]/50 hover:bg-[#FAF8FF] cursor-pointer transition-all text-left space-y-1.5"
                          >
                            <FileText className="w-4 h-4 text-[#5844A8]" />
                            <div className="text-xs font-bold text-[#1E1548]">Audit Log</div>
                            <div className="text-[10px] text-[#8C84A0]">Review Loyaltics actions</div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SUB-VIEW 2: STAFF DIRECTORY (Matching iPad Pro 12.9_ - 15) */}
            {staffSubView === 'directory' && (
              <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
                {/* Title & Add Staff CTA Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1A1615]">Staff Directory</h1>
                    <p className="text-xs text-[#8C877D] mt-0.5">
                      Search, filter and manage all your staff members
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setStaffSubView('insights')}
                      className="px-3.5 sm:px-4 py-2 bg-white border border-gray-200 text-xs font-bold rounded-xl hover:border-gray-300 text-gray-700 cursor-pointer shadow-2xs"
                    >
                      ← Back to Insights
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddStaffOpen(true);
                        setAddStaffStep(1);
                      }}
                      className="px-4 py-2 bg-[#1F1641] hover:bg-[#2D215E] text-white rounded-xl text-xs font-black flex items-center justify-center gap-1.5 shadow-md shadow-purple-950/20 cursor-pointer transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      <span>+ Add Staff</span>
                    </button>
                  </div>
                </div>

                {/* Full-Width Segmented Switcher: All Staff vs By Location (iPad Pro 12.9_ - 90) */}
                <div className="grid grid-cols-2 p-1 bg-[#F1EDF9] rounded-2xl border border-[#E7DFF5]">
                  <button
                    type="button"
                    onClick={() => setDirectoryMode('all')}
                    className="py-2.5 rounded-xl text-xs font-bold bg-[#240B4C] text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>◉</span>
                    <span>All Staff</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryMode('location');
                      setLocationSearchQuery('');
                      setStaffSubView('states');
                    }}
                    className="py-2.5 rounded-xl text-xs font-bold text-[#5E5870] hover:text-[#1E1548] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>★</span>
                    <span>By Location</span>
                  </button>
                </div>

                {/* Search Bar + Filter Toggle */}
                <div className="flex items-center gap-2.5">
                  <div className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
                    <Search className="w-4 h-4 text-gray-400 shrink-0" />
                    <input
                      type="text"
                      placeholder="Search by name, phone, email or staff ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent outline-none w-full text-xs text-[#1A1615] placeholder-gray-400"
                    />
                  </div>
                  <button
                    type="button"
                    className="p-3 bg-white border border-gray-200 rounded-2xl text-gray-600 hover:text-black hover:border-gray-300 shadow-2xs cursor-pointer shrink-0"
                    title="Filters"
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                  </button>
                </div>

                {/* Primary Filter Pills (iPad Pro 12.9_ - 15) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'All (24)' },
                    { id: 'active', label: 'Active (18)' },
                    { id: 'pending', label: 'Pending (4)' },
                    { id: 'disabled', label: 'Suspended (2)' },
                    { id: 'managers', label: 'Branch Managers (6)' }
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setDirectoryFilter(f.id as any)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        directoryFilter === f.id
                          ? 'bg-[#1F1641] text-white shadow-xs'
                          : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>

                {/* Secondary Dropdown Filter Row (iPad Pro 12.9_ - 15) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
                  <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-300">
                    <span className="font-bold text-gray-700">All Branches</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-300">
                    <span className="font-bold text-gray-700">All Roles</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-300">
                    <span className="font-bold text-gray-700">Join Date</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-2xs cursor-pointer hover:border-gray-300">
                    <span className="font-bold text-gray-700">Status</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                </div>

                {/* 2-Column Grid of Staff Cards (iPad Pro 12.9_ - 15) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staffMembers
                    .filter((st) => {
                      const q = searchQuery.trim().toLowerCase();
                      const matchesQuery =
                        !q ||
                        st.name.toLowerCase().includes(q) ||
                        st.email.toLowerCase().includes(q) ||
                        st.phone.toLowerCase().includes(q) ||
                        st.employeeId.toLowerCase().includes(q) ||
                        st.role.toLowerCase().includes(q) ||
                        st.branch.toLowerCase().includes(q);
                      if (!matchesQuery) return false;
                      if (directoryFilter === 'active') return st.status === 'Active';
                      if (directoryFilter === 'pending') return st.status === 'Pending';
                      if (directoryFilter === 'disabled') return st.status === 'Disabled';
                      if (directoryFilter === 'managers') return st.role.toLowerCase().includes('manager');
                      return true;
                    })
                    .map((st) => (
                    <div
                      key={st.id}
                      onClick={() => setSelectedStaffId(st.id)}
                      className="bg-white rounded-3xl p-5 border border-[#F1EFEA] shadow-xs space-y-4 hover:border-purple-300 transition-all cursor-pointer"
                    >
                      {/* Top Row: Initials Avatar + Name + Phone + Role Badge + Last Active */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shadow-xs shrink-0 ${st.avatarBg}`}>
                            {st.initials}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-extrabold text-sm sm:text-base text-[#1A1615]">{st.name}</h3>
                              <span
                                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  st.role === 'Branch Manager'
                                    ? 'bg-amber-100/70 text-amber-800'
                                    : st.role === 'Marketing'
                                    ? 'bg-orange-100/70 text-orange-800'
                                    : st.role === 'Cashier'
                                    ? 'bg-slate-100 text-slate-700'
                                    : st.role === 'Store Staff'
                                    ? 'bg-lime-100/70 text-lime-800'
                                    : st.role === 'Administrator'
                                    ? 'bg-rose-100/70 text-rose-800'
                                    : st.role === 'Supervisor'
                                    ? 'bg-orange-100/70 text-orange-800'
                                    : 'bg-emerald-100/70 text-emerald-800'
                                }`}
                              >
                                {st.role}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 font-medium mt-0.5">{st.phone}</p>
                          </div>
                        </div>
                        <span className="text-[11px] text-gray-400 font-medium shrink-0">
                          Last active: {st.lastActive}
                        </span>
                      </div>

                      {/* Metrics 4 Columns: Shifts | Hours | Tasks | Branch */}
                      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-gray-100 text-left">
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Shifts</span>
                          <span className="text-sm sm:text-base font-extrabold text-[#1A1615] mt-0.5 block">{st.shifts}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Hours</span>
                          <span className="text-sm sm:text-base font-extrabold text-[#1A1615] mt-0.5 block">{st.hours} hrs</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Tasks</span>
                          <span className="text-sm sm:text-base font-extrabold text-[#1A1615] mt-0.5 block">{st.tasks}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Branch</span>
                          <span className="text-xs sm:text-sm font-extrabold text-[#1A1615] mt-0.5 block truncate">{st.branch}</span>
                        </div>
                      </div>

                      {/* Bottom Link: View Profile > */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStaffId(st.id);
                          }}
                          className="text-xs font-bold text-[#5844A8] hover:text-[#47368E] flex items-center gap-1 group cursor-pointer"
                        >
                          <span>View Profile</span>
                          <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 3: STATES (Matching iPad Pro 12.9_ - 87) */}
            {staffSubView === 'states' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548]">Staff by Location</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      Explore employee counts, assignments by state, city and branch.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setInsightsTabMode('operations');
                        setStaffSubView('insights');
                      }}
                      className="px-3.5 py-2 bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] rounded-xl hover:border-[#5844A8]/40 cursor-pointer shadow-2xs"
                    >
                      ← Back to Operations
                    </button>
                    <button
                      type="button"
                      onClick={() => setLocationSearchQuery('')}
                      className="px-3.5 py-2 bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <span>All Locations</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                    </button>
                  </div>
                </div>

                {/* 4 Tinted KPI Summary Cards (iPad Pro 12.9_ - 87) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-[#F5F1FF] p-3.5 sm:p-4 rounded-2xl border border-[#E9E0FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#5844A8] flex items-center justify-center shrink-0 shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">142</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Assigned Staff</div>
                    </div>
                  </div>
                  <div className="bg-[#FAF4FF] p-3.5 sm:p-4 rounded-2xl border border-[#EFE3FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">128</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Active Accounts</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF4F7] p-3.5 sm:p-4 rounded-2xl border border-[#FCE1E9] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#E11D48] flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">10</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Pending Invites</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF6EE] p-3.5 sm:p-4 rounded-2xl border border-[#FDE8D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#DC2626] flex items-center justify-center shrink-0 shadow-2xs">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">4</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Disabled</div>
                    </div>
                  </div>
                </div>

                {/* Search State Bar */}
                <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
                  <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                  <input
                    type="text"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    placeholder="Search state by name..."
                    className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                  />
                </div>

                {/* State Cards Grid (iPad Pro 12.9_ - 87) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-black text-[#1E1548] text-sm">Staff Distribution by State</span>
                    <span className="hidden sm:inline font-semibold text-[#8C84A0]">Click on a state to view cities &amp; branches</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { state: 'Uttar Pradesh', total: 48, active: 42, pending: 4, disabled: 2, mgr: 6, mgrPct: '12.5%', srv: 20, srvPct: '41.7%', kit: 14, kitPct: '29.2%', oth: 8, othPct: '16.6%' },
                      { state: 'Delhi', total: 28, active: 26, pending: 1, disabled: 1, mgr: 4, mgrPct: '14.3%', srv: 11, srvPct: '39.3%', kit: 8, kitPct: '28.6%', oth: 5, othPct: '17.8%' },
                      { state: 'Maharashtra', total: 34, active: 32, pending: 3, disabled: 1, mgr: 5, mgrPct: '14.7%', srv: 16, srvPct: '47.1%', kit: 9, kitPct: '26.5%', oth: 4, othPct: '11.7%' },
                      { state: 'Karnataka', total: 30, active: 28, pending: 2, disabled: 0, mgr: 4, mgrPct: '13.3%', srv: 14, srvPct: '46.7%', kit: 8, kitPct: '26.7%', oth: 4, othPct: '13.3%' },
                      { state: 'Tamil Nadu', total: 26, active: 24, pending: 1, disabled: 1, mgr: 3, mgrPct: '11.5%', srv: 12, srvPct: '46.2%', kit: 8, kitPct: '30.8%', oth: 3, othPct: '11.5%' },
                      { state: 'Gujarat', total: 22, active: 20, pending: 2, disabled: 0, mgr: 3, mgrPct: '13.6%', srv: 10, srvPct: '45.5%', kit: 6, kitPct: '27.3%', oth: 3, othPct: '13.6%' },
                      { state: 'Rajasthan', total: 18, active: 16, pending: 1, disabled: 1, mgr: 2, mgrPct: '11.1%', srv: 8, srvPct: '44.4%', kit: 5, kitPct: '27.8%', oth: 3, othPct: '16.7%' },
                      { state: 'West Bengal', total: 14, active: 12, pending: 1, disabled: 1, mgr: 2, mgrPct: '14.3%', srv: 6, srvPct: '42.9%', kit: 4, kitPct: '28.6%', oth: 2, othPct: '14.3%' }
                    ]
                      .filter((st) => st.state.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                      .map((st) => (
                        <div
                          key={st.state}
                          onClick={() => {
                            setSelectedState(st.state);
                            setLocationSearchQuery('');
                            setStaffSubView('cities');
                          }}
                          className="bg-white rounded-3xl p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-4"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="text-base font-black text-[#1E1548]">{st.state}</div>
                              <div className="text-xs text-[#8C84A0] font-semibold mt-0.5">{st.total} Assigned Staff</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8C84A0] mt-1" />
                          </div>

                          <div className="grid grid-cols-4 gap-2 text-center bg-[#FAF8FF] rounded-2xl py-2.5 px-2 border border-[#F2ECF9]">
                            <div>
                              <div className="text-sm font-black text-[#5844A8]">{st.total}</div>
                              <div className="text-[10px] font-semibold text-[#8C84A0]">Assigned</div>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#4F46E5]">{st.active}</div>
                              <div className="text-[10px] font-semibold text-[#8C84A0]">Active</div>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#E11D48]">{st.pending}</div>
                              <div className="text-[10px] font-semibold text-[#8C84A0]">Pending</div>
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#DC2626]">{st.disabled}</div>
                              <div className="text-[10px] font-semibold text-[#8C84A0]">Disabled</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-0.5">
                            {renderRoleDonut(
                              st.total,
                              [
                                { value: st.mgr, color: '#240B4C' },
                                { value: st.srv, color: '#8B5CF6' },
                                { value: st.kit, color: '#EC4899' },
                                { value: st.oth, color: '#F59E0B' },
                              ],
                              'md'
                            )}
                            <div className="flex-1 space-y-1.5 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#240B4C]" /> Manager</span>
                                <span className="font-black text-[#1E1548]">{st.mgr} <span className="font-semibold text-[#9890A8] ml-1">{st.mgrPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Service Staff</span>
                                <span className="font-black text-[#1E1548]">{st.srv} <span className="font-semibold text-[#9890A8] ml-1">{st.srvPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Kitchen Staff</span>
                                <span className="font-black text-[#1E1548]">{st.kit} <span className="font-semibold text-[#9890A8] ml-1">{st.kitPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Other</span>
                                <span className="font-black text-[#1E1548]">{st.oth} <span className="font-semibold text-[#9890A8] ml-1">{st.othPct}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}

            {/* SUB-VIEW 4: CITIES IN STATE (Matching iPad Pro 12.9_ - 86) */}
            {staffSubView === 'cities' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548]">Staff in {selectedState}</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      View staff details for the state and explore staff by branch.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setLocationSearchQuery('');
                      setStaffSubView('states');
                    }}
                    className="self-start sm:self-auto px-4 py-2 bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] rounded-full hover:border-[#5844A8]/40 flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <span>Change State</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                  </button>
                </div>

                {/* State Quick Switcher Pills (iPad Pro 12.9_ - 86) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {['Uttar Pradesh', 'Delhi', 'Maharashtra', 'Karnataka'].map((stName) => (
                    <button
                      key={stName}
                      type="button"
                      onClick={() => setSelectedState(stName)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedState === stName
                          ? 'bg-[#240B4C] text-white shadow-xs'
                          : 'bg-[#F3EFFA] text-[#5E5870] hover:bg-[#E9E0FB]'
                      }`}
                    >
                      {stName}
                    </button>
                  ))}
                </div>

                {/* 4 Tinted KPI Summary Cards (iPad Pro 12.9_ - 86) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-[#F5F1FF] p-3.5 sm:p-4 rounded-2xl border border-[#E9E0FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#5844A8] flex items-center justify-center shrink-0 shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">72</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Assigned Staff</div>
                    </div>
                  </div>
                  <div className="bg-[#FAF4FF] p-3.5 sm:p-4 rounded-2xl border border-[#EFE3FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">64</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Active Accounts</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF4F7] p-3.5 sm:p-4 rounded-2xl border border-[#FCE1E9] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#E11D48] flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">6</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Pending Invites</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF6EE] p-3.5 sm:p-4 rounded-2xl border border-[#FDE8D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#DC2626] flex items-center justify-center shrink-0 shadow-2xs">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">2</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Disabled</div>
                    </div>
                  </div>
                </div>

                {/* Search City Bar */}
                <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
                  <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                  <input
                    type="text"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    placeholder="Search city by name..."
                    className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                  />
                </div>

                {/* Cities Section Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#1E1548] text-sm">Cities in {selectedState}</span>
                  <span className="font-semibold text-[#8C84A0]">8 cities • 8 branches</span>
                </div>

                {/* 2-Column Grid of Rich City Cards with Donuts (iPad Pro 12.9_ - 86) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { city: 'Noida', assigned: 18, active: 16, pending: 1, disabled: 1, mgr: 3, mgrPct: '16.7%', srv: 7, srvPct: '38.9%', kit: 5, kitPct: '27.8%', oth: 3, othPct: '16.6%' },
                    { city: 'Lucknow', assigned: 14, active: 12, pending: 2, disabled: 0, mgr: 2, mgrPct: '14.3%', srv: 6, srvPct: '42.9%', kit: 4, kitPct: '28.6%', oth: 2, othPct: '14.2%' },
                    { city: 'Kanpur', assigned: 10, active: 9, pending: 1, disabled: 0, mgr: 1, mgrPct: '10.0%', srv: 4, srvPct: '40.0%', kit: 3, kitPct: '30.0%', oth: 2, othPct: '20.0%' },
                    { city: 'Varanasi', assigned: 6, active: 5, pending: 0, disabled: 1, mgr: 1, mgrPct: '16.7%', srv: 2, srvPct: '33.3%', kit: 2, kitPct: '33.3%', oth: 1, othPct: '16.7%' },
                    { city: 'Bareilly', assigned: 5, active: 5, pending: 0, disabled: 0, mgr: 1, mgrPct: '20.0%', srv: 2, srvPct: '40.0%', kit: 1, kitPct: '20.0%', oth: 1, othPct: '20.0%' },
                    { city: 'Greater Noida', assigned: 8, active: 7, pending: 1, disabled: 0, mgr: 1, mgrPct: '12.5%', srv: 4, srvPct: '50.0%', kit: 2, kitPct: '25.0%', oth: 1, othPct: '12.5%' },
                    { city: 'Ayodhya', assigned: 4, active: 4, pending: 0, disabled: 0, mgr: 1, mgrPct: '25.0%', srv: 2, srvPct: '50.0%', kit: 1, kitPct: '25.0%', oth: 0, othPct: '0.0%' },
                    { city: 'Agra', assigned: 7, active: 6, pending: 1, disabled: 0, mgr: 1, mgrPct: '14.3%', srv: 3, srvPct: '42.9%', kit: 2, kitPct: '28.6%', oth: 1, othPct: '14.3%' }
                  ]
                    .filter((ct) => ct.city.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                    .map((ct) => (
                      <div
                        key={ct.city}
                        onClick={() => {
                          setSelectedCity(ct.city);
                          setLocationSearchQuery('');
                          setStaffSubView('branches');
                        }}
                        className="bg-white rounded-3xl p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs hover:shadow-sm transition-all cursor-pointer space-y-4"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-base font-black text-[#1E1548]">{ct.city}</div>
                            <div className="text-xs text-[#8C84A0] font-semibold mt-0.5">{ct.assigned} Assigned Staff</div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-[#8C84A0] mt-1" />
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center py-2.5 border-y border-[#F2ECF9]">
                          <div>
                            <div className="text-sm font-black text-[#5844A8]">{ct.assigned}</div>
                            <div className="text-[10px] font-semibold text-[#8C84A0]">Assigned</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#4F46E5]">{ct.active}</div>
                            <div className="text-[10px] font-semibold text-[#8C84A0]">Active</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#E11D48]">{ct.pending}</div>
                            <div className="text-[10px] font-semibold text-[#8C84A0]">Pending</div>
                          </div>
                          <div>
                            <div className="text-sm font-black text-[#DC2626]">{ct.disabled}</div>
                            <div className="text-[10px] font-semibold text-[#8C84A0]">Disabled</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 pt-0.5">
                          {renderRoleDonut(
                            ct.assigned,
                            [
                              { value: ct.mgr, color: '#240B4C' },
                              { value: ct.srv, color: '#8B5CF6' },
                              { value: ct.kit, color: '#EC4899' },
                              { value: ct.oth, color: '#F59E0B' },
                            ],
                            'md'
                          )}
                          <div className="flex-1 space-y-1.5 text-[11px]">
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#240B4C]" /> Manager</span>
                              <span className="font-black text-[#1E1548]">{ct.mgr} <span className="font-semibold text-[#9890A8] ml-1">{ct.mgrPct}</span></span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Service Staff</span>
                              <span className="font-black text-[#1E1548]">{ct.srv} <span className="font-semibold text-[#9890A8] ml-1">{ct.srvPct}</span></span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Kitchen Staff</span>
                              <span className="font-black text-[#1E1548]">{ct.kit} <span className="font-semibold text-[#9890A8] ml-1">{ct.kitPct}</span></span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="flex items-center gap-1.5 font-semibold text-[#5E5870]"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Other</span>
                              <span className="font-black text-[#1E1548]">{ct.oth} <span className="font-semibold text-[#9890A8] ml-1">{ct.othPct}</span></span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 5: BRANCHES IN CITY (Matching iPad Pro 12.9_ - 88) */}
            {staffSubView === 'branches' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548]">Staff in {selectedCity}</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      {selectedState} &gt; {selectedCity} • 8 branches with assignments
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationSearchQuery('');
                        setStaffSubView('cities');
                      }}
                      className="px-3.5 py-2 bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] rounded-xl hover:border-[#5844A8]/40 cursor-pointer shadow-2xs"
                    >
                      ← All Cities
                    </button>
                    <button
                      type="button"
                      className="px-3.5 py-2 bg-white border border-[#EFEAF7] text-xs font-bold text-[#1E1548] rounded-full flex items-center gap-1.5 shadow-2xs"
                    >
                      <span>Last 30 Days</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                    </button>
                  </div>
                </div>

                {/* City Switcher Pills (iPad Pro 12.9_ - 88) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {['Noida', 'Lucknow', 'Kanpur', 'Varanasi'].map((cityName) => (
                    <button
                      key={cityName}
                      type="button"
                      onClick={() => setSelectedCity(cityName)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                        selectedCity === cityName
                          ? 'bg-[#240B4C] text-white shadow-xs'
                          : 'bg-[#F3EFFA] text-[#5E5870] hover:bg-[#E9E0FB]'
                      }`}
                    >
                      {cityName}
                    </button>
                  ))}
                </div>

                {/* 4 Tinted KPI Summary Cards (iPad Pro 12.9_ - 88) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-[#F5F1FF] p-3.5 sm:p-4 rounded-2xl border border-[#E9E0FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#5844A8] flex items-center justify-center shrink-0 shadow-2xs">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">18</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Assigned Staff</div>
                    </div>
                  </div>
                  <div className="bg-[#FAF4FF] p-3.5 sm:p-4 rounded-2xl border border-[#EFE3FB] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#7C3AED] flex items-center justify-center shrink-0 shadow-2xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">16</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Active Accounts</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF4F7] p-3.5 sm:p-4 rounded-2xl border border-[#FCE1E9] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#E11D48] flex items-center justify-center shrink-0 shadow-2xs">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">1</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Pending Invites</div>
                    </div>
                  </div>
                  <div className="bg-[#FFF6EE] p-3.5 sm:p-4 rounded-2xl border border-[#FDE8D5] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/80 text-[#DC2626] flex items-center justify-center shrink-0 shadow-2xs">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-lg sm:text-xl font-black text-[#1E1548] leading-none">1</div>
                      <div className="text-[11px] font-semibold text-[#6B657E] mt-1">Disabled</div>
                    </div>
                  </div>
                </div>

                {/* Search Branch Bar */}
                <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
                  <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                  <input
                    type="text"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    placeholder="Search a branch by name..."
                    className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                  />
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#1E1548] text-sm">Branches in {selectedCity}</span>
                  <span className="hidden sm:inline font-semibold text-[#8C84A0]">Select a branch to view staff details</span>
                </div>

                {/* Full-Width Branch Cards with Donuts & Role Chips (iPad Pro 12.9_ - 88) */}
                <div className="space-y-4">
                  {[
                    {
                      branch: 'Sector 18',
                      title: `${selectedCity} — Sector 18`,
                      tag: 'Home Appliances • Modern electronics',
                      assigned: 8,
                      active: 7,
                      pending: 1,
                      disabled: 0,
                      status: 'Active',
                      mgr: 1, mgrPct: '12.5%',
                      srv: 3, srvPct: '37.5%',
                      kit: 3, kitPct: '37.5%',
                      oth: 1, othPct: '12.5%'
                    },
                    {
                      branch: 'Sector 62',
                      title: `${selectedCity} — Sector 62`,
                      tag: 'Lifestyle & Fashion • Fashion & accessories',
                      assigned: 6,
                      active: 6,
                      pending: 0,
                      disabled: 0,
                      status: 'Active',
                      mgr: 1, mgrPct: '16.7%',
                      srv: 2, srvPct: '33.3%',
                      kit: 2, kitPct: '33.3%',
                      oth: 1, othPct: '16.7%'
                    },
                    {
                      branch: 'Expressway',
                      title: `${selectedCity} — Expressway`,
                      tag: 'Home & Living • Furnishings, decor & gadgets',
                      assigned: 4,
                      active: 3,
                      pending: 0,
                      disabled: 1,
                      status: 'Disabled',
                      mgr: 0, mgrPct: '0.0%',
                      srv: 2, srvPct: '50.0%',
                      kit: 1, kitPct: '25.0%',
                      oth: 1, othPct: '25.0%'
                    },
                    {
                      branch: 'Mall of India',
                      title: `${selectedCity} — Mall of India`,
                      tag: 'Fashion & Lifestyle • Flagship megastore',
                      assigned: 7,
                      active: 7,
                      pending: 0,
                      disabled: 0,
                      status: 'Active',
                      mgr: 1, mgrPct: '14.3%',
                      srv: 3, srvPct: '42.9%',
                      kit: 2, kitPct: '28.6%',
                      oth: 1, othPct: '14.3%'
                    }
                  ]
                    .filter((br) => br.title.toLowerCase().includes(locationSearchQuery.toLowerCase()))
                    .map((br) => (
                      <div
                        key={br.title}
                        className="bg-white rounded-3xl p-5 border border-[#DFD4F7] hover:border-[#5844A8] shadow-2xs transition-all space-y-4"
                      >
                        {/* Top Row: Pin Icon + Title + Status Pill */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#F5F1FF] text-[#7C3AED] flex items-center justify-center shrink-0">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-sm sm:text-base font-black text-[#1E1548]">{br.title}</div>
                              <div className="text-xs text-[#8C84A0] font-medium mt-0.5">{br.tag}</div>
                            </div>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${
                              br.status === 'Active'
                                ? 'bg-[#F3EEFF] text-[#6D28D9]'
                                : 'bg-[#FFF1F2] text-[#E11D48]'
                            }`}
                          >
                            ✦ {br.status}
                          </span>
                        </div>

                        {/* Middle Row: 4 Counts Left + Donut & Role Legend Right */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1">
                          <div className="grid grid-cols-4 gap-4 sm:gap-7">
                            <div>
                              <div className="text-base font-black text-[#1E1548]">{br.assigned}</div>
                              <div className="text-[11px] font-medium text-[#8C84A0]">Assigned</div>
                            </div>
                            <div>
                              <div className="text-base font-black text-[#1E1548]">{br.active}</div>
                              <div className="text-[11px] font-medium text-[#8C84A0]">Active</div>
                            </div>
                            <div>
                              <div className="text-base font-black text-[#1E1548]">{br.pending}</div>
                              <div className="text-[11px] font-medium text-[#8C84A0]">Pending</div>
                            </div>
                            <div>
                              <div className="text-base font-black text-[#1E1548]">{br.disabled}</div>
                              <div className="text-[11px] font-medium text-[#8C84A0]">Disabled</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            {renderRoleDonut(
                              br.assigned,
                              [
                                { value: br.mgr, color: '#240B4C' },
                                { value: br.srv, color: '#8B5CF6' },
                                { value: br.kit, color: '#EC4899' },
                                { value: br.oth, color: '#F59E0B' },
                              ],
                              'sm'
                            )}
                            <div className="space-y-1 text-[11px] min-w-[165px]">
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-[#5E5870] font-medium"><span className="w-2 h-2 rounded-full bg-[#240B4C]" /> Manager</span>
                                <span className="font-black text-[#1E1548]">{br.mgr} <span className="font-medium text-[#9890A8] ml-1">{br.mgrPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-[#5E5870] font-medium"><span className="w-2 h-2 rounded-full bg-[#8B5CF6]" /> Service Staff</span>
                                <span className="font-black text-[#1E1548]">{br.srv} <span className="font-medium text-[#9890A8] ml-1">{br.srvPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-[#5E5870] font-medium"><span className="w-2 h-2 rounded-full bg-[#EC4899]" /> Kitchen Staff</span>
                                <span className="font-black text-[#1E1548]">{br.kit} <span className="font-medium text-[#9890A8] ml-1">{br.kitPct}</span></span>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <span className="flex items-center gap-1.5 text-[#5E5870] font-medium"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> Other</span>
                                <span className="font-black text-[#1E1548]">{br.oth} <span className="font-medium text-[#9890A8] ml-1">{br.othPct}</span></span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Row: Role Chips + View Staff CTA */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F3EFFB]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-1 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[10px] font-bold text-[#1E1548]">● Store Manager</span>
                            <span className="px-2.5 py-1 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[10px] font-bold text-[#5E5870]"><span className="text-[#8B5CF6]">●</span> Service Staff</span>
                            <span className="px-2.5 py-1 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[10px] font-bold text-[#5E5870]"><span className="text-[#EC4899]">●</span> Kitchen Staff</span>
                            <span className="px-2.5 py-1 rounded-full bg-[#FAF8FF] border border-[#EFEAF7] text-[10px] font-bold text-[#5E5870]"><span className="text-[#6366F1]">●</span> Support Staff</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedBranch(br.branch);
                              setLocationSearchQuery('');
                              setBranchStaffFilter('all');
                              setStaffSubView('branch_staff');
                            }}
                            className="px-5 py-2 bg-[#240B4C] hover:bg-[#36126E] text-white rounded-full text-xs font-bold cursor-pointer transition shadow-xs shrink-0"
                          >
                            View Staff ↗
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUB-VIEW 6: STAFF DIRECTORY BY LOCATION / BRANCH STAFF (Matching iPad Pro 12.9_ - 89) */}
            {staffSubView === 'branch_staff' && (
              <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548]">Staff Directory</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      By Location • {selectedState} / {selectedCity} / {selectedBranch}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddStaffOpen(true);
                      setAddStaffStep(1);
                    }}
                    className="self-start sm:self-auto px-4 py-2.5 bg-[#240B4C] hover:bg-[#36126E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm cursor-pointer transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Invite Staff</span>
                  </button>
                </div>

                {/* Full-Width Segmented Switcher: All Staff vs By Location (iPad Pro 12.9_ - 89) */}
                <div className="grid grid-cols-2 p-1 bg-[#F1EDF9] rounded-2xl border border-[#E7DFF5]">
                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryMode('all');
                      setStaffSubView('directory');
                    }}
                    className="py-2.5 rounded-xl text-xs font-bold text-[#5E5870] hover:text-[#1E1548] transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>○</span>
                    <span>All Staff</span>
                  </button>
                  <button
                    type="button"
                    className="py-2.5 rounded-xl text-xs font-bold bg-[#240B4C] text-white shadow-xs transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>✦</span>
                    <span>By Location</span>
                  </button>
                </div>

                {/* Removable Location Filter Chips Row (iPad Pro 12.9_ - 89) */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLocationSearchQuery('');
                        setStaffSubView('states');
                      }}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E6DFF4] text-xs font-semibold text-[#1E1548] flex items-center gap-2 hover:border-[#5844A8] cursor-pointer"
                    >
                      <span>{selectedState}</span>
                      <X className="w-3 h-3 text-[#8C84A0]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationSearchQuery('');
                        setStaffSubView('cities');
                      }}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E6DFF4] text-xs font-semibold text-[#1E1548] flex items-center gap-2 hover:border-[#5844A8] cursor-pointer"
                    >
                      <span>{selectedCity}</span>
                      <X className="w-3 h-3 text-[#8C84A0]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLocationSearchQuery('');
                        setStaffSubView('branches');
                      }}
                      className="px-3 py-1.5 rounded-full bg-white border border-[#E6DFF4] text-xs font-semibold text-[#1E1548] flex items-center gap-2 hover:border-[#5844A8] cursor-pointer"
                    >
                      <span>{selectedBranch}</span>
                      <X className="w-3 h-3 text-[#8C84A0]" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDirectoryMode('all');
                      setStaffSubView('directory');
                    }}
                    className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                  >
                    Clear location filters
                  </button>
                </div>

                {/* Search Branch Staff Bar */}
                <div className="bg-white border border-[#EFEAF7] rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs">
                  <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                  <input
                    type="text"
                    value={locationSearchQuery}
                    onChange={(e) => setLocationSearchQuery(e.target.value)}
                    placeholder={`Search ${selectedBranch} staff by name, role or employee ID...`}
                    className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                  />
                </div>

                {/* Status & Role Filter Pills Row (iPad Pro 12.9_ - 89) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  <button
                    type="button"
                    onClick={() => setBranchStaffFilter('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                      branchStaffFilter === 'all'
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'bg-white border border-[#EFEAF7] text-[#5E5870] hover:border-[#5844A8]/40'
                    }`}
                  >
                    All (8)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBranchStaffFilter('active')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                      branchStaffFilter === 'active'
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'bg-white border border-[#EFEAF7] text-[#5E5870] hover:border-[#5844A8]/40'
                    }`}
                  >
                    Active (7)
                  </button>
                  <button
                    type="button"
                    onClick={() => setBranchStaffFilter('invited')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition ${
                      branchStaffFilter === 'invited'
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'bg-white border border-[#EFEAF7] text-[#5E5870] hover:border-[#5844A8]/40'
                    }`}
                  >
                    Invited (1)
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#EFEAF7] text-xs font-semibold text-[#5E5870] flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>All Roles</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-full bg-white border border-[#EFEAF7] text-xs font-semibold text-[#5E5870] flex items-center gap-1 whitespace-nowrap"
                  >
                    <span>Branch Access</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                  </button>
                </div>

                {/* Section Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-[#1E1548] text-sm">{selectedBranch} — Staff</span>
                  <span className="font-semibold text-[#8C84A0]">Showing example records from 8 assigned staff</span>
                </div>

                {/* 2-Column Grid of Location Staff Cards (Matching iPad Pro 12.9_ - 89) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'st-1', initials: 'RS', name: 'Rohan Singh', title: 'Senior Waiter', status: 'Active', category: 'Service Staff' },
                    { id: 'st-2', initials: 'AK', name: 'Amit Kumar', title: 'Team Lead', status: 'Active', category: 'Supervisor' },
                    { id: 'st-6', initials: 'NK', name: 'Neha Kapoor', title: 'Service Staff', status: 'Pending', category: 'Invited' },
                    { id: 'st-5', initials: 'KS', name: 'Karan Singh', title: 'Kitchen Staff', status: 'Active', category: 'Kitchen Staff' },
                    { id: 'st-3', initials: 'RV', name: 'Rahul Verma', title: 'Cashier', status: 'Active', category: 'Service Staff' },
                    { id: 'st-4', initials: 'SI', name: 'Sneha Iyer', title: 'Store Staff', status: 'Active', category: 'Supervisor' },
                    { id: 'st-7', initials: 'AP', name: 'Arjun Patel', title: 'Kitchen Staff', status: 'Active', category: 'Kitchen Staff' },
                    { id: 'st-8', initials: 'MK', name: 'Meera Kapoor', title: 'Cashier', status: 'Active', category: 'Service Staff' }
                  ]
                    .filter((m) => {
                      const matchesFilter =
                        branchStaffFilter === 'all' ||
                        (branchStaffFilter === 'active' && m.status === 'Active') ||
                        (branchStaffFilter === 'invited' && m.status === 'Pending');
                      const matchesSearch =
                        m.name.toLowerCase().includes(locationSearchQuery.toLowerCase()) ||
                        m.title.toLowerCase().includes(locationSearchQuery.toLowerCase());
                      return matchesFilter && matchesSearch;
                    })
                    .map((st, idx) => (
                      <div
                        key={`${st.id}-${idx}`}
                        onClick={() => setSelectedStaffId(st.id)}
                        className="bg-white rounded-3xl p-5 border border-[#EFEAF7] hover:border-[#5844A8]/50 shadow-2xs transition-all cursor-pointer space-y-4"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#F2ECFF] text-[#5844A8] flex items-center justify-center font-bold text-xs shrink-0">
                              {st.initials}
                            </div>
                            <div>
                              <div className="text-sm font-black text-[#1E1548]">{st.name}</div>
                              <div className="text-xs text-[#8C84A0] font-medium">{st.title}</div>
                            </div>
                          </div>
                          <span
                            className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              st.status === 'Active'
                                ? 'bg-[#ECFDF5] text-[#059669]'
                                : 'bg-[#FEF3C7] text-[#D97706]'
                            }`}
                          >
                            {st.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div>
                            <div className="text-[10px] font-semibold text-[#9890A8]">Assigned location</div>
                            <div className="font-bold text-[#1E1548] mt-0.5">{selectedBranch}</div>
                          </div>
                          <div>
                            <div className="text-[10px] font-semibold text-[#9890A8]">Account / invite</div>
                            <div className="font-bold text-[#1E1548] mt-0.5">{st.status}</div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-[#F3EFFB] flex items-center justify-between text-xs">
                          <span className="font-semibold text-[#7B748C]">{st.category}</span>
                          <span className="font-bold text-[#1E1548] hover:text-[#5844A8] transition">View Profile →</span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Bottom Reuse Info Banner (iPad Pro 12.9_ - 89) */}
                <div className="bg-[#FAF8FF] rounded-2xl p-4 border border-[#EAE2FB] space-y-1">
                  <div className="text-xs font-bold text-[#1E1548]">Staff Profile and permissions are reused</div>
                  <p className="text-[11px] text-[#7B748C]">
                    View Profile opens the existing staff record. Edit Role, Branch Assignments and access permissions remain in the original management flows.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: ROLES & PERMISSIONS (iPad Pro 12.9_ - 34)          */}
        {/* ======================================================== */}
        {currentTab === 'permissions' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (() => {
          const totalRolesCount = rolesList.length;
          const customRolesCount = rolesList.filter((r) => r.category === 'Custom').length;
          const branchLimitedCount = rolesList.filter((r) => r.branchLimited).length;
          const activeStaffAccessCount = rolesList.reduce((sum, r) => sum + r.staffCount, 0);

          const filteredRoles = rolesList.filter((r) => {
            const q = roleSearchQuery.trim().toLowerCase();
            const matchesSearch =
              !q ||
              r.name.toLowerCase().includes(q) ||
              r.desc.toLowerCase().includes(q) ||
              r.category.toLowerCase().includes(q);
            if (!matchesSearch) return false;
            if (roleFilter === 'system') return r.category === 'System';
            if (roleFilter === 'custom') return r.category === 'Custom';
            if (roleFilter === 'branch') return r.branchLimited;
            return true;
          });

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Roles &amp; Permissions</h1>
                  <p className="text-xs text-[#7B748C] mt-0.5">
                    Manage staff access to Loyaltics and control what they can do in the system.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => triggerToast('Roles & permissions matrix exported (CSV)')}
                    className="px-4 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#5844A8]" />
                    <span>Export</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => openAddRoleWizard()}
                    className="px-4 sm:px-5 py-2 bg-[#4C1D95] hover:bg-[#3B1478] text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/15 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Role</span>
                  </button>
                </div>
              </div>

              {/* 4 KPI Stat Cards — Horizontal Icon + Count Layout (iPad Pro 12.9_ - 34) */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-[#1E1548] leading-none">{totalRolesCount}</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1 truncate">Total Roles</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-[#1E1548] leading-none">{activeStaffAccessCount}</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1 truncate">Active Staff with Access</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Edit2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-[#1E1548] leading-none">{customRolesCount}</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1 truncate">Custom Roles</div>
                  </div>
                </div>

                <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xl font-black text-[#1E1548] leading-none">{branchLimitedCount}</div>
                    <div className="text-[11px] font-semibold text-[#7B748C] mt-1 truncate">Branch-Limited Roles</div>
                  </div>
                </div>
              </div>

              {/* Search Bar + Filter Pills (iPad Pro 12.9_ - 34) */}
              <div className="space-y-3">
                <div className="bg-white border border-[#EFEAF7] focus-within:border-[#5844A8]/50 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs transition-colors">
                  <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                  <input
                    type="text"
                    value={roleSearchQuery}
                    onChange={(e) => setRoleSearchQuery(e.target.value)}
                    placeholder="Search roles, description or keywords..."
                    className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                  />
                  {roleSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setRoleSearchQuery('')}
                      className="text-[#8C84A0] hover:text-[#1E1548] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                  {[
                    { id: 'all' as const, label: 'All' },
                    { id: 'system' as const, label: 'System Roles' },
                    { id: 'custom' as const, label: 'Custom Roles' },
                    { id: 'branch' as const, label: 'Branch-based' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRoleFilter(tab.id)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                        roleFilter === tab.id
                          ? 'bg-[#4C1D95] text-white shadow-xs'
                          : 'bg-white border border-[#E5DEF5] text-[#5E5870] hover:border-[#5844A8]/40'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2-Column Role Cards Grid (iPad Pro 12.9_ - 34) */}
              {filteredRoles.length === 0 ? (
                <div className="bg-white rounded-3xl p-8 border border-[#EFEAF7] text-center space-y-2">
                  <div className="text-sm font-black text-[#1E1548]">No roles match your filter</div>
                  <p className="text-xs text-[#8C84A0]">Try clearing the search query or create a new custom role.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRoles.map((r) => (
                    <div
                      key={r.id}
                      onClick={() => openAddRoleWizard(r)}
                      className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] hover:border-[#5844A8]/50 shadow-2xs hover:shadow-sm transition-all cursor-pointer flex flex-col justify-between gap-3.5"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${r.badgeBg}`}
                            >
                              {r.initials}
                            </div>
                            <span className="text-sm sm:text-[15px] font-black text-[#1E1548] truncate">{r.name}</span>
                          </div>
                          <span
                            className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full shrink-0 tracking-wide ${
                              r.category === 'System'
                                ? 'bg-[#EFF6FF] text-[#2563EB]'
                                : 'bg-[#F5F3FF] text-[#7C3AED]'
                            }`}
                          >
                            {r.category === 'System' ? 'SYSTEM ROLE' : 'CUSTOM ROLE'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B657E] leading-relaxed">{r.desc}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-[#F4F0FA] text-xs">
                        <div className="flex items-center gap-3.5 text-[#7B748C] font-semibold">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#8C84A0]" />
                            {r.staffCount} staff
                          </span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8C84A0]" />
                            {r.permCount} permissions
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openAddRoleWizard(r);
                          }}
                          className="text-[#4C1D95] hover:text-[#240B4C] font-black flex items-center gap-0.5 cursor-pointer"
                        >
                          <span>View / Edit</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Bottom Card: Recent Role Updates (iPad Pro 12.9_ - 34) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Recent Role Updates</h3>
                  <button
                    type="button"
                    onClick={() => setCurrentTab('activity')}
                    className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>View All</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="divide-y divide-[#F4F0FA]">
                  {recentRoleUpdates.map((upd, idx) => (
                    <div key={idx} className="py-3 first:pt-1 last:pb-1 flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${upd.iconBg}`}>
                        {upd.type === 'create' ? (
                          <Plus className="w-4 h-4" />
                        ) : upd.type === 'perm' ? (
                          <Key className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{upd.title}</div>
                        <div className="text-[11px] font-semibold text-[#8C84A0] mt-0.5">{upd.meta}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* TAB 3: ACTIVITY LOG & AUDIT TRAIL (iPad Pro 12.9_ - 38 & 39) */}
        {/* ======================================================== */}
        {currentTab === 'activity' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (() => {
          const activityEntries = [
            {
              id: 'act-1',
              staffId: 'st-1',
              name: 'Aarav Sharma',
              initials: 'AS',
              avatarBg: 'bg-purple-100 text-[#5844A8]',
              role: 'Branch Manager',
              empId: 'EMP001',
              email: 'aarav.sharma@thecoffeeclub.com',
              branch: 'Main Branch',
              time: 'Today, 10:24 AM',
              date: '23 Apr 2024',
              module: 'Campaigns',
              modCls: 'bg-rose-50 text-rose-600',
              modIcon: Megaphone,
              eventTitle: 'Campaign Activated',
              eventSub: 'A staff member activated a campaign in the system.',
              action: 'Activated Summer Rewards campaign',
              desc: "Started 'Summer Rewards' campaign across Main Branch.",
              affectedItem: 'Summer Rewards',
              affectedCode: 'Campaign ID: CAMP1032',
              device: 'Web Application',
              deviceSub: 'Chrome on macOS',
              ip: '192.168.1.124',
              impact: 'High' as const,
              outcome: 'Success',
              changeNote: 'Campaign status changed from Draft to Active.',
              before: [
                { label: 'Status', value: 'Draft' },
                { label: 'Start Date', value: 'Not set' },
                { label: 'Audience', value: 'Not configured' }
              ],
              after: [
                { label: 'Status', value: 'Active', isPill: true },
                { label: 'Start Date', value: '23 Apr 2024' },
                { label: 'Audience', value: 'All Customers' }
              ]
            },
            {
              id: 'act-2',
              staffId: 'st-2',
              name: 'Priya Mehta',
              initials: 'PM',
              avatarBg: 'bg-blue-100 text-blue-700',
              role: 'Marketing Executive',
              empId: 'EMP002',
              email: 'priya.mehta@thecoffeeclub.com',
              branch: 'City Mall',
              time: 'Today, 09:15 AM',
              date: '23 Apr 2024',
              module: 'Rewards',
              modCls: 'bg-emerald-50 text-emerald-700',
              modIcon: Gift,
              eventTitle: 'Reward Claim Approved',
              eventSub: 'A loyalty redemption request was verified and approved.',
              action: 'Approved reward claim #CUST2847',
              desc: 'Approved 200 points redemption for customer.',
              affectedItem: 'Claim #CUST2847',
              affectedCode: 'Reward: Free Cappuccino',
              device: 'Merchant iPad POS',
              deviceSub: 'iPadOS 17 • App v4.2',
              ip: '192.168.1.142',
              impact: 'Success' as const,
              outcome: 'Success',
              changeNote: 'Reward redemption status changed from Pending to Approved.',
              before: [
                { label: 'Claim Status', value: 'Pending Review' },
                { label: 'Points Balance', value: '840 pts' },
                { label: 'Verified By', value: 'Unassigned' }
              ],
              after: [
                { label: 'Claim Status', value: 'Approved', isPill: true },
                { label: 'Points Balance', value: '640 pts' },
                { label: 'Verified By', value: 'Priya Mehta' }
              ]
            },
            {
              id: 'act-3',
              staffId: 'st-3',
              name: 'Rahul Verma',
              initials: 'RV',
              avatarBg: 'bg-emerald-100 text-emerald-700',
              role: 'Cashier',
              empId: 'EMP003',
              email: 'rahul.verma@thecoffeeclub.com',
              branch: 'Riverside',
              time: 'Today, 08:42 AM',
              date: '23 Apr 2024',
              module: 'QR Codes',
              modCls: 'bg-purple-50 text-purple-700',
              modIcon: QrCode,
              eventTitle: 'QR Code Batch Generated',
              eventSub: 'New tabletop and counter QR stands were created.',
              action: 'Generated QR codes for Main Branch',
              desc: 'Created 50 new QR codes for Main Branch.',
              affectedItem: 'Tabletop Pack #QR-18',
              affectedCode: 'Batch ID: QRB-2024-50',
              device: 'Web Application',
              deviceSub: 'Chrome on Windows',
              ip: '192.168.1.108',
              impact: 'Normal' as const,
              outcome: 'Success',
              changeNote: 'Active QR stand inventory increased from 18 to 68.',
              before: [
                { label: 'Active Stands', value: '18 stands' },
                { label: 'Routing', value: 'Default Menu' },
                { label: 'Print Pack', value: 'Not exported' }
              ],
              after: [
                { label: 'Active Stands', value: '68 stands', isPill: true },
                { label: 'Routing', value: 'Loyalty + Menu' },
                { label: 'Print Pack', value: 'PDF Ready' }
              ]
            },
            {
              id: 'act-4',
              staffId: 'st-4',
              name: 'Sneha Iyer',
              initials: 'SI',
              avatarBg: 'bg-lime-100 text-lime-800',
              role: 'Store Staff',
              empId: 'EMP004',
              email: 'sneha.iyer@thecoffeeclub.com',
              branch: 'Main Branch',
              time: 'Today, 04:30 PM',
              date: '22 Apr 2024',
              module: 'Customers',
              modCls: 'bg-sky-50 text-sky-700',
              modIcon: Users,
              eventTitle: 'Customer Tier Upgraded',
              eventSub: 'Member loyalty tier was elevated based on spend threshold.',
              action: 'Updated customer tier to Gold',
              desc: 'Changed customer tier from Silver to Gold.',
              affectedItem: 'Ananya Verma',
              affectedCode: 'Member ID: CUST-8812',
              device: 'Web Application',
              deviceSub: 'Safari on iPad',
              ip: '192.168.1.119',
              impact: 'Normal' as const,
              outcome: 'Success',
              changeNote: 'Customer membership tier updated from Silver to Gold.',
              before: [
                { label: 'Tier', value: 'Silver' },
                { label: 'Multiplier', value: '1.0x Points' },
                { label: 'Free Perks', value: '2 / month' }
              ],
              after: [
                { label: 'Tier', value: 'Gold', isPill: true },
                { label: 'Multiplier', value: '1.5x Points' },
                { label: 'Free Perks', value: '5 / month' }
              ]
            },
            {
              id: 'act-5',
              staffId: 'st-5',
              name: 'Karan Malhotra',
              initials: 'KM',
              avatarBg: 'bg-amber-100 text-amber-800',
              role: 'Administrator',
              empId: 'EMP005',
              email: 'karan.m@thecoffeeclub.com',
              branch: 'City Mall',
              time: 'Today, 01:20 PM',
              date: '22 Apr 2024',
              module: 'Menu',
              modCls: 'bg-amber-50 text-amber-800',
              modIcon: Coffee,
              eventTitle: 'Redemption Rule Modified',
              eventSub: 'Points-to-menu item redemption threshold was adjusted.',
              action: 'Changed redemption rule',
              desc: 'Updated points redemption rule from 100 to 150 points.',
              affectedItem: 'Artisan Coffee Tier',
              affectedCode: 'Rule ID: RED-409',
              device: 'Web Application',
              deviceSub: 'Chrome on macOS',
              ip: '192.168.1.92',
              impact: 'Medium' as const,
              outcome: 'Success',
              changeNote: 'Redemption threshold updated from 100 pts to 150 pts.',
              before: [
                { label: 'Points Required', value: '100 pts' },
                { label: 'Eligible Outlets', value: 'Main Branch' },
                { label: 'Auto-Approve', value: 'Disabled' }
              ],
              after: [
                { label: 'Points Required', value: '150 pts', isPill: true },
                { label: 'Eligible Outlets', value: 'All Branches' },
                { label: 'Auto-Approve', value: 'Enabled' }
              ]
            },
            {
              id: 'act-6',
              staffId: 'st-6',
              name: 'Neha Taneja',
              initials: 'NT',
              avatarBg: 'bg-purple-100 text-purple-700',
              role: 'Supervisor',
              empId: 'EMP006',
              email: 'neha.t@thecoffeeclub.com',
              branch: 'Riverside',
              time: 'Today, 11:05 AM',
              date: '21 Apr 2024',
              module: 'Branches',
              modCls: 'bg-purple-50 text-[#5844A8]',
              modIcon: Building2,
              eventTitle: 'Branch Settings Updated',
              eventSub: 'Store operating hours were modified for weekend service.',
              action: 'Edited branch settings',
              desc: 'Updated operating hours for Riverside Branch.',
              affectedItem: 'Riverside Branch',
              affectedCode: 'Branch ID: BR-003',
              device: 'Web Application',
              deviceSub: 'Edge on Windows',
              ip: '192.168.1.133',
              impact: 'Normal' as const,
              outcome: 'Success',
              changeNote: 'Weekend closing hours extended by 1 hour.',
              before: [
                { label: 'Closing Time', value: '10:30 PM' },
                { label: 'Last Order', value: '10:00 PM' },
                { label: 'Walk-in Queue', value: 'Standard' }
              ],
              after: [
                { label: 'Closing Time', value: '11:30 PM', isPill: true },
                { label: 'Last Order', value: '11:00 PM' },
                { label: 'Walk-in Queue', value: 'Extended' }
              ]
            },
            {
              id: 'act-7',
              staffId: 'st-7',
              name: 'Aditya Roy',
              initials: 'AR',
              avatarBg: 'bg-orange-100 text-orange-700',
              role: 'Data Analyst',
              empId: 'EMP007',
              email: 'aditya.roy@thecoffeeclub.com',
              branch: 'Main Branch',
              time: 'Today, 09:18 AM',
              date: '21 Apr 2024',
              module: 'Reports',
              modCls: 'bg-blue-50 text-blue-700',
              modIcon: BarChart2,
              eventTitle: 'Customer Report Exported',
              eventSub: 'Monthly customer engagement analytics file was downloaded.',
              action: 'Downloaded customer report',
              desc: 'Downloaded customer engagement report (Apr 2024).',
              affectedItem: 'Engagement Summary',
              affectedCode: 'Report ID: REP-2024-04',
              device: 'Web Application',
              deviceSub: 'Chrome on macOS',
              ip: '192.168.1.155',
              impact: 'Normal' as const,
              outcome: 'Success',
              changeNote: 'Exported 2,482 member engagement rows in CSV format.',
              before: [
                { label: 'Last Export', value: '14 Apr 2024' },
                { label: 'Format', value: 'PDF' },
                { label: 'Scope', value: 'Main Branch' }
              ],
              after: [
                { label: 'Last Export', value: '21 Apr 2024', isPill: true },
                { label: 'Format', value: 'CSV' },
                { label: 'Scope', value: 'All Branches' }
              ]
            }
          ];

          const filteredActivities = activityEntries
            .filter((item) => {
              const q = activitySearch.trim().toLowerCase();
              const matchesQ =
                !q ||
                item.name.toLowerCase().includes(q) ||
                item.action.toLowerCase().includes(q) ||
                item.desc.toLowerCase().includes(q) ||
                item.module.toLowerCase().includes(q) ||
                item.branch.toLowerCase().includes(q);
              const matchesBranch = activityBranchFilter === 'All Branches' || item.branch === activityBranchFilter;
              const matchesModule = activityModuleFilter === 'All Modules' || item.module === activityModuleFilter;
              const matchesRole = activityRoleFilter === 'All Roles' || item.role === activityRoleFilter;
              const matchesType =
                activityTypeFilter === 'All Activity Types' ||
                (activityTypeFilter === 'High Impact' && item.impact === 'High') ||
                (activityTypeFilter === 'Approvals' && item.module === 'Rewards') ||
                (activityTypeFilter === 'Configuration' && (item.module === 'Branches' || item.module === 'Menu'));
              return matchesQ && matchesBranch && matchesModule && matchesRole && matchesType;
            })
            .sort((a, b) => (activitySortOrder === 'latest' ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)));

          const activeEvent = activityEntries.find((a) => a.id === selectedActivityId) || activityEntries[0];

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {activitySubView === 'list' ? (
                /* ================================================= */
                /* ACTIVITY LOG LIST (iPad Pro 12.9_ - 38)           */
                /* ================================================= */
                <div className="space-y-4 sm:space-y-5">
                  {/* Header */}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Staff Activity Log</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      Track software actions performed by your team across all branches.
                    </p>
                  </div>

                  {/* Search + Export Row */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex-1 bg-white border border-[#EFEAF7] focus-within:border-[#5844A8]/50 rounded-2xl px-4 py-2.5 sm:py-3 flex items-center gap-2.5 shadow-2xs transition-colors">
                      <Search className="w-4 h-4 text-[#8C84A0] shrink-0" />
                      <input
                        type="text"
                        value={activitySearch}
                        onChange={(e) => setActivitySearch(e.target.value)}
                        placeholder="Search staff, actions, modules, or keywords..."
                        className="bg-transparent outline-none w-full text-xs text-[#1E1548] placeholder:text-[#9890A8] font-medium"
                      />
                      {activitySearch && (
                        <button
                          type="button"
                          onClick={() => setActivitySearch('')}
                          className="text-[#8C84A0] hover:text-[#1E1548] cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => triggerToast('Staff Activity Log exported (CSV)')}
                      className="px-4 sm:px-5 py-2.5 sm:py-3 bg-[#4C1D95] hover:bg-[#3B1478] text-white rounded-2xl text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-900/15 cursor-pointer shrink-0 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span>Export</span>
                    </button>
                  </div>

                  {/* 5 Filter Dropdown Pills Row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {[
                      {
                        val: activityDateFilter,
                        set: setActivityDateFilter,
                        options: ['Last 30 Days', 'Last 7 Days', 'Today', 'Last 90 Days']
                      },
                      {
                        val: activityBranchFilter,
                        set: setActivityBranchFilter,
                        options: ['All Branches', 'Main Branch', 'City Mall', 'Riverside']
                      },
                      {
                        val: activityModuleFilter,
                        set: setActivityModuleFilter,
                        options: ['All Modules', 'Campaigns', 'Rewards', 'QR Codes', 'Customers', 'Menu', 'Branches', 'Reports']
                      },
                      {
                        val: activityRoleFilter,
                        set: setActivityRoleFilter,
                        options: ['All Roles', 'Branch Manager', 'Marketing Executive', 'Cashier', 'Store Staff', 'Administrator', 'Supervisor']
                      },
                      {
                        val: activityTypeFilter,
                        set: setActivityTypeFilter,
                        options: ['All Activity Types', 'High Impact', 'Approvals', 'Configuration']
                      }
                    ].map((flt, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <select
                          value={flt.val}
                          onChange={(e) => flt.set(e.target.value)}
                          className="appearance-none bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer shadow-2xs"
                        >
                          {flt.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  {/* 4 KPI Stat Cards (iPad Pro 12.9_ - 38) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                    {[
                      { label: 'Total Actions', value: '2,482', delta: '↑ 12%', deltaCls: 'bg-emerald-50 text-emerald-700', icon: FileText, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                      { label: 'High-Impact Actions', value: '186', delta: '↑ 8%', deltaCls: 'bg-rose-50 text-rose-600', icon: Zap, iconBg: 'bg-pink-50 text-pink-600' },
                      { label: 'Approvals Handled', value: '640', delta: '↑ 24%', deltaCls: 'bg-emerald-50 text-emerald-700', icon: Check, iconBg: 'bg-emerald-50 text-emerald-600' },
                      { label: 'Permission Changes', value: '98', delta: '↑ 16%', deltaCls: 'bg-emerald-50 text-emerald-700', icon: ShieldCheck, iconBg: 'bg-rose-50 text-rose-600' }
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-2.5"
                      >
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                          <kpi.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-black text-[#1E1548] leading-none">{kpi.value}</div>
                          <div className="text-[11px] font-semibold text-[#7B748C] mt-1">{kpi.label}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className={`font-black px-1.5 py-0.5 rounded-md ${kpi.deltaCls}`}>{kpi.delta}</span>
                          <span className="text-[#9890A8] font-medium truncate">vs previous period</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Staff Activity Table/List Card (iPad Pro 12.9_ - 38) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                      <span className="text-sm sm:text-base font-black text-[#1E1548]">Recent Staff Activity</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#8C84A0]">
                          Showing 1–{filteredActivities.length} of 2,482
                        </span>
                        <button
                          type="button"
                          onClick={() => setActivitySortOrder((prev) => (prev === 'latest' ? 'oldest' : 'latest'))}
                          className="px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#E5DEF5] text-xs font-bold text-[#1E1548] flex items-center gap-1 cursor-pointer hover:border-[#5844A8]/40"
                        >
                          <span>{activitySortOrder === 'latest' ? 'Latest First' : 'Oldest First'}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                        </button>
                      </div>
                    </div>

                    {filteredActivities.length === 0 ? (
                      <div className="py-10 text-center text-xs font-bold text-[#8C84A0]">
                        No activity logs match the selected filters.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#F4F0FA]">
                        {filteredActivities.map((act) => {
                          const ModIcon = act.modIcon;
                          return (
                            <div
                              key={act.id}
                              onClick={() => {
                                setSelectedActivityId(act.id);
                                setActivitySubView('detail');
                              }}
                              className="py-3.5 grid grid-cols-1 md:grid-cols-12 items-start md:items-center gap-2.5 md:gap-3 hover:bg-[#FAF8FF] -mx-2 px-2 rounded-2xl cursor-pointer transition-colors"
                            >
                              {/* Col 1: Staff Member (3 cols) */}
                              <div className="md:col-span-3 flex items-center gap-2.5 min-w-0">
                                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${act.avatarBg}`}>
                                  {act.initials}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-black text-[#1E1548] truncate">{act.name}</div>
                                  <div className="text-[10px] font-semibold text-[#7B748C] truncate">{act.role}</div>
                                  <div className="text-[10px] text-[#9890A8] flex items-center gap-0.5 truncate">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span>{act.branch}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Col 2: Timestamp (2 cols) */}
                              <div className="md:col-span-2 text-[11px] pl-11 md:pl-0">
                                <div className="font-bold text-[#5E5870]">{act.time}</div>
                                <div className="text-[10px] text-[#9890A8]">{act.date}</div>
                              </div>

                              {/* Col 3: Module Pill (2 cols) */}
                              <div className="md:col-span-2 pl-11 md:pl-0">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold ${act.modCls}`}>
                                  <ModIcon className="w-3 h-3 shrink-0" />
                                  <span>{act.module}</span>
                                </span>
                              </div>

                              {/* Col 4: Action Title & Desc (3 cols) */}
                              <div className="md:col-span-3 min-w-0 pl-11 md:pl-0">
                                <div className="text-xs font-black text-[#1E1548] truncate">{act.action}</div>
                                <div className="text-[11px] text-[#8C84A0] truncate mt-0.5">{act.desc}</div>
                              </div>

                              {/* Col 5: Status Pill + View Details (2 cols) */}
                              <div className="md:col-span-2 flex md:flex-col items-center md:items-end justify-between gap-1 pl-11 md:pl-0">
                                <span
                                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    act.impact === 'High'
                                      ? 'bg-rose-50 text-rose-600'
                                      : act.impact === 'Success'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : act.impact === 'Medium'
                                      ? 'bg-amber-50 text-amber-700'
                                      : 'bg-[#F3EEFA] text-[#5844A8]'
                                  }`}
                                >
                                  {act.impact}
                                </span>
                                <span className="text-[11px] font-black text-[#4C1D95] hover:underline flex items-center gap-0.5">
                                  <span>View Details</span>
                                  <ChevronRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* ================================================= */
                /* ACTIVITY DETAIL & AUDIT TRAIL (iPad Pro 12.9_ - 39) */
                /* ================================================= */
                <div className="space-y-4 sm:space-y-5">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">
                        Activity Detail and Audit Trail
                      </h1>
                      <p className="text-xs text-[#7B748C] mt-0.5">
                        View Complete Details and Audit Trails for this Staff Activity
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActivitySubView('list')}
                      className="self-start sm:self-auto px-4 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-xs font-bold text-[#1E1548] rounded-full flex items-center gap-1.5 shadow-2xs cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Activity Log</span>
                    </button>
                  </div>

                  {/* Module Quick Filter Pills Strip (iPad Pro 12.9_ - 39) */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {['All Activity', 'Campaigns', 'Approvals', 'QR Codes', 'Menu', 'Customers', 'Rewards', 'Branches', 'Reports'].map(
                      (pill) => {
                        const isActive =
                          (pill === 'All Activity' && activityModuleFilter === 'All Modules') ||
                          pill === activeEvent.module;
                        return (
                          <button
                            key={pill}
                            type="button"
                            onClick={() => {
                              if (pill === 'All Activity') {
                                setActivityModuleFilter('All Modules');
                                setActivitySubView('list');
                              } else {
                                const match = activityEntries.find((a) => a.module === pill);
                                if (match) {
                                  setSelectedActivityId(match.id);
                                } else {
                                  setActivityModuleFilter(pill);
                                  setActivitySubView('list');
                                }
                              }
                            }}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#4C1D95] text-white shadow-xs'
                                : 'bg-[#F3EEFA] text-[#5844A8] hover:bg-[#EAE1F8]'
                            }`}
                          >
                            {pill}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Hero Event Summary Card */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECF9] pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${activeEvent.modCls}`}>
                          <activeEvent.modIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-base font-black text-[#1E1548]">{activeEvent.eventTitle}</div>
                          <div className="text-xs text-[#7B748C] mt-0.5">{activeEvent.eventSub}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="bg-rose-50 text-rose-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            {activeEvent.impact} Impact
                          </span>
                          <span className="bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                            {activeEvent.outcome}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#8C84A0] font-semibold flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {activeEvent.date}, {activeEvent.time.replace(/^Today,\s*/, '')}
                        </span>
                      </div>
                    </div>

                    {/* 3-Column Metadata Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      {/* Staff Member */}
                      <div className="flex items-start gap-3">
                        <div className={`w-11 h-11 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${activeEvent.avatarBg}`}>
                          {activeEvent.initials}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-black text-sm text-[#1E1548]">{activeEvent.name}</span>
                            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                              Active
                            </span>
                          </div>
                          <div className="text-[11px] font-bold text-[#7B748C]">
                            {activeEvent.role} | {activeEvent.empId}
                          </div>
                          <div className="text-[11px] text-[#8C84A0] space-y-0.5 pt-1">
                            <div className="flex items-center gap-1.5 truncate"><Mail className="w-3 h-3 shrink-0" /> {activeEvent.email}</div>
                            <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 shrink-0" /> {activeEvent.branch}</div>
                            <div className="flex items-center gap-1.5"><Briefcase className="w-3 h-3 shrink-0" /> {activeEvent.role}</div>
                          </div>
                        </div>
                      </div>

                      {/* Module / Affected Item / Device */}
                      <div className="space-y-3 md:border-l md:border-[#F2ECF9] md:pl-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">Module</span>
                          <div className="font-black text-[#1E1548] mt-0.5 flex items-center gap-1.5">
                            <activeEvent.modIcon className="w-3.5 h-3.5 text-[#5844A8]" />
                            {activeEvent.module}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">Affected Item</span>
                          <div className="font-black text-[#1E1548] mt-0.5">{activeEvent.affectedItem}</div>
                          <div className="text-[11px] text-[#8C84A0]">{activeEvent.affectedCode}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">Device / Source</span>
                          <div className="font-black text-[#1E1548] mt-0.5 flex items-center gap-1.5">
                            <Monitor className="w-3.5 h-3.5 text-[#5844A8]" />
                            {activeEvent.device}
                          </div>
                          <div className="text-[11px] text-[#8C84A0]">{activeEvent.deviceSub}</div>
                        </div>
                      </div>

                      {/* Date / Branch / IP */}
                      <div className="space-y-3 md:border-l md:border-[#F2ECF9] md:pl-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">Date &amp; Time</span>
                          <div className="font-black text-[#1E1548] mt-0.5 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-[#5844A8]" />
                            {activeEvent.date}, {activeEvent.time.replace(/^Today,\s*/, '')}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">Branch</span>
                          <div className="font-black text-[#1E1548] mt-0.5 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#5844A8]" />
                            {activeEvent.branch}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9890A8] uppercase">IP Address</span>
                          <div className="font-black text-[#1E1548] mt-0.5 flex items-center gap-1.5">
                            <Wifi className="w-3.5 h-3.5 text-[#5844A8]" />
                            {activeEvent.ip}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Change Summary Card — Before → After Comparison (iPad Pro 12.9_ - 39) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-[#1E1548]">Change Summary</h3>
                        <p className="text-[11px] text-[#7B748C]">{activeEvent.changeNote}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-3">
                      {/* Before Card */}
                      <div className="p-4 rounded-2xl bg-[#F8F7FB] border border-[#ECE8F4] space-y-2.5 text-xs">
                        <span className="font-black text-[#5E5870] block">Before</span>
                        {activeEvent.before.map((row) => (
                          <div key={row.label} className="flex items-center justify-between gap-2">
                            <span className="text-[#8C84A0] font-semibold">{row.label}</span>
                            <span className="font-bold text-[#5E5870]">{row.value}</span>
                          </div>
                        ))}
                      </div>

                      {/* Arrow */}
                      <div className="flex justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center">
                          <ArrowRight className="w-4 h-4 rotate-90 md:rotate-0" />
                        </div>
                      </div>

                      {/* After Card */}
                      <div className="p-4 rounded-2xl bg-[#FFF7FA] border border-[#F9E3EC] space-y-2.5 text-xs">
                        <span className="font-black text-rose-600 block">After</span>
                        {activeEvent.after.map((row) => (
                          <div key={row.label} className="flex items-center justify-between gap-2">
                            <span className="text-[#8C84A0] font-semibold">{row.label}</span>
                            {row.isPill ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-black px-2.5 py-0.5 rounded-full text-[11px]">
                                {row.value}
                              </span>
                            ) : (
                              <span className="font-black text-[#1E1548]">{row.value}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom 2-Column Row: Audit Trail | Related Actions (iPad Pro 12.9_ - 39) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Audit Trail Timeline */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 text-sm font-black text-[#1E1548]">
                        <Clock className="w-4 h-4 text-[#5844A8]" />
                        <span>Audit Trail</span>
                      </div>

                      <div className="relative pl-5 space-y-4 before:content-[''] before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-0.5 before:bg-[#EAE2FB]">
                        {[
                          { time: `${activeEvent.date}, ${activeEvent.time.replace(/^Today,\s*/, '')}`, title: activeEvent.eventTitle, desc: `${activeEvent.name} completed '${activeEvent.affectedItem}'.`, badge: activeEvent.impact, activeDot: true },
                          { time: `${activeEvent.date}, 10:20 AM`, title: `${activeEvent.module} updated`, desc: 'Updated configuration details and schedule.', badge: 'Normal', activeDot: false },
                          { time: '22 Apr 2024, 04:15 PM', title: `${activeEvent.module} record created`, desc: `Initial draft created for '${activeEvent.affectedItem}'.`, badge: 'Normal', activeDot: false }
                        ].map((step, idx) => (
                          <div key={idx} className="relative flex items-start justify-between gap-3">
                            <span
                              className={`w-3 h-3 rounded-full absolute -left-5 top-1 ring-4 ring-white ${
                                step.activeDot ? 'bg-[#4C1D95]' : 'bg-[#D9CEF2]'
                              }`}
                            />
                            <div className="min-w-0">
                              <div className="text-[10px] font-semibold text-[#9890A8]">{step.time}</div>
                              <div className="text-xs font-black text-[#1E1548] mt-0.5">{step.title}</div>
                              <p className="text-[11px] text-[#7B748C] mt-0.5 leading-snug">{step.desc}</p>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                                step.badge === 'High'
                                  ? 'bg-rose-50 text-rose-600'
                                  : 'bg-[#F3EEFA] text-[#5844A8]'
                              }`}
                            >
                              {step.badge}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Related Actions */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                      <div className="flex items-center gap-2 text-sm font-black text-[#1E1548]">
                        <Link2 className="w-4 h-4 text-[#5844A8]" />
                        <span>Related Actions</span>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { title: 'Updated campaign budget', time: '23 Apr 2024, 10:28 AM', icon: DollarSign },
                          { title: 'Added campaign banner', time: '23 Apr 2024, 10:25 AM', icon: FileText },
                          { title: 'Set audience targeting', time: '23 Apr 2024, 10:20 AM', icon: Users },
                          { title: 'Sent test notification', time: '22 Apr 2024, 06:12 PM', icon: Bell }
                        ].map((rel, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => triggerToast(`Opened audit entry: ${rel.title}`)}
                            className="w-full p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center justify-between gap-3 text-left transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                                <rel.icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-[#1E1548] truncate">{rel.title}</div>
                                <div className="text-[10px] font-semibold text-[#9890A8]">{rel.time}</div>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8C84A0] shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* TAB 4: REPORTS & AUDIT (iPad Pro 12.9_ - 40, 41 & 42)     */}
        {/* ======================================================== */}
        {currentTab === 'reports' && !selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (() => {
          const auditRecords = [
            { id: 'au-1', name: 'Aarav Sharma', initials: 'AS', avatarBg: 'bg-purple-100 text-[#5844A8]', role: 'Branch Manager', change: 'Role Changed', category: 'Role Assignment History', prev: 'Cashier', now: 'Branch Manager', nowAlert: false, by: 'Riya Merchant', date: '23 Apr 2024,', time: '10:24 AM', status: 'Success' as const },
            { id: 'au-2', name: 'Priya Mehta', initials: 'PM', avatarBg: 'bg-blue-100 text-blue-700', role: 'Marketing Executive', change: 'Permission Granted', category: 'Permission Changes', prev: 'No Access', now: 'Campaigns Access', nowAlert: false, by: 'Karan Malhotra', date: '23 Apr 2024,', time: '09:15 AM', status: 'Success' as const },
            { id: 'au-3', name: 'Rahul Verma', initials: 'RV', avatarBg: 'bg-emerald-100 text-emerald-700', role: 'Cashier', change: 'Branch Assigned', category: 'Branch Access', prev: '-', now: 'City Mall', nowAlert: false, by: 'Riya Merchant', date: '22 Apr 2024,', time: '04:22 PM', status: 'Success' as const },
            { id: 'au-4', name: 'Sneha Iyer', initials: 'SI', avatarBg: 'bg-lime-100 text-lime-800', role: 'Store Staff', change: 'Invitation Accepted', category: 'Invitation Status', prev: 'Pending', now: 'Active', nowAlert: false, by: 'System', date: '22 Apr 2024,', time: '11:08 AM', status: 'Success' as const },
            { id: 'au-5', name: 'Karan Malhotra', initials: 'KM', avatarBg: 'bg-amber-100 text-amber-800', role: 'Administrator', change: 'Account Suspended', category: 'Suspended Accounts', prev: 'Active', now: 'Suspended', nowAlert: true, by: 'Riya Merchant', date: '21 Apr 2024,', time: '03:45 PM', status: 'Warning' as const },
            { id: 'au-6', name: 'Neha Taneja', initials: 'NT', avatarBg: 'bg-purple-100 text-purple-700', role: 'Supervisor', change: 'Permission Revoked', category: 'Permission Changes', prev: 'Reports', now: 'No Access', nowAlert: true, by: 'Aarav Sharma', date: '20 Apr 2024,', time: '01:12 PM', status: 'Success' as const },
            { id: 'au-7', name: 'Aditya Roy', initials: 'AR', avatarBg: 'bg-orange-100 text-orange-700', role: 'Data Analyst', change: 'Role Changed', category: 'Role Assignment History', prev: 'Store Staff', now: 'Data Analyst', nowAlert: false, by: 'Riya Merchant', date: '19 Apr 2024,', time: '06:20 PM', status: 'Success' as const },
            { id: 'au-8', name: 'Meera Kapoor', initials: 'MK', avatarBg: 'bg-amber-100 text-amber-700', role: 'Cashier', change: 'Branch Removed', category: 'Branch Access', prev: 'Riverside', now: '-', nowAlert: false, by: 'Karan Malhotra', date: '18 Apr 2024,', time: '10:18 AM', status: 'Success' as const }
          ];

          const filteredAuditRecords =
            auditCategoryTab === 'Permission Changes'
              ? auditRecords
              : auditRecords.filter((rec) => rec.category === auditCategoryTab);

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* ================================================= */}
              {/* SUB-VIEW 1: STAFF REPORTS HUB (iPad Pro 12.9_ - 40) */}
              {/* ================================================= */}
              {reportsSubView === 'categories' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Header */}
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Staff Reports</h1>
                    <p className="text-xs text-[#7B748C] mt-0.5">
                      Generate and export insights about your team&apos;s software activity and access.
                    </p>
                  </div>

                  {/* Filter Row + Primary CTA Row */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                      {[
                        { val: reportsDateFilter, set: setReportsDateFilter, opts: ['Last 30 Days', 'Last 7 Days', 'Last 90 Days', 'This Quarter'] },
                        { val: reportsBranchFilter, set: setReportsBranchFilter, opts: ['All Branches', 'Main Branch', 'City Mall', 'Riverside'] },
                        { val: reportsRoleFilter, set: setReportsRoleFilter, opts: ['All Roles', 'Branch Manager', 'Cashier', 'Marketing Executive', 'Store Staff'] }
                      ].map((f, idx) => (
                        <div key={idx} className="relative shrink-0">
                          <select
                            value={f.val}
                            onChange={(e) => f.set(e.target.value)}
                            className="appearance-none bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer shadow-2xs"
                          >
                            {f.opts.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setReportsSubView('performance')}
                        className="px-5 py-2.5 bg-[#6D28D9] hover:bg-[#5B21B6] text-white rounded-xl text-xs font-black flex items-center gap-2 shadow-md shadow-purple-900/15 cursor-pointer transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Generate Report</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAuditCategoryTab('Permission Changes');
                          setReportsSubView('audit');
                        }}
                        className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#5844A8] rounded-xl text-xs font-black flex items-center gap-2 shadow-2xs cursor-pointer transition-colors"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Scheduled Reports</span>
                      </button>
                    </div>
                  </div>

                  {/* 4 KPI Stat Cards (iPad Pro 12.9_ - 40) */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-3.5">
                    {[
                      { label: 'Reports Generated', value: '28', delta: '↑ 12%', icon: FileText, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                      { label: 'Scheduled Reports', value: '6', delta: '↑ 50%', icon: ShieldCheck, iconBg: 'bg-rose-50 text-rose-600' },
                      { label: 'Exports This Month', value: '142', delta: '↑ 28%', icon: Download, iconBg: 'bg-emerald-50 text-emerald-600' },
                      { label: 'Staff Reviewed', value: '18', delta: '↑ 20%', icon: Users, iconBg: 'bg-blue-50 text-blue-600' }
                    ].map((kpi) => (
                      <div key={kpi.label} className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-2.5">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${kpi.iconBg}`}>
                          <kpi.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-black text-[#1E1548] leading-none">{kpi.value}</div>
                          <div className="text-[11px] font-semibold text-[#7B748C] mt-1">{kpi.label}</div>
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <span className="font-black text-emerald-600">{kpi.delta}</span>
                          <span className="text-[#9890A8] font-medium truncate">vs previous period</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Report Categories Section */}
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-base font-black text-[#1E1548]">Report Categories</h2>
                      <p className="text-xs text-[#7B748C]">Choose a report type to generate detailed insights.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          title: 'Team Activity Report',
                          desc: 'View overall staff activity across all modules and branches.',
                          icon: BarChart2,
                          iconBg: 'bg-[#F3EEFA] text-[#5844A8]',
                          fullWidth: false,
                          onOpen: () => setReportsSubView('performance')
                        },
                        {
                          title: 'Staff Performance Report',
                          desc: 'Analyse individual and team performance metrics.',
                          icon: User,
                          iconBg: 'bg-pink-50 text-pink-600',
                          fullWidth: false,
                          onOpen: () => setReportsSubView('performance')
                        },
                        {
                          title: 'Permission Change Audit',
                          desc: 'Track role changes, permissions and access modifications.',
                          icon: ShieldCheck,
                          iconBg: 'bg-emerald-50 text-emerald-600',
                          fullWidth: false,
                          onOpen: () => {
                            setAuditCategoryTab('Permission Changes');
                            setReportsSubView('audit');
                          }
                        },
                        {
                          title: 'Branch Access Report',
                          desc: 'View staff access and activity across different branches.',
                          icon: Building2,
                          iconBg: 'bg-amber-50 text-amber-600',
                          fullWidth: false,
                          onOpen: () => {
                            setAuditCategoryTab('Branch Access');
                            setReportsSubView('audit');
                          }
                        },
                        {
                          title: 'Invitation Status Report',
                          desc: 'Track pending, accepted and expired staff invitations.',
                          icon: Mail,
                          iconBg: 'bg-blue-50 text-blue-600',
                          fullWidth: true,
                          onOpen: () => {
                            setAuditCategoryTab('Invitation Status');
                            setReportsSubView('audit');
                          }
                        }
                      ].map((rep) => (
                        <div
                          key={rep.title}
                          onClick={rep.onOpen}
                          className={`bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] hover:border-[#5844A8]/50 shadow-2xs transition-all cursor-pointer flex flex-col justify-between gap-4 ${
                            rep.fullWidth ? 'md:col-span-2' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-3.5 min-w-0">
                              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${rep.iconBg}`}>
                                <rep.icon className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="text-sm font-black text-[#1E1548]">{rep.title}</div>
                                <p className="text-xs text-[#7B748C] mt-0.5 leading-relaxed">{rep.desc}</p>
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#9890A8] shrink-0 mt-1" />
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              rep.onOpen();
                            }}
                            className="w-full py-2.5 bg-[#F8F5FF] hover:bg-[#EFE9FB] text-[#5844A8] rounded-xl text-xs font-black transition-colors cursor-pointer"
                          >
                            Generate Report
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* SUB-VIEW 2: STAFF PERFORMANCE REPORT (41.png)     */}
              {/* ================================================= */}
              {reportsSubView === 'performance' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Header Row with Back + Export PDF / CSV */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => setReportsSubView('categories')}
                        className="w-8 h-8 rounded-full bg-white border border-[#EFEAF7] hover:border-[#5844A8]/50 flex items-center justify-center text-[#1E1548] shrink-0 mt-0.5 cursor-pointer shadow-2xs"
                        aria-label="Back to reports"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Staff Performance Report</h1>
                        <p className="text-xs text-[#7B748C] mt-0.5">
                          Analyse individual and team performance across all modules.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-10 sm:pl-0">
                      <button
                        type="button"
                        onClick={() => triggerToast('Staff Performance Report exported as PDF')}
                        className="px-4 sm:px-5 py-2 bg-[#4C1D95] hover:bg-[#3B1478] text-white rounded-full text-xs font-black shadow-md shadow-purple-900/15 cursor-pointer transition-colors"
                      >
                        Export PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast('Staff Performance Report exported as CSV')}
                        className="px-4 sm:px-5 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-black shadow-2xs cursor-pointer transition-colors"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* 4 Filter Dropdowns Row */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {[
                      { val: reportsDateFilter, set: setReportsDateFilter, opts: ['Last 30 Days', 'Last 7 Days', 'Last 90 Days'] },
                      { val: reportsBranchFilter, set: setReportsBranchFilter, opts: ['All Branches', 'Main Branch', 'City Mall', 'Riverside'] },
                      { val: reportsRoleFilter, set: setReportsRoleFilter, opts: ['All Roles', 'Branch Manager', 'Marketing Executive', 'Cashier'] }
                    ].map((f, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <select
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className="appearance-none bg-white border border-[#E5DEF5] rounded-full px-3.5 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer shadow-2xs"
                        >
                          {f.opts.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setReportsSubView('audit')}
                      className="px-3.5 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 rounded-full text-xs font-bold text-[#5844A8] flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                    >
                      <span>Performance</span>
                      <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                    </button>
                  </div>

                  {/* 6 KPI Cards — 3 Columns on Tablet (iPad Pro 12.9_ - 41) */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-3.5">
                    {[
                      { label: 'Campaign Actions', value: '248', delta: '↑ 12%', icon: Megaphone, iconBg: 'bg-rose-50 text-rose-600' },
                      { label: 'Approvals Processed', value: '186', delta: '↑ 18%', icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-600' },
                      { label: 'QR Codes Generated', value: '640', delta: '↑ 24%', icon: QrCode, iconBg: 'bg-purple-50 text-purple-600' },
                      { label: 'Customer Updates', value: '320', delta: '↑ 16%', icon: Users, iconBg: 'bg-amber-50 text-amber-600' },
                      { label: 'Menu Changes', value: '98', delta: '↑ 8%', icon: FileText, iconBg: 'bg-blue-50 text-blue-600' },
                      { label: 'Reports Downloaded', value: '28', delta: '↑ 12%', icon: Download, iconBg: 'bg-rose-50 text-rose-500' }
                    ].map((kpi) => (
                      <div key={kpi.label} className="bg-white p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs space-y-3">
                        <div className="flex items-center justify-between">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${kpi.iconBg}`}>
                            <kpi.icon className="w-4 h-4" />
                          </div>
                          <span className="text-xl font-black text-[#1E1548]">{kpi.value}</span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-[#6B657E] truncate">{kpi.label}</span>
                          <span className="text-[11px] font-black text-emerald-600 shrink-0">{kpi.delta}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Staff Activity Trend — Stacked Vertical Bar Chart (iPad Pro 12.9_ - 41) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                          <BarChart2 className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Staff Activity Trend</h3>
                          <p className="text-[11px] text-[#8C84A0]">Total software actions performed by staff over time.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setPerformanceGranularity((prev) => (prev === 'Daily' ? 'Weekly' : 'Daily'))}
                        className="px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#E5DEF5] text-xs font-bold text-[#1E1548] flex items-center gap-1 cursor-pointer"
                      >
                        <span>{performanceGranularity}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                      </button>
                    </div>

                    <div className="flex items-stretch gap-3 h-48 pt-2">
                      {/* Y-Axis */}
                      <div className="flex flex-col justify-between text-[10px] font-bold text-[#9890A8] pb-6 text-right shrink-0">
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>

                      {/* Stacked Columns */}
                      <div className="flex-1 relative flex items-end justify-around gap-3 px-2">
                        <div className="absolute inset-x-0 top-0 bottom-6 flex flex-col justify-between pointer-events-none">
                          <div className="border-t border-dashed border-[#EFEAF7]" />
                          <div className="border-t border-dashed border-[#EFEAF7]" />
                          <div className="border-t border-dashed border-[#EFEAF7]" />
                          <div className="border-t border-dashed border-[#EFEAF7]" />
                          <div className="border-t border-[#EFEAF7]" />
                        </div>

                        {(performanceGranularity === 'Daily'
                          ? [
                              { label: '18 Apr', camp: 20, qr: 24, cust: 16, app: 14 },
                              { label: '20 Apr', camp: 24, qr: 26, cust: 18, app: 16 },
                              { label: '22 Apr', camp: 28, qr: 28, cust: 18, app: 16 },
                              { label: '24 Apr', camp: 32, qr: 30, cust: 20, app: 18 },
                              { label: '26 Apr', camp: 36, qr: 34, cust: 22, app: 20 },
                              { label: '28 Apr', camp: 40, qr: 36, cust: 22, app: 24 }
                            ]
                          : [
                              { label: 'Wk 1', camp: 22, qr: 26, cust: 18, app: 16 },
                              { label: 'Wk 2', camp: 28, qr: 30, cust: 20, app: 18 },
                              { label: 'Wk 3', camp: 34, qr: 32, cust: 22, app: 20 },
                              { label: 'Wk 4', camp: 40, qr: 36, cust: 24, app: 22 }
                            ]
                        ).map((col) => (
                          <div key={col.label} className="relative z-10 flex flex-col items-center h-full justify-end gap-2">
                            <div className="w-4 sm:w-5 flex flex-col-reverse gap-0.5 items-stretch">
                              <div style={{ height: `${col.camp}px` }} className="bg-[#7C3AED] rounded-b-sm" title="Campaigns" />
                              <div style={{ height: `${col.qr}px` }} className="bg-[#818CF8]" title="QR Codes" />
                              <div style={{ height: `${col.cust}px` }} className="bg-[#C084FC]" title="Customer Updates" />
                              <div style={{ height: `${col.app}px` }} className="bg-[#F472B6] rounded-t-sm" title="Approvals" />
                            </div>
                            <span className="text-[10px] font-bold text-[#7B748C] whitespace-nowrap">{col.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-4 sm:gap-6 flex-wrap pt-1 text-[11px] font-bold text-[#5E5870]">
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#7C3AED]" /> Campaigns</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#F472B6]" /> Approvals</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#818CF8]" /> QR Codes</span>
                      <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#C084FC]" /> Customer Updates</span>
                    </div>
                  </div>

                  {/* Top Performing Staff Table Card (iPad Pro 12.9_ - 41) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                          <Award className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Top Performing Staff</h3>
                          <p className="text-[11px] text-[#8C84A0]">Staff ranked by total activity across all modules.</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('staff');
                          setStaffSubView('directory');
                        }}
                        className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                      >
                        View All →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[540px]">
                        <thead>
                          <tr className="border-b border-[#F2ECF9] text-[10px] font-bold uppercase tracking-wider text-[#9890A8]">
                            <th className="py-2.5 px-2 w-10">#</th>
                            <th className="py-2.5 px-2">Staff Member</th>
                            <th className="py-2.5 px-2 text-center">Campaigns</th>
                            <th className="py-2.5 px-2 text-center">Approvals</th>
                            <th className="py-2.5 px-2 text-center">QR Codes</th>
                            <th className="py-2.5 px-2 text-center">Customer Updates</th>
                            <th className="py-2.5 px-2 text-right">Score</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F2FA] text-xs">
                          {[
                            { rank: 1, id: 'st-1', initials: 'AS', avatarBg: 'bg-purple-100 text-[#5844A8]', rankCls: 'bg-amber-400 text-white', name: 'Aarav Sharma', role: 'Branch Manager', campaigns: 52, approvals: 36, qr: 48, updates: 64, score: 98 },
                            { rank: 2, id: 'st-2', initials: 'PM', avatarBg: 'bg-blue-100 text-blue-700', rankCls: 'bg-pink-500 text-white', name: 'Priya Mehta', role: 'Marketing Executive', campaigns: 48, approvals: 32, qr: 42, updates: 58, score: 92 },
                            { rank: 3, id: 'st-3', initials: 'RV', avatarBg: 'bg-emerald-100 text-emerald-700', rankCls: 'bg-amber-500 text-white', name: 'Rahul Verma', role: 'Cashier', campaigns: 40, approvals: 28, qr: 38, updates: 46, score: 84 },
                            { rank: 4, id: 'st-4', initials: 'SI', avatarBg: 'bg-lime-100 text-lime-800', rankCls: 'bg-gray-100 text-gray-500', name: 'Sneha Iyer', role: 'Store Staff', campaigns: 32, approvals: 24, qr: 36, updates: 40, score: 76 },
                            { rank: 5, id: 'st-5', initials: 'KM', avatarBg: 'bg-amber-100 text-amber-800', rankCls: 'bg-gray-100 text-gray-500', name: 'Karan Malhotra', role: 'Administrator', campaigns: 28, approvals: 20, qr: 26, updates: 34, score: 68 }
                          ].map((row) => (
                            <tr
                              key={row.rank}
                              onClick={() => {
                                setSelectedStaffId(row.id);
                                setProfileTab('overview');
                              }}
                              className="hover:bg-[#FAF8FF] cursor-pointer transition-colors"
                            >
                              <td className="py-3 px-2">
                                <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-black text-[11px] ${row.rankCls}`}>
                                  {row.rank}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${row.avatarBg}`}>
                                    {row.initials}
                                  </div>
                                  <div>
                                    <div className="font-black text-[#1E1548]">{row.name}</div>
                                    <div className="text-[10px] text-[#8C84A0]">{row.role}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 text-center font-bold text-[#1E1548]">{row.campaigns}</td>
                              <td className="py-3 px-2 text-center font-bold text-[#1E1548]">{row.approvals}</td>
                              <td className="py-3 px-2 text-center font-bold text-[#1E1548]">{row.qr}</td>
                              <td className="py-3 px-2 text-center font-bold text-[#1E1548]">{row.updates}</td>
                              <td className="py-3 px-2 text-right">
                                <span
                                  className={`inline-block font-black text-[11px] px-2.5 py-0.5 rounded-full ${
                                    row.score >= 80
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-amber-50 text-amber-700'
                                  }`}
                                >
                                  {row.score}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Actions by Module — Horizontal Segmented Bar (iPad Pro 12.9_ - 41) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                          <PieChart className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Actions by Module</h3>
                          <p className="text-[11px] text-[#8C84A0]">Distribution of staff actions across different modules.</p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl bg-[#FAF8FF] border border-[#E5DEF5] text-xs font-bold text-[#5E5870]">
                        All Staff
                      </span>
                    </div>

                    <div className="w-full h-3.5 rounded-full overflow-hidden flex bg-[#F3EEFA]">
                      <div style={{ width: '28%' }} className="bg-[#7C3AED]" title="Campaigns 28%" />
                      <div style={{ width: '22%' }} className="bg-[#F472B6]" title="Approvals 22%" />
                      <div style={{ width: '26%' }} className="bg-[#38BDF8]" title="QR Codes 26%" />
                      <div style={{ width: '18%' }} className="bg-[#F59E0B]" title="Customer Updates 18%" />
                      <div style={{ width: '6%' }} className="bg-[#C7D2FE]" title="Menu 6%" />
                    </div>

                    <div className="flex items-center justify-between gap-3 flex-wrap text-xs font-bold text-[#5E5870]">
                      {[
                        { label: 'Campaigns', pct: '28%', color: 'bg-[#7C3AED]' },
                        { label: 'Approvals', pct: '22%', color: 'bg-[#F472B6]' },
                        { label: 'QR Codes', pct: '26%', color: 'bg-[#38BDF8]' },
                        { label: 'Customer Updates', pct: '18%', color: 'bg-[#F59E0B]' },
                        { label: 'Menu', pct: '6%', color: 'bg-[#C7D2FE]' }
                      ].map((seg) => (
                        <span key={seg.label} className="flex items-center gap-1.5">
                          <span className={`w-2.5 h-2.5 rounded-xs ${seg.color}`} />
                          <span>{seg.label}</span>
                          <span className="text-[#9890A8]">{seg.pct}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* SUB-VIEW 3: ACCESS & AUDIT REPORTS (42.png)       */}
              {/* ================================================= */}
              {reportsSubView === 'audit' && (
                <div className="space-y-4 sm:space-y-5">
                  {/* Header Row with Back + Export PDF / CSV */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <button
                        type="button"
                        onClick={() => setReportsSubView('categories')}
                        className="w-8 h-8 rounded-full bg-white border border-[#EFEAF7] hover:border-[#5844A8]/50 flex items-center justify-center text-[#1E1548] shrink-0 mt-0.5 cursor-pointer shadow-2xs"
                        aria-label="Back to reports"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <div>
                        <h1 className="text-xl sm:text-2xl font-black text-[#1E1548] tracking-tight">Access &amp; Audit Reports</h1>
                        <p className="text-xs text-[#7B748C] mt-0.5">
                          Track permission changes, branch access and staff account activity.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pl-10 sm:pl-0">
                      <button
                        type="button"
                        onClick={() => triggerToast('Access & Audit Report exported as PDF')}
                        className="px-4 sm:px-5 py-2 bg-[#4C1D95] hover:bg-[#3B1478] text-white rounded-full text-xs font-black shadow-md shadow-purple-900/15 cursor-pointer transition-colors"
                      >
                        Export PDF
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast('Access & Audit Report exported as CSV')}
                        className="px-4 sm:px-5 py-2 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-black shadow-2xs cursor-pointer transition-colors"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {[
                      { val: reportsDateFilter, set: setReportsDateFilter, opts: ['Last 30 Days', 'Last 7 Days', 'Last 90 Days'] },
                      { val: reportsBranchFilter, set: setReportsBranchFilter, opts: ['All Branches', 'Main Branch', 'City Mall', 'Riverside'] },
                      { val: reportsRoleFilter, set: setReportsRoleFilter, opts: ['All Roles', 'Branch Manager', 'Marketing Executive', 'Cashier', 'Administrator'] }
                    ].map((f, idx) => (
                      <div key={idx} className="relative shrink-0">
                        <select
                          value={f.val}
                          onChange={(e) => f.set(e.target.value)}
                          className="appearance-none bg-white border border-[#E5DEF5] rounded-xl px-3.5 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer shadow-2xs"
                        >
                          {f.opts.map((o) => (
                            <option key={o} value={o}>
                              {o}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    ))}
                  </div>

                  {/* 5 Interactive Audit Category Pills (iPad Pro 12.9_ - 42) */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-0.5 no-scrollbar">
                    {(
                      [
                        'Permission Changes',
                        'Branch Access',
                        'Invitation Status',
                        'Suspended Accounts',
                        'Role Assignment History'
                      ] as const
                    ).map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setAuditCategoryTab(cat)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          auditCategoryTab === cat
                            ? 'bg-[#4C1D95] text-white shadow-xs'
                            : 'bg-white border border-[#E5DEF5] text-[#5E5870] hover:border-[#5844A8]/40'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Report Preview 7-Column Table Card (iPad Pro 12.9_ - 42) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#1E1548]">Report Preview</h3>
                          <p className="text-[11px] text-[#8C84A0]">
                            Showing {auditCategoryTab.toLowerCase()} and access modifications.
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#7B748C] shrink-0">
                        Total Records: <strong className="text-[#1E1548]">{auditCategoryTab === 'Permission Changes' ? 28 : filteredAuditRecords.length}</strong>
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[660px]">
                        <thead>
                          <tr className="border-b border-[#F2ECF9] text-[10px] font-bold uppercase tracking-wider text-[#9890A8]">
                            <th className="py-2.5 px-2">Staff Member</th>
                            <th className="py-2.5 px-2">Change Type</th>
                            <th className="py-2.5 px-2">Previous Value</th>
                            <th className="py-2.5 px-2">New Value</th>
                            <th className="py-2.5 px-2">Changed By</th>
                            <th className="py-2.5 px-2">Date &amp; Time</th>
                            <th className="py-2.5 px-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F5F2FA] text-xs">
                          {filteredAuditRecords.map((aud) => (
                            <tr key={aud.id} className="hover:bg-[#FAF8FF] transition-colors">
                              <td className="py-3 px-2">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px] shrink-0 ${aud.avatarBg}`}>
                                    {aud.initials}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-black text-[#1E1548] whitespace-nowrap">{aud.name}</div>
                                    <div className="text-[10px] text-[#8C84A0] whitespace-nowrap">{aud.role}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-2 font-bold text-[#1E1548] whitespace-nowrap">{aud.change}</td>
                              <td className="py-3 px-2 text-[#8C84A0] font-semibold whitespace-nowrap">{aud.prev}</td>
                              <td className={`py-3 px-2 font-black whitespace-nowrap ${aud.nowAlert ? 'text-rose-600' : 'text-[#1E1548]'}`}>
                                {aud.now}
                              </td>
                              <td className="py-3 px-2 text-[#5E5870] font-semibold whitespace-nowrap">{aud.by}</td>
                              <td className="py-3 px-2 text-[11px] text-[#8C84A0] whitespace-nowrap">
                                <div>{aud.date}</div>
                                <div>{aud.time}</div>
                              </td>
                              <td className="py-3 px-2 text-right">
                                <span
                                  className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                                    aud.status === 'Success'
                                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                >
                                  {aud.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Bottom 2-Column Row: Export & Schedule | Recent Generated Reports (iPad Pro 12.9_ - 42) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left: Export & Schedule */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                          <Upload className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#1E1548]">Export &amp; Schedule</h3>
                          <p className="text-[11px] text-[#8C84A0]">Download or schedule this report.</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {[
                          { label: 'Download PDF', icon: FileText, iconBg: 'bg-rose-50 text-rose-600', msg: 'Downloading audit report as PDF...' },
                          { label: 'Download CSV', icon: Download, iconBg: 'bg-emerald-50 text-emerald-600', msg: 'Downloading audit report as CSV...' },
                          { label: 'Email Report', icon: Mail, iconBg: 'bg-blue-50 text-blue-600', msg: 'Audit report emailed to merchant admin' },
                          { label: 'Schedule Weekly Audit', icon: Clock, iconBg: 'bg-[#F3EEFA] text-[#5844A8]', msg: 'Weekly audit schedule activated (Mondays 9:00 AM)' }
                        ].map((act) => (
                          <button
                            key={act.label}
                            type="button"
                            onClick={() => triggerToast(act.msg)}
                            className="w-full p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] flex items-center justify-between gap-3 cursor-pointer transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${act.iconBg}`}>
                                <act.icon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-black text-[#1E1548]">{act.label}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-[#8C84A0]" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Recent Generated Reports */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                            <Clock className="w-4 h-4" />
                          </div>
                          <h3 className="text-sm font-black text-[#1E1548]">Recent Generated Reports</h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => setReportsSubView('categories')}
                          className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="space-y-2">
                        {[
                          { title: 'Permission Change Audit', date: '23 Apr 2024, 10:24 AM', fmt: 'PDF', fmtCls: 'bg-rose-50 text-rose-600', icon: ShieldCheck, iconBg: 'bg-emerald-50 text-emerald-600' },
                          { title: 'Branch Access Report', date: '22 Apr 2024, 02:15 PM', fmt: 'CSV', fmtCls: 'bg-emerald-50 text-emerald-700', icon: Building2, iconBg: 'bg-blue-50 text-blue-600' },
                          { title: 'Invitation Status Report', date: '20 Apr 2024, 11:08 AM', fmt: 'PDF', fmtCls: 'bg-rose-50 text-rose-600', icon: Mail, iconBg: 'bg-[#F3EEFA] text-[#5844A8]' },
                          { title: 'Suspended Accounts Report', date: '18 Apr 2024, 04:32 PM', fmt: 'CSV', fmtCls: 'bg-emerald-50 text-emerald-700', icon: AlertTriangle, iconBg: 'bg-amber-50 text-amber-600' }
                        ].map((rep) => (
                          <div
                            key={rep.title}
                            className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] flex items-center justify-between gap-2.5"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${rep.iconBg}`}>
                                <rep.icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs font-black text-[#1E1548] truncate">{rep.title}</div>
                                <div className="text-[10px] text-[#8C84A0]">{rep.date}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${rep.fmtCls}`}>
                                {rep.fmt}
                              </span>
                              <button
                                type="button"
                                onClick={() => triggerToast(`Downloading ${rep.title}.${rep.fmt.toLowerCase()}`)}
                                className="p-1.5 rounded-lg hover:bg-white text-[#7B748C] hover:text-[#5844A8] cursor-pointer transition-colors"
                                aria-label={`Download ${rep.title}`}
                              >
                                <Download className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* ADD STAFF MEMBER WIZARD (iPad Pro 12.9_ - 20, 91, 23, 24) */}
        {/* ======================================================== */}
        {isAddStaffOpen && (() => {
          const wizardBranches = [
            { name: 'Main Branch', address: '123 MG Road, Sector 18, Noida', status: 'Active', color: 'from-purple-600 to-indigo-700' },
            { name: 'City Mall', address: 'City Mall, Ground Floor, Sector 32, Noida', status: 'Active', color: 'from-amber-500 to-orange-600' },
            { name: 'Riverside', address: 'Riverside Plaza, Block C, Sector 62, Noida', status: 'Active', color: 'from-teal-500 to-emerald-600' },
            { name: 'Airport T2', address: 'Terminal 2, Indira Gandhi Intl, New Delhi', status: 'Inactive', color: 'from-slate-500 to-slate-700' }
          ];

          const roleCatalog = [
            { role: 'Branch Manager', icon: Briefcase, desc: 'Full access to manage branch operations, staff, customers, reports and settings.' },
            { role: 'Cashier', icon: CreditCard, desc: 'Manage customer transactions, process payments, and handle daily sales.' },
            { role: 'Waiter / Floor Staff', icon: Coffee, desc: 'Take orders, manage tables, and view customer information.' },
            { role: 'Marketing', icon: Megaphone, desc: 'Manage campaigns, offers, loyalty programs and customer communications.' },
            { role: 'Customer Support', icon: MessageSquare, desc: 'Handle customer inquiries, manage feedback and support tickets.' },
            { role: 'Custom Role', icon: Sliders, desc: 'Create a custom role with specific permissions tailored to your needs.' }
          ];

          const activeRoleInfo = roleCatalog.find((r) => r.role === selectedRoleForNewStaff) || roleCatalog[0];
          const assignedEntries = wizardBranches.filter((b) => branchAccessLevels[b.name] && branchAccessLevels[b.name] !== 'No Access');
          const fullAccessCount = wizardBranches.filter((b) => branchAccessLevels[b.name] === 'Full Access').length;
          const viewManageCount = wizardBranches.filter((b) => branchAccessLevels[b.name] === 'View & Manage').length;
          const viewOnlyCount = wizardBranches.filter((b) => branchAccessLevels[b.name] === 'View Only').length;
          const noAccessCount = wizardBranches.filter((b) => !branchAccessLevels[b.name] || branchAccessLevels[b.name] === 'No Access').length;

          const handleFinishAddStaff = (isDraft: boolean) => {
            const trimmedName = newStaffName.trim() || 'New Staff Member';
            const initials = trimmedName
              .split(' ')
              .map((p) => p[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            const primaryBranch = assignedEntries[0]?.name || 'Main Branch';
            const created: StaffMember = {
              id: `st-${Date.now()}`,
              name: trimmedName,
              role: selectedRoleForNewStaff,
              roleType: selectedRoleForNewStaff === 'Custom Role' ? 'Custom' : 'System',
              branch: primaryBranch,
              status: isDraft ? 'Pending' : 'Active',
              email: newStaffEmail.trim() || 'staff@thecoffeeclub.com',
              phone: newStaffPhone.startsWith('+91') ? newStaffPhone : `+91 ${newStaffPhone}`,
              shifts: 0,
              hours: 0,
              tasks: 0,
              lastActive: isDraft ? 'Invited just now' : 'Just now',
              avatarBg: 'bg-purple-100 text-purple-700',
              initials: initials || 'NS',
              employeeId: newStaffEmpId.trim() || `EMP${Math.floor(100 + Math.random() * 899)}`,
              joinDate: '23 Apr 2024',
              location: primaryBranch,
              accountStatus: isDraft ? 'Pending' : 'Active',
              state: 'Uttar Pradesh',
              city: 'Noida'
            };
            setStaffMembers((prev) => [created, ...prev]);
            setSelectedBranchesForNewStaff(assignedEntries.map((b) => b.name));
            setIsAddStaffOpen(false);
            setCurrentTab('staff');
            setStaffSubView('directory');
            triggerToast(isDraft ? `${trimmedName} saved as draft` : `Invitation sent to ${trimmedName}!`);
          };

          return (
            <div className="space-y-5 animate-in fade-in duration-200 max-w-4xl mx-auto">
              {/* Top Header Row — Left-aligned circular back + Title (iPad Pro 12.9_ - 20/91/23/24) */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddStaffOpen(false)}
                    className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] hover:border-[#5844A8]/50 shadow-2xs cursor-pointer transition-colors"
                    aria-label="Back to staff"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1E1548] leading-tight">Add Staff Member</h2>
                    <p className="text-[11px] font-semibold text-[#8C84A0]">Step {addStaffStep} of 4 • Staff Onboarding</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="text-xs font-bold text-[#7B748C] hover:text-[#1E1548] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Connected 4-Step Horizontal Progress Stepper */}
              <div className="bg-white rounded-2xl px-4 sm:px-8 py-4 border border-[#EFEAF7] shadow-2xs">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                  {[
                    { step: 1 as const, label: 'Personal' },
                    { step: 2 as const, label: 'Role' },
                    { step: 3 as const, label: 'Branches' },
                    { step: 4 as const, label: 'Review' }
                  ].map((st, idx, arr) => {
                    const isCompleted = addStaffStep > st.step;
                    const isCurrent = addStaffStep === st.step;
                    return (
                      <React.Fragment key={st.step}>
                        <button
                          type="button"
                          onClick={() => {
                            if (st.step <= addStaffStep) setAddStaffStep(st.step);
                          }}
                          className={`flex flex-col items-center gap-1.5 relative z-10 ${
                            st.step <= addStaffStep ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              isCompleted
                                ? 'bg-[#240B4C] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-[#240B4C] text-white ring-4 ring-[#F0E9FC]'
                                : 'bg-white border-2 border-[#DDD6EE] text-[#9890A8]'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4" /> : st.step}
                          </div>
                          <span
                            className={`text-[11px] font-bold ${
                              isCurrent || isCompleted ? 'text-[#1E1548]' : 'text-[#9890A8]'
                            }`}
                          >
                            {st.label}
                          </span>
                        </button>
                        {idx < arr.length - 1 && (
                          <div className="flex-1 h-0.5 mx-2 sm:mx-3 -mt-5 rounded-full bg-[#EAE2FB] overflow-hidden">
                            <div
                              className="h-full bg-[#240B4C] transition-all duration-300"
                              style={{ width: addStaffStep > st.step ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* STEP 1: PERSONAL (Matching iPad Pro 12.9_ - 20) */}
              {addStaffStep === 1 && (
                <div className="space-y-4">
                  {/* Soft Lavender Hero Banner */}
                  <div className="bg-gradient-to-r from-[#F4EEFF] via-[#F7F3FF] to-[#EDE5FF] rounded-3xl p-4 sm:p-5 border border-[#E5DAF9] flex items-center justify-between gap-4">
                    <div className="space-y-1 max-w-md">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-[#5844A8] bg-white/80 px-2.5 py-0.5 rounded-full border border-[#E5DAF9]">
                        <Sparkles className="w-3 h-3" /> Quick Onboarding
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-[#1E1548]">Invite a new team member</h3>
                      <p className="text-xs text-[#6B657E] leading-relaxed">
                        Add their personal information and choose how they should receive their workspace invitation.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-xs rounded-2xl p-3 border border-[#E5DAF9] shadow-2xs shrink-0">
                      <div className="w-10 h-10 rounded-full bg-[#240B4C] text-white flex items-center justify-center font-black text-xs">
                        {newStaffName
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || 'AS'}
                      </div>
                      <div className="text-left">
                        <div className="text-xs font-black text-[#1E1548]">{newStaffName || 'New Staff'}</div>
                        <div className="text-[10px] font-semibold text-[#5844A8]">{newStaffJobTitle || 'Team Member'}</div>
                      </div>
                    </div>
                  </div>

                  {/* 2-Column Tablet Layout: Left Photo + Contact/Invite | Right Personal Details */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Left Column (5 cols on tablet) */}
                    <div className="md:col-span-5 space-y-4">
                      {/* Profile Photo Card */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <h4 className="text-sm font-black text-[#1E1548]">Profile Photo</h4>
                        <button
                          type="button"
                          onClick={() => triggerToast('Photo upload picker ready (using avatar initials preview)')}
                          className="w-full py-5 px-4 rounded-2xl border-2 border-dashed border-[#DCD3F2] hover:border-[#5844A8] bg-[#FAF8FF] flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                          <div className="w-14 h-14 rounded-full bg-[#EFE9FB] text-[#5844A8] flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="text-xs font-black text-[#1E1548]">Upload Photo</div>
                          <div className="text-[10px] text-[#8C84A0] font-semibold">JPG, PNG or GIF • Max 5MB</div>
                        </button>
                      </div>

                      {/* Contact & Invitation Card */}
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                        <h4 className="text-sm font-black text-[#1E1548]">Contact &amp; Invitation</h4>
                        <div className="space-y-2">
                          <button
                            type="button"
                            onClick={() => setInviteMethod('email')}
                            className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                              inviteMethod === 'email'
                                ? 'border-[#5844A8] bg-[#F7F3FF]'
                                : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-white border border-[#EFEAF7] text-[#5844A8] flex items-center justify-center shrink-0">
                                <Mail className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[#1E1548]">Email Invitation</div>
                                <div className="text-[10px] text-[#8C84A0]">Send login link to email</div>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full shrink-0 ${
                                inviteMethod === 'email' ? 'border-[5px] border-[#5844A8]' : 'border-2 border-[#D4CCE6]'
                              }`}
                            />
                          </button>

                          <button
                            type="button"
                            onClick={() => setInviteMethod('sms')}
                            className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between text-left transition-all cursor-pointer ${
                              inviteMethod === 'sms'
                                ? 'border-[#5844A8] bg-[#F7F3FF]'
                                : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-xl bg-white border border-[#EFEAF7] text-[#5844A8] flex items-center justify-center shrink-0">
                                <Phone className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="text-xs font-black text-[#1E1548]">SMS Invitation</div>
                                <div className="text-[10px] text-[#8C84A0]">Send OTP invite via mobile</div>
                              </div>
                            </div>
                            <div
                              className={`w-4 h-4 rounded-full shrink-0 ${
                                inviteMethod === 'sms' ? 'border-[5px] border-[#5844A8]' : 'border-2 border-[#D4CCE6]'
                              }`}
                            />
                          </button>
                        </div>

                        {/* Amber Access Status Callout */}
                        <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-start gap-2.5">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-[11px] font-black text-amber-900">Access Status: Pending Invite</div>
                            <p className="text-[10px] text-amber-800/80 mt-0.5 leading-snug">
                              Invitation will be sent after you complete this flow.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column (7 cols on tablet): Personal Details Form */}
                    <div className="md:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                      <div>
                        <h4 className="text-sm font-black text-[#1E1548]">Personal Details</h4>
                        <p className="text-[11px] text-[#8C84A0] mt-0.5">All fields marked with * are required.</p>
                      </div>

                      <div className="space-y-3.5">
                        <div>
                          <label className="text-xs text-[#5E5870] font-bold block mb-1.5">Full Name *</label>
                          <div className="flex items-center gap-2.5 bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-3.5 py-2.5 transition-colors">
                            <User className="w-4 h-4 text-[#8C84A0] shrink-0" />
                            <input
                              type="text"
                              value={newStaffName}
                              onChange={(e) => setNewStaffName(e.target.value)}
                              placeholder="Enter full name"
                              className="w-full bg-transparent text-xs font-bold text-[#1E1548] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-[#5E5870] font-bold block mb-1.5">Employee ID *</label>
                          <div className="flex items-center gap-2.5 bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-3.5 py-2.5 transition-colors">
                            <Tag className="w-4 h-4 text-[#8C84A0] shrink-0" />
                            <input
                              type="text"
                              value={newStaffEmpId}
                              onChange={(e) => setNewStaffEmpId(e.target.value)}
                              placeholder="e.g. EMP009"
                              className="w-full bg-transparent text-xs font-bold text-[#1E1548] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-[#5E5870] font-bold block mb-1.5">Mobile Number *</label>
                          <div className="flex items-center gap-2">
                            <div className="px-3 py-2.5 bg-[#F3EEFA] border border-[#E5DEF5] rounded-xl text-xs font-extrabold text-[#1E1548] shrink-0">
                              🇮🇳 +91
                            </div>
                            <div className="flex-1 flex items-center gap-2 bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-3.5 py-2.5 transition-colors">
                              <Phone className="w-4 h-4 text-[#8C84A0] shrink-0" />
                              <input
                                type="text"
                                value={newStaffPhone.replace(/^\+91\s*/, '')}
                                onChange={(e) => setNewStaffPhone(e.target.value)}
                                placeholder="98765 43210"
                                className="w-full bg-transparent text-xs font-bold text-[#1E1548] outline-none"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-[#5E5870] font-bold block mb-1.5">Email Address *</label>
                          <div className="flex items-center gap-2.5 bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-3.5 py-2.5 transition-colors">
                            <Mail className="w-4 h-4 text-[#8C84A0] shrink-0" />
                            <input
                              type="email"
                              value={newStaffEmail}
                              onChange={(e) => setNewStaffEmail(e.target.value)}
                              placeholder="name@company.com"
                              className="w-full bg-transparent text-xs font-bold text-[#1E1548] outline-none"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs text-[#5E5870] font-bold block mb-1.5">Job Title *</label>
                          <div className="flex items-center gap-2.5 bg-[#FAF8FF] border border-[#E5DEF5] focus-within:border-[#5844A8] rounded-xl px-3.5 py-2.5 transition-colors">
                            <Briefcase className="w-4 h-4 text-[#8C84A0] shrink-0" />
                            <input
                              type="text"
                              value={newStaffJobTitle}
                              onChange={(e) => setNewStaffJobTitle(e.target.value)}
                              placeholder="e.g. Branch Manager"
                              className="w-full bg-transparent text-xs font-bold text-[#1E1548] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Bottom Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleFinishAddStaff(true)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold shadow-2xs cursor-pointer transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddStaffStep(2)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: ROLE SELECTION (Matching iPad Pro 12.9_ - 91) */}
              {addStaffStep === 2 && (
                <div className="space-y-4">
                  {/* Assign a Role Header Card */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-[#1E1548]">Assign a Role</h3>
                      <p className="text-xs text-[#7B748C] mt-0.5">
                        Choose a designation and software role that matches {newStaffName || 'this staff member'}&apos;s responsibilities.
                      </p>
                    </div>
                  </div>

                  {/* Job Designation Card */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-2.5">
                    <h4 className="text-sm font-black text-[#1E1548]">Job Designation</h4>
                    <div>
                      <label className="text-[11px] font-bold text-[#7B748C] block mb-1.5">Designation / Job Title</label>
                      <div className="relative">
                        <select
                          value={newStaffJobTitle}
                          onChange={(e) => setNewStaffJobTitle(e.target.value)}
                          className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2.5 pr-9 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                        >
                          {['Branch Manager', 'Store Supervisor', 'Senior Cashier', 'Waiter / Floor Staff', 'Marketing Lead', 'Customer Support Executive'].map(
                            (desig) => (
                              <option key={desig} value={desig}>
                                {desig}
                              </option>
                            )
                          )}
                        </select>
                        <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Software Role 3-Column Grid (iPad Pro 12.9_ - 91) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-[#1E1548]">Software Role</h4>
                      <span className="text-[11px] font-semibold text-[#8C84A0]">Select 1 access profile</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {roleCatalog.map((r) => {
                        const isSelected = selectedRoleForNewStaff === r.role;
                        return (
                          <button
                            key={r.role}
                            type="button"
                            onClick={() => setSelectedRoleForNewStaff(r.role)}
                            className={`p-4 rounded-2xl border-2 flex flex-col justify-between text-left cursor-pointer transition-all ${
                              isSelected
                                ? 'border-[#E11D48] bg-[#FFF5F7]/60 shadow-xs'
                                : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-center justify-between gap-2">
                                <div
                                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                    isSelected ? 'bg-[#FFE4EA] text-[#E11D48]' : 'bg-[#F3EEFA] text-[#5844A8]'
                                  }`}
                                >
                                  <r.icon className="w-4 h-4" />
                                </div>
                                <div
                                  className={`w-4 h-4 rounded-full shrink-0 ${
                                    isSelected ? 'border-[5px] border-[#E11D48]' : 'border-2 border-[#D4CCE6]'
                                  }`}
                                />
                              </div>
                              <div className="text-xs font-black text-[#1E1548]">{r.role}</div>
                              <p className="text-[11px] text-[#6B657E] leading-relaxed">{r.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Dynamic Access Summary Card */}
                  <div className="bg-[#F8F5FF] rounded-3xl p-4 sm:p-5 border border-[#E5DAF9] flex items-start gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0 shadow-2xs">
                      <activeRoleInfo.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#5844A8]">Access Summary</div>
                      <div className="text-sm font-black text-[#1E1548] mt-0.5">{activeRoleInfo.role}</div>
                      <p className="text-xs text-[#6B657E] mt-0.5 leading-relaxed">{activeRoleInfo.desc}</p>
                    </div>
                  </div>

                  {/* Step 2 Bottom Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setAddStaffStep(1)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddStaffStep(3)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: BRANCH ACCESS (Matching iPad Pro 12.9_ - 23) */}
              {addStaffStep === 3 && (
                <div className="space-y-4">
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-5">
                    {/* Header + Info Pill */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                      <div>
                        <h3 className="text-base font-black text-[#1E1548]">Branch Access</h3>
                        <p className="text-xs text-[#7B748C] mt-0.5">
                          Define which store branches this team member can access and their level of control.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerToast('Branch levels control POS, inventory, and analytics visibility per outlet.')}
                        className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-[#F3EEFA] text-[#5844A8] text-[11px] font-bold flex items-center gap-1.5 cursor-pointer hover:bg-[#E9E0FB]"
                      >
                        <Info className="w-3.5 h-3.5" />
                        <span>Learn about branch access</span>
                      </button>
                    </div>

                    {/* 3-Option Scope Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {[
                        { id: 'all' as const, label: 'All Branches', desc: 'Full access across every location' },
                        { id: 'selected' as const, label: 'Selected Branches', desc: 'Configure per-branch permissions' },
                        { id: 'none' as const, label: 'No Branch Access', desc: 'Restrict to HQ / dashboard only' }
                      ].map((opt) => {
                        const isActive = branchAccessScope === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setBranchAccessScope(opt.id);
                              if (opt.id === 'all') {
                                setBranchAccessLevels({
                                  'Main Branch': 'Full Access',
                                  'City Mall': 'Full Access',
                                  'Riverside': 'Full Access',
                                  'Airport T2': 'Full Access'
                                });
                              } else if (opt.id === 'none') {
                                setBranchAccessLevels({
                                  'Main Branch': 'No Access',
                                  'City Mall': 'No Access',
                                  'Riverside': 'No Access',
                                  'Airport T2': 'No Access'
                                });
                              } else {
                                setBranchAccessLevels({
                                  'Main Branch': 'Full Access',
                                  'City Mall': 'View & Manage',
                                  'Riverside': 'View Only',
                                  'Airport T2': 'No Access'
                                });
                              }
                            }}
                            className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#240B4C] border-[#240B4C] text-white shadow-sm'
                                : 'bg-[#FAF8FF] border-[#EFEAF7] text-[#1E1548] hover:border-[#D9CEF2]'
                            }`}
                          >
                            <div className="text-xs font-black">{opt.label}</div>
                            <div className={`text-[10px] mt-0.5 ${isActive ? 'text-purple-200' : 'text-[#8C84A0]'}`}>
                              {opt.desc}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Select Branches List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#1E1548]">Select Branches</span>
                        <span className="text-[11px] font-bold text-[#5844A8] bg-[#F3EEFA] px-2.5 py-0.5 rounded-full">
                          {assignedEntries.length} of {wizardBranches.length} branches selected
                        </span>
                      </div>

                      <div className="space-y-2.5">
                        {wizardBranches.map((br) => {
                          const currentLevel = branchAccessLevels[br.name] || 'No Access';
                          const isAssigned = currentLevel !== 'No Access';
                          return (
                            <div
                              key={br.name}
                              className={`p-3.5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                                isAssigned
                                  ? 'border-[#D9CEF2] bg-[#FAF8FF]/70'
                                  : 'border-[#EFEAF7] bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`w-11 h-11 rounded-xl bg-gradient-to-br ${br.color} text-white flex items-center justify-center shrink-0 shadow-xs`}
                                >
                                  <Store className="w-5 h-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-xs sm:text-sm font-black text-[#1E1548]">{br.name}</span>
                                    <span
                                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                        br.status === 'Active'
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : 'bg-gray-100 text-gray-500'
                                      }`}
                                    >
                                      {br.status}
                                    </span>
                                  </div>
                                  <div className="text-[11px] text-[#8C84A0] truncate mt-0.5">{br.address}</div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 shrink-0 sm:w-44">
                                <div className="relative w-full">
                                  <select
                                    value={currentLevel}
                                    onChange={(e) => {
                                      const val = e.target.value as 'Full Access' | 'View & Manage' | 'View Only' | 'No Access';
                                      setBranchAccessScope('selected');
                                      setBranchAccessLevels((prev) => ({ ...prev, [br.name]: val }));
                                    }}
                                    className={`w-full appearance-none rounded-xl px-3 py-2 pr-8 text-xs font-bold outline-none border cursor-pointer ${
                                      currentLevel === 'Full Access'
                                        ? 'bg-[#F3EEFA] border-[#D7C7F7] text-[#5844A8]'
                                        : currentLevel === 'View & Manage'
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                        : currentLevel === 'View Only'
                                        ? 'bg-amber-50 border-amber-200 text-amber-800'
                                        : 'bg-gray-50 border-gray-200 text-gray-500'
                                    }`}
                                  >
                                    <option value="Full Access">Full Access</option>
                                    <option value="View & Manage">View &amp; Manage</option>
                                    <option value="View Only">View Only</option>
                                    <option value="No Access">No Access</option>
                                  </select>
                                  <ChevronDown className="w-3.5 h-3.5 text-current opacity-70 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Branch Access Summary — 5 Live Computed Tinted Cards (iPad Pro 12.9_ - 23) */}
                    <div className="pt-2 border-t border-[#F2ECF9] space-y-2.5">
                      <div className="text-xs font-black text-[#1E1548]">Branch Access Summary</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                        <div className="p-3 rounded-2xl bg-[#F5F1FF] border border-[#E5DAF9]">
                          <div className="text-lg font-black text-[#1E1548]">{assignedEntries.length}</div>
                          <div className="text-[10px] font-bold text-[#6B657E] leading-tight mt-0.5">Total Branches Assigned</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#EFE9FB] border border-[#DFD2F7]">
                          <div className="text-lg font-black text-[#5844A8]">{fullAccessCount}</div>
                          <div className="text-[10px] font-bold text-[#5844A8] leading-tight mt-0.5">Full Access</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#EEF2FF] border border-[#DDE4FF]">
                          <div className="text-lg font-black text-indigo-700">{viewManageCount}</div>
                          <div className="text-[10px] font-bold text-indigo-700 leading-tight mt-0.5">View &amp; Manage</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA]">
                          <div className="text-lg font-black text-amber-800">{viewOnlyCount}</div>
                          <div className="text-[10px] font-bold text-amber-800 leading-tight mt-0.5">View Only</div>
                        </div>
                        <div className="p-3 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] col-span-2 sm:col-span-1">
                          <div className="text-lg font-black text-slate-600">{noAccessCount}</div>
                          <div className="text-[10px] font-bold text-slate-500 leading-tight mt-0.5">No Access</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 3 Bottom Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setAddStaffStep(2)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBranchesForNewStaff(assignedEntries.map((b) => b.name));
                        setAddStaffStep(4);
                      }}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: REVIEW & SEND (Matching iPad Pro 12.9_ - 24) */}
              {addStaffStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-[#1E1548]">Review Staff Details</h3>
                      <p className="text-xs text-[#7B748C] mt-0.5">
                        Verify all details before sending the workspace invitation.
                      </p>
                    </div>
                  </div>

                  {/* Card 1: Personal Information */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548]">Personal Information</span>
                      <button
                        type="button"
                        onClick={() => setAddStaffStep(1)}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#240B4C] text-white flex items-center justify-center font-black text-lg shrink-0">
                        {newStaffName
                          .split(' ')
                          .map((p) => p[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase() || 'AS'}
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-[#1E1548]">{newStaffName}</span>
                          <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                            Active (New)
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#5E5870]">
                          {newStaffJobTitle} <span className="text-[#C8C0D8] mx-1">|</span> {newStaffEmpId}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7B748C]">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#5844A8]" /> {newStaffEmail}</span>
                          <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-[#5844A8]" /> +91 {newStaffPhone.replace(/^\+91\s*/, '')}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-[#5844A8]" /> Joining 23 Apr 2024</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Role */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548]">Role</span>
                      <button
                        type="button"
                        onClick={() => setAddStaffStep(2)}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                        <activeRoleInfo.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-black text-[#1E1548]">{activeRoleInfo.role}</div>
                        <p className="text-xs text-[#6B657E] mt-0.5 leading-relaxed">{activeRoleInfo.desc}</p>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Branch Access */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-[#1E1548]">Branch Access</span>
                        <span className="text-[10px] font-bold text-[#5844A8] bg-[#F3EEFA] px-2 py-0.5 rounded-full">
                          {assignedEntries.length} branches selected
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setAddStaffStep(3)}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {assignedEntries.length > 0 ? (
                        assignedEntries.map((br) => (
                          <span
                            key={br.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#F3EEFA] border border-[#E2D6FA] text-xs font-bold text-[#1E1548]"
                          >
                            <MapPin className="w-3.5 h-3.5 text-[#5844A8]" />
                            <span>{br.name}</span>
                            <span className="text-[10px] font-semibold text-[#5844A8]">({branchAccessLevels[br.name]})</span>
                          </span>
                        ))
                      ) : (
                        <span className="text-xs font-semibold text-[#8C84A0]">No branches assigned</span>
                      )}
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] text-[11px] text-[#6B657E] flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#5844A8] shrink-0" />
                      <span>You can adjust branch-specific access levels anytime from the Staff Profile screen.</span>
                    </div>
                  </div>

                  {/* Card 4: Invitation Details */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548]">Invitation Details</span>
                      <button
                        type="button"
                        onClick={() => setAddStaffStep(1)}
                        className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7]">
                        <span className="text-[10px] font-bold uppercase text-[#8C84A0] block">Send via</span>
                        <span className="font-black text-[#1E1548] mt-0.5 block">
                          {inviteMethod === 'email' ? 'Email Invitation' : 'SMS Invitation'}
                        </span>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7]">
                        <span className="text-[10px] font-bold uppercase text-[#8C84A0] block">To</span>
                        <span className="font-black text-[#1E1548] mt-0.5 block truncate">
                          {inviteMethod === 'email' ? newStaffEmail : `+91 ${newStaffPhone.replace(/^\+91\s*/, '')}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] flex items-center gap-2 text-xs font-bold text-amber-900">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Invitation not sent yet — click &ldquo;Send Invitation&rdquo; below to dispatch.</span>
                    </div>
                  </div>

                  {/* Audit Log Notice */}
                  <div className="p-3.5 rounded-2xl bg-[#F8F5FF] border border-[#E5DAF9] flex items-center gap-2.5 text-xs text-[#5E5870]">
                    <ShieldCheck className="w-4 h-4 text-[#5844A8] shrink-0" />
                    <span>
                      <strong className="text-[#1E1548]">Access changes are logged:</strong> Adding staff members and assigning permissions is recorded in the workspace audit trail.
                    </span>
                  </div>

                  {/* Step 4 Bottom 2 Full-Width Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => handleFinishAddStaff(true)}
                      className="w-full py-3 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-black shadow-2xs cursor-pointer transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFinishAddStaff(false)}
                      className="w-full py-3 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Send Invitation</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* ADD / EDIT ROLE 4-STEP WIZARD (iPad Pro 12.9_ - 35, 31, 36, 37) */}
        {/* ======================================================== */}
        {isAddRoleOpen && (() => {
          const roleBranchCatalog = [
            { name: 'Main Branch', location: 'Sector 18, Noida', grad: 'from-purple-600 to-indigo-700' },
            { name: 'City Mall', location: 'Sector 32, Noida', grad: 'from-amber-500 to-orange-600' },
            { name: 'Riverside', location: 'Sector 62, Noida', grad: 'from-teal-500 to-emerald-600' },
            { name: 'Airport T2', location: 'Terminal 2, New Delhi', grad: 'from-slate-600 to-indigo-800' }
          ];

          const moduleVisuals: Record<string, { icon: any; iconBg: string; pillCls: string }> = {
            campaigns: { icon: Megaphone, iconBg: 'bg-amber-50 text-amber-600', pillCls: 'bg-amber-50 text-amber-800 border-amber-200' },
            approvals: { icon: CheckCircle2, iconBg: 'bg-emerald-50 text-emerald-600', pillCls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
            qr_codes: { icon: QrCode, iconBg: 'bg-blue-50 text-blue-600', pillCls: 'bg-blue-50 text-blue-700 border-blue-200' },
            customers: { icon: Users, iconBg: 'bg-pink-50 text-pink-600', pillCls: 'bg-purple-50 text-purple-700 border-purple-200' },
            menu: { icon: BookOpen, iconBg: 'bg-orange-50 text-orange-600', pillCls: 'bg-orange-50 text-orange-700 border-orange-200' },
            branches: { icon: Building2, iconBg: 'bg-teal-50 text-teal-600', pillCls: 'bg-teal-50 text-teal-700 border-teal-200' },
            rewards: { icon: Gift, iconBg: 'bg-purple-50 text-purple-600', pillCls: 'bg-teal-50 text-teal-700 border-teal-200' },
            reports: { icon: BarChart2, iconBg: 'bg-rose-50 text-rose-600', pillCls: 'bg-indigo-50 text-indigo-700 border-indigo-200' }
          };

          const enabledModules = newRoleModules.filter((m) => m.active);
          const includedCount =
            newRoleBranchPolicy === 'all'
              ? roleBranchCatalog.length
              : newRoleBranchPolicy === 'none'
              ? 0
              : newRoleIncludedBranches.length;

          const handleSaveRole = (asDraft: boolean) => {
            const cleanName = newRoleName.trim() || 'Custom Staff Role';
            const initials = cleanName
              .split(' ')
              .map((w) => w[0])
              .join('')
              .slice(0, 2)
              .toUpperCase();
            const permCount = enabledModules.reduce(
              (acc, m) => acc + (m.level === 'Full Access' ? 4 : m.level === 'View & Manage' ? 3 : 2),
              0
            );
            const finalBranches =
              newRoleBranchPolicy === 'all'
                ? roleBranchCatalog.map((b) => b.name)
                : newRoleBranchPolicy === 'none'
                ? []
                : newRoleIncludedBranches;

            if (editingRoleId) {
              setRolesList((prev) =>
                prev.map((r) =>
                  r.id === editingRoleId
                    ? {
                        ...r,
                        name: cleanName,
                        initials: initials || r.initials,
                        category: newRoleCategory,
                        branchLimited: newRoleBranchPolicy === 'assigned',
                        desc: newRoleDesc.trim() || r.desc,
                        permCount: Math.max(permCount, 2),
                        accessLevel: newRoleAccessLevel,
                        visibility: newRoleVisibility,
                        status: asDraft ? 'Draft' : newRoleActive ? 'Active' : 'Draft',
                        branchPolicy: newRoleBranchPolicy,
                        includedBranches: finalBranches
                      }
                    : r
                )
              );
              setRecentRoleUpdates((prev) => [
                { title: `${cleanName} role updated`, meta: 'Riya Merchant • Just now', iconBg: 'bg-emerald-50 text-emerald-600', type: 'update' as const },
                ...prev.slice(0, 4)
              ]);
              triggerToast(asDraft ? `${cleanName} saved as draft` : `${cleanName} role updated successfully`);
            } else {
              const createdRole: RoleRecord = {
                id: `role-${Date.now()}`,
                initials: initials || 'NR',
                badgeBg: newRoleCategory === 'Custom' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700',
                name: cleanName,
                category: newRoleCategory,
                branchLimited: newRoleBranchPolicy === 'assigned',
                desc: newRoleDesc.trim() || 'Custom staff role configured for branch operations.',
                staffCount: 0,
                permCount: Math.max(permCount, 2),
                accessLevel: newRoleAccessLevel,
                visibility: newRoleVisibility,
                status: asDraft ? 'Draft' : newRoleActive ? 'Active' : 'Draft',
                branchPolicy: newRoleBranchPolicy,
                includedBranches: finalBranches
              };
              setRolesList((prev) => [createdRole, ...prev]);
              setRecentRoleUpdates((prev) => [
                { title: `New role '${cleanName}' created`, meta: 'Riya Merchant • Just now', iconBg: 'bg-[#F3EEFA] text-[#5844A8]', type: 'create' as const },
                ...prev.slice(0, 4)
              ]);
              triggerToast(asDraft ? `${cleanName} saved as draft` : `New role '${cleanName}' created!`);
            }

            setIsAddRoleOpen(false);
            setEditingRoleId(null);
            setCurrentTab('permissions');
          };

          return (
            <div className="space-y-5 animate-in fade-in duration-200 max-w-4xl mx-auto">
              {/* Top Header Row — Left-aligned circular back + Title */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddRoleOpen(false);
                      setEditingRoleId(null);
                    }}
                    className="w-9 h-9 rounded-full bg-white border border-[#EFEAF7] flex items-center justify-center text-[#1E1548] hover:border-[#5844A8]/50 shadow-2xs cursor-pointer transition-colors"
                    aria-label="Back to roles"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-[#1E1548] leading-tight">
                      {editingRoleId ? 'Edit Role' : 'Add New Role'}
                    </h2>
                    <p className="text-[11px] font-semibold text-[#8C84A0]">Step {addRoleStep} of 4 • Role Configuration</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddRoleOpen(false);
                    setEditingRoleId(null);
                  }}
                  className="text-xs font-bold text-[#7B748C] hover:text-[#1E1548] cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              {/* Connected 4-Step Horizontal Progress Stepper (iPad Pro 12.9_ - 35, 31, 36, 37) */}
              <div className="bg-white rounded-2xl px-4 sm:px-8 py-4 border border-[#EFEAF7] shadow-2xs">
                <div className="flex items-center justify-between relative max-w-2xl mx-auto">
                  {[
                    { step: 1 as const, label: 'Role Info' },
                    { step: 2 as const, label: 'Permissions' },
                    { step: 3 as const, label: 'Branches' },
                    { step: 4 as const, label: 'Review' }
                  ].map((st, idx, arr) => {
                    const isCompleted = addRoleStep > st.step;
                    const isCurrent = addRoleStep === st.step;
                    return (
                      <React.Fragment key={st.step}>
                        <button
                          type="button"
                          onClick={() => {
                            if (st.step <= addRoleStep || editingRoleId) setAddRoleStep(st.step);
                          }}
                          className={`flex flex-col items-center gap-1.5 relative z-10 ${
                            st.step <= addRoleStep || editingRoleId ? 'cursor-pointer' : 'cursor-default'
                          }`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                              isCompleted
                                ? 'bg-[#240B4C] text-white shadow-xs'
                                : isCurrent
                                ? 'bg-[#240B4C] text-white ring-4 ring-[#F0E9FC]'
                                : 'bg-white border-2 border-[#DDD6EE] text-[#9890A8]'
                            }`}
                          >
                            {isCompleted ? <Check className="w-4 h-4" /> : st.step}
                          </div>
                          <span
                            className={`text-[11px] font-bold ${
                              isCurrent || isCompleted ? 'text-[#1E1548]' : 'text-[#9890A8]'
                            }`}
                          >
                            {st.label}
                          </span>
                        </button>
                        {idx < arr.length - 1 && (
                          <div className="flex-1 h-0.5 mx-2 sm:mx-3 -mt-5 rounded-full bg-[#EAE2FB] overflow-hidden">
                            <div
                              className="h-full bg-[#240B4C] transition-all duration-300"
                              style={{ width: addRoleStep > st.step ? '100%' : '0%' }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>

              {/* ================================================= */}
              {/* STEP 1: ROLE INFORMATION + LIVE PREVIEW (35.png)  */}
              {/* ================================================= */}
              {addRoleStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Left: Role Information Form (8 cols on tablet) */}
                    <div className="md:col-span-8 bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Role Information</h3>
                        <p className="text-[11px] text-[#8C84A0] mt-0.5">Provide basic details about this role.</p>
                      </div>

                      {/* Role Name */}
                      <div>
                        <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
                          Role Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={newRoleName}
                          onChange={(e) => setNewRoleName(e.target.value)}
                          placeholder="e.g. Marketing Executive"
                          className="w-full bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] outline-none transition-colors"
                        />
                      </div>

                      {/* Role Category 2 Radio Cards */}
                      <div>
                        <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
                          Role Category <span className="text-rose-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {[
                            { id: 'System' as const, title: 'System Template', desc: 'Based on Loyaltics default roles' },
                            { id: 'Custom' as const, title: 'Custom Role', desc: 'Create a custom role with specific permissions' }
                          ].map((cat) => {
                            const isSelected = newRoleCategory === cat.id;
                            return (
                              <button
                                key={cat.id}
                                type="button"
                                onClick={() => setNewRoleCategory(cat.id)}
                                className={`p-3.5 rounded-2xl border-2 text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#7C3AED] bg-[#F8F5FF]'
                                    : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full shrink-0 mt-0.5 ${
                                    isSelected ? 'border-[5px] border-[#7C3AED]' : 'border-2 border-[#D4CCE6]'
                                  }`}
                                />
                                <div>
                                  <div className="text-xs font-black text-[#1E1548]">{cat.title}</div>
                                  <div className="text-[10px] text-[#7B748C] mt-0.5 leading-snug">{cat.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Description + Character Counter */}
                      <div>
                        <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
                          Description <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          maxLength={200}
                          value={newRoleDesc}
                          onChange={(e) => setNewRoleDesc(e.target.value)}
                          placeholder="Describe what responsibilities and access this role covers..."
                          className="w-full bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2.5 text-xs font-medium text-[#1E1548] outline-none resize-none transition-colors"
                        />
                        <div className="text-right text-[10px] font-semibold text-[#9890A8] mt-1">
                          {newRoleDesc.length}/200
                        </div>
                      </div>

                      {/* Default Software Access Level */}
                      <div>
                        <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
                          Default Software Access Level <span className="text-rose-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={newRoleAccessLevel}
                            onChange={(e) => setNewRoleAccessLevel(e.target.value)}
                            className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] focus:border-[#5844A8] rounded-xl px-3.5 py-2.5 pr-9 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                          >
                            <option value="Basic Access">Basic Access</option>
                            <option value="Standard Access">Standard Access</option>
                            <option value="Manager Access">Manager Access</option>
                            <option value="Full Admin Access">Full Admin Access</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-[#8C84A0] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        <p className="text-[10px] text-[#8C84A0] mt-1">Sets the base access level for this role.</p>
                      </div>

                      {/* Visible to */}
                      <div>
                        <label className="text-xs font-bold text-[#1E1548] block mb-1.5">
                          Visible to <span className="text-rose-500">*</span>
                        </label>
                        <div className="space-y-2">
                          {[
                            { id: 'All Branches' as const, desc: 'Role can be assigned across organization' },
                            { id: 'Specific Branches' as const, desc: 'Role only visible to selected branches' }
                          ].map((vis) => {
                            const isSelected = newRoleVisibility === vis.id;
                            return (
                              <button
                                key={vis.id}
                                type="button"
                                onClick={() => setNewRoleVisibility(vis.id)}
                                className={`w-full p-3 rounded-2xl border-2 text-left flex items-center gap-3 transition-all cursor-pointer ${
                                  isSelected
                                    ? 'border-[#7C3AED] bg-[#F8F5FF]'
                                    : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full shrink-0 ${
                                    isSelected ? 'border-[5px] border-[#7C3AED]' : 'border-2 border-[#D4CCE6]'
                                  }`}
                                />
                                <div>
                                  <div className="text-xs font-black text-[#1E1548]">{vis.id}</div>
                                  <div className="text-[10px] text-[#7B748C] mt-0.5">{vis.desc}</div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Status Toggle Row */}
                      <div className="pt-2 border-t border-[#F2ECF9] flex items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-black text-[#1E1548]">Status</div>
                          <div className="text-[10px] text-[#8C84A0]">This role can be assigned to staff members.</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setNewRoleActive((prev) => !prev)}
                          className="flex items-center gap-2 cursor-pointer"
                        >
                          <div
                            className={`w-10 h-5 rounded-full relative transition-colors ${
                              newRoleActive ? 'bg-[#7C3AED]' : 'bg-gray-200'
                            }`}
                          >
                            <div
                              className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-xs transition-all ${
                                newRoleActive ? 'right-0.5' : 'left-0.5'
                              }`}
                            />
                          </div>
                          <span className={`text-xs font-bold ${newRoleActive ? 'text-[#1E1548]' : 'text-[#8C84A0]'}`}>
                            {newRoleActive ? 'Active' : 'Inactive'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Right: Live ROLE PREVIEW Card (4 cols on tablet) */}
                    <div className="md:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                      <div className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C84A0] border-b border-[#F2ECF9] pb-2.5">
                        Role Preview
                      </div>

                      <div className="flex flex-col items-center text-center space-y-2 py-2">
                        <div className="w-12 h-12 rounded-2xl bg-[#F3EEFA] text-[#7C3AED] flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                        <div className="text-sm sm:text-base font-black text-[#1E1548]">
                          {newRoleName.trim() || 'Untitled Role'}
                        </div>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED]">
                          {newRoleCategory === 'Custom' ? 'Custom Role' : 'System Role'}
                        </span>
                        <p className="text-[11px] text-[#7B748C] leading-relaxed pt-1">
                          {newRoleDesc.trim() || 'Add a short description for this role.'}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-[#F2ECF9] space-y-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C84A0] font-semibold flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" /> Access Level
                          </span>
                          <span className="font-black text-[#1E1548]">{newRoleAccessLevel}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C84A0] font-semibold flex items-center gap-1.5">
                            <Eye className="w-3.5 h-3.5" /> Visibility
                          </span>
                          <span className="font-black text-[#1E1548]">{newRoleVisibility}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#8C84A0] font-semibold flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Status
                          </span>
                          <span
                            className={`font-black flex items-center gap-1 ${
                              newRoleActive ? 'text-emerald-600' : 'text-gray-400'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                newRoleActive ? 'bg-emerald-500' : 'bg-gray-400'
                              }`}
                            />
                            {newRoleActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Step 1 Bottom Action Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => handleSaveRole(true)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#5844A8]" />
                      <span>Save as Draft</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddRoleStep(2)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 2: MODULE PERMISSIONS (31.png)               */}
              {/* ================================================= */}
              {addRoleStep === 2 && (
                <div className="space-y-4">
                  {/* Lavender Inheritance Callout */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-[#F8F5FF] border border-[#E5DAF9] flex items-start gap-3">
                    <div className="w-8 h-8 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1E1548]">Role Permission Inheritance</div>
                      <p className="text-[11px] text-[#6B657E] mt-0.5 leading-snug">
                        These permissions will be inherited by all staff members assigned to this role. You can customize individual access later if needed.
                      </p>
                    </div>
                  </div>

                  {/* Section Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Module Permissions</h3>
                      <p className="text-[11px] text-[#7B748C]">Select what this role can access in Loyaltics.</p>
                    </div>
                    <span className="bg-[#F3EEFA] text-[#5844A8] text-xs font-black px-3 py-1 rounded-full border border-[#E2D6FA] shrink-0">
                      {enabledModules.length} of {newRoleModules.length} Enabled
                    </span>
                  </div>

                  {/* 8 Stacked Module Rows */}
                  <div className="space-y-2.5">
                    {newRoleModules.map((mod) => {
                      const vis = moduleVisuals[mod.id] || moduleVisuals.campaigns;
                      const IconComp = vis.icon;
                      return (
                        <div
                          key={mod.id}
                          className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${vis.iconBg}`}>
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs sm:text-sm font-black text-[#1E1548]">{mod.name}</span>
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    mod.active
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-gray-100 text-gray-500'
                                  }`}
                                >
                                  {mod.active ? 'Active' : 'Disabled'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#8C84A0] mt-0.5 truncate sm:whitespace-normal">{mod.desc}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
                            {/* 3-Option Segmented Access Level Control */}
                            <div
                              className={`inline-flex items-center p-1 rounded-xl border text-[10px] sm:text-[11px] font-bold transition-opacity ${
                                mod.active
                                  ? 'bg-[#F6F3FB] border-[#EAE2FB]'
                                  : 'bg-gray-50 border-gray-100 opacity-45 pointer-events-none'
                              }`}
                            >
                              {(['View Only', 'View & Manage', 'Full Access'] as const).map((lvl) => (
                                <button
                                  key={lvl}
                                  type="button"
                                  onClick={() =>
                                    setNewRoleModules((prev) =>
                                      prev.map((item) => (item.id === mod.id ? { ...item, level: lvl, active: true } : item))
                                    )
                                  }
                                  className={`px-2 sm:px-2.5 py-1 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                                    mod.active && mod.level === lvl
                                      ? 'bg-white text-[#240B4C] shadow-2xs border border-[#DFD2F7]'
                                      : 'text-[#7B748C] hover:text-[#1E1548]'
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>

                            {/* Interactive Toggle Switch */}
                            <button
                              type="button"
                              onClick={() =>
                                setNewRoleModules((prev) =>
                                  prev.map((item) => (item.id === mod.id ? { ...item, active: !item.active } : item))
                                )
                              }
                              aria-label={`Toggle ${mod.name}`}
                              className={`w-10 h-5.5 rounded-full relative transition-colors shrink-0 cursor-pointer ${
                                mod.active ? 'bg-[#240B4C]' : 'bg-gray-200'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-xs transition-all ${
                                  mod.active ? 'right-0.5' : 'left-0.5'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Step 2 Bottom Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setAddRoleStep(1)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddRoleStep(3)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 3: DEFAULT BRANCH ACCESS POLICY (36.png)     */}
              {/* ================================================= */}
              {addRoleStep === 3 && (
                <div className="space-y-4">
                  {/* Top Card: 3-Column Policy Selector */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div>
                      <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Default Branch Access Policy</h3>
                      <p className="text-xs text-[#7B748C] mt-0.5">
                        Define the default branch scope for staff members using this role. You can still customize individual branch access when assigning staff.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[
                        {
                          id: 'all' as const,
                          title: 'All Branches',
                          desc: 'Staff with this role can access all branches in your organization automatically.',
                          icon: Globe,
                          iconCls: 'bg-[#F3EEFA] text-[#5844A8]'
                        },
                        {
                          id: 'assigned' as const,
                          title: 'Assigned Branches Only',
                          desc: 'Staff can only access specific branches explicitly assigned to their profile.',
                          icon: Share2,
                          iconCls: 'bg-purple-50 text-purple-600'
                        },
                        {
                          id: 'none' as const,
                          title: 'No Branch Access',
                          desc: 'This role does not require physical branch access (e.g., HQ accounting or executives).',
                          icon: Ban,
                          iconCls: 'bg-rose-50 text-rose-600'
                        }
                      ].map((pol) => {
                        const isSelected = newRoleBranchPolicy === pol.id;
                        return (
                          <button
                            key={pol.id}
                            type="button"
                            onClick={() => {
                              setNewRoleBranchPolicy(pol.id);
                              if (pol.id === 'all') {
                                setNewRoleIncludedBranches(roleBranchCatalog.map((b) => b.name));
                              } else if (pol.id === 'none') {
                                setNewRoleIncludedBranches([]);
                              } else if (newRoleIncludedBranches.length === 0) {
                                setNewRoleIncludedBranches(['Main Branch', 'City Mall']);
                              }
                            }}
                            className={`p-4 rounded-2xl border-2 text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#7C3AED] bg-[#FAF8FF] shadow-xs'
                                : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${pol.iconCls}`}>
                                <pol.icon className="w-4 h-4" />
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full ${
                                  isSelected ? 'border-[5px] border-[#5844A8]' : 'border-2 border-[#D4CCE6]'
                                }`}
                              />
                            </div>
                            <div>
                              <div className="text-xs sm:text-sm font-black text-[#1E1548]">{pol.title}</div>
                              <p className="text-[11px] text-[#7B748C] mt-1 leading-relaxed">{pol.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Middle Card: Branch Access Preview (2-Column Grid) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-black text-[#1E1548]">Branch Access Preview</h4>
                        <p className="text-[11px] text-[#7B748C] mt-0.5">
                          {newRoleBranchPolicy === 'assigned'
                            ? 'Tap branches below to include or exclude them by default.'
                            : `This shows the ${includedCount} branches that will be included by default for staff using this role.`}
                        </p>
                      </div>
                      <span className="text-[11px] font-black text-[#5844A8] bg-[#F3EEFA] px-3 py-1 rounded-full shrink-0">
                        {includedCount} of {roleBranchCatalog.length} Included
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {roleBranchCatalog.map((br) => {
                        const isIncluded =
                          newRoleBranchPolicy === 'all' ||
                          (newRoleBranchPolicy === 'assigned' && newRoleIncludedBranches.includes(br.name));
                        return (
                          <button
                            key={br.name}
                            type="button"
                            onClick={() => {
                              if (newRoleBranchPolicy !== 'assigned') {
                                setNewRoleBranchPolicy('assigned');
                              }
                              setNewRoleIncludedBranches((prev) =>
                                prev.includes(br.name) ? prev.filter((x) => x !== br.name) : [...prev, br.name]
                              );
                            }}
                            className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                              isIncluded
                                ? 'border-[#E5DEF5] bg-[#FAF8FF]/60 hover:border-[#5844A8]/50'
                                : 'border-gray-200 bg-gray-50/70 opacity-75 hover:opacity-100'
                            }`}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div
                                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${br.grad} text-white flex items-center justify-center shrink-0 shadow-xs`}
                              >
                                <Store className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-xs sm:text-sm font-black text-[#1E1548] truncate">{br.name}</div>
                                <div className="text-[11px] text-[#8C84A0] truncate">{br.location}</div>
                              </div>
                            </div>
                            <span
                              className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1 ${
                                isIncluded
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-gray-100 text-gray-500 border border-gray-200'
                              }`}
                            >
                              {isIncluded ? (
                                <>
                                  <Check className="w-3 h-3" /> Included
                                </>
                              ) : (
                                'Excluded'
                              )}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lavender Summary Banner */}
                  <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E5DAF9] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1E1548]">
                        Branch Access Summary:{' '}
                        <span className="text-[#5844A8]">
                          {newRoleBranchPolicy === 'all'
                            ? 'All Branches'
                            : newRoleBranchPolicy === 'assigned'
                            ? `Assigned Branches Only (${includedCount})`
                            : 'No Branch Access'}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#6B657E] mt-0.5">
                        {newRoleBranchPolicy === 'all'
                          ? `Staff with this role will be granted access to all ${roleBranchCatalog.length} active branches in your organization.`
                          : newRoleBranchPolicy === 'assigned'
                          ? `Staff will only access the ${includedCount} selected branch${includedCount === 1 ? '' : 'es'} assigned to their profile.`
                          : 'Staff with this role will operate at headquarters level without physical branch access.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 Bottom Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <button
                      type="button"
                      onClick={() => setAddRoleStep(2)}
                      className="px-5 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAddRoleStep(4)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* STEP 4: REVIEW ROLE DETAILS (37.png)              */}
              {/* ================================================= */}
              {addRoleStep === 4 && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-[#1E1548]">Review Role Details</h3>
                    <p className="text-xs text-[#7B748C] mt-0.5">Review the role configuration before saving.</p>
                  </div>

                  {/* Card 1: Role Information */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                        Role Information
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddRoleStep(1)}
                        className="text-xs font-bold text-[#5844A8] bg-[#F8F5FF] hover:bg-[#EFE9FB] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-[#F3EEFA] text-[#7C3AED] flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-black text-[#1E1548]">{newRoleName.trim() || 'Untitled Role'}</span>
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F5F3FF] text-[#7C3AED]">
                            {newRoleCategory === 'Custom' ? 'Custom Role' : 'System Role'}
                          </span>
                        </div>
                        <p className="text-xs text-[#6B657E] mt-1 leading-relaxed">{newRoleDesc}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-3 border-t border-[#F4F0FA] text-xs">
                      <div className="flex items-center gap-1.5 text-[#7B748C]">
                        <ShieldCheck className="w-3.5 h-3.5 text-[#8C84A0]" />
                        <span>Access Level:</span>
                        <span className="font-black text-[#1E1548]">{newRoleAccessLevel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#7B748C]">
                        <MapPin className="w-3.5 h-3.5 text-[#8C84A0]" />
                        <span>Visible to:</span>
                        <span className="font-black text-[#1E1548]">{newRoleVisibility}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[#7B748C]">
                        <span>Status:</span>
                        <span className={`font-black flex items-center gap-1 ${newRoleActive ? 'text-emerald-600' : 'text-gray-500'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${newRoleActive ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                          {newRoleActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Permission Summary */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                        Permission Summary
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddRoleStep(2)}
                        className="text-xs font-bold text-[#5844A8] bg-[#F8F5FF] hover:bg-[#EFE9FB] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-black text-[#5844A8]">
                      <span className="w-6 h-6 rounded-full bg-[#F3EEFA] flex items-center justify-center">
                        <Key className="w-3.5 h-3.5" />
                      </span>
                      <span>
                        {enabledModules.length} of {newRoleModules.length} modules enabled
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {enabledModules.length > 0 ? (
                        enabledModules.map((mod) => {
                          const vis = moduleVisuals[mod.id] || moduleVisuals.campaigns;
                          const IconComp = vis.icon;
                          return (
                            <span
                              key={mod.id}
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${vis.pillCls}`}
                            >
                              <IconComp className="w-3.5 h-3.5" />
                              <span>{mod.name}</span>
                            </span>
                          );
                        })
                      ) : (
                        <span className="text-xs text-[#8C84A0] font-semibold">No modules enabled yet</span>
                      )}
                    </div>
                  </div>

                  {/* Card 3: Branch Access Policy */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-[#1E1548] flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#7C3AED]" />
                        Branch Access Policy
                      </span>
                      <button
                        type="button"
                        onClick={() => setAddRoleStep(3)}
                        className="text-xs font-bold text-[#5844A8] bg-[#F8F5FF] hover:bg-[#EFE9FB] px-3 py-1 rounded-full flex items-center gap-1 cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#F3EEFA] text-[#5844A8] flex items-center justify-center shrink-0">
                        <Globe className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5">
                        <div className="text-sm font-black text-[#1E1548]">
                          {newRoleBranchPolicy === 'all'
                            ? 'All Branches'
                            : newRoleBranchPolicy === 'assigned'
                            ? 'Assigned Branches Only'
                            : 'No Branch Access'}
                        </div>
                        <p className="text-xs text-[#6B657E]">
                          {newRoleBranchPolicy === 'all'
                            ? 'Staff with this role can access all branches in your organization.'
                            : newRoleBranchPolicy === 'assigned'
                            ? 'Staff can only access the specific branches included for this role.'
                            : 'This role does not require physical branch access.'}
                        </p>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5F2FA] text-[11px] font-bold text-[#5E5870]">
                          <Store className="w-3 h-3 text-[#5844A8]" />
                          {includedCount} {includedCount === 1 ? 'branch' : 'branches'} included
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Soft Lavender Inheritance Notice */}
                  <div className="p-4 rounded-2xl bg-[#F8F5FF] border border-[#E5DAF9] flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-[#1E1548]">
                        This role can be assigned to staff members and will define their software access in Loyaltics.
                      </div>
                      <p className="text-[11px] text-[#6B657E] mt-1 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5 text-[#5844A8] shrink-0" />
                        <span>Any staff members assigned to this role will inherit the permissions and branch access settings defined above.</span>
                      </p>
                    </div>
                  </div>

                  {/* Bottom Action Row */}
                  <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#EFEAF7]">
                    <button
                      type="button"
                      onClick={() => handleSaveRole(true)}
                      className="px-6 py-2.5 bg-white border border-[#E5DEF5] hover:border-[#5844A8]/50 text-[#1E1548] rounded-full text-xs font-black shadow-2xs cursor-pointer transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveRole(false)}
                      className="px-7 py-2.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-black shadow-md flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <span>{editingRoleId ? 'Save Changes' : 'Save Role'}</span>
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ======================================================== */}
        {/* STAFF DETAIL PROFILE VIEW (iPad Pro 12.9_ - 16, 17, 18, 19) */}
        {/* ======================================================== */}
        {selectedStaffId && !isAddStaffOpen && !isAddRoleOpen && (() => {
          const toggleSuspendStaff = () => {
            const nextStatus = activeStaff.status === 'Disabled' ? 'Active' : 'Disabled';
            setStaffMembers((prev) =>
              prev.map((s) => (s.id === activeStaff.id ? { ...s, status: nextStatus, accountStatus: nextStatus } : s))
            );
            triggerToast(
              nextStatus === 'Disabled'
                ? `${activeStaff.name}'s account has been suspended`
                : `${activeStaff.name}'s account has been reactivated`
            );
          };

          const cycleModuleStatus = (modId: string) => {
            setProfileModules((prev) =>
              prev.map((m) => {
                if (m.id !== modId) return m;
                const next =
                  m.status === 'view_manage'
                    ? 'view_only'
                    : m.status === 'view_only'
                    ? 'no_access'
                    : 'view_manage';
                return { ...m, status: next };
              })
            );
          };

          const profileActivityGroups = [
            {
              dateLabel: 'Today, 23 Apr 2024',
              items: [
                { id: 'a1', time: '10:24 AM', title: 'Activated Summer Rewards campaign', desc: 'Published 2x bonus points campaign across Main Branch.', module: 'Campaigns', badgeCls: 'bg-purple-50 text-[#5844A8]', icon: Megaphone, iconCls: 'bg-purple-100 text-[#5844A8]' },
                { id: 'a2', time: '09:15 AM', title: 'Approved reward claim #CUST2847', desc: 'Verified 200-point free cappuccino redemption at counter.', module: 'Rewards', badgeCls: 'bg-emerald-50 text-emerald-700', icon: Gift, iconCls: 'bg-emerald-100 text-emerald-700' },
                { id: 'a3', time: '08:42 AM', title: 'Generated 25 tabletop QR codes', desc: 'Exported print-ready QR pack for Sector 18 dining area.', module: 'QR Codes', badgeCls: 'bg-sky-50 text-sky-700', icon: QrCode, iconCls: 'bg-sky-100 text-sky-700' }
              ]
            },
            {
              dateLabel: 'Yesterday, 22 Apr 2024',
              items: [
                { id: 'a4', time: '06:10 PM', title: 'Updated Cold Brew seasonal pricing', desc: 'Adjusted iced beverages menu pricing for Main Branch & City Mall.', module: 'Menu', badgeCls: 'bg-amber-50 text-amber-800', icon: Coffee, iconCls: 'bg-amber-100 text-amber-700' },
                { id: 'a5', time: '03:45 PM', title: 'Upgraded customer Priya Nair to Gold Tier', desc: 'Manual tier review after crossing 1,500 loyalty points.', module: 'Customers', badgeCls: 'bg-pink-50 text-pink-700', icon: Users, iconCls: 'bg-pink-100 text-pink-700' },
                { id: 'a6', time: '11:20 AM', title: 'Exported weekly shift performance report', desc: 'Downloaded CSV summary for 18 Noida branch staff.', module: 'Reports', badgeCls: 'bg-indigo-50 text-indigo-700', icon: BarChart2, iconCls: 'bg-indigo-100 text-indigo-700' }
              ]
            },
            {
              dateLabel: '21 Apr 2024',
              items: [
                { id: 'a7', time: '05:05 PM', title: 'Updated City Mall opening hours', desc: 'Extended weekend closing time to 11:30 PM.', module: 'Branch', badgeCls: 'bg-teal-50 text-teal-700', icon: Building2, iconCls: 'bg-teal-100 text-teal-700' },
                { id: 'a8', time: '01:18 PM', title: 'Completed 2FA security verification', desc: 'Confirmed trusted iPad POS device for Main Branch.', module: 'Account', badgeCls: 'bg-slate-100 text-slate-700', icon: ShieldCheck, iconCls: 'bg-slate-100 text-slate-700' }
              ]
            }
          ];

          const quickFilterCounts = [
            { id: 'all', label: 'All Activity', count: 24 },
            { id: 'Campaigns', label: 'Campaigns', count: 6 },
            { id: 'Rewards', label: 'Rewards & Approvals', count: 5 },
            { id: 'QR Codes', label: 'QR Codes', count: 4 },
            { id: 'Menu', label: 'Menu', count: 4 },
            { id: 'Customers', label: 'Customers', count: 3 },
            { id: 'Branch', label: 'Branch Settings', count: 2 },
            { id: 'Reports', label: 'Reports', count: 2 },
            { id: 'Account', label: 'Account', count: 2 }
          ];

          const filteredGroups = profileActivityGroups
            .map((grp) => ({
              ...grp,
              items:
                profileActivityFilter === 'all'
                  ? grp.items
                  : grp.items.filter((it) => it.module === profileActivityFilter)
            }))
            .filter((grp) => grp.items.length > 0);

          return (
            <div className="space-y-4 sm:space-y-5 animate-in fade-in duration-200">
              {/* Top Action Bar */}
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedStaffId(null);
                    setIsMoreActionsOpen(false);
                    setIsEditingPersonal(false);
                  }}
                  className="text-xs font-bold text-[#1E1548] hover:text-[#5844A8] flex items-center gap-1.5 cursor-pointer bg-white px-3.5 py-2 rounded-full border border-[#EFEAF7] shadow-2xs"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Directory</span>
                </button>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsMoreActionsOpen((prev) => !prev)}
                    className="px-4 py-2 bg-white border border-[#EFEAF7] hover:border-[#5844A8]/50 rounded-full text-xs font-bold text-[#1E1548] shadow-2xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>More Actions</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0]" />
                  </button>

                  {isMoreActionsOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl border border-[#EFEAF7] shadow-lg py-1.5 z-30 text-xs">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          setProfileTab('overview');
                          setIsEditingPersonal(true);
                        }}
                        className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5 text-[#5844A8]" /> Edit Details
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          setProfileTab('permissions');
                        }}
                        className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-3.5 h-3.5 text-[#5844A8]" /> Change Role
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          triggerToast(`Password reset link sent to ${activeStaff.email}`);
                        }}
                        className="w-full px-3.5 py-2 text-left font-bold text-[#1E1548] hover:bg-[#FAF8FF] flex items-center gap-2 cursor-pointer"
                      >
                        <Key className="w-3.5 h-3.5 text-[#5844A8]" /> Reset Password
                      </button>
                      <div className="my-1 border-t border-[#F2ECF9]" />
                      <button
                        type="button"
                        onClick={() => {
                          setIsMoreActionsOpen(false);
                          toggleSuspendStaff();
                        }}
                        className="w-full px-3.5 py-2 text-left font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        {activeStaff.status === 'Disabled' ? 'Activate Account' : 'Suspend Account'}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Hero Card (Matching iPad Pro 12.9_ - 16/17/18/19) */}
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#240B4C] to-[#5844A8] flex items-center justify-center text-white font-black text-xl shadow-sm shrink-0 ring-4 ring-[#F3EEFA]">
                    {activeStaff.initials}
                  </div>
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg sm:text-xl font-black text-[#1E1548]">{activeStaff.name}</h2>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          activeStaff.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : activeStaff.status === 'Pending'
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {activeStaff.status}
                      </span>
                    </div>
                    <div className="text-xs text-[#5E5870] font-bold">
                      {activeStaff.role} <span className="text-[#D4CCE6] mx-1">|</span> {activeStaff.employeeId}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#7B748C] font-medium pt-0.5">
                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-[#5844A8]" /> {activeStaff.phone}</span>
                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-[#5844A8]" /> {activeStaff.email}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#5844A8]" /> Joined {activeStaff.joinDate}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-[#5844A8]" /> {activeStaff.branch}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full-Width 4-Tab Pill Bar (Matching iPad Pro 12.9_ - 16/17/18/19) */}
              <div className="grid grid-cols-4 gap-1.5 bg-[#F2ECF9] p-1.5 rounded-full border border-[#E5DAF9]">
                {[
                  { id: 'overview', label: 'Overview' },
                  { id: 'permissions', label: 'Permissions' },
                  { id: 'branches', label: 'Branches' },
                  { id: 'activity', label: 'Activity' }
                ].map((tb) => (
                  <button
                    key={tb.id}
                    type="button"
                    onClick={() => setProfileTab(tb.id as any)}
                    className={`py-2 px-2 rounded-full text-xs font-black transition-all cursor-pointer text-center ${
                      profileTab === tb.id
                        ? 'bg-[#240B4C] text-white shadow-xs'
                        : 'text-[#6B657E] hover:text-[#1E1548]'
                    }`}
                  >
                    {tb.label}
                  </button>
                ))}
              </div>

              {/* ================================================= */}
              {/* TAB 1: PROFILE OVERVIEW (iPad Pro 12.9_ - 16)     */}
              {/* ================================================= */}
              {profileTab === 'overview' && (
                <div className="space-y-4">
                  {/* 5 Stat Cards in 1 row on Tablet (md:grid-cols-5) */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs">
                      <span className="text-[10px] text-[#8C84A0] font-bold uppercase tracking-wider">Total Shifts</span>
                      <div className="text-xl font-black text-[#1E1548] mt-1">{activeStaff.shifts || 28}</div>
                      <span className="text-[10px] text-emerald-600 font-bold">↑ 12% vs last month</span>
                    </div>
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs">
                      <span className="text-[10px] text-[#8C84A0] font-bold uppercase tracking-wider">Hours Logged</span>
                      <div className="text-xl font-black text-[#1E1548] mt-1">{(activeStaff.hours || 181) * 8} hrs</div>
                      <span className="text-[10px] text-[#7B748C] font-bold">On schedule</span>
                    </div>
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs">
                      <span className="text-[10px] text-[#8C84A0] font-bold uppercase tracking-wider">Tasks Completed</span>
                      <div className="text-xl font-black text-[#1E1548] mt-1">{(activeStaff.tasks || 221) * 4}</div>
                      <span className="text-[10px] text-emerald-600 font-bold">99.2% accuracy</span>
                    </div>
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs">
                      <span className="text-[10px] text-[#8C84A0] font-bold uppercase tracking-wider">Last Active</span>
                      <div className="text-lg font-black text-[#1E1548] mt-1 truncate">{activeStaff.lastActive}</div>
                      <span className="text-[10px] text-[#7B748C] font-bold">23 Apr 2024</span>
                    </div>
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#EFEAF7] shadow-2xs col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-[#8C84A0] font-bold uppercase tracking-wider">Assigned Branch</span>
                      <div className="text-base font-black text-[#1E1548] mt-1 truncate">{activeStaff.branch}</div>
                      <span className="text-[10px] text-[#5844A8] font-bold">Sector 18</span>
                    </div>
                  </div>

                  {/* 2-Column Row: Personal Information | Access & Role */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Personal Information */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#1E1548]">Personal Information</span>
                        <button
                          type="button"
                          onClick={() => {
                            if (isEditingPersonal) {
                              setIsEditingPersonal(false);
                              triggerToast('Personal information updated');
                            } else {
                              setIsEditingPersonal(true);
                            }
                          }}
                          className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>{isEditingPersonal ? 'Save' : 'Edit'}</span>
                        </button>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex items-center justify-between py-1.5 border-b border-[#F5F2FA] gap-2">
                          <span className="text-[#8C84A0] font-bold">Full Name</span>
                          {isEditingPersonal ? (
                            <input
                              type="text"
                              value={activeStaff.name}
                              onChange={(e) =>
                                setStaffMembers((prev) =>
                                  prev.map((s) => (s.id === activeStaff.id ? { ...s, name: e.target.value } : s))
                                )
                              }
                              className="bg-[#FAF8FF] border border-[#D9CEF2] rounded-lg px-2.5 py-1 text-xs font-black text-[#1E1548] text-right outline-none"
                            />
                          ) : (
                            <span className="font-black text-[#1E1548]">{activeStaff.name}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#F5F2FA]">
                          <span className="text-[#8C84A0] font-bold">Employee ID</span>
                          <span className="font-black text-[#1E1548]">{activeStaff.employeeId}</span>
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#F5F2FA] gap-2">
                          <span className="text-[#8C84A0] font-bold">Phone</span>
                          {isEditingPersonal ? (
                            <input
                              type="text"
                              value={activeStaff.phone}
                              onChange={(e) =>
                                setStaffMembers((prev) =>
                                  prev.map((s) => (s.id === activeStaff.id ? { ...s, phone: e.target.value } : s))
                                )
                              }
                              className="bg-[#FAF8FF] border border-[#D9CEF2] rounded-lg px-2.5 py-1 text-xs font-black text-[#1E1548] text-right outline-none"
                            />
                          ) : (
                            <span className="font-black text-[#1E1548]">{activeStaff.phone}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-1.5 border-b border-[#F5F2FA] gap-2">
                          <span className="text-[#8C84A0] font-bold">Email</span>
                          {isEditingPersonal ? (
                            <input
                              type="email"
                              value={activeStaff.email}
                              onChange={(e) =>
                                setStaffMembers((prev) =>
                                  prev.map((s) => (s.id === activeStaff.id ? { ...s, email: e.target.value } : s))
                                )
                              }
                              className="bg-[#FAF8FF] border border-[#D9CEF2] rounded-lg px-2.5 py-1 text-xs font-black text-[#1E1548] text-right outline-none"
                            />
                          ) : (
                            <span className="font-black text-[#1E1548] truncate">{activeStaff.email}</span>
                          )}
                        </div>
                        <div className="flex items-center justify-between py-1.5">
                          <span className="text-[#8C84A0] font-bold">Date Joined</span>
                          <span className="font-black text-[#1E1548]">{activeStaff.joinDate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Access & Role */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#1E1548]">Access &amp; Role</span>
                        <button
                          type="button"
                          onClick={() => setProfileTab('permissions')}
                          className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7]">
                          <span className="text-[10px] text-[#8C84A0] font-bold uppercase">Current Role</span>
                          <div className="font-black text-sm text-[#1E1548] mt-0.5">{activeStaff.role}</div>
                          <p className="text-[11px] text-[#6B657E] mt-1 leading-relaxed">
                            Oversees branch operations, manages staff, and has access to core modules for their assigned locations.
                          </p>
                        </div>

                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[#8C84A0] font-bold">Branch Access</span>
                            <button
                              type="button"
                              onClick={() => setProfileTab('branches')}
                              className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                            >
                              Manage
                            </button>
                          </div>
                          {[
                            { name: 'Main Branch', badge: 'Primary Branch', cls: 'bg-[#F3EEFA] text-[#5844A8]' },
                            { name: 'City Mall', badge: 'View & Manage', cls: 'bg-indigo-50 text-indigo-700' },
                            { name: 'Riverside', badge: 'View Only', cls: 'bg-amber-50 text-amber-800' }
                          ].map((b) => (
                            <div key={b.name} className="flex items-center justify-between py-1">
                              <span className="flex items-center gap-1.5 font-bold text-[#1E1548]">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                {b.name}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${b.cls}`}>
                                {b.badge}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full-Width Current Permissions Card (3-col grid on tablet) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#1E1548]">Current Permissions</h3>
                        <p className="text-[11px] text-[#8C84A0] mt-0.5">Active modules granted under {activeStaff.role}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setProfileTab('permissions')}
                        className="text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                      >
                        Manage →
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { title: 'Campaigns', sub: 'Create & manage promotions', icon: Megaphone, iconCls: 'bg-purple-50 text-[#5844A8]' },
                        { title: 'Approvals', sub: 'Review & approve claims', icon: CheckCircle2, iconCls: 'bg-emerald-50 text-emerald-600' },
                        { title: 'QR Codes', sub: 'Generate & print stand QRs', icon: QrCode, iconCls: 'bg-sky-50 text-sky-600' },
                        { title: 'Customer Data', sub: 'View profiles & tiers', icon: Users, iconCls: 'bg-pink-50 text-pink-600' },
                        { title: 'Menu', sub: 'Edit items & availability', icon: Coffee, iconCls: 'bg-amber-50 text-amber-700' },
                        { title: 'Reports', sub: 'View branch analytics', icon: BarChart2, iconCls: 'bg-indigo-50 text-indigo-600' }
                      ].map((perm) => (
                        <div
                          key={perm.title}
                          onClick={() => setProfileTab('permissions')}
                          className="p-3 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] hover:border-[#D9CEF2] flex items-center gap-3 cursor-pointer transition-colors"
                        >
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${perm.iconCls}`}>
                            <perm.icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-black text-[#1E1548] truncate">{perm.title}</div>
                            <div className="text-[10px] text-[#7B748C] truncate">{perm.sub}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom 2-Column Row: Quick Actions | Notes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Quick Actions */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                      <h3 className="text-sm font-black text-[#1E1548]">Quick Actions</h3>
                      <div className="grid grid-cols-2 gap-2.5 text-xs">
                        <button
                          type="button"
                          onClick={() => setIsEditingPersonal(true)}
                          className="p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] font-bold text-[#1E1548] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#5844A8]" />
                          <span>Edit Details</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileTab('permissions')}
                          className="p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] font-bold text-[#1E1548] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5 text-[#5844A8]" />
                          <span>Change Role</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setProfileTab('branches')}
                          className="p-3 rounded-2xl bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#EFEAF7] font-bold text-[#1E1548] flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Lock className="w-3.5 h-3.5 text-[#5844A8]" />
                          <span>Manage Access</span>
                        </button>
                        <button
                          type="button"
                          onClick={toggleSuspendStaff}
                          className="p-3 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200 font-bold text-rose-700 flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>{activeStaff.status === 'Disabled' ? 'Activate Account' : 'Suspend Account'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs flex flex-col justify-between gap-3">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-black text-[#1E1548]">Notes</h3>
                          <button
                            type="button"
                            onClick={() => {
                              if (isEditingNote) {
                                setIsEditingNote(false);
                                triggerToast('Staff note saved');
                              } else {
                                setIsEditingNote(true);
                              }
                            }}
                            className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>{isEditingNote ? 'Save' : 'Edit'}</span>
                          </button>
                        </div>

                        {isEditingNote ? (
                          <textarea
                            rows={3}
                            value={profileNotes}
                            onChange={(e) => setProfileNotes(e.target.value)}
                            className="w-full p-3 rounded-2xl bg-[#FAF8FF] border border-[#D9CEF2] text-xs text-[#1E1548] font-medium outline-none resize-none"
                          />
                        ) : (
                          <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] text-xs text-[#5E5870] leading-relaxed">
                            {profileNotes}
                          </div>
                        )}
                      </div>
                      <div className="text-[10px] font-semibold text-[#8C84A0]">
                        Last updated 5 Mar 2024 by Riya Merchant
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* TAB 2: PROFILE PERMISSIONS (iPad Pro 12.9_ - 18)  */}
              {/* ================================================= */}
              {profileTab === 'permissions' && (
                <div className="space-y-4">
                  {/* Top 2-Col: Access & Role | Permission Level */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-black text-[#1E1548]">Access &amp; Role</span>
                        <button
                          type="button"
                          onClick={() => triggerToast('Role selector unlocked for editing')}
                          className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-[#FAF8FF] border border-[#EFEAF7] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-black text-[#1E1548]">{activeStaff.role}</span>
                          <span className="text-[10px] font-bold bg-[#F3EEFA] text-[#5844A8] px-2.5 py-0.5 rounded-full">
                            {activeStaff.roleType} Role
                          </span>
                        </div>
                        <p className="text-xs text-[#6B657E] leading-relaxed">
                          Manages day-to-day branch operations, rewards approvals, staff scheduling, and QR inventory for assigned outlets.
                        </p>
                      </div>
                    </div>

                    {/* Permission Level Interactive Radio Cards */}
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-2.5">
                      <span className="text-sm font-black text-[#1E1548] block">Permission Level</span>
                      <div className="space-y-2">
                        {[
                          { id: 'view_only' as const, label: 'View Only', desc: 'Can inspect dashboards and reports without making edits.' },
                          { id: 'view_manage' as const, label: 'View & Manage', desc: 'Can manage daily operations, campaigns, and approvals.' },
                          { id: 'full' as const, label: 'Full Access', desc: 'Unrestricted administrative control including settings.' }
                        ].map((lvl) => {
                          const isSelected = profilePermissionLevel === lvl.id;
                          return (
                            <button
                              key={lvl.id}
                              type="button"
                              onClick={() => {
                                setProfilePermissionLevel(lvl.id);
                                triggerToast(`Permission level set to ${lvl.label}`);
                              }}
                              className={`w-full p-3 rounded-2xl border-2 flex items-center justify-between gap-3 text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'border-[#5844A8] bg-[#F5F1FF]'
                                  : 'border-[#EFEAF7] bg-white hover:border-[#D9CEF2]'
                              }`}
                            >
                              <div>
                                <div className="text-xs font-black text-[#1E1548]">{lvl.label}</div>
                                <div className="text-[10px] text-[#7B748C] mt-0.5">{lvl.desc}</div>
                              </div>
                              <div
                                className={`w-4 h-4 rounded-full shrink-0 ${
                                  isSelected ? 'border-[5px] border-[#5844A8]' : 'border-2 border-[#D4CCE6]'
                                }`}
                              />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Middle: Enabled Modules (4-Column Grid on Tablet) */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-black text-[#1E1548]">Enabled Modules</h3>
                        <p className="text-[11px] text-[#8C84A0] mt-0.5">Tap any module card to cycle its access level</p>
                      </div>
                      <span className="text-[11px] font-bold text-[#5844A8] bg-[#F3EEFA] px-2.5 py-1 rounded-full">
                        {profileModules.filter((m) => m.status !== 'no_access').length} of {profileModules.length} Enabled
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {profileModules.map((mod) => (
                        <button
                          key={mod.id}
                          type="button"
                          onClick={() => cycleModuleStatus(mod.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer space-y-2 ${
                            mod.status === 'view_manage'
                              ? 'bg-[#FAF8FF] border-[#DCD1F5] hover:border-[#5844A8]'
                              : mod.status === 'view_only'
                              ? 'bg-[#FFFBEB]/70 border-[#FDE68A] hover:border-amber-400'
                              : 'bg-gray-50/80 border-gray-200 hover:border-rose-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-black text-[#1E1548] truncate">{mod.name}</span>
                            {mod.status === 'view_manage' ? (
                              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Check className="w-3 h-3" />
                              </span>
                            ) : mod.status === 'view_only' ? (
                              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <Eye className="w-3 h-3" />
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                                <X className="w-3 h-3" />
                              </span>
                            )}
                          </div>
                          <div
                            className={`text-[10px] font-bold ${
                              mod.status === 'view_manage'
                                ? 'text-emerald-700'
                                : mod.status === 'view_only'
                                ? 'text-amber-700'
                                : 'text-rose-600'
                            }`}
                          >
                            {mod.status === 'view_manage'
                              ? 'View & Manage'
                              : mod.status === 'view_only'
                              ? 'View Only'
                              : 'No Access'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bottom 2-Col: Approval Rights | Security & Audit */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                      <h3 className="text-sm font-black text-[#1E1548]">Approval Rights</h3>
                      <div className="divide-y divide-[#F5F2FA] text-xs">
                        {[
                          { key: 'approveRewards' as const, label: 'Can approve reward claims' },
                          { key: 'reviewRedemptions' as const, label: 'Can review redemption requests' },
                          { key: 'editCampaignStatus' as const, label: 'Can edit campaign status' }
                        ].map((right) => {
                          const enabled = profileApprovalRights[right.key];
                          return (
                            <div key={right.key} className="py-2.5 flex items-center justify-between gap-2">
                              <span className="font-bold text-[#5E5870]">{right.label}</span>
                              <button
                                type="button"
                                onClick={() =>
                                  setProfileApprovalRights((prev) => ({ ...prev, [right.key]: !prev[right.key] }))
                                }
                                className={`px-3 py-1 rounded-full text-[11px] font-black cursor-pointer transition-colors ${
                                  enabled
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-gray-100 text-gray-500 border border-gray-200'
                                }`}
                              >
                                {enabled ? 'Yes' : 'No'}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="bg-[#F8F5FF] rounded-3xl p-4 sm:p-5 border border-[#E5DAF9] flex flex-col justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-white border border-[#E5DAF9] text-[#5844A8] flex items-center justify-center shrink-0">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-[#1E1548]">Security &amp; Audit</h3>
                          <p className="text-xs text-[#6B657E] mt-1 leading-relaxed">
                            All permission changes take effect immediately across mobile POS and merchant web sessions, and are automatically logged in the security audit trail.
                          </p>
                        </div>
                      </div>
                      <div className="text-[11px] font-bold text-[#5844A8]">
                        Last audited: 23 Apr 2024 • Verified by Riya Merchant
                      </div>
                    </div>
                  </div>

                  {/* Footer 2 Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Permissions saved for ${activeStaff.name}`)}
                      className="w-full py-3 bg-white border border-[#E5DEF5] hover:border-[#5844A8] text-[#1E1548] rounded-full text-xs font-black shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#5844A8]" />
                      <span>Save Permission Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleSuspendStaff}
                      className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-full text-xs font-black flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>{activeStaff.status === 'Disabled' ? 'Restore Access' : 'Suspend Access'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* TAB 3: PROFILE BRANCHES (iPad Pro 12.9_ - 19)     */}
              {/* ================================================= */}
              {profileTab === 'branches' && (
                <div className="space-y-4">
                  {/* Branch Access Summary — 5 Mini Stat Tiles */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3">
                    <h3 className="text-sm font-black text-[#1E1548]">Branch Access Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
                      <div className="p-3 rounded-2xl bg-[#F5F1FF] border border-[#E5DAF9]">
                        <div className="text-lg font-black text-[#1E1548]">3</div>
                        <div className="text-[10px] font-bold text-[#6B657E] leading-tight mt-0.5">Total Assigned Branches</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FAF4FF] border border-[#EDE0FB]">
                        <div className="text-sm font-black text-[#5844A8] truncate mt-0.5">{activeStaff.branch}</div>
                        <div className="text-[10px] font-bold text-[#6B657E] leading-tight mt-1">Primary Branch</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EFE9FB] border border-[#DFD2F7]">
                        <div className="text-lg font-black text-[#5844A8]">1</div>
                        <div className="text-[10px] font-bold text-[#5844A8] leading-tight mt-0.5">Branches with Full Access</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#EEF2FF] border border-[#DDE4FF]">
                        <div className="text-lg font-black text-indigo-700">1</div>
                        <div className="text-[10px] font-bold text-indigo-700 leading-tight mt-0.5">View &amp; Manage</div>
                      </div>
                      <div className="p-3 rounded-2xl bg-[#FFF7ED] border border-[#FED7AA] col-span-2 sm:col-span-1">
                        <div className="text-lg font-black text-amber-800">1</div>
                        <div className="text-[10px] font-bold text-amber-800 leading-tight mt-0.5">View Only</div>
                      </div>
                    </div>
                  </div>

                  {/* Assigned Branches Rich Rows */}
                  <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-[#1E1548]">Assigned Branches</h3>
                      <button
                        type="button"
                        onClick={() => triggerToast('Branch coverage manager opened')}
                        className="px-3.5 py-1.5 bg-[#240B4C] hover:bg-[#321266] text-white rounded-full text-xs font-bold cursor-pointer transition-colors"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3">
                      {[
                        {
                          name: 'Main Branch',
                          isPrimary: true,
                          status: 'Active',
                          address: '123 MG Road, Sector 18, Noida, UP',
                          actions: ['POS Operations', 'Customers', 'Campaigns', 'Reports', 'Menu'],
                          access: 'Full Access',
                          accessCls: 'bg-[#F3EEFA] text-[#5844A8] border-[#DFD2F7]',
                          grad: 'from-purple-600 to-indigo-700'
                        },
                        {
                          name: 'City Mall',
                          isPrimary: false,
                          status: 'Active',
                          address: 'City Mall, Ground Floor, Sector 32, Noida, UP',
                          actions: ['POS Operations', 'Customers', 'Campaigns'],
                          access: 'View & Manage',
                          accessCls: 'bg-indigo-50 text-indigo-700 border-indigo-200',
                          grad: 'from-amber-500 to-orange-600'
                        },
                        {
                          name: 'Riverside',
                          isPrimary: false,
                          status: 'Active',
                          address: 'Riverside Plaza, Block C, Sector 62, Noida, UP',
                          actions: ['Reports', 'Menu'],
                          access: 'View Only',
                          accessCls: 'bg-amber-50 text-amber-800 border-amber-200',
                          grad: 'from-teal-500 to-emerald-600'
                        }
                      ].map((br) => (
                        <div
                          key={br.name}
                          className="p-4 rounded-2xl border border-[#EFEAF7] bg-[#FAF8FF]/60 hover:border-[#D9CEF2] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                        >
                          <div className="flex items-start gap-3.5 min-w-0">
                            <div
                              className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${br.grad} text-white flex items-center justify-center shrink-0 shadow-xs`}
                            >
                              <Store className="w-5 h-5" />
                            </div>
                            <div className="space-y-1.5 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm font-black text-[#1E1548]">{br.name}</span>
                                {br.isPrimary && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#240B4C] text-white">
                                    Primary Branch
                                  </span>
                                )}
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  {br.status}
                                </span>
                              </div>
                              <div className="text-xs text-[#7B748C] flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#8C84A0] shrink-0" />
                                <span className="truncate">{br.address}</span>
                              </div>
                              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                                <span className="text-[10px] font-bold text-[#8C84A0] mr-0.5">Allowed Actions:</span>
                                {br.actions.map((act) => (
                                  <span
                                    key={act}
                                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#EAE2FB] text-[#5E5870]"
                                  >
                                    {act}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="shrink-0 self-start sm:self-center">
                            <span className={`inline-block text-xs font-black px-3 py-1.5 rounded-full border ${br.accessCls}`}>
                              {br.access}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ================================================= */}
              {/* TAB 4: PROFILE ACTIVITY (iPad Pro 12.9_ - 17)     */}
              {/* ================================================= */}
              {profileTab === 'activity' && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Left: Filter Activity Sidebar (4 cols on tablet) */}
                  <div className="md:col-span-4 bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-4 h-fit">
                    <h3 className="text-sm font-black text-[#1E1548]">Filter Activity</h3>

                    <div className="space-y-3">
                      <div>
                        <label className="text-[11px] font-bold text-[#7B748C] block mb-1">Date Range</label>
                        <div className="relative">
                          <select
                            value={profileActivityRange}
                            onChange={(e) => setProfileActivityRange(e.target.value)}
                            className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] rounded-xl px-3 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                          >
                            <option value="Last 30 days">Last 30 days</option>
                            <option value="Last 7 days">Last 7 days</option>
                            <option value="Last 90 days">Last 90 days</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-[#7B748C] block mb-1">Activity Type</label>
                        <div className="relative">
                          <select
                            value={profileActivityFilter}
                            onChange={(e) => setProfileActivityFilter(e.target.value)}
                            className="w-full appearance-none bg-[#FAF8FF] border border-[#E5DEF5] rounded-xl px-3 py-2 pr-8 text-xs font-bold text-[#1E1548] outline-none cursor-pointer"
                          >
                            <option value="all">All Activity Types</option>
                            <option value="Campaigns">Campaigns</option>
                            <option value="Rewards">Rewards &amp; Approvals</option>
                            <option value="QR Codes">QR Codes</option>
                            <option value="Menu">Menu</option>
                            <option value="Customers">Customers</option>
                            <option value="Branch">Branch Settings</option>
                            <option value="Reports">Reports</option>
                            <option value="Account">Account</option>
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-[#8C84A0] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Quick Filters List */}
                    <div className="pt-2 border-t border-[#F2ECF9] space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8C84A0] block mb-1.5">
                        Quick Filters
                      </span>
                      {quickFilterCounts.map((qf) => {
                        const isActive = profileActivityFilter === qf.id;
                        return (
                          <button
                            key={qf.id}
                            type="button"
                            onClick={() => setProfileActivityFilter(qf.id)}
                            className={`w-full px-3 py-2 rounded-full text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? 'bg-[#240B4C] text-white shadow-xs'
                                : 'text-[#5E5870] hover:bg-[#FAF8FF]'
                            }`}
                          >
                            <span className="truncate">{qf.label}</span>
                            <span
                              className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                isActive ? 'bg-white/20 text-white' : 'bg-[#F3EEFA] text-[#5844A8]'
                              }`}
                            >
                              {qf.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right: Date-Grouped Timeline (8 cols on tablet) */}
                  <div className="md:col-span-8 bg-white rounded-3xl p-4 sm:p-5 border border-[#EFEAF7] shadow-2xs space-y-5">
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <h3 className="text-sm sm:text-base font-black text-[#1E1548]">Activity History</h3>
                        <p className="text-[11px] text-[#8C84A0] mt-0.5">
                          Showing {profileActivityFilter === 'all' ? 'all modules' : profileActivityFilter} • {profileActivityRange}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => triggerToast(`Exported ${activeStaff.name}'s activity log (CSV)`)}
                        className="px-3.5 py-1.5 bg-[#FAF8FF] hover:bg-[#F3EEFA] border border-[#E5DEF5] rounded-full text-xs font-bold text-[#1E1548] flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5 text-[#5844A8]" />
                        <span>Export</span>
                      </button>
                    </div>

                    {filteredGroups.length === 0 ? (
                      <div className="py-10 text-center text-xs font-bold text-[#8C84A0]">
                        No activity recorded for this filter in the selected range.
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {filteredGroups.map((group) => (
                          <div key={group.dateLabel} className="space-y-3">
                            <div className="text-[11px] font-black uppercase tracking-wider text-[#5844A8] bg-[#F8F5FF] inline-block px-3 py-1 rounded-full border border-[#EAE2FB]">
                              {group.dateLabel}
                            </div>

                            <div className="relative pl-5 space-y-3.5 before:content-[''] before:absolute before:left-[15px] before:top-3 before:bottom-3 before:w-0.5 before:bg-[#EFEAF7]">
                              {group.items.map((ev) => (
                                <div key={ev.id} className="relative flex items-start gap-3">
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 -ml-5 relative z-10 ring-4 ring-white ${ev.iconCls}`}
                                  >
                                    <ev.icon className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="flex-1 min-w-0 p-3 rounded-2xl bg-[#FAF8FF]/80 border border-[#EFEAF7] space-y-1">
                                    <div className="flex items-start justify-between gap-2">
                                      <span className="text-xs font-black text-[#1E1548]">{ev.title}</span>
                                      <span className="text-[10px] font-bold text-[#8C84A0] whitespace-nowrap shrink-0">
                                        {ev.time}
                                      </span>
                                    </div>
                                    <p className="text-[11px] text-[#6B657E] leading-snug">{ev.desc}</p>
                                    <div className="pt-1">
                                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.badgeCls}`}>
                                        {ev.module}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default TabletStaffView;
