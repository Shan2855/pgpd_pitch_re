import React, { useState } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  Search,
  Filter,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  Scale
} from 'lucide-react';
import { SINGAPORE_REGULATIONS, RegulationRule } from '../../data/regulations';

export const SingaporeRules: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = [
    'All',
    'Taxes & Stamp Duties',
    'Financing & Loans',
    'CPF Regulations',
    'Eligibility & Ownership'
  ];

  const filteredRules = SINGAPORE_REGULATIONS.filter((r) => {
    if (activeCategory !== 'All' && r.category !== activeCategory) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.shortName.toLowerCase().includes(q) ||
        r.summary.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Singapore Regulatory Repository</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Property Law, Taxes & Financing Rules
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Official statutory guidance from IRAS, MAS, CPF Board, and URA. Detailed financial impact examples and direct authoritative links for first-time buyers.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <span className="text-[11px] font-mono-numbers bg-stone-100 text-stone-600 px-3 py-1 rounded-lg border border-stone-200">
              Verified: Budget 2023 / IRAS 2026
            </span>
          </div>
        </div>

        {/* Search & Categories */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search regulations (e.g., ABSD, TDSR, CPF accrued interest, LTV)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-stone-300 text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Prominent Legal Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong>Official Advisory Notice:</strong> Property regulations, cooling measures, and tax schedules may change over time. Verify all calculations and eligibility criteria directly against official Singapore Government guidance (IRAS, MAS, CPF Board) prior to signing legal options.
        </div>
      </div>

      {/* Regulations Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRules.map((rule) => (
          <div
            key={rule.id}
            className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col justify-between space-y-4 hover:border-teal-700/60 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-semibold text-teal-800">{rule.category}</span>
                <span className="bg-stone-100 px-2 py-0.5 rounded font-mono-numbers text-[10px] text-stone-600">
                  {rule.authority}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">
                {rule.name}
              </h3>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {rule.summary}
              </p>

              {/* Why it matters */}
              <div className="mt-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-stone-700 space-y-1">
                <span className="font-bold text-teal-950 block">Why it matters for first-timers:</span>
                <p className="text-[11px] leading-relaxed">{rule.whyItMatters}</p>
              </div>

              {/* Example impact */}
              <div className="mt-3 p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                <span className="font-bold text-slate-900 block">Example Financial Impact:</span>
                <p className="text-[11px] text-stone-600 font-mono-numbers leading-relaxed">
                  {rule.exampleImpact}
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Effective: {rule.effectiveDate}</span>
              </span>

              <a
                href={rule.officialSourceUrl}
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 hover:underline"
              >
                <span>Official Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
