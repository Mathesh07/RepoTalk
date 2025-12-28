from fastapi import APIRouter
from app.services.chat_service import chat_with_repo
from app.models.chat import ChatRequest, ChatResponse

router = APIRouter(prefix="/chat", tags=["Chat"])

@router.post("", response_model=ChatResponse)
def chat(data: ChatRequest):
    print("Received chat request:", data)
    answer = chat_with_repo(data.repo_id, data.question)
    return {"answer": answer}
