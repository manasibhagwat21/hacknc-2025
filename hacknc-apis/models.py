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
    servicesNeed: List[str] = []  
    
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
    creator_id: str  
    members: List[str] = []  
    
class JoinCommunityRequest(BaseModel):
    user_id: int  
    community_name: str 

class UserSkillsUpdate(BaseModel):
    user_id: int 
    services: List[str]  