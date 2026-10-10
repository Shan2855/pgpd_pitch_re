import React from 'react';
import {
  X,
  Printer,
  Copy,
  Check,
  Building2,
  Sparkles,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { BuyerProfile, CondoProperty } from '../../types/property';
import { evaluateAffordability, simulateResaleScenarios } from '../../services/financialEngine';

interface DecisionDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: BuyerProfile;
  condos: CondoProperty[];
  savedCondoIds: string[];
}

export const DecisionDossierModal: React.FC<DecisionDossierModalProps> = ({
  isOpen,
  onClose,
  profile,
  condos,
  savedCondoIds
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const aff = evaluateAffordability(profile);
  const savedCondos = condos.filter((c) => savedCondoIds.includes(c.id));
  const primaryCondo = savedCondos[0] || condos[0];
  const sim = primaryCondo ? simulateResaleScenarios(primaryCondo.askingPrice, 4, profile) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopySummary = () => {
    const text = `CONDOPASS SG — FIRST-TIME CONDO BUYER DECISION DOSSIER
Generated: ${new Date().toLocaleDateString('en-SG')}
Buyer Profile: ${profile.citizenship} | Age: ${profile.age} | Household Income: S$${(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0)).toLocaleString()}/mo

1. AFFORDABILITY & CAPITAL REQUIREMENTS
- Maximum Prudent Condo Price: S$${aff.maxPurchasePrice.toLocaleString()}
- Maximum Bank Loan (75% LTV): S$${aff.maxEligibleLoan.toLocaleString()}
- Monthly Mortgage (at ${profile.mortgageInterestRate}%): S$${aff.maxMonthlyMortgage.toLocaleString()}/mo
- Mandatory 5% Cash Down: S$${aff.minimumCashDownPayment.toLocaleString()}
- CPF OA Down Payment: S$${aff.cpfDownPaymentAllowed.toLocaleString()}
- Buyer's Stamp Duty (BSD): S$${aff.bsd.toLocaleString()}
- Total Upfront Liquid Capital Required: S$${aff.totalUpfrontCapitalRequired.toLocaleString()}

2. PRIMARY SHORTLISTED PROPERTY: ${primaryCondo?.name || 'N/A'}
- District: ${primaryCondo?.district} (${primaryCondo?.planningArea})
- Asking Price: S$${primaryCondo?.askingPrice.toLocaleString()} (S$${primaryCondo?.pricePerSqFt} PSF)
- Layout: ${primaryCondo?.bedrooms} Bed | ${primaryCondo?.floorAreaSqFt} sq ft | ${primaryCondo?.tenure}
- Nearest MRT: ${primaryCondo?.nearestMrt.name} (${primaryCondo?.nearestMrt.walkTimeMinutes} min walk)

3. 4-YEAR RESALE SCENARIO PROJECTIONS (Holding: 4 Years)
- Base Case (+2.8% p.a.):
  * Future Sale Price: S$${sim?.base.projectedSalePrice.toLocaleString()}
  * Outstanding Mortgage at Sale: S$${sim?.base.outstandingMortgageAtSale.toLocaleString()}
  * CPF Refund (Principal + 2.5% Accrued): S$${sim?.base.totalCpfRefundRequired.toLocaleString()}
  * Net Liquid Cash in Bank: S$${sim?.base.netCashProceedsToBank.toLocaleString()}
  * True Net Economic Profit: +S$${sim?.base.totalEconomicProfit.toLocaleString()}
- Bear Case (-1.5% p.a.):
  * Net Cash in Bank: S$${sim?.bear.netCashProceedsToBank.toLocaleString()}
  * True Net Economic Profit: ${sim?.bear.totalEconomicProfit && sim.bear.totalEconomicProfit >= 0 ? '+' : ''}S$${sim?.bear.totalEconomicProfit.toLocaleString()}

4. PRE-PURCHASE REGULATORY CHECKLIST
[x] MAS 55% TDSR Stress-Tested at 4.0%
[x] Minimum 5% Cash Down Payment Verified
[x] Seller's Stamp Duty (SSD) 0% (Holding period exceeds 3 years)
[x] CPF Accrued Interest 2.5% p.a. accounted for
*Note: Demo data for educational analysis. Verify with IRAS/MAS.`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-stone-200 w-full max-w-2xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-stone-900 text-white flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>CondoCompass SG Dossier</span>
            </div>
            <h2 className="text-xl font-bold mt-0.5">First-Time Buyer Decision Summary</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dossier Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-6 text-xs">
          
          {/* Profile Overview */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex justify-between items-center">
            <div>
              <div className="font-bold text-slate-900 text-sm">Buyer Profile Overview</div>
              <div className="text-stone-500 mt-0.5">
                {profile.citizenship === 'SC' ? 'Singapore Citizen' : profile.citizenship === 'SPR' ? 'Permanent Resident' : 'Foreigner'} · Age {profile.age} · Tenure {profile.preferredTenureYears} Yrs
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-stone-500 uppercase">Monthly Income</div>
              <div className="font-bold font-mono-numbers text-slate-900 text-sm">
                S${(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0)).toLocaleString()}/mo
              </div>
            </div>
          </div>

          {/* Section 1: Financial & Upfront Capital */}
          <div className="space-y-2">
            <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
              1. Affordability & Capital Requirements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-numbers">
              <div className="p-3 rounded-xl border border-stone-200 bg-white">
                <div className="text-[10px] text-stone-500 font-sans">Max Affordable Price</div>
                <div className="font-bold text-teal-800 text-sm mt-0.5">S${aff.maxPurchasePrice.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white">
                <div className="text-[10px] text-stone-500 font-sans">Bank Loan (75%)</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">S${aff.maxEligibleLoan.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white">
                <div className="text-[10px] text-stone-500 font-sans">Buyer Stamp Duty</div>
                <div className="font-bold text-slate-900 text-sm mt-0.5">S${aff.bsd.toLocaleString()}</div>
              </div>
              <div className="p-3 rounded-xl border border-stone-200 bg-white">
                <div className="text-[10px] text-stone-500 font-sans">Total Upfront Capital</div>
                <div className="font-bold text-teal-900 text-sm mt-0.5">S${aff.totalUpfrontCapitalRequired.toLocaleString()}</div>
              </div>
            </div>
          </div>

          {/* Section 2: Primary Property Match */}
          {primaryCondo && (
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
                2. Selected Focus Property: {primaryCondo.name}
              </h4>
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-600">Location:</span>
                  <span className="font-semibold text-slate-900">{primaryCondo.planningArea} ({primaryCondo.district})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Asking Price / PSF:</span>
                  <span className="font-mono-numbers font-bold text-slate-900">S${primaryCondo.askingPrice.toLocaleString()} (S${primaryCondo.pricePerSqFt} PSF)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-600">Transit Access:</span>
                  <span className="font-semibold text-teal-800">{primaryCondo.nearestMrt.name} ({primaryCondo.nearestMrt.walkTimeMinutes} min walk)</span>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: Four-Year Resale Projections */}
          {sim && (
            <div className="space-y-2">
              <h4 className="font-bold uppercase tracking-wider text-slate-900 text-xs">
                3. Four-Year Resale Projections (Holding Horizon: 4 Years)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-numbers">
                <div className="p-3 rounded-xl border border-teal-200 bg-teal-50/50 space-y-1">
                  <div className="font-sans font-bold text-teal-950 text-xs">Base Case (+2.8% p.a.)</div>
                  <div className="text-stone-600 text-[11px]">Future Sale Price: S${sim.base.projectedSalePrice.toLocaleString()}</div>
                  <div className="text-stone-600 text-[11px]">Net Cash in Hand: S${sim.base.netCashProceedsToBank.toLocaleString()}</div>
                  <div className="font-bold text-teal-800 text-xs pt-1 border-t border-teal-200">
                    Economic Profit: +S${sim.base.totalEconomicProfit.toLocaleString()}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/40 space-y-1">
                  <div className="font-sans font-bold text-rose-950 text-xs">Bear Case (-1.5% p.a.)</div>
                  <div className="text-stone-600 text-[11px]">Future Sale Price: S${sim.bear.projectedSalePrice.toLocaleString()}</div>
                  <div className="text-stone-600 text-[11px]">Net Cash in Hand: S${sim.bear.netCashProceedsToBank.toLocaleString()}</div>
                  <div className={`font-bold text-xs pt-1 border-t border-rose-200 ${sim.bear.totalEconomicProfit >= 0 ? 'text-teal-800' : 'text-rose-700'}`}>
                    Economic Profit: {sim.bear.totalEconomicProfit >= 0 ? '+' : ''}S${sim.bear.totalEconomicProfit.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Checklist */}
          <div className="p-4 rounded-xl border border-stone-200 bg-stone-50 space-y-2 text-[11px]">
            <div className="font-bold text-slate-900">First-Time Buyer Readiness Checklist:</div>
            <div className="space-y-1 text-stone-700">
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Obtain Bank In-Principle Approval (IPA) based on 55% TDSR</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Verify CPF OA balance and housing withdrawal limits on CPF portal</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Confirm MOE OneMap home-school distance for primary 1 balloting</div>
              <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-teal-600" /> Maintain emergency reserve fund (minimum 6 months mortgage buffer)</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-slate-900"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-teal-800 hover:bg-teal-900 text-white flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
