# 🛡️ SecureAuth — Enterprise Identity & Access Management Platform

> **Full-Stack Authentication, Real OTP Email Verification, Profile Management & Zero-Trust Architecture**  
> Developed for **UpToSkills Internship Program**  
> Technology Stack: **React 18 • Node.js • Express • MongoDB • Mongoose • Tailwind CSS • Vite • JWT**

---

## 📋 Executive Overview

**SecureAuth** is an enterprise-grade full-stack identity and profile management suite. Designed to safeguard user credentials and profile state, SecureAuth implements end-to-end authentication, cryptographic password hashing, real single-use Gmail OTP verification, HTTP-only cookie JWT session management, and persistent MongoDB collections.

All five original Stitch frontend designs and visual motifs—including the signature **3D monk-bird clay mascot**, frosted glassmorphic panels, warm peach glow gradients, and telemetry sidebars—have been preserved and wired to production-ready Node.js APIs and MongoDB collections.

---

## 🚀 Key Features

### 1. Authentication & Security
* **Full Registration Workflow**: Validates input fields, normalizes emails, enforces 8+ character password entropy (uppercase, lowercase, numeric), hashes credentials using **bcrypt (12 salt rounds)**, and generates a cryptographically secure 6-digit OTP.
* **Email Verification (Nodemailer & Gmail SMTP)**: Dispatches branded HTML verification emails with single-use 6-digit OTPs (5-minute expiration, max 5 verification attempts, 60-second resend cooldown).
* **Cryptographic Storage**: OTPs are never stored in plaintext—they are hashed using SHA-256 HMAC before database insertion. Public APIs never reveal OTP values.
* **Secure Session Cookies**: Issues JWT tokens inside `httpOnly`, `SameSite: strict/lax`, and `secure` HTTP cookies to prevent XSS credential theft. No tokens are stored in `localStorage`.
* **Account Enumeration Defense**: Forgot-password recovery endpoints return uniform generic responses regardless of whether an email exists in the database.
* **Brute-Force & Rate Limiting**: Multi-tiered IP rate limiters on authentication endpoints, registration, login, and OTP resend dispatches.

### 2. User Dashboard & Console
* **Real Authenticated State**: Dynamically renders authenticated user name, badge ID (`SEC-XXXX-XX`), directory cohort, member since date, and real email verification status.
* **Focused Security Telemetry**: Strictly focused on identity and account integrity. Free of misleading CRM/sales metrics or fake charts.
* **Quick Access Actions**: One-click navigation to Edit Profile, Account Security, Change Password, and Session Sign Out.

### 3. Profile Management & Biometric Directory
* **Persistent MongoDB Updates**: Allows users to view and update their full name, phone number, professional bio, location, date of birth, and avatar.
* **Profile Picture Support**: Upload custom profile avatars (PNG/JPEG/WEBP up to 2MB) stored directly with the user document.
* **Strict Ownership**: Identity is derived exclusively from the authenticated session cookie on the backend. No user ID from the frontend is trusted for ownership.

### 4. Zero-Trust Account Security
* **In-Session Password Change**: Requires verification of the current password hash before allowing password overwrites. Prevents reusing the current password.
* **Permanent Account Destruction**: Allows users to permanently purge their account and all active OTP records from MongoDB with confirmation safeguards.

---

## 🏗️ System Architecture

