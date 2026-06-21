# Quick Start Guide - Collaborator Dashboard

## ⚡ Quick Copy-Paste Setup

### Step 1: Frontend is Ready ✅
All frontend components and pages are already created in your project:

```
✅ src/app/dashboard/collaborator/page.jsx - Main page
✅ src/components/collaborator/BrowseOpportunities.jsx
✅ src/components/collaborator/ApplyOpportunity.jsx
✅ src/components/collaborator/MyApplications.jsx
✅ src/components/collaborator/CollaboratorProfile.jsx
✅ src/components/collaborator/PremiumPayment.jsx
✅ src/app/payments/success/page.jsx
✅ API routes in src/app/api/
```

### Step 2: Backend Setup (Copy to your Node.js backend)

#### Install Dependencies
```bash
npm install mongoose stripe express cors dotenv
```

#### Create Models (backend/models/)

**Application.js**
```javascript
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  opportunity_id: mongoose.Schema.Types.ObjectId,
  opportunity_name: String,
  startup_name: String,
  applicant_email: { type: String, index: true },
  portfolio_link: String,
  motivation_message: String,
  status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
  applied_date: { type: Date, default: Date.now },
  reviewed_at: Date,
  feedback: String,
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
```

**CollaboratorProfile.js**
```javascript
const mongoose = require('mongoose');

const collaboratorProfileSchema = new mongoose.Schema({
  email: { type: String, unique: true, index: true },
  name: String,
  image: String,
  skills: String,
  bio: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('CollaboratorProfile', collaboratorProfileSchema);
```

**Payment.js**
```javascript
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  email: { type: String, index: true },
  founder_name: String,
  package_id: { type: String, enum: ['basic', 'pro', 'enterprise'] },
  package_name: String,
  amount: Number,
  stripe_session_id: { type: String, unique: true, sparse: true },
  stripe_payment_intent_id: String,
  transaction_id: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  opportunities_allowed: Number,
  valid_until: Date,
  created_at: { type: Date, default: Date.now },
  paid_at: Date,
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
```

#### Create Routes (backend/routes/)

**applications.js**
```javascript
const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const Opportunity = require('../models/Opportunity');

router.post('/create', async (req, res) => {
  try {
    const { opportunity_id, applicant_email, portfolio_link, motivation_message } = req.body;

    const opportunity = await Opportunity.findById(opportunity_id);
    const existingApp = await Application.findOne({ opportunity_id, applicant_email });

    if (existingApp) return res.status(400).json({ message: 'Already applied' });

    const app = new Application({
      opportunity_id,
      opportunity_name: opportunity.role_title,
      startup_name: opportunity.startup_name,
      applicant_email,
      portfolio_link,
      motivation_message,
    });

    await app.save();
    res.status(201).json({ message: 'Applied successfully', application: app });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    const apps = await Application.find({ applicant_email: email }).sort({ applied_date: -1 });
    res.json({ applications: apps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

**collaborator.js**
```javascript
const express = require('express');
const router = express.Router();
const CollaboratorProfile = require('../models/CollaboratorProfile');

router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;
    const profile = await CollaboratorProfile.findOne({ email });
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/profile', async (req, res) => {
  try {
    const { email, name, image, skills, bio } = req.body;
    
    let profile = await CollaboratorProfile.findOne({ email });
    if (!profile) {
      profile = new CollaboratorProfile({ email, name, image, skills, bio });
    } else {
      profile.name = name;
      profile.image = image;
      profile.skills = skills;
      profile.bio = bio;
      profile.updated_at = new Date();
    }
    
    await profile.save();
    res.json({ message: 'Profile updated', profile });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

**opportunities.js**
```javascript
const express = require('express');
const router = express.Router();
const Opportunity = require('../models/Opportunity');

router.get('/all', async (req, res) => {
  try {
    const opps = await Opportunity.find().sort({ created_at: -1 });
    res.json({ opportunities: opps });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

**payments.js**
```javascript
const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Payment = require('../models/Payment');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const packages = {
  basic: { price: 2900, name: 'Basic', opportunities: 3 },
  pro: { price: 7900, name: 'Professional', opportunities: 15 },
  enterprise: { price: 19900, name: 'Enterprise', opportunities: 999 },
};

router.get('/info', async (req, res) => {
  try {
    const { email } = req.query;
    const payment = await Payment.findOne({ email, status: 'completed' }).sort({ created_at: -1 });
    
    res.json({
      current_package: payment?.package_name,
      opportunities_allowed: payment?.opportunities_allowed || 3,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/checkout', async (req, res) => {
  try {
    const { email, package_id, success_url, cancel_url } = req.body;
    const pkg = packages[package_id];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: pkg.name,
            description: `${pkg.opportunities} opportunities`,
          },
          unit_amount: pkg.price,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url,
      cancel_url,
      customer_email: email,
    });

    const payment = new Payment({
      email,
      package_id,
      package_name: pkg.name,
      amount: pkg.price / 100,
      stripe_session_id: session.id,
      opportunities_allowed: pkg.opportunities,
    });

    await payment.save();
    res.json({ checkout_url: session.url, session_id: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/confirm', async (req, res) => {
  try {
    const { session_id } = req.body;
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status === 'paid') {
      const payment = await Payment.findOneAndUpdate(
        { stripe_session_id: session_id },
        { status: 'completed', paid_at: new Date() },
        { new: true }
      );

      res.json({
        transaction_id: payment.transaction_id,
        package_name: payment.package_name,
        amount: payment.amount,
        opportunities_allowed: payment.opportunities_allowed,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
```

#### Update server.js
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json({ limit: '50mb' }));
app.use(cors());

mongoose.connect(process.env.MONGODB_URI);

app.use('/api/applications', require('./routes/applications'));
app.use('/api/collaborator', require('./routes/collaborator'));
app.use('/api/opportunities', require('./routes/opportunities'));
app.use('/api/payments', require('./routes/payments'));

app.listen(process.env.PORT || 8000, () => {
  console.log('Server running on port 8000');
});
```

#### .env file
```
STRIPE_SECRET_KEY=sk_test_your_key
MONGODB_URI=mongodb://localhost:27017/your_db
PORT=8000
```

### Step 3: Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Test the Application

1. Start backend: `npm start`
2. Start frontend: `npm run dev`
3. Go to: `http://localhost:3000/dashboard/collaborator`
4. Test each feature:
   - Browse opportunities
   - Apply for an opportunity
   - Check application status
   - Update profile
   - Test payment (use Stripe test card: 4242 4242 4242 4242)

---

## 🎯 Features Checklist

- [x] Browse all opportunities with search & filter
- [x] Apply to opportunities with portfolio & motivation
- [x] View application status (Pending/Accepted/Rejected)
- [x] Manage collaborator profile (name, skills, bio, image)
- [x] Premium payment with Stripe (3 packages)
- [x] Payment success confirmation
- [x] Opportunity limit based on subscription
- [x] Reusable components
- [x] Responsive design
- [x] Error handling
- [x] Loading states

---

## 📱 Testing Stripe Payments

**Test Card Details:**
- Card Number: 4242 4242 4242 4242
- Expiry: 12/25
- CVC: 123
- ZIP: 12345

---

## 🔗 Access URL

```
http://localhost:3000/dashboard/collaborator
```

---

That's it! Your collaborator dashboard is ready to use. 🚀
