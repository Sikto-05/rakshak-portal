import { useState, useMemo } from 'react';
import { Search, Filter, User, Phone, Car, MapPin, Building, Briefcase, ChevronRight, Star, AlertTriangle, CheckCircle, X, Eye, Bot } from 'lucide-react';
import { ALL_ENTITIES, PERSONS, PHONES, VEHICLES, LOCATIONS, CASES, getRelationshipsForEntity, ENTITY_RESOLUTION_GROUPS } from '../data/syntheticData';
import { useAuth } from '../context/AuthContext';
import { ROLE_PERMISSIONS } from '../config/roles';
import type { Entity, EntityType } from '../types';
import { clsx } from 'clsx';

const ENTITY_ICONS: Record<EntityType, React.ElementType> = {
  person: User, phone: Phone, vehicle: Car, location: MapPin,
  organization: Building, case: Briefcase, financial: Star,
};
const ENTITY_COLORS: Record<EntityType, string> = {
  person: 'text-blue-400 bg-blue-900/30 border-blue-800/50',
  phone: 'text-emerald-400 bg-emerald-900/30 border-emerald-800/50',
  vehicle: 'text-orange-400 bg-orange-900/30 border-orange-800/50',
  location: 'text-red-400 bg-red-900/30 border-red-800/50',
  organization: 'text-purple-400 bg-purple-900/30 border-purple-800/50',
  case: 'text-amber-400 bg-amber-900/30 border-amber-800/50',
  financial: 'text-cyan-400 bg-cyan-900/30 border-cyan-800/50',
};

function maskPhone(num: string) {
  return num.replace(/(\+91-)(\d{5})(\d{5})/, '$1$2*****');
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 0.85 ? 'bg-emerald-500' : value >= 0.65 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="confidence-bar flex-1"><div className={`h-full rounded-full ${color}`} style={{ width: `${value * 100}%` }} /></div>
      <span className="text-xs text-slate-400 w-8 text-right">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}

