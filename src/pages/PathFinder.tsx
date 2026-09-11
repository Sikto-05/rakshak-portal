import { useState } from 'react';
import { GitMerge, Search, ChevronRight, CheckCircle, AlertTriangle, Bot, ArrowRight } from 'lucide-react';
import { ALL_ENTITIES, PERSONS, findShortestPath, getEntityById, RELATIONSHIPS } from '../data/syntheticData';
import type { Entity } from '../types';
import { clsx } from 'clsx';

function EntityPicker({ label, value, onChange }: { label: string; value: Entity | null; onChange: (e: Entity) => void }) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);

  const results = query.trim()
    ? PERSONS.filter(p => p.label.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  return (
    <div className="relative">
      <label className="label-text block mb-1.5">{label}</label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <input
          type="text"
          value={value ? value.label : query}
          onChange={e => { setQuery(e.target.value); onChange(null as unknown as Entity); setOpen(true); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 200)}
          className="input-field pl-9"
          placeholder="Search for a person…"
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-20 top-full left-0 right-0 mt-1 bg-navy-800 border border-navy-600 rounded-xl shadow-2xl overflow-hidden">
          {results.map(p => (
            <button key={p.id} onMouseDown={() => { onChange(p); setQuery(''); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-navy-700 transition-colors text-left">
              <div className="w-7 h-7 rounded-full bg-blue-900/40 border border-blue-800/50 flex items-center justify-center text-blue-400 text-xs font-bold">{p.label[0]}</div>
              <div>
                <div className="text-sm text-slate-200">{p.label}</div>
                <div className="text-[10px] text-slate-500 font-mono">{p.id} · {p.attributes.state}</div>
              </div>
              {p.flagged && <AlertTriangle className="w-3.5 h-3.5 text-orange-400 ml-auto" />}
            </button>
          ))}
        </div>
      )}
      {value && (
        <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/20 border border-blue-800/30">
          <div className="w-6 h-6 rounded-full bg-blue-900/50 border border-blue-700 flex items-center justify-center text-blue-400 text-xs font-bold">{value.label[0]}</div>
          <div>
            <div className="text-xs font-semibold text-slate-200">{value.label}</div>
            <div className="text-[10px] text-slate-500 font-mono">{value.id}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PathFinder() {
  const [from, setFrom] = useState<Entity | null>(null);
  const [to, setTo] = useState<Entity | null>(null);
  const [result, setResult] = useState<ReturnType<typeof findShortestPath> | null | 'not-found'>(null);
  const [loading, setLoading] = useState(false);

  const handleFind = async () => {
    if (!from || !to) return;
    setLoading(true);
    setResult(null);
    await new Promise(r => setTimeout(r, 1000));
    const path = findShortestPath(from.id, to.id);
    setResult(path || 'not-found');
    setLoading(false);
  };

  const pathResult = result !== 'not-found' ? result : null;
  const pathEntities = pathResult ? pathResult.path.map(id => getEntityById(id)).filter(Boolean) as Entity[] : [];

  const totalConf = pathResult
    ? pathResult.edges.reduce((s, e) => s + e.confidence, 0) / Math.max(pathResult.edges.length, 1)
    : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">Investigation Path Finder</h2>
        <p className="text-sm text-slate-500 mt-0.5">Find the shortest evidence-backed path between two entities in the network</p>
      </div>

      {/* Input */}
      <div className="card">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <EntityPicker label="From — Entity A" value={from} onChange={setFrom} />
          <EntityPicker label="To — Entity B" value={to} onChange={setTo} />
        </div>
        <button
          onClick={handleFind}
          disabled={!from || !to || loading}
          className="btn-primary flex items-center gap-2"
        >
          {loading ? (
            <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Finding path…</>
          ) : (
            <><GitMerge className="w-4 h-4" /> Find Connection Path</>
          )}
        </button>
      </div>

      {/* Not found */}
      {result === 'not-found' && (
        <div className="card bg-red-950/20 border-red-800/30 text-center py-8">
          <div className="text-red-400 text-sm font-semibold mb-1">No path found</div>
          <div className="text-slate-500 text-xs">These entities are not connected in the current network snapshot.</div>
        </div>
      )}

      {/* Result */}
      {pathResult && pathEntities.length > 0 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="card bg-emerald-950/20 border-emerald-800/30">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-400">Path Found</span>
              <span className="tag-hypothesis text-[10px] ml-auto"><Bot className="w-2.5 h-2.5" /> AI Analysis — Verify before operational use</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{pathResult.path.length}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Nodes in path</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{pathResult.edges.length}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">Hops</div>
              </div>
              <div>
                <div className={clsx('text-2xl font-bold', totalConf >= 0.8 ? 'text-emerald-400' : totalConf >= 0.6 ? 'text-amber-400' : 'text-red-400')}>
                  {(totalConf * 100).toFixed(0)}%
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Avg. confidence</div>
              </div>
            </div>
          </div>

          {/* Path visualization */}
          <div className="card">
            <h3 className="section-header mb-4"><GitMerge className="w-4 h-4 text-amber-400" /> Path Trace</h3>
            <div className="space-y-3">
              {pathEntities.map((entity, i) => (
                <div key={entity.id}>
                  {/* Node */}
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/60 border border-navy-700/50">
                    <div className={clsx('w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0', i === 0 ? 'bg-blue-900/50 border-2 border-blue-500 text-blue-300' : i === pathEntities.length - 1 ? 'bg-emerald-900/50 border-2 border-emerald-500 text-emerald-300' : 'bg-navy-700 border border-navy-600 text-slate-300')}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-slate-100">{entity.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{entity.id} · {entity.type}</div>
                      {(entity as { networkRole?: string }).networkRole && (
                        <div className="tag-hypothesis text-[9px] mt-1"><Bot className="w-2 h-2" /> Role: {(entity as { networkRole: string }).networkRole}</div>
                      )}
                    </div>
                    {i === 0 && <span className="text-xs text-blue-400 font-semibold shrink-0">START</span>}
                    {i === pathEntities.length - 1 && <span className="text-xs text-emerald-400 font-semibold shrink-0">END</span>}
                  </div>

                  {/* Edge between nodes */}
                  {i < pathResult.edges.length && (() => {
                    const edge = pathResult.edges[i];
                    const evidenceCount = edge.evidenceSources.length;
                    return (
                      <div className="flex items-center gap-3 pl-4 py-2">
                        <div className="w-0.5 h-full bg-navy-700 self-stretch ml-4" />
                        <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] bg-navy-800 border border-navy-700 text-slate-400 px-2 py-0.5 rounded">{edge.type.replace(/_/g, ' ')}</span>
                            {edge.verificationStatus === 'verified'
                              ? <span className="tag-verified text-[9px]"><CheckCircle className="w-2 h-2" /> Verified</span>
                              : <span className="tag-hypothesis text-[9px]"><Bot className="w-2 h-2" /> {edge.verificationStatus}</span>}
                            <span className="text-[10px] text-slate-500">Confidence: {(edge.confidence * 100).toFixed(0)}%</span>
                          </div>
                          {/* Evidence sources */}
                          {edge.evidenceSources.slice(0, 2).map(es => (
                            <div key={es.id} className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="bg-navy-700 px-1.5 py-0.5 rounded text-[9px] uppercase text-slate-400">{es.type}</span>
                              <span className="font-mono">{es.documentId}</span>
                              <span className="text-slate-600">·</span>
                              <span>{new Date(es.timestamp).toLocaleDateString('en-IN')}</span>
                            </div>
                          ))}
                          {evidenceCount > 2 && <div className="text-[9px] text-slate-600 mt-0.5">+{evidenceCount - 2} more evidence sources</div>}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              ))}
            </div>
          </div>

          {/* All evidence */}
          <div className="card">
            <h3 className="section-header mb-3">Complete Evidence Trail ({pathResult.edges.flatMap(e => e.evidenceSources).length} records)</h3>
            <div className="space-y-2">
              {pathResult.edges.flatMap(e => e.evidenceSources).map(es => (
                <div key={es.id} className="flex items-start gap-3 p-3 rounded-lg bg-navy-800/50 border border-navy-700/40">
                  <span className="text-[9px] uppercase font-semibold bg-navy-700 text-slate-400 px-1.5 py-1 rounded shrink-0">{es.type}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-slate-200">{es.title}</div>
                    {es.excerpt && <div className="text-[10px] text-slate-500 italic mt-0.5">"{es.excerpt}"</div>}
                    <div className="text-[10px] text-slate-600 mt-1 font-mono">{es.documentId} · {new Date(es.timestamp).toLocaleString('en-IN')} · {es.addedBy}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Demo prompts */}
      {!result && !loading && (
        <div className="card bg-navy-800/40">
          <div className="text-xs text-slate-400 mb-3">Try these example paths:</div>
          <div className="space-y-2">
            {[
              { from: PERSONS.find(p => p.id === 'P-001')!, to: PERSONS.find(p => p.id === 'P-005')!, label: 'Arif Sheikh → Imran Qureshi (cross-network)' },
              { from: PERSONS.find(p => p.id === 'P-008')!, to: PERSONS.find(p => p.id === 'P-004')!, label: 'Rohan Mehta → Vijay Mishra (financial link)' },
            ].filter(ex => ex.from && ex.to).map(ex => (
              <button key={ex.label} onClick={() => { setFrom(ex.from); setTo(ex.to); }} className="w-full text-left text-xs px-3 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 border border-navy-700 text-slate-300 hover:text-amber-400 transition-colors flex items-center justify-between">
                {ex.label}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
