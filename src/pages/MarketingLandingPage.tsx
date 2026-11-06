import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
   QrCode, ArrowRight, CheckCircle2, Star, Shield,
   Smartphone, Gift, Clock, ChevronRight, Menu, X,
   Zap, RefreshCw, Eye, Lock, Bell, TrendingUp,
   Coffee, Scissors, Dumbbell, ShoppingBag, Store,
   Megaphone, MapPin, BarChart3, Users, CreditCard,
   ChevronDown, Sparkles, Phone, Mail, Wifi, Globe
} from 'lucide-react';
import { StaggerTestimonials } from '../components/ui/stagger-testimonials';
import { FAQSection } from '../components/ui/faqsection';
import { MarketingNavbar } from '../components/layout/MarketingNavbar';
import { MarketingFooter } from '../components/layout/MarketingFooter';

interface Props {
   onNavigate?: (route: string) => void;
}

// ─── Reusable Components ─────────────────────────────────────────────────────

const GoldBadge = ({ children }: { children: React.ReactNode }) => (
   <motion.span
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="inline-flex items-center gap-1.5 bg-purple-100/80 text-[#5844A8] border border-purple-200/60 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xs backdrop-blur-sm"
   >
      {children}
   </motion.span>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
   <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex items-center justify-center gap-4 mb-6"
   >
      <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#7C3AED]" />
      <span className="text-[#5844A8] text-[10px] font-black uppercase tracking-[0.25em]">{children}</span>
      <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#7C3AED]" />
   </motion.div>
);

const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
   <div className={`bg-white/80 backdrop-blur-xl border border-purple-100 shadow-[0_8px_30px_rgba(45,26,71,0.04)] rounded-3xl ${className}`}>
      {children}
   </div>
);

const RealQRCodeSVG: React.FC<{ className?: string }> = ({ className = "w-36 h-36" }) => {
   const matrix = [
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1],
      [0, 1, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 1, 0, 1, 0],
      [1, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1],
      [0, 1, 0, 1, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0],
      [1, 0, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1],
      [1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 1, 1, 0, 1],
      [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1]
   ];
   const size = matrix.length;

   return (
      <svg viewBox={`0 0 ${size} ${size}`} className={className} shapeRendering="crispEdges">
         <rect width={size} height={size} fill="white" />
         {matrix.map((row, r) =>
            row.map((cell, c) =>
               cell === 1 ? <rect key={`${r}-${c}`} x={c} y={r} width={1} height={1} fill="#111111" /> : null
            )
         )}
      </svg>
   );
};

// ─── Mobile Mockup Frame ──────────────────────────────────────────────────────
const MobileFrame = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      className={`relative w-[280px] sm:w-[300px] bg-white rounded-[36px] border-[8px] sm:border-[10px] border-[#2D1A47] shadow-2xl overflow-hidden flex flex-col ${className}`}
      style={{ height: 'auto', minHeight: 440, boxShadow: '0 25px 50px -12px rgba(88, 68, 168, 0.25)' }}
   >
      {/* Status bar */}
      <div className="bg-white flex items-center justify-between px-6 pt-5 pb-3 shrink-0 z-10">
         <span className="text-[11px] font-bold text-[#2D1A47] tracking-tight">9:41</span>
         <div className="w-20 h-5 bg-[#2D1A47] rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2" />
         <div className="flex gap-1.5 items-center">
            <div className="w-5 h-2.5 border border-[#2D1A47] rounded-[3px] relative"><div className="absolute inset-[1px] right-auto w-[65%] bg-[#2D1A47] rounded-[2px]" /></div>
         </div>
      </div>
      <div className="flex-1 overflow-hidden bg-[#FAF8FF]">{children}</div>
   </motion.div>
);

const DashboardFrame = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
   <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7 }}
      viewport={{ once: true }}
      className={`relative w-full max-w-[550px] bg-white/95 backdrop-blur-xl rounded-2xl border border-purple-100 shadow-2xl overflow-hidden flex flex-col ${className}`}
      style={{ height: 420, boxShadow: '0 25px 50px -12px rgba(45, 26, 71, 0.15)' }}
   >
      <div className="bg-purple-50/60 backdrop-blur-sm flex items-center gap-2 px-4 py-3 shrink-0 border-b border-purple-100/60">
         <div className="w-3 h-3 rounded-full bg-red-400" />
         <div className="w-3 h-3 rounded-full bg-amber-400" />
         <div className="w-3 h-3 rounded-full bg-green-400" />
         <div className="flex-1" />
         <div className="w-48 h-5 bg-white rounded-md shadow-inner border border-purple-50" />
      </div>
      <div className="flex-1 overflow-hidden flex bg-[#FAF8FF]">
         <div className="w-16 border-r border-purple-100/60 bg-white/80 flex flex-col items-center py-4 gap-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#5844A8] shadow-md mb-4 flex items-center justify-center text-white text-xs font-black">R</div>
            <div className="w-6 h-6 rounded-md bg-purple-50" />
            <div className="w-6 h-6 rounded-md bg-purple-50" />
            <div className="w-6 h-6 rounded-md bg-purple-50" />
         </div>
         <div className="flex-1 p-5 overflow-hidden relative">
            {children}
         </div>
      </div>
   </motion.div>
);


