const express = require('express');
const Achievement = require('../models/Achievement');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;

    const achievements = await Achievement.find(query).sort({ points: 1 });

    res.status(200).json({
      status: 'success',
      data: {
        achievements
      }
    });
  } catch (error) {
    console.error('Get achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching achievements'
    });
  }
});

// @desc    Get user's achievements
// @route   GET /api/achievements/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements.achievementId', 'name description icon points rarity category');

    const userAchievements = user.achievements.map(ua => ({
      ...ua.achievementId.toObject(),
      unlockedAt: ua.unlockedAt
    }));

    // Get all achievements to show locked ones
    const allAchievements = await Achievement.find({ isActive: true }).sort({ points: 1 });

    // Mark achievements as locked/unlocked
    const achievementsWithStatus = allAchievements.map(achievement => {
      const userAchievement = userAchievements.find(ua => ua._id.toString() === achievement._id.toString());
      return {
        ...achievement.toObject(),
        isUnlocked: !!userAchievement,
        unlockedAt: userAchievement?.unlockedAt || null
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        achievements: achievementsWithStatus,
        unlockedCount: userAchievements.length,
        totalCount: allAchievements.length
      }
    });
  } catch (error) {
    console.error('Get user achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching user achievements'
    });
  }
});

// @desc    Check and unlock achievements for user
// @route   POST /api/achievements/check
// @access  Private
router.post('/check', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const newlyUnlocked = [];

    // Get all active achievements
    const achievements = await Achievement.find({ isActive: true });

    for (const achievement of achievements) {
      // Check if user already has this achievement
      const alreadyUnlocked = user.achievements.some(
        ua => ua.achievementId.toString() === achievement._id.toString()
      );

      if (!alreadyUnlocked) {
        const isUnlocked = await checkAchievementUnlock(achievement, user._id);
        
        if (isUnlocked) {
          // Add achievement to user
          user.achievements.push({
            achievementId: achievement._id,
            unlockedAt: new Date()
          });

          newlyUnlocked.push(achievement);
        }
      }
    }

    if (newlyUnlocked.length > 0) {
      await user.save();
    }

    res.status(200).json({
      status: 'success',
      message: newlyUnlocked.length > 0 ? 'New achievements unlocked!' : 'No new achievements',
      data: {
        newlyUnlocked,
        count: newlyUnlocked.length
      }
    });
  } catch (error) {
    console.error('Check achievements error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while checking achievements'
    });
  }
});

// @desc    Get achievement statistics
// @route   GET /api/achievements/stats
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('achievements.achievementId', 'category points rarity');

    const stats = {
      totalUnlocked: user.achievements.length,
      totalPoints: user.achievements.reduce((sum, ua) => sum + (ua.achievementId?.points || 0), 0),
      byCategory: {},
      byRarity: {}
    };

    // Count by category
    user.achievements.forEach(ua => {
      const category = ua.achievementId?.category || 'unknown';
      const rarity = ua.achievementId?.rarity || 'common';
      
      stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
      stats.byRarity[rarity] = (stats.byRarity[rarity] || 0) + 1;
    });

    // Get total available achievements
    const totalAchievements = await Achievement.countDocuments({ isActive: true });
    stats.totalAvailable = totalAchievements;
    stats.completionPercentage = Math.round((stats.totalUnlocked / totalAchievements) * 100);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    console.error('Get achievement stats error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error while fetching achievement statistics'
    });
  }
});

// Helper function to check if an achievement should be unlocked
const checkAchievementUnlock = async (achievement, userId) => {
  const { criteria } = achievement;

  try {
    switch (criteria.type) {
      case 'count':
        const count = await Activity.countDocuments({
          userId,
          ...(criteria.activityType !== 'any' && { type: criteria.activityType })
        });
        return count >= criteria.target;

      case 'value':
        const totalValue = await Activity.aggregate([
          {
            $match: {
              userId: require('mongoose').Types.ObjectId(userId),
              ...(criteria.activityType !== 'any' && { type: criteria.activityType })
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$value' }
            }
          }
        ]);
        return totalValue.length > 0 && totalValue[0].total >= criteria.target;

      case 'streak':
        // Implementation for streak checking
        return await checkStreakAchievement(achievement, userId);

      case 'reduction':
        // Implementation for reduction checking
        return await checkReductionAchievement(achievement, userId);

      case 'custom':
        // Implementation for custom criteria
        return await checkCustomAchievement(achievement, userId);

      default:
        return false;
    }
  } catch (error) {
    console.error('Error checking achievement unlock:', error);
    return false;
  }
};

// Helper function to check streak achievements
const checkStreakAchievement = async (achievement, userId) => {
  const { criteria } = achievement;
  const timeframe = criteria.timeframe || 'daily';
  
  // Calculate date range based on timeframe
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'daily':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - criteria.target + 1);
      break;
    case 'weekly':
      startDate = new Date(now.getTime() - (criteria.target * 7 * 24 * 60 * 60 * 1000));
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth() - criteria.target + 1, 1);
      break;
    default:
      return false;
  }

  // Check if user has activities for each day in the streak
  const activities = await Activity.find({
    userId,
    date: { $gte: startDate, $lte: now },
    ...(criteria.activityType !== 'any' && { type: criteria.activityType })
  }).sort({ date: 1 });

  // Group activities by date and check for consecutive days
  const activitiesByDate = {};
  activities.forEach(activity => {
    const dateKey = activity.date.toISOString().split('T')[0];
    if (!activitiesByDate[dateKey]) {
      activitiesByDate[dateKey] = [];
    }
    activitiesByDate[dateKey].push(activity);
  });

  // Check for consecutive days with activities
  let currentStreak = 0;
  let maxStreak = 0;
  const dates = Object.keys(activitiesByDate).sort();
  
  for (let i = 0; i < dates.length; i++) {
    if (i === 0 || isConsecutiveDay(dates[i-1], dates[i])) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return maxStreak >= criteria.target;
};

// Helper function to check if two dates are consecutive
const isConsecutiveDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Helper function to check reduction achievements
const checkReductionAchievement = async (achievement, userId) => {
  const { criteria } = achievement;
  const timeframe = criteria.timeframe || 'monthly';
  
  // Get current period activities
  const now = new Date();
  let startDate;
  
  switch (timeframe) {
    case 'weekly':
      startDate = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      break;
    case 'monthly':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case 'yearly':
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    default:
      return false;
  }

  const currentActivities = await Activity.find({
    userId,
    date: { $gte: startDate, $lte: now },
    ...(criteria.activityType !== 'any' && { type: criteria.activityType })
  });

  const currentFootprint = currentActivities.reduce((sum, activity) => sum + activity.carbonFootprint, 0);

  // Get previous period activities for comparison
  const periodLength = now.getTime() - startDate.getTime();
  const previousStartDate = new Date(startDate.getTime() - periodLength);
  const previousEndDate = new Date(startDate.getTime() - 1);

  const previousActivities = await Activity.find({
    userId,
    date: { $gte: previousStartDate, $lte: previousEndDate },
    ...(criteria.activityType !== 'any' && { type: criteria.activityType })
  });

  const previousFootprint = previousActivities.reduce((sum, activity) => sum + activity.carbonFootprint, 0);

  if (previousFootprint === 0) return false;

  const reductionPercentage = ((previousFootprint - currentFootprint) / previousFootprint) * 100;
  return reductionPercentage >= criteria.target;
};

// Helper function to check custom achievements
const checkCustomAchievement = async (achievement, userId) => {
  // This would be implemented based on specific custom criteria
  // For now, return false as a placeholder
  return false;
};

module.exports = router;
