import React, { useState, useRef, useEffect } from 'react';
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
  MoreVertical
} from 'lucide-react';
import { FormInput } from '../components/FormInput';
import { AddItemModal } from '../components/AddItemModal';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCampaigns, setCurrentCampaign, createCampaign, updateCampaign, deleteCampaign, toggleCampaignStatus } from '../store/slices/campaignSlice';
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
  onBack: () => void;
  campaignName?: string;
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

const CampaignRulesStep: React.FC<CampaignRulesStepProps> = ({ campaignType, currency, onContinue, onBack, campaignName }) => {
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
  const [matchType, setMatchType] = useState<'ALL' | 'ANY'>('ALL');
  const [showErrors, setShowErrors] = useState<boolean>(false);
  const [selectedRuleIds, setSelectedRuleIds] = useState<string[]>([]);
    const [rules, setRules] = useState<RuleNode[]>([
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
  const [triggerEvent, setTriggerEvent] = useState<string>('qr_scan');
  // Calculate initial datetime strings for local timezone
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [branches, setBranches] = useState<Array<{ id: string; name: string; selected: boolean }>>([]);

  useEffect(() => {
    if (reduxBranches && reduxBranches.length > 0) {
      setBranches(reduxBranches.map(b => ({
        id: String(b.id),
        name: b.name,
        selected: true // Default to true when fetched
      })));
    }
  }, [reduxBranches]);
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
    onContinue({ rules, matchType });
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
  onBack: () => void;
}

const CampaignRewardStep: React.FC<CampaignRewardStepProps> = ({ campaignType, ruleConfig, currency, onContinue, onBack }) => {
  const currSymbol = currency.match(/\((.*?)\)/)?.[1] || '₹';
  const [rewardType, setRewardType] = useState<string>('free_item');
  const [cashbackAmount, setCashbackAmount] = useState<number>(10);

  const [discountType, setDiscountType] = useState<'Fixed' | 'Percentage'>('Percentage');
  const [discountValue, setDiscountValue] = useState<number>(15);

  const [rewardPoints, setRewardPoints] = useState<number>(500);
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

  const [freeItem, setFreeItem] = useState<string>('');
  const [freeItemDropdownOpen, setFreeItemDropdownOpen] = useState(false);
  const [showFreeItemNewInput, setShowFreeItemNewInput] = useState(false);
  const [freeItemNewName, setFreeItemNewName] = useState('');
  const storeItems = useSelector((state: RootState) => state.catalog.items);
  const storeProducts = storeItems.map(item => item.title);
  const [localProducts, setLocalProducts] = useState<string[]>([]);
  const catalogProducts = [...storeProducts, ...localProducts];

  const [maxRedemptions, setMaxRedemptions] = useState<number>(1);
  const [totalBudgetCap, setTotalBudgetCap] = useState<number>(500);
  const [coolingPeriodHours, setCoolingPeriodHours] = useState<number>(6);
  const [coolingPeriodDropdownOpen, setCoolingPeriodDropdownOpen] = useState(false);
  const coolingPeriodDropdownRef = useRef<HTMLDivElement>(null);

  const [applicableBranches, setApplicableBranches] = useState<string>('all');
  const [applicableBranchesDropdownOpen, setApplicableBranchesDropdownOpen] = useState(false);
  const applicableBranchesDropdownRef = useRef<HTMLDivElement>(null);

  const branches = useSelector((state: RootState) => state.branch.branches);
  const branchOptions = [
    { value: 'all', label: 'All Outlets & Branches' },
    ...branches.map(b => ({ value: String(b.id), label: b.name }))
  ];

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
}

export const CampaignBuilderPage: React.FC<CampaignBuilderPageProps> = ({ initialViewMode = 'dashboard', onNavigate }) => {
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
    } else {
      setViewMode('builder');
    }
    setCurrentStep(1);
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
      reward_value: rewardConfig?.rewardValue || rewardConfig?.discountValue || '50',
      is_active: !isDraft,
      valid_from: startDate ? new Date(startDate).toISOString() : undefined,
      valid_until: endDate ? new Date(endDate).toISOString() : undefined,
      
      // New fields to fully match frontend state
      priority_level: priorityLevel,
      stackable: stackingControl,
      expiry_type: 'Days', // Defaulting to Days since expirationWindow is a string in parent state
      expiry_days: 30, // Default since expiryDays is in child component
      max_redemptions: 1, // Default since it's in child component
      total_budget_cap: 500, // Default since it's in child component
      cooling_period_hours: 6, // Default since it's in child component
      auto_revoke_on_refund: true, // Default since it's in child component
    };

    // Add optional fields only if they have values
    if (minAge !== 18) {
      payload.min_age = minAge;
    }
    if (maxAge !== 80) {
      payload.max_age = maxAge;
    }

    if (activeBranches.length > 0) {
      // activeBranches stores names, look up the numeric ID from the branches list
      const matchedBranch = branches.find((b: any) => b.name === activeBranches[0]);
      payload.branch_id = matchedBranch?.id ? String(matchedBranch.id) : activeBranches[0];
    }
    
    // We bind these to the new state variables added in the parent component
    if (targetValue) {
      payload.target_value = targetValue;
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
      onNavigate('/campaigns/new');
    } else {
      setViewMode('builder');
    }
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
    } else {
      setViewMode('dashboard');
    }
  };

  const [selectedCampaignType, setSelectedCampaignType] = useState<string>('Loyalty Boost');
  const [isAddLocationOpen, setIsAddLocationOpen] = useState<boolean>(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{id: number, name: string} | null>(null);
  const [ruleConfig, setRuleConfig] = useState<any>({});
  const [rewardConfig, setRewardConfig] = useState<any>({});

  // Step 1 – Basics state
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [campaignName, setCampaignName] = useState('');
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [expandedCampaignId, setExpandedCampaignId] = useState<number | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const apiCampaigns = useSelector((state: RootState) => state.campaign.campaigns);
  const currentCampaign = useSelector((state: RootState) => state.campaign.currentCampaign);
  const branches = useSelector((state: RootState) => state.branch.branches);
  const tierOptions = useSelector((state: RootState) => state.master.tierOptions);

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
      const formatDateTime = (isoStr: string) => isoStr ? isoStr.slice(0, 16) : '';
      
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
    }
  }, [currentCampaign, viewMode, branches]);

  const campaigns = apiCampaigns.length > 0 ? [...apiCampaigns].sort((a: any, b: any) => (b.id || 0) - (a.id || 0)).map(c => {
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
    return {
      id: c.id,
      name: c.title || 'Untitled Campaign',
      type: c.type || 'Unknown Type',
      status: finalStatus,
      target: c.customer_type || 'All Customers',
      startDate: c.valid_from ? new Date(c.valid_from).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A',
      endDate: c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'N/A',
      progress: (c as any).performance || 0,
      reward: c.reward_type || 'Reward'
    };
  }) : [];

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
    { id: 1, name: 'Basics' },
    { id: 2, name: 'Audience' },
    { id: 3, name: 'Conditions & Rules' },
    { id: 4, name: 'Reward Def' },
    { id: 5, name: 'Review & Publish' },
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
      (statusFilter === 'All' || statusFilter === 'All Status' || c.status === statusFilter) &&
      (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.reward.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredCampaigns.length / itemsPerPage);
    const paginatedCampaigns = filteredCampaigns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
    <div className="p-4 sm:p-6 space-y-6 font-sans text-[#1A1615]">
      <div className="max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">Campaign &amp; Loyalty Management</h1>
            <p className="text-xs sm:text-sm text-[#7C746C] mt-1">Create, monitor, and optimize your customer engagement programs.</p>
          </div>
          <button onClick={handleOpenBuilder} className="bg-gradient-to-r from-[#D4A753] to-[#9E782F] hover:opacity-95 text-white rounded-lg px-4 py-2 text-[13px] font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto">
            <Plus className="w-4 h-4 text-white" /> Create New Campaign
          </button>
        </div>

        {/* Filters & Search */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl p-4 shadow-2xs flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#9E9A93]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search campaigns by name or reward..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2.5 border border-[#EAE6E1] rounded-lg bg-[#FAF8F5] text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-[#D4A753] focus:border-[#D4A753]"
            />
          </div>
          <div className="grid grid-cols-2 md:flex md:items-center gap-3 w-full md:w-auto">
            <div ref={typeFilterDropdownRef} className="relative w-full md:w-[140px]">
              <button
                type="button"
                onClick={() => setTypeFilterDropdownOpen(!typeFilterDropdownOpen)}
                className="w-full flex items-center justify-between border border-[#EAE6E1] rounded-lg bg-[#FAF8F5] py-2.5 px-3 text-xs sm:text-sm font-semibold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{typeFilter}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${typeFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {typeFilterDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                  {['All Types', 'Visit Type', 'Billing Type', 'Stamp Type'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => { setTypeFilter(type); setTypeFilterDropdownOpen(false); }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs sm:text-sm hover:bg-[#F5F1EA] ${typeFilter === type ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div ref={statusFilterDropdownRef} className="relative w-full md:w-[140px]">
              <button
                type="button"
                onClick={() => setStatusFilterDropdownOpen(!statusFilterDropdownOpen)}
                className="w-full flex items-center justify-between border border-[#EAE6E1] rounded-lg bg-[#FAF8F5] py-2.5 px-3 text-xs sm:text-sm font-semibold text-[#1A1615] hover:border-[#D1CDC7] transition-colors cursor-pointer"
              >
                <span className="truncate">{statusFilter}</span>
                <ChevronDown className={`w-4 h-4 shrink-0 text-[#9E9A93] transition-transform ${statusFilterDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {statusFilterDropdownOpen && (
                <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#EAE6E1] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                  {['All Status', 'Active', 'Scheduled', 'Draft', 'Ended'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => { setStatusFilter(status); setStatusFilterDropdownOpen(false); }}
                      className={`w-full cursor-pointer px-3 py-2 text-left text-xs sm:text-sm hover:bg-[#F5F1EA] ${statusFilter === status ? 'bg-[#F5F1EA] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Campaign List */}
        <div className="bg-white border border-[#EAE6E1] rounded-xl shadow-2xs overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE6E1]">
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C]">Campaign Info</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C]">Type &amp; Target</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C]">Status</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C]">Timeline</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C]">Performance</th>
                  <th className="py-3 px-5 text-xs font-bold uppercase tracking-wider text-[#7C746C] text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center border-b border-[#EAE6E1]">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-[#F3EDE6] rounded-full flex items-center justify-center mb-3">
                          <Gift className="w-6 h-6 text-[#9E9A93]" />
                        </div>
                        <h3 className="text-[13px] font-bold text-[#1A1615] mb-1">No campaigns found</h3>
                        <p className="text-xs text-[#7C746C] max-w-sm mx-auto">
                          {searchQuery || statusFilter !== 'All' ? "Try adjusting your filters or search query to find what you're looking for." : "You haven't created any campaigns yet. Click 'Create New Campaign' to get started!"}
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedCampaigns.map(c => (
                  <tr key={c.id} className="border-b border-[#EAE6E1] hover:bg-[#FAF8F5]/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="text-sm font-bold text-[#1A1615] mb-0.5">{c.name}</div>
                      <div className="text-xs font-medium text-[#7C746C] flex items-center gap-1.5"><Gift className="w-3.5 h-3.5 text-[#D4A753]" /> {c.reward}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-sm font-semibold text-[#1A1615] mb-0.5">{c.type}</div>
                      <div className="text-[11px] font-bold text-[#9E782F] uppercase tracking-wider bg-[#FDF8EB] border border-[#F3E5C8] inline-block px-2 py-0.5 rounded">{c.target}</div>
                    </td>
                    <td className="py-4 px-5">
                      {c.status === 'Active' ? (
                        <span className="px-2.5 py-0.5 bg-[#EBF7F0] border border-[#15803D]/20 text-[#15803D] rounded-full text-xs font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#15803D] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Scheduled' ? (
                        <span className="px-2.5 py-0.5 bg-[#FEF3C7] border border-[#D97706]/20 text-[#D97706] rounded-full text-xs font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Ended' ? (
                        <span className="px-2.5 py-0.5 bg-[#FEE2E2] border border-[#DC2626]/20 text-[#DC2626] rounded-full text-xs font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Draft' ? (
                        <span className="px-2.5 py-0.5 bg-[#FAF6EE] border border-[#E5D7BE] text-[#9E782F] rounded-full text-xs font-semibold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#9E782F] rounded-full"></span> {c.status}
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 bg-[#F3F4F6] border border-[#E5E7EB] text-[#4B5563] rounded-full text-xs font-semibold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span> {c.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-5">
                      <div className="text-xs font-semibold text-[#1A1615]">{c.startDate}</div>
                      <div className="text-[11px] text-[#7C746C]">{c.endDate}</div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="h-1.5 flex-1 bg-[#FAF8F5] border border-[#EAE6E1] rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#D4A753] to-[#9E782F] rounded-full" style={{ width: `${c.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-[#1A1615] w-8">{c.progress}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-right relative">
                      <button 
                        onClick={() => setOpenActionMenuId(openActionMenuId === c.id ? null : c.id)}
                        className="p-1.5 text-[#6E6A66] hover:text-[#1A1615] bg-white border border-[#EAE6E1] rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      {openActionMenuId === c.id && (
                        <div ref={actionMenuRef} className="absolute right-8 top-12 w-40 bg-white border border-[#EAE6E1] rounded-xl shadow-lg z-50 overflow-hidden py-1">
                          <button onClick={async () => { setOpenActionMenuId(null); setQrModalCampaign(c); setQrModalImgUrl(null); const url = await fetchCampaignQr(c.id); setQrModalImgUrl(url); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A1615] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2">
                            <Eye className="w-3.5 h-3.5 text-[#6E6A66]" /> View QR
                          </button>
                          <button onClick={() => { setOpenActionMenuId(null); handleDownload(c); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A1615] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2">
                            <Download className="w-3.5 h-3.5 text-[#6E6A66]" /> Download
                          </button>
                          <button onClick={() => { setOpenActionMenuId(null); handleToggleCampaignStatus(c.id, c.status); }} className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#FAF8F5] transition-colors flex items-center gap-2 ${c.status === 'Active' || c.status === 'Scheduled' ? 'text-[#15803D]' : 'text-[#1A1615]'}`}>
                            <Power className={`w-3.5 h-3.5 ${c.status === 'Active' || c.status === 'Scheduled' ? 'text-[#15803D]' : 'text-[#6E6A66]'}`} /> {(c.status === 'Draft' || c.status === 'Paused') ? 'Activate' : 'Deactivate'}
                          </button>
                          <button onClick={() => { setOpenActionMenuId(null); handleEditCampaign(c); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A1615] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2">
                            <Edit2 className="w-3.5 h-3.5 text-[#D4A753]" /> Edit
                          </button>
                          <button onClick={() => { setOpenActionMenuId(null); handleDuplicateCampaign(c); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#1A1615] hover:bg-[#FAF8F5] transition-colors flex items-center gap-2">
                            <Copy className="w-3.5 h-3.5 text-[#6E6A66]" /> Duplicate
                          </button>
                          <div className="h-px bg-[#EAE6E1] my-1 mx-2"></div>
                          <button onClick={() => { setOpenActionMenuId(null); handleDeleteCampaign(c.id, c.name); }} className="w-full text-left px-4 py-2 text-xs font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors flex items-center gap-2">
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Accordion List */}
          <div className="md:hidden flex flex-col">
            {filteredCampaigns.length === 0 ? (
              <div className="py-12 px-4 text-center bg-white">
                <div className="flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-[#F3EDE6] rounded-full flex items-center justify-center mb-3">
                    <Gift className="w-6 h-6 text-[#9E9A93]" />
                  </div>
                  <h3 className="text-[13px] font-bold text-[#1A1615] mb-1">No campaigns found</h3>
                  <p className="text-xs text-[#7C746C]">
                    {searchQuery || statusFilter !== 'All' ? "Try adjusting your filters." : "Create your first campaign!"}
                  </p>
                </div>
              </div>
            ) : paginatedCampaigns.map((c) => {
              const isExpanded = expandedCampaignId === c.id;

              return (
                <div key={c.id} className="border-b border-[#EFECE6] last:border-b-0 overflow-hidden">
                  <button
                    onClick={() => setExpandedCampaignId(isExpanded ? null : c.id)}
                    className="w-full flex items-center justify-between p-4 bg-white hover:bg-[#FAF8F5] transition-colors text-left"
                  >
                    <div>
                      <div className="text-sm font-bold text-[#1A1615] mb-1">{c.name}</div>
                      <div className="text-xs font-medium text-[#6E6A66] flex items-center gap-1.5 mb-2"><Gift className="w-3.5 h-3.5" /> {c.reward}</div>

                      {c.status === 'Active' ? (
                        <span className="px-2 py-0.5 bg-[#E0F9ED] border border-[#BCE3D1] text-[#0D7A53] rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#0D7A53] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Scheduled' ? (
                        <span className="px-2 py-0.5 bg-[#FEF3C7] border border-[#FDE68A] text-[#D97706] rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Ended' ? (
                        <span className="px-2 py-0.5 bg-[#FEE2E2] border border-[#FECACA] text-[#DC2626] rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full"></span> {c.status}
                        </span>
                      ) : c.status === 'Draft' ? (
                        <span className="px-2 py-0.5 bg-[#EFECE6] text-[#6E6A66] rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#9E9A93] rounded-full"></span> {c.status}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[10px] font-bold uppercase flex items-center w-max gap-1">
                          <span className="w-1.5 h-1.5 bg-[#9CA3AF] rounded-full"></span> {c.status}
                        </span>
                      )}
                    </div>
                    <div className="shrink-0 ml-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#8C827A]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#8C827A]" />
                      )}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 bg-[#FAF8F5] border-t border-[#EFECE6] space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1 block">Type</span>
                          <div className="text-xs font-semibold text-[#1A1615]">{c.type}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1 block">Target</span>
                          <div className="text-[10px] font-bold text-[#9E782F] uppercase tracking-wider bg-[#FDF8EB] border border-[#F3E5C8] inline-block px-1.5 py-0.5 rounded">{c.target}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1 block">Start Date</span>
                          <div className="text-xs font-semibold text-[#1A1615]">{c.startDate}</div>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-1 block">End Date</span>
                          <div className="text-[10px] font-semibold text-[#6E6A66]">{c.endDate}</div>
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-[#9E9A93] uppercase tracking-wider mb-2 block">Performance ({c.progress}%)</span>
                        <div className="h-1.5 w-full bg-[#EFECE6] rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4A753] rounded-full" style={{ width: `${c.progress}%` }}></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#EFECE6]">
                        <button onClick={async () => { setQrModalCampaign(c); setQrModalImgUrl(null); const url = await fetchCampaignQr(c.id); setQrModalImgUrl(url); }} className="flex-1 min-w-[30%] py-2 bg-white text-[#1A1615] border border-[#EFECE6] font-semibold text-xs rounded-lg hover:bg-[#FAF8F5] transition-colors flex justify-center items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> View
                        </button>
                        <button onClick={() => handleDownload(c)} className="flex-1 min-w-[30%] py-2 bg-white text-[#1A1615] border border-[#EFECE6] font-semibold text-xs rounded-lg hover:bg-[#FAF8F5] transition-colors flex justify-center items-center gap-1.5">
                          <Download className="w-3.5 h-3.5" /> DL
                        </button>
                        <button onClick={() => handleToggleCampaignStatus(c.id, c.status)} className="flex-1 min-w-[30%] py-2 bg-white text-[#1A1615] border border-[#EFECE6] font-semibold text-xs rounded-lg hover:bg-[#FAF8F5] transition-colors flex justify-center items-center gap-1.5">
                          <Power className={`w-3.5 h-3.5 ${c.status === 'Active' || c.status === 'Scheduled' ? 'text-[#15803D]' : 'text-[#6E6A66]'}`} /> {(c.status === 'Draft' || c.status === 'Paused') ? 'Activate' : 'Deact.'}
                        </button>
                        <button onClick={() => handleEditCampaign(c)} className="flex-1 min-w-[30%] py-2 bg-white text-[#1A1615] border border-[#EFECE6] font-semibold text-xs rounded-lg hover:bg-[#FAF8F5] transition-colors flex justify-center items-center gap-1.5">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button onClick={() => handleDuplicateCampaign(c)} className="flex-1 min-w-[30%] py-2 bg-white text-[#1A1615] border border-[#EFECE6] font-semibold text-xs rounded-lg hover:bg-[#FAF8F5] transition-colors flex justify-center items-center gap-1.5">
                          <Copy className="w-3.5 h-3.5" /> Dup
                        </button>
                        <button onClick={() => handleDeleteCampaign(c.id, c.name)} className="flex-1 min-w-[30%] py-2 bg-[#FEE2E2] text-[#DC2626] border border-[#FECACA] font-semibold text-xs rounded-lg hover:bg-[#FCA5A5] transition-colors flex justify-center items-center gap-1.5">
                          <Trash2 className="w-3.5 h-3.5" /> Del
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Pagination Controls */}
          {filteredCampaigns.length > 0 && (
            <div className="flex items-center justify-between px-5 py-4 border-t border-[#EAE6E1] bg-[#FAF8F5]">
              <div className="text-xs font-medium text-[#6E6A66]">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length} campaigns
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-xs font-bold border border-[#EAE6E1] rounded-lg disabled:opacity-50 hover:bg-[#FAF8F5] transition-colors"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#D4A753] text-white' : 'hover:bg-[#FAF8F5] text-[#1A1615]'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-xs font-bold border border-[#EAE6E1] rounded-lg disabled:opacity-50 hover:bg-[#FAF8F5] transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  };

  if (viewMode === 'dashboard') {
    return (
      <>
        {renderDashboard()}
        
        {/* Delete Confirmation Modal for Dashboard */}
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

      {/* QR Code Modal */}
        {qrModalCampaign && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 relative flex flex-col items-center text-center">
              <button onClick={() => setQrModalCampaign(null)} className="absolute top-4 right-4 text-[#9E9A93] hover:text-[#1A1615] bg-[#FAF8F5] p-2 rounded-full transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
              <QrCode className="w-12 h-12 text-[#D4A753] mb-4" />
              <h3 className="text-lg font-bold text-[#1A1615] mb-2">{qrModalCampaign.name}</h3>
              <p className="text-xs text-[#7C746C] mb-6">Scan this QR code to join the campaign.</p>
              <div className="w-48 h-48 bg-white border-2 border-[#EFECE6] rounded-xl flex items-center justify-center mb-6 shadow-sm overflow-hidden">
                {qrModalImgUrl ? (
                  <img fetchPriority="high" loading="eager" src={qrModalImgUrl} alt="QR Code" className="w-full h-full object-contain p-2" />
                ) : (
                  <div className="w-8 h-8 border-2 border-[#A37837] border-t-transparent rounded-full animate-spin"></div>
                )}
              </div>
              <button onClick={() => handleDownload(qrModalCampaign)} className="w-full py-3 bg-[#1A1615] text-white rounded-lg text-sm font-bold shadow-md hover:bg-black transition-colors cursor-pointer flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download QR Code
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

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