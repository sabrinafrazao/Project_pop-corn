# app/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# Schema para criação de um novo usuário
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = 'USER'
    avatarUrl: Optional[str] = None
    cinemaId: Optional[int] = None

# Schema para ler/retornar dados de um usuário (sem a senha)
class UserRead(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    avatarUrl: Optional[str] = None
    cinemaId: Optional[int] = None

    class Config:
        from_attributes = True

# Schema para login
class UserLogin(BaseModel):
    email: EmailStr
    password: str

# NOVO: Schema para atualizar um usuário
class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    avatarUrl: Optional[str] = None
    cinemaId: Optional[int] = None
