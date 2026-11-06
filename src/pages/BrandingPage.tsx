import React, { useState, useEffect } from 'react';
import {
   Palette,
   Sparkles,
   Upload,
   CheckCircle2,
   ShieldCheck,
   Smartphone,
   Eye,
   RefreshCw,
   QrCode,
   Image as ImageIcon,
   Hexagon,
   Store,
   Clock,
   RotateCcw,
   Edit2,
   Link as LinkIcon,
   Search,
   Bell,
   ChevronRight,
   ArrowRight,
   Plus,
   Gift,
   Lock,
   Wallet,
   Zap,
   Coffee,
   Star
} from 'lucide-react';
import { PrimaryButton, TierBadge } from '../components/common/Badges';

import { NavRoute } from '../types';

interface BrandingPageProps {
   onNavigate?: (route: NavRoute) => void;
}

export const BrandingPage: React.FC<BrandingPageProps> = ({ onNavigate }) => {
   const [primaryGold, setPrimaryGold] = useState('#5844A8');
   const [charcoal, setCharcoal] = useState('#1A1615');
   const [canvasIvory, setCanvasIvory] = useState('#FAF8FF');
   const [forestEmerald, setForestEmerald] = useState('#0D7A53');
   const [activeTheme, setActiveTheme] = useState('Artisanal Roastery (Default)');
   const [activePreviewTab, setActivePreviewTab] = useState('Pass Ledger');

   useEffect(() => {
      if (activeTheme === 'Artisanal Roastery (Default)') {
         setPrimaryGold('#5844A8');
         setCharcoal('#1A1615');
         setCanvasIvory('#FAF8FF');
         setForestEmerald('#0D7A53');
      } else if (activeTheme === 'Midnight Obsidian') {
         setPrimaryGold('#7C3AED');
         setCharcoal('#EAE6E1');
         setCanvasIvory('#1A1615');
         setForestEmerald('#16A36D');
      } else if (activeTheme === 'Botanical Reserve') {
         setPrimaryGold('#A37837');
         setCharcoal('#2C3B2E');
         setCanvasIvory('#F0F4EF');
         setForestEmerald('#0D7A53');
      }
   }, [activeTheme]);

   return (
      <div className="flex flex-col h-full bg-[#FAF8FF] text-[#1A1615] font-sans">

         <div className="p-4 lg:p-6 space-y-6 flex-1 max-w-[1600px] mx-auto w-full">
            {/* Page Title Section */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
               <div>
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615] mb-1 leading-none font-sans">Business Profile &amp; Branding</h1>
                  <p className="text-[14px] text-[#6E6A66] max-w-2xl">
                     Curate your maison's visual identity, token architecture, stamp marks, and real-time member portal experience across all physical tasting salons.
                  </p>
               </div>

               <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-[#EAE6E1] rounded-lg text-[13px] font-bold text-[#1A1615] hover:bg-[#F5F2EB] transition-colors whitespace-nowrap shrink-0 cursor-pointer w-full sm:w-auto">
                     <RotateCcw className="w-4 h-4" /> Discard Changes
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-b from-[#7C3AED] to-[#5844A8] border border-[#5844A8] rounded-lg text-[13px] font-bold text-white shadow-sm hover:opacity-95 transition-colors whitespace-nowrap shrink-0 cursor-pointer w-full sm:w-auto">
                     <Sparkles className="w-4 h-4" /> Publish Brand Tokens
                  </button>
               </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
               {/* Left Side: Configuration (7 cols) */}
               <div className="lg:col-span-7 space-y-8">

                  {/* Visual Assets & Brand Marks */}
                  <div className="bg-white border border-[#EAE6E1] rounded-2xl p-6 shadow-sm">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-center gap-2">
                           <Hexagon className="w-5 h-5 text-[#A37837] shrink-0" />
                           <h2 className="text-lg font-bold text-[#1A1615]">Visual Assets & Brand Marks</h2>
                        </div>
                        <div className="self-start sm:self-auto px-2.5 py-1 bg-[#F5F2EB] rounded text-[10px] font-bold text-[#8C827A] uppercase tracking-wider shrink-0">
                           SVG / HIGH-RES PNG
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-4">
                        {/* Primary Emblem */}
                        <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-xl p-4 flex flex-col group relative">
                           <div className="flex items-start justify-between mb-2">
                              <div className="text-[13px] font-bold text-[#1A1615]">Primary Emblem</div>
                              <CheckCircle2 className="w-4 h-4 text-[#A37837]" />
                           </div>
                           <div className="text-[10px] text-[#8C827A] mb-4">512x512px SVG or vector</div>

                           <div className="flex-1 flex flex-col items-center justify-center py-4 mb-4">
                              <div className="w-16 h-16 bg-white border border-[#EAE6E1] rounded-xl flex items-center justify-center shadow-xs">
                                 <Store className="w-8 h-8 text-[#A37837]" />
                              </div>
                           </div>

                           <button className="w-full py-2 bg-white border border-[#EAE6E1] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#F5F2EB] transition-colors flex items-center justify-center gap-1.5">
                              <Upload className="w-4 h-4" /> Replace Emblem
                           </button>
                        </div>

                        {/* Loyalty Stamp Crest */}
                        <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-xl p-4 flex flex-col group relative">
                           <div className="flex items-start justify-between mb-2">
                              <div className="text-[13px] font-bold text-[#1A1615]">Loyalty Stamp Crest</div>
                              <CheckCircle2 className="w-4 h-4 text-[#A37837]" />
                           </div>
                           <div className="text-[10px] text-[#8C827A] mb-4">Pass slots (128px)</div>

                           <div className="flex-1 flex flex-col items-center justify-center py-4 mb-4">
                              <div className="w-16 h-16 bg-white border border-[#EAE6E1] rounded-xl flex items-center justify-center shadow-xs">
                                 <Coffee className="w-8 h-8 text-[#A37837]" />
                              </div>
                           </div>

                           <button className="w-full py-2 bg-white border border-[#EAE6E1] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#F5F2EB] transition-colors flex items-center justify-center gap-1.5">
                              <Edit2 className="w-4 h-4" /> Edit Crest Glyph
                           </button>
                        </div>

                        {/* Favicon & PWA */}
                        <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-xl p-4 flex flex-col group relative">
                           <div className="flex items-start justify-between mb-2">
                              <div className="text-[13px] font-bold text-[#1A1615]">Favicon & PWA</div>
                              <CheckCircle2 className="w-4 h-4 text-[#A37837]" />
                           </div>
                           <div className="text-[10px] text-[#8C827A] mb-4">Browser tabs & Homescreen</div>

                           <div className="flex-1 flex flex-col items-center justify-center py-4 mb-4">
                              <div className="bg-white border border-[#EAE6E1] rounded-xl p-3 flex items-center gap-3 shadow-xs">
                                 <div className="w-6 h-6 bg-[#1A1615] rounded text-[#A37837] flex items-center justify-center font-sans font-bold text-[10px]">R</div>
                                 <div className="w-4 h-4 bg-[#A37837] rounded-sm text-white flex items-center justify-center font-sans font-bold text-[8px]">R</div>
                              </div>
                              <div className="text-[9px] text-[#8C827A] mt-3">16px • 32px • 180px</div>
                           </div>

                           <button className="w-full py-2 bg-white border border-[#EAE6E1] rounded-lg text-[11px] font-bold text-[#1A1615] hover:bg-[#F5F2EB] transition-colors flex items-center justify-center gap-1.5">
                              <RefreshCw className="w-4 h-4" /> Generate Sizes
                           </button>
                        </div>
                     </div>

                     {/* Pass Background Ambient Texture */}
                     <div className="border border-[#EAE6E1] rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:justify-between">
                        <div className="flex items-start sm:items-center gap-4">
                           <div className="w-20 h-12 rounded-lg bg-black overflow-hidden relative shrink-0">
                              <img src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80" alt="Texture" className="w-full h-full object-cover opacity-80" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                 <h3 className="text-[13px] font-bold text-[#1A1615]">Pass Background Ambient Texture</h3>
                                 <span className="bg-[#EBF7F0] text-[#0D7A53] px-2 py-0.5 rounded text-[10px] font-bold">Active</span>
                              </div>
                              <p className="text-[11px] text-[#8C827A] mt-0.5 leading-snug">Rich tactile grain applied to digital membership keys and salon displays.</p>
                           </div>
                        </div>
                        <button className="w-full sm:w-auto px-4 py-2 bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg text-[12px] font-bold text-[#1A1615] hover:bg-[#F5F2EB] transition-colors shrink-0">
                           Replace Scrim
                        </button>
                     </div>
                  </div>

                  {/* Public Roastery & Concierge Metadata */}
                  <div className="bg-white border border-[#EAE6E1] rounded-2xl p-6 shadow-sm ">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                        <div className="flex items-start gap-2">
                           <Store className="w-5 h-5 text-[#A37837] shrink-0 mt-0.5" />
                           <h2 className="text-lg font-bold text-[#1A1615] leading-tight">Public Roastery & Concierge Metadata</h2>
                        </div>
                        <div className="self-start sm:self-auto px-2.5 py-1 bg-[#FAF8FF] rounded text-[10px] font-bold text-[#8C827A] uppercase tracking-wider shrink-0">
                           CUSTOMER-FACING
                        </div>
                     </div>

                     <div className="space-y-5">
                        {/* Legal Name */}
                        <div>
                           <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Legal Business Entity Name</label>
                           <input type="text" defaultValue="Revia Roasters & Hospitality Co." className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 px-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                        </div>

                        {/* Tagline */}
                        <div>
                           <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Hero Salon Statement / Tagline</label>
                           <input type="text" defaultValue="Purveyors of Single-Origin Geisha & Bespoke Tasting Salon." className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 px-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           {/* Industry */}
                           <div>
                              <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Industry Category & MCC</label>
                              <input type="text" defaultValue="Specialty Coffee & Private Lounge (5499)" className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 px-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                           </div>

                           {/* Email */}
                           <div>
                              <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Concierge Support Email</label>
                              <input type="text" defaultValue="concierge@revia.com" className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 px-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                           </div>

                           {/* Instagram */}
                           <div>
                              <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Instagram / Social Handle</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A] text-[13px]">@</span>
                                 <input type="text" defaultValue="reviaroasters" className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 pl-7 pr-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                              </div>
                           </div>

                           {/* URL */}
                           <div>
                              <label className="block text-[12px] font-bold text-[#1A1615] mb-1.5">Primary Web URL</label>
                              <div className="relative">
                                 <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C827A] text-[13px]">https://</span>
                                 <input type="text" defaultValue="revia.com" className="w-full bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg py-2.5 pl-14 pr-3 text-[13px] text-[#1A1615] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/30" />
                              </div>
                           </div>
                        </div>

                        {/* Synced Nodes */}
                        <div className="pt-2">
                           <div className="flex items-center justify-between mb-3">
                              <h3 className="text-[13px] font-bold text-[#1A1615]">Synced Salon Nodes</h3>
                              <button onClick={() => onNavigate && onNavigate('/branches')} className="text-[11px] font-bold text-[#C59B46] hover:underline flex items-center gap-1 cursor-pointer">Manage Branches <ArrowRight className="w-3 h-3" /></button>
                           </div>
                           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                              <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg p-3 flex items-start justify-between">
                                 <div>
                                    <div className="text-[12px] font-bold text-[#1A1615]">Downtown Flagship</div>
                                    <div className="text-[10px] text-[#8C827A]">SoHo Roastery</div>
                                 </div>
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53] mt-1.5"></span>
                              </div>
                              <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg p-3 flex items-start justify-between">
                                 <div>
                                    <div className="text-[12px] font-bold text-[#1A1615]">Tribeca Salon</div>
                                    <div className="text-[10px] text-[#8C827A]">Lounge & Bar</div>
                                 </div>
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53] mt-1.5"></span>
                              </div>
                              <div className="bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg p-3 flex items-start justify-between">
                                 <div>
                                    <div className="text-[12px] font-bold text-[#1A1615]">Brooklyn Works</div>
                                    <div className="text-[10px] text-[#8C827A]">Cupping Lab</div>
                                 </div>
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53] mt-1.5"></span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

               </div>

               {/* Right Side: Preview Panel (5 cols) */}
               <div className="lg:col-span-5 sticky top-24 space-y-6">
                  <div className="bg-white border border-[#EAE6E1] rounded-2xl p-6 shadow-sm">
                     <div className="flex items-center justify-between mb-6">
                        <div className="flex items-start gap-2">
                           <Smartphone className="w-5 h-5 text-[#A37837] shrink-0 mt-0.5" />
                           <h2 className="text-[15px] font-bold text-[#1A1615] leading-tight">Client Viewport Live Preview</h2>
                        </div>
                        <div className="flex items-center gap-1 bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg p-1">
                           <button onClick={() => setActivePreviewTab('Pass Ledger')} className={`px-3 py-1 rounded text-[11px] transition-colors ${activePreviewTab === 'Pass Ledger' ? 'bg-white border border-[#EAE6E1] shadow-xs font-bold text-[#1A1615]' : 'font-medium text-[#8C827A] hover:text-[#1A1615] border border-transparent'}`}>Pass Ledger</button>
                           <button onClick={() => setActivePreviewTab('Welcome Hub')} className={`px-3 py-1 rounded text-[11px] transition-colors ${activePreviewTab === 'Welcome Hub' ? 'bg-white border border-[#EAE6E1] shadow-xs font-bold text-[#1A1615]' : 'font-medium text-[#8C827A] hover:text-[#1A1615] border border-transparent'}`}>Welcome Hub</button>
                        </div>
                     </div>

                     {/* Mobile Phone Mockup */}
                     <div className="flex justify-center">
                        <div className="w-[320px] bg-[#1A1615] rounded-[40px] p-2.5 shadow-2xl relative border-4 border-[#3D3732]">
                           {/* Notch */}
                           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#1A1615] rounded-b-3xl z-30"></div>

                           {/* Screen Content */}
                           <div className="bg-[#FAF8FF] w-full h-[650px] rounded-[32px] overflow-hidden relative border border-[#EAE6E1]">

                              {/* iOS Status Bar */}
                              <div className="h-12 w-full pt-4 px-6 flex justify-between items-center text-[#1A1615] text-[12px] font-semibold z-20 relative">
                                 <span>9:41</span>
                                 <div className="flex gap-1.5 items-center">
                                    <div className="w-4 h-3 flex items-end gap-0.5">
                                       <div className="w-1 bg-[#1A1615] h-1 rounded-sm"></div>
                                       <div className="w-1 bg-[#1A1615] h-1.5 rounded-sm"></div>
                                       <div className="w-1 bg-[#1A1615] h-2 rounded-sm"></div>
                                       <div className="w-1 bg-[#1A1615] h-3 rounded-sm"></div>
                                    </div>
                                    <div className="w-4 h-3 bg-[#1A1615] rounded-full"></div>
                                 </div>
                              </div>

                              {/* Main Wallet Pass Card */}
                              <div className="px-4 py-2 space-y-4">
                                 <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#EAE6E1]">
                                    <div className="flex justify-between items-start mb-6">
                                       <div className="flex items-center gap-2">
                                          <div className="w-8 h-8 bg-[#C59B46] rounded-full flex items-center justify-center text-white shadow-xs">
                                             <Store className="w-4 h-4" />
                                          </div>
                                          <div>
                                             <div className="text-[12px] font-bold text-[#1A1615]">REVIA MEMBER PASS</div>
                                             <div className="text-[9px] text-[#8C827A]">#REV-8924</div>
                                          </div>
                                       </div>
                                       <div className="bg-[#EBF7F0] text-[#0D7A53] px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border border-[#BCE3D1]">
                                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D7A53]"></span> NFC Ready
                                       </div>
                                    </div>

                                    <div className="flex justify-between items-end mb-4">
                                       <div className="text-[10px] font-bold text-[#8C827A] uppercase tracking-wider">LOYALTY STAMP LEDGER</div>
                                       <div className="text-[10px] font-bold text-[#0D7A53]">● 8 of 10 Collected</div>
                                    </div>

                                    {/* Stamps Grid */}
                                    <div className="grid grid-cols-5 gap-2 mb-6">
                                       {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                          <div key={i} className="aspect-square bg-[#FAF5FF] rounded-full border border-[#E9D5FF] flex flex-col items-center justify-center relative">
                                             <Star className="w-3 h-3 text-[#C59B46] mb-0.5 fill-[#C59B46]" />
                                             <div className="text-[8px] text-[#C59B46] font-bold">#{i}</div>
                                          </div>
                                       ))}
                                       <div className="aspect-square bg-[#FAF8FF] rounded-full border border-[#EAE6E1] border-dashed flex flex-col items-center justify-center">
                                          <Plus className="w-3 h-3 text-[#A8A29A] mb-0.5" />
                                          <div className="text-[8px] text-[#A8A29A] font-bold">NEXT</div>
                                       </div>
                                       <div className="aspect-square bg-[#EBF7F0] rounded-full border border-[#BCE3D1] flex flex-col items-center justify-center">
                                          <Gift className="w-4 h-4 text-[#0D7A53] mb-0.5" />
                                          <div className="text-[8px] text-[#0D7A53] font-bold">FREE</div>
                                       </div>
                                    </div>

                                    <div className="flex justify-between items-center py-2 border-t border-[#EAE6E1]">
                                       <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#1A1615]">
                                          <Lock className="w-3.5 h-3.5 text-[#C59B46]" /> 2 more stamps to unlock Flight
                                       </div>
                                       <div className="text-[10px] font-bold text-[#8C827A]">Tier 10</div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 mt-4">
                                       <button className="flex-1 bg-gradient-to-b from-[#C59B46] to-[#A37837] text-white py-2.5 rounded-xl text-[12px] font-bold flex flex-col items-center justify-center shadow-xs">
                                          <QrCode className="w-4 h-4 mb-1" />
                                          Scan to Earn
                                       </button>
                                       <button className="flex-1 bg-white border border-[#EAE6E1] text-[#1A1615] py-2.5 rounded-xl text-[12px] font-bold flex flex-col items-center justify-center hover:bg-[#FAF8FF]">
                                          <Gift className="w-4 h-4 mb-1 text-[#6E6A66]" />
                                          Redeem
                                       </button>
                                       <button className="flex-1 bg-white border border-[#EAE6E1] text-[#1A1615] py-2.5 rounded-xl text-[12px] font-bold flex flex-col items-center justify-center hover:bg-[#FAF8FF]">
                                          <Store className="w-4 h-4 mb-1 text-[#6E6A66]" />
                                          Salon Perks
                                       </button>
                                    </div>

                                    <button className="w-full mt-4 py-2 flex items-center justify-center gap-2 text-[11px] font-bold text-[#1A1615] hover:underline">
                                       <Wallet className="w-4 h-4" /> Add Pass to Apple & Google Wallet <ChevronRight className="w-3 h-3" />
                                    </button>
                                 </div>

                                 {/* Flash Perk Active */}
                                 <div className="bg-[#EBF7F0] rounded-xl p-3 border border-[#BCE3D1] flex items-center justify-between">
                                    <div className="flex items-start gap-2">
                                       <Zap className="w-4 h-4 text-[#0D7A53] shrink-0 mt-0.5" />
                                       <div>
                                          <div className="text-[11px] font-bold text-[#1A1615]">FLASH PERK ACTIVE</div>
                                          <div className="text-[9px] text-[#0D7A53] mt-0.5">Double Stamps 2 PM - 5 PM Today</div>
                                       </div>
                                    </div>
                                    <div className="bg-[#0D7A53] text-white px-2 py-1 rounded text-[11px] font-bold">2X</div>
                                 </div>

                                 {/* Barista's Recommendation */}
                                 <div className="bg-white rounded-xl p-3 border border-[#EAE6E1]">
                                    <div className="flex items-center justify-between mb-3">
                                       <div className="text-[12px] font-bold text-[#1A1615]">Barista's Recommendation</div>
                                       <div className="text-[9px] font-bold text-[#C59B46]">Today's Roast</div>
                                    </div>
                                    <div className="flex gap-3">
                                       <img src="https://images.unsplash.com/photo-1559525839-b184a4d698c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80" alt="Coffee" className="w-14 h-14 rounded-lg object-cover" />
                                       <div className="flex-1">
                                          <div className="flex justify-between items-start">
                                             <div className="text-[12px] font-bold text-[#1A1615]">Panama Geisha Reserve</div>
                                             <div className="text-[9px] font-bold text-[#0D7A53] bg-[#EBF7F0] px-1.5 py-0.5 rounded border border-[#BCE3D1] whitespace-nowrap">+2 Stamps</div>
                                          </div>
                                          <div className="text-[9px] text-[#8C827A] mt-0.5 leading-tight mb-2">Notes of Jasmine, Bergamot & White Peach</div>
                                          <div className="flex items-center justify-between">
                                             <div className="text-[13px] font-bold text-[#1A1615]">₹8.50</div>
                                             <button className="px-3 py-1 bg-[#FAF8FF] border border-[#EAE6E1] rounded-full text-[10px] font-bold text-[#1A1615]">Order Ahead</button>
                                          </div>
                                       </div>
                                    </div>
                                 </div>

                              </div>

                              {/* iPhone Home Indicator */}
                              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#1A1615]/20 rounded-full"></div>
                           </div>
                        </div>
                     </div>

                     {/* <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-[#0D7A53] font-medium">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Tokens Validated for PassKit 3.0
                        </div>
                        <button className="font-bold text-[#C59B46] hover:underline">Test on Device</button>
                     </div> */}
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};
