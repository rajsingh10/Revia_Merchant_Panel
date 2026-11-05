import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useCart } from './hooks/useCart';

type MainTab = 'dashboard' | 'scan' | 'menu' | 'orders' | 'coupons' | 'membership' | 'offers' | 'rewards' | 'history' | 'profile' | 'checkout';

interface CustomerContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  mobile: string;
  setMobile: (val: string) => void;
  isExistingMember: boolean;
  hasJoinedLoyalty: boolean;
  setHasJoinedLoyalty: (val: boolean) => void;
  
  // Cart
  cartItems: ReturnType<typeof useCart>['cartItems'];
  addItem: ReturnType<typeof useCart>['addItem'];
  updateQuantity: ReturnType<typeof useCart>['updateQuantity'];
  subtotal: number;
  tax: number;
  total: number;

  // Selected state
  selectedOffer: string | null;
  setSelectedOffer: (id: string | null) => void;
  selectedReward: string | null;
  setSelectedReward: (id: string | null) => void;
  selectedProduct: string | null;
  setSelectedProduct: (id: string | null) => void;

  // Redeemed Rewards State
  redeemedRewardIds: string[];
  redeemReward: (id: string) => void;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mobile, setMobile] = useState('');
  const [isExistingMember] = useState(true);
  const [hasJoinedLoyalty, setHasJoinedLoyalty] = useState(false);

  const { cartItems, addItem, updateQuantity, subtotal, tax, total } = useCart();
  
  const [selectedOffer, setSelectedOffer] = useState<string | null>(null);
  const [selectedReward, setSelectedReward] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  // Track single-use redeemed rewards
  const [redeemedRewardIds, setRedeemedRewardIds] = useState<string[]>([]);

  const redeemReward = (id: string) => {
    setRedeemedRewardIds(prev => prev.includes(id) ? prev : [...prev, id]);
  };

  return (
    <CustomerContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated,
      mobile,
      setMobile,
      isExistingMember,
      hasJoinedLoyalty,
      setHasJoinedLoyalty,
      cartItems,  
      addItem,
      updateQuantity,
      subtotal,
      tax,
      total,
      selectedOffer,
      setSelectedOffer,
      selectedReward,
      setSelectedReward,
      selectedProduct,
      setSelectedProduct,
      redeemedRewardIds,
      redeemReward
    }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomer = () => {
  const context = useContext(CustomerContext);
  if (context === undefined) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
};
