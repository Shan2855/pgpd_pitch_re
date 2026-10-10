import React, { useMemo } from 'react';
import {
  Building2,
  Check,
  ChevronRight,
  DollarSign,
  HelpCircle,
  MapPin,
  Scale,
  Sparkles,
  Train,
  X
} from 'lucide-react';
import { BuyerProfile, CondoProperty } from '../../types/property';
import {
  calculateBSD,
  calculateABSD,
  calculateMonthlyMortgage,
  calculateLifestyleScore,
  simulateResaleScenarios
} from '../../services/financialEngine';

interface PropertyComparisonProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  compareCondoIds: string[];
  toggleCompareCondo: (id: string) => void;
  onSelectCondoForSimulation: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const PropertyComparison: React.FC<PropertyComparisonProps> = ({
  profile,
  condos,
  compareCondoIds,
  toggleCompareCondo,
  onSelectCondoForSimulation,
  setActiveTab
}) => {
  // If fewer than 2 compared, pick default top ones
  const selectedCondos = useMemo(() => {
    let list = condos.filter((c) => compareCondoIds.includes(c.id));
    if (list.length === 0) list = condos.slice(0, 3);
    else if (list.length === 1) list = [list[0], condos.find((c) => c.id !== list[0].id) || condos[1]];
    return list.slice(0, 3);
  }, [condos, compareCondoIds]);

  // Derived financial & simulation details for each
  const comparisonData = useMemo(() => {
    return selectedCondos.map((c) => {
      const bsd = calculateBSD(c.askingPrice);
      const absd = calculateABSD(c.askingPrice, profile.citizenship, profile.hasExistingProperty, profile.isJointPurchase, profile.coBuyerCitizenship);
      const loan = c.askingPrice * 0.75;
      const monthlyMortgage = calculateMonthlyMortgage(loan, profile.mortgageInterestRate, profile.preferredTenureYears);
      const minCashDown = c.askingPrice * 0.05;
      const { score, rationale } = calculateLifestyleScore(c, profile);
      const sim = simulateResaleScenarios(c.askingPrice, 4, profile);

      return {
        ...c,
        bsd,
        absd,
        loan,
        monthlyMortgage,
        minCashDown,
        totalUpfront: c.askingPrice * 0.25 + bsd + absd + 3500,
        lifestyleScore: score,
        rationale,
        sim
      };
    });
  }, [selectedCondos, profile]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-teal-700" />
              <span>Multi-Property Decision Matrix</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Side-by-Side Condominium Comparison
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Evaluating tradeoffs across asking price, mortgage commitments, transit time, and 4-year resale outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500">Comparing {comparisonData.length} Condominiums</span>
          </div>
        </div>
      </div>

      {/* Comparison Grid Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-x-auto text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200 bg-stone-50">
              <th className="py-4 px-4 w-48 text-[11px] font-bold uppercase text-stone-500 tracking-wider">
                Comparison Dimension
              </th>
              {comparisonData.map((condo) => (
                <th key={condo.id} className="py-4 px-4 min-w-[240px]">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-[10px] text-teal-700 font-bold uppercase">{condo.planningArea}</div>
                      <div className="text-sm font-bold text-slate-900">{condo.name}</div>
                    </div>
                    {compareCondoIds.includes(condo.id) && (
                      <button
                        onClick={() => toggleCompareCondo(condo.id)}
                        className="p-1 rounded text-stone-400 hover:text-stone-700"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100">
            {/* Visual Photo */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Preview</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <div className="h-28 rounded-xl overflow-hidden bg-stone-100">
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* Asking Price & PSF */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Asking Price & PSF</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers">
                  <div className="text-base font-extrabold text-slate-900">
                    S${c.askingPrice.toLocaleString()}
                  </div>
                  <div className="text-stone-500 text-[11px]">
                    S${c.pricePerSqFt} PSF
                  </div>
                </td>
              ))}
            </tr>

            {/* Floor Area & Bedrooms */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Unit Layout</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <div className="font-bold text-slate-900">{c.bedrooms} Bedrooms · {c.bathrooms} Bath</div>
                  <div className="text-stone-500 font-mono-numbers text-[11px]">{c.floorAreaSqFt} sq ft</div>
                </td>
              ))}
            </tr>

            {/* Tenure & TOP */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Tenure & TOP Age</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <div className="font-semibold text-slate-900">{c.tenure}</div>
                  <div className="text-stone-500 text-[11px]">TOP {c.topYear} ({c.propertyAge} yrs old)</div>
                </td>
              ))}
            </tr>

            {/* Nearest MRT & Walk */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Transit Proximity</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <div className="font-bold text-teal-900 flex items-center gap-1">
                    <Train className="w-3.5 h-3.5 text-teal-700" />
                    <span>{c.nearestMrt.walkTimeMinutes}m walk</span>
                  </div>
                  <div className="text-stone-600 text-[11px]">{c.nearestMrt.name}</div>
                </td>
              ))}
            </tr>

            {/* Commute to CBD */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Commute to CBD</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers font-semibold">
                  {c.commuteTimeToCBDMinutes} mins
                </td>
              ))}
            </tr>

            {/* Primary Schools Within 1km */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Primary Schools (&le; 1km)</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  {c.primarySchoolsWithin1Km.length > 0 ? (
                    <ul className="list-disc list-inside space-y-0.5 text-[11px] text-stone-700">
                      {c.primarySchoolsWithin1Km.map((sch) => (
                        <li key={sch} className="truncate">{sch}</li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-stone-400 text-[11px]">None directly within 1km</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Monthly Mortgage & Cash Down */}
            <tr className="bg-stone-50/50">
              <td className="py-3 px-4 font-semibold text-stone-700">Est. Monthly Mortgage</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers font-bold text-slate-900">
                  S${c.monthlyMortgage.toLocaleString()}/mo
                </td>
              ))}
            </tr>

            {/* Total Upfront Capital */}
            <tr className="bg-stone-50/50">
              <td className="py-3 px-4 font-semibold text-stone-700">Total Upfront Capital</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers font-bold text-teal-900">
                  S${c.totalUpfront.toLocaleString()}
                  <div className="text-[10px] text-stone-500 font-sans font-normal">
                    (Down Payment + BSD S${c.bsd.toLocaleString()})
                  </div>
                </td>
              ))}
            </tr>

            {/* Lifestyle Score */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Lifestyle Suitability Score</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers">
                  <div className="text-base font-extrabold text-teal-800">
                    {c.lifestyleScore} / 100
                  </div>
                </td>
              ))}
            </tr>

            {/* 4-Year Base Resale Profit */}
            <tr className="bg-stone-900 text-white">
              <td className="py-3 px-4 font-semibold text-teal-300">4-Year Base Case Profit</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 font-mono-numbers font-extrabold text-teal-300">
                  +S${c.sim.base.totalEconomicProfit.toLocaleString()}
                  <div className="text-[10px] text-stone-400 font-sans font-normal">
                    Break-even: S${c.sim.base.breakEvenSalePrice.toLocaleString()}
                  </div>
                </td>
              ))}
            </tr>

            {/* Tradeoff Explanation */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Core Strategic Tradeoff</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4 text-stone-600 text-[11px] leading-relaxed">
                  {c.tradeoffs[0] || 'Balanced location tradeoffs.'}
                </td>
              ))}
            </tr>

            {/* Actions */}
            <tr>
              <td className="py-3 px-4 font-semibold text-stone-700">Action</td>
              {comparisonData.map((c) => (
                <td key={c.id} className="py-3 px-4">
                  <button
                    onClick={() => {
                      onSelectCondoForSimulation(c.id);
                      setActiveTab('simulator');
                    }}
                    className="w-full py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Simulator</span>
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
