import React, { useState } from 'react';
import { StaffPortalHeader } from '../components/staff-portal/StaffPortalHeader';
import { StaffPortalBottomNav } from '../components/staff-portal/StaffPortalBottomNav';
import { TableServiceView } from '../components/staff-portal/TableServiceView';
import { ServiceRequestsView } from '../components/staff-portal/ServiceRequestsView';
import { CreateRequestView } from '../components/staff-portal/CreateRequestView';
import { RequestDetailsView } from '../components/staff-portal/RequestDetailsView';
import { CreateOrderWizard } from '../components/staff-portal/CreateOrderWizard';
import { FoodOrdersView } from '../components/staff-portal/FoodOrdersView';
import { OrderTrackingView } from '../components/staff-portal/OrderTrackingView';
import { AddItemsView } from '../components/staff-portal/AddItemsView';
import { ServeOrderView } from '../components/staff-portal/ServeOrderView';
import { ShareHandoffView } from '../components/staff-portal/ShareHandoffView';
import { NewReservationWizard } from '../components/staff-portal/NewReservationWizard';
import { StaffNotificationsView } from '../components/staff-portal/StaffNotificationsView';
import { StaffMenuHubView } from '../components/staff-portal/StaffMenuHubView';
import { TodaysActivityView } from '../components/staff-portal/TodaysActivityView';
import { MyFeedbackView } from '../components/staff-portal/MyFeedbackView';
import { AddCustomerNoteView } from '../components/staff-portal/AddCustomerNoteView';
import { PingKitchenModal, ShareSummaryModal } from '../components/staff-portal/StaffPortalModals';
import { 
  StaffPortalTab, 
  StaffPortalSubView, 
  DiningTable, 
  ServiceRequestItem, 
  FoodOrder, 
  StaffMember 
} from '../components/staff-portal/types';
import { 
  MOCK_TABLES, 
  MOCK_SERVICE_REQUESTS, 
  MOCK_FOOD_ORDERS, 
  MOCK_STAFF_MEMBERS 
} from '../components/staff-portal/mockData';
import { CheckCircle2, AlertTriangle, Bell, Info } from 'lucide-react';

interface StaffPortalPageProps {
  onNavigate?: (route: any) => void;
}

