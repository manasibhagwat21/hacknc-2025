from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community 
from database import users_collection, community_collection,get_next_user_id, posts_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

#API for signup
@router.post("/signup", response_model=Token)
async def signup(user: UserCreate):
    # Check if user already exists
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Generate auto-incremented user ID
    user_id = await get_next_user_id()

    # Hash password and prepare user data
    user_data = user.dict()
    user_data["id"] = user_id  # Assign auto-increment ID
    user_data["hashed_password"] = hash_password(user_data.pop("password"))

    # Insert into MongoDB
    await users_collection.insert_one(user_data)

    # Generate access token
    access_token = create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=30))
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    print(db_user)

    return {"access_token": access_token, "token_type": "bearer","user_id": db_user["id"]}

#API for login
@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    access_token = create_access_token({"sub": user.email}, expires_delta=timedelta(minutes=30))
    return {"access_token": access_token, "token_type": "bearer","user_id": db_user["id"]}

