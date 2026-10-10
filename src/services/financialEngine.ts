import { BuyerProfile, AffordabilityResult, ResaleScenarioOutcome, CondoProperty } from '../types/property';

/**
 * Singapore Buyer's Stamp Duty (BSD) Calculation for Residential Properties
 * Updated pursuant to Singapore Budget 2023 tiers:
 * - First S$180,000 @ 1%
 * - Next S$180,000 ($180k - $360k) @ 2%
 * - Next S$640,000 ($360k - $1M) @ 3%
 * - Next S$500,000 ($1M - $1.5M) @ 4%
 * - Next S$1,500,000 ($1.5M - $3M) @ 5%
 * - Remaining above S$3,000,000 @ 6%
 */
export function calculateBSD(propertyPrice: number): number {
  if (propertyPrice <= 0) return 0;
  let bsd = 0;
  const price = Math.round(propertyPrice);

  // Tier 1: First $180,000 @ 1%
  const t1 = Math.min(price, 180000);
  bsd += t1 * 0.01;

  // Tier 2: Next $180,000 ($180,001 to $360,000) @ 2%
  if (price > 180000) {
    const t2 = Math.min(price - 180000, 180000);
    bsd += t2 * 0.02;
  }

  // Tier 3: Next $640,000 ($360,001 to $1,000,000) @ 3%
  if (price > 360000) {
    const t3 = Math.min(price - 360000, 640000);
    bsd += t3 * 0.03;
  }

  // Tier 4: Next $500,000 ($1,000,001 to $1,500,000) @ 4%
  if (price > 1000000) {
    const t4 = Math.min(price - 1000000, 500000);
    bsd += t4 * 0.04;
  }

  // Tier 5: Next $1,500,000 ($1,500,001 to $3,000,000) @ 5%
  if (price > 1500000) {
    const t5 = Math.min(price - 1500000, 1500000);
    bsd += t5 * 0.05;
  }

  // Tier 6: Above $3,000,000 @ 6%
  if (price > 3000000) {
    const t6 = price - 3000000;
    bsd += t6 * 0.06;
  }

  return Math.round(bsd);
}

/**
 * Additional Buyer's Stamp Duty (ABSD) Rates (Effective April 2023)
 * - Singapore Citizen (SC):
 *     1st property: 0%
 *     2nd property: 20%
 * - Singapore PR (SPR):
 *     1st property: 5%
 *     2nd property: 30%
 * - Foreigner (FR):
 *     Any residential property: 60%
 * Joint purchase rule: higher rate applies unless married SC+SPR/SC+FR buying their first residential property jointly (qualifies for ABSD remission).
 */
export function calculateABSD(
  propertyPrice: number,
  citizenship: 'SC' | 'SPR' | 'FR',
  hasExistingProperty: boolean,
  isJointPurchase: boolean = false,
  coBuyerCitizenship?: 'SC' | 'SPR' | 'FR'
): number {
  if (propertyPrice <= 0) return 0;
  
  const getRate = (c: 'SC' | 'SPR' | 'FR', hasProp: boolean): number => {
    if (c === 'SC') {
      return hasProp ? 0.20 : 0.0;
    }
    if (c === 'SPR') {
      return hasProp ? 0.30 : 0.05;
    }
    // Foreigner
    return 0.60;
  };

  const primaryRate = getRate(citizenship, hasExistingProperty);
  
  let effectiveRate = primaryRate;
  if (isJointPurchase && coBuyerCitizenship) {
    const coRate = getRate(coBuyerCitizenship, hasExistingProperty);
    // In Singapore, if SC is buying jointly with SPR spouse for 1st home, remission applies (0%).
    // For non-married joint buyers, the higher ABSD rate applies.
    if (!hasExistingProperty && ((citizenship === 'SC' && coBuyerCitizenship === 'SPR') || (citizenship === 'SPR' && coBuyerCitizenship === 'SC'))) {
      effectiveRate = 0.0; // Married SC + SPR 1st matrimonial home remission
    } else {
      effectiveRate = Math.max(primaryRate, coRate);
    }
  }

  return Math.round(propertyPrice * effectiveRate);
}

/**
 * Seller's Stamp Duty (SSD)
 * - Sold within 1 year: 12%
 * - Sold between 1 to 2 years: 8%
 * - Sold between 2 to 3 years: 4%
 * - Sold after 3 years: 0%
 */
