import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Lock, Store } from 'lucide-react';

interface Props {
   onNavigate?: (route: string) => void;
}

export const MarketingNavbar: React.FC<Props> = ({ onNavigate }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   const handleNavClick = (anchor: string) => {
      setIsMobileMenuOpen(false);
      if (window.location.pathname === '/') {
         const element = document.querySelector(anchor);
         if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
         } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
         }
      } else if (onNavigate) {
         onNavigate('/');
         setTimeout(() => {
            const element = document.querySelector(anchor);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }
   };

   return (
      <>
         <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'bg-white/85 backdrop-blur-xl border-b border-purple-100 shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between">
               {/* Brand Logo */}
               <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onNavigate?.('/')}
               >
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] flex items-center justify-center shadow-lg shadow-purple-900/20">
                     <span className="text-white font-black text-lg">R</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                     <span className="text-2xl font-black tracking-tight text-[#1E1548]">Revia</span>
                     <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest bg-pink-50 px-1.5 py-0.5 rounded-md">
                        Loyalty
                     </span>
                  </div>
               </motion.div>

               {/* Center Links (Desktop) */}
               <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-bold text-gray-600 bg-white/70 px-6 lg:px-8 py-3 rounded-full backdrop-blur-md border border-purple-100 shadow-sm"
               >
                  <a href="#features" onClick={(e) => { e.preventDefault(); handleNavClick('#features'); }} className="hover:text-[#5844A8] transition-colors cursor-pointer">Features</a>
                  <a href="#how-it-works" onClick={(e) => { e.preventDefault(); handleNavClick('#how-it-works'); }} className="hover:text-[#5844A8] transition-colors cursor-pointer">How It Works</a>
                  <a href="/about" onClick={(e) => { e.preventDefault(); onNavigate?.('/about'); }} className="hover:text-[#5844A8] transition-colors cursor-pointer">About Us</a>
                  <a href="#faq" onClick={(e) => { e.preventDefault(); handleNavClick('#faq'); }} className="hover:text-[#5844A8] transition-colors cursor-pointer">FAQ</a>
               </motion.div>

               {/* Right Action Buttons (Desktop) */}
               <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden md:flex items-center gap-4 lg:gap-6"
               >
                  <button
                     onClick={() => {
                        localStorage.removeItem('token');
                        onNavigate?.('/login');
                     }}
                     className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-[#5844A8] transition-colors cursor-pointer"
                  >
                     <Lock className="w-4 h-4" /> Log In
                  </button>
                  <button
                     onClick={() => onNavigate?.('/onboarding')}
                     className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white px-5 lg:px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/25 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer whitespace-nowrap"
                  >
                     <Store className="w-4 h-4" /> Become Merchant
                  </button>
               </motion.div>

               {/* Mobile Hamburger Icon */}
               <button
                  className="md:hidden z-50 relative p-1 text-[#1E1548] cursor-pointer"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle Navigation Menu"
               >
                  {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
               </button>
            </div>
         </nav>

         {/* Mobile Navigation Drawer */}
         <AnimatePresence>
            {isMobileMenuOpen && (
               <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-0 z-40 bg-[#FAF8FF]/95 backdrop-blur-2xl pt-24 px-6 flex flex-col gap-5 md:hidden border-b border-purple-100 overflow-y-auto text-[#1E1548]"
               >
                  <a
                     href="/"
                     onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate?.('/'); }}
                     className="text-xl font-black border-b border-purple-50 pb-3 text-[#1E1548]"
                  >
                     Home
                  </a>
                  <a
                     href="/about"
                     onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate?.('/about'); }}
                     className="text-xl font-black border-b border-purple-50 pb-3 text-[#1E1548]"
                  >
                     About Us
                  </a>
                  <a
                     href="/contact"
                     onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate?.('/contact'); }}
                     className="text-xl font-black border-b border-purple-50 pb-3 text-[#1E1548]"
                  >
                     Contact
                  </a>
                  <a
                     href="/terms"
                     onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate?.('/terms'); }}
                     className="text-xl font-black border-b border-purple-50 pb-3 text-[#1E1548]"
                  >
                     Terms of Service
                  </a>
                  <a
                     href="/privacy"
                     onClick={(e) => { e.preventDefault(); setIsMobileMenuOpen(false); onNavigate?.('/privacy'); }}
                     className="text-xl font-black border-b border-purple-50 pb-3 text-[#1E1548]"
                  >
                     Privacy Policy
                  </a>

                  <div className="flex flex-col gap-3 mt-auto pb-8 pt-4">
                     <button
                        onClick={() => {
                           localStorage.removeItem('token');
                           setIsMobileMenuOpen(false);
                           onNavigate?.('/login');
                        }}
                        className="w-full py-3 rounded-xl border border-purple-200 bg-white font-bold text-[#1E1548] text-sm flex items-center justify-center gap-2"
                     >
                        <Lock className="w-4 h-4" /> Log In
                     </button>
                     <button
                        onClick={() => {
                           setIsMobileMenuOpen(false);
                           onNavigate?.('/onboarding');
                        }}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2"
                     >
                        <Store className="w-4 h-4" /> Become Merchant
                     </button>
                  </div>
               </motion.div>
            )}
         </AnimatePresence>
      </>
   );
};
