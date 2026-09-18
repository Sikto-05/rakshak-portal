import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PERMISSIONS } from '../../config/roles';
import {
  LayoutDashboard, Search, Network, GitMerge,
  BookOpen, Map, BarChart3, ClipboardList, ChevronLeft,
  ChevronRight, LogOut, Lock
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: typeof LayoutDashboard;
  label: string;
  labelHi: string;
  restricted: 'canViewAuditLog' | null;
}

interface NavSection {
  title?: string;
  titleHi?: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    items: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', labelHi: 'डैशबोर्ड', restricted: null },
    ],
  },
  {
    title: 'INVESTIGATION',
    titleHi: 'अनुसंधान',
    items: [
      { path: '/entities', icon: Search, label: 'Entity Search', labelHi: 'इकाई खोज', restricted: null },
      { path: '/graph', icon: Network, label: 'Knowledge Graph', labelHi: 'नॉलेज ग्राफ', restricted: null },
      { path: '/pathfinder', icon: GitMerge, label: 'Path Finder', labelHi: 'पथ खोजक', restricted: null },
    ],
  },
  {
    title: 'INTELLIGENCE',
    titleHi: 'खुफिया',
    items: [
      { path: '/evidence', icon: BookOpen, label: 'Evidence Ledger', labelHi: 'साक्ष्य लेजर', restricted: null },
      { path: '/map', icon: Map, label: 'Geo Intelligence', labelHi: 'भू-खुफिया', restricted: null },
      { path: '/analytics', icon: BarChart3, label: 'Analytics', labelHi: 'विश्लेषण', restricted: null },
    ],
  },
  {
    title: 'SYSTEM',
    titleHi: 'सिस्टम',
    items: [
      { path: '/audit', icon: ClipboardList, label: 'Audit Log', labelHi: 'ऑडिट लॉग', restricted: 'canViewAuditLog' as const },
    ],
  },
];

interface Props { lang: 'en' | 'hi'; }

export default function Sidebar({ lang }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const perms = user ? ROLE_PERMISSIONS[user.role] : null;

  return (
    <aside className={`flex flex-col bg-navy-900 border-r border-navy-700/60 transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className="relative">
        <div className={`flex items-center gap-3 px-3 py-3 border-b border-navy-700/60 ${collapsed ? 'justify-center' : ''}`}>
          <div className="shrink-0 flex items-center justify-center">
            <img
              src="/rakshak-portal/rakshak-badge.jpg"
              alt="Rakshak"
              className={`object-contain transition-all ${collapsed ? 'w-8 h-8' : 'w-10 h-10'}`}
              style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.3))' }}
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="font-black text-white text-sm tracking-widest uppercase leading-tight">Rakshak</div>
              <div className="text-[9px] text-slate-500 leading-tight uppercase tracking-wider mt-0.5">Intel Portal</div>
            </div>
          )}
        </div>
        {/* Thin amber accent line below the logo section */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent shadow-[0_1px_4px_rgba(245,158,11,0.3)]" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-1 overflow-y-auto">
        {NAV_SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {section.title && (
              collapsed ? (
                <div className="my-2 mx-2 border-t border-navy-800/80" />
              ) : (
                <div className="pt-3 pb-1 px-3 flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-wider text-slate-500 uppercase font-mono">
                    {section.title}
                  </span>
                  <div className="h-px flex-1 bg-navy-800/60 ml-2" />
                </div>
              )
            )}

            {section.items.map(item => {
              const isLocked = item.restricted && perms && !perms[item.restricted];
              const isActive = location.pathname === item.path;
              return (
                <div key={item.path} title={collapsed ? (lang === 'hi' ? item.labelHi : item.label) : undefined}>
                  {isLocked ? (
                    <div className={`nav-item opacity-40 cursor-not-allowed border-l-[3px] border-l-transparent rounded-r-lg rounded-l-none ${collapsed ? 'justify-center' : ''}`}>
                      <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                      {!collapsed && <span className="text-slate-600 text-xs">{lang === 'hi' ? item.labelHi : item.label}</span>}
                    </div>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={`nav-item rounded-r-lg rounded-l-none transition-all duration-150 ease-out hover:translate-x-[2px] ${
                        isActive
                          ? 'border-l-[3px] border-l-amber-500 bg-amber-500/15 text-amber-400 font-semibold shadow-[inset_0_1px_0_rgba(245,158,11,0.06)]'
                          : 'border-l-[3px] border-l-transparent text-slate-400 hover:text-slate-200 hover:bg-navy-800/70 hover:border-l-navy-600'
                      } ${collapsed ? 'justify-center' : ''}`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate text-xs">{lang === 'hi' ? item.labelHi : item.label}</span>}
                    </NavLink>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-navy-700/60 p-2 space-y-1 bg-navy-950/30">
        {!collapsed && user && (
          <div className="p-2.5 rounded-xl bg-gradient-to-b from-navy-800/80 to-navy-850/80 border border-navy-700/80 shadow-[0_0_12px_rgba(245,158,11,0.06)] hover:border-amber-500/30 transition-all mb-1.5 relative overflow-hidden group">
            {/* Subtle top amber highlight glow line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
            <div className="flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  {/* Green online status dot */}
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
                </div>
                <div className="text-[9px] text-slate-400 truncate mt-0.5 pl-3.5 font-mono">
                  {user.badgeNumber} · {user.station}
                </div>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className={`nav-item nav-item-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all duration-150 hover:translate-x-[2px] ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`nav-item nav-item-inactive w-full transition-all duration-150 ${collapsed ? 'justify-center' : 'justify-end'}`}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><span className="text-[10px] uppercase font-mono tracking-wider text-slate-400">Collapse</span><ChevronLeft className="w-4 h-4" /></>}
        </button>
      </div>
    </aside>
  );
}
