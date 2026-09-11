import { useState } from 'react';
import { ClipboardList, Shield, Clock, Eye, Download, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS, ROLE_COLORS, ROLE_LABELS } from '../config/roles';
import { clsx } from 'clsx';
import type { AuditEntry } from '../types';

// Demo audit entries to supplement the live session entries
const DEMO_AUDIT: AuditEntry[] = [
  { id: 'AUD-DEMO-001', userId: 'USR-UP-4521', userName: 'Sub-Inspector Rajesh Sharma', userRole: 'investigator', action: 'VIEW_ENTITY', entityId: 'P-001', entityType: 'person', timestamp: new Date(Date.now() - 300000).toISOString(), ipAddress: '192.168.1.***', reason: 'Case investigation FIR-LKO-2023-0042', sessionId: 'SES-DEMO-001' },
  { id: 'AUD-DEMO-002', userId: 'USR-MH-7834', userName: 'Inspector Priya Verma', userRole: 'sr_investigator', action: 'VERIFY_RELATIONSHIP', entityId: 'R-001', entityType: 'person', timestamp: new Date(Date.now() - 600000).toISOString(), ipAddress: '192.168.1.***', reason: 'CDR cross-verification completed', sessionId: 'SES-DEMO-002' },
  { id: 'AUD-DEMO-003', userId: 'USR-DL-1102', userName: 'Dy. SP Farhan Khan', userRole: 'supervisor', action: 'EXPORT_DATA', entityType: 'case', timestamp: new Date(Date.now() - 900000).toISOString(), ipAddress: '192.168.1.***', reason: 'Monthly case review report', sessionId: 'SES-DEMO-003' },
  { id: 'AUD-DEMO-004', userId: 'USR-KL-3345', userName: 'Smt. Kavitha Nair', userRole: 'analyst', action: 'VIEW_GRAPH', timestamp: new Date(Date.now() - 1200000).toISOString(), ipAddress: '192.168.1.***', sessionId: 'SES-DEMO-004' },
  { id: 'AUD-DEMO-005', userId: 'USR-UP-4521', userName: 'Sub-Inspector Rajesh Sharma', userRole: 'investigator', action: 'SEARCH_ENTITY', timestamp: new Date(Date.now() - 1500000).toISOString(), ipAddress: '192.168.1.***', reason: 'Searching for vehicle registration UP32-AB-4521', sessionId: 'SES-DEMO-001' },
  { id: 'AUD-DEMO-006', userId: 'USR-MH-7834', userName: 'Inspector Priya Verma', userRole: 'sr_investigator', action: 'PATH_FIND', entityId: 'P-001', entityType: 'person', timestamp: new Date(Date.now() - 1800000).toISOString(), ipAddress: '192.168.1.***', reason: 'Network analysis for FIR-MUM-2023-0118', sessionId: 'SES-DEMO-002' },
  { id: 'AUD-DEMO-007', userId: 'USR-SYS-0001', userName: 'System Administrator', userRole: 'admin', action: 'USER_LOGIN', timestamp: new Date(Date.now() - 3600000).toISOString(), ipAddress: '192.168.1.***', sessionId: 'SES-ADMIN-001' },
  { id: 'AUD-DEMO-008', userId: 'USR-DL-1102', userName: 'Dy. SP Farhan Khan', userRole: 'supervisor', action: 'VIEW_AUDIT_LOG', timestamp: new Date(Date.now() - 4200000).toISOString(), ipAddress: '192.168.1.***', sessionId: 'SES-DEMO-003' },
];

const ACTION_COLORS: Record<string, string> = {
  USER_LOGIN: 'text-emerald-400 bg-emerald-900/20 border-emerald-800/40',
  USER_LOGOUT: 'text-slate-400 bg-slate-800/40 border-slate-700',
  VIEW_ENTITY: 'text-blue-400 bg-blue-900/20 border-blue-800/40',
  VIEW_GRAPH: 'text-purple-400 bg-purple-900/20 border-purple-800/40',
  VERIFY_RELATIONSHIP: 'text-teal-400 bg-teal-900/20 border-teal-800/40',
  EXPORT_DATA: 'text-amber-400 bg-amber-900/20 border-amber-800/40',
  SEARCH_ENTITY: 'text-indigo-400 bg-indigo-900/20 border-indigo-800/40',
  PATH_FIND: 'text-cyan-400 bg-cyan-900/20 border-cyan-800/40',
  VIEW_AUDIT_LOG: 'text-orange-400 bg-orange-900/20 border-orange-800/40',
  SESSION_ACTIVE: 'text-slate-500 bg-slate-900/20 border-slate-800',
};

