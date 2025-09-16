const mongoose = require('mongoose');

const achievementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Achievement name is required'],
    unique: true,
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true,
    maxlength: [300, 'Description cannot exceed 300 characters']
  },
  icon: {
    type: String,
    required: [true, 'Achievement icon is required'],
    default: 'fas fa-trophy'
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: ['transportation', 'energy', 'food', 'waste', 'general', 'milestone']
  },
  criteria: {
    type: {
      type: String,
      required: [true, 'Criteria type is required'],
      enum: ['count', 'value', 'streak', 'reduction', 'custom']
    },
    target: {
      type: Number,
      required: [true, 'Target value is required'],
      min: [0, 'Target cannot be negative']
    },
    unit: {
      type: String,
      required: function() {
        return this.criteria.type !== 'count' && this.criteria.type !== 'streak';
      }
    },
    timeframe: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly', 'all-time'],
      default: 'all-time'
    },
    activityType: {
      type: String,
      enum: ['transportation', 'energy', 'food', 'waste', 'other', 'any'],
      default: 'any'
    }
  },
  points: {
    type: Number,
    required: [true, 'Achievement points are required'],
    min: [1, 'Points must be at least 1'],
    max: [1000, 'Points cannot exceed 1000']
  },
  rarity: {
    type: String,
    enum: ['common', 'uncommon', 'rare', 'epic', 'legendary'],
    default: 'common'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requirements: {
    minLevel: {
      type: Number,
      default: 0
    },
    prerequisites: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Achievement'
    }]
  }
}, {
  timestamps: true
});

// Index for better query performance
achievementSchema.index({ category: 1, isActive: 1 });
achievementSchema.index({ 'criteria.type': 1, 'criteria.activityType': 1 });

// Virtual for rarity color
achievementSchema.virtual('rarityColor').get(function() {
  const colors = {
    common: '#95a5a6',
    uncommon: '#2ecc71',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#f39c12'
  };
  return colors[this.rarity] || colors.common;
});

// Static method to get achievements by category
achievementSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ points: 1 });
};

// Static method to get available achievements for user
achievementSchema.statics.getAvailableForUser = function(userId, userLevel = 0) {
  return this.find({
    isActive: true,
    'requirements.minLevel': { $lte: userLevel }
  }).sort({ points: 1 });
};

// Method to check if achievement is unlocked
achievementSchema.methods.checkUnlock = async function(userId, userActivities) {
  const Activity = mongoose.model('Activity');
  
  switch (this.criteria.type) {
    case 'count':
      const count = await Activity.countDocuments({
        userId,
        type: this.criteria.activityType === 'any' ? { $exists: true } : this.criteria.activityType
      });
      return count >= this.criteria.target;
      
    case 'value':
      const totalValue = await Activity.aggregate([
        {
          $match: {
            userId: mongoose.Types.ObjectId(userId),
            type: this.criteria.activityType === 'any' ? { $exists: true } : this.criteria.activityType
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$value' }
          }
        }
      ]);
      return totalValue.length > 0 && totalValue[0].total >= this.criteria.target;
      
    case 'streak':
      // Implementation for streak checking would go here
      return false;
      
    case 'reduction':
      // Implementation for reduction checking would go here
      return false;
      
    default:
      return false;
  }
};

module.exports = mongoose.model('Achievement', achievementSchema);
