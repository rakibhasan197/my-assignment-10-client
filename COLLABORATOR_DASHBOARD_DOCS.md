# Collaborator Dashboard - Complete Documentation

## Overview
A complete collaborator management system with browsing opportunities, applications, profile management, and premium payment features.

---

## 📁 Frontend File Structure

```
src/
├── app/
│   ├── api/
│   │   ├── applications/route.js          (API routes)
│   │   ├── collaborator/profile/route.js
│   │   ├── opportunities/all/route.js
│   │   └── payments/
│   │       ├── checkout/route.js
│   │       └── confirm/route.js
│   ├── dashboard/
│   │   └── collaborator/page.jsx          (Main Dashboard)
│   └── payments/
│       └── success/page.jsx               (Payment Success Page)
└── components/
    └── collaborator/
        ├── BrowseOpportunities.jsx        (Browse & Filter)
        ├── ApplyOpportunity.jsx           (Application Form)
        ├── MyApplications.jsx             (View Status)
        ├── CollaboratorProfile.jsx        (Profile Update)
        └── PremiumPayment.jsx             (Stripe Checkout)
```

---

## 🎯 Component Documentation

### 1. **BrowseOpportunities** (`src/components/collaborator/BrowseOpportunities.jsx`)
Browse and filter all available opportunities.

**Features:**
- Search by role, startup, or skill
- Filter by role type
- View opportunity details in modal
- Real-time data fetching

**API Endpoint:** `GET /api/opportunities/all`

---

### 2. **ApplyOpportunity** (`src/components/collaborator/ApplyOpportunity.jsx`)
Submit application for opportunities.

**Fields:**
- Opportunity Selection (dropdown)
- Portfolio Link (URL)
- Motivation Message (textarea)
- Email (auto-filled from session)

**Validation:**
- All fields required
- URL format validation

**API Endpoint:** `POST /api/applications`

---

### 3. **MyApplications** (`src/components/collaborator/MyApplications.jsx`)
View all submitted applications with status.

**Displays:**
- Opportunity Name
- Startup Name
- Applied Date
- Status (Pending/Accepted/Rejected)
- Color-coded status badges

**API Endpoint:** `GET /api/applications?email={email}`

---

### 4. **CollaboratorProfile** (`src/components/collaborator/CollaboratorProfile.jsx`)
Manage collaborator profile information.

**Fields:**
- Name (required)
- Profile Image (upload)
- Skills (required, comma-separated)
- Bio (optional)
- Email (read-only)

**Features:**
- Image preview
- Base64 encoding for image storage
- Profile creation/update

**API Endpoint:** `POST /api/collaborator/profile`

---

### 5. **PremiumPayment** (`src/components/collaborator/PremiumPayment.jsx`)
Stripe payment integration for premium packages.

**Packages:**
- **Basic**: $29/month - 3 opportunities
- **Professional**: $79/month - 15 opportunities (Popular)
- **Enterprise**: $199/month - Unlimited opportunities

**Features:**
- Package comparison cards
- Current subscription status
- Opportunity counter
- Stripe checkout integration
- FAQ section

**API Endpoint:** 
- `POST /api/payments/checkout` - Initialize payment
- `GET /api/payments/info` - Get payment status

---

## 🔧 Backend Requirements

### Database Collections

