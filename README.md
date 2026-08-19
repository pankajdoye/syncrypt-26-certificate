# 🛡️ SYNCRYPT’26 — Certificate Download Portal

A clean, responsive, single-page **Certificate Download Portal** for **CRYPTX SECURITY RIT**'s flagship event **SYNCRYPT’26**. 

The system verifies participant credentials using their registered **PRN**, performs a private backend Excel lookup, dynamically inserts the participant's name in **GOLD** (`#D4AF37`) onto the official certificate template PDF, and allows instant high-resolution PDF download.

---

## ✨ Features

- **PRN Verification Only:** User enters their registered PRN to verify certificate eligibility. No registration or login required.
- **Private Data Protection:** Excel participant sheet remains strictly on the backend. No endpoints expose participant lists or bulk data.
- **Dynamic PDF Generation:** Generates print-ready A4 landscape certificates on-the-fly using `pdf-lib`.
- **Golden Name Overlay:** Participant's name is dynamically inserted in **GOLD** (`#D4AF37`) with natural 1–2 space gap alignment after `Mr./Ms.`.
- **Responsive Cyber UI:** Built with React 18 and Tailwind CSS featuring custom cybersecurity grid themes, circuit line accents, and instant feedback states.
- **Rate-Limited Security:** Backend includes IP rate-limiting middleware to protect verification endpoints from brute-force attempts.

---

## 🛠️ Tech Stack

### Frontend
- **React 18**
- **Vite**
- **Tailwind CSS**
- **Lucide React** (Icons)

### Backend
- **Node.js** & **Express**
- **SheetJS (`xlsx`)** for Excel data parsing
- **`pdf-lib`** for dynamic PDF generation & stream output
- **`express-rate-limit`** for endpoint security

---

## 📁 Repository Structure

```text
syncrypt-26-certificate/
├── backend/
│   ├── assets/
│   │   └── cryptx-logo.png             # Official CryptX Security RIT logo
│   ├── certificate/
│   │   └── certificate-template.png    # New SYNCRYPT'26 certificate template
│   ├── data/
│   │   └── participants.xlsx           # Private participant Excel dataset
│   ├── routes/
│   │   └── certificateRoutes.js        # API routes (/verify & /download)
│   ├── services/
│   │   ├── certificateService.js       # Dynamic PDF generator using pdf-lib
│   │   └── excelService.js             # PRN normalization & exact lookup
│   ├── server.js                       # Express server setup & rate limiting
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── cryptx-logo.png             # Header & Footer logo asset
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx              # Navbar with CryptX branding
│   │   │   ├── Hero.jsx                # Event title & instructions
│   │   │   ├── VerificationCard.jsx    # PRN form, loading, success & error states
│   │   │   ├── CyberBackground.jsx     # Cyber grid & circuit line overlays
│   │   │   └── Footer.jsx              # RIT institution & event details
│   │   ├── App.jsx                     # State management & API integration
│   │   ├── index.css                   # Global styles & Tailwind directives
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── package.json                        # Root package scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher

### Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/pankajdoye/syncrypt-26-certificate.git
   cd syncrypt-26-certificate
   ```

2. **Install backend & frontend dependencies:**
   ```bash
   # Install backend dependencies
   cd backend && npm install

   # Install frontend dependencies
   cd ../frontend && npm install
   cd ..
   ```

3. **Start the application:**
   ```bash
   # Start the Express production server (Port 5000)
   npm start
   ```
   Open **[http://localhost:5000](http://localhost:5000)** in your browser.

4. **Development Mode (Optional):**
   ```bash
   # Terminal 1: Backend API
   cd backend && npm start

   # Terminal 2: Frontend Dev Server
   cd frontend && npm run dev
   ```
   Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔒 Security & Privacy

- **Excel Privacy:** The file `participants.xlsx` is stored inside `backend/data/` and is never served as a static file or accessible via public GET requests.
- **Lookup Only:** Input PRNs are stripped of whitespace and normalized (`2560005.0` → `2560005`). If found, only the single matched participant name is processed. No full participant lists or auto-complete endpoints exist.
- **Rate Limiting:** IP rate limiting is enabled on `/api/certificate/*` routes (100 requests per 15 minutes per IP).

---

## 📜 License

Created for **CRYPTX SECURITY RIT** — **Rajarambapu Institute of Technology, Rajaramnagar**.
