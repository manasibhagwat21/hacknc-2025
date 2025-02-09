from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community 
from database import users_collection, community_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()


