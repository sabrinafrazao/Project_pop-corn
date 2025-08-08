# app/api/cinema_routes.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.schemas import cinema as schema
from app.services import cinema_service
from .user_routes import get_current_user

router = APIRouter(tags=["Cinemas and Sessions"])

# Endpoint público principal para obter sessões por filme
@router.get("/movies/{movie_id}/sessions", response_model=List[schema.CinemaRead])
def get_sessions_for_movie(movie_id: int, db: Session = Depends(get_db)):
    return cinema_service.get_cinemas_by_movie_id(db, movie_id)

# --- NOVO ENDPOINT ---
@router.get("/sessions/{session_id}", response_model=schema.SessionRead)
def get_session_details(session_id: int, db: Session = Depends(get_db)):
    """Endpoint para buscar os detalhes de uma sessão, incluindo o mapa de lugares."""
    db_session = cinema_service.get_session_details(db, session_id)
    if db_session is None:
        raise HTTPException(status_code=404, detail="Sessão não encontrada")
    return db_session
# ---------------------

# Endpoints de administração de Cinemas
@router.post("/cinemas", response_model=schema.CinemaRead, status_code=status.HTTP_201_CREATED)
def create_cinema(
    cinema: schema.CinemaCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return cinema_service.create_cinema(db, cinema)

@router.get("/cinemas", response_model=List[schema.CinemaRead])
def get_all_cinemas(db: Session = Depends(get_db)):
    return cinema_service.get_all_cinemas(db)

# Endpoints de administração de Salas
@router.post("/cinemas/{cinema_id}/rooms", response_model=schema.RoomRead, status_code=status.HTTP_201_CREATED)
def create_room_for_cinema(
    cinema_id: int, 
    room: schema.RoomCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return cinema_service.create_room(db, cinema_id, room)

# Endpoints de administração de Sessões
@router.post("/rooms/{room_id}/sessions", response_model=schema.SessionRead, status_code=status.HTTP_201_CREATED)
def create_session_for_room(
    room_id: int, 
    session: schema.SessionCreate, 
    db: Session = Depends(get_db), 
    current_user: dict = Depends(get_current_user)
):
    return cinema_service.create_session(db, room_id, session)
