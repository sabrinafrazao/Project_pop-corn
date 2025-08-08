# app/schemas/movie.py
from pydantic import BaseModel
from typing import Optional

# Schema base com os campos comuns
class MovieBase(BaseModel):
    title: str
    image: str
    genre: str
    duration: str
    rating: float
    synopsis: str
    ageRating: str

# Schema para criar um novo filme (não precisa de ID)
class MovieCreate(MovieBase):
    pass

# Schema para atualizar um filme (todos os campos são opcionais)
class MovieUpdate(BaseModel):
    title: Optional[str] = None
    image: Optional[str] = None
    genre: Optional[str] = None
    duration: Optional[str] = None
    rating: Optional[float] = None
    synopsis: Optional[str] = None
    ageRating: Optional[str] = None

# Schema para ler/retornar um filme (inclui o ID)
class MovieRead(MovieBase):
    id: int

    class Config:
        from_attributes = True
