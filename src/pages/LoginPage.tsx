import React, { useState, useEffect } from 'react';
import { MobileAuthView } from '../components/auth/MobileAuthView';
import { TabletAuthView } from '../components/auth/TabletAuthView';

export interface LoginPageProps {
  onLoginSuccess: (role: 'merchant' | 'customer' | string) => void;
  onGoToOnboarding?: () => void;
  initialRole?: 'role_select' | 'merchant' | 'customer';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onGoToOnboarding,
  initialRole = 'role_select',
}) => {
  // Mobile (< 768px) vs Tablet/Desktop (>= 768px)
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isMobile) {
    return (
      <MobileAuthView
        onLoginSuccess={onLoginSuccess}
        initialRole={initialRole}
      />
    );
  }

  return (
    <TabletAuthView
      onLoginSuccess={onLoginSuccess}
      initialRole={initialRole}
    />
  );
};

export default LoginPage;
