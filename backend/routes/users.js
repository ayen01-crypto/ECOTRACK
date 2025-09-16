const express = require('express');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    
    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    // Get user with achievements
    const user = await User.findById(req.user._id)
      .populate('achievements.achievementId', 'name description icon points rarity');

    // Get activities for the period
    const activities = await Activity.find({
      userId: req.user._id,
      date: { $gte: startDate, $lte: now }
    }).sort({ date: -1 });

    // Calculate period statistics
    const periodStats = await Activity.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: now }
        }
      },
      {
        $group: {
          _id: '$type',
          totalFootprint: { $sum: '$carbonFootprint' },
          count: { $sum: 1 },
          averageFootprint: { $avg: '$carbonFootprint' }
        }
      },
      {
        $sort: { totalFootprint: -1 }
      }
    ]);

    // Calculate total period footprint
    const totalPeriodFootprint = periodStats.reduce((sum, stat) => sum + stat.totalFootprint, 0);

    // Get monthly trend data for charts
    const monthlyTrend = await Activity.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalFootprint: { $sum: '$carbonFootprint' },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // Get recent activities (last 10)
    const recentActivities = activities.slice(0, 10);

    // Calculate achievements progress
    const achievementsProgress = {
      total: user.achievements.length,
      recent: user.achievements.filter(ua => {
        const daysSinceUnlock = (now - ua.unlockedAt) / (1000 * 60 * 60 * 24);
        return daysSinceUnlock <= 30;
      }).length
    };

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          fullName: user.fullName,
          carbonFootprint: user.carbonFootprint,
          preferences: user.preferences
        },
        period: {
          name: period,
          startDate,
          endDate: now,
          totalFootprint: Math.round(totalPeriodFootprint * 100) / 100,
          activityCount: activities.length
        },
        statistics: {
          byCategory: periodStats,
          monthlyTrend,
          achievements: achievementsProgress
        },
        recentActivities,
        insights: generateInsights(periodStats, totalPeriodFootprint, period)
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching dashboard data'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements.achievementId', 'name description icon points rarity category');

    // Get user statistics
    const totalActivities = await Activity.countDocuments({ userId: req.user._id });
    const totalFootprint = user.carbonFootprint.total;
    const joinDate = user.createdAt;

    // Calculate days since joining
    const daysSinceJoining = Math.floor((new Date() - joinDate) / (1000 * 60 * 60 * 24));

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          carbonFootprint: user.carbonFootprint,
          preferences: user.preferences,
          achievements: user.achievements,
          isActive: user.isActive,
          createdAt: user.createdAt,
          lastLogin: user.lastLogin
        },
        statistics: {
          totalActivities,
          totalFootprint,
          daysSinceJoining,
          averageDailyFootprint: daysSinceJoining > 0 ? totalFootprint / daysSinceJoining : 0
        }
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching profile'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/users/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { preferences } = req.body;

    if (!preferences || typeof preferences !== 'object') {
      return res.status(400).json({
        status: 'error',
        message: 'Invalid preferences data'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { 
        preferences: { 
          ...req.user.preferences, 
          ...preferences 
        } 
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while updating preferences'
    });
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const { period = 'all' } = req.query;
    
    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        startDate = null; // All time
    }

    const matchQuery = { userId: req.user._id };
    if (startDate) {
      matchQuery.date = { $gte: startDate, $lte: now };
    }

    // Get comprehensive statistics
    const stats = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalActivities: { $sum: 1 },
          totalFootprint: { $sum: '$carbonFootprint' },
          averageFootprint: { $avg: '$carbonFootprint' },
          minFootprint: { $min: '$carbonFootprint' },
          maxFootprint: { $max: '$carbonFootprint' }
        }
      }
    ]);

    // Get statistics by category
    const categoryStats = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalFootprint: { $sum: '$carbonFootprint' },
          averageFootprint: { $avg: '$carbonFootprint' }
        }
      },
      { $sort: { totalFootprint: -1 } }
    ]);

    // Get daily activity count for the period
    const dailyActivity = await Activity.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            day: { $dayOfMonth: '$date' }
          },
          count: { $sum: 1 },
          footprint: { $sum: '$carbonFootprint' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
    ]);

    const result = stats[0] || {
      totalActivities: 0,
      totalFootprint: 0,
      averageFootprint: 0,
      minFootprint: 0,
      maxFootprint: 0
    };

    res.status(200).json({
      status: 'success',
      data: {
        period,
        overview: result,
        byCategory: categoryStats,
        dailyActivity,
        insights: generateStatisticalInsights(result, categoryStats)
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user statistics'
    });
  }
});

// Helper function to generate insights
const generateInsights = (categoryStats, totalFootprint, period) => {
  const insights = [];

  // Find the category with highest footprint
  if (categoryStats.length > 0) {
    const highestCategory = categoryStats[0];
    insights.push({
      type: 'highest_impact',
      category: highestCategory._id,
      footprint: highestCategory.totalFootprint,
      percentage: Math.round((highestCategory.totalFootprint / totalFootprint) * 100),
      message: `Your ${highestCategory._id} activities contribute ${Math.round((highestCategory.totalFootprint / totalFootprint) * 100)}% of your ${period}ly footprint.`
    });
  }

  // Check for improvement opportunities
  if (totalFootprint > 0) {
    const lowImpactCategories = categoryStats.filter(stat => 
      (stat.totalFootprint / totalFootprint) < 0.1
    );

    if (lowImpactCategories.length > 0) {
      insights.push({
        type: 'improvement_opportunity',
        message: `Consider focusing on reducing your ${lowImpactCategories[0]._id} footprint for maximum impact.`
      });
    }
  }

  return insights;
};

// Helper function to generate statistical insights
const generateStatisticalInsights = (overview, categoryStats) => {
  const insights = [];

  if (overview.totalActivities > 0) {
    // Activity frequency insight
    const avgFootprintPerActivity = overview.totalFootprint / overview.totalActivities;
    insights.push({
      type: 'activity_efficiency',
      value: Math.round(avgFootprintPerActivity * 100) / 100,
      message: `Your average carbon footprint per activity is ${Math.round(avgFootprintPerActivity * 100) / 100} kg CO2.`
    });

    // Consistency insight
    if (overview.maxFootprint > 0) {
      const consistency = ((overview.maxFootprint - overview.minFootprint) / overview.maxFootprint) * 100;
      insights.push({
        type: 'consistency',
        value: Math.round(100 - consistency),
        message: `Your activity consistency is ${Math.round(100 - consistency)}%.`
      });
    }
  }

  return insights;
};

module.exports = router;
