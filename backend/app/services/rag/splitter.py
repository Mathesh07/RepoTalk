from langchain_text_splitters import RecursiveCharacterTextSplitter

def split_code_files(files: list[dict]) -> list[dict]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=800,
        chunk_overlap=150
    )

    documents = []

    for f in files:
        chunks = splitter.split_text(f["content"])
        for chunk in chunks:
            documents.append({
                "text": chunk,
                "metadata": {
                    "repo_id": f["repo_id"],
                    "file_path": f["path"]
                }
            })

    return documents
