import { Bell, Globe, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_COLORS, ROLE_LABELS } from '../../config/roles';

interface Props {
  lang: 'en' | 'hi';
  onLangToggle: () => void;
  pageTitle?: string;
}

export default function TopBar({ lang, onLangToggle, pageTitle }: Props) {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <header className="h-13 bg-navy-900 border-b border-navy-700 flex items-center justify-between px-5 shrink-0 gap-4">
      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        {pageTitle && (
          <h1 className="text-sm font-semibold text-slate-200 truncate">{pageTitle}</h1>
        )}
      </div>

      {/* Center — disclaimer */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/40 border border-amber-800/30">
        <span className="text-[10px] text-amber-400/80 font-medium">⚠ Synthetic / De-identified Data Only — Not Live CCTNS/ICJS</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Language toggle */}
        <button
          onClick={onLangToggle}
          className="btn-ghost flex items-center gap-1.5 text-xs"
          title="Toggle language"
        >
          <Globe className="w-3.5 h-3.5" />
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>

        {/* Notifications */}
        <button className="btn-ghost relative p-2">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse-subtle" />
        </button>

        {/* User badge */}
        <div className="flex items-center gap-2 pl-3 border-l border-navy-700">
          <div className="w-7 h-7 rounded-full bg-navy-700 border border-navy-600 flex items-center justify-center">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-medium text-slate-200 leading-tight max-w-[140px] truncate">{user.name}</div>
            <div className="flex items-center justify-end gap-1 mt-0.5">
              <span className={`badge-role text-[9px] ${ROLE_COLORS[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
