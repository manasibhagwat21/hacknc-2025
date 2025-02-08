from fastapi import FastAPI
from auth import router as auth_router
from community_auth import router as community_router
from posts import router as posts_router


app = FastAPI()

app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(community_router, prefix="/community", tags=["Community"])
app.include_router(posts_router, tags=["Posts"])


@app.get("/")
async def root():
    return {"message": "User Authentication API with FastAPI and MongoDB"}

