import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Bell,
  Download,
  UserPlus,
  Star,
  User,
  Phone,
  Award,
  X,
  Sparkles,
  Plus,
  ChevronRight,
  ChevronDown,
  Ticket,
  Eye,
  Camera,
  Mail,
  MapPin,
  Building2,
  Calendar,
  Hash
} from 'lucide-react';
import { Customer, LoyaltyTier } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { fetchStates, fetchCities, clearCities } from '../store/slices/locationSlice';
import apiClient from '../api/apiClient';

interface CustomersPageProps {
  customers: Customer[];
  onUpdateCustomer: (updated: Customer) => void;
  onAddCustomer: (newCust: Customer) => void;
  onViewCustomer: (id: string) => void;
}

export const CustomersPage: React.FC<CustomersPageProps> = ({
  customers,
  onUpdateCustomer,
  onAddCustomer,
  onViewCustomer,
}) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>(customers[0]?.id || '');
  const [expandedCustomerRow, setExpandedCustomerRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [localCustomers, setLocalCustomers] = useState<Customer[]>(customers);
  const [isFetchingCustomers, setIsFetchingCustomers] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsFetchingCustomers(true);
      try {
        const response = await apiClient.get('merchant/customers');
        const resData = response.data;
        let customersArray = [];
        if (Array.isArray(resData?.data?.data)) {
          customersArray = resData.data.data;
        } else if (Array.isArray(resData?.data)) {
          customersArray = resData.data;
        } else if (Array.isArray(resData)) {
          customersArray = resData;
        }

        if (customersArray.length >= 0) {
          const mappedCustomers: Customer[] = customersArray.map((item: any) => ({
            id: item.id?.toString() || `C${Math.floor(100000 + Math.random() * 900000)}`,
            name: item.name || `${item.first_name || ''} ${item.last_name || ''}`.trim() || 'Unknown',
            avatar: item.profile_image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name || item.first_name || 'U')}&background=FAF8F5&color=1A1615`,
            phone: item.phone || 'N/A',
            email: item.email || 'N/A',
            tier: item.tier || 'Standard',
            stampsCount: item.stampsCount || item.loyalty_points || 0,
            stampsMax: item.stampsMax || 10,
            lifetimeSpend: item.lifetimeSpend || item.total_spent || 0,
            totalVisits: item.totalVisits || item.total_visits || 0,
            joinedDate: item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Unknown',
            lastVisit: item.last_visit || 'Never',
            preferredBranch: item.preferredBranch || 'Unknown',
            favoriteItem: item.favoriteItem || 'None',
            recentActivity: item.recentActivity || [],
          }));
          setLocalCustomers(mappedCustomers);
          if (mappedCustomers.length > 0 && !selectedCustomerId) {
            setSelectedCustomerId(mappedCustomers[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch customers from API:', error);
      } finally {
        setIsFetchingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  const dispatch = useDispatch<AppDispatch>();
  const { states, cities, isStatesLoading, isCitiesLoading } = useSelector((state: RootState) => state.location);

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newCustFirstName, setNewCustFirstName] = useState('');
  const [newCustLastName, setNewCustLastName] = useState('');
  const [newCustPhone, setNewCustPhone] = useState('');
  const [newCustEmail, setNewCustEmail] = useState('');
  const [newCustZip, setNewCustZip] = useState('');
  const [newCustCompany, setNewCustCompany] = useState('');

  const [registerStep, setRegisterStep] = useState(1);
  const [newCustDob, setNewCustDob] = useState('');
  const [newCustAge, setNewCustAge] = useState('');
  const [newCustGender, setNewCustGender] = useState('');
  const [newCustAddress, setNewCustAddress] = useState('');
  const [newCustCity, setNewCustCity] = useState('');
  const [newCustState, setNewCustState] = useState('');
  const [newCustPincode, setNewCustPincode] = useState('');

  useEffect(() => {
    if (isRegisterModalOpen) {
      dispatch(fetchStates(101)); // Default to India for now
    }
  }, [isRegisterModalOpen, dispatch]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const stateName = e.target.value;
    setNewCustState(stateName);
    setNewCustCity('');
    if (!stateName) {
      dispatch(clearCities());
      return;
    }
    const selectedStateObj = states.find(s => s.name === stateName);
    if (selectedStateObj) {
      dispatch(fetchCities(selectedStateObj.id));
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newCustAvatarPreview, setNewCustAvatarPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setNewCustAvatarPreview(url);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  const filteredCustomers = localCustomers.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCustName, setEditCustName] = useState('');
  const [editCustPhone, setEditCustPhone] = useState('');
  const [editCustEmail, setEditCustEmail] = useState('');

  const handleRegister = () => {
    if (!newCustFirstName || !newCustPhone) return;
    const newCustName = `${newCustFirstName} ${newCustLastName}`.trim();
    const newCust: Customer = {
      id: `C${Math.floor(100000 + Math.random() * 900000)}`,
      name: newCustName,
      phone: newCustPhone,
      email: newCustEmail,
      tier: 'Standard',
      stampsCount: 0,
      stampsMax: 10,
      lifetimeSpend: 0,
      totalVisits: 0,
      joinedDate: 'Today',
      lastVisit: 'Never',
      preferredBranch: 'Downtown Flagship',
      favoriteItem: 'None',
      recentActivity: [],
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newCustName)}&background=FAF8F5&color=1A1615`
    };
    onAddCustomer(newCust);
    setIsRegisterModalOpen(false);
    setNewCustFirstName('');
    setNewCustLastName('');
    setNewCustPhone('');
    setNewCustEmail('');
    setNewCustZip('');
    setNewCustCompany('');
    setNewCustDob('');
    setNewCustAge('');
    setNewCustGender('');
    setNewCustAddress('');
    setNewCustCity('');
    setNewCustState('');
    setNewCustPincode('');
    setNewCustAvatarPreview(null);
    setRegisterStep(1);
    setSelectedCustomerId(newCust.id);
  };

  const handleEditOpen = () => {
    if (!selectedCustomer) return;
    setEditCustName(selectedCustomer.name);
    setEditCustPhone(selectedCustomer.phone);
    setEditCustEmail(selectedCustomer.email);
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!selectedCustomer) return;
    onUpdateCustomer({
      ...selectedCustomer,
      name: editCustName,
      phone: editCustPhone,
      email: editCustEmail,
    });
    setIsEditModalOpen(false);
  };

  const selectedCustomer = localCustomers.find((c) => c.id === selectedCustomerId) || localCustomers[0];

  const handleAddStamp = () => {
    if (!selectedCustomer) return;
    const nextStamps = (selectedCustomer.stampsCount + 1) % (selectedCustomer.stampsMax + 1);
    const updated: Customer = {
      ...selectedCustomer,
      stampsCount: nextStamps === 0 ? 0 : nextStamps,
      totalVisits: selectedCustomer.totalVisits + 1,
      lifetimeSpend: selectedCustomer.lifetimeSpend + 12.50,
      recentActivity: [
        {
          id: `act-${Date.now()}`,
          action: nextStamps === 0 ? 'Reward Redeemed' : 'In-Store Scan Stamp Awarded',
          branch: selectedCustomer.preferredBranch,
          date: 'Just now',
          amount: 12.50,
          stampsEarned: 1,
        },
        ...selectedCustomer.recentActivity,
      ],
    };
    onUpdateCustomer(updated);
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'Obsidian VIP':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1A1615] text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider shadow-sm">
            <Star className="w-3 h-3 fill-[#D4AF37]" /> Obsidian VIP
          </span>
        );
      case 'Gold Reserve':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#FDF8EB] text-[#9E782F] border border-[#D4A753]/30 text-[10px] font-bold uppercase tracking-wider">
            <Star className="w-3 h-3 fill-[#9E782F]" /> Gold Reserve
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F5F4F0] text-[#6E6A66] text-[10px] font-bold uppercase tracking-wider">
            <User className="w-3 h-3" /> Standard
          </span>
        );
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#FAF8F5] flex flex-col font-sans text-[#1A1615]">
      <div className="p-4 lg:p-6 space-y-6 flex-1 max-w-[1600px] mx-auto w-full">
        {/* MAIN SECTION HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight mb-1">Customer Directory</h1>
            <p className="text-xs sm:text-sm text-[#7C746C] max-w-2xl">
              Manage loyalty members, view lifetime engagement history, and manage tier privileges across active branch locations.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] rounded-lg transition-colors shadow-xs cursor-pointer">
              <Download className="w-4 h-4 text-[#7C746C]" />
              Export CSV
            </button>
            <button
              onClick={() => {
                setIsRegisterModalOpen(true);
                setRegisterStep(1);
              }}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <UserPlus className="w-4 h-4 text-white" />
              Register Customer
            </button>
          </div>
        </div>

        {/* TOP KPI METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-medium text-[#7C746C]">
              Total Directory Members
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615] mt-1.5">{localCustomers.length}</div>
            <div className="text-[11px] text-[#7C746C] mt-1">Active hospitality patrons</div>
          </div>
          <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-medium text-[#7C746C]">
              Obsidian & Gold VIPs
              <span className="bg-[#FAF6EE] text-[#9E782F] text-[11px] font-bold px-2 py-0.5 rounded-full border border-[#E5D7BE]">Top 28%</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615] mt-1.5">
              {localCustomers.filter(c => c.tier !== 'Standard').length}
            </div>
            <div className="text-[11px] text-[#7C746C] mt-1">High-LTV loyalty tier holders</div>
          </div>
          <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-medium text-[#7C746C]">
              Avg Stamps / Member
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full">6.4 avg</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615] mt-1.5">
              {(localCustomers.reduce((acc, c) => acc + c.stampsCount, 0) / (localCustomers.length || 1)).toFixed(1)}
            </div>
            <div className="text-[11px] text-[#7C746C] mt-1">Out of 10 max reward threshold</div>
          </div>
          <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs">
            <div className="flex items-center justify-between text-xs font-medium text-[#7C746C]">
              Retention Velocity
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full">
                {localCustomers.length > 0 ? ((localCustomers.filter(c => c.totalVisits > 1).length / localCustomers.length) * 100).toFixed(1) : '0.0'}%
              </span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615] mt-1.5">
              {localCustomers.length > 0 ? ((localCustomers.filter(c => c.totalVisits > 1).length / localCustomers.length) * 100).toFixed(1) : '0.0'}%
            </div>
            <div className="text-[11px] text-[#7C746C] mt-1">Repeat visit rate</div>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#7C746C]" />
            </div>
            <input
              type="text"
              placeholder="Search member by name, phone number, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-[#EAE6E1] rounded-lg bg-[#FAF8F5] text-xs sm:text-sm text-[#1A1615] placeholder:text-[#9E9A93] focus:outline-none focus:border-[#D4A753]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">

          {/* 4. LEFT SECTION: CUSTOMER DATA TABLE */}
          <div className="xl:col-span-12 bg-white rounded-xl border border-[#EAE6E1] shadow-2xs flex flex-col overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-full lg:min-w-[600px]">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EAE6E1]">
                    <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C] w-[30%] whitespace-nowrap">Member</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#7C746C] whitespace-nowrap">Phone / Contact</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#7C746C] whitespace-nowrap">Tier</th>
                    <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C] w-[25%] whitespace-nowrap">Loyalty Stamps</th>
                    <th className="py-3 px-4 text-xs font-bold uppercase tracking-wider text-[#7C746C] whitespace-nowrap">Offers Used</th>
                    <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C] text-right whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE6E1]">
                  {paginatedCustomers.length > 0 ? (
                    paginatedCustomers.map((cust) => {
                      const isSelected = cust.id === selectedCustomerId;
                      const progressPct = (cust.stampsCount / cust.stampsMax) * 100;
                      return (
                        <tr
                          key={cust.id}
                          onClick={() => onViewCustomer(cust.id)}
                          className={`transition-colors cursor-pointer group hover:bg-[#FAF8F5]/60`}
                        >
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-3">
                              <img src={cust.avatar} alt={cust.name} className="w-10 h-10 rounded-full object-cover border border-[#EAE6E1] shadow-2xs" />
                              <div>
                                <div className="text-sm font-bold text-[#1A1615] flex items-center gap-2">
                                  {cust.name}
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-[#D4A753]"></span>}
                                </div>
                                <div className="text-[11px] font-mono font-semibold text-[#7C746C]">{cust.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="text-xs font-mono font-bold text-[#1A1615]">{cust.phone}</div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            {getTierBadge(cust.tier)}
                          </td>
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2 lg:gap-3">
                              <div className="w-16 sm:w-20">
                                <div className="w-full h-1.5 bg-[#FAF8F5] border border-[#EAE6E1] rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-[#D4A753] to-[#9E782F] rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${progressPct}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="text-xs font-mono font-bold text-[#1A1615] shrink-0 w-10 text-right">
                                {cust.stampsCount} / 10
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1.5">
                                <Ticket className="w-3 h-3 text-[#D4A753]" />
                                Welcome Bonus
                              </div>
                              <div className="text-[10px] font-medium text-[#7C746C]">
                                {cust.stampsCount % 3 + 1} offers redeemed total
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-5 text-right whitespace-nowrap">
                            <button
                              onClick={(e) => { e.stopPropagation(); onViewCustomer(cust.id); }}
                              className="p-2 bg-white border border-[#EAE6E1] text-[#7C746C] rounded-md hover:bg-[#FAF8F5] hover:text-[#1A1615] transition-colors shadow-xs cursor-pointer"
                              title="View Profile"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-[#7C746C]">
                          <User className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                          <div className="text-sm font-bold text-[#1A1615]">No customers found</div>
                          <div className="text-xs mt-1">Try adjusting your search or add a new customer.</div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Expandable List */}
            <div className="md:hidden flex flex-col">
              {paginatedCustomers.length > 0 ? (
                paginatedCustomers.map((cust) => {
                const isSelected = cust.id === selectedCustomerId;
                const isExpanded = expandedCustomerRow === cust.id;
                const progressPct = (cust.stampsCount / cust.stampsMax) * 100;

                return (
                  <div key={cust.id} className="border-b border-[#EAE6E1] last:border-b-0 overflow-hidden">
                    <div
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setExpandedCustomerRow(isExpanded ? null : cust.id);
                      }}
                      className={`w-full p-4 flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-[#FDF8EB]/60' : 'bg-white hover:bg-[#FAF8F5]'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <img src={cust.avatar} alt={cust.name} className="w-10 h-10 rounded-full object-cover border border-[#EAE6E1] shadow-2xs" />
                        <div className="text-left">
                          <div className="text-sm font-bold text-[#1A1615] flex items-center gap-2">
                            {cust.name}
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#D4A753]"></span>}
                          </div>
                          <div className="text-[11px] font-mono font-semibold text-[#7C746C]">{cust.id}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        {getTierBadge(cust.tier)}
                        <button
                          onClick={(e) => { e.stopPropagation(); onViewCustomer(cust.id); }}
                          className="p-1.5 bg-white border border-[#EAE6E1] text-[#7C746C] rounded-md hover:bg-[#FAF8F5] hover:text-[#1A1615] transition-colors shadow-xs cursor-pointer ml-2"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#8C827A]" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#8C827A]" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className={`p-4 grid grid-cols-2 md:grid-cols-3 gap-4 border-t border-[#EAE6E1] ${isSelected ? 'bg-[#FDF8EB]/30' : 'bg-[#FAF8F5]/50'}`}>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-[#7C746C] mb-1 tracking-wider">Phone / Contact</div>
                          <div className="text-xs font-mono font-bold text-[#1A1615]">{cust.phone}</div>
                        </div>
                        <div>
                          <div className="text-[9px] uppercase font-bold text-[#7C746C] mb-1 tracking-wider">Offers Used</div>
                          <div className="text-[11px] font-bold text-[#1A1615] flex items-center gap-1">
                            <Ticket className="w-3 h-3 text-[#D4A753]" />
                            Welcome Bonus
                          </div>
                          <div className="text-[10px] text-[#7C746C] mt-0.5">{cust.stampsCount % 3 + 1} total redeemed</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] uppercase font-bold text-[#7C746C] mb-1 tracking-wider">Loyalty Stamps</div>
                          <div className="flex flex-col items-end gap-1.5">
                            <div className="text-xs font-mono font-bold text-[#1A1615]">
                              {cust.stampsCount} / 10
                            </div>
                            <div className="w-24 h-1.5 bg-[#FAF8F5] border border-[#EAE6E1] rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-[#D4A753] to-[#9E782F] rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPct}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-10 flex flex-col items-center justify-center text-center px-4 bg-white">
                <User className="w-10 h-10 mb-3 text-[#D4A753]/40" />
                <div className="text-sm font-bold text-[#1A1615]">No customers found</div>
                <div className="text-xs text-[#7C746C] mt-1">Try adjusting your search or add a new customer.</div>
              </div>
            )}
            </div>

            {/* Table Footer / Pagination */}
            <div className="px-5 py-4 border-t border-[#EAE6E1] bg-[#FAF8F5] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#7C746C]">
                Showing {filteredCustomers.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCustomers.length)} of {filteredCustomers.length} records
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 font-bold text-[#7C746C] hover:text-[#1A1615] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >Previous</button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-7 h-7 flex items-center justify-center rounded font-bold transition-colors cursor-pointer ${currentPage === i + 1 ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white shadow-2xs' : 'bg-white border border-[#EAE6E1] text-[#7C746C] hover:text-[#1A1615]'}`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="px-3 py-1.5 font-bold text-[#1A1615] hover:text-[#D4A753] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >Next</button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Register Customer Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsRegisterModalOpen(false)}>
          <div className="bg-[#FAF8F5] rounded-2xl w-full max-w-2xl shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

            <div className="p-5 border-b border-[#EAE6E1] flex justify-between items-center bg-[#FAF8F5] shrink-0 rounded-t-2xl">
              <h2 className="text-[15px] font-bold text-[#1A1615]">Register Customer</h2>
              <button onClick={() => setIsRegisterModalOpen(false)} className="p-1 text-[#7C746C] hover:text-[#1A1615] rounded transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>

            <div className="p-6 md:p-8 space-y-8 overflow-y-auto">

              {registerStep === 1 ? (
                <>
                  {/* Header Title */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-[#7C746C] uppercase mb-1">STEP 1 OF 2 &middot; REQUIRED</div>
                      <h3 className="text-2xl font-black text-[#1A1615] tracking-tight mt-2">Basic <span className="text-[#9E782F]">Information</span></h3>
                    </div>
                  </div>

                  {/* Profile Photo Section */}
                  <div className="flex items-start gap-4">
                    <div className="relative shrink-0">
                      <img src={newCustAvatarPreview || "https://images.unsplash.com/photo-1444464666168-49b19e882a4a?auto=format&fit=crop&q=80&w=150&h=150"} alt="Profile" className="w-16 h-16 rounded-full object-cover shadow-sm" />
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 p-1.5 bg-[#A37B3E] text-white rounded-full border-2 border-[#FAF8F5] hover:bg-[#856526] transition-colors cursor-pointer"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    <div className="pt-1">
                      <h3 className="font-bold text-[#1A1615] text-[15px]">Profile Photo</h3>
                      <p className="text-[13px] text-[#7C746C] mt-1">Upload a recognizable photo for seamless concierge service</p>
                    </div>
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">

                    {/* First Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">First Name <span className="text-[#1A1615]">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="text" value={newCustFirstName} onChange={e => setNewCustFirstName(e.target.value)} placeholder="Enter First Name" className="w-full pl-9 pr-3 py-2.5 bg-[#EDF2FA] border border-transparent rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] focus:bg-white transition-colors" />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Last Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="text" value={newCustLastName} onChange={e => setNewCustLastName(e.target.value)} placeholder="Enter Last Name" className="w-full pl-9 pr-3 py-2.5 bg-[#EDF2FA] border border-transparent rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] focus:bg-white transition-colors" />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Mail className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="email" value={newCustEmail} onChange={e => setNewCustEmail(e.target.value)} placeholder="Enter Email " className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                      </div>
                      <p className="text-[12px] text-[#9E9A93] leading-relaxed pt-1">We'll send order confirmations and exclusive offers here.</p>
                    </div>

                    {/* Mobile Number */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Mobile Number <span className="text-[#1A1615]">*</span></label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="tel" value={newCustPhone} onChange={e => setNewCustPhone(e.target.value)} placeholder="Enter Mobile Number" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                      </div>
                      <p className="text-[12px] text-[#9E9A93] leading-relaxed pt-1">Used for SMS updates and instant concierge access.</p>
                    </div>

                    {/* Zip Code */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Zip Code (Optional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="text" value={newCustZip} onChange={e => setNewCustZip(e.target.value)} placeholder="10001" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                      </div>
                    </div>

                    {/* Company */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Company (Optional)</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building2 className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="text" value={newCustCompany} onChange={e => setNewCustCompany(e.target.value)} placeholder="Acme Corp" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                      </div>
                    </div>

                  </div>

                  {/* Footer */}
                  <div className="pt-4">
                    <button
                      onClick={() => setRegisterStep(2)}
                      disabled={!newCustFirstName || !newCustPhone}
                      className="px-8 py-3 bg-[#9E782F] text-white rounded-lg text-[14px] font-bold shadow-xs hover:bg-[#856526] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
                    >
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest text-[#7C746C] uppercase mb-1">STEP 2 OF 2 &middot; OPTIONAL</div>
                      <h3 className="text-2xl font-black text-[#1A1615] tracking-tight mt-2">Demographics & <span className="text-[#9E782F]">Address</span></h3>
                      <p className="text-[14px] text-[#7C746C] mt-2.5 leading-relaxed max-w-[90%]">Share these details to receive personalized offers, physical birthday gifts, and specialized rewards.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 pt-2">

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:col-span-2">
                      {/* Date of Birth */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Date of Birth</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <input type="date" value={newCustDob} onChange={e => setNewCustDob(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors cursor-pointer" />
                        </div>
                      </div>

                      {/* Age */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Age</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <input type="number" value={newCustAge} onChange={e => setNewCustAge(e.target.value)} placeholder="e.g. 28" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                        </div>
                      </div>

                      {/* Gender */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Gender</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <select value={newCustGender} onChange={e => setNewCustGender(e.target.value)} className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors appearance-none cursor-pointer">
                            <option value="">Prefer not to say</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-4 w-4 text-[#7C746C]" />
                        </div>
                        <input type="text" value={newCustAddress} onChange={e => setNewCustAddress(e.target.value)} placeholder="123 Main St, Apt 4B" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:col-span-2">
                      {/* State */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">State</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPin className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <select value={newCustState} onChange={handleStateChange} className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors appearance-none cursor-pointer">
                            <option value="">Select State</option>
                            {states.map(s => (
                              <option key={s.id} value={s.name}>{s.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      {/* City */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">City</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Building2 className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <select value={newCustCity} onChange={e => setNewCustCity(e.target.value)} disabled={!newCustState || isCitiesLoading} className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors appearance-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                            <option value="">Select City</option>
                            {cities.map(c => (
                              <option key={c.id} value={c.name}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Pincode */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615]">Pincode</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Hash className="h-4 w-4 text-[#7C746C]" />
                          </div>
                          <input type="text" value={newCustPincode} onChange={e => setNewCustPincode(e.target.value)} placeholder="10001" className="w-full pl-9 pr-3 py-2.5 bg-transparent border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#9E782F] transition-colors" />
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Footer Phase 2 */}
                  <div className="pt-6 flex gap-4">
                    <button onClick={() => setRegisterStep(1)} className="px-6 py-3 bg-white border border-[#EAE6E1] text-[#7C746C] rounded-lg text-[14px] font-bold shadow-xs hover:bg-[#FAF8F5] transition-colors cursor-pointer flex items-center gap-2">
                      &larr; Back
                    </button>
                    <button onClick={handleRegister} className="px-8 py-3 bg-[#9E782F] text-white rounded-lg text-[14px] font-bold shadow-xs hover:bg-[#856526] transition-colors cursor-pointer flex items-center gap-2">
                      Continue
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}
      {/* Edit Customer Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EAE6E1] flex justify-between items-center bg-[#FAF8F5]">
              <h2 className="text-[15px] font-bold text-[#1A1615]">Edit Customer Profile</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 text-[#7C746C] hover:text-[#1A1615] rounded transition-colors cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C]">Full Name <span className="text-red-500">*</span></label>
                <input type="text" value={editCustName} onChange={e => setEditCustName(e.target.value)} placeholder="e.g. Jane Doe" className="w-full px-3 py-2 bg-white border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C]">Phone Number <span className="text-red-500">*</span></label>
                <input type="tel" value={editCustPhone} onChange={e => setEditCustPhone(e.target.value)} placeholder="e.g. (555) 123-4567" className="w-full px-3 py-2 bg-white border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C]">Email Address</label>
                <input type="email" value={editCustEmail} onChange={e => setEditCustEmail(e.target.value)} placeholder="e.g. jane@example.com" className="w-full px-3 py-2 bg-white border border-[#EAE6E1] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
              </div>
              <button
                onClick={handleEditSave}
                disabled={!editCustName || !editCustPhone}
                className="w-full px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white rounded-lg text-[13px] font-bold shadow-xs mt-2 hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
