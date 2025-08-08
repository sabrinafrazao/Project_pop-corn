from pydantic import BaseModel
from typing import Optional

class BomboniereProductBase(BaseModel):
    name: str
    description: str
    price: float
    image: str

class BomboniereProductCreate(BomboniereProductBase):
    pass

class BomboniereProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None

class BomboniereProductRead(BomboniereProductBase):
    id: int

    class Config:
        from_attributes = True
