import React, { useMemo } from 'react';
import {
  ArrowRight,
  Bookmark,
  Building2,
  CheckCircle2,
  Compass,
  DollarSign,
  Heart,
  HelpCircle,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap
} from 'lucide-react';
import { BuyerProfile, CondoProperty } from '../../types/property';
import { evaluateAffordability, calculateLifestyleScore, simulateResaleScenarios } from '../../services/financialEngine';

interface OverviewDashboardProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  savedCondoIds: string[];
  toggleSaveCondo: (id: string) => void;
  compareCondoIds: string[];
  toggleCompareCondo: (id: string) => void;
  setActiveTab: (tab: string) => void;
  onSelectCondoForSimulation: (id: string) => void;
  openOnboarding: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  profile,
  condos,
  savedCondoIds,
  toggleSaveCondo,
  compareCondoIds,
  toggleCompareCondo,
  setActiveTab,
  onSelectCondoForSimulation,
  openOnboarding
}) => {
  const aff = useMemo(() => evaluateAffordability(profile), [profile]);

  // Score each condo against profile
  const scoredCondos = useMemo(() => {
    return condos
      .map((c) => {
        const { score, rationale } = calculateLifestyleScore(c, profile);
        return {
          ...c,
          personalizedScore: score,
          rationale
        };
      })
      .sort((a, b) => b.personalizedScore - a.personalizedScore);
  }, [condos, profile]);

  const topThreeCondos = scoredCondos.slice(0, 3);
  const matchingCount = scoredCondos.filter((c) => c.askingPrice <= aff.maxPurchasePrice * 1.08).length;

  // Average PSF of matching condos
  const avgPsf = useMemo(() => {
    if (scoredCondos.length === 0) return 1950;
    const sum = scoredCondos.reduce((acc, c) => acc + c.pricePerSqFt, 0);
    return Math.round(sum / scoredCondos.length);
  }, [scoredCondos]);

  // 4-year resale simulation preview for top condo
  const topCondo = topThreeCondos[0];
  const topSimulation = useMemo(() => {
    if (!topCondo) return null;
    return simulateResaleScenarios(topCondo.askingPrice, 4, profile);
  }, [topCondo, profile]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner with High-Fidelity Architectural Photography */}
      <div className="relative rounded-3xl overflow-hidden shadow-sm border border-stone-200">
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/hero_condo_waterfront_1791611664920.jpg"
            alt="Singapore Marina Bay Waterfront Skyline"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/75 to-slate-950/30" />
        </div>

        <div className="relative p-6 sm:p-10 text-white max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CondoCompass SG Intelligence Dashboard</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            Buy for Living. Plan for Tomorrow.
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-stone-200 leading-relaxed max-w-xl">
            Welcome, {profile.citizenship === 'SC' ? 'Singapore Citizen' : profile.citizenship === 'SPR' ? 'Permanent Resident' : 'Foreign Buyer'}. We&apos;ve calibrated your maximum prudent budget against MAS 55% TDSR regulations, IRAS stamp duties, and a 4-year resale exit horizon.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveTab('discovery')}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-colors"
            >
              <span>Explore {matchingCount} Matched Condos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 backdrop-blur-xs flex items-center gap-2 transition-colors"
            >
              <span>Run 4-Year Resale Simulator</span>
            </button>
            <button
              onClick={openOnboarding}
              className="text-xs text-stone-300 hover:text-white underline underline-offset-4 ml-1"
            >
              Update Profile Inputs
            </button>
          </div>
        </div>
      </div>

      {/* Financial Health Summary Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Personalized Affordability & Capital Requirements (MAS TDSR Compliant)
          </h2>
          <span className="text-[11px] text-stone-500">
            Household Gross: S${(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0)).toLocaleString()}/mo
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">Max Affordable Condo</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-teal-800 mt-1">
              S${(aff.maxPurchasePrice / 1000000).toFixed(2)}M
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 font-mono-numbers">
              S${aff.maxPurchasePrice.toLocaleString()}
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">Est. Monthly Mortgage</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-slate-900 mt-1">
              S${aff.maxMonthlyMortgage.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              at {profile.mortgageInterestRate}% ({profile.preferredTenureYears} yrs)
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">Mandatory Cash Down</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-amber-700 mt-1">
              S${aff.minimumCashDownPayment.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              5% Hard Cash (MAS min)
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">CPF OA Down Payment</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-teal-700 mt-1">
              S${aff.cpfDownPaymentAllowed.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              20% from CPF OA savings
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">Buyer Stamp Duty (BSD)</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-slate-900 mt-1">
              S${aff.bsd.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              ABSD: S${aff.absd.toLocaleString()} ({profile.citizenship})
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
            <div className="text-[11px] text-stone-500 font-medium">Remaining Cash Income</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-emerald-700 mt-1">
              S${aff.remainingMonthlyIncome.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-500 mt-0.5">
              Safe disposable cash/mo
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Condominium Recommendations */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Top 3 Condominium Matches for You
            </h2>
            <p className="text-xs text-stone-500">
              Ranked by personalized lifestyle scoring (commute, schools, groceries, affordability)
            </p>
          </div>
          <button
            onClick={() => setActiveTab('discovery')}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 hover:underline"
          >
            <span>View All ({condos.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {topThreeCondos.map((condo, idx) => {
            const isSaved = savedCondoIds.includes(condo.id);
            const isCompared = compareCondoIds.includes(condo.id);

            return (
              <div
                key={condo.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col group hover:border-stone-300 transition-all"
              >
                {/* Photo & Badge */}
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={condo.imageUrl}
                    alt={condo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    #{idx + 1} Best Match · {condo.personalizedScore}/100
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompareCondo(condo.id)}
                      title="Compare property"
                      className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        isCompared ? 'bg-slate-900 text-white' : 'bg-white/80 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => toggleSaveCondo(condo.id)}
                      title="Save property"
                      className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        isSaved ? 'bg-rose-600 text-white' : 'bg-white/80 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    DEMO DATA
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-stone-500 font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400" />
                      <span>{condo.planningArea}</span>
                      <span>·</span>
                      <span>{condo.district}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-1 group-hover:text-teal-800 transition-colors">
                      {condo.name}
                    </h3>

                    {/* Asking Price & PSF */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-lg font-extrabold text-slate-900 font-mono-numbers">
                        S${condo.askingPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-mono-numbers">
                        S${condo.pricePerSqFt} PSF
                      </span>
                    </div>

                    {/* Specs strip */}
                    <div className="mt-2 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                      <span>{condo.bedrooms} Bed · {condo.bathrooms} Bath</span>
                      <span>{condo.floorAreaSqFt} sq ft</span>
                      <span>{condo.tenure.includes('Freehold') ? 'Freehold' : '99-yr'}</span>
                    </div>

                    {/* Nearest MRT */}
                    <div className="mt-3 bg-stone-50 p-2 rounded-lg text-[11px] text-stone-600 flex items-center justify-between">
                      <span className="truncate">{condo.nearestMrt.name}</span>
                      <span className="font-semibold text-teal-800 shrink-0 ml-2">
                        {condo.nearestMrt.walkTimeMinutes} min walk
                      </span>
                    </div>

                    {/* Plain english rationale */}
                    <p className="mt-2.5 text-[11px] text-stone-500 leading-relaxed italic line-clamp-2">
                      &quot;{condo.rationale}&quot;
                    </p>
                  </div>

                  {/* Quick Action Button */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectCondoForSimulation(condo.id);
                        setActiveTab('simulator');
                      }}
                      className="flex-1 py-2 rounded-lg bg-teal-50 hover:bg-teal-100/80 text-teal-900 font-bold text-xs text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      <span>Simulate 4-Yr Resale</span>
                    </button>
                    <button
                      onClick={() => setActiveTab('map')}
                      title="Inspect on map"
                      className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600"
                    >
                      <Compass className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Four-Year Resale Snapshot Teaser for Top Condo */}
      {topCondo && topSimulation && (
        <div className="bg-stone-900 text-white rounded-3xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>4-Year Exit Projection Spotlight</span>
              </div>
              <h3 className="text-xl font-bold mt-1 text-white">
                If you buy {topCondo.name} today and exit in 4 years:
              </h3>
            </div>
            <button
              onClick={() => {
                onSelectCondoForSimulation(topCondo.id);
                setActiveTab('simulator');
              }}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 self-start transition-colors"
            >
              <span>Open Full Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
            <div className="bg-stone-800/70 p-5 rounded-2xl border border-stone-700/60">
              <div className="text-xs font-semibold text-rose-300">Bear Case (-1.5% p.a.)</div>
              <div className="text-2xl font-bold font-mono-numbers mt-1 text-white">
                S${topSimulation.bear.projectedSalePrice.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400 mt-2 space-y-1">
                <div>Net Cash In Bank: <span className="font-mono-numbers text-stone-200 font-bold">S${topSimulation.bear.netCashProceedsToBank.toLocaleString()}</span></div>
                <div>Economic Profit: <span className="font-mono-numbers text-rose-400 font-bold">{topSimulation.bear.totalEconomicProfit >= 0 ? '+' : ''}S${topSimulation.bear.totalEconomicProfit.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="bg-stone-800/70 p-5 rounded-2xl border border-teal-500/50 ring-1 ring-teal-500/30">
              <div className="text-xs font-semibold text-teal-300">Base Case (+2.8% p.a.)</div>
              <div className="text-2xl font-bold font-mono-numbers mt-1 text-white">
                S${topSimulation.base.projectedSalePrice.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400 mt-2 space-y-1">
                <div>Net Cash In Bank: <span className="font-mono-numbers text-teal-300 font-bold">S${topSimulation.base.netCashProceedsToBank.toLocaleString()}</span></div>
                <div>Economic Profit: <span className="font-mono-numbers text-teal-300 font-bold">+{topSimulation.base.totalEconomicProfit.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="bg-stone-800/70 p-5 rounded-2xl border border-stone-700/60">
              <div className="text-xs font-semibold text-emerald-300">Bull Case (+5.5% p.a.)</div>
              <div className="text-2xl font-bold font-mono-numbers mt-1 text-white">
                S${topSimulation.bull.projectedSalePrice.toLocaleString()}
              </div>
              <div className="text-xs text-stone-400 mt-2 space-y-1">
                <div>Net Cash In Bank: <span className="font-mono-numbers text-emerald-300 font-bold">S${topSimulation.bull.netCashProceedsToBank.toLocaleString()}</span></div>
                <div>Economic Profit: <span className="font-mono-numbers text-emerald-300 font-bold">+{topSimulation.bull.totalEconomicProfit.toLocaleString()}</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Access Grid to the 8 Specialized Modules */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
          Navigation Hub & Intelligence Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { id: 'discovery', title: 'Discover Condos', desc: 'Filter by district, budget & MRT', icon: Building2 },
            { id: 'map', title: 'Interactive Map', desc: 'Explore schools, hospitals & MRT', icon: MapPin },
            { id: 'simulator', title: '4-Year Simulator', desc: 'Bear, base & bull resale ledger', icon: TrendingUp },
            { id: 'calculator', title: 'Affordability Engine', desc: 'TDSR & cash/CPF down payment', icon: Wallet },
            { id: 'lifestyle', title: 'Lifestyle Scoring', desc: 'Custom weight sliders & radar chart', icon: Compass },
            { id: 'compare', title: 'Compare Properties', desc: 'Side-by-side tradeoff matrix', icon: Scale },
            { id: 'market', title: 'Singapore Insights', desc: 'URA price index, SORA & PSF', icon: DollarSign },
            { id: 'advisor', title: 'AI Property Advisor', desc: 'Plain-English real estate guidance', icon: Sparkles }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className="p-3.5 bg-white rounded-xl border border-stone-200 hover:border-teal-700 text-left transition-all group shadow-2xs hover:shadow-xs"
            >
              <item.icon className="w-4 h-4 text-teal-700 group-hover:scale-110 transition-transform mb-1.5" />
              <div className="font-bold text-slate-900 group-hover:text-teal-800 transition-colors">{item.title}</div>
              <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
