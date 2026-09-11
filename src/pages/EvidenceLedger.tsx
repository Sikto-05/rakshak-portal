import { useState, useMemo } from 'react';
import { BookOpen, Filter, Download, AlertTriangle, CheckCircle, Bot, Clock, Search, X, Hash, ChevronDown, ChevronUp } from 'lucide-react';
import { RELATIONSHIPS, getEntityById } from '../data/syntheticData';
import type { Relationship, VerificationStatus } from '../types';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../config/roles';
import { clsx } from 'clsx';

const STATUS_CONFIG: Record<VerificationStatus, { label: string; class: string; icon: React.ElementType }> = {
  verified: { label: 'Verified', class: 'tag-verified', icon: CheckCircle },
  'ai-hypothesis': { label: 'AI Hypothesis', class: 'tag-hypothesis', icon: Bot },
  uncertain: { label: 'Uncertain', class: 'tag-uncertain', icon: Clock },
  rejected: { label: 'Rejected', class: 'tag-rejected', icon: X },
  unverified: { label: 'Unverified', class: 'tag-unverified', icon: AlertTriangle },
};

function EvidenceRow({ rel }: { rel: Relationship }) {
  const [expanded, setExpanded] = useState(false);
  const src = getEntityById(rel.sourceId);
  const tgt = getEntityById(rel.targetId);
  const cfg = STATUS_CONFIG[rel.verificationStatus];
  const confColor = rel.confidence >= 0.85 ? 'text-emerald-400' : rel.confidence >= 0.65 ? 'text-amber-400' : 'text-red-400';

  return (
    <>
      <tr className={clsx('table-row cursor-pointer', rel.flagContradiction && 'bg-red-950/10')} onClick={() => setExpanded(e => !e)}>
        <td className="table-cell font-mono text-[11px] text-slate-500">{rel.id}</td>
        <td className="table-cell">
          <div className="text-xs text-slate-300 truncate max-w-[120px]">{src?.label || rel.sourceId}</div>
          <div className="text-[10px] text-slate-600 font-mono">{rel.sourceId}</div>
        </td>
        <td className="table-cell">
          <span className="text-[10px] bg-navy-800 border border-navy-700 text-slate-400 px-2 py-0.5 rounded">{rel.type.replace(/_/g, ' ')}</span>
        </td>
        <td className="table-cell">
          <div className="text-xs text-slate-300 truncate max-w-[120px]">{tgt?.label || rel.targetId}</div>
          <div className="text-[10px] text-slate-600 font-mono">{rel.targetId}</div>
        </td>
        <td className="table-cell">
          <span className={clsx(cfg.class, 'inline-flex items-center gap-1 text-[10px]')}>
            <cfg.icon className="w-2.5 h-2.5" />{cfg.label}
          </span>
        </td>
        <td className="table-cell">
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full bg-navy-700">
              <div className={clsx('h-full rounded-full', rel.confidence >= 0.85 ? 'bg-emerald-500' : rel.confidence >= 0.65 ? 'bg-amber-500' : 'bg-red-500')} style={{ width: `${rel.confidence * 100}%` }} />
            </div>
            <span className={clsx('text-xs font-semibold', confColor)}>{(rel.confidence * 100).toFixed(0)}%</span>
          </div>
        </td>
        <td className="table-cell text-[11px] text-slate-500">{rel.evidenceSources.length}</td>
        <td className="table-cell">
          {rel.flagContradiction
            ? <span className="tag-rejected text-[10px]"><AlertTriangle className="w-2.5 h-2.5" /> Contradiction</span>
            : <span className="text-[10px] text-slate-600">—</span>}
        </td>
        <td className="table-cell">
          {rel.hashFingerprint && (
            <div className="flex items-center gap-1 font-mono text-[10px] text-slate-600">
              <Hash className="w-2.5 h-2.5" />{rel.hashFingerprint}
            </div>
          )}
        </td>
        <td className="table-cell">
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
        </td>
      </tr>
      {expanded && (
        <tr className="bg-navy-850">
          <td colSpan={10} className="px-4 py-4">
            <div className="space-y-3">
              <div className="text-xs font-semibold text-slate-300 mb-2">Evidence Sources ({rel.evidenceSources.length})</div>
              {rel.evidenceSources.map(es => (
                <div key={es.id} className="flex items-start gap-3 p-3 rounded-lg bg-navy-900 border border-navy-700">
                  <span className="text-[9px] uppercase font-semibold bg-navy-800 text-slate-400 px-1.5 py-1 rounded shrink-0">{es.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200">{es.title}</div>
                    {es.excerpt && <div className="text-[10px] text-slate-500 italic mt-0.5">"{es.excerpt}"</div>}
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-600">
                      <span className="font-mono">{es.documentId}</span>
                      <span>·</span>
                      <span>{new Date(es.timestamp).toLocaleString('en-IN')}</span>
                      <span>·</span>
                      <span>Added by {es.addedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
              {rel.flagContradiction && (
                <div className="p-3 rounded-lg bg-red-950/30 border border-red-800/40 text-xs text-red-300">
                  <span className="font-semibold">⚠ Contradiction Note:</span> {rel.contradictionNote}
                </div>
              )}
              {rel.verifiedBy && (
                <div className="text-[10px] text-slate-500">
                  Verified by <span className="text-slate-300">{rel.verifiedBy}</span> on {rel.verifiedAt ? new Date(rel.verifiedAt).toLocaleDateString('en-IN') : '—'}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function EvidenceLedger() {
  const { user } = useAuth();
  const canExport = user ? ROLE_PERMISSIONS[user.role].canExportData : false;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | 'all'>('all');
  const [confMin, setConfMin] = useState(0);
  const [showContradictionsOnly, setShowContradictionsOnly] = useState(false);

  const filtered = useMemo(() => {
    return RELATIONSHIPS.filter(r => {
      if (statusFilter !== 'all' && r.verificationStatus !== statusFilter) return false;
      if (r.confidence < confMin / 100) return false;
      if (showContradictionsOnly && !r.flagContradiction) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return r.id.toLowerCase().includes(q) ||
          r.sourceId.toLowerCase().includes(q) ||
          r.targetId.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.evidenceSources.some(es => es.documentId.toLowerCase().includes(q) || es.title.toLowerCase().includes(q)) ||
          (getEntityById(r.sourceId)?.label || '').toLowerCase().includes(q) ||
          (getEntityById(r.targetId)?.label || '').toLowerCase().includes(q);
      }
      return true;
    });
  }, [search, statusFilter, confMin, showContradictionsOnly]);

  const contradictions = RELATIONSHIPS.filter(r => r.flagContradiction);

  return (
    <div className="space-y-5 max-w-full">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Evidence Ledger</h2>
          <p className="text-sm text-slate-500 mt-0.5">{RELATIONSHIPS.length} relationship records · Every connection is evidence-backed</p>
        </div>
        {canExport && (
          <button className="btn-secondary flex items-center gap-2 text-xs">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        )}
      </div>

      {/* Contradiction alert */}
      {contradictions.length > 0 && (
        <div className="card bg-red-950/20 border-red-800/30 flex items-center gap-3 cursor-pointer" onClick={() => setShowContradictionsOnly(s => !s)}>
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
          <div className="flex-1">
            <div className="text-sm font-semibold text-red-400">{contradictions.length} Contradiction{contradictions.length !== 1 ? 's' : ''} Detected</div>
            <div className="text-xs text-slate-400 mt-0.5">Conflicting records found. Auto-merge is disabled — manual review required.</div>
          </div>
          <span className="text-xs text-red-400 border border-red-800 rounded px-2 py-1 shrink-0">
            {showContradictionsOnly ? 'Show all' : 'Filter to contradictions'}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 text-xs" placeholder="Search by entity, document ID, type…" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as VerificationStatus | 'all')} className="input-field w-auto text-xs">
          <option value="all">All Status</option>
          {Object.entries(STATUS_CONFIG).map(([v, c]) => <option key={v} value={v}>{c.label}</option>)}
        </select>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Min conf:</span>
          <input type="range" min={0} max={100} step={5} value={confMin} onChange={e => setConfMin(Number(e.target.value))} className="w-24 accent-amber-500" />
          <span className="text-amber-400 w-8">{confMin}%</span>
        </div>
        <div className="text-xs text-slate-500">{filtered.length} records</div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-navy-700">
            <tr>
              {['Edge ID', 'Source', 'Relationship', 'Target', 'Status', 'Confidence', 'Evidence', 'Flags', 'Hash', ''].map(h => (
                <th key={h} className="table-head">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => <EvidenceRow key={r.id} rel={r} />)}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} className="text-center py-10 text-slate-500 text-sm">
                  No records match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(STATUS_CONFIG).map(([status, cfg]) => {
          const count = RELATIONSHIPS.filter(r => r.verificationStatus === status).length;
          return (
            <div key={status} className="card text-center">
              <div className="text-xl font-bold text-white">{count}</div>
              <div className={clsx(cfg.class, 'text-[10px] mt-1 mx-auto w-fit')}>{cfg.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
