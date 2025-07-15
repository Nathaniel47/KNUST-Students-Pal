# app/crud.py
from sqlalchemy.orm import Session
from app.models import Update
from sqlalchemy.exc import IntegrityError


def save_update_if_new(db: Session, data: dict):
    existing = db.query(Update).filter_by(link=data["link"]).first()
    if existing:
        return None
    update = Update(**data)
    db.add(update)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
    db.refresh(update)
    return update