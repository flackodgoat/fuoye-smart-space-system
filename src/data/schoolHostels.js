// ── School Outdoor ────────────────────────────────────────────────────────────
import moremiOutdoor1  from '../assets/images/hostels/school/outdoor/moremi-outdoor-1.jpg'
import moremiOutdoor2  from '../assets/images/hostels/school/outdoor/moremi-outdoor-2.jpg'
import blockAOutdoor1  from '../assets/images/hostels/school/outdoor/blocka-outdoor-1.jpg'
import fajuyiOutdoor1  from '../assets/images/hostels/school/outdoor/fajuyi-outdoor-1.jpg'
import mandelaOutdoor1 from '../assets/images/hostels/school/outdoor/mandela-outdoor-1.jpg'

// ── School Indoor — Room type images (shared across hostels where appropriate) ─
import bed2_1  from '../assets/images/hostels/school/indoor/2bed-1.jpg'
import bed2_2  from '../assets/images/hostels/school/indoor/2bed-2.jpg'
import bed2_3  from '../assets/images/hostels/school/indoor/2bed-3.jpg'
import bed2_4  from '../assets/images/hostels/school/indoor/2bed-4.jpg'
import bed3_1  from '../assets/images/hostels/school/indoor/3bed-1.jpg'
import bed3_2  from '../assets/images/hostels/school/indoor/3bed-2.jpg'
import bed6_1  from '../assets/images/hostels/school/indoor/6bed-1.jpg'
import bed6_2  from '../assets/images/hostels/school/indoor/6bed-2.jpg'
import bed6_3  from '../assets/images/hostels/school/indoor/6bed-3.jpg'
import bed6_4  from '../assets/images/hostels/school/indoor/6bed-4.jpg'
import bed11_1 from '../assets/images/hostels/school/indoor/11bed-1.jpg'
import bed11_2 from '../assets/images/hostels/school/indoor/11bed-2.jpg'
import bed11_3 from '../assets/images/hostels/school/indoor/11bed-3.jpg'
import bed20_1 from '../assets/images/hostels/school/indoor/20bed-1.jpg'

