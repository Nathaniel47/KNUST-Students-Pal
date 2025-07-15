from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import models, schemas
from app.cores.utils import get_db
from app.cores.security import create_access_token, create_refresh_token

router = APIRouter()


@router.post("/login")
def login(user: schemas.LoginSchema, db: Session = Depends(get_db)):
    print(">>", repr(user.mail), repr(user.password))
    db_user = db.query(models.User).filter(models.User.mail == user.mail).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")

    # if not verify_password(user.password, db_user.hashed_password):
    if user.password != db_user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"sub": db_user.mail,
    "username": db_user.username})
    refresh_token = create_refresh_token({"sub": db_user.mail,
    "username": db_user.username})

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }