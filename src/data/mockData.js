// Mock data for demonstration - replace with real API calls
export const mockExpenses = [
  { id: '1', date: '2024-01-15', category: 'Seeds & Planting', description: 'Corn seeds', amount: 250, notes: 'High-yield variety' },
  { id: '2', date: '2024-01-16', category: 'Fertilizers', description: 'NPK fertilizer', amount: 180, notes: '50kg bags' },
  { id: '3', date: '2024-01-18', category: 'Labor', description: 'Planting crew', amount: 400, notes: '8 hours work' },
  { id: '4', date: '2024-01-20', category: 'Equipment', description: 'Tractor fuel', amount: 75, notes: 'Diesel' },
  { id: '5', date: '2024-01-22', category: 'Pesticides', description: 'Herbicide spray', amount: 120, notes: 'Weed control' }
];

export const mockWeatherData = {
  location: 'Farm Location, State',
  current: {
    temperature: 24,
    humidity: 65,
    windSpeed: 12,
    condition: 'Partly Cloudy',
    icon: 'partly-cloudy'
  },
  forecast: [
    { date: '2024-01-25', high: 26, low: 18, condition: 'Sunny', icon: 'sun', precipitation: 0 },
    { date: '2024-01-26', high: 23, low: 16, condition: 'Cloudy', icon: 'cloud', precipitation: 20 },
    { date: '2024-01-27', high: 21, low: 14, condition: 'Rain', icon: 'cloud-rain', precipitation: 80 },
    { date: '2024-01-28', high: 25, low: 17, condition: 'Sunny', icon: 'sun', precipitation: 5 }
  ],
  alerts: [
    {
      type: 'warning',
      title: 'Rain Expected',
      description: 'Heavy rainfall expected tomorrow. Consider postponing outdoor activities.',
      severity: 'medium'
    }
  ]
};

export const mockIrrigationSchedule = [
  { id: '1', cropArea: 'North Field - Corn', nextWatering: '2024-01-26', waterAmount: 150, soilMoisture: 45, lastWatered: '2024-01-23', status: 'scheduled' },
  { id: '2', cropArea: 'South Field - Soybeans', nextWatering: '2024-01-25', waterAmount: 120, soilMoisture: 35, lastWatered: '2024-01-22', status: 'overdue' },
  { id: '3', cropArea: 'East Field - Wheat', nextWatering: '2024-01-27', waterAmount: 100, soilMoisture: 55, lastWatered: '2024-01-24', status: 'completed' }
];

export const mockPlantingRecommendations = [
  {
    id: '1',
    crop: 'Summer Corn',
    plantingWindow: { start: '2024-03-15', end: '2024-04-30' },
    expectedHarvest: '2024-08-15',
    soilRequirements: 'Well-drained, pH 6.0-7.0',
    expectedYield: 180,
    profitability: 'high'
  },
  {
    id: '2',
    crop: 'Soybeans',
    plantingWindow: { start: '2024-04-01', end: '2024-05-15' },
    expectedHarvest: '2024-09-30',
    soilRequirements: 'Fertile loam, pH 6.0-7.0',
    expectedYield: 50,
    profitability: 'medium'
  }
];

export const expenseCategories = [
  'Seeds & Planting',
  'Fertilizers',
  'Pesticides',
  'Labor',
  'Equipment',
  'Fuel',
  'Maintenance',
  'Utilities',
  'Insurance',
  'Other'
];