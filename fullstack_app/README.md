# 🚀 NexusTask: Full-Stack Web Application Starter Codebase

[![Python 3.10+](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.95%2B-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![SQLite](https://img.shields.io/badge/SQLite-SQLAlchemy-003B57.svg?logo=sqlite)](https://www.sqlite.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**NexusTask** is a production-ready, full-stack web application codebase designed to be easily shared, customized, and deployed. It combines an asynchronous **FastAPI REST backend**, **SQLite relational database storage** with SQLAlchemy ORM, **JWT authentication**, and a **glassmorphic interactive dashboard**.

---

## ✨ Features

- **Modern Responsive Dashboard**: Built with pure HTML5, Vanilla JavaScript, and Glassmorphism CSS styling. Includes Dark/Light mode theme switching.
- **RESTful API Architecture**: Built with FastAPI, Pydantic data schemas, and CORS security middleware.
- **Authentication & Security**: User registration, login, password hashing (`bcrypt`), and JWT Bearer token authorization.
- **Task & Project Management**: Full CRUD operations (Create, Read, Update, Delete) with search indexing, status tags, and priority filtering.
- **Interactive Analytics**: Stat cards, progress metrics, and real-time activity metrics.
- **Auto-Seeded Demo Mode**: Automatically creates a pre-populated demo user (`username: demo`, `password: password123`) so you can explore immediately.
- **Containerized Deployment**: Includes `Dockerfile` and `docker-compose.yml` for effortless container launch.

---

## 📁 Codebase Directory Structure

```text
fullstack_app/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py               # FastAPI App Entrypoint & Seed Data
│   │   ├── config.py             # App Configuration & Secret Keys
│   │   ├── database.py           # SQLAlchemy Engine & Session Setup
│   │   ├── models.py             # User & Task Database Models
│   │   ├── schemas.py            # Pydantic Request/Response Models
│   │   ├── auth.py               # Password Hashing & JWT Token Logic
│   │   └── routers/              # Endpoint Handlers
│   │       ├── auth_router.py    # Login, Register, Profile Endpoints
│   │       ├── tasks_router.py   # Task CRUD & Filtering Endpoints
│   │       └── analytics_router.py # System Analytics Endpoints
│   └── requirements.txt          # Python dependencies
├── frontend/
│   ├── index.html                # Modern Glassmorphism Dashboard UI
│   ├── css/
│   │   └── styles.css            # Custom Design System & CSS Variables
│   └── js/
│       ├── api.js                # API Fetch Client & Auth Handler
│       └── app.js                # DOM Event Handlers & State Controller
├── run.py                        # Unified Cross-Platform Launcher
├── Dockerfile                    # Multi-stage Docker Container Configuration
├── docker-compose.yml            # Docker Compose Orchestration
├── .gitignore                    # Version Control Exclusions
├── LICENSE                       # MIT License
└── README.md                     # Documentation
```

---

## ⚡ Quick Start Guide

### Option 1: Local Python Launch (Recommended)

1. Navigate to the `fullstack_app` directory:
   ```bash
   cd fullstack_app
   ```
2. Run the unified launcher script:
   ```bash
   python run.py
   ```
   *The script automatically installs missing python dependencies, initializes the database, starts the FastAPI server, and launches your browser to `http://localhost:8000`.*

### Option 2: Docker Container

1. Build and run with Docker Compose:
   ```bash
   docker-compose up --build
   ```
2. Open `http://localhost:8000` in your web browser.

---

## 🔑 Default Login Credentials

The application automatically seeds a demo account on first run:
- **Username**: `demo`
- **Password**: `password123`

You can also register a new custom user directly from the UI or via `/api/v1/auth/register`.

---

## 📖 API Documentation & Swagger UI

FastAPI automatically generates interactive API documentation. Once the server is running, visit:
- **Swagger Interactive UI**: `http://localhost:8000/docs`
- **ReDoc Documentation**: `http://localhost:8000/redoc`

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
