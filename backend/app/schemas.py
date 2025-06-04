from pydantic import BaseModel


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

   class Config:
    from_attributes = True

class LoginSchema(BaseModel):
    mail: str
    password: str