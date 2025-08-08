from sqlalchemy.orm import Session, joinedload
from sqlalchemy.orm.attributes import flag_modified
from app.model import cinema as model
from app.schemas import cinema as schema

def _generate_seat_map(rows: int, cols: int):
    seat_map = []
    for i in range(rows):
        row = []
        row_char = chr(ord('A') + i)
        for j in range(cols):
            seat = {"id": f"{row_char}{j + 1}", "status": "available"}
            row.append(seat)
        seat_map.append(row)
    return seat_map

def get_all_cinemas(db: Session):
    return db.query(model.Cinema).options(joinedload(model.Cinema.rooms).joinedload(model.Room.sessions)).all()

def create_cinema(db: Session, cinema_data: schema.CinemaCreate):
    db_cinema = model.Cinema(name=cinema_data.name)
    db.add(db_cinema)
    db.commit()
    db.refresh(db_cinema)
    return db_cinema

def create_room(db: Session, cinema_id: int, room_data: schema.RoomCreate):
    db_room = model.Room(**room_data.model_dump(), cinema_id=cinema_id)
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room

def create_session(db: Session, room_id: int, session_data: schema.SessionCreate):
    default_seat_map = _generate_seat_map(8, 12)
    db_session = model.Session(
        **session_data.model_dump(), 
        room_id=room_id,
        seatMap=default_seat_map
    )
    db.add(db_session)
    db.commit()
    db.refresh(db_session)
    return db_session

def get_session_details(db: Session, session_id: int):
    return db.query(model.Session).filter(model.Session.id == session_id).first()

# --- NOVA FUNÇÃO ---
def update_seat_status_for_session(db: Session, session_id: int, seat_ids: list[str]):
    """Atualiza o status dos assentos para 'occupied' em uma sessão específica."""
    db_session = get_session_details(db, session_id)
    if not db_session:
        return None

    seat_map = db_session.seatMap
    updated = False
    for row in seat_map:
        for seat in row:
            if seat['id'] in seat_ids:
                seat['status'] = 'occupied'
                updated = True
    
    if updated:
        # Avisa o SQLAlchemy que o campo JSON foi modificado
        flag_modified(db_session, "seatMap")
        db.commit()
        db.refresh(db_session)
    
    return db_session
# --------------------

def get_cinemas_by_movie_id(db: Session, movie_id: int):
    cinemas = db.query(model.Cinema).options(
        joinedload(model.Cinema.rooms).
        joinedload(model.Room.sessions)
    ).all()

    result = []
    for cinema in cinemas:
        cinema_clone = schema.CinemaRead.model_validate(cinema)
        cinema_clone.rooms = []
        
        for room in cinema.rooms:
            room_clone = schema.RoomRead.model_validate(room)
            room_clone.sessions = [s for s in room.sessions if s.movie_id == movie_id]
            
            if room_clone.sessions:
                cinema_clone.rooms.append(room_clone)

        if cinema_clone.rooms:
            result.append(cinema_clone)
            
    return result
