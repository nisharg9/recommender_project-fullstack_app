from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    username: Optional[str] = None

# Task Schemas
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = "General"
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Pending"
    due_date: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    due_date: Optional[str] = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Analytics Schema
class AnalyticsResponse(BaseModel):
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    high_priority_tasks: int
    completion_rate: float
