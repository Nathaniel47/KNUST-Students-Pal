from pydantic import BaseModel


class Usercreate(BaseModel):
    mail: str
    id: int
    password: str

class UserResponse(Usercreate):

   class Config:
    from_attributes = True

class LoginSchema(BaseModel):
    mail: str
    id: int
    password: str