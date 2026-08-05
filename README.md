# 🌐 NexusTask: Full-Stack Web Application Starter Codebase

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Cloud Run](https://img.shields.io/badge/Google_Cloud-Cloud_Run-4285F4.svg?logo=google-cloud&logoColor=white)](https://cloud.google.com/run)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy-003B57.svg?logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**NexusTask** is an enterprise-grade full-stack web application starter kit designed following modern software engineering best practices and Google Open Source documentation standards. It features an asynchronous **FastAPI REST API backend**, **SQLAlchemy ORM** database layer, **JWT authentication**, and a responsive **Glassmorphic web dashboard UI**.

---

## 📋 Table of Contents

- [Features](#-features)
- [Architecture & Tech Stack](#-architecture--tech-stack)
- [Quick Start Guide](#-quick-start-guide)
- [Google Cloud Deployment (Cloud Run)](#-google-cloud-deployment-cloud-run)
- [Google OAuth 2.0 Setup Guide](#-google-oauth-20-setup-guide)
- [API Documentation](#-api-documentation)
- [Directory Structure](#-directory-structure)
- [Contributing & Style Guide](#-contributing--style-guide)
- [License](#-license)

---

## ✨ Features

- **Modern Glassmorphic UI**: Responsive dashboard with Dark/Light theme switching, metric analytics cards, task boards, and smooth micro-animations.
- **RESTful API Architecture**: Asynchronous FastAPI endpoints with Pydantic validation and CORS security middleware.
- **Authentication & Security**: Built-in support for JWT bearer tokens, bcrypt password hashing, and user role management.
- **Database ORM**: SQLite relational storage with SQLAlchemy (ready to connect to Google Cloud SQL / PostgreSQL).
- **Google Cloud Platform Ready**: Pre-configured `Dockerfile` and setup for Google Cloud Run deployment.
- **Interactive Documentation**: Auto-generated Swagger UI and OpenAPI schemas.

---

## 🏗️ Architecture & Tech Stack

```text
[ Browser Dashboard ] ──(HTTP/REST + JWT)──► [ FastAPI Backend Server ] ──► [ SQLAlchemy ORM / Database ]
  • HTML5 / JS (ES6+)                                • Async Handlers            • SQLite / Cloud SQL
  • Glassmorphism CSS                                • Pydantic Schemas          • Automated Seed Data
```

- **Frontend**: HTML5, Vanilla JavaScript (ES6+), Modern CSS3 with Custom Variables.
- **Backend**: Python 3.10+, FastAPI, Uvicorn, Passlib, PyJWT.
- **Database**: SQLite / PostgreSQL / Google Cloud SQL via SQLAlchemy ORM.
- **DevOps**: Docker, Google Artifact Registry, Google Cloud Run.

---

## ⚡ Quick Start Guide

### Local Development Setup

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/nexustask-fullstack-app.git
   cd nexustask-fullstack-app
   ```

2. **Launch with Python**:
   ```bash
   python run.py
   ```
   *The launcher script will install missing dependencies, initialize the database, start the API server, and automatically open `http://localhost:8000` in your web browser.*

3. **Launch with Docker**:
   ```bash
   docker-compose up --build
   ```

---

## ☁️ Google Cloud Deployment (Cloud Run)

Deploy NexusTask to **Google Cloud Run** in minutes using the Google Cloud SDK (`gcloud` CLI):

### Prerequisites
- A Google Cloud Platform (GCP) account and active project.
- Installed [Google Cloud SDK](https://cloud.google.com/sdk/docs/install).

### Step-by-Step Cloud Run Deployment

1. **Authenticate with Google Cloud**:
   ```bash
   gcloud auth login
   gcloud config set project YOUR_GCP_PROJECT_ID
   ```

2. **Enable Required Google Cloud Services**:
   ```bash
   gcloud services enable run.googleapis.com artifactregistry.googleapis.com
   ```

3. **Build & Deploy Directly to Google Cloud Run**:
   ```bash
   gcloud run deploy nexustask-app \
     --source . \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

4. Once deployment finishes, `gcloud` will provide a public URL (e.g., `https://nexustask-app-xyz-uc.a.run.app`) where your app is live!

---

## 🔐 Google OAuth 2.0 Setup Guide

To enable "Sign In with Google":

1. Go to the [Google Cloud Console Credentials Page](https://console.cloud.google.com/apis/credentials).
2. Create an **OAuth 2.0 Client ID** (Application type: *Web application*).
3. Set Authorized JavaScript origins: `http://localhost:8000` and your Cloud Run URL.
4. Set Authorized redirect URIs: `http://localhost:8000/api/v1/auth/google/callback`.
5. Copy your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` into `backend/app/config.py` or as environment variables.

---

## 📖 API Documentation

FastAPI provides built-in interactive documentation:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc Specs**: `http://localhost:8000/redoc`

### Core Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Register a new user account |
| `POST` | `/api/v1/auth/login` | Authenticate user and issue JWT token |
| `GET` | `/api/v1/auth/me` | Fetch active user profile |
| `GET` | `/api/v1/tasks` | Get user task list (supports category & status filters) |
| `POST` | `/api/v1/tasks` | Create a new task entity |
| `PUT` | `/api/v1/tasks/{id}` | Update task details or status |
| `DELETE` | `/api/v1/tasks/{id}` | Remove task |
| `GET` | `/api/v1/analytics/summary` | Retrieve performance metrics |

---

## 📂 Directory Structure

```text
nexustask-fullstack-app/
├── backend/
│   ├── app/
│   │   ├── main.py               # FastAPI App Entrypoint & Seed Data
│   │   ├── config.py             # App Configuration & Secret Keys
│   │   ├── database.py           # SQLAlchemy Engine & Session Setup
│   │   ├── models.py             # User & Task Database Models
│   │   ├── schemas.py            # Pydantic Request/Response Models
│   │   ├── auth.py               # Password Hashing & JWT Security
│   │   └── routers/              # Endpoint Controllers
│   │       ├── auth_router.py    # Authentication Handlers
│   │       ├── tasks_router.py   # Task CRUD & Filter Handlers
│   │       └── analytics_router.py # System Analytics Handlers
│   └── requirements.txt          # Backend dependencies
├── frontend/
│   ├── index.html                # Glassmorphic Web UI Dashboard
│   ├── css/styles.css            # Responsive Styling & Theme System
│   └── js/
│       ├── api.js                # API Client & Token Management
│       └── app.js                # UI State & Interactive Controllers
├── run.py                        # Cross-Platform Launcher Script
├── Dockerfile                    # Container definition for GCP Cloud Run
├── docker-compose.yml            # Local Docker Compose setup
├── .gitignore                    # Git tracking rules
├── LICENSE                       # MIT License
└── README.md                     # Documentation
```

---

## 🤝 Contributing & Style Guide

Contributions follow [Google's Open Source Guidelines](https://google.github.io/styleguide/):
1. Fork the Repository.
2. Create a Feature Branch (`git checkout -b feature/amazing-feature`).
3. Follow PEP 8 for Python code formatting.
4. Commit your changes (`git commit -m 'Add amazing feature'`).
5. Push to the Branch (`git push origin feature/amazing-feature`).
6. Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
