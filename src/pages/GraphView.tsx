import { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import { ALL_ENTITIES, RELATIONSHIPS, COMMUNITIES, TEMPORAL_SNAPSHOTS, getEntityById } from '../data/syntheticData';
import type { Entity, Relationship } from '../types';
import { Network, Layers, Clock, Filter, ZoomIn, ZoomOut, Maximize, RefreshCw, AlertTriangle, CheckCircle, Bot, X, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

const NODE_COLORS: Record<string, string> = {
  person: '#3b82f6',
  phone: '#10b981',
  vehicle: '#f59e0b',
  location: '#ef4444',
  organization: '#a855f7',
  case: '#f59e0b',
  financial: '#06b6d4',
};

const EDGE_COLORS: Record<string, string> = {
  verified: '#10b981',
  'ai-hypothesis': '#f59e0b',
  uncertain: '#eab308',
  rejected: '#ef4444',
  unverified: '#64748b',
};

function buildCyElements(entityIds: string[], relIds: string[]) {
  const nodes = entityIds.map(id => {
    const e = getEntityById(id);
    if (!e) return null;
    return {
      data: {
        id: e.id,
        label: e.label.split(' ').slice(0, 2).join(' '),
        fullLabel: e.label,
        type: e.type,
        flagged: (e as { flagged?: boolean }).flagged,
        importance: (e as { importanceScore?: number }).importanceScore || 50,
        betweenness: (e as { betweennessScore?: number }).betweennessScore || 0,
      },
    };
  }).filter(Boolean);

  const edges = relIds.map(id => {
    const r = RELATIONSHIPS.find(rel => rel.id === id);
    if (!r) return null;
    if (!entityIds.includes(r.sourceId) || !entityIds.includes(r.targetId)) return null;
    return {
      data: {
        id: r.id,
        source: r.sourceId,
        target: r.targetId,
        type: r.type,
        confidence: r.confidence,
        status: r.verificationStatus,
        evidenceCount: r.evidenceSources.length,
        contradiction: r.flagContradiction,
      },
    };
  }).filter(Boolean);

  return [...nodes, ...edges] as cytoscape.ElementDefinition[];
}

export default function GraphView() {
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<cytoscape.Core | null>(null);
  const [selectedNode, setSelectedNode] = useState<Entity | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Relationship | null>(null);
  const [period, setPeriod] = useState(TEMPORAL_SNAPSHOTS.length - 1);
  const [filterType, setFilterType] = useState<string>('all');
  const [showCommunities, setShowCommunities] = useState(true);
  const [layout, setLayout] = useState<'cose' | 'circle' | 'grid'>('cose');

  const snapshot = TEMPORAL_SNAPSHOTS[period];

  useEffect(() => {
    if (!cyRef.current) return;

    const elements = buildCyElements(snapshot.entityIds, snapshot.relationshipIds);
    const filteredElements = filterType === 'all'
      ? elements
      : elements.filter(el => !el.data.source || (getEntityById(el.data.source)?.type === filterType || getEntityById(el.data.target)?.type === filterType));

    if (cyInstance.current) {
      cyInstance.current.destroy();
    }

    const cy = cytoscape({
      container: cyRef.current,
      elements: filteredElements,
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: cytoscape.NodeSingular) => NODE_COLORS[ele.data('type') as string] || '#64748b',
            'border-width': (ele: cytoscape.NodeSingular) => ele.data('flagged') ? 3 : 1.5,
            'border-color': (ele: cytoscape.NodeSingular) => ele.data('flagged') ? '#f97316' : 'rgba(255,255,255,0.15)',
            'label': 'data(label)',
            'color': '#e2e8f0',
            'font-size': 11,
            'font-family': 'Inter, sans-serif',
            'text-valign': 'bottom',
            'text-margin-y': 5,
            'text-outline-color': '#0b1120',
            'text-outline-width': 2,
            'width': (ele: cytoscape.NodeSingular) => 20 + (ele.data('importance') || 50) / 10,
            'height': (ele: cytoscape.NodeSingular) => 20 + (ele.data('importance') || 50) / 10,
            'opacity': 0.92,
          },
        },
        {
          selector: 'node[type = "person"]',
          style: { shape: 'ellipse' },
        },
        {
          selector: 'node[type = "location"]',
          style: { shape: 'diamond' },
        },
        {
          selector: 'node[type = "vehicle"]',
          style: { shape: 'round-rectangle' },
        },
        {
          selector: 'node[type = "case"]',
          style: { shape: 'hexagon' },
        },
        {
          selector: 'node[type = "phone"]',
          style: { shape: 'round-triangle' },
        },
        {
          selector: 'edge',
          style: {
            'line-color': (ele: cytoscape.EdgeSingular) => EDGE_COLORS[ele.data('status') as string] || '#475569',
            'width': (ele: cytoscape.EdgeSingular) => 1 + (ele.data('confidence') as number) * 2,
            'target-arrow-color': (ele: cytoscape.EdgeSingular) => EDGE_COLORS[ele.data('status') as string] || '#475569',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.7,
            'label': (ele: cytoscape.EdgeSingular) => ele.data('contradiction') ? '⚠' : '',
            'color': '#ef4444',
            'font-size': 14,
          },
        },
        {
          selector: 'node:selected',
          style: {
            'border-color': '#f59e0b',
            'border-width': 3,
            'background-color': '#f59e0b',
            'color': '#0b1120',
          },
        },
        {
          selector: 'edge:selected',
          style: {
            'line-color': '#f59e0b',
            'width': 3,
            'target-arrow-color': '#f59e0b',
          },
        },
      ],
      layout: {
        name: layout,
        animate: true,
        animationDuration: 600,
        padding: 40,
        nodeRepulsion: 8000,
        idealEdgeLength: 120,
        randomize: false,
      } as Parameters<cytoscape.Core['layout']>[0],
      minZoom: 0.1,
      maxZoom: 4,
      wheelSensitivity: 0.3,
    });

    cy.on('tap', 'node', (evt) => {
      const id = evt.target.data('id') as string;
      const entity = getEntityById(id);
      if (entity) {
        setSelectedNode(entity);
        setSelectedEdge(null);
      }
    });

    cy.on('tap', 'edge', (evt) => {
      const id = evt.target.data('id') as string;
      const rel = RELATIONSHIPS.find(r => r.id === id);
      if (rel) {
        setSelectedEdge(rel);
        setSelectedNode(null);
      }
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        setSelectedNode(null);
        setSelectedEdge(null);
      }
    });

    // Community highlights
    if (showCommunities) {
      COMMUNITIES.forEach((comm, i) => {
        const colors = ['rgba(59,130,246,0.08)', 'rgba(168,85,247,0.08)', 'rgba(16,185,129,0.08)', 'rgba(245,158,11,0.08)'];
        comm.memberIds.forEach(pid => {
          const node = cy.getElementById(pid);
          if (node.length > 0) {
            node.style('background-opacity', 0.9);
          }
        });
      });
    }

    cyInstance.current = cy;

    return () => { cy.destroy(); cyInstance.current = null; };
  }, [period, filterType, layout, showCommunities]);

  const selectedRel = selectedEdge ? RELATIONSHIPS.find(r => r.id === selectedEdge.id) : null;

  return (
    <div className="flex gap-4 h-[calc(100vh-130px)]">
      {/* Controls sidebar */}
      <div className="w-64 shrink-0 flex flex-col gap-3">
        {/* Temporal slider */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Temporal View</span>
          </div>
          <input type="range" min={0} max={TEMPORAL_SNAPSHOTS.length - 1} value={period} onChange={e => setPeriod(Number(e.target.value))} className="w-full accent-amber-500" />
          <div className="flex justify-between text-[10px] text-slate-500 mt-1">
            <span>{TEMPORAL_SNAPSHOTS[0].period}</span>
            <span className="text-amber-400 font-semibold">{snapshot.period}</span>
            <span>{TEMPORAL_SNAPSHOTS[TEMPORAL_SNAPSHOTS.length - 1].period}</span>
          </div>
          {snapshot.newEntities.length > 0 && (
            <div className="mt-2 text-[10px] text-emerald-400">+{snapshot.newEntities.length} new entities this period</div>
          )}
        </div>

        {/* Filters */}
        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-semibold text-slate-300">Filter by Type</span>
          </div>
          <div className="space-y-1">
            {['all', 'person', 'phone', 'vehicle', 'location', 'case'].map(t => (
              <button key={t} onClick={() => setFilterType(t)} className={clsx('w-full text-left px-2.5 py-1.5 rounded text-xs transition-colors', filterType === t ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-navy-800')}>
                <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ backgroundColor: NODE_COLORS[t] || '#64748b' }} />
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Layout */}
        <div className="card">
          <div className="text-xs font-semibold text-slate-300 mb-2">Graph Layout</div>
          <div className="flex gap-1">
            {(['cose', 'circle', 'grid'] as const).map(l => (
              <button key={l} onClick={() => setLayout(l)} className={clsx('flex-1 py-1.5 text-[10px] rounded', layout === l ? 'bg-amber-500/20 text-amber-400' : 'btn-ghost')}>{l}</button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="card">
          <div className="text-xs font-semibold text-slate-300 mb-2">Legend</div>
          <div className="space-y-1.5 text-[10px] text-slate-400">
            {Object.entries(NODE_COLORS).slice(0, 5).map(([type, color]) => (
              <div key={type} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="capitalize">{type}</span>
              </div>
            ))}
            <div className="border-t border-navy-700 pt-1.5 mt-1.5">
              <div className="flex items-center gap-2"><span className="w-8 h-0.5 bg-emerald-500" />Verified</div>
              <div className="flex items-center gap-2 mt-1"><span className="w-8 h-0.5 bg-amber-500" />AI Hypothesis</div>
              <div className="flex items-center gap-2 mt-1"><span className="w-8 h-0.5 bg-red-500" />Uncertain/⚠</div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="card text-xs text-slate-400 space-y-1">
          <div className="flex justify-between"><span>Entities</span><span className="text-white">{snapshot.entityIds.length}</span></div>
          <div className="flex justify-between"><span>Relationships</span><span className="text-white">{snapshot.relationshipIds.length}</span></div>
          <div className="flex justify-between"><span>Communities</span><span className="text-white">{COMMUNITIES.length}</span></div>
        </div>
      </div>

      {/* Graph canvas */}
      <div className="flex-1 relative">
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2">
          <button className="btn-secondary p-2" onClick={() => cyInstance.current?.zoom(cyInstance.current.zoom() * 1.2)} title="Zoom in"><ZoomIn className="w-3.5 h-3.5" /></button>
          <button className="btn-secondary p-2" onClick={() => cyInstance.current?.zoom(cyInstance.current.zoom() / 1.2)} title="Zoom out"><ZoomOut className="w-3.5 h-3.5" /></button>
          <button className="btn-secondary p-2" onClick={() => cyInstance.current?.fit()} title="Fit to screen"><Maximize className="w-3.5 h-3.5" /></button>
          <button className="btn-secondary p-2" onClick={() => setLayout(l => l)} title="Re-layout"><RefreshCw className="w-3.5 h-3.5" /></button>
        </div>
        <div ref={cyRef} className="cy-container w-full h-full rounded-xl border border-navy-700" />

        {/* Node detail panel */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 w-72 card-glass p-4 rounded-xl border border-navy-600 z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-100">{selectedNode.label}</div>
              <button onClick={() => setSelectedNode(null)} className="text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="text-[10px] text-slate-500 font-mono mb-2">{selectedNode.id} · {selectedNode.type}</div>
            {(selectedNode as { networkRole?: string }).networkRole && (
              <div className="tag-hypothesis text-[10px] mb-2"><Bot className="w-2.5 h-2.5" /> AI Role: {(selectedNode as { networkRole: string }).networkRole}</div>
            )}
            {(selectedNode as { betweennessScore?: number }).betweennessScore && (selectedNode as { betweennessScore: number }).betweennessScore > 0.7 && (
              <div className="flex items-center gap-1.5 text-[10px] text-orange-400 bg-orange-950/30 border border-orange-800/30 rounded px-2 py-1">
                <AlertTriangle className="w-3 h-3" /> Bridge node — High betweenness centrality
              </div>
            )}
          </div>
        )}

        {/* Edge detail panel */}
        {selectedRel && (
          <div className="absolute bottom-4 left-4 w-80 card-glass p-4 rounded-xl border border-navy-600 z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-slate-100">Connection Detail</div>
              <button onClick={() => setSelectedEdge(null)} className="text-slate-500 hover:text-slate-300"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="text-xs text-slate-400 mb-2">
              <span className="text-slate-300 font-mono">{selectedRel.sourceId}</span>
              <ChevronRight className="w-3 h-3 inline mx-1" />
              <span className="text-slate-300 font-mono">{selectedRel.targetId}</span>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-navy-700 px-2 py-0.5 rounded text-slate-300">{selectedRel.type.replace(/_/g, ' ')}</span>
              {selectedRel.verificationStatus === 'verified' ? <span className="tag-verified text-[10px]"><CheckCircle className="w-2.5 h-2.5" /> Verified</span> : <span className="tag-hypothesis text-[10px]"><Bot className="w-2.5 h-2.5" /> {selectedRel.verificationStatus}</span>}
            </div>
            <div className="text-xs text-slate-500 mb-2">Confidence: <span className="text-white font-semibold">{(selectedRel.confidence * 100).toFixed(0)}%</span></div>
            {selectedRel.flagContradiction && (
              <div className="text-[10px] text-red-400 bg-red-950/30 border border-red-800/30 rounded px-2 py-1 mb-2">
                ⚠ Contradiction flagged: {selectedRel.contradictionNote}
              </div>
            )}
            <div className="text-[10px] text-slate-500">{selectedRel.evidenceSources.length} evidence source{selectedRel.evidenceSources.length !== 1 ? 's' : ''}</div>
          </div>
        )}
      </div>
    </div>
  );
}
