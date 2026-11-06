import React, { useState } from 'react';
import {
  SlidersHorizontal,
  ShieldCheck,
  Zap,
  Radio,
  RefreshCw,
  Save,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Smartphone,
  Flame,
  Clock,
  Wifi,
  Cpu,
  ChevronRight,
  Info,
  Sliders,
  BellRing
} from 'lucide-react';

interface DeviceTelemetry {
  id: string;
  name: string;
  branch: string;
  type: 'Revia Stand' | 'Clover Flex' | 'Square Terminal' | 'BLE Beacon';
  ip: string;
  ping: string;
  status: 'online' | 'standby' | 'updating';
  lastActive: string;
}

export const ControlPanelPage: React.FC = () => {
  // Operational toggles
  const [engineActive, setEngineActive] = useState(true);
  const [flashBoostActive, setFlashBoostActive] = useState(false);
  const [instantAutoBurn, setInstantAutoBurn] = useState(true);
  const [offlineCaching, setOfflineCaching] = useState(true);
  const [customerSelfStamp, setCustomerSelfStamp] = useState(true);
  const [emergencyLock, setEmergencyLock] = useState(false);

  // Security thresholds
  const [maxDailyRedemptions, setMaxDailyRedemptions] = useState(3);
  const [cooldownMinutes, setCooldownMinutes] = useState(15);
  const [geofenceRadius, setGeofenceRadius] = useState('150m');
  const [managerPinThreshold, setManagerPinThreshold] = useState('$50.00');
  const [fraudAlertsEmail, setFraudAlertsEmail] = useState(true);

  // Automation
  const [happyHourBoost, setHappyHourBoost] = useState(true);
  const [dailyAutoSettlement, setDailyAutoSettlement] = useState(true);

  // Active view tab
  const [activeTab, setActiveTab] = useState<'operations' | 'security' | 'hardware' | 'automation'>('operations');
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showToast('Control panel settings saved successfully!');
    }, 600);
  };

  const devices: DeviceTelemetry[] = [
    { id: 'DEV-01', name: 'Main Counter Register 1', branch: 'Downtown Flagship', type: 'Revia Stand', ip: '192.168.1.101', ping: '12ms', status: 'online', lastActive: 'Just now' },
    { id: 'DEV-02', name: 'Drive-Thru POS Stand', branch: 'Downtown Flagship', type: 'Clover Flex', ip: '192.168.1.108', ping: '19ms', status: 'online', lastActive: '1m ago' },
    { id: 'DEV-03', name: 'Front Entrance Proximity Beacon', branch: 'Downtown Flagship', type: 'BLE Beacon', ip: 'Bluetooth BLE', ping: '8ms', status: 'online', lastActive: 'Just now' },
    { id: 'DEV-04', name: 'Barista Station 2', branch: 'Uptown Galleria', type: 'Square Terminal', ip: '192.168.2.14', ping: '24ms', status: 'online', lastActive: '3m ago' },
    { id: 'DEV-05', name: 'Self-Serve Kiosk Pod', branch: 'Airport Express', type: 'Revia Stand', ip: '10.0.4.55', ping: '15ms', status: 'online', lastActive: 'Just now' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8FF] p-6 lg:p-8 space-y-6 text-[#111827]">
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#2D124D] text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-purple-500/30 text-sm font-semibold animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-purple-100 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#5844A8] text-white flex items-center justify-center shadow-md">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-black text-[#1A1615] tracking-tight">Control Panel</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Engine v2.14
              </span>
            </div>
            <p className="text-xs text-[#716A62] mt-0.5 font-medium">
              Real-time operational toggles, security boundaries, and hardware fleet telemetry.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={() => showToast('All connected terminals re-synced!')}
            className="px-4 py-2 text-xs font-bold text-[#5844A8] bg-[#FAF8FF] hover:bg-purple-50 border border-purple-200 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Sync Hardware
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#5844A8] hover:bg-[#47368E] rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-all disabled:opacity-60"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>

      {/* Real-time Telemetry Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#716A62]">Loyalty Engine</div>
            <div className="text-xl font-black text-[#1A1615] mt-1 flex items-center gap-2">
              {engineActive ? 'Active' : 'Paused'}
              <span className={`w-2.5 h-2.5 rounded-full ${engineActive ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            </div>
            <div className="text-[11px] text-[#716A62] mt-1">99.98% uptime this month</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#716A62]">Active Terminals</div>
            <div className="text-xl font-black text-[#1A1615] mt-1">12 Online</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-1">0 offline · 0 errors</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#716A62]">Fraud Shield</div>
            <div className="text-xl font-black text-[#1A1615] mt-1">Zero Breaches</div>
            <div className="text-[11px] text-[#716A62] mt-1">AI Velocity guard enabled</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-100 shadow-xs flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#716A62]">Burn Latency</div>
            <div className="text-xl font-black text-[#1A1615] mt-1">18ms</div>
            <div className="text-[11px] text-[#5844A8] font-semibold mt-1">Real-time Redis sync</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-[#5844A8] flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-purple-100 space-x-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('operations')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'operations'
              ? 'border-[#5844A8] text-[#5844A8]'
              : 'border-transparent text-[#716A62] hover:text-[#1A1615]'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Operational Switches
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-[#5844A8] text-[#5844A8]'
              : 'border-transparent text-[#716A62] hover:text-[#1A1615]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Fraud & Velocity Guards
        </button>
        <button
          onClick={() => setActiveTab('hardware')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'hardware'
              ? 'border-[#5844A8] text-[#5844A8]'
              : 'border-transparent text-[#716A62] hover:text-[#1A1615]'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Hardware & Fleet ({devices.length})
        </button>
        <button
          onClick={() => setActiveTab('automation')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeTab === 'automation'
              ? 'border-[#5844A8] text-[#5844A8]'
              : 'border-transparent text-[#716A62] hover:text-[#1A1615]'
          }`}
        >
          <Clock className="w-4 h-4" />
          Schedules & Automations
        </button>
      </div>

      {/* Tab 1: Operational Switches */}
      {activeTab === 'operations' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Main Loyalty Engine Toggle */}
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1615] text-base">Master Loyalty Engine</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${engineActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {engineActive ? 'ONLINE' : 'STOPPED'}
                </span>
              </div>
              <p className="text-xs text-[#716A62] mt-1.5 leading-relaxed">
                Controls all points and stamp issuances across POS registers, payment gateways, and tablets in real time.
              </p>
            </div>
            <button
              onClick={() => {
                setEngineActive(!engineActive);
                showToast(`Master loyalty engine ${!engineActive ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${engineActive ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${engineActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Flash Boost Multiplier */}
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1615] text-base">2x Double Stamp Flash Boost</span>
                {flashBoostActive && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" /> ACTIVE
                  </span>
                )}
              </div>
              <p className="text-xs text-[#716A62] mt-1.5 leading-relaxed">
                Temporarily double all customer stamp earnings across all outlets to spike afternoon foot traffic.
              </p>
            </div>
            <button
              onClick={() => {
                setFlashBoostActive(!flashBoostActive);
                showToast(`Flash boost ${!flashBoostActive ? 'activated' : 'deactivated'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${flashBoostActive ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${flashBoostActive ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Instant Auto-Burn */}
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1615] text-base">Instant 1-Tap Voucher Burn</span>
              </div>
              <p className="text-xs text-[#716A62] mt-1.5 leading-relaxed">
                When a customer presents a QR code, redeem immediately upon scanner read without requiring cashiers to hit a secondary confirm button.
              </p>
            </div>
            <button
              onClick={() => {
                setInstantAutoBurn(!instantAutoBurn);
                showToast(`Instant voucher burn ${!instantAutoBurn ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${instantAutoBurn ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${instantAutoBurn ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Offline Mode Local Caching */}
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1615] text-base">Offline Cache & Queue</span>
              </div>
              <p className="text-xs text-[#716A62] mt-1.5 leading-relaxed">
                If outlet Wi-Fi drops, keep stamping on local tablet storage. Encrypted queue flushes automatically when connection restores.
              </p>
            </div>
            <button
              onClick={() => {
                setOfflineCaching(!offlineCaching);
                showToast(`Offline caching ${!offlineCaching ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${offlineCaching ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${offlineCaching ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Customer Self Stamping */}
          <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1A1615] text-base">Customer Self-Serve Kiosk Stamping</span>
              </div>
              <p className="text-xs text-[#716A62] mt-1.5 leading-relaxed">
                Permit customers to enter their phone number on counter-facing tablets to receive stamps autonomously.
              </p>
            </div>
            <button
              onClick={() => {
                setCustomerSelfStamp(!customerSelfStamp);
                showToast(`Self-serve kiosk mode ${!customerSelfStamp ? 'enabled' : 'disabled'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${customerSelfStamp ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${customerSelfStamp ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          {/* Emergency Kill Switch */}
          <div className="bg-rose-50/70 p-6 rounded-2xl border border-rose-200 shadow-xs flex items-start justify-between">
            <div className="pr-4">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600" />
                <span className="font-bold text-rose-900 text-base">Emergency Redemption Lock</span>
              </div>
              <p className="text-xs text-rose-700 mt-1.5 leading-relaxed">
                Immediately block all voucher burns and rewards deductions system-wide. Earning stamps remains operational.
              </p>
            </div>
            <button
              onClick={() => {
                setEmergencyLock(!emergencyLock);
                showToast(`Emergency lock ${!emergencyLock ? 'ENGAGED' : 'released'}`);
              }}
              className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${emergencyLock ? 'bg-rose-600' : 'bg-gray-300'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${emergencyLock ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Security & Velocity Guards */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-lg text-[#1A1615]">Anti-Fraud & Velocity Protection</h2>
            <p className="text-xs text-[#716A62] mt-1">Prevent duplicate scans, voucher abuse, and out-of-perimeter claims.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1615] flex items-center justify-between">
                <span>Max Daily Redemptions per Customer</span>
                <span className="text-[#5844A8] font-black">{maxDailyRedemptions} per day</span>
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={maxDailyRedemptions}
                onChange={(e) => setMaxDailyRedemptions(Number(e.target.value))}
                className="w-full accent-[#5844A8] cursor-pointer"
              />
              <p className="text-[11px] text-[#716A62]">Caps how many times a single phone number can claim rewards in 24h.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1615] flex items-center justify-between">
                <span>Minimum Cooldown Between Scans</span>
                <span className="text-[#5844A8] font-black">{cooldownMinutes} minutes</span>
              </label>
              <input
                type="range"
                min="5"
                max="60"
                step="5"
                value={cooldownMinutes}
                onChange={(e) => setCooldownMinutes(Number(e.target.value))}
                className="w-full accent-[#5844A8] cursor-pointer"
              />
              <p className="text-[11px] text-[#716A62]">Rejects rapid back-to-back stamp claims from the same card.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1615]">Branch Geofence Validation</label>
              <select
                value={geofenceRadius}
                onChange={(e) => setGeofenceRadius(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] focus:outline-none focus:ring-2 focus:ring-[#5844A8]"
              >
                <option value="50m">Strict (50 meters of outlet GPS)</option>
                <option value="150m">Standard (150 meters)</option>
                <option value="500m">Relaxed (500 meters)</option>
                <option value="disabled">Disabled (All Locations)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1A1615]">Manager PIN Requirement Threshold</label>
              <select
                value={managerPinThreshold}
                onChange={(e) => setManagerPinThreshold(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-purple-200 bg-[#FAF8FF] focus:outline-none focus:ring-2 focus:ring-[#5844A8]"
              >
                <option value="$25.00">For Rewards Value &gt; $25.00</option>
                <option value="$50.00">For Rewards Value &gt; $50.00</option>
                <option value="$100.00">For Rewards Value &gt; $100.00</option>
                <option value="none">Never Require Manager PIN</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Hardware Fleet Telemetry */}
      {activeTab === 'hardware' && (
        <div className="bg-white rounded-2xl border border-purple-100 shadow-xs overflow-hidden">
          <div className="p-6 border-b border-purple-100 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-lg text-[#1A1615]">Connected Hardware & Scanners</h2>
              <p className="text-xs text-[#716A62] mt-0.5">Live heartbeat telemetry across all branch registers & beacons.</p>
            </div>
            <button
              onClick={() => showToast('Ping sent to all 5 devices')}
              className="px-3.5 py-1.5 text-xs font-bold text-[#5844A8] bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
            >
              Ping All Devices
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8FF] text-[#716A62] font-bold border-b border-purple-100 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Device</th>
                  <th className="py-3 px-5">Branch</th>
                  <th className="py-3 px-5">Model</th>
                  <th className="py-3 px-5">IP / Connection</th>
                  <th className="py-3 px-5">Latency</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-purple-50">
                {devices.map((d) => (
                  <tr key={d.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#1A1615]">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{d.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-[#524B45]">{d.branch}</td>
                    <td className="py-3.5 px-5 font-medium text-[#716A62]">{d.type}</td>
                    <td className="py-3.5 px-5 font-mono text-[11px] text-[#524B45]">{d.ip}</td>
                    <td className="py-3.5 px-5 font-mono text-emerald-600 font-bold">{d.ping}</td>
                    <td className="py-3.5 px-5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {d.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => showToast(`Device ${d.name} pinged successfully: ${d.ping}`)}
                        className="text-[#5844A8] font-bold hover:underline cursor-pointer"
                      >
                        Test Ping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Automations */}
      {activeTab === 'automation' && (
        <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-xs space-y-6">
          <div>
            <h2 className="font-bold text-lg text-[#1A1615]">System Automations & Schedules</h2>
            <p className="text-xs text-[#716A62] mt-0.5">Recurring operations, auto-settlement, and promotional triggers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="p-4 rounded-xl border border-purple-100 bg-[#FAF8FF] flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#1A1615]">Afternoon Happy Hour 2x Boost</div>
                <div className="text-[11px] text-[#716A62] mt-0.5">Auto-activates 2:00 PM – 5:00 PM, Mon–Fri</div>
              </div>
              <button
                onClick={() => {
                  setHappyHourBoost(!happyHourBoost);
                  showToast(`Happy hour boost schedule ${!happyHourBoost ? 'enabled' : 'disabled'}`);
                }}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${happyHourBoost ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${happyHourBoost ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-purple-100 bg-[#FAF8FF] flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-[#1A1615]">Midnight Auto-Settlement & Sync</div>
                <div className="text-[11px] text-[#716A62] mt-0.5">Reconcile stamps & points at 00:00 UTC</div>
              </div>
              <button
                onClick={() => {
                  setDailyAutoSettlement(!dailyAutoSettlement);
                  showToast(`Midnight settlement ${!dailyAutoSettlement ? 'enabled' : 'disabled'}`);
                }}
                className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer shrink-0 ${dailyAutoSettlement ? 'bg-[#5844A8]' : 'bg-gray-300'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform ${dailyAutoSettlement ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ControlPanelPage;

