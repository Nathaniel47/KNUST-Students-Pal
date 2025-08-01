from .database import Base
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, func, Text, ForeignKey, LargeBinary


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    mail = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
    image = Column(LargeBinary, nullable=True)

class Update(Base):
    __tablename__ = "updates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    summary = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    image = Column(String, nullable=True)
    date = Column(String, nullable=True)
    link = Column(String, unique=True, nullable=False)
    category = Column(String, nullable=True)
    tag = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    is_urgent = Column(Boolean, default=False)
    is_trending = Column(Boolean, default=False)


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True)
    update_id = Column(Integer, ForeignKey("updates.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Like(Base):
    __tablename__ = "likes"
    id = Column(Integer, primary_key=True)
    update_id = Column(Integer, ForeignKey("updates.id"))
    user_id = Column(Integer, ForeignKey("users.id"))


class Careerhub(Base):
    __tablename__ = 'careerhub'
    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, nullable=False)
    title = Column(String)
    description = Column(Text)
    duration = Column(String, nullable=True)
    posted_at = Column(DateTime, default=datetime.utcnow)
