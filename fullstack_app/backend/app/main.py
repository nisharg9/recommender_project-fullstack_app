from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.config import settings
from app.database import engine, Base, SessionLocal
from app import models, auth
from app.routers import auth_router, tasks_router, analytics_router

# Create Database tables automatically on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Enterprise Task & Project Management REST API with JWT Authentication and SQLite Database"
)

# CORS Middleware (allows frontend integration)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(auth_router.router)
app.include_router(tasks_router.router)
app.include_router(analytics_router.router)

# Seed initial demo data if database is brand new
@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        user_count = db.query(models.User).count()
        if user_count == 0:
            demo_user = models.User(
                username="demo",
                email="demo@example.com",
                full_name="Demo Developer",
                hashed_password=auth.get_password_hash("password123")
            )
            db.add(demo_user)
            db.commit()
            db.refresh(demo_user)

            demo_tasks = [
                models.Task(
                    title="Design Responsive UI System",
                    description="Create modern glassmorphism UI components with dynamic gradient cards.",
                    category="Frontend",
                    priority="High",
                    status="Completed",
                    owner_id=demo_user.id
                ),
                models.Task(
                    title="Build FastAPI REST Endpoints",
                    description="Implement JWT authentication, task CRUD endpoints, and Pydantic schemas.",
                    category="Backend",
                    priority="High",
                    status="Completed",
                    owner_id=demo_user.id
                ),
                models.Task(
                    title="Integrate SQLite Database",
                    description="Set up SQLAlchemy ORM models, migrations, and persistent storage.",
                    category="Database",
                    priority="Medium",
                    status="In Progress",
                    owner_id=demo_user.id
                ),
                models.Task(
                    title="Setup Docker & Deployment",
                    description="Configure multi-stage Docker build and docker-compose script for quick setup.",
                    category="DevOps",
                    priority="Low",
                    status="Pending",
                    owner_id=demo_user.id
                )
            ]
            db.add_all(demo_tasks)
            db.commit()
            print("[INFO] Seeded demo user (username: demo, password: password123) and sample tasks.")
    finally:
        db.close()

# Mount frontend static directory if exists
frontend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "frontend"))
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=os.path.join(frontend_dir, "css")), name="static")

@app.get("/health", tags=["System"])
def health_check():
    return {"status": "online", "version": settings.PROJECT_VERSION}

@app.get("/", tags=["System"])
def root_redirect():
    index_file = os.path.join(frontend_dir, "index.html")
    if os.path.exists(index_file):
        return FileResponse(index_file)
    return {"message": "NexusTask API is running. Visit /docs for API documentation."}
