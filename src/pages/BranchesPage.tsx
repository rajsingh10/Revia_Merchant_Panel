import React, { useState, useEffect } from 'react';
import { NavRoute, OutletsData } from '../types';
import { WebBranchesView } from '../components/branches/WebBranchesView';
import { TabletBranchesView } from '../components/branches/TabletBranchesView';

interface BranchesPageProps {
  onNavigate?: (route: NavRoute) => void;
  onBranchSelect?: (branchName: string) => void;
  outlets?: OutletsData[];
  onAddBranch?: (branch: OutletsData) => void;
  selectedOutletId?: string;
  onSelectOutletId?: (id: string) => void;
}

export const BranchesPage: React.FC<BranchesPageProps> = (props) => {
  // Device mode detection: Web Desktop (default) vs iPad Pro Tablet
  const [isTablet, setIsTablet] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('view') === 'tablet' || params.get('device') === 'tablet') {
        return true;
      }
      return window.innerWidth < 1024;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.get('view') && !params.get('device')) {
        setIsTablet(window.innerWidth < 1024);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isTablet) {
    return <TabletBranchesView {...props} />;
  }

  return <WebBranchesView {...props} />;
};

export default BranchesPage;
