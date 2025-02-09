from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community 
from database import users_collection, community_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta

router = APIRouter()

@router.post("/create", response_model=Community)
async def create_community(community: Community):
    existing_community = await community_collection.find_one({"name": community.name})
    if existing_community:
        raise HTTPException(status_code=400, detail="Community name already taken")

    community_data = community.dict()
    community_data["created_at"] = datetime.utcnow().isoformat()
    community_data["members"] = [community.creator_id]

    # Insert into MongoDB
    result = await community_collection.insert_one(community_data)
    community_data["id"] = str(result.inserted_id)  
    return Community(**community_data)

