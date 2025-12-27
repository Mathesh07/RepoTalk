from app.services.repo.cloner import clone_repo
from app.services.repo.loader import load_code_files
from app.services.repo.cleaner import cleanup_repo
from app.services.rag.splitter import split_code_files
from app.embeddings.manager import EmbeddingManager
from app.vectorstore.chroma import VectorStore


def ingest_github_repo(repo_url: str) -> str:
    repo_id, repo_path = clone_repo(repo_url)

    try:
        files = load_code_files(repo_path, repo_id)
        documents = split_code_files(files)

        # ✅ 1. FILTER EMPTY TEXTS FIRST
        valid_documents = [d for d in documents if d["text"].strip()]

        if not valid_documents:
            raise ValueError("No valid documents to embed")

        # ✅ 2. EMBED STRINGS ONLY
        texts = [d["text"] for d in valid_documents]

        embedder = EmbeddingManager()
        embeddings = embedder.generate(texts)

        # 🔍 DEBUG ONCE (remove later)
        print("Embedding sample sum:", sum(embeddings[0]))

        # ✅ 3. PASS MATCHED DOCS + EMBEDDINGS
        store = VectorStore()
        store.add_documents(valid_documents, embeddings)

    finally:
        cleanup_repo(repo_path)

    return repo_id