```
[ Frontend: React + Vite + Tailwind CSS ]
   │
   ├─► Axios (withCredentials: true)
   │
   ▼
[ Proxy / Backend API: Node.js + Express.js ]
   │
   ├── Helmet & CORS Protection
   ├── Multi-Tier Rate Limiters (Auth & OTP Resend)
   ├── Input Validation (Zod Schemas)
   ├── Auth Middleware (JWT in HTTP-only Cookie)
   ├── Centralized Error Handler
   ├── Nodemailer (Gmail SMTP Engine)
   │
   ▼
[ Persistent Database: MongoDB & Mongoose ]
   ├── `users` Collection
   │    ├── _id, name, email (unique, indexed)
   │    ├── passwordHash (bcrypt 12 rounds, select: false)
   │    ├── isEmailVerified, phone, bio, location, dateOfBirth
   │    ├── profilePicture, organizationUnit, directoryBadgeId
   │    └── createdAt, updatedAt, passwordChangedAt
   │
   └── `otpverifications` Collection
        ├── _id, email, userId (ref: User)
        ├── otpHash (SHA-256 HMAC)
        ├── purpose (REGISTRATION | PASSWORD_RESET | EMAIL_CHANGE)
        ├── expiresAt (TTL indexed)
        ├── attempts (max 5)
        ├── lastSentAt (60s cooldown tracking)
        └── consumedAt (timestamp upon single-use validation)
```

---

## 📁 Project Structure

```
Authentication/
├── package.json                 # Root script orchestrator (concurrently, test, dev)
├── .gitignore                   # Excludes node_modules, .env, build artifacts
├── .env.example                 # Example environment variables
├── README.md                    # Comprehensive documentation & presentation guide
│
├── server/                      # BACKEND (Node.js + Express + Mongoose)
│   ├── package.json             # Server dependencies & test scripts
│   ├── .env                     # Server environment configuration
│   ├── .env.example             # Server environment template
│   ├── src/
│   │   ├── app.js               # Express application configuration & middleware
│   │   ├── server.js            # Server entrypoint & DB lifecycle
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection & status monitoring
│   │   │   └── env.js           # Environment validation & SMTP detection
│   │   ├── controllers/
│   │   │   ├── authController.js# Registration, verification, login, recovery
│   │   │   └── userController.js# Profile read/write, change password, account delete
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js# Cookie JWT validation & user attachment
│   │   │   ├── rateLimiter.js   # express-rate-limit definitions
│   │   │   └── errorHandler.js  # Centralized Zod & Mongoose error parser
│   │   ├── models/
│   │   │   ├── User.js          # User collection schema & badge ID generator
│   │   │   └── OtpVerification.js # OTP collection schema & TTL indexing
│   │   ├── routes/
│   │   │   ├── authRoutes.js    # /api/auth endpoints
│   │   │   └── userRoutes.js    # /api/users endpoints
│   │   ├── services/
│   │   │   └── emailService.js  # Nodemailer Gmail transport
│   │   ├── templates/
│   │   │   └── emailTemplates.js# High-assurance HTML verification emails
│   │   └── utils/
│   │       ├── hash.js          # bcrypt password hashing utilities
│   │       ├── otp.js           # Cryptographic OTP generator & HMAC verifier
│   │       ├── token.js         # JWT signing & HTTP-only cookie handlers
│   │       └── validation.js    # Zod schemas for all request payloads
│   └── tests/
│       └── auth.test.js         # 24 automated Vitest integration test cases
│
├── client/                      # FRONTEND (React 18 + Vite + Tailwind CSS)
│   ├── package.json             # Client dependencies & scripts
│   ├── vite.config.js           # Vite dev server & /api proxy
│   ├── tailwind.config.js       # Stitch palette, clay gradients & animations
│   ├── postcss.config.js        # PostCSS configuration
│   ├── index.html               # Fonts (Jakarta, Outfit, Inter, Mono) & CDN assets
│   └── src/
│       ├── main.jsx             # React DOM root & BrowserRouter
│       ├── App.jsx              # Application router & ProtectedRoute gates
│       ├── index.css            # Tailwind directives & Claymorphism CSS
│       ├── api/
│       │   └── authApi.js       # Axios client with withCredentials: true
│       ├── context/
│       │   └── AuthContext.jsx  # Global session state & user lifecycle
│       ├── components/
│       │   ├── MascotScene.jsx  # 3D monk-bird mascot, mala beads & floating leaves
│       │   ├── Notification.jsx # Glassmorphic toast & alert banner
│       │   ├── Sidebar.jsx      # Dark mesh console navigation
│       │   └── Header.jsx       # Verified session banner & user avatar
│       └── pages/
│           ├── LoginPage.jsx    # Stitch Login screen with mascot & social icons
│           ├── RegisterPage.jsx # Account creation with password strength checks
│           ├── OtpVerificationPage.jsx # 6-box OTP entry, paste & 60s cooldown
│           ├── ForgotPasswordPage.jsx  # 4-stage interactive credential reset
│           ├── DashboardPage.jsx# Clean identity console with 3 Bento cards
│           ├── ProfilePage.jsx  # Personal information & avatar image upload
│           └── AccountSecurityPage.jsx # Password update & account deletion
│
└── stitch_secureauth_identity_suite/ # Original reference designs & assets preserved
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root or `server/` directory:

```env
# Server Port & Runtime
PORT=5000
NODE_ENV=development

