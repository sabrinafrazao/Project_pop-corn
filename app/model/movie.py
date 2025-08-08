# app/model/movie.py
from sqlalchemy import Column, Integer, String, Float
from app.db.database import Base

class Movie(Base):
    __tablename__ = "movies"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    image = Column(String, nullable=False)
    genre = Column(String, nullable=False)
    duration = Column(String, nullable=False)
    rating = Column(Float, nullable=False)
    synopsis = Column(String, nullable=False)
    ageRating = Column(String, nullable=False)
