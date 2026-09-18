import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import CopilotPanel from '../CopilotPanel';
import { MessageSquare } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, { en: string; hi: string }> = {
  '/dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  '/entities': { en: 'Entity Search & Resolution', hi: 'इकाई खोज एवं समाधान' },
  '/graph': { en: 'Knowledge Graph', hi: 'नॉलेज ग्राफ' },
  '/pathfinder': { en: 'Investigation Path Finder', hi: 'जांच पथ खोजक' },
  '/evidence': { en: 'Evidence Ledger', hi: 'साक्ष्य लेजर' },
  '/map': { en: 'Geo Intelligence Map', hi: 'भू-खुफिया मानचित्र' },
  '/analytics': { en: 'Network Analytics', hi: 'नेटवर्क विश्लेषण' },
  '/audit': { en: 'Audit Log', hi: 'ऑडिट लॉग' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const location = useLocation();
  const titles = PAGE_TITLES[location.pathname];
  const pageTitle = titles ? titles[lang] : '';

  // Keyboard shortcut listener for Ctrl+K / Cmd+K to toggle copilot
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCopilotOpen(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar lang={lang} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar lang={lang} onLangToggle={() => setLang(l => l === 'en' ? 'hi' : 'en')} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 relative bg-gradient-to-b from-navy-950 via-navy-950 to-navy-900">
          {children}
        </main>
      </div>

      {/* Copilot Floating Trigger Button with Tooltip and Glow */}
      <div className="fixed bottom-6 right-6 z-40 group flex items-center">
        {/* Tooltip on hover */}
        <div className="pointer-events-none absolute right-full mr-3 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-out whitespace-nowrap">
          <div className="bg-navy-900/95 backdrop-blur-sm border border-navy-700/80 text-slate-200 text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl flex items-center gap-2">
            <span>{lang === 'hi' ? 'जांच सह-पायलट' : 'Investigator Copilot'}</span>
            <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-navy-800 border border-navy-700 text-amber-400 rounded">
              Ctrl+K
            </kbd>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(o => !o)}
          className="relative w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-navy-950 shadow-xl ring-2 ring-amber-500/30 hover:ring-4 hover:ring-amber-500/40 flex items-center justify-center transition-all duration-200 active:scale-95 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]"
          title="Investigator Copilot (Ctrl+K)"
          aria-label="Investigator Copilot (Ctrl+K)"
        >
          <MessageSquare className="w-5 h-5 transition-transform duration-200 group-hover:scale-105" />
          <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-navy-950" />
        </button>
      </div>

      <CopilotPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} lang={lang} />
    </div>
  );
}
