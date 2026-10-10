export interface PriceIndexPoint {
  period: string; // e.g. "2021 Q1"
  allPrivate: number; // Index (base 100)
  ccr: number;
  rcr: number;
  ocr: number;
}

export interface PsfTrendPoint {
  year: string;
  ccrPsf: number;
  rcrPsf: number;
  ocrPsf: number;
  newLaunchPsfAvg: number;
  resalePsfAvg: number;
}

export interface InterestRatePoint {
  period: string;
  sora3M: number;
  bankFixedRate: number;
  bankFloatingRate: number;
}

export interface RentalYieldDistrict {
  district: string;
  areaName: string;
  region: 'CCR' | 'RCR' | 'OCR';
  avgPsf: number;
  avgRentPsf: number;
  grossRentalYield: number; // in %
  capitalGrowth4Yr: number; // % over past 4 years
}

export const URA_PPI_SERIES: PriceIndexPoint[] = [
  { period: '2021 Q1', allPrivate: 157.4, ccr: 134.2, rcr: 158.1, ocr: 167.3 },
  { period: '2021 Q3', allPrivate: 165.0, ccr: 138.8, rcr: 164.5, ocr: 175.2 },
  { period: '2022 Q1', allPrivate: 173.8, ccr: 142.0, rcr: 174.1, ocr: 186.4 },
  { period: '2022 Q3', allPrivate: 187.1, ccr: 148.5, rcr: 188.2, ocr: 202.9 },
  { period: '2023 Q1', allPrivate: 194.6, ccr: 151.2, rcr: 195.4, ocr: 212.0 },
  { period: '2023 Q3', allPrivate: 196.2, ccr: 147.6, rcr: 197.8, ocr: 215.3 },
  { period: '2024 Q1', allPrivate: 201.5, ccr: 148.9, rcr: 202.1, ocr: 221.4 },
  { period: '2024 Q3', allPrivate: 205.8, ccr: 151.4, rcr: 206.5, ocr: 226.7 },
  { period: '2025 Q1', allPrivate: 209.4, ccr: 153.2, rcr: 209.8, ocr: 231.0 },
  { period: '2025 Q3', allPrivate: 213.1, ccr: 155.0, rcr: 213.6, ocr: 235.4 },
  { period: '2026 Q1', allPrivate: 216.5, ccr: 156.8, rcr: 217.2, ocr: 239.2 }
];

export const PSF_ANNUAL_TRENDS: PsfTrendPoint[] = [
  { year: '2021', ccrPsf: 2450, rcrPsf: 1820, ocrPsf: 1380, newLaunchPsfAvg: 1980, resalePsfAvg: 1420 },
  { year: '2022', ccrPsf: 2680, rcrPsf: 2050, ocrPsf: 1560, newLaunchPsfAvg: 2240, resalePsfAvg: 1580 },
  { year: '2023', ccrPsf: 2790, rcrPsf: 2210, ocrPsf: 1690, newLaunchPsfAvg: 2420, resalePsfAvg: 1690 },
  { year: '2024', ccrPsf: 2850, rcrPsf: 2320, ocrPsf: 1780, newLaunchPsfAvg: 2540, resalePsfAvg: 1760 },
  { year: '2025', ccrPsf: 2920, rcrPsf: 2390, ocrPsf: 1840, newLaunchPsfAvg: 2630, resalePsfAvg: 1810 },
  { year: '2026', ccrPsf: 2980, rcrPsf: 2440, ocrPsf: 1890, newLaunchPsfAvg: 2710, resalePsfAvg: 1860 }
];

