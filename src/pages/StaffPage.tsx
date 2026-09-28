import React, { useState } from 'react';
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
  SlidersHorizontal,
  KeyRound,
  Store,
  Wifi,
  ShieldCheck,
  Check,
  X,
  Radio,
  ArrowRight,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { inviteStaffMember, fetchStaffList, updateStaffMember } from '../store/slices/staffSlice';
import { useEffect } from 'react';

interface StaffVenuePermission {
  name: string;
  role: string;
  type: 'gold' | 'neutral';
}

interface StaffSecurityAudit {
  action: string;
  loc: string;
  time: string;
}

interface StaffMemberDetailed {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  roleTierLabel: string;
  roleTierClass: string;
  assignedVenues: string;
  terminalPinStatus: 'Active' | 'Pending';
  status: 'Active' | 'Pending' | 'Inactive';
  staffId: string;
  primaryVenue: string;
  activeRegistersCount: number;
  nfcKeycard: string;
  avatar?: string;
  initials?: string;
  venuePermissions: StaffVenuePermission[];
  recentAudits: StaffSecurityAudit[];
}

export const SYSTEM_MODULES = [
  { name: 'Dashboard', actions: ['View'] },
  { name: 'Branches', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Customers', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Campaigns', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Staff & RBAC', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Loyalty Program', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Promo Codes', actions: ['View', 'Add', 'Edit', 'Delete'] },
  { name: 'Reward Catalog', actions: ['View', 'Add', 'Edit', 'Delete'] }
];

export const TOTAL_PERMISSIONS_COUNT = SYSTEM_MODULES.reduce((acc, mod) => acc + mod.actions.length, 0);

export interface RoleTemplate {
  id: string;
  name: string;
  isSystem: boolean; // cannot be deleted
  permissions: Record<string, boolean>;
}

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

const INITIAL_STAFF_MEMBERS: StaffMemberDetailed[] = [
  {
    id: 'STF-1042',
    name: 'Elena Rostova',
    email: 'elena.rostova@revia.co',
    phone: '+1 (415) 890–4122',
    role: 'Manager',
    roleTierLabel: 'Manager',
    roleTierClass: 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]',
    assignedVenues: 'All Branches (3)',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1042',
    primaryVenue: 'Downtown Flagship',
    activeRegistersCount: 3,
    nfcKeycard: '#NFC-8821-EL',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    venuePermissions: [
      { name: 'Downtown F', role: 'Full Management', type: 'gold' },
      { name: 'Northside Mall', role: 'Shift Coverage', type: 'neutral' },
      { name: 'West End Espresso', role: 'Read Only', type: 'neutral' },
    ],
    recentAudits: [
      { action: 'Issued Manual Stamp to #REV-8924', loc: 'Downtown POS #1', time: 'Today 2:14 PM' },
      { action: 'Approved 2x Stamp Happy Hour Override', loc: 'Downtown POS #2', time: 'Today 1:45 PM' },
      { action: 'Logged in via Web Hub (macOS / Chrome)', loc: 'IP 172.56.21.90', time: 'Today 9:10 AM' },
    ],
  },
  {
    id: 'STF-1088',
    name: 'Liam Thorne',
    email: 'liam.t@revia.co',
    phone: '+1 (415) 890–3341',
    role: 'Manager',
    roleTierLabel: 'Manager',
    roleTierClass: 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]',
    assignedVenues: 'Downtown Flagship',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1088',
    primaryVenue: 'Downtown Flagship',
    activeRegistersCount: 2,
    nfcKeycard: '#NFC-3341-LT',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    venuePermissions: [
      { name: 'Downtown F', role: 'Full Management', type: 'gold' },
      { name: 'Northside Mall', role: 'Shift Coverage', type: 'neutral' },
    ],
    recentAudits: [
      { action: 'Completed Daily Till Reconciliation', loc: 'Downtown POS #2', time: 'Today 1:30 PM' },
      { action: 'Reset Barista Session Cash Drawer', loc: 'Downtown POS #1', time: 'Today 11:15 AM' },
    ],
  },
  {
    id: 'STF-1102',
    name: 'Chloe Zhao',
    email: 'chloe.z@revia.co',
    phone: '+1 (415) 890–5521',
    role: 'Manager',
    roleTierLabel: 'Manager',
    roleTierClass: 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]',
    assignedVenues: 'Northside Mall',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1102',
    primaryVenue: 'Northside Mall',
    activeRegistersCount: 2,
    nfcKeycard: '#NFC-5521-CZ',
    initials: 'CZ',
    venuePermissions: [
      { name: 'Northside Mall', role: 'Full Management', type: 'gold' },
      { name: 'West End Espresso', role: 'Shift Coverage', type: 'neutral' },
    ],
    recentAudits: [
      { action: 'Updated Holiday Menu Stamp Multiplier', loc: 'Northside POS #1', time: 'Today 12:40 PM' },
      { action: 'Authorized VIP Voucher #VCH-109', loc: 'Northside POS #1', time: 'Today 10:15 AM' },
    ],
  },
  {
    id: 'STF-1205',
    name: 'Mateo Silva',
    email: 'mateo.s@revia.co',
    phone: '+1 (415) 890–6632',
    role: 'Barista',
    roleTierLabel: 'Barista',
    roleTierClass: 'bg-[#F5F2EC] text-[#5C554E] border border-[#EAE6E1]',
    assignedVenues: 'West End Kiosk',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1205',
    primaryVenue: 'West End Espresso',
    activeRegistersCount: 1,
    nfcKeycard: '#NFC-6632-MS',
    initials: 'MS',
    venuePermissions: [
      { name: 'West End Espresso', role: 'Shift Coverage', type: 'neutral' },
    ],
    recentAudits: [
      { action: 'Redeemed Gold Voucher #VCH-4412', loc: 'West End POS #1', time: 'Today 3:02 PM' },
      { action: 'Clocked In via Terminal Quick-Switch PIN', loc: 'West End POS #1', time: 'Today 7:45 AM' },
    ],
  },
  {
    id: 'STF-1244',
    name: 'Maya Lin',
    email: 'maya.l@revia.co',
    phone: '+1 (415) 890–7719',
    role: 'Counter Staff',
    roleTierLabel: 'Counter Staff',
    roleTierClass: 'bg-[#F5F2EC] text-[#5C554E] border border-[#EAE6E1]',
    assignedVenues: 'Downtown Flagship',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1244',
    primaryVenue: 'Downtown Flagship',
    activeRegistersCount: 1,
    nfcKeycard: '#NFC-7719-ML',
    initials: 'ML',
    venuePermissions: [
      { name: 'Downtown F', role: 'Counter Order Only', type: 'neutral' },
    ],
    recentAudits: [
      { action: 'Tapped NFC Card at Register 1', loc: 'Downtown POS #1', time: 'Today 8:05 AM' },
      { action: 'Manual Stamp Awarded on Single Origin Pour', loc: 'Downtown POS #1', time: 'Today 8:12 AM' },
    ],
  },
  {
    id: 'STF-1001',
    name: 'Julianna Vance',
    email: 'jvance@revia.co',
    phone: '+1 (415) 890–1000',
    role: 'Owner (Super Admin)',
    roleTierLabel: 'Owner (Super Admin)',
    roleTierClass: 'bg-[#6E4B1F] text-[#FAF6EE]',
    assignedVenues: 'All Venues (Global)',
    terminalPinStatus: 'Active',
    status: 'Active',
    staffId: '#STF-1001',
    primaryVenue: 'Global Headquarters',
    activeRegistersCount: 8,
    nfcKeycard: '#NFC-1001-JV',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    venuePermissions: [
      { name: 'Downtown F', role: 'Full Management', type: 'gold' },
      { name: 'Northside Mall', role: 'Full Management', type: 'gold' },
      { name: 'West End Espresso', role: 'Full Management', type: 'gold' },
    ],
    recentAudits: [
      { action: 'Updated Global RBAC Permissions Matrix', loc: 'Web Admin HQ', time: 'Yesterday 6:30 PM' },
      { action: 'Provisioned New Hardware Mesh Node #04', loc: 'Web Admin HQ', time: 'Yesterday 2:15 PM' },
    ],
  },
];

