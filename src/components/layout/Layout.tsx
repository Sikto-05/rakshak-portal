import { useState } from 'react';
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

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar lang={lang} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar lang={lang} onLangToggle={() => setLang(l => l === 'en' ? 'hi' : 'en')} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto p-6 relative">
          {children}
        </main>
      </div>

      {/* Copilot toggle */}
      <button
        onClick={() => setCopilotOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 text-navy-950 shadow-lg flex items-center justify-center transition-colors"
        title="Investigator Copilot (Ctrl+K)"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <CopilotPanel open={copilotOpen} onClose={() => setCopilotOpen(false)} lang={lang} />
    </div>
  );
}
