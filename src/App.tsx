import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useParams } from 'react-router-dom';
import { NavRoute, OutletsData } from './types';
import {
  MOCK_CUSTOMERS,
  MOCK_CATALOG_ITEMS,
  MOCK_BRANCHES,
  MOCK_AUDIT_LOGS,
  AVAILABLE_BRANCHES
} from './data/mockData';
import { INITIAL_OUTLETS } from './data/outletsData';

// Shell components
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { CommandPalette } from './components/common/CommandPalette';
import { PendingApprovalModal } from './components/common/PendingApprovalModal';
import apiClient from './api/apiClient';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';

import { MarketingLandingPage } from './pages/MarketingLandingPage';
import { CustomerRouter } from './Customer/CustomerRouter';
import { CampaignLandingPage } from './pages/CampaignLandingPage';
import { CatalogPage } from './pages/CatalogPage';
import { LoyaltyPage } from './pages/LoyaltyPage';
import { CampaignBuilderPage } from './pages/CampaignBuilderPage';
import { BranchesPage } from './pages/BranchesPage';
import { AddNewBranchPage } from './pages/AddNewBranchPage';
import { BrandingPage } from './pages/BrandingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { StaffPage } from './pages/StaffPage';
import { QrCodesPage } from './pages/QrCodesPage';
import { ItemCatalogPage } from './pages/ItemCatalogPage';
import { MastersPage } from './pages/MastersPage';
import { OrderQueuePage } from './pages/OrderQueuePage';
import { TransactionsPage } from './pages/TransactionsPage';
import { RewardsPage } from './pages/RewardsPage';
import { CreateRewardPage } from './pages/CreateRewardPage';
import { RedemptionTerminalPage } from './pages/RedemptionTerminalPage';
import { BillingPage } from './pages/BillingPage';
import { NotificationPage } from './pages/NotificationPage';
import { NotFoundPage } from './pages/NotFoundPage';
// Marketing Pages
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

// Wallet Components & Context
import { WalletProvider } from './context/WalletContext';
import { LowBalanceBanner } from './components/wallet/LowBalanceBanner';
import { AddCreditModal } from './components/wallet/AddCreditModal';
import { NotEnoughCreditModal } from './components/wallet/NotEnoughCreditModal';

