const express = require('express');
const { protect } = require('../middleware/auth');
const { validateCalculator } = require('../middleware/validation');

const router = express.Router();

// Carbon footprint calculation factors
const CARBON_FACTORS = {
  transportation: {
    'petrol-car': 0.192, // kg CO2 per km
    'diesel-car': 0.171,
    'hybrid-car': 0.120,
    'electric-car': 0.053,
    'bus': 0.089,
    'train': 0.041,
    'plane': 0.285,
    'motorcycle': 0.103,
    'bicycle': 0.016,
    'walking': 0
  },
  energy: {
    'electricity': 0.5, // kg CO2 per kWh
    'natural-gas': 0.202, // kg CO2 per kWh
    'heating-oil': 0.267,
    'propane': 0.214,
    'coal': 0.341
  },
  food: {
    'meat-daily': 2.5, // tons CO2 per year
    'meat-regular': 1.8,
    'vegetarian': 1.2,
    'vegan': 0.9,
    'pescatarian': 1.5
  },
  waste: {
    'low': 0.3, // tons CO2 per year
    'average': 0.6,
    'high': 1.0
  }
};

// @desc    Calculate carbon footprint
// @route   POST /api/calculator/footprint
// @access  Public
router.post('/footprint', validateCalculator, async (req, res) => {
  try {
    const { transportation, energy, food, waste } = req.body;

    let totalFootprint = 0;
    const breakdown = {};

    // Calculate transportation footprint
    if (transportation) {
      const { type, distance, daysPerWeek = 5, weeksPerYear = 52 } = transportation;
      const factor = CARBON_FACTORS.transportation[type] || 0.15;
      const annualDistance = distance * daysPerWeek * weeksPerYear;
      breakdown.transportation = (annualDistance * factor) / 1000; // Convert to tons
      totalFootprint += breakdown.transportation;
    }

    // Calculate energy footprint
    if (energy) {
      const { electricity, heating, heatingType = 'natural-gas' } = energy;
      const electricityFootprint = (electricity * CARBON_FACTORS.energy.electricity) / 1000;
      const heatingFootprint = (heating * CARBON_FACTORS.energy[heatingType]) / 1000;
      breakdown.energy = electricityFootprint + heatingFootprint;
      totalFootprint += breakdown.energy;
    }

    // Calculate food footprint
    if (food) {
      const { dietType = 'meat-regular' } = food;
      breakdown.food = CARBON_FACTORS.food[dietType] || 1.8;
      totalFootprint += breakdown.food;
    }

    // Calculate waste footprint
    if (waste) {
      const { level = 'average' } = waste;
      breakdown.waste = CARBON_FACTORS.waste[level] || 0.6;
      totalFootprint += breakdown.waste;
    }

    // Generate recommendations
    const recommendations = generateRecommendations(breakdown, totalFootprint);

    res.status(200).json({
      status: 'success',
      data: {
        totalFootprint: Math.round(totalFootprint * 10) / 10,
        breakdown,
        comparison: compareToAverage(totalFootprint),
        recommendations,
        treesNeeded: Math.ceil(totalFootprint * 18), // Approximate trees needed to offset
        equivalent: getEquivalent(totalFootprint)
      }
    });
  } catch (error) {
    console.error('Calculator error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while calculating footprint'
    });
  }
});

// @desc    Get carbon factors for frontend
// @route   GET /api/calculator/factors
// @access  Public
router.get('/factors', (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      factors: CARBON_FACTORS
    }
  });
});

