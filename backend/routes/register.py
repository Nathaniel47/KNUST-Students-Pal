from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.cores.utils import get_db
from app.cores.security import hash_password, create_access_token, create_refresh_token

router = APIRouter(prefix="/auth", tags=["register"])


@router.post("/register")
def create_user(user: schemas.Usercreate, db: Session = Depends(get_db)):
    # Ensure the email is unique
    if db.query(models.User).filter(models.User.mail == user.mail).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with that e-mail already exists",
        )

    # Hash the password
    hashed_pw = hash_password(user.password)

    # Persist the user
    new_user = models.User(
        mail=user.mail,
        password=hashed_pw,
        id=user.id,
        username=user.username
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Create tokens using the same structure as login.py
    access_token = create_access_token({
        "sub": new_user.mail,
        "username": new_user.username
    })
    refresh_token = create_refresh_token({
        "sub": new_user.mail,
        "username": new_user.username
    })

    # Return tokens with token type
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }
