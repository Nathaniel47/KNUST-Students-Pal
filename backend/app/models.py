from .database import Base
from sqlalchemy import Column, String, Integer, Boolean


class User(Base):
    __tablename__ = "users"
    mail = Column(String, null=False)
    id = Column(Integer, primary_key=True, index=True, null=False)
    password = Column(String, null=False)
