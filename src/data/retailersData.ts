import { Retailer } from '../types/retailer';

export const mockRetailers: Retailer[] = [
  {
    id: '1',
    name: 'Green Valley Agricultural Store',
    address: 'Main Road, Sector 12, Delhi',
    latitude: 28.7041,
    longitude: 77.1025,
    phone: '+91 98765 43210',
    email: 'greenvalley@agriculture.com',
    category: 'fertilizers',
    rating: 4.5,
    reviews: 156,
    openHours: '9:00 AM - 7:00 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'Government certified dealer for fertilizers and organic nutrients',
    products: [
      {
        id: 'f1',
        name: 'NPK 12:32:16',
        category: 'Fertilizer',
        price: 1200,
        subsidyPrice: 840,
        subsidyPercentage: 30,
        inStock: true,
        description: 'Complete fertilizer for all crops'
      },
      {
        id: 'f2',
        name: 'Urea (50kg bag)',
        category: 'Fertilizer',
        price: 800,
        subsidyPrice: 560,
        subsidyPercentage: 30,
        inStock: true,
        description: 'High quality urea fertilizer'
      }
    ]
  },
  {
    id: '2',
    name: 'Modern Pest Control Center',
    address: 'Agricultural Market, Gurgaon',
    latitude: 28.4595,
    longitude: 77.0266,
    phone: '+91 98765 43211',
    category: 'pesticides',
    rating: 4.2,
    reviews: 89,
    openHours: '8:30 AM - 6:30 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'Specialized in organic and chemical pesticides with government subsidy',
    products: [
      {
        id: 'p1',
        name: 'Chlorpyrifos 20% EC',
        category: 'Pesticide',
        price: 450,
        subsidyPrice: 315,
        subsidyPercentage: 30,
        inStock: true,
        description: 'Effective insecticide for soil and foliar application'
      },
      {
        id: 'p2',
        name: 'Neem Oil (1L)',
        category: 'Organic Pesticide',
        price: 300,
        subsidyPrice: 210,
        subsidyPercentage: 30,
        inStock: true,
        description: 'Natural pest control solution'
      }
    ]
  },
  {
    id: '3',
    name: 'Krishi Sewa Kendra',
    address: 'Block C, Noida Agricultural Hub',
    latitude: 28.5355,
    longitude: 77.3910,
    phone: '+91 98765 43212',
    category: 'general',
    rating: 4.7,
    reviews: 234,
    openHours: '8:00 AM - 8:00 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'One-stop solution for all agricultural needs with maximum government subsidies',
    products: [
      {
        id: 'g1',
        name: 'Hybrid Rice Seeds',
        category: 'Seeds',
        price: 2500,
        subsidyPrice: 1750,
        subsidyPercentage: 30,
        inStock: true,
        description: 'High yield hybrid rice variety'
      },
      {
        id: 'g2',
        name: 'Drip Irrigation Kit',
        category: 'Equipment',
        price: 15000,
        subsidyPrice: 7500,
        subsidyPercentage: 50,
        inStock: true,
        description: 'Complete drip irrigation system for 1 acre'
      }
    ]
  },
  {
    id: '4',
    name: 'Bharti Fertilizer Depot',
    address: 'NH-8, Manesar Industrial Area',
    latitude: 28.3670,
    longitude: 76.9570,
    phone: '+91 98765 43213',
    category: 'fertilizers',
    rating: 4.0,
    reviews: 67,
    openHours: '9:30 AM - 6:00 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'Authorized dealer for government subsidized fertilizers',
    products: [
      {
        id: 'f3',
        name: 'DAP (50kg bag)',
        category: 'Fertilizer',
        price: 1400,
        subsidyPrice: 980,
        subsidyPercentage: 30,
        inStock: true,
        description: 'Di-ammonium phosphate fertilizer'
      }
    ]
  },
  {
    id: '5',
    name: 'AgriTech Solutions',
    address: 'Faridabad Agricultural Complex',
    latitude: 28.4089,
    longitude: 77.3178,
    phone: '+91 98765 43214',
    category: 'equipment',
    rating: 4.3,
    reviews: 92,
    openHours: '10:00 AM - 7:00 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'Modern agricultural equipment with government financing options',
    products: [
      {
        id: 'e1',
        name: 'Power Tiller',
        category: 'Equipment',
        price: 85000,
        subsidyPrice: 51000,
        subsidyPercentage: 40,
        inStock: true,
        description: '8HP power tiller for small farms'
      }
    ]
  },
  {
    id: '6',
    name: 'Organic Farm Store',
    address: 'Green Park Extension, Delhi',
    latitude: 28.5694,
    longitude: 77.2069,
    phone: '+91 98765 43215',
    category: 'pesticides',
    rating: 4.6,
    reviews: 178,
    openHours: '9:00 AM - 6:00 PM',
    isGovernmentCertified: true,
    subsidyAvailable: true,
    description: 'Specialized in organic farming solutions with eco-friendly products',
    products: [
      {
        id: 'o1',
        name: 'Bio-Pesticide Spray',
        category: 'Organic Pesticide',
        price: 500,
        subsidyPrice: 350,
        subsidyPercentage: 30,
        inStock: true,
        description: 'Environment-friendly pest control'
      }
    ]
  }
];