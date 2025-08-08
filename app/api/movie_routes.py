# app/api/movie_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
    
from app.db.database import get_db
from app.schemas.movie import MovieCreate, MovieRead, MovieUpdate
from app.services import movie_service
# Importando a dependência de autenticação que criamos antes
from .user_routes import get_current_user 

router = APIRouter(prefix="/movies", tags=["Movies"])

@router.get("", response_model=List[MovieRead])
def read_all_movies(db: Session = Depends(get_db)):
    """Endpoint público para listar todos os filmes."""
    return movie_service.get_all_movies(db)

@router.get("/search", response_model=List[MovieRead])
def search_movies_endpoint(query: str, db: Session = Depends(get_db)):
    """Endpoint público para buscar filmes."""
    return movie_service.search_movies(db, query)

@router.get("/{movie_id}", response_model=MovieRead)
def read_movie_by_id(movie_id: int, db: Session = Depends(get_db)):
    """Endpoint público para buscar um filme pelo ID."""
    db_movie = movie_service.get_movie_by_id(db, movie_id)
    if db_movie is None:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    return db_movie

@router.post("", response_model=MovieRead, status_code=status.HTTP_201_CREATED)
def create_new_movie(
    movie: MovieCreate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para criar um novo filme (protegido)."""
    return movie_service.create_movie(db=db, movie_data=movie)

@router.put("/{movie_id}", response_model=MovieRead)
def update_existing_movie(
    movie_id: int, 
    movie: MovieUpdate, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para atualizar um filme (protegido)."""
    updated_movie = movie_service.update_movie(db, movie_id, movie)
    if updated_movie is None:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    return updated_movie

@router.delete("/{movie_id}", response_model=MovieRead)
def delete_existing_movie(
    movie_id: int, 
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user) # Rota protegida
):
    """Endpoint para deletar um filme (protegido)."""
    deleted_movie = movie_service.delete_movie(db, movie_id)
    if deleted_movie is None:
        raise HTTPException(status_code=404, detail="Filme não encontrado")
    return deleted_movie
