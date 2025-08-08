# app/schemas/token.py
from pydantic import BaseModel
from typing import Optional
from app.schemas.user import UserRead

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserRead

class TokenData(BaseModel):
    email: Optional[str] = None
