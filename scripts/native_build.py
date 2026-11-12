"""Guard compiler workspaces and bound compiler shutdown on Linux."""

from contextlib import contextmanager
import fcntl
import os
from pathlib import Path
import re
import signal
import subprocess
import threading


NATIVE_FILESYSTEMS = {"ext4", "ext3", "ext2", "btrfs", "xfs", "tmpfs", "zfs", "overlay"}


def filesystem_type(directory: Path) -> str:
    directory = directory.resolve()
    best = (0, "unknown")
    for line in Path("/proc/self/mountinfo").read_text().splitlines():
        fields, details = line.split(" - ", 1)
        mount = Path(re.sub(r"\\([0-7]{3})", lambda m: chr(int(m[1], 8)), fields.split()[4]))
        if directory == mount or mount in directory.parents:
            if len(str(mount)) >= best[0]:
                best = (len(str(mount)), details.split()[0])
    return best[1]


def require_native(directory: Path) -> Path:
    directory = directory.resolve()
    kind = filesystem_type(directory)
    if kind not in NATIVE_FILESYSTEMS:
        raise RuntimeError(f"Refusing compiler output on {kind}: {directory}. Use an ext4/native cache under /home.")
    return directory


def refuse_blocked_tasks(*scopes: Path) -> None:
    for item in Path("/proc").iterdir():
        if not item.name.isdigit():
            continue
        try:
            if item.stat().st_uid != os.getuid():
                continue
            if item.joinpath("stat").read_text().split(") ", 1)[1][0] != "D":
                continue
            directory = item.joinpath("cwd").readlink()
            if any(directory == scope or directory.is_relative_to(scope) for scope in scopes):
                raise RuntimeError(f"PID {item.name} is still blocked in this project's filesystem. Save work and restart before building again.")
        except OSError:
            continue


@contextmanager
def build_lock(directory: Path, name: str):
    directory = require_native(directory)
    directory.mkdir(parents=True, exist_ok=True)
    with (directory / f".{name}.lock").open("a") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError as error:
            raise RuntimeError(f"A build of {name} is already running in {directory}.") from error
        yield


def run_checked(command, *, cwd: Path, timeout: float = 180, env=None, capture_output=False, new_session=True):
    process = subprocess.Popen(command, cwd=cwd, env=env, start_new_session=new_session,
                               stdout=subprocess.PIPE if capture_output else None,
                               stderr=subprocess.PIPE if capture_output else None)
    handlers = {}
    if threading.current_thread() is threading.main_thread():
        def interrupted(signum, frame):
            raise InterruptedError(f"Build interrupted by signal {signum}")
        for sig in (signal.SIGTERM, signal.SIGHUP):
            handlers[sig] = signal.signal(sig, interrupted)
    try:
        stdout, stderr = process.communicate(timeout=timeout)
    except (subprocess.TimeoutExpired, KeyboardInterrupt, InterruptedError):
        # Further termination signals must not interrupt child cleanup.
        for sig in handlers:
            signal.signal(sig, signal.SIG_IGN)
        for sig in (signal.SIGTERM, signal.SIGKILL):
            try:
                if new_session:
                    os.killpg(process.pid, sig)
                else:
                    os.kill(process.pid, sig)
            except ProcessLookupError:
                break
            try:
                process.communicate(timeout=2)
                break
            except subprocess.TimeoutExpired:
                continue
        if process.poll() is None:
            raise RuntimeError(f"Compiler PID {process.pid} remains blocked in the kernel; stop further builds and restart the computer.")
        raise
    finally:
        for sig, handler in handlers.items():
            signal.signal(sig, handler)
    result = subprocess.CompletedProcess(command, process.returncode,
                                         stdout.decode(errors="replace") if stdout is not None else None,
                                         stderr.decode(errors="replace") if stderr is not None else None)
    result.check_returncode()
    return result
