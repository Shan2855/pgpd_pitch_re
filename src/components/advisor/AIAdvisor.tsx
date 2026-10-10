import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Building2,
  AlertCircle,
  HelpCircle,
  Bot,
  User,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { BuyerProfile, CondoProperty } from '../../types/property';
import { aiAdvisor, ChatMessage } from '../../services/aiAdvisorService';

interface AIAdvisorProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  onSelectCondoForSimulation: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const AIAdvisor: React.FC<AIAdvisorProps> = ({
  profile,
  condos,
  onSelectCondoForSimulation,
  setActiveTab
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello! I am your **CondoCompass SG Property Decision Assistant**.

I can evaluate your real-time affordability, compare specific condominiums across Singapore districts, simulate 4-year resale outcomes under bear markets, and explain Singapore regulatory cooling measures (BSD, ABSD, TDSR, CPF accrued interest).

Click any suggested question below or type your own question!`,
      suggestedFollowUps: [
        'Can I afford a S$1.5 million condo with S$12,000 household monthly income?',
        'Which condos in Tampines are close to MRT and good primary schools?',
        'Should I consider a 99-year leasehold or freehold condo?',
        'What happens if I sell my condo after four years and prices fall by 10%?',
        'Compare a S$1.3 million condo in Sengkang with a S$1.6 million condo in Queenstown.',
        'What are the biggest financial risks for a first-time condo buyer in Singapore?'
      ]
    }
  ]);

  const [inputQuery, setInputQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    try {
      const response = await aiAdvisor.sendMessage(query, profile, condos, messages);
      setMessages((prev) => [...prev, response]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          timestamp: 'Just now',
          text: 'Apologies, I encountered a temporary calculation issue. Please try asking again.'
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-teal-700" />
              <span>Singapore First-Time Buyer Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              AI Property Decision Advisor
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Ask questions on affordability, school distances, freehold vs leasehold tradeoffs, and four-year investment risks.
            </p>
          </div>

          <button
            onClick={() => {
              setMessages([messages[0]]);
            }}
            className="text-xs text-stone-500 hover:text-slate-900 flex items-center gap-1 font-semibold self-start"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Reset Chat</span>
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col h-[600px]">
        
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
              }`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-teal-700 text-white shadow-2xs'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`p-4 rounded-2xl space-y-3 ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-stone-200 text-slate-900 shadow-2xs'
                }`}
              >
                <div className="whitespace-pre-line leading-relaxed text-xs">
                  {msg.text}
                </div>

                {/* Calculation highlight box */}
                {msg.calculationHighlight && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl text-teal-950 space-y-0.5 font-sans">
                    <div className="text-[10px] text-teal-800 font-bold uppercase">
                      {msg.calculationHighlight.label}
                    </div>
                    <div className="text-base font-extrabold font-mono-numbers text-teal-900">
                      {msg.calculationHighlight.value}
                    </div>
                    <div className="text-[10px] text-teal-700">
                      {msg.calculationHighlight.notes}
                    </div>
                  </div>
                )}

                {/* Property recommendations cards if attached */}
                {msg.propertyRecommendations && msg.propertyRecommendations.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-2">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      Recommended Demonstration Condos:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.propertyRecommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 flex items-center justify-between gap-2"
                        >
                          <div>
                            <div className="font-bold text-slate-900">{rec.name}</div>
                            <div className="text-[10px] text-stone-500">S${(rec.askingPrice / 1000000).toFixed(2)}M · {rec.planningArea}</div>
                          </div>
                          <button
                            onClick={() => {
                              onSelectCondoForSimulation(rec.id);
                              setActiveTab('simulator');
                            }}
                            className="p-1.5 rounded bg-teal-700 text-white hover:bg-teal-800 shrink-0"
                            title="Simulate 4-year resale"
                          >
                            <TrendingUp className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-stone-100 space-y-1.5">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      Quick Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(prompt)}
                          className="px-2.5 py-1 rounded-full bg-stone-100 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 border border-stone-200 text-stone-600 text-[11px] transition-colors text-left font-medium"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[10px] text-stone-400 text-right">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3 max-w-xl mr-auto">
              <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white border border-stone-200 rounded-2xl text-stone-500 text-xs flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce delay-200" />
                <span className="text-[11px] ml-1">Analyzing Singapore property regulations...</span>
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Query Input Bar */}
        <div className="p-4 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about buying your first condo, mortgage stress-tests, or 4-year resale outcomes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isTyping}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-300 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 disabled:bg-stone-300 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span>Ask</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
          <div className="mt-2 text-[10px] text-stone-400 text-center">
            CondoCompass AI Assistant provides educational scenario analysis. Always verify legal parameters with IRAS and MAS.
          </div>
        </div>

      </div>

    </div>
  );
};
