from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.deviations import router as deviation_router
from app.database import engine, Base
from app import models

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AIVOA Deviation Management API",
    description="AI-powered pharmaceutical deviation intake system"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(deviation_router)


@app.get("/")
def home():
    return {
        "message": "AIVOA Deviation Management API is running"
    }