export function calculateSSD(salePrice: number, holdingYears: number): number {
  if (holdingYears < 1.0) return Math.round(salePrice * 0.12);
  if (holdingYears < 2.0) return Math.round(salePrice * 0.08);
  if (holdingYears < 3.0) return Math.round(salePrice * 0.04);
  return 0; // 0% after 3 years (standard for 4-year default horizon)
}

/**
 * Standard Monthly Mortgage Payment (Amortization formula)
 * M = P * [r(1+r)^n] / [(1+r)^n - 1]
 */
export function calculateMonthlyMortgage(loanPrincipal: number, annualInterestRatePercent: number, tenureYears: number): number {
  if (loanPrincipal <= 0 || tenureYears <= 0) return 0;
  if (annualInterestRatePercent <= 0) return Math.round(loanPrincipal / (tenureYears * 12));
  
  const r = annualInterestRatePercent / 100 / 12;
  const n = tenureYears * 12;
  const payment = (loanPrincipal * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1);
  return Math.round(payment);
}

/**
 * Maximum eligible loan calculation based on MAS Total Debt Servicing Ratio (TDSR)
 * MAS rule: Maximum 55% of monthly income can go towards total debt payments.
 * Bank stress test interest rate: 4.0% p.a.
 */
export function calculateMaxLoanTDSR(
  monthlyIncome: number,
  existingMonthlyDebts: number,
  tenureYears: number,
  stressTestRatePercent: number = 4.0
): number {
  const maxAllowableDebtServicing = monthlyIncome * 0.55;
  const maxMortgagePayment = Math.max(0, maxAllowableDebtServicing - existingMonthlyDebts);
  
  if (maxMortgagePayment <= 0 || tenureYears <= 0) return 0;
  
  // Invert monthly payment formula to find Principal:
  // P = M * [(1+r)^n - 1] / [r(1+r)^n]
  const r = stressTestRatePercent / 100 / 12;
  const n = tenureYears * 12;
  const maxLoan = (maxMortgagePayment * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
  return Math.round(maxLoan);
}

/**
 * Evaluate LTV cap according to MAS age & tenure rules
 * For 1st property loan:
 * - 75% LTV if tenure <= 30 years AND age + tenure <= 65
 * - 55% LTV if tenure > 30 years OR age + tenure > 65
 */
export function getLtvRatioAndMinCash(age: number, tenureYears: number, hasExistingProperty: boolean): { ltvPercent: number; minCashDownPercent: number } {
  if (hasExistingProperty) {
    // 2nd property loan LTV is strictly 45% (or 25% if tenure exceeds limit)
    return { ltvPercent: 45, minCashDownPercent: 25 };
  }
  
  const totalAgeTenure = age + tenureYears;
  if (tenureYears <= 30 && totalAgeTenure <= 65) {
    return { ltvPercent: 75, minCashDownPercent: 5 };
  } else {
    return { ltvPercent: 55, minCashDownPercent: 10 };
  }
}

/**
 * Comprehensive Affordability Calculator
 */
export function evaluateAffordability(profile: BuyerProfile): AffordabilityResult {
  const totalHouseholdIncome = profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0);
  const effectiveAge = profile.isJointPurchase && profile.coBuyerAge 
    ? Math.round((profile.age + profile.coBuyerAge) / 2) // Income-weighted average in real bank practice, approx mean here
    : profile.age;

  const { ltvPercent, minCashDownPercent } = getLtvRatioAndMinCash(
    effectiveAge,
    profile.preferredTenureYears,
    profile.hasExistingProperty
  );

  const stressTestRate = 4.0; // MAS residential stress test
  const maxLoanByTDSR = calculateMaxLoanTDSR(
    totalHouseholdIncome,
    profile.monthlyDebts,
    profile.preferredTenureYears,
    stressTestRate
  );

  // Max purchase price can also be bounded by liquid capital (Cash + CPF OA for downpayment and stamp duties)
  // Loan is at most ltvPercent% of price. Thus Down Payment is (100 - ltvPercent)%.
  // Also buyer must afford BSD + ABSD + legal (~$3000) from liquid savings.
  const downPaymentPercent = 100 - ltvPercent;
  
  // Max price if constrained only by loan:
  const maxPriceByLoan = Math.round(maxLoanByTDSR / (ltvPercent / 100));

  // Max price if constrained by total liquid capital:
  // Liquid capital = profile.cashSavings + profile.cpfOA
  // Needs Down payment + ~4% estimated BSD
  const totalLiquid = profile.cashSavings + profile.cpfOA;
  const estimatedCapitalRatio = (downPaymentPercent / 100) + 0.04;
  const maxPriceByLiquid = Math.round(totalLiquid / estimatedCapitalRatio);

  // The actual maximum affordable purchase price is min of loan capability and capital capability (or profile maxBudget if specified)
  let maxPurchasePrice = Math.min(maxPriceByLoan, maxPriceByLiquid);
  if (profile.maxBudget > 0) {
    maxPurchasePrice = Math.min(maxPurchasePrice, profile.maxBudget);
  }
  // Sanity floor
  maxPurchasePrice = Math.max(600000, maxPurchasePrice);

  const maxEligibleLoan = Math.round(maxPurchasePrice * (ltvPercent / 100));
  const maxMonthlyMortgage = calculateMonthlyMortgage(maxEligibleLoan, profile.mortgageInterestRate, profile.preferredTenureYears);
  
  const bsd = calculateBSD(maxPurchasePrice);
  const absd = calculateABSD(
    maxPurchasePrice,
    profile.citizenship,
    profile.hasExistingProperty,
    profile.isJointPurchase,
    profile.coBuyerCitizenship
  );

  const legalAndValuationFees = 3500;
  const totalDownPaymentRequired = Math.round(maxPurchasePrice * (downPaymentPercent / 100));
  const minimumCashDownPayment = Math.round(maxPurchasePrice * (minCashDownPercent / 100));
  
  // CPF can pay up to (totalDownPayment - minimumCashDownPayment)
  const maxCpfForDownPayment = totalDownPaymentRequired - minimumCashDownPayment;
  const actualCpfUsed = Math.min(profile.cpfOA, maxCpfForDownPayment);
  const actualCashDownPayment = totalDownPaymentRequired - actualCpfUsed;

  const totalUpfrontCapitalRequired = totalDownPaymentRequired + bsd + absd + legalAndValuationFees;
  const upfrontCashPortion = actualCashDownPayment + legalAndValuationFees; // BSD/ABSD can usually be paid via CPF or cash
  const upfrontCpfPortion = actualCpfUsed + bsd + absd;

  const totalMonthlyDebtCapTDSR = Math.round(totalHouseholdIncome * 0.55);
  const actualMonthlyCommitment = maxMonthlyMortgage + profile.monthlyDebts;
  const remainingMonthlyIncome = Math.max(0, totalHouseholdIncome - actualMonthlyCommitment);
  const stressTestMonthlyMortgage = calculateMonthlyMortgage(maxEligibleLoan, stressTestRate, profile.preferredTenureYears);
  const qualifiesTDSR = (stressTestMonthlyMortgage + profile.monthlyDebts) <= totalMonthlyDebtCapTDSR;

  return {
    maxPurchasePrice,
    maxEligibleLoan,
    maxMonthlyMortgage,
    totalMonthlyDebtCapTDSR,
    actualMonthlyCommitment,
    remainingMonthlyIncome,
    ltvRatioPercent: ltvPercent,
    minimumCashDownPayment,
    cpfDownPaymentAllowed: maxCpfForDownPayment,
    totalDownPaymentRequired,
    bsd,
    absd,
    legalAndValuationFees,
    totalUpfrontCapitalRequired,
    upfrontCashPortion,
    upfrontCpfPortion,
    qualifiesTDSR,
    stressTestMortgageRate: stressTestRate
  };
}

