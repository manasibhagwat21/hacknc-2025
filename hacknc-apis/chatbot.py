from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
from motor.motor_asyncio import AsyncIOMotorClient
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk
from nltk.corpus import stopwords
import re

# Download stopwords if not already done
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

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

async def preprocess_text(text):
    # Remove stop words and non-alphanumeric characters
    text = re.sub(r'\W', ' ', text)
    text = ' '.join(word for word in text.split() if word.lower() not in stop_words)
    return text

async def search_relevant_posts(query):
    query = await preprocess_text(query)
    
    # Fetch the latest 20 posts based on creation date
    posts_cursor = posts_collection.find().sort('creation_date', -1).limit(20)
    posts = []
    post_texts = []
    async for post in posts_cursor:
        post_content = await preprocess_text(post["content"])
        posts.append(post)
        post_texts.append(post_content)
    
    # Calculate similarity
    if post_texts:
        vectorizer = TfidfVectorizer().fit_transform([query] + post_texts)
        vectors = vectorizer.toarray()
        query_vector = vectors[0]
        post_vectors = vectors[1:]
        similarities = cosine_similarity([query_vector], post_vectors)[0]
        
        # Select posts with similarity greater than 0.3
        relevant_posts = [(post, similarity) for post, similarity in zip(posts, similarities) if similarity > 0.3]
        relevant_posts = sorted(relevant_posts, key=lambda x: x[1], reverse=True)[:5]
        
        return [post["content"] for post, _ in relevant_posts]
    else:
        return []

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

        return {"response": response}
    except Exception as e:
        raise Exception(f"Error generating response: {e}")
