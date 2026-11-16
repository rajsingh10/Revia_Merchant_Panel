export type StaffPortalTab = 'tables' | 'requests' | 'orders' | 'home' | 'menu';

export type StaffPortalSubView =
  | 'list'
  | 'dashboard'
  | 'create_request'
  | 'request_details'
  | 'create_order'
  | 'create_order_wizard'
  | 'order_tracking'
  | 'add_items'
  | 'add_items_order'
  | 'serve_order'
  | 'share_handoff'
  | 'share_handoff_hub'
  | 'handoff_table'
  | 'escalate_manager'
  | 'assign_request'
  | 'new_reservation'
  | 'notifications'
  | 'staff_menu'
  | 'todays_activity'
  | 'my_feedback'
  | 'add_customer_note';

export interface ReservationBooking {
  id: string;
  customerName: string;
  phone: string;
  isExistingCustomer: boolean;
  loyaltyTier?: string;
  branch: string;
  date: string;
  timeSlot: string;
  partySize: number;
  diningArea: string;
  tableNumber: string;
  tableFeatures?: string;
  occasion?: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Pending Approval';
  createdAt: string;
}

export interface StaffNotificationItem {
  id: string;
  type: 'urgent_ping' | 'awaiting_assignment' | 'food_ready' | 'assigned_to_you' | 'manager_followup';
  title: string;
  badge?: string;
  badgeType?: 'danger' | 'warning' | 'success' | 'info';
  tableNumber: string;
  actionSubject: string;
  description: string;
  timeAgo: string;
  isRead: boolean;
  category: 'Requests' | 'Orders' | 'Manager';
  relatedId?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  activeRequests?: number;
  currentTables?: number;
  activeTablesCount?: number;
  status: 'Available' | 'Busy';
  avatarBg?: string;
}

export interface ServiceRequestItem {
  id: string;
  tableNumber: string;
  customerName?: string;
  customerLocation?: string;
  type?: string;
  title: string;
  quantity?: number;
  itemType?: 'tissues' | 'water' | 'cutlery' | 'bill' | 'assistance' | 'other' | string;
  pings: number;
  waitingMinutes: number;
  requestedAt?: string;
  createdAt?: string;
  status: 'Available to Claim' | 'Assigned to You' | 'In Progress' | 'Completed' | 'unassigned' | 'in_progress' | 'completed';
  assignedStaff?: string;
  assignedToStaffName?: string;
  specialInstruction?: string;
  customerInstructions?: string;
  deliveryChecked?: boolean;
  completionNote?: string;
  activityHistory?: {
    title: string;
    time: string;
    type: 'created' | 'reminder' | 'started' | 'completed';
  }[];
}

export interface FoodOrderItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
  isVegetarian?: boolean;
  ready?: boolean;
  station?: string;
  prepMinutesAgo?: number;
}

export interface FoodOrder {
  id: string;
  tableNumber: string;
  customerName: string;
  guestCount?: number;
  guestsCount?: number;
  diningArea?: string;
  items: FoodOrderItem[];
  subtotal?: number;
  runningValue: number;
  status: 'Awaiting Acceptance' | 'Preparing' | 'Ready to Serve' | 'On the Way' | 'Served' | 'awaiting_acceptance' | 'preparing' | 'ready_to_serve' | 'served';
  kitchenEta?: string;
  kitchenUpdate?: string;
  updatedAt?: string;
  readySince?: string;
  assignedWaiter: string;
  notes?: string;
  hasOfferPending?: boolean;
  offerName?: string;
  offerApplied?: {
    name: string;
    discountPercent: number;
    status: 'Approval Required' | 'Approved';
  };
  kitchenProgress?: {
    newTime?: string;
    acceptedTime?: string;
    preparingTime?: string;
    readyTime?: string;
    servedTime?: string;
  };
}

export interface DiningTable {
  id: string;
  number?: string;
  tableNumber: string;
  area: string;
  reservationId?: string;
  reservationTime?: string;
  isWalkIn?: boolean;
  customerName: string;
  guestsCount: number;
  guestType?: string;
  status: 'Occupied' | 'Food Ready' | 'Needs Attention' | 'Vacant' | string;
  runningValue: number;
  orderStatus: 'Not started' | 'Preparing' | 'Ready to Serve' | 'Completed' | 'Served' | string;
  oldestWaitMinutes?: number;
  pingsCount?: number;
  assignedStaff: string;
  staffStatus: string;
  activeOrderId?: string;
  itemsOrderedCount?: number;
  itemsOrderedSummary?: string;
  urgentNotice?: string;
  orderedItems?: {
    name: string;
    quantity: number;
    price: number;
    timeAgo: string;
  }[];
  activeRequests?: any[];
}
