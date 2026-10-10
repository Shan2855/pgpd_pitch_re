import { BuyerProfile, CondoProperty } from '../types/property';
import { calculateBSD, calculateABSD, calculateMonthlyMortgage, evaluateAffordability, simulateResaleScenarios } from './financialEngine';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  suggestedFollowUps?: string[];
  propertyRecommendations?: CondoProperty[];
  calculationHighlight?: {
    label: string;
    value: string;
    notes: string;
  };
}

export interface IAIAdvisorService {
  sendMessage(
    query: string,
    profile: BuyerProfile,
    allCondos: CondoProperty[],
    chatHistory: ChatMessage[]
  ): Promise<ChatMessage>;
}

export class RuleBasedAdvisorService implements IAIAdvisorService {
  async sendMessage(
    query: string,
    profile: BuyerProfile,
    allCondos: CondoProperty[],
    _chatHistory: ChatMessage[]
  ): Promise<ChatMessage> {
    // Artificial slight latency for realistic conversational feel
    await new Promise((resolve) => setTimeout(resolve, 450));

    const lowerQuery = query.toLowerCase().trim();
    const aff = evaluateAffordability(profile);

    // 1. "Can I afford a S$1.5 million condo with S$12,000 household monthly income?" or general affordability query
    if (lowerQuery.includes('afford') || lowerQuery.includes('1.5 million') || lowerQuery.includes('income') || lowerQuery.includes('budget')) {
      const targetPrice = 1500000;
      const bsd = calculateBSD(targetPrice);
      const absd = calculateABSD(targetPrice, profile.citizenship, profile.hasExistingProperty, profile.isJointPurchase, profile.coBuyerCitizenship);
      const loan75 = targetPrice * 0.75;
      const monthlyMortgage = calculateMonthlyMortgage(loan75, profile.mortgageInterestRate, profile.preferredTenureYears);
      const downPayment25 = targetPrice * 0.25;
      const minCashDown = targetPrice * 0.05;

      const householdIncome = profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0);
      const isAffordable = householdIncome >= 11500 && (profile.cashSavings + profile.cpfOA) >= (downPayment25 + bsd + absd + 3500);

      const text = `Based on your profile (${profile.citizenship === 'SC' ? 'Singapore Citizen' : profile.citizenship === 'SPR' ? 'Permanent Resident' : 'Foreigner'}, household income S$${householdIncome.toLocaleString()}/mo):

1. **Down Payment & Capital**:
   - Total 25% down payment: **S$${downPayment25.toLocaleString()}** (minimum 5% cash = **S$${minCashDown.toLocaleString()}**; remaining S$300,000 can be paid via CPF OA or cash).
   - Buyer's Stamp Duty (BSD): **S$${bsd.toLocaleString()}**.
   - Additional Buyer's Stamp Duty (ABSD): **S$${absd.toLocaleString()}** (${profile.citizenship === 'SC' && !profile.hasExistingProperty ? '0% for first property' : profile.citizenship === 'SPR' ? '5% for SPR first property' : '60% for Foreigner'}).
   - Estimated legal & valuation fees: ~**S$3,500**.
   - **Total upfront liquid capital needed**: **S$${(downPayment25 + bsd + absd + 3500).toLocaleString()}**.

2. **Mortgage & TDSR**:
   - Estimated 75% bank loan: **S$${loan75.toLocaleString()}**.
   - Monthly mortgage repayment: ~**S$${monthlyMortgage.toLocaleString()}/month** (at ${profile.mortgageInterestRate}% p.a. over ${profile.preferredTenureYears} years).
   - Under the MAS 55% Total Debt Servicing Ratio (TDSR) rule, your maximum debt servicing capacity is **S$${Math.round(householdIncome * 0.55).toLocaleString()}/month**.

**Summary**: ${isAffordable ? 'Yes, this purchase is mathematically viable within normal conservative debt parameters.' : 'This property may stretch your liquid reserves or TDSR limit unless you increase cash down payment or extend loan tenure.'} Final approval remains subject to individual bank credit assessment.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        calculationHighlight: {
          label: 'Estimated Upfront Capital Required',
          value: `S$${(downPayment25 + bsd + absd + 3500).toLocaleString()}`,
          notes: `Includes 25% down payment + S$${bsd.toLocaleString()} BSD + S$${absd.toLocaleString()} ABSD`
        },
        suggestedFollowUps: [
          'What condos in Tampines are close to MRT?',
          'What happens if I sell after 4 years and prices fall by 10%?',
          'What are the biggest financial risks for first-time buyers?'
        ]
      };
    }

    // 2. "Which condos in Tampines are close to MRT and good primary schools?"
    if (lowerQuery.includes('tampines') || (lowerQuery.includes('east') && lowerQuery.includes('school'))) {
      const matchingCondos = allCondos.filter((c) => c.planningArea.toLowerCase() === 'tampines' || c.district.includes('D18'));
      const text = `In **Tampines (D18)**, here is how the landscape compares for transit access and primary education:

- **Treasure at Tampines** (TOP 2023, Asking ~S$1,380,000 / S$1,550 PSF):
  - **MRT Access**: 7-minute walk (550m) to Simei MRT (East-West Line) or direct bus to Tampines Interchange.
  - **Primary Schools**: Angsana Primary, Changkat Primary, and Yumin Primary within 1km. Renowned **St. Hilda's Primary** is within the 1-2km zone.
  - **Key Advantage**: Lowest monthly maintenance (~S$280/mo) in the district due to 2,203-unit economies of scale.

*Note on MOE Primary One Balloting*: Proximity within 1km affords priority in Phase 2C, but does not guarantee admission if oversubscribed. Always verify home-school distance on the official OneMap MOE portal before committing.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        propertyRecommendations: matchingCondos,
        suggestedFollowUps: [
          'Compare S$1.3M in Sengkang with S$1.6M in Queenstown',
          'Should I consider a 99-year leasehold or freehold condo?',
          'Can I afford a S$1.5M condo with my income?'
        ]
      };
    }

    // 3. "Should I consider a 99-year leasehold or freehold condo?"
    if (lowerQuery.includes('freehold') || lowerQuery.includes('leasehold') || lowerQuery.includes('99-year') || lowerQuery.includes('tenure')) {
      const text = `This is one of the classic debates for Singapore homebuyers. For a **first-time buyer with a 4 to 8 year holding horizon**, here is the analytical reality:

1. **Price Premium**:
   - Freehold properties typically command a **15% to 25% price premium** over comparable 99-year leasehold units in the same district.
   - Example: A 2-bedroom freehold in D15 (like Amber Park) commands ~S$2,750+ PSF, whereas a 99-year leasehold in D03 or D15 sits at ~S$2,200–S$2,400 PSF.

2. **Short-to-Medium Term Appreciation (4–8 Years)**:
   - Within the first 10–15 years of a leasehold condo's life, **lease decay is virtually negligible**. 
   - New 99-year leasehold condos frequently achieve comparable or higher percentage capital gains during initial resale cycles because they carry lower entry quantums and higher rental yields.

3. **Rental Yield Tradeoff**:
   - Because tenants pay rent based on proximity to MRT, lifestyle amenities, and interior condition (tenants do not care if a condo is freehold or leasehold), 99-year leasehold units generally generate **higher gross rental yields (3.5%–4.0%)** versus freehold (2.8%–3.3%).

4. **When Freehold Makes Sense**:
   - Generational wealth transfer (legacy planning beyond 30+ years).
   - En-bloc redevelopment potential in land-scarce boutique prime enclaves.

**Recommendation**: For a first-time buyer with a 4-year horizon, a modern 99-year leasehold close to an MRT interchange often offers superior cash efficiency and liquidity.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        suggestedFollowUps: [
          'What happens if I sell after 4 years and prices fall by 10%?',
          'What are the biggest financial risks for first-time buyers?',
          'Compare S$1.3M Sengkang with S$1.6M Queenstown'
        ]
      };
    }

    // 4. "What happens if I sell my condo after four years and prices fall by 10%?"
    if (lowerQuery.includes('fall') || lowerQuery.includes('bear') || lowerQuery.includes('drop') || lowerQuery.includes('prices decline') || lowerQuery.includes('10%')) {
      const samplePrice = aff.maxPurchasePrice || 1500000;
      const sim = simulateResaleScenarios(samplePrice, 4, profile, {
        annualAppreciationRates: { bear: -2.6, base: 2.8, bull: 5.5 } // -2.6% p.a. gives ~-10% over 4 years
      });

      const bear = sim.bear;

      const text = `Let's stress-test your purchase under a **Bear Case (-10% cumulative decline over 4 years)** on a **S$${samplePrice.toLocaleString()}** property:

1. **Future Sale Price**:
   - Initial purchase: S$${samplePrice.toLocaleString()}
   - Sale price after 4 years: **S$${bear.projectedSalePrice.toLocaleString()}** (a S$${Math.abs(bear.grossCapitalGain).toLocaleString()} gross capital drop).

2. **Mortgage Paydown**:
   - Outstanding bank mortgage reduces from S$${bear.initialLoan.toLocaleString()} to **S$${bear.outstandingMortgageAtSale.toLocaleString()}** (you will have built S$${bear.principalRepaid.toLocaleString()} of mortgage principal equity).

3. **Seller's Stamp Duty (SSD)**:
   - **S$0**. Because you held for 4 full years (exceeding the 3-year statutory holding threshold), no 12%/8%/4% SSD applies!

4. **CPF Refund Obligation**:
   - You must refund your CPF OA principal plus 2.5% p.a. accrued interest: ~**S$${bear.totalCpfRefundRequired.toLocaleString()}**.
   - *Crucial Singapore Rule*: If property is sold at market value and proceeds are insufficient to cover the full CPF accrued interest refund, you are **NOT** required to top up the CPF shortfall with out-of-pocket cash (provided transaction was at fair arm’s length market value).

5. **Net Cash in Hand**:
   - Net cash proceeds from bank: **S$${bear.netCashProceedsToBank.toLocaleString()}**.
   - Overall economic loss (including stamp duties, interest paid, renovation, and maintenance): **-S$${Math.abs(bear.totalEconomicProfit).toLocaleString()}**.

**Key Takeaway**: A 10% price drop does not result in personal bankruptcy if you are not overleveraged, but it will erode the majority of your initial cash equity and sunk acquisition costs.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        calculationHighlight: {
          label: 'Bear Scenario Estimated Economic Loss',
          value: `-S$${Math.abs(bear.totalEconomicProfit).toLocaleString()}`,
          notes: `Reflects -10% market decline, S$${bear.interestPaid.toLocaleString()} mortgage interest, and sunk costs.`
        },
        suggestedFollowUps: [
          'What are the biggest financial risks for first-time buyers?',
          'Can I afford a S$1.5M condo with my income?',
          'Compare S$1.3M in Sengkang with S$1.6M in Queenstown'
        ]
      };
    }

    // 5. "Compare a S$1.3 million condo in Sengkang with a S$1.6 million condo in Queenstown"
    if (lowerQuery.includes('sengkang') || lowerQuery.includes('queenstown') || (lowerQuery.includes('compare') && lowerQuery.includes('1.3'))) {
      const text = `Here is an executive tradeoff comparison between **The Vales in Sengkang (S$1.29M / S$1,410 PSF)** vs **Stirling Residences in Queenstown (S$1.78M / S$2,280 PSF)**:

1. **Quantum & Monthly Commitment**:
   - **Sengkang**: Upfront cash/CPF needed is ~S$360,000; monthly mortgage is ~S$3,750/mo. Much wider financial safety buffer for young families.
   - **Queenstown**: Upfront capital required jumps to ~S$505,000 (including BSD S$58k); monthly mortgage is ~S$5,200/mo. Requires steady household income of at least S$13,500/mo.

2. **Commute & Time Economy**:
   - **Queenstown**: 14 minutes direct MRT to Raffles Place / CBD, and 10 minutes to One-North tech park. Saves **~40 minutes of daily commute round-trip**.
   - **Sengkang**: 28–36 minutes to CBD via North-East Line; requires LRT transfer or bus connection.

3. **Space vs Location**:
   - Sengkang gives you a **generous 915 sq ft 3-bedroom** unit suitable for children or working from home.
   - Queenstown offers a **compact 780 sq ft 2-bedroom** unit at a higher price point.

4. **Resale Liquidity**:
   - Queenstown benefits from limited city-fringe land supply and high demand from HDB upgraders moving out of million-dollar Dawson flats.
   - Sengkang benefits from lower entry barrier and immediate proximity to Sengkang General Hospital.

**The Strategic Choice**: Choose Sengkang if family living space and lower financial leverage matter most; choose Queenstown if career proximity and city-fringe capital retention are your priorities.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        suggestedFollowUps: [
          'What happens if I sell after 4 years and prices fall by 10%?',
          'What are the biggest financial risks for first-time buyers?',
          'Should I consider a 99-year leasehold or freehold condo?'
        ]
      };
    }

    // 6. "What are the biggest financial risks for a first-time condo buyer in Singapore?"
    if (lowerQuery.includes('risk') || lowerQuery.includes('mistake') || lowerQuery.includes('pitfall')) {
      const text = `The top **5 financial risks** first-time private condo buyers face in Singapore:

1. **CPF Accrued Interest Trap**:
   - Withdrawing CPF OA for down payment and monthly mortgage carries an invisible 2.5% annual compound interest liability owed back to your own account. Over 4 years, withdrawing S$300k generates **~S$32,000 in accrued interest obligation**, reducing your liquid cash proceeds upon sale.

2. **Mortgage Interest Rate Volatility**:
   - While SORA has moderated from 2023 highs, floating package rate swings can add S$400–S$700/month to monthly repayments on a S$1.2M loan. Always budget for the MAS **4.0% stress-test rate**, not just promotional Year-1 bank rates.

3. **Over-Leveraging on Sunk Renovation & MCST Fees**:
   - Condominium maintenance fees (MCST) range between S$300 to S$500/month (S$14,400 to S$24,000 over 4 years) and cannot be recovered on sale. Combine this with S$40,000+ renovation sunk costs, and your property must appreciate significantly just to break even.

4. **Forced Sale Triggering Seller’s Stamp Duty (SSD)**:
   - Selling within Year 1 (12%), Year 2 (8%), or Year 3 (4%) due to job loss, relocation, or divorce will cause massive capital loss. Ensure at least a 6-month liquid emergency fund before buying.

5. **Underestimating Resale Exit Competition in Mega-Projects**:
   - Developments with 1,500+ units often experience intense internal price competition when multiple owners attempt to exit simultaneously at the 4-year mark.`;

      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        text,
        suggestedFollowUps: [
          'Can I afford a S$1.5M condo with my income?',
          'Compare S$1.3M Sengkang with S$1.6M Queenstown',
          'What happens if I sell after 4 years and prices fall by 10%?'
        ]
      };
    }

    // Default intelligent response referencing user's actual profile
    const recs = allCondos
      .filter((c) => c.askingPrice <= (aff.maxPurchasePrice * 1.05))
      .slice(0, 2);

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: `Thank you for your question! Analyzing your profile (Citizenship: ${profile.citizenship}, Monthly Household Income: S$${(profile.monthlyIncome + (profile.coBuyerMonthlyIncome || 0)).toLocaleString()}, Max Budget: S$${aff.maxPurchasePrice.toLocaleString()}):

- **Estimated Maximum Affordable Condo**: ~S$${aff.maxPurchasePrice.toLocaleString()}
- **Monthly Mortgage Cap (TDSR 55%)**: S$${aff.totalMonthlyDebtCapTDSR.toLocaleString()}/month
- **Top Matching Recommendations**: ${recs.map((r) => `${r.name} (${r.planningArea}, S$${r.askingPrice.toLocaleString()})`).join(', ') || 'Treasure at Tampines, Stirling Residences'}

Would you like me to simulate a specific 4-year resale exit scenario, evaluate stamp duties, or compare transit accessibility for your daily commute?`,
      propertyRecommendations: recs,
      suggestedFollowUps: [
        'Can I afford a S$1.5M condo with my income?',
        'Which condos in Tampines are close to MRT and schools?',
        'What happens if I sell after 4 years and prices fall by 10%?'
      ]
    };
  }
}

export const aiAdvisor = new RuleBasedAdvisorService();
