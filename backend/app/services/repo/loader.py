import os

IGNORE_DIRS = {
    ".git", "node_modules", "dist", "build",
    "__pycache__", ".venv"
}

ALLOWED_EXTENSIONS = {
    ".py", ".js", ".jsx", ".ts", ".tsx",
    ".java", ".go", ".md"
}

def load_code_files(repo_path: str, repo_id: str) -> list[dict]:
    files = []

    for root, dirs, filenames in os.walk(repo_path):
        dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]

        for filename in filenames:
            ext = os.path.splitext(filename)[1]
            if ext not in ALLOWED_EXTENSIONS:
                continue

            full_path = os.path.join(root, filename)

            try:
                with open(full_path, encoding="utf-8", errors="ignore") as f:
                    content = f.read()

                files.append({
                    "repo_id": repo_id,
                    "path": full_path.replace(repo_path, ""),
                    "content": content
                })
            except Exception:
                continue

    return files
