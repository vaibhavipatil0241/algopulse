"""Reusable FastAPI dependencies (authentication)."""
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.database import get_db
from app.models import RevokedToken, User

# tokenUrl makes the "Authorize" button in Swagger UI call our login endpoint.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def _credentials_error() -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token. Please log in again.",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_token_payload(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> dict:
    try:
        payload = decode_access_token(token)
    except jwt.PyJWTError:
        raise _credentials_error()
    if db.get(RevokedToken, payload["jti"]) is not None:
        raise _credentials_error()  # token was logged out
    return payload


def get_current_user(
    payload: dict = Depends(get_token_payload), db: Session = Depends(get_db)
) -> User:
    try:
        user_id = int(payload["sub"])
    except (KeyError, ValueError):
        raise _credentials_error()
    user = db.get(User, user_id)
    if user is None:
        raise _credentials_error()
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="This account is disabled.")
    return user
