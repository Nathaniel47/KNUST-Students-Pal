from fastapi import APIRouter, HTTPException,Depends
from sqlalchemy.orm import Session
from fastapi import Depends
from app.cores.utils import get_db
from app.models import Update, Comment, Like, User
from app.schemas import CommentResponse, LikeWithUser
from typing import List



router = APIRouter(prefix="/updates", tags=["updates"])

@router.get("/news")
def get_news(db: Session = Depends(get_db)):
    return db.query(Update).filter(Update.tag.ilike("news")).order_by(Update.created_at.desc()).all()

@router.get("/announcements")
def get_announcements(db: Session = Depends(get_db)):
    return db.query(Update).filter(Update.tag.ilike("announcements")).order_by(Update.created_at.desc()).all()

@router.get("/events")
def get_events(db: Session = Depends(get_db)):
    return db.query(Update).filter(Update.tag.ilike("events")).order_by(Update.created_at.desc()).all()

@router.get("/all")
def get_all(db: Session = Depends(get_db)):
    try:
        updates = db.query(Update).order_by(Update.created_at.desc()).all()

        return updates

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

# Get all comments for an update
@router.get("/{update_id}/comments", response_model=list[CommentResponse])
def get_comments_for_update(update_id: int, db: Session = Depends(get_db)):
    comments = db.query(Comment).filter(Comment.update_id == update_id).order_by(Comment.created_at.desc()).all()
    return comments


# Get all likes for an update (as user list)
@router.get("/likes/{update_id}", response_model=List[LikeWithUser])
def get_likes(update_id: int, db: Session = Depends(get_db)):
    likes = db.query(Like, User).join(User, Like.user_id == User.id).filter(Like.update_id == update_id).all()
    return [
        LikeWithUser(
            id=like.id,
            update_id=like.update_id,
            user_id=user.id,
            username=user.username,
            image=user.image.decode() if user.image else None
        )
        for like, user in likes
    ]


# Get all the like count
@router.get("/{update_id}/likes/count")
def get_likes_count(update_id: int, db: Session = Depends(get_db)):
    count = db.query(Like).filter(Like.update_id == update_id).count()
    return {"update_id": update_id, "like_count": count}


    
 