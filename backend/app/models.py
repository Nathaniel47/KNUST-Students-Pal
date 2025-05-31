from .database import Base
from sqlalchemy import Column, String, Integer, Boolean


class User(Base):
    __tablename__ = "users"
    mail = Column(String, nullable=False)
    id = Column(Integer, primary_key=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    username = Column(String, nullable=False)
