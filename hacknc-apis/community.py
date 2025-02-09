from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community , JoinCommunityRequest
from database import users_collection, community_collection, posts_collection
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

#API to fetch communities of a user
@router.get("/joined-communities/{user_id}")
async def get_user_communities(user_id: int):
    # Find the user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get community names directly
    community_names = user.get("communities", [])

    if not community_names:
        return {"user_id": user_id, "joined_communities": []}

    # Fetch community details by name
    communities = await community_collection.find({"name": {"$in": community_names}}).to_list(length=100)

    # Convert `_id` from ObjectId to string
    for community in communities:
        community["_id"] = str(community["_id"])

    return {"user_id": user_id, "joined_communities": communities}


#API to fetch communities that are available to join
@router.get("/available-communities/{user_id}")
async def get_available_communities(user_id: int):
    # Find the user
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Get communities the user has joined (stored as names)
    joined_community_names = user.get("communities", [])

    # Get communities created by the user (exclude them)
    user_created_communities = await community_collection.find({"creator_id": user_id}).to_list(length=100)
    
    # Extract community names from creator's communities
    created_community_names = [community["name"] for community in user_created_communities]

    # Get communities that the user has NOT joined and NOT created
    available_communities = await community_collection.find({
        "name": {"$nin": joined_community_names + created_community_names}
    }).to_list(length=100)

    # Convert `_id` ObjectId to string for proper JSON response
    for community in available_communities:
        community["_id"] = str(community["_id"])

    return {"user_id": user_id, "available_communities": available_communities}

@router.get("/posts/{community_id}")
async def get_community_posts(community_id: str):
    # Validate if the community exists
    community = await community_collection.find_one({"_id": ObjectId(community_id)})
    if not community:
        raise HTTPException(status_code=404, detail="Community not found")

    # Fetch posts for this community
    posts = await posts_collection.find({"community_id": community_id}).to_list(length=100)

    # Convert ObjectId to string for response
    for post in posts:
        post["_id"] = str(post["_id"])
        post["community_id"] = str(post["community_id"])

    return {"community": community["name"], "posts": posts}