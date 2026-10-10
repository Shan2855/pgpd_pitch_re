import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  Bookmark,
  Building2,
  Check,
  ChevronDown,
  Filter,
  Heart,
  HelpCircle,
  Info,
  MapPin,
  Scale,
  Search,
  Sparkles,
  Train,
  X
} from 'lucide-react';
import { BuyerProfile, CondoProperty } from '../../types/property';
import { SINGAPORE_PLANNING_AREAS } from '../../data/condos';
import { calculateLifestyleScore, calculateMonthlyMortgage, simulateResaleScenarios } from '../../services/financialEngine';

interface CondoDiscoveryProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  savedCondoIds: string[];
  toggleSaveCondo: (id: string) => void;
  compareCondoIds: string[];
  toggleCompareCondo: (id: string) => void;
  onSelectCondoForSimulation: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const CondoDiscovery: React.FC<CondoDiscoveryProps> = ({
  profile,
  condos,
  savedCondoIds,
  toggleSaveCondo,
  compareCondoIds,
  toggleCompareCondo,
  onSelectCondoForSimulation,
  setActiveTab
}) => {
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArea, setSelectedArea] = useState<string>('All Areas');
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'CCR' | 'RCR' | 'OCR'>('All');
  const [maxPrice, setMaxPrice] = useState<number>(profile.maxBudget > 0 ? profile.maxBudget + 200000 : 2500000);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | 'All'>('All');
  const [tenureFilter, setTenureFilter] = useState<'All' | 'Freehold' | 'Leasehold'>('All');
  const [maxMrtWalk, setMaxMrtWalk] = useState<number>(15); // max walk mins
  const [sortBy, setSortBy] = useState<'score' | 'price_asc' | 'price_desc' | 'psf_asc' | 'mrt'>('score');
  
  // Selected condo detail modal
  const [inspectCondo, setInspectCondo] = useState<CondoProperty | null>(null);

  // Score and filter condos
  const filteredCondos = useMemo(() => {
    return condos
      .map((condo) => {
        const { score, rationale, breakdown } = calculateLifestyleScore(condo, profile);
        const monthlyMortgage = calculateMonthlyMortgage(condo.askingPrice * 0.75, profile.mortgageInterestRate, profile.preferredTenureYears);
        const sim = simulateResaleScenarios(condo.askingPrice, 4, profile);
        return {
          ...condo,
          lifestyleScore: score,
          rationale,
          breakdown,
          estMonthlyMortgage: monthlyMortgage,
          resaleBaseGain: sim.base.grossCapitalGain,
          resaleBaseProfit: sim.base.totalEconomicProfit
        };
      })
      .filter((condo) => {
        // Search text
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matches =
            condo.name.toLowerCase().includes(q) ||
            condo.planningArea.toLowerCase().includes(q) ||
            condo.district.toLowerCase().includes(q) ||
            condo.nearestMrt.name.toLowerCase().includes(q);
          if (!matches) return false;
        }

        // Planning Area
        if (selectedArea !== 'All Areas' && condo.planningArea !== selectedArea) {
          return false;
        }

        // Region
        if (selectedRegion !== 'All' && condo.region !== selectedRegion) {
          return false;
        }

        // Price
        if (condo.askingPrice > maxPrice) {
          return false;
        }

        // Bedrooms
        if (selectedBedrooms !== 'All' && condo.bedrooms !== selectedBedrooms) {
          return false;
        }

        // Tenure
        if (tenureFilter === 'Freehold' && !condo.tenure.includes('Freehold')) return false;
        if (tenureFilter === 'Leasehold' && !condo.tenure.includes('99-year')) return false;

        // MRT walk time
        if (condo.nearestMrt.walkTimeMinutes > maxMrtWalk) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') return b.lifestyleScore - a.lifestyleScore;
        if (sortBy === 'price_asc') return a.askingPrice - b.askingPrice;
        if (sortBy === 'price_desc') return b.askingPrice - a.askingPrice;
        if (sortBy === 'psf_asc') return a.pricePerSqFt - b.pricePerSqFt;
        if (sortBy === 'mrt') return a.nearestMrt.walkTimeMinutes - b.nearestMrt.walkTimeMinutes;
        return 0;
      });
  }, [
    condos,
    profile,
    searchQuery,
    selectedArea,
    selectedRegion,
    maxPrice,
    selectedBedrooms,
    tenureFilter,
    maxMrtWalk,
    sortBy
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Building2 className="w-4 h-4 text-teal-700" />
              <span>Interactive Discovery Catalog</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Singapore Condominium Discovery
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore 16 curated demonstration condominiums across Singapore with verified transit proximity, primary school allocations, and lifestyle metrics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-500">
              Showing <strong className="text-slate-900">{filteredCondos.length}</strong> of {condos.length} Condos
            </span>
          </div>
        </div>

        {/* Search & Area Filter Bar */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by condo name, planning area (e.g., Tampines, Queenstown), or MRT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs text-slate-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-teal-700"
            />
          </div>

          <div>
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-stone-300 text-xs font-medium text-slate-900 bg-white"
            >
              {SINGAPORE_PLANNING_AREAS.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Detailed Interactive Filters Row */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs">
          {/* Region Tabs */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {(['All', 'OCR', 'RCR', 'CCR'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedRegion === r
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                {r === 'All' ? 'All Regions' : r}
              </button>
            ))}
          </div>

          {/* Bedrooms */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {(['All', 1, 2, 3, 4] as const).map((b) => (
              <button
                key={b}
                onClick={() => setSelectedBedrooms(b)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedBedrooms === b
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                {b === 'All' ? 'All Beds' : `${b} Bed`}
              </button>
            ))}
          </div>

          {/* Tenure */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg">
            {(['All', 'Leasehold', 'Freehold'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTenureFilter(t)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  tenureFilter === t
                    ? 'bg-white text-slate-900 font-bold shadow-2xs'
                    : 'text-stone-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Max Price Slider Dropdown */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-stone-500 font-medium">Max Price:</span>
            <span className="font-mono-numbers font-bold text-slate-900">
              S${(maxPrice / 1000000).toFixed(2)}M
            </span>
            <input
              type="range"
              min={1000000}
              max={3000000}
              step={50000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 accent-teal-700"
            />
          </div>

          {/* Sort order */}
          <div className="flex items-center gap-1">
            <span className="text-stone-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="p-1 rounded-lg border border-stone-200 text-xs bg-white text-slate-900 font-medium"
            >
              <option value="score">Lifestyle Score</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="psf_asc">Lowest PSF</option>
              <option value="mrt">Closest to MRT</option>
            </select>
          </div>
        </div>
      </div>

      {/* Condos Grid */}
      {filteredCondos.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
          <Building2 className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No condominiums match your exact filters</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try expanding your maximum purchase budget, loosening MRT walk duration, or selecting all Singapore planning areas.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedArea('All Areas');
              setSelectedRegion('All');
              setSelectedBedrooms('All');
              setTenureFilter('All');
              setMaxPrice(2500000);
            }}
            className="mt-4 px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCondos.map((condo) => {
            const isSaved = savedCondoIds.includes(condo.id);
            const isCompared = compareCondoIds.includes(condo.id);

            return (
              <div
                key={condo.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col group hover:border-teal-700/50 hover:shadow-sm transition-all"
              >
                {/* Image & Quick Badges */}
                <div className="relative h-52 bg-stone-100 overflow-hidden cursor-pointer" onClick={() => setInspectCondo(condo)}>
                  <img
                    src={condo.imageUrl}
                    alt={condo.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                    {condo.lifestyleScore}/100 Match
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompareCondo(condo.id);
                      }}
                      title="Compare property"
                      className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        isCompared ? 'bg-slate-900 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveCondo(condo.id);
                      }}
                      title="Save to favorites"
                      className={`p-1.5 rounded-full backdrop-blur-xs transition-colors ${
                        isSaved ? 'bg-rose-600 text-white' : 'bg-white/90 text-stone-700 hover:bg-white'
                      }`}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded">
                    DEMO DATA
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="text-[11px] text-stone-500 font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {condo.planningArea} · {condo.region}
                      </span>
                      <span className="text-[10px] bg-stone-100 px-2 py-0.5 rounded font-mono-numbers">
                        TOP {condo.topYear}
                      </span>
                    </div>

                    <h3
                      onClick={() => setInspectCondo(condo)}
                      className="text-base font-bold text-slate-900 mt-1 cursor-pointer group-hover:text-teal-800 transition-colors"
                    >
                      {condo.name}
                    </h3>

                    {/* Price & PSF */}
                    <div className="mt-2 flex items-baseline justify-between">
                      <span className="text-xl font-extrabold text-slate-900 font-mono-numbers">
                        S${condo.askingPrice.toLocaleString()}
                      </span>
                      <span className="text-xs text-stone-500 font-mono-numbers">
                        S${condo.pricePerSqFt} PSF
                      </span>
                    </div>

                    {/* Specs */}
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                      <span>{condo.bedrooms} Bed · {condo.bathrooms} Bath</span>
                      <span>{condo.floorAreaSqFt} sq ft</span>
                      <span>{condo.tenure.includes('Freehold') ? 'Freehold' : '99-yr'}</span>
                    </div>

                    {/* Transit */}
                    <div className="mt-3 bg-stone-50 p-2.5 rounded-xl text-xs text-stone-600 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 truncate">
                        <Train className="w-3.5 h-3.5 text-teal-700 shrink-0" />
                        <span className="truncate">{condo.nearestMrt.name}</span>
                      </div>
                      <span className="font-semibold text-teal-800 shrink-0 ml-2">
                        {condo.nearestMrt.walkTimeMinutes}m walk
                      </span>
                    </div>

                    {/* 4-Year scenario teaser */}
                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-stone-500">
                      <span>Est. Mortgage:</span>
                      <span className="font-mono-numbers font-semibold text-slate-800">
                        S${condo.estMonthlyMortgage.toLocaleString()}/mo
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500">
                      <span>4-Yr Base Profit:</span>
                      <span className="font-mono-numbers font-semibold text-teal-800">
                        +{condo.resaleBaseProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-5 pt-3 border-t border-stone-100 flex items-center gap-2">
                    <button
                      onClick={() => {
                        onSelectCondoForSimulation(condo.id);
                        setActiveTab('simulator');
                      }}
                      className="flex-1 py-2 px-3 rounded-lg bg-teal-50 hover:bg-teal-100/80 text-teal-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-teal-700" />
                      <span>Run 4-Yr Simulator</span>
                    </button>

                    <button
                      onClick={() => setInspectCondo(condo)}
                      className="py-2 px-3 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Condo Modal / Inspector Drawer */}
      {inspectCondo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="relative h-56 bg-stone-100">
              <img
                src={inspectCondo.imageUrl}
                alt={inspectCondo.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <button
                onClick={() => setInspectCondo(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-950/70 text-white hover:bg-slate-950 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-6 text-white">
                <div className="text-xs text-teal-300 font-semibold">{inspectCondo.district} · {inspectCondo.planningArea}</div>
                <h2 className="text-2xl font-bold">{inspectCondo.name}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6 text-xs">
              {/* Pricing & Key Numbers */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-xl border border-stone-200">
                <div>
                  <div className="text-stone-500 text-[10px]">Asking Price</div>
                  <div className="font-bold font-mono-numbers text-base text-slate-900">
                    S${inspectCondo.askingPrice.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Price PSF</div>
                  <div className="font-bold font-mono-numbers text-base text-slate-900">
                    S${inspectCondo.pricePerSqFt}
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Floor Area</div>
                  <div className="font-bold font-mono-numbers text-base text-slate-900">
                    {inspectCondo.floorAreaSqFt} sq ft
                  </div>
                </div>
                <div>
                  <div className="text-stone-500 text-[10px]">Maintenance (MCST)</div>
                  <div className="font-bold font-mono-numbers text-base text-teal-800">
                    S${inspectCondo.monthlyMaintenanceEst}/mo
                  </div>
                </div>
              </div>

              {/* Transit & Commute */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Public Transit & Commute Accessibility
                </h4>
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Nearest Station:</span>
                    <span className="font-semibold text-slate-900">{inspectCondo.nearestMrt.name} ({inspectCondo.nearestMrt.walkTimeMinutes} min walk, {inspectCondo.nearestMrt.distanceMeters}m)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Door-to-door to Raffles Place CBD:</span>
                    <span className="font-semibold text-teal-800">{inspectCondo.commuteTimeToCBDMinutes} mins</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-stone-600 font-medium">Door-to-door to One-North Tech Hub:</span>
                    <span className="font-semibold text-teal-800">{inspectCondo.commuteTimeToOneNorthMinutes} mins</span>
                  </div>
                </div>
              </div>

              {/* Primary Schools & MOE Boundary rules */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1">
                  Primary Schools & MOE Proximity (Phase 2C Priority)
                </h4>
                <p className="text-[11px] text-stone-500 mb-2">
                  *Disclaimer: School admission eligibility is strictly determined by MOE guidelines and official OneMap home-school measurements. Proximity within 1km affords priority but does not guarantee placement.
                </p>
                <div className="space-y-1.5">
                  <div className="p-2.5 rounded-lg bg-teal-50/50 border border-teal-200">
                    <div className="font-bold text-teal-950 mb-1">Schools within 1 km:</div>
                    <div className="flex flex-wrap gap-1.5">
                      {inspectCondo.primarySchoolsWithin1Km.map((sch) => (
                        <span key={sch} className="bg-white border border-teal-300 text-teal-900 px-2 py-0.5 rounded text-[11px]">
                          {sch}
                        </span>
                      ))}
                    </div>
                  </div>
                  {inspectCondo.primarySchoolsWithin2Km.length > 0 && (
                    <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                      <div className="font-medium text-stone-700 mb-1">Schools within 1 to 2 km:</div>
                      <div className="flex flex-wrap gap-1.5 text-stone-600">
                        {inspectCondo.primarySchoolsWithin2Km.map((sch) => (
                          <span key={sch} className="bg-white border border-stone-200 px-2 py-0.5 rounded text-[11px]">
                            {sch}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Key Highlights & Tradeoffs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-emerald-900 text-xs">Strategic Advantages</div>
                  <ul className="list-disc list-inside space-y-1 text-emerald-950 text-[11px]">
                    {inspectCondo.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-1.5">
                  <div className="font-bold text-amber-900 text-xs">Tradeoffs & Considerations</div>
                  <ul className="list-disc list-inside space-y-1 text-amber-950 text-[11px]">
                    {inspectCondo.tradeoffs.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleSaveCondo(inspectCondo.id);
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-200 transition-colors flex items-center gap-1.5"
              >
                <Heart className={`w-3.5 h-3.5 ${savedCondoIds.includes(inspectCondo.id) ? 'fill-rose-600 text-rose-600' : ''}`} />
                <span>{savedCondoIds.includes(inspectCondo.id) ? 'Saved in Shortlist' : 'Save Property'}</span>
              </button>

              <button
                onClick={() => {
                  onSelectCondoForSimulation(inspectCondo.id);
                  setInspectCondo(null);
                  setActiveTab('simulator');
                }}
                className="px-5 py-2 text-xs font-bold rounded-lg bg-teal-700 hover:bg-teal-800 text-white shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Simulate 4-Year Resale & Exit</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
