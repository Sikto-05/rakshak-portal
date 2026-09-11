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

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeCases = CASES.filter(c => c.attributes.status === 'active' || c.attributes.status === 'under-investigation');
  const flaggedPersons = PERSONS.filter(p => p.flagged);
  const avgConf = (NETWORK_STATS.avgConfidence * 100).toFixed(1);
  const verifiedPct = Math.round((NETWORK_STATS.verifiedRelationships / NETWORK_STATS.totalRelationships) * 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 17 ? 'Good afternoon' : 'Good evening'},{' '}
            <span className="text-gradient-amber">{user?.name.split(' ').slice(-1)[0]}</span>
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            {ROLE_LABELS[user!.role]} · {user?.station} · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-navy-900 border border-navy-700 rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse-subtle" />
          System Operational
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Entities', value: NETWORK_STATS.totalEntities, sub: `${PERSONS.length} persons`, icon: Users, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-800/40' },
          { label: 'Relationships', value: NETWORK_STATS.totalRelationships, sub: `${verifiedPct}% verified`, icon: Network, color: 'text-purple-400', bg: 'bg-purple-900/20 border-purple-800/40' },
          { label: 'Active Cases', value: NETWORK_STATS.activeCases, sub: `${CASES.length} total FIRs`, icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-900/20 border-amber-800/40' },
          { label: 'Avg. Confidence', value: `${avgConf}%`, sub: `${NETWORK_STATS.bridgeNodes} bridge nodes`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-800/40' },
        ].map(card => (
          <div key={card.label} className={clsx('card border', card.bg, 'flex flex-col gap-3')}>
            <div className="flex items-center justify-between">
              <span className="label-text">{card.label}</span>
              <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', card.bg)}>
                <card.icon className={clsx('w-4 h-4', card.color)} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white">{card.value}</div>
            <div className="text-xs text-slate-500">{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Cases */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-header"><BookOpen className="w-4 h-4 text-amber-400" /> Active Cases</h3>
            <button onClick={() => navigate('/evidence')} className="btn-ghost text-xs">View All →</button>
          </div>
          <div className="space-y-3">
            {activeCases.map(c => (
              <div key={c.id} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700/40 hover:border-navy-600 transition-colors cursor-pointer" onClick={() => navigate('/entities')}>
                <div className="mt-0.5">{STATUS_ICON[c.attributes.status] || <Clock className="w-3 h-3 text-slate-500" />}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-slate-200 truncate">{c.label}</span>
                    <span className={clsx('badge-role text-[9px] border', SEVERITY_CLASS[c.attributes.severity])}>{c.attributes.severity}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 truncate">{c.attributes.title}</div>
                  <div className="text-[10px] text-slate-600 mt-1">{c.attributes.policeStation} · {c.attributes.state}</div>
                </div>
                <div className="text-[10px] text-slate-600 shrink-0">{new Date(c.createdAt).toLocaleDateString('en-IN')}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Network Status */}
        <div className="space-y-4">
          {/* Verification Status */}
          <div className="card">
            <h3 className="section-header mb-4"><CheckCircle className="w-4 h-4 text-emerald-400" /> Evidence Status</h3>
            <div className="space-y-3">
              {[
                { label: 'Verified', count: NETWORK_STATS.verifiedRelationships, color: 'bg-emerald-500', textColor: 'text-emerald-400' },
                { label: 'AI Hypothesis', count: RELATIONSHIPS.filter(r => r.verificationStatus === 'ai-hypothesis').length, color: 'bg-amber-500', textColor: 'text-amber-400' },
                { label: 'Uncertain', count: RELATIONSHIPS.filter(r => r.verificationStatus === 'uncertain').length, color: 'bg-yellow-600', textColor: 'text-yellow-400' },
                { label: 'Contradictions', count: NETWORK_STATS.flaggedContradictions, color: 'bg-red-500', textColor: 'text-red-400' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className={item.textColor}>{item.label}</span>
                    <span className="text-slate-400">{item.count}</span>
                  </div>
                  <div className="confidence-bar">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${(item.count / NETWORK_STATS.totalRelationships) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Flagged Entities */}
          <div className="card">
            <h3 className="section-header mb-3"><AlertTriangle className="w-4 h-4 text-orange-400" /> Flagged Entities</h3>
            <div className="space-y-2">
              {flaggedPersons.slice(0, 4).map(p => (
                <div key={p.id} className="flex items-center gap-2 text-sm cursor-pointer hover:text-amber-400 transition-colors" onClick={() => navigate('/entities')}>
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-slate-300 truncate">{p.label}</span>
                  <span className={clsx('text-xs ml-auto', CONFIDENCE_COLOR(p.importanceScore! / 100))}>{p.importanceScore}</span>
                </div>
              ))}
              {flaggedPersons.length > 4 && <div className="text-xs text-slate-600 pt-1">+{flaggedPersons.length - 4} more flagged</div>}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="section-header mb-3"><Activity className="w-4 h-4 text-blue-400" /> Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: 'View Knowledge Graph', icon: Network, path: '/graph' },
                { label: 'Investigation Path Finder', icon: GitMerge, path: '/pathfinder' },
                { label: 'Geo Intelligence Map', icon: Map, path: '/map' },
              ].map(a => (
                <button key={a.label} onClick={() => navigate(a.path)} className="w-full flex items-center gap-2 btn-secondary py-2 text-left text-xs">
                  <a.icon className="w-3.5 h-3.5 text-amber-400" />
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Communities */}
      <div className="card">
        <h3 className="section-header mb-4"><Shield className="w-4 h-4 text-purple-400" /> Detected Network Communities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COMMUNITIES.map(c => (
            <div key={c.id} className="p-4 rounded-xl bg-navy-800/60 border border-navy-700/50 hover:border-navy-600 transition-colors cursor-pointer" onClick={() => navigate('/graph')}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300 truncate">{c.name}</span>
                <span className={clsx('badge-role text-[9px] border', c.suspicionLevel === 'high' ? 'bg-red-900/40 text-red-400 border-red-800' : 'bg-yellow-900/40 text-yellow-400 border-yellow-800')}>{c.suspicionLevel}</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{c.memberIds.length}</div>
              <div className="text-xs text-slate-500 mb-2">members · {c.bridgeNodeIds.length} bridge node{c.bridgeNodeIds.length !== 1 ? 's' : ''}</div>
              <div className="confidence-bar">
                <div className="h-full rounded-full bg-purple-500" style={{ width: `${c.cohesionScore * 100}%` }} />
              </div>
              <div className="text-[10px] text-slate-600 mt-1">Cohesion: {(c.cohesionScore * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
