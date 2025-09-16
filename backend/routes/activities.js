const express = require('express');
const Activity = require('../models/Activity');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { validateActivity } = require('../middleware/validation');

const router = express.Router();

// Carbon footprint calculation factors (kg CO2 per unit)
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
    'beef': 27.0, // kg CO2 per kg
    'lamb': 21.1,
    'cheese': 13.5,
    'pork': 12.1,
    'chicken': 6.9,
    'fish': 5.1,
    'eggs': 4.2,
    'rice': 4.0,
    'vegetables': 2.0,
    'fruits': 1.1
  },
  waste: {
    'plastic': 3.5, // kg CO2 per kg
    'paper': 1.3,
    'glass': 0.9,
    'metal': 2.2,
    'organic': 0.5
  }
};

// Calculate carbon footprint for an activity
const calculateCarbonFootprint = (activityData) => {
  const { type, category, value, unit } = activityData;
  let footprint = 0;

  switch (type) {
    case 'transportation':
      const transportFactor = CARBON_FACTORS.transportation[category] || 0.15;
      // Convert to km if needed
      const distance = unit === 'miles' ? value * 1.60934 : value;
      footprint = distance * transportFactor;
      break;

    case 'energy':
      const energyFactor = CARBON_FACTORS.energy[category] || 0.5;
      footprint = value * energyFactor;
      break;

    case 'food':
      const foodFactor = CARBON_FACTORS.food[category] || 5.0;
      footprint = value * foodFactor;
      break;

    case 'waste':
      const wasteFactor = CARBON_FACTORS.waste[category] || 1.5;
      footprint = value * wasteFactor;
      break;

    default:
      footprint = value * 0.1; // Default factor
  }

  return Math.round(footprint * 100) / 100; // Round to 2 decimal places
};

// @desc    Get all activities for a user
// @route   GET /api/activities
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { page = 1, limit = 20, type, startDate, endDate } = req.query;
    
    const query = { userId: req.user._id };
    
    if (type) query.type = type;
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const activities = await Activity.find(query)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Activity.countDocuments(query);

    res.status(200).json({
      status: 'success',
      data: {
        activities,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });
  } catch (error) {
    console.error('Get activities error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activities'
    });
  }
});

// @desc    Get single activity
// @route   GET /api/activities/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        status: 'error',
        message: 'Activity not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        activity
      }
    });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching activity'
    });
  }
});

// @desc    Create new activity
// @route   POST /api/activities
// @access  Private
router.post('/', protect, validateActivity, async (req, res) => {
  try {
    const { type, category, description, value, unit, date, location, metadata } = req.body;

    // Calculate carbon footprint
    const carbonFootprint = calculateCarbonFootprint({
      type,
      category,
      value,
      unit
    });

    const activity = await Activity.create({
      userId: req.user._id,
      type,
      category,
      description,
      value,
      unit,
      carbonFootprint,
      date: date ? new Date(date) : new Date(),
      location,
      metadata
    });

    // Update user's carbon footprint
    await updateUserCarbonFootprint(req.user._id, type, carbonFootprint);

    res.status(201).json({
      status: 'success',
      message: 'Activity logged successfully',
      data: {
        activity
      }
    });
  } catch (error) {
    console.error('Create activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while creating activity'
    });
  }
});

// @desc    Update activity
// @route   PUT /api/activities/:id
// @access  Private
router.put('/:id', protect, validateActivity, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        status: 'error',
        message: 'Activity not found'
      });
    }

    const { type, category, description, value, unit, date, location, metadata } = req.body;

    // Calculate new carbon footprint
    const newCarbonFootprint = calculateCarbonFootprint({
      type,
      category,
      value,
      unit
    });

    // Update activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        type,
        category,
        description,
        value,
        unit,
        carbonFootprint: newCarbonFootprint,
        date: date ? new Date(date) : activity.date,
        location,
        metadata
      },
      { new: true, runValidators: true }
    );

    // Update user's carbon footprint (subtract old, add new)
    const footprintDifference = newCarbonFootprint - activity.carbonFootprint;
    await updateUserCarbonFootprint(req.user._id, type, footprintDifference);

    res.status(200).json({
      status: 'success',
      message: 'Activity updated successfully',
      data: {
        activity: updatedActivity
      }
    });
  } catch (error) {
    console.error('Update activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating activity'
    });
  }
});

// @desc    Delete activity
// @route   DELETE /api/activities/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const activity = await Activity.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!activity) {
      return res.status(404).json({
        status: 'error',
        message: 'Activity not found'
      });
    }

    // Update user's carbon footprint (subtract the deleted activity's footprint)
    await updateUserCarbonFootprint(req.user._id, activity.type, -activity.carbonFootprint);

    await Activity.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'success',
      message: 'Activity deleted successfully'
    });
  } catch (error) {
    console.error('Delete activity error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while deleting activity'
    });
  }
});

// @desc    Get carbon footprint statistics
// @route   GET /api/activities/stats/footprint
// @access  Private
router.get('/stats/footprint', protect, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const matchQuery = { userId: req.user._id };
    if (startDate || endDate) {
      matchQuery.date = {};
      if (startDate) matchQuery.date.$gte = new Date(startDate);
      if (endDate) matchQuery.date.$lte = new Date(endDate);
    }

    const stats = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          totalFootprint: { $sum: '$carbonFootprint' },
          count: { $sum: 1 },
          averageFootprint: { $avg: '$carbonFootprint' }
        }
      },
      { $sort: { totalFootprint: -1 } }
    ]);

    const totalFootprint = stats.reduce((sum, stat) => sum + stat.totalFootprint, 0);

    res.status(200).json({
      status: 'success',
      data: {
        totalFootprint,
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('Get footprint stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching footprint statistics'
    });
  }
});

// Helper function to update user's carbon footprint
const updateUserCarbonFootprint = async (userId, type, footprint) => {
  const user = await User.findById(userId);
  if (!user) return;

  const updateField = `carbonFootprint.${type}`;
  const currentValue = user.carbonFootprint[type] || 0;
  const newValue = Math.max(0, currentValue + footprint);

  await User.findByIdAndUpdate(userId, {
    $set: { [updateField]: newValue }
  });

  // Recalculate total
  await user.calculateTotalFootprint();
};

module.exports = router;