export default function AuditLog() {
  const { user, auditLog } = useAuth();
  const canView = user ? ROLE_PERMISSIONS[user.role].canViewAuditLog : false;

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  if (!canView) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Shield className="w-12 h-12 text-slate-700" />
        <div className="text-center">
          <div className="text-slate-400 font-semibold">Access Restricted</div>
          <div className="text-slate-600 text-sm mt-1">Audit log access requires Supervisor or Admin role.</div>
          <div className="text-slate-700 text-xs mt-1">Your role: <span className="font-mono">{user?.role}</span></div>
        </div>
      </div>
    );
  }

  const allEntries = [...auditLog, ...DEMO_AUDIT].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const filtered = allEntries.filter(e => {
    if (roleFilter !== 'all' && e.userRole !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return e.userName.toLowerCase().includes(q) ||
        e.action.toLowerCase().includes(q) ||
        (e.entityId || '').toLowerCase().includes(q) ||
        (e.reason || '').toLowerCase().includes(q);
    }
    return true;
  });

  const actionCounts: Record<string, number> = {};
  allEntries.forEach(e => { actionCounts[e.action] = (actionCounts[e.action] || 0) + 1; });

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Audit Log</h2>
          <p className="text-sm text-slate-500 mt-0.5">Complete record of who accessed what, when, and why</p>
        </div>
        <button className="btn-secondary flex items-center gap-2 text-xs">
          <Download className="w-3.5 h-3.5" /> Export Log
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Events', value: allEntries.length, icon: ClipboardList, color: 'text-blue-400' },
          { label: 'Sessions', value: new Set(allEntries.map(e => e.sessionId)).size, icon: Eye, color: 'text-purple-400' },
          { label: 'Unique Users', value: new Set(allEntries.map(e => e.userId)).size, icon: Shield, color: 'text-amber-400' },
          { label: 'Exports', value: allEntries.filter(e => e.action === 'EXPORT_DATA').length, icon: Download, color: 'text-teal-400' },
        ].map(c => (
          <div key={c.label} className="card flex items-center gap-3">
            <c.icon className={clsx('w-8 h-8 shrink-0', c.color)} />
            <div>
              <div className="text-2xl font-bold text-white">{c.value}</div>
              <div className="text-[10px] text-slate-500">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-xs" placeholder="Search by user, action, entity, reason…" />
        </div>
        <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="input-field w-auto text-xs">
          <option value="all">All Roles</option>
          <option value="investigator">Investigator</option>
          <option value="sr_investigator">Sr. Investigator</option>
          <option value="supervisor">Supervisor</option>
          <option value="analyst">Analyst</option>
          <option value="admin">Admin</option>
        </select>
        <div className="text-xs text-slate-500 self-center">{filtered.length} events</div>
      </div>

      {/* Log table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-navy-700">
              <tr>
                {['Timestamp', 'User', 'Role', 'Action', 'Entity', 'Reason', 'IP'].map(h => (
                  <th key={h} className="table-head">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(entry => (
                <tr key={entry.id} className="table-row">
                  <td className="table-cell">
                    <div className="text-xs text-slate-300 font-mono whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleDateString('en-IN')}
                    </div>
                    <div className="text-[10px] text-slate-600 font-mono">
                      {new Date(entry.timestamp).toLocaleTimeString('en-IN')}
                    </div>
                  </td>
                  <td className="table-cell">
                    <div className="text-xs text-slate-300">{entry.userName}</div>
                    <div className="text-[10px] text-slate-600 font-mono">{entry.userId}</div>
                  </td>
                  <td className="table-cell">
                    <span className={clsx('badge-role text-[9px]', ROLE_COLORS[entry.userRole])}>
                      {ROLE_LABELS[entry.userRole]}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className={clsx('text-[10px] px-2 py-0.5 rounded-full border font-medium', ACTION_COLORS[entry.action] || 'text-slate-400 bg-slate-800/40 border-slate-700')}>
                      {entry.action.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="table-cell">
                    {entry.entityId
                      ? <span className="text-[11px] font-mono text-slate-400">{entry.entityId}</span>
                      : <span className="text-slate-700">—</span>}
                  </td>
                  <td className="table-cell max-w-[200px]">
                    <span className="text-[10px] text-slate-500 truncate block" title={entry.reason}>
                      {entry.reason || '—'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <span className="text-[10px] font-mono text-slate-600">{entry.ipAddress || '—'}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-500 text-sm">
                    No audit entries match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Security notice */}
      <div className="card bg-amber-950/20 border-amber-800/30 flex items-start gap-3">
        <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-400/80 leading-relaxed">
          <strong className="text-amber-400">Security Notice:</strong> All portal access is logged with user identity, action, timestamp, and session ID. Logs are tamper-evident and exported for compliance review. Unauthorized access or data export without documented reason is a disciplinary offence.
        </div>
      </div>
    </div>
  );
}
