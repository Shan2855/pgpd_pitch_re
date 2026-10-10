import React, { useState, useMemo } from 'react';
import {
  AlertCircle,
  Calculator,
  CheckCircle,
  DollarSign,
  HelpCircle,
  Info,
  Percent,
  RefreshCw,
  ShieldCheck,
  Wallet
} from 'lucide-react';
import { BuyerProfile, Citizenship } from '../../types/property';
import {
  calculateBSD,
  calculateABSD,
  calculateMonthlyMortgage,
  calculateMaxLoanTDSR,
  getLtvRatioAndMinCash
} from '../../services/financialEngine';

interface AffordabilityCalculatorProps {
  profile: BuyerProfile;
  onUpdateProfile: (updated: Partial<BuyerProfile>) => void;
}

export const AffordabilityCalculator: React.FC<AffordabilityCalculatorProps> = ({
  profile,
  onUpdateProfile
}) => {
  // Local calculator state initialized from buyer profile
  const [propertyPrice, setPropertyPrice] = useState<number>(1600000);
  const [income, setIncome] = useState<number>(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0));
  const [cpfOAAvailable, setCpfOAAvailable] = useState<number>(profile.cpfOA);
  const [cashAvailable, setCashAvailable] = useState<number>(profile.cashSavings);
  const [monthlyDebts, setMonthlyDebts] = useState<number>(profile.monthlyDebts);
  const [buyerAge, setBuyerAge] = useState<number>(profile.age);
  const [tenureYears, setTenureYears] = useState<number>(profile.preferredTenureYears);
  const [interestRate, setInterestRate] = useState<number>(profile.mortgageInterestRate);
  const [citizenship, setCitizenship] = useState<Citizenship>(profile.citizenship);
  const [hasExistingProperty, setHasExistingProperty] = useState<boolean>(profile.hasExistingProperty);
  const [isJointPurchase, setIsJointPurchase] = useState<boolean>(profile.isJointPurchase);
  const [coBuyerCitizenship, setCoBuyerCitizenship] = useState<Citizenship>(profile.coBuyerCitizenship || 'SC');

  // Mathematical outputs
  const bsd = useMemo(() => calculateBSD(propertyPrice), [propertyPrice]);
  const absd = useMemo(() => calculateABSD(propertyPrice, citizenship, hasExistingProperty, isJointPurchase, coBuyerCitizenship), [propertyPrice, citizenship, hasExistingProperty, isJointPurchase, coBuyerCitizenship]);
  
  const { ltvPercent, minCashDownPercent } = useMemo(
    () => getLtvRatioAndMinCash(buyerAge, tenureYears, hasExistingProperty),
    [buyerAge, tenureYears, hasExistingProperty]
  );

  const loanAmount = useMemo(() => Math.round(propertyPrice * (ltvPercent / 100)), [propertyPrice, ltvPercent]);
  const totalDownPayment = useMemo(() => propertyPrice - loanAmount, [propertyPrice, loanAmount]);
  const minCashDown = useMemo(() => Math.round(propertyPrice * (minCashDownPercent / 100)), [propertyPrice, minCashDownPercent]);
  const maxCpfDown = useMemo(() => totalDownPayment - minCashDown, [totalDownPayment, minCashDown]);

  // Actual cash vs CPF allocation based on user's available balances
  const actualCpfDownUsed = useMemo(() => Math.min(cpfOAAvailable, maxCpfDown), [cpfOAAvailable, maxCpfDown]);
  const actualCashDownPaid = useMemo(() => totalDownPayment - actualCpfDownUsed, [totalDownPayment, actualCpfDownUsed]);

  const legalAndValuation = 3500;
  const totalUpfrontRequired = useMemo(() => totalDownPayment + bsd + absd + legalAndValuation, [totalDownPayment, bsd, absd]);
  const totalLiquidAvailable = useMemo(() => cashAvailable + cpfOAAvailable, [cashAvailable, cpfOAAvailable]);
  const hasSufficientLiquid = totalLiquidAvailable >= totalUpfrontRequired && cashAvailable >= (minCashDown + legalAndValuation);

  // Mortgage & TDSR
  const monthlyMortgage = useMemo(() => calculateMonthlyMortgage(loanAmount, interestRate, tenureYears), [loanAmount, interestRate, tenureYears]);
  const stressTestRate = 4.0; // MAS residential medium-term stress-test floor
  const stressTestMonthlyMortgage = useMemo(() => calculateMonthlyMortgage(loanAmount, stressTestRate, tenureYears), [loanAmount, tenureYears]);
  
  const totalMonthlyCommitment = monthlyMortgage + monthlyDebts;
  const tdsrCapAmount = Math.round(income * 0.55);
  const stressTestTotalCommitment = stressTestMonthlyMortgage + monthlyDebts;
  const passesTDSR = stressTestTotalCommitment <= tdsrCapAmount;
  const tdsrUtilizationPercent = income > 0 ? Math.round((stressTestTotalCommitment / tdsrCapAmount) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Title */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Calculator className="w-4 h-4 text-teal-700" />
              <span>Singapore Regulatory Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Singapore Affordability & Stamp Duty Calculator
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
              Instant live calculations incorporating MAS 55% TDSR regulations, 4.0% interest rate stress-testing, progressive Budget 2023 BSD brackets, and April 2023 ABSD cooling measures.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start">
            <span className="text-[11px] font-mono-numbers bg-stone-100 text-stone-600 px-3 py-1 rounded-lg border border-stone-200">
              Regulatory Rules: MAS Notice 645 / IRAS 2026
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Split: Interactive Sliders (Left) vs Real-Time Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Sliders & Inputs */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6 text-xs">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
              <DollarSign className="w-4 h-4 text-teal-700" />
              <span>Property Price & Financial Inputs</span>
            </h3>
            <button
              onClick={() => {
                setPropertyPrice(1600000);
                setIncome(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0));
                setTenureYears(30);
                setInterestRate(3.5);
              }}
              className="text-stone-400 hover:text-stone-700 flex items-center gap-1 font-medium"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Property Purchase Price Slider */}
          <div>
            <div className="flex justify-between items-baseline mb-1 font-semibold text-stone-700">
              <span>Target Purchase Price:</span>
              <span className="font-mono-numbers text-base font-extrabold text-teal-800">
                S${propertyPrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={600000}
              max={3500000}
              step={25000}
              value={propertyPrice}
              onChange={(e) => setPropertyPrice(Number(e.target.value))}
              className="w-full accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono-numbers">
              <span>S$600,000</span>
              <span>S$2,000,000</span>
              <span>S$3,500,000</span>
            </div>
          </div>

          {/* Citizenship & Ownership Profile */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-4">
            <div>
              <label className="font-bold text-slate-900 block mb-1.5">
                Buyer Citizenship & Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'SC', label: 'Singapore Citizen', desc: '0% ABSD 1st Prop' },
                  { id: 'SPR', label: 'Permanent Resident', desc: '5% ABSD 1st Prop' },
                  { id: 'FR', label: 'Foreigner', desc: '60% ABSD Flat' }
                ].map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCitizenship(c.id as Citizenship)}
                    className={`p-2 rounded-lg border text-left transition-colors ${
                      citizenship === c.id
                        ? 'border-teal-700 bg-white font-bold text-teal-900 shadow-2xs'
                        : 'border-stone-200 bg-stone-100 text-stone-600'
                    }`}
                  >
                    <div>{c.label}</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">{c.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-stone-200">
              <div>
                <span className="font-semibold text-slate-900 block">Existing Residential Property?</span>
                <span className="text-stone-500 text-[11px]">Affects ABSD and lowers LTV from 75% to 45%.</span>
              </div>
              <button
                type="button"
                onClick={() => setHasExistingProperty(!hasExistingProperty)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  hasExistingProperty ? 'bg-amber-600 text-white' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {hasExistingProperty ? 'Yes (2nd Property)' : 'No (First-Time Buyer)'}
              </button>
            </div>
          </div>

          {/* Household Income & Debts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-700 font-semibold block mb-1">
                Monthly Household Gross Income (S$)
              </label>
              <input
                type="number"
                step={500}
                value={income}
                onChange={(e) => setIncome(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 font-mono-numbers font-bold text-slate-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">TDSR 55% Cap: S${tdsrCapAmount.toLocaleString()}/mo</span>
            </div>

            <div>
              <label className="text-stone-700 font-semibold block mb-1">
                Existing Monthly Debts (S$)
              </label>
              <input
                type="number"
                step={100}
                value={monthlyDebts}
                onChange={(e) => setMonthlyDebts(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 font-mono-numbers font-bold text-slate-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">Car, study, or personal loans</span>
            </div>
          </div>

          {/* Liquid Balances */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-stone-700 font-semibold block mb-1">
                Cash Savings for Property (S$)
              </label>
              <input
                type="number"
                step={5000}
                value={cashAvailable}
                onChange={(e) => setCashAvailable(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 font-mono-numbers font-bold text-slate-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">Min Cash Needed: S${(minCashDown + legalAndValuation).toLocaleString()}</span>
            </div>

            <div>
              <label className="text-stone-700 font-semibold block mb-1">
                CPF Ordinary Account Available (S$)
              </label>
              <input
                type="number"
                step={5000}
                value={cpfOAAvailable}
                onChange={(e) => setCpfOAAvailable(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 font-mono-numbers font-bold text-slate-900"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">Can cover 20% down payment + BSD</span>
            </div>
          </div>

          {/* Loan Tenure & Interest Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-100">
            <div>
              <div className="flex justify-between mb-1 font-semibold text-stone-700">
                <span>Loan Tenure:</span>
                <span className="font-mono-numbers font-bold text-slate-900">{tenureYears} Years</span>
              </div>
              <input
                type="range"
                min={15}
                max={30}
                value={tenureYears}
                onChange={(e) => setTenureYears(Number(e.target.value))}
                className="w-full accent-teal-700"
              />
              <div className="text-[10px] text-stone-400 mt-1">
                Age ({buyerAge}) + Tenure ({tenureYears}) = {buyerAge + tenureYears} yrs {buyerAge + tenureYears > 65 ? '(LTV drops to 55%)' : '(Qualifies 75% LTV)'}
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1 font-semibold text-stone-700">
                <span>Mortgage Rate:</span>
                <span className="font-mono-numbers font-bold text-slate-900">{interestRate}% p.a.</span>
              </div>
              <input
                type="range"
                min={2.0}
                max={5.5}
                step={0.1}
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                className="w-full accent-teal-700"
              />
              <div className="text-[10px] text-stone-400 mt-1">
                MAS Stress Test Floor: 4.0%
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time Results & MAS Assessment Card */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* TDSR & Eligibility Verdict Banner */}
          <div className={`p-5 rounded-2xl border ${
            passesTDSR && hasSufficientLiquid
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-amber-50/80 border-amber-300 text-amber-950'
          }`}>
            <div className="flex items-start gap-3">
              {passesTDSR && hasSufficientLiquid ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-sm">
                  {passesTDSR && hasSufficientLiquid
                    ? 'Purchase Qualified Under MAS TDSR & Capital Rules'
                    : 'Affordability Constraints Detected'}
                </h4>
                <p className="text-xs mt-1 leading-relaxed">
                  {passesTDSR
                    ? `Stress-tested debt commitments utilize ${tdsrUtilizationPercent}% of your MAS 55% allowable TDSR limit.`
                    : `Your total debt commitments exceed the MAS 55% TDSR threshold at the 4.0% stress test interest rate.`}
                  {!hasSufficientLiquid && ' You also require more liquid cash/CPF for upfront down payment and stamp duties.'}
                </p>
              </div>
            </div>
          </div>

          {/* Upfront Capital Required Box */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs flex items-center justify-between border-b border-stone-200 pb-2">
              <span>Upfront Capital Breakdown</span>
              <span className="font-mono-numbers text-teal-800 text-sm font-extrabold">
                S${totalUpfrontRequired.toLocaleString()}
              </span>
            </h3>

            <div className="space-y-2">
              <div className="flex justify-between py-1">
                <span className="text-stone-600">Total Down Payment ({100 - ltvPercent}%):</span>
                <span className="font-mono-numbers font-semibold text-slate-900">S${totalDownPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 pl-4 text-stone-500 border-l-2 border-stone-200">
                <span>· Mandatory Cash Down ({minCashDownPercent}%):</span>
                <span className="font-mono-numbers font-medium text-amber-700">S${minCashDown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 pl-4 text-stone-500 border-l-2 border-stone-200">
                <span>· CPF OA Down Payment:</span>
                <span className="font-mono-numbers font-medium text-teal-700">S${actualCpfDownUsed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600">Buyer&apos;s Stamp Duty (BSD):</span>
                <span className="font-mono-numbers font-semibold text-slate-900">S${bsd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600">Additional Buyer&apos;s Duty (ABSD):</span>
                <span className="font-mono-numbers font-semibold text-slate-900">S${absd.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-stone-600">Legal Conveyancing & Valuation:</span>
                <span className="font-mono-numbers font-semibold text-slate-900">S${legalAndValuation.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-200 bg-stone-50 p-3 rounded-xl flex justify-between items-center font-bold">
              <span className="text-slate-900">Total Liquid Savings Available:</span>
              <span className={`font-mono-numbers text-sm ${hasSufficientLiquid ? 'text-emerald-700' : 'text-rose-700'}`}>
                S${totalLiquidAvailable.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Monthly Ongoing Cashflow */}
          <div className="bg-stone-900 text-white rounded-2xl p-6 shadow-xs space-y-4 text-xs">
            <h3 className="font-bold uppercase tracking-wider text-teal-400 text-xs border-b border-stone-800 pb-2">
              Monthly Debt Commitments & TDSR
            </h3>

            <div className="space-y-3 font-mono-numbers">
              <div className="flex justify-between items-center">
                <span className="text-stone-300 font-sans">Monthly Bank Mortgage:</span>
                <span className="text-lg font-bold text-white">S${monthlyMortgage.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[11px]">
                <span className="font-sans">Existing Monthly Debts:</span>
                <span>S${monthlyDebts.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-stone-800 font-bold">
                <span className="font-sans text-stone-200">Total Monthly Debt Servicing:</span>
                <span className="text-teal-300">S${totalMonthlyCommitment.toLocaleString()}/mo</span>
              </div>
              <div className="flex justify-between items-center text-stone-400 text-[11px]">
                <span className="font-sans">Allowable Cap (MAS 55% TDSR):</span>
                <span>S${tdsrCapAmount.toLocaleString()}/mo</span>
              </div>
            </div>

            {/* TDSR Progress bar */}
            <div className="pt-2">
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-stone-400">TDSR Utilization (Stress Rate 4.0%):</span>
                <span className={`font-bold font-mono-numbers ${tdsrUtilizationPercent <= 100 ? 'text-teal-300' : 'text-rose-400'}`}>
                  {tdsrUtilizationPercent}%
                </span>
              </div>
              <div className="h-2 w-full bg-stone-800 rounded-full overflow-hidden">
                <div
                  style={{ width: `${Math.min(100, tdsrUtilizationPercent)}%` }}
                  className={`h-full transition-all duration-300 ${tdsrUtilizationPercent <= 100 ? 'bg-teal-500' : 'bg-rose-500'}`}
                />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
