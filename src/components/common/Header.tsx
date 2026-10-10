import React from 'react';
import { Bookmark, Scale, SlidersHorizontal, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openOnboarding: () => void;
  savedCount: number;
  compareCount: number;
  openDecisionDossier: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openOnboarding,
  savedCount,
  compareCount,
  openDecisionDossier
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Strict 3-zone Top Bar Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors whitespace-nowrap shrink-0">
              CondoCompass <span className="text-teal-600 font-bold">SG</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-xs text-stone-500 font-medium">
              Buy for Living. Plan for Tomorrow.
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean text) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-stone-600">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'dashboard' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab('discovery')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'discovery' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            Discover Condos
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'simulator' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            4-Year Resale Simulator
          </button>
          <button
            onClick={() => setActiveTab('calculator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'calculator' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            Affordability
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'map' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            Map
          </button>
          <button
            onClick={() => setActiveTab('advisor')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${activeTab === 'advisor' ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'}`}
          >
            AI Advisor
          </button>
        </nav>

        {/* Zone 3: Primary Action & Quick Tools */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('compare')}
            title="Compare Shortlisted Condos"
            className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              activeTab === 'compare'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compare</span>
            {compareCount > 0 && (
              <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {compareCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            title="Saved Condos"
            className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors ${
              activeTab === 'saved'
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Saved</span>
            {savedCount > 0 && (
              <span className="bg-teal-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={openOnboarding}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden md:inline">Buyer Profile</span>
            <span className="md:hidden">Profile</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation bar for seamless mobile & full-suite tabs access */}
      <div className="bg-stone-100/80 border-t border-stone-200/70 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-2 min-w-max text-xs">
          {[
            { id: 'dashboard', label: 'Dashboard' },
            { id: 'discovery', label: 'Discover Condos' },
            { id: 'map', label: 'Interactive Map' },
            { id: 'simulator', label: '4-Year Resale Simulator' },
            { id: 'calculator', label: 'Affordability Calculator' },
            { id: 'lifestyle', label: 'Lifestyle Intelligence' },
            { id: 'compare', label: `Compare Properties (${compareCount})` },
            { id: 'market', label: 'Market Insights' },
            { id: 'regulations', label: 'Singapore Rules' },
            { id: 'advisor', label: 'AI Property Advisor' },
            { id: 'saved', label: `Saved (${savedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap shrink-0 ${
                activeTab === tab.id
                  ? 'bg-teal-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-slate-900 hover:bg-stone-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="ml-auto pl-4">
            <button
              onClick={openDecisionDossier}
              className="text-xs font-semibold text-teal-800 hover:text-teal-950 flex items-center gap-1 hover:underline"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Export Decision Summary</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
