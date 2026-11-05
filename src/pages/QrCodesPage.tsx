import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchQrCodes, createQrCode, fetchQrCodeDetails, fetchQrCodeHistory, updateQrCodeStatus } from '../store/slices/qrCodeSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import { fetchAssetTypes, fetchPlacementTypes, addAssetType, addPlacementType, AssetTypeOption, PlacementTypeOption } from '../store/slices/masterSlice';
import { useWallet } from '../context/WalletContext';
import {
  Download,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  QrCode,
  Smartphone,
  Edit2,
  TrendingUp,
  Activity,
  CheckCircle2,
  Save,
  ChevronDown,
  Info,
  Layers,
  Zap,
  Clock,
  MapPin,
  X,
  Check,
  Calendar,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Users,
  UserPlus,
  Crown,
  RotateCcw,
  Printer,
  Share2,
  Store,
  ChevronRight
} from 'lucide-react';

export const QrCodesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { qrCodes, currentQrCode, currentHistory, isLoading, error } = useSelector((state: RootState) => state.qrCode);
  const { branches } = useSelector((state: RootState) => state.branch);
  const { assetTypes, placementTypes } = useSelector((state: RootState) => state.master);
  
  const { checkAndDeductCredit } = useWallet();
  const [activeAsset, setActiveAsset] = useState<string>('8');
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };
  const [venueFilter, setVenueFilter] = useState('VENUE: All');
  const [assetTypeFilter, setAssetTypeFilter] = useState('ASSET TYPE: All (Acrylic, Brass, NFC)');
  const [destinationFilter, setDestinationFilter] = useState('DESTINATION: All Routing Targets');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [selectedActionAsset, setSelectedActionAsset] = useState<any>(null);

  // 5-Step QR Generator Wizard State (Images 4 & 5)
  const [pageMode, setPageMode] = useState<'wizard' | 'library'>('wizard');
  const [qrStep, setQrStep] = useState<number>(1);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('first-visit');
  const [campaignSearch, setCampaignSearch] = useState<string>('');

  // Step 2: Time Duration State (Image 5)
  const [qrStartDate, setQrStartDate] = useState<string>('15 Sep 2025');
  const [qrEndDate, setQrEndDate] = useState<string>('30 Sep 2025');
  const [qrIsRecurring, setQrIsRecurring] = useState<boolean>(true);
  const [qrRepeatFreq, setQrRepeatFreq] = useState<string>('Weekly');
  const [qrRepeatDays, setQrRepeatDays] = useState<string[]>(['M']);
  const [qrEndRecurrence, setQrEndRecurrence] = useState<'no_end' | 'occurrences' | 'end_date'>('no_end');
  const [qrOccurrences, setQrOccurrences] = useState<number>(4);
  const [qrRecurrenceEndDate, setQrRecurrenceEndDate] = useState<string>('30 Dec 2025');

  // Step 3: Client Type
  const [qrClientType, setQrClientType] = useState<string>('all');
  const [qrChannels, setQrChannels] = useState<string[]>(['dine_in', 'counter']);

  // Step 4: Location & Placement
  const [qrBranch, setQrBranch] = useState<string>('Downtown Flagship Bistro');
  const [qrPlacement, setQrPlacement] = useState<string>('table');
  const [qrMaterial, setQrMaterial] = useState<string>('acrylic');
  const [qrTableCount, setQrTableCount] = useState<number>(10);
  const [previewTableIndex, setPreviewTableIndex] = useState<number>(1);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    dispatch(fetchQrCodes());
    dispatch(fetchBranches());
    dispatch(fetchAssetTypes());
    dispatch(fetchPlacementTypes());
  }, [dispatch]);

  useEffect(() => {
    if (activeAsset) {
      // The API expects the raw ID (e.g. '1', '2') not 'asset-xxx' if it's prefixed locally.
      // But looking at the mapping, id: String(qr.identifier || qr.id). So activeAsset is the ID.
      dispatch(fetchQrCodeDetails(activeAsset));
      dispatch(fetchQrCodeHistory(activeAsset));
    }
  }, [activeAsset, dispatch]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    standName: '',
    venue: '',
    assetType: 'Acrylic',
    locationPlacement: 'Table',
    materialFinish: '',
    destination: '',
    qrNfcType: 'QR + NFC',
    patternDensity: '',
    errorCorrection: '',
    status: 'Active'
  });

  const [assets, setAssets] = useState<any[]>([]);

  useEffect(() => {
    if (qrCodes && qrCodes.length > 0) {
      const mapped = qrCodes.map((qr: any) => {
        // Use standard ID mapping
        const finalId = String(qr.id);
        
        const branchName = qr.branch?.name || 'Venue';
        const fallbackName = qr.type === 'branch' ? 'Branch QR' : 'Table QR';
        const tableStr = qr.table_number ? ` #${qr.table_number}` : '';
        const titleName = qr.stand_name || (fallbackName + tableStr);

        let materialName = 'Digital QR Code';
        const foundAsset = assetTypes.find(t => String(t.id) === String(qr.asset_type_id));
        if (foundAsset) {
          materialName = foundAsset.name;
        } else {
          if (qr.asset_type_id === 100) materialName = 'Acrylic';
          if (qr.asset_type_id === 101) materialName = 'Brass';
          if (qr.asset_type_id === 102) materialName = 'NFC Puck';
          if (qr.asset_type_id === 103) materialName = 'Sticker';
        }

        return {
        id: finalId,
        title: `${branchName} • ${titleName}`,
        status: qr.status === 'active' ? 'Active' : 'Inactive',
        inspecting: false,
        location: qr.branch?.address || 'Location',
        material: materialName,
        destination: 'Default Routing',
        scans: '0',
        tag: qr.qr_nfc_type || 'QR Only',
        raw: qr
        };
      });
      setAssets(mapped);
      // Only set to mapped[0].id if activeAsset is completely empty, 
      // don't overwrite if it's our hardcoded UUID but not in the initial page list
      if (mapped.length > 0 && !activeAsset) {
        setActiveAsset(mapped[0].id);
      }
    }
  }, [qrCodes]);

  const [isAssetTypeModalOpen, setIsAssetTypeModalOpen] = useState(false);
  const [assetTypeName, setAssetTypeName] = useState('');
  const [assetTypeIsActive, setAssetTypeIsActive] = useState(true);
  const [hasSubmittedAssetType, setHasSubmittedAssetType] = useState(false);

  const handleSaveAssetType = () => {
    setHasSubmittedAssetType(true);
    if (!assetTypeName.trim()) return;

    dispatch(addAssetType({
      name: assetTypeName.trim(),
      type: 'asset',
      status: assetTypeIsActive
    } as AssetTypeOption));
    
    showToast('Asset Type added successfully!');
    setHasSubmittedAssetType(false);
    setIsAssetTypeModalOpen(false);
  };

  const [isPlacementTypeModalOpen, setIsPlacementTypeModalOpen] = useState(false);
  const [placementTypeName, setPlacementTypeName] = useState('');
  const [placementTypeIsActive, setPlacementTypeIsActive] = useState(true);
  const [hasSubmittedPlacementType, setHasSubmittedPlacementType] = useState(false);

  const handleSavePlacementType = () => {
    setHasSubmittedPlacementType(true);
    if (!placementTypeName.trim()) return;

    dispatch(addPlacementType({
      name: placementTypeName.trim(),
      status: placementTypeIsActive
    } as PlacementTypeOption));
    
    showToast('Placement Type added successfully!');
    setHasSubmittedPlacementType(false);
    setIsPlacementTypeModalOpen(false);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.standName || !createForm.venue) {
      showToast('Please fill all required fields');
      return;
    }

    const newId = `asset-${Math.floor(1000 + Math.random() * 9000)}`;

    // CREDIT CHECK GATING (10 credits per QR generation/stand)
    // const allowed = checkAndDeductCredit('qr_generation', 10, newId, `Generate Stand QR: ${createForm.standName}`);
    // if (!allowed) {
    //   return; // Blocked due to insufficient wallet credits
    // }

    // Map asset type to ID
    let assetTypeId = 100;
    if (createForm.assetType) {
      const parsed = Number(createForm.assetType);
      if (!isNaN(parsed)) {
        assetTypeId = parsed;
      } else {
        if (createForm.assetType === 'Brass') assetTypeId = 101;
        if (createForm.assetType === 'NFC Puck') assetTypeId = 102;
        if (createForm.assetType === 'Sticker') assetTypeId = 103;
      }
    }

    // Map placement to ID
    let placementId = 20;
    if (createForm.locationPlacement) {
      const parsed = Number(createForm.locationPlacement);
      if (!isNaN(parsed)) {
        placementId = parsed;
      } else {
        if (createForm.locationPlacement === 'Counter') placementId = 21;
        if (createForm.locationPlacement === 'Garden') placementId = 22;
        if (createForm.locationPlacement === 'Window') placementId = 23;
      }
    }

    const payload = {
      stand_name: createForm.standName,
      branch_id: Number(createForm.venue),
      asset_type_id: assetTypeId,
      placement_id: placementId,
      qr_nfc_type: createForm.qrNfcType || 'QR + NFC',
      status: createForm.status.toLowerCase()
    };

    try {
      await dispatch(createQrCode(payload)).unwrap();
      setIsCreateModalOpen(false);

      // Reset form
      setCreateForm({
        standName: '',
        venue: '',
        assetType: 'Acrylic',
        locationPlacement: 'Table',
        materialFinish: '',
        destination: '',
        qrNfcType: 'QR + NFC',
        patternDensity: '',
        errorCorrection: '',
        status: 'Active'
      });

      showToast('New Dynamic Stand created successfully!');
    } catch (err: any) {
      showToast(err || 'Failed to create stand');
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await dispatch(updateQrCodeStatus({ id, status: newStatus })).unwrap();
      showToast(`Asset marked as ${newStatus}`);
    } catch (err: any) {
      showToast(err || 'Failed to update asset status');
    }
  };

  const filteredAssets = assets.filter(a => {
    const searchMatch = a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.id.toLowerCase().includes(searchQuery.toLowerCase());

    let venueMatch = true;
    if (venueFilter !== 'VENUE: All') {
      if (venueFilter.includes('Downtown')) venueMatch = a.title.includes('Downtown');
      else if (venueFilter.includes('Northside')) venueMatch = a.title.includes('Northside');
      else if (venueFilter.includes('West End')) venueMatch = a.title.includes('West End');
    }

    let typeMatch = true;
    if (assetTypeFilter !== 'ASSET TYPE: All (Acrylic, Brass, NFC)') {
      if (assetTypeFilter.includes('Acrylic')) typeMatch = a.material.includes('Acrylic');
      else if (assetTypeFilter.includes('Brass')) typeMatch = a.material.includes('Brass');
    }

    return searchMatch && venueMatch && typeMatch;
  });

  const selectedAssetDetails = assets.find(a => a.id === activeAsset) || assets[0];

  const DropdownSelect = ({ id, value, options, onChange }: { id: string, value: string, options: string[], onChange: (v: string) => void }) => (
    <div className="relative" ref={openDropdown === id ? dropdownRef : null}>
      <button
        onClick={() => setOpenDropdown(openDropdown === id ? null : id)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#EFECE6] text-[#1A1615] rounded-md hover:bg-[#EFECE6] transition-colors whitespace-nowrap shrink-0"
      >
        {value} <ChevronDown className="w-3.5 h-3.5" />
      </button>
      {openDropdown === id && (
        <div className="absolute top-full mt-1 left-0 min-w-[200px] bg-white border border-[#EFECE6] rounded-lg shadow-lg z-50 py-1 overflow-hidden">
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpenDropdown(null); }}
              className={`w-full text-left px-3 py-2 text-xs hover:bg-[#FAF8F5] transition-colors ${value === opt ? 'font-bold text-[#1A1615] bg-[#FAF8F5]' : 'font-medium text-[#6E6A66]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  // -------------------------------------------------------------
  // 5-STEP QR GENERATOR WIZARD (Matching Images 4 & 5)
  // -------------------------------------------------------------
  const qrCampaignsList = [
    {
      id: 'first-visit',
      name: 'First Visit Special',
      description: '20% OFF on your first visit',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'weekend-treat',
      name: 'Weekend Treat',
      description: '15% OFF on selected items',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'birthday-special',
      name: 'Birthday Special',
      description: 'Free dessert on your birthday',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'happy-hours',
      name: 'Happy Hours',
      description: '1+1 on selected drinks',
      status: 'Paused',
      image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=120&auto=format&fit=crop&q=80'
    },
    {
      id: 'combo-offer',
      name: 'Combo Offer',
      description: 'Save more with combos',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop&q=80'
    }
  ];

  const qrSteps = [
    { id: 1, name: 'Campaign' },
    { id: 2, name: 'Time duration' },
    { id: 3, name: 'Client type' },
    { id: 4, name: 'Location' },
    { id: 5, name: 'Review Generate' }
  ];

  const filteredCampaigns = qrCampaignsList.filter(c =>
    c.name.toLowerCase().includes(campaignSearch.toLowerCase()) ||
    c.description.toLowerCase().includes(campaignSearch.toLowerCase())
  );

  const selectedCampaignObj = qrCampaignsList.find(c => c.id === selectedCampaignId) || qrCampaignsList[0];

  const renderQrDesktopStepper = () => (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
        <span>&gt; Home</span>
        <span className="text-gray-700 font-bold">Campaign &amp; Loyalty Management</span>
      </div>

      {/* Page Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
            Campaign &amp; Loyalty Management
            <Sparkles className="w-5 h-5 text-[#E83E8C] fill-[#E83E8C]" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Create, monitor, and optimize your customer engagement programs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPageMode(pageMode === 'wizard' ? 'library' : 'wizard')}
          className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] hover:bg-gray-50 shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          {pageMode === 'wizard' ? (
            <>
              <Layers className="w-3.5 h-3.5 text-[#5844A8]" />
              View QR Stand Library
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 text-[#5844A8]" />
              Generate New QR Code
            </>
          )}
        </button>
      </div>

      {/* 5-Step Stepper */}
      <div className="relative flex items-center justify-between max-w-3xl pt-2">
        {qrSteps.map((st) => {
          const isCompleted = qrStep > st.id;
          const isCurrent = qrStep === st.id;

          return (
            <div key={st.id} className="flex flex-col items-center relative z-10">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  isCurrent
                    ? 'bg-[#5844A8] text-white shadow-md ring-4 ring-purple-100'
                    : isCompleted
                    ? 'bg-[#5844A8] text-white'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : st.id}
              </div>
              <span className={`text-xs font-bold mt-2 whitespace-nowrap ${
                isCurrent ? 'text-[#5844A8]' : 'text-gray-400'
              }`}>
                {st.name}
              </span>
            </div>
          );
        })}
        {/* Connector Line */}
        <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-0"></div>
      </div>
    </div>
  );

  // STEP 1: SELECT CAMPAIGN (Image 4)
  const renderQrStep1 = () => (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#1E1548]">Select Campaign</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Choose the campaign for which you want to generate QR codes.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search campaign..."
          value={campaignSearch}
          onChange={(e) => setCampaignSearch(e.target.value)}
          className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
        />
      </div>

      {/* Campaign List Cards */}
      <div className="space-y-3">
        {filteredCampaigns.map((camp) => {
          const isSelected = selectedCampaignId === camp.id;
          return (
            <div
              key={camp.id}
              onClick={() => setSelectedCampaignId(camp.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between bg-white ${
                isSelected
                  ? 'border-2 border-[#5844A8] shadow-sm'
                  : 'border-gray-200/80 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={camp.image}
                  alt={camp.name}
                  className="w-11 h-11 rounded-xl object-cover"
                />
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#1E1548]">{camp.name}</h4>
                  <p className="text-[11px] text-gray-400 mt-0.5">{camp.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                    camp.status === 'Active'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${camp.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {camp.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
        <button
          type="button"
          onClick={() => setPageMode('library')}
          className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={() => setQrStep(2)}
          className="px-7 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );

  // STEP 2: TIME DURATION (Image 5)
  const renderQrStep2 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: Set Time Duration Form (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#1E1548]">Set Time Duration</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Choose when you want this QR code to be active.
            </p>
          </div>

          {/* Start Date & End Date Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={qrStartDate}
                  onChange={(e) => setQrStartDate(e.target.value)}
                  placeholder="15 Sep 2025"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                End Date <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={qrEndDate}
                  onChange={(e) => setQrEndDate(e.target.value)}
                  placeholder="30 Sep 2025"
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                />
              </div>
            </div>
          </div>

          {/* Is this a recurring campaign toggle */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-[#1E1548]">
                Is this a recurring campaign? <span className="text-gray-400 font-normal">(Optional)</span>
              </span>
              <button
                type="button"
                onClick={() => setQrIsRecurring(v => !v)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  qrIsRecurring ? 'bg-[#5844A8]' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                    qrIsRecurring ? 'translate-x-5' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Recurring Controls */}
            {qrIsRecurring && (
              <div className="space-y-4 pt-2">
                {/* Repeat Frequency & Repeat On Days */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Repeat</label>
                    <select
                      value={qrRepeatFreq}
                      onChange={(e) => setQrRepeatFreq(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    >
                      <option value="Daily">Daily</option>
                      <option value="Weekly">Weekly</option>
                      <option value="Monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">Repeat on</label>
                    <div className="flex items-center gap-1.5">
                      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, idx) => {
                        const isDaySelected = qrRepeatDays.includes(day);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setQrRepeatDays(prev =>
                                prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
                              );
                            }}
                            className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors cursor-pointer ${
                              isDaySelected
                                ? 'bg-[#5844A8] text-white shadow-2xs'
                                : 'bg-[#FAF8FF] border border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* End Recurrence Options */}
                <div className="space-y-2 pt-2">
                  <label className="block text-[11px] font-bold text-gray-400">End recurrence</label>

                  {/* Option 1: No end date */}
                  <div
                    onClick={() => setQrEndRecurrence('no_end')}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1E1548]"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      qrEndRecurrence === 'no_end' ? 'border-[#5844A8]' : 'border-gray-300'
                    }`}>
                      {qrEndRecurrence === 'no_end' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                    </div>
                    <span>No end date</span>
                  </div>

                  {/* Option 2: End after X occurrences */}
                  <div
                    onClick={() => setQrEndRecurrence('occurrences')}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1E1548]"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      qrEndRecurrence === 'occurrences' ? 'border-[#5844A8]' : 'border-gray-300'
                    }`}>
                      {qrEndRecurrence === 'occurrences' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                    </div>
                    <span>End after</span>
                    <input
                      type="number"
                      value={qrOccurrences}
                      onChange={(e) => setQrOccurrences(Number(e.target.value))}
                      className="w-14 px-2 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-center text-[#1E1548]"
                    />
                    <span>occurrences</span>
                  </div>

                  {/* Option 3: End on date */}
                  <div
                    onClick={() => setQrEndRecurrence('end_date')}
                    className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1E1548]"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      qrEndRecurrence === 'end_date' ? 'border-[#5844A8]' : 'border-gray-300'
                    }`}>
                      {qrEndRecurrence === 'end_date' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                    </div>
                    <span>End on</span>
                    <div className="relative">
                      <Calendar className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={qrRecurrenceEndDate}
                        onChange={(e) => setQrRecurrenceEndDate(e.target.value)}
                        className="pl-8 pr-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold text-[#1E1548]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Card: Calendar & Clock Illustration (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white border border-purple-50 rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col justify-between items-center text-center min-h-[460px]">
          {/* Stylized Calendar Graphic */}
          <div className="w-48 h-48 relative my-auto flex items-center justify-center">
            {/* Calendar Base */}
            <div className="w-40 h-44 bg-gradient-to-b from-[#FAF8FF] to-white rounded-3xl shadow-xl border-2 border-purple-100 p-3.5 flex flex-col justify-between relative overflow-hidden">
              {/* Ring Binders */}
              <div className="flex justify-around absolute -top-1.5 left-0 right-0 px-5">
                <div className="w-2 h-4 bg-purple-400 rounded-full" />
                <div className="w-2 h-4 bg-purple-400 rounded-full" />
                <div className="w-2 h-4 bg-purple-400 rounded-full" />
                <div className="w-2 h-4 bg-purple-400 rounded-full" />
              </div>

              {/* Day Grid Dots */}
              <div className="mt-4 grid grid-cols-4 gap-2 opacity-80">
                <div className="h-3 bg-purple-100 rounded-md" />
                <div className="h-3 bg-purple-100 rounded-md" />
                <div className="h-3 bg-[#5844A8] rounded-md shadow-xs" />
                <div className="h-3 bg-purple-100 rounded-md" />
                <div className="h-3 bg-[#5844A8] rounded-md shadow-xs" />
                <div className="h-3 bg-purple-100 rounded-md" />
                <div className="h-3 bg-purple-100 rounded-md" />
                <div className="h-3 bg-purple-100 rounded-md" />
              </div>
              <div className="h-3.5 bg-purple-100/70 rounded-md" />
            </div>

            {/* Overlay Clock */}
            <div className="absolute -bottom-1 -right-1 w-20 h-20 bg-white rounded-full shadow-2xl border-4 border-[#5844A8] flex items-center justify-center">
              <Clock className="w-9 h-9 text-[#5844A8]" />
            </div>
          </div>

          <div className="space-y-1.5 pt-4">
            <h4 className="text-base font-bold text-[#1E1548]">Set a valid time period</h4>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
              Your QR codes will be active only during this period. You can also set it to repeat automatically.
            </p>
          </div>

          {/* Tip Callout */}
          <div className="mt-5 bg-[#FAF8FF] border border-purple-100/80 rounded-2xl p-3 text-left flex items-start gap-2.5 w-full">
            <div className="w-4 h-4 rounded-full bg-purple-100 text-[#5844A8] flex items-center justify-center shrink-0 mt-0.5">
              <Info className="w-3 h-3" />
            </div>
            <p className="text-[11px] text-purple-900 font-medium leading-relaxed">
              <span className="font-bold">Tip:</span> Use recurring campaigns for regular offers like Happy Hours or Weekly Specials.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
        <button
          type="button"
          onClick={() => setQrStep(1)}
          className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={() => setQrStep(3)}
          className="px-7 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );

  // STEP 3: CLIENT TYPE
  const renderQrStep3 = () => (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#1E1548]">Select Client Type</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Choose the eligible customer tier and channels for this QR stand.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { id: 'all', title: 'All Customers', desc: 'Open to all scanning diners (Recommended)', icon: Users, color: 'text-[#7C3AED] bg-purple-50' },
          { id: 'new', title: 'New Customers Only', desc: 'First-time unregistered guests only', icon: UserPlus, color: 'text-blue-600 bg-blue-50' },
          { id: 'tier', title: 'Loyalty Tier Members', desc: 'Gold, VIP, & Platinum pass holders', icon: Crown, color: 'text-amber-600 bg-amber-50' },
          { id: 'winback', title: 'Winback Guests', desc: 'Inactive for 30+ days without a visit', icon: RotateCcw, color: 'text-rose-600 bg-rose-50' }
        ].map((ct) => {
          const IconC = ct.icon;
          const isSelected = qrClientType === ct.id;
          return (
            <div
              key={ct.id}
              onClick={() => setQrClientType(ct.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                isSelected ? 'border-2 border-[#5844A8] bg-[#FAF8FF]/40 shadow-2xs' : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-1 ${
                isSelected ? 'border-[#5844A8]' : 'border-gray-300'
              }`}>
                {isSelected && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
              </div>

              <div className={`w-9 h-9 rounded-xl ${ct.color} flex items-center justify-center shrink-0`}>
                <IconC className="w-4.5 h-4.5" />
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#1E1548]">{ct.title}</h4>
                <p className="text-[11px] text-gray-400 mt-0.5">{ct.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Channel selection */}
      <div className="pt-2 border-t border-gray-100">
        <label className="block text-xs font-bold text-[#1E1548] mb-2">Applicable Ordering Channels</label>
        <div className="flex flex-wrap items-center gap-3">
          {[
            { id: 'dine_in', label: 'Dine-in (Table Service)' },
            { id: 'counter', label: 'Takeaway / Counter' },
            { id: 'delivery', label: 'Online / Package Insert' }
          ].map(ch => {
            const isChecked = qrChannels.includes(ch.id);
            return (
              <button
                key={ch.id}
                type="button"
                onClick={() => {
                  setQrChannels(prev =>
                    prev.includes(ch.id) ? prev.filter(c => c !== ch.id) : [...prev, ch.id]
                  );
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-2 ${
                  isChecked
                    ? 'border-[#5844A8] bg-purple-50 text-[#5844A8]'
                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }`}
              >
                <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                  isChecked ? 'bg-[#5844A8] border-[#5844A8] text-white' : 'border-gray-300 bg-white'
                }`}>
                  {isChecked && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
                {ch.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
        <button
          type="button"
          onClick={() => setQrStep(2)}
          className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={() => setQrStep(4)}
          className="px-7 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );

  // STEP 4: LOCATION & PLACEMENT
  const renderQrStep4 = () => (
    <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
      <div>
        <h3 className="text-base font-bold text-[#1E1548]">Select Location &amp; Placement</h3>
        <p className="text-xs text-gray-400 font-medium mt-0.5">
          Specify venue branch, table stands, and material style.
        </p>
      </div>

      {/* Branch selector */}
      <div>
        <label className="block text-xs font-bold text-[#1E1548] mb-1.5">Branch / Venue Outlet *</label>
        <select
          value={qrBranch}
          onChange={(e) => setQrBranch(e.target.value)}
          className="w-full max-w-md bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
        >
          <option value="Downtown Flagship Bistro">Downtown Flagship Bistro</option>
          <option value="Northside Garden Cafe">Northside Garden Cafe</option>
          <option value="West End Express">West End Express</option>
          <option value="All Branches">All Branches</option>
        </select>
      </div>

      {/* Placement Type */}
      <div>
        <label className="block text-xs font-bold text-[#1E1548] mb-2">Placement Stand Type *</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { id: 'table', title: 'Table Stands', desc: 'Numbered stands per table', icon: Store },
            { id: 'counter', title: 'Billing Counter', desc: 'Single point of payment display', icon: Zap },
            { id: 'window', title: 'Entrance Standee', desc: 'Large walk-in promo poster', icon: MapPin },
            { id: 'digital', title: 'Digital Screen', desc: 'TV display / tablet menu', icon: Smartphone }
          ].map(p => {
            const IconP = p.icon;
            const isSelected = qrPlacement === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setQrPlacement(p.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected ? 'border-2 border-[#5844A8] bg-[#FAF8FF]/40 shadow-2xs' : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center mb-3">
                  <IconP className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1E1548]">{p.title}</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">{p.desc}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stand Material & Table Count */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div>
          <label className="block text-xs font-bold text-[#1E1548] mb-1.5">Stand Material Finish</label>
          <select
            value={qrMaterial}
            onChange={(e) => setQrMaterial(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
          >
            <option value="acrylic">Clear Acrylic Stand</option>
            <option value="brass">Brushed Metal / Brass Tent</option>
            <option value="nfc">NFC Puck (Tap &amp; Scan)</option>
            <option value="sticker">Vinyl Table Sticker Decal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1E1548] mb-1.5">Number of Tables / Stands</label>
          <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-2xs">
            <button
              type="button"
              onClick={() => setQrTableCount(c => Math.max(1, c - 1))}
              className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-12 text-center text-xs font-bold text-[#1E1548]">{qrTableCount} Stands</span>
            <button
              type="button"
              onClick={() => setQrTableCount(c => c + 1)}
              className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
        <button
          type="button"
          onClick={() => setQrStep(3)}
          className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={() => setQrStep(5)}
          className="px-7 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
        >
          Next &rarr;
        </button>
      </div>
    </div>
  );

  // STEP 5: REVIEW GENERATE
  const renderQrStep5 = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Summary and Export Actions (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-[#1E1548]">Review &amp; Generate QR Codes</h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              Verify your setup and generate production-ready physical QR stands.
            </p>
          </div>

          {/* 4 Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Campaign</span>
              <div className="text-xs font-bold text-[#1E1548]">{selectedCampaignObj.name}</div>
              <div className="text-[11px] text-gray-500">{selectedCampaignObj.description}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Validity &amp; Schedule</span>
              <div className="text-xs font-bold text-[#1E1548]">{qrStartDate} — {qrEndDate}</div>
              <div className="text-[11px] text-[#5844A8] font-semibold">{qrIsRecurring ? `${qrRepeatFreq} Recurring (${qrRepeatDays.join(', ')})` : 'One-time period'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Client Type</span>
              <div className="text-xs font-bold text-[#1E1548]">
                {qrClientType === 'all' ? 'All Customers' : qrClientType === 'new' ? 'New Customers' : 'Loyalty Members'}
              </div>
              <div className="text-[11px] text-gray-500">{qrChannels.join(', ')}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FAF8FF] border border-purple-100/70 space-y-1">
              <span className="text-[10px] uppercase font-bold text-gray-400">Location &amp; Placement</span>
              <div className="text-xs font-bold text-[#1E1548]">{qrBranch}</div>
              <div className="text-[11px] text-gray-500">
                {qrTableCount} {qrPlacement === 'table' ? 'Table Stands' : 'Stands'} ({qrMaterial})
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => showToast(`QR Stand #${previewTableIndex} downloaded as high-res PNG!`)}
              className="w-full py-3 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-[#5844A8]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Table #{previewTableIndex} QR PNG (300 DPI)
            </button>

            <button
              type="button"
              onClick={() => showToast(`Generating print-ready PDF pack for ${qrTableCount} stands...`)}
              className="w-full py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#1E1548] text-xs font-bold rounded-xl transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-gray-500" /> Print Complete Standee PDF Pack ({qrTableCount} Stands)
            </button>
          </div>
        </div>

        {/* Right Column: Physical Acrylic Standee Mockup (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#FAF8FF] to-purple-50/50 rounded-3xl p-6 lg:p-8 border border-purple-100 shadow-sm flex flex-col items-center">
          <div className="text-xs font-bold text-[#1E1548] mb-1">Standee Preview</div>
          <p className="text-[11px] text-gray-400 mb-4">Table #{previewTableIndex} of {qrTableCount}</p>

          {/* Acrylic Stand Graphic Frame */}
          <div className="w-[240px] bg-white rounded-2xl shadow-xl border-4 border-gray-100 p-4 text-center space-y-3 relative overflow-hidden">
            {/* Top Header */}
            <div className="bg-[#5844A8] -mx-4 -mt-4 py-2 text-white">
              <span className="text-[9px] uppercase tracking-wider font-extrabold">SCAN TO AVAIL</span>
              <div className="text-xs font-black">{selectedCampaignObj.name}</div>
            </div>

            {/* QR Code SVG */}
            <div className="p-3 bg-white rounded-xl border border-gray-100 shadow-2xs inline-block">
              <svg viewBox="0 0 100 100" className="w-36 h-36">
                {/* QR Finder Patterns */}
                <rect x="5" y="5" width="28" height="28" fill="#1E1548" rx="4" />
                <rect x="10" y="10" width="18" height="18" fill="white" rx="2" />
                <rect x="14" y="14" width="10" height="10" fill="#5844A8" rx="1.5" />

                <rect x="67" y="5" width="28" height="28" fill="#1E1548" rx="4" />
                <rect x="72" y="10" width="18" height="18" fill="white" rx="2" />
                <rect x="76" y="14" width="10" height="10" fill="#5844A8" rx="1.5" />

                <rect x="5" y="67" width="28" height="28" fill="#1E1548" rx="4" />
                <rect x="10" y="72" width="18" height="18" fill="white" rx="2" />
                <rect x="14" y="76" width="10" height="10" fill="#5844A8" rx="1.5" />

                {/* Grid Dots */}
                <rect x="38" y="10" width="5" height="5" fill="#1E1548" />
                <rect x="48" y="10" width="5" height="5" fill="#1E1548" />
                <rect x="58" y="10" width="5" height="5" fill="#1E1548" />
                <rect x="38" y="20" width="5" height="5" fill="#1E1548" />
                <rect x="48" y="25" width="5" height="5" fill="#5844A8" />
                <rect x="10" y="38" width="5" height="5" fill="#1E1548" />
                <rect x="20" y="48" width="5" height="5" fill="#1E1548" />
                <rect x="38" y="48" width="5" height="5" fill="#5844A8" />
                <rect x="58" y="48" width="5" height="5" fill="#1E1548" />
                <rect x="78" y="38" width="5" height="5" fill="#1E1548" />
                <rect x="88" y="48" width="5" height="5" fill="#1E1548" />
                <rect x="38" y="68" width="5" height="5" fill="#1E1548" />
                <rect x="48" y="78" width="5" height="5" fill="#1E1548" />
                <rect x="58" y="68" width="5" height="5" fill="#5844A8" />
                <rect x="68" y="78" width="5" height="5" fill="#1E1548" />
                <rect x="78" y="88" width="5" height="5" fill="#1E1548" />
                <rect x="88" y="78" width="5" height="5" fill="#1E1548" />

                {/* Center Logo */}
                <circle cx="50" cy="50" r="10" fill="#5844A8" />
                <text x="50" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">R</text>
              </svg>
            </div>

            {/* Table Number Badge */}
            <div className="bg-purple-50 text-[#5844A8] border border-purple-200/60 rounded-lg py-1 px-3 inline-block">
              <span className="text-xs font-black">TABLE #{previewTableIndex}</span>
            </div>

            <div className="text-[9.5px] text-gray-400">
              Tap phone or scan with camera
            </div>
          </div>

          {/* Table Stand Selector */}
          <div className="flex items-center gap-2 mt-4">
            <button
              type="button"
              disabled={previewTableIndex <= 1}
              onClick={() => setPreviewTableIndex(i => Math.max(1, i - 1))}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              &larr; Prev
            </button>
            <span className="text-xs font-bold text-[#1E1548]">Table {previewTableIndex} of {qrTableCount}</span>
            <button
              type="button"
              disabled={previewTableIndex >= qrTableCount}
              onClick={() => setPreviewTableIndex(i => Math.min(qrTableCount, i + 1))}
              className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 cursor-pointer"
            >
              Next &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
        <button
          type="button"
          onClick={() => setQrStep(4)}
          className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
        >
          &larr; Back
        </button>

        <button
          type="button"
          onClick={() => {
            showToast(`${qrTableCount} QR Stands generated and saved to library!`);
            setPageMode('library');
          }}
          className="px-8 py-2.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
        >
          <CheckCircle2 className="w-4 h-4" /> Finish &amp; View in Library
        </button>
      </div>
    </div>
  );

  // -------------------------------------------------------------
  // MAIN RENDER CONTROLLER
  // -------------------------------------------------------------
  if (pageMode === 'wizard') {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            <span>{feedbackToast}</span>
          </div>
        )}

        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderQrDesktopStepper()}

          {qrStep === 1 && renderQrStep1()}
          {qrStep === 2 && renderQrStep2()}
          {qrStep === 3 && renderQrStep3()}
          {qrStep === 4 && renderQrStep4()}
          {qrStep === 5 && renderQrStep5()}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-4 lg:p-6 bg-[#FAF8F5] min-h-[calc(100vh-4rem)] space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Bottom Toast Feedback */}
        {feedbackToast && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold border border-[#3D3732] animate-in slide-in-from-bottom-5 fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            <span>{feedbackToast}</span>
          </div>
        )}

        {/* 2. NAVIGATION & PAGE HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1.5">
              <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight">
                QR Codes &amp; Physical Asset Hub
              </h1>
            </div>
            <p className="text-sm text-[#6E6A66] max-w-3xl">
              Manage contactless tabletop stands, counter acrylics, digital pass enrollment codes, and multi-venue scan routing with instantaneous cloud redirect dispatch.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setPageMode('wizard')}
              className="flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-[#5844A8] hover:bg-[#47368E] rounded-lg transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4 text-white" />
              Generate QR Code (Wizard)
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-white border border-[#EAE6E1] hover:bg-[#FAF8F5] rounded-lg transition-colors shadow-xs cursor-pointer">
              <Download className="w-4 h-4" />
              Download Print PDF Pack
            </button>
          </div>
        </div>

        {/* 3. TOP KPI METRICS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1 */}
          <div className="bg-white rounded-xl border border-[#EFECE6] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Total Active Stands</div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FDF8EB] text-[#D4A753] border border-[#F3E5C8] rounded">
                +3 this month
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A1615] mb-1">18 Stands</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">16 Acrylic • 2 Milled Brass</div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white rounded-xl border border-[#EFECE6] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">30-Day Physical Scans</div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6F4ED] text-[#0D7A53] border border-[#BCE3D1] rounded flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +21.4%
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A1615] mb-1">42,890 scans</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">Table &amp; Counter combined</div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white rounded-xl border border-[#EFECE6] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Scan-to-Pass Enrolled</div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] rounded">
                High Yield
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A1615] mb-1">68.2% conversion</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">Guest to Wallet Member</div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white rounded-xl border border-[#EFECE6] p-5 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-start mb-2">
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">Routing Health</div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB] rounded uppercase">
                28ms LATENCY
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#1A1615] mb-1">99.9% Online</div>
              <div className="text-[11px] font-semibold text-[#6E6A66]">Zero 404 dead links</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* 4. LEFT SECTION: ASSET INVENTORY MANAGEMENT */}
          <div className="lg:col-span-7 space-y-4">

            {/* Filter & Search Toolbar */}
            <div className="bg-white rounded-xl border border-[#EFECE6] p-4 shadow-xs space-y-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stand ID, venue, table or zone..."
                    className="w-full pl-9 pr-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-sm focus:outline-none focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753]/20 transition-all text-[#1A1615] font-semibold"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-4 py-2 text-[13px] font-semibold transition-colors cursor-pointer shrink-0 rounded-lg border ${showFilters
                    ? 'bg-[#FAF8F5] border-[#D4A753] text-[#D4A753]'
                    : 'bg-white border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1615]'
                    }`}>
                  <Filter className="w-4 h-4" />
                  More Filters
                </button>
              </div>

              {showFilters && (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#EFECE6]">
                  <div className="flex flex-wrap items-center gap-2">
                    <DropdownSelect
                      id="venue"
                      value={venueFilter}
                      options={['VENUE: All', 'VENUE: Downtown Flagship', 'VENUE: Northside Mall', 'VENUE: West End Kiosk']}
                      onChange={setVenueFilter}
                    />
                    <DropdownSelect
                      id="type"
                      value={assetTypeFilter}
                      options={['ASSET TYPE: All (Acrylic, Brass, NFC)', 'ASSET TYPE: Acrylic', 'ASSET TYPE: Brass']}
                      onChange={setAssetTypeFilter}
                    />
                    <DropdownSelect
                      id="dest"
                      value={destinationFilter}
                      options={['DESTINATION: All Routing Targets']}
                      onChange={setDestinationFilter}
                    />
                  </div>
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#9E9A93]">
                    Showing {filteredAssets.length} of {assets.length}
                  </div>
                </div>
              )}
            </div>

            {/* Asset List Cards */}
            <div className="space-y-3">
              {filteredAssets.map((asset) => {
                const isActive = activeAsset === asset.id;
                return (
                  <div
                    key={asset.id}
                    onClick={() => setActiveAsset(asset.id)}
                    className={`bg-white rounded-xl border-2 p-5 transition-all cursor-pointer shadow-xs hover:shadow-sm ${isActive ? 'border-[#D4A753]' : 'border-[#EFECE6] hover:border-[#D1CDC7]'
                      }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Checkbox mock */}
                      <div className="shrink-0 mt-1">
                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isActive ? 'bg-[#D4A753] border-[#D4A753] text-white' : 'bg-[#FAF8F5] border-[#D1CDC7]'}`}>
                          {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <h3 className="text-[15px] font-bold text-[#1A1615] truncate">{asset.title}</h3>
                          <div className="flex items-center gap-2 shrink-0 relative">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedActionAsset(asset); setIsEditModalOpen(true); }}
                              className="p-1.5 text-[#9E9A93] hover:text-[#1A1615] rounded bg-[#FAF8F5] transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedActionAsset(asset); setIsDownloadModalOpen(true); }}
                              className="p-1.5 text-[#9E9A93] hover:text-[#1A1615] rounded bg-[#FAF8F5] transition-colors cursor-pointer"><Download className="w-3.5 h-3.5" /></button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenDropdown(openDropdown === asset.id ? null : asset.id); }}
                              className="p-1.5 text-[#9E9A93] hover:text-[#1A1615] rounded bg-[#FAF8F5] transition-colors cursor-pointer"><MoreHorizontal className="w-3.5 h-3.5" /></button>

                            {/* Dropdown Menu */}
                            {openDropdown === asset.id && (
                              <>
                                <div className="fixed inset-0 z-[50]" onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); }} />
                                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-[#EFECE6] rounded-xl shadow-xl z-[60] overflow-hidden">
                                  <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); showToast('Viewing detailed analytics...'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#1A1615] hover:bg-[#FAF8F5]">View Analytics</button>
                                  {asset.status.toLowerCase() === 'active' ? (
                                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); handleUpdateStatus(asset.id, 'inactive'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2]">Deactivate</button>
                                  ) : (
                                    <button onClick={(e) => { e.stopPropagation(); setOpenDropdown(null); handleUpdateStatus(asset.id, 'active'); }} className="w-full text-left px-4 py-2.5 text-xs font-semibold text-[#0D7A53] hover:bg-[#E6F4ED]">Activate Asset</button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-3">
                          <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-bold bg-[#E6F4ED] text-[#0D7A53] rounded uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> {asset.status}
                          </span>
                          {asset.inspecting && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FEF3C7] text-[#B45309] rounded uppercase tracking-wider">
                              Inspecting
                            </span>
                          )}
                          <span className="text-[11px] font-bold text-[#9E9A93] px-2 py-0.5 bg-[#FAF8F5] rounded border border-[#EFECE6]">{asset.tag}</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6E6A66]">
                              <MapPin className="w-3.5 h-3.5 text-[#9E9A93]" /> {asset.location}
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#6E6A66]">
                              <Layers className="w-3.5 h-3.5 text-[#9E9A93]" /> {asset.material}
                            </div>
                          </div>

                          <div className="space-y-1.5 bg-[#FAF8F5] p-2.5 rounded-lg border border-[#EFECE6]">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-[#9E9A93]">Cloud Destination</span>
                              <ChevronDown className="w-3 h-3 text-[#9E9A93]" />
                            </div>
                            <div className="text-xs font-bold text-[#1A1615] truncate">{asset.destination}</div>
                            <div className="text-[10px] font-semibold text-[#6E6A66] pt-1 border-t border-[#EFECE6] flex items-center gap-1.5">
                              <Activity className="w-3 h-3 text-[#0D7A53]" /> 30D SCANS: <span className="text-[#1A1615]">{asset.scans}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. RIGHT SECTION: LIVE VECTOR PREVIEW & ASSET CUSTOMIZER */}
          <div className="lg:col-span-5 sticky top-6 space-y-4">
            {!selectedAssetDetails ? (
              <div className="bg-white rounded-xl border border-[#EFECE6] shadow-sm flex items-center justify-center h-[calc(100vh-8rem)] text-[#9E9A93] font-semibold text-sm">
                Select an asset to view details
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-[#EFECE6] shadow-sm overflow-hidden flex flex-col h-[calc(100vh-8rem)]">

              {/* Card Header & Toggle */}
              <div className="px-5 py-4 border-b border-[#EFECE6] bg-[#FAF8F5] shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[13px] font-bold uppercase tracking-wider text-[#1A1615] truncate max-w-[250px]">{selectedAssetDetails.title.split(' • ')[1] || selectedAssetDetails.title}</h3>
                  {/* <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E0E7FF] text-[#4338CA] border border-[#C7D2FE] rounded uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#4338CA] animate-pulse"></span> LIVE VECTOR PREVIEW
                  </span> */}
                </div>

                {/* <div className="flex p-0.5 bg-[#EFECE6] rounded-lg">
                  <button
                    onClick={() => setActiveTab('front')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'front' ? 'bg-white shadow-xs text-[#1A1615]' : 'text-[#6E6A66] hover:text-[#1A1615]'} cursor-pointer`}>
                    Front Side
                  </button>
                  <button
                    onClick={() => setActiveTab('back')}
                    className={`flex-1 px-3 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'back' ? 'bg-white shadow-xs text-[#1A1615]' : 'text-[#6E6A66] hover:text-[#1A1615]'} cursor-pointer`}>
                    Back Side
                  </button>
                </div> */}
              </div>

              {/* Scrollable Configuration Area */}
              <div className="flex-1 overflow-y-auto p-5 bg-[#FDFBF7]">

                {/* Realistic Printable Stand Mockup Box */}
                <div className="flex justify-center mb-8">
                  <div className="w-[240px] bg-white rounded-t-[16px] shadow-2xl border border-[#EFECE6] relative overflow-hidden flex flex-col items-center pt-6 pb-4">
                    {/* Acrylic Gloss Highlight */}
                    <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-br from-white/80 to-transparent pointer-events-none"></div>

                    <div className="text-[9px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2 z-10">• {selectedAssetDetails.title.split(' • ')[0].toUpperCase()}</div>
                    <h4 className="text-center text-[15px] font-black text-[#1A1615] leading-tight px-6 z-10">
                      {activeTab === 'front' ? 'SCAN TO JOIN REVIA PRIVÉ' : 'REVIA PRIVÉ MEMBER PERKS'}
                    </h4>
                    <p className="text-center text-[10px] font-semibold text-[#6E6A66] px-8 mt-2 mb-6 z-10 leading-snug">
                      {activeTab === 'front' ? 'Unlock complimentary artisanal pour-over on your next reservation.' : 'Tap or scan to access your digital wallet pass and current tier benefits.'}
                    </p>

                    {/* Vector QR Code Core */}
                    <div className="w-32 h-32 bg-white border border-[#EFECE6] rounded-lg p-2 shadow-sm mb-4 z-10 relative flex items-center justify-center">
                      {selectedAssetDetails.raw?.qr_image_url ? (
                        <img src={selectedAssetDetails.raw.qr_image_url} alt="QR Code" className="w-full h-full object-contain" />
                      ) : (
                        <QrCode className="w-full h-full text-[#1A1615]" strokeWidth={1} />
                      )}

                    </div>

                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-[#1A1615] uppercase tracking-widest mb-6 z-10">
                      <Smartphone className="w-3.5 h-3.5" /> OR TAP PHONE HERE (NFC)
                    </div>

                    <div className="w-full flex items-center justify-between px-6 text-[8px] font-bold text-[#9E9A93] tracking-widest uppercase z-10">
                      <span>{selectedAssetDetails.location.toUpperCase()}</span>
                      <span>DYNAMIC ROUTING {selectedAssetDetails.id.split('-')[1]}</span>
                    </div>

                    {/* Bottom Wood Base Representation */}
                    <div className="absolute bottom-0 left-0 right-0 h-3 bg-[#4A3B2C] border-t-2 border-[#33281E] shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"></div>
                  </div>
                </div>



                {/* Material & Dynamic Routing Configuration Controls */}
                <div className="space-y-5">
                  {/* 1. Brand Foil & Acrylic Accent */}
                  {/* <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Brand Foil &amp; Acrylic Accent</label>
                    <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-[#EFECE6]">
                      <div className="flex items-center gap-2 border-r border-[#EFECE6] pr-3">
                        <button className="w-6 h-6 rounded-full bg-[#D4A753] ring-2 ring-offset-1 ring-[#D4A753]"></button>
                        <button className="w-6 h-6 rounded-full bg-[#1A1615] border border-[#EFECE6] hover:scale-110 transition-transform"></button>
                        <button className="w-6 h-6 rounded-full bg-[#0D7A53] border border-[#EFECE6] hover:scale-110 transition-transform"></button>
                      </div>
                      <span className="text-xs font-semibold text-[#1A1615]">Champagne Gold Hot-stamped metallic foil</span>
                    </div>
                  </div> */}

                  {/* 2. Dynamic Routing Target (Cloud Redirect) */}
                  {/* <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Dynamic Routing Target</label>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#FEF3C7] text-[#B45309] rounded uppercase">INSTANT SHIFT</span>
                    </div>
                    <div className="bg-white rounded-xl border border-[#EFECE6] overflow-hidden">
                      <div className="relative border-b border-[#EFECE6]">
                        <select className="w-full appearance-none px-3 py-2.5 bg-transparent text-xs font-bold text-[#1A1615] focus:outline-none cursor-pointer pr-10">
                          <option>Revia Black Tier VIP Welcome + Instant Table Perk</option>
                          <option>Standard App Enrollment &amp; Wallet Pass</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                      </div>
                      <div className="px-3 py-2 bg-[#FAF8F5] text-[11px] font-mono text-[#0D7A53] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> https://revia.club/df/104
                      </div>
                    </div>
                  </div> */}

                  {/* 3. Pattern Density & Error Correction */}
                  {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Pattern Density</label>
                      <div className="relative">
                        <select className="w-full appearance-none px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer">
                          <option>Micro-Data (Rounded)</option>
                          <option>Standard (Square)</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9A93] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Error Correction</label>
                      <div className="relative">
                        <select className="w-full appearance-none px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer">
                          <option>Level H (30% Damage Proof)</option>
                          <option>Level Q (25% Damage Proof)</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9E9A93] pointer-events-none" />
                      </div>
                    </div>
                  </div> */}

                  {/* 4. Physical Material Fabric */}
                  {/* <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Physical Material Fabric</div>
                      <div className="text-[11px] font-semibold text-[#1A1615]">{selectedAssetDetails.material}</div>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-[#EFECE6] rounded-lg text-[10px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors cursor-pointer shrink-0 uppercase tracking-wider">
                      Change
                    </button>
                  </div> */}
                </div>

              </div>

              {/* Action Controls Footer */}
              <div className="p-4 bg-white border-t border-[#EFECE6] shrink-0">
                <div className="flex items-center gap-3 mb-3">
                  <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-[13px] font-bold text-[#1A1615] bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] rounded-lg transition-colors shadow-sm cursor-pointer">
                    <Download className="w-4 h-4" />
                    Download Vector
                  </button>
                  <button className="flex-1 flex justify-center items-center gap-2 px-4 py-2 text-[13px] font-bold text-white bg-gradient-to-b from-[#D4A753] to-[#9E782F] hover:opacity-90 rounded-lg transition-opacity shadow-sm cursor-pointer">
                    <Save className="w-4 h-4" /> Save &amp; Push Live
                  </button>
                </div>
                <div className="text-center flex justify-center items-center gap-1.5 text-[10px] font-semibold text-[#6E6A66]">
                  <Info className="w-3.5 h-3.5" />Changes update cloud redirect without reprinting physical stand!
                </div>
              </div>

              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && selectedActionAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsEditModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] flex justify-between items-center bg-[#FAF8F5]">
              <h2 className="text-[15px] font-bold text-[#1A1615]">Edit Asset Details</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Asset Title</label>
                <input type="text" defaultValue={selectedActionAsset.title} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Location</label>
                <input type="text" defaultValue={selectedActionAsset.location} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
              </div>
              <button
                onClick={() => { setIsEditModalOpen(false); showToast('Asset updated successfully.'); }}
                className="w-full px-4 py-2 bg-[#1A1615] text-white rounded-lg text-[13px] font-bold shadow-sm mt-2 hover:bg-black transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Download Modal */}
      {isDownloadModalOpen && selectedActionAsset && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsDownloadModalOpen(false)}>
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#EFECE6] flex justify-between items-center bg-[#FAF8F5]">
              <h2 className="text-[15px] font-bold text-[#1A1615]">Download Files</h2>
            </div>
            <div className="p-5 space-y-3">
              <button onClick={() => { setIsDownloadModalOpen(false); showToast(`Downloading ${selectedActionAsset.title} as PDF (Print Ready)...`); }} className="w-full px-4 py-2 bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1615] rounded-lg text-[13px] font-bold shadow-sm flex items-center justify-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Download Vector PDF
              </button>
              <button onClick={() => { setIsDownloadModalOpen(false); showToast(`Downloading ${selectedActionAsset.title} as PNG...`); }} className="w-full px-4 py-2 bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1615] rounded-lg text-[13px] font-bold shadow-sm flex items-center justify-center gap-2 transition-colors">
                <Download className="w-4 h-4" /> Download Web PNG
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Create Dynamic Stand Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setIsCreateModalOpen(false)}>
          <div
            className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#EFECE6] bg-[#FAF8F5] flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-[17px] font-bold text-[#1A1615]">Create Dynamic Stand</h2>
                <p className="text-xs font-medium text-[#6E6A66] mt-1">Configure new physical asset and cloud routing.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-[#9E9A93] hover:text-[#1A1615] transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Body - Form */}
            <div className="flex-1 px-6 py-4 bg-[#FAF8F5]">
              <form id="create-stand-form" onSubmit={handleCreateAsset} className="space-y-4">

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Stand Name <span className="text-[#D4A753]">*</span></label>
                  <input type="text" value={createForm.standName} onChange={e => setCreateForm({ ...createForm, standName: e.target.value })} placeholder="e.g. Tabletop 01" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Venue / Branch <span className="text-[#D4A753]">*</span></label>
                  <div className="relative">
                    <select value={createForm.venue} onChange={e => setCreateForm({ ...createForm, venue: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] appearance-none cursor-pointer">
                      <option value="" disabled>Select Venue / Branch</option>
                      {branches && branches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] flex justify-between items-center">
                      Asset Type
                      <button type="button" onClick={() => setIsAssetTypeModalOpen(true)} className="text-[#D4A753] hover:text-[#C29543] normal-case tracking-normal">+ Add</button>
                    </label>
                    <div className="relative">
                      <select value={createForm.assetType} onChange={e => setCreateForm({ ...createForm, assetType: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer appearance-none">
                        {assetTypes && assetTypes.length > 0 ? (
                          assetTypes.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="100">Acrylic</option>
                            <option value="101">Brass</option>
                            <option value="102">NFC Puck</option>
                            <option value="103">Sticker</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93] flex justify-between items-center">
                      Location / Placement
                      <button type="button" onClick={() => setIsPlacementTypeModalOpen(true)} className="text-[#D4A753] hover:text-[#C29543] normal-case tracking-normal">+ Add</button>
                    </label>
                    <div className="relative">
                      <select value={createForm.locationPlacement} onChange={e => setCreateForm({ ...createForm, locationPlacement: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer appearance-none">
                        {placementTypes && placementTypes.length > 0 ? (
                          placementTypes.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))
                        ) : (
                          <>
                            <option value="20">Table</option>
                            <option value="21">Counter</option>
                            <option value="22">Garden</option>
                            <option value="23">Window</option>
                          </>
                        )}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Material / Finish</label>
                  <input type="text" value={createForm.materialFinish} onChange={e => setCreateForm({ ...createForm, materialFinish: e.target.value })} placeholder="e.g. Walnut Base Acrylic" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Destination / Routing Target</label>
                  <input type="text" value={createForm.destination} onChange={e => setCreateForm({ ...createForm, destination: e.target.value })} placeholder="e.g. Loyalty App Install" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                </div> */}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">QR / NFC Type</label>
                    <div className="relative">
                      <select value={createForm.qrNfcType} onChange={e => setCreateForm({ ...createForm, qrNfcType: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer appearance-none">
                        <option value="QR + NFC">QR + NFC</option>
                        <option value="QR Only">QR Only</option>
                        <option value="NFC Only">NFC Only</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                    </div>
                  </div>

                  {/* <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Pattern Density</label>
                      <input type="text" value={createForm.patternDensity} onChange={e => setCreateForm({ ...createForm, patternDensity: e.target.value })} placeholder="e.g. Micro-Data" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Error Correction</label>
                      <input type="text" value={createForm.errorCorrection} onChange={e => setCreateForm({ ...createForm, errorCorrection: e.target.value })} placeholder="e.g. Level H" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753]" />
                    </div>
                  </div> */}

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-[#9E9A93]">Status</label>
                    <div className="relative">
                      <select value={createForm.status} onChange={e => setCreateForm({ ...createForm, status: e.target.value })} className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] cursor-pointer appearance-none">
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
                    </div>
                  </div>
                </div>

              </form>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-5 border-t border-[#EFECE6] bg-white flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1 px-4 py-2 bg-white border border-[#EFECE6] hover:bg-[#FAF8F5] text-[#1A1615] rounded-lg text-[13px] font-bold shadow-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="create-stand-form"
                className="flex-1 px-4 py-2 bg-gradient-to-b from-[#D4A753] to-[#9E782F] hover:opacity-90 text-white rounded-lg text-[13px] font-bold shadow-sm transition-opacity cursor-pointer"
              >
                Create Dynamic Stand
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Asset Type Modal */}
      {isAssetTypeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsAssetTypeModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              Add New Asset Type
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Asset Name <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={assetTypeName}
                  onChange={e => setAssetTypeName(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedAssetType && !assetTypeName.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter asset name"
                />
                {hasSubmittedAssetType && !assetTypeName.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Name is required</p>}
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#EAE6E1] rounded-lg hover:bg-[#FAF8F5] transition-colors mt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={assetTypeIsActive}
                    onChange={(e) => setAssetTypeIsActive(e.target.checked)}
                    className="w-5 h-5 appearance-none border-2 border-[#D1CDC7] rounded-md checked:bg-[#D4A753] checked:border-[#D4A753] transition-colors cursor-pointer"
                  />
                  {assetTypeIsActive && <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1615]">Active Asset Type</div>
                  <div className="text-[11px] text-[#6E6A66]">Inactive asset types won't appear as options for QR codes.</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setHasSubmittedAssetType(false); setIsAssetTypeModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSaveAssetType} className="px-4 py-2 bg-[#D4A753] text-white text-sm font-bold rounded-lg hover:bg-[#C29543] transition-colors cursor-pointer shadow-sm">
                Add Asset Type
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Placement Type Modal */}
      {isPlacementTypeModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsPlacementTypeModalOpen(false)} 
              className="absolute top-4 right-4 p-1.5 text-[#9E9A93] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold text-[#1A1615] mb-4">
              Add New Placement Type
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1">Placement Name <span className="text-[#DC2626]">*</span></label>
                <input 
                  type="text" 
                  value={placementTypeName}
                  onChange={e => setPlacementTypeName(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:border-[#D4A753] focus:ring-1 focus:ring-[#D4A753] outline-none ${hasSubmittedPlacementType && !placementTypeName.trim() ? 'border-[#DC2626] bg-[#FEF2F2]' : 'border-[#EAE6E1]'}`} 
                  placeholder="Enter placement name"
                />
                {hasSubmittedPlacementType && !placementTypeName.trim() && <p className="text-[#DC2626] text-[10px] font-bold mt-1">Name is required</p>}
              </div>
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-[#EAE6E1] rounded-lg hover:bg-[#FAF8F5] transition-colors mt-2">
                <div className="relative flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={placementTypeIsActive}
                    onChange={(e) => setPlacementTypeIsActive(e.target.checked)}
                    className="w-5 h-5 appearance-none border-2 border-[#D1CDC7] rounded-md checked:bg-[#D4A753] checked:border-[#D4A753] transition-colors cursor-pointer"
                  />
                  {placementTypeIsActive && <Check className="w-3.5 h-3.5 text-white absolute pointer-events-none" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1A1615]">Active Placement Type</div>
                  <div className="text-[11px] text-[#6E6A66]">Inactive placement types won't appear as options.</div>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => { setHasSubmittedPlacementType(false); setIsPlacementTypeModalOpen(false); }} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#FAF8F5] rounded-lg transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleSavePlacementType} className="px-4 py-2 bg-[#D4A753] text-white text-sm font-bold rounded-lg hover:bg-[#C29543] transition-colors cursor-pointer shadow-sm">
                Add Placement Type
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
