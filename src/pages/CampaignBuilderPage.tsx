import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import {
  Clock,
  Wifi,
  Check,
  CheckCircle2,
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Zap,
  UserPlus,
  RefreshCw,
  Percent,
  Star,
  Activity,
  FileText,
  Smartphone,
  ChevronDown,
  DollarSign,
  Users,
  HelpCircle,
  Circle,
  CircleDot,
  X,
  Trophy,
  Gift,
  SlidersHorizontal,
  Lightbulb,
  GripVertical,
  Copy,
  Info,
  Network,
  CornerDownRight,
  Lock,
  Store,
  BarChart3,
  Sparkles,
  TrendingUp,
  Link2,
  Edit2,
  AlertCircle,
  Hourglass,
  MessageSquare,
  Send,
  ShieldCheck,
  QrCode,
  Package,
  Printer,
  Box,
  BellRing,
  Bookmark,
  ChevronRight,
  Wallet,
  Eye,
  Download,
  Image as ImageIcon,
  Award,
  Power,
  MoreVertical,
  Megaphone,
  UserCheck,
  Share2,
  MapPin,
  Search,
  Menu,
  Utensils,
  ShoppingBag,
  CreditCard,
  Car,
  Cake,
  Sun,
  Minus,
  User,
  Crown,
  Pause,
  Coins,
  History,
  RotateCcw,
  LayoutGrid,
  ChevronLeft,
  Monitor
} from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { AddItemModal } from '../components/AddItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns, fetchCampaignById, setCurrentCampaign, createCampaign, updateCampaign, deleteCampaign, toggleCampaignStatus } from '../store/slices/campaignSlice';
import { fetchProducts } from '../store/slices/catalogSlice';
import { fetchBranches } from '../store/slices/branchSlice';
import type { AppDispatch, RootState } from '../store/store';
import apiClient from '../api/apiClient';
import { fetchRuleFields, fetchTierOptions, fetchRewardTypes } from '../store/slices/masterSlice';


export const FIELDS: Record<string, { label: string, type: 'currency' | 'number' | 'date' | 'select' }> = {
  customer_lifetime: { label: "Customer Lifetime", type: "currency" },
  total_stamp_cycle: { label: "Total Stamp Cycle", type: "number" },
  last_visit_date:   { label: "Last Visit Date",   type: "date" },
  current_tier:      { label: "Current Tier",      type: "select" },
  bill_amount:       { label: "Bill Amount",       type: "currency" }
};

export const OPERATORS_BY_TYPE: Record<string, Array<{value: string, label: string}>> = {
  currency: [
    { value: '>', label: 'is greater than' },
    { value: '>=', label: 'is greater than or equal to' },
    { value: '<', label: 'is less than' },
    { value: '<=', label: 'is less than or equal to' },
    { value: '=', label: 'is exactly' },
    { value: 'between', label: 'is between' }
  ],
  number: [
    { value: '>', label: 'is greater than' },
    { value: '>=', label: 'is greater than or equal to' },
    { value: '<', label: 'is less than' },
    { value: '<=', label: 'is less than or equal to' },
    { value: '=', label: 'is exactly' },
    { value: 'between', label: 'is between' }
  ],
  date: [
    { value: 'within_last', label: 'is within the last' },
    { value: 'not_within_last', label: 'is not within the last' },
    { value: 'before', label: 'is before date' },
    { value: 'after', label: 'is after date' },
    { value: 'between', label: 'is between dates' }
  ],
  select: [
    { value: 'is_one_of', label: 'is one of' },
    { value: 'is_not_one_of', label: 'is not one of' }
  ]
};

export const TIER_OPTIONS_FALLBACK = [
  { value: 'obsidian_vip', label: 'Obsidian VIP' },
  { value: 'vvip', label: 'VVIP' },
  { value: 'vip', label: 'VIP' },
  { value: 'gold_reserve', label: 'Gold Reserve' },
  { value: 'silver_tier', label: 'Silver Tier' },
  { value: 'bronze', label: 'Bronze' }
];

export const FIELD_OPTIONS_FALLBACK = Object.entries(FIELDS).map(([key, val]) => ({
  value: key,
  label: val.label
}));

export const getCampaignTypeLabel = (type: string) => {
  if (!type) return '—';
  const labels: Record<string, string> = {
    new_customer: 'New Customer',
    existing_customer: 'Existing Customer',
    direct_customer: 'Direct Special Offer',
    product_qr: 'Product Batch QR',
    welcome_campaign: 'Welcome Campaign',
    old_customer: 'Old Customer',
    visit_campaign: 'Visit Campaign',
    billing_campaign: 'Billing Campaign',
    stamp_campaign: 'Stamp Campaign',
    happy_hours: 'Happy Hours'
  };
  return labels[type] || type.replace(/_/g, ' ');
};

interface CampaignRulesStepProps {
  campaignType: string;
  currency: string;
  onContinue: (config: any) => void;
  onChange?: (config: any) => void;
  onBack: () => void;
  campaignName?: string;
  initialRules?: any[];
  initialStartDate?: string;
  initialEndDate?: string;
  initialTriggerEvent?: string;
  initialActiveBranches?: string[];
  initialMatchType?: 'ALL' | 'ANY';
}

type RuleCondition = {
  id: string;
  type: 'condition';
  field: string;
  operator: string;
  value: any;
  unit?: string;
  error?: string;
};

type RuleGroup = {
  id: string;
  type: 'group';
  matchType: 'ALL' | 'ANY';
  rules: RuleCondition[];
};

type RuleNode = RuleCondition | RuleGroup;

const RULE_FIELDS = [
  { value: 'Customer Lifetime', label: 'Customer Lifetime', icon: Wallet },
  { value: 'Last Visit Date', label: 'Last Visit Date', icon: Calendar },
  { value: 'Current Tier', label: 'Current Tier', icon: Trophy },
  { value: 'Total Stamp Cyc', label: 'Total Stamp Cyc', icon: FileText },
];

const RULE_OPERATORS = [
  { value: 'is greater than or equal to', label: 'is greater than or equal to' },
  { value: 'is within the last', label: 'is within the last' },
  { value: 'is one of', label: 'is one of' },
  { value: 'is greater than', label: 'is greater than' },
];

