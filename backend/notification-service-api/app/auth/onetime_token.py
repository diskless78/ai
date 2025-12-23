import base64
import json
import hmac
import hashlib
import time
import secrets
from typing import Callable

from fastapi import HTTPException, Request, status

from app.configs import config
from app.db.redis import is_nonce_used, mark_nonce_used


def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b"=").decode()


def _b64_decode(data: str) -> bytes:
    padding = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + padding)


def _sign(payload: bytes, secret: bytes) -> bytes:
    return hmac.new(secret, payload, hashlib.sha256).digest()


def create_token(
    issuer: str,
    audience: str,
    secret: str,
    ttl_seconds: int = 30,
) -> str:
    payload = {
        "iss": issuer,
        "aud": audience,
        "exp": int(time.time()) + ttl_seconds,
        "nonce": secrets.token_hex(16),  # 128-bit
    }

    payload_bytes = json.dumps(payload, separators=(",", ":")).encode()
    signature = _sign(payload_bytes, secret.encode())

    return _b64_encode(payload_bytes) + "." + _b64_encode(signature)


def verify_token(
    token: str,
    secret: str,
    is_nonce_used: Callable[[str], bool],
    mark_nonce_used: Callable[[str], None],
) -> dict:
    try:
        payload_b64, sig_b64 = token.split(".")
    except ValueError:
        raise ValueError("Invalid token format")

    payload_bytes = _b64_decode(payload_b64)

    signature = _b64_decode(sig_b64)

    expected_sig = _sign(payload_bytes, secret.encode())

    if not hmac.compare_digest(signature, expected_sig):
        raise ValueError("Invalid signature")

    payload = json.loads(payload_bytes)

    if payload["exp"] < int(time.time()):
        raise ValueError("Token expired")

    nonce = payload["nonce"]
    if is_nonce_used(nonce):
        raise ValueError("Replay detected")

    mark_nonce_used(nonce)

    return payload


async def internal_auth_dependency(request: Request):
    token = request.headers.get("X-Internal-Token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing internal token",
        )

    try:
        payload = verify_token(
            token=token,
            secret=config.INTERNAL_SECRET_KEY,
            is_nonce_used=is_nonce_used,
            mark_nonce_used=mark_nonce_used,
        )
        return payload

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
