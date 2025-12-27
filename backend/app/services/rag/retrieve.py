from app.embeddings.manager import EmbeddingManager
from app.vectorstore.chroma import VectorStore

def retrieve_context(query: str, repo_id: str, k: int = 8):
    embedder = EmbeddingManager()
    query_embedding = embedder.generate([query])[0]

    store = VectorStore()
    return store.similarity_search(query_embedding, k=k, repo_id=repo_id)
