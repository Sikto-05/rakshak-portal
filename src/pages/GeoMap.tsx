import { useState } from 'react';
import { MapPin, Filter, Layers, Clock } from 'lucide-react';
import { LOCATIONS, PERSONS, RELATIONSHIPS } from '../data/syntheticData';
import { clsx } from 'clsx';

const LOCATION_COLORS: Record<string, string> = {
  'hideout': '#ef4444',
  'meeting-point': '#f59e0b',
  'crime-scene': '#dc2626',
  'residence': '#3b82f6',
  'transit': '#8b5cf6',
};

const INDIA_STATES = [
  'All States', 'Uttar Pradesh', 'Maharashtra', 'Delhi',
  'Karnataka', 'Haryana', 'Telangana', 'Madhya Pradesh',
];

export default function GeoMap() {
  const [stateFilter, setStateFilter] = useState('All States');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showMovements, setShowMovements] = useState(true);
  const [selectedLoc, setSelectedLoc] = useState<typeof LOCATIONS[0] | null>(null);

  const filteredLocs = LOCATIONS.filter(l => {
    if (stateFilter !== 'All States' && l.attributes.state !== stateFilter) return false;
    if (typeFilter !== 'all' && l.attributes.locationType !== typeFilter) return false;
    return true;
  });

  // Find persons at each location
  const personsAtLocation = (locId: string) =>
    PERSONS.filter(p => p.locationId === locId);

  // Build movement pairs (entities that appear at multiple locations)
  const movements = RELATIONSHIPS
    .filter(r => r.type === 'PRESENT_AT' || r.type === 'RESIDES_AT')
    .slice(0, 6);

  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-white">Geo Intelligence Map</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            India-specific geography · Country → State → District → Police Station
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/30 px-3 py-1.5 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          {filteredLocs.length} locations visible
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select value={stateFilter} onChange={e => setStateFilter(e.target.value)} className="input-field w-auto text-xs">
          {INDIA_STATES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="input-field w-auto text-xs">
          <option value="all">All Types</option>
          {['hideout', 'meeting-point', 'crime-scene', 'residence', 'transit'].map(t => (
            <option key={t} value={t}>{t.replace('-', ' ')}</option>
          ))}
        </select>
        <button
          onClick={() => setShowMovements(m => !m)}
          className={clsx('btn-secondary text-xs flex items-center gap-1.5', showMovements && 'border-amber-500/30 text-amber-400')}
        >
          <Layers className="w-3.5 h-3.5" /> Movement Lines
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Map placeholder / SVG India map */}
        <div className="lg:col-span-2 card p-0 overflow-hidden relative" style={{ minHeight: '520px' }}>
          {/* Dark India map SVG background */}
          <div className="absolute inset-0 bg-navy-950 flex items-center justify-center overflow-hidden">
            {/* Simple India map approximation using SVG */}
            <svg viewBox="0 0 400 460" className="w-full h-full opacity-20" fill="none">
              <path d="M160,30 L200,20 L240,35 L270,60 L280,100 L300,130 L310,160 L320,200 L330,230 L310,260 L290,290 L270,310 L250,340 L230,370 L210,400 L195,430 L180,400 L160,370 L140,340 L120,310 L100,280 L80,250 L70,220 L80,190 L90,160 L110,130 L120,100 L130,70 Z" stroke="#334155" strokeWidth="1.5" fill="#0f1829"/>
              <path d="M240,35 L270,30 L290,50 L300,80 L310,100 L300,130" stroke="#334155" strokeWidth="1"/>
              <path d="M80,250 L60,240 L50,220 L60,200 L70,220" stroke="#334155" strokeWidth="1"/>
            </svg>

            {/* Location pins */}
            {filteredLocs.map(loc => {
              // Map lat/lng to SVG coordinates (approximate India bounds)
              const x = ((loc.attributes.lng - 68) / (98 - 68)) * 360 + 20;
              const y = ((37 - loc.attributes.lat) / (37 - 8)) * 420 + 20;
              const color = LOCATION_COLORS[loc.attributes.locationType || 'residence'] || '#64748b';
              const isSelected = selectedLoc?.id === loc.id;

              return (
                <g key={loc.id} onClick={() => setSelectedLoc(loc)} className="cursor-pointer" transform={`translate(${x}, ${y})`}>
                  <circle r={isSelected ? 12 : 8} fill={color} opacity={0.9} stroke={isSelected ? '#f59e0b' : 'rgba(255,255,255,0.3)'} strokeWidth={isSelected ? 2 : 1} />
                  <circle r={isSelected ? 5 : 3} fill="white" opacity={0.9} />
                  {isSelected && <circle r={18} fill="transparent" stroke={color} strokeWidth="1.5" opacity={0.5} />}
                </g>
              );
            })}

            {/* Movement lines */}
            {showMovements && movements.slice(0, 4).map((rel, i) => {
              const srcPerson = PERSONS.find(p => p.id === rel.sourceId);
              const tgtLoc = LOCATIONS.find(l => l.id === rel.targetId);
              const srcLoc = srcPerson?.locationId ? LOCATIONS.find(l => l.id === srcPerson.locationId) : null;
              if (!srcLoc || !tgtLoc) return null;

              const x1 = ((srcLoc.attributes.lng - 68) / 30) * 360 + 20;
              const y1 = ((37 - srcLoc.attributes.lat) / 29) * 420 + 20;
              const x2 = ((tgtLoc.attributes.lng - 68) / 30) * 360 + 20;
              const y2 = ((37 - tgtLoc.attributes.lat) / 29) * 420 + 20;

              return (
                <line key={rel.id} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 3" opacity={0.5} />
              );
            })}
          </div>

          {/* Location tooltip */}
          {selectedLoc && (
            <div className="absolute bottom-4 left-4 right-4 card-glass border border-navy-600 p-4 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-slate-100 text-sm">{selectedLoc.label}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {selectedLoc.attributes.district} · {selectedLoc.attributes.state}
                  </div>
                  {selectedLoc.attributes.policeStation && (
                    <div className="text-[10px] text-slate-500 mt-0.5">PS: {selectedLoc.attributes.policeStation}</div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full border" style={{
                      color: LOCATION_COLORS[selectedLoc.attributes.locationType || ''] || '#64748b',
                      borderColor: LOCATION_COLORS[selectedLoc.attributes.locationType || ''] || '#64748b',
                      backgroundColor: (LOCATION_COLORS[selectedLoc.attributes.locationType || ''] || '#64748b') + '20',
                    }}>
                      {selectedLoc.attributes.locationType?.replace('-', ' ')}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {selectedLoc.attributes.lat.toFixed(4)}, {selectedLoc.attributes.lng.toFixed(4)}
                    </span>
                  </div>
                </div>
                <button onClick={() => setSelectedLoc(null)} className="text-slate-500 hover:text-slate-300 ml-4">✕</button>
              </div>
              {personsAtLocation(selectedLoc.id).length > 0 && (
                <div className="mt-3 pt-3 border-t border-navy-700">
                  <div className="text-[10px] text-slate-500 mb-1.5">Persons linked to this location:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {personsAtLocation(selectedLoc.id).map(p => (
                      <span key={p.id} className="text-[10px] bg-blue-900/30 border border-blue-800/50 text-blue-300 px-2 py-0.5 rounded-full">
                        {p.label}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Map overlay title */}
          <div className="absolute top-3 left-3 bg-navy-900/80 border border-navy-700 rounded-lg px-3 py-1.5 text-xs text-slate-400">
            India · Criminal Network Geo-Intelligence
          </div>
        </div>

        {/* Location list */}
        <div className="space-y-3">
          <div className="label-text">Location Directory ({filteredLocs.length})</div>
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredLocs.map(loc => {
              const persons = personsAtLocation(loc.id);
              const color = LOCATION_COLORS[loc.attributes.locationType || ''] || '#64748b';
              return (
                <button
                  key={loc.id}
                  onClick={() => setSelectedLoc(selectedLoc?.id === loc.id ? null : loc)}
                  className={clsx(
                    'w-full text-left p-3 rounded-xl border transition-all',
                    selectedLoc?.id === loc.id
                      ? 'bg-navy-800 border-amber-500/30'
                      : 'bg-navy-800/40 border-navy-700/50 hover:border-navy-600'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ backgroundColor: color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate">{loc.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{loc.attributes.district} · {loc.attributes.state}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ color, backgroundColor: color + '20', border: `1px solid ${color}50` }}>
                          {loc.attributes.locationType?.replace('-', ' ')}
                        </span>
                        {persons.length > 0 && (
                          <span className="text-[9px] text-slate-500">{persons.length} person{persons.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="card mt-2">
            <div className="label-text mb-2">Location Types</div>
            <div className="space-y-1.5">
              {Object.entries(LOCATION_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                  <span className="capitalize">{type.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* State drilldown */}
          <div className="card">
            <div className="label-text mb-2">Hierarchy Drilldown</div>
            <div className="text-[10px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400">🇮🇳</span>
                <span className="text-slate-300 font-medium">India</span>
              </div>
              <div className="flex items-center gap-1.5 pl-4">
                <span>↳</span>
                <span className={stateFilter === 'All States' ? 'text-amber-400' : 'text-slate-400'}>{stateFilter === 'All States' ? '8 states active' : stateFilter}</span>
              </div>
              {selectedLoc && (
                <>
                  <div className="flex items-center gap-1.5 pl-8">
                    <span>↳</span>
                    <span className="text-slate-300">{selectedLoc.attributes.district}</span>
                  </div>
                  {selectedLoc.attributes.policeStation && (
                    <div className="flex items-center gap-1.5 pl-12">
                      <span>↳</span>
                      <span className="text-amber-400">{selectedLoc.attributes.policeStation}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
