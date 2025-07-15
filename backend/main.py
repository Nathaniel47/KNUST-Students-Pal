from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base
from app import models, database
import logging

# Configure global logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Logs to a file in your project root
        logging.StreamHandler()         # Also logs to the terminal
    ]
)


from routes.auth import router as auth_router
from routes.updates import router as updates_router
from app.cores.scraper_utils import sync_updates
# from routes.chatbot import router as chatbot_router


app = FastAPI(title="KNUST Students Pal API")

models.Base.metadata.create_all(bind=database.engine)

# origins = [
#     "http://localhost",
#     "http://127.0.0.1:3000",
#     "http://192.168.1.59:8000",
#     "http://192.168.1.59",
# ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

# for router in all_routers:
app.include_router(auth_router)
app.include_router(updates_router)
# app.include_router(chatbot_router)




# Run sync_updates at startup
@app.on_event("startup")
def run_sync_on_startup():
    logging.info("🚀 Running sync_updates at startup...")
    sync_updates()

import socket
ip = socket.gethostbyname(socket.gethostname())
logging.info(f"🌐 Your server is running on: http://{ip}:8000")

