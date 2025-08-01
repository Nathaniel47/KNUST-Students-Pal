from app.database import SessionLocal
from app.models import Update  # Adjust if your model is elsewhere

DEFAULT_IMAGE_URL = "http://10.132.144.245:8000/static/announcement_default.png"

db = SessionLocal()

try:
    announcements = db.query(Update).filter(Update.tag == "announcements").all()
    updated = 0

    for ann in announcements:
            ann.image = DEFAULT_IMAGE_URL
            updated += 1

    db.commit()
    print(f"✅ Added default image to {updated} announcements.")
finally:
    db.close()
