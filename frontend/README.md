# 🎨 MedTwin AI — Frontend SPA (Frontend Dev Domain)

Welcome to the **Frontend UI** folder of `MedTwin AI`. As the **Frontend Developer (`frontend` branch)**, you own this directory.

---

## 🏗️ Architecture Overview

The frontend is built with **React 18, Vite, and Tailwind CSS**. It implements rich modern medical design principles (vibrant HSL dark mode, smooth micro-animations, Recharts data visualization, and role-based portals).

### Folder Structure (`frontend/`)
```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Role tabs (Patient/Doctor/Admin) + Polygon status
│   │   ├── ReportUpload.jsx  # Drag-and-drop OCR document upload
│   │   └── RiskChart.jsx     # Recharts vitals & health trajectory area chart
│   ├── pages/
│   │   ├── PatientDashboard.jsx  # Slide 28 replica (Health Score 82/100, Verification)
│   │   ├── DoctorDashboard.jsx   # Slide 29 replica (Review Queue, Confidence Bar)
│   │   └── AdminDashboard.jsx    # Slide 30 replica (Active Users, Uptime stats)
│   ├── services/
│   │   └── api.js            # Axios client connected to FastAPI endpoints (Slide 33)
│   ├── App.jsx               # Root role routing
│   ├── main.jsx              # React DOM entry
│   └── index.css             # Tailwind glassmorphism tokens & animations
├── package.json
├── tailwind.config.js
├── vite.config.js
└── Dockerfile
```

---

## 🚀 Quick Start (For Frontend Dev)

### 1. Install Dependencies & Run Dev Server
Open terminal inside `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
The application will launch at: **http://localhost:5173**

*(Note: `vite.config.js` is pre-configured to proxy `/api` calls directly to the FastAPI backend at `http://localhost:8000` so you don't face CORS issues!)*

---

## 🔄 Daily Collaboration Checklist (For Frontend Dev)

1. Check out your branch every morning: `git checkout frontend`
2. Pull latest main from the Team Lead: `git fetch origin && git merge origin/main`
3. Build your UI components or polish layouts inside `src/components/` or `src/pages/`.
4. Commit and push: `git add . && git commit -m "feat(frontend): polish doctor review queue" && git push origin frontend`
5. Create a Pull Request on GitHub and ask the Team Lead (`backend`) to review & merge!
