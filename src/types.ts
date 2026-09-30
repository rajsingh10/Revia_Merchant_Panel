export type LoyaltyTier = 'Obsidian VIP' | 'Gold Reserve' | 'Standard';

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  email: string;
  tier: LoyaltyTier;
  stampsCount: number;
  stampsMax: number;
  lifetimeSpend: number;
  totalVisits: number;
  joinedDate: string;
  lastVisit: string;
  preferredBranch: string;
  favoriteItem: string;
  recentActivity: {
    id: string;
    action: string;
    branch: string;
    date: string;
    amount?: number;
    stampsEarned?: number;
  }[];
}

export type CatalogCategory = 'All Items' | 'Single Origin Coffee' | 'Tasting Flights' | 'Artisanal Bakery' | 'Seasonal Brews';

export interface CatalogItem {
  id: string;
  sku: string;
  title: string;
  category: Exclude<CatalogCategory, 'All Items'>;
  price: number;
  cost: number;
  margin: number;
  image: string;
  inStock: boolean;
  stockCount: number;
  cuppingNotes: string;
  roastProfile: string;
  stampsAwarded: number;
  active: boolean;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  manager: string;
  managerAvatar: string;
  address: string;
  phone: string;
  activePosCount: number;
  totalPosCount: number;
  membersLinked: number;
  volume30d: number;
  status: 'Online' | 'Offline' | 'Degraded';
  beaconActive: boolean;
  scannerHealth: number; // percentage
  operatingHours: string;
  speedBenchmarkSec: number;
  hourlyFootfall: { hour: string; count: number }[];
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: {
    name: string;
    avatar: string;
    role: string;
  };
  action: string;
  target: string;
  terminal: string;
  ip: string;
  cryptoState: 'VERIFIED' | 'PENDING' | 'FLAGGED';
  hash: string;
}

export interface CampaignCondition {
  id: string;
  field: 'lifetimeSpend' | 'visitRecency' | 'stampsCollected' | 'preferredCategory';
  operator: '>=' | '<=' | 'within' | 'equals';
  value: string | number;
  logic: 'AND' | 'OR';
}

export interface RetentionCohortRow {
  cohort: string;
  members: number;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
  m5: number;
  m6: number;
}

export interface OutletsData {
  id: string;
  name: string;
  shortName: string;
  type: 'Primary Hub' | 'Active';
  address: string;
  manager: string;
  managerAvatar: string;
  terminalsActive: number;
  membersLinked: string;
  volume30d: string;
  hours: string;
  timezone: string;
  currency: string;
  taxProfile: string;
  contactEmail?: string;
  contactPhone?: string;
  dailyFootfall?: number;
  hardware: {
    name: string;
    badge: 'Square' | 'Clover' | 'Revia Stand';
    detail: string;
    icon: 'register' | 'pos' | 'beacon';
  }[];
  loyaltyRules: {
    baseMultiplier: string;
    specialRuleName: string;
    specialRuleTime: string;
    specialRuleBadge: string;
    specialMultiplier: string;
    exclusivePerk: string;
  };
}

export type NavRoute =
  | '/'
  | '/about'
  | '/contact'
  | '/privacy'
  | '/terms'
  | '/dashboard'
  | '/atelier'
  | '/branches'
  | '/branches/new'
  | '/staff'
  | '/loyalty'
  | '/qr-codes'
  | '/item-catalog'
  | '/masters/rule-fields'
  | '/masters/tier-options'
  | '/masters/reward-types'
  | '/catalog'
  | '/orders'
  | '/invoices'
  | '/customerlist'
  | '/transactions'
  | '/campaigns'
  | '/campaigns/new'
  | '/terminal'
  | '/rewards'
  | '/analytics'
  | '/billing'
  | '/notifications'
  | '/settings/audit'
  | '/settings/branding'
  | '/login'
  | '/onboarding'
  | '/customer'
  | '/customer/landing'
  | '/customer/identify'
  | '/customer/onboarding'
  | '/customer/curate-experience'
  | '/customer-onboarding'
  | '/customerlist/detail'
  | '/rewards/new';

