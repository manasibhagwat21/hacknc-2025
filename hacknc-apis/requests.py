from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
from database import users_collection, database
from bson import ObjectId
from models import MatchRequest, UpdateRequestStatus
from database import requests_collection
from datetime import datetime

router = APIRouter()

@router.post("/send-request")
async def send_match_request(data: MatchRequest):
    if data.meeting_date <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="Meeting date must be in the future")
    sender = await users_collection.find_one({"id": data.sender_id})
    receiver = await users_collection.find_one({"id": data.receiver_id})

    if not sender or not receiver:
        raise HTTPException(status_code=404, detail="Sender or Receiver not found")

    # Check if a request already exists
    existing_request = await requests_collection.find_one({
        "sender_id": data.sender_id,
        "receiver_id": data.receiver_id
    })
    
    if existing_request:
        raise HTTPException(status_code=400, detail="Request already sent")

    # Insert request into the database
    result = await requests_collection.insert_one({
        "sender_id": data.sender_id,
        "receiver_id": data.receiver_id,
        "meeting_date": data.meeting_date.isoformat(),
        "status": "pending"
    })

    return {"message": "Request sent successfully", "request_id": str(result.inserted_id)}

@router.post("/update-request")
async def update_request_status(data: UpdateRequestStatus):
    req = requests_collection.find_one({"sender_id": data.sender_id, "receiver_id": data.receiver_id, "status": "pending"})

    # Update request status
    await requests_collection.update_one(
        {"sender_id": data.sender_id, "receiver_id": data.receiver_id},
        {"$set": {"status": data.status}}
    )

    return {"message": f"Request {data.status} successfully"}

@router.get("/received-requests/{user_id}")
async def get_received_requests(user_id: int):
    requests = await requests_collection.find({"receiver_id": user_id, "status": "pending"}).to_list(length=100)
    return [{"request_id": str(req["_id"]), "sender_id": req["sender_id"], "status": req["status"]} for req in requests]