/**
 * Detailed 4-Year Amortization Schedule
 * Returns month-by-month balance and cumulative totals
 */
export function simulateAmortizationSchedule(
  loanPrincipal: number,
  annualInterestRatePercent: number,
  tenureYears: number,
  simulationMonths: number = 48
) {
  const r = annualInterestRatePercent / 100 / 12;
  const totalMonths = tenureYears * 12;
  const monthlyPayment = calculateMonthlyMortgage(loanPrincipal, annualInterestRatePercent, tenureYears);
  
  let balance = loanPrincipal;
  let cumulativePrincipal = 0;
  let cumulativeInterest = 0;
  
  const yearlyData: { year: number; balance: number; principalPaid: number; interestPaid: number }[] = [];

  for (let m = 1; m <= simulationMonths; m++) {
    const interestPart = balance * r;
    const principalPart = Math.min(balance, monthlyPayment - interestPart);
    balance -= principalPart;
    cumulativePrincipal += principalPart;
    cumulativeInterest += interestPart;

    if (m % 12 === 0 || m === simulationMonths) {
      yearlyData.push({
        year: Math.ceil(m / 12),
        balance: Math.round(balance),
        principalPaid: Math.round(cumulativePrincipal),
        interestPaid: Math.round(cumulativeInterest)
      });
    }
  }

  return {
    outstandingLoan: Math.round(balance),
    cumulativePrincipalPaid: Math.round(cumulativePrincipal),
    cumulativeInterestPaid: Math.round(cumulativeInterest),
    yearlyData
  };
}

