"""AlgoPulse API entry point.  Run:  uvicorn app.main:app --reload"""
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app import models  # noqa: F401  (registers all tables on Base.metadata)
from app.config import settings
from app.database import Base, engine
from app.routers import auth, users


@asynccontextmanager
async def lifespan(_app: FastAPI):
    Base.metadata.create_all(bind=engine)  # creates missing tables on startup
    yield


app = FastAPI(
    title=settings.APP_NAME,
    description="Backend for the AlgoPulse DSA learning platform.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=False,  # we use the Authorization header, not cookies
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(_request: Request, _exc: SQLAlchemyError):
    return JSONResponse(status_code=500, content={"detail": "A database error occurred. Please try again."})


API_PREFIX = "/api"
app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(users.router, prefix=API_PREFIX)


@app.get(f"{API_PREFIX}/health", tags=["Health"])
def health():
    return {"status": "ok"}
