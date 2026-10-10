export interface MapAmenity {
  id: string;
  name: string;
  type: 'mrt' | 'school' | 'hospital' | 'mall' | 'business';
  district: string;
  x: number; // 0 to 100 on map
  y: number; // 0 to 100 on map
  details: string;
  badge?: string;
}

export const MAP_AMENITIES: MapAmenity[] = [
  // MRT Stations
  { id: 'mrt-raffles', name: 'Raffles Place MRT (EW14/NS26)', type: 'mrt', district: 'D01', x: 50, y: 70, details: 'Prime Financial District Interchange', badge: 'CBD' },
  { id: 'mrt-queenstown', name: 'Queenstown MRT (EW19)', type: 'mrt', district: 'D03', x: 44, y: 64, details: 'East-West Line city fringe station' },
  { id: 'mrt-tampines', name: 'Tampines MRT (EW2/DT32)', type: 'mrt', district: 'D18', x: 84, y: 44, details: 'East Hub Interchange (EW & Downtown)' },
  { id: 'mrt-simei', name: 'Simei MRT (EW3)', type: 'mrt', district: 'D18', x: 86, y: 48, details: 'East-West Line direct connection' },
  { id: 'mrt-clementi', name: 'Clementi MRT (EW23)', type: 'mrt', district: 'D05', x: 33, y: 56, details: 'West corridor hub station' },
  { id: 'mrt-jurong-east', name: 'Jurong East MRT (EW24/NS1)', type: 'mrt', district: 'D22', x: 26, y: 52, details: 'Jurong Lake District Interchange' },
  { id: 'mrt-bishan', name: 'Bishan MRT (NS17/CC15)', type: 'mrt', district: 'D20', x: 55, y: 42, details: 'North-South & Circle Line Interchange' },
  { id: 'mrt-marymount', name: 'Marymount MRT (CC16)', type: 'mrt', district: 'D20', x: 52, y: 44, details: 'Circle Line station near Shunfu' },
  { id: 'mrt-beauty-world', name: 'Beauty World MRT (DT5)', type: 'mrt', district: 'D21', x: 38, y: 44, details: 'Downtown Line station & Integrated Hub' },
  { id: 'mrt-king-albert', name: 'King Albert Park MRT (DT6)', type: 'mrt', district: 'D21', x: 41, y: 46, details: 'Downtown Line near Rifle Range' },
  { id: 'mrt-tanjong-katong', name: 'Tanjong Katong MRT (TE25)', type: 'mrt', district: 'D15', x: 74, y: 62, details: 'TEL direct to Shenton Way & Marina Bay' },
  { id: 'mrt-siglap', name: 'Siglap MRT (TE28)', type: 'mrt', district: 'D15', x: 79, y: 58, details: 'TEL East Coast station' },
  { id: 'mrt-punggol', name: 'Punggol MRT (NE17/CP4)', type: 'mrt', district: 'D19', x: 71, y: 26, details: 'North-East Line & Future CRL Interchange' },
  { id: 'mrt-sengkang', name: 'Sengkang MRT (NE16)', type: 'mrt', district: 'D19', x: 67, y: 32, details: 'North-East Line town center hub' },
  { id: 'mrt-sixth-ave', name: 'Sixth Avenue MRT (DT7)', type: 'mrt', district: 'D10', x: 44, y: 52, details: 'Downtown Line Prime D10' },

  // Renowned Primary Schools
  { id: 'sch-nanhua', name: 'Nan Hua Primary School', type: 'school', district: 'D05', x: 33, y: 55, details: 'Top SAP Primary School in Clementi' },
  { id: 'sch-taonan', name: 'Tao Nan School', type: 'school', district: 'D15', x: 75, y: 60, details: 'Premier SAP school in Marine Parade' },
  { id: 'sch-peihwa', name: 'Pei Hwa Presbyterian Primary', type: 'school', district: 'D21', x: 39, y: 43, details: 'Popular SAP school in Bukit Timah' },
  { id: 'sch-catholic-high', name: 'Catholic High School (Primary)', type: 'school', district: 'D20', x: 53, y: 43, details: 'Renowned SAP boy school in Bishan' },
  { id: 'sch-rgps', name: 'Raffles Girls’ Primary School', type: 'school', district: 'D10', x: 45, y: 51, details: 'Prestigious primary school in Bukit Timah' },
  { id: 'sch-mgs', name: 'Methodist Girls’ School (Primary)', type: 'school', district: 'D21', x: 41, y: 47, details: 'Established girls primary school' },
  { id: 'sch-sthilda', name: 'St. Hilda’s Primary School', type: 'school', district: 'D18', x: 83, y: 42, details: 'Sought-after primary school in Tampines' },
  { id: 'sch-nanchiau', name: 'Nan Chiau Primary School', type: 'school', district: 'D19', x: 66, y: 31, details: 'Popular SAP school in Sengkang' },

  // Hospitals & Polyclinics
  { id: 'hosp-sgh', name: 'Singapore General Hospital (SGH)', type: 'hospital', district: 'D03', x: 48, y: 68, details: 'National Tertiary Hospital & Medical Campus' },
  { id: 'hosp-nuh', name: 'National University Hospital (NUH)', type: 'hospital', district: 'D05', x: 37, y: 60, details: 'Major Academic Tertiary Medical Centre' },
  { id: 'hosp-cgh', name: 'Changi General Hospital (CGH)', type: 'hospital', district: 'D18', x: 87, y: 47, details: 'Regional Acute Hospital for East Singapore' },
  { id: 'hosp-skh', name: 'Sengkang General Hospital (SKH)', type: 'hospital', district: 'D19', x: 67, y: 32, details: 'Comprehensive Hospital Campus in North-East' },
  { id: 'hosp-ntfgh', name: 'Ng Teng Fong General Hospital', type: 'hospital', district: 'D22', x: 27, y: 53, details: 'Integrated Regional Hospital in Jurong East' },
  { id: 'hosp-ttsh', name: 'Tan Tock Seng Hospital (TTSH)', type: 'hospital', district: 'D11', x: 53, y: 50, details: 'Novena HealthCity Medical Hub' },

  // Shopping Malls & Supermarkets
  { id: 'mall-westgate', name: 'Westgate & JEM', type: 'mall', district: 'D22', x: 26, y: 51, details: 'Jurong East Mega Retail Cluster' },
  { id: 'mall-tampines-hub', name: 'Our Tampines Hub & Tampines Mall', type: 'mall', district: 'D18', x: 84, y: 43, details: 'East Singapore lifestyle & sports hub' },
  { id: 'mall-parkway', name: 'Parkway Parade', type: 'mall', district: 'D15', x: 75, y: 62, details: 'Iconic East Coast 7-storey mall' },
  { id: 'mall-junction8', name: 'Junction 8 Mall', type: 'mall', district: 'D20', x: 55, y: 43, details: 'Bishan Central Retail anchor' },
  { id: 'mall-waterway-point', name: 'Waterway Point', type: 'mall', district: 'D19', x: 71, y: 25, details: 'Waterfront Mega Mall in Punggol' },
  { id: 'mall-clementi', name: 'The Clementi Mall', type: 'mall', district: 'D05', x: 33, y: 56, details: 'Integrated Transit Mall in Clementi' },

  // Key Business Hubs
  { id: 'biz-cbd', name: 'Raffles Place / Marina Bay CBD', type: 'business', district: 'D01', x: 51, y: 71, details: 'Global Financial & Banking Epicentre', badge: 'Financial Core' },
  { id: 'biz-onenorth', name: 'One-North Innovation District', type: 'business', district: 'D05', x: 38, y: 60, details: 'Biopolis, Fusionopolis & Tech Hub', badge: 'Tech / R&D' },
  { id: 'biz-jld', name: 'Jurong Lake District (JLD)', type: 'business', district: 'D22', x: 25, y: 53, details: 'Singapore’s 2nd Central Business District', badge: 'Commercial' },
  { id: 'biz-changi', name: 'Changi Business Park', type: 'business', district: 'D18', x: 88, y: 49, details: 'Aviation, Fintech & Logistics Cluster', badge: 'Enterprise' }
];
