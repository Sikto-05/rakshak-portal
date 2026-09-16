import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PERMISSIONS } from '../../config/roles';
import {
  LayoutDashboard, Search, Network, GitMerge,
  BookOpen, Map, BarChart3, ClipboardList, ChevronLeft,
  ChevronRight, LogOut, Lock
} from 'lucide-react';

const NAV_ITEMS = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', labelHi: 'डैशबोर्ड', restricted: null },
  { path: '/entities', icon: Search, label: 'Entity Search', labelHi: 'इकाई खोज', restricted: null },
  { path: '/graph', icon: Network, label: 'Knowledge Graph', labelHi: 'नॉलेज ग्राफ', restricted: null },
  { path: '/pathfinder', icon: GitMerge, label: 'Path Finder', labelHi: 'पथ खोजक', restricted: null },
  { path: '/evidence', icon: BookOpen, label: 'Evidence Ledger', labelHi: 'साक्ष्य लेजर', restricted: null },
  { path: '/map', icon: Map, label: 'Geo Intelligence', labelHi: 'भू-खुफिया', restricted: null },
  { path: '/analytics', icon: BarChart3, label: 'Analytics', labelHi: 'विश्लेषण', restricted: null },
  { path: '/audit', icon: ClipboardList, label: 'Audit Log', labelHi: 'ऑडिट लॉग', restricted: 'canViewAuditLog' as const },
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

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const isLocked = item.restricted && perms && !perms[item.restricted];
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} title={collapsed ? (lang === 'hi' ? item.labelHi : item.label) : undefined}>
              {isLocked ? (
                <div className={`nav-item opacity-40 cursor-not-allowed ${collapsed ? 'justify-center' : ''}`}>
                  <Lock className="w-4 h-4 text-slate-600 shrink-0" />
                  {!collapsed && <span className="text-slate-600 text-xs">{lang === 'hi' ? item.labelHi : item.label}</span>}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate text-xs">{lang === 'hi' ? item.labelHi : item.label}</span>}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-navy-700/60 p-2 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 rounded-lg bg-navy-800/60 mb-1">
            <div className="text-xs font-semibold text-slate-200 truncate">{user.name}</div>
            <div className="text-[9px] text-slate-500 truncate mt-0.5">{user.badgeNumber} · {user.station}</div>
          </div>
        )}
        <button
          onClick={logout}
          className={`nav-item nav-item-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="text-xs">Sign Out</span>}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className={`nav-item nav-item-inactive w-full ${collapsed ? 'justify-center' : 'justify-end'}`}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <><span className="text-[10px]">Collapse</span><ChevronLeft className="w-4 h-4" /></>}
        </button>
      </div>
    </aside>
  );
}
