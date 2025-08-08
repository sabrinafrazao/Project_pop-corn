from sqlalchemy import Column, Integer, String, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

class Cinema(Base):
    __tablename__ = "cinemas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    rooms = relationship("Room", back_populates="cinema", cascade="all, delete-orphan")

class Room(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String) # '2D' ou '3D'
    sound = Column(String) # 'Dublado' ou 'Legendado'
    technology = Column(String, nullable=True)
    cinema_id = Column(Integer, ForeignKey("cinemas.id"))
    cinema = relationship("Cinema", back_populates="rooms")
    sessions = relationship("Session", back_populates="room", cascade="all, delete-orphan")

class Session(Base):
    __tablename__ = "sessions"
    id = Column(Integer, primary_key=True, index=True)
    time = Column(String, nullable=False)
    
    # Armazena o mapa de lugares como um JSON
    seatMap = Column(JSON, nullable=False)

    # Relação com a sala
    room_id = Column(Integer, ForeignKey("rooms.id"))
    room = relationship("Room", back_populates="sessions")
    # Relação com o filme
    movie_id = Column(Integer, ForeignKey("movies.id"))
    movie = relationship("Movie")
