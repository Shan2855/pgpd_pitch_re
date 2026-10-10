import { CondoProperty } from '../types/property';

// Curated demo properties across Singapore (all clearly marked as DEMO DATA)
export const DEMO_CONDOS: CondoProperty[] = [
  {
    id: 'condo-treasure-tampines',
    name: 'Treasure at Tampines',
    tagline: 'Mega-development with resort facilities and direct Simei MRT link',
    developer: 'Sim Lian Group',
    district: 'D18 - Pasir Ris / Tampines',
    planningArea: 'Tampines',
    region: 'OCR',
    address: '118 Tampines Lane, Singapore 527588',
    askingPrice: 1380000,
    pricePerSqFt: 1550,
    floorAreaSqFt: 890,
    bedrooms: 3,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2023,
    propertyAge: 3,
    isNewLaunch: false,
    totalUnits: 2203,
    monthlyMaintenanceEst: 280,
    imageUrl: '/src/assets/images/condo_tampines_green_1791611677854.jpg',
    nearestMrt: {
      name: 'Simei MRT (EW3)',
      line: 'East-West Line',
      distanceMeters: 550,
      walkTimeMinutes: 7
    },
    commuteTimeToCBDMinutes: 32,
    commuteTimeToOneNorthMinutes: 44,
    amenities: [
      { name: 'Eastpoint Mall', type: 'mall', distanceMeters: 600, walkTimeMinutes: 8 },
      { name: 'Tampines Round Market & Food Centre', type: 'mall', distanceMeters: 450, walkTimeMinutes: 6 },
      { name: 'Changi General Hospital', type: 'hospital', distanceMeters: 900, walkTimeMinutes: 12 },
      { name: 'Tampines Changkat Community Club', type: 'amenities' as any, distanceMeters: 500, walkTimeMinutes: 7 }
    ],
    primarySchoolsWithin1Km: ['Angsana Primary School', 'Changkat Primary School', 'Yumin Primary School'],
    primarySchoolsWithin2Km: ['St. Hilda’s Primary School', 'Tampines Primary School'],
    lifestyleScores: {
      overall: 88,
      affordability: 94,
      transport: 82,
      schools: 86,
      healthcare: 90,
      groceries: 92,
      amenities: 95,
      parks: 80
    },
    highlights: [
      'Low maintenance fee due to mega-development economies of scale',
      'Short walk to Simei MRT and 24-hr NTUC FairPrice at Eastpoint Mall',
      'High rental yield demand from Changi Business Park & CGH medical staff'
    ],
    tradeoffs: [
      'High unit count (2,203 units) means higher competition on resale exits',
      '99-year leasehold starting from 2018'
    ],
    mapCoords: { x: 84, y: 44 }
  },
  {
    id: 'condo-stirling-queenstown',
    name: 'Stirling Residences',
    tagline: 'City-fringe luxury with panoramic southern ridges & CBD views',
    developer: 'LN Development (Nanshan & Logan Property)',
    district: 'D03 - Queenstown / Alexandra',
    planningArea: 'Queenstown',
    region: 'RCR',
    address: '21 Stirling Road, Singapore 148960',
    askingPrice: 1780000,
    pricePerSqFt: 2280,
    floorAreaSqFt: 780,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2022,
    propertyAge: 4,
    isNewLaunch: false,
    totalUnits: 1259,
    monthlyMaintenanceEst: 340,
    imageUrl: '/src/assets/images/condo_queenstown_highrise_1791611689564.jpg',
    nearestMrt: {
      name: 'Queenstown MRT (EW19)',
      line: 'East-West Line',
      distanceMeters: 350,
      walkTimeMinutes: 4
    },
    commuteTimeToCBDMinutes: 14,
    commuteTimeToOneNorthMinutes: 10,
    amenities: [
      { name: 'Mei Ling Market & Food Centre', type: 'mall', distanceMeters: 250, walkTimeMinutes: 3 },
      { name: 'Anchorpoint Shopping Centre', type: 'mall', distanceMeters: 800, walkTimeMinutes: 10 },
      { name: 'Alexandra Hospital', type: 'hospital', distanceMeters: 1100, walkTimeMinutes: 14 },
      { name: 'IKEA Alexandra', type: 'mall', distanceMeters: 850, walkTimeMinutes: 11 }
    ],
    primarySchoolsWithin1Km: ['Queenstown Primary School'],
    primarySchoolsWithin2Km: ['New Town Primary School', 'Gan Eng Seng Primary School'],
    lifestyleScores: {
      overall: 93,
      affordability: 72,
      transport: 97,
      schools: 78,
      healthcare: 92,
      groceries: 94,
      amenities: 96,
      parks: 85
    },
    highlights: [
      'Superb city-fringe connectivity: 4 MRT stops to Tanjong Pagar / CBD',
      '4-minute sheltered walking distance to Queenstown MRT',
      'Strong tenant pool from One-North tech & biomedical hubs and CBD professionals'
    ],
    tradeoffs: [
      'Higher entry quantum (S$2,280 PSF) requires higher monthly income',
      'Only one primary school within 1km'
    ],
    mapCoords: { x: 44, y: 64 }
  },
  {
    id: 'condo-mayfair-bukittimah',
    name: 'Mayfair Modern',
    tagline: 'London Georgian-inspired architecture in prestigious Bukit Timah',
    developer: 'Oxley Holdings',
    district: 'D21 - Clementi Park / Upper Bukit Timah',
    planningArea: 'Bukit Timah',
    region: 'RCR',
    address: '2 Rifle Range Road, Singapore 588373',
    askingPrice: 1650000,
    pricePerSqFt: 2350,
    floorAreaSqFt: 702,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2024,
    propertyAge: 2,
    isNewLaunch: false,
    totalUnits: 171,
    monthlyMaintenanceEst: 390,
    imageUrl: '/src/assets/images/condo_bukittimah_luxury_1791611698980.jpg',
    nearestMrt: {
      name: 'King Albert Park MRT (DT6)',
      line: 'Downtown Line',
      distanceMeters: 300,
      walkTimeMinutes: 4
    },
    commuteTimeToCBDMinutes: 22,
    commuteTimeToOneNorthMinutes: 20,
    amenities: [
      { name: 'Bukit Timah Plaza & FairPrice Finest', type: 'mall', distanceMeters: 400, walkTimeMinutes: 5 },
      { name: 'KAP Mall', type: 'mall', distanceMeters: 320, walkTimeMinutes: 4 },
      { name: 'Bukit Timah Nature Reserve & Rail Corridor', type: 'park', distanceMeters: 650, walkTimeMinutes: 8 },
      { name: 'Gleneagles Hospital', type: 'hospital', distanceMeters: 4200, walkTimeMinutes: 40 }
    ],
    primarySchoolsWithin1Km: ['Methodist Girls’ School (Primary)', 'Pei Hwa Presbyterian Primary School'],
    primarySchoolsWithin2Km: ['Bukit Timah Primary School'],
    lifestyleScores: {
      overall: 91,
      affordability: 74,
      transport: 89,
      schools: 98,
      healthcare: 76,
      groceries: 88,
      amenities: 87,
      parks: 96
    },
    highlights: [
      'Dual top-tier primary school balloting: MGS (Primary) and Pei Hwa within 1km',
      'Direct doorstep connection to Rail Corridor and Bukit Timah Nature Reserve',
      'Boutique low-density living with high privacy'
    ],
    tradeoffs: [
      'Smaller boutique development (171 units) leads to slightly higher MCST fees',
      'No major full-sized shopping mega-mall within walking distance'
    ],
    mapCoords: { x: 42, y: 46 }
  },
  {
    id: 'condo-amber-park-eastcoast',
    name: 'Amber Park',
    tagline: 'Iconic freehold East Coast landmark with Stratosphere rooftop deck',
    developer: 'City Developments Limited (CDL)',
    district: 'D15 - Katong / Joo Chiat / Amber Road',
    planningArea: 'Marine Parade',
    region: 'RCR',
    address: '16 Amber Gardens, Singapore 439961',
    askingPrice: 2250000,
    pricePerSqFt: 2780,
    floorAreaSqFt: 810,
    bedrooms: 2,
    bathrooms: 2,
    tenure: 'Freehold',
    topYear: 2023,
    propertyAge: 3,
    isNewLaunch: false,
    totalUnits: 592,
    monthlyMaintenanceEst: 420,
    imageUrl: '/src/assets/images/hero_condo_waterfront_1791611664920.jpg',
    nearestMrt: {
      name: 'Tanjong Katong MRT (TE25)',
      line: 'Thomson-East Coast Line',
      distanceMeters: 280,
      walkTimeMinutes: 3
    },
    commuteTimeToCBDMinutes: 16,
    commuteTimeToOneNorthMinutes: 34,
    amenities: [
      { name: 'Parkway Parade Mall', type: 'mall', distanceMeters: 800, walkTimeMinutes: 10 },
      { name: 'East Coast Park Beach', type: 'park', distanceMeters: 550, walkTimeMinutes: 7 },
      { name: 'Katong Heritage Eateries & Cafes', type: 'amenities' as any, distanceMeters: 600, walkTimeMinutes: 8 },
      { name: 'Parkway East Hospital', type: 'hospital', distanceMeters: 1700, walkTimeMinutes: 22 }
    ],
    primarySchoolsWithin1Km: ['Tanjong Katong Primary School'],
    primarySchoolsWithin2Km: ['Tao Nan School', 'CHIJ (Katong) Primary', 'Haig Girls’ School'],
    lifestyleScores: {
      overall: 95,
      affordability: 60,
      transport: 92,
      schools: 88,
      healthcare: 86,
      groceries: 94,
      amenities: 98,
      parks: 98
    },
    highlights: [
      'Rare Freehold tenure with strong multi-generational capital retention',
      'Direct doorstep access to Tanjong Katong MRT (TEL direct to Shenton Way & Marina Bay)',
      'Coveted East Coast lifestyle: walking distance to beach and Katong cafe enclave'
    ],
    tradeoffs: [
      'Substantial entry budget (> S$2.2M) may strain first-time buyer limits',
      'Tao Nan School is between 1-2km, requiring Phase 2C balloting considerations'
    ],
    mapCoords: { x: 74, y: 62 }
  },
  {
    id: 'condo-parc-clematis',
    name: 'Parc Clematis',
    tagline: 'Mega resort community adjacent to Nan Hua Primary in Clementi',
    developer: 'Sing-Haiyi Gold Pte Ltd',
    district: 'D05 - Buona Vista / West Coast / Clementi',
    planningArea: 'Clementi',
    region: 'OCR',
    address: '2 Jalan Lempeng, Singapore 128799',
    askingPrice: 1590000,
    pricePerSqFt: 1880,
    floorAreaSqFt: 846,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2023,
    propertyAge: 3,
    isNewLaunch: false,
    totalUnits: 1468,
    monthlyMaintenanceEst: 310,
    imageUrl: '/src/assets/images/condo_tampines_green_1791611677854.jpg',
    nearestMrt: {
      name: 'Clementi MRT (EW23)',
      line: 'East-West Line',
      distanceMeters: 750,
      walkTimeMinutes: 9
    },
    commuteTimeToCBDMinutes: 20,
    commuteTimeToOneNorthMinutes: 12,
    amenities: [
      { name: 'Clementi Mall', type: 'mall', distanceMeters: 780, walkTimeMinutes: 10 },
      { name: 'Clementi 448 Market & Food Centre', type: 'mall', distanceMeters: 800, walkTimeMinutes: 10 },
      { name: 'National University Hospital (NUH)', type: 'hospital', distanceMeters: 3100, walkTimeMinutes: 35 },
      { name: 'Clementi Woods Park', type: 'park', distanceMeters: 1200, walkTimeMinutes: 15 }
    ],
    primarySchoolsWithin1Km: ['Nan Hua Primary School', 'Clementi Primary School', 'Qifa Primary School'],
    primarySchoolsWithin2Km: ['Pei Tong Primary School'],
    lifestyleScores: {
      overall: 92,
      affordability: 82,
      transport: 84,
      schools: 99,
      healthcare: 88,
      groceries: 90,
      amenities: 90,
      parks: 84
    },
    highlights: [
      'Gold standard primary school priority: directly within 1km of Nan Hua Primary',
      'Short 10-minute commute to One-North tech ecosystem and NUS',
      'Extensive 400,000 sq ft beachfront pool facilities'
    ],
    tradeoffs: [
      'Slightly longer walk to MRT (9 mins) during hot or rainy weather',
      'High density development with active family demographics'
    ],
    mapCoords: { x: 34, y: 56 }
  },
  {
    id: 'condo-jadescape-bishan',
    name: 'JadeScape',
    tagline: 'Smart-home integrated eco-development next to Marymount MRT',
    developer: 'Qingjian Realty',
    district: 'D20 - Ang Mo Kio / Bishan / Thomson',
    planningArea: 'Bishan',
    region: 'RCR',
    address: '314 Shunfu Road, Singapore 579708',
    askingPrice: 1720000,
    pricePerSqFt: 2120,
    floorAreaSqFt: 811,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2023,
    propertyAge: 3,
    isNewLaunch: false,
    totalUnits: 1206,
    monthlyMaintenanceEst: 330,
    imageUrl: '/src/assets/images/condo_queenstown_highrise_1791611689564.jpg',
    nearestMrt: {
      name: 'Marymount MRT (CC16)',
      line: 'Circle Line',
      distanceMeters: 280,
      walkTimeMinutes: 3
    },
    commuteTimeToCBDMinutes: 20,
    commuteTimeToOneNorthMinutes: 18,
    amenities: [
      { name: 'Shunfu Mart & Food Centre', type: 'mall', distanceMeters: 150, walkTimeMinutes: 2 },
      { name: 'Junction 8 Mall (Bishan)', type: 'mall', distanceMeters: 1200, walkTimeMinutes: 15 },
      { name: 'MacRitchie Reservoir Park', type: 'park', distanceMeters: 900, walkTimeMinutes: 11 },
      { name: 'Tan Tock Seng Hospital (TTSH)', type: 'hospital', distanceMeters: 3800, walkTimeMinutes: 40 }
    ],
    primarySchoolsWithin1Km: ['Catholic High School (Primary)'],
    primarySchoolsWithin2Km: ['Ai Tong School', 'Kuo Chuan Presbyterian Primary', 'Marymount Convent'],
    lifestyleScores: {
      overall: 94,
      affordability: 76,
      transport: 96,
      schools: 95,
      healthcare: 84,
      groceries: 92,
      amenities: 92,
      parks: 95
    },
    highlights: [
      'Rare 3-minute stroll to Marymount MRT on the Circle Line',
      'Coveted Catholic High School (Primary) within 1km balloting distance',
      'Doorstep to Shunfu Mart famous food centre and MacRitchie nature trails'
    ],
    tradeoffs: [
      'Circle Line peak hour interchange transfers needed for east-west commutes',
      'Upper Thomson Road traffic during evening peak hours'
    ],
    mapCoords: { x: 52, y: 44 }
  },
  {
    id: 'condo-piermont-punggol',
    name: 'Piermont Grand',
    tagline: 'Punggol Waterway facing executive development near Digital District',
    developer: 'City Developments Limited (CDL) & TID',
    district: 'D19 - Hougang / Punggol / Sengkang',
    planningArea: 'Punggol',
    region: 'OCR',
    address: '22 Sumang Walk, Singapore 828674',
    askingPrice: 1350000,
    pricePerSqFt: 1420,
    floorAreaSqFt: 951,
    bedrooms: 3,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2023,
    propertyAge: 3,
    isNewLaunch: false,
    totalUnits: 820,
    monthlyMaintenanceEst: 300,
    imageUrl: '/src/assets/images/hero_condo_waterfront_1791611664920.jpg',
    nearestMrt: {
      name: 'Sumang LRT (PW6) / Punggol MRT',
      line: 'North-East Line & LRT',
      distanceMeters: 320,
      walkTimeMinutes: 4
    },
    commuteTimeToCBDMinutes: 36,
    commuteTimeToOneNorthMinutes: 46,
    amenities: [
      { name: 'Waterway Point Mega Mall', type: 'mall', distanceMeters: 800, walkTimeMinutes: 10 },
      { name: 'Punggol Waterway Park', type: 'park', distanceMeters: 100, walkTimeMinutes: 1 },
      { name: 'Sengkang General Hospital', type: 'hospital', distanceMeters: 3200, walkTimeMinutes: 35 },
      { name: 'Punggol Digital District (JTC)', type: 'business', distanceMeters: 1800, walkTimeMinutes: 22 }
    ],
    primarySchoolsWithin1Km: ['Punggol Cove Primary School', 'Valour Primary School'],
    primarySchoolsWithin2Km: ['Oasis Primary School', 'Edgefield Primary School'],
    lifestyleScores: {
      overall: 87,
      affordability: 96,
      transport: 78,
      schools: 80,
      healthcare: 78,
      groceries: 88,
      amenities: 86,
      parks: 98
    },
    highlights: [
      'Unsurpassed waterfront park connector and water sports lifestyle',
      'Future capital catalyst: adjacent to upcoming Punggol Digital District (PDD) & SIT Campus',
      'Sub-S$1.4M quantum for full 3-bedroom unit under 960 sq ft'
    ],
    tradeoffs: [
      'LRT ride required to reach Punggol MRT, or 10-minute walk',
      'North-East Line morning train congestion toward Dhoby Ghaut'
    ],
    mapCoords: { x: 70, y: 26 }
  },
  {
    id: 'condo-jgateway-jurong',
    name: 'J Gateway',
    tagline: 'Heart of Jurong Lake District with 3 sheltered MRT interchanges',
    developer: 'MCL Land',
    district: 'D22 - Boon Lay / Jurong / Tuas',
    planningArea: 'Jurong East',
    region: 'OCR',
    address: '2 Gateway Drive, Singapore 608533',
    askingPrice: 1480000,
    pricePerSqFt: 1850,
    floorAreaSqFt: 800,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2017,
    propertyAge: 9,
    isNewLaunch: false,
    totalUnits: 738,
    monthlyMaintenanceEst: 350,
    imageUrl: '/src/assets/images/condo_queenstown_highrise_1791611689564.jpg',
    nearestMrt: {
      name: 'Jurong East MRT (EW24/NS1)',
      line: 'East-West & North-South Line',
      distanceMeters: 200,
      walkTimeMinutes: 2
    },
    commuteTimeToCBDMinutes: 24,
    commuteTimeToOneNorthMinutes: 16,
    amenities: [
      { name: 'Westgate & JEM Malls', type: 'mall', distanceMeters: 150, walkTimeMinutes: 2 },
      { name: 'IMM Outlet Mall', type: 'mall', distanceMeters: 550, walkTimeMinutes: 7 },
      { name: 'Ng Teng Fong General Hospital', type: 'hospital', distanceMeters: 300, walkTimeMinutes: 4 },
      { name: 'Jurong Lake Gardens', type: 'park', distanceMeters: 1400, walkTimeMinutes: 16 }
    ],
    primarySchoolsWithin1Km: ['Fuhua Primary School', 'Yuhua Primary School'],
    primarySchoolsWithin2Km: ['Princess Elizabeth Primary School'],
    lifestyleScores: {
      overall: 93,
      affordability: 84,
      transport: 99,
      schools: 80,
      healthcare: 99,
      groceries: 98,
      amenities: 98,
      parks: 82
    },
    highlights: [
      'Unbeatable transport: 2-minute fully sheltered walkway to Jurong East MRT interchange',
      'Connected directly via J-Walk elevated link to 4 mega malls and Ng Teng Fong General Hospital',
      'Anchor location inside Singapore’s 2nd Central Business District (JLD)'
    ],
    tradeoffs: [
      'Busy urban activity and rail viaduct proximity on lower floor stacks',
      'Older TOP year (2017) compared to 2023 launches'
    ],
    mapCoords: { x: 26, y: 52 }
  },
  {
    id: 'condo-reserve-residences',
    name: 'The Reserve Residences',
    tagline: 'Landmark integrated transport hub at Beauty World with bus interchange',
    developer: 'Far East Organization & Sino Group',
    district: 'D21 - Clementi Park / Upper Bukit Timah',
    planningArea: 'Bukit Timah',
    region: 'RCR',
    address: '9 Jalan Anak Bukit, Singapore 588996',
    askingPrice: 1980000,
    pricePerSqFt: 2550,
    floorAreaSqFt: 775,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2026,
    propertyAge: 0,
    isNewLaunch: true,
    totalUnits: 732,
    monthlyMaintenanceEst: 380,
    imageUrl: '/src/assets/images/condo_bukittimah_luxury_1791611698980.jpg',
    nearestMrt: {
      name: 'Beauty World MRT (DT5)',
      line: 'Downtown Line',
      distanceMeters: 120,
      walkTimeMinutes: 2
    },
    commuteTimeToCBDMinutes: 20,
    commuteTimeToOneNorthMinutes: 18,
    amenities: [
      { name: 'Bukit V Integrated Retail Mall', type: 'mall', distanceMeters: 50, walkTimeMinutes: 1 },
      { name: 'Cheong Chin Nam Food Enclave', type: 'amenities' as any, distanceMeters: 200, walkTimeMinutes: 2 },
      { name: 'Bukit Timah Nature Reserve', type: 'park', distanceMeters: 450, walkTimeMinutes: 6 },
      { name: 'Bukit Timah Community Building (Library/Market)', type: 'amenities' as any, distanceMeters: 100, walkTimeMinutes: 1 }
    ],
    primarySchoolsWithin1Km: ['Pei Hwa Presbyterian Primary School', 'Bukit Timah Primary School'],
    primarySchoolsWithin2Km: ['Methodist Girls’ School (Primary)'],
    lifestyleScores: {
      overall: 96,
      affordability: 68,
      transport: 99,
      schools: 98,
      healthcare: 80,
      groceries: 96,
      amenities: 98,
      parks: 97
    },
    highlights: [
      'Integrated Transport Hub (ITH) with direct subterranean MRT link and air-conditioned bus interchange',
      'Within 1km of renowned Pei Hwa Presbyterian Primary School',
      'Vibrant dining right across the street along Cheong Chin Nam road'
    ],
    tradeoffs: [
      'New launch premium pricing (S$2,550 PSF)',
      'Under progressive payment schedule until TOP completion'
    ],
    mapCoords: { x: 38, y: 44 }
  },
  {
    id: 'condo-vales-sengkang',
    name: 'The Vales',
    tagline: 'Family-centric condominium next to Cheng Lim LRT and Sengkang General',
    developer: 'SingHaiyi Group',
    district: 'D19 - Hougang / Punggol / Sengkang',
    planningArea: 'Sengkang',
    region: 'OCR',
    address: '9 Anchorvale Crescent, Singapore 544654',
    askingPrice: 1290000,
    pricePerSqFt: 1410,
    floorAreaSqFt: 915,
    bedrooms: 3,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2017,
    propertyAge: 9,
    isNewLaunch: false,
    totalUnits: 517,
    monthlyMaintenanceEst: 275,
    imageUrl: '/src/assets/images/condo_tampines_green_1791611677854.jpg',
    nearestMrt: {
      name: 'Cheng Lim LRT (SW1) / Sengkang MRT',
      line: 'North-East Line & LRT',
      distanceMeters: 150,
      walkTimeMinutes: 2
    },
    commuteTimeToCBDMinutes: 28,
    commuteTimeToOneNorthMinutes: 40,
    amenities: [
      { name: 'Compass One Shopping Centre', type: 'mall', distanceMeters: 650, walkTimeMinutes: 8 },
      { name: 'Sengkang General Hospital', type: 'hospital', distanceMeters: 300, walkTimeMinutes: 4 },
      { name: 'Sengkang Sports Centre & Swimming Complex', type: 'park', distanceMeters: 700, walkTimeMinutes: 9 },
      { name: 'Anchorvale Community Club', type: 'amenities' as any, distanceMeters: 650, walkTimeMinutes: 8 }
    ],
    primarySchoolsWithin1Km: ['Nan Chiau Primary School', 'Compassvale Primary School', 'Springdale Primary School'],
    primarySchoolsWithin2Km: ['Sengkang Primary School', 'Anchor Green Primary School'],
    lifestyleScores: {
      overall: 90,
      affordability: 97,
      transport: 85,
      schools: 98,
      healthcare: 99,
      groceries: 89,
      amenities: 90,
      parks: 84
    },
    highlights: [
      'Exceptional value: 3-bedroom unit under S$1.3M in mature Sengkang precinct',
      'Within 1km of top-ranking Nan Chiau Primary School',
      'Direct covered link to Cheng Lim LRT and 4-min walk to Sengkang General Hospital'
    ],
    tradeoffs: [
      'North-East Line peak hour passenger volume',
      'Moderate 9-year property age from original launch'
    ],
    mapCoords: { x: 66, y: 32 }
  },
  {
    id: 'condo-seaside-siglap',
    name: 'Seaside Residences',
    tagline: 'Breathtaking sea-view residences beside Siglap MRT and East Coast Park',
    developer: 'Frasers Property & Sekisui House',
    district: 'D15 - Katong / Joo Chiat / Amber Road',
    planningArea: 'Marine Parade',
    region: 'RCR',
    address: '10 Siglap Link, Singapore 448875',
    askingPrice: 1890000,
    pricePerSqFt: 2420,
    floorAreaSqFt: 780,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2021,
    propertyAge: 5,
    isNewLaunch: false,
    totalUnits: 843,
    monthlyMaintenanceEst: 360,
    imageUrl: '/src/assets/images/hero_condo_waterfront_1791611664920.jpg',
    nearestMrt: {
      name: 'Siglap MRT (TE28)',
      line: 'Thomson-East Coast Line',
      distanceMeters: 240,
      walkTimeMinutes: 3
    },
    commuteTimeToCBDMinutes: 18,
    commuteTimeToOneNorthMinutes: 36,
    amenities: [
      { name: 'Siglap V & Siglap Centre (FairPrice Finest)', type: 'mall', distanceMeters: 750, walkTimeMinutes: 9 },
      { name: 'East Coast Park (Underpass Link)', type: 'park', distanceMeters: 200, walkTimeMinutes: 3 },
      { name: 'Laguna National Golf Resort Club', type: 'park', distanceMeters: 3500, walkTimeMinutes: 40 },
      { name: 'Parkway East Hospital', type: 'hospital', distanceMeters: 2400, walkTimeMinutes: 28 }
    ],
    primarySchoolsWithin1Km: ['Ngee Ann Primary School', 'Opera Estate Primary School'],
    primarySchoolsWithin2Km: ['Tao Nan School', 'St. Stephen’s School', 'Victoria School'],
    lifestyleScores: {
      overall: 93,
      affordability: 70,
      transport: 93,
      schools: 84,
      healthcare: 80,
      groceries: 90,
      amenities: 92,
      parks: 99
    },
    highlights: [
      'Unblocked sea orientation with dedicated direct underpass to East Coast Park beach',
      '3-minute walk to Siglap MRT on the Thomson-East Coast Line',
      'Vibrant Siglap café enclave and international dining options'
    ],
    tradeoffs: [
      'East Coast Parkway (ECP) highway noise exposure for outward expressway-facing stacks',
      'Tao Nan School is slightly beyond 1km boundary (> 1.4km)'
    ],
    mapCoords: { x: 79, y: 58 }
  },
  {
    id: 'condo-clavon-clementi',
    name: 'Clavon',
    tagline: 'Modern minimalist resort with lush sky gardens in education corridor',
    developer: 'UOL Group & Singapore Land Group',
    district: 'D05 - Buona Vista / West Coast / Clementi',
    planningArea: 'Clementi',
    region: 'OCR',
    address: '6 Clementi Avenue 1, Singapore 129961',
    askingPrice: 1680000,
    pricePerSqFt: 2190,
    floorAreaSqFt: 764,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2024,
    propertyAge: 2,
    isNewLaunch: false,
    totalUnits: 640,
    monthlyMaintenanceEst: 320,
    imageUrl: '/src/assets/images/condo_queenstown_highrise_1791611689564.jpg',
    nearestMrt: {
      name: 'Clementi MRT (EW23)',
      line: 'East-West Line',
      distanceMeters: 850,
      walkTimeMinutes: 10
    },
    commuteTimeToCBDMinutes: 22,
    commuteTimeToOneNorthMinutes: 10,
    amenities: [
      { name: 'Clementi Mall', type: 'mall', distanceMeters: 880, walkTimeMinutes: 11 },
      { name: 'West Coast Plaza', type: 'mall', distanceMeters: 1100, walkTimeMinutes: 14 },
      { name: 'National University Hospital (NUH)', type: 'hospital', distanceMeters: 2600, walkTimeMinutes: 30 },
      { name: 'West Coast Park', type: 'park', distanceMeters: 1400, walkTimeMinutes: 17 }
    ],
    primarySchoolsWithin1Km: ['Nan Hua Primary School', 'Pei Tong Primary School', 'Clementi Primary School'],
    primarySchoolsWithin2Km: ['Qifa Primary School'],
    lifestyleScores: {
      overall: 92,
      affordability: 78,
      transport: 82,
      schools: 98,
      healthcare: 89,
      groceries: 88,
      amenities: 89,
      parks: 86
    },
    highlights: [
      'Coveted 1km radius to elite Nan Hua Primary School',
      'Only 10 minutes drive or short bus to One-North and NUS innovation hub',
      'Award-winning architectural landscaping and 50m infinity lap pool'
    ],
    tradeoffs: [
      '10-minute walk to Clementi MRT (feeder bus recommended during hot days)',
      'Dense school traffic along Clementi Ave 1 during morning drop-off hours'
    ],
    mapCoords: { x: 32, y: 58 }
  },
  {
    id: 'condo-margaret-ville',
    name: 'Margaret Ville',
    tagline: 'Intimate boutique high-rise in Queenstown with immediate MRT access',
    developer: 'MCL Land',
    district: 'D03 - Queenstown / Alexandra',
    planningArea: 'Queenstown',
    region: 'RCR',
    address: '20 Margaret Drive, Singapore 149298',
    askingPrice: 1580000,
    pricePerSqFt: 2250,
    floorAreaSqFt: 700,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2021,
    propertyAge: 5,
    isNewLaunch: false,
    totalUnits: 309,
    monthlyMaintenanceEst: 350,
    imageUrl: '/src/assets/images/condo_queenstown_highrise_1791611689564.jpg',
    nearestMrt: {
      name: 'Queenstown MRT (EW19)',
      line: 'East-West Line',
      distanceMeters: 450,
      walkTimeMinutes: 6
    },
    commuteTimeToCBDMinutes: 15,
    commuteTimeToOneNorthMinutes: 11,
    amenities: [
      { name: 'Margaret Drive Hawker Centre', type: 'mall', distanceMeters: 180, walkTimeMinutes: 2 },
      { name: 'Queenstown Public Library', type: 'amenities' as any, distanceMeters: 250, walkTimeMinutes: 3 },
      { name: 'Queenstown Polyclinic', type: 'hospital', distanceMeters: 400, walkTimeMinutes: 5 },
      { name: 'Dawson Place Shopping Centre', type: 'mall', distanceMeters: 350, walkTimeMinutes: 4 }
    ],
    primarySchoolsWithin1Km: ['Queenstown Primary School'],
    primarySchoolsWithin2Km: ['New Town Primary School', 'Gan Eng Seng Primary School'],
    lifestyleScores: {
      overall: 91,
      affordability: 82,
      transport: 94,
      schools: 76,
      healthcare: 96,
      groceries: 94,
      amenities: 93,
      parks: 82
    },
    highlights: [
      'Compact total quantum (< S$1.6M) for prime city-fringe Queenstown 2-bedder',
      'Doorstep to modern Margaret Drive hawker centre, polyclinic, and library',
      'Fast 6-minute stroll to Queenstown MRT station'
    ],
    tradeoffs: [
      'Compact unit layouts optimize function over expansive living space',
      'Surrounded by modern BTO high-rise clusters'
    ],
    mapCoords: { x: 45, y: 62 }
  },
  {
    id: 'condo-sky-habitat-bishan',
    name: 'Sky Habitat',
    tagline: 'Moshe Safdie designed landmark with stepping terraces in Bishan Central',
    developer: 'CapitaLand',
    district: 'D20 - Ang Mo Kio / Bishan / Thomson',
    planningArea: 'Bishan',
    region: 'RCR',
    address: '9 Bishan Street 15, Singapore 573909',
    askingPrice: 1950000,
    pricePerSqFt: 2200,
    floorAreaSqFt: 883,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2015,
    propertyAge: 11,
    isNewLaunch: false,
    totalUnits: 509,
    monthlyMaintenanceEst: 390,
    imageUrl: '/src/assets/images/condo_bukittimah_luxury_1791611698980.jpg',
    nearestMrt: {
      name: 'Bishan MRT (NS17/CC15)',
      line: 'North-South & Circle Line',
      distanceMeters: 400,
      walkTimeMinutes: 5
    },
    commuteTimeToCBDMinutes: 18,
    commuteTimeToOneNorthMinutes: 16,
    amenities: [
      { name: 'Junction 8 Shopping Mall', type: 'mall', distanceMeters: 420, walkTimeMinutes: 5 },
      { name: 'Bishan-Ang Mo Kio Park', type: 'park', distanceMeters: 800, walkTimeMinutes: 10 },
      { name: 'Bishan Stadium & Sports Hall', type: 'park', distanceMeters: 250, walkTimeMinutes: 3 },
      { name: 'Bishan Public Library', type: 'amenities' as any, distanceMeters: 380, walkTimeMinutes: 5 }
    ],
    primarySchoolsWithin1Km: ['Catholic High School (Primary)', 'Kuo Chuan Presbyterian Primary School'],
    primarySchoolsWithin2Km: ['Ai Tong School', 'Teck Ghee Primary School'],
    lifestyleScores: {
      overall: 95,
      affordability: 70,
      transport: 97,
      schools: 99,
      healthcare: 88,
      groceries: 98,
      amenities: 98,
      parks: 94
    },
    highlights: [
      'Prime Bishan interchange: direct connection on both North-South & Circle Lines',
      'Dual premier primary schools: Catholic High & Kuo Chuan Presbyterian within 1km',
      'Iconic architectural profile with 3 connecting sky bridges and rooftop infinity pool'
    ],
    tradeoffs: [
      'Older lease start date (TOP 2015)',
      'Stepped balconies reduce internal net living area'
    ],
    mapCoords: { x: 55, y: 42 }
  },
  {
    id: 'condo-riverfront-hougang',
    name: 'Riverfront Residences',
    tagline: 'Sungei Serangoon riverfront living with extensive family facilities',
    developer: 'Oxley-Lian Beng Venture',
    district: 'D19 - Hougang / Punggol / Sengkang',
    planningArea: 'Hougang',
    region: 'OCR',
    address: '47 Hougang Avenue 7, Singapore 538804',
    askingPrice: 1320000,
    pricePerSqFt: 1510,
    floorAreaSqFt: 872,
    bedrooms: 3,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2024,
    propertyAge: 2,
    isNewLaunch: false,
    totalUnits: 1472,
    monthlyMaintenanceEst: 270,
    imageUrl: '/src/assets/images/condo_tampines_green_1791611677854.jpg',
    nearestMrt: {
      name: 'Hougang MRT (NE14/CR8 Cross Island Line)',
      line: 'North-East & Future CRL',
      distanceMeters: 800,
      walkTimeMinutes: 10
    },
    commuteTimeToCBDMinutes: 26,
    commuteTimeToOneNorthMinutes: 38,
    amenities: [
      { name: 'Hougang Mall', type: 'mall', distanceMeters: 850, walkTimeMinutes: 11 },
      { name: 'Serangoon Park Connector', type: 'park', distanceMeters: 50, walkTimeMinutes: 1 },
      { name: 'Punggol Park', type: 'park', distanceMeters: 500, walkTimeMinutes: 6 },
      { name: 'Sengkang General Hospital', type: 'hospital', distanceMeters: 2800, walkTimeMinutes: 32 }
    ],
    primarySchoolsWithin1Km: ['Holy Innocents’ Primary School', 'CHJ Our Lady of the Nativity'],
    primarySchoolsWithin2Km: ['Punggol Primary School', 'Montfort Junior School'],
    lifestyleScores: {
      overall: 89,
      affordability: 96,
      transport: 81,
      schools: 94,
      healthcare: 82,
      groceries: 88,
      amenities: 87,
      parks: 96
    },
    highlights: [
      'Exceptional value for 3-bedroom unit under S$1.35M',
      'Within 1km of reputable Holy Innocents’ Primary and CHIJ Nativity',
      'Front row access to Sungei Serangoon park connector and upcoming Cross Island Line hub'
    ],
    tradeoffs: [
      '10-minute walk to Hougang MRT (shuttle bus service operates to station)',
      'High total unit count (1,472 units)'
    ],
    mapCoords: { x: 67, y: 39 }
  },
  {
    id: 'condo-fourth-avenue',
    name: 'Fourth Avenue Residences',
    tagline: 'Quiet luxury in prestigious Bukit Timah with direct Sixth Avenue MRT link',
    developer: 'Allgreen Properties',
    district: 'D10 - Tanglin / Holland / Bukit Timah',
    planningArea: 'Bukit Timah',
    region: 'CCR',
    address: '188 Fourth Avenue, Singapore 266668',
    askingPrice: 2180000,
    pricePerSqFt: 2890,
    floorAreaSqFt: 753,
    bedrooms: 2,
    bathrooms: 2,
    tenure: '99-year Leasehold',
    topYear: 2022,
    propertyAge: 4,
    isNewLaunch: false,
    totalUnits: 476,
    monthlyMaintenanceEst: 410,
    imageUrl: '/src/assets/images/condo_bukittimah_luxury_1791611698980.jpg',
    nearestMrt: {
      name: 'Sixth Avenue MRT (DT7)',
      line: 'Downtown Line',
      distanceMeters: 100,
      walkTimeMinutes: 1
    },
    commuteTimeToCBDMinutes: 16,
    commuteTimeToOneNorthMinutes: 14,
    amenities: [
      { name: 'Guthrie House (Cold Storage Supermarket)', type: 'mall', distanceMeters: 150, walkTimeMinutes: 2 },
      { name: 'Sixth Avenue Bistro Enclave', type: 'amenities' as any, distanceMeters: 200, walkTimeMinutes: 3 },
      { name: 'Bukit Timah Nature Reserve', type: 'park', distanceMeters: 2200, walkTimeMinutes: 26 },
      { name: 'Gleneagles Hospital', type: 'hospital', distanceMeters: 3900, walkTimeMinutes: 42 }
    ],
    primarySchoolsWithin1Km: ['Raffles Girls’ Primary School'],
    primarySchoolsWithin2Km: ['Nanyang Primary School', 'Henry Park Primary School', 'Methodist Girls’ School'],
    lifestyleScores: {
      overall: 94,
      affordability: 62,
      transport: 98,
      schools: 99,
      healthcare: 82,
      groceries: 92,
      amenities: 93,
      parks: 90
    },
    highlights: [
      'Unsurpassed 1-minute doorstep sheltered connection to Sixth Avenue MRT',
      'Within 1km priority zone of Raffles Girls’ Primary School (RGPS)',
      'Prestigious District 10 address surrounded by Good Class Bungalow (GCB) enclaves'
    ],
    tradeoffs: [
      'Premium CCR entry quantum (> S$2.1M for 2 bedrooms)',
      'Higher monthly MCST fees'
    ],
    mapCoords: { x: 44, y: 52 }
  }
];

export const SINGAPORE_PLANNING_AREAS = [
  'All Areas',
  'Tampines',
  'Queenstown',
  'Bukit Timah',
  'Bishan',
  'Clementi',
  'Punggol',
  'Sengkang',
  'Jurong East',
  'Marine Parade',
  'Hougang'
];
