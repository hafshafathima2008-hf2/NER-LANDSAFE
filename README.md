# ⛰️ NER-LANDSAFE | AI Landslide Early Warning System

**Problem Statement ID**: `SIH26001`  
**Region**: Northeast India (NER)  
**Technology Stack**: Python, Flask, SQLite, Scikit-Learn, Random Forest, HTML5/CSS3, JavaScript, Leaflet.js, Open-Meteo Satellite API, PWA Service Worker

---

## 📌 Project Overview

**NER-LANDSAFE** is an AI-powered disaster management and landslide early warning platform designed specifically for vulnerable hilly terrains in Northeast India. The system integrates a Machine Learning model with real-time live satellite weather feeds, interactive geospatial visualization, spatial risk heatmaps, offline PWA capabilities, regional multilingual support, and a secret admin emergency portal.

---

## 📁 Project Directory Structure

```text
Landslide_Early_Warning/
├── backend/                             # 🐍 BACKEND SERVER & MACHINE LEARNING CORE
│   ├── app.py                           # Main Flask REST API, Satellite Integration & SQLite Router
│   ├── risk_engine.py                   # Random Forest ML Risk Prediction Engine
│   ├── alerts.py                        # Rule-based Emergency Alert Generator
│   ├── model.py                         # ML Model Training & Evaluation Script
│   ├── landslide_model.pkl              # Trained Scikit-Learn Random Forest Model File
│   ├── landslide.db                     # SQLite Database for Citizen Reports & Admin Portal
│   └── requirements.txt                 # Python Backend Dependencies
│
├── frontend/                            # 💻 FRONTEND USER INTERFACE & ASSETS
│   ├── index.html                       # Public Dashboard UI (Map, AI Cards, Chatbot, Reports)
│   ├── admin.html                       # Secret Admin Portal UI (Emergency Broadcast & Statuses)
│   ├── style.css                        # UI Dashboard Styling & Visual Components
│   ├── script.js                        # Client-Side Application Controller & Heatmap Engine
│   ├── translations.js                  # Regional Multilingual Dictionary (EN, HI, BN, MNI, MIZ)
│   ├── manifest.json                    # PWA Web Application Manifest
│   ├── sw.js                            # PWA Service Worker for Offline Disaster Access
│   └── uploads/                         # Directory for Citizen Incident Photo Uploads
│
├── data/                                # 📊 DATASETS & TRAINING DATA
│   └── landslide_data.csv               # 6-Feature Landslide & Meteorological Dataset
│
└── README.md                            # Comprehensive Project Documentation
```

---

## ✨ Key Features & Architecture

### 1. 🖥️ Modular Frontend (`frontend/`)
- **`index.html`**: Overview dashboard featuring AI risk score cards, Open-Meteo satellite indicators, AI model disclaimer notice, citizen incident form, and floating Safety & Prescription Chatbot.
- **`admin.html`**: Secret Admin Portal (`/secret-admin-portal`) accessible via session auth (`admin` / `password123`) for emergency SMS broadcasts, report verification, and deletion management.
- **`translations.js`**: Regional Multilingual Engine supporting **English**, **Hindi**, **Bengali**, **Manipuri (Meiteilon)**, and **Mizo**.
- **`script.js`**: Heatmap rendering controller, map marker manager, Leaflet radar layer handler, and API fetch client.
- **`manifest.json` & `sw.js`**: Progressive Web App (PWA) configuration with Service Worker caching for offline emergency operation.

### 2. ⚙️ Robust Backend (`backend/`)
- **`app.py`**: Flask server serving web assets, handling Open-Meteo satellite weather API requests, parsing multipart photo uploads, protecting admin routes (HTTP 401), and managing SQLite (`landslide.db`) database interactions.
- **`risk_engine.py`**: Random Forest Machine Learning pipeline processing 6 environmental parameters (`rainfall_24h`, `rainfall_3day`, `soil_moisture`, `slope`, `elevation`, `historical_landslides`).
- **`alerts.py`**: Priority warning generator creating actionable emergency advisories for citizens and NDRF responders.

---

## 🔌 Core API Endpoints

| Endpoint | Method | Component | Description |
| :--- | :--- | :--- | :--- |
| `/` | `GET` | Frontend | Serves main web application dashboard (`index.html`) |
| `/secret-admin-portal` | `GET` | Frontend | Serves Secret Admin Portal interface (`admin.html`) |
| `/api/info` | `GET` | Backend | System status and SQLite database metadata |
| `/api/risk` | `GET` | Backend & ML | Live satellite weather query & ML landslide risk prediction |
| `/api/locations` | `GET` | Backend | Risk assessment across 8 monitored Northeast India locations |
| `/api/reports` | `GET` / `POST` | Backend & DB | Retrieves or submits citizen incident reports with photo uploads |
| `/api/reports/export` | `GET` | Backend | Downloads all incident report records as a CSV file |
| `/api/admin/login` | `POST` | Backend & Admin | Authenticates admin session credentials (`admin` / `password123`) |
| `/api/admin/broadcast_alert` | `POST` | Backend & Admin | Emergency alert dispatcher to local NDRF & disaster control rooms |

---

## 🚀 How to Run the Project

1. **Navigate to the Backend Directory**:
   ```bash
   cd backend
   ```

2. **Run the Flask Application**:
   ```bash
   python app.py
   ```

3. **Access in Browser**:
   - **Public Dashboard**: `http://127.0.0.1:5000`
   - **Secret Admin Portal**: `http://127.0.0.1:5000/secret-admin-portal`
