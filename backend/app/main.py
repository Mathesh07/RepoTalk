from fastapi import FastAPI
from app.api.v1.repository import router as repo_router
from app.api.v1.chat import router as chat_router

app = FastAPI(title="RepoTalk Backend")

app.include_router(repo_router)
app.include_router(chat_router)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.repository import router as repo_router
from app.api.v1.chat import router as chat_router

app = FastAPI(title="RepoTalk Backend")

# -------------------------------
# CORS Configuration
# -------------------------------
origins = [
    "http://localhost:5173",  # Vite frontend
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],
)

# -------------------------------
# Routers
# -------------------------------
app.include_router(repo_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")
