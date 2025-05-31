from fastapi import APIRouter, Depends, HTTPException

router = APIRouter(prefix="/announcements", tags=["ann"])