from fastapi import APIRouter, HTTPException, Depends, File, UploadFile, Form
from models import UserCreate, UserLogin, Token, Community , JoinCommunityRequest, UserSkillsUpdate, UpdateProfileRequest
from database import users_collection, community_collection
from utils import hash_password, verify_password, create_access_token
from datetime import timedelta
import datetime
from bson import ObjectId
import os

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


#API for finding matches
@router.get("/{user_id}/matches")
async def find_matches(user_id: int):
    # Find user by ID
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user_offers = user.get("servicesOffer", [])
    user_needs = user.get("servicesNeed", [])

    if not user_offers and not user_needs:
        return {"message": "No services listed to match"}

    # Find users whose `servicesNeed` match current user's `servicesOffer`
    offers_matched_users = await users_collection.find({
        "servicesNeed": {"$in": user_offers},
        "id": {"$ne": user_id}  # Exclude self from results
    }).to_list(length=100)

    # Find users whose `servicesOffer` match current user's `servicesNeed`
    needs_matched_users = await users_collection.find({
        "servicesOffer": {"$in": user_needs},
        "id": {"$ne": user_id}  # Exclude self from results
    }).to_list(length=100)

    # Format response
    matched_users = {
        "usersLookingForYourServices": [
            {"user_id": match["id"], "username": match["username"], "needs": list(set(user_offers) & set(match["servicesNeed"]))}
            for match in offers_matched_users
        ],
        "usersOfferingWhatYouNeed": [
            {"user_id": match["id"], "username": match["username"], "offers": list(set(user_needs) & set(match["servicesOffer"]))}
            for match in needs_matched_users
        ]
    }

    return matched_users

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/profile-setup/{user_id}")
async def update_user_profile(
    user_id: int,
    file: UploadFile = File(None), 
    bio: str = Form(None)  
):
    user = await users_collection.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    update_data = {}

    # ✅ Handle file upload if provided
    if file:
        file_path = f"{UPLOAD_DIR}/user_{user_id}_{file.filename}"
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
        update_data["profile_pic"] = f"/uploads/{file.filename}"  # ✅ Store relative path

    # ✅ Handle bio update if provided
    if bio:
        update_data["bio"] = bio.strip()

    # ✅ Update MongoDB
    if update_data:
        await users_collection.update_one({"id": user_id}, {"$set": update_data})

    return {"message": "Profile updated successfully", **update_data}