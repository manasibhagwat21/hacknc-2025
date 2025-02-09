from pydantic import BaseModel
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

# Initialize the DialoGPT model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("microsoft/DialoGPT-medium")
model = AutoModelForCausalLM.from_pretrained("microsoft/DialoGPT-medium")

class ChatRequest(BaseModel):
    text: str

def get_response(chat_request: ChatRequest):
    # Tokenize input text
    inputs = tokenizer.encode(chat_request.text + tokenizer.eos_token, return_tensors="pt")
    # Generate response using the model
    chat_history_ids = model.generate(inputs, max_length=1000, pad_token_id=tokenizer.eos_token_id)
    # Decode and return the generated text
    response = tokenizer.decode(chat_history_ids[:, inputs.shape[-1]:][0], skip_special_tokens=True)
    return response
