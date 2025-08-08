from sqlalchemy.orm import Session
from app.model.bomboniere import BomboniereProduct
from app.schemas.bomboniere import BomboniereProductCreate, BomboniereProductUpdate

def get_all_products(db: Session):
    return db.query(BomboniereProduct).all()

def create_product(db: Session, product_data: BomboniereProductCreate):
    db_product = BomboniereProduct(**product_data.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def get_product_by_id(db: Session, product_id: int):
    return db.query(BomboniereProduct).filter(BomboniereProduct.id == product_id).first()

def update_product(db: Session, product_id: int, product_data: BomboniereProductUpdate):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    
    update_data = product_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)
        
    db.commit()
    db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = get_product_by_id(db, product_id)
    if not db_product:
        return None
    db.delete(db_product)
    db.commit()
    return db_product
