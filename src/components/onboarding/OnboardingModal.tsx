import React, { useState } from 'react';
import { X, Check, ArrowRight, ArrowLeft, Info, Sparkles, Building2, UserCheck, Wallet, Compass } from 'lucide-react';
import { BuyerProfile, Citizenship } from '../../types/property';
import { evaluateAffordability } from '../../services/financialEngine';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BuyerProfile;
  onSaveProfile: (newProfile: BuyerProfile) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<BuyerProfile>({ ...profile });

  if (!isOpen) return null;

  const currentAffordability = evaluateAffordability(formData);

  const applyPreset = (presetType: 'couple' | 'single_pr' | 'upgrader') => {
    if (presetType === 'couple') {
      setFormData({
        ...formData,
        citizenship: 'SC',
        age: 31,
        isJointPurchase: true,
        coBuyerCitizenship: 'SC',
        coBuyerAge: 30,
        monthlyIncome: 8000,
        coBuyerMonthlyIncome: 7000,
        cpfOA: 160000,
        cashSavings: 150000,
        monthlyDebts: 600,
        preferredTenureYears: 30,
        mortgageInterestRate: 3.5,
        hasExistingProperty: false,
        isConsideringHDB: false,
        preferredRegions: ['OCR', 'RCR'],
        maxBudget: 1750000,
        minBedrooms: 2,
        minFloorArea: 750,
        maxMrtDistanceMeters: 800,
        workplaceLocation: 'Raffles Place / CBD',
        maxCommuteMinutes: 35,
        hasSchoolNeeds: true,
        hasHealthcareNeeds: false,
        lifestyleVibe: 'balanced',
        intendedHoldingYears: 4
      });
    } else if (presetType === 'single_pr') {
      setFormData({
        ...formData,
        citizenship: 'SPR',
        age: 33,
        isJointPurchase: false,
        monthlyIncome: 13500,
        coBuyerMonthlyIncome: 0,
        cpfOA: 110000,
        cashSavings: 220000,
        monthlyDebts: 0,
        preferredTenureYears: 28,
        mortgageInterestRate: 3.4,
        hasExistingProperty: false,
        isConsideringHDB: false,
        preferredRegions: ['RCR'],
        maxBudget: 1600000,
        minBedrooms: 2,
        minFloorArea: 680,
        maxMrtDistanceMeters: 500,
        workplaceLocation: 'One-North / Buona Vista',
        maxCommuteMinutes: 25,
        hasSchoolNeeds: false,
        hasHealthcareNeeds: false,
        lifestyleVibe: 'urban_vibrant',
        intendedHoldingYears: 4
      });
    } else if (presetType === 'upgrader') {
      setFormData({
        ...formData,
        citizenship: 'SC',
        age: 38,
        isJointPurchase: true,
        coBuyerCitizenship: 'SC',
        coBuyerAge: 37,
        monthlyIncome: 12000,
        coBuyerMonthlyIncome: 10000,
        cpfOA: 280000,
        cashSavings: 320000,
        monthlyDebts: 1200,
        preferredTenureYears: 26,
        mortgageInterestRate: 3.5,
        hasExistingProperty: false, // Selling existing HDB
        isConsideringHDB: false,
        preferredRegions: ['RCR', 'OCR'],
        maxBudget: 2200000,
        minBedrooms: 3,
        minFloorArea: 900,
        maxMrtDistanceMeters: 700,
        workplaceLocation: 'Raffles Place / CBD',
        maxCommuteMinutes: 30,
        hasSchoolNeeds: true,
        hasHealthcareNeeds: true,
        lifestyleVibe: 'quiet_suburban',
        intendedHoldingYears: 4
      });
    }
  };

  const handleFinish = () => {
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header bar */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-slate-900">First-Time Buyer Intelligence Onboarding</span>
              <span className="text-xs text-stone-500 font-mono-numbers">Step {step} of 3</span>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              CondoCompass SG calibrates personalized MAS loan eligibility, ABSD tax tiers, and 4-year resale models.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets Strip */}
        <div className="px-6 py-2.5 bg-teal-50/60 border-b border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="text-teal-900 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            Quick Presets:
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => applyPreset('couple')}
              className="px-2.5 py-1 rounded bg-white text-stone-700 border border-teal-200 hover:bg-teal-100/50 transition-colors font-medium text-xs"
            >
              Young Couple ($15k SC)
            </button>
            <button
              onClick={() => applyPreset('single_pr')}
              className="px-2.5 py-1 rounded bg-white text-stone-700 border border-teal-200 hover:bg-teal-100/50 transition-colors font-medium text-xs"
            >
              PR Single ($13.5k)
            </button>
            <button
              onClick={() => applyPreset('upgrader')}
              className="px-2.5 py-1 rounded bg-white text-stone-700 border border-teal-200 hover:bg-teal-100/50 transition-colors font-medium text-xs"
            >
              Family Upgrader ($22k)
            </button>
          </div>
        </div>

        {/* Body content */}
        <div className="p-6 max-h-[68vh] overflow-y-auto space-y-6">

          {/* STEP 1: Personal & Financial Profile */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Citizenship & Joint Status */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  1. Citizenship & Ownership Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'SC', title: 'Singapore Citizen', desc: '0% ABSD for 1st residential property' },
                    { id: 'SPR', title: 'Permanent Resident', desc: '5% ABSD for 1st residential property' },
                    { id: 'FR', title: 'Foreigner', desc: '60% ABSD statutory rate' }
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, citizenship: item.id as Citizenship })}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        formData.citizenship === item.id
                          ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                          : 'border-stone-200 hover:border-stone-300 bg-white'
                      }`}
                    >
                      <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                      <div className="text-[11px] text-stone-500 mt-1">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Joint purchase toggle */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-900 block mb-1">
                    Purchasing Status
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isJointPurchase: false })}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border ${
                        !formData.isJointPurchase
                          ? 'bg-white border-slate-900 text-slate-900 font-semibold shadow-xs'
                          : 'bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      Single Buyer
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isJointPurchase: true, coBuyerCitizenship: 'SC', coBuyerAge: 30, coBuyerMonthlyIncome: 5000 })}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-medium border ${
                        formData.isJointPurchase
                          ? 'bg-white border-slate-900 text-slate-900 font-semibold shadow-xs'
                          : 'bg-stone-100 border-stone-200 text-stone-600'
                      }`}
                    >
                      Joint (Spouse / Co-buyer)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-900 block mb-1">
                    Primary Buyer Age
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min={21}
                      max={65}
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                      className="w-full accent-teal-700"
                    />
                    <span className="font-mono-numbers font-bold text-sm text-slate-900 w-12 text-right">
                      {formData.age} yrs
                    </span>
                  </div>
                </div>

                {formData.isJointPurchase && (
                  <>
                    <div>
                      <label className="text-xs font-semibold text-slate-900 block mb-1">
                        Co-Buyer Citizenship
                      </label>
                      <select
                        value={formData.coBuyerCitizenship || 'SC'}
                        onChange={(e) => setFormData({ ...formData, coBuyerCitizenship: e.target.value as Citizenship })}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                      >
                        <option value="SC">Singapore Citizen</option>
                        <option value="SPR">Permanent Resident (SPR)</option>
                        <option value="FR">Foreigner</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-900 block mb-1">
                        Co-Buyer Gross Income (S$/mo)
                      </label>
                      <input
                        type="number"
                        step={500}
                        value={formData.coBuyerMonthlyIncome || 0}
                        onChange={(e) => setFormData({ ...formData, coBuyerMonthlyIncome: Number(e.target.value) })}
                        className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white font-mono-numbers"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Financial Inputs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  2. Income, Savings & Existing Debts (SGD)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Primary Monthly Gross Income (S$)
                    </label>
                    <input
                      type="number"
                      step={500}
                      value={formData.monthlyIncome}
                      onChange={(e) => setFormData({ ...formData, monthlyIncome: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono-numbers font-semibold"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Excludes variable year-end bonuses.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Existing Monthly Debts (S$)
                    </label>
                    <input
                      type="number"
                      step={100}
                      value={formData.monthlyDebts}
                      onChange={(e) => setFormData({ ...formData, monthlyDebts: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono-numbers font-semibold"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Car loan, credit card, personal loans.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      CPF Ordinary Account Available (S$)
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={formData.cpfOA}
                      onChange={(e) => setFormData({ ...formData, cpfOA: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono-numbers font-semibold"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Usable for down payment and stamp duties.</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Cash Savings Dedicated for Purchase (S$)
                    </label>
                    <input
                      type="number"
                      step={10000}
                      value={formData.cashSavings}
                      onChange={(e) => setFormData({ ...formData, cashSavings: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono-numbers font-semibold"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">Must have at least 5% minimum cash down.</p>
                  </div>
                </div>
              </div>

              {/* Ownership & MAS tenure checks */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-slate-900 block">Do you currently own residential property?</span>
                    <span className="text-stone-500 text-[11px]">Affects ABSD and bank LTV (75% drops to 45% if owning an existing home).</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasExistingProperty: !formData.hasExistingProperty })}
                    className={`px-3 py-1.5 rounded-md font-semibold text-xs transition-colors ${
                      formData.hasExistingProperty
                        ? 'bg-amber-600 text-white'
                        : 'bg-stone-200 text-stone-700'
                    }`}
                  >
                    {formData.hasExistingProperty ? 'Yes (2nd Property)' : 'No (First-Timer)'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-stone-200">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Preferred Loan Tenure: <span className="font-mono-numbers font-bold">{formData.preferredTenureYears} Years</span>
                    </label>
                    <input
                      type="range"
                      min={15}
                      max={30}
                      value={formData.preferredTenureYears}
                      onChange={(e) => setFormData({ ...formData, preferredTenureYears: Number(e.target.value) })}
                      className="w-full accent-teal-700"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Mortgage Rate Benchmark: <span className="font-mono-numbers font-bold">{formData.mortgageInterestRate}%</span>
                    </label>
                    <input
                      type="range"
                      min={2.5}
                      max={5.5}
                      step={0.1}
                      value={formData.mortgageInterestRate}
                      onChange={(e) => setFormData({ ...formData, mortgageInterestRate: Number(e.target.value) })}
                      className="w-full accent-teal-700"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Lifestyle, Commute & Priorities */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  1. Region & Purchase Budget
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Target Maximum Purchase Budget (S$)
                    </label>
                    <input
                      type="number"
                      step={50000}
                      value={formData.maxBudget}
                      onChange={(e) => setFormData({ ...formData, maxBudget: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-lg border border-stone-300 text-sm font-mono-numbers font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-stone-700 block mb-1">
                      Preferred Bedrooms
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((beds) => (
                        <button
                          key={beds}
                          type="button"
                          onClick={() => setFormData({ ...formData, minBedrooms: beds })}
                          className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                            formData.minBedrooms === beds
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                          }`}
                        >
                          {beds} {beds === 4 ? 'Bed+' : 'Bed'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit & Commute */}
              <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-900 block mb-1">
                      Primary Commute Destination
                    </label>
                    <select
                      value={formData.workplaceLocation}
                      onChange={(e) => setFormData({ ...formData, workplaceLocation: e.target.value as any })}
                      className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white"
                    >
                      <option value="Raffles Place / CBD">Raffles Place / Marina Bay CBD</option>
                      <option value="One-North / Buona Vista">One-North / Buona Vista Tech Hub</option>
                      <option value="Jurong Lake District">Jurong Lake District (JLD)</option>
                      <option value="Changi Business Park">Changi Business Park</option>
                      <option value="Paya Lebar Hub">Paya Lebar Hub</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-900 block mb-1">
                      Max Door-to-Door Commute: <span className="font-mono-numbers font-bold">{formData.maxCommuteMinutes} Mins</span>
                    </label>
                    <input
                      type="range"
                      min={15}
                      max={60}
                      step={5}
                      value={formData.maxCommuteMinutes}
                      onChange={(e) => setFormData({ ...formData, maxCommuteMinutes: Number(e.target.value) })}
                      className="w-full accent-teal-700"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-200">
                  <span className="font-medium text-stone-700">Walking distance to MRT:</span>
                  <div className="flex gap-2">
                    {[500, 800, 1200].map((dist) => (
                      <button
                        key={dist}
                        type="button"
                        onClick={() => setFormData({ ...formData, maxMrtDistanceMeters: dist })}
                        className={`px-2.5 py-1 rounded text-xs font-medium border ${
                          formData.maxMrtDistanceMeters === dist
                            ? 'bg-teal-700 text-white border-teal-700'
                            : 'bg-white text-stone-600 border-stone-200'
                        }`}
                      >
                        &le; {dist}m
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Family & Childcare Needs */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
                  2. Priority Amenity Filters
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasSchoolNeeds: !formData.hasSchoolNeeds })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.hasSchoolNeeds
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Primary School Proximity (&le; 1km)</span>
                      {formData.hasSchoolNeeds && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Includes Phase 2C MOE balloting priority weighting.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasHealthcareNeeds: !formData.hasHealthcareNeeds })}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      formData.hasHealthcareNeeds
                        ? 'border-teal-600 bg-teal-50/60 ring-1 ring-teal-600'
                        : 'border-stone-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Healthcare Accessibility (&le; 5km)</span>
                      {formData.hasHealthcareNeeds && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Regional acute hospital or polyclinic proximity.
                    </p>
                  </button>
                </div>
              </div>

              {/* Lifestyle Vibe */}
              <div>
                <label className="block text-xs font-semibold text-slate-900 mb-1.5">
                  Neighbourhood Lifestyle Preference
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'quiet_suburban', label: 'Quiet & Green', desc: 'Nature trails, low noise' },
                    { id: 'balanced', label: 'Balanced Community', desc: 'Heartland malls, parks' },
                    { id: 'urban_vibrant', label: 'Urban & Connected', desc: 'City fringe, cafes, retail' }
                  ].map((vibe) => (
                    <button
                      key={vibe.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, lifestyleVibe: vibe.id as any })}
                      className={`p-2.5 rounded-lg border text-left text-xs ${
                        formData.lifestyleVibe === vibe.id
                          ? 'border-slate-900 bg-stone-100 font-semibold text-slate-900'
                          : 'border-stone-200 bg-white text-stone-600'
                      }`}
                    >
                      <div className="font-semibold">{vibe.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{vibe.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Live Affordability Preview */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-teal-900 text-white p-5 rounded-2xl">
                <div className="text-xs uppercase tracking-wider text-teal-300 font-semibold mb-1">
                  Affordability Modeling Summary
                </div>
                <div className="text-3xl font-extrabold font-mono-numbers">
                  S${currentAffordability.maxPurchasePrice.toLocaleString()}
                </div>
                <div className="text-xs text-teal-100/90 mt-1">
                  Estimated maximum prudent property price within MAS 55% TDSR and liquid capital
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-teal-800 text-xs">
                  <div>
                    <div className="text-teal-300 text-[10px]">Max 75% Bank Loan</div>
                    <div className="font-bold font-mono-numbers text-sm">
                      S${currentAffordability.maxEligibleLoan.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-teal-300 text-[10px]">Est. Monthly Mortgage</div>
                    <div className="font-bold font-mono-numbers text-sm">
                      S${currentAffordability.maxMonthlyMortgage.toLocaleString()}/mo
                    </div>
                  </div>
                  <div>
                    <div className="text-teal-300 text-[10px]">Buyer Stamp Duty (BSD)</div>
                    <div className="font-bold font-mono-numbers text-sm">
                      S${currentAffordability.bsd.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-teal-300 text-[10px]">ABSD ({formData.citizenship})</div>
                    <div className="font-bold font-mono-numbers text-sm">
                      S${currentAffordability.absd.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Upfront capital split */}
              <div className="border border-stone-200 rounded-xl p-4 bg-stone-50">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Upfront Capital Requirement Breakdown
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-600">Total 25% Down Payment</span>
                    <span className="font-mono-numbers font-semibold">S${currentAffordability.totalDownPaymentRequired.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 text-stone-600 pl-4">
                    <span>- Mandatory 5% Hard Cash Down Payment</span>
                    <span className="font-mono-numbers font-medium text-amber-700">S${currentAffordability.minimumCashDownPayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200 text-stone-600 pl-4">
                    <span>- 20% Balance (Payable via CPF OA or Cash)</span>
                    <span className="font-mono-numbers font-medium text-teal-700">S${currentAffordability.cpfDownPaymentAllowed.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-stone-200">
                    <span className="text-stone-600">Total Stamp Duties (BSD + ABSD)</span>
                    <span className="font-mono-numbers font-semibold">S${(currentAffordability.bsd + currentAffordability.absd).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-1 font-bold text-slate-900 pt-1">
                    <span>Total Upfront Liquid Capital Required</span>
                    <span className="font-mono-numbers text-teal-800">S${currentAffordability.totalUpfrontCapitalRequired.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Regulatory explanation reminder */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Why these factors matter:</span> Your citizenship determines ABSD liability (0% for SC vs 5% for SPR vs 60% for Foreigners). Age and loan tenure dictate whether you qualify for maximum 75% LTV or drop to 55%. MAS stress-tests borrowing limits at 4.0% interest rate to prevent overcommitment.
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-stone-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-stone-500 hover:text-stone-800 font-medium"
            >
              Skip for now
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save & Launch Dashboard</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
