---

# 🏥 Reyansh Imaging & Diagnostics Center

> A secure, full-stack web application designed to manage diagnostic center operations, patient bookings, staff directory access, and secure medical report delivery.

---

## 📑 Table of Contents

1. [Project Overview](https://www.google.com/search?q=%23project-overview)
2. [Features Documentation](https://www.google.com/search?q=%23features-documentation)
3. [Screens & Modules Breakdown](https://www.google.com/search?q=%23screens--modules-breakdown)
4. [Architecture](https://www.google.com/search?q=%23architecture)
5. [Installation Guide](https://www.google.com/search?q=%23installation-guide)
6. [Environment Variables](https://www.google.com/search?q=%23environment-variables)
7. [API Documentation](https://www.google.com/search?q=%23api-documentation)
8. [Usage Guide](https://www.google.com/search?q=%23usage-guide)
9. [Developer Documentation](https://www.google.com/search?q=%23developer-documentation)
10. [Troubleshooting](https://www.google.com/search?q=%23troubleshooting)
11. [Security](https://www.google.com/search?q=%23security)
12. [Deployment](https://www.google.com/search?q=%23deployment)

---

## 🚀 Project Overview

**Reyansh Diagnostics** is a complete digital infrastructure for a pathology and imaging center.

* **Main Purpose:** To digitize the patient booking workflow, allow secure remote upload of prescriptions, enable staff to manage incoming requests in real-time, and securely deliver final medical reports back to patients.
* **Target Users:** Patients (public booking), Receptionists (data entry), Doctors/Lab Techs (report uploads), and Admins (staff management & privacy compliance).
* **Tech Stack:**
* **Frontend:** React 19, Vite, Material-UI (MUI), React Router, Socket.io-client
* **Backend:** Node.js, Express.js, Socket.io
* **Database:** PostgreSQL (using `pg` pool)
* **File Storage:** Cloudinary (Images & PDFs)
* **Email Delivery:** Resend API
* **Security:** bcrypt, JWT (HTTP-Only Cookies), Helmet, Express Rate Limit



---

## ✨ Features Documentation

### 1. Patient Booking & Prescription Upload

* **What it does:** Patients can book tests online by entering their details and optionally uploading an image/PDF of their doctor's prescription.
* **Backend flow:** `multer` temporarily stores the file on the backend. It is immediately pushed to Cloudinary. Upon success, the local file is unlinked (`fs.unlinkSync`), and the secure URL is saved to PostgreSQL.
* **Technical details:** A unique 6-character tracking code is generated for every booking to allow secure, IDOR-protected report retrieval.

### 2. Real-Time Admin Dashboard

* **What it does:** Staff can view incoming bookings instantly without refreshing the page.
* **Backend flow:** Upon successful DB insertion of a booking, the Express server fires `io.emit('newBooking')`. Connected React clients receive this and prepend the new record to their state.

### 3. Secure Lab Report Delivery

* **What it does:** Lab technicians can upload final PDF reports mapped to specific bookings.
* **Backend flow:** Uses the same Cloudinary pipeline as prescriptions. Updates the booking status in the database to 'Report Ready'.

### 4. GDPR-Compliant Data Anonymization

* **What it does:** Admins can permanently erase PII (Personally Identifiable Information) from a booking record while keeping the clinical statistics intact.
* **Limitations:** This action is destructive and irreversible.

---

## 🖥️ Screens & Modules Breakdown

### Public Portal (Landing & Info)

* **Landing Page:** SEO-optimized marketing page featuring clinic stats, accreditations, Google Local Business schema, and a hero section to initiate bookings.
* **Services / About:** Static informational pages detailing the clinic's capabilities.

### Authentication Flow

* **Login/Register:** Email and password-based authentication. Passwords hashed using bcrypt (cost 12).
* **Verify Email:** Newly registered staff receive an email via Resend with a secure token. They must click it to activate their account.
* **Reset Password:** Standard forgot password flow using crypto-generated temporal tokens.

### Admin Dashboard Module

* **Live Bookings Table:** Displays Patient Name, Phone, Status, and Tracking Code. Allows filtering by status and searching.
* **Action Center:** Buttons to "Process Report" (upload PDF) or "Anonymize Data" (Admin only).

### Staff Management Module

* **RBAC:** Exclusively accessible to users with the `admin` role. Allows the creation of new staff accounts, assigning roles (`admin`, `staff`, `receptionist`), and deactivating accounts.

---

## 🏗️ Architecture

```text
[ Patient / Browser ]  <----(HTTPS / React SPA)---->  [ Vercel CDN ]
         |
         | (Axios API Calls + HTTP-Only Cookies)
         | (Socket.io WebSocket connection)
         v
[ Node.js + Express Backend ]  <---(Resend API)---> [ Email Delivery ]
         |
    (pg Pool)   
         |
         v
[ PostgreSQL Database ]  <---(Upload Streams)---> [ Cloudinary Blob Storage ]

```

* **Frontend:** A React Single Page Application wrapped in a `ThemeProvider` (Material UI). Routing is handled by `react-router-dom`.
* **Backend:** Express acts as an API gateway. Middleware chains (`protect`, `roleCheck`, `upload`) validate requests before hitting controllers.
* **Authentication:** Stateless. JWTs are minted upon login and sent to the client as `secure`, `httpOnly`, `sameSite` cookies.
* **Storage:** Local disk is only used as a temporal buffer for `multer`. Long-term blob storage is delegated to Cloudinary.

---

## 🛠️ Installation Guide

### Prerequisites

* Node.js (v18+ recommended)
* PostgreSQL database
* Cloudinary Account
* Resend API Key

### 1. Clone the repository

```bash
git clone https://github.com/shashwattt26/Reyansh-diagnostics.git
cd Reyansh-diagnostics

```

### 2. Backend Setup

```bash
cd backend
npm install

```

*Configure Environment Variables (see next section) and ensure PostgreSQL is running.*

```bash
npm run dev

```

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend/frontend
npm install

```

*Configure Environment Variables (see next section).*

```bash
npm run dev

```

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Purpose | Required | Example |
| --- | --- | --- | --- |
| `PORT` | API Server Port | Yes | `5000` |
| `FRONTEND_URL` | CORS Origin | Yes | `http://localhost:5173` |
| `DATABASE_URL` | Postgres Connection String | Yes | `postgresql://user:pass@localhost:5432/reyansh_db` |
| `JWT_SECRET` | Secret to sign tokens | Yes | `super_secret_key_123` |
| `RESEND_API_KEY` | Email API Key | Yes | `re_123456789` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Config | Yes | `my_cloud` |
| `CLOUDINARY_API_KEY` | Cloudinary Config | Yes | `12345678` |
| `CLOUDINARY_API_SECRET` | Cloudinary Config | Yes | `abcdefgh` |

### Frontend (`frontend/frontend/.env`)

| Variable | Purpose | Required | Example |
| --- | --- | --- | --- |
| `VITE_API_URL` | Backend API URL | Yes | `http://localhost:5000` |

---

## 🔌 API Documentation

### Auth & Staff (`/api/auth`)

* `POST /register` - Registers staff (creates verification token, emails user).
* `POST /login` - Returns HTTP-Only cookie and basic user info. Applies `loginLimiter`.
* `GET /verify-email/:token` - Activates a user account.

### Bookings (`/api/bookings`)

* `POST /upload-prescription` - Expects `multipart/form-data`. Fields: `patientName`, `phone`, `address`, `prescription` (file). Returns a `trackingCode`.

### Admin (`/api/admin`)

* `GET /bookings` - Retrieves all non-deleted bookings. Requires `protect` and valid staff cookie.
* `PATCH /bookings/:id/anonymize` - Erases PII from a booking.

### Reports (`/api/reports`)

* `POST /upload/:bookingId` - Expects `multipart/form-data`. Uploads final report, updates booking status to "Report Ready".

---

## 📖 Usage Guide

### Patient Workflow

1. Navigate to the landing page.
2. Click "Book Home Collection" or use the Booking Form.
3. Fill in details and upload the prescription.
4. Save the provided 6-character alphanumeric Tracking Code.

### Receptionist Workflow

1. Log into the Staff Portal.
2. The dashboard updates live via WebSockets.
3. For phone walk-ins, use the "Add Booking" button to manually create records.

### Admin/Lab Tech Workflow

1. View pending bookings.
2. Click "Process Report".
3. Upload the finalized PDF lab results.
4. If a patient requests data deletion under privacy laws, click the red "Trash" icon to trigger the Data Anonymization modal.

---

## 💻 Developer Documentation

### Architectural Patterns

* **Controller-Router Separation:** While currently merged in routing files (e.g., `authRoutes.js`), business logic resides within standard Express route closures.
* **Leak Prevention:** The `multer` setup includes a `finally` block in `try-catch` structures to ensure `fs.unlinkSync()` is called even if the Cloudinary API crashes, preventing server storage overflow.
* **State Management:** React's built-in `useState` and `useEffect` are used. No Redux is required because complex state is server-driven and updated via WebSockets.

### How to Extend Features

* **Adding a new Table:** Create the table in PostgreSQL, then create a new route file in `backend/routes/`.
* **Role Permissions:** Use the `authorizeRoles('admin', 'doctor')` middleware array to lock down new routes.

---

## 🚑 Troubleshooting

* **Socket Disconnects:** Ensure your production proxy (Nginx/Render) supports WebSocket upgrades. Add `app.set('trust proxy', 1)` (already implemented).
* **Login Fails (CORS / Cookies):** If logging in via local dev fails, ensure you access the frontend via `localhost:5173` and backend via `localhost:5000`. Cross-domain cookies require `withCredentials: true` in Axios, which is globally configured in `main.jsx`.
* **Emails Not Sending:** The Resend API drops emails if the "From" domain is unverified. Ensure your Resend dashboard has a verified domain.
* **File Upload Crashes:** Verify the backend directory has write permissions for `multer` to create temporary files before passing them to Cloudinary.

---

## 🛡️ Security

1. **Authentication:** * Strict rejection of local storage for tokens. Uses HTTP-Only, Secure, SameSite='none/lax' cookies.
2. **Abuse Prevention:**
* Global API limiter: `globalLimiter`.
* Specific limiters: `loginLimiter`, `registerLimiter` (prevents brute-forcing passwords).


3. **Data Security:**
* Passwords hashed with `bcrypt` (Salt Rounds: 12).
* Deactivated accounts are instantly blocked at the login layer.


4. **Header Protection:** * `helmet` is utilized to secure Express HTTP headers.

---

## 🚀 Deployment

### Vercel (Frontend)

1. Import the `frontend/frontend` folder as the root directory in Vercel.
2. Set Build Command: `npm run build`
3. Add Environment Variable: `VITE_API_URL` pointing to your backend.
4. *Crucial:* Ensure `vercel.json` exists to handle React SPA routing (rewrites everything to `index.html`).

### Render / VPS (Backend)

1. Create a Web Service targeting the `backend/` folder.
2. Build command: `npm install`
3. Start command: `node server.js`
4. Add all required backend environment variables.
5. Provision a PostgreSQL instance (Render private VPC recommended) and attach the `DATABASE_URL`.

---

## 🤝 Contribution Guide

1. **Fork** the repository.
2. **Create a branch:** `git checkout -b feature/your-feature-name`
3. **Commit your changes:** Follow standard conventional commits (`feat: ...`, `fix: ...`).
4. **Push:** `git push origin feature/your-feature-name`
5. **Open a Pull Request:** Detail the changes, reference any issues, and ensure no security keys are hardcoded.