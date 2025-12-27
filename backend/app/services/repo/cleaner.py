import os
import shutil
import stat

def _on_rm_error(func, path, exc_info):
    try:
        os.chmod(path, stat.S_IWRITE)
        func(path)
    except Exception:
        pass

def cleanup_repo(repo_path: str):
    if os.path.exists(repo_path):
        shutil.rmtree(repo_path, onerror=_on_rm_error)