const RuleDropdown = ({ value, options, onChange, placeholder, minWidth = '160px', className = '' }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find((o: any) => o.value === value);
  const Icon = selected?.icon;

  return (
    <div className={`relative shrink-0 ${className.includes('w-full') ? 'w-full' : ''} ${className.includes('flex-1') ? 'flex-1' : ''}`} style={{ minWidth: className.includes('w-full') || className.includes('flex-1') ? 'auto' : minWidth, zIndex: isOpen ? 50 : 1 }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] cursor-pointer ${className || 'bg-[#FAF8F5]'}`}
      >
        {Icon && <Icon className="w-4 h-4 text-[#D4A753] shrink-0" />}
        <span className="truncate whitespace-nowrap overflow-hidden flex-1 text-left">{selected ? selected.label : placeholder}</span>
        <ChevronDown className="w-4 h-4 text-[#9E9A93] ml-auto shrink-0" />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>
          <div className="absolute top-full left-0 mt-1 w-[200px] max-h-60 overflow-y-auto bg-white border border-[#EFECE6] rounded-lg shadow-lg z-50 py-1">
            {options.map((opt: any) => (
              <div
                key={opt.value}
                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#1A1615] hover:bg-[#FAF8F5] cursor-pointer"
              >
                {opt.icon && <opt.icon className="w-4 h-4 text-[#D4A753]" />}
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const CampaignRulesStep: React.FC<CampaignRulesStepProps> = ({ campaignType, currency, onContinue, onChange, onBack, campaignName, initialRules, initialStartDate, initialEndDate, initialTriggerEvent, initialActiveBranches, initialMatchType }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ruleFields, tierOptions } = useSelector((state: RootState) => state.master);
  const reduxBranches = useSelector((state: RootState) => state.branch.branches);

  // Fetch masters on mount
  useEffect(() => {
    dispatch(fetchRuleFields());
    dispatch(fetchTierOptions());
    dispatch(fetchRewardTypes());
    dispatch(fetchBranches());
  }, [dispatch]);

  // Derive FIELD_OPTIONS and TIER_OPTIONS from API, with fallbacks
  const FIELD_OPTIONS = ruleFields.length > 0
    ? ruleFields.map(f => ({ value: f.key, label: f.label }))
    : FIELD_OPTIONS_FALLBACK;

  const TIER_OPTIONS = tierOptions.length > 0
    ? tierOptions
    : TIER_OPTIONS_FALLBACK;

  // Build dynamic FIELDS map from API data
  const FIELDS_MAP: Record<string, { label: string, type: 'currency' | 'number' | 'date' | 'select' }> = ruleFields.length > 0
    ? ruleFields.reduce((acc, f) => ({ ...acc, [f.key]: { label: f.label, type: f.type } }), {} as any)
    : FIELDS;

  const currSymbol = currency.match(/\((.*?)\)/)?.[1] || '₹';
  const [matchType, setMatchType] = useState<'ALL' | 'ANY'>(initialMatchType || 'ALL');
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
  const [rules, setRules] = useState<RuleNode[]>(initialRules && initialRules.length > 0 ? initialRules : [
    {
      id: 'r1', type: 'condition', field: 'customer_lifetime', operator: '>=', value: ''
    }
  ]);

  // Rules audience simulation
  const [rulesSimData, setRulesSimData] = useState<any>(null);
  const [isRulesSimulating, setIsRulesSimulating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      // Only call API if we have at least one rule with a value
      const hasValidRule = rules.some(r => {
        if (r.type === 'condition') return r.field && r.operator && r.value !== '' && r.value !== undefined;
        if (r.type === 'group') return r.rules.some(sr => sr.field && sr.operator && sr.value !== '' && sr.value !== undefined);
        return false;
      });
      if (!hasValidRule) return;

      try {
        setIsRulesSimulating(true);
        const payload = {
          match_type: matchType,
          rules: rules.map(r => {
            if (r.type === 'condition') {
              const base: any = { type: 'condition', field: r.field, operator: r.operator, value: r.value };
              if (r.unit) base.unit = r.unit;
              return base;
            } else {
              return {
                type: 'group',
                match_type: r.matchType,
                rules: r.rules.map(sr => {
                  const base: any = { type: 'condition', field: sr.field, operator: sr.operator, value: sr.value };
                  if (sr.unit) base.unit = sr.unit;
                  return base;
                })
              };
            }
          })
        };
        const response = await apiClient.post('/merchant/campaigns/simulate-rules-audience', payload);
        setRulesSimData(response.data?.data || response.data || null);
      } catch (error) {
        console.error('Failed to simulate rules audience', error);
      } finally {
        setIsRulesSimulating(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [rules, matchType]);

  // Delivery Timing & Branch Eligibility state
  const [triggerEvent, setTriggerEvent] = useState<string>(initialTriggerEvent || 'qr_scan');
  // Calculate initial datetime strings for local timezone
  const [startDate, setStartDate] = useState<string>(initialStartDate || '');
  const [endDate, setEndDate] = useState<string>(initialEndDate || '');
  const [branches, setBranches] = useState<Array<{ id: string; name: string; selected: boolean }>>([]);

  useEffect(() => {
    if (reduxBranches && reduxBranches.length > 0 && branches.length === 0) {
      setBranches(reduxBranches.map(b => ({
        id: String(b.id),
        name: b.name,
        selected: initialActiveBranches ? initialActiveBranches.includes(b.name) : true
      })));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduxBranches, initialActiveBranches]);

  useEffect(() => {
    if (onChange) {
      onChange({ 
        rules, 
        matchType,
        triggerEvent,
        startDate,
        endDate,
        activeBranches: branches.filter(b => b.selected).map(b => b.name)
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rules, matchType, triggerEvent, startDate, endDate, branches]);

  const [isAddingLocation, setIsAddingLocation] = useState<boolean>(false);
  const [newLocationName, setNewLocationName] = useState<string>('');

  const calcDaysDuration = () => {
    if (!startDate || !endDate) return 'Custom Window';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (isNaN(diffTime) || diffTime < 0) return 'Invalid Range';
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} Days`;
  };

  const handleAddLocation = () => {
    if (!newLocationName.trim()) return;
    setBranches([
      ...branches,
      { id: Date.now().toString(), name: newLocationName.trim(), selected: true }
    ]);
    setNewLocationName('');
    setIsAddingLocation(false);
  };



  const validateRule = (rule: RuleCondition) => {
    if (!rule.field || !rule.operator) return "Incomplete rule";
    const type = FIELDS_MAP[rule.field]?.type;
    if (!type) return "Invalid field";
    if (rule.operator === 'between') {
      if (!rule.value || typeof rule.value !== 'object') return "Value required";
      if (type === 'date') {
         if (!rule.value.from || !rule.value.to) return "Both dates required";
         if (new Date(rule.value.from) > new Date(rule.value.to)) return "From date must be before To date";
      } else {
         if (rule.value.min === undefined || rule.value.max === undefined || rule.value.min === '' || rule.value.max === '') return "Both values required";
         if (Number(rule.value.min) > Number(rule.value.max)) return "Min must be <= Max";
      }
    } else if (type === 'select') {
      if (!rule.value || !Array.isArray(rule.value) || rule.value.length === 0) return "Select at least one option";
    } else {
      if (rule.value === undefined || rule.value === '') return "Value required";
      if ((type === 'currency' || type === 'number' || rule.unit === 'days') && Number(rule.value) < 0) return "Cannot be negative";
    }
    return "";
  };


  const createEmptyRule = (): RuleCondition => ({
    id: Date.now().toString(),
    type: 'condition',
    field: 'customer_lifetime',
    operator: '>',
    value: ''
  });

  const addRule = () => {
    setRules([...rules, createEmptyRule()]);
  };

  const addGroup = () => {
    setRules([...rules, {
      id: Date.now().toString(), type: 'group', matchType: 'ANY', rules: [
        { ...createEmptyRule(), id: Date.now().toString() + 'sub' }
      ]
    }]);
  };

  const addSubRule = (groupId: string) => {
    setRules(rules.map(r => {
      if (r.id === groupId && r.type === 'group') {
        return { ...r, rules: [...r.rules, createEmptyRule()] };
      }
      return r;
    }));
  };

  const updateRule = (ruleId: string, key: string, value: any, groupId?: string) => {
    const updateRuleLogic = (rule: RuleCondition): RuleCondition => {
      const newRule = { ...rule, [key]: value };
      if (key === 'field') {
        const fieldType = FIELDS_MAP[value]?.type;
        const oldFieldType = FIELDS_MAP[rule.field]?.type;
        if (fieldType !== oldFieldType) {
          newRule.operator = OPERATORS_BY_TYPE[fieldType]?.[0]?.value || '';
          newRule.value = '';
          if (fieldType === 'date' && (newRule.operator === 'within_last' || newRule.operator === 'not_within_last')) {
            newRule.unit = 'days';
          } else {
            delete newRule.unit;
          }
        }
      }
      if (key === 'operator') {
         const fieldType = FIELDS_MAP[newRule.field]?.type;
         if (fieldType === 'date') {
             const oldOp = rule.operator;
             const newOp = value;
             const oldNeedsUnit = oldOp === 'within_last' || oldOp === 'not_within_last';
             const newNeedsUnit = newOp === 'within_last' || newOp === 'not_within_last';
             const oldNeedsBetween = oldOp === 'between';
             const newNeedsBetween = newOp === 'between';
             if (oldNeedsUnit !== newNeedsUnit || oldNeedsBetween !== newNeedsBetween) {
                 newRule.value = '';
             }
             if (newNeedsUnit) newRule.unit = 'days';
             else delete newRule.unit;
         } else if (fieldType === 'currency' || fieldType === 'number') {
             const oldNeedsBetween = rule.operator === 'between';
             const newNeedsBetween = value === 'between';
             if (oldNeedsBetween !== newNeedsBetween) {
                 newRule.value = '';
             }
         }
      }
      return newRule;
    };

    setRules(rules.map(r => {
      if (groupId && r.id === groupId && r.type === 'group') {
        return { ...r, rules: r.rules.map(sr => sr.id === ruleId ? updateRuleLogic(sr) : sr) };
      }
      if (!groupId && r.id === ruleId && r.type === 'condition') {
        return updateRuleLogic(r);
      }
      return r;
    }));
  };

  const toggleRuleSelection = (ruleId: string) => {
    setSelectedRuleIds(prev => prev.includes(ruleId) ? prev.filter(id => id !== ruleId) : [...prev, ruleId]);
  };

  const groupSelectedRules = () => {
    const selectedConditions = rules.filter(r => r.type === 'condition' && selectedRuleIds.includes(r.id)) as RuleCondition[];
    if (selectedConditions.length === 0) return;

    // Create copies with new IDs for the group, keep originals in place
    const copiedConditions = selectedConditions.map(r => ({
      ...r,
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 5)
    }));

    const newGroup: RuleNode = {
      id: Date.now().toString(),
      type: 'group',
      matchType: 'ANY',
      rules: copiedConditions
    };

    setRules([...rules, newGroup]);
    setSelectedRuleIds([]);
  };

  const removeRule = (ruleId: string, groupId?: string) => {
    if (groupId) {
      // Removing a single rule from inside a group
      setRules(rules.map(r => {
        if (r.id === groupId && r.type === 'group') {
          return { ...r, rules: r.rules.filter(sr => sr.id !== ruleId) };
        }
        return r;
      }));
    } else {
      // Delete the rule or group entirely
      setRules(rules.filter(r => r.id !== ruleId));
    }
  };

  const handleContinue = () => {
    let hasError = false;
    rules.forEach(r => {
      if (r.type === 'condition') {
        if (validateRule(r)) hasError = true;
      } else if (r.type === 'group') {
        r.rules.forEach(sr => {
          if (validateRule(sr)) hasError = true;
        });
      }
    });
    if (hasError) {
      setShowErrors(true);
      return;
    }
    onContinue({ 
      rules, 
      matchType,
      triggerEvent,
      startDate,
      endDate,
      activeBranches: branches.filter(b => b.selected).map(b => b.name)
    });
  };

  const renderCondition = (rule: RuleCondition, groupId?: string, idx?: number) => {
    const fieldConfig = FIELDS_MAP[rule.field];
    const operators = OPERATORS_BY_TYPE[fieldConfig?.type] || [];
    const errorMsg = showErrors ? validateRule(rule) : "";
    
    return (
      <div key={rule.id} className="flex flex-col gap-1 relative">
        <div className={`flex flex-col sm:flex-row sm:items-center gap-3 bg-[#FAF8F5] border rounded-xl p-3 sm:p-3 shadow-2xs group transition-colors relative ${errorMsg ? 'border-red-500' : 'border-[#EAE6E1] hover:border-[#D4A753]'}`}>
          {!groupId && (
            <div className="hidden sm:flex items-center justify-center pr-2 shrink-0">
              <input 
                type="checkbox" 
                checked={selectedRuleIds.includes(rule.id)}
                onChange={() => toggleRuleSelection(rule.id)}
                className="w-4 h-4 rounded border-[#D1CDC7] text-[#D4A753] focus:ring-[#D4A753] cursor-pointer"
              />
            </div>
          )}

          <div className="flex items-center justify-between sm:hidden mb-1">
            <span className="text-[10px] font-bold text-[#9E782F] tracking-widest uppercase">
              {groupId ? `Criteria ${String.fromCharCode(65 + (idx || 0))}` : `Metric Rule 0${(idx || 0) + 1}`}
            </span>
            <button onClick={() => removeRule(rule.id, groupId)} className="p-1 text-[#9E9A93] hover:text-[#1A1615] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="hidden sm:block text-[#D1CDC7] cursor-grab shrink-0 pl-1"><GripVertical className="w-5 h-5" /></div>

          <div className="flex-1 flex flex-col sm:flex-row sm:items-stretch gap-3">
            {/* Field */}
            <div className="flex-1 sm:flex-[1.5]">
              <RuleDropdown
                value={rule.field}
                options={FIELD_OPTIONS}
                onChange={(v: any) => updateRule(rule.id, 'field', v, groupId)}
                placeholder="Select Field"
                minWidth="100%"
                className={`w-full h-full bg-white border shadow-sm rounded-lg ${errorMsg ? 'border-red-200' : 'border-[#EFECE6]'}`}
              />
            </div>

            {/* Operator */}
            <div className="flex-1 sm:flex-[1]">
              <RuleDropdown
                value={rule.operator}
                options={operators}
                onChange={(v: any) => updateRule(rule.id, 'operator', v, groupId)}
                placeholder="Select Operator"
                minWidth="100%"
                className={`w-full h-full bg-white border shadow-sm rounded-lg ${errorMsg ? 'border-red-200' : 'border-[#EFECE6]'}`}
              />
            </div>

            {/* Value */}
            <div className="flex-1 sm:flex-[2]">
              {fieldConfig?.type === 'currency' && rule.operator !== 'between' && (
                <div className={`flex items-center w-full h-full px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                  <span className="text-[#9E9A93] mr-1">₹</span>
                  <input type="number" min="0" step="0.01" value={rule.value || ''} onChange={e => updateRule(rule.id, 'value', e.target.value, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" placeholder="0.00" />
                </div>
              )}
              {fieldConfig?.type === 'number' && rule.operator !== 'between' && (
                <div className={`flex items-center w-full h-full px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                  <input type="number" min="0" value={rule.value || ''} onChange={e => updateRule(rule.id, 'value', e.target.value, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" placeholder="0" />
                </div>
              )}
              {(fieldConfig?.type === 'currency' || fieldConfig?.type === 'number') && rule.operator === 'between' && (
                <div className="flex items-center gap-2 h-full">
                  <div className={`flex items-center flex-1 px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                    {fieldConfig?.type === 'currency' && <span className="text-[#9E9A93] mr-1">₹</span>}
                    <input type="number" min="0" step={fieldConfig?.type === 'currency' ? '0.01' : '1'} value={rule.value?.min || ''} onChange={e => updateRule(rule.id, 'value', { ...rule.value, min: e.target.value }, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" placeholder="Min" />
                  </div>
                  <span className="text-[#9E9A93] font-bold text-[12px] uppercase">AND</span>
                  <div className={`flex items-center flex-1 px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                    {fieldConfig?.type === 'currency' && <span className="text-[#9E9A93] mr-1">₹</span>}
                    <input type="number" min="0" step={fieldConfig?.type === 'currency' ? '0.01' : '1'} value={rule.value?.max || ''} onChange={e => updateRule(rule.id, 'value', { ...rule.value, max: e.target.value }, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" placeholder="Max" />
                  </div>
                </div>
              )}
              {fieldConfig?.type === 'date' && (rule.operator === 'within_last' || rule.operator === 'not_within_last') && (
                <div className={`flex items-center w-full h-full px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                  <input type="number" min="1" value={rule.value || ''} onChange={e => updateRule(rule.id, 'value', e.target.value, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" placeholder="0" />
                  <span className="text-[#9E9A93] ml-2 font-medium text-[12px]">days</span>
                </div>
              )}
              {fieldConfig?.type === 'date' && (rule.operator === 'before' || rule.operator === 'after') && (
                <div className={`flex items-center w-full h-full px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                  <input type="date" value={rule.value || ''} onChange={e => updateRule(rule.id, 'value', e.target.value, groupId)} className="w-full bg-transparent focus:outline-none placeholder:text-[#9E9A93]" />
                </div>
              )}
              {fieldConfig?.type === 'date' && rule.operator === 'between' && (
                <div className="flex items-center gap-2 h-full">
                  <div className={`flex items-center flex-1 px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                    <input type="date" value={rule.value?.from || ''} onChange={e => updateRule(rule.id, 'value', { ...rule.value, from: e.target.value }, groupId)} className="w-full bg-transparent focus:outline-none" />
                  </div>
                  <span className="text-[#9E9A93] font-bold text-[12px] uppercase">AND</span>
                  <div className={`flex items-center flex-1 px-3 py-2.5 bg-white border rounded-lg text-[14px] font-bold text-[#1A1615] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                    <input type="date" value={rule.value?.to || ''} onChange={e => updateRule(rule.id, 'value', { ...rule.value, to: e.target.value }, groupId)} className="w-full bg-transparent focus:outline-none" />
                  </div>
                </div>
              )}
              {fieldConfig?.type === 'select' && (
                <div className={`flex flex-wrap items-center gap-1 w-full min-h-[42px] px-2 py-1 bg-white border rounded-lg text-[13px] shadow-sm ${errorMsg ? 'border-red-500' : 'border-[#EFECE6]'}`}>
                  {(rule.value || []).map((val: string) => (
                    <span key={val} className="px-2 py-1 bg-[#FDF8EB] text-[#1A1615] font-bold rounded flex items-center gap-1">
                      {TIER_OPTIONS.find(t => t.value === val)?.label || val}
                      <X className="w-3 h-3 text-[#9E782F] cursor-pointer" onClick={() => updateRule(rule.id, 'value', rule.value.filter((v: string) => v !== val), groupId)} />
                    </span>
                  ))}
                  <select
                    className="flex-1 bg-transparent focus:outline-none text-[#1A1615] font-medium min-w-[100px]"
                    value=""
                    onChange={e => {
                      if (e.target.value && !(rule.value || []).includes(e.target.value)) {
                        updateRule(rule.id, 'value', [...(rule.value || []), e.target.value], groupId);
                      }
                      e.target.value = '';
                    }}
                  >
                    <option value="" disabled>Add option...</option>
                    {TIER_OPTIONS.filter(t => !(rule.value || []).includes(t.value)).map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          <button onClick={() => removeRule(rule.id, groupId)} className="hidden sm:flex items-center justify-center p-2 text-[#9E9A93] hover:text-[#1A1615] transition-colors shrink-0 pr-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        {errorMsg && (
          <div className="text-red-500 text-[11px] font-bold pl-8 mt-0.5">
            {errorMsg}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
      <div className="lg:col-span-8 flex-1 w-full space-y-6">

        {/* Trigger & Qualification Rules */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center border border-[#EFECE6]">
                  <Network className="w-5 h-5 text-[#D4A753]" />
                </div>
                <h3 className="text-[18px] font-bold text-[#1A1615] leading-tight">Trigger & Qualification<br />Rules</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-4">
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest text-[#6E6A66] flex items-center gap-1"><Info className="w-3.5 h-3.5" /> EVALUATION<br className="sm:hidden" />ENGINE:</span>
                <span className="px-3 py-1 bg-[#FAF8F5] sm:bg-[#EFECE6]/50 border border-[#EFECE6] sm:border-none text-[#1A1615] text-[11px] font-bold rounded-lg shadow-sm sm:shadow-none">Real-time</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 bg-[#FAF8F5] border border-[#EFECE6] sm:border-0 sm:rounded-lg p-2 sm:px-4 sm:py-3 mb-6">
              <span className="text-[12px] sm:text-[13px] font-bold text-[#1A1615] ml-2 hidden sm:block">Match</span>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-[10px] uppercase font-bold text-[#6E6A66] sm:hidden flex-1 pl-1">Logic<br />Conjunction:</span>
                <div className="flex items-center p-1 sm:p-0.5 bg-white sm:bg-[#EFECE6]/30 border border-[#EFECE6] sm:border-none rounded-lg shadow-sm sm:shadow-none flex-1 sm:flex-none">
                  <button
                    onClick={() => setMatchType('ALL')}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors ${matchType === 'ALL' ? 'bg-[#1A1615] sm:bg-[#9E782F] text-white shadow-sm' : 'text-[#6E6A66] hover:bg-[#FAF8F5]'}`}
                  >ALL [AND]</button>
                  <button
                    onClick={() => setMatchType('ANY')}
                    className={`flex-1 sm:flex-none px-4 py-1.5 rounded-md text-[11px] font-bold transition-colors ${matchType === 'ANY' ? 'bg-[#1A1615] sm:bg-[#9E782F] text-white shadow-sm' : 'text-[#6E6A66] hover:bg-[#FAF8F5]'}`}
                  >ANY [OR]</button>
                </div>
              </div>
              <span className="text-[12px] sm:text-[13px] text-[#6E6A66] ml-2 font-medium hidden sm:block">of the following condition criteria:</span>
            </div>

            <div className="space-y-3 relative">
              {rules.map((rule, idx) => {
                if (rule.type === 'condition') {
                  return (
                    <React.Fragment key={rule.id}>
                      {renderCondition(rule, undefined, idx)}
                      {idx < rules.length - 1 && <div className="hidden sm:block absolute left-6 w-0.5 bg-[#EFECE6] z-0" style={{ top: `${(idx * 60) + 30}px`, height: '30px' }}></div>}
                    </React.Fragment>
                  );
                } else {
                  return (
                    <div key={rule.id} className="relative sm:pl-8 mt-4 sm:mt-0">
                      <div className="hidden sm:block absolute left-6 top-6 w-2 h-0.5 bg-[#EAE6E1]"></div>

                      <div className="bg-white border border-[#EFECE6] sm:border-l-[4px] sm:border-l-[#D4A753] rounded-xl p-4 shadow-sm relative">
                        <div className="flex flex-row items-center justify-between mb-4 gap-2">
                          <div className="flex items-center gap-2 text-[11px] sm:text-[12px] font-medium text-[#1A1615]">
                            <span className="px-2.5 py-1 bg-[#D4A753] text-white font-bold rounded-full uppercase tracking-wider text-[10px] shrink-0">OR GROUP</span>
                            <span className="hidden sm:inline">Customer satisfies AT LEAST ONE criteria below:</span>
                            <span className="sm:hidden">Satisfies AT LEAST ONE:</span>
                          </div>
                          <button onClick={() => removeRule(rule.id)} className="flex items-center gap-1.5 text-[11px] sm:text-[12px] font-bold text-[#6E6A66] hover:text-[#1A1615] transition-colors shrink-0">
                            <Trash2 className="w-4 h-4 sm:hidden" /> <span className="hidden sm:inline"><Trash2 className="w-3.5 h-3.5 inline mr-1" />Remove Group</span>
                          </button>
                        </div>

                        <div className="space-y-3 relative">
                          {rule.rules.map((subRule, subIdx) => renderCondition(subRule, rule.id, subIdx))}
                        </div>

                        <button onClick={() => addSubRule(rule.id)} className="mt-4 flex items-center gap-1.5 text-[12px] font-bold text-[#D4A753] hover:text-[#9E782F] transition-colors">
                          <Plus className="w-4 h-4" /> Add condition inside this OR block
                        </button>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>

          <div className="bg-[#FAF8F5] sm:bg-transparent sm:border-none p-0 sm:p-6 mt-6 sm:mt-0 flex flex-row items-center gap-2 sm:gap-4">
            <button onClick={addRule} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-2.5 bg-[#EFECE6]/50 sm:bg-white sm:border sm:border-[#EFECE6] text-[#1A1615] sm:text-[#9E782F] text-[11px] sm:text-[13px] font-bold rounded-lg sm:rounded-full shadow-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer">
              <Plus className="w-3.5 h-3.5 text-[#9E782F]" /> <span className="hidden sm:inline">Add Condition Rule</span><span className="sm:hidden">Add Condition</span>
            </button>
            <button onClick={addGroup} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-2.5 bg-[#EFECE6]/50 sm:bg-white sm:border sm:border-[#EFECE6] text-[#1A1615] sm:text-[#9E782F] text-[11px] sm:text-[13px] font-bold rounded-lg sm:rounded-full shadow-sm hover:bg-[#FAF8F5] transition-colors cursor-pointer">
              <Network className="w-3.5 h-3.5 text-[#9E782F]" /> <span className="hidden sm:inline">Add Nested Condition Group (AND / OR)</span><span className="sm:hidden">Add Nested Group</span>
            </button>
            {selectedRuleIds.length > 0 && (
              <button onClick={groupSelectedRules} className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2.5 sm:px-5 sm:py-2.5 bg-[#1A1615] text-white text-[11px] sm:text-[13px] font-bold rounded-lg sm:rounded-full shadow-sm hover:bg-[#3D3730] transition-colors cursor-pointer ml-auto">
                Group Selected ({selectedRuleIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Delivery Timing & Branch Eligibility */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center border border-[#EFECE6] shrink-0">
              <Store className="w-5 h-5 text-[#D4A753]" />
            </div>
            <h3 className="text-[18px] font-bold text-[#1A1615] leading-tight">Delivery Timing & Branch Eligibility</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Trigger Event Selector */}
            <div>
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#6E6A66] block mb-2">TRIGGER EVENT</label>
              <div className="relative">
                <div className="flex items-center gap-3 px-3.5 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl focus-within:border-[#D4A753] transition-colors">
                  <Zap className="w-5 h-5 text-[#9E782F] shrink-0" />
                  <select
                    value={triggerEvent}
                    onChange={e => setTriggerEvent(e.target.value)}
                    className="w-full bg-transparent text-[13px] font-bold text-[#1A1615] focus:outline-none cursor-pointer pr-4"
                  >
                    <option value="qr_scan">On QR Stand Scan at Counter</option>
                    <option value="pos_billing">On POS Billing / Receipt Scan</option>
                    <option value="app_signup">On Revia App Sign-up / Check-in</option>
                    <option value="whatsapp_click">On WhatsApp Special Offer Link Click</option>
                  </select>
                </div>
              </div>
              <p className="mt-2 text-[11px] text-[#6E6A66] leading-relaxed pr-4">
                {triggerEvent === 'qr_scan' && 'Triggers automatically when qualified guest scans NFC/QR point of service.'}
                {triggerEvent === 'pos_billing' && 'Triggers when POS clerk enters customer billing transaction.'}
                {triggerEvent === 'app_signup' && 'Triggers instantly when customer downloads Revia App and registers.'}
                {triggerEvent === 'whatsapp_click' && 'Triggers when customer opens WhatsApp campaign link.'}
              </p>
            </div>

            {/* Campaign Runtime Window Date Pickers */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[10px] uppercase font-bold tracking-widest text-[#6E6A66]">CAMPAIGN RUNTIME WINDOW</label>
                <span className="px-2 py-0.5 bg-[#E0F9ED] text-[#0D7A53] text-[10px] font-bold uppercase tracking-widest rounded shadow-2xs">
                  {calcDaysDuration()}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] font-semibold text-[#7C746C] block mb-1">Start Date & Time</span>
                  <input
                    type={startDate ? "datetime-local" : "text"}
                    placeholder="DD-MM-YYYY HH:MM"
                    onFocus={(e) => (e.target.type = "datetime-local")}
                    onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                    value={startDate}
                    min={new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[12px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                  />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-[#7C746C] block mb-1">End Date & Time</span>
                  <input
                    type={endDate ? "datetime-local" : "text"}
                    placeholder="DD-MM-YYYY HH:MM"
                    onFocus={(e) => (e.target.type = "datetime-local")}
                    onBlur={(e) => { if (!e.target.value) e.target.type = "text"; }}
                    value={endDate}
                    min={startDate || new Date(Date.now() - (new Date().getTimezoneOffset() * 60000)).toISOString().slice(0, 16)}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[12px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                  />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-[#6E6A66] leading-relaxed">Configured in merchant home timezone (PST - Pacific Standard).</p>
            </div>
          </div>

          {/* Active Branches Selector & Add Location */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-[10px] uppercase font-bold tracking-widest text-[#6E6A66]">
                ACTIVE BRANCHES ({branches.filter(b => b.selected).length} OF {branches.length} SELECTED)
              </label>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              {branches.map(branch => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => setBranches(branches.map(b => b.id === branch.id ? { ...b, selected: !b.selected } : b))}
                  className={`px-3 py-1.5 border text-[12px] font-bold rounded-full flex items-center gap-2 transition-all cursor-pointer ${branch.selected
                    ? 'bg-[#FDF8EB] border-[#D4A753] text-[#1A1615] shadow-2xs'
                    : 'bg-[#F5F4F2] border-[#E2DED9] text-[#9E9A93] hover:text-[#1A1615]'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${branch.selected ? 'bg-[#0D7A53]' : 'bg-[#D1CDC7]'}`}></span>
                  {branch.name}
                  {branch.selected && <Check className="w-3 h-3 text-[#0D7A53]" />}
                </button>
              ))}

              {!isAddingLocation ? (
                <button
                  type="button"
                  onClick={() => setIsAddingLocation(true)}
                  className="px-3 py-1.5 bg-[#FAF8F5] border border-[#D1CDC7] text-[#9E782F] text-[12px] font-bold rounded-full flex items-center gap-1.5 hover:bg-[#FDF8EB] transition-colors cursor-pointer"
                >
                  <Plus className="w-3 h-3" /> Add Location
                </button>
              ) : (
                <div className="flex items-center gap-2 bg-[#FAF8F5] border border-[#D4A753] px-3 py-1 rounded-full shadow-2xs">
                  <input
                    type="text"
                    value={newLocationName}
                    onChange={e => setNewLocationName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddLocation()}
                    placeholder="Enter branch name..."
                    autoFocus
                    className="bg-transparent text-[12px] font-bold text-[#1A1615] focus:outline-none w-36"
                  />
                  <button
                    type="button"
                    onClick={handleAddLocation}
                    className="text-[11px] font-bold text-[#0D7A53] hover:underline cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsAddingLocation(false); setNewLocationName(''); }}
                    className="text-[11px] font-bold text-[#6E6A66] hover:text-[#1A1615] cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right side panels */}
      <div className="lg:col-span-4 w-full shrink-0 space-y-6">

        {/* Audience Impact Panel */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#D4A753]" />
              <h3 className="text-[15px] font-bold text-[#1A1615] leading-tight">Audience<br />Impact</h3>
            </div>
            <span className="px-2.5 py-1 bg-[#E0F9ED] text-[#0D7A53] text-[10px] font-bold rounded-full leading-tight text-center">Dynamic<br />Cohort</span>
          </div>

          {isRulesSimulating && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 border-2 border-[#D4A753] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[11px] text-[#9E9A93] font-bold">Recalculating...</span>
            </div>
          )}

          <div className="mb-6">
            <div className="flex justify-between items-end mb-1">
              <span className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase">QUALIFYING CUSTOMERS</span>
              <span className="text-[10px] font-bold text-[#0D7A53]">{rulesSimData?.reach_percentage ?? 0}% Reach</span>
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-[28px] font-bold text-[#1A1615] tracking-tight">{(rulesSimData?.qualifying_customers ?? 0).toLocaleString()}</span>
              <span className="text-[12px] font-medium text-[#9E9A93]">of {(rulesSimData?.total_enrolled_members ?? 0).toLocaleString()} members</span>
            </div>
            <div className="w-full h-2 bg-[#F5F4F2] rounded-full overflow-hidden">
              <div className="h-full bg-[#D4A753] rounded-full transition-all duration-500" style={{ width: `${rulesSimData?.reach_percentage ?? 0}%` }}></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3">
              <div className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase mb-1">EXPECTED<br />VISITS</div>
              <div className="text-[15px] font-bold text-[#1A1615]">{rulesSimData?.expected_visits_min ?? 0} - {rulesSimData?.expected_visits_max ?? 0}</div>
              <div className="text-[10px] font-bold text-[#0D7A53] mt-1">~18% claim<br />rate</div>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3">
              <div className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase mb-1">PROJECTED<br />GMV</div>
              <div className="text-[15px] font-bold text-[#9E782F]">+₹{(rulesSimData?.projected_gmv_lift ?? 0).toLocaleString()}</div>
              <div className="text-[10px] font-medium text-[#6E6A66] mt-1">Estimated lift</div>
            </div>
          </div>

          <div className="mb-6">
            <div className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase mb-3">TIER DISTRIBUTION</div>
            <div className="space-y-2">
              {(rulesSimData?.tier_distribution || []).map((tier: any, i: number) => (
                <div key={i} className="flex justify-between items-center text-[11px]">
                  <div className="flex items-center gap-1.5 font-bold text-[#1A1615]"><span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#1A1615]' : 'bg-[#D4A753]'}`}></span> {tier.tier_name}</div>
                  <div className="font-bold text-[#1A1615]">{tier.count?.toLocaleString()} ({tier.percentage}%)</div>
                </div>
              ))}
              {(!rulesSimData?.tier_distribution || rulesSimData.tier_distribution.length === 0) && (
                <div className="text-[11px] text-[#9E9A93] italic">No tier data yet</div>
              )}
            </div>
          </div>

          <div>
            <div className="text-[9px] font-bold text-[#9E9A93] tracking-widest uppercase mb-2">QUALIFICATION VELOCITY (LAST 14 DAYS)</div>
            <div className="h-12 bg-[#FAF8F5] rounded-lg border border-[#EFECE6] relative overflow-hidden">
              {/* Decorative line mimicking chart */}
              <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="w-full h-full text-[#D4A753]">
                <path d="M0,25 Q20,22 40,20 T70,10 T100,8 L100,30 L0,30 Z" fill="currentColor" fillOpacity="0.1" />
                <path d="M0,25 Q20,22 40,20 T70,10 T100,8" fill="none" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </div>

        {/* Guest Experience Preview Panel */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-[#D4A753]" />
              <h3 className="text-[15px] font-bold text-[#1A1615] leading-tight">Guest<br />Experience<br />Preview</h3>
            </div>
            <span className="px-2.5 py-1 bg-[#FAF8F5] text-[#6E6A66] text-[10px] font-bold rounded-lg border border-[#EFECE6] leading-tight text-center">iOS /<br />Android</span>
          </div>

          <p className="text-[11px] text-[#6E6A66] leading-relaxed mb-6">
            Live simulation of the privileged push card rendered on the member's passbook wallet when conditions match.
          </p>

          {/* Wallet Card Mockup */}
          <div className="bg-[#1A1615] rounded-xl overflow-hidden shadow-md border border-[#3D3730] mb-6">
            <div className="p-3 border-b border-[#3D3730] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#9E782F] text-[#1A1615] flex items-center justify-center font-black text-[10px]">R</div>
                <span className="text-[9px] font-bold tracking-widest text-[#9E9A93]">YOUR BRAND - REVIA PASS</span>
              </div>
              <span className="text-[9px] font-bold text-[#9E9A93]">Now</span>
            </div>
            <div className="p-4 flex gap-4">
              <div className="w-[60px] h-[60px] rounded-lg bg-[#3D3730] shrink-0 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=150&q=80" className="w-full h-full object-cover" alt="Coffee pour over" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#D4A753] text-[#1A1615] text-[9px] font-bold rounded mb-1.5 uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#1A1615]"></span> {campaignType ? `${getCampaignTypeLabel(campaignType).toUpperCase()} PRIVILEGE` : 'SPECIAL PRIVILEGE'}
                </div>
                <h4 className="text-[13px] font-bold text-white leading-tight mb-1">{campaignName || 'Your Campaign Name'}</h4>
                <p className="text-[9px] text-[#9E9A93] leading-relaxed">Valid for selected members<br />based on rules above</p>
              </div>
            </div>
            <div className="p-3 bg-[#000000]/40 flex items-center justify-between border-t border-[#3D3730]">
              <div className="flex items-center gap-1.5 text-[#D4A753]">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold leading-tight">
                  {endDate ? (
                    <>
                      Expires<br />{new Date(endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </>
                  ) : (
                    <>No Expiration<br />Set</>
                  )}
                </span>
              </div>
              <button className="px-3 py-1.5 bg-white text-[#1A1615] text-[10px] font-bold rounded-lg leading-tight">
                Redeem at<br />POS
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-bold text-[#6E6A66]">
            <button className="flex items-center gap-1.5 hover:text-[#D4A753] transition-colors text-center leading-tight">
              <RefreshCw className="w-3 h-3" /> Regenerate<br />Sample Member
            </button>
            <div className="w-1 h-1 rounded-full bg-[#D1CDC7]"></div>
            <button className="hover:text-[#D4A753] transition-colors text-center leading-tight">
              Test Push to<br />Device
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

interface CampaignRewardStepProps {
  campaignType: string;
  ruleConfig: any;
  currency: string;
  onContinue: (config: any) => void;
  onChange?: (config: any) => void;
  onBack: () => void;
  initialRewardConfig?: any;
}

const CampaignRewardStep: React.FC<CampaignRewardStepProps> = ({ campaignType, ruleConfig, currency, onContinue, onChange, onBack, initialRewardConfig }) => {
  const currSymbol = currency.match(/\((.*?)\)/)?.[1] || '₹';
  const [rewardType, setRewardType] = useState<string>(initialRewardConfig?.rewardType || 'free_item');
  const [cashbackAmount, setCashbackAmount] = useState<number>(initialRewardConfig?.cashbackAmount || 10);

  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>(initialRewardConfig?.discountType || 'Percentage');
  const [discountValue, setDiscountValue] = useState<number>(initialRewardConfig?.discountValue || 15);

  const [rewardPoints, setRewardPoints] = useState<number>(initialRewardConfig?.rewardPoints || 500);
  const { rewardTypes } = useSelector((state: RootState) => state.master);
  
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Wallet': return Wallet;
      case 'Percent': return Percent;
      case 'Star': return Star;
      case 'Gift': return Gift;
      case 'Package': return Package;
      default: return Gift;
    }
  };

  const [freeItem, setFreeItem] = useState<string>(initialRewardConfig?.freeItem || '');
  const [freeItemDropdownOpen, setFreeItemDropdownOpen] = useState(false);
  const [showFreeItemNewInput, setShowFreeItemNewInput] = useState(false);
  const [freeItemNewName, setFreeItemNewName] = useState('');
  const storeItems = useSelector((state: RootState) => state.catalog.items);
  const storeProducts = storeItems.map(item => item.title);
  const [localProducts, setLocalProducts] = useState<string[]>([]);
  const catalogProducts = [...storeProducts, ...localProducts];

  const [maxRedemptions, setMaxRedemptions] = useState<number>(initialRewardConfig?.maxRedemptions || 1);
  const [totalBudgetCap, setTotalBudgetCap] = useState<number>(initialRewardConfig?.totalBudgetCap || 500);
  const [coolingPeriodHours, setCoolingPeriodHours] = useState<number>(initialRewardConfig?.coolingPeriodHours || 6);
  const [coolingPeriodDropdownOpen, setCoolingPeriodDropdownOpen] = useState(false);
  const coolingPeriodDropdownRef = useRef<HTMLDivElement>(null);

  const [applicableBranches, setApplicableBranches] = useState<string>(initialRewardConfig?.applicableBranches || 'all');
  const [applicableBranchesDropdownOpen, setApplicableBranchesDropdownOpen] = useState(false);
  const applicableBranchesDropdownRef = useRef<HTMLDivElement>(null);

  const branches = useSelector((state: RootState) => state.branch.branches);
  const branchOptions = [
    { value: 'all', label: 'All Outlets & Branches' },
    ...branches.map(b => ({ value: String(b.id), label: b.name }))
  ];

  useEffect(() => {
    if (onChange) {
      onChange({
        rewardType,
        cashbackAmount,
        discountType,
        discountValue,
        rewardPoints,
        freeItem,
        maxRedemptions,
        totalBudgetCap,
        coolingPeriodHours,
        applicableBranches
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rewardType, cashbackAmount, discountType, discountValue, rewardPoints, freeItem, maxRedemptions, totalBudgetCap, coolingPeriodHours, applicableBranches]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (coolingPeriodDropdownRef.current && !coolingPeriodDropdownRef.current.contains(event.target as Node)) {
        setCoolingPeriodDropdownOpen(false);
      }
      if (applicableBranchesDropdownRef.current && !applicableBranchesDropdownRef.current.contains(event.target as Node)) {
        setApplicableBranchesDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [autoRevokeOnRefund, setAutoRevokeOnRefund] = useState<boolean>(true);
  const [stackable, setStackable] = useState<boolean>(false);

  const [expiryType, setExpiryType] = useState<'Days' | 'Date'>('Days');
  const [expiryDays, setExpiryDays] = useState<number>(30);
  const [expiryDate, setExpiryDate] = useState<string>('');

  // Auto-prefill for existing_stamp
  React.useEffect(() => {
    if (campaignType === 'existing_stamp' && ruleConfig?.stampItem) {
      if (rewardType === 'free_item') {
        setFreeItem(ruleConfig.stampItem);
      }
    }
  }, [campaignType, ruleConfig, rewardType]);

  const rewardOptions = rewardTypes.map(rt => ({
    id: rt.id,
    title: rt.title,
    desc: rt.desc,
    icon: getIconComponent(rt.iconName),
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
      {/* Left Main Config Column */}
      <div className="lg:col-span-8 flex-1 w-full space-y-6">

        {/* Header Banner */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-2xs">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#FAF8F5] rounded-xl flex items-center justify-center border border-[#EFECE6]">
              <Gift className="w-5 h-5 text-[#D4A753]" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#9E782F]">STEP 4 OF 5</span>
              <h3 className="text-[20px] font-bold text-[#1A1615] leading-tight">Reward Definition</h3>
            </div>
          </div>
          <p className="text-[13px] text-[#7C746C] font-medium leading-relaxed">
            Specify the precise perk, item, discount, or points granted to qualifying guests upon meeting campaign conditions.
          </p>
        </div>

        {/* 1. Reward Type Selection */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <h4 className="text-[11px] font-bold text-[#9E782F] uppercase tracking-widest">WHAT DOES THE CUSTOMER GET?</h4>
            <span className="text-[11px] font-bold text-[#15803D] bg-[#EBF7F0] px-2.5 py-0.5 rounded-full border border-[#15803D]/20">Active Reward Selection</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {rewardOptions.map(opt => {
              const IconComponent = opt.icon;
              const isSelected = rewardType === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setRewardType(opt.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left flex items-start gap-3.5 relative ${isSelected
                    ? 'bg-[#FDF8EB] border-[#D4A753] ring-2 ring-[#D4A753]/20 shadow-xs'
                    : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50 hover:bg-white'
                    }`}
                >
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${isSelected ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white shadow-xs' : 'bg-white border border-[#EFECE6] text-[#7C746C]'
                    }`}>
                    <IconComponent className="w-4.5 h-4.5" />
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="font-bold text-[14px] text-[#1A1615] leading-tight mb-1">{opt.title}</div>
                    <div className="text-[11px] font-medium text-[#7C746C] leading-normal">{opt.desc}</div>
                  </div>
                  <div className={`absolute top-4 right-4 w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#D4A753]' : 'border-[#D1CDC7]'
                    }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-[#D4A753]" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dynamic Configuration Inputs depending on Selection */}
          {rewardType === 'cashback' && (
            <div className="mt-5 pt-5 border-t border-[#EFECE6] bg-[#FAF8F5] rounded-xl p-4 border">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615] block mb-2">CASHBACK AMOUNT</label>
              <div className="relative max-w-[280px]">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C746C] font-bold text-[14px]">{currSymbol}</span>
                <input
                  type="number"
                  value={cashbackAmount || ''}
                  onChange={e => setCashbackAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] transition-colors shadow-2xs"
                  placeholder="0.00"
                />
              </div>
            </div>
          )}

          {rewardType === 'discount' && (
            <div className="mt-5 pt-5 border-t border-[#EFECE6] bg-[#FAF8F5] rounded-xl p-4 border space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615] block mb-2">DISCOUNT TYPE</label>
                <div className="inline-flex bg-white border border-[#EFECE6] rounded-xl p-1 gap-1 shadow-2xs">
                  {(['Fixed', 'Percentage'] as const).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setDiscountType(t)}
                      className={`px-4 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${discountType === t
                        ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white shadow-2xs'
                        : 'text-[#7C746C] hover:text-[#1A1615]'
                        }`}
                    >
                      {t} Amount
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615] block mb-2">DISCOUNT VALUE</label>
                <div className="relative max-w-[280px]">
                  {discountType === 'Fixed' && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7C746C] font-bold text-[14px]">{currSymbol}</span>}
                  <input
                    type="number"
                    value={discountValue || ''}
                    onChange={e => setDiscountValue(Number(e.target.value))}
                    className={`w-full ${discountType === 'Fixed' ? 'pl-8' : 'pl-4'} pr-8 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] transition-colors shadow-2xs`}
                    placeholder="0"
                  />
                  {discountType === 'Percentage' && <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7C746C] font-bold text-[14px]">%</span>}
                </div>
              </div>
            </div>
          )}

          {rewardType === 'points' && (
            <div className="mt-5 pt-5 border-t border-[#EFECE6] bg-[#FAF8F5] rounded-xl p-4 border">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615] block mb-2">POINTS AWARDED</label>
              <div className="relative max-w-[280px]">
                <input
                  type="number"
                  value={rewardPoints || ''}
                  onChange={e => setRewardPoints(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] transition-colors shadow-2xs"
                  placeholder="0"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7C746C] font-bold text-[11px] uppercase tracking-wider">PTS</span>
              </div>
            </div>
          )}

          {rewardType === 'free_item' && (
            <div className="mt-5 pt-5 border-t border-[#EFECE6] bg-[#FAF8F5] rounded-xl p-4 border">
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#1A1615] block">FREE ITEM PRODUCT NAME</label>
                {!(campaignType === 'existing_stamp' && !!ruleConfig?.stampItem) && (
                  <button type="button" onClick={() => { setFreeItemDropdownOpen(true); setShowFreeItemNewInput(true); }} className="text-[11px] font-bold text-[#D4A753] flex items-center gap-1 hover:underline cursor-pointer">
                    <Plus className="w-3 h-3" /> Add New Item
                  </button>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (!(campaignType === 'existing_stamp' && !!ruleConfig?.stampItem)) {
                      setFreeItemDropdownOpen(!freeItemDropdownOpen);
                      setShowFreeItemNewInput(false);
                    }
                  }}
                  disabled={campaignType === 'existing_stamp' && !!ruleConfig?.stampItem}
                  className={`w-full px-4 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-[14px] font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] flex items-center justify-between cursor-pointer hover:border-[#D4A753]/50 transition-colors shadow-2xs text-left ${campaignType === 'existing_stamp' && !!ruleConfig?.stampItem ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  <span className={freeItem ? 'text-[#1A1615]' : 'text-[#9E9A93]'}>
                    {freeItem || 'Select a product...'}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[#9E9A93] transition-transform ${freeItemDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {freeItemDropdownOpen && !(campaignType === 'existing_stamp' && !!ruleConfig?.stampItem) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EFECE6] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="max-h-[220px] overflow-y-auto py-1">
                      {catalogProducts.length === 0 ? (
                        <div className="px-4 py-4 text-center">
                          <p className="text-[12px] font-medium text-[#9E9A93]">No items available. Add one above.</p>
                        </div>
                      ) : (
                        catalogProducts.map((product) => (
                          <button
                            key={product}
                            type="button"
                            onClick={() => {
                              setFreeItem(product);
                              setFreeItemDropdownOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-[13px] font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                              freeItem === product
                                ? 'bg-[#FDF8EB] text-[#9E782F]'
                                : 'text-[#3D3732] hover:bg-[#FAF8F5]'
                            }`}
                          >
                            <span className="truncate">{product}</span>
                            {freeItem === product && <Check className="w-4 h-4 text-[#D4A753] shrink-0" />}
                          </button>
                        ))
                      )}
                    </div>

                    {/* Add New Item Input */}
                    {showFreeItemNewInput && (
                      <div className="border-t border-[#EFECE6]">
                      <div className="px-3 py-2.5 flex items-center gap-2">
                        <input
                          type="text"
                          autoFocus
                          value={freeItemNewName}
                          onChange={e => setFreeItemNewName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter' && freeItemNewName.trim()) {
                              setLocalProducts(prev => [...prev, freeItemNewName.trim()]);
                              setFreeItem(freeItemNewName.trim());
                              setFreeItemNewName('');
                              setShowFreeItemNewInput(false);
                              setFreeItemDropdownOpen(false);
                            }
                          }}
                          placeholder="Enter product name..."
                          className="flex-1 px-3 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-semibold text-[#1A1615] focus:outline-none focus:border-[#D4A753] placeholder:text-[#9E9A93]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (freeItemNewName.trim()) {
                              setLocalProducts(prev => [...prev, freeItemNewName.trim()]);
                              setFreeItem(freeItemNewName.trim());
                              setFreeItemNewName('');
                              setShowFreeItemNewInput(false);
                              setFreeItemDropdownOpen(false);
                            }
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white text-[13px] font-bold rounded-lg cursor-pointer hover:shadow-sm transition-all"
                        >
                          Add
                        </button>
                      </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {campaignType === 'existing_stamp' && !!ruleConfig?.stampItem && (
                <p className="mt-2 text-[11px] text-[#9E782F] font-bold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5" /> Auto-set from Stamp Type configuration
                </p>
              )}
            </div>
          )}
        </div>

        {/* 2. Usage Limits, Budget Caps & Security Policies */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-2xs space-y-5">
          <h4 className="text-[11px] font-bold text-[#9E782F] uppercase tracking-widest">USAGE LIMITS &amp; CO-EXECUTIVE POLICIES</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C] block mb-2">MAX REDEMPTIONS PER CUSTOMER</label>
              <input
                type="number"
                value={maxRedemptions || ''}
                onChange={e => setMaxRedemptions(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] transition-colors shadow-2xs"
                placeholder="1"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C] block mb-2">TOTAL CAMPAIGN BUDGET / REDEMPTIONS CAP</label>
              <input
                type="number"
                value={totalBudgetCap || ''}
                onChange={e => setTotalBudgetCap(Number(e.target.value))}
                className="w-full px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[14px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] transition-colors shadow-2xs"
                placeholder="500 (Leave empty for unlimited)"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div ref={coolingPeriodDropdownRef} className="relative">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C] block mb-2">VISIT COOLING PERIOD (HOURS)</label>
              <button
                type="button"
                onClick={() => setCoolingPeriodDropdownOpen(!coolingPeriodDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] hover:border-[#D1CDC7] transition-colors shadow-2xs cursor-pointer"
              >
                <span className="truncate">
                  {coolingPeriodHours === 0 ? 'Instant (No Cooling Period)' :
                    coolingPeriodHours === 4 ? '4 Hours between visits' :
                      coolingPeriodHours === 6 ? '6 Hours between visits (Recommended)' :
                        coolingPeriodHours === 12 ? '12 Hours between visits' :
                          coolingPeriodHours === 24 ? '24 Hours (Max 1 Visit per day)' : `${coolingPeriodHours} Hours`}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${coolingPeriodDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {coolingPeriodDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EFECE6] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                  {[
                    { value: 0, label: 'Instant (No Cooling Period)' },
                    { value: 4, label: '4 Hours between visits' },
                    { value: 6, label: '6 Hours between visits (Recommended)' },
                    { value: 12, label: '12 Hours between visits' },
                    { value: 24, label: '24 Hours (Max 1 Visit per day)' },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setCoolingPeriodHours(opt.value); setCoolingPeriodDropdownOpen(false); }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-[13px] hover:bg-[#F5F1EA] ${coolingPeriodHours === opt.value ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={applicableBranchesDropdownRef} className="relative">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#7C746C] block mb-2">APPLICABLE STORE LOCATION / BRANCH</label>
              <button
                type="button"
                onClick={() => setApplicableBranchesDropdownOpen(!applicableBranchesDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] hover:border-[#D1CDC7] transition-colors shadow-2xs cursor-pointer"
              >
                <span className="truncate">
                  {branchOptions.find(opt => opt.value === applicableBranches)?.label || applicableBranches}
                </span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${applicableBranchesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {applicableBranchesDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EFECE6] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                  {branchOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => { setApplicableBranches(opt.value); setApplicableBranchesDropdownOpen(false); }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-[13px] hover:bg-[#F5F1EA] ${applicableBranches === opt.value ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl">
              <div>
                <div className="text-[13px] font-bold text-[#1A1615]">Stackable with Other Perks</div>
                <div className="text-[11px] text-[#7C746C] font-medium font-mono">Allow alongside existing offers</div>
              </div>
              <button
                type="button"
                onClick={() => setStackable(v => !v)}
                className={`relative w-11 h-6 rounded-full border transition-all cursor-pointer shrink-0 ${stackable ? 'bg-[#15803D] border-[#15803D]' : 'bg-[#EFECE6] border-[#D1CDC7]'
                  }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${stackable ? 'left-[22px]' : 'left-0.5'
                  }`} />
              </button>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl">
              <div>
                <div className="text-[13px] font-bold text-[#1A1615]">POS Refund Protection</div>
                <div className="text-[11px] text-[#7C746C] font-medium font-mono">Auto-revoke stamps if bill refunded</div>
              </div>
              <button
                type="button"
                onClick={() => setAutoRevokeOnRefund(v => !v)}
                className={`relative w-11 h-6 rounded-full border transition-all cursor-pointer shrink-0 ${autoRevokeOnRefund ? 'bg-[#15803D] border-[#15803D]' : 'bg-[#EFECE6] border-[#D1CDC7]'
                  }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${autoRevokeOnRefund ? 'left-[22px]' : 'left-0.5'
                  }`} />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Reward Validity Horizon */}
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-2xs space-y-5">
          <h4 className="text-[11px] font-bold text-[#9E782F] uppercase tracking-widest">REWARD EXPIRATION &amp; HORIZON</h4>

          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${expiryType === 'Days' ? 'border-[#D4A753]' : 'border-[#D1CDC7] group-hover:border-[#D4A753]'
                }`}>
                {expiryType === 'Days' && <div className="w-2 h-2 rounded-full bg-[#D4A753]" />}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={expiryType === 'Days'}
                onChange={() => setExpiryType('Days')}
              />
              <span className="text-[13px] font-bold text-[#1A1615]">Relative Duration (Days after token issuance)</span>
            </label>

            {expiryType === 'Days' && (
              <div className="ml-7 flex items-center gap-2">
                <input
                  type="number"
                  value={expiryDays || ''}
                  onChange={e => setExpiryDays(Number(e.target.value))}
                  className="w-24 px-3.5 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                  placeholder="30"
                />
                <span className="text-[13px] text-[#7C746C] font-semibold">Calendar Days</span>
              </div>
            )}

            <label className="flex items-center gap-3 cursor-pointer group pt-1">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${expiryType === 'Date' ? 'border-[#D4A753]' : 'border-[#D1CDC7] group-hover:border-[#D4A753]'
                }`}>
                {expiryType === 'Date' && <div className="w-2 h-2 rounded-full bg-[#D4A753]" />}
              </div>
              <input
                type="radio"
                className="hidden"
                checked={expiryType === 'Date'}
                onChange={() => setExpiryType('Date')}
              />
              <span className="text-[13px] font-bold text-[#1A1615]">Absolute Fixed Expiration Date</span>
            </label>

            {expiryType === 'Date' && (
              <div className="ml-7">
                <input
                  type="date"
                  value={expiryDate}
                  onChange={e => setExpiryDate(e.target.value)}
                  className="px-3.5 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Audience Impact & Simulation */}
      <div className="lg:col-span-4 w-full shrink-0 space-y-6">
        <div className="bg-white border border-[#EFECE6] rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-[#EFECE6]">
            <CheckCircle2 className="w-5 h-5 text-[#15803D]" />
            <h4 className="text-[14px] font-bold text-[#1A1615]">Reward Summary</h4>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#7C746C] font-medium">Selected Perk:</span>
              <span className="font-bold text-[#1A1615] capitalize">{rewardType.replace('_', ' ')}</span>
            </div>

            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#7C746C] font-medium">Perk Detail:</span>
              <span className="font-bold text-[#9E782F] truncate max-w-[140px]">
                {rewardType === 'cashback' && `${currSymbol}${cashbackAmount}`}
                {rewardType === 'discount' && `${discountValue}${discountType === 'Percentage' ? '%' : currSymbol}`}
                {rewardType === 'points' && `${rewardPoints} Pts`}
                {rewardType === 'free_item' && (freeItem || 'Free Item')}
              </span>
            </div>

            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#7C746C] font-medium">Max Limit:</span>
              <span className="font-bold text-[#1A1615]">{maxRedemptions} per guest</span>
            </div>

            <div className="flex justify-between items-center text-[12px]">
              <span className="text-[#7C746C] font-medium">Validity Window:</span>
              <span className="font-bold text-[#15803D]">{expiryType === 'Days' ? `${expiryDays} Days` : (expiryDate || 'Fixed Date')}</span>
            </div>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-3.5 flex items-start gap-2.5">
            <Lightbulb className="w-4 h-4 text-[#D4A753] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#7C746C] leading-relaxed font-medium">
              Rewards are issued instantly via Apple/Google Wallet push notifications upon POS trigger verification.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface CampaignBuilderPageProps {
  initialViewMode?: 'dashboard' | 'builder';
  onNavigate?: (route: string) => void;
  onToggleMobileMenu?: () => void;
}

export const CampaignBuilderPage: React.FC<CampaignBuilderPageProps> = ({ initialViewMode = 'dashboard', onNavigate, onToggleMobileMenu }) => {
  const { id: routeCampaignId } = useParams();
  const { wallet, checkAndDeductCredit } = useWallet();
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Scroll main viewport container to top when stepping through campaign wizard
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const mainScrollContainer = document.querySelector('.overflow-y-scroll');
    if (mainScrollContainer) {
      mainScrollContainer.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [currentStep]);

  const [viewMode, setViewMode] = useState<'dashboard' | 'builder'>(initialViewMode);
  const [qrModalCampaign, setQrModalCampaign] = useState<any | null>(null);
  const [qrModalImgUrl, setQrModalImgUrl] = useState<string | null>(null);

  const fetchCampaignQr = async (campaignId: string | number) => {
    try {
      const response = await apiClient.get(`/merchant/campaigns/${campaignId}/qr`, {
        responseType: 'blob'
      });
      if (response.data.type === 'application/json') {
        const text = await response.data.text();
        const json = JSON.parse(text);
        if (json.data && typeof json.data === 'string') return json.data;
        if (json.data && json.data.qr_code) return json.data.qr_code;
      }
      return URL.createObjectURL(new Blob([response.data], { type: (response.headers['content-type'] as string) || 'image/png' }));
    } catch (error) {
      console.error('API QR failed, falling back', error);
      return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://revia.app/c/${campaignId || 'promo'}`;
    }
  };

  const handleDownload = async (campaign: any) => {
    try {
      const url = await fetchCampaignQr(campaign.id);
      
      const a = document.createElement('a');
      if (url.startsWith('blob:') || url.startsWith('data:')) {
        a.href = url;
      } else {
        const response = await fetch(url);
        const blob = await response.blob();
        a.href = URL.createObjectURL(blob);
      }
      a.download = `${campaign.name.replace(/\s+/g, '_')}_QR.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed', error);
      window.open(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://revia.app/c/${campaign.id || 'promo'}`, '_blank');
    }
  };

  // Sync viewMode whenever initialViewMode prop changes (e.g. route change)
  React.useEffect(() => {
    setViewMode(initialViewMode);
  }, [initialViewMode]);

  const handleOpenBuilder = () => {
    dispatch(setCurrentCampaign(null)); // Clear for new campaign
    if (onNavigate) {
      onNavigate('/campaigns/new');
    }
    setViewMode('builder');
    setCurrentStep(1);
    setIsConfiguringCondition(false);
    setSelectedConditionType('visit');
    setIsConfiguringReward(false);
    setSelectedRewardType('cashback');
  };

  const handleDeleteCampaign = (id: number, name: string) => {
    setCampaignToDelete({ id, name });
  };

  const handleToggleCampaignStatus = (id: number, currentStatus: string) => {
    const is_active = (currentStatus === 'Draft' || currentStatus === 'Paused' || currentStatus === 'Inactive' || currentStatus === 'Deactive') ? true : false;
    dispatch(toggleCampaignStatus({ id, is_active }))
      .unwrap()
      .then(() => {
        showToast(`Campaign ${is_active ? 'activated' : 'deactivated'} successfully.`);
      })
      .catch(err => {
        showToast(`Error: ${err}`);
      });
  };

  const confirmDeleteCampaign = () => {
    if (campaignToDelete) {
      dispatch(deleteCampaign(campaignToDelete.id))
        .unwrap()
        .then(() => {
          showToast(`Campaign "${campaignToDelete.name}" deleted.`);
          setCampaignToDelete(null);
        })
        .catch(err => {
          showToast(`Error: ${err}`);
          setCampaignToDelete(null);
        });
    }
  };

  const handleSubmitCampaign = (isDraft: boolean) => {
    const finalCampaignName = campaignName.trim() || (isDraft ? 'Untitled Draft' : 'Untitled Campaign');

    if (!isDraft) {
      const allowed = checkAndDeductCredit('campaign_creation', 50, `cmp-pub-${Date.now()}`, 'Publish & Launch Campaign');
      if (!allowed) return;
    }

    // Map frontend topLevelType + existingSubType to backend-expected `type` enum values
    // Backend accepts: welcome, visit, billing_one_time, stamp, happy_hours, etc.
    const typeMap: Record<string, string> = {
      'new_welcome': 'welcome',
      'new_first_visit': 'visit',
      'new_first_billing': 'billing_one_time',
      'existing_visit': 'visit',
      'existing_billing': 'billing_one_time',
      'existing_stamp': 'stamp',
      'new_customer': 'welcome',
      'existing_customer': 'visit',
      'direct_customer': 'welcome',
      'product_qr': 'welcome',
    };
    const resolvedType = typeMap[existingSubType || topLevelType] || topLevelType || 'welcome';

    // Map frontend rewardSelection to backend-expected `reward_type` enum values
    // Backend accepts: cashback, fixed_discount, percentage_discount
    const rewardTypeMap: Record<string, string> = {
      'cashback': 'cashback',
      'fixed amount discount': 'fixed_discount',
      'percentage % discount': 'percentage_discount',
      'free item / bog': 'cashback',
    };
    const resolvedRewardType = rewardTypeMap[rewardSelection.toLowerCase()] || 'cashback';

    const payload: any = {
      title: finalCampaignName,
      type: resolvedType,
      customer_type: selectedTiers[0] || 'VIP',
      reward_type: resolvedRewardType,
      reward_value: String(
        resolvedRewardType === 'cashback' ? (rewardConfig?.cashbackAmount ?? rewardConfig?.freeItem ?? '50') :
        resolvedRewardType === 'fixed_discount' || resolvedRewardType === 'percentage_discount' ? (rewardConfig?.discountValue ?? '50') :
        resolvedRewardType === 'reward_points' ? (rewardConfig?.rewardPoints ?? '50') :
        (rewardConfig?.rewardPoints ?? rewardConfig?.cashbackAmount ?? rewardConfig?.discountValue ?? rewardConfig?.freeItem ?? '50')
      ),
      is_active: !isDraft,
      valid_from: (ruleConfig?.startDate || startDate) ? new Date(ruleConfig?.startDate || startDate).toISOString() : undefined,
      valid_until: (ruleConfig?.endDate || endDate) ? new Date(ruleConfig?.endDate || endDate).toISOString() : undefined,
      trigger_event: ruleConfig?.triggerEvent || 'qr_scan',
      
      // New fields to fully match frontend state
      priority_level: priorityLevel,
      stackable: stackingControl,
      expiry_type: 'Days', // Defaulting to Days since expirationWindow is a string in parent state
      expiry_days: 30, // Default since expiryDays is in child component
      max_redemptions: 1, // Default since it's in child component
      total_budget_cap: 500, // Default since it's in child component
      cooling_period_hours: 6, // Default since it's in child component
      auto_revoke_on_refund: true, // Default since it's in child component

      // Additional fields for audience filtering & advanced campaign settings
      lifecycle_type: lifecycleType,
      birthday_horizon_days: birthdayHorizon,
      min_csat_score: 4.5, // Default/static CSAT score as per request
      
      direct_customer_name: directCustomerName,
      direct_customer_mobile: directCustomerMobile,
      direct_customer_bill_no: directCustomerBillNo,
      direct_redemption_mode: directRedemptionMode,
      
      product_qr_quantity: productQrQuantity,
      product_qr_redemption_mode: productQrRedemptionMode,
      
      redemption_limit_type: redemptionLimit,
      expiration_window_type: expirationWindow,
      expiry_date: rewardConfig?.expiryDate ? new Date(rewardConfig.expiryDate).toISOString() : '2026-12-31T00:00:00.000Z',
      currency: currency.replace(' (?)', ''), // Clean up currency string
      
      match_type: ruleConfig?.matchType || matchType,
      rules_config: ruleConfig?.rules || []
    };

    // Add optional fields only if they have values
    if (minAge !== 18) {
      payload.min_age = minAge;
    }
    if (maxAge !== 80) {
      payload.max_age = maxAge;
    }

    const selectedBranches = ruleConfig?.activeBranches || activeBranches;
    if (selectedBranches && selectedBranches.length > 0) {
      // selectedBranches stores names, look up the numeric ID from the branches list
      const matchedBranch = branches.find((b: any) => b.name === selectedBranches[0]);
      payload.branch_id = matchedBranch?.id ? String(matchedBranch.id) : selectedBranches[0];
    }
    
    // We bind these to the new state variables added in the parent component
    if (targetValue || minBillAmount) {
      payload.target_value = targetValue || String(minBillAmount);
    }
    if (minBillAmount) {
      payload.min_bill_amount = String(minBillAmount);
    }
    if (productQrName) {
      payload.target_item_name = productQrName;
    }
    if (rewardConfig?.scheduleConfig) {
      payload.schedule_config = rewardConfig.scheduleConfig;
    }

    const handleApiError = (err: any) => {
      let errorMsg = typeof err === 'string' ? err : (err?.message || 'Unknown error');
      showToast(`Error: ${errorMsg}`);
      
      if (err?.errors) {
        const errFields = Object.keys(err.errors);
        if (errFields.includes('title') || errFields.includes('type')) {
          setCurrentStep(1);
        } else if (errFields.includes('customer_type') || errFields.includes('min_bill_amount')) {
          setCurrentStep(2);
        } else if (errFields.includes('valid_from') || errFields.includes('valid_until') || errFields.includes('schedule_config')) {
          setCurrentStep(3);
        } else if (errFields.includes('reward_type') || errFields.includes('reward_value') || errFields.includes('target_item_name')) {
          setCurrentStep(4);
        }
      }
    };

    if (currentCampaign?.id) {
      dispatch(updateCampaign({ id: currentCampaign.id, data: payload }))
        .unwrap()
        .then(() => {
          showToast(`Campaign ${isDraft ? 'draft saved' : 'published'} successfully!`);
          setTimeout(() => handleGoToDashboard(), 1200);
        })
        .catch(handleApiError);
    } else {
      dispatch(createCampaign(payload))
        .unwrap()
        .then(() => {
          showToast(`Campaign ${isDraft ? 'draft saved' : 'published'} successfully!`);
          setTimeout(() => handleGoToDashboard(), 1200);
        })
        .catch(handleApiError);
    }
  };

  const handleNextStep = () => {
    let newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!campaignName.trim()) newErrors.campaignName = 'Campaign Name is required';
      if (!topLevelType) newErrors.topLevelType = 'Campaign Goal/Type is required';
      if (!startDate) newErrors.startDate = 'Start Date is required';
      if (!endDate) newErrors.endDate = 'End Date is required';
      if (activeBranches.length === 0) newErrors.activeBranches = 'Please select at least one active branch';
    } else if (currentStep === 2) {
      if (selectedTiers.length === 0) {
        newErrors.selectedTiers = 'Please select at least one customer tier';
      }
    } else if (currentStep === 3) {
      // Step 3 specific validation if any
    } else if (currentStep === 4) {
      if (!rewardSelection) newErrors.rewardSelection = 'Reward selection is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      const firstError = Object.keys(newErrors)[0];
      let elemId = '';
      if (firstError === 'campaignName') elemId = 'campaign-name-input';
      else if (firstError === 'topLevelType') elemId = 'type-new-customer';
      else if (firstError === 'startDate') elemId = 'start-date-input';
      else if (firstError === 'endDate') elemId = 'end-date-input';
      else if (firstError === 'activeBranches') elemId = 'active-branches-container';
      else if (firstError === 'selectedTiers') elemId = 'selected-tiers-container';
      
      if (elemId) {
        const elem = document.getElementById(elemId);
        if (elem) {
          elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
          elem.focus();
        }
      }
      return;
    }
    
    setFormErrors({});
    setCurrentStep(prev => prev + 1);
  };

  const handleEditCampaign = (c: any) => {
    const original = apiCampaigns.find(apiC => String(apiC.id) === String(c.id));
    if (original) {
      dispatch(setCurrentCampaign(original));
    } else {
      // Fallback if not found in API list but passed from mock data
      dispatch(setCurrentCampaign(c));
    }
    if (onNavigate) {
      onNavigate(`/campaigns/edit/${c.id}`);
    }
    setViewMode('builder');
    setCurrentStep(1);
  };

  const handleDuplicateCampaign = (c: any) => {
    const original = apiCampaigns.find(apiC => String(apiC.id) === String(c.id)) || c;
    // Strip the ID and add "(Copy)" to the title so the API treats it as a new creation
    const duplicatedCampaign = { 
      ...original, 
      id: undefined, 
      title: `${original.title || original.name || 'Untitled'} (Copy)` 
    };
    dispatch(setCurrentCampaign(duplicatedCampaign));
    if (onNavigate) {
      onNavigate('/campaigns/new');
    } else {
      setViewMode('builder');
    }
    setCurrentStep(1);
  };

  const handleGoToDashboard = () => {
    dispatch(setCurrentCampaign(null));
    if (onNavigate) {
      onNavigate('/campaigns');
    }
    setViewMode('dashboard');
  };

  const [selectedCampaignType, setSelectedCampaignType] = useState<string>('Loyalty Boost');
  const [isAddLocationOpen, setIsAddLocationOpen] = useState<boolean>(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{id: number, name: string} | null>(null);
  const [ruleConfig, setRuleConfig] = useState<any>({});
  const [rewardConfig, setRewardConfig] = useState<any>({});

  // Step 1 – Basics state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [campaignName, setCampaignName] = useState('Summer Special');
  const [creationFlow, setCreationFlow] = useState<'choose_type' | 'multiple_list' | 'wizard'>('choose_type');
  const [creationType, setCreationType] = useState<'single' | 'multiple'>('single');
  const [isConfiguringCondition, setIsConfiguringCondition] = useState<boolean>(false);
  const [selectedLoyaltyTier, setSelectedLoyaltyTier] = useState<string>('all');
  const [campaignStatusSelection, setCampaignStatusSelection] = useState<'draft' | 'active'>('draft');
  const [visitBasedVisits, setVisitBasedVisits] = useState<number>(3);
  const [visitBasedMinBill, setVisitBasedMinBill] = useState<number>(500);
  const [visitBasedValidityType, setVisitBasedValidityType] = useState<'specific_period' | 'no_limit'>('specific_period');
  const [visitBasedStartDate, setVisitBasedStartDate] = useState<string>('15 Sep 2025');
  const [visitBasedEndDate, setVisitBasedEndDate] = useState<string>('30 Sep 2025');
  const [visitBasedBranchScope, setVisitBasedBranchScope] = useState<'all' | 'selected'>('all');
  const [audienceSubStep, setAudienceSubStep] = useState<'choose_audience' | 'order_types' | 'demographics'>('choose_audience');
  const [demographicAgeRange, setDemographicAgeRange] = useState<[number, number]>([18, 60]);
  const [demographicGender, setDemographicGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [demographicTotalSpend, setDemographicTotalSpend] = useState<number>(50000);
  const [demographicTotalVisits, setDemographicTotalVisits] = useState<number>(50);

  const [selectedConditionType, setSelectedConditionType] = useState<'visit' | 'billing' | 'stamps' | 'item' | 'happy_hours' | 'birthday' | 'combo' | null>(null);
  const [visitQualifyingCount, setVisitQualifyingCount] = useState<number>(1);
  const [visitMinBillAmount, setVisitMinBillAmount] = useState<string>('0');
  const [visitApplyTo, setVisitApplyTo] = useState<'per_bill' | 'total_spent'>('per_bill');
  const [visitOfferAvailability, setVisitOfferAvailability] = useState<'same_day' | 'month_end'>('same_day');

  const [billingTargetAmount, setBillingTargetAmount] = useState<number>(500);
  const [billingFrequency, setBillingFrequency] = useState<string>('Monthly');
  const [billingFrequencyDropdownOpen, setBillingFrequencyDropdownOpen] = useState<boolean>(false);
  const [billingAllowEarlyRedemption, setBillingAllowEarlyRedemption] = useState<'yes' | 'no'>('yes');
  const [billingWhenToGiveOffer, setBillingWhenToGiveOffer] = useState<'same_order' | 'next_visit'>('same_order');

  // Condition 2: Stamps State
  const [stampQualifyingItem, setStampQualifyingItem] = useState<string>('Any item');
  const [stampTargetCount, setStampTargetCount] = useState<number>(5);
  const [stampValidityPeriod, setStampValidityPeriod] = useState<string>('Monthly');

  // Condition 3: Item Based State
  const [itemBasedTab, setItemBasedTab] = useState<'specific_items' | 'category'>('specific_items');
  const [itemBasedSearch, setItemBasedSearch] = useState<string>('');
  const [itemBasedCategoryFilter, setItemBasedCategoryFilter] = useState<string>('All Categories');
  const [itemBasedBranchFilter, setItemBasedBranchFilter] = useState<string>('All Branches');
  const [itemBasedSelectedCategoryPill, setItemBasedSelectedCategoryPill] = useState<string>('All items');
  const [itemBasedSelectedIds, setItemBasedSelectedIds] = useState<string[]>(['2391', '2340']);

  // Condition 4: Happy Hours State
  const [happyHoursStartTime, setHappyHoursStartTime] = useState<string>('10:00 AM');
  const [happyHoursEndTime, setHappyHoursEndTime] = useState<string>('04:00 PM');
  const [happyHoursSelectedDays, setHappyHoursSelectedDays] = useState<string[]>(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [happyHoursRecurring, setHappyHoursRecurring] = useState<boolean>(true);

  // Condition 5: Birthday / Anniversary State
  const [birthdayOccasionType, setBirthdayOccasionType] = useState<'birthday' | 'anniversary'>('birthday');
  const [birthdayDaySpan, setBirthdayDaySpan] = useState<number>(3);
  const [birthdayQuickSpan, setBirthdayQuickSpan] = useState<string>('± 3 Days');
  const [desktopRewardValue, setDesktopRewardValue] = useState<string>('20%');
  const [desktopMaxDiscount, setDesktopMaxDiscount] = useState<number>(500);
  const [desktopTemplate, setDesktopTemplate] = useState<string>('classic');

  // Desktop Step 4: Rewards State (matching Figma screenshots)
  const [isConfiguringReward, setIsConfiguringReward] = useState<boolean>(false);
  const [selectedRewardType, setSelectedRewardType] = useState<string>('cashback');

  // Cashback (Screenshot 2)
  const [cashbackType, setCashbackType] = useState<'percentage' | 'fixed'>('percentage');
  const [cashbackPercentage, setCashbackPercentage] = useState<string>('10');
  const [cashbackFixedAmount, setCashbackFixedAmount] = useState<string>('50');
  const [cashbackCurrency, setCashbackCurrency] = useState<string>('INR (₹)');
  const [cashbackMaxCapping, setCashbackMaxCapping] = useState<string>('200');
  const [cashbackApplicableOn, setCashbackApplicableOn] = useState<string>('all_items');

  // Reward Points (Screenshot 3)
  const [rewardPointsType, setRewardPointsType] = useState<'percentage' | 'fixed'>('percentage');
  const [rewardPointsPercentage, setRewardPointsPercentage] = useState<string>('10');
  const [rewardPointsFixedAmount, setRewardPointsFixedAmount] = useState<string>('50');
  const [rewardPointsValue, setRewardPointsValue] = useState<string>('1');
  const [rewardPointsCurrency, setRewardPointsCurrency] = useState<string>('INR (₹)');
  const [rewardPointsMaxPoints, setRewardPointsMaxPoints] = useState<string>('100');
  const [rewardPointsApplicableOn, setRewardPointsApplicableOn] = useState<string>('all_items');

  // Free Item (Screenshot 4)
  const [freeItemQuantity, setFreeItemQuantity] = useState<number>(1);
  const [freeItemSearch, setFreeItemSearch] = useState<string>('');
  const [freeItemSelectedItem, setFreeItemSelectedItem] = useState<string>('Margherita Pizza');

  // Discount
  const [discountRewardType, setDiscountRewardType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountRewardPercentage, setDiscountRewardPercentage] = useState<string>('10');
  const [discountRewardFixedAmount, setDiscountRewardFixedAmount] = useState<string>('50');
  const [discountRewardMaxCapping, setDiscountRewardMaxCapping] = useState<string>('200');
  const [discountRewardApplicableOn, setDiscountRewardApplicableOn] = useState<string>('all_items');

  // Nominal Priced Item
  const [nominalPrice, setNominalPrice] = useState<string>('19');
  const [nominalQuantity, setNominalQuantity] = useState<number>(1);
  const [nominalSelectedItem, setNominalSelectedItem] = useState<string>('Margherita Pizza');
  const [nominalSearch, setNominalSearch] = useState<string>('');

  // Combo Offers
  const [comboBundleName, setComboBundleName] = useState<string>('Special Combo Bundle');
  const [comboPrice, setComboPrice] = useState<string>('399');
  const [comboSelectedItems, setComboSelectedItems] = useState<string[]>(['Margherita Pizza', 'Cold Coffee']);
  const [comboSearch, setComboSearch] = useState<string>('');

  // Buy X Get Y Free / BOGO (Screenshot 5)
  const [bogoBuyQty, setBogoBuyQty] = useState<number>(1);
  const [bogoGetQty, setBogoGetQty] = useState<number>(1);
  const [bogoSearch, setBogoSearch] = useState<string>('');
  const [bogoCategory, setBogoCategory] = useState<string>('All');
  const [bogoSelectedItems, setBogoSelectedItems] = useState<string[]>(['Margherita Pizza', 'Farmhouse Pizza']);
  const [bogoRule, setBogoRule] = useState<'same_item' | 'any_item_same_price'>('same_item');

  // Preview Mode: Mobile vs Desktop
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'desktop'>('mobile');

  // Step 5: Customize Banner State (Image 2)
  const [bannerTab, setBannerTab] = useState<'content' | 'design' | 'layout'>('content');
  const [bannerOfferTitle, setBannerOfferTitle] = useState('Buy 1 Get 1 Free');
  const [bannerSubtext, setBannerSubtext] = useState('On all pizzas');
  const [bannerSpecialTag, setBannerSpecialTag] = useState('Special Offer');
  const [bannerShowValidity, setBannerShowValidity] = useState(true);
  const [bannerValidityDate, setBannerValidityDate] = useState('31 Dec 2025');
  const [bannerShowLocation, setBannerShowLocation] = useState(true);
  const [bannerLocationText, setBannerLocationText] = useState('Available at all branches');
  const [bannerDescription, setBannerDescription] = useState('Enjoy 1+1 on all pizzas. Treat yourself and a friend to your favourite pizza!');
  const [campaignDescription, setCampaignDescription] = useState('Get 20% off on all main course items. Valid for dine-in and takeaway.');
  const [timeActiveType, setTimeActiveType] = useState<'entire_day' | 'specific_time'>('entire_day');
  const [specificStartTime, setSpecificStartTime] = useState('10:00 AM');
  const [specificEndTime, setSpecificEndTime] = useState('10:00 PM');
  const [audienceTargetType, setAudienceTargetType] = useState<'all' | 'new' | 'existing'>('all');
  const [availableOrderType, setAvailableOrderType] = useState<'dine_in' | 'takeaway' | 'delivery' | 'all'>('dine_in');

  const [multipleCampaignsList, setMultipleCampaignsList] = useState([
    {
      id: 1,
      name: 'Summer Cashback',
      status: 'Active',
      type: 'Cashback',
      description: '10% cashback on all beverages',
      startDate: '15 Sep 2025',
      endDate: '30 Sep 2025',
      icon: 'credit_card'
    },
    {
      id: 2,
      name: 'Lunch Discount',
      status: 'Scheduled',
      type: 'Discount',
      description: '20% off on main course',
      startDate: '01 Oct 2025',
      endDate: '15 Oct 2025',
      icon: 'discount'
    }
  ]);
  const [minBillAmount, setMinBillAmount] = useState<number>(1000);
  const [targetValue, setTargetValue] = useState<string>('');
  const [topLevelType, setTopLevelType] = useState<'new_customer' | 'existing_customer' | 'direct_customer' | 'product_qr' | ''>('');
  const [existingSubType, setExistingSubType] = useState<'existing_visit' | 'existing_billing' | 'existing_stamp' | 'new_welcome' | 'new_first_visit' | 'new_first_billing' | ''>('');
  const [directCustomerName, setDirectCustomerName] = useState<string>('Elena Rostova');
  const [directCustomerMobile, setDirectCustomerMobile] = useState<string>('+91 98765 43210');
  const [directCustomerBillNo, setDirectCustomerBillNo] = useState<string>('INV-88219');
  const [directRedemptionMode, setDirectRedemptionMode] = useState<'auto' | 'merchant_approval'>('merchant_approval');
  const [productQrName, setProductQrName] = useState<string>('');
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  
  // Modal states for Add New Item
  const [isAddCatalogItemModalOpen, setIsAddCatalogItemModalOpen] = useState(false);

  const handleAddCatalogItem = (item: any) => {
    setLocalProducts(prev => [...prev, item.title]);
    setProductQrName(item.title);
    setIsAddCatalogItemModalOpen(false);
  };

  const [showNewItemInput, setShowNewItemInput] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const storeItems = useSelector((state: RootState) => state.catalog.items);
  const storeProducts = storeItems.map(item => item.title);
  const [localProducts, setLocalProducts] = useState<string[]>([]);
  const catalogProducts = [...storeProducts, ...localProducts];
  const [productQrQuantity, setProductQrQuantity] = useState<number>(100);
  const [productQrRedemptionMode, setProductQrRedemptionMode] = useState<'auto' | 'merchant_approval'>('merchant_approval');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [statusDraft, setStatusDraft] = useState(true);
  const [currency, setCurrency] = useState('INR (₹)');
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  const [conditionStatus, setConditionStatus] = useState('Active');
  const [conditionStatusDropdownOpen, setConditionStatusDropdownOpen] = useState(false);
  const conditionStatusDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setCurrencyDropdownOpen(false);
      }
      if (conditionStatusDropdownRef.current && !conditionStatusDropdownRef.current.contains(event.target as Node)) {
        setConditionStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Custom Segment Modal state
  const [showCustomSegmentModal, setShowCustomSegmentModal] = useState(false);
  const [customSegmentName, setCustomSegmentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [statusFilterDropdownOpen, setStatusFilterDropdownOpen] = useState(false);
  const statusFilterDropdownRef = useRef<HTMLDivElement>(null);

  const [typeFilter, setTypeFilter] = useState('All Types');
  const [typeFilterDropdownOpen, setTypeFilterDropdownOpen] = useState(false);
  const typeFilterDropdownRef = useRef<HTMLDivElement>(null);

  const [selectedCampaignIds, setSelectedCampaignIds] = useState<number[]>([]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [openActionMenuId, setOpenActionMenuId] = useState<number | string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (actionMenuRef.current && !actionMenuRef.current.contains(event.target as Node)) {
        setOpenActionMenuId(null);
      }
    };
    if (openActionMenuId !== null) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openActionMenuId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusFilterDropdownRef.current && !statusFilterDropdownRef.current.contains(event.target as Node)) {
        setStatusFilterDropdownOpen(false);
      }
      if (typeFilterDropdownRef.current && !typeFilterDropdownRef.current.contains(event.target as Node)) {
        setTypeFilterDropdownOpen(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [expandedCampaignId, setExpandedCampaignId] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const displayName = user?.business?.name || user?.name || 'Emma Rostova';
  const displayRole = user?.role || 'General Manager';
  const displayAvatar = user?.business?.logo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const displayEmail = user?.business?.contact_email || user?.email || 'emma.rostova@revia.app';
  const apiCampaigns = useSelector((state: RootState) => state.campaign.campaigns);
  const currentCampaign = useSelector((state: RootState) => state.campaign.currentCampaign);
  const branches = useSelector((state: RootState) => state.branch.branches);
  const tierOptions = useSelector((state: RootState) => state.master.tierOptions);

  useEffect(() => {
    if (routeCampaignId) {
      dispatch(fetchCampaignById(routeCampaignId));
    }
  }, [routeCampaignId, dispatch]);

  useEffect(() => {
    dispatch(fetchCampaigns(undefined));
    dispatch(fetchBranches());
    dispatch(fetchTierOptions());
    dispatch(fetchProducts());
    dispatch(fetchRewardTypes());
  }, [dispatch]);

  // Populate form if we are editing an existing campaign
  useEffect(() => {
    if (currentCampaign && viewMode === 'builder') {
      setCampaignName(currentCampaign.title || '');
      
      // Handle Date formats for datetime-local (YYYY-MM-DDThh:mm)
      const formatDateTime = (isoStr: string) => {
        if (!isoStr) return '';
        const d = new Date(isoStr);
        if (isNaN(d.getTime())) return '';
        const tz = d.getTimezoneOffset() * 60000;
        return (new Date(d.getTime() - tz)).toISOString().slice(0, 16);
      };
      
      if (!currentCampaign.valid_from && currentCampaign.schedule_config?.start_time) {
        const today = new Date().toISOString().split('T')[0];
        setStartDate(`${today}T${currentCampaign.schedule_config.start_time.slice(0, 5)}`);
      } else {
        setStartDate(formatDateTime(currentCampaign.valid_from));
      }

      if (!currentCampaign.valid_until && currentCampaign.schedule_config?.end_time) {
        const today = new Date().toISOString().split('T')[0];
        setEndDate(`${today}T${currentCampaign.schedule_config.end_time.slice(0, 5)}`);
      } else {
        setEndDate(formatDateTime(currentCampaign.valid_until));
      }
      
      // Status mapping (ensure boolean evaluation)
      setStatusDraft(currentCampaign.is_active ? false : true);
      
      // Type mapping
      if (currentCampaign.type === 'welcome') {
        setTopLevelType('new_customer');
        setExistingSubType('new_welcome');
      } else if (currentCampaign.type === 'visit' || currentCampaign.type === 'billing_one_time') {
        setTopLevelType('existing_customer');
        setExistingSubType('existing_visit');
      }
      
      // Customer Type mapping
      if (currentCampaign.customer_type) {
        setSelectedTiers([currentCampaign.customer_type]);
      }
      
      // Reward mapping
      if (currentCampaign.reward_type === 'cashback') setRewardSelection('Cashback');
      else if (currentCampaign.reward_type === 'fixed_discount') setRewardSelection('Fixed Amount Discount');
      else if (currentCampaign.reward_type === 'percentage_discount') setRewardSelection('Percentage % Discount');
      
      if (currentCampaign.target_item_name) {
        setProductQrName(currentCampaign.target_item_name);
      }
      
      // Branch mapping
      if (currentCampaign.branch_id) {
        // activeBranches stores the branch NAME
        const matchedBranch = branches.find((b: any) => String(b.id) === String(currentCampaign.branch_id));
        if (matchedBranch) {
          setActiveBranches([matchedBranch.name]);
        }
      }
      
      if (currentCampaign.min_bill_amount) {
        setMinBillAmount(Number(currentCampaign.min_bill_amount));
      }
      
      if (currentCampaign.target_value) {
        setTargetValue(String(currentCampaign.target_value));
      }

      if ((currentCampaign as any).min_age !== undefined && (currentCampaign as any).min_age !== null) {
        setMinAge(Number((currentCampaign as any).min_age));
      }

      if ((currentCampaign as any).max_age !== undefined && (currentCampaign as any).max_age !== null) {
        setMaxAge(Number((currentCampaign as any).max_age));
      }

      // Initialize ruleConfig so Step 3 loads existing rules
      if ((currentCampaign as any).rules_config && Array.isArray((currentCampaign as any).rules_config)) {
        setRuleConfig({
          rules: (currentCampaign as any).rules_config,
          matchType: (currentCampaign as any).match_type || 'ALL',
          triggerEvent: (currentCampaign as any).trigger_event || 'qr_scan',
          startDate: currentCampaign.valid_from ? formatDateTime(currentCampaign.valid_from) : '',
          endDate: currentCampaign.valid_until ? formatDateTime(currentCampaign.valid_until) : '',
        });
      }

      // Initialize rewardConfig so Step 4 loads existing rewards
      setRewardConfig({
        rewardType: currentCampaign.reward_type === 'percentage_discount' || currentCampaign.reward_type === 'fixed_discount' ? 'discount' : currentCampaign.reward_type === 'cashback' ? 'cashback' : 'free_item',
        cashbackAmount: currentCampaign.reward_type === 'cashback' ? Number(currentCampaign.reward_value || 0) : 10,
        discountType: currentCampaign.reward_type === 'fixed_discount' ? 'Fixed' : 'Percentage',
        discountValue: currentCampaign.reward_type === 'percentage_discount' || currentCampaign.reward_type === 'fixed_discount' ? Number(currentCampaign.reward_value || 0) : 15,
        freeItem: currentCampaign.target_item_name || '',
        maxRedemptions: Number((currentCampaign as any).max_redemptions || 1),
        totalBudgetCap: Number((currentCampaign as any).total_budget_cap || 500),
        coolingPeriodHours: Number((currentCampaign as any).cooling_period_hours || 6),
      });
    }
  }, [currentCampaign, viewMode, branches]);

  const fallbackMockCampaigns = [
    {
      id: 1,
      name: 'Autumn Reserve Tasting',
      description: 'Free Cake in Your Order',
      type: 'welcome',
      typeLabel: 'Welcome Campaign',
      status: 'Active',
      target: 'VIP',
      validity: 'Nov 1, 2024 – Nov 30, 2024',
      startDate: 'Nov 1, 2024',
      endDate: 'Nov 30, 2024',
      condition: 'Minimum Bill: ₹500',
      offer: 'Free Cake',
      expiryDate: 'Nov 30, 2024',
      progress: 85,
      reward: 'Free Cake'
    },
    {
      id: 2,
      name: 'Weekday Coffee Rewards',
      description: 'Get 1 Free Coffee',
      type: 'item',
      typeLabel: 'Item Based Offer',
      status: 'Draft',
      target: 'ALL CUSTOMERS',
      validity: 'Nov 1, 2024 – Nov 30, 2024',
      startDate: 'Nov 1, 2024',
      endDate: 'Nov 30, 2024',
      condition: 'Qualifying: 5 Coffee purchases',
      offer: '1 Free Coffee',
      expiryDate: 'Nov 30, 2024',
      progress: 0,
      reward: 'Free Coffee'
    }
  ];

  const campaigns = apiCampaigns.length > 0 ? [...apiCampaigns].sort((a: any, b: any) => (b.id || 0) - (a.id || 0)).map((c, idx) => {
    let finalStatus = 'Draft';
    const now = new Date();
    const start = c.valid_from ? new Date(c.valid_from) : null;
    const end = c.valid_until ? new Date(c.valid_until) : null;

    if (c.is_active) {
      if (start && now < start) {
        finalStatus = 'Scheduled';
      } else if (end && now > end) {
        finalStatus = 'Ended';
      } else {
        finalStatus = 'Active';
      }
    } else {
      if (start && end) {
        finalStatus = 'Paused';
      } else {
        finalStatus = 'Draft';
      }
    }

    const typeLabel = c.type === 'welcome' ? 'Welcome Offer'
      : c.type === 'visit' ? 'Visit Offer'
      : c.type === 'billing_one_time' ? 'Billing Offer'
      : c.type === 'stamp' ? 'Stamp Card'
      : (c.type || 'Welcome Offer');

    const offerLabel = c.reward_type === 'cashback'
      ? `₹${c.reward_value || 50} Cashback`
      : c.reward_type === 'percentage_discount'
      ? `${c.reward_value || 10}% Off`
      : c.reward_type === 'fixed_discount'
      ? `₹${c.reward_value || 50} Off`
      : 'Buy 1 Get 1';

    const conditionLabel = c.min_bill_amount
      ? `Billing Based : Min ₹${c.min_bill_amount}`
      : c.target_value
      ? `Visits Based : Min ${c.target_value}`
      : 'Billing Based : Min ₹200';

    const branchList = branches && branches.length > 0
      ? branches.slice(0, 3).map((b: any, bIdx: number) => ({
          name: `Branches${bIdx + 1}`,
          location: b.name || 'West End',
          scan: '420',
          redeem: '168',
          sales: '₹16,900'
        }))
      : [
          { name: 'Branches1', location: 'West End', scan: '420', redeem: '168', sales: '₹16,900' },
          { name: 'Branches2', location: 'West End', scan: '420', redeem: '168', sales: '₹16,900' },
          { name: 'Branches3', location: 'West End', scan: '420', redeem: '168', sales: '₹16,900' }
        ];

    return {
      id: c.id,
      name: c.title || 'Welcome Coffee',
      description: c.description || 'First-time visitor beverage incentive',
      type: c.type || 'welcome',
      typeLabel: typeLabel,
      status: finalStatus,
      target: c.customer_type || 'All Customers',
      validity: `${c.valid_from ? new Date(c.valid_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Nov 2024'} – ${c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '30 Nov 2024'}`,
      startDate: c.valid_from ? new Date(c.valid_from).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '1 Nov 2024',
      endDate: c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '30 Nov 2024',
      condition: conditionLabel,
      offer: offerLabel,
      expiryDate: c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '30 Nov 2024',
      scannedCount: (c as any).scan_count ? `${(c as any).scan_count.toLocaleString()} Scans` : '1,420 Scans',
      redeemCount: (c as any).redeem_count ? (c as any).redeem_count.toLocaleString() : '1,420',
      salesCount: (c as any).sales_count ? (c as any).sales_count.toLocaleString() : '17,420',
      progress: (c as any).performance || 80,
      reward: c.reward_type || 'Reward',
      isTopPerformer: idx === 0 || finalStatus === 'Active',
      imageUrl: (c as any).image_url || 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=300&auto=format&fit=crop&q=80',
      branches: branchList
    };
  }) : fallbackMockCampaigns;

  React.useEffect(() => {
    campaigns.forEach(c => {
      const img = new window.Image();
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://revia.app/c/${c.id || 'promo'}`;
    });
  }, [campaigns]);

  const [priorityLevel, setPriorityLevel] = useState<number>(1);
  const [selectedTiers, setSelectedTiers] = useState<string[]>([]);
  const [lifecycleType, setLifecycleType] = useState<string>('Both');
  const [birthdayHorizon, setBirthdayHorizon] = useState<number>(7);
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(80);

  const [simulationData, setSimulationData] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    if (currentStep !== 2) return;
    const timer = setTimeout(async () => {
      try {
        setIsSimulating(true);
        const response = await apiClient.post('/merchant/campaigns/simulate-audience', {
          tiers: selectedTiers,
          lifecycle_type: lifecycleType,
          birthday_horizon_days: birthdayHorizon,
          min_age: minAge,
          max_age: maxAge,
          min_csat_score: 4.5
        });
        setSimulationData(response.data?.data || response.data || null);
      } catch (error) {
        console.error('Failed to simulate audience', error);
      } finally {
        setIsSimulating(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedTiers, lifecycleType, birthdayHorizon, minAge, maxAge, currentStep]);

  const [matchType, setMatchType] = useState<'ALL' | 'ANY'>('ALL');
  const [rewardType, setRewardType] = useState<'Same' | 'Different'>('Same');

  const [rewardSelection, setRewardSelection] = useState<string>('Free item / BOG');
  const [redemptionLimit, setRedemptionLimit] = useState<string>('1 Time Only');
  const [stackingControl, setStackingControl] = useState<boolean>(true);
  const [expirationWindow, setExpirationWindow] = useState<string>('Dynamic Qualification Window');

  type RuleType = 'standard1' | 'standard2' | 'bogo' | 'orGroup';
  interface RuleItem { id: number; type: RuleType; }
  const [rulesList, setRulesList] = useState<RuleItem[]>([
    { id: 1, type: 'standard1' },
    { id: 2, type: 'standard2' },
    { id: 3, type: 'bogo' },
    { id: 4, type: 'orGroup' }
  ]);
  const addRule = (type: RuleType) => setRulesList([...rulesList, { id: Date.now(), type }]);
  const removeRule = (id: number) => setRulesList(rulesList.filter(r => r.id !== id));
  const duplicateRule = (id: number) => {
    const rule = rulesList.find(r => r.id === id);
    if (rule) setRulesList([...rulesList, { ...rule, id: Date.now() }]);
  };

  const [orGroupItems, setOrGroupItems] = useState<{ id: number, type: 'tier' | 'stamp' }[]>([
    { id: 1, type: 'tier' },
    { id: 2, type: 'stamp' }
  ]);
  const addOrGroupItem = () => setOrGroupItems([...orGroupItems, { id: Date.now(), type: 'stamp' }]);
  const removeOrGroupItem = (id: number) => setOrGroupItems(orGroupItems.filter(i => i.id !== id));

  const [activeBranches, setActiveBranches] = useState<string[]>([]);
  const allBranchOptions = branches.map(b => b.name);
  const toggleBranch = (branch: string) => {
    setActiveBranches(prev =>
      prev.includes(branch) ? prev.filter(b => b !== branch) : [...prev, branch]
    );
    if (formErrors.activeBranches) setFormErrors(prev => ({...prev, activeBranches: ''}));
  };
  const availableBranches = allBranchOptions;
  const handleAddLocation = () => {
    const nextBranch = availableBranches.find(b => !activeBranches.includes(b));
    if (nextBranch) setActiveBranches([...activeBranches, nextBranch]);
    else showToast('All locations added');
  };
  const handleRemoveLocation = (branchToRemove: string) => {
    setActiveBranches(activeBranches.filter(b => b !== branchToRemove));
  };

  const [draggedRuleId, setDraggedRuleId] = useState<number | null>(null);
  const handleDragStart = (id: number) => setDraggedRuleId(id);
  const handleDragOver = (e: React.DragEvent, targetId: number) => {
    e.preventDefault();
    if (draggedRuleId === null || draggedRuleId === targetId) return;
    const draggedIndex = rulesList.findIndex(r => r.id === draggedRuleId);
    const targetIndex = rulesList.findIndex(r => r.id === targetId);
    if (draggedIndex < 0 || targetIndex < 0) return;
    const newRules = [...rulesList];
    const [draggedItem] = newRules.splice(draggedIndex, 1);
    newRules.splice(targetIndex, 0, draggedItem);
    setRulesList(newRules);
  };
  const handleDragEnd = () => setDraggedRuleId(null);


  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const toggleTier = (tier: string) => {
    if (tier === 'All Tiers' || tier === 'All Customers') {
      setSelectedTiers((tierOptions.length > 0 ? tierOptions : TIER_OPTIONS_FALLBACK).map(t => t.value));
    } else {
      setSelectedTiers(prev =>
        prev.includes(tier) ? prev.filter(t => t !== tier) : [...prev, tier]
      );
    }
    if (formErrors.selectedTiers) setFormErrors(prev => ({...prev, selectedTiers: ''}));
  };

  const campaignTypes = [
    { id: '% Discount', icon: Percent },
    { id: 'Loyalty Boost', icon: Star },
    { id: 'Flash Promo', icon: Zap },
    { id: 'Referral Bonus', icon: Users },
    { id: 'New Customer', icon: UserPlus },
    { id: 'Old Customer', icon: RefreshCw },
    { id: 'Welcome Campaign', icon: Sparkles },
    { id: 'Visit Campaign', icon: Activity },
    { id: 'Billing Campaign', icon: DollarSign },
    { id: 'Stamp Campaign', icon: FileText },
    { id: 'Happy Hours', icon: Clock },
  ];

  const steps = [
    { id: 1, name: 'Basic Details' },
    { id: 2, name: 'Audience Type' },
    { id: 3, name: 'Conditions' },
    { id: 4, name: 'Rewards' },
    { id: 5, name: 'Template' },
    { id: 6, name: 'Review & Launch' },
  ];

  // Derived full campaign type key for Step 3 routing
  const fullCampaignType =
    (topLevelType === 'existing_customer' || topLevelType === 'new_customer') && existingSubType
      ? existingSubType
      : topLevelType;

  const step1Valid = campaignName.trim().length > 0 && fullCampaignType !== '';

  const renderStep1 = () => {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000;
    const currentDateTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);

    return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
      {/* ── LEFT COLUMN ── */}
      <div className="lg:col-span-7 flex flex-col gap-4 lg:block lg:bg-white lg:border lg:border-[#EFECE6] lg:rounded-xl lg:p-6 lg:shadow-sm lg:space-y-6">


        {/* Desktop section label */}
        <div className="hidden lg:block border-b border-[#EFECE6] pb-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#9E9A93]">CONFIG 1/5</span>
          <h3 className="text-base font-bold text-[#1A1615]">Campaign Details</h3>
        </div>

        {/* ── CAMPAIGN NAME ── */}
        <div className="bg-white border border-[#EFECE6] rounded-xl p-4 shadow-sm lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent">
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1615]">
              <Sparkles className="w-4 h-4 text-[#D4A753]" /> Campaign Identity
            </div>
            <span className="px-2 py-0.5 bg-[#FDF8EB] text-[#9E782F] text-[10px] font-bold rounded">Required</span>
          </div>

          <FormInput
            id="campaign-name-input"
            label="Campaign Name"
            required={true}
            type="text"
            value={campaignName}
            maxLength={64}
            rightLabel={`${campaignName.length} / 64 characters`}
            onChange={e => {
              setCampaignName(e.target.value);
              if (formErrors.campaignName) setFormErrors(prev => ({...prev, campaignName: ''}));
            }}
            placeholder="e.g. Autumn Reserve Tasting & Geisha Perk"
            error={formErrors.campaignName}
          />

          {/* ── CAMPAIGN TYPE (nested radio-cards) ── */}
          <div className={formErrors.topLevelType ? "p-3 border border-red-500 rounded-2xl bg-red-50/10" : ""}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#1A1615] lg:text-[#6E6A66] mb-3">
              Campaign Type <span className="text-[#B7362F] ml-0.5">*</span>
            </label>
            {formErrors.topLevelType && <p className="text-red-500 text-xs font-semibold mb-3 -mt-2">{formErrors.topLevelType}</p>}

            {/* Level 1 – 4 top-level cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-2">
              {/* New Customer */}
              <button
                id="type-new-customer"
                type="button"
                onClick={() => {
                  setTopLevelType('new_customer');
                  if (formErrors.topLevelType) setFormErrors(prev => ({...prev, topLevelType: ''}));
                  if (!['new_welcome', 'new_first_visit', 'new_first_billing'].includes(existingSubType)) {
                    setExistingSubType('new_welcome');
                  }
                }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${topLevelType === 'new_customer'
                  ? 'bg-[#FDF8EB] border-[#D4A753] shadow-md'
                  : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50 hover:bg-[#FAF8F5]'
                  }`}
              >
                {topLevelType === 'new_customer' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#D4A753] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${topLevelType === 'new_customer' ? 'bg-[#D4A753]/20' : 'bg-[#F3EDE6]'
                  }`}>
                  <Sparkles className={`w-5 h-5 ${topLevelType === 'new_customer' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                </div>
                <div className={`text-[13px] font-bold mb-0.5 ${topLevelType === 'new_customer' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                  }`}>New Customer</div>
                <div className="text-[11px] text-[#6E6A66] leading-tight">Welcome offer for first-time customers</div>
              </button>

              {/* Existing Customer */}
              <button
                id="type-existing-customer"
                type="button"
                onClick={() => {
                  setTopLevelType('existing_customer');
                  if (formErrors.topLevelType) setFormErrors(prev => ({...prev, topLevelType: ''}));
                  if (!['existing_visit', 'existing_billing', 'existing_stamp'].includes(existingSubType)) {
                    setExistingSubType('existing_visit');
                  }
                }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${topLevelType === 'existing_customer'
                  ? 'bg-[#FDF8EB] border-[#D4A753] shadow-md'
                  : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50 hover:bg-[#FAF8F5]'
                  }`}
              >
                {topLevelType === 'existing_customer' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#D4A753] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${topLevelType === 'existing_customer' ? 'bg-[#D4A753]/20' : 'bg-[#F3EDE6]'
                  }`}>
                  <RefreshCw className={`w-5 h-5 ${topLevelType === 'existing_customer' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                </div>
                <div className={`text-[13px] font-bold mb-0.5 ${topLevelType === 'existing_customer' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                  }`}>Existing Customer</div>
                <div className="text-[11px] text-[#6E6A66] leading-tight">Reward repeat customers</div>
              </button>

              {/* Direct Special Offer */}
              <button
                id="type-direct-customer"
                type="button"
                onClick={() => { 
                  setTopLevelType('direct_customer'); 
                  setExistingSubType(''); 
                  if (formErrors.topLevelType) setFormErrors(prev => ({...prev, topLevelType: ''}));
                }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${topLevelType === 'direct_customer'
                  ? 'bg-[#FDF8EB] border-[#D4A753] shadow-md'
                  : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50 hover:bg-[#FAF8F5]'
                  }`}
              >
                {topLevelType === 'direct_customer' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#D4A753] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${topLevelType === 'direct_customer' ? 'bg-[#25D366]/20' : 'bg-[#F3EDE6]'
                  }`}>
                  <MessageSquare className={`w-5 h-5 ${topLevelType === 'direct_customer' ? 'text-[#128C7E]' : 'text-[#9E9A93]'}`} />
                </div>
                <div className={`text-[13px] font-bold mb-0.5 ${topLevelType === 'direct_customer' ? 'text-[#128C7E]' : 'text-[#1A1615]'
                  }`}>Direct Special Offer</div>
                <div className="text-[11px] text-[#6E6A66] leading-tight">WhatsApp link for targeted customer</div>
              </button>

              {/* Product Batch QR */}
              <button
                id="type-product-qr"
                type="button"
                onClick={() => { 
                  setTopLevelType('product_qr'); 
                  setExistingSubType(''); 
                  if (formErrors.topLevelType) setFormErrors(prev => ({...prev, topLevelType: ''}));
                }}
                className={`relative text-left p-4 rounded-2xl border-2 transition-all cursor-pointer ${topLevelType === 'product_qr'
                  ? 'bg-[#FDF8EB] border-[#D4A753] shadow-md'
                  : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50 hover:bg-[#FAF8F5]'
                  }`}
              >
                {topLevelType === 'product_qr' && (
                  <span className="absolute top-2.5 right-2.5 w-4 h-4 bg-[#D4A753] rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </span>
                )}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${topLevelType === 'product_qr' ? 'bg-[#D4A753]/20' : 'bg-[#F3EDE6]'
                  }`}>
                  <QrCode className={`w-5 h-5 ${topLevelType === 'product_qr' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                </div>
                <div className={`text-[13px] font-bold mb-0.5 ${topLevelType === 'product_qr' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                  }`}>Product Batch QR</div>
                <div className="text-[11px] text-[#6E6A66] leading-tight">Batch QR stickers for N product pieces</div>
              </button>
            </div>

            {/* Sub-config panel for Direct Special Offer */}
            {topLevelType === 'direct_customer' && (
              <div className="mt-3 p-5 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#25D366]" />
                    <span className="text-[13px] font-bold text-[#1A1615]">Target Customer Details &amp; WhatsApp Dispatch</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#25D366]/10 text-[#128C7E] rounded-full text-[10px] font-bold uppercase tracking-wider">WhatsApp &amp; SMS</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6A66] block mb-1.5">Customer Name</label>
                    <input
                      type="text"
                      value={directCustomerName}
                      onChange={e => setDirectCustomerName(e.target.value)}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6A66] block mb-1.5">Mobile Number (WhatsApp)</label>
                    <input
                      type="text"
                      value={directCustomerMobile}
                      onChange={e => setDirectCustomerMobile(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full px-3.5 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-[#6E6A66] block mb-1.5">Bill / Reference No.</label>
                    <input
                      type="text"
                      value={directCustomerBillNo}
                      onChange={e => setDirectCustomerBillNo(e.target.value)}
                      placeholder="e.g. INV-88219"
                      className="w-full px-3.5 py-2 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                    />
                  </div>
                </div>

                {/* Redemption Protocol Selector */}
                <div>
                  <label className="text-[11px] font-bold text-[#9E782F] uppercase tracking-wider block mb-2">Redemption Protocol</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Auto Redeem */}
                    <button
                      type="button"
                      onClick={() => setDirectRedemptionMode('auto')}
                      className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-start gap-3 cursor-pointer ${directRedemptionMode === 'auto'
                        ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                        : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50'
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${directRedemptionMode === 'auto' ? 'bg-[#D4A753] text-white' : 'bg-[#FAF8F5] text-[#9E9A93]'
                        }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A1615]">⚡ Auto Redeem</div>
                        <div className="text-[10px] text-[#6E6A66] leading-snug">Instant redemption automatically upon customer clicking the WhatsApp offer link.</div>
                      </div>
                    </button>

                    {/* Merchant Approval Required */}
                    <button
                      type="button"
                      onClick={() => setDirectRedemptionMode('merchant_approval')}
                      className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-start gap-3 cursor-pointer ${directRedemptionMode === 'merchant_approval'
                        ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                        : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50'
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${directRedemptionMode === 'merchant_approval' ? 'bg-[#D4A753] text-white' : 'bg-[#FAF8F5] text-[#9E9A93]'
                        }`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A1615]">🛡️ Merchant Approval Required</div>
                        <div className="text-[10px] text-[#6E6A66] leading-snug">Customer sends request via link; merchant accepts on POS terminal to complete redemption.</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Live WhatsApp Dispatch Preview */}
                <div className="bg-[#E7F8E9] border border-[#25D366]/30 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <MessageSquare className="w-5 h-5 text-[#25D366] shrink-0 mt-0.5" />
                    <div className="text-[11px] text-[#128C7E] leading-snug">
                      <span className="font-bold block">WhatsApp Message Dispatch Preview:</span>
                      "Hi {directCustomerName || 'Customer'}, here is your special offer for Bill #{directCustomerBillNo || 'INV-001'}: <span className="underline font-bold">https://revia.app/r/offer-{directCustomerBillNo || '001'}</span> ({directRedemptionMode === 'auto' ? 'Auto-Redeem' : 'Requires Merchant Acceptance'})"
                    </div>
                  </div>
                  <button type="button" onClick={() => showToast('Test WhatsApp Offer Link generated!')} className="px-3.5 py-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer">
                    <Send className="w-3.5 h-3.5" /> Send WhatsApp Link
                  </button>
                </div>
              </div>
            )}

            {/* Sub-config panel for Product Batch QR Offer */}
            {topLevelType === 'product_qr' && (
              <div className="mt-3 p-5 bg-[#FAF8F5] border border-[#EFECE6] rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#EFECE6] pb-3">
                  <div className="flex items-center gap-2">
                    <Package className="w-4.5 h-4.5 text-[#D4A753]" />
                    <span className="text-[13px] font-bold text-[#1A1615]">Physical Product Inventory &amp; Batch QR Generation</span>
                  </div>
                  <span className="px-2.5 py-0.5 bg-[#FDF8EB] text-[#9E782F] border border-[#F3E5C8] rounded-full text-[10px] font-bold uppercase tracking-wider">Product Asset Batch</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-[11px] font-bold text-[#6E6A66] block">Target Specific Product / Item</label>
                      <button type="button" onClick={() => setIsAddCatalogItemModalOpen(true)} className="text-[11px] font-bold text-[#D4A753] flex items-center gap-1 hover:underline cursor-pointer">
                        <Plus className="w-3 h-3" /> Add New Item
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setProductDropdownOpen(!productDropdownOpen); setShowNewItemInput(false); }}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753] flex items-center justify-between cursor-pointer hover:border-[#D4A753]/50 transition-colors text-left"
                    >
                      <span className={productQrName ? 'text-[#1A1615]' : 'text-[#9E9A93]'}>
                        {productQrName || 'Select a product...'}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-[#9E9A93] transition-transform ${productDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {productDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#EFECE6] rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                        <div className="max-h-[220px] overflow-y-auto py-1">
                          {catalogProducts.length === 0 ? (
                            <div className="px-3.5 py-4 text-center">
                              <p className="text-[11px] font-medium text-[#9E9A93]">No items available. Add one above.</p>
                            </div>
                          ) : (
                            catalogProducts.map((product) => (
                              <button
                                key={product}
                                type="button"
                                onClick={() => {
                                  setProductQrName(product);
                                  setProductDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3.5 py-2 text-[11px] font-semibold flex items-center justify-between gap-2 cursor-pointer transition-colors ${
                                  productQrName === product
                                    ? 'bg-[#FDF8EB] text-[#9E782F]'
                                    : 'text-[#3D3732] hover:bg-[#FAF8F5]'
                                }`}
                              >
                                <span className="truncate">{product}</span>
                                {productQrName === product && <Check className="w-3.5 h-3.5 text-[#D4A753] shrink-0" />}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-[#6E6A66] block mb-1.5">Total Batch Inventory (Piece Count)</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={productQrQuantity || ''}
                        onChange={e => setProductQrQuantity(Number(e.target.value))}
                        placeholder="100"
                        className="w-full px-3.5 py-2.5 bg-white border border-[#EFECE6] rounded-lg text-xs font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-[#9E782F]">PIECES / UNITS</span>
                    </div>
                  </div>
                </div>

                {/* Redemption Protocol Selector for Physical Product QR */}
                <div>
                  <label className="text-[11px] font-bold text-[#9E782F] uppercase tracking-wider block mb-2">Select Product QR Redemption Protocol</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Auto Redeem */}
                    <button
                      type="button"
                      onClick={() => setProductQrRedemptionMode('auto')}
                      className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-start gap-3 cursor-pointer ${productQrRedemptionMode === 'auto'
                        ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                        : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50'
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${productQrRedemptionMode === 'auto' ? 'bg-[#D4A753] text-white' : 'bg-[#FAF8F5] text-[#9E9A93]'
                        }`}>
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A1615]">⚡ Auto Redeem</div>
                        <div className="text-[10px] text-[#6E6A66] leading-snug">Customer scans physical product QR sticker; reward auto-redeems immediately.</div>
                      </div>
                    </button>

                    {/* Merchant Approval Required */}
                    <button
                      type="button"
                      onClick={() => setProductQrRedemptionMode('merchant_approval')}
                      className={`p-3.5 rounded-xl border-2 transition-all text-left flex items-start gap-3 cursor-pointer ${productQrRedemptionMode === 'merchant_approval'
                        ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                        : 'bg-white border-[#EFECE6] hover:border-[#D4A753]/50'
                        }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${productQrRedemptionMode === 'merchant_approval' ? 'bg-[#D4A753] text-white' : 'bg-[#FAF8F5] text-[#9E9A93]'
                        }`}>
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[13px] font-bold text-[#1A1615]">🛡️ Merchant Approval Required</div>
                        <div className="text-[10px] text-[#6E6A66] leading-snug">Customer scans QR sticker; merchant receives request on POS terminal &amp; accepts to validate redemption.</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Batch Printable Stickers Preview & Download */}
                <div className="bg-white border border-[#EFECE6] rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#FDF8EB] border border-[#F3E5C8] rounded-xl flex items-center justify-center text-[#9E782F] shrink-0">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-[12px] font-bold text-[#1A1615]">Batch #{productQrQuantity || 100} Unique QR Sticker Envelopes</div>
                      <div className="text-[10px] font-medium text-[#7C746C]">Pre-generated tokens for "{productQrName || 'Selected Product'}" ({productQrRedemptionMode === 'auto' ? 'Auto-Redeem' : 'Requires POS Merchant Acceptance'})</div>
                    </div>
                  </div>
                  <button type="button" onClick={() => showToast(`Generated batch of ${productQrQuantity || 100} QR Sticker PDF Sheet`)} className="px-3.5 py-2 bg-[#1A1615] hover:bg-black text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer">
                    <Printer className="w-3.5 h-3.5" /> Download {productQrQuantity || 100} Print-Ready Stickers
                  </button>
                </div>
              </div>
            )}

            {/* Level 2 – Customer Reward Triggers */}
            {topLevelType === 'new_customer' && (
              <div className="mt-2 ml-0 sm:ml-2 pl-3 border-l-2 border-[#D4A753]/40">
                <p className="text-[11px] font-bold text-[#9E782F] uppercase tracking-wider mb-2">Select Reward Trigger</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Welcome Bonus */}
                  <button
                    id="subtype-welcome"
                    type="button"
                    onClick={() => setExistingSubType('new_welcome')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'new_welcome'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'new_welcome' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'new_welcome' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <Gift className={`w-4 h-4 ${existingSubType === 'new_welcome' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'new_welcome' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>Welcome Bonus</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Instant reward upon account sign-up</div>
                  </button>

                  {/* First Visit */}
                  <button
                    id="subtype-first-visit"
                    type="button"
                    onClick={() => setExistingSubType('new_first_visit')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'new_first_visit'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'new_first_visit' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'new_first_visit' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <UserPlus className={`w-4 h-4 ${existingSubType === 'new_first_visit' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'new_first_visit' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>First Visit</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Reward upon initial guest check-in</div>
                  </button>

                  {/* First Purchase */}
                  <button
                    id="subtype-first-billing"
                    type="button"
                    onClick={() => setExistingSubType('new_first_billing')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'new_first_billing'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'new_first_billing' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'new_first_billing' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <DollarSign className={`w-4 h-4 ${existingSubType === 'new_first_billing' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'new_first_billing' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>First Purchase</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Reward on first checkout transaction</div>
                  </button>
                </div>
              </div>
            )}

            {topLevelType === 'existing_customer' && (
              <div className="mt-2 ml-0 sm:ml-2 pl-3 border-l-2 border-[#D4A753]/40">
                <p className="text-[11px] font-bold text-[#9E782F] uppercase tracking-wider mb-2">Select Reward Trigger</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {/* Visit Type */}
                  <button
                    id="subtype-visit"
                    type="button"
                    onClick={() => setExistingSubType('existing_visit')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'existing_visit'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'existing_visit' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'existing_visit' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <Activity className={`w-4 h-4 ${existingSubType === 'existing_visit' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'existing_visit' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>Visit Type</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Reward after N qualifying visits</div>
                  </button>

                  {/* Billing Type */}
                  <button
                    id="subtype-billing"
                    type="button"
                    onClick={() => setExistingSubType('existing_billing')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'existing_billing'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'existing_billing' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'existing_billing' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <DollarSign className={`w-4 h-4 ${existingSubType === 'existing_billing' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'existing_billing' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>Billing Type</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Reward based on cumulative spend</div>
                  </button>

                  {/* Stamp Type */}
                  <button
                    id="subtype-stamp"
                    type="button"
                    onClick={() => setExistingSubType('existing_stamp')}
                    className={`relative text-left p-3.5 rounded-xl border-2 transition-all cursor-pointer ${existingSubType === 'existing_stamp'
                      ? 'bg-[#FDF8EB] border-[#D4A753] shadow-sm'
                      : 'bg-[#FAF8F5] border-[#EFECE6] hover:border-[#D4A753]/50'
                      }`}
                  >
                    {existingSubType === 'existing_stamp' && (
                      <span className="absolute top-2 right-2 w-3.5 h-3.5 bg-[#D4A753] rounded-full flex items-center justify-center">
                        <Check className="w-2 h-2 text-white" />
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center mb-2 ${existingSubType === 'existing_stamp' ? 'bg-[#D4A753]/20' : 'bg-white border border-[#EFECE6]'
                      }`}>
                      <FileText className={`w-4 h-4 ${existingSubType === 'existing_stamp' ? 'text-[#9E782F]' : 'text-[#9E9A93]'}`} />
                    </div>
                    <div className={`text-[12px] font-bold mb-0.5 ${existingSubType === 'existing_stamp' ? 'text-[#9E782F]' : 'text-[#1A1615]'
                      }`}>Stamp Type</div>
                    <div className="text-[10px] text-[#6E6A66] leading-tight">Reward after N purchases of a specific item</div>
                  </button>
                </div>
              </div>
            )}

            {/* Resolved type pill */}
            {fullCampaignType && (
              <div className="mt-3 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7A53]" />
                <span className="text-[11px] font-bold text-[#0D7A53]">
                  Type resolved: <span className="capitalize">{getCampaignTypeLabel(fullCampaignType)}</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── DATE RANGE & STATUS ── */}
        <div className="space-y-4 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5">
          <div className="flex items-center justify-between mb-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">MANDATORY CAMPAIGN VALIDITY</label>
            {/* <span className="px-2 py-0.5 bg-[#FDF8EB] text-[#9E782F] border border-[#F3E5C8] rounded text-[10px] font-bold uppercase">Required</span> */}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              id="start-date-input"
              label="Start Date & Time"
              required={true}
              type="datetime-local"
              min={currentDateTime}
              value={startDate}
              onChange={e => {
                setStartDate(e.target.value);
                if (formErrors.startDate) setFormErrors(prev => ({...prev, startDate: ''}));
                // Auto-adjust end date if it is now before the start date
                if (endDate && e.target.value && new Date(endDate) < new Date(e.target.value)) {
                  setEndDate('');
                }
              }}
              error={formErrors.startDate}
              labelClassName="text-[11px] font-bold text-[#6E6A66]"
              wrapperClassName=""
            />
            <FormInput
              id="end-date-input"
              label="End Date & Time"
              required={true}
              type="datetime-local"
              min={startDate || currentDateTime}
              value={endDate}
              onChange={e => {
                setEndDate(e.target.value);
                if (formErrors.endDate) setFormErrors(prev => ({...prev, endDate: ''}));
              }}
              error={formErrors.endDate}
              labelClassName="text-[11px] font-bold text-[#6E6A66]"
              wrapperClassName=""
            />
          </div>

          {/* Status Toggle */}
          <div>
            <label className="text-[11px] font-bold text-[#6E6A66] block mb-2">Status</label>
            <div className="inline-flex items-center bg-white border border-[#EFECE6] rounded-full p-1 shadow-sm">
              <button
                id="status-draft"
                type="button"
                onClick={() => setStatusDraft(true)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${statusDraft
                  ? 'bg-[#1A1615] text-white shadow'
                  : 'text-[#6E6A66] hover:text-[#1A1615]'
                  }`}
              >
                Draft
              </button>
              <button
                id="status-active"
                type="button"
                onClick={() => setStatusDraft(false)}
                className={`px-5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${!statusDraft
                  ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white shadow'
                  : 'text-[#6E6A66] hover:text-[#1A1615]'
                  }`}
              >
                Active
              </button>
            </div>
            <p className="mt-1.5 text-[10px] text-[#9E9A93] font-medium">
              Campaign activates only when Status = Active AND current date is within range.
            </p>
          </div>

          <div className="bg-[#E0F9ED] border border-[#BCE3D1] p-3 rounded-lg flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0D7A53] shrink-0 mt-0.5" />
            <p className="text-[11px] font-medium text-[#0D7A53] leading-tight">
              Active = Status is Active <strong>AND</strong> current date &ge; Start Date <strong>AND</strong> current date &le; End Date.
            </p>
          </div>
        </div>

        {/* ── ACTIVE BRANCHES ── */}
        <div className={`bg-white border ${formErrors.activeBranches ? 'border-red-500 ring-1 ring-red-500/20' : 'border-[#EFECE6]'} rounded-xl p-4 shadow-sm lg:p-0 lg:border-none lg:shadow-none lg:bg-transparent`} id="active-branches-container">
          <div className="flex items-center justify-between mb-3">
            <label className="text-[11px] font-bold uppercase tracking-wider text-[#6E6A66]">
              Active Branches <span className="text-[#B7362F] ml-0.5">*</span>
            </label>
            <button
              type="button"
              onClick={() => {
                setActiveBranches([...allBranchOptions]);
                if (formErrors.activeBranches) setFormErrors(prev => ({...prev, activeBranches: ''}));
              }}
              className="text-[11px] font-bold text-[#D4A753] hover:underline cursor-pointer"
            >
              Select All
            </button>
          </div>
          {formErrors.activeBranches && <p className="text-red-500 text-xs font-semibold mb-3 mt-[-4px]">{formErrors.activeBranches}</p>}
          <div className="flex flex-wrap gap-2 mb-3">
            {allBranchOptions.map(branch => {
              const selected = activeBranches.includes(branch);
              return (
                <button
                  key={branch}
                  type="button"
                  id={`branch-${branch.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => toggleBranch(branch)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${selected
                    ? 'bg-[#E6F4ED] border-[#BCE3D1] text-[#0D7A53]'
                    : 'bg-[#FAF8F5] border-[#EFECE6] text-[#6E6A66] hover:border-[#D4A753]/50'
                    }`}
                >
                  {selected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  {branch}
                </button>
              );
            })}
          </div>
          <div className="text-[11px] text-[#6E6A66] flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-[#D4A753] shrink-0" />
            {activeBranches.length} branch{activeBranches.length !== 1 ? 'es' : ''} selected
          </div>
        </div>

        {/* ── SETTINGS: PRIORITY & CURRENCY ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {/* ── PRIORITY ── */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-4 shadow-sm lg:p-4 lg:border lg:border-[#EFECE6] lg:shadow-sm">
            <div className="hidden lg:block">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-2">Priority Level</label>
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center bg-[#FAF8F5] border border-[#EFECE6] rounded-lg h-[42px]">
                  <button onClick={() => setPriorityLevel(Math.max(1, priorityLevel - 1))} className="w-[42px] h-full flex items-center justify-center text-[#1A1615] font-medium hover:bg-[#EFECE6] transition-colors rounded-l-lg cursor-pointer text-lg">-</button>
                  <div className="px-4 h-full flex items-center justify-center text-sm font-bold text-[#1A1615] border-x border-[#EFECE6] min-w-[90px] whitespace-nowrap bg-white">
                    {priorityLevel} <span className="text-[#9E9A93] font-semibold text-[11px] ml-1">(P{priorityLevel})</span>
                  </div>
                  <button onClick={() => setPriorityLevel(priorityLevel + 1)} className="w-[42px] h-full flex items-center justify-center text-[#1A1615] font-medium hover:bg-[#EFECE6] transition-colors rounded-r-lg cursor-pointer text-lg">+</button>
                </div>
              </div>
              <p className="text-[11px] font-semibold text-[#6E6A66] leading-relaxed">
                Tier {priorityLevel} Override Active: Highest arbitration queue. Higher priority wins if a transaction qualifies for multiple active campaigns.
              </p>
            </div>
            {/* Mobile priority */}
            <div className="lg:hidden bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold text-[#1A1615] mb-1">Priority Queue Level</div>
                <div className="text-[10px] text-[#6E6A66] max-w-[120px]">Defines precedence over competing discounts</div>
              </div>
              <div className="flex items-center bg-white border border-[#EFECE6] rounded-full px-2 py-1 shadow-sm">
                <button onClick={() => setPriorityLevel(Math.max(1, priorityLevel - 1))} className="w-6 h-6 flex items-center justify-center text-[#9E9A93] bg-[#FAF8F5] rounded-full cursor-pointer hover:bg-[#EFECE6]">-</button>
                <div className="px-3 text-center">
                  <div className="text-sm font-bold text-[#D4A753]">{priorityLevel}</div>
                  <div className="text-[10px] font-bold text-[#1A1615]">(P{priorityLevel})</div>
                </div>
                <button onClick={() => setPriorityLevel(priorityLevel + 1)} className="w-6 h-6 flex items-center justify-center text-[#1A1615] bg-[#FAF8F5] rounded-full cursor-pointer hover:bg-[#EFECE6]">+</button>
              </div>
            </div>
          </div>

          {/* ── CURRENCY ── */}
          <div className="bg-white border border-[#EFECE6] rounded-xl p-4 shadow-sm lg:p-4 lg:border lg:border-[#EFECE6] lg:shadow-sm">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-2">Currency</label>
            <div ref={currencyDropdownRef} className="relative mb-1">
              <button
                type="button"
                onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
                className="w-full flex items-center justify-between bg-[#FAF8F5] border border-[#EFECE6] px-3 py-2.5 rounded-lg text-[13px] font-bold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{currency}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${currencyDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {currencyDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EFECE6] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                  {['INR (₹)', 'INR ($)', 'EUR (€)', 'GBP (£)'].map((curr) => (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => { setCurrency(curr); setCurrencyDropdownOpen(false); }}
                      className={`w-full cursor-pointer px-3 py-1.5 text-left text-[13px] hover:bg-[#F5F1EA] ${currency === curr ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[11px] font-semibold text-[#6E6A66] leading-relaxed">
              Read from merchant/system configuration. Base currency for all campaign targets and calculations.
            </p>
          </div>
        </div>

        {/* Mobile featured cohort banner */}
        <div className="lg:hidden mt-2 bg-[#1A1615] rounded-xl shadow-xl text-white relative overflow-hidden h-32">
          <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=80" alt="Coffee" className="absolute inset-0 w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#D4A753] mb-1">{topLevelType ? getCampaignTypeLabel(topLevelType).toUpperCase() : 'NEW CAMPAIGN'}</div>
              <h4 className="text-sm font-bold text-white">{campaignName || 'Untitled Campaign'}</h4>
            </div>
            <span className="px-2 py-0.5 bg-black/50 text-[#D4A753] border border-[#D4A753]/30 rounded text-[9px] font-bold tracking-widest uppercase backdrop-blur-sm">EXCLUSIVE</span>
          </div>
        </div>
      </div>

      {/* ── RIGHT COLUMN – Live Preview ── */}
      <div className="hidden lg:block lg:col-span-5 space-y-4">
        <div className="bg-[#1A1615] rounded-2xl p-6 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Zap className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <span className="text-[10px] font-bold tracking-widest uppercase text-white/60">REVIA ARTISAN PASS</span>
              <span className="px-2 py-0.5 bg-[#D4A753]/20 text-[#D4A753] border border-[#D4A753]/30 rounded text-[9px] font-bold tracking-widest uppercase">
                {topLevelType ? getCampaignTypeLabel(topLevelType).toUpperCase() : 'NEW CAMPAIGN'}
              </span>
            </div>
            <div className="h-32 bg-neutral-800 rounded-xl mb-4 overflow-hidden border border-neutral-700">
              <img src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&auto=format&fit=crop&q=80" alt="Coffee Flight" className="w-full h-full object-cover opacity-80" />
            </div>
            <h4 className="text-lg font-bold mb-2">{campaignName || 'Untitled Campaign'}</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D7A53]" /> {activeBranches.length} Branch{activeBranches.length !== 1 ? 'es' : ''} Selected
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <Calendar className="w-3.5 h-3.5 text-[#D4A753]" />
                {startDate && endDate ? `${startDate.replace('T', ' ')} – ${endDate.replace('T', ' ')}` : 'No dates set'}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-white/70">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A753]" />
                Status: {statusDraft ? 'Draft' : 'Active'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#EFECE6] rounded-xl p-5 shadow-sm space-y-4">
          <h4 className="text-[11px] uppercase font-bold tracking-wider text-[#1A1615]">Summary Specs</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6E6A66]">Campaign Type</span>
              <span className="text-[#1A1615]">{getCampaignTypeLabel(fullCampaignType)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6E6A66]">Branch Eligibility</span>
              <span className="text-[#1A1615]">{activeBranches.length} Outlet{activeBranches.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6E6A66]">Conflict Resolution</span>
              <span className="text-[#1A1615]">Level {priorityLevel} (P{priorityLevel})</span>
            </div>
          </div>
        </div>
      </div>
    </div>
 ) };


  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-[#EFECE6] rounded-[16px] p-6 lg:p-8 shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-[24px] font-bold text-[#1A1615] tracking-tight">Who is this campaign for?</h2>
            <span className="px-2.5 py-1 text-[10px] font-bold bg-[#FDF8EB] text-[#9E782F] rounded uppercase tracking-wider">STEP 2/5</span>
          </div>
          <p className="text-sm text-[#6E6A66] font-medium leading-relaxed max-w-lg">
            Narrow campaign eligibility by tier status, patron lifecycle stage, demographic filters, and guest satisfaction ratings.
          </p>
        </div>

        <div className="space-y-3" id="selected-tiers-container">
          <div>
            <div className={`flex items-center gap-2 text-sm font-bold mb-1 ${formErrors.selectedTiers ? 'text-[#B7362F]' : 'text-[#1A1615]'}`}>
              <Trophy className="w-4 h-4 text-[#D4A753]" /> Tier &amp; Membership <span className="text-[#B7362F] ml-0.5">*</span>
            </div>
            <p className="text-[13px] text-[#6E6A66]">Select eligible member tiers that can unlock this campaign perk.</p>
          </div>
          {formErrors.selectedTiers && <p className="text-red-500 text-xs font-semibold mb-1 mt-[-4px]">{formErrors.selectedTiers}</p>}
          <div className={`flex flex-wrap gap-2.5 ${formErrors.selectedTiers ? 'p-3 border border-red-500 ring-1 ring-red-500/20 rounded-xl' : ''}`}>
            {(tierOptions.length > 0 ? tierOptions : TIER_OPTIONS_FALLBACK).filter((t: any) => t.isActive !== false).map(tier => {
              const labelLower = tier.label.toLowerCase();
              const isGold = labelLower.includes('gold');
              const isSilver = labelLower.includes('silver') || labelLower.includes('bronze');
              
              let baseClass = 'bg-white border border-[#EFECE6] text-[#6E6A66] hover:bg-[#FAF8F5]';
              let activeClass = 'bg-[#1A1615] text-white';
              
              if (isGold) activeClass = 'bg-[#FDF8EB] border border-[#F3E5C8] text-[#9E782F]';
              else if (isSilver) activeClass = 'bg-[#F0F2F5] border border-[#E2E8F0] text-[#475569]';

              const isSelected = selectedTiers.includes(tier.value);

              return (
                <button 
                  key={tier.value} 
                  onClick={() => toggleTier(tier.value)} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold shadow-sm transition-colors cursor-pointer ${isSelected ? activeClass : baseClass}`}
                >
                  {isSelected ? (
                    isGold ? <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A753]" /> :
                    isSilver ? <CheckCircle2 className="w-3.5 h-3.5 text-[#64748B]" /> :
                    <span className="w-2.5 h-2.5 rounded-full bg-[#D4A753]"></span>
                  ) : (
                    <span className="w-2.5 h-2.5 rounded-full border-2 border-[#D1CDC7]"></span>
                  )}
                  {tier.label}
                </button>
              );
            })}
            <button onClick={() => toggleTier('All Tiers')} className={`flex items-center px-4 py-2 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${selectedTiers.includes('All Tiers') ? 'bg-[#EFECE6] text-[#1A1615]' : 'bg-[#FAF8F5] border border-[#EFECE6] text-[#6E6A66] hover:bg-[#EFECE6]'}`}>
              All Customers
            </button>
          </div>

          {selectedTiers.some(t => ['VIP', 'VVIP', 'Gold', 'Silver', 'Bronze'].includes(t)) && (
            <div className="mt-4 p-4 border border-[#EFECE6] bg-white rounded-xl shadow-sm space-y-4">
              <h5 className="text-[12px] font-bold text-[#1A1615] uppercase tracking-wider">Customer Type Conditions</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#6E6A66] block mb-1">Minimum Billing Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6E6A66] font-bold">₹</span>
                    <input type="number" value={minBillAmount} onChange={e => setMinBillAmount(Number(e.target.value))} className="w-full pl-7 pr-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm focus:outline-none focus:border-[#D4A753]" />
                  </div>
                </div>
                <div ref={conditionStatusDropdownRef} className="relative">
                  <label className="text-[11px] font-bold text-[#6E6A66] block mb-1">Status</label>
                  <button
                    type="button"
                    onClick={() => setConditionStatusDropdownOpen(!conditionStatusDropdownOpen)}
                    className="w-full flex items-center justify-between bg-white border border-[#EFECE6] px-3 py-2 rounded-lg text-sm font-medium text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
                  >
                    <span className="truncate">{conditionStatus}</span>
                    <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${conditionStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {conditionStatusDropdownOpen && (
                    <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EFECE6] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                      {['Active', 'Inactive'].map((status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() => { setConditionStatus(status); setConditionStatusDropdownOpen(false); }}
                          className={`w-full cursor-pointer px-3 py-1.5 text-left text-sm hover:bg-[#F5F1EA] ${conditionStatus === status ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-medium text-[#6E6A66]'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6E6A66] block mb-1">
                    Start Date <span className="text-[#B7362F] ml-0.5">*</span>
                  </label>
                  <input type="date" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm focus:outline-none focus:border-[#D4A753]" />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#6E6A66] block mb-1">Expiry Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-white border border-[#EFECE6] rounded-lg text-sm focus:outline-none focus:border-[#D4A753]" />
                </div>
              </div>
            </div>
          )}
          <button onClick={() => setShowCustomSegmentModal(true)} className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF8F5] text-[#9E782F] border border-[#EFECE6] rounded-full text-[12px] font-bold hover:bg-[#FDF8EB] transition-colors mt-1 cursor-pointer">
            <Plus className="w-3 h-3" /> Add Custom Segment
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1615] mb-1">
              <RefreshCw className="w-4 h-4 text-[#D4A753]" /> Customer Lifecycle Type
            </div>
            <p className="text-[13px] text-[#6E6A66]">Target new first-time salon guests or re-engage loyal recurring patrons.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-0 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-1.5">
            <button onClick={() => setLifecycleType('New')} className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${lifecycleType === 'New' ? 'text-white bg-gradient-to-b from-[#C59B46] to-[#9E782F] shadow-sm border border-[#9E782F]' : 'text-[#6E6A66] hover:bg-[#EFECE6] cursor-pointer'}`}>
              New Patrons {lifecycleType === 'New' && <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => setLifecycleType('Returning')} className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${lifecycleType === 'Returning' ? 'text-white bg-gradient-to-b from-[#C59B46] to-[#9E782F] shadow-sm border border-[#9E782F]' : 'text-[#6E6A66] hover:bg-[#EFECE6] cursor-pointer'}`}>
              Returning Patrons {lifecycleType === 'Returning' && <Check className="w-4 h-4" />}
            </button>
            <button onClick={() => setLifecycleType('Both')} className={`flex-1 py-2.5 text-[13px] font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${lifecycleType === 'Both' ? 'text-white bg-gradient-to-b from-[#C59B46] to-[#9E782F] shadow-sm border border-[#9E782F]' : 'text-[#6E6A66] hover:bg-[#EFECE6] cursor-pointer'}`}>
              Both (Active Cohort) {lifecycleType === 'Both' && <Check className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-[#1A1615] mb-1">
              <Gift className="w-4 h-4 text-[#D4A753]" /> Birthday &amp; Celebration Window
            </div>
            <p className="text-[13px] text-[#6E6A66]">Trigger perk availability around patron birthdays or anniversary milestones.</p>
          </div>

          <div className="bg-[#FDF8EB] border border-[#F3E5C8] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-[#EFECE6]">
                <Calendar className="w-5 h-5 text-[#D4A753]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#1A1615] mb-0.5">Active Birthday Horizon</div>
                <div className="text-[12px] font-semibold text-[#6E6A66]">Patron birth date falls within range</div>
              </div>
            </div>
            <div className="flex items-center bg-white border border-[#EFECE6] rounded-lg shadow-sm">
              <button onClick={() => setBirthdayHorizon(Math.max(1, birthdayHorizon - 1))} className="px-3.5 py-2 text-[#1A1615] hover:bg-[#FAF8F5] transition-colors rounded-l-lg border-r border-[#EFECE6] font-bold text-lg leading-none cursor-pointer">-</button>
              <div className="px-4 py-2 text-[14px] font-bold text-[#1A1615]">{birthdayHorizon} <span className="font-semibold text-[13px]">days</span></div>
              <button onClick={() => setBirthdayHorizon(birthdayHorizon + 1)} className="px-3.5 py-2 text-[#1A1615] hover:bg-[#FAF8F5] transition-colors rounded-r-lg border-l border-[#EFECE6] font-bold text-lg leading-none cursor-pointer">+</button>
            </div>
          </div>
          <div className="flex items-start gap-2 text-[12px] font-medium text-[#6E6A66]">
            <Smartphone className="w-4 h-4 text-[#0D7A53] shrink-0 mt-0.5" /> Automatically syncs with guest Apple Wallet &amp; Passbook notifications 48h prior to celebration.
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#1A1615] mb-1">
                  <Users className="w-4 h-4 text-[#D4A753]" /> Age Range
                </div>
                <p className="text-[13px] text-[#6E6A66]">Restrict campaign visibility by registered patron age bracket.</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-bold bg-[#FAF8F5] text-[#6E6A66] rounded uppercase tracking-wider">OPTIONAL DEMOGRAPHIC</span>
            </div>

            <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 bg-white border border-[#EFECE6] rounded-lg p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9E9A93] mb-1">MIN AGE</div>
                    <div className="text-[20px] font-bold text-[#1A1615]">{minAge} <span className="text-xs font-semibold text-[#6E6A66]">yrs</span></div>
                  </div>
                  <div className="text-[#6E6A66]"><SlidersHorizontal className="w-5 h-5 opacity-50" /></div>
                </div>
                <div className="flex-1 bg-white border border-[#EFECE6] rounded-lg p-3 shadow-sm flex items-center justify-between">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#9E9A93] mb-1">MAX AGE</div>
                    <div className="text-[20px] font-bold text-[#1A1615]">{maxAge} <span className="text-xs font-semibold text-[#6E6A66]">yrs</span></div>
                  </div>
                  <div className="text-[#6E6A66]"><SlidersHorizontal className="w-5 h-5 opacity-50" /></div>
                </div>
              </div>

              <div className="px-2">
                <div className="h-1.5 bg-[#EFECE6] rounded-full relative mb-3">
                  <div
                    className="absolute h-full bg-[#D4A753] rounded-full"
                    style={{ left: `${((minAge - 18) / (80 - 18)) * 100}%`, right: `${100 - ((maxAge - 18) / (80 - 18)) * 100}%` }}
                  ></div>

                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={minAge}
                    onChange={(e) => setMinAge(Math.min(maxAge - 1, Number(e.target.value)))}
                    className="absolute w-full top-1/2 -translate-y-1/2 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto z-20"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#D4A753] rounded-full shadow-sm pointer-events-none z-10"
                    style={{ left: `${((minAge - 18) / (80 - 18)) * 100}%` }}
                  ></div>

                  <input
                    type="range"
                    min="18"
                    max="80"
                    value={maxAge}
                    onChange={(e) => setMaxAge(Math.max(minAge + 1, Number(e.target.value)))}
                    className="absolute w-full top-1/2 -translate-y-1/2 opacity-0 cursor-pointer pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-moz-range-thumb]:pointer-events-auto z-30"
                  />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#D4A753] rounded-full shadow-sm pointer-events-none z-10"
                    style={{ left: `${((maxAge - 18) / (80 - 18)) * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[11px] font-bold text-[#6E6A66]">
                  <span>18 yrs</span>
                  <span className="text-[#D4A753]">Active Segment: {minAge}–{maxAge}</span>
                  <span>80+ yrs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center gap-2 text-sm font-bold text-[#1A1615] mb-1">
                <Star className="w-4 h-4 text-[#D4A753]" /> Feedback &amp; Satisfaction Rating
              </div>
              <p className="text-[13px] text-[#6E6A66]">Filter by historical tasting room ratings and post-visit CSAT scores.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-2 pl-4 shadow-sm">
              <div className="flex-1 w-full relative">
                <select className="w-full appearance-none bg-transparent text-[13px] font-bold text-[#1A1615] py-2.5 focus:outline-none cursor-pointer">
                  <option>Average guest rating ≥</option>
                </select>
                <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93] pointer-events-none" />
              </div>
              <div className="flex items-center gap-3 pr-3 bg-white border border-[#EFECE6] rounded-lg px-4 py-2 shadow-sm">
                <div className="flex items-center gap-1.5 text-[#1A1615] font-bold text-sm">
                  <Star className="w-4 h-4 fill-[#D4A753] text-[#D4A753]" /> 4.5 <span className="text-[#9E9A93] text-[11px]">/ 5.0</span>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E0F9ED] text-[#0D7A53] rounded uppercase tracking-widest border border-[#BCE3D1]">PRIME CSAT</span>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-[#FAF8F5] p-3 rounded-lg text-[12px] font-medium text-[#6E6A66]">
              <span className="w-4 h-4 rounded-full border border-[#D1CDC7] flex items-center justify-center text-[9px] font-bold shrink-0 text-[#9E9A93]">i</span>
              Only includes members with at least 2 verified visits to avoid sample bias.
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-5 space-y-4">
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[15px] font-bold text-[#1A1615] flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D7A53]"></span> Audience Impact
            </h3>
            <span className="px-3 py-1 text-[10px] font-bold bg-[#E0F9ED] text-[#0D7A53] rounded-full uppercase tracking-widest">LIVE SIMULATION</span>
          </div>

          <div className={`bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5 mb-6 transition-opacity ${isSimulating ? 'opacity-50' : 'opacity-100'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="text-[36px] leading-none font-bold text-[#1A1615] tracking-tight">
                {simulationData?.eligible_patrons?.toLocaleString() || 0}
              </div>
              <span className="px-2.5 py-1 text-[11px] font-bold bg-[#E0F9ED] text-[#0D7A53] rounded-full">
                {simulationData?.reach_percentage || 0}% Reach
              </span>
            </div>
            <p className="text-[12px] text-[#6E6A66] font-medium mb-4">
              Eligible patrons out of <span className="font-bold text-[#1A1615]">{simulationData?.total_enrolled_members?.toLocaleString() || 0}</span> total enrolled members
            </p>
            <div className="h-2.5 bg-[#EFECE6] rounded-full overflow-hidden flex">
              <div className="h-full bg-[#D4A753] rounded-full" style={{ width: `${simulationData?.reach_percentage || 0}%` }}></div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-3">ACTIVE TIER COMPOSITION</h4>
            <div className={`space-y-4 transition-opacity ${isSimulating ? 'opacity-50' : 'opacity-100'}`}>
              {(simulationData?.tier_composition || []).map((tier: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-[13px] font-bold">
                  <span className="flex items-center gap-2.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${index === 0 ? 'bg-[#1A1615]' : 'bg-[#D4A753]'}`}></span> {tier.tier_name}
                  </span>
                  <div>
                    <span className="text-[#1A1615] mr-2">{tier.count?.toLocaleString() || 0}</span> 
                    <span className="text-[#9E9A93] text-[11px] font-semibold">({tier.percentage || 0}%)</span>
                  </div>
                </div>
              ))}
              {(!simulationData?.tier_composition || simulationData.tier_composition.length === 0) && (
                <div className="text-[12px] text-[#9E9A93] italic">No tiers qualify</div>
              )}
              <div className="flex items-center justify-between text-[13px] font-bold">
                <span className="flex items-center gap-2.5"><span className="w-2.5 h-2.5 rounded-full bg-[#D1CDC7]"></span> Silver Tier</span>
                <span className="text-[#F87171] text-[11px] font-bold uppercase tracking-wider">EXCLUDED</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-3">PROJECTED CAMPAIGN FORECAST</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-xl">
                <div>
                  <div className="text-[11px] font-medium text-[#6E6A66] mb-0.5">Expected Redemptions</div>
                  <div className="text-[15px] font-bold text-[#1A1615]">-</div>
                </div>
                <span className="px-2.5 py-1 bg-[#E0F9ED] text-[#0D7A53] rounded-full text-[11px] font-bold">-</span>
              </div>

              <div className="flex justify-between items-center bg-[#FAF8F5] border border-[#EFECE6] p-4 rounded-xl">
                <div>
                  <div className="text-[11px] font-medium text-[#6E6A66] mb-0.5">Projected Gross GMV</div>
                  <div className="text-[15px] font-bold text-[#0D7A53]">-</div>
                </div>
                <span className="px-2.5 py-1 bg-[#FDF8EB] text-[#9E782F] rounded-full text-[11px] font-bold uppercase border border-[#F3E5C8]">Pending</span>
              </div>

              <div className="flex justify-between items-center bg-white border border-[#EFECE6] p-4 rounded-xl">
                <div>
                  <div className="text-[11px] font-medium text-[#6E6A66] mb-0.5">Estimated Incentive Cost</div>
                  <div className="text-[15px] font-bold text-[#1A1615]">-</div>
                </div>
                <span className="text-[12px] font-medium text-[#6E6A66]">Within Budget</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-3">SAMPLE QUALIFYING PATRON</h4>
            <div className="flex items-center gap-3 bg-white border border-[#EFECE6] p-4 rounded-xl shadow-sm">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" alt="Julian Vane" className="w-11 h-11 rounded-full object-cover border border-[#EFECE6]" />
              <div>
                <div className="text-[14px] font-bold text-[#1A1615] flex items-center gap-2">
                  Julian Vane <span className="px-1.5 py-0.5 bg-[#1A1615] text-[#D4A753] text-[9px] rounded uppercase tracking-wider font-bold">VIP</span>
                </div>
                <div className="text-[12px] font-medium text-[#6E6A66] mt-0.5">14 Salon Visits • Rating 5.0 ★ • Birthday in 4d</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#FAF8F5] rounded-xl p-4 flex items-start gap-3 border border-[#EFECE6]">
          <div className="shrink-0 mt-0.5">
            <Lightbulb className="w-5 h-5 text-[#D4A753]" />
          </div>
          <p className="text-[12px] font-medium text-[#6E6A66] leading-relaxed">
            Narrowing audience by 4.5★ rating preserves brand exclusivity and significantly reduces drop-off rates on high-margin reservations.
          </p>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <CampaignRulesStep
      campaignType={fullCampaignType}
      campaignName={campaignName}
      currency={currency}
      initialRules={ruleConfig?.rules}
      initialStartDate={startDate}
      initialEndDate={endDate}
      initialTriggerEvent={ruleConfig?.triggerEvent}
      initialActiveBranches={ruleConfig?.activeBranches}
      initialMatchType={ruleConfig?.matchType}
      onChange={(config) => setRuleConfig(config)}
      onContinue={(config) => {
        setRuleConfig(config);
        console.log('Step 3 Config:', config);
        setCurrentStep(4);
      }}
      onBack={() => setCurrentStep(2)}
    />
  );

  const renderStep4 = () => (
    <CampaignRewardStep
      campaignType={fullCampaignType}
      ruleConfig={ruleConfig}
      currency={currency}
      initialRewardConfig={rewardConfig}
      onChange={(config) => setRewardConfig(config)}
      onContinue={(config) => {
        setRewardConfig(config);
        console.log('Step 4 Config:', config);
        setCurrentStep(5);
      }}
      onBack={() => setCurrentStep(3)}
    />
  );

  const renderStep5 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-8 space-y-6">

        {/* Auto-validation Alert */}
        <div className="bg-white border-l-4 border-l-[#0D7A53] border-y border-r border-[#EFECE6] rounded-xl p-5 shadow-sm flex flex-col xl:flex-row xl:items-start justify-between gap-4 relative overflow-hidden">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="w-8 h-8 rounded-full bg-[#E0F9ED] flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-5 h-5 text-[#0D7A53]" />
            </div>
            <div>
              <h4 className="text-[13px] font-bold text-[#1A1615] mb-1">Auto-validation passed — zero logic or budget conflicts detected across 3 active branch registers.</h4>
              <p className="text-[11px] font-medium text-[#6E6A66]">All cryptographic token envelopes are pre-compiled and ready for instantaneous sync.</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 items-start xl:items-end shrink-0 pl-11 xl:pl-0">
            <span className="px-2.5 py-1 bg-[#E0F9ED] border border-[#BCE3D1] text-[#0D7A53] rounded text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> POS MESH READY</span>
            <div className="flex flex-wrap gap-2">
              <span className="px-2 py-1 bg-[#FAF8F5] border border-[#EFECE6] text-[#6E6A66] rounded text-[9px] font-bold uppercase tracking-widest">NO BUDGET CONFLICT</span>
              <span className="px-2 py-1 bg-[#FAF8F5] border border-[#EFECE6] text-[#6E6A66] rounded text-[9px] font-bold uppercase tracking-widest">SECURITY POLICY VERIFIED</span>
            </div>
          </div>
        </div>

        {/* 01 Basics Summary */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 lg:p-8 shadow-sm relative">
          <div className="flex items-start justify-between mb-6 border-b border-[#EFECE6] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] text-[#9E782F] flex items-center justify-center text-[12px] font-bold border border-[#F3E5C8]">01</div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-0.5">BASICS CONFIGURATION</div>
                <h3 className="text-[18px] font-bold text-[#1A1615]">Step 1: Basics Summary</h3>
              </div>
            </div>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FAF8F5] cursor-pointer  border border-[#EFECE6] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors" onClick={() => setCurrentStep(1)}>
              Edit Step 1 <ArrowRight className="w-3 h-3 -rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-6">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] mb-1">CAMPAIGN NAME</div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-[#1A1615]">{campaignName || 'Unnamed Campaign'}</span>
                <span className="px-2 py-0.5 bg-[#FAF8F5] border border-[#EFECE6] text-[#9E9A93] rounded text-[9px] font-bold tracking-widest uppercase">#CMP-{Math.floor(1000 + Math.random() * 9000)}</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] mb-1">CAMPAIGN TYPE</div>
              <span className="px-2.5 py-1 bg-gradient-to-r from-[#FDF8EB] to-[#FAF8F5] border border-[#F3E5C8] text-[#9E782F] rounded-full text-[11px] font-bold flex items-center gap-1.5 inline-flex shadow-sm">
                <Trophy className="w-3.5 h-3.5 text-[#D4A753]" /> {getCampaignTypeLabel(fullCampaignType)}
              </span>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] mb-2">ACTIVE BRANCHES</div>
              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 bg-[#FAF8F5] border border-[#EFECE6] text-[#6E6A66] rounded-md text-[11px] font-semibold">
                  {rewardConfig?.applicableBranches === 'all' ? 'All Outlets & Branches' : branches.find(b => String(b.id) === rewardConfig?.applicableBranches)?.name || rewardConfig?.applicableBranches || 'All Outlets'}
                </span>
              </div>
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93] mb-1">RUNTIME HORIZON</div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#D4A753]" />
                <span className="text-[13px] font-bold text-[#1A1615]">{rewardConfig?.startDate || 'TBD'} – {rewardConfig?.endDate || 'TBD'}</span>
                <span className="text-[11px] font-medium text-[#9E9A93]"></span>
              </div>
            </div>
          </div>


        </div>

        {/* 02 Audience Summary */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 lg:p-8 shadow-sm relative">
          <div className="flex items-start justify-between mb-6 border-b border-[#EFECE6] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] text-[#9E782F] flex items-center justify-center text-[12px] font-bold border border-[#F3E5C8]">02</div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-0.5">PATRON COHORTS</div>
                <h3 className="text-[18px] font-bold text-[#1A1615]">Step 2: Audience Summary</h3>
              </div>
            </div>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors" onClick={() => setCurrentStep(2)}>
              Edit Step 2 <ArrowRight className="w-3 h-3 -rotate-45" />
            </button>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5 mb-5 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#D4A753]"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#9E9A93]">DYNAMIC COHORT LOGIC FILTER</span>
            </div>
            <p className="text-[14px] font-medium text-[#1A1615] leading-relaxed">
              "Targets <span className="text-[#D4A753] font-bold">{selectedTiers.length > 0 ? selectedTiers.join(' & ') : 'All Customers'}</span> patrons."
            </p>
          </div>


        </div>

        {/* 03 Conditions & Rules Summary */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 lg:p-8 shadow-sm relative">
          <div className="flex items-start justify-between mb-6 border-b border-[#EFECE6] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] text-[#9E782F] flex items-center justify-center text-[12px] font-bold border border-[#F3E5C8]">03</div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-0.5">RULE LOGIC TREE</div>
                <h3 className="text-[18px] font-bold text-[#1A1615]">Step 3: Conditions &amp; Rules Summary</h3>
              </div>
            </div>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors" onClick={() => setCurrentStep(3)}>
              Edit Step 3 <ArrowRight className="w-3 h-3 -rotate-45" />
            </button>
          </div>

          <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-2.5 py-1 bg-[#1A1615] text-white rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">MATCH {ruleConfig?.matchType || 'ALL'} ({ruleConfig?.matchType === 'ANY' ? 'OR' : 'AND'})</span>
              <span className="text-[11px] font-medium text-[#6E6A66]">Parent root evaluation container</span>
            </div>

            <div className="space-y-4 md:space-y-2 pl-4 border-l-2 border-[#EFECE6]">
              {ruleConfig?.rules && ruleConfig.rules.length > 0 ? ruleConfig.rules.map((rule: any, i: number) => {
                if (rule.type === 'condition') {
                  return (
                    <div key={rule.id} className="bg-white border border-[#EFECE6] rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-sm relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-4 before:h-[2px] before:bg-[#EFECE6]">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-mono font-bold text-[#1A1615]">
                        <span className="text-[#D4A753] break-all">{rule.field}</span> <span className="text-[#6E6A66]">{rule.operator}</span> <span>{rule.value}</span>
                      </div>
                      <div className="self-start md:self-auto">
                        <span className="px-2 py-0.5 bg-[#E0F9ED] text-[#0D7A53] rounded text-[9px] font-bold uppercase tracking-widest">VALIDATED</span>
                      </div>
                    </div>
                  );
                } else if (rule.type === 'group') {
                  return (
                    <div key={rule.id} className="bg-white border border-[#EFECE6] rounded-lg p-3 shadow-sm relative before:content-[''] before:absolute before:-left-4 before:top-1/2 before:w-4 before:h-[2px] before:bg-[#EFECE6]">
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2 mb-2">
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#1A1615]">SUB-GROUP ({rule.matchType})</span>
                        <span className="text-[10px] font-medium text-[#9E9A93] italic">Group evaluation</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] font-mono font-bold text-[#1A1615] pl-2 border-l-2 border-[#D4A753]">
                        {rule.rules.map((subRule: any, j: number) => (
                          <React.Fragment key={subRule.id}>
                            <span className="text-[#D4A753] break-all">{subRule.field}</span> <span className="text-[#6E6A66]">{subRule.operator}</span> <span>{subRule.value}</span>
                            {j < rule.rules.length - 1 && <span className="text-[#6E6A66] px-1 md:px-3">{rule.matchType === 'ANY' ? '||' : '&&'}</span>}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }) : (
                <div className="text-[12px] text-[#6E6A66] italic">No rules defined.</div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-[#1A1615] bg-[#FDF8EB] border border-[#F3E5C8] p-3 rounded-xl shadow-sm">
            <div className="w-8 h-8 rounded-md bg-white border border-[#EFECE6] flex items-center justify-center shrink-0">
              <Store className="w-4 h-4 text-[#D4A753]" />
            </div>
            <p className="text-[11px] font-medium">Trigger Event: Dynamic QR / NFC scan at POS counter stand with immediate terminal authorization.</p>
          </div>
        </div>

        {/* 04 Reward Definition Summary */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 lg:p-8 shadow-sm relative">
          <div className="flex items-start justify-between mb-6 border-b border-[#EFECE6] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FDF8EB] text-[#9E782F] flex items-center justify-center text-[12px] font-bold border border-[#F3E5C8]">04</div>
              <div>
                <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] mb-0.5">INCENTIVE SETTLEMENT</div>
                <h3 className="text-[18px] font-bold text-[#1A1615]">Step 4: Reward Definition Summary</h3>
              </div>
            </div>
            <button className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors" onClick={() => setCurrentStep(4)}>
              Edit Step 4 <ArrowRight className="w-3 h-3 -rotate-45" />
            </button>
          </div>

          <div className="bg-white border border-[#EFECE6] rounded-xl p-5 flex items-center justify-between mb-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#FDF8EB] border border-[#F3E5C8] rounded-xl flex items-center justify-center shrink-0">
                <Gift className="w-6 h-6 text-[#D4A753]" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-bold text-[#1A1615] uppercase tracking-widest">{rewardConfig?.rewardType ? rewardConfig.rewardType.replace('_', ' ') : 'FREE ITEM'}</span>
                  <span className="px-2 py-0.5 bg-[#E0F9ED] text-[#0D7A53] rounded text-[9px] font-bold tracking-widest uppercase border border-[#BCE3D1]">REWARD ENABLED</span>
                </div>
                <h4 className="text-[14px] font-bold text-[#1A1615]">{rewardConfig?.freeItem || 'Reward Configuration Pending'}</h4>
                <p className="text-[11px] font-medium text-[#6E6A66] mt-0.5">Calculated automatically during POS settlement.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#9E782F]">
                <Activity className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">VELOCITY GUARDRAILS</span>
              </div>
              <ul className="space-y-2 text-[11px] font-medium text-[#1A1615]">
                <li className="flex items-start gap-2 before:content-['•'] before:text-[#9E9A93]">Strictly limited to {rewardConfig?.maxRedemptions || 1} time redemption per loyalty profile.</li>
                <li className="flex items-start gap-2 before:content-['•'] before:text-[#9E9A93]">Campaign hard velocity cap: <span className="font-bold">{rewardConfig?.totalBudgetCap || 500} claims maximum</span>.</li>
              </ul>
            </div>

            <div className="bg-[#FAF8F5] border border-[#EFECE6] rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#9E782F]">
                <BellRing className="w-4 h-4" />
                <span className="text-[10px] font-bold tracking-widest uppercase">EXPIRATION &amp; PUSH TRIGGERS</span>
              </div>
              <ul className="space-y-2 text-[11px] font-medium text-[#1A1615]">
                <li className="flex items-start gap-2 before:content-['•'] before:text-[#9E9A93]">Valid for {rewardConfig?.expiryType === 'Days' ? rewardConfig.expiryDays + ' days' : rewardConfig?.expiryDate || '14 days'} upon receiving trigger token.</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        {/* Right Sidebar 1 Removed (was mock Executive Projections) */}

        {/* Right Sidebar 2: Patron Experience */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 shadow-sm">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#9E9A93] mb-1">LIVE TOKEN CARD</div>
              <h3 className="text-[14px] font-bold text-[#1A1615]">Guest Mobile Preview</h3>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-[#D4A753]">Apple &amp; Google Wallet</span>
          </div>

          <div className="bg-[#1A1615] rounded-[20px] p-1 shadow-xl relative mx-auto w-full max-w-[260px]">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-lg z-20"></div>

            {/* Pass Container */}
            <div className="bg-[#1A1615] border border-white/10 rounded-[16px] overflow-hidden relative pt-7 pb-5 px-4 flex flex-col">
              {/* Pass Header */}
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-[#D4A753] rounded-full flex items-center justify-center text-white font-bold text-[9px]">R</div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-white/90">REVIA ROASTERS &amp; CO.</span>
                </div>
                <span className="text-[8px] font-semibold text-white/50 tracking-widest uppercase text-right leading-tight">RESERVE<br />PASS CARD</span>
              </div>

              <div className="mt-3 mb-4 flex justify-between items-start gap-2">
                <div>
                  <span className="inline-block px-2 py-0.5 border border-[#D4A753]/30 text-[#D4A753] rounded text-[8px] font-bold tracking-widest uppercase mb-2">{getCampaignTypeLabel(fullCampaignType).toUpperCase()}</span>
                  <h4 className="text-[18px] font-black text-white leading-snug mb-1">{campaignName || 'NEW REWARD PERK'}</h4>
                  <p className="text-[10px] font-medium text-white/70">{rewardConfig?.freeItem || (rewardConfig?.rewardType ? rewardConfig.rewardType.replace('_', ' ').toUpperCase() : 'Special Reward')}</p>
                </div>
                <div className="bg-white/10 border border-white/20 text-white/90 text-[8px] font-bold tracking-widest px-2 py-1 rounded uppercase mt-0.5 whitespace-nowrap">
                  DEMO QR
                </div>
              </div>

              {/* QR Code Area */}
              <div className="bg-white rounded-lg p-3 flex flex-col items-center justify-center">
                <div className="relative">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(JSON.stringify({
                    name: campaignName || 'Untitled',
                    type: fullCampaignType,
                    reward: rewardConfig?.freeItem || rewardConfig?.rewardType || 'Pending'
                  }))}`} alt="Demo QR Code" className="w-20 h-20 mb-1.5 object-contain" />
                </div>
                <div className="text-[6px] font-bold tracking-widest text-[#1A1615] uppercase mt-1 text-center leading-tight">
                  <span className="flex items-center justify-center gap-1"><Wifi className="w-2.5 h-2.5 rotate-90" /> HOLD NEAR COUNTER NFC OR</span>
                  SCAN QR CODE
                </div>
              </div>
            </div>
          </div>

          <p className="text-[9px] font-medium text-center text-[#9E9A93] mt-4 leading-relaxed">
            Pass adapts automatically to patron's local Apple / Google Wallet dark mode.
          </p>
        </div>

        {/* Right Sidebar 3: Deployment Protocol */}
        <div className="bg-white border border-[#EFECE6] rounded-[16px] p-6 shadow-sm">
          <h3 className="text-[14px] font-bold text-[#1A1615] mb-4">Deployment Protocol</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 text-[13px] font-bold text-[#1A1615] cursor-pointer bg-[#FAF8F5] p-4 rounded-xl border border-[#D4A753] shadow-sm relative overflow-hidden">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#D4A753]"></div>
              <div className="mt-0.5"><CircleDot className="w-4 h-4 text-[#D4A753]" /></div>
              <div>
                <span className="block mb-0.5">Publish Instantly</span>
                <span className="text-[11px] font-medium text-[#6E6A66]">Mesh registers synchronize instantly upon clicking Publish.</span>
              </div>
            </label>
            <label className="flex items-start gap-3 text-[13px] font-bold text-[#1A1615] cursor-pointer bg-white p-4 rounded-xl border border-[#EFECE6] hover:bg-[#FAF8F5] transition-colors">
              <div className="mt-0.5"><Circle className="w-4 h-4 text-[#D1CDC7]" /></div>
              <div>
                <span className="block mb-0.5">Schedule Activation</span>
                <span className="text-[11px] font-medium text-[#6E6A66]">Automated staging for Nov 1, 2024 at 00:00 PST.</span>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    const filteredCampaigns = campaigns.filter(c =>
      (statusFilter === 'All' || statusFilter === 'All Status' || c.status.toLowerCase() === statusFilter.toLowerCase()) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.reward && c.reward.toLowerCase().includes(searchQuery.toLowerCase())))
    );

    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
    const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1500px] mx-auto space-y-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
            <span>Home</span>
            <span>&gt;</span>
            <span className="text-gray-700 font-bold">Campaign &amp; Loyalty Management</span>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
                Campaign &amp; Loyalty Management
                <Sparkles className="w-5 h-5 text-[#E83E8C] fill-[#E83E8C]" />
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
                Create, monitor, and optimize your customer engagement programs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('/approvals')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-purple-200 text-[#7C3AED] text-xs font-bold shadow-sm hover:bg-purple-50 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#7C3AED]" />
                Approve Campaign &gt;
              </button>

              <button
                type="button"
                onClick={handleOpenBuilder}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold shadow-md shadow-[#5844A8]/20 transition cursor-pointer"
              >
                + Create New Campaign
              </button>
            </div>
          </div>

          {/* 4 Metric Cards with Sparklines */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Total Campaigns */}
            <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FCE7F3] flex items-center justify-center text-[#E11D48] flex-shrink-0">
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">Total<br />Campaigns</span>
                    <div className="text-2xl font-black text-[#1E1548] mt-1">24</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    + 12%
                  </span>
                  <div className="text-[9px] text-gray-400 mt-1">vs last month</div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="mt-4 h-6 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M 0,15 Q 25,5 50,15 T 100,8"
                    fill="none"
                    stroke="#F43F5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Card 2: Active Campaigns */}
            <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#7C3AED] flex-shrink-0">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">Active<br />Campaigns</span>
                    <div className="text-2xl font-black text-[#1E1548] mt-1">18</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    + 8%
                  </span>
                  <div className="text-[9px] text-gray-400 mt-1">vs last month</div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="mt-4 h-6 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M 0,16 Q 30,12 60,18 T 100,10"
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Card 3: Total Redemptions */}
            <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFE4E6] flex items-center justify-center text-[#E11D48] flex-shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">Total<br />Redemptions</span>
                    <div className="text-2xl font-black text-[#1E1548] mt-1">12,480</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    + 24%
                  </span>
                  <div className="text-[9px] text-gray-400 mt-1">vs last month</div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="mt-4 h-6 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M 0,14 Q 35,18 70,10 T 100,12"
                    fill="none"
                    stroke="#E11D48"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Card 4: Total Rewards Given */}
            <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706] flex-shrink-0">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500">Total Rewards<br />Given</span>
                    <div className="text-2xl font-black text-[#1E1548] mt-1">8,500</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full">
                    + 18%
                  </span>
                  <div className="text-[9px] text-gray-400 mt-1">vs last month</div>
                </div>
              </div>

              {/* Sparkline SVG */}
              <div className="mt-4 h-6 w-full">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20" preserveAspectRatio="none">
                  <path
                    d="M 0,18 Q 30,10 65,15 T 100,8"
                    fill="none"
                    stroke="#D97706"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Campaign Table Card */}
          <div className="bg-white rounded-3xl border border-purple-50 shadow-sm p-6 space-y-5">
            {/* Search & Filters Row */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative w-full md:w-96">
                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search campaigns by name or reward..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FAF8FF] border border-gray-200/80 rounded-full pl-10 pr-4 py-2.5 text-xs text-[#1A1615] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                {/* All Types */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setTypeFilterDropdownOpen(!typeFilterDropdownOpen)}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{typeFilter}</span>
                    <span className="text-gray-400 text-[10px]">⁄</span>
                  </button>
                  {typeFilterDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40">
                      {['All Types', 'Welcome Campaign', 'Item Based Offer', 'Stamps', 'Billing Offer'].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setTypeFilter(t);
                            setTypeFilterDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-[#5844A8] font-medium"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* All Status */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setStatusFilterDropdownOpen(!statusFilterDropdownOpen)}
                    className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>{statusFilter}</span>
                    <span className="text-gray-400 text-[10px]">⁄</span>
                  </button>
                  {statusFilterDropdownOpen && (
                    <div className="absolute left-0 mt-1.5 w-36 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-40">
                      {['All Status', 'Active', 'Draft', 'Scheduled', 'Ended'].map((s) => (
                        <button
                          key={s}
                          onClick={() => {
                            setStatusFilter(s);
                            setStatusFilterDropdownOpen(false);
                          }}
                          className="w-full text-left px-3.5 py-1.5 text-xs text-gray-700 hover:bg-purple-50 hover:text-[#5844A8] font-medium"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Select Date */}
                <button
                  type="button"
                  className="px-4 py-2 rounded-full border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Calendar className="w-3.5 h-3.5 text-gray-500" />
                  <span>Select Date</span>
                  <span className="text-gray-400 text-[10px]">⁄</span>
                </button>
              </div>
            </div>

            {/* Campaign Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">CAMPAIGN INFO</th>
                    <th className="py-3 px-4">TYPE &amp; TARGET</th>
                    <th className="py-3 px-4">STATUS</th>
                    <th className="py-3 px-4">TIMELINE</th>
                    <th className="py-3 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedCampaigns.map((camp) => {
                    const isActive = camp.status === 'Active';
                    return (
                      <tr key={camp.id} className="hover:bg-purple-50/20 transition group">
                        {/* Info */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center flex-shrink-0">
                              {camp.type === 'welcome' ? <Gift className="w-5 h-5" /> : <Utensils className="w-5 h-5 text-blue-500" />}
                            </div>
                            <div>
                              <div className="text-xs font-bold text-[#1E1548]">{camp.name}</div>
                              <div className="text-[11px] text-gray-400">{camp.description}</div>
                            </div>
                          </div>
                        </td>

                        {/* Type & Target */}
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-xs font-semibold text-[#1E1548]">{camp.typeLabel || 'Welcome Campaign'}</div>
                            {camp.target === 'VIP' ? (
                              <span className="inline-block text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5">
                                VIP
                              </span>
                            ) : (
                              <div className="text-[10px] text-gray-400 uppercase font-semibold">{camp.target || 'ALL CUSTOMERS'}</div>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full ${
                            isActive ? 'bg-[#DCFCE7] text-[#15803D]' : 'bg-[#FEF3C7] text-[#D97706]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[#15803D]' : 'bg-[#D97706]'}`}></span>
                            {camp.status}
                          </span>
                        </td>

                        {/* Timeline */}
                        <td className="py-4 px-4">
                          <div className="text-xs font-semibold text-[#1E1548]">{camp.startDate || 'Nov 1, 2024'}</div>
                          <div className="text-[10px] text-gray-400">{camp.endDate || 'Nov 30, 2024'}</div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2 text-gray-400">
                            {isActive && (
                              <button
                                type="button"
                                title="Pause Campaign"
                                onClick={() => handleToggleCampaignStatus(camp.id, camp.status)}
                                className="p-1.5 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                              >
                                <Pause className="w-4 h-4" />
                              </button>
                            )}

                            <button
                              type="button"
                              title="Preview"
                              onClick={() => {
                                setQrModalCampaign(camp);
                              }}
                              className="p-1.5 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                              <Eye className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              title="Campaign report"
                              className="p-1.5 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                              <BarChart3 className="w-4 h-4" />
                            </button>

                            <button
                              type="button"
                              title="Edit"
                              onClick={() => handleEditCampaign(camp)}
                              className="p-1.5 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500 font-medium">
              <div>Showing 1-{paginatedCampaigns.length} of {campaigns.length} campaigns</div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  &lt;
                </button>
                {[1, 2, 3, 4, 5].slice(0, Math.max(1, totalPages || 1)).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 rounded-lg font-bold flex items-center justify-center cursor-pointer ${
                      currentPage === p
                        ? 'bg-[#2D1954] text-white shadow-sm'
                        : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
                  className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  };

  {/* =========================================================================
      DESKTOP WIZARD COMPONENTS (Exact copy from Figma Screenshots 2, 3, 4, 5)
     ========================================================================= */}

  const renderDesktopStepper = () => {
    return (
      <div className="space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-400">
          <span>&gt; Home</span>
          <span className="text-gray-700 font-bold">Campaign &amp; Loyalty Management</span>
        </div>

        {/* Page Title */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-[#1E1548] tracking-tight flex items-center gap-2">
            Campaign &amp; Loyalty Management
            <Sparkles className="w-5 h-5 text-[#E83E8C] fill-[#E83E8C]" />
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">
            Create, monitor, and optimize your customer engagement programs.
          </p>
        </div>

        {/* Horizontal Desktop 6-Step Stepper */}
        <div className="relative flex items-center justify-between max-w-4xl pt-2">
          {steps.map((st) => {
            const isCompleted = currentStep > st.id;
            const isCurrent = currentStep === st.id;

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
                  {st.id}
                </div>
                <span className={`text-xs font-bold mt-2 whitespace-nowrap ${
                  isCurrent ? 'text-[#5844A8]' : 'text-gray-400'
                }`}>
                  {st.name}
                </span>
              </div>
            );
          })}
          {/* Connector track line */}
          <div className="absolute top-6 left-6 right-6 h-0.5 bg-gray-200 -z-0"></div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 1: Basic Details (Image 2) */}
  const renderDesktopStep1 = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Card 1: Basic Details */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Basic Details</h3>
                <p className="text-xs text-gray-400 font-medium">Add the essential information for your campaign.</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Campaign name */}
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Campaign name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    placeholder="Enter campaign name (e.g. Summer Special)"
                    maxLength={100}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#1A1615] placeholder-gray-400 focus:outline-none focus:border-[#5844A8] shadow-sm font-medium pr-16"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                    {campaignName.length}/100
                  </span>
                </div>
              </div>

              {/* Short description */}
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Short description <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <textarea
                    rows={4}
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    placeholder="Add a short description that will be visible to customers."
                    maxLength={200}
                    className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-xs text-[#1A1615] placeholder-gray-400 focus:outline-none focus:border-[#5844A8] shadow-sm font-medium resize-none pb-6"
                  />
                  <span className="absolute right-4 bottom-3 text-xs text-gray-400">
                    {campaignDescription.length}/200
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom 2 Columns: Campaign Validity & Campaign Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Campaign Validity */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1548]">Campaign Validity</h3>
                  <p className="text-xs text-gray-400 font-medium">Set the start and end dates for your campaign.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">Start date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      defaultValue="15 Sep 2025"
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#1A1615]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#1E1548] mb-1">End date *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      defaultValue="30 Sep 2025"
                      className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#1A1615]"
                    />
                  </div>
                </div>
              </div>

              {/* When will this campaign be applicable? */}
              <div className="pt-2 space-y-2">
                <span className="block text-xs font-bold text-[#1E1548]">
                  When will this campaign be applicable? <span className="text-rose-500">*</span>
                </span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1615] cursor-pointer">
                    <input
                      type="radio"
                      name="applicable_type"
                      checked={timeActiveType === 'entire_day'}
                      onChange={() => setTimeActiveType('entire_day')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    Entire day
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1A1615] cursor-pointer">
                    <input
                      type="radio"
                      name="applicable_type"
                      checked={timeActiveType === 'specific_time'}
                      onChange={() => setTimeActiveType('specific_time')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    Specific time
                  </label>
                </div>

                {timeActiveType === 'specific_time' && (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      value={specificStartTime}
                      onChange={(e) => setSpecificStartTime(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="text"
                      value={specificEndTime}
                      onChange={(e) => setSpecificEndTime(e.target.value)}
                      className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Right: Campaign Status */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1548]">Campaign Status</h3>
                  <p className="text-xs text-gray-400 font-medium">Choose the initial status for this campaign.</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {/* Draft Option */}
                <div
                  onClick={() => setCampaignStatusSelection('draft')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3.5 ${
                    campaignStatusSelection === 'draft'
                      ? 'border-[#5844A8] bg-[#FAF8FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    campaignStatusSelection === 'draft' ? 'border-[#5844A8]' : 'border-gray-300'
                  }`}>
                    {campaignStatusSelection === 'draft' && <Check className="w-3.5 h-3.5 text-[#5844A8] stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1548]">Draft</h4>
                    <p className="text-[11px] text-gray-400">Save and edit later</p>
                  </div>
                </div>

                {/* Active Option */}
                <div
                  onClick={() => setCampaignStatusSelection('active')}
                  className={`p-4 rounded-2xl border-2 transition cursor-pointer flex items-center gap-3.5 ${
                    campaignStatusSelection === 'active'
                      ? 'border-[#5844A8] bg-[#FAF8FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    campaignStatusSelection === 'active' ? 'border-[#5844A8]' : 'border-gray-300'
                  }`}>
                    {campaignStatusSelection === 'active' && <Check className="w-3.5 h-3.5 text-[#5844A8] stroke-[3]" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1548]">Active</h4>
                    <p className="text-[11px] text-gray-400">Campaign will go live as per schedule</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setViewMode('dashboard')}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 2: Audience Type (Image 3) */}
  const renderDesktopStep2 = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Audience Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Audience</h3>
                <p className="text-xs text-gray-400 font-medium">Choose the customers you want to target for this campaign.</p>
              </div>
            </div>

            {/* Campaign Type (3 Cards) */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-[#1E1548]">Campaign Type</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. All Customers */}
                <div
                  onClick={() => setAudienceTargetType('all')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                    audienceTargetType === 'all'
                      ? 'border-[#5844A8] bg-[#FAF8FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      audienceTargetType === 'all' ? 'bg-[#5844A8] text-white' : 'border border-gray-300'
                    }`}>
                      {audienceTargetType === 'all' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center mb-3">
                    <Gift className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1E1548]">All Customers</h4>
                  <p className="text-[11px] text-gray-400 mt-1">Target your entire customer base</p>
                </div>

                {/* 2. New Customers */}
                <div
                  onClick={() => setAudienceTargetType('new')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                    audienceTargetType === 'new'
                      ? 'border-[#5844A8] bg-[#FAF8FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      audienceTargetType === 'new' ? 'bg-[#5844A8] text-white' : 'border border-gray-300'
                    }`}>
                      {audienceTargetType === 'new' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1E1548]">New Customers</h4>
                  <p className="text-[11px] text-gray-400 mt-1">Customers who haven't purchased yet</p>
                </div>

                {/* 3. Existing Customer */}
                <div
                  onClick={() => setAudienceTargetType('existing')}
                  className={`p-5 rounded-2xl border-2 transition cursor-pointer relative ${
                    audienceTargetType === 'existing'
                      ? 'border-[#5844A8] bg-[#FAF8FF]'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="absolute top-4 right-4">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      audienceTargetType === 'existing' ? 'bg-[#5844A8] text-white' : 'border border-gray-300'
                    }`}>
                      {audienceTargetType === 'existing' && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
                    <Star className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-[#1E1548]">Existing Customer</h4>
                  <p className="text-[11px] text-gray-400 mt-1">First-time customers after joining</p>
                </div>
              </div>
            </div>

            {/* Loyalty Tier */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold text-[#1E1548]">Loyalty Tier</span>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {[
                  { key: 'all', label: 'All Tiers' },
                  { key: 'vip', label: 'VIP' },
                  { key: 'vvip', label: 'VVIP' },
                  { key: 'gold', label: 'Gold' },
                  { key: 'silver', label: 'Silver' },
                  { key: 'bronze', label: 'Bronze' }
                ].map((tier) => (
                  <button
                    key={tier.key}
                    type="button"
                    onClick={() => setSelectedLoyaltyTier(tier.key)}
                    className={`px-4 py-2 rounded-2xl border text-xs font-bold flex items-center gap-2 transition cursor-pointer whitespace-nowrap ${
                      selectedLoyaltyTier === tier.key
                        ? 'border-[#5844A8] bg-[#F5F3FF] text-[#5844A8] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>{tier.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Filters (Optional) Card */}
            <div className="bg-[#FAF8FF] rounded-3xl p-6 border border-purple-100/70 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <SlidersHorizontal className="w-4 h-4 text-[#5844A8]" />
                  <div>
                    <h4 className="text-xs font-bold text-[#1E1548]">Advanced Filters (Optional)</h4>
                    <p className="text-[11px] text-gray-400">Refine your audience using the filters below.</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setDemographicAgeRange([18, 60]);
                    setDemographicGender('All');
                    setDemographicTotalSpend(50000);
                    setDemographicTotalVisits(50);
                  }}
                  className="text-xs font-bold text-gray-400 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear All
                </button>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Age Range */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-[#1E1548]">Age Range</span>
                  </div>

                  <div className="relative py-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
                      <div className="absolute left-[15%] right-[10%] h-full bg-[#5844A8] rounded-full"></div>
                      <div className="absolute left-[15%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#5844A8] rounded-full shadow-md border-2 border-white"></div>
                      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#5844A8] rounded-full shadow-md border-2 border-white"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                    <span>18</span>
                    <span className="text-gray-400">60+</span>
                  </div>
                </div>

                {/* Gender */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-[#1E1548]">Gender</span>
                  </div>

                  <div className="bg-[#FAF8FF] p-1 rounded-xl flex items-center gap-1">
                    {(['All', 'Male', 'Female'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setDemographicGender(g)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer text-center ${
                          demographicGender === g
                            ? 'bg-[#5844A8] text-white shadow-sm'
                            : 'text-gray-600 hover:text-black'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Total Spend */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-400">💳</span>
                    <span className="text-xs font-bold text-[#1E1548]">Total Spend (₹)</span>
                  </div>

                  <div className="relative py-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
                      <div className="absolute left-0 right-[25%] h-full bg-[#5844A8] rounded-full"></div>
                      <div className="absolute right-[25%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#5844A8] rounded-full shadow-md border-2 border-white"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                    <span>0</span>
                    <span className="text-gray-400">50,000+</span>
                  </div>
                </div>

                {/* Total Visits */}
                <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm space-y-3">
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-[#1E1548]">Total Visits</span>
                  </div>

                  <div className="relative py-2">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full relative">
                      <div className="absolute left-0 right-[35%] h-full bg-[#5844A8] rounded-full"></div>
                      <div className="absolute right-[35%] top-1/2 -translate-y-1/2 w-4 h-4 bg-[#5844A8] rounded-full shadow-md border-2 border-white"></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-[#1E1548]">
                    <span>0</span>
                    <span className="text-gray-400">50+</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  setCurrentStep(3);
                  setIsConfiguringCondition(false);
                }}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3: Conditions List (Image 4) */}
  const renderDesktopStep3List = () => {
    const desktopConditions = [
      {
        id: 'visit',
        title: 'Visit Based',
        description: 'Set the number of visits and minimum bill amount required to qualify.',
        icon: Store,
        iconBg: 'bg-rose-50',
        iconColor: 'text-rose-500'
      },
      {
        id: 'billing',
        title: 'Billing Based',
        description: 'Set target spend and frequency within a selected time period.',
        icon: CreditCard,
        iconBg: 'bg-purple-50',
        iconColor: 'text-[#7C3AED]'
      },
      {
        id: 'stamps',
        title: 'Stamps',
        description: 'Set number of item purchases to qualify.',
        icon: Star,
        iconBg: 'bg-blue-50',
        iconColor: 'text-blue-500'
      },
      {
        id: 'item',
        title: 'Item Based Offers',
        description: 'Apply offer to specific items or categories.',
        icon: Box,
        iconBg: 'bg-purple-50',
        iconColor: 'text-[#9333EA]'
      },
      {
        id: 'happy_hours',
        title: 'Happy Hours',
        description: 'Run the campaign during specific time and days.',
        icon: Clock,
        iconBg: 'bg-orange-50',
        iconColor: 'text-orange-500'
      },
      {
        id: 'birthday',
        title: 'Birthday / Anniversary Offers',
        description: 'Enable special offers for customer birthdays or anniversaries.',
        icon: Cake,
        iconBg: 'bg-pink-50',
        iconColor: 'text-pink-500'
      }
    ];

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-black text-[#1E1548]">Conditions</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Choose when and how customers can avail this campaign. Select only one condition.
              </p>
            </div>

            {/* 6 Condition Cards */}
            <div className="space-y-3">
              {desktopConditions.map((cond) => {
                const IconComponent = cond.icon;
                const isSelected = selectedConditionType === cond.id;
                return (
                  <div
                    key={cond.id}
                    onClick={() => setSelectedConditionType(cond.id as any)}
                    className={`p-5 rounded-2xl border-2 transition cursor-pointer flex items-center gap-4 bg-white ${
                      isSelected
                        ? 'border-[#5844A8] shadow-sm'
                        : 'border-gray-200/80 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isSelected ? 'border-[#5844A8]' : 'border-gray-300'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5844A8]"></div>}
                    </div>

                    <div className={`w-10 h-10 rounded-2xl ${cond.iconBg} ${cond.iconColor} flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-[#1E1548]">{cond.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{cond.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setIsConfiguringCondition(true)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Visit Based Configuration (Image 5) */}
  const renderDesktopStep3Detail = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Visit Based</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Set the number of visits and minimum bill amount required to qualify for this offer.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Number of Visits */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1E1548]">
                  Number of Visits <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button
                      type="button"
                      onClick={() => setVisitBasedVisits(Math.max(1, visitBasedVisits - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-r border-gray-200 cursor-pointer"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-14 text-center text-xs font-black text-[#1E1548]">
                      {visitBasedVisits}
                    </span>
                    <button
                      type="button"
                      onClick={() => setVisitBasedVisits(visitBasedVisits + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 border-l border-gray-200 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    Customer needs to visit this many times to avail the offer.
                  </span>
                </div>
              </div>

              {/* Minimum Bill Amount (per visit) */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1E1548]">
                  Minimum Bill Amount (per visit) <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center border border-gray-200 rounded-2xl overflow-hidden max-w-sm bg-white shadow-sm">
                  <div className="flex items-center gap-1 px-3 py-2.5 bg-gray-50 border-r border-gray-200 text-xs font-bold text-gray-600">
                    <span>INR (₹)</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={visitBasedMinBill}
                    onChange={(e) => setVisitBasedMinBill(Number(e.target.value) || 0)}
                    className="flex-1 px-4 py-2.5 text-xs font-black text-[#1E1548] focus:outline-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Each visit should have a minimum bill amount of ₹{visitBasedMinBill} to be counted.
                </p>
              </div>

              {/* Visit Validity Period */}
              <div className="space-y-3">
                <label className="block text-xs font-bold text-[#1E1548]">
                  Visit Validity Period <span className="text-rose-500">*</span>
                </label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1548] cursor-pointer">
                    <input
                      type="radio"
                      name="validity_period_type"
                      checked={visitBasedValidityType === 'specific_period'}
                      onChange={() => setVisitBasedValidityType('specific_period')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    Within a specific time period
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1548] cursor-pointer">
                    <input
                      type="radio"
                      name="validity_period_type"
                      checked={visitBasedValidityType === 'no_limit'}
                      onChange={() => setVisitBasedValidityType('no_limit')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    No time limit
                  </label>
                </div>

                {visitBasedValidityType === 'specific_period' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg pt-1">
                    <div>
                      <span className="block text-[11px] text-gray-400 font-semibold mb-1">Start Date</span>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={visitBasedStartDate}
                          onChange={(e) => setVisitBasedStartDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#1A1615]"
                        />
                      </div>
                    </div>

                    <div>
                      <span className="block text-[11px] text-gray-400 font-semibold mb-1">End Date</span>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={visitBasedEndDate}
                          onChange={(e) => setVisitBasedEndDate(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#1A1615]"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Consider Visits from */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs font-bold text-[#1E1548]">Consider Visits from</span>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1548] cursor-pointer">
                    <input
                      type="radio"
                      name="branch_scope"
                      checked={visitBasedBranchScope === 'all'}
                      onChange={() => setVisitBasedBranchScope('all')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    All branches
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1548] cursor-pointer">
                    <input
                      type="radio"
                      name="branch_scope"
                      checked={visitBasedBranchScope === 'selected'}
                      onChange={() => setVisitBasedBranchScope('selected')}
                      className="w-4 h-4 text-[#5844A8] focus:ring-[#5844A8]"
                    />
                    Selected branches only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Billing Based Rule (Image 1) */}
  const renderDesktopBillingDetail = () => {
    const quickAmounts = [250, 500, 1000, 2500, 5000];
    const quickFrequencies = ['Weekly', 'Monthly', 'Quarterly', 'Per Campaign'];

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6EEFD] text-[#7C3AED] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Billing</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Set the target amount and frequency for customer eligibility in this campaign.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Target Amount */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#1E1548]">Target Amount</span>
                    <span className="ml-2 bg-[#FFF0F2] text-[#E11D48] text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Required
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Set the minimum bill amount a customer needs to spend.
                </p>

                {/* Input box */}
                <div className="flex items-center justify-between bg-[#FBF9FE] border border-gray-200 rounded-2xl px-4 py-3 shadow-inner max-w-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-[#1E1548]">₹</span>
                    <input
                      type="number"
                      value={billingTargetAmount}
                      onChange={(e) => setBillingTargetAmount(Number(e.target.value) || 0)}
                      className="bg-transparent text-base font-black text-[#1E1548] focus:outline-none w-32"
                    />
                  </div>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-500 cursor-pointer">
                    <span>INR (₹)</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Quick Pills */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {quickAmounts.map((amt) => {
                    const isSelected = billingTargetAmount === amt;
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setBillingTargetAmount(amt)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'border-2 border-[#5844A8] bg-white text-[#5844A8] shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        ₹{amt.toLocaleString()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Frequency (Optional) */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1548]">Frequency (Optional)</span>
                  <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                    Rolling Period <Info className="w-3 h-3 text-gray-400" />
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Set how often the customer needs to meet this condition.
                </p>

                {/* Dropdown */}
                <div className="relative max-w-2xl">
                  <div
                    onClick={() => setBillingFrequencyDropdownOpen(!billingFrequencyDropdownOpen)}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-4 py-3 cursor-pointer shadow-sm"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#1E1548]">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{billingFrequency}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>

                  {billingFrequencyDropdownOpen && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden py-1">
                      {quickFrequencies.map((f) => (
                        <div
                          key={f}
                          onClick={() => {
                            setBillingFrequency(f);
                            setBillingFrequencyDropdownOpen(false);
                          }}
                          className="px-4 py-2.5 text-xs font-semibold hover:bg-purple-50 text-gray-700 cursor-pointer"
                        >
                          {f}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Pills */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  {quickFrequencies.map((freq) => {
                    const isSelected = billingFrequency === freq;
                    return (
                      <button
                        key={freq}
                        type="button"
                        onClick={() => setBillingFrequency(freq)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                          isSelected
                            ? 'border-2 border-[#5844A8] bg-white text-[#5844A8] shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {freq}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Rule Preview */}
              <div className="bg-[#F7F2FD] border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E1548] mr-2">Rule Preview</span>
                  <span className="text-xs text-gray-600 font-medium">
                    Customer will be eligible after spending ₹{billingTargetAmount} in a {billingFrequency.toLowerCase().replace('ly', '')}.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Stamps Rule (Image 2) */}
  const renderDesktopStampsDetail = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#FFF9EB] text-[#F59E0B] flex items-center justify-center">
                <Star className="w-5 h-5 fill-[#F59E0B]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Stamps</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Set the qualifying item and number of stamps required to unlock this promotion.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Qualifying item(s) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#1E1548]">Qualifying item(s)</label>
                <div className="flex items-center justify-between bg-[#F8F5FE] border border-purple-100 rounded-2xl px-4 py-3 shadow-inner cursor-pointer max-w-2xl">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-[#1E1548]">
                    <Box className="w-4 h-4 text-[#5844A8]" />
                    <span>{stampQualifyingItem}</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Applies to all catalog menu items or customized categories.
                </p>
              </div>

              {/* No. of stamps */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1548]">No. of stamps</span>
                  <span className="text-xs font-bold text-[#5844A8]">Target: {stampTargetCount} stamps</span>
                </div>

                <div className="bg-[#F8F5FE] border border-purple-100 rounded-2xl p-3 flex items-center justify-between max-w-2xl">
                  <button
                    type="button"
                    onClick={() => setStampTargetCount(Math.max(1, stampTargetCount - 1))}
                    className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <div className="text-center">
                    <div className="text-2xl font-black text-[#1E1548]">{stampTargetCount}</div>
                    <div className="text-[11px] text-gray-400 font-medium">visits / purchases</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStampTargetCount(stampTargetCount + 1)}
                    className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Customer Pass Preview */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1E1548]">Customer Pass Preview</span>
                  <span className="text-xs font-bold text-rose-500">Merchant Pulse Card</span>
                </div>

                <div className="grid grid-cols-5 gap-3 max-w-2xl">
                  {Array.from({ length: 4 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-16 rounded-2xl bg-[#5844A8] text-white flex items-center justify-center shadow-sm"
                    >
                      <Check className="w-5 h-5 stroke-[3]" />
                    </div>
                  ))}
                  <div className="h-16 rounded-2xl bg-[#FFF0F3] border border-pink-200 text-[#E11D48] flex items-center justify-center shadow-sm">
                    <Gift className="w-5 h-5" />
                  </div>
                </div>
              </div>

              {/* Rule Preview */}
              <div className="bg-[#F7F2FD] border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  <Info className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1E1548] mr-2">Rule Preview</span>
                  <span className="text-xs text-gray-600 font-medium">
                    Customer needs to collect {stampTargetCount} stamps (on {stampQualifyingItem.toLowerCase()}) to be eligible for this campaign.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Cancel
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Item Based Offers Rule (Image 3) */}
  const renderDesktopItemBasedDetail = () => {
    const categoryPills = [
      'All items',
      'Food & Beverages',
      'Snacks',
      'Desserts',
      'Beverages',
      'Combos',
      'Merchandise',
      'Others'
    ];

    const mockItems = [
      {
        id: '2391',
        name: 'Margherita Pizza',
        desc: '#2391 • Wood-fired Italian Pizza',
        category: 'Food & Beverages',
        catColor: 'bg-pink-50 text-pink-600 border-pink-100',
        price: '₹299',
        stock: 'In Stock',
        img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: '2340',
        name: 'Paneer Alfredo',
        desc: '#2340 • Rich Pasta, Pan sauce',
        category: 'Main Course',
        catColor: 'bg-purple-50 text-purple-600 border-purple-100',
        price: '₹349',
        stock: 'In Stock',
        img: 'https://images.unsplash.com/photo-1621996346565-e3d5d628169e?w=100&auto=format&fit=crop&q=80'
      },
      {
        id: '1876',
        name: 'Caesar Salad',
        desc: '#1876 • Crisp Romaine & Caesar Dressing',
        category: 'Salad',
        catColor: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        price: '₹249',
        stock: 'In Stock',
        img: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=100&auto=format&fit=crop&q=80'
      }
    ];

    const toggleItem = (id: string) => {
      setItemBasedSelectedIds(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      );
    };

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#F6EEFD] text-[#9333EA] flex items-center justify-center">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Item Based Offers</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Apply offers to specific items or categories.
                </p>
              </div>
            </div>

            {/* Segmented control & Add button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
              <div className="inline-flex bg-[#F3EFFB] p-1 rounded-2xl self-start">
                <button
                  type="button"
                  onClick={() => setItemBasedTab('specific_items')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    itemBasedTab === 'specific_items'
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Specific Items
                </button>
                <button
                  type="button"
                  onClick={() => setItemBasedTab('category')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    itemBasedTab === 'category'
                      ? 'bg-[#5844A8] text-white shadow-sm'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  Category
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsAddCatalogItemModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-purple-200 text-[#7C3AED] hover:bg-purple-50 text-xs font-bold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Custom Item
              </button>
            </div>

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search for items (name, code or SKU)..."
                  value={itemBasedSearch}
                  onChange={(e) => setItemBasedSearch(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-2xl pl-9 pr-3 py-2.5 text-xs font-semibold text-[#1A1615] focus:outline-none focus:border-[#5844A8]"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 cursor-pointer">
                  <span>All Categories</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-2xl text-xs font-bold text-gray-600 cursor-pointer">
                  <span>All Branches</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              {categoryPills.map((pill) => {
                const isSelected = itemBasedSelectedCategoryPill === pill;
                return (
                  <button
                    key={pill}
                    type="button"
                    onClick={() => setItemBasedSelectedCategoryPill(pill)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      isSelected
                        ? 'bg-[#5844A8] text-white shadow-sm'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {pill}
                  </button>
                );
              })}
            </div>

            {/* Selection Toolbar */}
            <div className="flex items-center justify-between text-xs font-bold text-[#1E1548] pt-2 border-t border-purple-100/60">
              <span>{itemBasedSelectedIds.length} items selected</span>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={itemBasedSelectedIds.length === mockItems.length}
                  onChange={() => {
                    if (itemBasedSelectedIds.length === mockItems.length) {
                      setItemBasedSelectedIds([]);
                    } else {
                      setItemBasedSelectedIds(mockItems.map(m => m.id));
                    }
                  }}
                  className="w-4 h-4 rounded text-[#5844A8] focus:ring-[#5844A8]"
                />
                Select All
              </label>
            </div>

            {/* Table of Items */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    <th className="py-2.5 px-3 w-10"></th>
                    <th className="py-2.5 px-3">Item &#8645;</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Availability</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {mockItems.map((item) => {
                    const isChecked = itemBasedSelectedIds.includes(item.id);
                    return (
                      <tr key={item.id} className="hover:bg-purple-50/30 transition">
                        <td className="py-3 px-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleItem(item.id)}
                            className="w-4 h-4 rounded text-[#5844A8] focus:ring-[#5844A8] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                            <div>
                              <div className="text-xs font-bold text-[#1E1548]">{item.name}</div>
                              <div className="text-[11px] text-gray-400 font-medium">{item.desc}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border ${item.catColor}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs font-bold text-[#1E1548]">
                          {item.price}
                        </td>
                        <td className="py-3 px-3">
                          <span className="text-xs font-bold text-emerald-600">
                            {item.stock}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-purple-100/60 text-xs">
              <span className="text-gray-400 font-medium">Showing 3 of 24 items</span>
              <div className="flex items-center gap-1.5 font-bold">
                <button type="button" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                  &lt;
                </button>
                <button type="button" className="w-7 h-7 rounded-lg bg-[#5844A8] text-white flex items-center justify-center">
                  1
                </button>
                <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                  2
                </button>
                <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                  3
                </button>
                <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                  4
                </button>
                <button type="button" className="w-7 h-7 rounded-lg text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                  5
                </button>
                <button type="button" className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100">
                  &gt;
                </button>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Happy Hours Rule (Image 4) */}
  const renderDesktopHappyHoursDetail = () => {
    const allDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    const toggleDay = (d: string) => {
      setHappyHoursSelectedDays(prev =>
        prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]
      );
    };

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Happy Hours</h3>
                <p className="text-xs text-gray-400 font-medium">
                  Set the time, day and duration window to trigger exclusive tier pricing.
                </p>
              </div>
            </div>

            {/* Large Strategy Hero Banner */}
            <div className="rounded-3xl overflow-hidden relative bg-gradient-to-r from-[#EDE8F9] via-[#F6EEFD] to-white border border-purple-100 flex flex-col md:flex-row items-center justify-between p-6 lg:p-8">
              <div className="space-y-2 z-10 max-w-md">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm text-[11px] font-bold text-[#5844A8] border border-purple-200/60 shadow-xs">
                  🍸 Peak Traffic Strategy
                </span>
                <h2 className="text-2xl font-black text-[#1E1548]">Afternoon Boost</h2>
                <p className="text-xs font-semibold text-gray-500">Drive 3.4x weekday footfall</p>
              </div>

              <div className="mt-4 md:mt-0 flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=500&auto=format&fit=crop&q=80"
                  alt="Happy Hours"
                  className="w-56 h-28 object-cover rounded-2xl shadow-sm"
                />
              </div>
            </div>

            {/* 2-Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Left Column: Time range */}
              <div className="border border-purple-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-[#1E1548]">Time range</span>
                  </div>
                  <span className="bg-purple-50 text-[#5844A8] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Standard Slot
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Set the start and end time for this offer.
                </p>

                <div className="grid grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold mb-1">Starts from</span>
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-3 py-2 text-xs font-bold text-[#1E1548]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{happyHoursStartTime}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <span className="block text-[10px] text-gray-400 font-bold mb-1">Valid until</span>
                    <div className="flex items-center justify-between bg-white border border-gray-200 rounded-2xl px-3 py-2 text-xs font-bold text-[#1E1548]">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        <span>{happyHoursEndTime}</span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#F8F5FE] rounded-2xl px-4 py-2.5 text-xs font-bold text-[#1E1548] flex items-center gap-2">
                  <Hourglass className="w-3.5 h-3.5 text-[#5844A8]" />
                  <span>Active window: 6 hours / day</span>
                </div>
              </div>

              {/* Right Column: Days */}
              <div className="border border-purple-100 rounded-3xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-[#1E1548]">Days</span>
                  </div>
                  <span className="bg-rose-50 text-rose-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Weekdays ({happyHoursSelectedDays.length})
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-medium">
                  Choose the days when this offer will be active.
                </p>

                {/* 7 Day Circle Buttons */}
                <div className="flex items-center justify-between gap-1.5 pt-1">
                  {allDays.map((d) => {
                    const isSelected = happyHoursSelectedDays.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDay(d)}
                        className={`w-9 h-9 rounded-full text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                          isSelected
                            ? 'bg-[#5844A8] text-white shadow-sm'
                            : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {d}
                      </button>
                    );
                  })}
                </div>

                {/* Recurring Checkbox */}
                <label className="flex items-center gap-2 text-xs font-semibold text-[#1E1548] cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={happyHoursRecurring}
                    onChange={(e) => setHappyHoursRecurring(e.target.checked)}
                    className="w-4 h-4 rounded text-[#5844A8] focus:ring-[#5844A8]"
                  />
                  <span>Recurring on {happyHoursSelectedDays.length} days every week</span>
                </label>
              </div>
            </div>

            {/* Rule Preview */}
            <div className="bg-[#F7F2FD] border border-purple-100 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-[#5844A8] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-[#1E1548] mr-2">Rule Preview</span>
                <span className="text-xs text-gray-600 font-medium">
                  This offer will be valid from {happyHoursStartTime} to {happyHoursEndTime}, {happyHoursSelectedDays.join(', ')}.
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 3 Detail: Birthday / Anniversary Rule (Image 5) */}
  const renderDesktopBirthdayDetail = () => {
    const quickDayPills = ['Exact Day', '± 3 Days', '± 7 Days', '± 14 Days'];

    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringCondition(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            &lt; Back to Conditions
          </button>

          {/* Main Card */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-50 text-pink-500 flex items-center justify-center">
                  <Cake className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1E1548]">Birthday / Anniversary</h3>
                  <p className="text-xs text-gray-400 font-medium">
                    Set the special day based rule for automated surprise perks.
                  </p>
                </div>
              </div>

              {/* Cute Cake Illustration Icon */}
              <div className="hidden sm:flex items-center gap-2 text-2xl">
                🎂 🎁
              </div>
            </div>

            {/* Segmented Occasion Toggle */}
            <div className="inline-flex bg-[#F3EFFB] p-1 rounded-2xl">
              <button
                type="button"
                onClick={() => setBirthdayOccasionType('birthday')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  birthdayOccasionType === 'birthday'
                    ? 'bg-[#5844A8] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>🎂</span>
                <span>Birthday</span>
              </button>
              <button
                type="button"
                onClick={() => setBirthdayOccasionType('anniversary')}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                  birthdayOccasionType === 'anniversary'
                    ? 'bg-[#5844A8] text-white shadow-sm'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <span>❤️</span>
                <span>Anniversary</span>
              </button>
            </div>

            {/* Days before / after Config Card */}
            <div className="border border-purple-100 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-purple-600" />
                  <span className="text-xs font-bold text-[#1E1548]">Days before / after</span>
                </div>
                <span className="bg-[#FFF0F2] text-[#E11D48] text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  Flexible Window <Info className="w-3 h-3 text-rose-400" />
                </span>
              </div>
              <p className="text-[11px] text-gray-400 font-medium">
                Set the day range when customers will be eligible for this offer.
              </p>

              {/* Stepper */}
              <div className="bg-[#F8F5FE] border border-purple-100 rounded-2xl p-3 flex items-center justify-between max-w-sm">
                <button
                  type="button"
                  onClick={() => setBirthdayDaySpan(Math.max(0, birthdayDaySpan - 1))}
                  className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="text-center">
                  <div className="text-2xl font-black text-[#1E1548]">{birthdayDaySpan}</div>
                  <div className="text-[11px] text-gray-400 font-medium">± {birthdayDaySpan} days span</div>
                </div>
                <button
                  type="button"
                  onClick={() => setBirthdayDaySpan(birthdayDaySpan + 1)}
                  className="w-10 h-10 rounded-full bg-white text-gray-600 hover:bg-gray-100 flex items-center justify-center shadow-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Pills */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {quickDayPills.map((pill) => {
                  const isSelected = birthdayQuickSpan === pill;
                  return (
                    <button
                      key={pill}
                      type="button"
                      onClick={() => {
                        setBirthdayQuickSpan(pill);
                        if (pill === 'Exact Day') setBirthdayDaySpan(0);
                        if (pill === '± 3 Days') setBirthdayDaySpan(3);
                        if (pill === '± 7 Days') setBirthdayDaySpan(7);
                        if (pill === '± 14 Days') setBirthdayDaySpan(14);
                      }}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        isSelected
                          ? 'bg-[#5844A8] text-white shadow-sm'
                          : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pill}
                    </button>
                  );
                })}
              </div>

              {/* Info text note */}
              <div className="flex items-start gap-2 pt-2 text-xs text-purple-800">
                <Info className="w-4 h-4 text-[#5844A8] flex-shrink-0 mt-0.5" />
                <span>
                  Offer will be automatically claimable {birthdayDaySpan} days prior, on the member's {birthdayOccasionType}, and {birthdayDaySpan} days following the date.
                </span>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-[#F6F2FD] border border-purple-100/60 rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white text-[#5844A8] flex items-center justify-center shadow-sm flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-[#1E1548]">
                  This offer will be valid for ± {birthdayDaySpan} days, for all registered members on their {birthdayOccasionType}.
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Example: If the {birthdayOccasionType} is on 15 Sep, the offer will be valid from 12 Sep to 18 Sep.
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringCondition(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Previous
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setViewMode('dashboard')}
                className="px-6 py-2.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-sm flex items-center gap-2"
              >
                💾 Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-7 py-2.5 rounded-full bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 4: Rewards (Matching Figma Screenshots 1, 2, 3, 4, 5) */}
  const renderDesktopStep4Rewards = () => {
    const desktopMenuItems = [
      {
        id: 'margherita-pizza',
        name: 'Margherita Pizza',
        category: 'Pizza',
        price: 299,
        badge: 'High conversion item',
        badgeClass: 'bg-purple-50 text-purple-600 border border-purple-100',
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&auto=format&fit=crop&q=80',
        emoji: '🍕'
      },
      {
        id: 'farmhouse-pizza',
        name: 'Farmhouse Pizza',
        category: 'Pizza',
        price: 349,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=120&auto=format&fit=crop&q=80',
        emoji: '🍕'
      },
      {
        id: 'paneer-tikka-pizza',
        name: 'Paneer Tikka Pizza',
        category: 'Pizza',
        price: 299,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=120&auto=format&fit=crop&q=80',
        emoji: '🍕'
      },
      {
        id: 'pasta-alfredo',
        name: 'Pasta Alfredo',
        category: 'Pasta',
        price: 349,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=120&auto=format&fit=crop&q=80',
        emoji: '🍝'
      },
      {
        id: 'caesar-salad',
        name: 'Caesar Salad',
        category: 'Salad',
        price: 249,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=120&auto=format&fit=crop&q=80',
        emoji: '🥗'
      },
      {
        id: 'cold-coffee',
        name: 'Cold Coffee',
        category: 'Beverage',
        price: 149,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=120&auto=format&fit=crop&q=80',
        emoji: '☕'
      },
      {
        id: 'veggie-burger',
        name: 'Veggie Burger',
        category: 'Burger',
        price: 249,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=120&auto=format&fit=crop&q=80',
        emoji: '🍔'
      },
      {
        id: 'chicken-burger',
        name: 'Chicken Burger',
        category: 'Burger',
        price: 299,
        variant: 'Regular',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=120&auto=format&fit=crop&q=80',
        emoji: '🍔'
      }
    ];

    const rewardTypesList = [
      {
        id: 'cashback',
        title: 'Cashback',
        badge: 'High Retention',
        badgeClass: 'bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6]',
        desc: 'Get a % or fixed amount back on eligible orders.',
        icon: CreditCard,
        iconBg: 'bg-[#F3E8FF]',
        iconColor: 'text-[#7C3AED]'
      },
      {
        id: 'reward_points',
        title: 'Reward Points',
        badge: 'Tiered',
        badgeClass: 'bg-[#F3E8FF] text-[#7C3AED] border border-purple-200/50',
        desc: 'Earn points on every purchase. Redeem for future orders.',
        icon: Star,
        iconBg: 'bg-[#FEF3C7]',
        iconColor: 'text-amber-500'
      },
      {
        id: 'free_item',
        title: 'Free Item',
        badge: 'Basket Booster',
        badgeClass: 'bg-[#FCE7F3] text-[#DB2777] border border-pink-200/50',
        desc: 'Offer complimentary item from your menu.',
        icon: Gift,
        iconBg: 'bg-[#FCE7F3]',
        iconColor: 'text-pink-500'
      },
      {
        id: 'discount',
        title: 'Discount',
        badge: 'Most Popular',
        badgeClass: 'bg-[#FFE4E6] text-[#E11D48] border border-rose-200/50',
        desc: 'Get a % or fixed amount discount on eligible orders.',
        icon: Percent,
        iconBg: 'bg-[#F3E8FF]',
        iconColor: 'text-[#7C3AED]'
      },
      {
        id: 'nominal_item',
        title: 'Nominal Priced Item',
        badge: 'Add-on',
        badgeClass: 'bg-[#CCFBF1] text-[#0D9488] border border-teal-200/50',
        desc: 'Offer selected items at an irresistible low price like ₹19.',
        icon: Coins,
        iconBg: 'bg-[#CCFBF1]',
        iconColor: 'text-[#0D9488]'
      },
      {
        id: 'combo',
        title: 'Combo Offers',
        badge: 'Bundle',
        badgeClass: 'bg-[#FFEDD5] text-[#EA580C] border border-orange-200/50',
        desc: 'Curate or offer fixed & custom item bundles.',
        icon: Package,
        iconBg: 'bg-[#FFEDD5]',
        iconColor: 'text-orange-500'
      },
      {
        id: 'bogo',
        title: 'Buy X Get Y Free',
        badge: 'BOGO',
        badgeClass: 'bg-[#F3E8FF] text-[#7C3AED] border border-purple-200/50',
        desc: 'Give complimentary item on purchasing qualifying quantity.',
        icon: ShoppingBag,
        iconBg: 'bg-[#F3E8FF]',
        iconColor: 'text-[#7C3AED]'
      }
    ];

    // Filtered items for BOGO and Free Item
    const filteredFreeItems = desktopMenuItems.filter(item =>
      item.name.toLowerCase().includes(freeItemSearch.toLowerCase())
    );

    const filteredBogoItems = desktopMenuItems.filter(item => {
      const matchSearch = item.name.toLowerCase().includes(bogoSearch.toLowerCase());
      const matchCategory = bogoCategory === 'All' || item.category === bogoCategory;
      return matchSearch && matchCategory;
    });

    // VIEW A: List of 7 Reward Cards (Image 1)
    if (!isConfiguringReward) {
      return (
        <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
          <div className="max-w-[1200px] mx-auto space-y-6">
            {renderDesktopStepper()}

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-black text-[#1E1548]">Rewards &amp; Offer</h2>
                <p className="text-xs text-gray-500 mt-0.5 font-medium">
                  Define the reward you want to offer when the selected condition is met.
                </p>
              </div>

              {/* 7 Reward Cards Stack */}
              <div className="space-y-3">
                {rewardTypesList.map((item) => {
                  const IconComponent = item.icon;
                  const isSelected = selectedRewardType === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedRewardType(item.id);
                        setRewardSelection(item.title);
                      }}
                      onDoubleClick={() => {
                        setSelectedRewardType(item.id);
                        setRewardSelection(item.title);
                        setIsConfiguringReward(true);
                      }}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between bg-white ${
                        isSelected
                          ? 'border-2 border-[#5844A8] shadow-sm'
                          : 'border-gray-200/80 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'border-[#5844A8]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#5844A8]" />}
                        </div>

                        <div className={`w-10 h-10 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center flex-shrink-0`}>
                          <IconComponent className="w-5 h-5" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-[#1E1548]">{item.title}</h4>
                            <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full ${item.badgeClass}`}>
                              {item.badge}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5 truncate">{item.desc}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRewardType(item.id);
                          setRewardSelection(item.title);
                          setIsConfiguringReward(true);
                        }}
                        className="p-1 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                        title="Configure reward"
                      >
                        <ChevronRight className="w-5 h-5 text-gray-400 hover:text-[#5844A8] flex-shrink-0" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Bar for List View */}
            <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
              >
                Back
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSubmitCampaign(true)}
                  className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-gray-500" />
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => setIsConfiguringReward(true)}
                  className="px-6 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
                >
                  Next &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // VIEW B: Detailed Configuration Screens (Images 2, 3, 4, 5)
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          {/* Back link */}
          <button
            type="button"
            onClick={() => setIsConfiguringReward(false)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E1548] hover:text-[#5844A8] cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Rewards type
          </button>

          {/* MAIN CARD CONTAINER */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 border border-purple-50 shadow-sm space-y-6">

            {/* DETAIL 1: CASHBACK (Image 2) */}
            {selectedRewardType === 'cashback' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E1548]">Cashback</h3>
                      <span className="bg-[#E6F4EA] text-[#137333] border border-[#CEEAD6] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        High Retention
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Get a % or fixed amount back on eligible orders.
                    </p>
                  </div>
                </div>

                {/* Type of cashback */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-2">Type of cashback</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setCashbackType('percentage')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        cashbackType === 'percentage'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        cashbackType === 'percentage' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {cashbackType === 'percentage' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        %
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Percentage</div>
                        <div className="text-[11px] text-gray-400">e.g. 10% of bill</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setCashbackType('fixed')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        cashbackType === 'fixed'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        cashbackType === 'fixed' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {cashbackType === 'fixed' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        ₹
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Fixed amount</div>
                        <div className="text-[11px] text-gray-400">e.g. ₹50 cashback</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enter percentage or fixed amount */}
                {cashbackType === 'percentage' ? (
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Enter percentage <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative max-w-xl">
                      <input
                        type="number"
                        value={cashbackPercentage}
                        onChange={(e) => setCashbackPercentage(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        placeholder="10"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        %
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Enter fixed cashback amount <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative max-w-xl">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={cashbackFixedAmount}
                        onChange={(e) => setCashbackFixedAmount(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        placeholder="50"
                      />
                    </div>
                  </div>
                )}

                {/* Max cashback amount Capping (optional) */}
                <div className="bg-[#FAF8FF]/60 p-4 rounded-2xl border border-purple-50/70 space-y-2">
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Max cashback amount Capping (optional)
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Max cashback Amount
                    </label>
                    <div className="flex items-center gap-2 max-w-sm">
                      <select
                        value={cashbackCurrency}
                        onChange={(e) => setCashbackCurrency(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                      </select>
                      <input
                        type="number"
                        value={cashbackMaxCapping}
                        onChange={(e) => setCashbackMaxCapping(e.target.value)}
                        placeholder="200"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1">e.g. 10%, upto ₹100</p>
                  </div>
                </div>

                {/* Select applicable on */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Select applicable on <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer max-w-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">All items</div>
                        <div className="text-[11px] text-gray-400">Entire menu catalog included</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL 2: REWARD POINTS (Image 3) */}
            {selectedRewardType === 'reward_points' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-500 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E1548]">Reward Points</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Earn points on every purchase. Redeem for future orders.
                    </p>
                  </div>
                </div>

                {/* Points Type */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-2">Points Type</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setRewardPointsType('percentage')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        rewardPointsType === 'percentage'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        rewardPointsType === 'percentage' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {rewardPointsType === 'percentage' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        %
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Percentage</div>
                        <div className="text-[11px] text-gray-400">e.g. 10% of bill</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setRewardPointsType('fixed')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        rewardPointsType === 'fixed'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        rewardPointsType === 'fixed' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {rewardPointsType === 'fixed' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        <Coins className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Fixed amount</div>
                        <div className="text-[11px] text-gray-400">e.g. 50 points flat</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Two Column Row: Percentage / Points + Points Value */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Enter percentage or fixed points */}
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      {rewardPointsType === 'percentage' ? 'Enter percentage' : 'Enter points'} <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={rewardPointsType === 'percentage' ? rewardPointsPercentage : rewardPointsFixedAmount}
                        onChange={(e) =>
                          rewardPointsType === 'percentage'
                            ? setRewardPointsPercentage(e.target.value)
                            : setRewardPointsFixedAmount(e.target.value)
                        }
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        placeholder={rewardPointsType === 'percentage' ? '10' : '50'}
                      />
                      {rewardPointsType === 'percentage' && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                          %
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Points value */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-[#1E1548]">
                        Points value <span className="text-rose-500">*</span>
                      </label>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-500 border border-pink-100">
                        1 Point = ₹1
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={rewardPointsValue}
                        onChange={(e) => setRewardPointsValue(e.target.value)}
                        placeholder="1"
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                      <select
                        value={rewardPointsCurrency}
                        onChange={(e) => setRewardPointsCurrency(e.target.value)}
                        className="bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                      </select>
                    </div>
                    <p className="text-[11px] text-[#7C3AED] font-medium flex items-center gap-1 mt-1">
                      <Info className="w-3.5 h-3.5 shrink-0" /> e.g. 5% = 1 point per ₹20 spent
                    </p>
                  </div>
                </div>

                {/* Max points per order */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Max points per order
                  </label>
                  <div className="relative max-w-md">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={rewardPointsMaxPoints}
                      onChange={(e) => setRewardPointsMaxPoints(e.target.value)}
                      placeholder="100"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-10 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                    <Clock className="w-4 h-4 text-gray-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">e.g. 10%, upto 100 points</p>
                </div>

                {/* Select applicable on */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Select applicable on <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer max-w-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">All items</div>
                        <div className="text-[11px] text-gray-400">Entire menu catalog included</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL 3: FREE ITEM (Image 4) */}
            {selectedRewardType === 'free_item' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pink-100/70 text-pink-500 flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#1E1548]">Free Item</h3>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Offer complimentary item from your menu.
                    </p>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Quantity <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setFreeItemQuantity(q => Math.max(1, q - 1))}
                      className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold text-[#1E1548]">{freeItemQuantity}</span>
                    <button
                      type="button"
                      onClick={() => setFreeItemQuantity(q => q + 1)}
                      className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Search menu items */}
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={freeItemSearch}
                    onChange={(e) => setFreeItemSearch(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                {/* Menu items radio list */}
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {filteredFreeItems.map((item) => {
                    const isSelected = freeItemSelectedItem === item.name;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setFreeItemSelectedItem(item.name)}
                        className={`p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-[#5844A8]' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                          </div>

                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                          />

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[#1E1548]">{item.name}</span>
                              {item.badge && (
                                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeClass || 'bg-purple-50 text-purple-600'}`}>
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0 pl-2">
                          <span className="text-xs font-bold text-[#1E1548]">₹ {item.price}</span>
                          <span className="text-[10px] text-gray-400 ml-1">Regular</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DETAIL 4: DISCOUNT */}
            {selectedRewardType === 'discount' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                    <Percent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E1548]">Discount</h3>
                      <span className="bg-[#FFE4E6] text-[#E11D48] border border-rose-200/50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        Most Popular
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Get a % or fixed amount discount on eligible orders.
                    </p>
                  </div>
                </div>

                {/* Type of discount */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-2">Type of discount</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setDiscountRewardType('percentage')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        discountRewardType === 'percentage'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        discountRewardType === 'percentage' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {discountRewardType === 'percentage' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-purple-100 text-[#7C3AED] font-bold text-xs flex items-center justify-center flex-shrink-0">
                        %
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Percentage</div>
                        <div className="text-[11px] text-gray-400">e.g. 15% of bill</div>
                      </div>
                    </div>

                    <div
                      onClick={() => setDiscountRewardType('fixed')}
                      className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                        discountRewardType === 'fixed'
                          ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        discountRewardType === 'fixed' ? 'border-[#5844A8]' : 'border-gray-300'
                      }`}>
                        {discountRewardType === 'fixed' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                      </div>
                      <div className="w-7 h-7 rounded-lg bg-gray-100 text-gray-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                        ₹
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">Fixed amount</div>
                        <div className="text-[11px] text-gray-400">e.g. ₹100 flat discount</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enter value */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    {discountRewardType === 'percentage' ? 'Enter discount percentage' : 'Enter discount amount'} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative max-w-xl">
                    {discountRewardType === 'fixed' && (
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        ₹
                      </span>
                    )}
                    <input
                      type="number"
                      value={discountRewardType === 'percentage' ? discountRewardPercentage : discountRewardFixedAmount}
                      onChange={(e) =>
                        discountRewardType === 'percentage'
                          ? setDiscountRewardPercentage(e.target.value)
                          : setDiscountRewardFixedAmount(e.target.value)
                      }
                      className={`w-full bg-white border border-gray-200 rounded-xl ${
                        discountRewardType === 'fixed' ? 'pl-8' : 'pl-3.5'
                      } pr-8 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]`}
                      placeholder={discountRewardType === 'percentage' ? '15' : '100'}
                    />
                    {discountRewardType === 'percentage' && (
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        %
                      </span>
                    )}
                  </div>
                </div>

                {/* Max discount capping */}
                <div className="bg-[#FAF8FF]/60 p-4 rounded-2xl border border-purple-50/70 space-y-2">
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Max discount Amount Capping (optional)
                  </label>
                  <div className="relative max-w-sm">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                      ₹
                    </span>
                    <input
                      type="number"
                      value={discountRewardMaxCapping}
                      onChange={(e) => setDiscountRewardMaxCapping(e.target.value)}
                      placeholder="200"
                      className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3.5 py-2 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">e.g. 15%, upto ₹200</p>
                </div>

                {/* Select applicable on */}
                <div>
                  <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                    Select applicable on <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center justify-between p-3.5 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors cursor-pointer max-w-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                        <LayoutGrid className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-[#1E1548]">All items</div>
                        <div className="text-[11px] text-gray-400">Entire menu catalog included</div>
                      </div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL 5: NOMINAL PRICED ITEM (Exact match to Image 1) */}
            {selectedRewardType === 'nominal_item' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-teal-100/70 text-teal-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-black">₹</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E1548]">Nominal Priced Item</h3>
                      <span className="bg-[#CCFBF1] text-[#0D9488] border border-teal-200/50 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ADD-ON
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Offer selected items at an irresistible low price like ₹19.
                    </p>
                  </div>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Select Items & Set Revised Price (lg:col-span-8) */}
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-[#1E1548]">Select Item(s) &amp; Set Revised Price</h4>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Original rates shown with configurable revised offer pricing for selected items.
                      </p>
                    </div>

                    {/* Search & Category Filter */}
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="Search menu items..."
                          value={nominalSearch}
                          onChange={(e) => setNominalSearch(e.target.value)}
                          className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
                        />
                      </div>
                      <select
                        aria-label="Filter menu items by category"
                        className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      >
                        <option value="All Categories">All Categories</option>
                        <option value="Pizza">Pizza</option>
                        <option value="Pasta">Pasta</option>
                        <option value="Salad">Salad</option>
                        <option value="Beverage">Beverage</option>
                      </select>
                    </div>

                    {/* Items List Rows matching Image 1 */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 'margherita-pizza',
                          name: 'Margherita Pizza',
                          subtitle: 'Best seller',
                          originalPrice: 299,
                          image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&auto=format&fit=crop&q=80'
                        },
                        {
                          id: 'pasta-alfredo',
                          name: 'Pasta Alfredo',
                          subtitle: 'Signature cream sauce',
                          originalPrice: 399,
                          image: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281691?w=120&auto=format&fit=crop&q=80'
                        },
                        {
                          id: 'caesar-salad',
                          name: 'Caesar Salad',
                          subtitle: 'Parmesan & Croutons',
                          originalPrice: 399,
                          image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=120&auto=format&fit=crop&q=80'
                        },
                        {
                          id: 'cold-coffee',
                          name: 'Cold coffee',
                          subtitle: 'Parmesan & Croutons',
                          originalPrice: 399,
                          image: 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=120&auto=format&fit=crop&q=80'
                        }
                      ].filter(it => it.name.toLowerCase().includes(nominalSearch.toLowerCase())).map((item) => {
                        const isChecked = nominalSelectedItem === item.name;
                        const currentRevised = nominalPrice || '49';
                        const discountAmt = Math.max(0, item.originalPrice - Number(currentRevised));
                        const discountPct = Math.round((discountAmt / item.originalPrice) * 100);

                        return (
                          <div
                            key={item.id}
                            className={`p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white ${
                              isChecked ? 'border-2 border-[#5844A8] shadow-2xs' : 'border-gray-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => setNominalSelectedItem(isChecked ? '' : item.name)}
                                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                                  isChecked ? 'bg-[#5844A8] border-[#5844A8] text-white' : 'border-gray-300 bg-white'
                                }`}
                              >
                                {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                              </button>

                              <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" />

                              <div>
                                <div className="text-xs font-bold text-[#1E1548]">{item.name}</div>
                                <div className="text-[11px] text-rose-500 font-semibold">• {item.subtitle}</div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 self-end sm:self-center">
                              <div className="text-right">
                                <div className="text-[10px] text-gray-400">Original rate</div>
                                <div className="text-xs font-bold text-[#1E1548]">₹ {item.originalPrice}</div>
                              </div>

                              {isChecked ? (
                                <div className="flex items-center gap-2 bg-[#FFF1F2] border border-pink-100 rounded-xl p-1.5 pl-3">
                                  <div>
                                    <div className="text-[10px] font-bold text-rose-500">Revised offer price</div>
                                    <div className="text-[10px] text-rose-400 font-medium">
                                      ₹{discountAmt} discount — {discountPct}% OFF
                                    </div>
                                  </div>
                                  <div className="flex items-center bg-white border border-gray-200 rounded-lg px-2 py-1">
                                    <span className="text-xs text-gray-400 font-bold mr-1">₹</span>
                                    <input
                                      type="number"
                                      value={nominalPrice}
                                      onChange={(e) => setNominalPrice(e.target.value)}
                                      className="w-12 text-xs font-bold text-[#1E1548] focus:outline-none"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => showToast(`Revised price ₹${nominalPrice} applied to ${item.name}`)}
                                    className="px-2.5 py-1 bg-[#5844A8] text-white text-[11px] font-bold rounded-lg hover:bg-[#47368E] cursor-pointer"
                                  >
                                    Apply
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setNominalSelectedItem(item.name)}
                                  className="text-[11px] text-purple-600 hover:underline cursor-pointer"
                                >
                                  customize revised offer rate &rarr; Set revised price
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Right Column: Item Preview & Guidelines (lg:col-span-4) */}
                  <div className="lg:col-span-4 space-y-4">
                    {/* Item Preview Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-2xs space-y-3">
                      <div className="text-xs font-bold text-[#1E1548]">Item Preview</div>
                      <div className="border border-purple-50 rounded-xl p-3 bg-[#FAF8FF]/60 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&auto=format&fit=crop&q=80"
                            alt="Margherita Pizza"
                            className="w-10 h-10 rounded-xl object-cover"
                          />
                          <div>
                            <div className="text-xs font-bold text-[#1E1548]">{nominalSelectedItem || 'Margherita Pizza'}</div>
                            <div className="text-[10px] text-rose-500 font-semibold">• Best seller</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] text-gray-400">Original rate</div>
                          <div className="text-xs font-bold text-gray-500 line-through">₹ 299</div>
                        </div>
                      </div>

                      <div className="bg-[#FFF1F2] border border-pink-100 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] font-bold text-rose-600">Revised offer price</div>
                          <div className="text-[10px] text-rose-400 font-medium">
                            ₹{Math.max(0, 299 - Number(nominalPrice || 49))} discount — {Math.round((Math.max(0, 299 - Number(nominalPrice || 49)) / 299) * 100)}% OFF
                          </div>
                        </div>
                        <div className="text-lg font-black text-[#1E1548]">
                          ₹ {nominalPrice || '49'}
                        </div>
                      </div>
                    </div>

                    {/* Nominal Pricing Guidelines */}
                    <div className="bg-[#FAF8FF] border border-purple-100/70 rounded-2xl p-4 space-y-2.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#5844A8]">
                        <Info className="w-4 h-4" />
                        <span>Nominal Pricing Guidelines</span>
                      </div>
                      <ul className="text-[11px] text-gray-500 space-y-1.5 pl-1 leading-relaxed">
                        <li>• Set a low, attractive price to increase engagement.</li>
                        <li>• Applicable only on selected items.</li>
                        <li>• Customer will get the item at the revised price during campaign period.</li>
                        <li>• You can set different revised prices for different items.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL 6: COMBO OFFERS */}
            {selectedRewardType === 'combo' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-orange-100/70 text-orange-600 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E1548]">Combo Offers</h3>
                      <span className="bg-[#FFEDD5] text-[#EA580C] border border-orange-200/50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        Bundle
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Curate or offer fixed &amp; custom item bundles.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Bundle Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={comboBundleName}
                      onChange={(e) => setComboBundleName(e.target.value)}
                      placeholder="e.g. Pizza & Cold Drink Combo"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                      Special Combo Price <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={comboPrice}
                        onChange={(e) => setComboPrice(e.target.value)}
                        placeholder="399"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-8 pr-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  </div>
                </div>

                {/* Bundle items selector */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-[#1E1548]">
                      Select items to include in bundle ({comboSelectedItems.length} selected)
                    </label>
                  </div>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    {desktopMenuItems.map((item) => {
                      const isChecked = comboSelectedItems.includes(item.name);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setComboSelectedItems(prev =>
                              prev.includes(item.name) ? prev.filter(n => n !== item.name) : [...prev, item.name]
                            );
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            isChecked ? 'border-purple-200 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                              isChecked ? 'bg-[#5844A8] border-[#5844A8] text-white' : 'border-gray-300 bg-white'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                            </div>
                            <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                            <span className="text-xs font-bold text-[#1E1548]">{item.name}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-600">₹ {item.price}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* DETAIL 7: BUY X GET Y FREE (BOGO) (Image 5) */}
            {selectedRewardType === 'bogo' && (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-[#7C3AED] flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-[#1E1548]">Buy X Get Y Free</h3>
                      <span className="bg-[#F3E8FF] text-[#7C3AED] border border-purple-200/50 text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                        BOGO
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Give complimentary item on purchasing qualifying quantity.
                    </p>
                  </div>
                </div>

                {/* 2-Column Responsive Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Quantities + Select Items */}
                  <div className="lg:col-span-7 space-y-5">
                    {/* Buy quantity & Get free */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                          Buy quantity <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setBogoBuyQty(q => Math.max(1, q - 1))}
                            className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#1E1548]">{bogoBuyQty}</span>
                          <button
                            type="button"
                            onClick={() => setBogoBuyQty(q => q + 1)}
                            className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <label className="block text-xs font-bold text-[#1E1548]">
                            Get free <span className="text-rose-500">*</span>
                          </label>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-50 text-pink-500 border border-pink-100">
                            100% OFF
                          </span>
                        </div>
                        <div className="flex items-center border border-gray-200 rounded-xl w-fit overflow-hidden bg-white shadow-2xs">
                          <button
                            type="button"
                            onClick={() => setBogoGetQty(q => Math.max(1, q - 1))}
                            className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-bold text-[#1E1548]">{bogoGetQty}</span>
                          <button
                            type="button"
                            onClick={() => setBogoGetQty(q => q + 1)}
                            className="px-3.5 py-2 text-gray-500 hover:text-black hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Select items section */}
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-[#1E1548]">
                          Select items <span className="text-rose-500">*</span>
                        </label>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Choose the items that qualify for this offer.
                        </p>
                      </div>

                      {/* Search + Category Dropdown */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            placeholder="Search menu items..."
                            value={bogoSearch}
                            onChange={(e) => setBogoSearch(e.target.value)}
                            className="w-full pl-9 pr-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-[#1E1548] placeholder:text-gray-400 focus:outline-none focus:border-[#5844A8]"
                          />
                        </div>
                        <select
                          value={bogoCategory}
                          onChange={(e) => setBogoCategory(e.target.value)}
                          className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                        >
                          <option value="All">All</option>
                          <option value="Pizza">Pizza</option>
                          <option value="Burger">Burger</option>
                          <option value="Pasta">Pasta</option>
                        </select>
                      </div>

                      {/* Items Checklist */}
                      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
                        {filteredBogoItems.map((item) => {
                          const isChecked = bogoSelectedItems.includes(item.name);
                          return (
                            <div
                              key={item.id}
                              onClick={() => {
                                setBogoSelectedItems(prev =>
                                  prev.includes(item.name) ? prev.filter(n => n !== item.name) : [...prev, item.name]
                                );
                              }}
                              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isChecked ? 'border-purple-200 bg-purple-50/20' : 'border-gray-200 hover:border-gray-300 bg-white'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                  isChecked ? 'bg-[#5844A8] border-[#5844A8] text-white' : 'border-gray-300 bg-white'
                                }`}>
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                                <span className="text-xs font-bold text-[#1E1548]">{item.name}</span>
                              </div>
                              <span className="text-xs font-bold text-gray-600">₹ {item.price}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Free Item Rule */}
                  <div className="lg:col-span-5 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1E1548]">
                        Free item rule <span className="text-rose-500">*</span>
                      </label>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Who should the customer get for free?
                      </p>
                    </div>

                    {/* Rule Cards */}
                    <div className="space-y-3">
                      {/* Option 1: Same item */}
                      <div
                        onClick={() => setBogoRule('same_item')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          bogoRule === 'same_item'
                            ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            bogoRule === 'same_item' ? 'border-[#5844A8]' : 'border-gray-300'
                          }`}>
                            {bogoRule === 'same_item' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-[#1E1548]">Same item</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">Get the same item free as purchased.</p>

                            {/* Visual Diagram Box */}
                            <div className="mt-3 p-3 bg-[#FAF8FF] rounded-xl border border-purple-50 text-center">
                              <div className="flex items-center justify-center gap-2 text-base">
                                <span>🍕</span>
                                <span className="text-xs text-gray-400">&rarr;</span>
                                <span>🍕</span>
                              </div>
                              <div className="text-[11px] font-bold text-[#1E1548] mt-1">Buy 1 = Get 1</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Option 2: Any item at the same price */}
                      <div
                        onClick={() => setBogoRule('any_item_same_price')}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                          bogoRule === 'any_item_same_price'
                            ? 'border-2 border-[#5844A8] bg-white shadow-2xs'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            bogoRule === 'any_item_same_price' ? 'border-[#5844A8]' : 'border-gray-300'
                          }`}>
                            {bogoRule === 'any_item_same_price' && <div className="w-2 h-2 rounded-full bg-[#5844A8]" />}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-xs font-bold text-[#1E1548]">Any item at the same price</h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">Customer can choose another item of the same or lower price.</p>

                            {/* Visual Diagram Box */}
                            <div className="mt-3 p-3 bg-[#FAF8FF] rounded-xl border border-purple-50 text-center">
                              <div className="flex items-center justify-center gap-2 text-base">
                                <span>🍔</span>
                                <span className="text-xs text-gray-400">&rarr;</span>
                                <span>🍕</span>
                              </div>
                              <div className="text-[11px] font-bold text-[#1E1548] mt-1">Buy ₹299 = Get ₹299</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info Callout */}
                    <div className="bg-purple-50/50 border border-purple-100 rounded-xl p-3 flex items-start gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Info className="w-3 h-3" />
                      </div>
                      <p className="text-[11px] text-purple-900 leading-relaxed font-medium">
                        The free item must have the same price as the qualifying item purchased.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Sticky Bottom Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setIsConfiguringReward(false)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Back
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmitCampaign(true)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  // Synchronize reward state values into desktopRewardValue for step 6 & payload
                  if (selectedRewardType === 'cashback') {
                    setDesktopRewardValue(cashbackType === 'percentage' ? `${cashbackPercentage}%` : `₹${cashbackFixedAmount}`);
                  } else if (selectedRewardType === 'reward_points') {
                    setDesktopRewardValue(rewardPointsType === 'percentage' ? `${rewardPointsPercentage}%` : `${rewardPointsFixedAmount} pts`);
                  } else if (selectedRewardType === 'free_item') {
                    setDesktopRewardValue(`${freeItemQuantity}x ${freeItemSelectedItem}`);
                  } else if (selectedRewardType === 'discount') {
                    setDesktopRewardValue(discountRewardType === 'percentage' ? `${discountRewardPercentage}%` : `₹${discountRewardFixedAmount}`);
                  } else if (selectedRewardType === 'nominal_item') {
                    setDesktopRewardValue(`₹${nominalPrice} ${nominalSelectedItem}`);
                  } else if (selectedRewardType === 'combo') {
                    setDesktopRewardValue(`₹${comboPrice} ${comboBundleName}`);
                  } else if (selectedRewardType === 'bogo') {
                    setDesktopRewardValue(`Buy ${bogoBuyQty} Get ${bogoGetQty} Free`);
                  }
                  setCurrentStep(5);
                }}
                className="px-6 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Reusable High-Fidelity Mobile Preview Mockup for Step 5 & Step 6 */}
  const renderMobilePhonePreviewMockup = () => (
    <div className="w-[330px] sm:w-[350px] bg-[#0E0C14] rounded-[48px] p-2.5 shadow-2xl border-[10px] sm:border-[11px] border-[#0E0C14] mx-auto relative select-none shadow-purple-950/25">
      {/* Dynamic Island */}
      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 sm:h-5.5 bg-black rounded-full z-20 flex items-center justify-end px-3 shadow-xs">
        <div className="w-2.5 h-2.5 rounded-full bg-[#1A1824] border border-gray-700/60" />
      </div>

      {/* Phone Screen */}
      <div className="bg-[#FAF8FF] rounded-[38px] overflow-hidden text-[#1E1548] font-sans pb-4 shadow-inner">
        {/* Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-bold text-gray-900">
          <span className="font-semibold tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5 text-gray-900">
            {/* Cellular Signal Icon */}
            <div className="flex items-end gap-[1.5px] h-2.5">
              <span className="w-[2.5px] h-1 bg-gray-900 rounded-[0.5px]" />
              <span className="w-[2.5px] h-1.5 bg-gray-900 rounded-[0.5px]" />
              <span className="w-[2.5px] h-2 bg-gray-900 rounded-[0.5px]" />
              <span className="w-[2.5px] h-2.5 bg-gray-900 rounded-[0.5px]" />
            </div>
            {/* Wifi Icon */}
            <Wifi className="w-3 h-3 text-gray-900" />
            {/* Battery Icon */}
            <div className="w-4 h-2 rounded-[2px] border border-gray-900 flex items-center p-[1px] relative">
              <div className="w-2.5 h-full bg-gray-900 rounded-[1px]" />
              <div className="w-[1px] h-1 bg-gray-900 absolute -right-[2px] rounded-r-[0.5px]" />
            </div>
          </div>
        </div>

        {/* Banner Graphic Card */}
        <div className="p-3 pt-1">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF0F5] via-[#FFF5F7] to-[#F5F0FF] border border-pink-100/90 p-4 shadow-xs min-h-[160px] flex flex-col justify-between">
            <div className="max-w-[58%] z-10 relative">
              {bannerSpecialTag && (
                <span className="inline-block bg-[#E11D48] text-white text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1.5 shadow-2xs">
                  {bannerSpecialTag}
                </span>
              )}
              <h3 className="text-[17px] font-black text-[#1E1548] leading-tight">
                {bannerOfferTitle || 'Buy 1 Get 1 Free'}
              </h3>
              <p className="text-xs font-bold text-[#E11D48] mt-0.5">
                {bannerSubtext || 'On all pizzas'}
              </p>
            </div>

            {/* Food illustration on right matching user's image */}
            <img
              src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=320&auto=format&fit=crop&q=80"
              alt="Offer Item"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-28 h-28 object-cover rounded-full shadow-md pointer-events-none border-2 border-white/60"
            />

            {/* Validity & Location Pills */}
            <div className="flex flex-col gap-1.5 mt-3 relative z-10 max-w-[62%]">
              {bannerShowValidity && (
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-white text-[9.5px] font-semibold text-gray-700 px-2.5 py-1 rounded-lg shadow-2xs">
                  <Calendar className="w-2.5 h-2.5 text-gray-500 shrink-0" />
                  <span className="truncate">Valid till {bannerValidityDate || '31 Dec 2025'}</span>
                </span>
              )}
              {bannerShowLocation && (
                <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-white text-[9.5px] font-semibold text-gray-700 px-2.5 py-1 rounded-lg shadow-2xs">
                  <MapPin className="w-2.5 h-2.5 text-gray-500 shrink-0" />
                  <span className="truncate">{bannerLocationText || 'Available at all branches'}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Offer Details */}
        <div className="px-3 space-y-2.5">
          <div className="bg-white rounded-2xl p-4 border border-purple-50/80 shadow-xs">
            <h4 className="text-xs font-bold text-[#1E1548]">Offer Details</h4>
            <p className="text-[11px] text-gray-600 mt-1 leading-relaxed">
              {bannerDescription || 'Enjoy 1+1 on all pizzas. Treat yourself and a friend to your favourite pizza!'}
            </p>
          </div>

          {/* Terms & Conditions */}
          <div className="bg-white rounded-2xl p-4 border border-purple-50/80 shadow-xs">
            <h4 className="text-xs font-bold text-[#1E1548]">Terms &amp; Conditions</h4>
            <ul className="text-[10px] text-gray-600 mt-1.5 space-y-1">
              <li className="flex items-start gap-1.5">• Valid on all pizza variants.</li>
              <li className="flex items-start gap-1.5">• Lowest priced item will be free.</li>
              <li className="flex items-start gap-1.5">• Cannot be clubbed with other offers.</li>
              <li className="flex items-start gap-1.5">• Valid at all outlets.</li>
              <li className="flex items-start gap-1.5">• Valid till {bannerValidityDate || '31 Dec 2025'}.</li>
            </ul>
          </div>

          {/* Redeem Button */}
          <button
            type="button"
            className="w-full py-3.5 bg-[#48348C] hover:bg-[#3D2C76] text-white text-xs font-bold rounded-2xl shadow-md shadow-purple-900/20 text-center transition-colors cursor-pointer"
          >
            Redeem Offer
          </button>
        </div>
      </div>
    </div>
  );

  {/* High-Fidelity Desktop Browser Preview Mockup */}
  const renderDesktopBrowserPreviewMockup = () => (
    <div className="w-full bg-white rounded-2xl border border-purple-100 shadow-xl overflow-hidden select-none transition-all text-[#1E1548]">
      {/* Browser Navigation Bar */}
      <div className="bg-[#FAF8FF] px-4 py-2.5 border-b border-purple-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
        </div>
        <div className="flex-1 max-w-[280px] bg-white border border-purple-100 rounded-lg px-2.5 py-1 flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
          <Lock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
          <span className="truncate">https://revia.co/campaign/bogo-pizza</span>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <RefreshCw className="w-3 h-3" />
        </div>
      </div>

      {/* Web Page Viewport */}
      <div className="bg-[#FAF8FF] p-4 sm:p-5 space-y-4 max-h-[640px] overflow-y-auto">
        {/* Store Web Header */}
        <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-purple-50 shadow-2xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center font-bold text-xs">
              R
            </div>
            <span className="font-extrabold text-xs text-[#1E1548]">Revia Café &amp; Roastery</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-gray-600">
            <span className="hidden sm:inline">Menu</span>
            <span className="hidden sm:inline">Locations</span>
            <span className="px-2.5 py-1 rounded-full bg-purple-50 text-[#5844A8] font-bold text-[10px]">
              Guest Offer
            </span>
          </div>
        </div>

        {/* Hero Showcase Card */}
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFF0F5] via-[#FFF5F7] to-[#F5F0FF] border border-pink-100 p-5 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            <div className="sm:col-span-7 space-y-2">
              {bannerSpecialTag && (
                <span className="inline-block bg-[#E11D48] text-white text-[9.5px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
                  {bannerSpecialTag}
                </span>
              )}
              <h3 className="text-xl sm:text-2xl font-black text-[#1E1548] leading-tight">
                {bannerOfferTitle || 'Buy 1 Get 1 Free'}
              </h3>
              <p className="text-xs font-bold text-[#E11D48]">
                {bannerSubtext || 'On all pizzas'}
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {bannerShowValidity && (
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-white text-[10px] font-bold text-gray-700 px-2.5 py-1 rounded-lg shadow-2xs">
                    <Calendar className="w-3 h-3 text-gray-500" />
                    Valid till {bannerValidityDate || '31 Dec 2025'}
                  </span>
                )}
                {bannerShowLocation && (
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-xs border border-white text-[10px] font-bold text-gray-700 px-2.5 py-1 rounded-lg shadow-2xs">
                    <MapPin className="w-3 h-3 text-gray-500" />
                    {bannerLocationText || 'Available at all branches'}
                  </span>
                )}
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  className="px-6 py-2.5 bg-[#48348C] hover:bg-[#3D2C76] text-white text-xs font-bold rounded-xl shadow-md shadow-purple-900/20 cursor-pointer transition-colors"
                >
                  Redeem Offer Online
                </button>
              </div>
            </div>

            <div className="sm:col-span-5 flex justify-center sm:justify-end">
              <img
                src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80"
                alt="Offer Hero"
                className="w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl shadow-md"
              />
            </div>
          </div>
        </div>

        {/* Side by side: Offer Details & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-xs">
            <h4 className="text-xs font-bold text-[#1E1548]">Offer Details</h4>
            <p className="text-[11px] text-gray-600 mt-1.5 leading-relaxed">
              {bannerDescription || 'Enjoy 1+1 on all pizzas. Treat yourself and a friend to your favourite pizza!'}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-purple-50 shadow-xs">
            <h4 className="text-xs font-bold text-[#1E1548]">Terms &amp; Conditions</h4>
            <ul className="text-[10px] text-gray-600 mt-1.5 space-y-1">
              <li>• Valid on all pizza variants.</li>
              <li>• Lowest priced item will be free.</li>
              <li>• Cannot be clubbed with other offers.</li>
              <li>• Valid at all outlets till {bannerValidityDate || '31 Dec 2025'}.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  {/* Desktop Step 5: Templates / Customize Banner (Image 2) */}
  const renderDesktopStep5Templates = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          <div>
            <h2 className="text-xl font-black text-[#1E1548]">Review and Publish</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Review all the details of your campaign before publishing. You can make changes if needed.
            </p>
          </div>

          {/* 2-Column Layout matching Image 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Customize Banner Form (lg:col-span-7) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 lg:p-7 border border-purple-50 shadow-sm space-y-5">
              <div>
                <h3 className="text-base font-bold text-[#1E1548]">Customize Banner</h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Add content and design your banner for this offer.
                </p>
              </div>

              {/* Segmented Tabs: Content, Design, Layout */}
              <div className="flex items-center bg-[#FAF8FF] p-1 rounded-xl border border-purple-50/70 w-fit">
                {(['content', 'design', 'layout'] as const).map(tab => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setBannerTab(tab)}
                    className={`px-5 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      bannerTab === tab
                        ? 'bg-[#5844A8] text-white shadow-xs'
                        : 'text-gray-500 hover:text-[#1E1548]'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Banner Image Dropzone */}
              <div>
                <label className="block text-xs font-bold text-[#1E1548] mb-1.5">
                  Banner Image <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Upload Box */}
                  <div className="border-2 border-dashed border-purple-200/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-[#FAF8FF]/40 hover:bg-[#FAF8FF] transition-colors">
                    <div className="w-10 h-10 rounded-full bg-purple-100 text-[#7C3AED] flex items-center justify-center mb-2">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <div className="text-xs font-bold text-[#1E1548]">Upload Banner Image</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 mb-3">JPG, PNG (max 2MB)</div>
                    <button
                      type="button"
                      onClick={() => showToast('Image uploader opened')}
                      className="px-4 py-1.5 bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
                    >
                      Upload Image
                    </button>
                  </div>

                  {/* Recommended Size Specs */}
                  <div className="bg-[#FAF8FF] border border-purple-100/70 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[#1E1548] mb-1.5">Recommended Size</div>
                      <div className="text-xs font-bold text-[#5844A8]">1200 × 400 px (3:1 ratio)</div>
                      <ul className="text-[10px] text-gray-500 mt-2 space-y-0.5">
                        <li>• JPG, PNG (max 2MB)</li>
                        <li>• Keep text in safe area</li>
                        <li>• Use high-quality images</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => showToast('Browse templates modal')}
                      className="mt-3 flex items-center gap-1.5 text-xs font-bold text-[#5844A8] hover:underline cursor-pointer"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" /> Browse Templates
                    </button>
                  </div>
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 pt-1">
                {/* Offer Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#1E1548]">
                      Offer Title <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400">{bannerOfferTitle.length}/40</span>
                  </div>
                  <input
                    type="text"
                    maxLength={40}
                    value={bannerOfferTitle}
                    onChange={(e) => setBannerOfferTitle(e.target.value)}
                    placeholder="e.g. Buy 1 Get 1 Free"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                {/* Subtext */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#1E1548]">
                      Subtext <span className="text-rose-500">*</span>
                    </label>
                    <span className="text-[10px] text-gray-400">{bannerSubtext.length}/60</span>
                  </div>
                  <input
                    type="text"
                    maxLength={60}
                    value={bannerSubtext}
                    onChange={(e) => setBannerSubtext(e.target.value)}
                    placeholder="e.g. On all pizzas"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                {/* Special Tag */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-[#1E1548]">
                      Special Tag (Optional)
                    </label>
                    <span className="text-[10px] text-gray-400">{bannerSpecialTag.length}/20</span>
                  </div>
                  <input
                    type="text"
                    maxLength={20}
                    value={bannerSpecialTag}
                    onChange={(e) => setBannerSpecialTag(e.target.value)}
                    placeholder="e.g. Special Offer"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                  />
                </div>

                {/* Show Validity Date */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1E1548]">Show Validity Date</span>
                    <button
                      type="button"
                      onClick={() => setBannerShowValidity(v => !v)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        bannerShowValidity ? 'bg-[#5844A8]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                          bannerShowValidity ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {bannerShowValidity && (
                    <div className="relative">
                      <label className="block text-[11px] font-bold text-gray-400 mb-1">Validity Till *</label>
                      <input
                        type="text"
                        value={bannerValidityDate}
                        onChange={(e) => setBannerValidityDate(e.target.value)}
                        placeholder="31 Dec 2025"
                        className="w-full bg-white border border-gray-200 rounded-xl pl-3.5 pr-10 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                      <Calendar className="w-4 h-4 text-gray-400 absolute right-3.5 top-[28px]" />
                    </div>
                  )}
                </div>

                {/* Show Location */}
                <div className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-[#1E1548]">Show Location</span>
                    <button
                      type="button"
                      onClick={() => setBannerShowLocation(v => !v)}
                      className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                        bannerShowLocation ? 'bg-[#5844A8]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-xs transition-transform ${
                          bannerShowLocation ? 'translate-x-5' : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>

                  {bannerShowLocation && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-gray-400">Location Text *</label>
                        <span className="text-[10px] text-gray-400">{bannerLocationText.length}/60</span>
                      </div>
                      <input
                        type="text"
                        maxLength={60}
                        value={bannerLocationText}
                        onChange={(e) => setBannerLocationText(e.target.value)}
                        placeholder="Available at all branches"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#1E1548] focus:outline-none focus:border-[#5844A8]"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Preview Area (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1548]">
                    {previewDevice === 'mobile' ? 'Mobile Preview' : 'Desktop Preview'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {previewDevice === 'mobile'
                      ? 'This is how your campaign will look to customers.'
                      : 'This is how your campaign will look to customers on desktop.'}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    aria-label="Desktop preview"
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'text-[#5844A8] bg-purple-100/80 shadow-2xs font-bold'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    aria-label="Mobile preview"
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'text-[#5844A8] bg-purple-100/80 shadow-2xs font-bold'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {previewDevice === 'mobile'
                ? renderMobilePhonePreviewMockup()
                : renderDesktopBrowserPreviewMockup()}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setCurrentStep(4)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmitCampaign(true)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => setCurrentStep(6)}
                className="px-6 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Next &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  {/* Desktop Step 6: Review & Launch (Image 3) */}
  const renderDesktopStep6Review = () => {
    return (
      <div className="p-6 lg:p-8 space-y-6 font-sans text-[#1A1615] bg-[#FAF8FF] min-h-screen">
        <div className="max-w-[1200px] mx-auto space-y-6">
          {renderDesktopStepper()}

          <div>
            <h2 className="text-xl font-black text-[#1E1548]">Review and Publish</h2>
            <p className="text-xs text-gray-500 mt-0.5 font-medium">
              Review all the details of your campaign before publishing. You can make changes if needed.
            </p>
          </div>

          {/* 2-Column Layout matching Image 3 */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: 4 Summary Cards 2x2 Grid (lg:col-span-7) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Campaign Details */}
              <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1548]">Campaign Details</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="flex items-start gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=120&auto=format&fit=crop&q=80"
                    alt="Campaign"
                    className="w-12 h-12 rounded-xl object-cover shrink-0"
                  />
                  <div>
                    <div className="text-[10px] text-gray-400">Campaign Name</div>
                    <div className="text-xs font-bold text-[#1E1548] leading-tight mt-0.5">
                      {campaignName || 'Buy 1 Get 1 Free - Pizzas'}
                    </div>
                    <div className="text-[10px] text-gray-400 mt-2">Description</div>
                    <div className="text-[11px] text-gray-600 line-clamp-2 mt-0.5">
                      {bannerDescription || 'Enjoy 1+1 on all pizzas. Treat yourself and a friend to your favourite pizza!'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: Audience */}
              <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1548]">Audience</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Target Audience</span>
                    <span className="font-bold text-[#1E1548]">
                      {audienceTargetType === 'all' ? 'All Customers' : 'Loyalty Tiers'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Location</span>
                    <span className="font-bold text-[#1E1548]">All Outlets</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Age Range</span>
                    <span className="font-bold text-[#1E1548]">All Ages</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Visit Frequency</span>
                    <span className="font-bold text-[#1E1548]">First-time &amp; Returning</span>
                  </div>
                </div>
              </div>

              {/* Card 3: Conditions */}
              <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Calendar className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1548]">Conditions</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Minimum Purchase</span>
                    <span className="font-bold text-[#1E1548]">₹ 499</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Applicable At</span>
                    <span className="font-bold text-[#1E1548]">All Outlets</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Valid From</span>
                    <span className="font-bold text-[#1E1548]">{startDate || '12 Sep 2025'}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Offer Type</span>
                    <span className="font-bold text-[#1E1548]">Special Offer</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[10px] text-gray-400 block">Valid To</span>
                    <span className="font-bold text-[#1E1548]">{endDate || '30 Sep 2025'}</span>
                  </div>
                </div>
              </div>

              {/* Card 4: Rewards */}
              <div className="bg-white rounded-3xl p-5 border border-purple-50 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-[#7C3AED] flex items-center justify-center">
                      <Gift className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-[#1E1548]">Rewards</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-[10px] text-gray-400 block">Reward Type</span>
                    <span className="font-bold text-[#1E1548]">
                      {selectedRewardType === 'bogo' ? 'Buy 1 Get 1 Free' :
                       selectedRewardType === 'cashback' ? 'Cashback' :
                       selectedRewardType === 'reward_points' ? 'Reward Points' :
                       selectedRewardType === 'free_item' ? 'Free Item' :
                       selectedRewardType === 'nominal_item' ? 'Nominal Priced Item' : 'Discount'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Reward Limit</span>
                    <span className="font-bold text-[#1E1548]">1 per customer</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Reward Value</span>
                    <span className="font-bold text-[#1E1548]">
                      {desktopRewardValue || 'Free item (2nd pizza)'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block">Show Progress</span>
                    <span className="font-bold text-[#10B981]">Enabled</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preview Area (lg:col-span-5) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3 className="text-sm font-bold text-[#1E1548]">
                    {previewDevice === 'mobile' ? 'Mobile Preview' : 'Desktop Preview'}
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    {previewDevice === 'mobile'
                      ? 'This is how your campaign will look to customers.'
                      : 'This is how your campaign will look to customers on desktop.'}
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('desktop')}
                    aria-label="Desktop preview"
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === 'desktop'
                        ? 'text-[#5844A8] bg-purple-100/80 shadow-2xs font-bold'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    <Monitor className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice('mobile')}
                    aria-label="Mobile preview"
                    className={`p-1.5 rounded transition-colors cursor-pointer ${
                      previewDevice === 'mobile'
                        ? 'text-[#5844A8] bg-purple-100/80 shadow-2xs font-bold'
                        : 'text-gray-400 hover:text-black'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {previewDevice === 'mobile'
                ? renderMobilePhonePreviewMockup()
                : renderDesktopBrowserPreviewMockup()}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between pt-6 border-t border-purple-100/60">
            <button
              type="button"
              onClick={() => setCurrentStep(5)}
              className="text-xs font-bold text-gray-600 hover:text-black py-2.5 px-4 cursor-pointer"
            >
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleSubmitCampaign(true)}
                className="px-5 py-2.5 rounded-lg border border-gray-200 bg-white text-xs font-bold text-[#1E1548] hover:bg-gray-50 transition cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-gray-500" />
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => {
                  handleSubmitCampaign(false);
                  setViewMode('dashboard');
                }}
                className="px-8 py-2.5 rounded-lg bg-[#5844A8] hover:bg-[#47368E] text-white text-xs font-bold transition cursor-pointer shadow-md shadow-[#5844A8]/20 flex items-center gap-1.5"
              >
                Publish Campaign &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 1. Dashboard View (default)
  if (viewMode === 'dashboard') {
    return renderDashboard();
  }

  // 2. Builder Mode View: Renders the Figma desktop creation screens
  if (viewMode === 'builder') {
    if (currentStep === 1) {
      return renderDesktopStep1();
    }
    if (currentStep === 2) {
      return renderDesktopStep2();
    }
    if (currentStep === 3) {
      if (isConfiguringCondition) {
        if (selectedConditionType === 'visit') return renderDesktopStep3Detail();
        if (selectedConditionType === 'billing') return renderDesktopBillingDetail();
        if (selectedConditionType === 'stamps') return renderDesktopStampsDetail();
        if (selectedConditionType === 'item') return renderDesktopItemBasedDetail();
        if (selectedConditionType === 'happy_hours') return renderDesktopHappyHoursDetail();
        if (selectedConditionType === 'birthday') return renderDesktopBirthdayDetail();
        return renderDesktopStep3Detail();
      }
      return renderDesktopStep3List();
    }
    if (currentStep === 4) {
      return renderDesktopStep4Rewards();
    }
    if (currentStep === 5) {
      return renderDesktopStep5Templates();
    }
    if (currentStep === 6) {
      return renderDesktopStep6Review();
    }
  }

  // 3. Fallback: Always render the modern desktop dashboard so old roastery view is never rendered
  return renderDashboard();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col font-sans text-[#1A1615] relative">

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddCatalogItemModalOpen}
        onClose={() => setIsAddCatalogItemModalOpen(false)}
        onAdd={handleAddCatalogItem}
      />

      {/* Add Location Modal */}
      {isAddLocationOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-[#1A1615]">Add Location</h3>
              <button onClick={() => setIsAddLocationOpen(false)} className="text-[#9E9A93] hover:text-[#1A1615] bg-[#FAF8F5] p-2 rounded-full transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#6E6A66] mb-1.5">Search Branch/Outlet</label>
                <input type="text" placeholder="e.g. Downtown Flagship" className="w-full px-4 py-2.5 border border-[#EFECE6] bg-[#FAF8F5] rounded-lg text-sm focus:outline-none focus:border-[#D4A753]" />
              </div>
              <button onClick={() => setIsAddLocationOpen(false)} className="w-full py-3 bg-[#1A1615] text-white rounded-lg text-sm font-bold mt-2 shadow-md hover:bg-black transition-colors cursor-pointer">Confirm Location</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {campaignToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative text-center">
            <div className="w-12 h-12 bg-[#FEE2E2] text-[#DC2626] rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#1A1615] mb-2">Delete Campaign</h3>
            <p className="text-sm text-[#6E6A66] mb-6">
              Are you sure you want to permanently delete the campaign <span className="font-bold text-[#1A1615]">"{campaignToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button onClick={() => setCampaignToDelete(null)} className="flex-1 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] text-[#1A1615] rounded-lg text-sm font-bold shadow-sm hover:bg-[#EAE6E1] transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={confirmDeleteCampaign} className="flex-1 py-2.5 bg-[#DC2626] text-white rounded-lg text-sm font-bold shadow-sm hover:bg-[#B91C1C] transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. SHARED LAYOUT & TOP HEADER BAR */}
      <div className="p-4 lg:p-6 space-y-5 flex-1 max-w-[1600px] mx-auto w-full">
        {/* Responsive Header */}
        <div className="flex bg-white border border-[#EAE6E1] rounded-xl px-4 sm:px-6 py-4 flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 shadow-2xs mb-4">
        <div className="flex items-center gap-3">
          <button onClick={handleGoToDashboard} className="p-2 bg-[#FAF8F5] text-[#1A1615] hover:bg-[#FAF6EE] border border-[#EAE6E1] rounded-lg transition-colors cursor-pointer" title="Back to Dashboard">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">Campaign Builder</h1>
            <p className="text-xs text-[#7C746C]">Audit parameters, preview the live guest pass token, and deploy the campaign across roastery registers.</p>
          </div>
        </div>
        </div>
        {/* Stepper Indicator */}
        <div className="md:hidden flex justify-between items-center mb-4 px-1">
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <button onClick={() => setCurrentStep(prev => prev - 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-[#EAE6E1] rounded-full text-[#1A1615] shadow-2xs cursor-pointer shrink-0">
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <div className="text-[10px] font-bold text-[#9E782F] uppercase tracking-wider mb-0.5">Campaign Builder</div>
              <div className="text-xs text-[#7C746C]">Step {currentStep} of 5 · {steps.find(s => s.id === currentStep)?.name}</div>
            </div>
          </div>
          <div className="px-3 py-1 bg-[#EBF7F0] border border-[#15803D]/20 rounded-full text-[11px] font-bold text-[#15803D] flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]"></span> 20% Ready
          </div>
        </div>

        <div className="flex justify-between bg-white border border-[#EAE6E1] rounded-xl px-2 sm:px-4 py-5 shadow-2xs mb-6 relative">
          <div className="absolute top-9 left-[10%] right-[10%] h-0.5 bg-[#EAE6E1] z-0"></div>
          {steps.map((step) => {
            const isPast = step.id < currentStep;
            const isCurrent = step.id === currentStep;
            return (
              <div key={step.id} onClick={() => setCurrentStep(step.id)} className="relative z-10 flex flex-col items-center flex-1 cursor-pointer group">
                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all relative z-10 ${isPast ? 'bg-[#15803D] text-white border-2 border-[#15803D]' : isCurrent ? 'bg-gradient-to-r from-[#D4A753] to-[#9E782F] text-white border-2 border-[#D4A753] ring-4 ring-[#FDF8EB]' : 'bg-white border-2 border-[#EAE6E1] text-[#7C746C] group-hover:border-[#D4A753]'}`}>
                  {isPast ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <div className="mt-2 text-center w-full px-0 sm:px-1 lg:px-2">
                  <span className={`text-[9px] sm:text-[10px] lg:text-[11px] font-bold block leading-tight ${isCurrent ? 'text-[#1A1615]' : isPast ? 'text-[#15803D]' : 'text-[#7C746C]'}`}>{step.name}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Step Content */}
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#EAE6E1] p-3.5 sm:p-4 z-30 shadow-md mt-6">
        {currentStep === 5 ? (
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-3 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-2 h-2 rounded-full bg-[#15803D] animate-pulse"></div>
              <div>
                <div className="text-[13px] font-bold text-[#1A1615]">Ready to deploy campaign</div>
                <div className="text-[11px] font-medium text-[#7C746C]">All 5 steps validated • Zero conflict warnings</div>
              </div>
            </div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 w-full md:w-auto">
              <button onClick={() => setCurrentStep(4)} className="flex-1 md:flex-none px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-[12px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors shadow-sm whitespace-nowrap text-center flex items-center justify-center gap-1.5 cursor-pointer">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Reward Def
              </button>
              <button onClick={() => handleSubmitCampaign(true)} className="flex-1 md:flex-none px-4 py-2.5 bg-[#FAF8F5] border border-[#EFECE6] rounded-xl text-[12px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors shadow-sm whitespace-nowrap text-center cursor-pointer">
                Save Draft
              </button>
              <button
                onClick={() => handleSubmitCampaign(false)}
                className="w-full md:w-auto px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg text-[13px] font-bold shadow-md transition-opacity flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4" /> Deploy &amp; Publish Campaign <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-[1600px] mx-auto">
            <div className="flex items-center gap-3 text-xs font-semibold text-[#7C746C]">
              <span className="w-2 h-2 rounded-full bg-[#15803D] inline-block shrink-0"></span>
              <span className="whitespace-nowrap">Draft autosaved just now</span>
              <span className="text-[#0D7A53] bg-[#E6F4ED] px-2.5 py-0.5 rounded-full border border-[#BCE3D1] font-bold text-[11px] whitespace-nowrap">• Validation Passed</span>
            </div>
            <div className="flex items-center justify-end gap-3 w-full sm:w-auto">
              {currentStep > 1 && (
                <button onClick={() => setCurrentStep(prev => prev - 1)} className="px-4 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors flex items-center gap-1.5 cursor-pointer">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button onClick={() => handleSubmitCampaign(true)} className="px-4 py-2 bg-[#FAF8F5] border border-[#EFECE6] rounded-lg text-[13px] font-bold text-[#1A1615] hover:bg-[#EFECE6] transition-colors cursor-pointer">
                Save as Draft
              </button>
              {currentStep < 5 && (
                <button onClick={handleNextStep} className="px-4 py-2 bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg text-[13px] font-bold shadow-md transition-opacity flex items-center gap-1.5 cursor-pointer">
                  <span>Continue to {steps.find(s => s.id === currentStep + 1)?.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Global Toast Notification */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-[#1A1615] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-fade-in-up border border-[#332e2d]">
          <CheckCircle2 className="w-5 h-5 text-[#D4A753]" />
          <span className="text-sm font-bold">{feedbackToast}</span>
        </div>
      )}

      {/* Custom Segment Modal */}
      {showCustomSegmentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#1A1615]/40 backdrop-blur-sm" onClick={() => setShowCustomSegmentModal(false)}></div>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col relative z-10">
            <div className="p-5 border-b border-[#EFECE6] flex items-center justify-between bg-white">
              <h3 className="text-lg font-bold text-[#1A1615]">Add Custom Segment</h3>
              <button onClick={() => setShowCustomSegmentModal(false)} className="text-[#9E9A93] hover:text-[#1A1615] transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 flex-1 overflow-y-auto bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-2">Segment Name</label>
                  <input
                    type="text"
                    placeholder="e.g. High Value Churn Risk"
                    value={customSegmentName}
                    onChange={(e) => setCustomSegmentName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#EFECE6] px-3 py-2.5 rounded-lg text-[13px] font-bold text-[#1A1615] focus:outline-none focus:border-[#D4A753]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6E6A66] mb-2">Conditions (Rule Builder)</label>
                  <div className="p-4 border border-dashed border-[#D1CDC7] rounded-xl text-center bg-[#F5F4F2]">
                    <p className="text-sm text-[#9E9A93] font-medium">Rule builder will go here</p>
                    <button className="mt-2 text-[#D4A753] text-xs font-bold hover:underline cursor-pointer">+ Add Rule</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-[#EFECE6] bg-[#FAF8F5] flex justify-end gap-3 rounded-b-2xl">
              <button onClick={() => setShowCustomSegmentModal(false)} className="px-4 py-2 text-sm font-bold text-[#6E6A66] hover:bg-[#EFECE6] rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
              <button onClick={() => {
                setShowCustomSegmentModal(false);
                setCustomSegmentName('');
              }} className="px-4 py-2 bg-[#1A1615] text-white text-sm font-bold rounded-lg hover:bg-black transition-colors shadow-md cursor-pointer">
                Create Segment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};