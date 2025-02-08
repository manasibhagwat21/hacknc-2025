from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community , JoinCommunityRequest
from database import users_collection, community_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta
import datetime
from bson import ObjectId

router = APIRouter()

#API to create a community
@router.post("/create", response_model=Community)
async def create_community(community: Community):
    existing_community = await community_collection.find_one({"name": community.name})
    if existing_community:
        raise HTTPException(status_code=400, detail="Community name already taken")

    community_data = community.dict()
    community_data["members"] = [community.creator_id]

    # Insert into MongoDB
    result = await community_collection.insert_one(community_data)
    community_data["id"] = str(result.inserted_id)  
    return Community(**community_data)

#API to join a community
@router.post("/join")
async def join_community(request: JoinCommunityRequest):
    # Check if community exists
    community = await community_collection.find_one({"name": request.community_name})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    user = await users_collection.find_one({"id": request.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if request.user_id in community["members"]:
        raise HTTPException(status_code=400, detail="User is already a member of this community")
    await community_collection.update_one(
        {"name": request.community_name},
        {"$push": {"members": str(request.user_id)}}
    )

    await users_collection.update_one(
        {"id": request.user_id},
        {"$push": {"communities": request.community_name}}
    )

    return {"message": "User successfully joined the community"}