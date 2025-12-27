from app.services.rag.retrieve import retrieve_context
from app.llm.groq import GroqLLM

def chat_with_repo(repo_id: str, question: str) -> str:
    results = retrieve_context(question, repo_id)

    if not results:
        return "I could not find this in the repository."

    context = "\n\n".join(
        f"[{r['metadata']['file_path']}]\n{r['text']}"
        for r in results
    )

    llm = GroqLLM()
    return llm.generate(question, context)
