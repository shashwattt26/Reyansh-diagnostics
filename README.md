# Reyansh Imaging & Diagnostics Center 🏥

A secure, full-stack web application designed to manage diagnostic center operations, patient bookings, staff directory access, and secure medical report delivery.

## 🚀 Tech Stack

**Frontend:**
* React.js (Vite)
* Material-UI (MUI) for responsive design and components (Snackbars, Modals, Data Tables)
* React Router DOM
* Axios for API communication

**Backend:**
* Node.js & Express.js
* PostgreSQL (Hosted on Render Private VPC)
* **Authentication:** JWT (JSON Web Tokens) stored securely in HTTP-Only cookies
* **Email Service:** Resend API (for verification, password resets, and broadcasts)
* **File Storage:** Cloudinary (for secure PDF lab reports and prescriptions)
* **Real-time:** Socket.io for live admin notifications

---

## 🛡️ Key Features & Security

* **Robust Authentication:** * JWTs are strictly managed via HTTP-Only, Secure, SameSite cookies to prevent XSS and CSRF attacks.
  * Passwords hashed using `bcrypt` with a high cost factor (12).
* **Role-Based Access Control (RBAC):** * Granular permissions for `admin`, `doctor`, and `staff` roles.
  * Admins can activate/deactivate accounts and broadcast company-wide emails.
* **Automated Email Workflows:** * Powered by the Resend API (bypassing traditional SMTP blockers). Handles secure account verification links, password reset tokens, and admin announcements.
* **Secure Patient Portal (IDOR Protection):** * Patients retrieve medical reports using Dual-Factor Ownership Verification (Tracking Code + Registered Phone Number) to prevent brute-force and BOLA/IDOR vulnerabilities.
* **Rate Limiting:** Login and registration routes are protected against brute-force attacks.

---

## 🛠️ Local Development Setup

### 1. Clone the repository
```bash
git clone [https://github.com/shashwattt26/Reyansh-diagnostics.git](https://github.com/shashwattt26/Reyansh-diagnostics.git)
cd Reyansh-diagnostics

```

### 2. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

```

Create a `.env` file in the `backend` folder and add the following keys:

```env
# Server Configuration
PORT=5000
FRONTEND_URL=http://localhost:5173  # Change to your custom domain in production
NODE_ENV=development

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5432/reyansh_db

# Security
JWT_SECRET=your_super_secret_jwt_key

# Email API (Resend)
RESEND_API_KEY=re_your_resend_api_key

# Cloudinary (File Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```

Start the backend server:

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal, navigate to the frontend directory, and install dependencies:

```bash
cd frontend/frontend
npm install

```

Create a `.env` file in the `frontend/frontend` folder:

```env
VITE_API_URL=http://localhost:5000  # Change to Render URL in production

```

Start the Vite development server:

```bash
npm run dev

```

---

## 🌐 Deployment Details

* **Frontend Hosting:** Vercel
* **Backend Hosting:** Render (Web Service)
* **Database:** Render PostgreSQL (Configured securely inside a Virtual Private Cloud / Internal Network)
* **Custom Domain:** `reyanshdiagnostics.com`
* **Routing Note:** Vercel requires a `vercel.json` file in the frontend root to successfully route React SPA paths and prevent 404 errors on refresh.

---

## 📝 Recent Updates (Changelog)

* **Email Migration:** Replaced Nodemailer/SMTP with Resend API to fix IPv6 routing dropouts on Render's network.
* **CORS Configuration:** Locked down CORS policy to explicitly trust the verified custom domain.
* **UI/UX Polish:** Replaced native browser `alert()` popups with elegant MUI Snackbars for asynchronous operations (e.g., "Staff added and verification email sent").
* **Database Migrations:** Fixed `users` vs `staff` table routing mismatches and ensured `db.query` consistency.

---

## 👨‍💻 Author

**Shashwat Rao** - [GitHub Profile](https://www.google.com/search?q=https://github.com/shashwattt26)

