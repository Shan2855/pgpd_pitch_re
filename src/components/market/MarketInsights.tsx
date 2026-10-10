import React from 'react';
import {
  TrendingUp,
  BarChart3,
  Calendar,
  Layers,
  Percent,
  Coins,
  ShieldAlert,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  URA_PPI_SERIES,
  PSF_ANNUAL_TRENDS,
  INTEREST_RATE_SERIES,
  DISTRICT_RENTAL_BENCHMARKS,
  UPCOMING_COMPLETIONS,
  COOLING_MEASURES_TIMELINE
} from '../../data/marketInsights';

export const MarketInsights: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <TrendingUp className="w-4 h-4 text-teal-700" />
              <span>Singapore Macro Intelligence</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Private Residential Market Insights
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Historical trends in URA Private Property Price Index (PPI), SORA mortgage benchmark dynamics, rental yields across CCR/RCR/OCR, and housing supply completions pipeline.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <span className="text-[11px] font-mono-numbers bg-stone-100 text-stone-600 px-3 py-1 rounded-lg border border-stone-200">
              DEMO BENCHMARK DATA — ILLUSTRATIVE HISTORICAL AGGREGATES
            </span>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] text-stone-500 font-medium">URA Price Index (Q1 2026)</div>
          <div className="text-2xl font-extrabold font-mono-numbers text-slate-900 mt-1">216.5</div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-1">+37.5% over 5-year cycle</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] text-stone-500 font-medium">3-Month Compounded SORA</div>
          <div className="text-2xl font-extrabold font-mono-numbers text-teal-800 mt-1">2.70%</div>
          <div className="text-[10px] text-stone-500 mt-1">Moderated from 3.65% peak</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] text-stone-500 font-medium">Islandwide Avg Gross Yield</div>
          <div className="text-2xl font-extrabold font-mono-numbers text-slate-900 mt-1">3.48%</div>
          <div className="text-[10px] text-stone-500 mt-1">OCR suburbs lead at 3.67%</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="text-[11px] text-stone-500 font-medium">Upcoming 2026 Supply</div>
          <div className="text-2xl font-extrabold font-mono-numbers text-slate-900 mt-1">7,400 Units</div>
          <div className="text-[10px] text-stone-500 mt-1">Expected TOP completions</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: URA Private Property Price Index (PPI) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                URA Property Price Index (2021 – 2026)
              </h3>
              <p className="text-xs text-stone-500">
                Core Central (CCR) vs Rest of Central (RCR) vs Outside Central (OCR)
              </p>
            </div>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono-numbers">
              Base 100
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={URA_PPI_SERIES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis domain={['dataMin - 10', 'dataMax + 10']} tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="ocr" name="OCR (Suburbs)" stroke="#0d9488" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="rcr" name="RCR (City Fringe)" stroke="#6366f1" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="ccr" name="CCR (Prime Core)" stroke="#f59e0b" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-stone-500 text-center">
            OCR suburbs showed the highest price resilience and growth trajectory post-pandemic.
          </div>
        </div>

        {/* Chart 2: Interest Rates Trend (SORA vs Bank Floating/Fixed) */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Singapore Interest Rate Dynamics (% p.a.)
              </h3>
              <p className="text-xs text-stone-500">
                3M SORA benchmark vs Bank 2-Year Fixed packages
              </p>
            </div>
            <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono-numbers">
              MAS Benchmark
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INTEREST_RATE_SERIES} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="period" tick={{ fontSize: 10 }} />
                <YAxis domain={[0, 5]} tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="sora3M" name="3M SORA Benchmark" stroke="#ef4444" strokeWidth={2} />
                <Line type="monotone" dataKey="bankFixedRate" name="Bank 2-Yr Fixed Package" stroke="#0d9488" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-stone-500 text-center">
            Interest rates stabilized into 2025–2026 after sharp rapid hikes during 2022–2023.
          </div>
        </div>
      </div>

      {/* District Rental Yield & Capital Growth Benchmarks Table */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
          <Coins className="w-4 h-4 text-teal-700" />
          <span>Singapore District Rental Yield & 4-Year Growth Benchmarks</span>
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-[10px] font-bold uppercase text-stone-500">
                <th className="py-2.5 px-3">District</th>
                <th className="py-2.5 px-3">Planning Area</th>
                <th className="py-2.5 px-3">Region</th>
                <th className="py-2.5 px-3 text-right">Avg PSF</th>
                <th className="py-2.5 px-3 text-right">Monthly Rent PSF</th>
                <th className="py-2.5 px-3 text-right font-bold text-teal-900">Gross Rental Yield</th>
                <th className="py-2.5 px-3 text-right">4-Yr Capital Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono-numbers">
              {DISTRICT_RENTAL_BENCHMARKS.map((d) => (
                <tr key={d.district} className="hover:bg-stone-50/70">
                  <td className="py-2 px-3 font-sans font-bold text-slate-900">{d.district}</td>
                  <td className="py-2 px-3 font-sans text-stone-700">{d.areaName}</td>
                  <td className="py-2 px-3 font-sans text-stone-500">{d.region}</td>
                  <td className="py-2 px-3 text-right">S${d.avgPsf}</td>
                  <td className="py-2 px-3 text-right">S${d.avgRentPsf.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-bold text-teal-800">{d.grossRentalYield}%</td>
                  <td className="py-2 px-3 text-right text-emerald-700 font-bold">+{d.capitalGrowth4Yr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cooling Measures History Timeline */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-teal-400">
          Recent Government Cooling Measures Timeline
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {COOLING_MEASURES_TIMELINE.map((item, idx) => (
            <div key={idx} className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60 space-y-1">
              <div className="text-[10px] text-teal-300 font-bold uppercase">{item.date}</div>
              <div className="font-bold text-white text-sm">{item.title}</div>
              <p className="text-stone-300 text-[11px] leading-relaxed pt-1">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
