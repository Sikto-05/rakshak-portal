import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DEMO_CREDENTIALS } from '../config/roles';
import { Lock, User, Eye, EyeOff, AlertCircle, ChevronRight } from 'lucide-react';

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
    if (!result.success) setError(result.error || 'Authentication failed. Check credentials.');
    setLoading(false);
  };

  const fillDemo = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    setError('');
  };

  return (
    <div className="min-h-screen bg-navy-950 flex flex-col">
      {/* Top disclaimer bar */}
      <div className="disclaimer-banner flex items-center justify-between px-6">
        <span className="flex items-center gap-2">
          <span className="text-amber-500">⚠</span>
          {lang === 'en'
            ? 'RESTRICTED ACCESS — Authorised Law Enforcement Personnel Only. All sessions are logged and audited.'
            : 'प्रतिबंधित पहुँच — केवल अधिकृत कानून प्रवर्तन कर्मियों के लिए। सभी सत्र लॉग किए जाते हैं।'}
        </span>
        <button onClick={() => setLang(l => l === 'en' ? 'hi' : 'en')}
          className="ml-4 text-amber-400 hover:text-amber-300 font-semibold text-xs shrink-0 border border-amber-800/40 rounded px-2 py-0.5">
          {lang === 'en' ? 'हिंदी' : 'English'}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-5xl flex gap-12 items-center">

          {/* Left — branding panel */}
          <div className="hidden lg:flex flex-col gap-8 flex-1">
            {/* Logo + title */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <img
                  src="/rakshak-portal/rakshak-badge.jpg"
                  alt="Rakshak Badge"
                  className="w-36 h-auto drop-shadow-2xl"
                  style={{ filter: 'drop-shadow(0 0 24px rgba(245,158,11,0.25))' }}
                />
              </div>
              <div className="text-center">
                <h1 className="text-4xl font-black tracking-[0.15em] text-white uppercase" style={{ letterSpacing: '0.2em' }}>
                  RAKSHAK
                </h1>
                <div className="w-24 h-0.5 bg-amber-500/60 mx-auto mt-2 mb-2" />
                <p className="text-slate-400 text-sm tracking-widest uppercase">
                  {lang === 'en' ? 'Integrated Criminal Network Analysis System' : 'एकीकृत आपराधिक नेटवर्क विश्लेषण प्रणाली'}
                </p>
              </div>
            </div>

            {/* System stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Active Cases', value: '5', unit: 'FIRs' },
                { label: 'Entities Indexed', value: '50+', unit: 'records' },
                { label: 'Network Links', value: '24', unit: 'relationships' },
                { label: 'Intelligence Score', value: '0.874', unit: 'precision' },
              ].map(s => (
                <div key={s.label} className="bg-navy-900/60 border border-navy-700/40 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-amber-400">{s.value}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.unit}</div>
                  <div className="text-[10px] text-slate-600 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Footer notice */}
            <div className="p-3 rounded-xl bg-navy-900/40 border border-navy-800/50">
              <p className="text-[10px] text-slate-600 leading-relaxed text-center">
                Synthetic / de-identified data only. Not connected to live CCTNS, ICJS, NAFIS or any government database.
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden lg:block w-px h-80 bg-navy-700/50" />

          {/* Right — login form */}
          <div className="w-full max-w-sm">
            {/* Mobile logo */}
            <div className="lg:hidden flex flex-col items-center gap-3 mb-8">
              <img src="/rakshak-portal/rakshak-badge.jpg" alt="Rakshak" className="w-20 h-auto" />
              <div className="text-center">
                <div className="text-2xl font-black tracking-widest text-white uppercase">RAKSHAK</div>
                <div className="text-xs text-slate-400 mt-0.5">Integrated Criminal Network Analysis System</div>
              </div>
            </div>

            <div className="card-glass p-8 rounded-2xl shadow-2xl">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em]">Secure Access</span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">Officer Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">Enter your issued badge credentials to proceed</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label-text block mb-1.5">
                    {lang === 'en' ? 'Badge / Username' : 'बैज / उपयोगकर्ता नाम'}
                  </label>
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
                  <label className="label-text block mb-1.5">
                    {lang === 'en' ? 'Password' : 'पासवर्ड'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="input-field pl-9 pr-10"
                      placeholder="Enter password"
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowPass(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-red-950/50 border border-red-800/50 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 py-2.5 mt-2">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Authenticating…
                    </span>
                  ) : (
                    <><Lock className="w-4 h-4" /> {lang === 'en' ? 'Secure Sign In' : 'सुरक्षित साइन इन'}</>
                  )}
                </button>
              </form>

              {/* Demo accounts */}
              <div className="mt-6 pt-5 border-t border-navy-700">
                <p className="label-text text-center mb-3">
                  {lang === 'en' ? 'Demo Accounts — click to fill' : 'डेमो खाते — क्लिक करें'}
                </p>
                <div className="space-y-1.5">
                  {DEMO_CREDENTIALS.map(c => (
                    <button
                      key={c.username}
                      onClick={() => fillDemo(c.username, c.password)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 hover:border-navy-600 transition-all group text-left"
                    >
                      <div>
                        <span className="text-xs font-mono text-amber-400">{c.username}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{c.name.split(' ').slice(0, 2).join(' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge-role text-[9px] ${
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
                <p className="text-center text-[10px] text-slate-600 mt-3">
                  All accounts — password: <span className="font-mono text-slate-500">rakshak@2024</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