# MongoDB Connection String (Local MongoDB or Atlas)
MONGODB_URI=mongodb://127.0.0.1:27017/secureauth

# JWT Secrets & Expiration
JWT_SECRET=secureauth_ultra_secure_jwt_production_secret_key_2026
JWT_EXPIRES_IN=1d

# Frontend Application URL
CLIENT_URL=http://localhost:5173

# Gmail SMTP Configuration (for Real Email OTP Delivery)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_character_google_app_password
EMAIL_FROM="SecureAuth Identity" <your_email@gmail.com>

# Development In-Memory Database Fallback (auto-enabled if local MongoDB is stopped)
ENABLE_MEMORY_DB=true
```

> **Gmail App Password Setup**:
> 1. Open Google Account Security: `https://myaccount.google.com/security`
> 2. Ensure **2-Step Verification** is turned **ON**.
> 3. Go to **App Passwords**: `https://myaccount.google.com/apppasswords`
> 4. Generate an App Password for "Mail" / "SecureAuth".
> 5. Paste the 16-character code into `SMTP_PASS` in `server/.env`.

---

## 🛠️ Installation & Execution

### 1. Install All Dependencies
```powershell
npm run install:all
```

### 2. Run the Application in Development Mode
Starts both the Express backend (`http://localhost:5000`) and the Vite React frontend (`http://localhost:5173`) concurrently:
```powershell
npm run dev
```

### 3. Run Backend or Frontend Individually
* **Backend only**:
  ```powershell
  npm run server:dev
  ```
* **Frontend only**:
  ```powershell
  npm run client
  ```

### 4. Execute Automated Test Suite
Runs all 24 automated tests across registration, OTP validation, login, profile persistence, and password reset:
```powershell
npm test
```

### 5. Build for Production
```powershell
npm run client:build
```

---

## 📡 REST API Reference

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | System status, database connection state, environment |

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Public / Auth |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register new user & dispatch OTP | Public (Rate-limited) |
| `POST` | `/api/auth/verify-email` | Validate 6-digit OTP & activate user | Public (Rate-limited) |
| `POST` | `/api/auth/resend-otp` | Re-issue OTP with 60s cooldown | Public (Rate-limited) |
| `POST` | `/api/auth/login` | Authenticate & issue HTTP-only cookie | Public (Rate-limited) |
| `POST` | `/api/auth/logout` | Clear HTTP-only session cookie | Public |
| `POST` | `/api/auth/forgot-password` | Request password reset OTP | Public (Enumeration-safe) |
| `POST` | `/api/auth/verify-reset-otp`| Verify password reset OTP | Public |
| `POST` | `/api/auth/reset-password` | Overwrite password hash with valid OTP | Public |
| `GET` | `/api/auth/me` | Fetch currently authenticated user | Protected (Session Cookie) |

### Profile & Account Management (`/api/users`)
| Method | Endpoint | Description | Public / Auth |
|---|---|---|---|
| `GET` | `/api/users/profile` | Retrieve authenticated user profile | Protected |
| `PUT` | `/api/users/profile` | Update profile fields & avatar in DB | Protected |
| `PATCH` | `/api/users/change-password` | Verify old password & update hash | Protected |
| `DELETE` | `/api/users/account` | Permanently delete account and OTPs | Protected |