/**
 * 4-Year Resale and Investment Simulator
 * Calculates full financial ledger under Bear, Base, and Bull market scenarios.
 * Accurately models CPF Accrued Interest (2.5% p.a.), SSD, agent commission, holding costs,
 * and distinguishes between net cash proceeds and true economic gain/loss.
 */
export function simulateResaleScenarios(
  purchasePrice: number,
  holdingYears: number = 4,
  profile: BuyerProfile,
  customParams?: {
    annualAppreciationRates?: { bear: number; base: number; bull: number };
    monthlyMaintenance?: number;
    renovationCost?: number;
    annualPropertyTax?: number;
    annualInsurance?: number;
    sellingAgentFeePercent?: number; // default 2% + GST = 2.18%
  }
): { bear: ResaleScenarioOutcome; base: ResaleScenarioOutcome; bull: ResaleScenarioOutcome } {
  const rates = customParams?.annualAppreciationRates || {
    bear: -1.0, // prices soften or stagnate
    base: +2.8, // historical long-term CPI+GDP growth pace
    bull: +5.5  // strong capital appreciation
  };

  const monthlyMaintenance = customParams?.monthlyMaintenance ?? 400;
  const renovationCost = customParams?.renovationCost ?? 35000;
  const annualPropertyTax = customParams?.annualPropertyTax ?? 2200; // IRAS owner-occupier estimate
  const annualInsurance = customParams?.annualInsurance ?? 350;
  const sellingAgentCommissionPercent = customParams?.sellingAgentFeePercent ?? 2.18; // 2% + 9% GST

  const { ltvPercent, minCashDownPercent } = getLtvRatioAndMinCash(profile.age, profile.preferredTenureYears, profile.hasExistingProperty);
  const initialLoan = Math.round(purchasePrice * (ltvPercent / 100));
  const downPayment = purchasePrice - initialLoan;
  const minCashDown = Math.round(purchasePrice * (minCashDownPercent / 100));
  const cpfDownPaymentUsed = Math.min(profile.cpfOA, downPayment - minCashDown);

  const bsd = calculateBSD(purchasePrice);
  const absd = calculateABSD(purchasePrice, profile.citizenship, profile.hasExistingProperty, profile.isJointPurchase, profile.coBuyerCitizenship);
  const purchaseLegal = 3000;

  const simulationMonths = Math.round(holdingYears * 12);
  const amort = simulateAmortizationSchedule(initialLoan, profile.mortgageInterestRate, profile.preferredTenureYears, simulationMonths);
  const monthlyMortgage = calculateMonthlyMortgage(initialLoan, profile.mortgageInterestRate, profile.preferredTenureYears);
  
  // In Singapore, buyers often service monthly mortgage using CPF OA up to limits:
  // Assume 60% of monthly instalment is paid via CPF OA if available, rest cash:
  const monthlyCpfInstallment = Math.round(monthlyMortgage * 0.6);
  const totalCpfInstallments = monthlyCpfInstallment * simulationMonths;
  const totalCpfPrincipalUsed = cpfDownPaymentUsed + totalCpfInstallments;

  // CPF Accrued Interest (2.5% p.a. compounded annually)
  // For down payment: compounded over holdingYears
  const cpfDownPaymentAccrued = cpfDownPaymentUsed * (Math.pow(1 + 0.025, holdingYears) - 1);
  // For monthly contributions: average ~half the holding period
  const cpfInstallmentsAccrued = totalCpfInstallments * (Math.pow(1 + 0.025, holdingYears / 2) - 1);
  const totalCpfAccruedInterest = Math.round(cpfDownPaymentAccrued + cpfInstallmentsAccrued);
  const totalCpfRefundRequired = totalCpfPrincipalUsed + totalCpfAccruedInterest;

  // Holding costs over ownership period
  const holdingMaintenanceTotal = monthlyMaintenance * simulationMonths;
  const propertyTaxTotal = annualPropertyTax * holdingYears;
  const insuranceTotal = annualInsurance * holdingYears;
  const totalSunkHoldingCosts = holdingMaintenanceTotal + propertyTaxTotal + insuranceTotal + renovationCost;

  const createOutcome = (scenarioName: 'Bear' | 'Base' | 'Bull', rate: number): ResaleScenarioOutcome => {
    // Future sale price = purchasePrice * (1 + rate/100)^holdingYears
    const projectedSalePrice = Math.round(purchasePrice * Math.pow(1 + rate / 100, holdingYears));
    const grossCapitalGain = projectedSalePrice - purchasePrice;

    // Selling costs
    const sellingAgentFee = Math.round(projectedSalePrice * (sellingAgentCommissionPercent / 100));
    const sellingLegalFee = 2200;
    const sellersStampDutySSD = calculateSSD(projectedSalePrice, holdingYears);
    const totalSellingCosts = sellingAgentFee + sellingLegalFee + sellersStampDutySSD;

    // Cash received at sale:
    // Sale Price - Outstanding Mortgage - Selling Costs - CPF Refund
    const netCashProceedsToBank = Math.round(projectedSalePrice - amort.outstandingLoan - totalSellingCosts - totalCpfRefundRequired);

    // True economic profit/loss:
    // Economic Gain = (Sale Price - Selling Costs) - Purchase Price - Stamp Duties - Purchase Legal - Renovation - Holding Sunk Costs - Mortgage Interest Paid
    const totalMortgagePaid = amort.cumulativePrincipalPaid + amort.cumulativeInterestPaid;
    const totalEconomicProfit = Math.round(
      (projectedSalePrice - totalSellingCosts) -
      purchasePrice -
      bsd -
      absd -
      purchaseLegal -
      totalSunkHoldingCosts -
      amort.cumulativeInterestPaid
    );

    // Initial cash equity invested = Cash downpayment + BSD + ABSD + Purchase Legal + Renovation
    const cashDownPaid = downPayment - cpfDownPaymentUsed;
    const totalCashEquityInjected = cashDownPaid + bsd + absd + purchaseLegal + renovationCost + (monthlyMortgage - monthlyCpfInstallment) * simulationMonths;
    
    const roiInvestedEquityPercent = totalCashEquityInjected > 0 
      ? Number(((totalEconomicProfit / totalCashEquityInjected) * 100).toFixed(1))
      : 0;

    const annualizedRoiPercent = holdingYears > 0 
      ? Number((roiInvestedEquityPercent / holdingYears).toFixed(1))
      : 0;

    // Break-even sale price:
    // Price where Sale Price - Selling Costs - Outstanding Loan - CPF Refund = 0 Net Cash, OR where Economic Profit = 0
    // Economic break-even sale price:
    // Price * (1 - agentCommissionRate) = PurchasePrice + StampDuties + Legal + SunkCosts + InterestPaid + SellingLegal
    const breakEvenSalePrice = Math.round(
      (purchasePrice + bsd + absd + purchaseLegal + totalSunkHoldingCosts + amort.cumulativeInterestPaid + sellingLegalFee) /
      (1 - sellingAgentCommissionPercent / 100)
    );

    return {
      scenarioName,
      annualAppreciationRate: rate,
      projectedSalePrice,
      holdingYears,
      initialLoan,
      outstandingMortgageAtSale: amort.outstandingLoan,
      totalMortgagePaid,
      principalRepaid: amort.cumulativePrincipalPaid,
      interestPaid: amort.cumulativeInterestPaid,
      purchasePrice,
      upfrontStampDuties: bsd + absd,
      purchaseLegalFee: purchaseLegal,
      renovationCost,
      holdingMaintenanceTotal,
      propertyTaxTotal,
      insuranceTotal,
      totalSunkHoldingCosts,
      sellingAgentFee,
      sellingLegalFee,
      sellersStampDutySSD,
      totalSellingCosts,
      cpfPrincipalUsed: totalCpfPrincipalUsed,
      cpfAccruedInterestRefund: totalCpfAccruedInterest,
      totalCpfRefundRequired,
      grossCapitalGain,
      netCashProceedsToBank,
      totalEconomicProfit,
      roiInvestedEquityPercent,
      annualizedRoiPercent,
      breakEvenSalePrice
    };
  };

  return {
    bear: createOutcome('Bear', rates.bear),
    base: createOutcome('Base', rates.base),
    bull: createOutcome('Bull', rates.bull)
  };
}