export const StaffPortalPage: React.FC<StaffPortalPageProps> = ({ onNavigate }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<StaffPortalTab>('tables');
  const [subView, setSubView] = useState<StaffPortalSubView>('list');

  // Live Data State
  const [tables, setTables] = useState<DiningTable[]>(MOCK_TABLES);
  const [requests, setRequests] = useState<ServiceRequestItem[]>(MOCK_SERVICE_REQUESTS);
  const [orders, setOrders] = useState<FoodOrder[]>(MOCK_FOOD_ORDERS);
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF_MEMBERS);

  // Active Selection
  const [selectedTable, setSelectedTable] = useState<DiningTable | undefined>(MOCK_TABLES[0]);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestItem | undefined>(MOCK_SERVICE_REQUESTS[0]);
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | undefined>(MOCK_FOOD_ORDERS[0]);
  const [handoffMode, setHandoffMode] = useState<'handoff_table' | 'escalate_manager' | 'assign_request'>('handoff_table');

  // Modals
  const [pingKitchenOrder, setPingKitchenOrder] = useState<FoodOrder | null>(null);
  const [shareSummaryTable, setShareSummaryTable] = useState<DiningTable | null>(null);

  // Toast System
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'urgent' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'urgent' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  /* ---------------- HANDLERS ---------------- */

  // Tab change
  const handleTabChange = (tab: StaffPortalTab) => {
    setActiveTab(tab);
    if (tab === 'menu') {
      setSubView('staff_menu');
    } else {
      setSubView('list');
    }
  };

  // Create Order
  const handleOpenCreateOrder = (table?: DiningTable) => {
    setSelectedTable(table || tables.find(t => t.tableNumber === '07') || tables[0]);
    setSubView('create_order');
  };

  const handleOrderCreated = (newOrder: FoodOrder) => {
    setOrders(prev => [newOrder, ...prev]);
    // Also update table status
    setTables(prev => prev.map(t => {
      if (t.tableNumber === newOrder.tableNumber) {
        return {
          ...t,
          orderStatus: 'Preparing',
          runningValue: newOrder.runningValue,
          orderedItems: newOrder.items.map(i => ({
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            timeAgo: 'Just now',
          })),
        };
      }
      return t;
    }));

    showToast(`Order #${newOrder.id} sent to kitchen for Table ${newOrder.tableNumber}!`);
    setActiveTab('orders');
    setSubView('list');
  };

  // Add Items
  const handleOpenAddItems = (order: FoodOrder) => {
    setSelectedOrder(order);
    setSubView('add_items');
  };

  const handleConfirmAddItems = (orderId: string, newItems: any[]) => {
    const addedValue = newItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          items: [...o.items, ...newItems],
          runningValue: o.runningValue + addedValue,
          kitchenUpdate: 'Add-on ticket sent to kitchen',
        };
      }
      return o;
    }));

    // Update table running value too
    const targetOrder = orders.find(o => o.id === orderId);
    if (targetOrder) {
      setTables(prev => prev.map(t => {
        if (t.tableNumber === targetOrder.tableNumber) {
          return {
            ...t,
            runningValue: t.runningValue + addedValue,
            orderedItems: [
              ...t.orderedItems,
              ...newItems.map(i => ({
                name: i.name,
                quantity: i.quantity,
                price: i.price,
                timeAgo: 'Just now',
              })),
            ],
          };
        }
        return t;
      }));
    }

    showToast(`Add-on ticket sent to kitchen for Order #${orderId}`);
    setSubView('list');
  };

  // Serve Order
  const handleOpenServeOrder = (order: FoodOrder) => {
    setSelectedOrder(order);
    setSubView('serve_order');
  };

  const handleConfirmServed = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'served', kitchenUpdate: 'Order delivered to table' } : o));
    const target = orders.find(o => o.id === orderId);
    if (target) {
      setTables(prev => prev.map(t => t.tableNumber === target.tableNumber ? { ...t, orderStatus: 'Served' } : t));
    }
    showToast(`Order #${orderId} marked as Served!`);
    setSubView('list');
  };

  // Service Request
  const handleOpenCreateRequest = (table?: DiningTable) => {
    if (table) setSelectedTable(table);
    setSubView('create_request');
  };

  const handleSubmitNewRequest = (newReqData: Partial<ServiceRequestItem>) => {
    const newReqId = `SR-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: ServiceRequestItem = {
      id: newReqId,
      tableNumber: newReqData.tableNumber || '05',
      type: newReqData.type || 'Assistance',
      title: newReqData.title || 'Special Assistance',
      quantity: newReqData.quantity || 1,
      waitingMinutes: 0,
      pings: 1,
      status: newReqData.status || 'unassigned',
      assignedToStaffName: newReqData.assignedToStaffName,
      specialInstruction: newReqData.specialInstruction,
      createdAt: 'Just now',
    };

    setRequests(prev => [newReq, ...prev]);

    // Update table active requests
    setTables(prev => prev.map(t => {
      if (t.tableNumber === newReq.tableNumber) {
        return {
          ...t,
          activeRequests: [
            ...t.activeRequests,
            {
              id: newReqId,
              title: newReq.title,
              pings: 1,
              status: newReq.status,
              assignedTo: newReq.assignedToStaffName,
              waitingMinutes: 0,
            },
          ],
        };
      }
      return t;
    }));

    showToast(`New service request logged for Table ${newReq.tableNumber}`);
    setActiveTab('requests');
    setSubView('list');
  };

  const handleClaimRequest = (requestId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'in_progress', assignedToStaffName: 'Rohan Singh (You)' } : r));
    setTables(prev => prev.map(t => ({
      ...t,
      activeRequests: t.activeRequests.map(ar => ar.id === requestId ? { ...ar, status: 'in_progress', assignedTo: 'Rohan Singh (You)' } : ar),
    })));
    showToast('Request claimed! You are assigned to fulfill this task.');
  };

  const handleCompleteRequest = (requestId: string, notes?: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'completed' } : r));
    setTables(prev => prev.map(t => ({
      ...t,
      activeRequests: t.activeRequests.filter(ar => ar.id !== requestId),
    })));
    showToast('Request marked as Completed!');
    setSubView('list');
  };

  const handleAssignToColleague = (requestId: string, staffName: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'in_progress', assignedToStaffName: staffName } : r));
    showToast(`Request assigned to ${staffName}`);
  };

  // Escalation & Handoff
  const handleOpenHandoff = (table: DiningTable) => {
    setSelectedTable(table);
    setHandoffMode('handoff_table');
    setSubView('share_handoff');
  };

  const handleOpenEscalate = (request: ServiceRequestItem) => {
    setSelectedRequest(request);
    setHandoffMode('escalate_manager');
    setSubView('share_handoff');
  };

  const handleConfirmHandoff = (tableNumber: string, targetStaffName: string, note?: string) => {
    setTables(prev => prev.map(t => t.tableNumber === tableNumber ? { ...t, assignedStaff: targetStaffName } : t));
    showToast(`Table ${tableNumber} handoff request sent to ${targetStaffName}`);
    setSubView('list');
  };

  const handleConfirmEscalate = (details: any) => {
    showToast(`Escalation sent to ${details.manager} with priority ${details.priority}!`, 'urgent');
    setSubView('list');
  };

  // Open modals
  const handleOpenPingKitchenModal = (order: FoodOrder) => {
    setPingKitchenOrder(order);
  };

  const handleSendPingKitchen = (orderId: string, reason: string, note?: string) => {
    setPingKitchenOrder(null);
    showToast(`Ping sent to Kitchen station for Order #${orderId}`);
  };

  const handleOpenShareSummary = (table: DiningTable) => {
    setShareSummaryTable(table);
  };

  const handleSendShareSummary = (recipient: string, note: string) => {
    setShareSummaryTable(null);
    showToast(`Table summary shared with ${recipient}`);
  };

  // Unhandled / Home Tab Fallback
  const pendingRequestsCount = requests.filter(r => r.status !== 'completed').length;
  const readyOrdersCount = orders.filter(o => o.status === 'ready_to_serve' || o.status === 'Ready to Serve').length;

  return (
    <div className="min-h-screen bg-[#F4F4F6] text-gray-900 font-sans flex flex-col justify-between selection:bg-[#4A154B]/20 selection:text-[#4A154B]">
      {/* Responsive Canvas Container (Mobile, Tablet, Desktop) */}
      <div className="w-full max-w-7xl mx-auto min-h-screen flex flex-col bg-[#F9F9FB] shadow-xl relative pb-24 lg:pb-10 border-x border-gray-200/60">
        {/* Sticky Header with Desktop Navigation */}
        <StaffPortalHeader 
          branchName="Noida - Sector 18" 
          activeTab={activeTab}
          onTabChange={handleTabChange}
          pendingRequestsCount={pendingRequestsCount}
          readyOrdersCount={readyOrdersCount}
          onOpenNotifications={() => setSubView('notifications')}
          onOpenProfile={() => setSubView('staff_menu')}
        />

        {/* Main Dynamic View Router */}
        <main className="flex-1 w-full">
          {/* 1. TABLE SERVICE DASHBOARD */}
          {activeTab === 'tables' && subView === 'list' && (
            <TableServiceView
              tables={tables}
              orders={orders}
              requests={requests}
              onStartOrder={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId);
                handleOpenCreateOrder(targetTable);
              }}
              onAddItems={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId);
                const targetOrder = orders.find(o => o.tableNumber === targetTable?.tableNumber) || orders[0];
                handleOpenAddItems(targetOrder);
              }}
              onNewRequest={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId);
                handleOpenCreateRequest(targetTable);
              }}
              onServeOrder={(orderId) => {
                const targetOrder = orders.find(o => o.id === orderId) || orders[0];
                handleOpenServeOrder(targetOrder);
              }}
              onPingKitchen={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId);
                const targetOrder = orders.find(o => o.tableNumber === targetTable?.tableNumber) || orders[0];
                handleOpenPingKitchenModal(targetOrder);
              }}
              onShareHandoff={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId) || tables[0];
                handleOpenHandoff(targetTable);
              }}
              onViewRequestTask={(requestId) => {
                const req = requests.find(r => r.id === requestId);
                if (req) {
                  setSelectedRequest(req);
                  setSubView('request_details');
                }
              }}
              onClaimRequest={handleClaimRequest}
              onAssignRequest={(requestId) => {
                const req = requests.find(r => r.id === requestId);
                if (req) {
                  setSelectedRequest(req);
                  setHandoffMode('assign_request');
                  setSubView('share_handoff');
                }
              }}
              onEscalateRequest={(requestId) => {
                const req = requests.find(r => r.id === requestId) || requests[0];
                handleOpenEscalate(req);
              }}
              onNewReservation={() => {
                setSubView('new_reservation');
              }}
              onAddCustomerNote={(tableId) => {
                const targetTable = tables.find(t => t.id === tableId || t.number === tableId || t.tableNumber === tableId) || tables[0];
                setSelectedTable(targetTable);
                setSubView('add_customer_note');
              }}
              onSelectTable={(table) => {
                setSelectedTable(table);
              }}
              onCreateOrder={handleOpenCreateOrder}
              onCreateRequest={handleOpenCreateRequest}
            />
          )}

          {/* 2. SERVICE REQUESTS FEED */}
          {activeTab === 'requests' && subView === 'list' && (
            <ServiceRequestsView
              requests={requests}
              onSelectRequest={(req) => {
                setSelectedRequest(req);
                setSubView('request_details');
              }}
              onOpenCreateRequest={() => setSubView('create_request')}
              onClaimRequest={handleClaimRequest}
              onEscalateRequest={handleOpenEscalate}
            />
          )}

          {/* 3. CREATE SERVICE REQUEST */}
          {subView === 'create_request' && (
            <CreateRequestView
              tables={tables}
              staffList={staffList}
              initialTableNumber={selectedTable?.tableNumber}
              onBack={() => setSubView('list')}
              onSubmit={handleSubmitNewRequest}
            />
          )}

          {/* 4. REQUEST DETAILS & CHECKLIST */}
          {subView === 'request_details' && selectedRequest && (
            <RequestDetailsView
              request={selectedRequest}
              staffList={staffList}
              onBack={() => setSubView('list')}
              onClaim={handleClaimRequest}
              onComplete={handleCompleteRequest}
              onEscalate={handleOpenEscalate}
              onAssignToColleague={handleAssignToColleague}
            />
          )}

          {/* 5. CREATE FOOD ORDER 4-STEP WIZARD */}
          {subView === 'create_order' && (
            <CreateOrderWizard
              initialTable={selectedTable}
              onBack={() => setSubView('list')}
              onOrderCreated={handleOrderCreated}
            />
          )}

          {/* 6. FOOD ORDERS QUEUE */}
          {activeTab === 'orders' && subView === 'list' && (
            <FoodOrdersView
              orders={orders}
              onSelectOrder={(order) => {
                setSelectedOrder(order);
                setSubView('order_tracking');
              }}
              onServeOrder={handleOpenServeOrder}
              onPingKitchen={handleOpenPingKitchenModal}
            />
          )}

          {/* 7. ORDER TRACKING & 5-STAGE KITCHEN STATUS */}
          {subView === 'order_tracking' && selectedOrder && (
            <OrderTrackingView
              order={selectedOrder}
              onBack={() => setSubView('list')}
              onAddItems={handleOpenAddItems}
              onPingKitchen={handleOpenPingKitchenModal}
            />
          )}

          {/* 8. ADD ITEMS TO ORDER */}
          {subView === 'add_items' && selectedOrder && (
            <AddItemsView
              order={selectedOrder}
              onBack={() => setSubView('list')}
              onConfirmAddItems={handleConfirmAddItems}
            />
          )}

          {/* 9. SERVE ORDER 2-STAGE CONFIRMATION */}
          {subView === 'serve_order' && selectedOrder && (
            <ServeOrderView
              order={selectedOrder}
              onBack={() => setSubView('list')}
              onConfirmServed={handleConfirmServed}
            />
          )}

          {/* 10. SHARE / HANDOFF / ESCALATE */}
          {subView === 'share_handoff' && (
            <ShareHandoffView
              mode={handoffMode}
              table={selectedTable}
              request={selectedRequest}
              staffList={staffList}
              onBack={() => setSubView('list')}
              onConfirmHandoff={handleConfirmHandoff}
              onConfirmEscalate={handleConfirmEscalate}
              onConfirmAssignRequest={(reqId, staffName) => handleAssignToColleague(reqId, staffName)}
            />
          )}

          {/* 11. NEW RESERVATION WIZARD */}
          {subView === 'new_reservation' && (
            <NewReservationWizard
              onBack={() => setSubView('list')}
              onComplete={(booking) => {
                showToast(`Reservation #${booking.id} confirmed for ${booking.customerName} on ${booking.tableNumber}!`);
                setSubView('list');
              }}
            />
          )}

          {/* 12. NOTIFICATIONS VIEW */}
          {subView === 'notifications' && (
            <StaffNotificationsView
              onBack={() => setSubView('list')}
              onStartTask={(tableNumber, requestId) => {
                const req = requests.find(r => r.id === requestId) || requests[0];
                setSelectedRequest(req);
                setSubView('request_details');
              }}
              onEscalate={(tableNumber, requestId) => {
                const req = requests.find(r => r.id === requestId) || requests[0];
                setSelectedRequest(req);
                setHandoffMode('escalate_manager');
                setSubView('share_handoff');
              }}
              onClaimRequest={(requestId) => {
                handleClaimRequest(requestId);
              }}
              onAssignRequest={(requestId) => {
                const req = requests.find(r => r.id === requestId) || requests[0];
                setSelectedRequest(req);
                setHandoffMode('assign_request');
                setSubView('share_handoff');
              }}
              onServeOrder={(orderId) => {
                const order = orders.find(o => o.id === orderId) || orders[0];
                handleOpenServeOrder(order);
              }}
              onViewRequest={(requestId) => {
                const req = requests.find(r => r.id === requestId) || requests[0];
                setSelectedRequest(req);
                setSubView('request_details');
              }}
              onReplyManager={() => {
                const req = requests[0];
                setSelectedRequest(req);
                setHandoffMode('escalate_manager');
                setSubView('share_handoff');
              }}
            />
          )}

          {/* 13. STAFF ACTION MENU HUB */}
          {(subView === 'staff_menu' || activeTab === 'menu') && (
            <StaffMenuHubView
              onBack={() => {
                setActiveTab('tables');
                setSubView('list');
              }}
              onNavigateTo={(dest) => {
                if (dest === 'notifications') setSubView('notifications');
                else if (dest === 'activity') setSubView('todays_activity');
                else if (dest === 'feedback') setSubView('my_feedback');
                else if (dest === 'team_handoffs') {
                  setHandoffMode('handoff_table');
                  setSubView('share_handoff');
                } else if (dest === 'logout') {
                  onNavigate?.('/login');
                } else {
                  showToast(`${dest.replace('_', ' ')} opened`);
                }
              }}
            />
          )}

          {/* 14. TODAY'S ACTIVITY TIMELINE */}
          {subView === 'todays_activity' && (
            <TodaysActivityView
              onBack={() => setSubView('staff_menu')}
              onViewRecord={(type, ref) => {
                showToast(`Viewing ${type} record #${ref}`);
              }}
            />
          )}

          {/* 15. MY FEEDBACK REVIEWS */}
          {subView === 'my_feedback' && (
            <MyFeedbackView
              onBack={() => setSubView('staff_menu')}
            />
          )}

          {/* 16. ADD CUSTOMER NOTE */}
          {subView === 'add_customer_note' && (
            <AddCustomerNoteView
              table={selectedTable}
              onBack={() => setSubView('list')}
              onSaveNote={(noteData) => {
                showToast(`Note attached to Table #${selectedTable?.tableNumber || '07'}!`);
                setSubView('list');
              }}
            />
          )}

          {/* 17. HOME TAB / WELCOME DASHBOARD */}
          {activeTab === 'home' && subView === 'list' && (
            <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-5xl mx-auto space-y-6">
              <div className="bg-[#4A154B] text-white rounded-3xl p-8 space-y-4 shadow-lg">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                  Loyaltics Waiter Portal
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight">
                  Welcome back, Rohan!
                </h1>
                <p className="text-sm text-purple-100 max-w-xl">
                  You are currently managing 4 active tables in Indoor Dining. 2 customer requests and 1 food order are ready for action.
                </p>
                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => setActiveTab('tables')}
                    className="px-5 py-2.5 bg-white text-[#4A154B] font-bold text-xs rounded-xl shadow-xs hover:bg-gray-50 transition-colors"
                  >
                    Go to Table Service
                  </button>
                  <button
                    onClick={() => setActiveTab('requests')}
                    className="px-5 py-2.5 bg-purple-900/60 text-white font-bold text-xs rounded-xl hover:bg-purple-900 transition-colors"
                  >
                    View Live Requests ({pendingRequestsCount})
                  </button>
                </div>
              </div>

              {/* Quick Actions Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={() => handleOpenCreateOrder()}
                  className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-purple-300 text-left transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-purple-50 text-[#4A154B] flex items-center justify-center font-bold mb-3">
                    +
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">Create Food Order</h3>
                  <p className="text-xs text-gray-500 mt-1">Scan QR or take direct guest order</p>
                </button>

                <button
                  onClick={() => setSubView('create_request')}
                  className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-purple-300 text-left transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold mb-3">
                    🛎
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">Log Guest Request</h3>
                  <p className="text-xs text-gray-500 mt-1">Water, cutlery, tissues or bill</p>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-5 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-purple-300 text-left transition-all"
                >
                  <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold mb-3">
                    🍽
                  </span>
                  <h3 className="font-bold text-gray-900 text-sm">Serve Ready Food</h3>
                  <p className="text-xs text-gray-500 mt-1">1 kitchen ticket ready to deliver</p>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Bottom Floating/Pinned iPad Navigation Bar */}
        <StaffPortalBottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          requestsCount={pendingRequestsCount}
        />

        {/* MODALS */}
        {pingKitchenOrder && (
          <PingKitchenModal
            order={pingKitchenOrder}
            onClose={() => setPingKitchenOrder(null)}
            onSendPing={handleSendPingKitchen}
          />
        )}

        {shareSummaryTable && (
          <ShareSummaryModal
            table={shareSummaryTable}
            staffList={staffList}
            onClose={() => setShareSummaryTable(null)}
            onSendSummary={handleSendShareSummary}
          />
        )}

        {/* TOAST NOTIFICATION */}
        {toastMessage && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
            <div className={`px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-xs font-semibold text-white ${
              toastMessage.type === 'urgent'
                ? 'bg-rose-600'
                : toastMessage.type === 'info'
                ? 'bg-[#4A154B]'
                : 'bg-emerald-600'
            }`}>
              {toastMessage.type === 'urgent' ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : toastMessage.type === 'info' ? (
                <Info className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

