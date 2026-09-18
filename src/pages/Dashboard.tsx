import { useAuth } from '../context/AuthContext';
import { NETWORK_STATS, CASES, PERSONS, RELATIONSHIPS, COMMUNITIES } from '../data/syntheticData';
import { ROLE_LABELS } from '../config/roles';
import { Shield, Network, BookOpen, Users, AlertTriangle, TrendingUp, CheckCircle, XCircle, Clock, Activity, GitMerge, Map } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const CONFIDENCE_COLOR = (c: number) =>
  c >= 0.85 ? 'text-emerald-400' : c >= 0.65 ? 'text-amber-400' : 'text-red-400';

const SEVERITY_CLASS: Record<string, string> = {
  critical: 'bg-red-900/40 text-red-400 border-red-800',
  high: 'bg-orange-900/40 text-orange-400 border-orange-800',
  medium: 'bg-yellow-900/40 text-yellow-400 border-yellow-800',
  low: 'bg-slate-800 text-slate-400 border-slate-700',
};

const STATUS_ICON: Record<string, JSX.Element> = {
  'active': <Activity className="w-3 h-3 text-emerald-400" />,
  'under-investigation': <Clock className="w-3 h-3 text-amber-400" />,
  'closed': <CheckCircle className="w-3 h-3 text-slate-500" />,
  'pending': <AlertTriangle className="w-3 h-3 text-yellow-400" />,
};

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeCases = CASES.filter(c => c.attributes.status === 'active' || c.attributes.status === 'under-investigation');
  const flaggedPersons = PERSONS.filter(p => p.flagged);
  const avgConf = (NETWORK_STATS.avgConfidence * 100).toFixed(1);
  const verifiedPct = Math.round((NETWORK_STATS.verifiedRelationships / NETWORK_STATS.totalRelationships) * 100);

  const lastLoginFormatted = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Welcome & System Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},{' '}
              <span className="text-gradient-amber">{user?.name.split(' ').slice(-1)[0]}</span>
            </h2>
            {user?.badgeNumber && (
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 font-mono tracking-wider">
                {user.badgeNumber}
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-400 mt-1.5">
            <span className="font-semibold text-slate-300">{ROLE_LABELS[user!.role]}</span>
            <span className="text-navy-700">•</span>
            <span>{user?.station}</span>
            <span className="text-navy-700">•</span>
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span className="text-navy-700">•</span>
            <span className="inline-flex items-center gap-1.5 text-slate-400 bg-navy-900/80 px-2 py-0.5 rounded border border-navy-750">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Last Login: <span className="text-slate-200 font-mono font-medium">{lastLoginFormatted} IST</span></span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2.5 text-xs text-slate-300 bg-navy-900/90 border border-navy-700/80 rounded-lg px-3.5 py-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold tracking-wider text-[11px] uppercase text-slate-200">System Operational</span>
            <span className="text-navy-700">|</span>
            <span className="text-[10px] font-mono text-emerald-400 tracking-wider">PORTAL ACTIVE</span>
          </div>
        </div>
      </div>

      {/* Subtle Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Entities',
            value: NETWORK_STATS.totalEntities,
            sub: `${PERSONS.length} persons indexed`,
            icon: Users,
            accentBorder: 'border-l-blue-500',
            color: 'text-blue-400',
            iconBg: 'bg-gradient-to-br from-blue-500/20 via-blue-700/15 to-navy-900 border border-blue-500/30 shadow-[0_0_12px_rgba(59,130,246,0.15)]',
            bg: 'bg-navy-900/90 border-navy-700/70 hover:border-navy-600',
          },
          {
            label: 'Relationships',
            value: NETWORK_STATS.totalRelationships,
            sub: `${verifiedPct}% verified links`,
            icon: Network,
            accentBorder: 'border-l-purple-500',
            color: 'text-purple-400',
            iconBg: 'bg-gradient-to-br from-purple-500/20 via-purple-700/15 to-navy-900 border border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]',
            bg: 'bg-navy-900/90 border-navy-700/70 hover:border-navy-600',
          },
          {
            label: 'Active Cases',
            value: NETWORK_STATS.activeCases,
            sub: `${CASES.length} total FIR dockets`,
            icon: BookOpen,
            accentBorder: 'border-l-amber-500',
            color: 'text-amber-400',
            iconBg: 'bg-gradient-to-br from-amber-500/20 via-amber-700/15 to-navy-900 border border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]',
            bg: 'bg-navy-900/90 border-navy-700/70 hover:border-navy-600',
          },
          {
            label: 'Avg. Confidence',
            value: `${avgConf}%`,
            sub: `${NETWORK_STATS.bridgeNodes} bridge nodes`,
            icon: TrendingUp,
            accentBorder: 'border-l-emerald-500',
            color: 'text-emerald-400',
            iconBg: 'bg-gradient-to-br from-emerald-500/20 via-emerald-700/15 to-navy-900 border border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]',
            bg: 'bg-navy-900/90 border-navy-700/70 hover:border-navy-600',
          },
        ].map(card => (
          <div
            key={card.label}
            className={clsx(
              'card border border-l-4 transition-all duration-200 hover:translate-y-[-1px] shadow-sm flex flex-col justify-between gap-3',
              card.bg,
              card.accentBorder
            )}
          >
            <div className="flex items-center justify-between">
              <span className="label-text text-slate-400 font-semibold tracking-wider text-[11px]">{card.label}</span>
              <div className={clsx('w-9 h-9 rounded-lg flex items-center justify-center transition-transform duration-200', card.iconBg)}>
                <card.icon className={clsx('w-4 h-4', card.color)} />
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold tracking-tight text-white font-mono">{card.value}</div>
              <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                <span>{card.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Subtle Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />

      {/* 3. Main Intelligence Grid: Active Cases & Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Cases Section */}
        <div className="lg:col-span-2 card bg-navy-900/90 border border-navy-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-800/80">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-semibold text-white tracking-wide">Active Cases</h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 border border-navy-700">
                  {activeCases.length} FIRs
                </span>
              </div>
              <button
                onClick={() => navigate('/evidence')}
                className="btn-ghost text-xs hover:text-amber-400 flex items-center gap-1 py-1 px-2.5 font-medium transition-colors"
              >
                <span>View All</span>
                <span className="text-amber-400 font-bold">→</span>
              </button>
            </div>

            <div className="space-y-3">
              {activeCases.map((c, idx) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3.5 p-3 rounded-lg bg-navy-800/60 border border-navy-700/50 hover:border-amber-500/40 hover:bg-navy-800 hover:scale-[1.01] hover:shadow-md transition-all duration-150 cursor-pointer group"
                  onClick={() => navigate('/entities')}
                >
                  {/* S.No Column */}
                  <div className="flex items-center justify-center w-7 h-7 rounded bg-navy-950 border border-navy-700/70 text-[11px] font-mono font-bold text-slate-400 group-hover:text-amber-400 group-hover:border-amber-500/30 shrink-0 transition-colors">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  {/* Status Icon */}
                  <div className="flex items-center justify-center w-6 h-6 rounded bg-navy-900 border border-navy-800 shrink-0" title={`Status: ${c.attributes.status}`}>
                    {STATUS_ICON[c.attributes.status] || <Clock className="w-3 h-3 text-slate-500" />}
                  </div>

                  {/* Main Case Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Monospace FIR Badge */}
                      <span className="font-mono text-[11px] font-semibold tracking-wide px-2 py-0.5 rounded bg-navy-950 border border-navy-700 group-hover:border-amber-500/40 text-amber-300 shadow-inner">
                        {c.attributes.firNumber || c.label}
                      </span>
                      <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                        {c.attributes.title}
                      </span>
                      <span className={clsx('badge-role text-[9px] border ml-auto sm:ml-0', SEVERITY_CLASS[c.attributes.severity])}>
                        {c.attributes.severity}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400 truncate">
                      <span>{c.attributes.policeStation} · {c.attributes.state}</span>
                      {c.attributes.ipcSections && (
                        <>
                          <span className="text-navy-600">•</span>
                          <span className="text-[10px] font-mono text-slate-500">
                            Sec: {c.attributes.ipcSections.slice(0, 3).join(', ')}{c.attributes.ipcSections.length > 3 ? '...' : ''}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Date Badge */}
                  <div className="text-[11px] font-mono text-slate-400 shrink-0 self-center hidden sm:block bg-navy-950/60 px-2 py-1 rounded border border-navy-800">
                    {new Date(c.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Evidence Status, Flagged Entities, Quick Actions */}
        <div className="space-y-5">
          {/* Evidence Status */}
          <div className="card bg-navy-900/90 border border-navy-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-navy-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Evidence Status</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-500 bg-navy-950 px-2 py-0.5 rounded border border-navy-800">
                {NETWORK_STATS.totalRelationships} Links
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { label: 'Verified', count: NETWORK_STATS.verifiedRelationships, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'AI Hypothesis', count: RELATIONSHIPS.filter(r => r.verificationStatus === 'ai-hypothesis').length, color: 'bg-amber-500', textColor: 'text-amber-400' },
                { label: 'Uncertain', count: RELATIONSHIPS.filter(r => r.verificationStatus === 'uncertain').length, color: 'bg-yellow-500', textColor: 'text-yellow-400' },
                { label: 'Contradictions', count: NETWORK_STATS.flaggedContradictions, color: 'bg-red-500', textColor: 'text-red-400' },
              ].map(item => {
                const percentage = Math.round((item.count / NETWORK_STATS.totalRelationships) * 100);
                return (
                  <div key={item.label} className="group">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className={clsx('w-1.5 h-1.5 rounded-full', item.color)} />
                        <span className={clsx('font-medium text-xs', item.textColor)}>{item.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-slate-300 font-semibold">{item.count}</span>
                        <span className="font-mono text-[11px] text-slate-500 min-w-[32px] text-right font-medium">
                          {percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Taller Progress Bar (h-2) */}
                    <div className="h-2 w-full rounded-full bg-navy-950 border border-navy-800/80 overflow-hidden">
                      <div
                        className={clsx('h-full rounded-full transition-all duration-500', item.color)}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Flagged Entities */}
          <div className="card bg-navy-900/90 border border-navy-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-navy-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Flagged Entities</h3>
              </div>
              <span className="text-[10px] font-mono text-orange-400 bg-orange-950/40 px-2 py-0.5 rounded border border-orange-900/50">
                Priority
              </span>
            </div>

            <div className="space-y-2.5">
              {flaggedPersons.slice(0, 4).map(p => (
                <div
                  key={p.id}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-navy-800/40 border border-navy-700/40 hover:bg-navy-800 hover:border-amber-500/40 cursor-pointer transition-all duration-150 group"
                  onClick={() => navigate('/entities')}
                >
                  {/* Small Avatar circle with initials */}
                  <div className="w-7 h-7 rounded-full bg-navy-950 border border-amber-500/30 flex items-center justify-center text-[10px] font-mono font-bold text-amber-400 shrink-0 group-hover:border-amber-400 shadow-inner">
                    {getInitials(p.label)}
                  </div>

                  {/* Name and Role/Designation */}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-400 transition-colors truncate">
                      {p.label}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                      {p.networkRole ? (
                        <span className="capitalize font-medium text-amber-400/85">
                          {p.networkRole.replace('-', ' ')}
                        </span>
                      ) : p.attributes.occupation ? (
                        <span>{p.attributes.occupation}</span>
                      ) : (
                        <span>Person of Interest</span>
                      )}
                      {p.attributes.district && (
                        <>
                          <span className="text-navy-600">•</span>
                          <span className="text-slate-500">{p.attributes.district}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Threat / Importance Score */}
                  <div className="text-right shrink-0">
                    <span className={clsx('font-mono text-xs font-bold', CONFIDENCE_COLOR(p.importanceScore! / 100))}>
                      {p.importanceScore}
                    </span>
                    <div className="text-[8px] uppercase tracking-wider text-slate-600">Score</div>
                  </div>
                </div>
              ))}

              {flaggedPersons.length > 4 && (
                <div
                  className="text-xs text-slate-500 hover:text-amber-400 pt-1 text-center font-medium cursor-pointer transition-colors"
                  onClick={() => navigate('/entities')}
                >
                  +{flaggedPersons.length - 4} more flagged entities →
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-navy-900/90 border border-navy-700/80 shadow-sm">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-navy-800/80">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white tracking-wide">Quick Actions</h3>
              </div>
            </div>

            <div className="space-y-2.5">
              {[
                {
                  label: 'View Knowledge Graph',
                  icon: Network,
                  path: '/graph',
                  iconColor: 'text-purple-400',
                  iconBg: 'bg-purple-500/10 border-purple-500/30 group-hover:bg-purple-500/20',
                  hoverBorder: 'hover:border-purple-500/50',
                },
                {
                  label: 'Investigation Path Finder',
                  icon: GitMerge,
                  path: '/pathfinder',
                  iconColor: 'text-amber-400',
                  iconBg: 'bg-amber-500/10 border-amber-500/30 group-hover:bg-amber-500/20',
                  hoverBorder: 'hover:border-amber-500/50',
                },
                {
                  label: 'Geo Intelligence Map',
                  icon: Map,
                  path: '/map',
                  iconColor: 'text-blue-400',
                  iconBg: 'bg-blue-500/10 border-blue-500/30 group-hover:bg-blue-500/20',
                  hoverBorder: 'hover:border-blue-500/50',
                },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => navigate(a.path)}
                  className={clsx(
                    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-navy-800/70 hover:bg-navy-800 border border-navy-700/60 text-left transition-all duration-150 group shadow-sm',
                    a.hoverBorder
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-200', a.iconBg)}>
                      <a.icon className={clsx('w-4 h-4', a.iconColor)} />
                    </div>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white transition-colors">
                      {a.label}
                    </span>
                  </div>
                  <span className="text-slate-500 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all text-xs font-mono">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Subtle Section Divider */}
      <div className="h-px bg-gradient-to-r from-transparent via-navy-700/60 to-transparent" />

      {/* 4. Detected Network Communities */}
      <div className="card bg-navy-900/90 border border-navy-700/80 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-navy-800/80">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Shield className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className="text-base font-semibold text-white tracking-wide">Detected Network Communities</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-navy-800 text-slate-400 border border-navy-700">
              {COMMUNITIES.length} Clusters
            </span>
          </div>
          <button
            onClick={() => navigate('/graph')}
            className="btn-ghost text-xs hover:text-purple-400 flex items-center gap-1 py-1 px-2.5 font-medium transition-colors"
          >
            <span>Open Graph View</span>
            <span className="text-purple-400 font-bold">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMUNITIES.map(c => (
            <div
              key={c.id}
              className="relative p-4 rounded-xl bg-navy-800/60 border border-navy-700/60 hover:border-purple-500/50 hover:bg-navy-800/90 hover:scale-[1.01] transition-all duration-200 cursor-pointer group shadow-sm flex flex-col justify-between"
              onClick={() => navigate('/graph')}
            >
              {/* Network Graph Icon Illustration in Top-Right Corner */}
              <div className="absolute top-3.5 right-3.5">
                <div
                  className="w-7 h-7 rounded-lg bg-navy-950 border border-navy-700/80 group-hover:border-purple-500/40 group-hover:bg-purple-950/30 flex items-center justify-center text-purple-400/80 group-hover:text-purple-300 transition-colors shadow-inner"
                  title="Community Graph Cluster"
                >
                  <Network className="w-3.5 h-3.5" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2 pr-8">
                  <span className={clsx('badge-role text-[9px] border', c.suspicionLevel === 'high' ? 'bg-red-900/40 text-red-400 border-red-800' : 'bg-yellow-900/40 text-yellow-400 border-yellow-800')}>
                    {c.suspicionLevel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">{c.id}</span>
                </div>

                <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate mb-3 pr-8" title={c.name}>
                  {c.name}
                </div>

                <div className="flex items-baseline gap-2 mb-1">
                  <div className="text-3xl font-bold font-mono text-white tracking-tight">{c.memberIds.length}</div>
                  <span className="text-xs text-slate-400">members</span>
                </div>
                <div className="text-xs text-slate-500 mb-3">
                  {c.bridgeNodeIds.length} bridge node{c.bridgeNodeIds.length !== 1 ? 's' : ''} detected
                </div>
              </div>

              {/* Prominent Cohesion Bar */}
              <div className="pt-2.5 border-t border-navy-700/50">
                <div className="flex justify-between items-center text-[11px] mb-1.5">
                  <span className="text-slate-400 font-medium">Cohesion Index</span>
                  <span className="font-mono text-purple-300 font-bold">{(c.cohesionScore * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-navy-950 border border-navy-700/80 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-400 shadow-[0_0_8px_rgba(168,85,247,0.3)] transition-all duration-500"
                    style={{ width: `${c.cohesionScore * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
