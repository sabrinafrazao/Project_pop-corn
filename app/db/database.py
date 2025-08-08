import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase, Session

# Define the directory for the database
DB_DIRECTORY = "./app/db"
DATABASE_URL = f"sqlite:///{DB_DIRECTORY}/popcorn.db"

# --- ADICIONADO ---
# Garante que o diretório do banco de dados exista antes de criar a engine
os.makedirs(DB_DIRECTORY, exist_ok=True)
# ----------------

engine = create_engine(DATABASE_URL, echo=True, future=True, connect_args={"check_same_thread": False})

Sessionlocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

class Base(DeclarativeBase):
    pass

def get_db():
    db: Session = Sessionlocal()
    try:
        yield db
    finally:
        db.close()
