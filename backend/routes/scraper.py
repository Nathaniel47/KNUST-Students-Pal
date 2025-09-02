from fastapi import APIRouter
import asyncio
from app.telegram_scraper.scraper import scrape_careerhub, scrape_events

router = APIRouter()

@router.post("/scrape/careerhub")
def scrape_careerhub_endpoint():
    asyncio.run(scrape_careerhub())
    return {"status": "careerhub scraping complete"}

@router.post("/scrape/events")
def scrape_events_endpoint():
    asyncio.run(scrape_events())
    return {"status": "events scraping complete"}
