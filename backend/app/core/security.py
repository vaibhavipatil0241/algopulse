"""Password hashing (Argon2) and JWT helpers."""
import uuid
from datetime import datetime, timedelta, timezone

import jwt
from pwdlib import PasswordHash

from app.config import settings

# PasswordHash.recommended() = Argon2id with safe defaults.
_password_hash = PasswordHash.recommended()


def hash_password(plain_password: str) -> str:
    return _password_hash.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return _password_hash.verify(plain_password, hashed_password)


# Used to burn the same CPU time when a login names an unknown user,
# so response time does not reveal whether an account exists.
DUMMY_HASH = hash_password("algopulse-timing-protection")


def create_access_token(user_id: int) -> tuple[str, datetime]:
    """Return (jwt, expiry). The 'jti' claim lets us revoke the token on logout."""
    now = datetime.now(timezone.utc)
    expires_at = now + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    payload = {
        "sub": str(user_id),
        "jti": uuid.uuid4().hex,
        "exp": expires_at,
        "iat": now,
    }
    token = jwt.encode(payload, settings.SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return token, expires_at


def decode_access_token(token: str) -> dict:
    """Verify signature + expiry. Raises jwt.PyJWTError if the token is invalid."""
    return jwt.decode(
        token,
        settings.SECRET_KEY,
        algorithms=[settings.JWT_ALGORITHM],
        options={"require": ["exp", "sub", "jti"]},
    )
