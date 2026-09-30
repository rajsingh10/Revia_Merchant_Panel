const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `  const handleNavigate = (route: NavRoute) => {
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
  }, []);`;

const replacement = `  const handleNavigate = (route: string) => {
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
  }, [currentRoute]);`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
} else {
  // Try regex if exact match fails due to line endings
  content = content.replace(/  const handleNavigate = \(route: NavRoute\) => \{[\s\S]*?\}, \[\]\);/, replacement);
}

// Fix TS Error 292
content = content.replace(
  'onViewCustomer={(id) => handleNavigate(`/customerlist/detail?id=${id}`)}',
  'onViewCustomer={(id) => handleNavigate(`/customerlist/detail?id=${id}` as any)}'
);

fs.writeFileSync('src/App.tsx', content);
