// Backend Models - Create in your backend project

// models/Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Opportunity',
    required: true,
  },
  opportunity_name: {
    type: String,
    required: true,
  },
  startup_name: {
    type: String,
    required: true,
  },
  applicant_email: {
    type: String,
    required: true,
    index: true,
  },
  portfolio_link: {
    type: String,
    required: true,
  },
  motivation_message: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Rejected'],
    default: 'Pending',
  },
  applied_date: {
    type: Date,
    default: Date.now,
  },
  reviewed_at: Date,
  feedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);

// models/CollaboratorProfile.js
const collaboratorProfileSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: String,
  skills: {
    type: String,
    required: true,
  },
  bio: String,
  portfolio_link: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model('CollaboratorProfile', collaboratorProfileSchema);

// models/Payment.js
const paymentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  founder_name: String,
  package_id: {
    type: String,
    enum: ['basic', 'pro', 'enterprise'],
    required: true,
  },
  package_name: String,
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'USD',
  },
  stripe_session_id: {
    type: String,
    unique: true,
    sparse: true,
  },
  stripe_payment_intent_id: String,
  transaction_id: {
    type: String,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  opportunities_allowed: {
    type: Number,
    default: 3,
  },
  valid_until: Date,
  created_at: {
    type: Date,
    default: Date.now,
  },
  paid_at: Date,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