export const StaffPage: React.FC = () => {
  const { checkAndDeductCredit } = useWallet();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading: isStaffLoading, staffList: reduxStaffList } = useSelector((state: RootState) => state.staff);
  
  const [staffList, setStaffList] = useState<StaffMemberDetailed[]>(INITIAL_STAFF_MEMBERS);
  
  useEffect(() => {
    dispatch(fetchStaffList());
  }, [dispatch]);
  useEffect(() => {
    if (reduxStaffList && reduxStaffList.length > 0) {
      const mapped = reduxStaffList.map((apiStaff: any) => {
        const role = apiStaff.type ? apiStaff.type.charAt(0).toUpperCase() + apiStaff.type.slice(1) : 'Staff';
        
        const userObj = apiStaff.user || {};
        const branchObj = apiStaff.branch || {};
        
        const staffName = userObj.name || apiStaff.name || 'Unknown';
        const initials = staffName.split(' ').map((p: string) => p[0]).join('').toUpperCase().slice(0, 2);
        
        const branchName = branchObj.name || `Branch ${apiStaff.branch_id || 'Global'}`;
        
        return {
          id: apiStaff.id?.toString() || `STF-${Math.floor(1000 + Math.random() * 9000)}`,
          name: staffName,
          email: userObj.email || apiStaff.email || 'N/A',
          phone: userObj.phone || apiStaff.phone || 'N/A',
          role: role,
          roleTierLabel: role,
          roleTierClass: role === 'Owner' || role === 'Owner (Super Admin)' ? 'bg-[#6E4B1F] text-[#FAF6EE]' : role === 'Manager' ? 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]' : 'bg-[#F5F2EC] text-[#5C554E] border border-[#EAE6E1]',
          assignedVenues: branchName,
          terminalPinStatus: 'Active' as 'Active' | 'Pending',
          status: (apiStaff.status === 'active' || userObj.status === 'active' ? 'Active' : 'Pending') as 'Active' | 'Pending' | 'Inactive',
          staffId: `#STF-${apiStaff.id || Math.floor(1000 + Math.random() * 9000)}`,
          primaryVenue: branchName,
          activeRegistersCount: 1,
          nfcKeycard: `#NFC-${Math.floor(1000 + Math.random() * 9000)}-${initials}`,
          initials: initials,
          venuePermissions: [
            { name: branchName, role: role === 'Manager' ? 'Full Management' : 'Shift Coverage', type: role === 'Manager' ? 'gold' : 'neutral' as any },
          ],
          recentAudits: []
        };
      });
      setStaffList(mapped);
      
      // Auto-select first if not set or if current selection is not in the new list
      if (mapped.length > 0 && (!selectedStaffId || !mapped.find((m: any) => m.id === selectedStaffId))) {
        setSelectedStaffId(mapped[0].id);
      }
    } else {
      setStaffList([]);
    }
  }, [reduxStaffList]);
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>(INITIAL_ROLE_TEMPLATES);
  const [editingRole, setEditingRole] = useState<RoleTemplate | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string>('STF-1042');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [branchFilter, setBranchFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [expandedStaffRow, setExpandedStaffRow] = useState<string | null>(null);

  // Modals & Interactivity
  const [isInviteModalOpen, setIsInviteModalOpen] = useState<boolean>(false);
  const [isEditTemplatesOpen, setIsEditTemplatesOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // New team member invite form state
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<string>('Manager');
  const [inviteBranch, setInviteBranch] = useState('Downtown Flagship');
  const [invitePhone, setInvitePhone] = useState('');
  const [invitePassword, setInvitePassword] = useState('');
  const [inviteErrors, setInviteErrors] = useState<{name?: string; email?: string; phone?: string; password?: string}>({});

  // Edit staff form state
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editRole, setEditRole] = useState<string>('Manager');
  const [editBranch, setEditBranch] = useState('');
  const [editNfc, setEditNfc] = useState('');

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const selectedStaff = staffList.find((s) => s.id === selectedStaffId) || staffList[0];

  const filteredStaff = staffList.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.staffId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole =
      roleFilter === 'All' || member.role.toLowerCase().includes(roleFilter.toLowerCase());

    const matchesBranch =
      branchFilter === 'All' ||
      member.assignedVenues.toLowerCase().includes(branchFilter.toLowerCase()) ||
      member.assignedVenues.includes('All');

    const matchesStatus =
      statusFilter === 'All' || member.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesRole && matchesBranch && matchesStatus;
  });

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: {name?: string; email?: string; phone?: string; password?: string} = {};
    if (!inviteName.trim()) errors.name = "Full Name is required.";
    if (!inviteEmail.trim()) {
      errors.email = "Work Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inviteEmail)) {
      errors.email = "Please enter a valid email address.";
    }
    
    if (!invitePhone.trim()) {
      errors.phone = "Mobile Number is required.";
    } else if (!/^\d+$/.test(invitePhone)) {
      errors.phone = "Mobile Number must contain only numbers.";
    }
    
    if (!invitePassword) {
      errors.password = "Password is required.";
    } else if (invitePassword.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }

    if (Object.keys(errors).length > 0) {
      setInviteErrors(errors);
      return;
    }
    
    setInviteErrors({});

    const newId = `STF-${Math.floor(1000 + Math.random() * 9000)}`;

    // CREDIT CHECK GATING (20 credits)
    const allowed = checkAndDeductCredit('staff_invite', 20, newId, `Invite Staff Seat: ${inviteName}`);
    if (!allowed) {
      return; // Blocked due to insufficient wallet credits
    }

    try {
      await dispatch(inviteStaffMember({
        name: inviteName,
        email: inviteEmail,
        phone: invitePhone || '',
        type: inviteRole.toLowerCase(),
        branch_id: '1', // Hardcoded branch ID as per standard mockup for now
        password: invitePassword
      })).unwrap();

      const initials = inviteName
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

      const newMember: StaffMemberDetailed = {
        id: newId,
        name: inviteName,
        email: inviteEmail,
        phone: invitePhone || '+1 (415) 890–' + Math.floor(1000 + Math.random() * 9000),
        role: inviteRole,
        roleTierLabel: inviteRole,
        roleTierClass:
          inviteRole === 'Manager'
            ? 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]'
            : 'bg-[#F5F2EC] text-[#5C554E] border border-[#EAE6E1]',
        assignedVenues: inviteBranch,
        terminalPinStatus: 'Active',
        status: 'Active',
        staffId: `#${newId}`,
        primaryVenue: inviteBranch,
        activeRegistersCount: 1,
        nfcKeycard: `#NFC-${Math.floor(1000 + Math.random() * 9000)}-${initials}`,
        initials,
        venuePermissions: [
          { name: inviteBranch, role: inviteRole === 'Manager' ? 'Full Management' : 'Shift Coverage', type: inviteRole === 'Manager' ? 'gold' : 'neutral' },
        ],
        recentAudits: [
          { action: 'Team member account provisioned', loc: 'Web Admin HQ', time: 'Just now' },
        ],
      };

      setStaffList([...staffList, newMember]);
      setSelectedStaffId(newId);
      setInviteName('');
      setInviteEmail('');
      setInvitePhone('');
      setInvitePassword('');
      setInviteErrors({});
      setIsInviteModalOpen(false);
      showToast(`Invitation sent to ${inviteEmail} with temporary password credentials.`);
    } catch (err: any) {
      showToast(`Error: ${err}`);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName || !editEmail) return;

    try {
      await dispatch(updateStaffMember({
        id: selectedStaff.id,
        type: editRole.toLowerCase(),
        branch_id: '1', // Hardcoded per requirements / mockup
        status: 'active'
      })).unwrap();

      setStaffList(prevList => prevList.map(staff => {
        if (staff.id === selectedStaff.id) {
          return {
            ...staff,
            name: editName,
            email: editEmail,
            phone: editPhone,
            role: editRole,
            roleTierLabel: editRole,
            roleTierClass: editRole === 'Owner (Super Admin)' ? 'bg-[#6E4B1F] text-[#FAF6EE]' : editRole === 'Manager'
              ? 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]'
              : 'bg-[#F5F2EC] text-[#5C554E] border border-[#EAE6E1]',
            assignedVenues: editBranch,
            nfcKeycard: editNfc,
            primaryVenue: editBranch,
            venuePermissions: [
              { name: editBranch, role: editRole === 'Manager' ? 'Full Management' : 'Shift Coverage', type: editRole === 'Manager' ? 'gold' : 'neutral' },
            ]
          };
        }
        return staff;
      }));
      setIsEditModalOpen(false);
      showToast(`Staff details updated successfully.`);
    } catch (err: any) {
      showToast(`Error: ${err}`);
    }
  };

  const handleResetPin = () => {
    showToast(`New temporary password generated and dispatched to ${selectedStaff.email}.`);
  };

  const handleExportAudit = () => {
    showToast('Exporting cryptographic RBAC audit log (CSV / PDF)...');
  };

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-150">
      {/* Top Toast Feedback */}
      {feedbackToast && (
        <div className="fixed top-14 right-6 z-[100] bg-[#1A1615] text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Page Title & Main Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
              Staff &amp; RBAC Permissions
            </h1>
            <span className="bg-[#FAF6EE] text-[#9E782F] border border-[#E5D7BE] text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              ACCESS FABRIC • {staffList.length} ACTIVE ACCOUNTS
            </span>
          </div>
          <p className="text-xs text-[#7C746C] mt-1 max-w-2xl leading-relaxed">
            Manage multi-location staff credentials, role-based access tiers, and audit security events across all merchant venues.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start lg:self-auto">
          <button
            onClick={handleExportAudit}
            className="px-4 py-2 rounded-lg border border-[#EAE6E1] bg-white hover:bg-[#FAF8F5] text-[13px] font-semibold text-[#1A1615] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          >
            <Download className="w-4 h-4 text-[#5C554E]" />
            <span>Export Audit Log</span>
          </button>

          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Invite Team Member</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: TOTAL TEAM */}
        <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              TOTAL TEAM
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#B38637]">
              <Users className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1A1615]">{staffList.length}</div>
            <div className="text-[11px] text-[#7C746C] mt-0.5">{staffList.filter(s => s.status === 'Active').length} active, {staffList.filter(s => s.status === 'Pending').length} pending invitations</div>
          </div>
          <div className="pt-2 border-t border-[#F5F2EC] flex items-center gap-1.5 text-[11px] text-[#15803D] font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
            <span>3 Venues Provisioned</span>
          </div>
        </div>

        {/* Card 2: ACTIVE ROLES */}
        <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              ACTIVE ROLES
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#B38637]">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1A1615]">{new Set(staffList.map(s => s.roleTierLabel)).size} Tiers</div>
            <div className="text-[11px] text-[#7C746C] mt-0.5">Owner, Manager, Barista, Counter</div>
          </div>
          <div className="pt-2 border-t border-[#F5F2EC] flex items-center gap-1 text-[11px]">
            <span className="font-semibold text-[#1A1615]">Strict RBAC</span>
            <span className="text-[#7C746C]">policy active</span>
          </div>
        </div>

        {/* Card 3: ACCOUNT STATUS */}
        <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              ACCOUNT STATUS
            </span>
            <div className="w-7 h-7 rounded-full bg-[#FAF6EE] flex items-center justify-center text-[#B38637]">
              <KeyRound className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1A1615]">{staffList.length} / {staffList.length}</div>
            <div className="text-[11px] text-[#7C746C] mt-0.5">100% active credentials</div>
          </div>
          <div className="pt-2 border-t border-[#F5F2EC] flex items-center gap-1.5 text-[11px] text-[#15803D] font-medium">
            <Check className="w-3.5 h-3.5 text-[#15803D]" />
            <span>Ready for Login</span>
          </div>
        </div>

        {/* Card 4: SECURITY HEALTH */}
        <div className="bg-white border border-[#EAE6E1] rounded-2xl p-4 shadow-2xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-[#8C827A] tracking-wider">
              SECURITY HEALTH
            </span>
            <span className="bg-[#EBF7F0] text-[#15803D] border border-[#CEEBD9] font-bold text-[10px] px-2 py-0.5 rounded-full">
              Secure
            </span>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#1A1615]">{staffList.length > 0 ? '100%' : 'N/A'}</div>
            <div className="text-[11px] text-[#7C746C] mt-0.5">{staffList.length > 0 ? 'Zero failed lockouts in 30d' : 'No activity logged'}</div>
          </div>
          <div className="pt-2 border-t border-[#F5F2EC] flex items-center gap-1.5 text-[11px] text-[#5C554E]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
            <span>MFA enforced on Managers</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:w-80">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A]" />
          <input
            type="text"
            placeholder="Search staff, email, #STF..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#EAE6E1] rounded-lg text-xs text-[#1A1615] focus:outline-none focus:border-[#B38637] transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {/* Role Filter */}
          <div className="relative">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3732] appearance-none pr-7 cursor-pointer focus:outline-none focus:border-[#B38637]"
            >
              <option value="All">Role: All ({roleTemplates.length})</option>
              {roleTemplates.map(rt => (
                <option key={rt.id} value={rt.name}>{rt.name}</option>
              ))}
            </select>
            <ChevronDown className="w-3 h-3 text-[#8C827A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Branch Filter */}
          <div className="relative">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3732] appearance-none pr-7 cursor-pointer focus:outline-none focus:border-[#B38637]"
            >
              <option value="All">Branch: All Venues</option>
              <option value="Downtown">Downtown Flagship</option>
              <option value="Northside">Northside Mall</option>
              <option value="West End">West End Kiosk</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#8C827A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] px-3 py-1.5 rounded-lg text-xs font-semibold text-[#3D3732] appearance-none pr-7 cursor-pointer focus:outline-none focus:border-[#B38637]"
            >
              <option value="All">Status: All ({staffList.length})</option>
              <option value="Active">Active ({staffList.filter(s => s.status === 'Active').length})</option>
              <option value="Pending">Pending ({staffList.filter(s => s.status === 'Pending').length})</option>
            </select>
            <ChevronDown className="w-3 h-3 text-[#8C827A] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Main Split Grid: Table & Matrix (Left 8 cols) + Staff Inspector (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (8 cols) */}
        <div className="lg:col-span-8 space-y-5 min-w-0">
          {/* Card A: Staff Directory & Terminals */}
          <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-2xs overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-[#F2EFE9] flex items-center justify-between bg-white">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded flex items-center justify-center text-[#B38637]">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#1A1615]">
                  Staff Directory &amp; Terminals
                </h3>
              </div>
              <span className="text-[11px] font-bold tracking-wider text-[#8C827A]">
                {filteredStaff.length} OF {staffList.length} DISPLAYING
              </span>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2EFE9] text-[10px] uppercase font-bold tracking-wider text-[#8C827A] bg-[#FAF8F5]/50">
                    <th className="py-2.5 px-5">STAFF MEMBER</th>
                    <th className="py-2.5 px-4">ROLE TIER</th>
                    <th className="py-2.5 px-4">ASSIGNED VENUES</th>
                    <th className="py-2.5 px-5 text-right">ACCOUNT STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EC] text-xs">
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 px-5 text-center text-[#7C746C]">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Users className="w-8 h-8 text-[#D1C9BE]" />
                          <p className="font-semibold text-[#3D3732]">No staff members found</p>
                          <p className="text-xs">Adjust your filters or invite a new team member.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((member) => {
                      const isSelected = selectedStaff && member.id === selectedStaff.id;

                      return (
                        <tr
                          key={member.id}
                          onClick={() => setSelectedStaffId(member.id)}
                          className={`transition-colors cursor-pointer ${isSelected
                            ? 'bg-[#FAF6EE]/70 font-medium'
                            : 'hover:bg-[#FAF8F5]'
                            }`}
                        >
                          {/* Member & Avatar */}
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              {member.avatar ? (
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-8 h-8 rounded-full object-cover ring-1 ring-[#EAE6E1]"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-[#F5F2EC] text-[#5C554E] flex items-center justify-center font-bold text-xs ring-1 ring-[#EAE6E1]">
                                  {member.initials || 'ST'}
                                </div>
                              )}
                              <div>
                                <div className="font-bold text-[#1A1615] flex items-center gap-1">
                                  <span>{member.name}</span>
                                </div>
                                <div className="text-[11px] text-[#7C746C]">
                                  {member.email}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Role Tier */}
                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${member.roleTierClass}`}
                            >
                              {member.roleTierLabel}
                            </span>
                          </td>

                          {/* Assigned Venues */}
                          <td className="py-3 px-4 text-[#3D3732] font-medium">
                            {member.assignedVenues}
                          </td>

                          {/* Account Status */}
                          <td className="py-3 px-5 text-right font-mono">
                            <span className="text-[#15803D] font-medium text-xs">Active</span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Expandable List */}
            <div className="sm:hidden flex flex-col">
              {filteredStaff.length === 0 ? (
                <div className="p-8 text-center text-[#7C746C] flex flex-col items-center">
                  <Users className="w-8 h-8 text-[#D1C9BE] mb-2" />
                  <p className="font-semibold text-[#3D3732]">No staff members found</p>
                  <p className="text-xs">Adjust your filters or invite a new team member.</p>
                </div>
              ) : (
                filteredStaff.map((member) => {
                  const isSelected = selectedStaff && member.id === selectedStaff.id;
                  const isExpanded = expandedStaffRow === member.id;

                  return (
                    <div key={member.id} className="border-b border-[#F2EFE9] last:border-b-0 overflow-hidden">
                      <button
                        onClick={() => {
                          setSelectedStaffId(member.id);
                          setExpandedStaffRow(isExpanded ? null : member.id);
                        }}
                        className={`w-full p-4 flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-[#FAF6EE]/70' : 'bg-white hover:bg-[#FAF8F5]'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          {member.avatar ? (
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover ring-1 ring-[#EAE6E1]"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#F5F2EC] text-[#5C554E] flex items-center justify-center font-bold text-sm ring-1 ring-[#EAE6E1]">
                              {member.initials || 'ST'}
                            </div>
                          )}
                          <div className="text-left">
                            <div className="font-bold text-[#1A1615] text-[13px]">{member.name}</div>
                            <div className="text-[11px] text-[#7C746C]">{member.email}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold ${member.roleTierClass}`}>
                            {member.roleTierLabel}
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-[#8C827A]" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div className={`p-4 grid grid-cols-2 gap-4 border-t border-[#F2EFE9] ${isSelected ? 'bg-[#FAF6EE]/30' : 'bg-[#FAF8F5]/50'}`}>
                          <div>
                            <div className="text-[9px] uppercase font-bold text-[#8C827A] mb-1 tracking-wider">Assigned Venues</div>
                            <div className="font-medium text-[#3D3732] text-xs">{member.assignedVenues}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-[9px] uppercase font-bold text-[#8C827A] mb-1 tracking-wider">Account Status</div>
                            <div className="font-mono">
                              <span className="text-[#15803D] font-medium text-xs">Active</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card B: Role Capabilities Matrix */}
          <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-2xs p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#B38637]" />
                  <h3 className="text-sm font-bold text-[#1A1615]">
                    Role Capabilities Matrix
                  </h3>
                </div>
                <p className="text-xs text-[#7C746C] mt-0.5">
                  High-level permission distribution across POS operations and store management tiers.
                </p>
              </div>

              <button
                onClick={() => setIsEditTemplatesOpen(true)}
                className="text-xs font-semibold text-[#A37837] hover:text-[#8F662A] flex items-center gap-1 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <span>Edit Role Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F2EFE9] text-[10px] uppercase font-bold tracking-wider text-[#8C827A]">
                    <th className="py-2.5 pr-4">SYSTEM PERMISSION CAPABILITY</th>
                    {roleTemplates.map(role => (
                      <th key={role.id} className="py-2.5 px-3 text-center">{role.name.toUpperCase()}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F2EC] text-xs">
                  {SYSTEM_MODULES.map((mod, modIdx) => (
                    <tr key={modIdx} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 pr-4 text-[#1A1615] font-bold uppercase tracking-wider text-[11px]">{mod.name}</td>
                      {roleTemplates.map(role => {
                        const activeActions = mod.actions.filter(action => role.permissions[`${mod.name}_${action}`]);

                        return (
                          <td key={role.id} className="py-3 px-3">
                            <div className="flex flex-nowrap items-center justify-center gap-1">
                              {mod.actions.map(action => {
                                const hasPermission = role.permissions[`${mod.name}_${action}`];
                                return (
                                  <span key={action} className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border ${
                                    hasPermission 
                                      ? 'bg-[#EBF7F0] text-[#15803D] border-[#15803D]/20' 
                                      : 'bg-transparent text-[#D1C9BE] border-[#EAE6E1] opacity-60'
                                  }`}>
                                    {action}
                                  </span>
                                );
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column (4 cols) - Staff Detail / Permissions Panel */}
        <div className="lg:col-span-4">
          {selectedStaff ? (
            <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-xs p-5 space-y-5 sticky top-20">
              {/* Top Profile Card */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {selectedStaff.avatar ? (
                  <img
                    src={selectedStaff.avatar}
                    alt={selectedStaff.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#FAF6EE]"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#F5F2EC] text-[#5C554E] flex items-center justify-center font-bold text-sm ring-2 ring-[#FAF6EE]">
                    {selectedStaff.initials || 'ST'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-base text-[#1A1615]">{selectedStaff.name}</h4>
                    <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
                  </div>
                  <div className="text-[11px] text-[#7C746C]">
                    Staff ID: {selectedStaff.staffId}
                  </div>
                  <span className="inline-block mt-1 bg-[#EBF7F0] text-[#15803D] font-semibold text-[10px] px-2 py-0.5 rounded-full">
                    Active {selectedStaff.role}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setEditName(selectedStaff.name);
                  setEditEmail(selectedStaff.email);
                  setEditPhone(selectedStaff.phone);
                  setEditRole(selectedStaff.role);
                  setEditBranch(selectedStaff.assignedVenues);
                  setEditNfc(selectedStaff.nfcKeycard);
                  setIsEditModalOpen(true);
                }}
                className="p-1.5 text-[#8C827A] hover:text-[#1A1615] rounded-lg hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                title="Edit staff details"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Direct Contact Points */}
            <div className="space-y-1.5 text-xs pt-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7C746C]">Direct Email</span>
                <span className="font-mono text-[#1A1615] font-medium">{selectedStaff.email}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7C746C]">Phone Contact</span>
                <span className="text-[#1A1615] font-medium">{selectedStaff.phone}</span>
              </div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#7C746C]">Primary Venue</span>
                <span className="text-[#A37837] font-semibold">{selectedStaff.primaryVenue}</span>
              </div>
            </div>

            {/* Authentication & Access Module */}
            <div className="pt-3 border-t border-[#F2EFE9] space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1615]">
                  <KeyRound className="w-3.5 h-3.5 text-[#8C827A]" />
                  <span>Authentication &amp; Access</span>
                </div>
                <span className="text-[11px] text-[#15803D] font-medium">
                  Active at {selectedStaff.activeRegistersCount} Registers
                </span>
              </div>

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EAE6E1] space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-[#7C746C]">Password</div>
                    <div className="font-mono text-sm tracking-widest text-[#1A1615] font-bold">••••••••</div>
                  </div>
                  <button
                    onClick={handleResetPin}
                    className="px-2.5 py-1 bg-white hover:bg-[#F5F2EC] border border-[#EAE6E1] rounded-md text-[11px] font-semibold text-[#1A1615] transition-colors cursor-pointer shadow-2xs"
                  >
                    Reset Password
                  </button>
                </div>

                <div className="pt-2 border-t border-[#EAE6E1]/60 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-[#7C746C]">
                    <Radio className="w-3 h-3 text-[#8C827A]" />
                    <span>NFC Staff Keycard:</span>
                  </div>
                  <span className="font-mono font-semibold text-[#1A1615]">
                    {selectedStaff.nfcKeycard}
                  </span>
                </div>
              </div>
            </div>

            {/* Venue Permissions */}
            <div className="pt-3 border-t border-[#F2EFE9] space-y-2">
              <div className="text-xs font-bold text-[#1A1615]">
                Venue Permissions
              </div>

              <div className="space-y-1.5">
                {selectedStaff.venuePermissions.map((vp, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Store className="w-3.5 h-3.5 text-[#8C827A]" />
                      <span className="font-medium text-[#1A1615]">{vp.name}</span>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${vp.type === 'gold'
                        ? 'bg-[#FDF3D6] text-[#9E782F] border border-[#E5D7BE]'
                        : 'bg-[#F5F2EC] text-[#5C554E]'
                        }`}
                    >
                      {vp.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Security Audit */}
            <div className="pt-3 border-t border-[#F2EFE9] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1A1615]">
                  Recent Security Audit
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-[#8C827A]" />
              </div>

              <div className="space-y-1.5 text-[11px]">
                {selectedStaff.recentAudits.map((audit, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-[#FAF8F5] border border-[#EAE6E1] space-y-0.5"
                  >
                    <div className="font-semibold text-[#1A1615]">
                      {audit.action}
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-[#7C746C]">
                      <span>{audit.loc}</span>
                      <span>{audit.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 border-t border-[#F2EFE9] flex items-center justify-between gap-3">
              <button
                onClick={() => showToast(`Access suspended for ${selectedStaff.name}. All terminals locked.`)}
                className="px-4 py-2 rounded-lg border border-[#F2D6D3] bg-[#FFF5F5] hover:bg-[#FEE2E2] text-[13px] font-semibold text-[#DC2626] transition-colors cursor-pointer"
              >
                Suspend Access
              </button>

              <button
                onClick={() => showToast(`Saved permissions for ${selectedStaff.name}. Syncing mesh nodes...`)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white text-[13px] font-bold transition-all cursor-pointer shadow-sm"
              >
                Save Changes
              </button>
            </div>
            </div>
          ) : (
            <div className="bg-white border border-[#EAE6E1] rounded-2xl shadow-xs p-5 flex flex-col items-center justify-center text-center sticky top-20 min-h-[400px]">
              <div className="w-12 h-12 rounded-full bg-[#FAF8F5] text-[#8C827A] flex items-center justify-center mb-3">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-[#1A1615]">No Staff Found</h3>
              <p className="text-xs text-[#7C746C] mt-1 max-w-[200px]">Select a team member from the list to view their details and permissions.</p>
            </div>
          )}
        </div>
      </div>

      {/* Invite Team Member Modal */}
      {isInviteModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in"
          onClick={() => setIsInviteModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-[#EAE6E1] p-5 w-full max-w-md shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6E1]">
              <div>
                <h3 className="text-base font-bold text-[#1A1615]">Invite Team Member</h3>
                <p className="text-xs text-[#7C746C]">Issue credentials &amp; provision password for POS access</p>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-3.5 text-xs" noValidate>
              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Liam Vance"
                  value={inviteName}
                  onChange={(e) => { setInviteName(e.target.value); if(inviteErrors.name) setInviteErrors({...inviteErrors, name: undefined}); }}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border ${inviteErrors.name ? 'border-red-500' : 'border-[#EAE6E1]'} rounded-lg text-[#1A1615] focus:outline-none focus:border-[#D4A753]`}
                />
                {inviteErrors.name && <p className="text-red-500 text-[10px] mt-1 font-medium">{inviteErrors.name}</p>}
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. liam.v@revia.co"
                  value={inviteEmail}
                  onChange={(e) => { setInviteEmail(e.target.value); if(inviteErrors.email) setInviteErrors({...inviteErrors, email: undefined}); }}
                  className={`w-full px-3 py-2 bg-[#FAF8F5] border ${inviteErrors.email ? 'border-red-500' : 'border-[#EAE6E1]'} rounded-lg text-[#1A1615] focus:outline-none focus:border-[#D4A753]`}
                />
                {inviteErrors.email && <p className="text-red-500 text-[10px] mt-1 font-medium">{inviteErrors.email}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 15551234567"
                    value={invitePhone}
                    onChange={(e) => { 
                      const val = e.target.value.replace(/\D/g, ''); // restrict to digits
                      setInvitePhone(val); 
                      if(inviteErrors.phone) setInviteErrors({...inviteErrors, phone: undefined}); 
                    }}
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${inviteErrors.phone ? 'border-red-500' : 'border-[#EAE6E1]'} rounded-lg text-[#1A1615] focus:outline-none focus:border-[#D4A753]`}
                  />
                  {inviteErrors.phone && <p className="text-red-500 text-[10px] mt-1 font-medium">{inviteErrors.phone}</p>}
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter secure password"
                    value={invitePassword}
                    onChange={(e) => { setInvitePassword(e.target.value); if(inviteErrors.password) setInviteErrors({...inviteErrors, password: undefined}); }}
                    className={`w-full px-3 py-2 bg-[#FAF8F5] border ${inviteErrors.password ? 'border-red-500' : 'border-[#EAE6E1]'} rounded-lg text-[#1A1615] focus:outline-none focus:border-[#D4A753]`}
                  />
                  {inviteErrors.password && <p className="text-red-500 text-[10px] mt-1 font-medium">{inviteErrors.password}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Role Tier
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] cursor-pointer focus:outline-none focus:border-[#D4A753]"
                  >
                    {roleTemplates.map(rt => (
                      <option key={rt.id} value={rt.name}>{rt.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Assigned Venue
                  </label>
                  <select
                    value={inviteBranch}
                    onChange={(e) => setInviteBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] cursor-pointer focus:outline-none focus:border-[#D4A753]"
                  >
                    <option value="Downtown Flagship">Downtown Flagship</option>
                    <option value="Northside Mall">Northside Mall</option>
                    <option value="West End Kiosk">West End Kiosk</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE6E1] space-y-1 text-[11px] text-[#7C746C]">
                <div className="font-semibold text-[#1A1615] flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>Automated Cryptographic Provisioning</span>
                </div>
                <p>
                  A temporary password and digital invitation will be emailed automatically to activate their pass.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#7C746C] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStaffLoading}
                  className="px-4 py-2 text-[13px] font-bold bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg cursor-pointer transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isStaffLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isStaffLoading ? 'Sending...' : 'Send Invitation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Role Templates Modal (Role Builder) */}
      {isEditTemplatesOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in"
          onClick={() => {
            setIsEditTemplatesOpen(false);
            setEditingRole(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl border border-[#EAE6E1] p-5 w-full max-w-lg shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6E1]">
              <div>
                <h3 className="text-base font-bold text-[#1A1615]">
                  {editingRole ? (editingRole.id ? 'Edit Role Template' : 'Create Custom Role') : 'Role Templates & Capabilities'}
                </h3>
                <p className="text-xs text-[#7C746C]">
                  {editingRole ? 'Configure permissions for this specific role tier' : 'Manage permission policies for all store roles'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsEditTemplatesOpen(false);
                  setEditingRole(null);
                }}
                className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editingRole ? (
              /* Role Editor Form */
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    disabled={editingRole.isSystem}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] focus:outline-none focus:border-[#B38637] disabled:opacity-50"
                    placeholder="e.g., Shift Supervisor"
                  />
                  {editingRole.isSystem && (
                    <p className="text-[10px] text-[#A37837] mt-1">System role names cannot be changed.</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-semibold text-[#7C746C] uppercase tracking-wider">System Permissions</h4>
                  {SYSTEM_MODULES.map(module => (
                    <div key={module.name} className="border border-[#EAE6E1] rounded-xl overflow-hidden bg-white">
                      <div className="bg-[#FAF8F5] px-3 py-2 text-xs font-bold text-[#1A1615] border-b border-[#EAE6E1]">
                        {module.name}
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {module.actions.map(action => {
                          const cap = `${module.name}_${action}`;
                          return (
                            <label key={cap} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={!!editingRole.permissions[cap]}
                                onChange={(e) => setEditingRole({
                                  ...editingRole,
                                  permissions: { ...editingRole.permissions, [cap]: e.target.checked }
                                })}
                                className="w-4 h-4 rounded border-[#D1C9BE] text-[#B38637] focus:ring-[#B38637] group-hover:border-[#B38637] transition-colors"
                              />
                              <span className="text-[11px] font-medium text-[#3D3732] group-hover:text-[#1A1615]">{action}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                  <button
                    type="button"
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#7C746C] hover:bg-[#FAF8F5] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingRole.name.trim()) {
                        showToast('Role name is required.');
                        return;
                      }
                      
                      let updatedTemplates;
                      if (editingRole.id) {
                        // Update existing
                        updatedTemplates = roleTemplates.map(rt => rt.id === editingRole.id ? editingRole : rt);
                      } else {
                        // Create new
                        const newRole = { ...editingRole, id: `role-${Date.now()}` };
                        updatedTemplates = [...roleTemplates, newRole];
                      }
                      
                      setRoleTemplates(updatedTemplates);
                      setEditingRole(null);
                      showToast(`Role template "${editingRole.name}" saved successfully.`);
                    }}
                    className="px-4 py-2 text-[13px] font-bold bg-[#B38637] text-white rounded-lg hover:bg-[#A37837] cursor-pointer transition-colors shadow-sm"
                  >
                    Save Role
                  </button>
                </div>
              </div>
            ) : (
              /* Role Templates List */
              <div className="space-y-3">
                <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                  {roleTemplates.map((tmpl) => (
                    <div key={tmpl.id} className="p-3 rounded-xl border border-[#EAE6E1] bg-[#FAF8F5] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1A1615] text-xs">{tmpl.name}</span>
                          {tmpl.isSystem && (
                            <span className="text-[9px] text-[#15803D] bg-[#EBF7F0] px-1.5 py-0.5 rounded font-semibold uppercase">System</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7C746C] mt-1">
                          {Object.values(tmpl.permissions).filter(Boolean).length} of {TOTAL_PERMISSIONS_COUNT} permissions enabled
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingRole({ ...tmpl })}
                          className="px-2.5 py-1.5 bg-white border border-[#EAE6E1] rounded text-[11px] font-semibold text-[#1A1615] hover:bg-[#F5F2EC] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {!tmpl.isSystem && (
                          <button
                            onClick={() => {
                              setRoleTemplates(roleTemplates.filter(rt => rt.id !== tmpl.id));
                              showToast(`Role "${tmpl.name}" deleted.`);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#F2D6D3] rounded text-[11px] font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EAE6E1]">
                  <button
                    type="button"
                    onClick={() => setEditingRole({ id: '', name: '', isSystem: false, permissions: {} })}
                    className="px-4 py-2 text-[12px] font-bold text-[#A37837] hover:bg-[#FAF8F5] rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Custom Role</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditTemplatesOpen(false)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-[#EAE6E1] hover:bg-[#D1C9BE] rounded-lg cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Edit Staff Modal */}
      {isEditModalOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in"
          onClick={() => setIsEditModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl border border-[#EAE6E1] p-5 w-full max-w-md shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6E1]">
              <div>
                <h3 className="text-base font-bold text-[#1A1615]">Edit Staff Profile</h3>
                <p className="text-xs text-[#7C746C]">Update details and terminal credentials</p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] focus:outline-none focus:border-[#B38637]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Work Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] focus:outline-none focus:border-[#B38637]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] focus:outline-none focus:border-[#B38637]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Role Tier
                  </label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] cursor-pointer focus:outline-none focus:border-[#B38637]"
                  >
                    {roleTemplates.map(rt => (
                      <option key={rt.id} value={rt.name}>{rt.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Assigned Venue
                  </label>
                  <select
                    value={editBranch}
                    onChange={(e) => setEditBranch(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg text-[#1A1615] cursor-pointer focus:outline-none focus:border-[#B38637]"
                  >
                    <option value="All Branches (3)">All Branches (3)</option>
                    <option value="All Venues (Global)">All Venues (Global)</option>
                    <option value="Downtown Flagship">Downtown Flagship</option>
                    <option value="Northside Mall">Northside Mall</option>
                    <option value="West End Espresso">West End Espresso</option>
                    <option value="West End Kiosk">West End Kiosk</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                  NFC Staff Keycard ID
                </label>
                <input
                  type="text"
                  required
                  value={editNfc}
                  onChange={(e) => setEditNfc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EAE6E1] rounded-lg font-mono text-[#1A1615] focus:outline-none focus:border-[#B38637]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 text-[13px] font-semibold text-[#7C746C] hover:bg-[#FAF8F5] rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStaffLoading}
                  className="px-4 py-2 text-[13px] font-semibold bg-[#B38637] text-white rounded-lg hover:bg-[#A37837] cursor-pointer transition-colors shadow-xs disabled:opacity-70 flex items-center gap-2"
                >
                  {isStaffLoading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isStaffLoading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
