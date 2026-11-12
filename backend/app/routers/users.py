"""/api/users/* endpoints: the logged-in user's own profile."""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.deps import get_current_user
from app.database import get_db
from app.models import User
from app.schemas.user import MessageResponse, PasswordChange, UserResponse, UserUpdate
from app.services import user_service

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
def read_me(current_user: User = Depends(get_current_user)):
    """Return the profile of the logged-in user."""
    return current_user


@router.patch("/me", response_model=UserResponse)
def update_me(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the logged-in user's profile (currently: full name)."""
    return user_service.update_profile(db, current_user, data)


@router.post("/me/change-password", response_model=MessageResponse)
def change_my_password(
    data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password. Requires the current password."""
    user_service.change_password(db, current_user, data)
    return MessageResponse(message="Password updated successfully.")