---

## 🎓 UpToSkills Internship Administrator Demonstration Guide

When presenting SecureAuth to your internship administrator, use this walkthrough to demonstrate database transparency and production security controls:

### Step 1: Health Check & Database Connection
* Open your browser to `http://localhost:5000/api/health`.
* Show the live JSON response:
  ```json
  {
    "status": "healthy",
    "api": "Running",
    "database": "Connected",
    "environment": "development",
    "timestamp": "2026-11-02T..."
  }
  ```
* Point out that the backend console explicitly validates database readiness before opening ports.

### Step 2: Live Registration in MongoDB Compass
1. Open **MongoDB Compass** and connect to your database `mongodb://127.0.0.1:27017/secureauth`.
2. On the frontend (`http://localhost:5173/register`), register an account (e.g. `alex.morgan@uptoskills.com`).
3. Refresh MongoDB Compass:
   * View the newly created document in the `users` collection:
     * `isEmailVerified`: `false`
     * `passwordHash`: bcrypt hash starting with `$2a$12$...` (plaintext password is never stored)
   * View the record in `otpverifications`:
     * `otpHash`: SHA-256 HMAC hash
     * `purpose`: `"REGISTRATION"`
     * `expiresAt`: timestamp exactly 5 minutes in the future
     * `attempts`: `0`

### Step 3: Real OTP Verification
1. On the OTP verification page (`http://localhost:5173/verify-email`), enter the 6-digit code.
2. Note the auto-advancing inputs and 60-second cooldown timer for resends.
3. Upon clicking **Verify Email**, show Compass updating:
   * In `users`: `isEmailVerified` changes from `false` to `true`.
   * In `otpverifications`: `consumedAt` is populated with the verification timestamp (preventing replay).
4. Inspect the browser Network tab: notice the response sets the HTTP-only cookie `secureauth_token` with `HttpOnly` and `SameSite` flags.

### Step 4: Profile Update Demonstration
1. Navigate to **My Profile** (`/profile`).
2. Update the phone number, bio, location, or upload an avatar image.
3. Click **Save Profile**.
4. In MongoDB Compass, open the user's document to show that the new fields are immediately persisted in MongoDB.

### Step 5: Password Reset Verification
1. Log out and navigate to **Forgot Password** (`/forgot-password`).
2. Follow the 4-phase interactive recovery wizard.
3. In MongoDB Compass, show that `passwordHash` has changed to a newly salted hash, and the old password can no longer authenticate.

---

## 🔒 Sanitized MongoDB Document Examples

### Sanitized User Document (`users` collection)
```json
{
  "_id": { "$oid": "6725890fa3894bf29c3d1001" },
  "name": "Alex Morgan",
  "email": "alex.morgan@uptoskills.com",
  "passwordHash": "$2a$12$eX4mP1eHaShV4LuE99k3j.sUmP13H4sHEXAMPLEnOTreALcREDENTIAL",
  "isEmailVerified": true,
  "phone": "+1 (555) 234-5678",
  "bio": "Software Engineering Intern focusing on Identity & Access Management.",
  "location": "San Francisco, CA",
  "dateOfBirth": { "$date": "2001-08-15T00:00:00.000Z" },
  "profilePicture": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "organizationUnit": "Engineering Cohort • Team Auth",
  "directoryBadgeId": "SEC-1001-AM",
  "passwordChangedAt": { "$date": "2026-11-02T00:45:00.000Z" },
  "createdAt": { "$date": "2026-11-02T00:30:00.000Z" },
  "updatedAt": { "$date": "2026-11-02T00:45:00.000Z" }
}
```

