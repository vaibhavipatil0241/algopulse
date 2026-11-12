"""Pydantic schemas: validate incoming JSON and shape outgoing JSON."""
import re
from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator

USERNAME_PATTERN = re.compile(r"^[A-Za-z0-9_]{3,30}$")


def _validate_password_strength(value: str) -> str:
    if len(value) < 8:
        raise ValueError("Password must be at least 8 characters long")
    if not re.search(r"[A-Za-z]", value) or not re.search(r"\d", value):
        raise ValueError("Password must contain at least one letter and one number")
    return value


def _clean_full_name(value: str | None) -> str | None:
    if value is None:
        return None
    value = value.strip()
    return value or None  # empty string becomes None (clears the name)


class UserCreate(BaseModel):
    username: str = Field(description="3-30 characters: letters, numbers, underscore")
    email: EmailStr
    password: str = Field(max_length=128, description="Min 8 characters, with a letter and a number")
    full_name: str | None = Field(default=None, max_length=100)

    @field_validator("username")
    @classmethod
    def validate_username(cls, value: str) -> str:
        value = value.strip()
        if not USERNAME_PATTERN.match(value):
            raise ValueError("Username must be 3-30 characters: letters, numbers or underscore")
        return value.lower()

    @field_validator("email")
    @classmethod
    def lowercase_email(cls, value: str) -> str:
        return value.lower()

    @field_validator("password")
    @classmethod
    def validate_password(cls, value: str) -> str:
        return _validate_password_strength(value)

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, value: str | None) -> str | None:
        return _clean_full_name(value)


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, max_length=100)

    @field_validator("full_name")
    @classmethod
    def clean_name(cls, value: str | None) -> str | None:
        return _clean_full_name(value)


class PasswordChange(BaseModel):
    current_password: str = Field(max_length=128)
    new_password: str = Field(max_length=128)

    @field_validator("new_password")
    @classmethod
    def validate_new_password(cls, value: str) -> str:
        return _validate_password_strength(value)


class UserResponse(BaseModel):
    """What the API returns about a user. Never includes the password hash."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: EmailStr
    full_name: str | None
    created_at: datetime

    @field_validator("created_at")
    @classmethod
    def assume_utc(cls, value: datetime) -> datetime:
        # SQLite drops timezone info; we always store UTC, so put it back
        # (otherwise browsers would read the time as local time).
        return value.replace(tzinfo=timezone.utc) if value.tzinfo is None else value


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = Field(description="Seconds until the token expires")


class MessageResponse(BaseModel):
    message: str
