export interface RegulationRule {
  id: string;
  name: string;
  shortName: string;
  authority: 'IRAS' | 'MAS' | 'CPF Board' | 'SLA' | 'URA';
  category: 'Taxes & Stamp Duties' | 'Financing & Loans' | 'CPF Regulations' | 'Eligibility & Ownership';
  summary: string;
  whyItMatters: string;
  exampleImpact: string;
  officialSourceUrl: string;
  effectiveDate: string;
  lastVerifiedDate: string;
  tags: string[];
}

export const SINGAPORE_REGULATIONS: RegulationRule[] = [
  {
    id: 'bsd',
    name: "Buyer's Stamp Duty (BSD)",
    shortName: 'BSD',
    authority: 'IRAS',
    category: 'Taxes & Stamp Duties',
    summary: 'A progressive property tax payable on all residential acquisitions in Singapore, ranging from 1% on the first S$180,000 up to 6% on purchase value exceeding S$3,000,000.',
    whyItMatters: 'BSD is payable within 14 days of exercising the Option to Purchase (OTP). First-time buyers must prepare liquid cash or CPF OA savings upfront to settle this tax.',
    exampleImpact: 'On a S$1,600,000 condo: BSD = (1% on $180k = $1.8k) + (2% on $180k = $3.6k) + (3% on $640k = $19.2k) + (4% on $500k = $20.0k) + (5% on $100k = $5.0k) = S$49,600 total BSD.',
    officialSourceUrl: 'https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-acquiring-property/buyer-s-stamp-duty-(bsd)',
    effectiveDate: '15 February 2023 (Singapore Budget 2023)',
    lastVerifiedDate: 'March 2026',
    tags: ['Compulsory', 'Progressive', 'Payable via CPF/Cash']
  },
  {
    id: 'absd',
    name: "Additional Buyer's Stamp Duty (ABSD)",
    shortName: 'ABSD',
    authority: 'IRAS',
    category: 'Taxes & Stamp Duties',
    summary: 'An additional cooling-measure duty based on buyer citizenship profile and the count of residential properties owned. Singapore Citizens (SC) purchasing their 1st residential property enjoy 0% ABSD.',
    whyItMatters: 'If you are a Singapore PR (SPR), your 1st residential property incurs 5% ABSD. Foreigners incur 60% ABSD. For joint purchases (e.g., SC + SPR non-married), the higher rate applies unless qualifying for matrimonial home remission.',
    exampleImpact: 'On a S$1,500,000 condo: A first-time Singapore Citizen pays S$0 ABSD. A first-time Singapore PR pays 5% = S$75,000 ABSD. A Foreigner pays 60% = S$900,000 ABSD.',
    officialSourceUrl: 'https://www.iras.gov.sg/taxes/stamp-duty/for-property/buying-or-acquiring-property/additional-buyer-s-stamp-duty-(absd)',
    effectiveDate: '27 April 2023',
    lastVerifiedDate: 'March 2026',
    tags: ['Citizenship-Dependent', 'Cooling Measures', 'Remission Applicable']
  },
  {
    id: 'ssd',
    name: "Seller's Stamp Duty (SSD)",
    shortName: 'SSD',
    authority: 'IRAS',
    category: 'Taxes & Stamp Duties',
    summary: 'A penalty tax levied on sellers who dispose of residential properties within a 3-year holding period: 12% in Year 1, 8% in Year 2, 4% in Year 3, and 0% thereafter.',
    whyItMatters: 'Prevents speculative property flipping. Under CondoCompass SG’s default 4-year holding simulation, SSD is strictly 0%. However, if an unexpected early sale is forced in Years 1–3, SSD severely impacts net capital.',
    exampleImpact: 'If a buyer sells a condo for S$1,600,000 after 2.5 years (Year 3 tier): SSD = 4% of S$1,600,000 = S$64,000 payable immediately out of sale proceeds.',
    officialSourceUrl: 'https://www.iras.gov.sg/taxes/stamp-duty/for-property/selling-or-disposing-property/seller-s-stamp-duty-(ssd)',
    effectiveDate: '11 March 2017',
    lastVerifiedDate: 'March 2026',
    tags: ['Holding Period', 'Anti-Speculation', 'Zero after 3 Years']
  },
  {
    id: 'tdsr',
    name: 'Total Debt Servicing Ratio (TDSR)',
    shortName: 'TDSR',
    authority: 'MAS',
    category: 'Financing & Loans',
    summary: 'Monetary Authority of Singapore (MAS) regulation capping a borrower’s total monthly debt repayment obligations (mortgage, car loans, credit cards, student loans) at 55% of gross monthly income.',
    whyItMatters: 'Banks must calculate mortgage installments using a MAS-mandated stress-test interest rate of 4.0% p.a. (higher than floating market rates) to ensure borrowers can weather future rate hikes.',
    exampleImpact: 'Household gross income of S$14,000/month: Maximum allowable total monthly debt cap (55%) = S$7,700. If you have S$800/month car loan, maximum mortgage allowed = S$6,900/month.',
    officialSourceUrl: 'https://www.mas.gov.sg/regulation/explainers/tdsr-how-it-works',
    effectiveDate: '16 December 2021',
    lastVerifiedDate: 'March 2026',
    tags: ['55% Cap', '4.0% Stress Test', 'MAS Guideline']
  },
  {
    id: 'ltv',
    name: 'Loan-to-Value (LTV) Limit & Cash Down Payment',
    shortName: 'LTV',
    authority: 'MAS',
    category: 'Financing & Loans',
    summary: 'Maximum bank borrowing limit of 75% for first housing loans where tenure <= 30 years and age + tenure <= 65. Requires a mandatory minimum 5% cash down payment plus 20% in cash or CPF OA.',
    whyItMatters: 'If your loan tenure exceeds 30 years or if your age plus loan tenure exceeds 65 years, the maximum LTV drops to 55%, and the minimum cash down payment increases from 5% to 10%.',
    exampleImpact: 'On a S$1,500,000 condo at 75% LTV: Bank loan = S$1,125,000. Total down payment = S$375,000 (of which minimum S$75,000 must be hard cash; remaining S$300,000 can come from CPF OA).',
    officialSourceUrl: 'https://www.mas.gov.sg/regulation/explainers/mortgage-equity-withdrawal-loans/loan-to-value-limits-for-property-loans',
    effectiveDate: '6 July 2018',
    lastVerifiedDate: 'March 2026',
    tags: ['75% Max Bank Loan', '5% Min Cash Down', 'Age + Tenure <= 65']
  },
  {
    id: 'cpf-refund',
    name: 'CPF Principal & Accrued Interest Refund on Resale',
    shortName: 'CPF Accrued Interest',
    authority: 'CPF Board',
    category: 'CPF Regulations',
    summary: 'When you sell your condo, all CPF savings withdrawn for down payment, stamp duties, legal fees, and monthly mortgage instalments must be refunded back into your CPF OA, plus 2.5% compounded interest per annum.',
    whyItMatters: 'First-time buyers frequently misunderstand sale cash proceeds! The CPF refund is NOT a government tax (it goes back into your own retirement account), but it reduces the liquid cash you receive into your bank account upon sale.',
    exampleImpact: 'If you withdrew S$250,000 from CPF OA over 4 years: Accrued interest owed at 2.5% p.a. is ~S$26,000. Upon selling, S$276,000 must return directly to your CPF OA before you receive remaining cash.',
    officialSourceUrl: 'https://www.cpf.gov.sg/member/faq/home-ownership/housing-scheme/what-happens-to-my-cpf-savings-when-i-sell-my-property',
    effectiveDate: 'Ongoing CPF Housing Scheme Rule',
    lastVerifiedDate: 'March 2026',
    tags: ['2.5% Compounded', 'Retirement Protection', 'No Double Count']
  },
  {
    id: 'property-tax',
    name: 'Progressive Property Tax (Owner-Occupier)',
    shortName: 'Property Tax',
    authority: 'IRAS',
    category: 'Taxes & Stamp Duties',
    summary: 'Annual tax based on the Annual Value (AV) of your condo (estimated gross annual rental). Owner-occupied homes enjoy concessionary progressive rates: 0% on first S$12,000 AV, 4% on next S$28,000, and 6% thereafter.',
    whyItMatters: 'Ongoing annual holding cost. For a typical 2-bedroom or 3-bedroom suburban condo with an Annual Value of S$36,000, annual property tax is approximately S$960/year (S$80/month).',
    exampleImpact: 'AV of S$42,000: Tax = ($12,000 @ 0%) + ($28,000 @ 4% = $1,120) + ($2,000 @ 6% = $120) = S$1,240 per annum.',
    officialSourceUrl: 'https://www.iras.gov.sg/taxes/property-tax/property-owners/property-tax-rates',
    effectiveDate: '1 January 2025 (Annual Value Threshold Adjustments)',
    lastVerifiedDate: 'March 2026',
    tags: ['Annual Sunk Cost', 'Owner Concession', 'AV Thresholds']
  },
  {
    id: 'hdb-mop',
    name: 'HDB 5-Year Minimum Occupation Period (MOP) Rule',
    shortName: 'HDB MOP & Prior Ownership',
    authority: 'URA',
    category: 'Eligibility & Ownership',
    summary: 'Current owners of an HDB flat or Executive Condominium (EC) must fulfill their 5-year Minimum Occupation Period before they can purchase a private residential property in Singapore.',
    whyItMatters: 'If you currently hold an HDB flat that has not reached MOP, you are legally prohibited from buying a private condominium, even with full cash.',
    exampleImpact: 'A flat owner 4 years into their MOP must wait 12 more months before submitting an Option to Purchase for any private condominium.',
    officialSourceUrl: 'https://www.hdb.gov.sg/residential/living-in-an-hdb-flat/acquiring-private-property',
    effectiveDate: 'Ongoing HDB Housing Act',
    lastVerifiedDate: 'March 2026',
    tags: ['HDB Regulations', '5-Year MOP', 'Legal Bar']
  }
];
