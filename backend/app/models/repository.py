from pydantic import BaseModel

class RepoIngestRequest(BaseModel):
    repo_url: str

class RepoIngestResponse(BaseModel):
    repo_id: str
