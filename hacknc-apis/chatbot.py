from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from motor.motor_asyncio import AsyncIOMotorClient

# Initialize the DialoGPT model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

class ChatRequest(BaseModel):
    text: str

# MongoDB setup
MONGO_URL = "mongodb+srv://user123:user123@cluster0.omcml.mongodb.net/"
DB_NAME = "users"
client = AsyncIOMotorClient(MONGO_URL)
database = client[DB_NAME]
posts_collection = database["posts"]

async def search_relevant_posts(query):
    search_query = {"content": {"$regex": query, "$options": "i"}}  # Case-insensitive search
    posts_cursor = posts_collection.find(search_query)
    posts = []
    async for post in posts_cursor:
        posts.append(post["content"])
    return posts

async def get_response(chat_request: ChatRequest):
    try:
        # Tokenize input text
        inputs = tokenizer.encode(chat_request.text + tokenizer.eos_token, return_tensors="pt")

        # Generate response using the model
        chat_history_ids = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id)

        # Decode the generated text
        response = tokenizer.decode(chat_history_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True)

        # Search for relevant posts in the database
        relevant_posts = await search_relevant_posts(chat_request.text)
        if relevant_posts:
            response += "\n\nHere are some related posts from our community:\n"
            for post in relevant_posts:
                response += f"- {post}\n"

        return {"response": response}  # Ensure the response is a dictionary
    except Exception as e:
        raise Exception(f"Error generating response: {e}")
