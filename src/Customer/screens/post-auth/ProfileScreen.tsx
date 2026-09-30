import React, { useState } from 'react';
import { Star, User, Phone, MapPin, Shield, Lock, Bell, Eye, ChevronRight, LogOut, Edit2, X, Camera } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { LoyaltyCard } from '../../components/shared/LoyaltyCard';

export const ProfileScreen = ({ onPrivacy, onNavigateApp }: { onPrivacy: () => void; onNavigateApp?: (r: string) => void }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Rohit Sharma',
    mobile: '+91 XXXXX 43210',
    branch: 'Downtown Branch',
    image: ''
  });

  const [editForm, setEditForm] = useState(profile);

  const handleSave = () => {
    setProfile(editForm);
    setIsEditModalOpen(false);
  };

  return (
    <div className="space-y-6 relative">
      
      {/* Hero Header */}
      <div className="relative bg-[#161616] rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-xl overflow-hidden group">
        {/* Decorative background elements */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#C89B3C] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C89B3C] rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-700" />

        {/* Avatar */}
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#E2B75A] to-[#B58933] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(200,155,60,0.3)] z-10 relative border-2 border-[#FFE8B3]/20 overflow-hidden">
            {profile.image ? (
              <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-white font-black text-2xl tracking-wider">
                {profile.name.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase()}
              </span>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#161616] rounded-full flex items-center justify-center z-20">
            <button onClick={() => { setEditForm(profile); setIsEditModalOpen(true); }} className="w-6 h-6 bg-[#222] rounded-full flex items-center justify-center hover:bg-[#333] transition-colors border border-[#333]">
               <Edit2 className="w-3 h-3 text-[#C89B3C]" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 text-center sm:text-left z-10 flex flex-col sm:justify-center">
          <h2 className="text-2xl font-black text-white tracking-wide mb-1">{profile.name}</h2>
          <p className="text-sm text-[#999] mb-3">Member since Jan 2026</p>
          <div className="flex justify-center sm:justify-start">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-[#E2B75A] text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 shadow-sm">
              <Star className="w-2.5 h-2.5 fill-current" /> Active Member
            </span>
          </div>
        </div>

        <button onClick={() => { setEditForm(profile); setIsEditModalOpen(true); }} className="cursor-pointer hidden sm:flex z-10 text-xs font-black text-[#C89B3C] border border-[#C89B3C]/50 px-5 py-2 rounded-full hover:bg-[#C89B3C]/10 transition-all active:scale-95 items-center gap-2">
          <Edit2 className="w-3.5 h-3.5" /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F5F5F5]">
              <h3 className="text-[10px] font-black text-[#222] uppercase tracking-[0.1em]">Personal Information</h3>
            </div>
            <div className="divide-y divide-[#F5F5F5] p-2">
              <div className="flex items-center gap-4 px-4 py-3.5 group">
                <div className="w-10 h-10 bg-[#FFF8ED] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C89B3C]/10 transition-colors">
                  <User className="w-4 h-4 text-[#C89B3C]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#999] font-bold uppercase tracking-wider mb-0.5">Full Name</p>
                  <p className="text-sm font-black text-[#222]">{profile.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-3.5 group">
                <div className="w-10 h-10 bg-[#FFF8ED] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C89B3C]/10 transition-colors">
                  <Phone className="w-4 h-4 text-[#C89B3C]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#999] font-bold uppercase tracking-wider mb-0.5">Mobile</p>
                  <p className="text-sm font-black text-[#222]">{profile.mobile}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 px-4 py-3.5 group">
                <div className="w-10 h-10 bg-[#FFF8ED] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#C89B3C]/10 transition-colors">
                  <MapPin className="w-4 h-4 text-[#C89B3C]" />
                </div>
                <div>
                  <p className="text-[10px] text-[#999] font-bold uppercase tracking-wider mb-0.5">Preferred Branch</p>
                  <p className="text-sm font-black text-[#222]">{profile.branch}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F5F5F5]">
              <h3 className="text-[10px] font-black text-[#222] uppercase tracking-[0.1em]">Loyalty Membership</h3>
            </div>
            <div className="p-5">
              <LoyaltyCard stamps={8} total={10} name={profile.name} />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-[#E6E6E6] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F5F5F5]">
              <h3 className="text-[10px] font-black text-[#222] uppercase tracking-[0.1em]">Privacy & Consent</h3>
            </div>
            <div className="divide-y divide-[#F5F5F5] p-2">
              {[
                { Icon: Shield, label: 'Consent Status', val: 'Granted', badge: <span className="border border-emerald-200 bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">ACTIVE</span>, action: false },
                { Icon: Lock, label: 'Privacy Settings', val: 'Manage', badge: null, action: true },
                { Icon: Bell, label: 'Notifications', val: 'Enabled', badge: <span className="border border-emerald-200 bg-emerald-50 text-emerald-600 px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider">ON</span>, action: false },
                { Icon: Eye, label: 'Data Controls', val: 'View', badge: null, action: true },
              ].map((row, i) => (
                <button key={i} onClick={row.action ? onPrivacy : undefined} disabled={!row.action}
                  className={`cursor-pointer w-full flex items-center gap-4 px-4 py-4 text-left group ${row.action ? 'hover:bg-[#FAFAFA] active:bg-[#F0F0F0] transition-colors rounded-xl' : ''}`}>
                  <div className="w-10 h-10 bg-[#F8F8F6] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-white transition-colors border border-transparent group-hover:border-[#E6E6E6]">
                    <row.Icon className="w-4 h-4 text-[#999]" />
                  </div>
                  <p className="flex-1 text-sm font-bold text-[#222]">{row.label}</p>
                  {row.badge || <span className="text-xs font-black text-[#C89B3C]">{row.val}</span>}
                  {row.action && <ChevronRight className="w-4 h-4 text-[#ccc] group-hover:text-[#222] transition-colors ml-1" />}
                </button>
              ))}
            </div>
          </div>

          <button onClick={() => { localStorage.removeItem('token'); onNavigateApp?.('/'); }}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-rose-100 text-rose-500 text-xs font-black hover:bg-rose-50 hover:border-rose-200 transition-all shadow-sm bg-white active:scale-95 group">
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
          </button>
        </div>
      </div>

      {/* Edit Profile Modal Overlay */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsEditModalOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 border-b border-[#F5F5F5] flex justify-between items-center bg-gradient-to-r from-[#1a1a1a] to-[#2d2d2d]">
              <h3 className="text-lg font-black text-white tracking-wide">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="cursor-pointer w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {/* Image Upload */}
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-20 h-20 rounded-full bg-[#F8F8F6] border-2 border-[#E6E6E6] flex items-center justify-center overflow-hidden">
                  {editForm.image ? (
                    <img src={editForm.image} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-8 h-8 text-[#ccc]" />
                  )}
                  <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                    <Camera className="w-6 h-6 text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setEditForm(prev => ({ ...prev, image: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                <p className="text-[10px] font-bold text-[#999] uppercase tracking-wider">Profile Photo</p>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#999] uppercase tracking-wider ml-1">Full Name</label>
                <input 
                  type="text"
                  value={editForm.name}
                  onChange={e => setEditForm({...editForm, name: e.target.value})}
                  className="w-full px-4 py-3.5 bg-[#F8F8F6] rounded-xl border border-[#E6E6E6] text-sm font-bold text-[#222] focus:outline-none focus:border-[#C89B3C] focus:bg-white focus:ring-4 focus:ring-[#C89B3C]/10 transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#999] uppercase tracking-wider ml-1">Mobile Number</label>
                <input 
                  type="tel"
                  value={editForm.mobile}
                  onChange={e => setEditForm({...editForm, mobile: e.target.value})}
                  className="w-full px-4 py-3.5 bg-[#F8F8F6] rounded-xl border border-[#E6E6E6] text-sm font-bold text-[#222] focus:outline-none focus:border-[#C89B3C] focus:bg-white focus:ring-4 focus:ring-[#C89B3C]/10 transition-all"
                  placeholder="Enter your mobile number"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-[#999] uppercase tracking-wider ml-1">Preferred Branch</label>
                <select
                  value={editForm.branch}
                  onChange={e => setEditForm({...editForm, branch: e.target.value})}
                  className="w-full px-4 py-3.5 bg-[#F8F8F6] rounded-xl border border-[#E6E6E6] text-sm font-bold text-[#222] focus:outline-none focus:border-[#C89B3C] focus:bg-white focus:ring-4 focus:ring-[#C89B3C]/10 transition-all appearance-none"
                >
                  <option value="Downtown Branch">Downtown Branch</option>
                  <option value="Uptown Mall Branch">Uptown Mall Branch</option>
                  <option value="Airport Branch">Airport Branch</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2 bg-[#FAFAFA] border-t border-[#F5F5F5] flex gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="cursor-pointer flex-1 py-3.5 rounded-xl text-xs font-black text-[#666] bg-white border border-[#E6E6E6] hover:bg-[#F0F0F0] transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="cursor-pointer flex-1 py-3.5 rounded-xl text-xs font-black text-white bg-[#C89B3C] hover:bg-[#b58933] shadow-lg shadow-[#C89B3C]/30 transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
