import React, { useState, useMemo } from 'react';
import {
  Building2,
  Bus,
  Check,
  Compass,
  GraduationCap,
  HeartPulse,
  Info,
  Layers,
  MapPin,
  ShoppingBag,
  Sparkles,
  Train,
  X
} from 'lucide-react';
import { CondoProperty } from '../../types/property';
import { MAP_AMENITIES, MapAmenity } from '../../data/amenities';

interface InteractiveMapProps {
  condos: CondoProperty[];
  selectedCondoId?: string;
  onSelectCondoForSimulation: (id: string) => void;
  setActiveTab: (tab: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  condos,
  selectedCondoId,
  onSelectCondoForSimulation,
  setActiveTab
}) => {
  const [activeCondoId, setActiveCondoId] = useState<string>(selectedCondoId || condos[0]?.id || '');
  
  // Layer toggles
  const [showMrt, setShowMrt] = useState<boolean>(true);
  const [showSchools, setShowSchools] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showMalls, setShowMalls] = useState<boolean>(true);
  const [showBusiness, setShowBusiness] = useState<boolean>(true);

  // Proximity filters
  const [mrtThresholdMeters, setMrtThresholdMeters] = useState<number>(800);
  const [schoolWithin1KmOnly, setSchoolWithin1KmOnly] = useState<boolean>(true);

  const activeCondo = useMemo(() => {
    return condos.find((c) => c.id === activeCondoId) || condos[0];
  }, [condos, activeCondoId]);

  // Nearby amenities to the active condo
  const nearbyFacilities = useMemo(() => {
    if (!activeCondo) return [];
    return activeCondo.amenities;
  }, [activeCondo]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Title Bar */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Compass className="w-4 h-4 text-teal-700" />
              <span>Singapore Spatial Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Interactive Singapore Property & Transit Map
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore condominium locations, MRT interchange alignments, MOE 1km primary school buffers, and acute healthcare centers across Singapore.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs bg-stone-50 p-2 rounded-xl border border-stone-200">
            <span className="font-semibold text-stone-600">Active Selection:</span>
            <span className="font-bold text-teal-900 font-mono-numbers">{activeCondo ? activeCondo.name : 'None'}</span>
          </div>
        </div>

        {/* Layer Controls Bar */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-stone-500 font-bold uppercase text-[10px] tracking-wider flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-stone-600" />
            Layers:
          </span>

          <button
            onClick={() => setShowMrt(!showMrt)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showMrt ? 'bg-red-50 text-red-900 border-red-200 font-bold' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <Train className="w-3 h-3 text-red-600" />
            <span>MRT Lines & Stations</span>
          </button>

          <button
            onClick={() => setShowSchools(!showSchools)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showSchools ? 'bg-blue-50 text-blue-900 border-blue-200 font-bold' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <GraduationCap className="w-3 h-3 text-blue-600" />
            <span>Primary Schools (MOE 1km)</span>
          </button>

          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showHospitals ? 'bg-rose-50 text-rose-900 border-rose-200 font-bold' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <HeartPulse className="w-3 h-3 text-rose-600" />
            <span>Hospitals & Polyclinics</span>
          </button>

          <button
            onClick={() => setShowMalls(!showMalls)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showMalls ? 'bg-amber-50 text-amber-900 border-amber-200 font-bold' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <ShoppingBag className="w-3 h-3 text-amber-600" />
            <span>Retail & Supermarkets</span>
          </button>

          <button
            onClick={() => setShowBusiness(!showBusiness)}
            className={`px-3 py-1.5 rounded-lg border font-medium flex items-center gap-1.5 transition-colors ${
              showBusiness ? 'bg-purple-50 text-purple-900 border-purple-200 font-bold' : 'bg-white text-stone-500 border-stone-200'
            }`}
          >
            <Building2 className="w-3 h-3 text-purple-600" />
            <span>Business Hubs (CBD/One-North)</span>
          </button>
        </div>
      </div>

      {/* Main Map View & Inspector Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Interactive SVG Singapore Map Container */}
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-4 sm:p-6 shadow-md border border-slate-800 relative overflow-hidden min-h-[500px] flex flex-col justify-between">
          
          {/* Watermark & OneMap abstraction badge */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 z-10">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Singapore Geospatial Canvas</span>
              <span>·</span>
              <span>OneMap API Abstraction Layer</span>
            </div>
            <span className="bg-slate-800 text-teal-400 px-2 py-0.5 rounded font-mono-numbers">
              WGS84 Coordinates
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-[450px] sm:h-[490px] my-4 select-none">
            
            {/* Singapore stylized coastline outline SVG */}
            <svg
              viewBox="0 0 100 80"
              className="w-full h-full filter drop-shadow-lg"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Singapore Island Land Gradient */}
                <linearGradient id="sgLand" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1e293b" />
                  <stop offset="100%" stopColor="#0f172a" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Water Backdrop is container background */}

              {/* Singapore Mainland stylized polygon */}
              <path
                d="M 16,36 Q 22,24 35,22 Q 45,20 54,22 Q 62,18 70,22 Q 78,25 84,32 Q 92,38 94,44 Q 90,52 82,58 Q 72,62 58,68 Q 48,74 42,70 Q 32,66 22,60 Q 14,54 12,46 Z"
                fill="url(#sgLand)"
                stroke="#334155"
                strokeWidth="0.8"
              />

              {/* Sentosa Island */}
              <ellipse cx="46" cy="74" rx="4" ry="1.8" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
              {/* Pulau Ubin */}
              <ellipse cx="80" cy="22" rx="4.5" ry="1.6" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
              {/* Jurong Island */}
              <ellipse cx="20" cy="62" rx="5" ry="2.2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />

              {/* Major MRT alignments (East-West & Downtown & Circle simplified traces) */}
              {showMrt && (
                <>
                  {/* East-West Line (Green) */}
                  <path
                    d="M 22,54 L 33,56 L 44,64 L 50,70 L 64,66 L 74,62 L 84,44 L 88,48"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="0.7"
                    strokeDasharray="1.5 1"
                    opacity="0.75"
                  />
                  {/* North-South Line (Red) */}
                  <path
                    d="M 26,52 L 40,36 L 50,24 L 55,42 L 51,70"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="0.7"
                    strokeDasharray="1.5 1"
                    opacity="0.6"
                  />
                  {/* Downtown Line (Blue) */}
                  <path
                    d="M 38,44 L 41,46 L 46,54 L 50,70 L 68,54 L 84,44"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="0.7"
                    strokeDasharray="1.5 1"
                    opacity="0.6"
                  />
                </>
              )}

              {/* Selected Condo Proximity Pulse Ring */}
              {activeCondo && (
                <circle
                  cx={activeCondo.mapCoords.x}
                  cy={activeCondo.mapCoords.y}
                  r="6"
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="0.8"
                  strokeDasharray="1 1"
                  className="animate-pulse"
                />
              )}
            </svg>

            {/* Amenity pins rendered in absolute layer */}
            {MAP_AMENITIES.map((amenity) => {
              if (amenity.type === 'mrt' && !showMrt) return null;
              if (amenity.type === 'school' && !showSchools) return null;
              if (amenity.type === 'hospital' && !showHospitals) return null;
              if (amenity.type === 'mall' && !showMalls) return null;
              if (amenity.type === 'business' && !showBusiness) return null;

              const getAmenityColor = () => {
                if (amenity.type === 'mrt') return 'bg-red-500 border-red-300';
                if (amenity.type === 'school') return 'bg-blue-500 border-blue-300';
                if (amenity.type === 'hospital') return 'bg-rose-500 border-rose-300';
                if (amenity.type === 'mall') return 'bg-amber-500 border-amber-300';
                return 'bg-purple-500 border-purple-300';
              };

              return (
                <div
                  key={amenity.id}
                  style={{ left: `${amenity.x}%`, top: `${amenity.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
                >
                  <div className={`w-2.5 h-2.5 rounded-full border ${getAmenityColor()} shadow-xs group-hover:scale-150 transition-transform`} />
                  
                  {/* Hover tooltip */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-950 text-white text-[10px] py-1 px-2 rounded-md whitespace-nowrap shadow-lg border border-slate-700 pointer-events-none z-30">
                    <div className="font-bold">{amenity.name}</div>
                    <div className="text-slate-400">{amenity.details}</div>
                  </div>
                </div>
              );
            })}

            {/* Condominium Pins */}
            {condos.map((condo) => {
              const isSelected = condo.id === activeCondo.id;

              return (
                <button
                  key={condo.id}
                  type="button"
                  onClick={() => setActiveCondoId(condo.id)}
                  style={{ left: `${condo.mapCoords.x}%`, top: `${condo.mapCoords.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-30 transition-transform focus:outline-none ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-115'
                  }`}
                >
                  <div
                    className={`px-2 py-1 rounded-full text-[10px] font-bold shadow-md flex items-center gap-1 border transition-colors ${
                      isSelected
                        ? 'bg-teal-500 text-slate-950 border-white ring-2 ring-teal-400'
                        : 'bg-slate-900/90 text-teal-300 border-teal-500/50 hover:bg-teal-900'
                    }`}
                  >
                    <Building2 className="w-2.5 h-2.5" />
                    <span className="hidden sm:inline font-mono-numbers">S${(condo.askingPrice / 1000000).toFixed(1)}M</span>
                  </div>
                </button>
              );
            })}

          </div>

          {/* Map Legend Footer */}
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400 ring-1 ring-white" /> Condominium</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> MRT Station</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> Primary School</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Hospital</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Shopping Mall</span>
            </div>
            <div>
              <span>Click any pin to inspect surrounding radius</span>
            </div>
          </div>
        </div>

        {/* Selected Condo Proximity Inspector Card */}
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
              <span>{activeCondo.district}</span>
              <span className="font-mono-numbers font-semibold text-teal-800">
                S${activeCondo.pricePerSqFt} PSF
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-900">
              {activeCondo.name}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {activeCondo.address}
            </p>

            <div className="mt-3 flex items-baseline justify-between border-b border-stone-100 pb-3">
              <span className="text-2xl font-extrabold text-slate-900 font-mono-numbers">
                S${activeCondo.askingPrice.toLocaleString()}
              </span>
              <span className="text-xs text-stone-600">
                {activeCondo.bedrooms} Bed · {activeCondo.floorAreaSqFt} sq ft
              </span>
            </div>

            {/* Transit connection */}
            <div className="mt-4 p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs">
              <div className="flex items-center justify-between font-bold text-teal-950">
                <span className="flex items-center gap-1.5">
                  <Train className="w-3.5 h-3.5 text-teal-700" />
                  {activeCondo.nearestMrt.name}
                </span>
                <span className="font-mono-numbers">{activeCondo.nearestMrt.walkTimeMinutes} min walk</span>
              </div>
              <div className="text-[11px] text-teal-800 mt-1 flex justify-between">
                <span>Distance: {activeCondo.nearestMrt.distanceMeters}m</span>
                <span>To CBD: ~{activeCondo.commuteTimeToCBDMinutes} mins</span>
              </div>
            </div>

            {/* Nearby facilities list */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                Surrounding Facilities & Amenities
              </h4>
              <div className="space-y-2 text-xs">
                {nearbyFacilities.map((fac, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-slate-900">{fac.name}</div>
                      <div className="text-[10px] text-stone-500 capitalize">{fac.type}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono-numbers font-semibold text-teal-800">{fac.distanceMeters}m</div>
                      <div className="text-[10px] text-stone-400 font-mono-numbers">{fac.walkTimeMinutes}m walk</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MOE Primary School Warning */}
            <div className="mt-4 p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Primary School Balloting Note:</strong> Priority Phase 2C depends on MOE home-school distance regulations (&le; 1km vs 1–2km). Proximity does not guarantee admission.
              </div>
            </div>
          </div>

          {/* Action button */}
          <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2">
            <button
              onClick={() => {
                onSelectCondoForSimulation(activeCondo.id);
                setActiveTab('simulator');
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Simulate 4-Yr Resale for {activeCondo.name}</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
