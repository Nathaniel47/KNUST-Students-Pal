from datetime import datetime
import os
from telethon.sync import TelegramClient
from telethon.tl.types import Message
from telegram_scraper.config import api_id, api_hash, channel_username
from app.models import Careerhub
from app.database import SessionLocal


# Set up Telegram client
client = TelegramClient('scraper_session', api_id, api_hash)

# Tagging function to classify opportunities
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

# Scraper logic
async def scrape_opportunities():
    db = SessionLocal()
    await client.start()

    async for message in client.iter_messages(channel_username, limit=20):
        if message.text:
            lines = message.text.strip().split("\n", 1)
            title = lines[0][:100]
            description = lines[1] if len(lines) > 1 else ""
            category = tag_message(message.text)

            # Handle image if available
            image_binary = None
            if message.photo:
                temp_path = f"temp/{message.id}.jpg"
                os.makedirs("temp", exist_ok=True)
                await client.download_media(message, temp_path)
                with open(temp_path, 'rb') as f:
                    image_binary = f.read()
                os.remove(temp_path)  # Clean up

            # Avoid duplicates
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

# Run script
if __name__ == "__main__":
    with client:
        client.loop.run_until_complete(scrape_opportunities())
