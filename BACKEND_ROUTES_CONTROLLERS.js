// Backend Routes & Controllers - Create in your backend project

// routes/applications.js
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

// Create application
router.post('/create', async (req, res) => {
  try {
    const {
      opportunity_id,
      applicant_email,
      portfolio_link,
      motivation_message,
      status = 'Pending',
    } = req.body;

    if (!opportunity_id || !applicant_email || !portfolio_link || !motivation_message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Get opportunity details
    const opportunity = await Opportunity.findById(opportunity_id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      opportunity_id,
      applicant_email,
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied to this opportunity' });
    }

    const application = new Application({
      opportunity_id,
      opportunity_name: opportunity.role_title,
      startup_name: opportunity.startup_name,
      applicant_email,
      portfolio_link,
      motivation_message,
      status,
      applied_date: new Date(),
    });

    await application.save();

    res.status(201).json({
      message: 'Application submitted successfully',
      application,
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get applications by email
router.get('/', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const applications = await Application.find({
      applicant_email: email,
    }).sort({ applied_date: -1 });

    res.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update application status (for founders)
router.patch('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const application = await Application.findByIdAndUpdate(
      id,
      {
        status,
        feedback,
        reviewed_at: new Date(),
      },
      { new: true }
    );

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.json({ application });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// routes/collaborator.js
const express = require('express');
const router = express.Router();
const CollaboratorProfile = require('../models/CollaboratorProfile');

// Get or create collaborator profile
router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const profile = await CollaboratorProfile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json({ profile });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update collaborator profile
router.post('/profile', async (req, res) => {
  try {
    const { email, name, image, skills, bio } = req.body;

    if (!email || !name || !skills) {
      return res.status(400).json({ message: 'Email, name, and skills are required' });
    }

    let profile = await CollaboratorProfile.findOne({ email });

    if (!profile) {
      profile = new CollaboratorProfile({
        email,
        name,
        image,
        skills,
        bio,
      });
    } else {
      profile.name = name;
      profile.image = image;
      profile.skills = skills;
      profile.bio = bio;
      profile.updated_at = new Date();
    }

    await profile.save();

    res.json({
      message: 'Profile updated successfully',
      profile,
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

// routes/opportunities.js
router.get('/all', async (req, res) => {
  try {
    const opportunities = await Opportunity.find({ status: 'active' })
      .sort({ created_at: -1 });

    res.json({ opportunities });
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ message: error.message });
  }
});

// routes/payments.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/Payment');
const Founder = require('../models/Founder'); // Your founder model

const packagePrices = {
  basic: { price: 2900, name: 'Basic', opportunities: 3 }, // cents
  pro: { price: 7900, name: 'Professional', opportunities: 15 },
  enterprise: { price: 19900, name: 'Enterprise', opportunities: 999 },
};

router.get('/info', async (req, res) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Get latest active payment
    const payment = await Payment.findOne({
      email,
      status: 'completed',
    }).sort({ created_at: -1 });

    if (!payment) {
      res.json({
        current_package: null,
        opportunities_posted: 0,
        opportunities_allowed: 3,
        upgrade_required: false,
      });
    } else {
      // Count posted opportunities
      const opportunities = await Opportunity.countDocuments({
        founder_email: email,
      });

      res.json({
        current_package: payment.package_name,
        opportunities_posted: opportunities,
        opportunities_allowed: payment.opportunities_allowed,
        upgrade_required: opportunities >= payment.opportunities_allowed,
      });
    }
  } catch (error) {
    console.error('Error fetching payment info:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const { email, package_id, success_url, cancel_url } = req.body;

    if (!email || !package_id) {
      return res.status(400).json({ message: 'Email and package ID are required' });
    }

    const packageInfo = packagePrices[package_id];
    if (!packageInfo) {
      return res.status(400).json({ message: 'Invalid package ID' });
    }

    // Get founder name
    const founder = await Founder.findOne({ email });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: packageInfo.name,
              description: `Post up to ${packageInfo.opportunities} opportunities`,
            },
            unit_amount: packageInfo.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url,
      cancel_url,
      customer_email: email,
      metadata: {
        email,
        package_id,
      },
    });

    // Save pending payment
    const payment = new Payment({
      email,
      founder_name: founder?.name || 'Unknown',
      package_id,
      package_name: packageInfo.name,
      amount: packageInfo.price / 100,
      stripe_session_id: session.id,
      status: 'pending',
      opportunities_allowed: packageInfo.opportunities,
      transaction_id: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

    await payment.save();

    res.json({
      checkout_url: session.url,
      session_id: session.id,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: error.message });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Verify with Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Update payment status
    const payment = await Payment.findOneAndUpdate(
      { stripe_session_id: session_id },
      {
        status: 'completed',
        paid_at: new Date(),
        stripe_payment_intent_id: session.payment_intent,
        valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    res.json({
      transaction_id: payment.transaction_id,
      package_name: payment.package_name,
      amount: payment.amount,
      opportunities_allowed: payment.opportunities_allowed,
      created_at: payment.created_at,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
