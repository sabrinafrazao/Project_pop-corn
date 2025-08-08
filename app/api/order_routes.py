# app/api/order_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.schemas import order as schema
from app.services import order_service, user_service
from .user_routes import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=schema.OrderRead, status_code=status.HTTP_201_CREATED)
def create_new_order(
    order: schema.OrderCreate,
    db: Session = Depends(get_db),
    current_user_data: dict = Depends(get_current_user)
):
    """Endpoint para criar um novo pedido (protegido)."""
    # Obtém o objeto completo do usuário a partir do email no token
    user = user_service.get_user_by_email(db, email=current_user_data['email'])
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")

    return order_service.create_order(db=db, order_data=order, user_id=user.id)

@router.get("/my-history", response_model=List[schema.OrderRead])
def get_user_order_history(
    db: Session = Depends(get_db),
    current_user_data: dict = Depends(get_current_user)
):
    """Endpoint para obter o histórico de pedidos do usuário logado (protegido)."""
    user = user_service.get_user_by_email(db, email=current_user_data['email'])
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
        
    return order_service.get_orders_by_user(db=db, user_id=user.id)
