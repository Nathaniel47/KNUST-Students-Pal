# routes/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models import User
from app.schemas import UserImageUpdate, UserResponse
from app.cores.utils import get_db
import base64

router = APIRouter(prefix="/users", tags=["users"])

# Retrieve user profile information
@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Upload user image
@router.patch("/{user_id}/upload-image")
def upload_user_image(user_id: int, payload: UserImageUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    try:
        user.image = base64.b64decode(payload.image)
        db.commit()
        return {"message": "Image uploaded successfully"}
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid base64 image string")
