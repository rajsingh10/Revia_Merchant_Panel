import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  Lock,
  Radio,
  Key,
  Download,
  CheckCircle2,
  Cpu,
  Search,
  SlidersHorizontal,
  RefreshCw,
  ChevronDown,
  CircleCheck,
  Activity,
  AlertTriangle,
  Clock3,
  Wifi,
  Webhook,
  Server,
  X,
  UserPlus
} from 'lucide-react';
import { AuditLogEntry } from '../types';
import { RoleTemplate, INITIAL_ROLE_TEMPLATES, SYSTEM_MODULES, TOTAL_PERMISSIONS_COUNT } from './StaffPage';
import { CustomerTypeSettings } from './CustomerTypeSettings';
import { MerchantPlatformSettings } from './MerchantPlatformSettings';
import { MerchantProfileSettings } from './MerchantProfileSettings';
import { AutomatedEventsSettings } from './AutomatedEventsSettings';

interface AuditLogPageProps {
  logs: AuditLogEntry[];
}

const MobileAuditView: React.FC<{ logs: AuditLogEntry[] }> = ({ logs }) => {
  const verifiedLogs = logs.filter((log) => log.cryptoState !== 'FLAGGED');
  const flaggedLogs = logs.filter((log) => log.cryptoState === 'FLAGGED');
  const mobileEventOverrides = [
    { name: 'Elena Vance', role: 'Admin', timestamp: '2m ago', target: 'Owner · Downtown Flagship', action: 'CRM Customer Directory Export (.csv)', ip: '1,420 Guest records encrypted' },
    { name: 'Terminal POS-01', role: 'System', timestamp: '18m ago', target: 'Automated Ledger Mesh Node', action: 'Fast Stamp Ledger Sync', ip: '+14 loyalty stamps reconciled' },
    { name: 'Security Daemon', role: 'ALERT', timestamp: '1h ago', target: 'Cloudflare WAF Ingress', action: 'Blocked unauthorized IP access attempt', ip: '198.51.100.42 (Rate-limit)' },
    { name: 'Marcus Vance', role: 'Shift Lead', timestamp: '3h ago', target: 'Roastery Reserve Register 02', action: 'PIN Authentication Override', ip: 'Session token extended 4h' },
  ];
  const visibleLogs = [verifiedLogs[0], verifiedLogs[1], flaggedLogs[0], verifiedLogs[2]]
    .filter((log): log is AuditLogEntry => Boolean(log))
    .map((log, index) => ({
      ...log,
      timestamp: mobileEventOverrides[index].timestamp,
      actor: { ...log.actor, name: mobileEventOverrides[index].name, role: mobileEventOverrides[index].role },
      target: mobileEventOverrides[index].target,
      action: mobileEventOverrides[index].action,
      ip: mobileEventOverrides[index].ip,
    }));

  return (
    <div className="min-h-screen bg-[#FBF8F4] px-5 pb-6 pt-3 text-[#211C19]">
      <div className="mx-auto w-full max-w-[430px]">

        <section className="mt-3 rounded-[13px] bg-white p-4 shadow-[0_4px_15px_rgba(60,38,20,0.04)]"><div className="flex items-center gap-2 text-[19px] font-bold"><ShieldCheck className="h-4 w-4 text-[#5844A8]" />Security &amp; Audit Log</div><div className="my-3 h-px bg-[#E9E0D7]" /><div className="grid grid-cols-[1fr_1fr_auto] items-center gap-2 text-[11px]"><span className="flex gap-1.5"><span>▤</span>Downtown<br />Flagship</span><span className="border-l border-[#E9E0D7] pl-3 text-[#756D65]">Mesh ID: REV-<br />8402</span><b className="text-[#5844A8]">99.98%<br />Uptime</b></div></section>

        <nav className="scrollbar-hide mt-5 flex gap-2 overflow-x-auto pb-1"><button type="button" className="shrink-0 rounded-[7px] bg-[#5844A8] px-3 py-2 text-[12px] font-semibold text-white shadow-sm"><ShieldCheck className="mr-1 inline h-3.5 w-3.5" />Audit Log</button><button type="button" className="shrink-0 rounded-[7px] border border-[#E1D9D0] bg-[#F3EFEA] px-3 py-2 text-[12px] font-semibold text-[#4F4842]"><Cpu className="mr-1 inline h-3.5 w-3.5" />POS Mesh Fleet</button><button type="button" className="shrink-0 rounded-[7px] border border-[#E1D9D0] bg-[#F3EFEA] px-3 py-2 text-[12px] font-semibold text-[#4F4842]"><Webhook className="mr-1 inline h-3.5 w-3.5" />API &amp; Webhooks</button></nav>

        <section className="mt-5 grid grid-cols-2 gap-3">
          {[
            { label: 'Compliance', value: 'SOC-2 Type II', detail: 'Enforced · 0 breaches', Icon: ShieldCheck, tone: 'text-[#087B55]' },
            { label: 'POS Mesh', value: '6 / 6 Online', detail: '18ms avg peer ping', Icon: Radio, tone: 'text-[#087B55]' },
            { label: 'API Volume', value: '48,219', detail: '0 failed HMAC sigs', Icon: Activity, tone: 'text-[#087B55]' },
            { label: 'Crypto Ledger', value: '142 Events', detail: 'SHA-256 Validated', Icon: Key, tone: 'text-[#5844A8]' },
          ].map(({ label, value, detail, Icon, tone }) => <div key={label} className="h-[116px] rounded-xl border border-[#EAE6E1] bg-white p-3 shadow-2xs"><div className="flex items-center justify-between text-[10px] font-medium text-[#7C746C]"><span>{label}</span><span className="rounded-[7px] bg-[#FCF1DF] p-1.5"><Icon className={`h-4 w-4 ${tone}`} /></span></div><div className="mt-2 text-xl font-bold leading-none tracking-tight">{value}</div><div className={`mt-2 text-[10px] font-medium leading-tight ${tone}`}>{label === 'Compliance' && '◉ '}{label === 'POS Mesh' && '• '}{detail}</div></div>)}
        </section>

        <div className="mt-5 flex min-h-[62px] items-center gap-2 rounded-xl bg-[#211C19] px-4 py-3 font-mono text-[10px] text-[#B6AFA8]"><span className="h-2 w-2 shrink-0 rounded-full bg-[#20C99A]" /><span className="shrink-0">WITNESS BLOCK #892,104:</span><b className="min-w-0 truncate text-[#20C99A]">sha:7b91e...4f9c</b><span className="ml-auto shrink-0 rounded border border-[#6D5730] px-1.5 py-1 text-[8px] text-[#C99B42]">SEALED</span></div>

        <section className="mt-5 rounded-xl border border-[#EAE6E1] bg-white p-4 shadow-2xs"><div className="flex items-start justify-between"><h2 className="flex items-start gap-2 text-[19px] font-bold leading-none"><Cpu className="mt-1 h-4 w-4 shrink-0 text-[#5844A8]" /><span>Active Hardware<br />Mesh</span></h2><span className="rounded-full bg-[#F2EEE9] px-3 py-1 text-[11px] leading-tight text-[#756D65]">Auto-Ping<br />30s</span></div><div className="mt-4 space-y-2"><div className="flex min-h-[94px] items-center gap-3 rounded-[10px] bg-[#F3EFEA] p-3"><span className="rounded-[7px] bg-white p-2 text-[#5844A8]"><Cpu className="h-4 w-4" /></span><div className="min-w-0 flex-1 text-[12px]"><b className="block whitespace-nowrap">Downtown Counter 01</b><div className="text-[10px] leading-relaxed text-[#756D65]">RevOS v4.2.1 ·<br />192.168.1.104</div></div><span className="shrink-0 text-right text-[10px] text-[#087B55]">• Online<br /><span className="text-[#756D65]">12ms latency</span></span></div><div className="flex min-h-[94px] items-center gap-3 rounded-[10px] bg-[#F3EFEA] p-3"><span className="rounded-[7px] bg-white p-2 text-[#5844A8]"><Server className="h-4 w-4" /></span><div className="min-w-0 flex-1 text-[12px]"><b className="block whitespace-nowrap">Roastery Reserve Bar 02</b><div className="text-[10px] leading-relaxed text-[#756D65]">RevOS v4.2.0 ·<br />192.168.2.88</div></div><span className="shrink-0 text-right text-[10px] text-[#087B55]">• Online<br /><span className="text-[#756D65]">18ms latency</span></span></div></div><button type="button" className="mt-3 w-full rounded-lg border border-[#E1D9D0] bg-[#F3EFEA] px-4 py-2 text-[13px] font-bold"><Radio className="mr-1 inline w-4 h-4 text-[#5844A8]" />Ping All 6 Terminals</button></section>

        <section className="mt-6"><div className="flex items-center justify-between"><div><h2 className="text-[19px] font-bold">Audit Event Stream</h2><span className="rounded-full bg-[#FFF4DC] px-2 py-1 text-[10px] font-bold text-[#5844A8]">Live SHA-256</span></div><button type="button" aria-label="Filter audit events" className="rounded-[7px] bg-white p-2 shadow-sm"><SlidersHorizontal className="h-4 w-4" /></button></div><label className="mt-3 flex items-center gap-2 rounded-[10px] border border-[#E1D9D0] bg-white px-3 py-2 text-[11px] text-[#8E847B]"><Search className="h-4 w-4" /><input className="min-w-0 flex-1 bg-transparent outline-none" placeholder="Filter by operator, IP, or hash key..." /></label><div className="mt-3 space-y-3">{visibleLogs.map((log) => { const flagged = log.cryptoState === 'FLAGGED'; const EventIcon = flagged ? AlertTriangle : log.actor.role === 'Admin' ? Download : log.actor.role === 'System' ? RefreshCw : Key; return <article key={log.id} className={`rounded-[12px] border bg-white p-4 shadow-[0_4px_15px_rgba(60,38,20,0.04)] ${flagged ? 'border-[#FFB6B0] bg-[#FFF8F7]' : 'border-[#E9E0D7]'}`}><div className="flex items-start gap-2"><span className={`rounded-[7px] p-2 ${flagged ? 'bg-[#FFE3E1] text-[#C2413A]' : log.actor.role === 'System' ? 'bg-[#E5F8F0] text-[#0D8B61]' : 'bg-[#FCF1DF] text-[#5844A8]'}`}><EventIcon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className={`text-[12px] font-semibold ${flagged ? 'text-[#C2413A]' : ''}`}>{log.actor.name} <span className="ml-1 rounded bg-[#F2EEE9] px-1.5 py-1 text-[9px] text-[#756D65]">{log.actor.role}</span></div><div className="text-[10px] text-[#756D65]">{log.target}</div></div><span className="text-[10px] text-[#756D65]">{log.timestamp}</span></div><div className={`mt-3 rounded-[8px] p-3 text-[12px] ${flagged ? 'border border-[#FFB6B0] bg-white text-[#C2413A]' : 'bg-[#F3EFEA]'}`}><b>{flagged ? 'Blocked unauthorized IP access attempt' : log.action.replaceAll('_', ' ')}</b><div className="mt-1 text-[10px] text-[#756D65]">{flagged ? log.ip : 'Cryptographic witness verified · hash sealed'}</div></div></article>; })}</div></section>

        <button type="button" className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#7C3AED] to-[#5844A8] px-4 py-2 text-[13px] font-bold text-white shadow-[0_5px_12px_rgba(158,120,47,0.2)]"><Download className="w-4 h-4" />Export Immutable Audit Dossier (CSV/PDF)</button><button type="button" className="mt-3 w-full rounded-lg border border-[#E1D9D0] bg-white px-4 py-2 text-[13px] font-bold"><Lock className="w-4 h-4 mr-1 inline" />Commit &amp; Seal New Policy Hash</button>
      </div>
    </div>
  );
};

