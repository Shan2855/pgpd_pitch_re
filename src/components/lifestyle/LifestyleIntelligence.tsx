import React, { useState, useMemo } from 'react';
import {
  Compass,
  Sliders,
  Sparkles,
  Info,
  Building2,
  Train,
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  Trees,
  Check
} from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, Tooltip } from 'recharts';
import { BuyerProfile, CondoProperty } from '../../types/property';
import { calculateLifestyleScore } from '../../services/financialEngine';

interface LifestyleIntelligenceProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  onUpdateWeights: (newWeights: BuyerProfile['weights']) => void;
  onSelectCondoForSimulation: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const LifestyleIntelligence: React.FC<LifestyleIntelligenceProps> = ({
  profile,
  condos,
  onUpdateWeights,
  onSelectCondoForSimulation,
  setActiveTab
}) => {
  const [weights, setWeights] = useState(profile.weights);
  const [selectedCondoId, setSelectedCondoId] = useState<string>(condos[0]?.id || '');

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const updated = { ...weights, [key]: value };
    setWeights(updated);
    onUpdateWeights(updated);
  };

  const activeProfile = useMemo(() => ({ ...profile, weights }), [profile, weights]);

  const scoredCondos = useMemo(() => {
    return condos
      .map((c) => {
        const { score, rationale, breakdown } = calculateLifestyleScore(c, activeProfile);
        return { ...c, dynamicScore: score, rationale, breakdown };
      })
      .sort((a, b) => b.dynamicScore - a.dynamicScore);
  }, [condos, activeProfile]);

  const activeCondo = useMemo(() => {
    return scoredCondos.find((c) => c.id === selectedCondoId) || scoredCondos[0];
  }, [scoredCondos, selectedCondoId]);

  // Radar chart data
  const radarData = useMemo(() => {
    if (!activeCondo) return [];
    return [
      { subject: 'Affordability', score: activeCondo.breakdown.affordability, fullMark: 100 },
      { subject: 'Transit (MRT)', score: activeCondo.breakdown.transport, fullMark: 100 },
      { subject: 'Primary Schools', score: activeCondo.breakdown.schools, fullMark: 100 },
      { subject: 'Healthcare', score: activeCondo.breakdown.healthcare, fullMark: 100 },
      { subject: 'Groceries/Retail', score: activeCondo.breakdown.groceries, fullMark: 100 },
      { subject: 'Amenities', score: activeCondo.breakdown.amenities, fullMark: 100 },
      { subject: 'Parks/Nature', score: activeCondo.breakdown.parks, fullMark: 100 }
    ];
  }, [activeCondo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-teal-700" />
          <span>Multi-Criteria Scoring Engine</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Lifestyle Suitability Intelligence
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Adjust the relative priority weights below to customize how CondoCompass SG evaluates each condominium for your household.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sliders on Left */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs border-b border-stone-200 pb-2">
            Priority Weights (Adjustable Sliders)
          </h3>

          {[
            { key: 'affordability', label: 'Financial Affordability', icon: Building2 },
            { key: 'transport', label: 'Public Transit & Commute', icon: Train },
            { key: 'schools', label: 'Primary Schools & Childcare', icon: GraduationCap },
            { key: 'healthcare', label: 'Healthcare & Hospitals', icon: HeartPulse },
            { key: 'groceries', label: 'Groceries & Daily Retail', icon: ShoppingBag },
            { key: 'parks', label: 'Parks & Green Spaces', icon: Trees }
          ].map(({ key, label, icon: Icon }) => (
            <div key={key} className="space-y-1">
              <div className="flex justify-between font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-teal-700" />
                  {label}
                </span>
                <span className="font-mono-numbers font-bold text-slate-900">
                  {weights[key as keyof typeof weights]}%
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={5}
                value={weights[key as keyof typeof weights]}
                onChange={(e) => handleWeightChange(key as keyof typeof weights, Number(e.target.value))}
                className="w-full accent-teal-700"
              />
            </div>
          ))}

          <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
            <button
              onClick={() => {
                const def = { affordability: 25, transport: 20, schools: 15, healthcare: 10, groceries: 10, amenities: 10, parks: 10 };
                setWeights(def);
                onUpdateWeights(def);
              }}
              className="text-stone-500 hover:text-slate-900 font-semibold text-xs"
            >
              Reset Default Weights
            </button>
            <span className="text-[11px] text-teal-800 font-bold">
              Scores dynamically normalized to 100
            </span>
          </div>
        </div>

        {/* Radar Chart & Active Condo Deep Dive on Right */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  Lifestyle Dimension Radar Chart
                </h3>
                <p className="text-xs text-stone-500">
                  Select condo below to inspect 7-dimensional attribute scores
                </p>
              </div>

              <select
                value={selectedCondoId}
                onChange={(e) => setSelectedCondoId(e.target.value)}
                className="text-xs p-2 rounded-lg border border-stone-300 bg-white font-bold text-slate-900"
              >
                {scoredCondos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.dynamicScore}/100)
                  </option>
                ))}
              </select>
            </div>

            {/* Radar chart */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#475569' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                  <Radar name={activeCondo?.name || 'Condo'} dataKey="score" stroke="#0d9488" fill="#0d9488" fillOpacity={0.4} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '11px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Plain English rationale */}
            {activeCondo && (
              <div className="mt-4 p-4 rounded-xl bg-teal-50/60 border border-teal-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-teal-950 text-sm">{activeCondo.name}</span>
                  <span className="font-mono-numbers font-extrabold text-teal-900 text-base">{activeCondo.dynamicScore} / 100</span>
                </div>
                <p className="text-stone-700 leading-relaxed italic">
                  &quot;{activeCondo.rationale}&quot;
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
            <button
              onClick={() => {
                if (activeCondo) onSelectCondoForSimulation(activeCondo.id);
                setActiveTab('simulator');
              }}
              className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulate 4-Yr Resale for {activeCondo?.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
