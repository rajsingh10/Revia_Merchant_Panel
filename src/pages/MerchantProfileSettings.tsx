import React, { useState, useRef } from 'react';
import { Store, Mail, Phone, MapPin, Camera, Save, Info } from 'lucide-react';

export const MerchantProfileSettings: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileData, setProfileData] = useState({
    businessName: 'Revia Downtown Flagship',
    email: 'contact@revia.co',
    phone: '+1 (555) 123-4567',
    address: '123 Innovation Drive, Tech City, TC 90210',
    description: 'Premium coffee roastery and flagship store in the heart of downtown.',
    profileImage: null as string | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData(prev => ({ ...prev, profileImage: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = () => {
    // Logic to save the profile would go here
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="w-full font-sans bg-white p-3 sm:p-6 rounded-[16px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-[#1A1615] tracking-tight">Merchant Profile</h1>
          <p className="text-sm text-[#7C746C] mt-1">Manage your business identity and public information.</p>
        </div>
        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-[#FAF8FF] border border-[#EFECE6] text-[#1A1615] rounded-lg font-bold text-[13px] hover:bg-[#FAF5FF] transition-colors cursor-pointer"
            >
              Edit Profile
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-white border border-[#EFECE6] text-[#6E6A66] rounded-lg font-bold text-[13px] hover:bg-[#FAF5FF] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white rounded-lg font-bold text-[13px] shadow-lg shadow-[#5844A8]/20 hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar/Logo */}
        <div className="col-span-1">
          <div className="bg-[#FAF8FF] rounded-2xl border border-[#EFECE6] p-6 flex flex-col items-center text-center">
            <div className="relative w-32 h-32 mb-4">
              <div className="w-full h-full rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5844A8] flex items-center justify-center text-white text-4xl font-black shadow-inner shadow-[#5844A8]/50 overflow-hidden">
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  profileData.businessName.charAt(0)
                )}
              </div>
              {isEditing && (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-white rounded-full border-2 border-[#EFECE6] text-[#1A1615] flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors cursor-pointer z-10"
                >
                  <Camera className="w-5 h-5" />
                </button>
              )}
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
            </div>
            <h3 className="text-[16px] font-bold text-[#1A1615] mb-1">{profileData.businessName}</h3>
            <p className="text-[13px] text-[#6E6A66]">Verified Merchant</p>
          </div>
        </div>

        {/* Right Column: Fields */}
        <div className="col-span-1 lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[16px] border border-[#EFECE6] p-6 shadow-sm">
            <h3 className="text-[15px] font-bold text-[#1A1615] flex items-center gap-2 mb-6 pb-4 border-b border-[#EFECE6]">
              <Info className="w-4 h-4 text-[#5844A8]" />
              Business Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9E9A93]">Business Name</label>
                {isEditing ? (
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                    <input
                      type="text"
                      name="businessName"
                      value={profileData.businessName}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#EFECE6] focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-[#5844A8]/20 text-[14px] font-medium text-[#1A1615] transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF8FF] rounded-xl border border-transparent">
                    <Store className="w-4 h-4 text-[#9E9A93]" />
                    <span className="text-[14px] font-semibold text-[#1A1615]">{profileData.businessName}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9E9A93]">Email Address</label>
                {isEditing ? (
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#EFECE6] focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-[#5844A8]/20 text-[14px] font-medium text-[#1A1615] transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF8FF] rounded-xl border border-transparent">
                    <Mail className="w-4 h-4 text-[#9E9A93]" />
                    <span className="text-[14px] font-semibold text-[#1A1615]">{profileData.email}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9E9A93]">Phone Number</label>
                {isEditing ? (
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9E9A93]" />
                    <input
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#EFECE6] focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-[#5844A8]/20 text-[14px] font-medium text-[#1A1615] transition-all"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-3 px-4 py-3 bg-[#FAF8FF] rounded-xl border border-transparent">
                    <Phone className="w-4 h-4 text-[#9E9A93]" />
                    <span className="text-[14px] font-semibold text-[#1A1615]">{profileData.phone}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9E9A93]">Business Address</label>
                {isEditing ? (
                  <div className="relative">
                    <MapPin className="absolute left-4 top-[14px] w-4 h-4 text-[#9E9A93]" />
                    <textarea
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-[#EFECE6] focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-[#5844A8]/20 text-[14px] font-medium text-[#1A1615] transition-all resize-none"
                    />
                  </div>
                ) : (
                  <div className="flex items-start gap-3 px-4 py-3 bg-[#FAF8FF] rounded-xl border border-transparent">
                    <MapPin className="w-4 h-4 text-[#9E9A93] mt-0.5" />
                    <span className="text-[14px] font-semibold text-[#1A1615]">{profileData.address}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-[#9E9A93]">Description</label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={profileData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#EFECE6] focus:outline-none focus:border-[#5844A8] focus:ring-2 focus:ring-[#5844A8]/20 text-[14px] font-medium text-[#1A1615] transition-all resize-none"
                  />
                ) : (
                  <div className="px-4 py-3 bg-[#FAF8FF] rounded-xl border border-transparent min-h-[80px]">
                    <span className="text-[14px] font-semibold text-[#1A1615]">{profileData.description}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
