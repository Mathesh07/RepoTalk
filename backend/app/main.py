from fastapi import FastAPI
from app.api.v1.repository import router as repo_router
from app.api.v1.chat import router as chat_router

app = FastAPI(title="RepoTalk Backend")

app.include_router(repo_router)
app.include_router(chat_router)
