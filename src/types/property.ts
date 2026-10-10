export type Citizenship = 'SC' | 'SPR' | 'FR'; // Singapore Citizen, Permanent Resident, Foreigner

export interface BuyerProfile {
  citizenship: Citizenship;
  age: number;
  isJointPurchase: boolean;
  coBuyerCitizenship?: Citizenship;
  coBuyerAge?: number;
  monthlyIncome: number; // SGD gross
  coBuyerMonthlyIncome?: number;
  cpfOA: number; // SGD available in CPF Ordinary Account
  cashSavings: number; // SGD cash available
  monthlyDebts: number; // Car loans, personal loans, etc.
  preferredTenureYears: number; // default 25 or 30
  mortgageInterestRate: number; // in %, e.g., 3.5
  hasExistingProperty: boolean; // First property or 2nd
  isConsideringHDB: boolean;
  
  // Lifestyle preferences
  preferredRegions: ('CCR' | 'RCR' | 'OCR')[];
  preferredDistricts: string[];
  maxBudget: number; // SGD
  minBedrooms: number;
  minFloorArea: number; // sqft
  maxMrtDistanceMeters: number;
  workplaceLocation: 'Raffles Place / CBD' | 'One-North / Buona Vista' | 'Jurong Lake District' | 'Changi Business Park' | 'Paya Lebar Hub';
  maxCommuteMinutes: number;
  hasSchoolNeeds: boolean; // Needs primary school < 1km
  hasHealthcareNeeds: boolean;
  lifestyleVibe: 'quiet_suburban' | 'balanced' | 'urban_vibrant';
  intendedHoldingYears: number; // default 4 years
  
  // Custom weights for lifestyle scoring (sum to 100)
  weights: {
    affordability: number;
    transport: number;
    schools: number;
    healthcare: number;
    groceries: number;
    amenities: number;
    parks: number;
  };
}

export interface AmenityDistance {
  name: string;
  type: 'mrt' | 'school' | 'hospital' | 'mall' | 'park' | 'business';
  distanceMeters: number;
  walkTimeMinutes: number;
  notes?: string;
}

export interface CondoProperty {
  id: string;
  name: string;
  tagline: string;
  developer: string;
  district: string; // e.g., "D18 - Pasir Ris / Tampines"
  planningArea: string; // "Tampines"
  region: 'CCR' | 'RCR' | 'OCR';
  address: string;
  askingPrice: number; // SGD
  pricePerSqFt: number; // SGD / sqft
  floorAreaSqFt: number;
  bedrooms: number;
  bathrooms: number;
  tenure: '99-year Leasehold' | 'Freehold' | '999-year Leasehold';
  topYear: number;
  propertyAge: number; // years since TOP (0 if new launch)
  isNewLaunch: boolean;
  totalUnits: number;
  monthlyMaintenanceEst: number; // SGD
  imageUrl: string;
  nearestMrt: {
    name: string;
    line: string;
    distanceMeters: number;
    walkTimeMinutes: number;
  };
  commuteTimeToCBDMinutes: number;
  commuteTimeToOneNorthMinutes: number;
  amenities: AmenityDistance[];
  primarySchoolsWithin1Km: string[];
  primarySchoolsWithin2Km: string[];
  lifestyleScores: {
    overall: number;
    affordability: number;
    transport: number;
    schools: number;
    healthcare: number;
    groceries: number;
    amenities: number;
    parks: number;
  };
  highlights: string[];
  tradeoffs: string[];
  mapCoords: {
    x: number; // 0 - 100 percentage relative to Singapore map container
    y: number; // 0 - 100 percentage
  };
}

export interface AffordabilityResult {
  maxPurchasePrice: number;
  maxEligibleLoan: number;
  maxMonthlyMortgage: number;
  totalMonthlyDebtCapTDSR: number; // 55% of gross income
  actualMonthlyCommitment: number;
  remainingMonthlyIncome: number;
  ltvRatioPercent: number; // usually 75% or 55%
  minimumCashDownPayment: number; // 5% or 10%
  cpfDownPaymentAllowed: number; // up to 20%
  totalDownPaymentRequired: number;
  bsd: number;
  absd: number;
  legalAndValuationFees: number;
  totalUpfrontCapitalRequired: number; // Cash + CPF downpayment + duties + fees
  upfrontCashPortion: number;
  upfrontCpfPortion: number;
  qualifiesTDSR: boolean;
  stressTestMortgageRate: number; // 4.0% MAS stress test rate
}

export interface ResaleScenarioOutcome {
  scenarioName: 'Bear' | 'Base' | 'Bull';
  annualAppreciationRate: number; // % per year (e.g., -1.5, +2.5, +5.5)
  projectedSalePrice: number;
  holdingYears: number;
  
  // Mortgage state
  initialLoan: number;
  outstandingMortgageAtSale: number;
  totalMortgagePaid: number;
  principalRepaid: number;
  interestPaid: number;
  
  // Upfront & Sunk costs
  purchasePrice: number;
  upfrontStampDuties: number; // BSD + ABSD
  purchaseLegalFee: number;
  renovationCost: number;
  holdingMaintenanceTotal: number;
  propertyTaxTotal: number;
  insuranceTotal: number;
  totalSunkHoldingCosts: number;
  
  // Selling costs
  sellingAgentFee: number; // 2% + 9% GST
  sellingLegalFee: number;
  sellersStampDutySSD: number; // 0% if >= 3 years
  totalSellingCosts: number;
  
  // CPF obligations
  cpfPrincipalUsed: number;
  cpfAccruedInterestRefund: number; // at 2.5% p.a.
  totalCpfRefundRequired: number;
  
  // Net results
  grossCapitalGain: number; // Sale price - Purchase price
  netCashProceedsToBank: number; // Actual cash buyer pockets after repaying bank, seller costs, and CPF refund
  totalEconomicProfit: number; // True net economic gain taking into account all sunk costs & holding costs
  roiInvestedEquityPercent: number; // Economic profit / total cash equity injected
  annualizedRoiPercent: number;
  breakEvenSalePrice: number;
}
