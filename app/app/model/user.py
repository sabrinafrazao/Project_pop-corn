from sqlalchemy import Column, Integer, String
from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, default='USER') # USER, ADMIN, MASTER
    avatarUrl = Column(String, nullable=True)
    cinemaId = Column(Integer, nullable=True)