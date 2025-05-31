from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/scraper",  tags=["scraper"])