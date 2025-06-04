from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base
from app import models, database
from routes.login import router as login_router
from routes.register import router as signup_router
from routes import all_routers

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
app.include_router(login_router)
app.include_router(signup_router)

import socket
ip = socket.gethostbyname(socket.gethostname())
print(f"Your server is running on: http://{ip}:8000")
