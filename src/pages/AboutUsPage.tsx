import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { MarketingNavbar } from '../components/layout/MarketingNavbar';
import { MarketingFooter } from '../components/layout/MarketingFooter';

interface Props {
   onNavigate?: (route: string) => void;
}

export const AboutUsPage: React.FC<Props> = ({ onNavigate }) => {
   return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans selection:bg-purple-200 relative overflow-hidden">
         {/* Background Elements */}
         <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none z-0" />
         <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF4E8D]/10 rounded-full blur-[120px] pointer-events-none z-0" />

         {/* UNIFIED NAVBAR */}
         <MarketingNavbar onNavigate={onNavigate} />

         {/* MAIN CONTENT */}
         <main className="pt-28 sm:pt-32 pb-12 relative z-10">
            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center mb-16">
               <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl lg:text-7xl font-black tracking-tight text-[#1E1548] mb-6">
                  Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#5844A8] to-[#FF4E8D]">Story</span>
               </motion.h1>
               <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-xl text-gray-600 font-medium leading-relaxed">
                  We are building the future of customer loyalty for local businesses. Revia empowers merchants to create seamless, magical experiences that turn first-time visitors into lifelong fans.
               </motion.p>
            </div>

            <div className="max-w-5xl mx-auto px-6 lg:px-8">
               <button 
                  onClick={() => { if (window.history.length > 2) { window.history.back(); } else { onNavigate?.('/'); } }} 
                  className="flex items-center gap-2 text-sm font-bold text-[#5844A8] hover:text-[#2D1A47] mb-6 transition-colors group cursor-pointer"
               >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go Back
               </button>
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-xl rounded-3xl p-10 lg:p-16 shadow-sm border border-purple-100 relative">
                  <div className="absolute -top-3 -left-3 w-14 h-5 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] -rotate-12 rounded-sm opacity-90 shadow-sm" />
                  <div className="absolute -top-3 -right-3 w-14 h-5 bg-gradient-to-r from-[#FF4E8D] to-[#7C3AED] rotate-12 rounded-sm opacity-90 shadow-sm" />
                  
                  <div className="prose prose-lg max-w-none text-gray-600 font-medium">
                     <p className="mb-6">
                        Revia was born out of a simple observation: big brands have incredible, data-driven loyalty programs, while local merchants are stuck with paper punch cards or clunky apps nobody wants to download.
                     </p>
                     <p className="mb-6">
                        We believe local businesses deserve enterprise-grade tools without the enterprise complexity. That's why we built Revia to be completely frictionless—no app downloads, no complicated sign-ups, just a simple QR scan that connects merchants with their customers instantly.
                     </p>
                     <p>
                        Our mission is to help 1 million local businesses thrive by giving them the power to understand, engage, and retain their customers like never before.
                     </p>
                  </div>
               </motion.div>
            </div>
         </main>

         {/* FOOTER */}
         <MarketingFooter onNavigate={onNavigate} />
      </div>
   );
};
