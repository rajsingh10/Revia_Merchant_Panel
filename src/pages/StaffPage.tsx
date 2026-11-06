import React, { useState, useEffect } from 'react';
import { TabletStaffView } from '../components/staff/TabletStaffView';
import { useWallet } from '../context/WalletContext';
import {
  Users,
  Shield,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  UserPlus,
  Edit2,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
  Check,
  X,
  ArrowRight,
  ArrowLeft,
  Clock,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Building2,
  Briefcase,
  Ban,
  Plus,
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchStaffList, inviteStaffMember, updateStaffMember } from '../store/slices/staffSlice';

export interface RoleTemplate {
  id: string;
  name: string;
  isSystem: boolean;
  permissions: Record<string, boolean>;
}

export const SYSTEM_MODULES = [
  { name: 'Dashboard', actions: ['View'] },
  { name: 'Branches', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Customers', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Campaigns', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Staff & Employees', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Loyalty Program', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Promo Codes', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Reward Catalog', actions: ['View', 'Add', 'Edit', 'Delete'] }
];

export const TOTAL_PERMISSIONS_COUNT = SYSTEM_MODULES.reduce((acc, mod) => acc + mod.actions.length, 0);

const generateAllPermissions = (value: boolean) => {
  const perms: Record<string, boolean> = {};
  SYSTEM_MODULES.forEach(mod => {
    mod.actions.forEach(action => {
      perms[`${mod.name}_${action}`] = value;
    });
  });
  return perms;
};

const generateBaristaPermissions = () => {
  const perms = generateAllPermissions(false);
  perms['Dashboard_View'] = true;
  return perms;
};

export const INITIAL_ROLE_TEMPLATES: RoleTemplate[] = [
  {
    id: 'role-owner',
    name: 'Owner (Super Admin)',
    isSystem: true,
    permissions: generateAllPermissions(true)
  },
  {
    id: 'role-manager',
    name: 'Manager',
    isSystem: true,
    permissions: generateAllPermissions(true)
  },
  {
    id: 'role-barista',
    name: 'Barista',
    isSystem: true,
    permissions: generateBaristaPermissions()
  },
  {
    id: 'role-counter',
    name: 'Counter Staff',
    isSystem: true,
    permissions: generateBaristaPermissions()
  }
];

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'Manager' | 'Staff' | 'Counter' | 'Owner';
  branch: string;
  joinedOn: string;
  status: 'Active' | 'Updated' | 'Revoked' | 'Inactive';
  staffId: string;
  workLocation: string;
  employeeType: 'Full-time' | 'Part-time' | 'Contract';
  reportingTo: string;
  roleDescription: string;
  accessLevel: string;
  avatarUrl?: string;
  initials: string;
  avatarBg: string;
  avatarTextColor: string;
  assignedBranches: string[];
  permissions: {
    posOperations: boolean;
    campaignManagement: boolean;
    reportsAnalytics: boolean;
    staffManagement: boolean;
    customerData: boolean;
    settingsConfig: boolean;
  };
}

