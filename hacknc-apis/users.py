from fastapi import APIRouter, HTTPException, Depends
from models import UserCreate, UserLogin, Token, Community , JoinCommunityRequest, UserSkillsUpdate
from database import users_collection, community_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta
import datetime
from bson import ObjectId

router = APIRouter()

#API for updating services
@router.post("/update-services-give")
async def update_skills1(data: UserSkillsUpdate):
    user = await users_collection.find_one({"id": data.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"id": data.user_id},
        {"$set": {"servicesOffer": data.services}}
    )

    return {"message": "Skills updated successfully"}

@router.post("/update-services-need")
async def update_skills2(data: UserSkillsUpdate):
    user = await users_collection.find_one({"id": data.user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    await users_collection.update_one(
        {"id": data.user_id},
        {"$set": {"servicesNeed": data.services}}
    )

    return {"message": "Skills updated successfully"}

#API for viewing skills
@router.get("/{user_id}/skills")
async def get_user_skills(user_id: int):
    user = await users_collection.find_one({"id": user_id}, {"servicesOffer": 1, "_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user_id": user_id, "servicesOffer": user.get("servicesOffer", [])}

# @router.get("/all-skills")
# async def get_all_users_with_skills():
#     users = await users_collection.find({"skills": {"$exists": True, "$not": {"$size": 0}}}).to_list(length=100)
#     return [{"user_id": user["id"], "skills": user["skills"]} for user in users]