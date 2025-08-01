from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Usercreate(BaseModel):
    mail: str
    id: int
    password: str
    username: str

class UserResponse(BaseModel):
   id: int
   mail: str
   username: str
   msg: str
   image: Optional[str] = None

   class Config:
    from_attributes = True

class LoginSchema(BaseModel):
    mail: str
    password: str

class CommentBase(BaseModel):
    update_id: int
    user_id: int
    content: str

class CommentCreate(CommentBase):
    pass

class CommentResponse(CommentBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class LikeBase(BaseModel):
    update_id: int
    user_id: int

class LikeCreate(LikeBase):
    pass  

class LikeWithUser(BaseModel):
    id: int
    update_id: int
    user_id: int
    username: str
    image: Optional[str] = None

    class Config:
        from_attributes = True


class UserImageUpdate(BaseModel):
    image: str  # Base64 encoded string

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str


class BulletinBase(BaseModel):
    message: str
    tag: str

class BulletinCreate(BulletinBase):
    pass

class BulletinOut(BulletinBase):
    id: int

    class Config:
       from_attributes = True