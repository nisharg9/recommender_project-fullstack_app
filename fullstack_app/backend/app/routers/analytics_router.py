from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import models, schemas, auth
from app.database import get_db

router = APIRouter(prefix="/api/v1/analytics", tags=["Analytics"])

@router.get("/summary", response_model=schemas.AnalyticsResponse)
def get_analytics_summary(
    current_user: models.User = Depends(auth.get_current_user),
    db: Session = Depends(get_db)
):
    tasks = db.query(models.Task).filter(models.Task.owner_id == current_user.id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status == "Completed")
    pending_tasks = sum(1 for t in tasks if t.status == "Pending")
    in_progress_tasks = sum(1 for t in tasks if t.status == "In Progress")
    high_priority_tasks = sum(1 for t in tasks if t.priority in ["High", "Urgent"])
    
    completion_rate = round((completed_tasks / total_tasks * 100), 1) if total_tasks > 0 else 0.0

    return {
        "total_tasks": total_tasks,
        "completed_tasks": completed_tasks,
        "pending_tasks": pending_tasks,
        "in_progress_tasks": in_progress_tasks,
        "high_priority_tasks": high_priority_tasks,
        "completion_rate": completion_rate
    }
