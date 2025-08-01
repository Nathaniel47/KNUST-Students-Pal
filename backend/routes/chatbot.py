import sys
import os
import logging

# Append the pal folder to sys.path to import pal.py
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../pal")))

from pal import get_bot_response  # now imported from pal/pal.py
from fastapi import APIRouter
from app.schemas import ChatRequest, ChatResponse

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/chatbot", tags=["chatbot"])

@router.post("/", response_model=ChatResponse)
async def chat(chat_input: ChatRequest):
    user_message = chat_input.message
    logger.info(f"Received message: {user_message}")  # Log incoming message

    try:
        response = get_bot_response(user_message)
        logger.info(f"Chatbot response: {response}")  # Log response
        return ChatResponse(response=response)
    except Exception as e:
        logger.error(f"Error while generating response: {str(e)}")
        return ChatResponse(response="Something went wrong. Please try again.")
