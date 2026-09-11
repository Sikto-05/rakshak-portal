import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../config/roles';
import { Shield, Lock, User, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const result = login(username, password);
    if (!result.success) setError(result.error || 'Login failed');
    setLoading(false);
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  const labels = {
    en: { title: 'Rakshak', sub: 'Integrated Criminal Network Analysis System', badge: 'Badge / Username', pass: 'Password', btn: 'Secure Sign In', demo: 'Demo Accounts', disclaimer: 'DISCLAIMER: This system contains synthetic, de-identified data only. Not connected to live CCTNS / ICJS. Authorised access only. All sessions are logged and audited.' },
    hi: { title: 'रक्षक', sub: 'एकीकृत आपराधिक नेटवर्क विश्लेषण प्रणाली', badge: 'बैज / उपयोगकर्ता नाम', pass: 'पासवर्ड', btn: 'सुरक्षित साइन इन', demo: 'डेमो खाते', disclaimer: 'अस्वीकरण: इस प्रणाली में केवल सिंथेटिक, डी-आइडेंटिफाइड डेटा है। CCTNS/ICJS से जुड़ा नहीं। केवल अधिकृत पहुँच।' },
  };
  const L = labels[lang];

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Top bar */}
      <div className="disclaimer-banner flex items-center justify-between">
        <span>⚠ {L.disclaimer}</span>
        <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')} className="ml-4 text-amber-400 hover:text-amber-300 font-semibold shrink-0">
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl flex gap-8 items-start">

          {/* Left — branding */}
          <div className="hidden lg:flex flex-col gap-6 flex-1 pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">{L.title}</h1>
                <p className="text-slate-400 text-sm leading-tight mt-0.5">{L.sub}</p>
              </div>
            </div>

            <div className="space-y-4 mt-2">
              {[
                { icon: '🔍', title: 'Entity Resolution', desc: 'Recognizes aliases and name variants as the same person using NLP.' },
                { icon: '🕸️', title: 'Knowledge Graph', desc: 'Every connection backed by evidence — no bare links, ever.' },
                { icon: '📍', title: 'Geo Intelligence', desc: 'India-specific geography: State → District → Police Station.' },
                { icon: '🤖', title: 'Investigator Copilot', desc: 'Ask questions in plain English or Hindi. Get evidence-backed answers.' },
              ].map(f => (
                <div key={f.title} className="flex gap-3 p-3 rounded-xl bg-navy-900/60 border border-navy-700/40">
                  <span className="text-xl">{f.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-slate-200">{f.title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-2 p-4 rounded-xl bg-amber-950/30 border border-amber-800/30">
              <p className="text-xs text-amber-400/80 leading-relaxed">
                <strong className="text-amber-400">Smart India Hackathon 2024</strong><br />
                All data is synthetic and de-identified. No real criminal records or personal information. Ground truth labels available for evaluation.
              </p>
            </div>
          </div>

          {/* Right — login form */}
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden flex items-center gap-3 mb-6">
              <Shield className="w-8 h-8 text-amber-400" />
              <div>
                <div className="text-xl font-bold text-white">{L.title}</div>
                <div className="text-xs text-slate-400">{L.sub}</div>
              </div>
            </div>

            <div className="card-glass p-8 rounded-2xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">Secure Access Portal</span>
                </div>
                <h2 className="text-xl font-semibold text-slate-100">Officer Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">Use your badge credentials to access the system</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-text block mb-1.5">{L.badge}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="input-field pl-9"
                      placeholder="e.g. inv.sharma"
                      required
                      autoComplete="username"
                    />
                  </div>
                </div>

                <div>
                  <label className="label-text block mb-1.5">{L.pass}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-field pl-9 pr-9"
                      placeholder="Enter password"
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/50 border border-red-900/50 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-2.5">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    <><Lock className="w-4 h-4" /> {L.btn}</>
                  )}
                </button>
              </form>

              {/* Demo credentials */}
              <div className="mt-6 pt-5 border-t border-navy-700">
                <p className="label-text text-center mb-3">{L.demo} (click to fill)</p>
                <div className="space-y-1.5">
                  {DEMO_CREDENTIALS.map(c => (
                    <button
                      key={c.username}
                      onClick={() => fillDemo(c.username, c.password)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 hover:border-navy-600 transition-all group text-left"
                    >
                      <div>
                        <span className="text-xs font-mono text-amber-400">{c.username}</span>
                        <span className="text-xs text-slate-500 ml-2">{c.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge-role text-[10px] ${
                          c.role === 'investigator' ? 'bg-blue-900/50 text-blue-400 border-blue-800' :
                          c.role === 'sr_investigator' ? 'bg-indigo-900/50 text-indigo-400 border-indigo-800' :
                          c.role === 'supervisor' ? 'bg-purple-900/50 text-purple-400 border-purple-800' :
                          c.role === 'analyst' ? 'bg-teal-900/50 text-teal-400 border-teal-800' :
                          'bg-amber-900/50 text-amber-400 border-amber-800'
                        }`}>{c.role.replace('_', ' ')}</span>
                        <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-center text-xs text-slate-600 mt-3">Password for all: <span className="font-mono text-slate-500">rakshak@2024</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
