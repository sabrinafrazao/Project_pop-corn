# app/api/user_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas.user import UserCreate, UserRead, UserUpdate
from app.services import user_service
from app.core.auth import decode_token

router = APIRouter(prefix="/users", tags=["Users"])

# Define o esquema de segurança
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Dependência para obter o usuário atual a partir do token."""
    email = decode_token(token)
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido",
            headers={"WWW-Authenticate": "Bearer"},
        )
    # Em um app real, você buscaria o usuário no banco de dados aqui
    # para ter o objeto completo, mas por enquanto o email é suficiente.
    return {"email": email}

@router.post("", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def create_new_user(user: UserCreate, db: Session = Depends(get_db)):
    """Endpoint para criar um novo usuário (registro)."""
    db_user = user_service.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email já registrado")
    return user_service.create_user(db=db, user_data=user)

@router.get("", response_model=List[UserRead])
def read_all_users(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Endpoint para listar todos os usuários (protegido)."""
    return user_service.get_all_users(db)

@router.get("/{user_id}", response_model=UserRead)
def read_user_by_id(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Endpoint para buscar um usuário pelo ID (protegido)."""
    db_user = user_service.get_user_by_id(db, user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return db_user

@router.put("/{user_id}", response_model=UserRead)
def update_existing_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Endpoint para atualizar um usuário (protegido)."""
    updated_user = user_service.update_user(db, user_id, user)
    if updated_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return updated_user

@router.delete("/{user_id}", response_model=UserRead)
def delete_existing_user(user_id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Endpoint para deletar um usuário (protegido)."""
    deleted_user = user_service.delete_user(db, user_id)
    if deleted_user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    return deleted_user
