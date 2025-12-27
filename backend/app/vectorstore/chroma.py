import uuid
from pinecone import Pinecone
from app.core.config import PINECONE_API_KEY, PINECONE_INDEX_NAME


class VectorStore:
    def __init__(self):
        self.pc = Pinecone(api_key=PINECONE_API_KEY)

        if not PINECONE_INDEX_NAME:
            raise ValueError("PINECONE_INDEX_NAME must be set and non-empty")

        self.index = self.pc.Index(PINECONE_INDEX_NAME)

    def add_documents(self, documents, embeddings):
        vectors = []

        for doc, emb in zip(documents, embeddings):
            text = doc["text"].strip()
            # 🚨 1. Skip empty text
            if not text:
                continue

            emb_list = emb.tolist()

            # 🚨 2. Skip zero vectors (Pinecone requirement)
            if not any(emb_list):
                print("Skipping zero vector")
                continue

            vectors.append((
                str(uuid.uuid4()),
                emb_list,
                {
                    "text": text,
                    **doc["metadata"]
                }
            ))

        # 🚨 3. Only upsert if something valid exists
        print(len(vectors), "vectors to upsert")
        if vectors:
            self.index.upsert(vectors=vectors)

    def similarity_search(self, embedding, k=8, repo_id=None):
        pinecone_filter = {"repo_id": repo_id} if repo_id else None
        results = self.index.query(
            vector=embedding.tolist(),
            top_k=k,
            include_metadata=True,
            filter=pinecone_filter
        )
        print(results)
        matches = results.get("matches", [])
        print(f"Found {len(matches)} similar documents")

        return [
            {
                "text": match["metadata"].get("text", ""),
                "metadata": {
                    k: v for k, v in match["metadata"].items() if k != "text"
                }
            }
            for match in matches
        ]
