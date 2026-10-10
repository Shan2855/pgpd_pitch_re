import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Calculator,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  DollarSign,
  HelpCircle,
  Info,
  Layers,
  LineChart as LineChartIcon,
  Percent,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { BuyerProfile, CondoProperty, ResaleScenarioOutcome } from '../../types/property';
import { simulateResaleScenarios, simulateAmortizationSchedule, calculateSSD } from '../../services/financialEngine';

interface FourYearSimulatorProps {
  profile: BuyerProfile;
  condos: CondoProperty[];
  selectedCondoId?: string;
}

export const FourYearSimulator: React.FC<FourYearSimulatorProps> = ({
  profile,
  condos,
  selectedCondoId
}) => {
  // Condo choice or custom purchase price
  const [chosenCondoId, setChosenCondoId] = useState<string>(selectedCondoId || condos[0]?.id || 'custom');
  
  const currentCondo = useMemo(() => {
    return condos.find((c) => c.id === chosenCondoId);
  }, [chosenCondoId, condos]);

  const [purchasePrice, setPurchasePrice] = useState<number>(
    currentCondo ? currentCondo.askingPrice : 1580000
  );

  // Sync price if user picks condo
  const handleSelectCondo = (id: string) => {
    setChosenCondoId(id);
    const found = condos.find((c) => c.id === id);
    if (found) {
      setPurchasePrice(found.askingPrice);
      setMonthlyMaintenance(found.monthlyMaintenanceEst);
    }
  };

  // Simulation parameters
  const [holdingYears, setHoldingYears] = useState<number>(4);
  const [interestRate, setInterestRate] = useState<number>(profile.mortgageInterestRate || 3.5);
  const [monthlyMaintenance, setMonthlyMaintenance] = useState<number>(currentCondo?.monthlyMaintenanceEst || 350);
  const [renovationCost, setRenovationCost] = useState<number>(35000);
  const [annualPropertyTax, setAnnualPropertyTax] = useState<number>(2000);
  const [annualInsurance, setAnnualInsurance] = useState<number>(350);
  const [agentFeePercent, setAgentFeePercent] = useState<number>(2.18); // 2% + 9% GST

  // Scenario appreciation assumptions (% per annum)
  const [bearRate, setBearRate] = useState<number>(-1.5);
  const [baseRate, setBaseRate] = useState<number>(2.8);
  const [bullRate, setBullRate] = useState<number>(5.5);

  const [activeScenario, setActiveScenario] = useState<'Bear' | 'Base' | 'Bull'>('Base');
  const [showSensitivityMatrix, setShowSensitivityMatrix] = useState<boolean>(false);
  const [showLedger, setShowLedger] = useState<boolean>(true);

  // Run calculation
  const simulationResults = useMemo(() => {
    const simulationProfile: BuyerProfile = {
      ...profile,
      mortgageInterestRate: interestRate
    };

    return simulateResaleScenarios(purchasePrice, holdingYears, simulationProfile, {
      annualAppreciationRates: {
        bear: bearRate,
        base: baseRate,
        bull: bullRate
      },
      monthlyMaintenance,
      renovationCost,
      annualPropertyTax,
      annualInsurance,
      sellingAgentFeePercent: agentFeePercent
    });
  }, [
    purchasePrice,
    holdingYears,
    interestRate,
    profile,
    bearRate,
    baseRate,
    bullRate,
    monthlyMaintenance,
    renovationCost,
    annualPropertyTax,
    annualInsurance,
    agentFeePercent
  ]);

  const currentOutcome = simulationResults[activeScenario.toLowerCase() as 'bear' | 'base' | 'bull'];

  // Timeline chart data (Year 0 through Year N)
  const timelineChartData = useMemo(() => {
    const data = [];
    const initialLoan = currentOutcome.initialLoan;
    const amort = simulateAmortizationSchedule(initialLoan, interestRate, profile.preferredTenureYears, holdingYears * 12);
    
    // Growth rate of active scenario
    const rate = currentOutcome.annualAppreciationRate / 100;

    data.push({
      year: 'Purchase',
      propertyValue: purchasePrice,
      mortgageBalance: initialLoan,
      homeEquity: purchasePrice - initialLoan
    });

    for (let y = 1; y <= holdingYears; y++) {
      const yearVal = Math.round(purchasePrice * Math.pow(1 + rate, y));
      const yearBalance = amort.yearlyData[y - 1]?.balance ?? Math.round(initialLoan * (1 - (y / profile.preferredTenureYears) * 0.7));
      data.push({
        year: `Year ${y}${y === holdingYears ? ' (Exit)' : ''}`,
        propertyValue: yearVal,
        mortgageBalance: yearBalance,
        homeEquity: Math.max(0, yearVal - yearBalance)
      });
    }

    return data;
  }, [purchasePrice, holdingYears, currentOutcome, interestRate, profile.preferredTenureYears]);

  // Waterfall proceeds chart data
  const waterfallData = useMemo(() => {
    return [
      { name: 'Gross Sale Price', amount: currentOutcome.projectedSalePrice, fill: '#0d9488' },
      { name: 'Bank Loan Repayment', amount: -currentOutcome.outstandingMortgageAtSale, fill: '#e11d48' },
      { name: 'Selling Costs & Agent', amount: -currentOutcome.totalSellingCosts, fill: '#f59e0b' },
      { name: 'CPF Refund (OA + 2.5%)', amount: -currentOutcome.totalCpfRefundRequired, fill: '#6366f1' },
      { name: 'Net Cash in Bank', amount: currentOutcome.netCashProceedsToBank, fill: currentOutcome.netCashProceedsToBank >= 0 ? '#10b981' : '#dc2626' }
    ];
  }, [currentOutcome]);

  // Sensitivity matrix: Annual growth (-2% to +5%) vs Interest rates (2.5% to 4.5%)
  const sensitivityRows = useMemo(() => {
    const growthRates = [-2.0, 0.0, 2.5, 4.5];
    const interestRates = [2.8, 3.5, 4.2];

    return growthRates.map((gRate) => {
      const rowCols = interestRates.map((iRate) => {
        const testProf: BuyerProfile = { ...profile, mortgageInterestRate: iRate };
        const sim = simulateResaleScenarios(purchasePrice, holdingYears, testProf, {
          annualAppreciationRates: { bear: gRate, base: gRate, bull: gRate },
          monthlyMaintenance,
          renovationCost,
          annualPropertyTax,
          annualInsurance,
          sellingAgentFeePercent: agentFeePercent
        });
        const res = sim.base;
        return {
          rate: iRate,
          profit: res.totalEconomicProfit,
          cashProceeds: res.netCashProceedsToBank,
          roi: res.roiInvestedEquityPercent
        };
      });
      return { growthRate: gRate, cols: rowCols };
    });
  }, [purchasePrice, holdingYears, profile, monthlyMaintenance, renovationCost, annualPropertyTax, annualInsurance, agentFeePercent]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Page Title & Context Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-teal-600" />
              <span>Core Intelligence Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Four-Year Resale & Investment Simulator
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              &quot;Which condominium best fits my budget and lifestyle today, and what happens financially if I sell it after four years?&quot; Accurately distinguishes liquid cash received from true economic profit, incorporating CPF 2.5% accrued interest refunds, bank amortization, and IRAS stamp duties.
            </p>
          </div>

          {/* Quick condo picker */}
          <div className="w-full md:w-72 bg-stone-50 p-3 rounded-xl border border-stone-200">
            <label className="text-[11px] font-semibold text-stone-600 block mb-1">
              Simulate On Specific Condo:
            </label>
            <select
              value={chosenCondoId}
              onChange={(e) => handleSelectCondo(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-stone-300 bg-white font-medium text-slate-900 truncate"
            >
              {condos.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} (S${(c.askingPrice / 1000000).toFixed(2)}M - {c.planningArea})
                </option>
              ))}
            </select>
            {currentCondo && (
              <div className="text-[11px] text-stone-500 mt-1.5 flex justify-between">
                <span>{currentCondo.bedrooms} Bed · {currentCondo.floorAreaSqFt} sqft</span>
                <span className="font-mono-numbers font-medium">S${currentCondo.pricePerSqFt} PSF</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seller's Stamp Duty Warning Callout if holding < 3 years */}
      {holdingYears < 3 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 text-amber-950 flex items-start gap-4">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold flex items-center gap-2">
              <span>Statutory Warning: Seller&apos;s Stamp Duty (SSD) Triggered</span>
              <span className="bg-amber-200 text-amber-900 text-xs px-2 py-0.5 rounded font-mono-numbers font-bold">
                {holdingYears < 1 ? '12% SSD' : holdingYears < 2 ? '8% SSD' : '4% SSD'}
              </span>
            </h4>
            <p className="text-xs text-amber-900 leading-relaxed">
              Under Singapore law, residential properties sold within 3 years of purchase attract Seller&apos;s Stamp Duty: 12% in Year 1, 8% in Year 2, and 4% in Year 3. On this simulation, an estimated <strong>S${currentOutcome.sellersStampDutySSD.toLocaleString()}</strong> SSD penalty will be deducted directly from your gross sale proceeds. After 3 full years (e.g., standard 4-year holding), SSD drops to 0%.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls Strip */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
            <Calculator className="w-4 h-4 text-teal-700" />
            Simulation Parameters & Financial Assumptions
          </span>
          <button
            onClick={() => {
              setHoldingYears(4);
              setInterestRate(3.5);
              setBearRate(-1.5);
              setBaseRate(2.8);
              setBullRate(5.5);
              setRenovationCost(35000);
            }}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center gap-1 font-medium"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset Defaults</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs">
          {/* Purchase Price */}
          <div>
            <div className="flex justify-between font-medium text-stone-700 mb-1">
              <span>Purchase Price:</span>
              <span className="font-mono-numbers font-bold text-slate-900">
                S${purchasePrice.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={800000}
              max={3500000}
              step={20000}
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(Number(e.target.value))}
              className="w-full accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>S$800k</span>
              <span>S$3.5M</span>
            </div>
          </div>

          {/* Holding Period */}
          <div>
            <div className="flex justify-between font-medium text-stone-700 mb-1">
              <span>Holding Period:</span>
              <span className="font-mono-numbers font-bold text-slate-900">
                {holdingYears} {holdingYears === 1 ? 'Year' : 'Years'}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={holdingYears}
              onChange={(e) => setHoldingYears(Number(e.target.value))}
              className="w-full accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>1 Year (SSD)</span>
              <span>4 Yrs (Default)</span>
              <span>10 Yrs</span>
            </div>
          </div>

          {/* Mortgage Interest Rate */}
          <div>
            <div className="flex justify-between font-medium text-stone-700 mb-1">
              <span>Mortgage Interest Rate:</span>
              <span className="font-mono-numbers font-bold text-slate-900">
                {interestRate}% p.a.
              </span>
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
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>2.0%</span>
              <span>3.5% (SORA Avg)</span>
              <span>5.5%</span>
            </div>
          </div>

          {/* Renovation & Sunk Cost */}
          <div>
            <div className="flex justify-between font-medium text-stone-700 mb-1">
              <span>Renovation Sunk Cost:</span>
              <span className="font-mono-numbers font-bold text-slate-900">
                S${renovationCost.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={10000}
              max={120000}
              step={5000}
              value={renovationCost}
              onChange={(e) => setRenovationCost(Number(e.target.value))}
              className="w-full accent-teal-700"
            />
            <div className="flex justify-between text-[10px] text-stone-500 mt-1">
              <span>S$10k</span>
              <span>S$35k (Typical)</span>
              <span>S$120k</span>
            </div>
          </div>
        </div>

        {/* Secondary adjustable holding costs */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-stone-600 block mb-1">
              Monthly MCST Maintenance (S$/mo):
            </label>
            <input
              type="number"
              step={20}
              value={monthlyMaintenance}
              onChange={(e) => setMonthlyMaintenance(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-stone-300 bg-white font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-stone-600 block mb-1">
              Annual Property Tax (IRAS owner-occupier S$/yr):
            </label>
            <input
              type="number"
              step={100}
              value={annualPropertyTax}
              onChange={(e) => setAnnualPropertyTax(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-stone-300 bg-white font-mono-numbers"
            />
          </div>
          <div>
            <label className="text-stone-600 block mb-1">
              Selling Agent Commission (incl. 9% GST %):
            </label>
            <input
              type="number"
              step={0.1}
              value={agentFeePercent}
              onChange={(e) => setAgentFeePercent(Number(e.target.value))}
              className="w-full p-2 rounded-lg border border-stone-300 bg-white font-mono-numbers"
            />
          </div>
        </div>
      </div>

      {/* Scenario Selector: Bear, Base, Bull */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-stone-700">
            Market Trajectory Scenarios ({holdingYears}-Year Holding)
          </h3>
          <span className="text-xs text-stone-500">
            *Assumptions are user-configurable; not guaranteed financial forecasts.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bear Case */}
          <div
            onClick={() => setActiveScenario('Bear')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeScenario === 'Bear'
                ? 'border-rose-600 bg-rose-50/40 shadow-sm ring-1 ring-rose-500'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <TrendingDown className="w-3.5 h-3.5" />
                Bear Case Scenario
              </span>
              <span className="font-mono-numbers font-bold text-sm text-rose-700">
                {bearRate > 0 ? `+${bearRate}%` : `${bearRate}%`} p.a.
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono-numbers mb-1">
              S${simulationResults.bear.projectedSalePrice.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mb-3">
              Est. sale price ({holdingYears} yrs)
            </div>

            <div className="pt-3 border-t border-stone-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Net Cash In Bank:</span>
                <span className={`font-mono-numbers font-bold ${simulationResults.bear.netCashProceedsToBank >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                  S${simulationResults.bear.netCashProceedsToBank.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Economic Profit:</span>
                <span className={`font-mono-numbers font-bold ${simulationResults.bear.totalEconomicProfit >= 0 ? 'text-teal-700' : 'text-rose-700'}`}>
                  {simulationResults.bear.totalEconomicProfit >= 0 ? '+' : ''}S${simulationResults.bear.totalEconomicProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Edit rate:</span>
              <input
                type="number"
                step={0.5}
                value={bearRate}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setBearRate(Number(e.target.value))}
                className="w-16 p-1 text-center rounded border border-rose-200 bg-white font-mono-numbers font-semibold"
              />
            </div>
          </div>

          {/* Base Case (Default) */}
          <div
            onClick={() => setActiveScenario('Base')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeScenario === 'Base'
                ? 'border-teal-700 bg-teal-50/50 shadow-sm ring-1 ring-teal-700'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-teal-700" />
                Base Case (Long-Term Trend)
              </span>
              <span className="font-mono-numbers font-bold text-sm text-teal-800">
                +{baseRate}% p.a.
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono-numbers mb-1">
              S${simulationResults.base.projectedSalePrice.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mb-3">
              Est. sale price ({holdingYears} yrs)
            </div>

            <div className="pt-3 border-t border-stone-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Net Cash In Bank:</span>
                <span className="font-mono-numbers font-bold text-teal-800">
                  S${simulationResults.base.netCashProceedsToBank.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Economic Profit:</span>
                <span className={`font-mono-numbers font-bold ${simulationResults.base.totalEconomicProfit >= 0 ? 'text-teal-800' : 'text-rose-700'}`}>
                  {simulationResults.base.totalEconomicProfit >= 0 ? '+' : ''}S${simulationResults.base.totalEconomicProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-teal-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Edit rate:</span>
              <input
                type="number"
                step={0.5}
                value={baseRate}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setBaseRate(Number(e.target.value))}
                className="w-16 p-1 text-center rounded border border-teal-200 bg-white font-mono-numbers font-semibold"
              />
            </div>
          </div>

          {/* Bull Case */}
          <div
            onClick={() => setActiveScenario('Bull')}
            className={`p-5 rounded-2xl border cursor-pointer transition-all ${
              activeScenario === 'Bull'
                ? 'border-emerald-600 bg-emerald-50/50 shadow-sm ring-1 ring-emerald-600'
                : 'border-stone-200 bg-white hover:border-stone-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Bull Case (Strong Growth)
              </span>
              <span className="font-mono-numbers font-bold text-sm text-emerald-700">
                +{bullRate}% p.a.
              </span>
            </div>
            <div className="text-2xl font-extrabold text-slate-900 font-mono-numbers mb-1">
              S${simulationResults.bull.projectedSalePrice.toLocaleString()}
            </div>
            <div className="text-xs text-stone-500 mb-3">
              Est. sale price ({holdingYears} yrs)
            </div>

            <div className="pt-3 border-t border-stone-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-stone-600">Net Cash In Bank:</span>
                <span className="font-mono-numbers font-bold text-emerald-700">
                  S${simulationResults.bull.netCashProceedsToBank.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-600">Total Economic Profit:</span>
                <span className="font-mono-numbers font-bold text-emerald-700">
                  +S${simulationResults.bull.totalEconomicProfit.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">Edit rate:</span>
              <input
                type="number"
                step={0.5}
                value={bullRate}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => setBullRate(Number(e.target.value))}
                className="w-16 p-1 text-center rounded border border-emerald-200 bg-white font-mono-numbers font-semibold"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Scenario Deep-Dive Hero Box */}
      <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider">
                {currentOutcome.scenarioName} Case Deep Dive
              </span>
              <span className="text-stone-400 text-xs">·</span>
              <span className="text-xs text-stone-300">
                Annual Rate: {currentOutcome.annualAppreciationRate > 0 ? `+${currentOutcome.annualAppreciationRate}%` : `${currentOutcome.annualAppreciationRate}%`} p.a.
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mt-1 text-white">
              Financial Outcome at {holdingYears}-Year Exit
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-stone-800 px-4 py-2 rounded-xl border border-stone-700 text-right">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Break-Even Sale Price</div>
              <div className="text-sm sm:text-base font-extrabold font-mono-numbers text-teal-300">
                S${currentOutcome.breakEvenSalePrice.toLocaleString()}
              </div>
            </div>
            <div className="bg-stone-800 px-4 py-2 rounded-xl border border-stone-700 text-right">
              <div className="text-[10px] text-stone-400 uppercase tracking-wider">Equity ROI</div>
              <div className={`text-sm sm:text-base font-extrabold font-mono-numbers ${currentOutcome.roiInvestedEquityPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {currentOutcome.roiInvestedEquityPercent >= 0 ? '+' : ''}{currentOutcome.roiInvestedEquityPercent}%
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Financial KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
            <div className="text-[11px] text-stone-400">Projected Sale Price</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-white mt-0.5">
              S${currentOutcome.projectedSalePrice.toLocaleString()}
            </div>
            <div className="text-[10px] text-teal-400 mt-1">
              Capital Gain: {currentOutcome.grossCapitalGain >= 0 ? '+' : ''}S${currentOutcome.grossCapitalGain.toLocaleString()}
            </div>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
            <div className="text-[11px] text-stone-400">Outstanding Mortgage</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-stone-200 mt-0.5">
              S${currentOutcome.outstandingMortgageAtSale.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400 mt-1">
              Principal Repaid: S${currentOutcome.principalRepaid.toLocaleString()}
            </div>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
            <div className="text-[11px] text-stone-400">CPF Refund (OA + 2.5% p.a.)</div>
            <div className="text-lg sm:text-xl font-bold font-mono-numbers text-indigo-300 mt-0.5">
              S${currentOutcome.totalCpfRefundRequired.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Incl. S${currentOutcome.cpfAccruedInterestRefund.toLocaleString()} accrued interest
            </div>
          </div>

          <div className="bg-stone-800/80 p-4 rounded-xl border border-stone-700/60">
            <div className="text-[11px] text-stone-400">Net Cash Received In Bank</div>
            <div className={`text-lg sm:text-xl font-extrabold font-mono-numbers mt-0.5 ${currentOutcome.netCashProceedsToBank >= 0 ? 'text-teal-300' : 'text-rose-400'}`}>
              S${currentOutcome.netCashProceedsToBank.toLocaleString()}
            </div>
            <div className="text-[10px] text-stone-400 mt-1">
              Actual liquid cash from sale
            </div>
          </div>
        </div>

        {/* Vital Singapore First-Time Buyer Clarity Notice */}
        <div className="mt-6 bg-stone-800/50 p-4 rounded-xl border border-stone-700/50 text-xs text-stone-300 flex items-start gap-3">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-semibold text-white">Why Net Cash Received != Total Economic Profit:</span>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              When selling, your bank loan is settled and your CPF principal plus 2.5% accrued interest is returned to your CPF Ordinary Account. The remaining balance lands as liquid cash in your bank. However, true <strong>Economic Profit (S${currentOutcome.totalEconomicProfit.toLocaleString()})</strong> accounts for all non-recoverable holding costs paid along the way: Buyer&apos;s Stamp Duty (S${currentOutcome.upfrontStampDuties.toLocaleString()}), mortgage interest paid (S${currentOutcome.interestPaid.toLocaleString()}), MCST maintenance fees, renovation, and selling agent commission.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Timeline & Amortization Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Timeline Chart: Property Value vs Mortgage Debt vs Equity */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <LineChartIcon className="w-4 h-4 text-teal-700" />
                <span>Value, Mortgage Balance & Homeowner Equity</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Timeline from purchase to {holdingYears}-year potential sale
              </p>
            </div>
            <span className="text-xs font-mono-numbers font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
              {currentOutcome.scenarioName} Scenario
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timelineChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                <YAxis
                  tickFormatter={(val) => `S$${(val / 1000).toFixed(0)}k`}
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  formatter={(val: any) => [`S$${Number(val).toLocaleString()}`, '']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="propertyValue" name="Property Value" stroke="#0d9488" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
                <Area type="monotone" dataKey="mortgageBalance" name="Mortgage Balance" stroke="#e11d48" strokeWidth={2} fillOpacity={0.1} fill="#e11d48" />
                <Area type="monotone" dataKey="homeEquity" name="Homeowner Equity" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorEquity)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-stone-500 text-center">
            Notice how principal paydown steadily expands homeowner equity even during conservative price appreciation.
          </div>
        </div>

        {/* Waterfall Breakdown Chart */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-teal-700" />
                <span>Sale Proceeds Distribution Waterfall</span>
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Where every dollar of the S${currentOutcome.projectedSalePrice.toLocaleString()} proceeds goes
              </p>
            </div>
            <span className="text-xs font-mono-numbers font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
              IRAS & Bank Priority
            </span>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterfallData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  type="number"
                  tickFormatter={(val) => `S$${(Math.abs(val) / 1000).toFixed(0)}k`}
                  tick={{ fontSize: 10 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 10 }}
                  width={110}
                />
                <Tooltip
                  formatter={(val: any) => [`S$${Math.abs(Number(val)).toLocaleString()}`, 'Amount']}
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                  {waterfallData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 text-[11px] text-stone-500 text-center">
            Bank holds first legal charge; CPF Board holds second statutory charge before liquid cash releases to buyer.
          </div>
        </div>
      </div>

      {/* Detailed Calculation Ledger */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <button
          onClick={() => setShowLedger(!showLedger)}
          className="w-full px-6 py-4 bg-stone-50 hover:bg-stone-100/70 transition-colors flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Complete {holdingYears}-Year Financial Ledger & Deduction Breakdown
            </span>
            <span className="text-xs text-stone-500 font-mono-numbers">
              (Deterministic Mathematical Audit)
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
            <span>{showLedger ? 'Collapse Ledger' : 'Expand Ledger'}</span>
            {showLedger ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {showLedger && (
          <div className="p-6 overflow-x-auto text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 font-semibold uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 px-3">Ledger Line Item</th>
                  <th className="py-2.5 px-3 text-right">Bear Case ({bearRate}%)</th>
                  <th className="py-2.5 px-3 text-right bg-teal-50/50 font-bold text-teal-950">Base Case (+{baseRate}%)</th>
                  <th className="py-2.5 px-3 text-right">Bull Case (+{bullRate}%)</th>
                  <th className="py-2.5 px-3">Rule / Legal Basis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono-numbers">
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">Initial Purchase Price</td>
                  <td className="py-2 px-3 text-right">S${purchasePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 font-semibold">S${purchasePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right">S${purchasePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Option to Purchase contract value</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">Projected Future Sale Price</td>
                  <td className="py-2 px-3 text-right text-rose-700">S${simulationResults.bear.projectedSalePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 font-semibold text-teal-800">S${simulationResults.base.projectedSalePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-emerald-700">S${simulationResults.bull.projectedSalePrice.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Compounded annual appreciation over {holdingYears} yrs</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">Outstanding Bank Mortgage</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.outstandingMortgageAtSale.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-stone-700">-S${currentOutcome.outstandingMortgageAtSale.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.outstandingMortgageAtSale.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Remaining balance after {holdingYears * 12} amortized payments</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">Selling Agent Fee (2% + 9% GST)</td>
                  <td className="py-2 px-3 text-right text-amber-700">-S${simulationResults.bear.sellingAgentFee.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-amber-800">-S${simulationResults.base.sellingAgentFee.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-amber-700">-S${simulationResults.bull.sellingAgentFee.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Standard CEA registered broker commission</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">Seller&apos;s Stamp Duty (SSD)</td>
                  <td className="py-2 px-3 text-right font-semibold text-stone-700">-S${simulationResults.bear.sellersStampDutySSD.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 font-semibold text-stone-700">-S${simulationResults.base.sellersStampDutySSD.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right font-semibold text-stone-700">-S${simulationResults.bull.sellersStampDutySSD.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">{holdingYears >= 3 ? '0% (Exceeds 3-year statutory SSD period)' : `${calculateSSD(100, holdingYears)}% penalty`}</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">CPF OA Principal Refund</td>
                  <td className="py-2 px-3 text-right text-indigo-700">-S${currentOutcome.cpfPrincipalUsed.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-indigo-800">-S${currentOutcome.cpfPrincipalUsed.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-indigo-700">-S${currentOutcome.cpfPrincipalUsed.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Returns to your personal CPF Ordinary Account</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans font-medium text-slate-900">CPF Accrued Interest (2.5% p.a.)</td>
                  <td className="py-2 px-3 text-right text-indigo-700">-S${currentOutcome.cpfAccruedInterestRefund.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-indigo-800">-S${currentOutcome.cpfAccruedInterestRefund.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-indigo-700">-S${currentOutcome.cpfAccruedInterestRefund.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Compounded interest accrued under CPF Housing Scheme</td>
                </tr>
                <tr className="bg-stone-100/70 font-bold border-t-2 border-stone-300">
                  <td className="py-2.5 px-3 font-sans text-slate-900">Net Cash Received Into Bank Account</td>
                  <td className={`py-2.5 px-3 text-right ${simulationResults.bear.netCashProceedsToBank >= 0 ? 'text-teal-800' : 'text-rose-700'}`}>
                    S${simulationResults.bear.netCashProceedsToBank.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right bg-teal-100/60 text-teal-900 font-extrabold">
                    S${simulationResults.base.netCashProceedsToBank.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 text-right text-emerald-800">
                    S${simulationResults.bull.netCashProceedsToBank.toLocaleString()}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-stone-700 text-[11px]">Actual liquid funds deposited to your bank</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-600">Total Sunk Holding Costs (MCST + Tax + Reno)</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.totalSunkHoldingCosts.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-stone-600">-S${currentOutcome.totalSunkHoldingCosts.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.totalSunkHoldingCosts.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Maintenance S${monthlyMaintenance}/mo + Property Tax + S${renovationCost} Reno</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-sans text-stone-600">Mortgage Interest Paid to Bank</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.interestPaid.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right bg-teal-50/30 text-stone-600">-S${currentOutcome.interestPaid.toLocaleString()}</td>
                  <td className="py-2 px-3 text-right text-stone-600">-S${currentOutcome.interestPaid.toLocaleString()}</td>
                  <td className="py-2 px-3 font-sans text-stone-500 text-[11px]">Non-recoverable interest cost over {holdingYears} yrs</td>
                </tr>
                <tr className="bg-stone-900 text-white font-extrabold border-t-2 border-stone-900">
                  <td className="py-3 px-3 font-sans text-teal-300">True Net Economic Profit / Loss</td>
                  <td className={`py-3 px-3 text-right ${simulationResults.bear.totalEconomicProfit >= 0 ? 'text-teal-300' : 'text-rose-400'}`}>
                    {simulationResults.bear.totalEconomicProfit >= 0 ? '+' : ''}S${simulationResults.bear.totalEconomicProfit.toLocaleString()}
                  </td>
                  <td className={`py-3 px-3 text-right bg-stone-800 text-teal-300`}>
                    {simulationResults.base.totalEconomicProfit >= 0 ? '+' : ''}S${simulationResults.base.totalEconomicProfit.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right text-emerald-400">
                    +S${simulationResults.bull.totalEconomicProfit.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 font-sans text-stone-300 text-[11px]">True economic return after all sunk costs</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sensitivity Matrix Toggle */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-teal-700" />
              <span>Sensitivity Matrix: Annual Appreciation vs Mortgage Interest Rate</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Evaluating economic profit against market fluctuations
            </p>
          </div>
          <button
            onClick={() => setShowSensitivityMatrix(!showSensitivityMatrix)}
            className="text-xs font-semibold text-teal-800 hover:text-teal-950 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/50"
          >
            {showSensitivityMatrix ? 'Hide Matrix' : 'Show Matrix'}
          </button>
        </div>

        {showSensitivityMatrix && (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[10px] uppercase font-bold text-stone-600">
                  <th className="py-2.5 px-3 text-left">Appreciation Rate</th>
                  <th className="py-2.5 px-3">At 2.8% Interest Rate</th>
                  <th className="py-2.5 px-3 bg-teal-50 font-bold text-teal-900">At 3.5% Interest Rate (Base)</th>
                  <th className="py-2.5 px-3">At 4.2% Interest Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono-numbers">
                {sensitivityRows.map((row) => (
                  <tr key={row.growthRate}>
                    <td className="py-2.5 px-3 text-left font-sans font-bold text-slate-900">
                      {row.growthRate > 0 ? `+${row.growthRate}%` : `${row.growthRate}%`} p.a.
                    </td>
                    {row.cols.map((col, idx) => (
                      <td
                        key={idx}
                        className={`py-2.5 px-3 ${idx === 1 ? 'bg-teal-50/30 font-bold' : ''} ${
                          col.profit >= 0 ? 'text-teal-800' : 'text-rose-700'
                        }`}
                      >
                        <div>{col.profit >= 0 ? '+' : ''}S${col.profit.toLocaleString()}</div>
                        <div className="text-[10px] text-stone-400 font-sans">
                          ROI: {col.roi}%
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
