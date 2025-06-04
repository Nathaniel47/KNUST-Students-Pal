from .database import Base
from sqlalchemy import Column, String, Integer, Boolean


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    mail = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    username = Column(String, unique=True, nullable=False)
