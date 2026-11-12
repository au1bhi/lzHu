"""Compile standalone CVs without creating TeX intermediates on NTFS."""

from contextlib import contextmanager
import hashlib
import os
from pathlib import Path
import shutil
import tempfile

from native_build import build_lock, require_native, run_checked, refuse_blocked_tasks


@contextmanager
def compiled_cv(source: Path, language: str):
    cache = require_native(Path(os.environ.get("XDG_CACHE_HOME", str(Path.home() / ".cache"))) / "lzhu-cv-build")
    refuse_blocked_tasks(cache)
    key = hashlib.sha256(str(source.resolve()).encode()).hexdigest()[:16]
    with build_lock(cache, key):
        workspace = Path(tempfile.mkdtemp(prefix=f"{key}-", dir=cache))
        try:
            shutil.copyfile(source, workspace / source.name)
            run_checked(['latexmk', '-norc', '-xelatex' if language == 'zh' else '-pdf',
                         '-interaction=nonstopmode', '-halt-on-error', source.name],
                        cwd=workspace, timeout=180, capture_output=True,
                        env=dict(os.environ, TMPDIR=str(workspace)))
            yield workspace / f'{source.stem}.pdf'
        except BaseException:
            # Preserve failed diagnostics; never recursively clean a workspace
            # while a compiler may still be blocked in the kernel.
            print(f'CV build diagnostics retained in {workspace}')
            raise
        else:
            shutil.rmtree(workspace)
