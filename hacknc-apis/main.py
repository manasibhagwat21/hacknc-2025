from fastapi import FastAPI
from auth import router as auth_router
from posts import router as posts_router

from community import router as community_router
from users import router as users_router
from fastapi.middleware.cors import CORSMiddleware
from chatbot import ChatRequest, get_response

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/chat")
async def chat(chat_request: ChatRequest):
    try:
        # response = get_response(chat_request)
        # return {"response": response}
        response = await get_response(chat_request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(community_router, prefix="/community", tags=["Community"])
app.include_router(posts_router, tags=["Posts"])

app.include_router(users_router, prefix="/users", tags=["Users"])

@app.get("/")
async def root():
    return {"message": "User Authentication API with FastAPI and MongoDB"}