// @desc    Get transportation options
// @route   GET /api/calculator/transportation
// @access  Public
router.get('/transportation', (req, res) => {
  const transportationOptions = [
    { value: 'petrol-car', label: 'Car (Petrol)', factor: CARBON_FACTORS.transportation['petrol-car'] },
    { value: 'diesel-car', label: 'Car (Diesel)', factor: CARBON_FACTORS.transportation['diesel-car'] },
    { value: 'hybrid-car', label: 'Car (Hybrid)', factor: CARBON_FACTORS.transportation['hybrid-car'] },
    { value: 'electric-car', label: 'Car (Electric)', factor: CARBON_FACTORS.transportation['electric-car'] },
    { value: 'bus', label: 'Bus', factor: CARBON_FACTORS.transportation['bus'] },
    { value: 'train', label: 'Train', factor: CARBON_FACTORS.transportation['train'] },
    { value: 'plane', label: 'Plane', factor: CARBON_FACTORS.transportation['plane'] },
    { value: 'motorcycle', label: 'Motorcycle', factor: CARBON_FACTORS.transportation['motorcycle'] },
    { value: 'bicycle', label: 'Bicycle', factor: CARBON_FACTORS.transportation['bicycle'] },
    { value: 'walking', label: 'Walking', factor: CARBON_FACTORS.transportation['walking'] }
  ];

  res.status(200).json({
    status: 'success',
    data: {
      options: transportationOptions
    }
  });
});

// @desc    Get diet options
// @route   GET /api/calculator/diet
// @access  Public
router.get('/diet', (req, res) => {
  const dietOptions = [
    { value: 'meat-daily', label: 'Meat Lover (Daily)', factor: CARBON_FACTORS.food['meat-daily'] },
    { value: 'meat-regular', label: 'Average (3-5 times weekly)', factor: CARBON_FACTORS.food['meat-regular'] },
    { value: 'vegetarian', label: 'Vegetarian', factor: CARBON_FACTORS.food['vegetarian'] },
    { value: 'vegan', label: 'Vegan', factor: CARBON_FACTORS.food['vegan'] },
    { value: 'pescatarian', label: 'Pescatarian', factor: CARBON_FACTORS.food['pescatarian'] }
  ];

  res.status(200).json({
    status: 'success',
    data: {
      options: dietOptions
    }
  });
});

// Helper functions
const generateRecommendations = (breakdown, total) => {
  const recommendations = [];

  // Transportation recommendations
  if (breakdown.transportation > 1.5) {
    recommendations.push({
      category: 'transportation',
      priority: 'high',
      title: 'Reduce Transportation Emissions',
      description: 'Consider using public transportation, carpooling, or cycling more often.',
      potentialSavings: '0.5-1.0 tons CO2/year'
    });
  }

  // Energy recommendations
  if (breakdown.energy > 2.0) {
    recommendations.push({
      category: 'energy',
      priority: 'high',
      title: 'Improve Energy Efficiency',
      description: 'Switch to LED bulbs, use energy-efficient appliances, and consider renewable energy.',
      potentialSavings: '0.3-0.8 tons CO2/year'
    });
  }

  // Food recommendations
  if (breakdown.food > 2.0) {
    recommendations.push({
      category: 'food',
      priority: 'medium',
      title: 'Reduce Meat Consumption',
      description: 'Try meatless meals a few times per week or switch to plant-based alternatives.',
      potentialSavings: '0.3-0.7 tons CO2/year'
    });
  }

  // General recommendations
  if (total > 4.0) {
    recommendations.push({
      category: 'general',
      priority: 'medium',
      title: 'Offset Your Footprint',
      description: 'Consider purchasing carbon offsets or planting trees to neutralize your emissions.',
      potentialSavings: 'Full offset possible'
    });
  }

  return recommendations;
};

const compareToAverage = (footprint) => {
  const globalAverage = 4.6; // tons CO2 per person per year
  const difference = footprint - globalAverage;
  const percentage = ((difference / globalAverage) * 100).toFixed(1);

  return {
    globalAverage,
    difference: Math.round(difference * 10) / 10,
    percentage: parseFloat(percentage),
    status: difference < -0.5 ? 'below' : difference > 0.5 ? 'above' : 'average'
  };
};

const getEquivalent = (footprint) => {
  const equivalents = [
    { value: footprint * 0.43, unit: 'flights from NYC to LA' },
    { value: footprint * 2.2, unit: 'barrels of oil' },
    { value: footprint * 0.5, unit: 'cars driven for a year' },
    { value: footprint * 0.1, unit: 'homes powered for a year' }
  ];

  return equivalents;
};

module.exports = router;
