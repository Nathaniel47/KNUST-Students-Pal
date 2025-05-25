from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import database, models, schemas
from app.hashing import hash_password, verify_password

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/users", response_model= schemas.UserResponse)
def create_user(user: schemas.Usercreate, db: Session = Depends(get_db)):

  # 1️⃣  Ensure the address is unique
    if db.query(models.User).filter_by(mail=user.mail).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with that e-mail already exists",
        )

    # 2️⃣  Hash the password
    hashed_pw = hash_password(user.password)

    # 3️⃣  Persist
    new_user = models.User(mail=user.mail, password=hashed_pw, id=user.id)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)