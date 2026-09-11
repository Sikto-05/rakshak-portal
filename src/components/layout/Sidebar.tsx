import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_PERMISSIONS } from '../../config/roles';
import {
  Shield, LayoutDashboard, Search, Network, GitMerge,
  BookOpen, Map, BarChart3, ClipboardList, ChevronLeft,
  ChevronRight, LogOut, Settings, Lock
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
    <aside className={`flex flex-col bg-navy-900 border-r border-navy-700 transition-all duration-200 shrink-0 ${collapsed ? 'w-16' : 'w-60'}`}>
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-4 border-b border-navy-700 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Shield className="w-4 h-4 text-amber-400" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <div className="font-bold text-white text-sm leading-tight">Rakshak</div>
            <div className="text-[10px] text-slate-500 leading-tight">Intel Portal</div>
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
                  {!collapsed && <span className="text-slate-600">{lang === 'hi' ? item.labelHi : item.label}</span>}
                </div>
              ) : (
                <NavLink
                  to={item.path}
                  className={`nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'} ${collapsed ? 'justify-center' : ''}`}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {!collapsed && <span className="truncate">{lang === 'hi' ? item.labelHi : item.label}</span>}
                </NavLink>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-navy-700 p-2 space-y-1">
        {!collapsed && user && (
          <div className="px-3 py-2 rounded-lg bg-navy-800/60">
            <div className="text-xs font-medium text-slate-300 truncate">{user.name}</div>
            <div className="text-[10px] text-slate-500 truncate">{user.badgeNumber} · {user.station}</div>
          </div>
        )}
        <button onClick={logout} className={`nav-item nav-item-inactive w-full text-red-400 hover:text-red-300 hover:bg-red-950/30 ${collapsed ? 'justify-center' : ''}`}>
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
        <button onClick={() => setCollapsed(c => !c)} className={`nav-item nav-item-inactive w-full ${collapsed ? 'justify-center' : 'justify-end'}`}>
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <><span className="text-xs">Collapse</span><ChevronLeft className="w-4 h-4" /></>}
        </button>
      </div>
    </aside>
  );
}
