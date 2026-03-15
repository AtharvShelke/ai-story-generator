from typing import List, Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import desc

from db.database import get_db
from models.user import User
from schemas.user import UserResponse

router = APIRouter(prefix="/leaderboard", tags=["leaderboard"])

@router.get("/top/{limit}", response_model=List[UserResponse])
def get_leaderboard(limit: int = 10, db: Session = Depends(get_db)) -> Any:
    """
    Get top N users ordered by points descending. Use limit=3 for podium, limit=10 for full top list.
    """
    if limit > 50:
        limit = 50
        
    users = db.query(User).order_by(desc(User.points)).limit(limit).all()
    return users
