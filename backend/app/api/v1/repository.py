from fastapi import APIRouter
from app.services.rag.ingest import ingest_github_repo
from app.models.repository import RepoIngestRequest, RepoIngestResponse

router = APIRouter(prefix="/repo", tags=["Repository"])

@router.post("/ingest", response_model=RepoIngestResponse)
def ingest_repo(data: RepoIngestRequest):
    repo_id = ingest_github_repo(data.repo_url)
    return {"repo_id": repo_id}
