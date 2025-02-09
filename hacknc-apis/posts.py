from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel
from typing import List
from datetime import datetime
from bson import ObjectId
from models import PostOut, PostCreate, CommentOut, CommentCreate
from database import posts_collection, comments_collection

router = APIRouter()

# Helper functions to convert Mongo documents to Python dicts with string IDs
def post_helper(post: dict) -> dict:
    return {
        "id": str(post["_id"]),
        "title": post["title"],
        "content": post["content"],
        "author_id": post["author_id"],
        "community_id": post["community_id"],
        "created_at": post["created_at"],
        "comments": post.get("comments", []),
    }

def comment_helper(comment: dict) -> dict:
    return {
        "id": str(comment["_id"]),
        "content": comment["content"],
        "author_id": comment["author_id"],
        "post_id": comment["post_id"],
        "created_at": comment["created_at"],
    }



# Endpoint for creating a new post
@router.post("/posts", response_model=PostOut, status_code=status.HTTP_201_CREATED)
async def create_post(post: PostCreate):
    post_dict = post.dict()
    post_dict["created_at"] = datetime.utcnow()
    post_dict["comments"] = []  # start with an empty list of comment IDs
    result = await posts_collection.insert_one(post_dict)
    created_post = await posts_collection.find_one({"_id": result.inserted_id})
    return post_helper(created_post)

# Get all posts
@router.get("/posts", response_model=List[PostOut])
async def get_posts():
    posts = []
    async for post in posts_collection.find():
        posts.append(post_helper(post))
    return posts

# Get a single post by id
@router.get("/posts/{post_id}", response_model=PostOut)
async def get_post(post_id: str):
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID format")
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return post_helper(post)

# Create a comment on a post
@router.post("/posts/{post_id}/comments", response_model=CommentOut, status_code=status.HTTP_201_CREATED)
async def add_comment(post_id: str, comment: CommentCreate):
    # Ensure the post exists first
    try:
        post = await posts_collection.find_one({"_id": ObjectId(post_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid post ID format")
    if post is None:
        raise HTTPException(status_code=404, detail="Post not found")

    comment_dict = comment.dict()
    comment_dict["created_at"] = datetime.utcnow()
    result = await comments_collection.insert_one(comment_dict)
    new_comment = await comments_collection.find_one({"_id": result.inserted_id})

    # Optionally update the post document to include the new comment id
    await posts_collection.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"comments": str(result.inserted_id)}}
    )
    return comment_helper(new_comment)

# Get all comments for a given post
@router.get("/posts/{post_id}/comments", response_model=List[CommentOut])
async def get_comments(post_id: str):
    comments = []
    async for comment in comments_collection.find({"post_id": post_id}):
        comments.append(comment_helper(comment))
    return comments
