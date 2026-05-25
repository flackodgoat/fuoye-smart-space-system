// ── Private Outdoor ───────────────────────────────────────────────────────────
import deWiseOutdoor1 from '../assets/images/hostels/private/outdoor/dewise-selfcon-outdoor-1.jpg'
import peaceOutdoor1  from '../assets/images/hostels/private/outdoor/peace-apartment-outdoor-1.jpg'
import royalOutdoor1  from '../assets/images/hostels/private/outdoor/royal-hostel-outdoor-1.jpg'

// ── Private Indoor — room type images (shared across hostels where appropriate) ─
import oneroom1     from '../assets/images/hostels/private/indoor/oneroom-1.jpg'
import selfcon1     from '../assets/images/hostels/private/indoor/selfcon-1.jpg'
import selfcon2     from '../assets/images/hostels/private/indoor/selfcon-2.jpg'
import shared2bed1  from '../assets/images/hostels/private/indoor/shared2bed-1.jpg'
import shared2bed2  from '../assets/images/hostels/private/indoor/shared2bed-2.jpg'
import twobedFlat1  from '../assets/images/hostels/private/indoor/twobed-flat-1.jpg'
import twobedFlat2  from '../assets/images/hostels/private/indoor/twobed-flat-2.jpg'

export const privateHostels = [
  // ── VERIFIED PREMIUM ──────────────────────────────────────────────────────────
  {
    id: 'grace-court',
    slug: 'grace-court-lodge',
    code: 'GCL',
    name: 'Grace Court Lodge',
    category: 'private',
    gender: 'Female',
    featured: true,
    status: 'available',
    verified: true,

    address: 'Behind FUOYE Female Gate, Oye-Ekiti',
    location: 'Behind Female Gate',
    distanceFromCampus: '3 min walk',
    description:
      'Grace Court Lodge is the closest FUOYE-verified female private hostel to the campus gate. Offering self-contained and shared rooms, it features constant water supply via an industrial borehole, 24/7 CCTV, and a generator for uninterrupted power. A top pick for female students who want proximity and comfort.',
    shortDescription: 'FUOYE-verified female hostel 3 minutes from campus gate with self-contained rooms.',

    ownerName: 'Mrs. Folake Adeyemi',
    contactPhone: '08012345678',

    totalRooms: 30,
    occupiedRooms: 22,
    availableRooms: 8,
    occupancyRate: 73,

    amenities: [
      'Industrial Borehole', 'Generator Backup', '24/7 CCTV',
      'Tiled Rooms', 'POP Ceiling', 'Security Guard',
      'Parking Space', 'Waste Management',
    ],
    tags: ['Female Only', 'Verified', 'Near Gate', 'Self-Contained Available', 'Featured'],
    rules: [
      'No male visitors in rooms',
      'Generator off by 12:00 AM',
      'Quiet hours after 10:00 PM',
    ],
    rating: 4.6,
    reviewCount: 38,

    images: {
      thumbnail: deWiseOutdoor1,
      outdoor: [deWiseOutdoor1],
      indoor:  [selfcon1, selfcon2, shared2bed1, shared2bed2],
    },

    roomOptions: [
      {
        id: 'gcl-selfcon',
        type: 'Self-Contained (Single)',
        capacity: 1,
        totalRooms: 10,
        availableRooms: 3,
        pricePerBed: 80000,
        pricePeriod: 'per session',
        features: [
          'Private bathroom', 'Kitchen unit', 'Air conditioning',
          'Tiled floor', 'POP ceiling', 'Window burglary proof',
        ],
        images: [selfcon1, selfcon2],
        status: 'available',
      },
      {
        id: 'gcl-double',
        type: 'Double Room (Shared)',
        capacity: 2,
        totalRooms: 20,
        availableRooms: 5,
        pricePerBed: 40000,
        pricePeriod: 'per session',
        features: [
          'Shared bathroom (2 per room)', 'Wardrobe', 'Ceiling fan',
          'Tiled floor', 'Window',
        ],
        images: [shared2bed1, shared2bed2],
        status: 'available',
      },
    ],

    priceRange: { min: 40000, max: 80000 },
  },

  {
    id: 'premium-suites',
    slug: 'premium-suites-fuoye',
    code: 'PMS',
    name: 'Premium Suites',
    category: 'private',
    gender: 'Mixed',
    featured: true,
    status: 'available',
    verified: true,

    address: 'No. 12, University Road, Oye-Ekiti',
    location: 'University Road',
    distanceFromCampus: '5 min walk',
    description:
      'Premium Suites is the most modern private hostel in the FUOYE community, offering luxury self-contained apartments and double studios at a premium standard. Fully verified by FUOYE, it features 24/7 DSTV, generator-backed electricity, and a rooftop terrace for students who want a truly elevated living experience.',
    shortDescription: 'Luxury self-contained and studio apartments — the premium off-campus choice.',

    ownerName: 'Mr. Babatunde Olatunji',
    contactPhone: '08098765432',

    totalRooms: 20,
    occupiedRooms: 14,
    availableRooms: 6,
    occupancyRate: 70,

    amenities: [
      'Industrial Borehole', 'Generator (24/7)', 'DSTV Connection',
      'Wi-Fi Ready', 'Parking Space', 'CCTV Security',
      'Rooftop Terrace', 'Intercom System', 'POP Ceiling',
    ],
    tags: ['Mixed', 'Verified', 'Luxury', 'Self-Contained', 'Featured'],
    rules: [
      'No parties or loud gatherings',
      'Visitors must sign in at security',
      'Generator off by 1:00 AM',
    ],
    rating: 4.8,
    reviewCount: 21,

    images: {
      thumbnail: peaceOutdoor1,
      outdoor: [peaceOutdoor1],
      indoor:  [selfcon1, selfcon2, twobedFlat1, twobedFlat2],
    },

    roomOptions: [
      {
        id: 'pms-luxury-selfcon',
        type: 'Luxury Self-Contained',
        capacity: 1,
        totalRooms: 10,
        availableRooms: 3,
        pricePerBed: 120000,
        pricePeriod: 'per session',
        features: [
          'En-suite bathroom', 'Kitchen unit', 'Air conditioning',
          'DSTV point', 'POP ceiling', 'Tiled floor', 'Intercom',
        ],
        images: [selfcon1, selfcon2],
        status: 'available',
      },
      {
        id: 'pms-studio',
        type: 'Double Studio',
        capacity: 2,
        totalRooms: 10,
        availableRooms: 3,
        pricePerBed: 70000,
        pricePeriod: 'per session',
        features: [
          'Shared bathroom (en-suite)', 'Air conditioning', 'Wardrobe',
          'DSTV point', 'Tiled floor',
        ],
        images: [twobedFlat1, twobedFlat2],
        status: 'available',
      },
    ],

    priceRange: { min: 70000, max: 120000 },
  },

  // ── VERIFIED MID-RANGE ────────────────────────────────────────────────────────
  {
    id: 'scholars-yard',
    slug: 'scholars-yard',
    code: 'SCY',
    name: "Scholar's Yard",
    category: 'private',
    gender: 'Male',
    featured: false,
    status: 'available',
    verified: true,

    address: 'Aaye Road, Oye-Ekiti',
    location: 'Aaye Road',
    distanceFromCampus: '12 min walk',
    description:
      "Scholar's Yard is a FUOYE-verified male hostel offering clean, affordable accommodation with a study-focused environment. Equipped with a steady borehole supply and generator backup, it is a popular choice for male students in the Engineering and Science faculties.",
    shortDescription: 'Verified, study-focused male hostel with steady power and water supply.',

    ownerName: 'Mr. Emmanuel Adebayo',
    contactPhone: '08056781234',

    totalRooms: 40,
    occupiedRooms: 28,
    availableRooms: 12,
    occupancyRate: 70,

    amenities: [
      'Borehole Water', 'Generator Backup', 'Security Guard',
      'Study Lounge', 'Outdoor Seating', 'Waste Management',
    ],
    tags: ['Male Only', 'Verified', 'Study Environment', 'Budget Friendly'],
    rules: [
      'Quiet hours from 10:00 PM',
      'No cooking in rooms',
      'Generator off by 11:00 PM',
    ],
    rating: 4.2,
    reviewCount: 54,

    images: {
      thumbnail: royalOutdoor1,
      outdoor: [royalOutdoor1],
      indoor:  [shared2bed1, shared2bed2, twobedFlat1, oneroom1],
    },

    roomOptions: [
      {
        id: 'scy-2bed',
        type: '2-Bed Room',
        capacity: 2,
        totalRooms: 24,
        availableRooms: 8,
        pricePerBed: 25000,
        pricePeriod: 'per session',
        features: [
          'Shared bathroom (2 per floor)', 'Wardrobe per person',
          'Study desk', 'Ceiling fan', 'Window',
        ],
        images: [shared2bed1, shared2bed2],
        status: 'available',
      },
      {
        id: 'scy-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 16,
        availableRooms: 4,
        pricePerBed: 18000,
        pricePeriod: 'per session',
        features: [
          'Shared bathroom (2 per floor)', 'Wardrobe', 'Study desk', 'Ceiling fan',
        ],
        images: [twobedFlat1, oneroom1],
        status: 'available',
      },
    ],

    priceRange: { min: 18000, max: 25000 },
  },

  // ── UNVERIFIED BUDGET ─────────────────────────────────────────────────────────
  {
    id: 'unity-lodge',
    slug: 'unity-lodge',
    code: 'UNL',
    name: 'Unity Lodge',
    category: 'private',
    gender: 'Mixed',
    featured: false,
    status: 'limited',
    verified: false,

    address: 'Igbara-Odo Road, Oye-Ekiti',
    location: 'Igbara-Odo Road',
    distanceFromCampus: '20 min walk',
    description:
      'Unity Lodge is an affordable mixed hostel located a short commute from the FUOYE main campus. It offers basic but clean accommodation for budget-conscious students. Note: this hostel has not yet been formally verified by FUOYE.',
    shortDescription: 'Affordable mixed hostel — budget option for students on a tight budget.',

    ownerName: 'Mr. Yusuf Ibrahim',
    contactPhone: '07032109876',

    totalRooms: 50,
    occupiedRooms: 46,
    availableRooms: 4,
    occupancyRate: 92,

    amenities: [
      'Borehole Water', 'Security Guard', 'Outdoor Parking',
    ],
    tags: ['Mixed', 'Budget Friendly', 'Unverified'],
    rules: [
      'Quiet hours after 10:00 PM',
      'No cooking except in kitchen area',
    ],
    rating: 3.4,
    reviewCount: 17,

    images: {
      thumbnail: deWiseOutdoor1,
      outdoor: [deWiseOutdoor1],
      indoor:  [oneroom1, shared2bed2],
    },

    roomOptions: [
      {
        id: 'unl-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 50,
        availableRooms: 4,
        pricePerBed: 12000,
        pricePeriod: 'per session',
        features: [
          'Shared bathroom (per floor)', 'Wardrobe', 'Ceiling fan',
        ],
        images: [oneroom1, shared2bed2],
        status: 'available',
      },
    ],

    priceRange: { min: 12000, max: 12000 },
  },
]

export const privateHostelStats = {
  total:      privateHostels.length,
  available:  privateHostels.filter((h) => h.status === 'available').length,
  limited:    privateHostels.filter((h) => h.status === 'limited').length,
  full:       privateHostels.filter((h) => h.status === 'full').length,
  verified:   privateHostels.filter((h) => h.verified).length,
  unverified: privateHostels.filter((h) => !h.verified).length,
}
