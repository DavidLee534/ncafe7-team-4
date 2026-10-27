#!/usr/bin/env python3
"""Set a password once for a local seed member whose password is still 'not-set'."""

import base64
import getpass
import hashlib
import os
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import urlparse


def main() -> int:
    if len(sys.argv) != 2 or not re.fullmatch(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", sys.argv[1]):
        print("사용법: python3 scripts/activate-seed-member.py moka@ncafe.dev", file=sys.stderr)
        return 2
    email = sys.argv[1].lower()
    password = getpass.getpass("새 비밀번호 (8~72자): ")
    if not 8 <= len(password) <= 72 or password != getpass.getpass("새 비밀번호 확인: "):
        print("비밀번호 길이나 확인 입력을 확인해 주세요.", file=sys.stderr)
        return 2

    config = {}
    for line in (Path(__file__).resolve().parents[1] / "secret.properties").read_text().splitlines():
        if "=" in line and not line.lstrip().startswith("#"):
            key, value = line.split("=", 1)
            config[key.strip()] = value.strip()
    url = urlparse(config["DB_URL"].removeprefix("jdbc:"))
    if url.hostname not in ("localhost", "127.0.0.1"):
        print("이 스크립트는 로컬 DB에만 사용할 수 있습니다.", file=sys.stderr)
        return 2
    salt = os.urandom(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 120_000, dklen=32)
    encoded = "pbkdf2$120000$" + base64.b64encode(salt).decode() + "$" + base64.b64encode(digest).decode()
    sql = "UPDATE members SET password = '" + encoded + "', updated_at = current_timestamp WHERE lower(email) = '" + email + "' AND password = 'not-set' RETURNING email;\n"
    env = os.environ.copy()
    env["PGPASSWORD"] = config["DB_PASSWORD"]
    result = subprocess.run(
        ["psql", "-X", "-A", "-t", "-v", "ON_ERROR_STOP=1", "-h", url.hostname,
         "-p", str(url.port or 5432), "-U", "ncafe", "-d", url.path.lstrip("/")],
        input=sql, text=True, capture_output=True, env=env, check=False,
    )
    if result.returncode:
        print(result.stderr.strip(), file=sys.stderr)
        return result.returncode
    if email not in result.stdout.splitlines():
        print("해당 예시 회원이 없거나 이미 비밀번호가 설정돼 있습니다.", file=sys.stderr)
        return 1
    print(email + " 계정의 비밀번호가 설정됐습니다.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
