import os
from datetime import datetime
from telethon import TelegramClient
from app.database import SessionLocal
from app.models import Careerhub, Event
from app.telegram_scraper.config import api_id, api_hash, careerhub_channel, events_channel

# Single Telegram client (shared)
client = TelegramClient("scraper_session", api_id, api_hash)


# --- Tagging logic for CareerHub ---
def tag_message(text: str) -> str:
    text = text.lower()
    if 'full-time' in text or 'full time' in text:
        return 'Full-time Job'
    elif 'internship' in text:
        return 'Internship'
    elif 'part-time' in text or 'part time' in text:
        return 'Part-time Job'
    elif 'national service' in text:
        return 'National Service'
    else:
        return 'Uncategorized'


# --- CareerHub scraper ---
async def scrape_careerhub(limit: int = 20):
    db = SessionLocal()
    await client.start()

    async for message in client.iter_messages(careerhub_channel, limit=limit):
        if message.text:
            lines = message.text.strip().split("\n", 1)
            title = lines[0][:100]
            description = lines[1] if len(lines) > 1 else ""
            category = tag_message(message.text)

            # Handle optional image
            image_binary = None
            if message.photo:
                temp_path = f"temp/{message.id}.jpg"
                os.makedirs("temp", exist_ok=True)
                await client.download_media(message, temp_path)
                with open(temp_path, "rb") as f:
                    image_binary = f.read()
                os.remove(temp_path)

            # Avoid duplicates by title
            existing = db.query(Careerhub).filter_by(title=title).first()
            if not existing:
                opportunity = Careerhub(
                    title=title,
                    description=description,
                    category=category,
                    image_data=image_binary,
                    posted_at=datetime.utcnow()
                )
                db.add(opportunity)
                db.commit()

    db.close()


# --- Events scraper ---
async def scrape_events(limit: int = 20):
    db = SessionLocal()
    await client.start()

    async for message in client.iter_messages(events_channel, limit=limit):
        if message.text:
            exists = db.query(Event).filter_by(message_id=message.id).first()
            if not exists:
                new_event = Event(message_id=message.id, content=message.text)
                db.add(new_event)
                db.commit()

    db.close()


# --- Unified runner ---
if __name__ == "__main__":
    with client:
        client.loop.run_until_complete(scrape_careerhub())
        client.loop.run_until_complete(scrape_events())
