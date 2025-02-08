from pydantic import BaseModel, EmailStr
from typing import List, Optional
from bson import ObjectId
from datetime import datetime

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
    creator_id: str  # User ID of the creator
    members: List[str] = []  # List of User IDs
    
class JoinCommunityRequest(BaseModel):
    user_id: int  
    community_name: str 

# Pydantic models for posts
class PostCreate(BaseModel):
    title: str
    content: str
    author_id: str  

class PostOut(PostCreate):
    id: str
    created_at: datetime
    comments: List[str] = [] 

# Pydantic models for comments
class CommentCreate(BaseModel):
    content: str
    author_id: str
    post_id: str

class CommentOut(CommentCreate):
    id: str
    created_at: datetime