const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  'import React, { useState, useEffect, useRef } from \'react\';',
  'import React, { useState, useEffect, useRef } from \'react\';\nimport { Routes, Route, Navigate, useNavigate, useLocation, useParams } from \'react-router-dom\';'
);

// 2. Add Route Wrappers
const routeWrappers = `
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
`;

content = content.replace('export default function App() {', routeWrappers + '\nexport default function App() {');

// 3. Replace state block
content = content.replace(
  /  const \[currentRoute, setCurrentRouteState\][^]+?const \[activeBranch, setActiveBranch\] = useState<string>\(AVAILABLE_BRANCHES\[0\]\);/,
  `  const navigate = useNavigate();
  const location = useLocation();
  const currentRoute = location.pathname;

  const [activeBranch, setActiveBranch] = useState<string>(AVAILABLE_BRANCHES[0]);`
);

// 4. Replace handleNavigate
content = content.replace(
  /  const handleNavigate = \(route: NavRoute\) => \{[^]+?window\.scrollTo\(0, 0\);\n  \};\n\n  useEffect\(\(\) => \{\n    if \(mainContentRef\.current\)[^]+?\n  \}, \[currentRoute\]\);\n\n  useEffect\(\(\) => \{\n    const handlePopState = \(\) => \{[^]+?\n  \}, \[\]\);/,
  `  const handleNavigate = (route: string) => {
    navigate(route);
    setIsMobileMenuOpen(false);
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    window.scrollTo(0, 0);
  };`
);

// 5. Replace render block
content = content.replace(
  /  const isValidRoute = VALID_ROUTES[^]+$/,
  `  const isValidRoute = VALID_ROUTES.includes(currentRoute) || currentRoute.startsWith('/customer/') || currentRoute.startsWith('/customerlist/detail') || currentRoute.startsWith('/c/');
  
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
          <main className={\`flex-1 \${currentRoute === '/analytics' ? 'pb-0' : 'pb-0'} \${['/billing', '/settings/audit'].includes(currentRoute) ? 'page-text-scale' : ''}\`}>
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
                <Route path="/orders" element={<ProtectedRoute><OrderQueuePage onNavigate={handleNavigate as any} /></ProtectedRoute>} />
                <Route path="/customerlist" element={<ProtectedRoute><CustomersPage customers={customers} onUpdateCustomer={(updated) => setCustomers((c) => c.map((cust) => (cust.id === updated.id ? updated : cust)))} onAddCustomer={(newCustomer) => setCustomers((c) => [newCustomer, ...c])} onViewCustomer={(id) => handleNavigate(\`/customerlist/detail?id=\${id}\`)} /></ProtectedRoute>} />
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
`
);

fs.writeFileSync('src/App.tsx', content);
