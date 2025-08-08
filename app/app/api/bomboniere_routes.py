from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import bomboniere as schema
from app.services import bomboniere_service
from .user_routes import get_current_user

router = APIRouter(prefix="/bomboniere", tags=["Bomboniere"])

@router.get("", response_model=List[schema.BomboniereProductRead])
def read_all_products(db: Session = Depends(get_db)):
    """Endpoint público para listar todos os produtos da bomboniere."""
    return bomboniere_service.get_all_products(db)

@router.post("", response_model=schema.BomboniereProductRead, status_code=status.HTTP_201_CREATED)
def create_new_product(
    product: schema.BomboniereProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para criar um novo produto (protegido)."""
    return bomboniere_service.create_product(db, product)

@router.put("/{product_id}", response_model=schema.BomboniereProductRead)
def update_existing_product(
    product_id: int,
    product: schema.BomboniereProductUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para atualizar um produto (protegido)."""
    updated_product = bomboniere_service.update_product(db, product_id, product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return updated_product

@router.delete("/{product_id}", response_model=schema.BomboniereProductRead)
def delete_existing_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para deletar um produto (protegido)."""
    deleted_product = bomboniere_service.delete_product(db, product_id)
    if deleted_product is None:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return deleted_product
