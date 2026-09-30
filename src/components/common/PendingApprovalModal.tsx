import React from 'react';
import { Clock } from 'lucide-react';

interface PendingApprovalModalProps {
  isOpen: boolean;
}

export const PendingApprovalModal: React.FC<PendingApprovalModalProps> = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden flex flex-col p-8 text-center items-center">
        <div className="w-16 h-16 rounded-full bg-[#FDF8EB] flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-[#D4A753]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1A1615] mb-2">Pending Approval</h2>
        <p className="text-sm text-[#6E6A66]">
          Your merchant account is currently under review. 
          <br /><br />
          When the admin approves your business, you will be able to access all modules.
        </p>
      </div>
    </div>
  );
};
