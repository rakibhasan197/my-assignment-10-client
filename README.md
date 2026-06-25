# 🚀 StartupForge - Startup Team Builder Platform

Live Site: https://your-client-site.vercel.app

Server Repository: https://github.com/rakibhasan197/my-assignment10-server

Client Repository: https://github.com/rakibhasan197/my-assignment-10-client

Admin Email: admin@gmail.com

Admin Password: ********

---

## 📌 Project Overview

StartupForge is a platform where startup founders can publish startup ideas, build teams, and recruit collaborators.

Developers, designers, marketers, and other professionals can explore startup opportunities and apply to join teams.

The system creates a bridge between startup founders and talented collaborators.

---

## ✨ Features

### 🔐 Authentication
- Better Auth Authentication
- Email & Password Login
- Google Login
- Role-Based Registration (Founder/Collaborator)
- Protected Private Routes
- JWT Authentication using HTTPOnly Cookies

### 👨‍💼 Founder Features
- Create Startup Profile
- Upload Startup Logo using ImageBB
- Add Team Opportunities
- Manage Opportunities
- Review Applications
- Accept or Reject Applicants
- Premium Package Restriction (Max 3 Free Opportunities)

### 👨‍💻 Collaborator Features
- Browse Opportunities
- Apply to Opportunities
- Track Application Status
- Update Personal Profile
- Upload Profile Image using ImageBB

### 👨‍💻 Admin Features
- Dashboard Overview
- Manage Users
- Block/Unblock Users
- Approve/Delete Startups
- View Transactions
- Revenue Statistics

### 💳 Payment System
- Stripe Checkout Integration
- Premium Founder Packages
- Payment Success Page
- Transaction History

### 🔎 Advanced Features
- Search Opportunities using MongoDB Regex
- Filter Opportunities by:
  - Work Type
  - Industry
- Server-side Pagination
- Responsive Dashboard
- Custom 404 Page
- Framer Motion Animation

---

## 🛠️ Technologies Used

### Frontend
- Next.js 16
- React 19
- Tailwind CSS
- DaisyUI
- Framer Motion
- Lucide React
- Better Auth

### Backend
- Node.js
- Express.js
- MongoDB
- JWT (JOSE)
- Stripe Payment Gateway

### Deployment
- Vercel (Client)
- Vercel/Render (Server)
- MongoDB Atlas

### Third Party Services
- ImageBB
- Google OAuth
- Stripe Checkout

---

## 📂 Database Collections

### Users
```js
{
  name,
  email,
  image,
  role,
  isBlocked
}
```

### Startups

```js
{
  startup_name,
  logo,
  industry,
  description,
  funding_stage,
  founder_email,
  status
}
```

### Opportunities

```js
{
  startup_id,
  role_title,
  required_skills,
  work_type,
  commitment_level,
  deadline
}
```

### Applications

```js
{
  opportunity_id,
  applicant_email,
  portfolio_link,
  motivation_message,
  status,
  applied_at
}
```

### Payments

```js
{
  user_email,
  amount,
  transaction_id,
  payment_status,
  paid_at
}
```

---

## ⚙️ Environment Variables

### Client (.env.local)

```env
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_IMGBB_API_KEY=
NEXT_PUBLIC_BETTER_AUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Server (.env)

```env
PORT=
MONGODB_URI=
STRIPE_SECRET_KEY=
CLIENT_URL=
JWT_SECRET=
```

---

## 🚀 Installation

### Clone Client

```bash
git clone https://github.com/rakibhasan197/my-assignment-10-client.git
```

```bash
cd startupforge-client
```

```bash
npm install
```

```bash
npm run dev
```

---

### Clone Server

```bash
git clone https://github.com/rakibhasan197/my-assignment10-server.git
```

```bash
cd startupforge-server
```

```bash
npm install
```

```bash
npm start
```

---

## 🎯 Assignment Requirements Implemented

✅ Better Auth Authentication

✅ Google Login

✅ Role-Based Access Control (RBAC)

✅ JWT Authentication

✅ Stripe Payment Integration

✅ Server-side Pagination

✅ MongoDB Regex Search

✅ MongoDB $in Filtering

✅ ImageBB File Upload

✅ Responsive Dashboard

✅ Framer Motion Animation

✅ Custom 404 Page

✅ Protected Routes

✅ Admin Dashboard

✅ Founder Dashboard

✅ Collaborator Dashboard

---

## 👨‍💻 Developed By

MD Rakib Al Hasan