/**
 * Dynamic Lifestyle Suitability Scoring Engine
 * Combines user-weighted criteria into a normalized 0-100 score with plain English rationale.
 */
export function calculateLifestyleScore(condo: CondoProperty, profile: BuyerProfile): { score: number; rationale: string; breakdown: Record<string, number> } {
  const w = profile.weights;
  const totalWeight = w.affordability + w.transport + (profile.hasSchoolNeeds ? w.schools : 0) + w.healthcare + w.groceries + w.amenities + w.parks;
  
  if (totalWeight <= 0) return { score: 75, rationale: 'Balanced default score across general metrics.', breakdown: {} };

  // Calculate affordability component dynamically against buyer's max budget:
  let dynamicAffordabilityScore = 80;
  if (profile.maxBudget > 0) {
    const ratio = condo.askingPrice / profile.maxBudget;
    if (ratio <= 0.85) dynamicAffordabilityScore = 98;
    else if (ratio <= 1.0) dynamicAffordabilityScore = 85;
    else if (ratio <= 1.1) dynamicAffordabilityScore = 65;
    else dynamicAffordabilityScore = 40;
  }

  const breakdown: Record<string, number> = {
    affordability: dynamicAffordabilityScore,
    transport: condo.lifestyleScores.transport,
    schools: profile.hasSchoolNeeds ? condo.lifestyleScores.schools : 0,
    healthcare: condo.lifestyleScores.healthcare,
    groceries: condo.lifestyleScores.groceries,
    amenities: condo.lifestyleScores.amenities,
    parks: condo.lifestyleScores.parks
  };

  const weightedSum = 
    (dynamicAffordabilityScore * w.affordability) +
    (condo.lifestyleScores.transport * w.transport) +
    (profile.hasSchoolNeeds ? condo.lifestyleScores.schools * w.schools : 0) +
    (condo.lifestyleScores.healthcare * w.healthcare) +
    (condo.lifestyleScores.groceries * w.groceries) +
    (condo.lifestyleScores.amenities * w.amenities) +
    (condo.lifestyleScores.parks * w.parks);

  const finalScore = Math.min(100, Math.max(30, Math.round(weightedSum / totalWeight)));

  // Generate plain-English explanation
  let strengths: string[] = [];
  let weaknesses: string[] = [];

  if (condo.nearestMrt.walkTimeMinutes <= 5) strengths.push(`prime ${condo.nearestMrt.walkTimeMinutes}-min walk to ${condo.nearestMrt.name}`);
  else if (condo.nearestMrt.walkTimeMinutes > 10) weaknesses.push(`${condo.nearestMrt.walkTimeMinutes}-min walk to MRT`);

  if (profile.hasSchoolNeeds && condo.primarySchoolsWithin1Km.length > 0) {
    strengths.push(`${condo.primarySchoolsWithin1Km[0]} within 1km`);
  } else if (profile.hasSchoolNeeds) {
    weaknesses.push('limited primary schools within 1km');
  }

  if (dynamicAffordabilityScore >= 90) strengths.push('well within your budget threshold');
  else if (dynamicAffordabilityScore < 60) weaknesses.push('approaches the top boundary of your borrowing capacity');

  const strengthText = strengths.length > 0 ? strengths.join(' and ') : 'well-balanced location attributes';
  const weakText = weaknesses.length > 0 ? `, but keep in mind ${weaknesses.join(' and ')}` : '.';
  const rationale = `Scores ${finalScore}/100 based on your priorities. Highlights include ${strengthText}${weakText}`;

  return {
    score: finalScore,
    rationale,
    breakdown
  };
}
