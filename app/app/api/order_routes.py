# app/api/order_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas import order as schema
from app.services import order_service
from .user_routes import get_current_user
from app.model.user import User

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=schema.OrderRead, status_code=status.HTTP_201_CREATED)
def create_new_order(
    order: schema.OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Endpoint para criar um novo pedido (protegido)."""
    return order_service.create_order(db=db, order_data=order, user_id=current_user.id)

@router.get("/my-history", response_model=List[schema.OrderRead])
def get_user_order_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Endpoint para obter o histórico de pedidos do usuário logado (protegido)."""
    return order_service.get_orders_by_user(db=db, user_id=current_user.id)

@router.get("/all", response_model=List[schema.OrderRead])
def get_all_order_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Endpoint para obter todos os pedidos (apenas para MASTER)."""
    if current_user.role != "MASTER":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado."
        )
    return order_service.get_all_orders(db=db)

# --- NOVO ENDPOINT ---
@router.get("/cinema/{cinema_id}", response_model=List[schema.OrderRead])
def get_cinema_order_history(
    cinema_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Endpoint para obter todos os pedidos de um cinema (para ADMIN e MASTER)."""
    # Verifica se o utilizador tem permissão
    is_master = current_user.role == "MASTER"
    is_correct_admin = current_user.role == "ADMIN" and current_user.cinemaId == cinema_id

    if not (is_master or is_correct_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Acesso negado. Você não tem permissão para ver os pedidos deste cinema."
        )
    
    return order_service.get_orders_by_cinema(db=db, cinema_id=cinema_id)
# ---------------------
