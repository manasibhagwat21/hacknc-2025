from fastapi import FastAPI
from auth import router as auth_router
from community import router as community_router
from users import router as users_router
from sharereq import router as requests_router
from posts import router as posts_router
from chatbot import router as chatbot_router

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(community_router, prefix="/community", tags=["Community"])
app.include_router(users_router, prefix="/users", tags=["Users"])
app.include_router(requests_router, prefix="/requests", tags=["Requests"])
app.include_router(posts_router, tags=["Posts"])
app.include_router(chatbot_router, tags=["Chatbot"])


@app.get("/")
async def root():
    return {"message": "User Authentication API with FastAPI and MongoDB"}
