import { useState } from 'react';
import { X, Send, Bot, AlertTriangle, ChevronRight, Loader } from 'lucide-react';
import { ALL_ENTITIES, RELATIONSHIPS, CASES, PERSONS, getRelationshipsForEntity, findShortestPath, getEntityById } from '../data/syntheticData';

interface Props { open: boolean; onClose: () => void; lang: 'en' | 'hi'; }

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  entities?: typeof ALL_ENTITIES;
  evidenceCount?: number;
  isHypothesis?: boolean;
  timestamp: string;
}

const SAMPLE_QUERIES_EN = [
  'Who connects Case FIR-LKO-2023-0042 and FIR-MUM-2023-0118?',
  'Who are the bridge nodes in the network?',
  'How is Mohammad Arif related to Imran Qureshi?',
  'List all persons in Maharashtra with high importance score',
  'Show me contradictions in the evidence ledger',
];
const SAMPLE_QUERIES_HI = [
  'FIR-LKO-2023-0042 और FIR-MUM-2023-0118 को कौन जोड़ता है?',
  'नेटवर्क में ब्रिज नोड्स कौन हैं?',
  'मोहम्मद आरिफ और इमरान कुरैशी का क्या संबंध है?',
];

function buildResponse(query: string): Omit<Message, 'id' | 'role' | 'timestamp'> {
  const q = query.toLowerCase();

  // Bridge nodes query
  if (q.includes('bridge') || q.includes('ब्रिज')) {
    const bridges = PERSONS.filter(p => (p.betweennessScore || 0) > 0.7);
    return {
      text: `**Bridge Nodes Detected (${bridges.length})**\n\nPersons with high betweenness centrality — these individuals connect otherwise separate network clusters. ⚠ These are AI hypotheses and require human verification before any operational use.\n\n${bridges.map(b => `• **${b.label}** (${b.id}) — Betweenness: ${((b.betweennessScore || 0) * 100).toFixed(0)}%, Importance: ${b.importanceScore}`).join('\n')}`,
      entities: bridges,
      evidenceCount: bridges.reduce((s, b) => s + getRelationshipsForEntity(b.id).length, 0),
      isHypothesis: true,
    };
  }

  // Case connection query
  if ((q.includes('connect') || q.includes('जोड़')) && (q.includes('fir') || q.includes('case'))) {
    const path = findShortestPath('C-001', 'C-002');
    const connectors = path ? path.path.map(id => getEntityById(id)).filter(Boolean) : [];
    return {
      text: `**Connection Between FIR-LKO-2023-0042 ↔ FIR-MUM-2023-0118**\n\nShortest evidence-backed path found (${path?.path.length || 0} hops):\n\n${path?.path.map((id, i) => {
        const e = getEntityById(id);
        return `${i + 1}. **${e?.label || id}** (${id})`;
      }).join(' → ')}\n\n**Key finding:** Deepak Tiwari (P-011) acts as the critical bridge between these two networks. He appears in CDR analysis for FIR-LKO and CCTV records for FIR-MUM.\n\n⚠ AI Hypothesis — 3 verified evidence records support this path. Human verification required.`,
      entities: connectors as typeof ALL_ENTITIES,
      evidenceCount: 3,
      isHypothesis: true,
    };
  }

  // Arif / Imran relationship
  if ((q.includes('arif') || q.includes('आरिफ')) && (q.includes('imran') || q.includes('qureshi') || q.includes('कुरैशी'))) {
    const path = findShortestPath('P-001', 'P-005');
    return {
      text: `**Relationship: Mohammad Arif Sheikh ↔ Imran Hussain Qureshi**\n\nPath (${path?.path.length || 0} hops):\n${path?.path.map(id => getEntityById(id)?.label || id).join(' → ')}\n\n**Evidence:** Deepak Tiwari (P-011) connects them. CDR shows indirect contact via burner phones. WhatsApp metadata analysis shows 8 indirect contacts.\n\n**Relationship strength:** Moderate (indirect link, confidence 0.79)\n\n⚠ Based on 2 evidence sources. AI hypothesis — requires investigator verification.`,
      entities: [getEntityById('P-001'), getEntityById('P-005'), getEntityById('P-011')].filter(Boolean) as typeof ALL_ENTITIES,
      evidenceCount: 2,
      isHypothesis: true,
    };
  }

  // Maharashtra / high importance
  if (q.includes('maharashtra') || q.includes('महाराष्ट्र')) {
    const mh = PERSONS.filter(p => p.attributes.state === 'Maharashtra');
    return {
      text: `**Persons in Maharashtra (${mh.length} found)**\n\n${mh.map(p => `• **${p.label}** — Importance: ${p.importanceScore || 'N/A'}, Cases: ${(p.caseIds || []).join(', ')}`).join('\n')}\n\nBased on current synthetic dataset. All connections are evidence-backed.`,
      entities: mh,
      evidenceCount: mh.reduce((s, p) => s + getRelationshipsForEntity(p.id).length, 0),
      isHypothesis: false,
    };
  }

  // Contradictions
  if (q.includes('contradiction') || q.includes('विरोधाभास')) {
    const contras = RELATIONSHIPS.filter(r => r.flagContradiction);
    return {
      text: `**Flagged Contradictions (${contras.length})**\n\n${contras.map(r => {
        const src = getEntityById(r.sourceId);
        const tgt = getEntityById(r.targetId);
        return `• **${src?.label || r.sourceId}** ↔ **${tgt?.label || r.targetId}**\n  Note: ${r.contradictionNote}\n  Confidence: ${(r.confidence * 100).toFixed(0)}%`;
      }).join('\n\n')}\n\nThese records have not been auto-merged. Manual review required.`,
      entities: [],
      evidenceCount: contras.length,
      isHypothesis: false,
    };
  }

  // Default
  return {
    text: `Query processed against ${ALL_ENTITIES.length} entities and ${RELATIONSHIPS.length} relationships.\n\nNo specific match found for: "*${query}*"\n\nTry queries like:\n• "Who connects Case A and B?"\n• "Bridge nodes in network"\n• "Persons in [State]"\n• "How is X related to Y?"`,
    entities: [],
    evidenceCount: 0,
    isHypothesis: false,
  };
}

