import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { MarketingNavbar } from '../components/layout/MarketingNavbar';
import { MarketingFooter } from '../components/layout/MarketingFooter';

interface Props {
   onNavigate?: (route: string) => void;
}

export const PrivacyPolicyPage: React.FC<Props> = ({ onNavigate }) => {
   return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans selection:bg-purple-100 selection:text-[#5844A8] relative overflow-hidden">
         <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none z-0" />
         <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF4E8D]/10 rounded-full blur-[120px] pointer-events-none z-0" />
         
         <MarketingNavbar onNavigate={onNavigate} />

         <main className="pt-28 sm:pt-32 pb-12 relative z-10">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
               <button 
                  onClick={() => { if (window.history.length > 2) { window.history.back(); } else { onNavigate?.('/'); } }} 
                  className="flex items-center gap-2 text-sm font-bold text-[#5844A8] hover:text-[#1E1548] mb-6 transition-colors group cursor-pointer"
               >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go Back
               </button>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 lg:p-16 shadow-sm border border-purple-100/70 relative">
                  <div className="absolute -top-4 -left-4 w-16 h-6 bg-gradient-to-r from-[#FF4E8D] to-[#7C3AED] -rotate-12 rounded-sm opacity-90 shadow-sm" />
                  
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-[#1E1548] mb-4">Privacy Policy</h1>
                  <p className="text-gray-500 font-medium mb-10 border-b border-purple-100 pb-10">Last Updated: September 14, 2026</p>

                  <div className="prose prose-lg max-w-none text-gray-600 font-medium space-y-6">
                     <p>At Revia, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our platform.</p>
                     
                     <h3 className="text-xl font-bold text-[#1E1548] mt-8 mb-4">1. Information We Collect</h3>
                     <p>We collect personal information that you voluntarily provide to us when you register on the platform, express an interest in obtaining information about us or our products, or otherwise contact us.</p>
                     
                     <h3 className="text-xl font-bold text-[#1E1548] mt-8 mb-4">2. How We Use Your Information</h3>
                     <p>We use the information we collect to operate, maintain, and provide the features and functionality of the platform, as well as to communicate directly with you.</p>
                     
                     <h3 className="text-xl font-bold text-[#1E1548] mt-8 mb-4">3. Security of Your Information</h3>
                     <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.</p>
                     
                     <h3 className="text-xl font-bold text-[#1E1548] mt-8 mb-4">4. Contact Us</h3>
                     <p>If you have questions or comments about this Privacy Policy, please contact us at privacy@revia.app.</p>
                  </div>
               </motion.div>
            </div>
         </main>

         {/* FOOTER */}
         <MarketingFooter onNavigate={onNavigate} />
      </div>
   );
};
