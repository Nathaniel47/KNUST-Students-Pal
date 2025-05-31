from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/chatbot", tags=["chatbot"])