export const INTEREST_RATE_SERIES: InterestRatePoint[] = [
  { period: '2021', sora3M: 0.35, bankFixedRate: 1.35, bankFloatingRate: 1.15 },
  { period: '2022', sora3M: 2.10, bankFixedRate: 3.25, bankFloatingRate: 2.90 },
  { period: '2023', sora3M: 3.65, bankFixedRate: 3.75, bankFloatingRate: 4.10 },
  { period: '2024', sora3M: 3.40, bankFixedRate: 3.45, bankFloatingRate: 3.85 },
  { period: '2025', sora3M: 2.95, bankFixedRate: 3.10, bankFloatingRate: 3.40 },
  { period: '2026', sora3M: 2.70, bankFixedRate: 2.85, bankFloatingRate: 3.15 }
];

export const DISTRICT_RENTAL_BENCHMARKS: RentalYieldDistrict[] = [
  { district: 'D18', areaName: 'Tampines / Pasir Ris', region: 'OCR', avgPsf: 1560, avgRentPsf: 4.50, grossRentalYield: 3.46, capitalGrowth4Yr: 18.4 },
  { district: 'D19', areaName: 'Punggol / Sengkang', region: 'OCR', avgPsf: 1440, avgRentPsf: 4.40, grossRentalYield: 3.67, capitalGrowth4Yr: 21.2 },
  { district: 'D03', areaName: 'Queenstown / Alexandra', region: 'RCR', avgPsf: 2260, avgRentPsf: 6.80, grossRentalYield: 3.61, capitalGrowth4Yr: 16.8 },
  { district: 'D05', areaName: 'Clementi / West Coast', region: 'OCR', avgPsf: 1920, avgRentPsf: 5.60, grossRentalYield: 3.50, capitalGrowth4Yr: 17.5 },
  { district: 'D20', areaName: 'Bishan / Ang Mo Kio', region: 'RCR', avgPsf: 2150, avgRentPsf: 6.20, grossRentalYield: 3.46, capitalGrowth4Yr: 15.2 },
  { district: 'D15', areaName: 'Marine Parade / East Coast', region: 'RCR', avgPsf: 2520, avgRentPsf: 6.90, grossRentalYield: 3.29, capitalGrowth4Yr: 14.8 },
  { district: 'D21', areaName: 'Upper Bukit Timah', region: 'RCR', avgPsf: 2420, avgRentPsf: 6.40, grossRentalYield: 3.17, capitalGrowth4Yr: 13.9 },
  { district: 'D22', areaName: 'Jurong East / Lakeside', region: 'OCR', avgPsf: 1820, avgRentPsf: 5.40, grossRentalYield: 3.56, capitalGrowth4Yr: 19.6 },
  { district: 'D10', areaName: 'Tanglin / Holland / Bukit Timah', region: 'CCR', avgPsf: 2950, avgRentPsf: 7.80, grossRentalYield: 3.17, capitalGrowth4Yr: 11.2 }
];

export const UPCOMING_COMPLETIONS = [
  { year: '2024', units: 10200, status: 'Completed' },
  { year: '2025', units: 8900, status: 'Completed' },
  { year: '2026', units: 7400, status: 'Expected TOP' },
  { year: '2027', units: 6800, status: 'Under Construction' },
  { year: '2028', units: 5500, status: 'Planned / GLS Land' }
];

export const COOLING_MEASURES_TIMELINE = [
  {
    date: 'April 2023',
    title: 'ABSD Revision on Foreigners & 2nd Properties',
    detail: 'Foreigner ABSD doubled from 30% to 60%. SPR 2nd property raised to 30%. First-time Singapore Citizens retained at 0%.'
  },
  {
    date: 'February 2023',
    title: 'Budget 2023 BSD Higher Tiers',
    detail: 'Introduced 5% BSD tier for residential value between $1.5M - $3M, and 6% for value exceeding $3M.'
  },
  {
    date: 'September 2022',
    title: 'MAS Interest Rate Stress Test Raised',
    detail: 'Residential property loan medium-term interest rate floor tightened to 4.0% p.a. to curb overleveraging.'
  },
  {
    date: 'December 2021',
    title: 'TDSR Tightened to 55%',
    detail: 'Total Debt Servicing Ratio cap lowered from 60% to 55% of borrower gross income.'
  }
];
