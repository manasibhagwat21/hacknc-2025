from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Literal
from bson import ObjectId
from datetime import datetime

#Users
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
    preferences: List[str] = []
    
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserInDB(UserCreate):
    hashed_password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user_id:int

#Community
class Community(BaseModel):
    name: str
    description: Optional[str] = None
    creator_id: str  
    members: List[str] = []  
    
class JoinCommunityRequest(BaseModel):
    user_id: int  
    community_name: str 

#Skills
class UserSkillsUpdate(BaseModel):
    user_id: int 
    services: List[str]  

#Requests
class MatchRequest(BaseModel):
    sender_id: int
    receiver_id: int


class UpdateRequestStatus(BaseModel):
    sender_id: int
    receiver_id: int
    status: Literal["accepted", "rejected","pending"]
    
#Posts
class PostCreate(BaseModel):
    title: str
    content: str
    author_id: str  

class PostOut(PostCreate):
    id: str
    created_at: datetime
    comments: List[str] = [] 

#Post Comments
class CommentCreate(BaseModel):
    content: str
    author_id: str
    post_id: str

class CommentOut(CommentCreate):
    id: str
    created_at: datetime
    
class UpdateProfileRequest(BaseModel):
    user_id: int
    profile_pic: str = None  # Optional profile picture URL
    bio: str = None  # Optional bio