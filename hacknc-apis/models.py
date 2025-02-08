from pydantic import BaseModel, EmailStr
from typing import List, Optional
from bson import ObjectId

class UserCreate(BaseModel):
    id: Optional[str] = None  
    username: str
    email: EmailStr
    password: str
    profile_pic: Optional[str] = None
    bio: Optional[str] = None
    communities: List[str] = []  
    servicesOffer: List[str] = []  
    servicesGive: List[str] = []  
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserCreate):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str


class Community(BaseModel):
    name: str
    description: Optional[str] = None
    creator_name: str  # User ID of the creator
    members: List[str] = []  # List of User IDs
    






    