export const MarketingLandingPage: React.FC<Props> = ({ onNavigate }) => {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
   const [activeFaq, setActiveFaq] = useState<number | null>(null);
   const [activeSlide, setActiveSlide] = useState(0);

   useEffect(() => {
      const handleScroll = () => setIsScrolled(window.scrollY > 20);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
   }, []);

   // Auto-rotate hero preview slides every 4 seconds
   useEffect(() => {
      const interval = setInterval(() => {
         setActiveSlide((prev) => (prev + 1) % 2);
      }, 4000);
      return () => clearInterval(interval);
   }, []);

   const faqs = [
      { q: "Does my customer need to download an app?", a: "No. Customers simply scan your QR code with their phone camera and join instantly via a mobile web browser." },
      { q: "How much does Revia cost?", a: "We offer plans starting from ₹49/mo, with a 14-day free trial. See our pricing section for detailed information." },
      { q: "Can I run it across multiple branches?", a: "Yes! The Growth and Enterprise plans support multi-branch management from a single unified dashboard." },
      { q: "How long does setup take?", a: "Under 10 minutes. Create an account, set your loyalty rules, print your QR code, and you are ready to go." },
      { q: "Can I create custom campaigns and discounts?", a: "Absolutely. You can create BOGO offers, double stamp days, and targeted discounts for specific customer segments." },
      { q: "Is there a free trial?", a: "Yes, every new account comes with a 14-day full-feature free trial. No credit card required to start." }
   ];

   const containerVariants = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
   };

   const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } }
   };

   return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans selection:bg-purple-200 relative overflow-hidden">

         {/* Global decorative blurs */}
         <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none z-0" />
         <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF4E8D]/10 rounded-full blur-[120px] pointer-events-none z-0" />

         {/* ═══════════════════════════════════════ */}
         {/* 1. NAVBAR                             */}
         {/* ═══════════════════════════════════════ */}
         <MarketingNavbar onNavigate={onNavigate} />

         {/* ═══════════════════════════════════════ */}
         {/* 2. HERO SECTION                       */}
         {/* ═══════════════════════════════════════ */}
         <section className="pt-20 sm:pt-24 lg:pt-28 pb-4 sm:pb-6 lg:pb-10 overflow-hidden relative z-10 bg-[linear-gradient(to_right,#5844a80a_1px,transparent_1px),linear-gradient(to_bottom,#5844a80a_1px,transparent_1px)] bg-[size:24px_24px]">
            {/* Animated decorative blobs */}
            <motion.div
               animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
               transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
               className="absolute top-[10%] left-[5%] w-96 h-96 bg-[#7C3AED]/10 rounded-[40%_60%_70%_30%] blur-3xl pointer-events-none z-0"
            />
            <motion.div
               animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
               transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
               className="absolute bottom-[10%] right-[5%] w-[30rem] h-[30rem] bg-[#FF4E8D]/10 rounded-[60%_40%_30%_70%] blur-3xl pointer-events-none z-0"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-12 items-center relative z-10">
               <motion.div variants={containerVariants} initial="hidden" animate="visible" className="relative">
                  <div className="absolute -left-6 -top-6 w-20 h-20 bg-[radial-gradient(circle_at_center,rgba(124,58,237,0.15)_0,transparent_50%)]" />
                  <motion.div variants={itemVariants}>
                     <GoldBadge><Sparkles className="w-3 h-3 text-[#5844A8]" /> Loyalty &amp; Retention Platform</GoldBadge>
                  </motion.div>
                  <motion.h1 variants={itemVariants} className="mt-4 sm:mt-5 text-3xl sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem] font-black leading-[1.08] tracking-tight text-[#1E1548] drop-shadow-xs">
                     Turn every customer into a <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7C3AED] via-[#5844A8] to-[#FF4E8D] relative inline-block">
                        repeat customer
                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 12" preserveAspectRatio="none">
                           <path d="M0,10 Q50,0 100,10" fill="none" stroke="rgba(124,58,237,0.3)" strokeWidth="4" strokeLinecap="round" />
                        </svg>
                     </span>
                  </motion.h1>
                  <motion.p variants={itemVariants} className="mt-4 sm:mt-5 text-base sm:text-lg text-gray-600 leading-relaxed max-w-lg font-medium">
                     QR-based loyalty, targeted campaigns, and rewards — no app download required for your customers. Built to seamlessly integrate with your counter.
                  </motion.p>
                  <motion.div variants={itemVariants} className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                     <button onClick={() => onNavigate?.('/onboarding')} className="cursor-pointer bg-gradient-to-r from-[#7C3AED] to-[#5844A8] hover:from-[#6D28D9] hover:to-[#4C1D95] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-black shadow-xl shadow-purple-500/25 hover:shadow-[0_20px_40px_rgba(124,58,237,0.35)] hover:scale-105 transition-all duration-300 flex justify-center items-center gap-3 group relative overflow-hidden">
                        <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        <span className="relative z-10 flex items-center gap-2">Start Free <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></span>
                     </button>
                     <button onClick={() => onNavigate?.('/login')} className="cursor-pointer bg-white/80 backdrop-blur-md border-2 border-purple-100 hover:border-[#5844A8]/50 hover:bg-purple-50/50 text-[#1E1548] px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-black transition-all shadow-xs hover:shadow-md flex justify-center items-center">
                        Become Merchant
                     </button>
                  </motion.div>
                  <motion.p variants={itemVariants} className="mt-5 sm:mt-6 text-sm text-gray-500 font-bold flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-[#5844A8]" /> No credit card required · Setup in under 10 minutes
                  </motion.p>
               </motion.div>

               <div className="flex justify-center lg:justify-end lg:pr-6 h-[440px] sm:h-[500px] lg:h-[400px] items-center mt-2 sm:mt-6 lg:mt-0 pb-2 sm:pb-0 w-full relative max-sm:overflow-x-clip">
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                     {/* Ambient glow behind phone */}
                     <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-br from-[#7C3AED]/30 to-[#FF4E8D]/20 rounded-full blur-[80px]" />

                     <AnimatePresence mode="wait">
                        {activeSlide === 0 && (
                           <motion.div
                              key="slide0"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.5 }}
                              className="relative w-full max-w-[400px] h-full flex flex-col items-center justify-center"
                           >
                              <div className="relative w-full flex justify-center mt-4 sm:mt-20 max-sm:scale-80 max-sm:origin-center">
                                 {/* Standee Card */}
                                 <div className="bg-[#FAF8FF] border-2 border-purple-100 rounded-[28px] p-5 shadow-xl w-[220px] sm:w-[280px] aspect-square flex flex-col justify-between z-10 mr-8 sm:mr-20">
                                    <div>
                                       <div className="flex items-center justify-center gap-2 mb-3 mt-1">
                                          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-[#FF4E8D] to-[#7C3AED] text-white flex items-center justify-center font-black text-xs shadow-md">R</div>
                                          <span className="font-black text-lg tracking-wide text-[#1E1548]">REVIA</span>
                                       </div>
                                       <div className="flex justify-between text-[7px] font-black tracking-widest text-[#5844A8] mb-4 px-1">
                                          <span>REVIEWS</span>
                                          <span>SOCIALS</span>
                                          <span>WI-FI</span>
                                          <span>REWARDS</span>
                                       </div>
                                    </div>
                                    <div className="bg-white p-2 rounded-2xl shadow-sm mx-auto w-3/4 max-w-[180px]">
                                       <RealQRCodeSVG className="w-full h-auto" />
                                    </div>
                                    <div>
                                       <p className="text-center text-[9px] font-bold text-gray-400 mt-3 mb-2 tracking-widest">SP001</p>
                                       <div className="text-center">
                                          <span className="font-black text-sm text-[#5844A8]">revia</span>
                                       </div>
                                    </div>
                                 </div>

                                 {/* Phone Overlapping */}
                                 <div className="absolute -bottom-16 sm:-bottom-24 -right-12 sm:-right-24 lg:-right-32 z-30">
                                    <MobileFrame className="transform lg:rotate-3 transition-transform duration-700 hover:rotate-0 relative z-10 scale-75 sm:scale-90 md:scale-90 lg:scale-100 origin-bottom-right shadow-[0_30px_60px_-15px_rgba(45,26,71,0.5)]">
                                       {/* Camera Scanner View */}
                                       <div
                                          className="h-full w-full relative flex flex-col items-center justify-center min-h-[480px] bg-cover bg-center"
                                          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=600")' }}
                                       >
                                          {/* Background Overlay */}
                                          <div className="absolute inset-0 bg-[#1E1548]/75 z-0 backdrop-blur-[2px]" />

                                          {/* Camera Frame View of Standee */}
                                          <div className="bg-white rounded-2xl w-[150px] p-4 relative mb-12 shadow-2xl z-10 border border-purple-100">
                                             <div className="flex items-center justify-center gap-2 mb-3">
                                                <div className="w-4 h-4 rounded bg-[#7C3AED] text-white flex items-center justify-center font-black text-[8px]">R</div>
                                                <span className="font-black text-xs text-[#1E1548]">REVIA</span>
                                             </div>
                                             <div className="flex justify-between text-[5px] font-black tracking-widest text-[#5844A8] mb-3 px-1">
                                                <span>REVIEWS</span>
                                                <span>SOCIALS</span>
                                                <span>WI-FI</span>
                                                <span>REWARDS</span>
                                             </div>
                                             <div className="border-2 border-[#7C3AED] rounded-lg p-1.5 relative">
                                                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[#7C3AED]" />
                                                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[#7C3AED]" />
                                                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[#7C3AED]" />
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[#7C3AED]" />
                                                <RealQRCodeSVG className="w-full h-auto" />
                                             </div>
                                             <div className="text-center mt-3">
                                                <span className="font-black text-[10px] text-[#5844A8]">revia</span>
                                             </div>
                                          </div>

                                          {/* Action Popup */}
                                          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-[85%] bg-white rounded-full p-1.5 flex items-center justify-between shadow-lg z-10 border border-purple-50">
                                             <div className="flex items-center gap-2 pl-1">
                                                <div className="w-6 h-6 rounded-full bg-[#7C3AED] flex items-center justify-center">
                                                   <span className="text-white text-[10px] font-black">R</span>
                                                </div>
                                                <span className="text-[10px] font-bold text-[#1E1548]">go.revia.com</span>
                                             </div>
                                             <span className="text-[10px] font-bold text-[#5844A8] pr-3">Open</span>
                                          </div>

                                          {/* Camera Shutter button */}
                                          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-white/50 flex items-center justify-center z-10 backdrop-blur-sm bg-black/20">
                                             <div className="w-10 h-10 rounded-full bg-white" />
                                          </div>
                                       </div>
                                    </MobileFrame>
                                 </div>
                              </div>
                           </motion.div>
                        )}

                        {activeSlide === 1 && (
                           <motion.div
                              key="slide1"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.5 }}
                              className="relative w-full h-full flex items-center justify-center max-sm:scale-80 max-sm:origin-center"
                           >
                              {/* Floating stat card 1 */}
                              <motion.div
                                 initial={{ opacity: 0, x: -50, y: -20 }}
                                 animate={{ opacity: 1, x: 0, y: [0, 15, 0] }}
                                 transition={{ duration: 0.8, y: { duration: 5, repeat: Infinity, ease: "easeInOut" } }}
                                 className="absolute top-[20%] -left-12 lg:-left-20 z-20 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-purple-100 hidden sm:flex items-center gap-4 hover:scale-105 transition-transform cursor-default"
                              >
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <TrendingUp className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">Repeat Visit Rate</p>
                                    <div className="flex items-end gap-2">
                                       <p className="text-2xl font-black text-[#1E1548]">68%</p>
                                       <p className="text-xs font-black text-emerald-600 mb-1 flex items-center bg-emerald-50 px-1.5 py-0.5 rounded-full">↑12%</p>
                                    </div>
                                 </div>
                              </motion.div>

                              {/* Floating stat card 2 */}
                              <motion.div
                                 initial={{ opacity: 0, x: 50, y: 20 }}
                                 animate={{ opacity: 1, x: 0, y: [0, -15, 0] }}
                                 transition={{ duration: 0.8, delay: 0.2, y: { duration: 6, repeat: Infinity, ease: "easeInOut" } }}
                                 className="absolute bottom-[20%] -right-8 lg:-right-16 z-30 bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border border-purple-100 hidden sm:flex items-center gap-3 hover:scale-105 transition-transform cursor-default"
                              >
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4E8D] to-[#E11D48] flex items-center justify-center shadow-lg shadow-pink-500/30">
                                    <Users className="w-5 h-5 text-white" />
                                 </div>
                                 <div>
                                    <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest mb-0.5">New Members</p>
                                    <p className="text-xl font-black text-[#1E1548]">+124</p>
                                 </div>
                              </motion.div>

                              <MobileFrame className="transform lg:rotate-3 transition-transform duration-700 hover:rotate-0 relative z-10 sm:scale-90 md:scale-90 lg:scale-100">
                                 <div className="flex flex-col h-full bg-[#FAF8FF] p-5">
                                    <div className="bg-gradient-to-br from-[#2D1A47] via-[#3D1E6D] to-[#1E1130] rounded-3xl p-6 mb-5 text-white shadow-xl relative overflow-hidden">
                                       <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                                       <div className="flex justify-between items-start mb-6 relative z-10">
                                          <div>
                                             <p className="text-[9px] font-black uppercase tracking-widest text-purple-200 mb-1">REVIA LOYALTY</p>
                                             <p className="text-xl font-black">Sly Granny Cafe</p>
                                          </div>
                                          <div className="text-right">
                                             <p className="text-[9px] text-purple-200 font-bold mb-1">PROGRESS</p>
                                             <p className="text-2xl font-black text-[#FF4E8D]">6/10</p>
                                          </div>
                                       </div>

                                       <div className="grid grid-cols-5 gap-2.5 mb-5 relative z-10">
                                          {Array.from({ length: 10 }).map((_, i) => (
                                             <div key={i} className={`aspect-square rounded-full flex items-center justify-center text-sm font-black shadow-inner ${i < 6 ? 'bg-gradient-to-br from-[#FF4E8D] to-[#7C3AED] text-white shadow-sm' : 'bg-white/10 text-white/20'}`}>
                                                {i < 6 && <Star className="w-4 h-4 fill-current" />}
                                             </div>
                                          ))}
                                       </div>
                                       <p className="text-[11px] text-center text-purple-200 font-bold relative z-10">4 more stamps unlocks a free item ☕</p>
                                    </div>

                                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-50">
                                       <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Recent Activity</p>
                                       <div className="space-y-4">
                                          <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                                             <div>
                                                <p className="text-sm font-bold text-[#1E1548]">Visit Recorded</p>
                                                <p className="text-[10px] text-gray-400">Today, 9:42 AM</p>
                                             </div>
                                             <div className="bg-purple-100/70 px-3 py-1 rounded-full border border-purple-200/50">
                                                <p className="text-sm font-black text-[#5844A8]">+1</p>
                                             </div>
                                          </div>
                                          <div className="flex justify-between items-center opacity-60">
                                             <div>
                                                <p className="text-sm font-bold text-[#1E1548]">Visit Recorded</p>
                                                <p className="text-[10px] text-gray-400">Mon, 2:15 PM</p>
                                             </div>
                                             <div className="bg-gray-100 px-3 py-1 rounded-full">
                                                <p className="text-sm font-black text-gray-500">+1</p>
                                             </div>
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </MobileFrame>
                           </motion.div>
                        )}

                     </AnimatePresence>

                     {/* Slider Controls */}
                     {/* <div className="absolute bottom-0 sm:-bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
                        {[0, 1].map(i => (
                           <button
                              key={i}
                              onClick={() => setActiveSlide(i)}
                              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${activeSlide === i ? 'w-8 bg-gradient-to-r from-[#FF4E8D] to-[#7C3AED]' : 'w-4 bg-purple-200'}`}
                           />
                        ))}
                     </div> */}
                  </div>
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 3. TRUST BAR                            */}
         {/* ═══════════════════════════════════════ */}
         <section className="py-6 border-y border-purple-100/60 bg-white/60 backdrop-blur-sm relative z-10">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <p className="text-center text-[11px] font-black uppercase tracking-widest text-[#5844A8] mb-8">
                  Built for cafés, salons, gyms, and retail businesses
               </p>
               <div className="flex justify-center flex-wrap gap-8 sm:gap-12 lg:gap-28 text-purple-900/40">
                  <motion.div whileHover={{ scale: 1.1, color: '#5844A8' }} className="transition-colors cursor-pointer"><Coffee className="w-8 h-8" /></motion.div>
                  <motion.div whileHover={{ scale: 1.1, color: '#5844A8' }} className="transition-colors cursor-pointer"><Scissors className="w-8 h-8" /></motion.div>
                  <motion.div whileHover={{ scale: 1.1, color: '#5844A8' }} className="transition-colors cursor-pointer"><Dumbbell className="w-8 h-8" /></motion.div>
                  <motion.div whileHover={{ scale: 1.1, color: '#5844A8' }} className="transition-colors cursor-pointer"><ShoppingBag className="w-8 h-8" /></motion.div>
                  <motion.div whileHover={{ scale: 1.1, color: '#5844A8' }} className="transition-colors cursor-pointer"><Store className="w-8 h-8" /></motion.div>
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 4. PROBLEM → SOLUTION SECTION         */}
         {/* ═══════════════════════════════════════ */}
         <section className="pt-16 pb-16 relative z-10 bg-gradient-to-b from-[#1E1548] via-[#24133B] to-[#140D26] overflow-hidden" id="problem">
            {/* Ambient Background Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.2)_0%,transparent_70%)]" />
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-300/20 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="text-center max-w-4xl mx-auto mb-16"
               >
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-widest mb-4">
                     The Problem
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white tracking-tight mb-6 sm:mb-8 mt-2">Most customers visit once.<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E8D] via-[#F43F5E] to-[#A78BFA]">They don't come back.</span></h2>
                  <p className="text-base sm:text-xl text-purple-100/70 leading-relaxed font-medium">Losing a first-time customer is losing future revenue. Revia turns anonymous walk-ins into trackable, loyal regulars.</p>
               </motion.div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
                  {[
                     { icon: Smartphone, title: "No app needed", desc: "Customers join in seconds via QR, no download required. Frictionless onboarding." },
                     { icon: Megaphone, title: "Built-in campaigns", desc: "Reward the right customer at the right time with automated SMS and push offers." },
                     { icon: MapPin, title: "One dashboard", desc: "Manage loyalty, staff, and analytics across all your locations seamlessly." }
                  ].map((val, i) => (
                     <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ delay: i * 0.15 }}
                     >
                        <div className="bg-white/5 backdrop-blur-xl border border-purple-300/20 shadow-2xl rounded-3xl p-6 sm:p-10 h-full group hover:-translate-y-2 transition-all duration-300 hover:bg-white/10 hover:border-purple-300/40 text-center relative overflow-hidden">
                           {/* Card subtle glow on hover */}
                           <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#2D1A47] to-[#1E1548] border border-purple-400/30 rounded-2xl flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-[0_0_30px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_40px_rgba(255,78,141,0.3)] transition-shadow relative z-10">
                              <val.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF4E8D]" />
                           </div>
                           <h3 className="text-xl sm:text-2xl font-black mb-3 sm:mb-4 text-white relative z-10">{val.title}</h3>
                           <p className="text-purple-100/70 leading-relaxed relative z-10">{val.desc}</p>
                        </div>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 5. HOW IT WORKS                       */}
         {/* ═══════════════════════════════════════ */}
         <section className="py-12 sm:py-22 bg-white relative z-10" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <SectionLabel>How Revia Works</SectionLabel>
               <div className="text-center mb-12 sm:mb-24">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E1548]">A simple flow for you and your customers</h2>
               </div>

               <div className="relative">
                  <div className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[3px] bg-purple-50 rounded-full" />
                  <motion.div
                     initial={{ scaleX: 0 }}
                     whileInView={{ scaleX: 1 }}
                     viewport={{ once: true }}
                     transition={{ duration: 1, ease: "easeOut" }}
                     className="hidden lg:block absolute top-[60px] left-[10%] right-[10%] h-[3px] bg-gradient-to-r from-[#7C3AED] via-[#5844A8] to-[#FF4E8D] rounded-full origin-left"
                  />

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-16 lg:gap-6 relative">
                     {[
                        { step: 1, title: "Generate your QR", icon: QrCode, desc: "Print and place at your counter." },
                        { step: 2, title: "Customer scans", icon: Smartphone, desc: "Frictionless mobile sign-up." },
                        { step: 3, title: "Earn stamps", icon: Star, desc: "Tracked seamlessly at POS." },
                        { step: 4, title: "Bring them back", icon: Gift, desc: "Targeted offers drive returns." }
                     ].map((item, idx) => (
                        <motion.div
                           key={idx}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: idx * 0.2 }}
                           className="relative flex flex-col items-center text-center group"
                        >
                           <div className="w-[80px] h-[80px] sm:w-[120px] sm:h-[120px] bg-gradient-to-br from-[#7C3AED] to-[#5844A8] rounded-full shadow-xl shadow-purple-500/25 flex items-center justify-center mb-4 sm:mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500 border-4 border-white">
                              <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-[#2D1A47] text-white rounded-full flex items-center justify-center text-xs sm:text-sm font-black shadow-lg transform translate-x-1 sm:translate-x-2 -translate-y-1 sm:-translate-y-2 border-2 border-white">
                                 {item.step}
                              </div>
                              <item.icon className="w-8 h-8 sm:w-12 sm:h-12 text-white drop-shadow-md" />
                           </div>
                           <h3 className="text-sm sm:text-xl font-black mb-1 sm:mb-3 text-[#1E1548]">{item.title}</h3>
                           <p className="text-xs sm:text-base text-gray-500 max-w-[200px]">{item.desc}</p>
                        </motion.div>
                     ))}
                  </div>
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 6. FEATURE GRID                       */}
         {/* ═══════════════════════════════════════ */}
         <section className="py-16 relative z-10 bg-[#FAF8FF]" id="features">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
               <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-20">
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E1548]">Everything you need to build repeat business</h2>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
                  {[
                     { title: "Loyalty Program Builder", desc: "Stamp-based rewards, fully configurable to match your brand.", icon: Star },
                     { title: "Campaign Builder", desc: "Targeted offers, BOGO, tier-based discounts, linked conditions.", icon: Megaphone },
                     { title: "Multi-Branch Management", desc: "One dashboard, unlimited locations, granular permissions.", icon: MapPin },
                     { title: "Analytics & Reports", desc: "Retention curves, repeat-visit rate, campaign ROI tracking.", icon: BarChart3 },
                     { title: "Staff & Counter Tools", desc: "Fast transaction capture and reward redemption at the POS.", icon: Users },
                     { title: "QR & Wallet Passes", desc: "Apple/Google Wallet-ready digital loyalty cards for easy access.", icon: CreditCard }
                  ].map((feat, idx) => (
                     <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white rounded-[24px] sm:rounded-[32px] p-6 sm:p-8 shadow-sm border border-purple-100/70 hover:border-[#5844A8]/40 hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 group cursor-pointer"
                     >
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-purple-50 flex items-center justify-center mb-4 sm:mb-8 group-hover:bg-gradient-to-br group-hover:from-[#7C3AED] group-hover:to-[#5844A8] transition-colors duration-300 shadow-2xs">
                           <feat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#5844A8] group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-lg sm:text-2xl font-black mb-2 sm:mb-3 text-[#1E1548]">{feat.title}</h3>
                        <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-8 leading-relaxed font-medium">{feat.desc}</p>
                     </motion.div>
                  ))}
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* SMART QR EXPERIENCE & TOUCHPOINTS      */}
         {/* ═══════════════════════════════════════ */}
         <section className="py-20 bg-gradient-to-b from-[#140D26] via-[#1E1548] to-[#140D26] relative z-10 overflow-hidden text-white" id="qr-experience">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#7C3AED]/15 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <div className="flex justify-center mb-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-200 text-xs font-bold uppercase tracking-widest">
                     Smart QR Touchpoints
                  </div>
               </div>

               <div className="text-center max-w-3xl mx-auto mb-16">
                  <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-6">
                     One QR Code. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF4E8D] via-[#F43F5E] to-[#A78BFA]">Endless Engagements.</span>
                  </h2>
                  <p className="text-base sm:text-lg text-purple-100/70 font-medium leading-relaxed">
                     Place acrylic desk stands, coasters, or counter cards in your store. Customers scan with their native phone camera to instantly unlock rewards, active campaigns, reviews, and Wi-Fi — zero app download required.
                  </p>
               </div>

               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
                     {[
                        {
                           title: "Counter & Table Stand",
                           subtitle: "Acrylic Desk Display",
                           desc: "High-quality counter cards placed at checkout or dining tables for 1-second camera scanning.",
                           icon: QrCode,
                           badge: "Fast Scan"
                        },
                        {
                           title: "Instant Web Hub",
                           subtitle: "Zero App Download",
                           desc: "Opens your branded loyalty pass with digital stamps, active vouchers, and points instantly.",
                           icon: Smartphone,
                           badge: "Instant Access"
                        },
                        {
                           title: "1-Tap Google Reviews",
                           subtitle: "Review Booster",
                           desc: "Prompts happy customers to leave 5-star reviews on Google right after redeeming rewards.",
                           icon: Star,
                           badge: "+40% Reviews"
                        },
                        {
                           title: "Real-Time POS Scan",
                           subtitle: "Cashier Verification",
                           desc: "Staff validates coupons and stamps at redemption terminal in under 3 seconds.",
                           icon: Zap,
                           badge: "Live Sync"
                        }
                     ].map((item, idx) => (
                        <motion.div
                           key={idx}
                           initial={{ opacity: 0, y: 20 }}
                           whileInView={{ opacity: 1, y: 0 }}
                           viewport={{ once: true }}
                           transition={{ delay: idx * 0.1 }}
                           whileHover={{ y: -4 }}
                           className="bg-white/5 backdrop-blur-xl border border-purple-300/20 p-6 rounded-3xl hover:border-purple-300/40 hover:bg-white/10 transition-all duration-300 group"
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] flex items-center justify-center text-white shadow-lg shadow-purple-500/25 group-hover:scale-110 transition-transform">
                                 <item.icon className="w-6 h-6" />
                              </div>
                              <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-purple-500/20 text-purple-200 border border-purple-400/30 rounded-full">
                                 {item.badge}
                              </span>
                           </div>
                           <p className="text-[11px] font-bold text-[#FF4E8D] uppercase tracking-wider mb-1">{item.subtitle}</p>
                           <h3 className="text-lg font-black text-white mb-2">{item.title}</h3>
                           <p className="text-xs text-purple-100/60 leading-relaxed">{item.desc}</p>
                        </motion.div>
                     ))}
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                     <div className="relative w-full max-w-sm bg-gradient-to-b from-[#2D1A47] to-[#140D26] border border-purple-400/30 rounded-[36px] p-6 shadow-2xl shadow-black/80 text-center">
                        <div className="flex items-center justify-between mb-6 pb-4 border-b border-purple-100/10">
                           <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-gradient-to-r from-[#FF4E8D] to-[#7C3AED] text-white font-black text-sm flex items-center justify-center">
                                 R
                              </div>
                              <span className="text-xs font-black text-white tracking-wider">REVIA PASS</span>
                           </div>
                           <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live QR
                           </span>
                        </div>

                        <div className="relative mx-auto w-44 h-44 bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center justify-center border-2 border-purple-300/40 group overflow-hidden">
                           <motion.div
                              animate={{ y: [-70, 70, -70] }}
                              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                              className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF4E8D] to-transparent shadow-[0_0_15px_#FF4E8D] z-10 pointer-events-none"
                           />
                           <RealQRCodeSVG className="w-36 h-36" />
                        </div>

                        <p className="mt-4 text-xs font-bold text-white/90">Scan with phone camera</p>
                        <p className="text-[11px] text-purple-200/50 mt-0.5">Works on iOS &amp; Android</p>

                        <div className="mt-6 grid grid-cols-3 gap-2 text-center">
                           <div className="bg-white/5 border border-purple-100/10 rounded-xl p-2.5">
                              <Star className="w-4 h-4 text-[#FF4E8D] mx-auto mb-1" />
                              <p className="text-[10px] font-bold text-white">Stamps</p>
                           </div>
                           <div className="bg-white/5 border border-purple-100/10 rounded-xl p-2.5">
                              <Gift className="w-4 h-4 text-purple-300 mx-auto mb-1" />
                              <p className="text-[10px] font-bold text-white">Offers</p>
                           </div>
                           <div className="bg-white/5 border border-purple-100/10 rounded-xl p-2.5">
                              <Star className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                              <p className="text-[10px] font-bold text-white">Reviews</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 9. TESTIMONIAL / RESULTS              */}
         {/* ═══════════════════════════════════════ */}
         <section className="py-16 bg-gradient-to-b from-white to-[#FAF8FF] relative z-10 overflow-hidden">
            {/* Ambient Background Blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#7C3AED]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
               <div className="text-center mb-12">
                  <SectionLabel>Wall of Love</SectionLabel>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#1E1548] mt-6">Results that speak for themselves</h2>
               </div>

               <StaggerTestimonials />
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 10. FAQ SECTION                       */}
         {/* ═══════════════════════════════════════ */}
         <FAQSection
            faqsLeft={faqs.slice(0, 3).map(f => ({ question: f.q, answer: f.a }))}
            faqsRight={faqs.slice(3).map(f => ({ question: f.q, answer: f.a }))}
            buttonLabel="Get Started for Free"
            onButtonClick={() => onNavigate?.('/onboarding')}
         />

         {/* ═══════════════════════════════════════ */}
         {/* 11. FINAL CTA BANNER                  */}
         {/* ═══════════════════════════════════════ */}
         <section className="relative overflow-hidden z-10 max-w-6xl mx-4 sm:mx-auto my-8 sm:my-12 lg:my-20 rounded-[28px] sm:rounded-[36px] bg-gradient-to-r from-[#2D1A47] via-[#3B1F63] to-[#1E1548] border border-purple-300/30 shadow-2xl flex flex-col md:flex-row">
            {/* Ambient Lighting & Glows for the right side */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#FF4E8D]/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Left Image Area */}
            <div
               className="w-full md:w-5/12 min-h-[200px] sm:min-h-[350px] relative bg-cover bg-center"
               style={{ backgroundImage: "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=800&fit=crop&q=80')" }}
            >
               <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#2D1A47] md:hidden" />
               <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#2D1A47] to-transparent hidden md:block opacity-30" />
            </div>

            {/* Right Content Area */}
            <div className="w-full md:w-7/12 p-6 sm:p-10 md:p-16 flex flex-col justify-center text-left relative z-10">
               <span className="text-pink-300 font-bold text-sm tracking-widest uppercase mb-2">Try it risk-free</span>

               <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                  Ready to bring customers back?
               </h2>

               <p className="text-base sm:text-lg text-purple-100/70 mb-6 sm:mb-8 max-w-lg font-medium leading-relaxed">
                  Join hundreds of local businesses growing their revenue with Revia&apos;s frictionless loyalty platform.
               </p>

               <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <button onClick={() => onNavigate?.('/login')} className="bg-white text-[#2D1A47] hover:bg-purple-50 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl text-base sm:text-lg font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 cursor-pointer">
                     Become Merchant
                  </button>
               </div>
            </div>
         </section>

         {/* ═══════════════════════════════════════ */}
         {/* 12. FOOTER                            */}
         {/* ═══════════════════════════════════════ */}
         <MarketingFooter onNavigate={onNavigate} />
      </div>
   );
};
