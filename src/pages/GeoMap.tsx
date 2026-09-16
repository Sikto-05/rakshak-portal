import { useState, useEffect } from 'react';
import { MapPin, Layers, Info } from 'lucide-react';
import { LOCATIONS, PERSONS } from '../data/syntheticData';
import { clsx } from 'clsx';

// Leaflet imports — dynamic to avoid SSR issues
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon path broken by Vite bundling
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom marker icons by type
function makeIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 12px; height: 12px; border-radius: 50%;
      background: ${color}; border: 2px solid rgba(255,255,255,0.8);
      box-shadow: 0 0 8px ${color}80, 0 0 0 3px ${color}30;
    "></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

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

function MapThemeLayer() {
  return (
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank">CARTO</a>'
      url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      subdomains="abcd"
      maxZoom={19}
    />
  );
}

// Fly to India on load
function FlyToIndia() {
  const map = useMap();
  useEffect(() => {
    map.flyTo([20.5937, 78.9629], 5, { duration: 1.5 });
  }, [map]);
  return null;
}

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

  const personsAtLocation = (locId: string) =>
    PERSONS.filter(p => p.locationId === locId);

  // Movement polylines between persons and their visited locations
  const movementLines: Array<[[number, number], [number, number]]> = [];
  if (showMovements) {
    LOCATIONS.forEach(from => {
      LOCATIONS.forEach(to => {
        if (from.id !== to.id) {
          const fromPersons = personsAtLocation(from.id);
          const toPersons = personsAtLocation(to.id);
          const sharedPersons = fromPersons.filter(p =>
            toPersons.some(tp => tp.id === p.id) ||
            (p.caseIds || []).length > 1
          );
          if (sharedPersons.length > 0 && movementLines.length < 6) {
            movementLines.push([
              [from.attributes.lat, from.attributes.lng],
              [to.attributes.lat, to.attributes.lng],
            ]);
          }
        }
      });
    });
  }

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-130px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 shrink-0">
        <div>
          <h2 className="text-xl font-semibold text-white">Geo Intelligence Map</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Live OpenStreetMap · India operations · State → District → Police Station
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-950/30 border border-amber-800/30 px-3 py-1.5 rounded-full">
          <MapPin className="w-3.5 h-3.5" />
          {filteredLocs.length} locations active
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 shrink-0">
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
          <Layers className="w-3.5 h-3.5" /> Movement Vectors
        </button>
        <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-navy-900 border border-navy-700 rounded-lg px-3 py-2">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          Click any pin to view details
        </div>
      </div>

      {/* Map + Sidebar layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Map */}
        <div className="flex-1 rounded-xl overflow-hidden border border-navy-700 relative">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ width: '100%', height: '100%' }}
            className="z-0"
          >
            <MapThemeLayer />
            <FlyToIndia />

            {/* Movement lines */}
            {movementLines.map((line, i) => (
              <Polyline
                key={i}
                positions={line}
                pathOptions={{
                  color: '#f59e0b',
                  weight: 1.5,
                  opacity: 0.6,
                  dashArray: '6 4',
                }}
              />
            ))}

            {/* Location markers */}
            {filteredLocs.map(loc => {
              const color = LOCATION_COLORS[loc.attributes.locationType || 'residence'] || '#64748b';
              const persons = personsAtLocation(loc.id);
              return (
                <Marker
                  key={loc.id}
                  position={[loc.attributes.lat, loc.attributes.lng]}
                  icon={makeIcon(color)}
                  eventHandlers={{ click: () => setSelectedLoc(loc) }}
                >
                  <Popup className="rakshak-popup">
                    <div className="bg-navy-900 text-slate-200 rounded-lg p-3 min-w-[220px] text-xs" style={{ backgroundColor: '#0f1829', border: '1px solid #1e2d4d', borderRadius: 8 }}>
                      <div className="font-semibold text-sm text-slate-100 mb-1">{loc.label}</div>
                      <div className="text-slate-400 mb-2">
                        {loc.attributes.district} · {loc.attributes.state}
                      </div>
                      {loc.attributes.policeStation && (
                        <div className="text-slate-500 mb-2">PS: {loc.attributes.policeStation}</div>
                      )}
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ color, backgroundColor: color + '20', border: `1px solid ${color}50` }}>
                          {loc.attributes.locationType?.replace('-', ' ')}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-600 font-mono">
                        {loc.attributes.lat.toFixed(4)}, {loc.attributes.lng.toFixed(4)}
                      </div>
                      {persons.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-slate-700">
                          <div className="text-[10px] text-slate-500 mb-1">Linked persons:</div>
                          {persons.slice(0, 3).map(p => (
                            <div key={p.id} className="text-[11px] text-blue-300">{p.label}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Location list sidebar */}
        <div className="w-64 shrink-0 flex flex-col gap-3 overflow-hidden">
          <div className="label-text">Directory ({filteredLocs.length})</div>
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
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
                          <span className="text-[9px] text-slate-600">{persons.length} person{persons.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="card shrink-0">
            <div className="label-text mb-2">Location Types</div>
            <div className="space-y-1.5">
              {Object.entries(LOCATION_COLORS).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2 text-[10px] text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <span className="capitalize">{type.replace('-', ' ')}</span>
                </div>
              ))}
              {showMovements && (
                <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-1 border-t border-navy-700 mt-1">
                  <span className="w-6 border-t border-dashed border-amber-500 opacity-70" />
                  <span>Movement vector</span>
                </div>
              )}
            </div>
          </div>

          {/* Hierarchy drilldown */}
          {selectedLoc && (
            <div className="card shrink-0 bg-amber-950/10 border-amber-800/20">
              <div className="label-text mb-2">Location Hierarchy</div>
              <div className="text-[10px] text-slate-400 space-y-1">
                <div className="flex items-center gap-1.5"><span className="text-slate-500">🇮🇳</span><span className="font-semibold text-slate-300">India</span></div>
                <div className="flex items-center gap-1.5 pl-4"><span>↳</span><span>{selectedLoc.attributes.state}</span></div>
                <div className="flex items-center gap-1.5 pl-8"><span>↳</span><span>{selectedLoc.attributes.district}</span></div>
                {selectedLoc.attributes.policeStation && (
                  <div className="flex items-center gap-1.5 pl-12"><span>↳</span><span className="text-amber-400">{selectedLoc.attributes.policeStation}</span></div>
                )}
              </div>
              <div className="mt-2 text-[10px] font-mono text-slate-600">
                {selectedLoc.attributes.lat.toFixed(4)}° N, {selectedLoc.attributes.lng.toFixed(4)}° E
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