function EntityCard({ entity, onSelect, canSeeUnmasked }: { entity: Entity; onSelect: (e: Entity) => void; canSeeUnmasked: boolean }) {
  const Icon = ENTITY_ICONS[entity.type];
  const colorClass = ENTITY_COLORS[entity.type];
  const rels = getRelationshipsForEntity(entity.id);
  const person = entity.type === 'person' ? entity as typeof PERSONS[0] : null;

  return (
    <div
      className="card hover:border-navy-600 transition-all cursor-pointer group"
      onClick={() => onSelect(entity)}
    >
      <div className="flex items-start gap-3">
        <div className={clsx('w-9 h-9 rounded-lg border flex items-center justify-center shrink-0', colorClass)}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-slate-100">{entity.label}</span>
            {entity.flagged && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
            {person?.networkRole && (
              <span className="tag-hypothesis text-[9px]"><Bot className="w-2.5 h-2.5" /> {person.networkRole}</span>
            )}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-mono">{entity.id}</div>
          {entity.aliases && entity.aliases.length > 0 && (
            <div className="text-xs text-slate-500 mt-1">
              <span className="text-slate-600">Also known as: </span>
              {entity.aliases.slice(0, 3).join(', ')}
            </div>
          )}
          {person && (
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-400">
              {person.attributes.age && <span>Age: {person.attributes.age}</span>}
              {person.attributes.state && <span>{person.attributes.state}</span>}
              {person.attributes.phone && (
                <span className="font-mono">
                  {canSeeUnmasked ? person.attributes.phone : maskPhone(person.attributes.phone)}
                </span>
              )}
              {person.attributes.occupation && <span className="truncate">{person.attributes.occupation}</span>}
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="text-xs text-slate-500">{rels.length} links</span>
          {person?.importanceScore && (
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-400" />
              <span className="text-xs text-amber-400">{person.importanceScore}</span>
            </div>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 mt-1" />
        </div>
      </div>
    </div>
  );
}

function EntityDrawer({ entity, onClose, canSeeUnmasked }: { entity: Entity; onClose: () => void; canSeeUnmasked: boolean }) {
  const rels = getRelationshipsForEntity(entity.id);
  const person = entity.type === 'person' ? entity as typeof PERSONS[0] : null;
  const Icon = ENTITY_ICONS[entity.type];
  const colorClass = ENTITY_COLORS[entity.type];

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-navy-900 border-l border-navy-700 shadow-2xl flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-navy-700">
        <div className="flex items-center gap-3">
          <div className={clsx('w-9 h-9 rounded-lg border flex items-center justify-center', colorClass)}>
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">{entity.label}</div>
            <div className="text-[10px] text-slate-500 font-mono">{entity.id}</div>
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Aliases / Entity Resolution */}
        {entity.aliases && entity.aliases.length > 0 && (
          <div className="card bg-amber-950/20 border-amber-800/30">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-amber-400">Entity Resolution — Known Aliases</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {entity.aliases.map(a => (
                <span key={a} className="text-xs bg-navy-800 border border-navy-700 text-slate-300 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
            {ENTITY_RESOLUTION_GROUPS.find(g => g.canonicalId === entity.id) && (
              <div className="mt-2 text-[10px] text-amber-400/70">
                Method: {ENTITY_RESOLUTION_GROUPS.find(g => g.canonicalId === entity.id)?.method} · Confidence: {((ENTITY_RESOLUTION_GROUPS.find(g => g.canonicalId === entity.id)?.confidence || 0) * 100).toFixed(0)}%
              </div>
            )}
          </div>
        )}

        {/* Attributes */}
        <div>
          <div className="label-text mb-2">Profile Details</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(entity.attributes).filter(([k]) => !['knownAssociates', 'maskedNumber'].includes(k)).map(([k, v]) => (
              <div key={k} className="bg-navy-800/50 border border-navy-700/40 rounded-lg px-3 py-2">
                <div className="text-[10px] text-slate-500 capitalize">{k.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-xs text-slate-300 mt-0.5 break-words">
                  {k === 'phone'
                    ? (canSeeUnmasked ? String(v) : maskPhone(String(v)))
                    : typeof v === 'boolean' ? (v ? 'Yes' : 'No') : String(v)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Why important */}
        {person && person.importanceScore && person.importanceScore > 50 && (
          <div className="card bg-purple-950/20 border-purple-800/30">
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs font-semibold text-purple-400">Why is this person important?</span>
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex justify-between"><span>Importance Score</span><span className="text-white font-semibold">{person.importanceScore}/100</span></div>
              <div className="flex justify-between"><span>Betweenness Centrality</span><span className="text-white">{((person.betweennessScore || 0) * 100).toFixed(0)}%</span></div>
              <div className="flex justify-between"><span>Network Role (AI)</span><span className="tag-hypothesis">{person.networkRole || 'unknown'}</span></div>
              <div className="flex justify-between"><span>Cases Involved</span><span className="text-white">{(person.caseIds || []).length}</span></div>
              <div className="flex justify-between"><span>Known Connections</span><span className="text-white">{rels.length}</span></div>
              {(person.betweennessScore || 0) > 0.7 && (
                <div className="mt-2 p-2 rounded-lg bg-orange-950/30 border border-orange-800/30 text-orange-400 text-[10px]">
                  ⚠ High betweenness score — possible bridge node connecting separate networks. Requires human verification.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Relationships */}
        <div>
          <div className="label-text mb-2">Connections ({rels.length})</div>
          <div className="space-y-2">
            {rels.slice(0, 8).map(r => {
              const other = r.sourceId === entity.id ? r.targetId : r.sourceId;
              return (
                <div key={r.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-navy-800/50 border border-navy-700/40">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono text-slate-500">{other}</span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-500 bg-navy-700 px-1.5 py-0.5 rounded">{r.type.replace(/_/g, ' ')}</span>
                    </div>
                    <ConfidenceBar value={r.confidence} />
                  </div>
                  <div>
                    {r.verificationStatus === 'verified' && <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />}
                    {r.verificationStatus === 'ai-hypothesis' && <Bot className="w-3.5 h-3.5 text-amber-500" />}
                    {r.verificationStatus === 'uncertain' && <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />}
                  </div>
                </div>
              );
            })}
            {rels.length > 8 && <div className="text-xs text-slate-600 pl-2">+{rels.length - 8} more connections</div>}
          </div>
        </div>

        {/* Evidence */}
        <div>
          <div className="label-text mb-2">Evidence Sources</div>
          <div className="space-y-2">
            {rels.slice(0, 3).flatMap(r => r.evidenceSources).slice(0, 5).map(es => (
              <div key={es.id} className="p-3 rounded-lg bg-navy-800/50 border border-navy-700/40">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-500 bg-navy-700 px-1.5 py-0.5 rounded">{es.type}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{es.documentId}</span>
                </div>
                <div className="text-xs text-slate-300">{es.title}</div>
                {es.excerpt && <div className="text-[10px] text-slate-500 mt-1 italic">"{es.excerpt}"</div>}
                <div className="text-[10px] text-slate-600 mt-1">{new Date(es.timestamp).toLocaleString('en-IN')} · {es.addedBy}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EntitySearch() {
  const { user } = useAuth();
  const perms = user ? ROLE_PERMISSIONS[user.role] : null;
  const canSeeUnmasked = perms?.canViewUnmaskedPhones ?? false;

  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<EntityType | 'all'>('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selected, setSelected] = useState<Entity | null>(null);

  const STATES = ['all', 'Uttar Pradesh', 'Maharashtra', 'Delhi', 'Karnataka', 'Haryana', 'Telangana', 'Madhya Pradesh'];

  const filtered = useMemo(() => {
    let results = ALL_ENTITIES;
    if (typeFilter !== 'all') results = results.filter(e => e.type === typeFilter);
    if (stateFilter !== 'all') {
      results = results.filter(e => {
        const attrs = e.attributes as Record<string, string>;
        return attrs.state === stateFilter;
      });
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(e =>
        e.label.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q) ||
        (e.aliases || []).some(a => a.toLowerCase().includes(q)) ||
        Object.values(e.attributes).some(v => String(v).toLowerCase().includes(q))
      );
    }
    return results;
  }, [query, typeFilter, stateFilter]);

  const TYPES: Array<{ value: EntityType | 'all'; label: string }> = [
    { value: 'all', label: 'All Types' },
    { value: 'person', label: 'Persons' },
    { value: 'phone', label: 'Phones' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'location', label: 'Locations' },
    { value: 'case', label: 'Cases' },
  ];

  return (
    <div className="space-y-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Entity Search & Resolution</h2>
          <p className="text-sm text-slate-500 mt-0.5">{ALL_ENTITIES.length} entities indexed · NLP-powered alias detection</p>
        </div>
      </div>

      {/* Entity Resolution Banner */}
      <div className="card bg-amber-950/20 border-amber-800/30">
        <div className="flex items-start gap-3">
          <Bot className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-sm font-semibold text-amber-400 mb-1">Entity Resolution Active</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              The system automatically recognises name variants as the same person using phonetic and contextual NLP.
              Example: <span className="font-mono text-amber-300">"Mohammad Arif Sheikh"</span> = <span className="font-mono text-amber-300">"Md. Arif"</span> = <span className="font-mono text-amber-300">"M. Arif Sheikh"</span> (Confidence: 93%)
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="input-field pl-9"
            placeholder="Search by name, alias, ID, phone, vehicle registration…"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as EntityType | 'all')} className="input-field w-auto text-xs">
            {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="input-field w-auto text-xs">
            {STATES.map(s => <option key={s} value={s}>{s === 'all' ? 'All States' : s}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          Showing <span className="text-white font-semibold">{filtered.length}</span> results
          {!canSeeUnmasked && <span className="text-slate-500 text-xs ml-2">· Phone numbers masked (upgrade role to unmask)</span>}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Eye className="w-3.5 h-3.5" />
          {canSeeUnmasked ? 'Full data visible' : 'Restricted view'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(entity => (
          <EntityCard key={entity.id} entity={entity} onSelect={setSelected} canSeeUnmasked={canSeeUnmasked} />
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 text-center py-16 text-slate-500">
            <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <div className="text-sm">No entities match your search.</div>
            <div className="text-xs mt-1">Try a name, alias, case number, or registration plate</div>
          </div>
        )}
      </div>

      {selected && <EntityDrawer entity={selected} onClose={() => setSelected(null)} canSeeUnmasked={canSeeUnmasked} />}
    </div>
  );
}