#### 1. **applications**
```javascript
{
  _id: ObjectId,
  opportunity_id: ObjectId,
  opportunity_name: String,
  startup_name: String,
  applicant_email: String (indexed),
  portfolio_link: String,
  motivation_message: String,
  status: 'Pending' | 'Accepted' | 'Rejected',
  applied_date: Date,
  reviewed_at: Date,
  feedback: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. **collaborator_profiles**
```javascript
{
  _id: ObjectId,
  email: String (unique, indexed),
  name: String,
  image: String (Base64),
  skills: String,
  bio: String,
  portfolio_link: String,
  created_at: Date,
  updated_at: Date
}
```

#### 3. **payments**
```javascript
{
  _id: ObjectId,
  email: String (indexed),
  founder_name: String,
  package_id: 'basic' | 'pro' | 'enterprise',
  package_name: String,
  amount: Number,
  currency: String,
  stripe_session_id: String (unique),
  stripe_payment_intent_id: String,
  transaction_id: String (unique),
  status: 'pending' | 'completed' | 'failed',
  opportunities_allowed: Number,
  valid_until: Date,
  created_at: Date,
  paid_at: Date
}
```

---

## 📡 API Endpoints

### Applications
```
GET  /api/applications?email={email}          - Get user's applications
POST /api/applications/create                  - Submit application
PATCH /api/applications/:id/status             - Update app status (admin)
```

### Collaborator Profile
```
GET  /api/collaborator/profile?email={email}  - Get profile
POST /api/collaborator/profile                 - Create/Update profile
```

### Opportunities
```
GET  /api/opportunities/all                    - Get all opportunities
```

### Payments
```
GET  /api/payments/info?email={email}         - Get payment info
POST /api/payments/checkout                    - Create checkout session
POST /api/payments/confirm                     - Confirm payment
```

---

## 🔐 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Backend (.env):**
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
MONGODB_URI=mongodb://localhost:27017/db_name
PORT=8000
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 🚀 Usage Guide

### 1. Access Collaborator Dashboard
Navigate to `/dashboard/collaborator`

### 2. Browse Opportunities
1. Go to "Browse Opportunities" tab
2. Search by role/startup/skill
3. Filter by role type
4. Click on opportunity to see details

### 3. Apply for Opportunity
1. Go to "Apply to Opportunity" tab
2. Select opportunity from dropdown
3. Enter portfolio link (GitHub, portfolio site, etc.)
4. Write motivation message
5. Submit application

### 4. Check Application Status
1. Go to "My Applications" tab
2. View all applications with status
3. Track dates and feedback

### 5. Update Profile
1. Go to "Profile" tab
2. Upload profile image
3. Update name and skills
4. Add bio
5. Save changes

### 6. Upgrade to Premium
1. Go to "Premium Plan" tab
2. Select package
3. Click "Upgrade" button
4. Complete Stripe checkout
5. Confirm payment

---

## ⚠️ Important Notes

1. **Image Storage**: Images are stored as Base64 strings in MongoDB. For large-scale apps, consider using cloud storage (AWS S3, Cloudinary).

2. **Stripe Integration**: 
   - Get keys from https://stripe.com
   - Test mode keys start with `sk_test_` and `pk_test_`
   - Production keys start with `sk_live_` and `pk_live_`

3. **Email Validation**: The system uses email from session. Ensure authentication is working properly.

4. **Payment Expiry**: Premium subscriptions are valid for 30 days. Implement renewal logic separately.

5. **Opportunity Limits**: 
   - Free: 3 opportunities
   - Pro: 15 opportunities
   - Enterprise: Unlimited

---

## 🔄 Data Flow

```
User Login
    ↓
Session Created
    ↓
Access Collaborator Dashboard
    ↓
├─ Browse Opportunities (fetch from API)
├─ Apply to Opportunity (POST application)
├─ View Applications (fetch user applications)
├─ Update Profile (POST/PUT profile)
└─ Purchase Premium (Stripe checkout)
         ↓
    Payment Confirmation
         ↓
    Update Opportunity Limits
```

---

## 🐛 Troubleshooting

### Issue: "Failed to fetch opportunities"
- Check if backend is running on port 8000
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check network tab in browser dev tools

### Issue: "Application already exists"
- User has already applied to this opportunity
- Check "My Applications" tab

### Issue: Stripe checkout not working
- Verify `STRIPE_SECRET_KEY` is set in backend .env
- Ensure payment is in test mode
- Check Stripe dashboard for webhook errors

### Issue: Profile image not showing
- Check browser console for Base64 encoding errors
- Verify image file size (keep under 1MB)
- Check MongoDB storage limits

---

## 📊 Package Comparison

| Feature | Basic | Pro | Enterprise |
|---------|-------|-----|-----------|
| Price | $29/mo | $79/mo | $199/mo |
| Opportunities | 3 | 15 | Unlimited |
| Analytics | Basic | Advanced | Advanced |
| Support | Email | Priority | 24/7 |
| Featured Listings | ❌ | ✅ | ✅ |
| Custom Branding | ❌ | ❌ | ✅ |

---

## 📝 Next Steps

1. Copy backend code to your Node.js project
2. Set up MongoDB collections
3. Configure Stripe API keys
4. Update environment variables
5. Test API endpoints with Postman
6. Test payment flow with Stripe test mode
7. Deploy to production

---

**Created:** 2026-06-21  
**Version:** 1.0.0
