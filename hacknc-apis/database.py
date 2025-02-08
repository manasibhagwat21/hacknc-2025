from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb+srv://user123:user123@cluster0.omcml.mongodb.net/" 
DB_NAME = "users"

client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]
users_collection = database["users"]
community_collection = database["communities"]
counters_collection = database["counters"]

async def get_next_user_id():
    result = await counters_collection.find_one_and_update(
        {"_id": "user_id"},
        {"$inc": {"sequence_value": 1}},  # Increment the counter
        return_document=True
    )
    return result["sequence_value"]

