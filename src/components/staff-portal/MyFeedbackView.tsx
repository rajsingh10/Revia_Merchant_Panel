import React from 'react';
import { 
  ArrowLeft, 
  Star, 
  Filter, 
  ChevronDown 
} from 'lucide-react';

interface MyFeedbackViewProps {
  onBack: () => void;
}

export const MyFeedbackView: React.FC<MyFeedbackViewProps> = ({ onBack }) => {
  const reviews = [
    {
      initials: 'AG',
      avatarBg: 'bg-purple-100 text-[#5844A8]',
      name: 'Aarav Gupta',
      tableVisit: 'Table 07 • Today',
      rating: '5.0 / 5',
      stars: 5,
      review: 'Very polite and helpful with our order. The service was prompt.',
    },
    {
      initials: 'NV',
      avatarBg: 'bg-emerald-100 text-emerald-700',
      name: 'Neha Verma',
      tableVisit: 'Table 09 • Yesterday',
      rating: '5.0 / 5',
      stars: 5,
      review: 'Food was served carefully and the waiter checked everything we needed.',
    },
    {
      initials: 'KM',
      avatarBg: 'bg-purple-100 text-[#5844A8]',
      name: 'Karan Malhotra',
      tableVisit: 'Table 12 • 4 Nov',
      rating: '4.0 / 5',
      stars: 4,
      review: 'Friendly staff. We had to ask again for assistance, but it was resolved.',
    },
  ];

  return (
    <div className="px-3.5 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-gray-200 hover:border-purple-200 text-gray-600 cursor-pointer shadow-2xs transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-[#1E1548] tracking-tight">My Feedback</h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            See how customers rated your service at the restaurant.
          </p>
        </div>
      </div>

      {/* Rating Breakdown Card */}
      <div className="bg-rose-50/30 border border-rose-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xs">
        {/* Left score */}
        <div className="text-center sm:text-left sm:pr-8 sm:border-r border-rose-100 shrink-0">
          <span className="text-5xl font-black text-[#1E1548]">4.8</span>
          <div className="flex items-center justify-center sm:justify-start gap-1 text-amber-400 my-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p className="text-xs text-gray-500 font-medium">Average rating</p>
          <p className="text-xs font-bold text-[#1E1548]">50 reviews</p>
        </div>

        {/* Right distribution bars */}
        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-xs text-[#1E1548]">Rating Breakdown</h3>
          <p className="text-[11px] text-gray-400 font-medium -mt-1">Ratings linked to your completed customer visits</p>

          <div className="space-y-1.5 pt-2">
            {[
              { star: 5, count: 42, percent: 84 },
              { star: 4, count: 6, percent: 12 },
              { star: 3, count: 1, percent: 2 },
              { star: 2, count: 1, percent: 2 },
              { star: 1, count: 0, percent: 0 },
            ].map((row) => (
              <div key={row.star} className="flex items-center gap-2 text-xs">
                <span className="text-[11px] font-bold text-gray-600 w-5 flex items-center gap-0.5">
                  {row.star}★
                </span>
                <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-purple-900 rounded-full"
                    style={{ width: `${row.percent}%` }}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-400 w-16 text-right">
                  {row.count} • {row.percent}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Feedback Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-black text-sm text-[#1E1548]">Customer Feedback</h3>
          <button
            type="button"
            className="px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 flex items-center gap-1.5 shadow-2xs hover:border-purple-200 cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            <span>Filter</span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-0.5" />
          </button>
        </div>

        {/* Reviews List */}
        <div className="space-y-3.5">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-purple-100/70 rounded-3xl shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl ${rev.avatarBg} font-black text-xs flex items-center justify-center shrink-0`}>
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-[#1E1548]">{rev.name}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{rev.tableVisit}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < rev.stars ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-[11px] font-bold text-gray-600 ml-1">{rev.rating}</span>
                </div>
              </div>

              <p className="text-xs text-gray-700 italic">
                "{rev.review}"
              </p>

              <p className="text-[10px] text-gray-400 font-medium pt-1 border-t border-gray-50">
                Verified customer feedback • Staff service rating
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <p className="text-[11px] text-gray-400 font-medium text-center pt-2">
        Ratings are displayed only when connected to this staff member's service record. Loyaltics should follow merchant review-visibility permissions.
      </p>
    </div>
  );
};

