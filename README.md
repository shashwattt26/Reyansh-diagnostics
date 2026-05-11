# 🏥 Diagnostic Center Portal

A secure, full-stack web application designed for diagnostic centers and pathology labs. This portal allows patients to easily book diagnostic tests and securely download their medical reports, while providing a protected dashboard for staff and administrators to manage lab operations.

## 🚀 Tech Stack

**Frontend:**
* React.js (Bootstrapped with Vite for high performance)
* Material-UI (MUI v6) for a responsive, accessible interface
* React Router for client-side navigation
* Axios for API communication

**Backend:**
* Node.js & Express.js
* PostgreSQL (Database connection pooling via `pg`)
* Socket.io (Real-time notifications)
* Cloudinary (Secure cloud storage for prescriptions and reports)

**Testing & CI/CD:**
* Backend: Jest & Supertest
* Frontend: Vitest & React Testing Library
* Pipeline: GitHub Actions

---

## ✨ Key Features

### For Patients
* **Seamless Booking:** Interactive UI to book diagnostic tests (X-Ray, MRI, Blood Tests, etc.).
* **Prescription Uploads:** Securely upload doctor's prescriptions (handled via Multer & Cloudinary).
* **Secure Report Access:** Dual-factor tracking system (Tracking Code + Registered Phone Number) to ensure medical privacy when downloading reports.

### For Staff & Admins
* **Role-Based Access Control (RBAC):** Distinct privileges for standard staff vs. administrative users.
* **Protected Routes:** Authentication enforced via stateless JWTs stored securely in HTTP-Only cookies to prevent XSS attacks.
* **Data Anonymization:** Admin tools to softly delete and anonymize patient Personally Identifiable Information (PII) for compliance.

---

## 🛠️ Local Development Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v20+) and Git installed on your machine. You will also need a PostgreSQL database instance and a Cloudinary account.

### 1. Clone the Repository
```bash
git clone [https://github.com/your-username/diagnostic-center-portal.git](https://github.com/your-username/diagnostic-center-portal.git)
cd diagnostic-center-portal

```

### 2. Environment Variables

You will need to create two `.env` files (one in the backend, one in the frontend) to run this locally. Do **not** commit these to version control.

**Backend (`/backend/.env`)**

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgres://user:password@localhost:5432/diagnostic_db
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173

```

**Frontend (`/frontend/.env`)**

```env
VITE_API_URL=http://localhost:5000/api

```

### 3. Install Dependencies

Install packages for both the backend and frontend environments:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

```

### 4. Run the Application

Open two terminal windows to run the servers concurrently:

**Terminal 1 (Backend):**

```bash
cd backend
npm run dev

```

**Terminal 2 (Frontend):**

```bash
cd frontend
npm run dev

```

The frontend will be available at `http://localhost:5173`.

---

## 🧪 Testing

This project maintains a high standard of reliability with automated test suites for both the frontend UI and backend APIs. External services (like Database and Cloudinary) are fully mocked during testing.

**Run Backend Tests (Jest):**

```bash
cd backend
npm test

```

**Run Frontend Tests (Vitest):**

```bash
cd frontend
npm test

```

---

## 🛡️ Security Measures

* **Rate Limiting:** Global API rate limiting to prevent brute-force and DDoS attacks.
* **Helmet.js:** Configured to secure Express apps by setting various HTTP headers.
* **Password Hashing:** Strict `bcrypt` hashing (12 salt rounds) for all staff accounts.
* **Automated Dependency Scanning:** GitHub Dependabot configured for weekly security audits.