### Sanitized OTP Record (`otpverifications` collection)
```json
{
  "_id": { "$oid": "6725890fa3894bf29c3d1002" },
  "userId": { "$oid": "6725890fa3894bf29c3d1001" },
  "email": "alex.morgan@uptoskills.com",
  "otpHash": "c20ad4d76fe97759aa27a0c99bff6710ea49e4d02ca327f2fdf40c03038676a0",
  "purpose": "REGISTRATION",
  "attempts": 1,
  "expiresAt": { "$date": "2026-11-02T00:35:00.000Z" },
  "lastSentAt": { "$date": "2026-11-02T00:30:00.000Z" },
  "consumedAt": { "$date": "2026-11-02T00:31:15.000Z" },
  "createdAt": { "$date": "2026-11-02T00:30:00.000Z" },
  "updatedAt": { "$date": "2026-11-02T00:31:15.000Z" }
}
```

---

## 🧪 Automated Test Results

The automated integration test suite (`npm test`) executes **24 comprehensive assertions** using Vitest, Supertest, and MongoMemoryServer:

```
 ✓ tests/auth.test.js (24 tests) 8195ms
   ✓ SecureAuth API Suite > GET /api/health > returns healthy status and database connection state
   ✓ SecureAuth API Suite > Registration & Input Validation > successfully registers a user with valid details
   ✓ SecureAuth API Suite > Registration & Input Validation > rejects duplicate registration when already verified
   ✓ SecureAuth API Suite > Registration & Input Validation > rejects registration with invalid email format
   ✓ SecureAuth API Suite > Registration & Input Validation > rejects registration with weak password
   ✓ SecureAuth API Suite > Registration & Input Validation > rejects registration when confirm password does not match
   ✓ SecureAuth API Suite > Email OTP Verification > successfully verifies email with correct OTP and issues auth cookie
   ✓ SecureAuth API Suite > Email OTP Verification > rejects incorrect OTP and decrements remaining attempts
   ✓ SecureAuth API Suite > Email OTP Verification > rejects expired OTP
   ✓ SecureAuth API Suite > Email OTP Verification > enforces maximum 5 attempts
   ✓ SecureAuth API Suite > Email OTP Verification > enforces resend cooldown of 60 seconds
   ✓ SecureAuth API Suite > Login & Protected Sessions > logs in successfully with valid credentials and sets HTTP-only cookie
   ✓ SecureAuth API Suite > Login & Protected Sessions > rejects login with wrong password
   ✓ SecureAuth API Suite > Login & Protected Sessions > rejects login for unverified account
   ✓ SecureAuth API Suite > Login & Protected Sessions > accesses protected /api/auth/me when authenticated via cookie
   ✓ SecureAuth API Suite > Login & Protected Sessions > blocks unauthenticated access to protected routes
   ✓ SecureAuth API Suite > Login & Protected Sessions > logs out and clears authentication cookie
   ✓ SecureAuth API Suite > User Profile & Password Management > fetches profile of authenticated user
   ✓ SecureAuth API Suite > User Profile & Password Management > updates profile and persists in MongoDB
   ✓ SecureAuth API Suite > User Profile & Password Management > changes password with valid current password
   ✓ SecureAuth API Suite > User Profile & Password Management > rejects change password when current password is wrong
   ✓ SecureAuth API Suite > Forgot Password & Password Reset Flow > generates a password recovery OTP without disclosing account existence
   ✓ SecureAuth API Suite > Forgot Password & Password Reset Flow > verifies reset OTP and resets password successfully
   ✓ SecureAuth API Suite > Forgot Password & Password Reset Flow > rejects password reset if new password is identical to old password

Test Files  1 passed (1)
     Tests  24 passed (24)
```

---

## ⚖️ License & Attribution

* **Project**: SecureAuth Identity & Profile Management Suite
* **Organization**: UpToSkills Internship Program
* **Original Stitch Design Assets**: Preserved under `stitch_secureauth_identity_suite/`
* **Author**: Full-Stack Senior Software Engineer
# SecureAuth-UptoSkills-
