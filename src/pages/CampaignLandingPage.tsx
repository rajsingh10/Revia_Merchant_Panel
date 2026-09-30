import React, { useEffect, useState } from 'react';
import apiClient from '../api/apiClient';
import { NavRoute } from '../types';

interface CampaignLandingPageProps {
  campaignId: string;
  onNavigate?: (route: NavRoute) => void;
}

export const CampaignLandingPage: React.FC<CampaignLandingPageProps> = ({ campaignId, onNavigate }) => {
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setLoading(true);
        // The API endpoint is /campaign-info/{id}
        const response = await apiClient.get(`/campaign-info/${campaignId}`);
        setCampaignData(response.data?.data || response.data);
      } catch (err: any) {
        console.error('Error fetching campaign info:', err);
        setError('Failed to load campaign information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (campaignId) {
      fetchCampaignData();
    }
  }, [campaignId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#A37837] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Campaign...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md w-full">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#A37837] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#8A652E] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-gray-500">Campaign not found.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#1A1615] to-[#3a312e] px-8 py-10 text-center text-white">
          {campaignData?.business && (
            <div className="text-sm uppercase tracking-widest text-[#D4A753] font-bold mb-3">
              {campaignData.business.name}
            </div>
          )}
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">
            {campaignData?.title || 'Exclusive Campaign'}
          </h1>
          <p className="text-[#FAF8F5] text-lg opacity-90">
            {campaignData?.description || 'Discover our special offers and rewards tailored just for you.'}
          </p>
        </div>

        {/* Content Section */}
        <div className="p-8">
          <div className="space-y-6">
            
            {campaignData?.type && (
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-500 font-medium">Campaign Type</span>
                <span className="bg-[#FAF6EE] text-[#A37837] px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                  {campaignData.type}
                </span>
              </div>
            )}
            
            {campaignData?.valid_until && (
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-gray-500 font-medium">Valid Until</span>
                <span className="text-gray-800 font-medium">
                  {new Date(campaignData.valid_until).toLocaleDateString()}
                </span>
              </div>
            )}

            {campaignData?.reward_value && (
              <div className="bg-[#FAF8F5] p-6 rounded-xl text-center mt-8">
                <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-2">
                  Reward {campaignData?.reward_type ? `(${campaignData.reward_type})` : ''}
                </h3>
                <div className="text-4xl font-black text-[#A37837]">
                  {campaignData.reward_value}
                </div>
              </div>
            )}

          </div>


        </div>
      </div>
      
      {/* Footer / Branding */}
      <div className="text-center mt-8 text-sm text-gray-400">
        Powered by <span className="font-bold text-gray-500">Revia</span>
      </div>
    </div>
  );
};
