import { useState, useRef, useEffect } from 'react';
import { Bell, Globe, AlertTriangle, CheckCircle, Activity, X, Clock, ShieldAlert } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROLE_COLORS, ROLE_LABELS } from '../../config/roles';

interface Notification {
  id: string;
  type: 'alert' | 'update' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'alert',
    title: 'Bridge Node Detected',
    message: 'P-011 Deepak Tiwari shows betweenness centrality 0.89 — connects Alpha & Beta networks.',
    time: '6 min ago',
    read: false,
  },
  {
    id: 'n2',
    type: 'alert',
    title: 'Contradiction Flagged',
    message: 'R-023: Kavita Singh accused in FIR-DLH-2023-0294 but alibi unverified. Manual review required.',
    time: '18 min ago',
    read: false,
  },
  {
    id: 'n3',
    type: 'update',
    title: 'New Relationship Verified',
    message: 'R-001 (Mohammad Arif → Deepak Tiwari) verified via CDR analysis by SI Verma.',
    time: '42 min ago',
    read: false,
  },
  {
    id: 'n4',
    type: 'system',
    title: 'Evidence Import Complete',
    message: 'FIR-LKO-2023-0042 — 3 new evidence records ingested from Lucknow PS upload.',
    time: '1 hr ago',
    read: true,
  },
  {
    id: 'n5',
    type: 'update',
    title: 'Entity Resolution Match',
    message: '"Arif Bhai" resolved as alias for P-001 Mohammad Arif Sheikh (confidence 93%).',
    time: '2 hr ago',
    read: true,
  },
];

interface Props {
  lang: 'en' | 'hi';
  onLangToggle: () => void;
  pageTitle?: string;
}

export default function TopBar({ lang, onLangToggle, pageTitle }: Props) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;
  const alertCount = notifications.filter(n => n.type === 'alert').length;
  const updateCount = notifications.filter(n => n.type === 'update').length;
  const systemCount = notifications.filter(n => n.type === 'system').length;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const dismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotifIcon = ({ type }: { type: Notification['type'] }) => {
    if (type === 'alert') return <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />;
    if (type === 'update') return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
    return <Activity className="w-3.5 h-3.5 text-blue-400" />;
  };

  if (!user) return null;

  return (
    <header className="h-12 bg-navy-900 border-b border-navy-700/80 shadow-[0_4px_16px_rgba(0,0,0,0.35)] flex items-center justify-between px-5 shrink-0 gap-4 relative z-20">
      {/* Left — page title */}
      <div className="flex items-center gap-2 min-w-0">
        {pageTitle && (
          <h1 className="text-sm font-semibold text-slate-200 tracking-wide truncate flex items-center gap-2">
            <span className="w-1.5 h-3.5 bg-amber-500/80 rounded-full inline-block shrink-0" />
            <span>{pageTitle}</span>
          </h1>
        )}
      </div>

      {/* Center — disclaimer */}
      <div className="hidden md:flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-amber-950/40 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.08)]">
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="text-[10px] text-amber-300 font-medium tracking-wide">
          Synthetic / De-identified Data — Not Live CCTNS/ICJS
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Language toggle */}
        <button
          onClick={onLangToggle}
          className="btn-ghost flex items-center gap-1.5 text-xs py-1.5 px-2.5 hover:border hover:border-navy-600 transition-all"
          title="Toggle language"
        >
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline font-medium">{lang === 'en' ? 'हिंदी' : 'English'}</span>
        </button>

        {/* Notification bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(o => !o)}
            className={`btn-ghost relative p-2 transition-all ${showNotifs ? 'bg-navy-800 text-slate-200 ring-1 ring-amber-500/40' : ''}`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-500 text-navy-950 text-[9px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.6)]">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-[420px] max-w-[calc(100vw-2rem)] bg-navy-900 border border-navy-700/90 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] z-50 overflow-hidden backdrop-blur-md">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700/80 bg-navy-950/60">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-100 tracking-wide">System Notifications</span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-semibold font-mono">
                      {unreadCount} NEW
                    </span>
                  ) : (
                    <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono">
                      UPDATED
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Count summary breakdown */}
              <div className="flex items-center justify-between px-4 py-2 bg-navy-950/90 border-b border-navy-800/80 text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-orange-950/40 text-orange-400 border border-orange-800/40 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    {alertCount} Alert{alertCount !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {updateCount} Update{updateCount !== 1 ? 's' : ''}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-950/40 text-blue-400 border border-blue-800/40 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    {systemCount} System
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Total: {notifications.length}
                </span>
              </div>

              {/* List */}
              <div className="max-h-[340px] overflow-y-auto divide-y divide-navy-800/50">
                {notifications.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      className={`flex gap-3 px-4 py-3.5 hover:bg-navy-800/50 transition-all duration-150 ${
                        !n.read
                          ? 'bg-navy-800/25 border-l-2 border-l-amber-500'
                          : 'border-l-2 border-l-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                          n.type === 'alert' ? 'bg-orange-950/60 border border-orange-700/40 text-orange-400' :
                          n.type === 'update' ? 'bg-emerald-950/60 border border-emerald-700/40 text-emerald-400' :
                          'bg-blue-950/60 border border-blue-700/40 text-blue-400'
                        }`}>
                          <NotifIcon type={n.type} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-slate-200 tracking-tight">{n.title}</span>
                            {!n.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)] shrink-0" />
                            )}
                          </div>
                          <button
                            onClick={() => dismiss(n.id)}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors shrink-0"
                            title="Dismiss notification"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.message}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono mt-1.5">
                          <Clock className="w-3 h-3 text-slate-400/80 shrink-0" />
                          <span>{n.time}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-navy-700/80 bg-navy-950/80 text-center">
                <span className="text-[10px] text-slate-400 font-mono">
                  System alerts only — not live intelligence feeds
                </span>
              </div>
            </div>
          )}
        </div>

        {/* User badge */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-navy-700/60">
          <div className="w-7 h-7 rounded-full bg-navy-800 border border-navy-600/80 overflow-hidden flex items-center justify-center ring-1 ring-amber-500/20">
            <img
              src="/rakshak-portal/rakshak-badge.jpg"
              alt="Badge"
              className="w-5 h-5 object-contain opacity-80"
            />
          </div>
          <div className="hidden sm:block text-right">
            <div className="text-xs font-semibold text-slate-200 leading-tight max-w-[140px] truncate">{user.name}</div>
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
