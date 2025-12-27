from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from app.core.config import GROQ_API_KEY

class GroqLLM:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=GROQ_API_KEY,
            model="llama-3.1-8b-instant",
            temperature=0.1
        )

    def generate(self, question: str, context: str) -> str:
        prompt = f"""
You are a senior software engineer.

Rules:
- Answer ONLY using the provided code context.
- Mention file names when relevant.
- If the answer is not found, say:
  "I could not find this in the repository."

Code Context:
{context}

Question:
{question}

Answer:
"""
        return self.llm.invoke([HumanMessage(content=prompt)]).content
