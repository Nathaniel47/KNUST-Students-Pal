from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import models, schemas
from app.cores.utils import get_db
from app.cores.security import hash_password

router = APIRouter(prefix="/users",    tags=["users"])


@router.post("/users", response_model= schemas.UserResponse)
def create_user(user: schemas.Usercreate, db: Session = Depends(get_db)):

  #Ensure the address is unique
    if db.query(models.User).filter_by(mail=user.mail).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with that e-mail already exists",
        )

    #Hash the password
    hashed_pw = hash_password(user.password)

    #Persist
    new_user = models.User(mail=user.mail, password=hashed_pw, id=user.id, username=user.username)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"msg": "User created successfully", "user": new_user.email}