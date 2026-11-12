"""Business logic for registration, login and logout."""
from datetime import datetime, timezone

from fastapi import HTTPException, status
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.security import (
    DUMMY_HASH,
    create_access_token,
    hash_password,
    verify_password,
)
from app.models import RevokedToken, User
from app.schemas.user import Token, UserCreate


def register_user(db: Session, data: UserCreate) -> User:
    if db.scalar(select(User).where(User.username == data.username)):
        raise HTTPException(status.HTTP_409_CONFLICT, "That username is already taken.")
    if db.scalar(select(User).where(User.email == data.email)):
        raise HTTPException(status.HTTP_409_CONFLICT, "An account with that email already exists.")

    user = User(
        username=data.username,
        email=data.email,
        full_name=data.full_name,
        hashed_password=hash_password(data.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        # Two people registering the same name at the exact same moment.
        db.rollback()
        raise HTTPException(status.HTTP_409_CONFLICT, "Username or email is already registered.")
    db.refresh(user)
    return user


def authenticate_user(db: Session, identifier: str, password: str) -> User:
    """Look the user up by email OR username. Raises 401 on any failure."""
    identifier = identifier.strip().lower()
    user = db.scalar(select(User).where(or_(User.email == identifier, User.username == identifier)))

    if user is None:
        verify_password(password, DUMMY_HASH)  # keep timing similar to a real check
        valid = False
    else:
        valid = verify_password(password, user.hashed_password)

    if not valid:
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            "Incorrect email/username or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "This account is disabled.")
    return user


def issue_token(user: User) -> Token:
    access_token, expires_at = create_access_token(user.id)
    expires_in = int((expires_at - datetime.now(timezone.utc)).total_seconds())
    return Token(access_token=access_token, expires_in=expires_in)


def revoke_token(db: Session, payload: dict) -> None:
    """Add the token's jti to the blocklist and clean out entries that already expired."""
    expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)
    if db.get(RevokedToken, payload["jti"]) is None:
        db.add(RevokedToken(jti=payload["jti"], expires_at=expires_at))
    db.query(RevokedToken).filter(RevokedToken.expires_at < datetime.now(timezone.utc)).delete()
    db.commit()