const INITIAL_STAFF_MEMBERS: StaffMember[] = [
  {
    id: 'STF-1042',
    name: 'Liam Vance',
    email: 'liam.vance@loyaltycs.co',
    phone: '+91 87654 32109',
    role: 'Manager',
    branch: 'Connaught Place',
    joinedOn: '12 Apr 2025',
    status: 'Active',
    staffId: '#STF-1042',
    workLocation: 'Downtown Flagship',
    employeeType: 'Full-time',
    reportingTo: 'Elena Rostova (General Manager)',
    roleDescription: 'Manages day-to-day store operations, staff, and customer service.',
    accessLevel: 'POS Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    initials: 'LV',
    avatarBg: 'bg-[#FEF3C7]',
    avatarTextColor: 'text-[#B45309]',
    assignedBranches: ['Downtown Flagship', 'CP - Bakery', 'Northside Mall'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: true,
      staffManagement: true,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1055',
    name: 'Priya Nair',
    email: 'priya.nair@loyaltycs.co',
    phone: '+91 87654 44211',
    role: 'Staff',
    branch: 'CP - Bakery',
    joinedOn: '10 Apr 2025',
    status: 'Updated',
    staffId: '#STF-1055',
    workLocation: 'CP - Bakery',
    employeeType: 'Full-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Bakery associate overseeing guest loyalty stamp allocations and orders.',
    accessLevel: 'Cashier & Loyalty',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    initials: 'PN',
    avatarBg: 'bg-[#DBEAFE]',
    avatarTextColor: 'text-[#1D4ED8]',
    assignedBranches: ['CP - Bakery'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1068',
    name: 'Karan Verma',
    email: 'karan.verma@loyaltycs.co',
    phone: '+91 87654 55322',
    role: 'Counter',
    branch: 'Downtown Flagship',
    joinedOn: '08 Apr 2025',
    status: 'Revoked',
    staffId: '#STF-1068',
    workLocation: 'Downtown Flagship',
    employeeType: 'Part-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Front desk billing counter clerk.',
    accessLevel: 'Counter Order Only',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    initials: 'KV',
    avatarBg: 'bg-[#FFEDD5]',
    avatarTextColor: 'text-[#C2410C]',
    assignedBranches: ['Downtown Flagship'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: false,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1082',
    name: 'Saira Khan',
    email: 'saira.khan@loyaltycs.co',
    phone: '+91 87654 66433',
    role: 'Staff',
    branch: 'CP - Bakery',
    joinedOn: '28 Mar 2025',
    status: 'Active',
    staffId: '#STF-1082',
    workLocation: 'CP - Bakery',
    employeeType: 'Full-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Store associate in charge of customer table service and scan validation.',
    accessLevel: 'POS Operations',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    initials: 'SK',
    avatarBg: 'bg-[#FCE7F3]',
    avatarTextColor: 'text-[#BE185D]',
    assignedBranches: ['CP - Bakery', 'Downtown Flagship'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1099',
    name: 'Marcus Vance',
    email: 'marcus.v@loyaltycs.co',
    phone: '+91 87654 77544',
    role: 'Manager',
    branch: 'Northside Mall',
    joinedOn: '15 Feb 2025',
    status: 'Active',
    staffId: '#STF-1099',
    workLocation: 'Northside Mall',
    employeeType: 'Full-time',
    reportingTo: 'Elena Rostova (General Manager)',
    roleDescription: 'Senior branch manager overseeing inventory and reward redemption.',
    accessLevel: 'POS Operations',
    initials: 'MV',
    avatarBg: 'bg-[#EDE9FE]',
    avatarTextColor: 'text-[#6D28D9]',
    assignedBranches: ['Northside Mall'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: true,
      staffManagement: true,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1100',
    name: 'Elena Rostova',
    email: 'elena.rostova@loyaltycs.co',
    phone: '+91 87654 88655',
    role: 'Manager',
    branch: 'Downtown Flagship',
    joinedOn: '01 Jan 2025',
    status: 'Active',
    staffId: '#STF-1100',
    workLocation: 'Downtown Flagship',
    employeeType: 'Full-time',
    reportingTo: 'Executive Board',
    roleDescription: 'General operations director across all franchise locations.',
    accessLevel: 'Super Administrator',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    initials: 'ER',
    avatarBg: 'bg-[#FFE4E6]',
    avatarTextColor: 'text-[#E11D48]',
    assignedBranches: ['Downtown Flagship', 'CP - Bakery', 'Northside Mall'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: true,
      staffManagement: true,
      customerData: true,
      settingsConfig: true,
    }
  },
  // Additional mock entries to reach 14 members
  {
    id: 'STF-1111',
    name: 'Aarav Sharma',
    email: 'aarav.sharma@loyaltycs.co',
    phone: '+91 87654 99101',
    role: 'Staff',
    branch: 'Connaught Place',
    joinedOn: '05 May 2025',
    status: 'Active',
    staffId: '#STF-1111',
    workLocation: 'Connaught Place',
    employeeType: 'Full-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Cashier and customer greeting specialist.',
    accessLevel: 'POS Operations',
    initials: 'AS',
    avatarBg: 'bg-[#FEF3C7]',
    avatarTextColor: 'text-[#B45309]',
    assignedBranches: ['Connaught Place'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1112',
    name: 'Ananya Gupta',
    email: 'ananya.g@loyaltycs.co',
    phone: '+91 87654 99102',
    role: 'Counter',
    branch: 'Northside Mall',
    joinedOn: '18 May 2025',
    status: 'Active',
    staffId: '#STF-1112',
    workLocation: 'Northside Mall',
    employeeType: 'Part-time',
    reportingTo: 'Marcus Vance (Manager)',
    roleDescription: 'Order taker and receipt scanner operator.',
    accessLevel: 'Counter Order Only',
    initials: 'AG',
    avatarBg: 'bg-[#DBEAFE]',
    avatarTextColor: 'text-[#1D4ED8]',
    assignedBranches: ['Northside Mall'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: false,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1113',
    name: 'Rohan Mehra',
    email: 'rohan.m@loyaltycs.co',
    phone: '+91 87654 99103',
    role: 'Staff',
    branch: 'Downtown Flagship',
    joinedOn: '01 Jun 2025',
    status: 'Active',
    staffId: '#STF-1113',
    workLocation: 'Downtown Flagship',
    employeeType: 'Full-time',
    reportingTo: 'Elena Rostova',
    roleDescription: 'Floor lead assisting customers with table QR engagement.',
    accessLevel: 'POS Operations',
    initials: 'RM',
    avatarBg: 'bg-[#FFEDD5]',
    avatarTextColor: 'text-[#C2410C]',
    assignedBranches: ['Downtown Flagship'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1114',
    name: 'Zara Joshi',
    email: 'zara.j@loyaltycs.co',
    phone: '+91 87654 99104',
    role: 'Staff',
    branch: 'CP - Bakery',
    joinedOn: '12 Jun 2025',
    status: 'Active',
    staffId: '#STF-1114',
    workLocation: 'CP - Bakery',
    employeeType: 'Part-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Barista & customer loyalty voucher handler.',
    accessLevel: 'POS Operations',
    initials: 'ZJ',
    avatarBg: 'bg-[#FCE7F3]',
    avatarTextColor: 'text-[#BE185D]',
    assignedBranches: ['CP - Bakery'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1115',
    name: 'Kabir Das',
    email: 'kabir.d@loyaltycs.co',
    phone: '+91 87654 99105',
    role: 'Counter',
    branch: 'Connaught Place',
    joinedOn: '20 Jun 2025',
    status: 'Active',
    staffId: '#STF-1115',
    workLocation: 'Connaught Place',
    employeeType: 'Full-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Counter cashier managing takeout orders and vouchers.',
    accessLevel: 'Counter Order Only',
    initials: 'KD',
    avatarBg: 'bg-[#EDE9FE]',
    avatarTextColor: 'text-[#6D28D9]',
    assignedBranches: ['Connaught Place'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: false,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1116',
    name: 'Meera Sen',
    email: 'meera.sen@loyaltycs.co',
    phone: '+91 87654 99106',
    role: 'Staff',
    branch: 'Downtown Flagship',
    joinedOn: '04 Jul 2025',
    status: 'Active',
    staffId: '#STF-1116',
    workLocation: 'Downtown Flagship',
    employeeType: 'Full-time',
    reportingTo: 'Elena Rostova',
    roleDescription: 'Staff representative handling high-value VIP customer queries.',
    accessLevel: 'POS Operations',
    initials: 'MS',
    avatarBg: 'bg-[#FEF3C7]',
    avatarTextColor: 'text-[#B45309]',
    assignedBranches: ['Downtown Flagship'],
    permissions: {
      posOperations: true,
      campaignManagement: true,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1117',
    name: 'Dev Kapoor',
    email: 'dev.k@loyaltycs.co',
    phone: '+91 87654 99107',
    role: 'Staff',
    branch: 'Northside Mall',
    joinedOn: '19 Jul 2025',
    status: 'Updated',
    staffId: '#STF-1117',
    workLocation: 'Northside Mall',
    employeeType: 'Full-time',
    reportingTo: 'Marcus Vance',
    roleDescription: 'Operations associate for POS hardware maintenance and floor support.',
    accessLevel: 'POS Operations',
    initials: 'DK',
    avatarBg: 'bg-[#DBEAFE]',
    avatarTextColor: 'text-[#1D4ED8]',
    assignedBranches: ['Northside Mall'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: true,
      settingsConfig: false,
    }
  },
  {
    id: 'STF-1118',
    name: 'Ishaan Roy',
    email: 'ishaan.r@loyaltycs.co',
    phone: '+91 87654 99108',
    role: 'Counter',
    branch: 'CP - Bakery',
    joinedOn: '02 Aug 2025',
    status: 'Active',
    staffId: '#STF-1118',
    workLocation: 'CP - Bakery',
    employeeType: 'Part-time',
    reportingTo: 'Liam Vance (Manager)',
    roleDescription: 'Weekend rush counter server.',
    accessLevel: 'Counter Order Only',
    initials: 'IR',
    avatarBg: 'bg-[#FFEDD5]',
    avatarTextColor: 'text-[#C2410C]',
    assignedBranches: ['CP - Bakery'],
    permissions: {
      posOperations: true,
      campaignManagement: false,
      reportsAnalytics: false,
      staffManagement: false,
      customerData: false,
      settingsConfig: false,
    }
  }
];

export interface StaffPageProps {
  onNavigate?: (route: any) => void;
}

const WebStaffView: React.FC<StaffPageProps> = () => {
  const { checkAndDeductCredit } = useWallet();
  const dispatch = useDispatch<AppDispatch>();
  const { staffList: reduxStaffList } = useSelector((state: RootState) => state.staff);

  const [staffList, setStaffList] = useState<StaffMember[]>(INITIAL_STAFF_MEMBERS);
  const [viewMode, setViewMode] = useState<'directory' | 'details'>('directory');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('STF-1042');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Toast feedback
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Modals
  const [isCreateRoleModalOpen, setIsCreateRoleModalOpen] = useState<boolean>(false);
  const [isEditStaffModalOpen, setIsEditStaffModalOpen] = useState<boolean>(false);

  // Create Role Form
  const [newRoleName, setNewRoleName] = useState('');
  const [newRoleDesc, setNewRoleDesc] = useState('');

  // Edit Staff Form
  const selectedStaff = staffList.find(s => s.id === selectedStaffId) || staffList[0];
  const [editFullName, setEditFullName] = useState(selectedStaff?.name || '');
  const [editEmail, setEditEmail] = useState(selectedStaff?.email || '');
  const [editPhone, setEditPhone] = useState(selectedStaff?.phone || '');
  const [editWorkLocation, setEditWorkLocation] = useState(selectedStaff?.workLocation || '');
  const [editRole, setEditRole] = useState(selectedStaff?.role || 'Manager');

  useEffect(() => {
    dispatch(fetchStaffList());
  }, [dispatch]);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const handleOpenDetails = (staffId: string) => {
    setSelectedStaffId(staffId);
    const target = staffList.find(s => s.id === staffId);
    if (target) {
      setEditFullName(target.name);
      setEditEmail(target.email);
      setEditPhone(target.phone);
      setEditWorkLocation(target.workLocation);
      setEditRole(target.role);
    }
    setViewMode('details');
  };

  // Filtered staff
  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'All' || member.role.toLowerCase() === roleFilter.toLowerCase();

    const matchesBranch =
      branchFilter === 'All' ||
      member.branch.toLowerCase().includes(branchFilter.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' || member.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesBranch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const paginatedStaff = filteredStaff.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSaveStaffDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === selectedStaff.id) {
          return {
            ...s,
            name: editFullName,
            email: editEmail,
            phone: editPhone,
            workLocation: editWorkLocation,
            role: editRole as any
          };
        }
        return s;
      })
    );
    setIsEditStaffModalOpen(false);
    showToast('Staff details updated successfully.');
  };

  const handleCreateRoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    showToast(`New role "${newRoleName}" created successfully!`);
    setIsCreateRoleModalOpen(false);
    setNewRoleName('');
    setNewRoleDesc('');
  };

  // -------------------------------------------------------------
  // VIEW: STAFF DETAILS (Image 5)
  // -------------------------------------------------------------
  const renderStaffDetails = () => (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <span>Home</span>
        <span>&gt;</span>
        <button
          onClick={() => setViewMode('directory')}
          className="text-gray-500 hover:text-[#5844A8] cursor-pointer transition-colors"
        >
          Staff Directory
        </button>
        <span>&gt;</span>
        <span className="text-[#1E1548] font-bold">Staff Details</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
            Staff Details
            <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
            View staff profile, role, permissions and access across all branches and venues.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditFullName(selectedStaff.name);
            setEditEmail(selectedStaff.email);
            setEditPhone(selectedStaff.phone);
            setEditWorkLocation(selectedStaff.workLocation);
            setEditRole(selectedStaff.role);
            setIsEditStaffModalOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5844A8]/20 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit Staff Details</span>
        </button>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-purple-50 shadow-sm flex flex-col sm:flex-row items-center gap-6">
        {selectedStaff.avatarUrl ? (
          <img
            src={selectedStaff.avatarUrl}
            alt={selectedStaff.name}
            className="w-24 h-24 rounded-full object-cover ring-4 ring-purple-100 shadow-md shrink-0"
          />
        ) : (
          <div className={`w-24 h-24 rounded-full ${selectedStaff.avatarBg} ${selectedStaff.avatarTextColor} flex items-center justify-center font-black text-2xl ring-4 ring-purple-100 shrink-0`}>
            {selectedStaff.initials}
          </div>
        )}

        <div className="space-y-2 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h2 className="text-2xl font-black text-[#1E1548]">{selectedStaff.name}</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {selectedStaff.status}
            </span>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            {selectedStaff.role} &nbsp;|&nbsp; Staff ID: {selectedStaff.staffId} &nbsp;|&nbsp; Joined {selectedStaff.joinedOn}
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <Phone className="w-3.5 h-3.5 text-gray-400" />
              <span>{selectedStaff.phone}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              <span>{selectedStaff.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2 Columns: Personal Information & Role Permissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Personal Information */}
        <div className="bg-white rounded-3xl p-6 lg:p-7 border border-purple-50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1548] pb-1 border-b border-gray-100">
            <Users className="w-4 h-4 text-[#5844A8]" />
            <span>Personal Information</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Full Name</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.name}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Email Address</span>
              <span className="font-semibold text-gray-700">{selectedStaff.email}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Phone Number</span>
              <span className="font-semibold text-gray-700">{selectedStaff.phone}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Date of Joining</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.joinedOn}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Work Location</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.workLocation}</span>
            </div>

            <div className="flex justify-between py-1">
              <span className="text-gray-400 font-medium">Employee Type</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.employeeType}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Role & Permissions */}
        <div className="bg-white rounded-3xl p-6 lg:p-7 border border-purple-50 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-[#1E1548] pb-1 border-b border-gray-100">
            <ShieldCheck className="w-4 h-4 text-[#5844A8]" />
            <span>Role &amp; Permissions</span>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Role Name</span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#F3E8FF] text-[#7E22CE]">
                {selectedStaff.role}
              </span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Access Level</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.accessLevel}</span>
            </div>

            <div className="flex justify-between py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium">Reporting To</span>
              <span className="font-bold text-[#1E1548]">{selectedStaff.reportingTo}</span>
            </div>

            <div className="py-1 border-b border-gray-50">
              <span className="text-gray-400 font-medium block mb-1">Role Description</span>
              <p className="text-gray-600 font-medium leading-relaxed">{selectedStaff.roleDescription}</p>
            </div>

            {/* Module Permissions Checkbox Grid */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-[#1E1548]">Module Permissions</span>
                <button
                  type="button"
                  onClick={() => setIsEditStaffModalOpen(true)}
                  className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Edit Permissions</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  { label: 'POS Operations', active: selectedStaff.permissions.posOperations },
                  { label: 'Campaign Management', active: selectedStaff.permissions.campaignManagement },
                  { label: 'Reports & Analytics', active: selectedStaff.permissions.reportsAnalytics },
                  { label: 'Staff Management', active: selectedStaff.permissions.staffManagement },
                  { label: 'Customer Data', active: selectedStaff.permissions.customerData },
                  { label: 'Settings & Configuration', active: selectedStaff.permissions.settingsConfig },
                ].map((perm, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-xs font-semibold ${
                      perm.active
                        ? 'border-purple-200 bg-[#FAF8FF] text-[#1E1548]'
                        : 'border-gray-200 bg-white text-gray-400 opacity-60'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${
                      perm.active ? 'bg-[#5844A8] text-white' : 'border border-gray-300'
                    }`}>
                      {perm.active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{perm.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Full-Width Card: Branch & Venue Access */}
      <div className="bg-white rounded-3xl p-6 lg:p-7 border border-purple-50 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-[#1E1548]">
          <MapPin className="w-4 h-4 text-[#5844A8]" />
          <span>Branch &amp; Venue Access</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>Assigned Branches</span>
            <span className="w-5 h-5 rounded-full bg-purple-100 text-[#5844A8] font-bold text-[11px] flex items-center justify-center">
              {selectedStaff.assignedBranches.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {selectedStaff.assignedBranches.map((bName, idx) => (
              <span
                key={idx}
                className="px-4 py-2 rounded-xl bg-[#FAF8FF] border border-purple-100 text-xs font-bold text-[#1E1548] shadow-2xs"
              >
                {bName}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Return Bar */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setViewMode('directory')}
          className="flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Staff Directory</span>
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // VIEW: STAFF DIRECTORY (Image 4)
  // -------------------------------------------------------------
  return (
    <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          <span>{feedbackToast}</span>
        </div>
      )}

      <div className="max-w-[1400px] mx-auto space-y-6">
        {viewMode === 'details' ? (
          renderStaffDetails()
        ) : (
          <>
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
              <span>Home</span>
              <span>&gt;</span>
              <span className="text-[#1E1548] font-bold">Staff</span>
            </div>

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
                  Staff Directory
                  <Sparkles className="w-5 h-5 text-amber-400 fill-amber-400" />
                </h1>
                <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">
                  Manage your team, view roles and access across all branches and venues.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateRoleModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#5844A8]/20 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Create new Role</span>
              </button>
            </div>

            {/* 4 Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Card 1: Total Staff */}
              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400">Total Staff</span>
                  <div className="text-3xl font-black text-[#1E1548] mt-0.5">14</div>
                  <div className="text-[11px] text-pink-500 font-semibold mt-0.5">+2 this month</div>
                </div>
              </div>

              {/* Card 2: Active */}
              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400">Active</span>
                  <div className="text-3xl font-black text-[#1E1548] mt-0.5">12</div>
                  <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">86%</div>
                </div>
              </div>

              {/* Card 3: Pending Invites */}
              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400">Pending Invites</span>
                  <div className="text-3xl font-black text-[#1E1548] mt-0.5">2</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">Awaiting response</div>
                </div>
              </div>

              {/* Card 4: Inactive */}
              <div className="bg-white rounded-3xl p-5 lg:p-6 border border-purple-50 shadow-sm space-y-3">
                <div className="w-10 h-10 rounded-2xl bg-gray-50 text-gray-400 flex items-center justify-center">
                  <Ban className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400">Inactive</span>
                  <div className="text-3xl font-black text-[#1E1548] mt-0.5">0</div>
                  <div className="text-[11px] text-gray-400 font-medium mt-0.5">-</div>
                </div>
              </div>
            </div>

            {/* Main Container: Staff List */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
              {/* Table Card Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-[#5844A8]" />
                  <h3 className="text-base font-bold text-[#1E1548]">Staff List</h3>
                </div>
                <span className="text-xs font-bold text-gray-400">{filteredStaff.length} Staff Members</span>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search staff name, email, or role..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                {/* Filter Dropdowns */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {/* Role Filter */}
                  <div className="relative">
                    <select
                      value={roleFilter}
                      onChange={(e) => {
                        setRoleFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-[#1E1548] appearance-none cursor-pointer focus:outline-none focus:border-[#5844A8]"
                    >
                      <option value="All">Role: All Roles</option>
                      <option value="Manager">Manager</option>
                      <option value="Staff">Staff</option>
                      <option value="Counter">Counter</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Branch Filter */}
                  <div className="relative">
                    <select
                      value={branchFilter}
                      onChange={(e) => {
                        setBranchFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-[#1E1548] appearance-none cursor-pointer focus:outline-none focus:border-[#5844A8]"
                    >
                      <option value="All">Branch: All Branches</option>
                      <option value="Connaught Place">Connaught Place</option>
                      <option value="CP - Bakery">CP - Bakery</option>
                      <option value="Downtown Flagship">Downtown Flagship</option>
                      <option value="Northside Mall">Northside Mall</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <select
                      value={statusFilter}
                      onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="bg-white border border-gray-200 rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-[#1E1548] appearance-none cursor-pointer focus:outline-none focus:border-[#5844A8]"
                    >
                      <option value="All">Status: All</option>
                      <option value="Active">Active</option>
                      <option value="Updated">Updated</option>
                      <option value="Revoked">Revoked</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto -mx-6 lg:-mx-8">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400">
                      <th className="py-3 px-6 lg:px-8">Staff Member</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Branch / Venue</th>
                      <th className="py-3 px-4">Joined On</th>
                      <th className="py-3 px-6 lg:px-8">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-xs">
                    {paginatedStaff.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-gray-400">
                          No staff members found matching your search.
                        </td>
                      </tr>
                    ) : (
                      paginatedStaff.map((member) => (
                        <tr
                          key={member.id}
                          onClick={() => handleOpenDetails(member.id)}
                          className="hover:bg-[#FAF8FF]/60 transition-colors cursor-pointer group"
                        >
                          {/* Staff Member */}
                          <td className="py-3.5 px-6 lg:px-8">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full ${member.avatarBg} ${member.avatarTextColor} flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs`}>
                                {member.initials}
                              </div>
                              <div>
                                <div className="font-bold text-[#1E1548] group-hover:text-[#5844A8] transition-colors">
                                  {member.name}
                                </div>
                                <div className="text-[11px] text-gray-400 font-medium">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                              member.role === 'Manager'
                                ? 'bg-[#F3E8FF] text-[#7E22CE]'
                                : member.role === 'Staff'
                                ? 'bg-[#EFF6FF] text-[#3B82F6]'
                                : 'bg-[#FEF3C7] text-[#D97706]'
                            }`}>
                              {member.role}
                            </span>
                          </td>

                          {/* Branch / Venue */}
                          <td className="py-3.5 px-4 font-semibold text-gray-700">
                            {member.branch}
                          </td>

                          {/* Joined On */}
                          <td className="py-3.5 px-4 text-gray-500 font-medium">
                            {member.joinedOn}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-6 lg:px-8">
                            <span className={`inline-block px-3 py-0.5 rounded-full text-xs font-bold ${
                              member.status === 'Active'
                                ? 'bg-[#DEF7EC] text-[#03543F]'
                                : member.status === 'Updated'
                                ? 'bg-[#EDEBFE] text-[#5521B5]'
                                : 'bg-[#FDE8E8] text-[#9B1C1C]'
                            }`}>
                              {member.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400 font-medium">
                  Showing {(currentPage - 1) * itemsPerPage + 1}-
                  {Math.min(currentPage * itemsPerPage, filteredStaff.length)} of {filteredStaff.length} staff members
                </span>

                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  {Array.from({ length: totalPages || 1 }).map((_, idx) => {
                    const pageNum = idx + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-7 h-7 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-[#5844A8] text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30 cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* CREATE NEW ROLE MODAL */}
      {isCreateRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-md w-full border border-purple-50 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#5844A8]" />
                <h3 className="text-base font-bold text-[#1E1548]">Create New Role</h3>
              </div>
              <button
                onClick={() => setIsCreateRoleModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateRoleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Head Sommelier / Store Lead"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Role Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Responsibilities and permission overview..."
                  value={newRoleDesc}
                  onChange={(e) => setNewRoleDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateRoleModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5844A8] text-white text-xs font-bold rounded-xl hover:bg-[#47368E] cursor-pointer shadow-md shadow-[#5844A8]/20"
                >
                  Save Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT STAFF DETAILS MODAL */}
      {isEditStaffModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 lg:p-8 max-w-lg w-full border border-purple-50 shadow-2xl space-y-5 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#5844A8]" />
                <h3 className="text-base font-bold text-[#1E1548]">Edit Staff Member</h3>
              </div>
              <button
                onClick={() => setIsEditStaffModalOpen(false)}
                className="text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStaffDetails} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Role Tier
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  >
                    <option value="Manager">Manager</option>
                    <option value="Staff">Staff</option>
                    <option value="Counter">Counter</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Work Location
                  </label>
                  <input
                    type="text"
                    value={editWorkLocation}
                    onChange={(e) => setEditWorkLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsEditStaffModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#5844A8] text-white text-xs font-bold rounded-xl hover:bg-[#47368E] cursor-pointer shadow-md shadow-[#5844A8]/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const StaffPage: React.FC<StaffPageProps> = (props) => {
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'tablet' || params.get('device') === 'tablet') {
        return true;
      }
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('view') && !params.get('device')) {
        setIsTablet(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isTablet) {
    return <TabletStaffView onNavigate={props.onNavigate} />;
  }

  return <WebStaffView {...props} />;
};

export default StaffPage;
