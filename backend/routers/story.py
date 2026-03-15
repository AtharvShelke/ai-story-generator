import uuid
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Cookie, Response, BackgroundTasks
from sqlalchemy.orm import Session

from db.database import get_db, SessionLocal
from models.story import Story, StoryNode
from models.job import StoryJob
from schemas.story import ( CompleteStoryResponse, CompleteStoryNodeResponse, CreateStoryRequest )
from schemas.job import StoryJobResponse
from core.story_generator import StoryGenerator


from core.dependencies import get_current_user_optional, get_current_user
from models.user import User
from typing import List

router = APIRouter(
    prefix="/stories",
    tags=["stories"]
)

def get_session_id(session_id:Optional[str] = Cookie(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

@router.post("/create", response_model=StoryJobResponse)
def create_story(
    request:CreateStoryRequest,
    background_tasks:BackgroundTasks,
    response:Response,
    session_id:str = Depends(get_session_id),
    db:Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user_optional)
):
    response.set_cookie(key="session_id", value=session_id, httponly=True)
    job_id = str(uuid.uuid4())
    job=StoryJob(
        job_id=job_id,
        session_id=session_id,
        theme=request.theme,
        status="pending"
    )
    db.add(job)
    db.commit()
    
    user_id = current_user.id if current_user else None

    background_tasks.add_task(
        generate_story_task,
        job_id=job_id,
        theme=request.theme,
        session_id=session_id,
        user_id=user_id
    )
    
    return job

def generate_story_task(job_id:str, theme:str, session_id:str, user_id: Optional[int] = None):
    db: Session = SessionLocal()
    try:
        job = db.query(StoryJob).filter(StoryJob.job_id == job_id).first()
        if not job:
            return
        try:
            job.status = "processing"
            db.commit()
            
            story = StoryGenerator.generate_story(db, session_id, theme, user_id)
            
            if user_id:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    user.points += 10
                    db.commit()
            
            job.story_id = story.id
            job.status = "completed"
            job.completed_at = datetime.now()
            db.commit()
        except Exception as e:
            job.status = "failed"
            job.completed_at = datetime.now()
            job.error = str(e)
            db.commit()
    finally:
        db.close()
        
@router.get("/me", response_model=List[CompleteStoryResponse])
def get_my_stories(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stories = db.query(Story).filter(Story.user_id == current_user.id).all()
    complete_stories = []
    for story in stories:
        try:
            complete_stories.append(build_complete_story_tree(db, story))
        except Exception:
            pass
    return complete_stories

@router.get("/{story_id}/complete", response_model=CompleteStoryResponse)
def get_complete_story(story_id: int, db:Session = Depends(get_db)):
    story = db.query(Story).filter(Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, details="Story not found")
    
    complete_story = build_complete_story_tree(db, story)
    
    return complete_story

def build_complete_story_tree(db:Session, story:Story)->CompleteStoryResponse:
    nodes = db.query(StoryNode).filter(StoryNode.story_id == story.id).all()
    node_dict = {}
    for node in nodes:
        node_response = CompleteStoryNodeResponse(
            id=node.id,
            content=node.content,
            is_ending=node.is_ending,
            is_winning_ending=node.is_winning_ending,
            options=node.options,
        )
        node_dict[node.id] = node_response
    
    root_node = next((node for node in nodes if node.is_root), None)
    if not root_node:
        raise HTTPException(status_code=500, detail="Story root node not found")
    
    return CompleteStoryResponse(
        id=story.id,
        title=story.title,
        session_id=story.session_id,
        created_at=story.created_at,
        root_node=node_dict[root_node.id],
        all_nodes=node_dict
    )