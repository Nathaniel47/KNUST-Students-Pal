import os
import asyncio
from datetime import datetime
from telethon import TelegramClient
from app.database import SessionLocal
from app.models import Careerhub, Event
from app.telegram_scraper.config import api_id, api_hash, careerhub_channel, events_channel

# Shared Telegram client
client = TelegramClient("scraper_session", api_id, api_hash)


# --- Helper: Save photo as bytes ---
async def get_photo_bytes(message, client) -> bytes | None:
    if not message.photo:
        return None
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"{message.id}.jpg")

    await client.download_media(message, temp_path)
    with open(temp_path, "rb") as f:
        data = f.read()
    os.remove(temp_path)
    return data


# --- Tagging logic for CareerHub ---
def tag_message(text: str) -> str:
    text = text.lower()
    if "full-time" in text or "full time" in text:
        return "Full-time Job"
    elif "internship" in text:
        return "Internship"
    elif "part-time" in text or "part time" in text:
        return "Part-time Job"
    elif "national service" in text:
        return "National Service"
    else:
        return "Uncategorized"


# --- CareerHub scraper ---
async def scrape_careerhub(limit: int = 20):
    await client.start()

    async for message in client.iter_messages(careerhub_channel, limit=limit):
        if not message.text:
            continue

        lines = message.text.strip().split("\n", 1)
        title = lines[0][:100]
        description = lines[1] if len(lines) > 1 else ""
        category = tag_message(message.text)

        # DB session
        with SessionLocal() as db:
            exists = db.query(Careerhub).filter_by(message_id=message.id).first()
            if exists:
                continue

            try:
                opportunity = Careerhub(
                    message_id=message.id,
                    title=title,
                    description=description,
                    category=category,
                    image_data=await get_photo_bytes(message, client),
                    posted_at=datetime.utcnow(),
                )
                db.add(opportunity)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Error saving CareerHub post {message.id}: {e}")


# --- Events scraper ---
async def scrape_events(limit: int = 20):
    await client.start()

    async for message in client.iter_messages(events_channel, limit=limit):
        if not message.text:
            continue

        with SessionLocal() as db:
            exists = db.query(Event).filter_by(message_id=message.id).first()
            if exists:
                continue

            try:
                new_event = Event(
                    message_id=message.id,
                    content=message.text,
                    created_at=datetime.utcnow(),
                )
                db.add(new_event)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"Error saving Event {message.id}: {e}")


# --- Unified runner ---
async def main():
    await scrape_careerhub()
    await scrape_events()


if __name__ == "__main__":
    asyncio.run(main())
