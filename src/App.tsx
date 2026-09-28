import React, { useState, useEffect, useRef } from 'react';
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

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { CustomersPage } from './pages/CustomersPage';
import { CustomerDetailPage } from './pages/CustomerDetailPage';

import { MarketingLandingPage } from './pages/MarketingLandingPage';
import { CustomerRouter } from './Customer/CustomerRouter';
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
  '/loyalty', '/qr-codes', '/item-catalog', '/catalog', '/orders', '/invoices',
  '/customerlist', '/transactions', '/campaigns', '/campaigns/new',
  '/terminal', '/rewards', '/rewards/new', '/analytics', '/billing', '/notifications',
  '/settings/audit', '/settings/branding', '/login', '/onboarding',
  '/customer/landing', '/customer', '/customer/identify', '/',
  '/about', '/contact', '/privacy', '/terms'
];

export default function App() {
  const [currentRoute, setCurrentRouteState] = useState<NavRoute>(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') {
      return '/';
    }
    return path as NavRoute;
  });
  const [activeBranch, setActiveBranch] = useState<string>(AVAILABLE_BRANCHES[0]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isStandaloneAuthView, setStandaloneAuthView] = useState<boolean>(false);
  const mainContentRef = useRef<HTMLDivElement>(null);

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


  const handleNavigate = (route: NavRoute) => {
    window.history.pushState({}, '', route);
    setCurrentRouteState(route);
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
    const handlePopState = () => {
      const path = window.location.pathname;
      setCurrentRouteState((path === '/' || path === '' ? '/' : path) as NavRoute);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isValidRoute = VALID_ROUTES.includes(currentRoute) || currentRoute.startsWith('/customer/') || currentRoute.startsWith('/customerlist/detail');
  if (!isValidRoute) {
    return <NotFoundPage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  if (currentRoute === '/') {
    return <MarketingLandingPage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  if (currentRoute === '/about') {
    return <AboutUsPage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  if (currentRoute === '/contact') {
    return <ContactPage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  if (currentRoute === '/privacy') {
    return <PrivacyPolicyPage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  if (currentRoute === '/terms') {
    return <TermsOfServicePage onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }





  if (currentRoute === '/customer' || currentRoute.startsWith('/customer/')) {
    return <CustomerRouter currentRoute={currentRoute} onNavigate={(route) => handleNavigate(route as NavRoute)} />;
  }

  // Render auth and onboarding pages directly as standalone
  if (currentRoute === '/login') {
    return (
      <LoginPage
        onLoginSuccess={(role) => {
          if (role.startsWith('/')) {
            handleNavigate(role as NavRoute);
          } else if (role === 'customer') {
            // Navigate to onboarding after successful customer login
            handleNavigate('/customer/identify');
          } else {
            handleNavigate('/dashboard');
          }
        }}
        onGoToOnboarding={() => handleNavigate('/onboarding')}
      />
    );
  }

  if (currentRoute === '/onboarding') {
    return (
      <OnboardingPage
        onComplete={() => handleNavigate('/dashboard')}
        onCancel={() => handleNavigate('/')}
      />
    );
  }

  return (
    <WalletProvider>
      <div className="flex h-screen bg-[#FAF8F5] text-[#1A1615] font-sans antialiased selection:bg-[#FAF6EE] selection:text-[#A37837] overflow-hidden">
        {/* Mobile Drawer Backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-[50] lg:hidden backdrop-blur-xs transition-opacity cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* ⌘K Global Command Palette */}
        <CommandPalette
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigate={handleNavigate}
        />

        {/* Global Modals for Wallet Top-Up and Blocked Action */}
        <AddCreditModal />
        <NotEnoughCreditModal />

        {/* Persistent Desktop Sidebar (w-[240px]) & Mobile Drawer */}
        <Sidebar
          currentRoute={currentRoute}
          onRouteChange={handleNavigate}
          activeBranch={activeBranch}
          onBranchChange={setActiveBranch}
          branches={branchList}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Viewport (Starts right next to Sidebar, no overlap!) */}
        <div ref={mainContentRef} className="flex-1 flex flex-col min-w-0 h-screen overflow-y-scroll">
          {/* Global Low Balance Banner rendered at the very top of merchant panel layout */}
          <LowBalanceBanner />

          {/* Top Header */}
          <Header
            currentRoute={currentRoute}
            onOpenSearch={() => setIsSearchOpen(true)}
            onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            onNavigate={handleNavigate}
          />

          {/* Dynamic Page Routing Area */}
          <main className={`flex-1 ${currentRoute === '/analytics' ? 'pb-0' : 'pb-0'} ${['/billing', '/settings/audit'].includes(currentRoute) ? 'page-text-scale' : ''}`}>
            {currentRoute === '/dashboard' && (
              <DashboardPage
                onNavigate={handleNavigate}
                customers={customers}
                catalog={catalog}
                branches={branches}
              />
            )}

            {currentRoute === '/branches' && (
              <BranchesPage
                onNavigate={handleNavigate}
                onBranchSelect={setActiveBranch}
                outlets={outlets}
                onAddBranch={handleAddOutlet}
                selectedOutletId={selectedOutletId}
                onSelectOutletId={setSelectedOutletId}
              />
            )}

            {currentRoute === '/branches/new' && (
              <AddNewBranchPage
                onNavigate={handleNavigate}
                onAddBranch={handleAddOutlet}
              />
            )}

            {currentRoute === '/staff' && (
              <StaffPage />
            )}

            {currentRoute === '/loyalty' && (
              <LoyaltyPage />
            )}

            {currentRoute === '/qr-codes' && (
              <QrCodesPage />
            )}

            {currentRoute === '/item-catalog' && (
              <ItemCatalogPage />
            )}

            {currentRoute === '/orders' && (
              <OrderQueuePage onNavigate={handleNavigate} />
            )}

            {currentRoute === '/customerlist' && (
              <CustomersPage
                customers={customers}
                onUpdateCustomer={(updated) => {
                  setCustomers((currentCustomers) =>
                    currentCustomers.map((customer) => (customer.id === updated.id ? updated : customer))
                  );
                }}
                onAddCustomer={(newCustomer) => {
                  setCustomers((currentCustomers) => [newCustomer, ...currentCustomers]);
                }}
                onViewCustomer={(id) => handleNavigate(`/customerlist/detail?id=${id}` as NavRoute)}
              />
            )}

            {currentRoute.startsWith('/customerlist/detail') && (
              <CustomerDetailPage 
                onNavigate={handleNavigate}
                customer={customers.find(c => {
                  const searchParams = new URLSearchParams(window.location.search);
                  return c.id === searchParams.get('id');
                })}
              />
            )}

            {currentRoute === '/transactions' && (
              <TransactionsPage />
            )}

            {currentRoute === '/campaigns' && (
              <CampaignBuilderPage initialViewMode="dashboard" onNavigate={(route) => handleNavigate(route as NavRoute)} />
            )}

            {currentRoute === '/campaigns/new' && (
              <CampaignBuilderPage initialViewMode="builder" onNavigate={(route) => handleNavigate(route as NavRoute)} />
            )}

            {currentRoute === '/rewards' && (
              <RewardsPage onNavigate={handleNavigate} />
            )}

            {currentRoute === '/rewards/new' && (
              <CreateRewardPage onNavigate={handleNavigate} />
            )}

            {currentRoute === '/terminal' && (
              <RedemptionTerminalPage />
            )}

            {currentRoute === '/analytics' && (
              <AnalyticsPage />
            )}

            {currentRoute === '/billing' && (
              <BillingPage />
            )}

            {currentRoute === '/notifications' && (
              <NotificationPage />
            )}

            {currentRoute === '/settings/audit' && (
              <AuditLogPage logs={auditLogs} />
            )}

            {currentRoute === '/settings/branding' && (
              <BrandingPage onNavigate={handleNavigate} />
            )}

            {currentRoute === '/catalog' && (
              <CatalogPage
                catalog={catalog}
                onUpdateItem={(updatedItem) => {
                  setCatalog((currentCatalog) =>
                    currentCatalog.map((item) => (item.id === updatedItem.id ? updatedItem : item))
                  );
                }}
                onAddItem={(newItem) => {
                  setCatalog((currentCatalog) => [newItem, ...currentCatalog]);
                }}
              />
            )}

          </main >
        </div >
      </div >
    </WalletProvider>
  );
}