const VALID_ROUTES = [
  '/dashboard', '/atelier', '/branches', '/branches/new', '/staff',
  '/loyalty', '/qr-codes', '/item-catalog', '/masters/rule-fields', '/masters/tier-options', '/masters/reward-types', '/masters/asset-types', '/catalog', '/orders', '/invoices',
  '/customerlist', '/transactions', '/campaigns', '/campaigns/new',
  '/terminal', '/rewards', '/rewards/new', '/analytics', '/billing', '/notifications',
  '/settings/audit', '/settings/branding', '/login', '/onboarding',
  '/customer/landing', '/customer', '/customer/identify', '/',
  '/about', '/contact', '/privacy', '/terms'
];


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (token) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const CampaignLandingWrapper = ({ onNavigate }: any) => {
  const { campaignId } = useParams();
  return <CampaignLandingPage campaignId={campaignId || ''} onNavigate={onNavigate} />;
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;

  const [activeBranch, setActiveBranch] = useState<string>(AVAILABLE_BRANCHES[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isStandaloneAuthView, setStandaloneAuthView] = useState<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

  const [businessStatus, setBusinessStatus] = useState<string | null>(null);
  const [debugApiData, setDebugApiData] = useState<any>(null);

  // Core Mock Datasets
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [catalog, setCatalog] = useState(MOCK_CATALOG_ITEMS);
  const [branches, setBranches] = useState(MOCK_BRANCHES);
  const [auditLogs] = useState(MOCK_AUDIT_LOGS);

  // Outlets Data
  const [outlets, setOutlets] = useState<OutletsData[]>(INITIAL_OUTLETS);
  const [selectedOutletId, setSelectedOutletId] = useState<string>('downtown');
  const [branchList, setBranchList] = useState<string[]>(AVAILABLE_BRANCHES);

  const handleAddOutlet = (newOutlet: OutletsData) => {
    setOutlets((prev) => [newOutlet, ...prev]);
    setSelectedOutletId(newOutlet.id);
    setActiveBranch(newOutlet.shortName);
    if (!branchList.includes(newOutlet.shortName)) {
      setBranchList((prev) => [newOutlet.shortName, ...prev]);
    }
  };


  const handleNavigate = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    window.scrollTo(0, 0);
  }, [currentRoute]);

  useEffect(() => {
    const isMerchantPanelRoute = !(
      currentRoute === '/' ||
      currentRoute === '/login' ||
      currentRoute === '/onboarding' ||
      currentRoute.startsWith('/customer') ||
      currentRoute.startsWith('/c/') ||
      ['/about', '/contact', '/privacy', '/terms'].includes(currentRoute)
    );

    const token = localStorage.getItem('token');

    if (isMerchantPanelRoute && token) {
      const fetchBusinessStatus = async () => {
        try {
          const response = await apiClient.get('/merchant/business');
          const responseData = response.data;
          
          // The API structure is typically { status: true, data: { business: { ... status: 'pending_approval' } } }
          const businessData = responseData?.data?.business;
          
          if (businessData && businessData.status) {
            setBusinessStatus(businessData.status);
          } else if (responseData?.data?.status) {
            setBusinessStatus(responseData.data.status);
          } else if (Array.isArray(responseData?.data) && responseData.data.length > 0) {
            setBusinessStatus(responseData.data[0].status || 'success');
          } else {
             setBusinessStatus('success');
          }
        } catch (error) {
          console.error("Failed to check business status", error);
        }
      };
      
      fetchBusinessStatus();
    }
  }, [currentRoute]);

  const isValidRoute = VALID_ROUTES.includes(currentRoute) || currentRoute.startsWith('/customer/') || currentRoute.startsWith('/customerlist/detail') || currentRoute.startsWith('/c/');
  
  const isMerchantPanelRoute = !(
    currentRoute === '/' ||
    currentRoute === '/login' ||
    currentRoute === '/onboarding' ||
    currentRoute.startsWith('/customer') ||
    currentRoute.startsWith('/c/') ||
    ['/about', '/contact', '/privacy', '/terms'].includes(currentRoute)
  );

  if (!isMerchantPanelRoute) {
    return (
      <Routes>
        <Route path="/" element={<MarketingLandingPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/about" element={<AboutUsPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/contact" element={<ContactPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/privacy" element={<PrivacyPolicyPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/terms" element={<TermsOfServicePage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/login" element={
          <PublicRoute>
            <LoginPage
              onLoginSuccess={(role) => {
                if (role.startsWith('/')) {
                  handleNavigate(role as NavRoute);
                } else if (role === 'customer') {
                  handleNavigate('/customer/identify');
                } else {
                  handleNavigate('/dashboard');
                }
              }}
              onGoToOnboarding={() => handleNavigate('/onboarding')}
            />
          </PublicRoute>
        } />
        <Route path="/onboarding" element={
          <ProtectedRoute>
            <OnboardingPage
              onComplete={() => handleNavigate('/dashboard')}
              onCancel={() => handleNavigate('/')}
            />
          </ProtectedRoute>
        } />
        <Route path="/customer/*" element={<CustomerRouter currentRoute={currentRoute} onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
        <Route path="/c/:campaignId" element={<CampaignLandingWrapper onNavigate={(route: any) => handleNavigate(route as NavRoute)} />} />
        <Route path="*" element={<NotFoundPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
      </Routes>
    );
  }

  return (
    <WalletProvider>
      <div className="flex h-screen bg-[#FAF8F5] text-[#1A1615] font-sans antialiased selection:bg-[#FAF6EE] selection:text-[#A37837] overflow-hidden">
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[50] lg:hidden backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        <CommandPalette
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate as any}
        />
        <AddCreditModal />
        <NotEnoughCreditModal />
        <PendingApprovalModal isOpen={businessStatus === 'pending' || businessStatus === 'pending_approval'} />
        
        <Sidebar
          currentRoute={currentRoute as NavRoute}
          onRouteChange={handleNavigate as any}
          activeBranch={activeBranch}
          onBranchChange={setActiveBranch}
          branches={branchList}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        
        <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-scroll">
          <LowBalanceBanner />
          <Header
            currentRoute={currentRoute as NavRoute}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onNavigate={handleNavigate as any}
          />
          <main className={`flex-1 ${currentRoute === '/analytics' ? 'pb-0' : 'pb-0'} ${['/billing', '/settings/audit'].includes(currentRoute) ? 'page-text-scale' : ''}`}>
            {!isValidRoute ? (
              <NotFoundPage onNavigate={(route) => handleNavigate(route as NavRoute)} />
            ) : (
              <Routes>
                <Route path="/dashboard" element={<ProtectedRoute><DashboardPage onNavigate={handleNavigate as any} customers={customers} catalog={catalog} branches={branches} /></ProtectedRoute>} />
                <Route path="/branches" element={<ProtectedRoute><BranchesPage onNavigate={handleNavigate as any} onBranchSelect={setActiveBranch} outlets={outlets} onAddBranch={handleAddOutlet} selectedOutletId={selectedOutletId} onSelectOutletId={setSelectedOutletId} /></ProtectedRoute>} />
                <Route path="/branches/new" element={<ProtectedRoute><AddNewBranchPage onNavigate={handleNavigate as any} onAddBranch={handleAddOutlet} /></ProtectedRoute>} />
                <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
                <Route path="/loyalty" element={<ProtectedRoute><LoyaltyPage /></ProtectedRoute>} />
                <Route path="/qr-codes" element={<ProtectedRoute><QrCodesPage /></ProtectedRoute>} />
                <Route path="/item-catalog" element={<ProtectedRoute><ItemCatalogPage /></ProtectedRoute>} />
                <Route path="/masters/rule-fields" element={<ProtectedRoute><MastersPage defaultTab="fields" /></ProtectedRoute>} />
                <Route path="/masters/tier-options" element={<ProtectedRoute><MastersPage defaultTab="tiers" /></ProtectedRoute>} />
                <Route path="/masters/reward-types" element={<ProtectedRoute><MastersPage defaultTab="rewards" /></ProtectedRoute>} />
                <Route path="/masters/asset-types" element={<ProtectedRoute><MastersPage defaultTab="assets" /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><OrderQueuePage onNavigate={handleNavigate as any} /></ProtectedRoute>} />
                <Route path="/customerlist" element={<ProtectedRoute><CustomersPage customers={customers} onUpdateCustomer={(updated) => setCustomers((c) => c.map((cust) => (cust.id === updated.id ? updated : cust)))} onAddCustomer={(newCustomer) => setCustomers((c) => [newCustomer, ...c])} onViewCustomer={(id) => handleNavigate(`/customerlist/detail?id=${id}` as any)} /></ProtectedRoute>} />
                <Route path="/customerlist/detail" element={<ProtectedRoute><CustomerDetailPage onNavigate={handleNavigate as any} customer={customers.find(c => { const searchParams = new URLSearchParams(window.location.search); return c.id === searchParams.get('id'); })} /></ProtectedRoute>} />
                <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                <Route path="/campaigns" element={<ProtectedRoute><CampaignBuilderPage initialViewMode="dashboard" onNavigate={(route) => handleNavigate(route as NavRoute)} /></ProtectedRoute>} />
                <Route path="/campaigns/new" element={<ProtectedRoute><CampaignBuilderPage initialViewMode="builder" onNavigate={(route) => handleNavigate(route as NavRoute)} /></ProtectedRoute>} />
                <Route path="/rewards" element={<ProtectedRoute><RewardsPage onNavigate={handleNavigate as any} /></ProtectedRoute>} />
                <Route path="/rewards/new" element={<ProtectedRoute><CreateRewardPage onNavigate={handleNavigate as any} /></ProtectedRoute>} />
                <Route path="/terminal" element={<ProtectedRoute><RedemptionTerminalPage /></ProtectedRoute>} />
                <Route path="/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
                <Route path="/billing" element={<ProtectedRoute><BillingPage /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
                <Route path="/settings/audit" element={<ProtectedRoute><AuditLogPage logs={auditLogs} /></ProtectedRoute>} />
                <Route path="/settings/branding" element={<ProtectedRoute><BrandingPage onNavigate={handleNavigate as any} /></ProtectedRoute>} />
                <Route path="/catalog" element={<ProtectedRoute><CatalogPage catalog={catalog} onUpdateItem={(updatedItem) => setCatalog((c) => c.map((item) => (item.id === updatedItem.id ? updatedItem : item)))} onAddItem={(newItem) => setCatalog((c) => [newItem, ...c])} /></ProtectedRoute>} />
                <Route path="*" element={<NotFoundPage onNavigate={(route) => handleNavigate(route as NavRoute)} />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </WalletProvider>
  );
}
