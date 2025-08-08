from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class BomboniereProduct(Base):
    __tablename__ = "bomboniere_products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    description = Column(String, nullable=False)
    price = Column(Float, nullable=False)
    image = Column(String, nullable=False)
