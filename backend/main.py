from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base
from app import models, database
from routes.login import router as login_router
from routes import all_routers

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="KNUST Students Pal API")

origins = [
    "http://localhost",
    "http://127.0.0.1:3000",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

for router in all_routers:
    app.include_router(router)