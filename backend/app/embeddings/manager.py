from sentence_transformers import SentenceTransformer
from app.core.config import EMBEDDING_MODEL

class EmbeddingManager:
    def __init__(self):
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        print("Loaded embedding model:", EMBEDDING_MODEL)
        emb = self.model.encode(["hello world"])
        print("Sanity embedding sum:", emb[0].sum())

    def generate(self, texts: list[str]):
        return self.model.encode(texts, show_progress_bar=False)
