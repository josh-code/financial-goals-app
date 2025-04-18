import mongoose from 'mongoose';

const paymentScheduleSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true,
  },
  monthlyAmount: {
    type: Number,
    required: true,
  },
  totalContribution: {
    type: Number,
    required: true,
  },
  totalValue: {
    type: Number,
    required: true,
  },
});

const bucketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  targetAmount: {
    type: Number,
    required: [true, 'Please provide a target amount'],
    min: [0, 'Target amount must be positive'],
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: [0, 'Current amount must be positive'],
  },
  monthlyContribution: {
    type: Number,
    required: [true, 'Please provide a monthly contribution'],
    min: [0, 'Monthly contribution must be positive'],
  },
  returnRate: {
    type: Number,
    required: [true, 'Please provide an expected return rate'],
    min: [0, 'Return rate must be positive'],
  },
  timeline: {
    type: Number,
    required: [true, 'Please provide a timeline in years'],
    min: [1, 'Timeline must be at least 1 year'],
  },
  sipIncrease: {
    type: Number,
    default: 0,
    min: [0, 'SIP increase must be non-negative'],
  },
  paymentSchedule: [paymentScheduleSchema],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
bucketSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Bucket || mongoose.model('Bucket', bucketSchema); 