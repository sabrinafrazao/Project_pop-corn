# app/services/movie_service.py
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.model.movie import Movie
from app.schemas.movie import MovieCreate, MovieUpdate

def get_all_movies(db: Session):
    """Retorna todos os filmes do banco de dados."""
    return db.query(Movie).all()

def get_movie_by_id(db: Session, movie_id: int):
    """Busca um filme pelo seu ID."""
    return db.query(Movie).filter(Movie.id == movie_id).first()

def create_movie(db: Session, movie_data: MovieCreate):
    """Cria um novo filme."""
    db_movie = Movie(**movie_data.model_dump())
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

def update_movie(db: Session, movie_id: int, movie_data: MovieUpdate):
    """Atualiza um filme existente."""
    db_movie = get_movie_by_id(db, movie_id)
    if not db_movie:
        return None
    
    update_data = movie_data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_movie, key, value)
        
    db.commit()
    db.refresh(db_movie)
    return db_movie

def delete_movie(db: Session, movie_id: int):
    """Deleta um filme."""
    db_movie = get_movie_by_id(db, movie_id)
    if not db_movie:
        return None
    db.delete(db_movie)
    db.commit()
    return db_movie

def search_movies(db: Session, query: str):
    """Busca filmes pelo título ou gênero."""
    search_query = f"%{query.lower()}%"
    return db.query(Movie).filter(
        or_(
            Movie.title.ilike(search_query),
            Movie.genre.ilike(search_query)
        )
    ).all()
