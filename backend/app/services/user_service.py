"""Business logic for profile management."""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password
from app.models import User
from app.schemas.user import PasswordChange, UserUpdate


def update_profile(db: Session, user: User, data: UserUpdate) -> User:
    user.full_name = data.full_name
    db.commit()
    db.refresh(user)
    return user


def change_password(db: Session, user: User, data: PasswordChange) -> None:
    if not verify_password(data.current_password, user.hashed_password):
        # 400 (not 401) so the frontend does not treat it as an expired session.
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "Current password is incorrect.")
    if data.current_password == data.new_password:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "New password must be different from the current one.")
    user.hashed_password = hash_password(data.new_password)
    db.commit()
