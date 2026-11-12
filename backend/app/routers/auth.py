"""/api/auth/* endpoints: register, login, logout."""
from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.deps import get_token_payload
from app.database import get_db
from app.schemas.user import MessageResponse, Token, UserCreate, UserResponse
from app.services import auth_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(data: UserCreate, db: Session = Depends(get_db)):
    """Create a new account."""
    return auth_service.register_user(db, data)


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """Log in with email OR username (sent in the form field `username`) and password."""
    user = auth_service.authenticate_user(db, form.username, form.password)
    return auth_service.issue_token(user)


@router.post("/logout", response_model=MessageResponse)
def logout(payload: dict = Depends(get_token_payload), db: Session = Depends(get_db)):
    """Invalidate the current token so it can no longer be used."""
    auth_service.revoke_token(db, payload)
    return MessageResponse(message="Logged out successfully.")
