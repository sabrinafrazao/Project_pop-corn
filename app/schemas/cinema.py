from pydantic import BaseModel
from typing import List, Optional, Any, Dict

# --- ADICIONADO: Schema para um Lugar (Seat) ---
class SeatSchema(BaseModel):
    id: str
    status: str

# --- Schemas para Sessão (Session) ---
class SessionBase(BaseModel):
    time: str
    movie_id: int

class SessionCreate(SessionBase):
    pass

class SessionRead(SessionBase):
    id: int
    seatMap: List[List[SeatSchema]]

    class Config:
        from_attributes = True

# --- Schemas para Sala (Room) ---
class RoomBase(BaseModel):
    name: str
    type: str
    sound: str
    technology: Optional[str] = None

class RoomCreate(RoomBase):
    pass

class RoomRead(RoomBase):
    id: int
    sessions: List[SessionRead] = []

    class Config:
        from_attributes = True

# --- Schemas para Cinema ---
class CinemaBase(BaseModel):
    name: str

class CinemaCreate(CinemaBase):
    pass

class CinemaRead(CinemaBase):
    id: int
    rooms: List[RoomRead] = []

    class Config:
        from_attributes = True
