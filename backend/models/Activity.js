const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: [true, 'Activity type is required'],
    enum: ['transportation', 'energy', 'food', 'waste', 'other']
  },
  category: {
    type: String,
    required: [true, 'Activity category is required']
  },
  description: {
    type: String,
    required: [true, 'Activity description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  value: {
    type: Number,
    required: [true, 'Activity value is required'],
    min: [0, 'Value cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['miles', 'km', 'kwh', 'gallons', 'liters', 'kg', 'lbs', 'meals', 'items', 'hours', 'other']
  },
  carbonFootprint: {
    type: Number,
    required: true,
    min: [0, 'Carbon footprint cannot be negative']
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  },
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for better query performance
activitySchema.index({ userId: 1, date: -1 });
activitySchema.index({ type: 1, date: -1 });
activitySchema.index({ date: -1 });

// Geospatial index for location-based queries
activitySchema.index({ location: '2dsphere' });

// Virtual for formatted date
activitySchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString();
});

// Static method to get user's activities by date range
activitySchema.statics.getUserActivitiesByDateRange = function(userId, startDate, endDate) {
  return this.find({
    userId,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: -1 });
};

// Static method to get carbon footprint by category
activitySchema.statics.getFootprintByCategory = function(userId, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: {
          $gte: startDate,
          $lte: endDate
        }
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
};

module.exports = mongoose.model('Activity', activitySchema);