const AccessControlSettings: React.FC = () => {
  const [reviewingPolicies, setReviewingPolicies] = useState(false);

  // Role Builder State
  const [roleTemplates, setRoleTemplates] = useState<RoleTemplate[]>(INITIAL_ROLE_TEMPLATES);
  const [editingRole, setEditingRole] = useState<RoleTemplate | null>(null);
  const [isRoleBuilderOpen, setIsRoleBuilderOpen] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  const identities = [
    { name: 'Elena Rostova', role: 'General Manager', email: 'elena@revia.co', scopes: 'store:owner', status: 'Active' },
    { name: 'Marcus Davis', role: 'Operations Lead', email: 'ops@revia.co', scopes: 'store:operations', status: 'Active' },
    { name: 'Avery Chen', role: 'Finance Reviewer', email: 'finance@revia.co', scopes: 'billing:read', status: 'Pending' },
  ];

  const handleReviewPolicies = () => {
    setIsRoleBuilderOpen(true);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] bg-[#FAF8FF] px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#B7842C]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A1615]">Access Control</span>
          </div>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#1A1615]">Identity & Permission Matrix</h2>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingRole({ id: '', name: '', isSystem: false, permissions: {} });
            setIsRoleBuilderOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#6E6A66] hover:bg-[#FAF5FF] cursor-pointer"
        >
          <UserPlus className="w-4 h-4 text-[#B7842C]" /> Create Custom Role
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8 min-w-0">
          <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8FF] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#B7842C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6E6A66]">Role-Based Access Policy</span>
              </div>
              <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">3 ACTIVE</span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-lg border border-[#E5E0D8] bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#E5E0D8] bg-[#FAF8FF] text-[10px] uppercase font-bold tracking-wider text-[#6E6A66]">
                  <th className="py-2.5 px-3">SYSTEM PERMISSION CAPABILITY</th>
                  {roleTemplates.map(role => (
                    <th key={role.id} className="py-2.5 px-3 text-center">{role.name.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E0D8] text-xs">
                {SYSTEM_MODULES.map((mod, modIdx) => (
                  <tr key={modIdx} className="hover:bg-[#FAF5FF] transition-colors">
                    <td className="py-3 px-3 text-[#1A1615] font-bold uppercase tracking-wider text-[11px]">{mod.name}</td>
                    {roleTemplates.map(role => {
                      const activeActions = mod.actions.filter(action => role.permissions[`${mod.name}_${action}`]);

                      return (
                        <td key={role.id} className="py-3 px-3">
                          <div className="flex flex-nowrap items-center justify-center gap-1">
                            {mod.actions.map(action => {
                              const hasPermission = role.permissions[`${mod.name}_${action}`];
                              return (
                                <span key={action} className={`px-1 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider whitespace-nowrap border ${
                                  hasPermission 
                                    ? 'bg-[#EBF7F0] text-[#0D7A53] border-[#0D7A53]/20' 
                                    : 'bg-transparent text-[#9E9A93] border-[#E5E0D8] opacity-60'
                                }`}>
                                  {action}
                                </span>
                              );
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="rounded-lg border border-[#E5E0D8] bg-[#FCFBF9] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#B7842C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1A1615]">Access Session Review</span>
              </div>
              <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">Last 24h</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#9E9A93]">Logins</div>
                <div className="mt-1 text-[13px] font-bold text-[#1A1615]">128</div>
              </div>
              <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#9E9A93]">Invites</div>
                <div className="mt-1 text-[13px] font-bold text-[#1A1615]">04</div>
              </div>
              <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
                <div className="text-[9px] font-bold uppercase tracking-[0.04em] text-[#9E9A93]">Flags</div>
                <div className="mt-1 text-[13px] font-bold text-[#1A1615]">00</div>
              </div>
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#E5E0D8] bg-[#FCFBF9] p-4 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-[#B7842C]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1A1615]">Policy Controls</span>
            </div>
            <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">SOC-2</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-md border border-[#E5E0D8] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1A1615]">Manager 2FA</span>
                <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">ENABLED</span>
              </div>
            </div>
            <div className="rounded-md border border-[#E5E0D8] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1A1615]">IP Restriction</span>
                <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">ON</span>
              </div>
            </div>
            <div className="rounded-md border border-[#E5E0D8] bg-white p-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-[#1A1615]">Session Timeout</span>
                <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">15m</span>
              </div>
            </div>
          </div>
          <button type="button" onClick={handleReviewPolicies} className="mt-4 w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1A1615] cursor-pointer">
            Review Access Policies
          </button>
        </aside>
      </div>

      {/* Role Builder Modal */}
      {isRoleBuilderOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-2xs animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EAE6E1] p-5 w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE6E1]">
              <div>
                <h3 className="text-base font-bold text-[#1A1615]">
                  {editingRole ? (editingRole.id ? 'Edit Role Template' : 'Create Custom Role') : 'Role Templates & Capabilities'}
                </h3>
                <p className="text-xs text-[#7C746C]">
                  {editingRole ? 'Configure permissions for this specific role tier' : 'Manage permission policies for all store roles'}
                </p>
              </div>
              <button
                onClick={() => {
                  setIsRoleBuilderOpen(false);
                  setEditingRole(null);
                }}
                className="text-[#8C827A] hover:text-[#1A1615] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {editingRole ? (
              /* Role Editor Form */
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="text-[11px] font-semibold text-[#7C746C] block mb-1">
                    Role Name
                  </label>
                  <input
                    type="text"
                    value={editingRole.name}
                    disabled={editingRole.isSystem}
                    onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#FAF8FF] border border-[#EAE6E1] rounded-lg text-[#1A1615] focus:outline-none focus:border-[#5844A8] disabled:opacity-50"
                    placeholder="e.g., Shift Supervisor"
                  />
                  {editingRole.isSystem && (
                    <p className="text-[10px] text-[#A37837] mt-1">System role names cannot be changed.</p>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="text-[11px] font-semibold text-[#7C746C] uppercase tracking-wider">System Permissions</h4>
                  {SYSTEM_MODULES.map(module => (
                    <div key={module.name} className="border border-[#EAE6E1] rounded-xl overflow-hidden bg-white">
                      <div className="bg-[#FAF8FF] px-3 py-2 text-xs font-bold text-[#1A1615] border-b border-[#EAE6E1]">
                        {module.name}
                      </div>
                      <div className="p-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {module.actions.map(action => {
                          const cap = `${module.name}_${action}`;
                          return (
                            <label key={cap} className="flex items-center gap-2 cursor-pointer group">
                              <input
                                type="checkbox"
                                checked={!!editingRole.permissions[cap]}
                                onChange={(e) => setEditingRole({
                                  ...editingRole,
                                  permissions: { ...editingRole.permissions, [cap]: e.target.checked }
                                })}
                                className="w-4 h-4 rounded border-[#D1C9BE] text-[#5844A8] focus:ring-[#5844A8] group-hover:border-[#5844A8] transition-colors"
                              />
                              <span className="text-[11px] font-medium text-[#3D3732] group-hover:text-[#1A1615]">{action}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EAE6E1]">
                  <button
                    type="button"
                    onClick={() => setEditingRole(null)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#7C746C] hover:bg-[#FAF5FF] rounded-lg cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!editingRole.name.trim()) {
                        showToast('Role name is required.');
                        return;
                      }

                      let updatedTemplates;
                      if (editingRole.id) {
                        updatedTemplates = roleTemplates.map(rt => rt.id === editingRole.id ? editingRole : rt);
                      } else {
                        const newRole = { ...editingRole, id: `role-${Date.now()}` };
                        updatedTemplates = [...roleTemplates, newRole];
                      }

                      setRoleTemplates(updatedTemplates);
                      setEditingRole(null);
                      showToast(`Role template "${editingRole.name}" saved successfully.`);
                    }}
                    className="px-4 py-2 text-[13px] font-bold bg-[#5844A8] text-white rounded-lg hover:bg-[#47368E] cursor-pointer transition-colors shadow-sm"
                  >
                    Save Role
                  </button>
                </div>
              </div>
            ) : (
              /* Role Templates List */
              <div className="space-y-3">
                <div className="max-h-96 overflow-y-auto pr-1 space-y-2">
                  {roleTemplates.map((tmpl) => (
                    <div key={tmpl.id} className="p-3 rounded-xl border border-[#EAE6E1] bg-[#FAF8FF] flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#1A1615] text-xs">{tmpl.name}</span>
                          {tmpl.isSystem && (
                            <span className="text-[9px] text-[#15803D] bg-[#EBF7F0] px-1.5 py-0.5 rounded font-semibold uppercase">System</span>
                          )}
                        </div>
                        <p className="text-[10px] text-[#7C746C] mt-1">
                          {Object.values(tmpl.permissions).filter(Boolean).length} of {TOTAL_PERMISSIONS_COUNT} permissions enabled
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setEditingRole({ ...tmpl })}
                          className="px-2.5 py-1.5 bg-white border border-[#EAE6E1] rounded text-[11px] font-semibold text-[#1A1615] hover:bg-[#F5F2EC] transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        {!tmpl.isSystem && (
                          <button
                            onClick={() => {
                              setRoleTemplates(roleTemplates.filter(rt => rt.id !== tmpl.id));
                              showToast(`Role "${tmpl.name}" deleted.`);
                            }}
                            className="px-2.5 py-1.5 bg-white border border-[#F2D6D3] rounded text-[11px] font-semibold text-[#DC2626] hover:bg-[#FEE2E2] transition-colors cursor-pointer"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#EAE6E1]">
                  <button
                    type="button"
                    onClick={() => setEditingRole({ id: '', name: '', isSystem: false, permissions: {} })}
                    className="px-4 py-2 text-[12px] font-bold text-[#A37837] hover:bg-[#FAF5FF] rounded-lg cursor-pointer flex items-center gap-1"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Create Custom Role</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsRoleBuilderOpen(false)}
                    className="px-4 py-2 text-[13px] font-semibold text-[#1A1615] bg-[#EAE6E1] hover:bg-[#D1C9BE] rounded-lg cursor-pointer transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {feedbackToast && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm shadow-xl z-50 animate-in fade-in slide-in-from-bottom-4">
          {feedbackToast}
        </div>
      )}
    </div>
  );
};

const ApiKeysWebhooksSettings: React.FC = () => {
  const [generatingSecret, setGeneratingSecret] = useState(false);
  const [rotatingSigningSecret, setRotatingSigningSecret] = useState(false);

  const handleGenerateApiSecret = () => {
    setGeneratingSecret(true);
    window.setTimeout(() => setGeneratingSecret(false), 700);
  };

  const handleRotateSigningSecret = () => {
    setRotatingSigningSecret(true);
    window.setTimeout(() => setRotatingSigningSecret(false), 700);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-[#E5E0D8] bg-[#FAF8FF] px-3 sm:px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Webhook className="h-4 w-4 text-[#B7842C]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A1615]">API Keys & Webhooks</span>
          </div>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#1A1615]">API Access & Integration</h2>
        </div>
        <button type="button" onClick={handleGenerateApiSecret} className="inline-flex w-full sm:w-auto justify-center items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#6E6A66] cursor-pointer">
          <Key className="w-4 h-4 text-[#B7842C]" /> {generatingSecret ? 'Generating...' : 'Generate API Secret'}
        </button>
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-7">
          <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8FF] p-3">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-[#B7842C]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6E6A66]">Credential Registry</span>
            </div>
          </div>
          <div className="rounded-lg border border-[#E5E0D8] bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#1A1615] truncate">Shopify POS Sync</div>
                <div className="text-[10px] text-[#6E6A66] truncate">Production key · Last rotated 2 days ago</div>
              </div>
              <span className="shrink-0 rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">ACTIVE</span>
            </div>
            <div className="mt-3 rounded-md border border-[#E5E0D8] bg-[#FAF8FF] px-3 py-2 font-mono text-[10px] text-[#6E6A66] break-all">
              rev_live_994a••••••••••••
            </div>
          </div>
          <div className="rounded-lg border border-[#E5E0D8] bg-white p-3 sm:p-4">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-[#1A1615] truncate">Wallet Push Endpoint</div>
                <div className="text-[10px] text-[#6E6A66] truncate">Apple & Google Wallet webhook</div>
              </div>
              <span className="shrink-0 rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">99.98%</span>
            </div>
            <div className="mt-3 rounded-md border border-[#E5E0D8] bg-[#FAF8FF] px-3 py-2 font-mono text-[10px] text-[#6E6A66] break-all">
              https://revia.example.com/webhooks/wallet/push
            </div>
          </div>
        </div>

        <aside className="rounded-lg border border-[#E5E0D8] bg-[#FCFBF9] p-3 sm:p-4 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
            <div className="flex items-center gap-2">
              <Webhook className="h-4 w-4 text-[#B7842C]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1A1615]">Webhook Events</span>
            </div>
            <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">3 ACTIVE</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between rounded-md border border-[#E5E0D8] bg-white px-3 py-2">
              <span className="text-[10px] font-bold text-[#1A1615]">reward.redemption</span>
              <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">OK</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[#E5E0D8] bg-white px-3 py-2">
              <span className="text-[10px] font-bold text-[#1A1615]">customer.exported</span>
              <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">OK</span>
            </div>
            <div className="flex items-center justify-between rounded-md border border-[#E5E0D8] bg-white px-3 py-2">
              <span className="text-[10px] font-bold text-[#1A1615]">audit.sealed</span>
              <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">IDLE</span>
            </div>
          </div>
          <button type="button" onClick={handleRotateSigningSecret} className="mt-4 w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1A1615] cursor-pointer">
            {rotatingSigningSecret ? 'Rotating...' : 'Rotate Signing Secret'}
          </button>
        </aside>
      </div>
    </div>
  );
};

const PosHardwareSettings: React.FC = () => {
  const [syncingMesh, setSyncingMesh] = useState(false);
  const [policyReviewing, setPolicyReviewing] = useState(false);

  const hardwareNodes = [
    { name: 'Downtown Counter 01', type: 'iPad Pro 12.9" · Revia Hub', status: 'Online', latency: '4ms', percent: '99.98%' },
    { name: 'Roastery Bar 02', type: 'Square Register · Revia Bridge', status: 'Online', latency: '12ms', percent: '99.96%' },
    { name: 'Northside Pop-up 01', type: 'Mobile Handheld NFC', status: 'Standby', latency: '21ms', percent: '96.70%' },
  ];

  const handleSyncHardwareMesh = () => {
    setSyncingMesh(true);
    window.setTimeout(() => setSyncingMesh(false), 700);
  };

  const handleReviewHardwarePolicy = () => {
    setPolicyReviewing(true);
    window.setTimeout(() => setPolicyReviewing(false), 700);
  };

  return (
    <div className="mt-4 overflow-hidden rounded-xl border border-[#E5E0D8] bg-white shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] bg-[#FAF8FF] px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4 text-[#B7842C]" />
            <span className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#1A1615]">POS & Hardware</span>
          </div>
          <h2 className="mt-1 text-[22px] font-bold tracking-tight text-[#1A1615]">POS Hardware Fleet</h2>
        </div>
        {/* <button type="button" onClick={handleSyncHardwareMesh} className="inline-flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-white px-3 py-1.5 text-[10px] font-bold text-[#6E6A66]">
          <Radio className="h-3.5 w-3.5 text-[#B7842C]" /> {syncingMesh ? 'Syncing...' : 'Sync Hardware Mesh'}
        </button> */}
      </div>

      <div className="grid gap-4 p-4 lg:grid-cols-12">
        <div className="space-y-3 lg:col-span-8">
          <div className="rounded-lg border border-[#E5E0D8] bg-[#FAF8FF] p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-[#B7842C]" />
                <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#6E6A66]">Active Terminal Inventory</span>
              </div>
              <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">6 / 6 ONLINE</span>
            </div>
          </div>
          {hardwareNodes.map((node, idx) => (
            <div key={node.name} className="flex items-center justify-between rounded-lg border border-[#E5E0D8] bg-white p-3">
              <div className="flex items-center gap-3">
                <span className="rounded-lg bg-[#FAF5FF] p-2 text-[#B7842C]"><Server className="h-4 w-4" /></span>
                <div>
                  <div className="text-[12px] font-bold text-[#1A1615]">{node.name}</div>
                  <div className="text-[10px] text-[#6E6A66]">{node.type}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-bold">
                <span className={node.status === 'Standby' ? 'text-[#B7842C]' : 'text-[#0D7A53]'}>{node.status}</span>
                <span className="text-[#6E6A66]">{node.latency}</span>
                <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[#6E6A66]">{node.percent}</span>
              </div>
            </div>
          ))}
        </div>

        <aside className="rounded-lg border border-[#E5E0D8] bg-[#FCFBF9] p-4 lg:col-span-4">
          <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-[#B7842C]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#1A1615]">Mesh Network</span>
            </div>
            <span className="rounded-full bg-[#FAF5FF] px-2 py-1 text-[8px] font-bold text-[#6E6A66]">Auto-Ping 30s</span>
          </div>
          <div className="mt-3 space-y-2">
            <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
              <div className="mb-1 text-[10px] font-bold text-[#6E6A66]">Downtown Flagship</div>
              <div className="h-2 rounded bg-[#E5E0D8]">
                <div className="h-2 w-[98%] rounded bg-[#0D7A53]" />
              </div>
            </div>
            <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
              <div className="mb-1 text-[10px] font-bold text-[#6E6A66]">Roastery Reserve</div>
              <div className="h-2 rounded bg-[#E5E0D8]">
                <div className="h-2 w-[90%] rounded bg-[#B7842C]" />
              </div>
            </div>
            <div className="rounded-md border border-[#E5E0D8] bg-white p-2">
              <div className="mb-1 text-[10px] font-bold text-[#6E6A66]">Northside Market</div>
              <div className="h-2 rounded bg-[#E5E0D8]">
                <div className="h-2 w-[78%] rounded bg-[#C08B31]" />
              </div>
            </div>
          </div>
          <button type="button" onClick={handleReviewHardwarePolicy} className="cursor-pointer mt-4 w-full rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1A1615]">
            {policyReviewing ? 'Reviewing...' : 'Review Hardware Policy'}
          </button>
        </aside>
      </div>
    </div>
  );
};

export const AuditLogPage: React.FC<AuditLogPageProps> = ({ logs }) => {
  const [selectedHash, setSelectedHash] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'merchant_profile' | 'audit' | 'customer_tiers' | 'general_brand' | 'access_control' | 'automated_events'>('merchant_profile');

  // Security Policy Toggles
  const [enforceMfa, setEnforceMfa] = useState<boolean>(true);
  const [autoSessionTimeout, setAutoSessionTimeout] = useState<boolean>(true);
  const [enforceFleetTls, setEnforceFleetTls] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [eventType, setEventType] = useState<string>('All Event Types');
  const [branchFilter, setBranchFilter] = useState<string>('All Branches');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [eventTypeDropdownOpen, setEventTypeDropdownOpen] = useState(false);
  const [branchFilterDropdownOpen, setBranchFilterDropdownOpen] = useState(false);
  const eventTypeDropdownRef = useRef<HTMLDivElement>(null);
  const branchFilterDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (eventTypeDropdownRef.current && !eventTypeDropdownRef.current.contains(event.target as Node)) {
        setEventTypeDropdownOpen(false);
      }
      if (branchFilterDropdownRef.current && !branchFilterDropdownRef.current.contains(event.target as Node)) {
        setBranchFilterDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  const eventTypes = Array.from(new Set(logs.map((log) => log.action))).sort();
  const branchOptions = ['All Branches', 'Downtown', 'Roastery', 'Northside'];
  const filteredLogs = logs.filter((log) => {
    const searchText = `${log.actor.name} ${log.actor.role} ${log.action} ${log.target} ${log.terminal} ${log.ip} ${log.hash}`.toLowerCase();
    const matchesSearch = searchText.includes(searchQuery.toLowerCase().trim());
    const matchesType = eventType === 'All Event Types' || log.action === eventType;
    const matchesBranch = branchFilter === 'All Branches' || searchText.includes(branchFilter.toLowerCase());
    return matchesSearch && matchesType && matchesBranch;
  });
  const flaggedLogs = filteredLogs.filter((log) => log.cryptoState === 'FLAGGED');
  const regularLogs = filteredLogs.filter((log) => log.cryptoState !== 'FLAGGED');
  const referenceLogs = regularLogs.filter((log) =>
    log.action === 'POS_HEARTBEAT_RECONNECT' || log.action === 'CUSTOMER_EXPORT_REQUESTED'
  );
  const remainingLogs = regularLogs.filter((log) => !referenceLogs.includes(log));
  const orderedLogs = [
    ...remainingLogs.slice(0, 2),
    ...flaggedLogs,
    ...referenceLogs,
    ...remainingLogs.slice(2),
  ];
  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(orderedLogs.length / pageSize));
  const paginatedLogs = orderedLogs.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const successLogId = orderedLogs[1]?.id;
  const firstVisibleEntry = orderedLogs.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const lastVisibleEntry = Math.min(currentPage * pageSize, orderedLogs.length);

  const goToPage = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
    setSelectedHash(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setEventType('All Event Types');
    setBranchFilter('All Branches');
    setCurrentPage(1);
  };

  const refreshLogs = () => {
    setRefreshing(true);
    setCurrentPage(1);
    window.setTimeout(() => setRefreshing(false), 900);
  };

  const exportAuditDossier = () => {
    const rows = [
      ['Timestamp EST', 'Actor', 'Role', 'Action', 'Target', 'Terminal', 'IP', 'Hash', 'Crypto State'],
      ...logs.map((log) => [
        log.timestamp,
        log.actor.name,
        log.actor.role,
        log.action,
        log.target,
        log.terminal,
        log.ip,
        log.hash,
        log.cryptoState,
      ]),
    ];

    const csv = rows
      .map((row) => row.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(','))
      .join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'revia-audit-immutable-dossier.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div className="space-y-3 p-2 sm:py-4 sm:pl-4 sm:pr-1">
        {/*
      <div className="flex items-center justify-between gap-2 px-1 text-[8px] font-bold uppercase tracking-[0.1em] text-[#9E9A93]">
        <div className="flex min-w-0 items-center gap-2 truncate">
          <span>Home</span>
          <span>/</span>
          <span>Insights & Config</span>
          <span>/</span>
          <span className="text-[#1A1615]">Settings & Security Audit</span>
        </div>
        <div className="hidden shrink-0 items-center gap-2 rounded-full border border-[#E5E0D8] bg-white px-2.5 py-1 text-[8px] normal-case tracking-normal text-[#6E6A66] sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-[#0D7A53]" />
          SOC-2 SHA-256 Ledger Synchronized
          <span className="rounded bg-[#FAF5FF] px-1.5 py-0.5 font-mono text-[#9E9A93]">Block #392,104</span>
        </div>
      </div>
      */}

        {/* Settings header and section navigation */}
        <header className="rounded-xl bg-[#FCFBF9] px-2 pt-2 sm:px-3 sm:pt-2.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-[#E6D4A8] bg-[#FFF8E8] px-2 py-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-[#5844A8]">
                    Governance & Zero-Trust
                  </span>
                  <span className="text-[8px] text-[#A09A91]">• Revision v2.14r4</span>
                </div> */}
              <h1 className="mt-0.5 text-2xl sm:text-[28px] font-bold tracking-tight text-[#1A1615]">
                Merchant Settings
              </h1>
            </div>

            <button
              onClick={exportAuditDossier}
              className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#1A1615] shadow-2xs transition-colors hover:bg-[#FAF5FF] focus:outline-none focus:ring-2 focus:ring-[#5844A8]/40"
            >
              <Download className="w-4 h-4 text-[#5844A8]" />
              Export Immutable Dossier (CSV/PDF)
            </button>
          </div>

          <nav aria-label="Settings sections" className="-mx-1 mt-[17px] overflow-x-auto rounded-lg border border-[#E5E0D8] bg-white p-1 sm:-mx-2">
            <div className="flex min-w-full items-center gap-0.5">
              <button
                onClick={() => setActiveTab('merchant_profile')}
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'merchant_profile' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
              >
                Merchant Profile
              </button>
              <button
                onClick={() => setActiveTab('general_brand')}
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'general_brand' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
              >
                General & Brand
              </button>
              {/* <button
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'pos_hardware' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
                onClick={() => setActiveTab('pos_hardware')}
              >
                POS & Hardware
              </button>
              <button
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'api_keys_webhooks' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
                onClick={() => setActiveTab('api_keys_webhooks')}
              >
                API Keys & Webhooks
              </button> */}
              {/* <button
                onClick={() => setActiveTab('audit')}
                className={`cursor-pointer min-w-max flex-1 rounded-md px-3 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'audit' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
              >
                Security & SOC-2 Audit Stream
              </button> */}
              <button
                onClick={() => setActiveTab('customer_tiers')}
                className={`cursor-pointer min-w-max flex-1 rounded-md px-3 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'customer_tiers' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
              >
                Customer Tiers
              </button>
              <button
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'access_control' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
                onClick={() => setActiveTab('access_control')}
              >
                Access Control
              </button>
              <button
                className={`cursor-pointer min-w-max flex-1 rounded-md px-2.5 py-1.5 text-[11px] sm:text-[11px] ${activeTab === 'automated_events' ? 'bg-[#5844A8] font-bold text-white shadow-sm' : 'font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]'}`}
                type="button"
                onClick={() => setActiveTab('automated_events')}
              >
                Automated Events
              </button>
            </div>
          </nav>
        </header>

        {activeTab === 'access_control' ? (
          <AccessControlSettings />
        ) : activeTab === 'automated_events' ? (
          <AutomatedEventsSettings />
          // ) : activeTab === 'api_keys_webhooks' ? (
          //   <ApiKeysWebhooksSettings />
          // ) : activeTab === 'pos_hardware' ? (
          //   <PosHardwareSettings />
        ) : activeTab === 'audit' ? (
          <>
            {/* Governance summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mt-4">
              <div className="bg-white rounded-xl border border-[#EAE6E1] p-5 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-[#0D7A53]" /> Compliance Posture</div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6F4ED] text-[#0D7A53] rounded">
                    Enforced
                  </span>
                </div>
                <div className="text-[26px] font-bold text-[#1A1615] mb-1">SOC-2 Type II</div>
                <div className="text-[11px] font-semibold text-[#6E6A66]">Audit compliance sealed & certified valid</div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0D7A53]"><CircleCheck className="h-3.5 w-3.5" /> Zero policy breaches (365 days)</div>
              </div>

              <div className="bg-white rounded-xl border border-[#EAE6E1] p-5 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] flex items-center gap-1"><Radio className="h-3.5 w-3.5 text-[#0D7A53] animate-pulse" /> Connected Terminals</div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF5FF] text-[#5844A8] rounded">
                    All Online
                  </span>
                </div>
                <div className="text-[26px] font-bold text-[#1A1615] mb-1">6 / 6 <span className="text-[14px] font-medium text-[#6E6A66]">Terminals</span></div>
                <div className="text-[11px] font-semibold text-[#6E6A66]">Downtown • Roastery • Northside</div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0D7A53]"><Activity className="h-3.5 w-3.5" /> 100% Mesh Health</div>
              </div>

              <div className="bg-white rounded-xl border border-[#EAE6E1] p-5 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-[#5844A8]" /> Audit Events (24h)</div>
                </div>
                <div className="text-[26px] font-bold text-[#1A1615] mb-1">48,219</div>
                <div className="text-[11px] font-semibold text-[#6E6A66]">Configuration and access events recorded</div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#0D7A53]"><CircleCheck className="h-3.5 w-3.5" /> 0 failed auth signatures</div>
              </div>

              <div className="bg-white rounded-xl border border-[#EAE6E1] p-5 shadow-2xs transition-shadow hover:shadow-md">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[#9E9A93] flex items-center gap-1"><Lock className="h-3.5 w-3.5 text-[#5844A8]" /> Cryptographic Ledger</div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF5FF] text-[#5844A8] rounded">
                    SHA-256
                  </span>
                </div>
                <div className="text-[26px] font-bold text-[#1A1615] mb-1">142 Events</div>
                <div className="text-[11px] font-semibold text-[#6E6A66]">Stream rate: ~12.4 actions / hr</div>
                <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-[#5844A8]"><Lock className="h-3.5 w-3.5" /> Immutable Block State Valid</div>
              </div>
            </div>

            {/* Main Grid: Immutable Audit Trail Table (Left 8 cols) + Right Security Policy Sidebar (4 cols) */}
            <div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
              {/* Immutable Audit Trail Table */}
              <div className="lg:col-span-8 overflow-hidden rounded-lg border border-[#E5E0D8] bg-white shadow-xs">
                <div className="border-b border-[#E5E0D8] bg-[#FAF8FF]/60 p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3.5 w-3.5 text-[#B7842C]" />
                        <h3 className="text-[13px] font-bold text-[#1A1615]">Immutable Audit Trail</h3>
                      </div>
                      <p className="mt-1 max-w-[430px] text-[10px] leading-snug text-[#9E9A93]">
                        Cryptographically chained ledger recording all store administration,<br className="hidden sm:block" /> loyalty redemptions, and hardware handshakes.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={clearFilters} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#6E6A66] hover:bg-[#FAF5FF] cursor-pointer"><SlidersHorizontal className="w-4 h-4" /> Clear Filters</button>
                      <button type="button" onClick={refreshLogs} className="inline-flex items-center gap-2 rounded-lg border border-[#E5E0D8] bg-white px-4 py-2 text-[13px] font-bold text-[#6E6A66] hover:bg-[#FAF5FF] cursor-pointer"><RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> {refreshing ? 'Refreshing...' : 'Live Refresh'}</button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-[minmax(0,1.7fr)_1fr_1fr_auto]">
                    <label className="flex items-center gap-1.5 rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-[9px] text-[#9E9A93]">
                      <Search className="h-3 w-3 shrink-0" />
                      <input aria-label="Filter audit log" value={searchQuery} onChange={(event) => { setSearchQuery(event.target.value); setCurrentPage(1); }} placeholder="Filter by actor, IP, hash, or action" className="min-w-0 flex-1 bg-transparent text-[10px] text-[#1A1615] outline-none placeholder:text-[#B8B1A7]" />
                    </label>
                    <div ref={eventTypeDropdownRef} className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setEventTypeDropdownOpen(!eventTypeDropdownOpen)}
                        className="w-full flex items-center justify-between rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#1A1615] cursor-pointer"
                      >
                        <span className="truncate">{eventType === 'All Event Types' ? 'All Event Types' : eventType.replaceAll('_', ' ')}</span>
                        <ChevronDown className={`ml-2 h-3 w-3 shrink-0 text-[#9E9A93] transition-transform ${eventTypeDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {eventTypeDropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-[200px] sm:w-full overflow-auto rounded-md border border-[#E5E0D8] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                          <button
                            type="button"
                            onClick={() => { setEventType('All Event Types'); setCurrentPage(1); setEventTypeDropdownOpen(false); }}
                            className={`w-full cursor-pointer px-3 py-1.5 text-left text-[11px] hover:bg-[#FAF5FF] ${eventType === 'All Event Types' ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                          >
                            All Event Types
                          </button>
                          {eventTypes.map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => { setEventType(type); setCurrentPage(1); setEventTypeDropdownOpen(false); }}
                              className={`w-full cursor-pointer px-3 py-1.5 text-left text-[11px] hover:bg-[#FAF5FF] ${eventType === type ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                            >
                              {type.replaceAll('_', ' ')}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div ref={branchFilterDropdownRef} className="relative w-full">
                      <button
                        type="button"
                        onClick={() => setBranchFilterDropdownOpen(!branchFilterDropdownOpen)}
                        className="w-full flex items-center justify-between rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-left text-[11px] font-semibold text-[#1A1615] cursor-pointer"
                      >
                        <span className="truncate">{branchFilter}</span>
                        <ChevronDown className={`ml-2 h-3 w-3 shrink-0 text-[#9E9A93] transition-transform ${branchFilterDropdownOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {branchFilterDropdownOpen && (
                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-[#E5E0D8] bg-white py-1 shadow-lg shadow-black/5 ring-1 ring-black/5">
                          <button
                            type="button"
                            onClick={() => { setBranchFilter('All Branches'); setCurrentPage(1); setBranchFilterDropdownOpen(false); }}
                            className={`w-full cursor-pointer px-3 py-1.5 text-left text-[11px] hover:bg-[#FAF5FF] ${branchFilter === 'All Branches' ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                          >
                            All Branches
                          </button>
                          {branchOptions.slice(1).map((branch) => (
                            <button
                              key={branch}
                              type="button"
                              onClick={() => { setBranchFilter(branch); setCurrentPage(1); setBranchFilterDropdownOpen(false); }}
                              className={`w-full cursor-pointer px-3 py-1.5 text-left text-[11px] hover:bg-[#FAF5FF] ${branchFilter === branch ? 'bg-[#FAF5FF] font-bold text-[#1A1615]' : 'font-semibold text-[#6E6A66]'}`}
                            >
                              {branch}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" className="rounded-md border border-[#E5E0D8] bg-white px-2.5 py-1.5 text-[9px] font-semibold text-[#6E6A66] hover:bg-[#FAF5FF]">Today, 2.4</button>
                  </div>
                </div>
                <div className="divide-y divide-[#E5E0D8] sm:hidden">
                  {paginatedLogs.map((log, index) => {
                    const isFlagged = log.cryptoState === 'FLAGGED';
                    const statusLabel = log.id === successLogId && !isFlagged ? 'SUCCESS' : isFlagged ? 'CRITICAL' : 'VERIFIED';
                    return (
                      <button
                        key={`mobile-${log.id}`}
                        type="button"
                        onClick={() => setSelectedHash(log.hash)}
                        className={`block w-full p-3 text-left transition-colors ${isFlagged ? 'bg-[#FFF7F6]' : 'bg-white hover:bg-[#FAF5FF]'}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-2">
                            <img src={log.actor.avatar} alt="" className="h-7 w-7 shrink-0 rounded-full border border-[#E5E0D8] object-cover" />
                            <div className="min-w-0">
                              <div className="truncate text-[11px] font-bold text-[#1A1615]">{log.action.replaceAll('_', ' ')}</div>
                              <div className="truncate text-[9px] text-[#6E6A66]">{log.actor.name} · {log.actor.role}</div>
                            </div>
                          </div>
                          <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[8px] font-bold ${isFlagged ? 'bg-[#FCE7E5] text-[#B42318]' : 'bg-[#E6F4ED] text-[#0D7A53]'}`}>
                            {statusLabel}
                          </span>
                        </div>
                        <div className="mt-2 grid grid-cols-[1fr_minmax(0,auto)] gap-2 text-[9px]">
                          <div className="min-w-0"><span className="block uppercase tracking-wider text-[#A09A91]">Target</span><span className="block truncate font-medium text-[#1A1615]">{log.target}</span></div>
                          <div className="min-w-0"><span className="block uppercase tracking-wider text-[#A09A91]">Time</span><span className="block truncate text-[#6E6A66]">{log.timestamp}</span></div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="hidden overflow-x-auto sm:block">
                  <table className="w-full min-w-[760px] text-left text-xs">
                    <thead className="bg-[#FAF8FF] text-[#9E9A93] uppercase font-bold text-[10px] tracking-wider border-b border-[#E5E0D8]">
                      <tr>
                        <th className="w-[112px] px-4 py-3">Timestamp (EST)</th>
                        <th className="py-3 px-3">Actor</th>
                        <th className="w-[190px] px-3 py-3">Action / Target</th>
                        <th className="py-3 px-3">Terminal / IP</th>
                        <th className="px-4 py-3 text-right">Cryptographic State</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E5E0D8]">
                      {paginatedLogs.map((log, index) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedHash(log.hash)}
                          className={`cursor-pointer align-top transition-colors ${log.cryptoState === 'FLAGGED' ? 'bg-[#FFF7F6] hover:bg-[#FDEDEC]' : 'hover:bg-[#FAF5FF]/80'}`}
                        >
                          {/* Timestamp */}
                          <td className={`whitespace-nowrap px-4 py-4 font-mono text-[11px] ${log.cryptoState === 'FLAGGED' ? 'text-[#C2413A]' : 'text-[#6E6A66]'}`}>
                            <div className="font-bold">{log.timestamp.split(' ')[1] || log.timestamp}</div>
                            <div className="mt-0.5 text-[10px] font-normal">{log.timestamp.split(' ')[0]}</div>
                          </td>

                          {/* Actor */}
                          <td className="px-3 py-4">
                            <div className="flex items-center gap-2">
                              <img
                                src={log.actor.avatar}
                                alt={log.actor.name}
                                className="w-6 h-6 rounded-full object-cover border border-[#E5E0D8]"
                              />
                              <div>
                                <div className={`font-semibold leading-tight ${log.cryptoState === 'FLAGGED' ? 'text-[#C2413A]' : 'text-[#1A1615]'}`}>{log.actor.name}</div>
                                <div className="text-[9px] text-[#9E9A93] font-medium">{log.actor.role}</div>
                              </div>
                            </div>
                          </td>

                          {/* Action & Target */}
                          <td className="px-3 py-4">
                            <div className={`max-w-[190px] text-[12px] font-bold leading-tight ${log.cryptoState === 'FLAGGED' ? 'text-[#C2413A]' : 'text-[#1A1615]'}`}>
                              {log.cryptoState === 'FLAGGED' && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                              {log.cryptoState === 'FLAGGED' ? 'Role Escalation [BLOCKED]' : log.action.replaceAll('_', ' ')}
                            </div>
                            <div className="mt-1 max-w-[190px] text-[10px] leading-snug text-[#6E6A66]">{log.target}</div>
                          </td>

                          {/* Terminal / IP */}
                          <td className="px-3 py-4">
                            <div className="font-mono text-[11px] text-[#1A1615]">{log.terminal}</div>
                            <div className="text-[10px] text-[#9E9A93] font-mono">{log.ip}</div>
                          </td>

                          {/* Crypto State */}
                          <td className="whitespace-nowrap px-4 py-4 text-right">
                            <span className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 text-[10px] font-bold ${log.cryptoState === 'FLAGGED' ? 'border-[#F3B7B1] bg-[#FCE7E5] text-[#B42318]' : 'border-[#BCE3D1] bg-[#E6F4ED] text-[#0D7A53]'}`}>
                              {log.cryptoState === 'FLAGGED' ? <AlertTriangle className="h-3 w-3" /> : <CheckCircle2 className="h-3 w-3" />} {log.cryptoState === 'FLAGGED' ? 'ROLE ESCALATION BLOCKED' : log.id === successLogId ? 'SUCCESS' : log.cryptoState}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Hash Inspector Banner */}
                {selectedHash && (
                  <div className="p-3 bg-[#FAF8FF] border-t border-[#E5E0D8] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <Key className="w-3.5 h-3.5 text-[#5844A8] shrink-0" />
                      <span className="font-mono text-[10px] text-[#1A1615] truncate">
                        SHA-256: {selectedHash}
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(selectedHash)}
                      className="px-2.5 py-1 bg-white border border-[#E5E0D8] rounded text-[10px] font-semibold text-[#6E6A66] hover:bg-[#F5F4F0] shrink-0 cursor-pointer"
                    >
                      {copiedHash ? 'Copied!' : 'Copy Hash'}
                    </button>
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-[#E5E0D8] bg-[#FCFBF9] px-3 py-2.5 text-[9px] text-[#9E9A93] sm:flex-row sm:items-center sm:justify-between">
                  <span>Showing {firstVisibleEntry}–{lastVisibleEntry} of {orderedLogs.length} immutable log entries</span>
                  <div className="flex items-center gap-2">
                    <span><strong className="text-[#6E6A66]">Merkle Root:</strong> 0x88f...1c8d</span>
                    <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1} className="cursor-pointer rounded border border-[#E5E0D8] bg-white px-2 py-1 font-semibold text-[#6E6A66] disabled:cursor-not-allowed disabled:opacity-40">Previous</button>
                    {Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1).map((page) => (
                      <button key={page} type="button" onClick={() => goToPage(page)} aria-current={currentPage === page ? 'page' : undefined} className={`cursor-pointer rounded px-2 py-1 font-bold ${currentPage === page ? 'bg-[#5844A8] text-white' : 'border border-[#E5E0D8] bg-white text-[#6E6A66]'}`}>{page}</button>
                    ))}
                    <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages} className="cursor-pointer rounded border border-[#E5E0D8] bg-white px-2 py-1 font-semibold text-[#6E6A66] disabled:cursor-not-allowed disabled:opacity-40">Next</button>
                  </div>
                </div>

                <div className="m-3 rounded-lg border border-[#E5E0D8] bg-[#FCFBF9] p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-[#B7842C]" /><h3 className="text-[12px] font-bold text-[#1A1615]">Realtime Hash Verification Node</h3></div>
                    <span className="rounded-full bg-[#E6F4ED] px-2 py-1 text-[8px] font-bold text-[#0D7A53]">ALL 142 BLOCKS VALID</span>
                  </div>
                  <div className="mt-2 rounded-md border border-[#E5E0D8] bg-white px-2.5 py-2 font-mono text-[11px] leading-relaxed text-[#6E6A66]">
                    <div className="flex flex-wrap justify-between gap-x-4"><span>LAST VERIFIED BLOCK: <strong className="text-[#1A1615]">#892,104</strong></span><span>DIFFICULTY TARGET: 0000ffff...</span></div>
                    <div className="break-all"><strong className="text-[#1A1615]">PREV_HASH:</strong> 000000000000000004f29a88c7d61dea352f683ab293410a8d67e0e1189ac6</div>
                    <div className="text-[#B7842C] break-all"><strong>CURR_HASH:</strong> 00000000000000001c91f3f09ae84227c991823c51c8ba48726190a862ef</div>
                    <div className="mt-1 flex items-start gap-1 text-[#0D7A53]"><CheckCircle2 className="h-3 w-3 shrink-0 mt-0.5" /> <span>Cryptographic witness attested by Cloudflare HSM & Amazon KMS enclave</span></div>
                  </div>
                </div>
              </div>

              {/* Right Sidebar: POS Mesh Fleet & Venue Security Policy (4 cols) */}
              <div className="space-y-4 lg:col-span-4">
                {/* POS Mesh Fleet Status */}
                <div id="pos-hardware-panel" className="space-y-3 rounded-lg border border-[#E5E0D8] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
                    <div className="flex items-center gap-1.5"><Wifi className="h-3.5 w-3.5 text-[#B7842C]" /><span className="text-[12px] font-bold text-[#1A1615]">POS Mesh Fleet</span></div>
                    <span className="rounded-full bg-[#FAF5FF] px-1.5 py-1 text-[8px] font-bold text-[#6E6A66]">◌ Ping Mesh</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-[#FAF8FF] border border-[#E5E0D8] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#1A1615]">Downtown Counter 01</div>
                        <div className="text-[10px] text-[#6E6A66]">Apple iPad Pro 12.9&quot; • Revia Hub</div>
                      </div>
                      <span className="text-[9px] font-bold text-[#0D7A53]">Online<br /><span className="font-normal text-[#9E9A93]">4s ago</span></span>
                    </div>

                    <div className="p-2.5 bg-[#FAF8FF] border border-[#E5E0D8] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#1A1615]">Roastery Bar 02</div>
                        <div className="text-[10px] text-[#6E6A66]">Square Register • Revia Bridge</div>
                      </div>
                      <span className="text-[9px] font-bold text-[#0D7A53]">Online<br /><span className="font-normal text-[#9E9A93]">12s ago</span></span>
                    </div>

                    <div className="p-2.5 bg-[#FAF8FF] border border-[#E5E0D8] rounded-lg flex items-center justify-between">
                      <div>
                        <div className="font-bold text-[#1A1615]">Northside Pop-up 01</div>
                        <div className="text-[10px] text-[#6E6A66]">Revia Mobile Handheld NFC</div>
                      </div>
                      <span className="text-[9px] font-bold text-[#B7842C]">Standby<br /><span className="font-normal text-[#9E9A93]">5m ago</span></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1 text-[9px] font-semibold text-[#6E6A66]">
                    <span>Enforce Mutual TLS on Fleet</span>
                    <label className="relative inline-flex cursor-pointer items-center">
                      <input type="checkbox" checked={enforceFleetTls} onChange={(event) => setEnforceFleetTls(event.target.checked)} className="peer sr-only" aria-label="Enforce Mutual TLS on Fleet" />
                      <span className="h-3.5 w-7 rounded-full bg-[#D9D3C9] transition-colors peer-checked:bg-[#0D7A53] after:absolute after:left-0.5 after:top-0.5 after:h-2.5 after:w-2.5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3.5" />
                    </label>
                  </div>
                </div>

                {/* Webhooks & Connectors Status */}
                <div className="space-y-3 rounded-lg border border-[#E5E0D8] bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between border-b border-[#E5E0D8] pb-2">
                    <div className="flex items-center gap-1.5"><Webhook className="h-3.5 w-3.5 text-[#B7842C]" /><span className="text-[10px] font-bold uppercase tracking-wider text-[#9E9A93]">Webhooks & Connectors</span></div>
                    <span className="rounded-full bg-[#E6F4ED] px-1.5 py-0.5 text-[8px] font-bold text-[#0D7A53]">3 active</span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8FF] border border-[#E5E0D8]">
                      <span className="font-semibold text-[#1A1615]">Shopify POS Sync</span>
                      <span className="text-[10px] text-[#0D7A53] font-bold">200 OK</span>
                    </div>
                    <div className="flex items-center justify-between p-2 rounded-lg bg-[#FAF8FF] border border-[#E5E0D8]">
                      <span className="font-semibold text-[#1A1615]">Apple & Google Wallet Push</span>
                      <span className="text-[10px] text-[#0D7A53] font-bold">99.98%</span>
                    </div>
                  </div>
                  <div className="pt-1">
                    <div className="mb-1 text-[8px] font-bold uppercase tracking-wider text-[#9E9A93]">Live webhook signing secret</div>
                    <div className="flex items-center gap-1 rounded-md border border-[#E5E0D8] bg-[#FAF8FF] px-2 py-1.5 font-mono text-[9px] text-[#6E6A66]">
                      <span className="min-w-0 flex-1 truncate">rev_sec_live_994a••••••••••••</span>
                      <button type="button" className="shrink-0 rounded bg-white px-1.5 py-0.5 text-[8px] font-semibold text-[#6E6A66]">Rotate</button>
                    </div>
                  </div>
                </div>

                {/* Venue Authentication Policy */}
                <div className="space-y-3 rounded-lg border border-[#E5E0D8] bg-white p-4 shadow-xs lg:-mt-1">
                  <div className="flex items-center gap-1.5 border-b border-[#E5E0D8] pb-2"><Lock className="h-3.5 w-3.5 text-[#B7842C]" /><h4 className="text-[12px] font-bold text-[#1A1615]">Venue Authentication Policy</h4></div>

                  <div className="space-y-3 pt-1 text-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#1A1615]">Mandatory 2FA for Managers</div>
                        <p className="text-[10px] text-[#6E6A66]">Requires hardware FIDO2 or TOTP authenticator</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={enforceMfa} onChange={(e) => setEnforceMfa(e.target.checked)} className="peer sr-only" aria-label="Mandatory 2FA for Managers" />
                        <span className="h-3.5 w-7 rounded-full bg-[#D9D3C9] transition-colors peer-checked:bg-[#0D7A53] after:absolute after:left-0.5 after:top-0.5 after:h-2.5 after:w-2.5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3.5" />
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#1A1615]">Terminal Inactivity Lock</div>
                        <p className="text-[10px] text-[#6E6A66]">Auto-lock POS cashier display</p>
                      </div>
                      <span className="rounded bg-[#FAF5FF] px-1.5 py-1 text-[9px] font-semibold text-[#6E6A66]">15 Minutes</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-[#1A1615]">Venue Subnet IP Restrict</div>
                        <p className="text-[10px] text-[#6E6A66]">Limit administrative space to trusted store LANs</p>
                      </div>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input type="checkbox" checked={autoSessionTimeout} onChange={(e) => setAutoSessionTimeout(e.target.checked)} className="peer sr-only" aria-label="Venue Subnet IP Restrict" />
                        <span className="h-3.5 w-7 rounded-full bg-[#D9D3C9] transition-colors peer-checked:bg-[#0D7A53] after:absolute after:left-0.5 after:top-0.5 after:h-2.5 after:w-2.5 after:rounded-full after:bg-white after:transition-transform peer-checked:after:translate-x-3.5" />
                      </label>
                    </div>
                    <div className="flex items-start gap-1.5 rounded-md bg-[#FAF8FF] p-2 text-[9px] leading-snug text-[#6E6A66]"><CircleCheck className="mt-0.5 h-3 w-3 shrink-0 text-[#0D7A53]" /> All 3 venues meet Level 1 PCI-DSS Merchant Attestation standard.</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'merchant_profile' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <MerchantProfileSettings />
          </div>
        ) : activeTab === 'customer_tiers' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <CustomerTypeSettings />
          </div>
        ) : activeTab === 'general_brand' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <MerchantPlatformSettings />
          </div>
        ) : activeTab === 'pos_hardware' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <PosHardwareSettings />
          </div>
        ) : activeTab === 'api_keys_webhooks' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <ApiKeysWebhooksSettings />
          </div>
        ) : activeTab === 'access_control' ? (
          <div className="mt-4 overflow-hidden rounded-xl bg-white border border-[#E5E0D8] shadow-xs">
            <AccessControlSettings />
          </div>
        ) : null}

        {/* <footer className="flex flex-col gap-2 border-t border-[#E5E0D8] px-1 pt-3 text-[9px] text-[#9E9A93] sm:flex-row sm:items-center sm:justify-between mt-4">
            <span className="inline-flex items-center gap-1.5 font-semibold text-[#0D7A53]"><span className="h-1.5 w-1.5 rounded-full bg-[#0D7A53]" /> All systems operational</span>
            <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3 w-3" /> Last synchronized: 2 minutes ago</span>
          </footer> */}
      </div>
    </>
  );
};
