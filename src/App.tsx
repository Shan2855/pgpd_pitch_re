import React, { useState, useEffect } from 'react';
import { BuyerProfile } from './types/property';
import { DEMO_CONDOS } from './data/condos';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { OverviewDashboard } from './components/dashboard/OverviewDashboard';
import { CondoDiscovery } from './components/discovery/CondoDiscovery';
import { InteractiveMap } from './components/map/InteractiveMap';
import { FourYearSimulator } from './components/simulator/FourYearSimulator';
import { AffordabilityCalculator } from './components/calculator/AffordabilityCalculator';
import { LifestyleIntelligence } from './components/lifestyle/LifestyleIntelligence';
import { PropertyComparison } from './components/comparison/PropertyComparison';
import { MarketInsights } from './components/market/MarketInsights';
import { SingaporeRules } from './components/regulations/SingaporeRules';
import { AIAdvisor } from './components/advisor/AIAdvisor';
import { DecisionDossierModal } from './components/saved/DecisionDossierModal';
import { Bookmark, Building2, Trash2, ArrowRight } from 'lucide-react';

const DEFAULT_BUYER_PROFILE: BuyerProfile = {
  citizenship: 'SC',
  age: 32,
  isJointPurchase: true,
  coBuyerCitizenship: 'SC',
  coBuyerAge: 31,
  monthlyIncome: 8500,
  coBuyerMonthlyIncome: 6500, // Total household S$15,000/mo
  cpfOA: 180000,
  cashSavings: 160000,
  monthlyDebts: 650, // e.g. car loan
  preferredTenureYears: 30,
  mortgageInterestRate: 3.5,
  hasExistingProperty: false,
  isConsideringHDB: false,
  preferredRegions: ['OCR', 'RCR'],
  preferredDistricts: ['D18', 'D19', 'D03', 'D05'],
  maxBudget: 1750000,
  minBedrooms: 2,
  minFloorArea: 750,
  maxMrtDistanceMeters: 800,
  workplaceLocation: 'Raffles Place / CBD',
  maxCommuteMinutes: 35,
  hasSchoolNeeds: true,
  hasHealthcareNeeds: false,
  lifestyleVibe: 'balanced',
  intendedHoldingYears: 4,
  weights: {
    affordability: 25,
    transport: 20,
    schools: 15,
    healthcare: 10,
    groceries: 10,
    amenities: 10,
    parks: 10
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  // Persistent profile in LocalStorage
  const [profile, setProfile] = useState<BuyerProfile>(() => {
    try {
      const saved = localStorage.getItem('condocompass_profile');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_BUYER_PROFILE;
  });

  // Persistent Saved & Comparison Condos
  const [savedCondoIds, setSavedCondoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('condocompass_saved');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['condo-treasure-tampines', 'condo-stirling-queenstown'];
  });

  const [compareCondoIds, setCompareCondoIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('condocompass_compare');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['condo-treasure-tampines', 'condo-stirling-queenstown', 'condo-mayfair-bukittimah'];
  });

  const [selectedCondoForSimulation, setSelectedCondoForSimulation] = useState<string>('condo-treasure-tampines');
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(false);
  const [isDecisionDossierOpen, setIsDecisionDossierOpen] = useState<boolean>(false);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('condocompass_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('condocompass_saved', JSON.stringify(savedCondoIds));
    } catch {}
  }, [savedCondoIds]);

  useEffect(() => {
    try {
      localStorage.setItem('condocompass_compare', JSON.stringify(compareCondoIds));
    } catch {}
  }, [compareCondoIds]);

  const toggleSaveCondo = (id: string) => {
    setSavedCondoIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompareCondo = (id: string) => {
    setCompareCondoIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 3) {
        return [prev[1], prev[2], id]; // keep max 3
      }
      return [...prev, id];
    });
  };

  const handleResetDemoData = () => {
    localStorage.removeItem('condocompass_profile');
    localStorage.removeItem('condocompass_saved');
    localStorage.removeItem('condocompass_compare');
    setProfile(DEFAULT_BUYER_PROFILE);
    setSavedCondoIds(['condo-treasure-tampines', 'condo-stirling-queenstown']);
    setCompareCondoIds(['condo-treasure-tampines', 'condo-stirling-queenstown', 'condo-mayfair-bukittimah']);
    setSelectedCondoForSimulation('condo-treasure-tampines');
    setActiveTab('dashboard');
  };

  const savedCondosList = DEMO_CONDOS.filter((c) => savedCondoIds.includes(c.id));

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Navigation Bar complying with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openOnboarding={() => setIsOnboardingOpen(true)}
        savedCount={savedCondoIds.length}
        compareCount={compareCondoIds.length}
        openDecisionDossier={() => setIsDecisionDossierOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        
        {/* VIEW 1: Overview Dashboard */}
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            profile={profile}
            condos={DEMO_CONDOS}
            savedCondoIds={savedCondoIds}
            toggleSaveCondo={toggleSaveCondo}
            compareCondoIds={compareCondoIds}
            toggleCompareCondo={toggleCompareCondo}
            setActiveTab={setActiveTab}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            openOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {/* VIEW 2: Condo Discovery */}
        {activeTab === 'discovery' && (
          <CondoDiscovery
            profile={profile}
            condos={DEMO_CONDOS}
            savedCondoIds={savedCondoIds}
            toggleSaveCondo={toggleSaveCondo}
            compareCondoIds={compareCondoIds}
            toggleCompareCondo={toggleCompareCondo}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 3: Interactive Singapore Map */}
        {activeTab === 'map' && (
          <InteractiveMap
            condos={DEMO_CONDOS}
            selectedCondoId={selectedCondoForSimulation}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 4: Four-Year Resale & Investment Simulator */}
        {activeTab === 'simulator' && (
          <FourYearSimulator
            profile={profile}
            condos={DEMO_CONDOS}
            selectedCondoId={selectedCondoForSimulation}
          />
        )}

        {/* VIEW 5: Affordability Calculator */}
        {activeTab === 'calculator' && (
          <AffordabilityCalculator
            profile={profile}
            onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
          />
        )}

        {/* VIEW 6: Lifestyle Intelligence */}
        {activeTab === 'lifestyle' && (
          <LifestyleIntelligence
            profile={profile}
            condos={DEMO_CONDOS}
            onUpdateWeights={(w) => setProfile((p) => ({ ...p, weights: w }))}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 7: Side-by-Side Property Comparison */}
        {activeTab === 'compare' && (
          <PropertyComparison
            profile={profile}
            condos={DEMO_CONDOS}
            compareCondoIds={compareCondoIds}
            toggleCompareCondo={toggleCompareCondo}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 8: Singapore Market Insights */}
        {activeTab === 'market' && <MarketInsights />}

        {/* VIEW 9: Singapore Property Rules */}
        {activeTab === 'regulations' && <SingaporeRules />}

        {/* VIEW 10: AI Property Advisor */}
        {activeTab === 'advisor' && (
          <AIAdvisor
            profile={profile}
            condos={DEMO_CONDOS}
            onSelectCondoForSimulation={(id) => setSelectedCondoForSimulation(id)}
            setActiveTab={setActiveTab}
          />
        )}

        {/* VIEW 11: Saved Condos */}
        {activeTab === 'saved' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Saved Condominium Shortlist
                </h1>
                <p className="text-xs text-stone-500 mt-0.5">
                  {savedCondosList.length} shortlisted properties saved to browser storage.
                </p>
              </div>
              <button
                onClick={handleResetDemoData}
                className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg flex items-center gap-1.5 transition-colors border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>

            {savedCondosList.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No properties in your saved shortlist</h3>
                <p className="text-xs text-stone-500 mt-1">
                  Browse the condo discovery catalog and click the heart icon on any card to save it.
                </p>
                <button
                  onClick={() => setActiveTab('discovery')}
                  className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
                >
                  Discover Condos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedCondosList.map((condo) => (
                  <div key={condo.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden flex flex-col justify-between">
                    <div className="relative h-48 bg-stone-100">
                      <img src={condo.imageUrl} alt={condo.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleSaveCondo(condo.id)}
                        className="absolute top-3 right-3 p-1.5 rounded-full bg-rose-600 text-white shadow-xs"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-[11px] text-stone-500">{condo.planningArea} · {condo.district}</div>
                        <h3 className="text-base font-bold text-slate-900 mt-0.5">{condo.name}</h3>
                        <div className="font-extrabold font-mono-numbers text-lg text-slate-900 mt-1">
                          S${condo.askingPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedCondoForSimulation(condo.id);
                            setActiveTab('simulator');
                          }}
                          className="flex-1 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg text-xs font-bold transition-colors"
                        >
                          Simulate 4-Yr Resale
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* Onboarding Wizard Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        profile={profile}
        onSaveProfile={(newProf) => setProfile(newProf)}
      />

      {/* Decision Summary Export Dossier Modal */}
      <DecisionDossierModal
        isOpen={isDecisionDossierOpen}
        onClose={() => setIsDecisionDossierOpen(false)}
        profile={profile}
        condos={DEMO_CONDOS}
        savedCondoIds={savedCondoIds}
      />

      {/* Regulatory & Institutional Footer */}
      <Footer />

    </div>
  );
}
