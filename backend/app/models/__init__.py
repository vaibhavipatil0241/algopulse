"""Import every model here so Base.metadata knows about all tables."""
from app.models.revoked_token import RevokedToken
from app.models.user import User

__all__ = ["User", "RevokedToken"]
