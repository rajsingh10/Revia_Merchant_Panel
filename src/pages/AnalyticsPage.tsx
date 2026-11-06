import React, { useMemo, useState, useEffect } from 'react';
import {
  Award,
  BarChart3,
  Calendar,
  ChevronDown,
  Download,
  Filter,
  FileText,
  LockKeyhole,
  SlidersHorizontal,
  Sparkles,
  ShieldCheck,
  Timer,
} from 'lucide-react';
import { RETENTION_COHORT_DATA } from '../data/mockData';



export const AnalyticsPage: React.FC = () => {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 90 Days (Aug 15 - Nov 14, 2024)');
  const [selectedVenue, setSelectedVenue] = useState('All Venues (3)');
  const [openDropdown, setOpenDropdown] = useState<'date' | 'venue' | null>(null);
  const [exported, setExported] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dataMultiplier = useMemo(() => {
    let mult = 1;
    if (selectedDateRange.includes('30')) mult *= 0.33;
    if (selectedDateRange.includes('Year')) mult *= 3.5;
    if (selectedVenue === 'Downtown Flagship') mult *= 0.5;
    else if (selectedVenue === 'Roastery Reserve') mult *= 0.3;
    else if (selectedVenue === 'Northside Pop-up') mult *= 0.2;
    return mult;
  }, [selectedDateRange, selectedVenue]);

  const kpiCards = useMemo(
    () => [
      {
        label: '30-Day Customer Retention',
        value: (74.8 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1) + '%',
        detail: 'Vs Prev. Quarter',
        note: `Benchmark: ${(58.4 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}%`,
        accent: 'bg-[#5844A8]',
        tone: 'emerald',
      },
      {
        label: 'Obsidian VIP LTV',
        value: `₹${(1480.00 * dataMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        detail: `Avg ${(3.8 * (1 + (dataMultiplier - 1) * 0.1)).toFixed(1)} visits/week`,
        note: `₹${(38.90 * dataMultiplier).toFixed(2)} AVG`,
        accent: 'bg-[#C9A24F]',
        tone: 'gold',
      },
      {
        label: 'Stamp Velocity',
        value: `${(12.4 * (1 - (dataMultiplier - 1) * 0.1)).toFixed(1)} Days`,
        detail: 'Target: 10 Stamps',
        note: `${(8.7 * (1 - (dataMultiplier - 1) * 0.1)).toFixed(1)} Stamps Avg`,
        accent: 'bg-[#0D7A53]',
        tone: 'stone',
      },
      {
        label: 'Guest Churn Risk',
        value: `${(4.2 * (1 - (dataMultiplier - 1) * 0.2)).toFixed(1)}%`,
        detail: `${Math.round(18 * dataMultiplier)} dormant guests re-engaged via Flash Perk`,
        note: '',
        accent: 'bg-[#D9A14A]',
        tone: 'amber',
      },
    ],
    [dataMultiplier]
  );

  const exportDossier = () => {
    const rows = [
      ['Analytics Dossier', 'Value'],
      ['Date Horizon', selectedDateRange],
      ['Venue', selectedVenue],
      [],
      ['Metric', 'Value', 'Detail', 'Note'],
      ...kpiCards.map(({ label, value, detail, note }) => [label, value, detail, note]),
    ];
    const csv = rows.map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revia-analytics-dossier.csv';
    link.click();
    URL.revokeObjectURL(url);
    setExported(true);
    window.setTimeout(() => setExported(false), 2200);
  };

  const funnelStages = useMemo(() => [
    { label: '1st QR Counter Scan', value: `100% (${Math.round(2840 * dataMultiplier).toLocaleString()})`, detail: `Avg ${(1.2 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)} items per order`, percent: 100, accent: 'bg-[#6E6862]' },
    { label: 'Privé Member', value: `${(82.0 * (1 + (dataMultiplier - 1) * 0.02)).toFixed(1)}% Conversion`, detail: `Achieved within ${(9.4 * (1 - (dataMultiplier - 1) * 0.05)).toFixed(1)} days of scan`, percent: 82, accent: 'bg-[#7C3AED]' },
    { label: 'Black Tier', value: `${(34.0 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}% Conversion`, detail: `Avg ${(28 * (1 - (dataMultiplier - 1) * 0.05)).toFixed(0)} days · ${Math.round(15 * dataMultiplier)} roasts logged`, percent: 34, accent: 'bg-[#C39A3D]' },
    { label: 'Obsidian VIP', value: `${(11.8 * (1 + (dataMultiplier - 1) * 0.08)).toFixed(1)}% Velocity`, detail: `Apex spending tier · ${Math.round(335 * dataMultiplier)} total guests`, percent: 12, accent: 'bg-[#5844A8]' },
  ], [dataMultiplier]);

  const menuItems = useMemo(() => [
    { name: 'Panama Geisha Reserve', rate: `${(94 * (1 + (dataMultiplier - 1) * 0.02)).toFixed(0)}%`, lift: `+${(42.8 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}% LTV Lift`, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&auto=format&fit=crop&q=80' },
    { name: 'Cardamom Tahini Cruffin', rate: `${(88 * (1 + (dataMultiplier - 1) * 0.02)).toFixed(0)}%`, lift: `+${(31.2 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}% LTV Lift`, image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&auto=format&fit=crop&q=80' },
    { name: 'Madagascan Vanilla Oat', rate: `${(81 * (1 + (dataMultiplier - 1) * 0.02)).toFixed(0)}%`, lift: `+${(26.5 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}% LTV Lift`, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=80' },
    { name: 'Single-Origin Roastery Flight', rate: `${(79 * (1 + (dataMultiplier - 1) * 0.02)).toFixed(0)}%`, lift: `+${(22.4 * (1 + (dataMultiplier - 1) * 0.05)).toFixed(1)}% LTV Lift`, image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=120&auto=format&fit=crop&q=80' },
  ], [dataMultiplier]);

  const revenueSeries = useMemo(() => [
    { label: 'M1', value: Math.round(1240 * dataMultiplier) },
    { label: 'M2', value: Math.round(1320 * dataMultiplier) },
    { label: 'M3', value: Math.round(1460 * dataMultiplier) },
    { label: 'M4', value: Math.round(1620 * dataMultiplier) },
    { label: 'M5', value: Math.round(1740 * dataMultiplier) },
    { label: 'M6', value: Math.round(1880 * dataMultiplier) },
    { label: 'M7', value: Math.round(1960 * dataMultiplier) },
    { label: 'M8', value: Math.round(2160 * dataMultiplier) },
    { label: 'M9', value: Math.round(2310 * dataMultiplier) },
    { label: 'M10', value: Math.round(2435 * dataMultiplier) },
    { label: 'M11', value: Math.round(2500 * dataMultiplier) },
    { label: 'M12', value: Math.round(2600 * dataMultiplier) },
  ], [dataMultiplier]);

  const getHeatmapColor = (pct: number) => {
    if (pct === 0) return 'bg-[#F7F5F2] text-[#8F8A84] border border-[#EEE7DD]';
    if (pct >= 85) return 'bg-gradient-to-r from-[#7C3AED] to-[#5844A8] text-white font-bold shadow-[0_6px_16px_rgba(158,120,47,0.25)]';
    if (pct >= 75) return 'bg-[#D8B562]/45 text-[#1A1615] font-semibold';
    if (pct >= 65) return 'bg-[#E8D9B4]/60 text-[#1A1615] font-medium';
    return 'bg-[#F7F5F2] text-[#6E6A66]';
  };

  const renderLine = (data: { label: string; value: number }[], stroke: string, fill: string) => {
    const width = 620;
    const height = 180;
    const min = 0;
    const max = Math.max(1600, ...data.map(d => d.value)) * 1.1 || 1;
    const range = max - min || 1;

    const toPoints = (values: number[]) => values
      .map((value, index) => {
        const x = (index / (data.length - 1)) * (width - 30) + 15;
        const y = height - ((value - min) / range) * (height - 30) - 15;
        return `${x},${y}`;
      })
      .join(' ');

    const obsidianValues = [0, 300, 500, 710, 900, 1060, 1190, 1300, 1380, 1440, 1480, 1500].map(v => v * dataMultiplier);
    const blackTierValues = [0, 180, 300, 430, 550, 660, 750, 830, 900, 950, 985, 1000].map(v => v * dataMultiplier);
    const primeMemberValues = [0, 95, 155, 220, 285, 335, 375, 410, 440, 465, 485, 500].map(v => v * dataMultiplier);
    const guestScanValues = [0, 34, 40, 48, 55, 61, 67, 72, 78, 83, 88, 95].map(v => v * dataMultiplier);
    const points = toPoints(obsidianValues);
    const blackTier = toPoints(blackTierValues);
    const primeMember = toPoints(primeMemberValues);
    const guestScan = toPoints(guestScanValues);

    return (
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full">
        <defs>
          <linearGradient id={`fill-${stroke.replace('#', '')}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={fill} stopOpacity={0.25} />
            <stop offset="100%" stopColor={fill} stopOpacity={0.04} />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3].map((line) => (
          <line
            key={line}
            x1="15"
            x2={width - 15}
            y1={18 + line * 38}
            y2={18 + line * 38}
            stroke="#EEE9E2"
            strokeDasharray="2 6"
            strokeWidth="1"
          />
        ))}

        <polyline
          fill="none"
          stroke={stroke}
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          points={points}
        />

        <polyline fill="none" stroke="#B78625" strokeWidth="1.7" strokeLinejoin="round" strokeLinecap="round" points={blackTier} />
        <polyline fill="none" stroke="#7C3AED" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" points={primeMember} />
        <polyline fill="none" stroke="#8C847A" strokeWidth="1.1" strokeDasharray="2 4" points={guestScan} />

        <circle cx={width - 15} cy={height - ((1500 * dataMultiplier - min) / range) * (height - 30) - 15} r="3" fill="#5844A8" />
        <circle cx={width - 15} cy={height - ((1000 * dataMultiplier - min) / range) * (height - 30) - 15} r="2.5" fill="#B78625" />
        <circle cx={width - 15} cy={height - ((500 * dataMultiplier - min) / range) * (height - 30) - 15} r="2.5" fill="#7C3AED" />
        <circle cx={width - 15} cy={height - ((95 * dataMultiplier - min) / range) * (height - 30) - 15} r="2.5" fill="#8C847A" />

        {data.map((point, index) => (
          <text key={`month-${point.label}`} x={(index / (data.length - 1)) * (width - 30) + 15} y={height - 1} textAnchor="middle" fill="#8C847A" fontSize="8">{point.label}</text>
        ))}

        <text x={width - 16} y="20" textAnchor="end" fill="#B5ADA3" fontSize="8">₹{(1500 * dataMultiplier).toLocaleString()}</text>
        <text x={width - 16} y="65" textAnchor="end" fill="#B5ADA3" fontSize="8">₹{(1000 * dataMultiplier).toLocaleString()}</text>
        <text x={width - 16} y="110" textAnchor="end" fill="#B5ADA3" fontSize="8">₹{(500 * dataMultiplier).toLocaleString()}</text>

        {data.map((point, index) => {
          const x = (index / (data.length - 1)) * (width - 30) + 15;
          const y = height - ((point.value - min) / range) * (height - 30) - 15;
          return (
            <g key={point.label}>
              {index === data.length - 1 && <circle cx={x} cy={y} r="3" fill={stroke} />}
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <>
      <div className="min-h-0 bg-[#F6F3EE] px-3 pb-2 pt-4 sm:px-5 lg:px-6 w-full">
        <div className="mx-auto w-full max-w-[1400px]">
          <header className="relative z-30 bg-[#F6F3EE]  pt-3">
            {/*
          <div className="mb-4 flex items-center justify-between pb-2 text-[9px] font-bold uppercase tracking-[0.12em] text-[#8C847A]">
            <div className="flex items-center gap-2">
              <span>Home</span>
              <span className="text-[#C8BFB4]">/</span>
              <span>Insights &amp; Config</span>
              <span className="text-[#C8BFB4]">/</span>
              <span className="text-[#5844A8]">Analytics &amp; Retention</span>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#CDE9DB] bg-[#F0FAF4] px-2.5 py-1.5 text-[8px] tracking-[0.1em] text-[#0D7A53]">
              <span className="h-2 w-2 rounded-full bg-[#16A36D]" />
              Live telemetry · 4m latency
            </div>
          </div>
          */}

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
              <div className="max-w-[480px]">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight leading-[1.05] text-[#1A1615]">
                    Analytics &amp; Cohort Retention
                  </h1>
                </div>

                <p className="mt-2 max-w-[540px] text-sm text-[#6E6A66]">
                  Longitudinal guest retention curves, VIP tier velocity, stamp redemption turnover, and lifetime value across all artisanal venues.
                </p>
              </div>

              <div className="flex w-full flex-col sm:flex-row lg:grid lg:w-[560px] lg:max-w-full lg:grid-cols-2 gap-2 self-start lg:self-auto mt-4 lg:mt-0">
                <div className="relative z-50 min-w-[230px] lg:min-w-0 lg:w-full dropdown-container">
                  <button type="button" onClick={() => setOpenDropdown(openDropdown === 'date' ? null : 'date')} className="flex w-full items-center gap-2 rounded-[9px] border border-[#E7E0D8] bg-white px-2.5 py-1.5 text-left shadow-[0_2px_8px_rgba(25,20,18,0.02)] hover:border-[#C9A24F]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#F3EFE9] text-[#7A7269]"><Calendar className="h-2.5 w-2.5" /></span>
                    <span className="flex min-w-0 flex-1 flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Date horizon</span><span className="mt-0.5 truncate text-[11px] font-semibold text-[#1A1615]">{selectedDateRange}</span></span>
                    <ChevronDown className={`h-3 w-3 shrink-0 text-[#8C847A] transition-transform ${openDropdown === 'date' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'date' && <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[230px] rounded-lg border border-[#E7E0D8] bg-white p-1.5 text-left shadow-lg"><div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#5844A8]">Choose date horizon</div>{['Last 30 Days', 'Last 90 Days (Aug 15 - Nov 14, 2024)', 'Year to date'].map((range) => <button key={range} type="button" onClick={() => { setSelectedDateRange(range); setOpenDropdown(null); }} className={`block w-full rounded-md px-2 py-2 text-left text-[11px] hover:bg-[#FAF5FF] ${selectedDateRange === range ? 'font-semibold text-[#5844A8]' : 'text-[#4F4842]'}`}>{range}</button>)}</div>}
                </div>

                <div className="relative z-50 min-w-[120px] lg:min-w-0 lg:w-full dropdown-container">
                  <button type="button" onClick={() => setOpenDropdown(openDropdown === 'venue' ? null : 'venue')} className="flex w-full items-center gap-2 rounded-[9px] border border-[#E7E0D8] bg-white px-2.5 py-1.5 text-left shadow-[0_2px_8px_rgba(25,20,18,0.02)] hover:border-[#C9A24F]">
                    <span className="flex h-4 w-4 items-center justify-center rounded-md bg-[#F3EFE9] text-[#7A7269]"><Filter className="h-2.5 w-2.5" /></span>
                    <span className="flex min-w-0 flex-1 flex-col"><span className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Venues</span><span className="mt-0.5 truncate text-[11px] font-semibold text-[#1A1615]">{selectedVenue}</span></span>
                    <ChevronDown className={`h-3 w-3 shrink-0 text-[#8C847A] transition-transform ${openDropdown === 'venue' ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === 'venue' && <div className="absolute left-0 top-full z-20 mt-1 w-full min-w-[160px] rounded-lg border border-[#E7E0D8] bg-white p-1.5 text-left shadow-lg"><div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[#5844A8]">Choose venue</div>{['All Venues (3)', 'Downtown Flagship', 'Roastery Reserve', 'Northside Pop-up'].map((venue) => <button key={venue} type="button" onClick={() => { setSelectedVenue(venue); setOpenDropdown(null); }} className={`block w-full rounded-md px-2 py-2 text-left text-[11px] hover:bg-[#FAF5FF] ${selectedVenue === venue ? 'font-semibold text-[#5844A8]' : 'text-[#4F4842]'}`}>{venue}</button>)}</div>}
                </div>

                <div className="inline-flex items-center gap-2 rounded-[9px] border border-[#E7E1D8] bg-[#F4F0EA] px-2.5 py-1.5 shadow-[0_2px_8px_rgba(25,20,18,0.02)] lg:w-full">
                  <BarChart3 className="h-3 w-3 text-[#5844A8]" />
                  <span className="flex flex-col text-[10px] font-bold uppercase leading-3 tracking-widest text-[#1A1615]"><span className="text-[#8C847A]">Cohort benchmark</span><span>VIP vs New Guests</span></span>
                </div>

                <button type="button" onClick={exportDossier} className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#7C3AED] to-[#5844A8] px-4 py-2 text-[13px] font-bold text-white shadow-[0_3px_10px_rgba(158,120,47,0.2)] transition hover:opacity-95 lg:w-full">
                  <Download className="w-4 h-4" />
                  {exported ? 'Dossier Ready' : 'Export CSV / PDF Dossier'}
                </button>
              </div>


            </div>
          </header>

          <section className="mt-5 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-4">
            {kpiCards.map(({ label, value, detail, note, accent, tone }) => (
              <div
                key={label}
                className="h-[162px] rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="max-w-[150px] text-[10px] uppercase font-bold tracking-widest text-[#9E9A93]">{label}</span>
                  {label.includes('Retention') && <span className="rounded-full border border-[#BDE8D4] bg-[#F0FBF5] px-2 py-1 text-[10px] font-bold uppercase leading-none text-[#0D7A53]">Top<br />Decile</span>}
                  {label.includes('VIP') && <span className="rounded-full border border-[#F0D98A] bg-[#FFF9E7] px-2 py-1 text-[10px] font-bold uppercase leading-none text-[#A16D1F]">+14.5%<br />MOM</span>}
                  {label.includes('Velocity') && <span className="rounded-full border border-[#BDE8D4] bg-[#F0FBF5] px-2 py-1 text-[10px] font-bold uppercase text-[#0D7A53]">-2.1 DAYS</span>}
                  {label.includes('Churn') && <span className="rounded-full border border-[#BDE8D4] bg-[#F0FBF5] px-2 py-1 text-[10px] font-bold uppercase text-[#0D7A53]">LOW RISK</span>}
                </div>

                <div className="mt-2 flex items-end justify-between gap-2">
                  <div className="flex items-end gap-1 text-[26px] font-bold text-[#1A1615]">
                    {value}
                    {label.includes('VIP') && <span className="mb-0.5 text-[10px] font-medium tracking-normal text-[#6E6A66]">/ member</span>}
                  </div>
                  {label.includes('Retention') && <span className="text-[11px] font-bold text-[#0D7A53]">+6.2%</span>}
                  {label.includes('Velocity') && <span className="text-[11px] font-bold leading-4 text-[#0D7A53]">Faster<br />Turn</span>}
                  {label.includes('Churn') && <span className="text-[11px] font-bold text-[#0D7A53]">-1.8%</span>}
                </div>

                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#EAE3D9] pt-3 text-[11px] text-[#6E6A66]">
                  {label.includes('Churn') ? (
                    <span className="flex items-start gap-1.5 leading-3 text-[9px] text-[#6E6A66]"><span className="text-[12px] text-[#7C3AED]">⚡</span><span>18 dormant guests re-engaged<br />via Flash Perk</span></span>
                  ) : (
                    <span>{detail}</span>
                  )}
                  {!label.includes('Churn') && <span className="shrink-0 font-bold text-[11px] text-[#5844A8]">{note}</span>}
                </div>
                {label.includes('Retention') && (
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <div className="text-[10px] font-semibold text-[#1A1615]">58.4%</div>
                    <svg viewBox="0 0 90 20" className="h-5 w-24" aria-hidden="true">
                      <polyline points="1,17 15,14 29,14 43,9 56,11 71,5 89,1" fill="none" stroke="#5844A8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="89" cy="1" r="2.2" fill="#5844A8" />
                    </svg>
                  </div>
                )}
                {!label.includes('Churn') && !label.includes('Retention') && <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#EEE9E2]"><div className={`h-full rounded-full ${accent}`} style={{ width: label.includes('VIP') ? '88%' : '82%' }} /></div>}
              </div>
            ))}
          </section>

          <div className="mt-4 grid gap-3 xl:grid-cols-[1.75fr_0.9fr]">
            <main className="space-y-3">
              <section className="hidden md:block overflow-hidden rounded-[9px] border border-[#E9E2D8] bg-white p-2.5 shadow-[0_5px_16px_rgba(29,24,18,0.02)] sm:p-3">
                <div className="mb-2 flex flex-col gap-2 border-b border-[#EAE3D9] pb-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1A1615]">Weekly Retention Cohort Heatmap <span className="text-[10px] text-[#8C847A]">(i)</span></h2>
                    <p className="mt-0.5 max-w-[230px] text-[11px] font-semibold text-[#6E6A66]">Observed customer return scans over a 12-week longitudinal duration.</p>
                  </div>

                  <div className="flex shrink-0 items-center gap-1.5 rounded-[5px] bg-[#FAF8FF] px-1.5 py-1 text-[6px] font-semibold text-[#6E6A66]">
                    <span className="text-[6px] uppercase text-[#8C847A]">Retention:</span>
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-gradient-to-r from-[#7C3AED] to-[#5844A8]" /> &gt;70%</span>
                    <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-sm bg-[#7C3AED]/55" /> 50-70%</span>
                    <span className="inline-flex items-center gap-1 text-[#A39B91]"><span className="h-2 w-2 rounded-sm bg-[#EEEAE4]" /> &lt;50%</span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed border-separate border-spacing-y-0.5 text-left text-[11px]">
                    <thead>
                      <tr className="text-[9px] font-bold uppercase tracking-[0.1em] text-[#8C847A]">
                        <th className="w-[24%] px-2 py-1 font-bold">Cohort</th>
                        <th className="w-[10%] px-1 py-1 font-bold">Size</th>
                        <th className="px-1 py-1 text-center">W0</th>
                        <th className="px-1 py-1 text-center">W1</th>
                        <th className="px-1 py-1 text-center">W2</th>
                        <th className="px-1 py-1 text-center">W3</th>
                        <th className="px-1 py-1 text-center">W4</th>
                        <th className="px-1 py-1 text-center">W5</th>
                        <th className="px-1 py-1 text-center">W6</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RETENTION_COHORT_DATA.map((row) => (
                        <tr key={row.cohort} className="rounded-xl bg-[#FAF8FF]">
                          <td className="rounded-l-xl px-2 py-1 font-semibold text-[#1A1615]">{row.cohort}</td>
                          <td className="px-1 py-1 font-mono text-[#6E6A66]">{row.members.toLocaleString()}</td>
                          {[100, row.m1, row.m2, row.m3, row.m4, row.m5, row.m6].map((value, index) => (
                            <td key={`${row.cohort}-${index}`} className="px-0.5 py-0.5">
                              <div className={`flex h-6 items-center justify-center rounded-[3px] px-0.5 font-mono text-[10px] ${getHeatmapColor(value)}`}>
                                {value ? `${value}%` : '—'}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 flex min-h-[34px] items-start gap-2 rounded-[6px] border border-[#EAE3D9] bg-[#FAF8FF] px-2.5 py-2 text-[12px] leading-4 text-[#6E6A66]">
                  <span className="mt-0.5 shrink-0 text-[12px] font-bold text-[#B78A2B]">*</span>
                  <p className="min-w-0 font-bold"><strong className="text-[#1A1615]">Cohort Health Insight:</strong> The introduction of the <strong className="font-bold text-[#5844A8]">Tahini Cruffin pairing perk</strong> on Oct 7 accelerated Week-1 return velocity by <strong className="font-bold text-[#5844A8]">+4.8%</strong> over the autumn baseline.</p>
                </div>
              </section>

              <section className="rounded-[12px] border border-[#E9E2D8] bg-white p-3 shadow-[0_5px_16px_rgba(29,24,18,0.02)] sm:p-4">
                <div className="mb-3 flex flex-col gap-2 border-b border-[#EAE3D9] pb-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="text-[15px] font-bold text-[#1A1615]">Cumulative Revenue &amp; LTV Trajectory by Member Tier</h2>
                    <p className="mt-0.5 text-[11px] font-semibold text-[#6E6A66]">12-Month Longitudinal Value Growth across guest classifications.</p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="flex h-[48px] w-[82px] flex-col items-center justify-center rounded-[9px] border border-[#EAE3D9] bg-[#FAF8FF] text-center text-[8px] font-bold uppercase leading-3 text-[#8C847A]">Payback<br />Period<b className="mt-0.5 text-[12px] leading-3 text-[#1A1615]">18 Days</b></span>
                    <span className="flex h-[48px] w-[82px] flex-col items-center justify-center rounded-[9px] border border-[#BDE8D4] bg-[#F0FBF5] text-center text-[8px] font-bold uppercase leading-3 text-[#8C847A]">Tier<br />Conversion<b className="mt-0.5 text-[12px] leading-3 text-[#0D7A53]">28.4%</b></span>
                  </div>
                </div>

                <div className="overflow-hidden rounded-[10px] border border-[#F0E9E2] bg-[#FCFAF8] p-1">
                  {renderLine(revenueSeries, '#5844A8', '#7C3AED')}
                </div>

                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                  {[
                    { name: 'Obsidian VIP', value: `₹${(1480 * dataMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'bg-[#5844A8]' },
                    { name: 'Black Tier', value: `₹${(820 * dataMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'bg-[#B29E8F]' },
                    { name: 'Prime Member', value: `₹${(410 * dataMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'bg-[#1A1615]' },
                    { name: 'Guest Scan', value: `₹${(95 * dataMultiplier).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`, color: 'bg-[#D8C7A2]' },
                  ].map((item) => (
                    <div key={item.name} className="rounded-[7px] border border-[#EAE3D9] bg-[#FAF8FF] p-2">
                      <div className="mb-1 flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${item.color}`} />
                        <span className="text-[11px] font-semibold text-[#1A1615]">{item.name}</span>
                      </div>
                      <div className="font-bold tracking-[-0.04em] text-[#1A1615]">{item.value}</div>
                    </div>
                  ))}
                </div>
              </section>
            </main>

            <aside className="flex flex-col gap-3">
              {/* <section className="order-3 rounded-[12px] border border-[#EAE1D6] bg-white p-3 shadow-[0_4px_10px_rgba(29,24,18,0.02)] sm:p-4">
                  <div className="mb-3 flex items-center justify-between border-b border-[#EAE3D9] pb-2">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1A1615]">Footfall Experience Heatmap</h3>
                    </div>
                    <span className="rounded-[5px] border border-[#EAE3D9] bg-[#FAF8FF] px-1.5 py-1 text-center text-[6px] font-bold uppercase text-[#6E6A66]">Live<br />Flow</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-[7px] border border-[#EAE3D9] bg-[#FBF9F6] p-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Morning Rush</div>
                      <div className="mt-1 font-bold text-[#1A1615]">7:30 - 10:00 AM</div>
                      <div className="mt-1 text-[9px] text-[#5844A8]">⚡ Espresso Batch</div>
                    </div>
                    <div className="rounded-[7px] border border-[#EAE3D9] bg-[#FBF9F6] p-2">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-[#9E9A93]">Salon Tasting</div>
                      <div className="mt-1 font-bold text-[#1A1615]">2:00 - 4:30 PM</div>
                      <div className="mt-1 text-[9px] text-[#5844A8]">♥ VIP Pour-Overs</div>
                    </div>
                  </div>
                </section> */}

              <section className="order-1 rounded-[12px] border border-[#EAE1D6] bg-white p-3 font-bold shadow-[0_4px_10px_rgba(29,24,18,0.02)] sm:p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <h3 className="text-[15px] font-bold text-[#1A1615]">Tier Velocity Funnel</h3>
                  </div>
                  <span className="text-[7px] font-bold uppercase tracking-[0.08em] text-[#8C847A]">Full lifecycle</span>
                </div>

                <div className="space-y-2">
                  {funnelStages.map((stage, index) => (
                    <div key={stage.label} className={`rounded-[8px] border px-2.5 py-2 ${stage.label === 'Obsidian VIP' ? 'border-[#E4D3A5] bg-[#FBF5E8]' : 'border-[#EAE3D9] bg-[#FBF9F6]'}`}>
                      <div className="flex items-center justify-between gap-2 text-[11px] text-[#1A1615]">
                        <span className="font-semibold">{stage.label === 'Obsidian VIP' && <span className="mr-1 text-[#5844A8]">✿</span>}{stage.label}</span>
                        <span className="font-bold text-[#5844A8]">{stage.value}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#E9E3DC]">
                        <div className={`h-full rounded-full ${stage.accent}`} style={{ width: `${stage.percent}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-[#8C847A]">{stage.detail}</div>
                    </div>
                  ))}
                </div>

                <div className="mx-0.5 mt-3 min-h-[50px] rounded-[8px] border border-[#EAE3D9] bg-[#FAF8FF] px-2.5 py-2 text-[12px] leading-[1.25] text-[#6E6A66]">
                  <span className="mr-1 align-top text-[13px] text-[#7C3AED]">⚡</span><strong className="text-[#1A1615]">Velocity Lever:</strong> Double-stamp happy hours on Thursdays accelerate <strong className="text-[#5844A8]">Black -&gt; Obsidian</strong> migration by 2.3x.
                </div>
              </section>

              <section className="order-2 rounded-[12px] border border-[#EAE1D6] bg-white p-3 shadow-[0_4px_10px_rgba(29,24,18,0.02)] sm:p-4">
                <div className="mb-3 flex items-center justify-between border-b border-[#EAE3D9] pb-2">
                  <h3 className="text-[15px] font-bold text-[#1A1615]">Menu Items Driving Retention</h3>
                  <span className="text-[9px] font-bold text-[#8C847A]">↗</span>
                </div>

                <div className="space-y-1.5">
                  {menuItems.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2 rounded-[7px] border border-[#EAE3D9] bg-[#FBF9F6] p-1.5 shadow-[0_2px_7px_rgba(29,24,18,0.03)]">
                      <img src={item.image} alt="" className="h-8 w-8 shrink-0 rounded-[5px] object-cover" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[11px] font-bold text-[#1A1615]">{item.name}</div>
                        <div className="mt-0.5 text-[10px] text-[#8C847A]">Signature bakery · {index + 2} stamps logged</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[11px] font-bold text-[#0D7A53]">{item.rate}</div>
                        <div className="text-[9px] font-bold text-[#0D7A53]">Return</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </aside>
          </div>
        </div>
      </div>

    </>
  );
};