import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, Clock, HelpCircle, MessageCircle, ChevronDown, ArrowLeft } from 'lucide-react';
import { MarketingNavbar } from '../components/layout/MarketingNavbar';
import { MarketingFooter } from '../components/layout/MarketingFooter';

interface Props {
   onNavigate?: (route: string) => void;
}

export const ContactPage: React.FC<Props> = ({ onNavigate }) => {
   return (
      <div className="min-h-screen bg-[#FAF8FF] text-[#1E1548] font-sans selection:bg-purple-100 selection:text-[#5844A8] relative overflow-hidden">
         <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px] pointer-events-none z-0" />
         <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#FF4E8D]/10 rounded-full blur-[120px] pointer-events-none z-0" />

         <MarketingNavbar onNavigate={onNavigate} />

         <main className="pt-28 sm:pt-32 pb-12 relative z-10">
            <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-12">
               <button 
                  onClick={() => { if (window.history.length > 2) { window.history.back(); } else { onNavigate?.('/'); } }} 
                  className="flex items-center gap-2 text-sm font-bold text-[#5844A8] hover:text-[#1E1548] mb-6 transition-colors group cursor-pointer"
               >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Go Back
               </button>

               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] shadow-sm border border-purple-100/70 flex flex-col lg:flex-row overflow-hidden relative">
                  {/* Decorative Brand Tape */}
                  <div className="absolute -top-3 -right-4 w-16 h-6 bg-gradient-to-r from-[#FF4E8D] to-[#7C3AED] rotate-12 rounded-sm opacity-90 shadow-sm z-10 hidden lg:block" />

                  {/* Left Side - Form */}
                  <div className="flex-1 p-8 md:p-12 lg:p-16">
                     <h2 className="text-3xl font-black text-[#1E1548] mb-8">Send us a message</h2>

                     <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="block text-sm font-bold text-gray-700 ml-1">Name</label>
                              <input type="text" className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium placeholder-gray-400 hover:border-purple-200" placeholder="John Doe" />
                           </div>
                           <div className="space-y-2">
                              <label className="block text-sm font-bold text-gray-700 ml-1">Email</label>
                              <input type="email" className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium placeholder-gray-400 hover:border-purple-200" placeholder="john@example.com" />
                           </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="block text-sm font-bold text-gray-700 ml-1">Mobile</label>
                              <input type="tel" className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium placeholder-gray-400 hover:border-purple-200" placeholder="555-123-4567" />
                           </div>
                           <div className="space-y-2">
                              <label className="block text-sm font-bold text-gray-700 ml-1">Purpose</label>
                              <div className="relative">
                                 <select className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium text-gray-600 appearance-none hover:border-purple-200 cursor-pointer">
                                    <option value="" disabled selected>Select a purpose</option>
                                    <option value="sales">Sales Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="billing">Billing Question</option>
                                    <option value="other">Other</option>
                                 </select>
                                 <ChevronDown className="w-5 h-5 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                              </div>
                           </div>
                        </div>

                        <div className="space-y-2">
                           <label className="block text-sm font-bold text-gray-700 ml-1">Subject</label>
                           <input type="text" className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium placeholder-gray-400 hover:border-purple-200" placeholder="Enter subject.." />
                        </div>

                        <div className="space-y-2">
                           <label className="block text-sm font-bold text-gray-700 ml-1">Message</label>
                           <textarea rows={5} className="w-full px-5 py-3 rounded-2xl bg-[#FAF8FF] border border-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-200 focus:border-[#5844A8] transition-all font-medium placeholder-gray-400 resize-none hover:border-purple-200" placeholder="Tell us more..."></textarea>
                        </div>

                        <div className="pt-2">
                           <button type="button" className="px-8 py-4 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white rounded-2xl font-black shadow-lg cursor-pointer shadow-purple-900/20 hover:shadow-xl hover:shadow-purple-900/30 hover:-translate-y-0.5 transition-all duration-300">
                              Send message
                           </button>
                        </div>
                     </form>
                  </div>

                  {/* Right Side - Contact Info */}
                  <div className="w-full lg:w-[450px] bg-[#FAF8FF] bg-[url('/contact-bg.jpg')] bg-cover bg-center bg-no-repeat p-8 md:p-12 lg:p-16 lg:border-l border-purple-100 flex flex-col justify-center relative">
                     <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95 backdrop-blur-[2px] pointer-events-none" />
                     <div className="absolute inset-0 bg-gradient-to-b from-[#7C3AED]/5 to-transparent pointer-events-none" />

                     <div className="relative z-10">
                        <h3 className="text-xl font-black text-[#1E1548] mb-8">Get in touch</h3>

                        <ul className="space-y-6 mb-12">
                           <li className="flex items-start gap-4 text-gray-600 font-medium group cursor-pointer hover:text-[#5844A8] transition-colors">
                              <Mail className="w-5 h-5 mt-0.5 text-[#5844A8] opacity-70 group-hover:opacity-100 transition-opacity" />
                              <span>hello@revia.com</span>
                           </li>
                           <li className="flex items-start gap-4 text-gray-600 font-medium group cursor-pointer hover:text-[#5844A8] transition-colors">
                              <Phone className="w-5 h-5 mt-0.5 text-[#5844A8] opacity-70 group-hover:opacity-100 transition-opacity" />
                              <span>+1 (555) 123-4567</span>
                           </li>
                           <li className="flex items-start gap-4 text-gray-600 font-medium group cursor-pointer hover:text-[#5844A8] transition-colors">
                              <MapPin className="w-5 h-5 mt-0.5 text-[#5844A8] opacity-70 group-hover:opacity-100 transition-opacity" />
                              <span>123 Innovation Drive<br />Tech City, TC 90210</span>
                           </li>
                           <li className="flex items-start gap-4 text-gray-600 font-medium group">
                              <Clock className="w-5 h-5 mt-0.5 text-[#5844A8] opacity-70" />
                              <span>Mon-Fri, 9 AM - 5 PM EST</span>
                           </li>
                        </ul>

                        <hr className="border-purple-100 mb-8" />

                        <h3 className="text-xl font-black text-[#1E1548] mb-6">Quick links</h3>
                        <ul className="space-y-4">
                           <li>
                              <a href="/#faq" onClick={(e) => { e.preventDefault(); onNavigate?.('/'); }} className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#5844A8] transition-colors group">
                                 <HelpCircle className="w-5 h-5 text-gray-400 group-hover:text-[#5844A8] transition-colors" />
                                 Check our FAQ for common questions
                              </a>
                           </li>
                           <li>
                              <a href="#" className="flex items-center gap-3 text-sm font-bold text-gray-600 hover:text-[#5844A8] transition-colors group">
                                 <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-[#5844A8] transition-colors" />
                                 Live chat available on the bottom right
                              </a>
                           </li>
                        </ul>
                     </div>
                  </div>

               </motion.div>
            </div>
         </main>

         {/* FOOTER */}
         <MarketingFooter onNavigate={onNavigate} />
      </div>
   );
};
