import uuid
import os
import tempfile
from git import Repo

def clone_repo(repo_url: str) -> tuple[str, str]:
    repo_id = str(uuid.uuid4())
    base_dir = tempfile.gettempdir()
    repo_path = os.path.join(base_dir, "repos", repo_id)

    os.makedirs(repo_path, exist_ok=True)

    Repo.clone_from(repo_url, repo_path, depth=1)
    return repo_id, repo_path
