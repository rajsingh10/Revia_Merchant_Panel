import React, { useState } from 'react';
import {
  Calendar,
  Share2,
  Plus,
  TrendingUp,
  QrCode,
  UserPlus,
  Zap,
  ChevronRight,
  MoreVertical,
  Wifi,
  ArrowUpRight,
  CheckCircle2,
  Award,
  Clock,
  Sparkles,
  Store,
  ChevronDown
} from 'lucide-react';
import { Customer, CatalogItem, Branch, NavRoute } from '../types';

interface DashboardPageProps {
  onNavigate: (route: NavRoute) => void;
  customers?: Customer[];
  catalog?: CatalogItem[];
  branches?: Branch[];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const [timeframe, setTimeframe] = useState<'Daily' | 'Weekly' | 'Monthly'>('Daily');
  const [activeDateRange, setActiveDateRange] = useState('Last 30 Days (Oct 1 - Oct 31, 2024)');
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [exportToast, setExportToast] = useState(false);
  const [expandedBranch, setExpandedBranch] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    stamps: number;
    redeemed: number;
    x: number;
    y1: number;
    y2: number;
  } | null>({
    date: 'Thu, Oct 24',
    stamps: 1084,
    redeemed: 186,
    x: 440,
    y1: 65,
    y2: 155,
  });

  // Dynamic Chart data and totals based on filters
  const { chartPoints, totalStamps, totalRedeemed, ratio } = React.useMemo(() => {
    let basePoints = [];
    let stamps = 0;
    let redeemed = 0;

    if (activeDateRange === 'Last 7 Days') {
      basePoints = [
        { date: 'Mon', stamps: 820, redeemed: 120, x: 20, y1: 140, y2: 180 },
        { date: 'Tue', stamps: 950, redeemed: 140, x: 120, y1: 120, y2: 175 },
        { date: 'Wed', stamps: 880, redeemed: 130, x: 220, y1: 130, y2: 178 },
        { date: 'Thu', stamps: 1100, redeemed: 180, x: 320, y1: 100, y2: 165 },
        { date: 'Fri', stamps: 1400, redeemed: 220, x: 420, y1: 70, y2: 140 },
        { date: 'Sat', stamps: 1600, redeemed: 280, x: 520, y1: 50, y2: 120 },
        { date: 'Sun', stamps: 1450, redeemed: 240, x: 620, y1: 60, y2: 130 },
      ];
      stamps = 8200;
      redeemed = 1310;
    } else if (activeDateRange === 'This Quarter (Q4 2024)') {
      basePoints = [
        { date: 'Oct', stamps: 28410, redeemed: 4180, x: 20, y1: 120, y2: 180 },
        { date: 'Nov', stamps: 32000, redeemed: 4800, x: 320, y1: 80, y2: 160 },
        { date: 'Dec', stamps: 45000, redeemed: 7500, x: 620, y1: 40, y2: 120 },
      ];
      stamps = 105410;
      redeemed = 16480;
    } else if (activeDateRange === 'Year to Date (2024)') {
      basePoints = [
        { date: 'Q1', stamps: 65000, redeemed: 8500, x: 20, y1: 150, y2: 190 },
        { date: 'Q2', stamps: 82000, redeemed: 11000, x: 220, y1: 120, y2: 170 },
        { date: 'Q3', stamps: 95000, redeemed: 13500, x: 420, y1: 90, y2: 150 },
        { date: 'Q4', stamps: 105410, redeemed: 16480, x: 620, y1: 50, y2: 110 },
      ];
      stamps = 347410;
      redeemed = 49480;
    } else {
      // Default: Last 30 Days
      basePoints = [
        { date: 'Oct 01', stamps: 740, redeemed: 110, x: 20, y1: 120, y2: 180 },
        { date: 'Oct 05', stamps: 820, redeemed: 125, x: 80, y1: 105, y2: 172 },
        { date: 'Oct 09', stamps: 790, redeemed: 118, x: 140, y1: 112, y2: 176 },
        { date: 'Oct 13', stamps: 910, redeemed: 140, x: 200, y1: 92, y2: 165 },
        { date: 'Oct 16', stamps: 860, redeemed: 132, x: 260, y1: 100, y2: 169 },
        { date: 'Oct 20', stamps: 980, redeemed: 165, x: 320, y1: 80, y2: 160 },
        { date: 'Oct 22', stamps: 1020, redeemed: 175, x: 380, y1: 72, y2: 158 },
        { date: 'Thu, Oct 24', stamps: 1084, redeemed: 186, x: 440, y1: 65, y2: 155 },
        { date: 'Oct 26', stamps: 990, redeemed: 170, x: 500, y1: 78, y2: 162 },
        { date: 'Oct 29', stamps: 1050, redeemed: 180, x: 560, y1: 68, y2: 157 },
        { date: 'Oct 31', stamps: 1120, redeemed: 195, x: 620, y1: 55, y2: 152 },
      ];
      stamps = 28410;
      redeemed = 4180;
    }

    if (timeframe === 'Weekly') {
      stamps = Math.round(stamps * 0.25);
      redeemed = Math.round(redeemed * 0.25);
    } else if (timeframe === 'Monthly') {
      stamps = Math.round(stamps * 1.05);
      redeemed = Math.round(redeemed * 1.05);
    }

    const calculatedRatio = redeemed > 0 ? (stamps / redeemed).toFixed(2) : '0.00';

    return { chartPoints: basePoints, totalStamps: stamps, totalRedeemed: redeemed, ratio: calculatedRatio };
  }, [activeDateRange, timeframe]);

  // Path generators
  const generatePath = (points: any[], key: 'y1' | 'y2') => {
    if (points.length === 0) return '';
    return points.map((p, i) => {
      if (i === 0) return `M ${p.x} ${p[key]}`;
      const prev = points[i - 1];
      const cx1 = prev.x + (p.x - prev.x) / 3;
      const cy1 = prev[key];
      const cx2 = prev.x + 2 * (p.x - prev.x) / 3;
      const cy2 = p[key];
      return `C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p[key]}`;
    }).join(' ');
  };

  const stampsPath = generatePath(chartPoints, 'y1');
  const redeemedPath = generatePath(chartPoints, 'y2');
  const areaPath = chartPoints.length > 0 ? `${stampsPath} L ${chartPoints[chartPoints.length - 1].x} 190 L ${chartPoints[0].x} 190 Z` : '';

  return (
    <div className="p-4 lg:p-6 max-w-[1600px] mx-auto space-y-5 relative bg-[#FAF8FF] min-h-screen font-sans">
      {/* Export Toast Notification */}
      {exportToast && (
        <div className="fixed top-20 right-6 z-50 bg-[#1A1615] text-white px-4 py-3 rounded-2xl shadow-2xl border border-[#5844A8]/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300">
          <div className="w-8 h-8 rounded-xl bg-[#5844A8] flex items-center justify-center text-white shrink-0 shadow-md">
            <Share2 className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">Report Export Triggered ✓</p>
            <p className="text-[10px] text-[#A8A29E]">Downloading merchant intelligence report (CSV / PDF)...</p>
          </div>
        </div>
      )}

      {/* 1. Header Overview Row */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-[28px] font-extrabold tracking-tight text-[#111827]">
              Dashboard Overview
            </h1>
            <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-semibold px-2.5 py-0.5 rounded-md border border-[#CEEBD9] inline-flex items-center gap-1">
              Live System
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Real-time performance across all 3 active branch locations • Last updated 2 mins ago
          </p>
        </div>

        {/* Top Right Action Controls — Single Line */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 shrink-0 pb-1 sm:pb-0 relative z-10">
          {/* Date Picker Dropdown */}
          <div className="relative shrink-0">
            <button
              onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
              className="bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl px-4 py-2 text-[13px] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer whitespace-nowrap"
            >
              <Calendar className="w-4 h-4 text-white shrink-0" />
              <span>{activeDateRange}</span>
              <ChevronDown className="w-4 h-4 text-white/80 shrink-0" />
            </button>

            {dateDropdownOpen && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-100 rounded-2xl shadow-lg z-50 py-1.5 text-xs">
                {[
                  'Last 7 Days',
                  'Last 30 Days (Oct 1 - Oct 31, 2024)',
                  'This Quarter (Q4 2024)',
                  'Year to Date (2024)'
                ].map((range) => (
                  <button
                    key={range}
                    onClick={() => {
                      setActiveDateRange(range);
                      setDateDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 hover:bg-[#FAF8FF] transition-colors cursor-pointer ${
                      range === activeDateRange ? 'font-bold text-[#5844A8] bg-purple-50/70' : 'text-[#1A1615]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Report Button */}
          <button
            onClick={() => {
              setExportToast(true);
              setTimeout(() => setExportToast(false), 3000);
            }}
            className="bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 rounded-xl px-4 py-2 text-[13px] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Share2 className="w-4 h-4 text-gray-600 shrink-0" />
            <span>Export Report</span>
          </button>

          {/* Create Campaign Primary Button */}
          <button
            onClick={() => onNavigate('/campaigns/new')}
            className="bg-[#5844A8] hover:bg-[#47368E] text-white rounded-xl px-4 py-2 text-[13px] font-bold flex items-center gap-1.5 shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-white shrink-0" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* 2. Top 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {/* Metric 1: Active Loyalty Members */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Active Loyalty Members
              </span>
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 12.4%
              </span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-[#111827] mt-1.5">
              24,850
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
              <span>3,120 new signups this month</span>
              <span className="text-[10px] text-gray-400">mo/mo</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-purple-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />
              Active retention 94.1%
            </span>
            {/* Sparkline */}
            <svg className="w-20 h-5" viewBox="0 0 80 20" fill="none">
              <path
                d="M 2 16 Q 20 18 35 11 T 60 7 T 78 4"
                stroke="#5844A8"
                strokeWidth="1.75"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Metric 2: Repeat Visit Rate */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Repeat Visit Rate
              </span>
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 4.1%
              </span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-[#111827] mt-1.5">
              68.2%
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
              <span>Avg 2.8 visits/member/mo</span>
              <span className="text-[11px] text-gray-400">Target: 64%</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-purple-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
              +0.4 visits vs Sept
            </span>
            {/* Green Sparkline */}
            <svg className="w-20 h-5" viewBox="0 0 80 20" fill="none">
              <path
                d="M 2 15 Q 22 17 38 12 T 62 8 T 78 5"
                stroke="#15803D"
                strokeWidth="1.75"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Metric 3: Rewards Redeemed */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Rewards Redeemed
              </span>
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 8.9%
              </span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-[#111827] mt-1.5">
              4,180
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
              <span>91.2% redemption velocity</span>
              <span className="text-[11px] text-gray-400">8-stamp</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-purple-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5844A8]" />
              368 unclaimed cards
            </span>
            {/* Purple Sparkline */}
            <svg className="w-20 h-5" viewBox="0 0 80 20" fill="none">
              <path
                d="M 2 17 Q 20 12 36 14 T 60 9 T 78 6"
                stroke="#5844A8"
                strokeWidth="1.75"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Metric 4: Attributed Revenue (GMV) */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500">
                Attributed Revenue (GMV)
              </span>
              <span className="bg-[#EBF7F0] text-[#15803D] text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 15.2%
              </span>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-[#111827] mt-1.5">
              ₹142,650
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1">
              <span>₹34.12 avg spend with stamp</span>
              <span className="text-[11px] text-gray-400">ROI 8.4x</span>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-purple-50 flex items-center justify-between">
            <span className="text-[11px] text-gray-600 flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#111827]" />
              +₹18.7k lift vs baseline
            </span>
            {/* Dark Charcoal Sparkline */}
            <svg className="w-20 h-5" viewBox="0 0 80 20" fill="none">
              <path
                d="M 2 18 Q 20 15 36 10 T 60 6 T 78 3"
                stroke="#111827"
                strokeWidth="1.75"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* 3. Middle Grid: Visits/Redemptions (8 cols) & Program Velocity (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Card: Volume Trends Chart */}
        <div className="lg:col-span-8 bg-white border border-purple-100/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex flex-col flex-1">
            {/* Card Header & Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#111827] flex items-center gap-2">
                  Volume Trends
                  <span className="text-[10px] font-bold bg-[#EBF7F0] text-[#15803D] border border-[#CEEBD9] px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Dynamic volume comparison across all terminal stamps
                </p>
              </div>

              {/* Daily / Weekly / Monthly Switcher */}
              <div className="bg-gray-100 p-0.5 rounded-xl flex items-center self-start sm:self-auto">
                {(['Daily', 'Weekly', 'Monthly'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeframe(t)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      timeframe === t
                        ? 'bg-[#5844A8] text-white shadow-xs font-bold'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend & Ratio */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-purple-50 text-xs">
              <div className="flex items-center gap-5">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5844A8]" />
                  <span className="text-gray-500">Stamps Issued</span>
                  <span className="font-bold text-[#111827]">{totalStamps.toLocaleString()}</span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#111827]" />
                  <span className="text-gray-500">Rewards Redeemed</span>
                  <span className="font-bold text-[#111827]">{totalRedeemed.toLocaleString()}</span>
                </span>
              </div>
              <div className="font-mono text-xs text-gray-500">
                Scan Ratio: <span className="font-semibold text-[#111827]">{ratio} : 1</span>
              </div>
            </div>

            {/* Interactive SVG Chart Viewport */}
            <div className="relative mt-4 min-h-[16rem] flex-1 w-full select-none">
              <svg
                className="w-full h-full overflow-visible absolute inset-0"
                viewBox="0 0 640 210"
                preserveAspectRatio="none"
              >
                <defs>
                  {/* Purple Area Gradient */}
                  <linearGradient id="purpleAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5844A8" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5844A8" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                <line x1="0" y1="40" x2="640" y2="40" stroke="#FAF5FF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="640" y2="90" stroke="#FAF5FF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="140" x2="640" y2="140" stroke="#FAF5FF" strokeWidth="1" strokeDasharray="3 3" />
                <line x1="0" y1="190" x2="640" y2="190" stroke="#EDE9FE" strokeWidth="1" />

                {/* Area under stamps curve */}
                <path
                  d={areaPath}
                  fill="url(#purpleAreaGrad)"
                />

                {/* Purple Line: Stamps Issued */}
                <path
                  d={stampsPath}
                  stroke="#5844A8"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Dark Charcoal Line: Rewards Redeemed */}
                <path
                  d={redeemedPath}
                  stroke="#111827"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Interactive Points on hover */}
                {chartPoints.map((pt) => {
                  const isHovered = hoveredPoint?.date === pt.date;
                  return (
                    <g
                      key={pt.date}
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredPoint(pt)}
                    >
                      {/* Vertical highlight line on hovered */}
                      {isHovered && (
                        <line
                          x1={pt.x}
                          y1="30"
                          x2={pt.x}
                          y2="190"
                          stroke="#A8A29E"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                        />
                      )}

                      {/* Purple stamp point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y1}
                        r={isHovered ? '5' : '3.5'}
                        fill="#FFFFFF"
                        stroke="#5844A8"
                        strokeWidth={isHovered ? '2.5' : '2'}
                      />

                      {/* Dark redeemed point */}
                      <circle
                        cx={pt.x}
                        cy={pt.y2}
                        r={isHovered ? '4.5' : '3'}
                        fill="#FFFFFF"
                        stroke="#111827"
                        strokeWidth="2"
                      />
                    </g>
                  );
                })}
              </svg>

              {/* Render Tooltip Box at Hovered Position */}
              {hoveredPoint && (
                <div
                  className="absolute pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(hoveredPoint.x / 640) * 100}%`,
                    top: `${(hoveredPoint.y1 / 210) * 100 - 6}%`,
                  }}
                >
                  <div className="bg-[#111827] text-white rounded-xl p-2.5 shadow-xl border border-neutral-700 min-w-[125px]">
                    <div className="text-[11px] font-semibold text-gray-400 border-b border-neutral-700/80 pb-1 mb-1.5 flex items-center justify-between">
                      <span>{hoveredPoint.date}</span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between gap-3 text-white">
                        <span className="text-gray-400 text-[11px]">Stamps:</span>
                        <span className="font-bold text-purple-300">{hoveredPoint.stamps.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between gap-3 text-white">
                        <span className="text-gray-400 text-[11px]">Redeemed:</span>
                        <span className="font-bold">{hoveredPoint.redeemed.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom 3 Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 mt-2 border-t border-purple-50">
            <div className="p-2.5 rounded-xl bg-[#FAF8FF] border border-purple-100/70">
              <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                PEAK HOUR
              </div>
              <div className="text-xs font-bold text-[#111827] mt-0.5">
                12:30 - 14:00 PM
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF8FF] border border-purple-100/70">
              <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                TOP REWARD
              </div>
              <div className="text-xs font-bold text-[#111827] mt-0.5">
                Signature Oat Latte
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#FAF8FF] border border-purple-100/70">
              <div className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
                STAMP VELOCITY
              </div>
              <div className="text-xs font-bold text-[#111827] mt-0.5">
                39.2 scans / hr
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Program Velocity */}
        <div className="lg:col-span-4 bg-white border border-purple-100/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111827]">
                Program Velocity
              </h2>
              <span className="text-[10px] font-semibold text-[#5844A8] bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-md">
                Oct Target
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              30,000 monthly scan capacity
            </p>

            {/* Circular Donut Progress Ring */}
            <div className="my-5 flex flex-col items-center justify-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Track Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#F3E8FF"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Active Progress Circle: 84% */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    stroke="#5844A8"
                    strokeWidth="8"
                    strokeDasharray="238.76"
                    strokeDashoffset="38.2" // (1 - 0.84) * 238.76 = 38.2
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
                {/* Center Value */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-extrabold tracking-tight text-[#111827]">
                    84%
                  </span>
                  <span className="text-[11px] font-medium text-gray-400">
                    25,200 Scans
                  </span>
                </div>
              </div>
            </div>

            {/* Branch Breakdown List */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#5844A8]" />
                  <span>Downtown Flagship</span>
                </span>
                <span className="font-medium text-[#111827]">
                  48% (12,096)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#111827]" />
                  <span>Northside Mall</span>
                </span>
                <span className="font-medium text-[#111827]">
                  32% (8,064)
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-gray-400" />
                  <span>West End Kiosk</span>
                </span>
                <span className="font-medium text-[#111827]">
                  20% (5,040)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Operational Actions Section */}
          <div className="mt-5 pt-4 border-t border-purple-50">
            <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-2">
              QUICK OPERATIONAL ACTIONS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Action 1 */}
              <button
                onClick={() => onNavigate('/qr-codes')}
                className="w-full text-left bg-gradient-to-br from-[#5844A8] to-[#433282] hover:opacity-95 text-white rounded-2xl p-3 flex flex-col justify-between transition-all shadow-xs h-24 cursor-pointer group"
              >
                <QrCode className="w-4 h-4 text-white mb-2" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">Scan &amp; Verify</div>
                  <div className="text-[10px] text-white/80 line-clamp-1">Counter camera launch</div>
                </div>
              </button>

              {/* Action 2 */}
              <button
                onClick={() => onNavigate('/qr-codes')}
                className="w-full text-left bg-gradient-to-br from-[#5844A8] to-[#433282] hover:opacity-95 text-white rounded-2xl p-3 flex flex-col justify-between transition-all shadow-xs h-24 cursor-pointer group"
              >
                <Share2 className="w-4 h-4 text-white mb-2" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">QR Pack Print</div>
                  <div className="text-[10px] text-white/80 line-clamp-1">Table stand templates</div>
                </div>
              </button>

              {/* Action 3 */}
              <button
                onClick={() => onNavigate('/staff')}
                className="w-full text-left bg-gradient-to-br from-[#5844A8] to-[#433282] hover:opacity-95 text-white rounded-2xl p-3 flex flex-col justify-between transition-all shadow-xs h-24 cursor-pointer group"
              >
                <UserPlus className="w-4 h-4 text-white mb-2" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">Shift Staff</div>
                  <div className="text-[10px] text-white/80 line-clamp-1">4 baristas logged in</div>
                </div>
              </button>

              {/* Action 4 */}
              <button
                onClick={() => onNavigate('/loyalty')}
                className="w-full text-left bg-gradient-to-br from-[#5844A8] to-[#433282] hover:opacity-95 text-white rounded-2xl p-3 flex flex-col justify-between transition-all shadow-xs h-24 cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-white mb-2" />
                <div>
                  <div className="text-xs font-bold text-white mb-0.5">Double-Stamp</div>
                  <div className="text-[10px] text-white/80 line-clamp-1">Trigger flash hour boost</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom Grid: Real-time Branch Activity & Branch Comparison & Stand Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Real-time Branch Activity */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-start sm:items-center justify-between gap-2">
              <h2 className="text-base font-bold text-[#111827]">
                Real-time Branch Activity
              </h2>
              <div className="flex items-center gap-1.5 shrink-0 mt-1 sm:mt-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#15803D] animate-pulse" />
                <span className="font-mono text-[11px] sm:text-xs text-gray-500 whitespace-nowrap">
                  Stream: Connected
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">
              Instant log of counter scans, member tier upgrades, and verified redemptions
            </p>

            {/* 4 Activity Cards */}
            <div className="space-y-3">
              {/* Activity 1 */}
              <div className="p-3 bg-[#FAF8FF] border border-purple-100/70 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5844A8] shrink-0 mt-0.5">
                  <Plus className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">
                      Marcus Vance
                    </span>
                    <span className="text-[11px] text-gray-400">
                      4 mins ago
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Earned Stamp #8 • Downtown Flagship
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-semibold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                      POS #02
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Staff: Sarah K.
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity 2 */}
              <div className="p-3 bg-[#FAF8FF] border border-purple-100/70 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#EBF7F0] border border-[#CEEBD9] flex items-center justify-center text-[#15803D] shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">
                      Elena Rostova
                    </span>
                    <span className="text-[11px] text-gray-400">
                      11 mins ago
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Redeemed &ldquo;Free Cold Brew &amp; Pastry&rdquo; • Northside
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold bg-[#EBF7F0] text-[#15803D] border border-[#CEEBD9] px-2 py-0.5 rounded">
                      VERIFIED VOUCHER
                    </span>
                    <span className="font-mono text-[11px] text-gray-400">
                      TK-98241
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity 3 */}
              <div className="p-3 bg-[#FAF8FF] border border-purple-100/70 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#5844A8] shrink-0 mt-0.5">
                  <Award className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">
                      David Chen
                    </span>
                    <span className="text-[11px] text-gray-400">
                      19 mins ago
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Unlocked <span className="text-[#5844A8] font-bold">Gold Tier</span> privileges (25 lifetime visits)
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold bg-[#2D124D] text-[#C084FC] px-2 py-0.5 rounded">
                      OBSIDIAN VIP
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Perk: 1.5x Auto-Stamps
                    </span>
                  </div>
                </div>
              </div>

              {/* Activity 4 */}
              <div className="p-3 bg-[#FAF8FF] border border-purple-100/70 rounded-2xl flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 shrink-0 mt-0.5">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111827]">
                      QR Stand: &ldquo;Table 14 - Fast Scan&rdquo;
                    </span>
                    <span className="text-[11px] text-gray-400">
                      1 hr ago
                    </span>
                  </div>
                  <div className="text-xs text-gray-700 mt-0.5">
                    Scanned 12 times in the last hour • West End Kiosk
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[10px] font-bold bg-purple-50 text-[#5844A8] border border-purple-100 px-2 py-0.5 rounded">
                      High Velocity Alert
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Static Table Stand
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-purple-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0">
            <button
              onClick={() => onNavigate('/settings/audit')}
              className="text-[11px] sm:text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer w-fit"
            >
              <span>View full activity audit ledger</span>
              <span>→</span>
            </button>
            <span className="text-[10px] sm:text-[11px] text-gray-400 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-gray-400 sm:hidden"></span>
              Refreshed automatically
            </span>
          </div>
        </div>

        {/* Right: Branch Comparison & Stand Status */}
        <div className="bg-white border border-purple-100/80 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-[#111827]">
                Branch Comparison &amp; Stand Status
              </h2>
              <button
                onClick={() => onNavigate('/branches')}
                className="text-[11px] font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
              >
                Manage Branches <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 mb-4">
              Operational stand performance across live retail sites
            </p>

            {/* Desktop Performance Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-purple-50 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                    <th className="pb-2.5">BRANCH NAME</th>
                    <th className="pb-2.5">QR STANDS</th>
                    <th className="pb-2.5">TODAY SCANS</th>
                    <th className="pb-2.5">REDEEMED</th>
                    <th className="pb-2.5 text-right">STAFF ACTIVE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-50 text-xs">
                  {[
                    { id: 'downtown', name: 'Downtown Flagship', address: '742 Evergreen Terr.', stands: 6, scans: 412, redeemed: 38, staff: '3 On-duty' },
                    { id: 'northside', name: 'Northside Mall', address: 'Atrium Level 2, Unit 4B', stands: 4, scans: 245, redeemed: 22, staff: '2 On-duty' },
                    { id: 'westend', name: 'West End Kiosk', address: 'Transit Plaza Central', stands: 2, scans: 118, redeemed: 14, staff: '1 On-duty' }
                  ].map(branch => (
                    <tr key={branch.id} className="hover:bg-[#FAF8FF] transition-colors">
                      <td className="py-3">
                        <div className="font-bold text-[#111827]">{branch.name}</div>
                        <div className="text-[10px] text-gray-400">{branch.address}</div>
                      </td>
                      <td className="py-3">
                        <span className="flex items-center gap-1.5 font-medium text-[#111827]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                          {branch.stands} Active
                        </span>
                      </td>
                      <td className="py-3 font-bold text-[#111827]">{branch.scans}</td>
                      <td className="py-3 font-bold text-[#5844A8]">{branch.redeemed}</td>
                      <td className="py-3 text-right">
                        <span className="bg-[#FAF8FF] border border-purple-100 text-gray-700 text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-block">
                          {branch.staff}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Expandable List */}
            <div className="sm:hidden space-y-3">
              {[
                { id: 'downtown', name: 'Downtown Flagship', address: '742 Evergreen Terr.', stands: 6, scans: 412, redeemed: 38, staff: '3 On-duty' },
                { id: 'northside', name: 'Northside Mall', address: 'Atrium Level 2, Unit 4B', stands: 4, scans: 245, redeemed: 22, staff: '2 On-duty' },
                { id: 'westend', name: 'West End Kiosk', address: 'Transit Plaza Central', stands: 2, scans: 118, redeemed: 14, staff: '1 On-duty' }
              ].map(branch => (
                <div key={branch.id} className="border border-purple-100/80 rounded-2xl overflow-hidden shadow-xs">
                  <button
                    onClick={() => setExpandedBranch(expandedBranch === branch.id ? null : branch.id)}
                    className="w-full bg-[#FAF8FF] p-3 flex items-center justify-between transition-colors cursor-pointer hover:bg-purple-50/50"
                  >
                    <div className="text-left">
                      <div className="font-bold text-[#111827] text-xs">{branch.name}</div>
                      <div className="text-[10px] text-gray-400">{branch.address}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 font-medium text-[#111827] text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        {branch.stands} Active
                      </span>
                      {expandedBranch === branch.id ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </button>
                  {expandedBranch === branch.id && (
                    <div className="p-3 bg-white grid grid-cols-3 gap-3 border-t border-purple-100">
                      <div>
                        <div className="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Today Scans</div>
                        <div className="font-bold text-[#111827] text-sm">{branch.scans}</div>
                      </div>
                      <div>
                        <div className="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Redeemed</div>
                        <div className="font-bold text-[#5844A8] text-sm">{branch.redeemed}</div>
                      </div>
                      <div className="text-right flex flex-col items-end">
                        <div className="text-[9px] uppercase font-bold text-gray-400 mb-1 tracking-wider">Staff Active</div>
                        <span className="bg-[#FAF8FF] border border-purple-100 text-gray-700 text-[10px] font-medium px-2 py-0.5 rounded-full inline-block">
                          {branch.staff}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Terminal Telemetry Box */}
            <div className="mt-4 p-3 bg-[#FAF8FF] border border-purple-100 rounded-2xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl border border-purple-100 bg-white flex items-center justify-center text-[#5844A8] shrink-0 shadow-xs">
                  <Wifi className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#111827]">
                    All 12 Terminal Stands Online
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Bluetooth &amp; Dynamic QR sync operating at 100% telemetry
                  </div>
                </div>
              </div>
              <span className="bg-[#EBF7F0] border border-[#CEEBD9] text-[#15803D] text-xs font-bold px-2.5 py-1 rounded-md shrink-0">
                99.98% SLA
              </span>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-4 pt-3 border-t border-purple-50 flex items-center justify-between">
            <button
              onClick={() => onNavigate('/qr-codes')}
              className="text-xs font-bold text-[#5844A8] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Configure QR stand terminals</span>
              <span>→</span>
            </button>
            <span className="text-[11px] text-gray-400">
              Auto-sync: 30s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