export const schoolHostels = [
  // ── FEMALE HOSTELS ──────────────────────────────────────────────────────────
  {
    id: 'moremi',
    slug: 'moremi-hall',
    code: 'MOR',
    name: 'Moremi Hall',
    category: 'school',
    gender: 'Female',
    featured: true,
    status: 'available',

    location: 'Female Hostel Zone, South Campus',
    distanceFromGate: '5 min walk',
    description:
      'One of the oldest and most prestigious female hostels at FUOYE. Moremi Hall offers a secure, well-maintained living environment with reliable borehole water supply and solar-backed power, making it a top choice for female students across all faculties.',
    shortDescription: 'Prestigious female hostel with solar power and 24/7 security.',

    totalRooms: 120,
    occupiedRooms: 99,
    availableRooms: 21,
    occupancyRate: 83,

    amenities: [
      'Borehole Water', 'Solar Power', '24/7 Security',
      'Common Room', 'Laundry Area', 'Cleaners',
    ],
    tags: ['Female Only', 'Solar Powered', 'On Campus', 'Featured'],

    images: {
      thumbnail: moremiOutdoor1,
      outdoor: [moremiOutdoor1, moremiOutdoor2],
      indoor:  [bed3_1, bed3_2, bed2_1, bed2_2],
    },

    roomOptions: [
      {
        id: 'mor-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 80,
        availableRooms: 14,
        pricePerBed: 15000,
        pricePeriod: 'per session',
        features: ['Wardrobe per bed', 'Study desk', 'Ceiling fan', 'Window access'],
        images: [bed3_1, bed3_2],
        status: 'available',
      },
      {
        id: 'mor-2bed',
        type: '2-Bed Room',
        capacity: 2,
        totalRooms: 40,
        availableRooms: 7,
        pricePerBed: 22000,
        pricePeriod: 'per session',
        features: ['Private wardrobe', 'Study desk', 'Ceiling fan', 'More privacy'],
        images: [bed2_1, bed2_2],
        status: 'available',
      },
    ],

    priceRange: { min: 15000, max: 22000 },
  },

  {
    id: 'queens',
    slug: 'queens-hall',
    code: 'QUE',
    name: "Queen's Hall",
    category: 'school',
    gender: 'Female',
    featured: false,
    status: 'available',

    location: 'Female Hostel Zone, South Campus',
    distanceFromGate: '7 min walk',
    description:
      "Queen's Hall is a spacious female hostel known for its vibrant community atmosphere and reliable NEPA power supply. Conveniently located near the female gate, it is one of the most accessible hostels on campus.",
    shortDescription: 'Spacious and well-connected female hostel near the female gate.',

    totalRooms: 96,
    occupiedRooms: 72,
    availableRooms: 24,
    occupancyRate: 75,

    amenities: [
      'Borehole Water', 'NEPA Supply', '24/7 Security', 'Common Room',
    ],
    tags: ['Female Only', 'On Campus'],

    images: {
      thumbnail: blockAOutdoor1,
      outdoor: [blockAOutdoor1],
      indoor:  [bed6_1, bed6_2, bed2_3, bed2_4],
    },

    roomOptions: [
      {
        id: 'que-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 64,
        availableRooms: 18,
        pricePerBed: 14000,
        pricePeriod: 'per session',
        features: ['Wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed6_1, bed6_2],
        status: 'available',
      },
      {
        id: 'que-2bed',
        type: '2-Bed Room',
        capacity: 2,
        totalRooms: 32,
        availableRooms: 6,
        pricePerBed: 20000,
        pricePeriod: 'per session',
        features: ['Wardrobe', 'Study desk', 'Ceiling fan', 'Semi-private'],
        images: [bed2_3, bed2_4],
        status: 'available',
      },
    ],

    priceRange: { min: 14000, max: 20000 },
  },

  {
    id: 'block-c',
    slug: 'block-c-hostel',
    code: 'BLC',
    name: 'Block C Hostel',
    category: 'school',
    gender: 'Female',
    featured: false,
    status: 'full',

    location: 'Female Hostel Zone, South Campus',
    distanceFromGate: '6 min walk',
    description:
      'Block C is a compact female hostel situated within the female hostel zone. Currently at full capacity for this session - check back for next session availability.',
    shortDescription: 'Compact female hostel - currently fully occupied.',

    totalRooms: 60,
    occupiedRooms: 60,
    availableRooms: 0,
    occupancyRate: 100,

    amenities: ['Borehole Water', '24/7 Security'],
    tags: ['Female Only', 'On Campus', 'Currently Full'],

    images: {
      thumbnail: blockAOutdoor1,
      outdoor: [blockAOutdoor1],
      indoor:  [bed20_1, bed11_1],
    },

    roomOptions: [
      {
        id: 'blc-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 60,
        availableRooms: 0,
        pricePerBed: 13000,
        pricePeriod: 'per session',
        features: ['Wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed20_1, bed11_1],
        status: 'full',
      },
    ],

    priceRange: { min: 13000, max: 13000 },
  },

  // ── MALE HOSTELS ─────────────────────────────────────────────────────────────
  {
    id: 'fajuyi',
    slug: 'fajuyi-hall',
    code: 'FAJ',
    name: 'Fajuyi Hall',
    category: 'school',
    gender: 'Male',
    featured: true,
    status: 'limited',

    location: 'Male Hostel Zone, North Campus',
    distanceFromGate: '8 min walk',
    description:
      'Fajuyi Hall is the premium male hostel at FUOYE, offering solar-powered electricity and a dedicated recreational area. With limited beds remaining this session, early booking is strongly advised.',
    shortDescription: 'Premium male hostel with solar power and recreational facilities.',

    totalRooms: 100,
    occupiedRooms: 88,
    availableRooms: 12,
    occupancyRate: 88,

    amenities: [
      'Borehole Water', 'Solar Power', '24/7 Security', 'Recreational Area',
    ],
    tags: ['Male Only', 'Solar Powered', 'On Campus', 'Limited Spaces', 'Featured'],

    images: {
      thumbnail: fajuyiOutdoor1,
      outdoor: [fajuyiOutdoor1],
      indoor:  [bed11_1, bed11_2, bed6_3, bed6_4],
    },

    roomOptions: [
      {
        id: 'faj-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 80,
        availableRooms: 10,
        pricePerBed: 13000,
        pricePeriod: 'per session',
        features: ['Wardrobe per bed', 'Study desk', 'Ceiling fan'],
        images: [bed11_1, bed11_2],
        status: 'available',
      },
      {
        id: 'faj-6bed',
        type: '6-Bed Room',
        capacity: 6,
        totalRooms: 20,
        availableRooms: 2,
        pricePerBed: 11000,
        pricePeriod: 'per session',
        features: ['Shared wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed6_3, bed6_4],
        status: 'available',
      },
    ],

    priceRange: { min: 11000, max: 13000 },
  },

  {
    id: 'mandela',
    slug: 'nelson-mandela-hall',
    code: 'MAN',
    name: 'Nelson Mandela Hall',
    category: 'school',
    gender: 'Male',
    featured: false,
    status: 'available',

    location: 'Male Hostel Zone, North Campus',
    distanceFromGate: '10 min walk',
    description:
      'Nelson Mandela Hall is the most affordable on-campus male accommodation option at FUOYE. It offers a no-frills but secure living environment, ideal for students prioritising proximity to campus facilities.',
    shortDescription: 'Affordable male hostel with the highest room availability on campus.',

    totalRooms: 80,
    occupiedRooms: 52,
    availableRooms: 28,
    occupancyRate: 65,

    amenities: ['Borehole Water', '24/7 Security', 'Common Room'],
    tags: ['Male Only', 'On Campus', 'Budget Friendly'],

    images: {
      thumbnail: mandelaOutdoor1,
      outdoor: [mandelaOutdoor1],
      indoor:  [bed11_2, bed11_3, bed6_1, bed6_2],
    },

    roomOptions: [
      {
        id: 'man-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 60,
        availableRooms: 22,
        pricePerBed: 13000,
        pricePeriod: 'per session',
        features: ['Wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed11_2, bed11_3],
        status: 'available',
      },
      {
        id: 'man-6bed',
        type: '6-Bed Room',
        capacity: 6,
        totalRooms: 20,
        availableRooms: 6,
        pricePerBed: 10000,
        pricePeriod: 'per session',
        features: ['Shared wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed6_1, bed6_2],
        status: 'available',
      },
    ],

    priceRange: { min: 10000, max: 13000 },
  },

  {
    id: 'block-d',
    slug: 'block-d-hostel',
    code: 'BLD',
    name: 'Block D Hostel',
    category: 'school',
    gender: 'Male',
    featured: false,
    status: 'full',

    location: 'Male Hostel Zone, North Campus',
    distanceFromGate: '9 min walk',
    description:
      'Block D is a standard male hostel in the North Campus hostel zone. Currently at full capacity — check back for the next academic session.',
    shortDescription: 'Standard male hostel - currently fully occupied.',

    totalRooms: 70,
    occupiedRooms: 70,
    availableRooms: 0,
    occupancyRate: 100,

    amenities: ['Borehole Water', '24/7 Security'],
    tags: ['Male Only', 'On Campus', 'Currently Full'],

    images: {
      thumbnail: blockAOutdoor1,
      outdoor: [blockAOutdoor1],
      indoor:  [bed6_3, bed11_3],
    },

    roomOptions: [
      {
        id: 'bld-4bed',
        type: '4-Bed Room',
        capacity: 4,
        totalRooms: 70,
        availableRooms: 0,
        pricePerBed: 12000,
        pricePeriod: 'per session',
        features: ['Wardrobe', 'Study desk', 'Ceiling fan'],
        images: [bed6_3, bed11_3],
        status: 'full',
      },
    ],

    priceRange: { min: 12000, max: 12000 },
  },
]

export const schoolHostelStats = {
  total:          schoolHostels.length,
  available:      schoolHostels.filter((h) => h.status === 'available').length,
  limited:        schoolHostels.filter((h) => h.status === 'limited').length,
  full:           schoolHostels.filter((h) => h.status === 'full').length,
  totalRooms:     schoolHostels.reduce((s, h) => s + h.totalRooms, 0),
  availableRooms: schoolHostels.reduce((s, h) => s + h.availableRooms, 0),
  femaleHostels:  schoolHostels.filter((h) => h.gender === 'Female').length,
  maleHostels:    schoolHostels.filter((h) => h.gender === 'Male').length,
}
