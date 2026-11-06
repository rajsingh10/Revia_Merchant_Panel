import React from 'react';
import { LoginPage } from './LoginPage';

interface OnboardingPageProps {
  onComplete: () => void;
  onCancel: () => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete, onCancel }) => {
  return (
    <LoginPage
      onLoginSuccess={(role) => {
        if (role === 'customer') {
          onCancel();
        } else {
          onComplete();
        }
      }}
      onGoToOnboarding={() => {}}
    />
  );
};