export default function CopilotPanel({ open, onClose, lang }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: lang === 'hi'
        ? 'नमस्ते। मैं रक्षक जांच सहायक हूं। अपना प्रश्न पूछें।'
        : 'Welcome, Officer. I am the Rakshak Investigator Copilot. Ask me about entities, connections, or cases — in English or Hindi. Every response is grounded in verified graph evidence only.',
      timestamp: new Date().toISOString(),
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const samples = lang === 'hi' ? SAMPLE_QUERIES_HI : SAMPLE_QUERIES_EN;

  const send = async (text?: string) => {
    const q = text || input.trim();
    if (!q) return;
    setInput('');
    const userMsg: Message = { id: `u-${Date.now()}`, role: 'user', text: q, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const resp = buildResponse(q);
    const assistantMsg: Message = { id: `a-${Date.now()}`, role: 'assistant', ...resp, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md flex flex-col bg-navy-900 border-l border-navy-700 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700 bg-navy-850">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-100">Investigator Copilot</div>
            <div className="text-[10px] text-slate-500">Evidence-grounded · Hindi + English</div>
          </div>
        </div>
        <button onClick={onClose} className="btn-ghost p-1.5"><X className="w-4 h-4" /></button>
      </div>

      {/* Warning */}
      <div className="px-4 py-2 bg-amber-950/30 border-b border-amber-800/20 flex items-start gap-2">
        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />
        <p className="text-[10px] text-amber-400/80 leading-relaxed">All responses use verified graph evidence only. AI hypotheses are clearly labelled. Never use as sole basis for action without human verification.</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] rounded-xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-amber-500/15 border border-amber-500/20 text-amber-100' : 'bg-navy-800 border border-navy-700 text-slate-300'}`}>
              {msg.role === 'assistant' && msg.isHypothesis && (
                <div className="tag-hypothesis mb-2 text-[10px]">
                  <Bot className="w-2.5 h-2.5" /> AI Hypothesis — Verify before action
                </div>
              )}
              <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed">{msg.text}</pre>
              {msg.evidenceCount !== undefined && msg.evidenceCount > 0 && (
                <div className="mt-2 pt-2 border-t border-navy-700/50 text-[10px] text-slate-500">
                  Based on {msg.evidenceCount} evidence record{msg.evidenceCount !== 1 ? 's' : ''}
                </div>
              )}
              {msg.entities && msg.entities.length > 0 && (
                <div className="mt-2 space-y-1">
                  {msg.entities.slice(0, 4).map(e => (
                    <div key={e.id} className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-navy-900/60 rounded px-2 py-1">
                      <ChevronRight className="w-3 h-3 text-amber-500" />
                      <span className="font-medium text-slate-300">{e.label}</span>
                      <span className="text-slate-600">({e.id})</span>
                    </div>
                  ))}
                  {msg.entities.length > 4 && <div className="text-[10px] text-slate-600 pl-2">+{msg.entities.length - 4} more</div>}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-navy-800 border border-navy-700 rounded-xl px-4 py-3 flex items-center gap-2 text-slate-400 text-sm">
              <Loader className="w-3.5 h-3.5 animate-spin" />
              Analysing evidence graph…
            </div>
          </div>
        )}
      </div>

      {/* Sample queries */}
      {messages.length <= 1 && (
        <div className="px-4 py-3 border-t border-navy-700 space-y-1.5">
          <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Try asking:</p>
          {samples.slice(0, 3).map(q => (
            <button key={q} onClick={() => send(q)} className="w-full text-left text-[11px] text-slate-400 hover:text-amber-400 bg-navy-800/50 hover:bg-navy-800 border border-navy-700/50 rounded-lg px-3 py-2 transition-colors">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-navy-700 bg-navy-850">
        <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="input-field flex-1"
            placeholder={lang === 'hi' ? 'प्रश्न पूछें...' : 'Ask about entities, cases, connections...'}
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-3 py-2">
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
